import CryptoJS from 'crypto-js';
import LZString from 'lz-string';

async function decryptEndpoint(url) {
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

async function run() {
  console.log('Fetching unique...');
  const uniqueData = await decryptEndpoint('https://d2r.world/zh-TW/info/item/unique');
  console.log('Unique root keys:', Object.keys(uniqueData.root));
  for (const k of Object.keys(uniqueData.root)) {
    const v = uniqueData.root[k];
    console.log(`Unique root[${k}]:`, typeof v, Array.isArray(v) ? `Array(${v.length})` : typeof v === 'object' && v !== null ? Object.keys(v) : v);
  }

  // Look for items inside grades or other keys
  if (uniqueData.root.grades) {
    console.log('grades sample:', uniqueData.root.grades[0]);
  }

  console.log('\nFetching sets...');
  const setsData = await decryptEndpoint('https://d2r.world/zh-TW/info/item/sets');
  console.log('Sets root keys:', Object.keys(setsData.root));
  for (const k of Object.keys(setsData.root)) {
    const v = setsData.root[k];
    console.log(`Sets root[${k}]:`, typeof v, Array.isArray(v) ? `Array(${v.length})` : typeof v === 'object' && v !== null ? Object.keys(v) : v);
  }
}

run().catch(console.error);
