import CryptoJS from 'crypto-js';
import LZString from 'lz-string';
import fs from 'fs';

export async function decryptEndpoint(url) {
  const res = await fetch(url);
  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) throw new Error('No __NEXT_DATA__ found in ' + url);
  const data = JSON.parse(match[1]);
  const webdata = data.props.pageProps.webdata;

  const keyStr = "d2rw1231";
  const key = CryptoJS.enc.Utf8.parse(keyStr);
  const decrypted = CryptoJS.AES.decrypt(webdata, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);

  const decompressed = LZString.decompressFromUTF16(decrypted);
  return JSON.parse(decompressed);
}

async function probe() {
  console.log('=== Probing Unique Items ===');
  const uniqueData = await decryptEndpoint('https://d2r.world/zh-TW/info/item/unique');
  console.log('Unique grades keys:', uniqueData.root.grades.map(g => ({ id: g.id, name: g.name, keys: Object.keys(g) })));
  for (const grade of uniqueData.root.grades) {
    console.log(`Grade: ${grade.name} (${grade.id})`);
    for (const k of Object.keys(grade)) {
      if (Array.isArray(grade[k])) {
        console.log(`  - ${k}: Array of length ${grade[k].length}`);
        if (grade[k].length > 0) {
          console.log(`    First item keys in ${k}:`, Object.keys(grade[k][0]));
          console.log(`    First item sample:`, JSON.stringify(grade[k][0], null, 2).slice(0, 300));
        }
      }
    }
  }

  console.log('\n=== Probing Sets ===');
  const setsData = await decryptEndpoint('https://d2r.world/zh-TW/info/item/sets');
  console.log('Sets grades:', setsData.root.grades.map(g => ({ id: g.id, name: g.name, keys: Object.keys(g) })));
  if (setsData.root.grades && setsData.root.grades[0]) {
    const g0 = setsData.root.grades[0];
    for (const k of Object.keys(g0)) {
      if (Array.isArray(g0[k])) {
        console.log(`  - sets grade[0].${k}: Array of length ${g0[k].length}`);
        if (g0[k].length > 0) {
          console.log(`    Sample:`, JSON.stringify(g0[k][0], null, 2).slice(0, 300));
        }
      }
    }
  }

  console.log('\n=== Probing Base Items ===');
  const baseData = await decryptEndpoint('https://d2r.world/zh-TW/info/item/base');
  console.log('Base root keys:', Object.keys(baseData.root));
  for (const k of Object.keys(baseData.root)) {
    const v = baseData.root[k];
    console.log(`Base root[${k}]:`, typeof v, Array.isArray(v) ? `Array(${v.length})` : typeof v === 'object' && v !== null ? Object.keys(v) : v);
  }
}

probe().catch(console.error);
