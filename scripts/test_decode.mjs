import fs from 'fs';
import { decryptEndpoint } from './probe_d2r_world.mjs';

const map = JSON.parse(fs.readFileSync('scripts/d2rw_map.json', 'utf-8'));

function decodeText(str) {
  let res = '';
  for (const ch of str) {
    if (map[ch] !== undefined) {
      res += map[ch];
    } else {
      res += ch;
    }
  }
  return res;
}

function decodeItemStats(cli_attrs) {
  const lines = [];
  if (!cli_attrs) return lines;
  
  for (const [sectionKey, entries] of Object.entries(cli_attrs)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!entry.ts) continue;
      const line = entry.ts.map(part => decodeText(part.t)).join('');
      if (line.trim()) lines.push(line.trim());
    }
  }
  return lines;
}

async function test() {
  console.log('=== Testing Runeword: Faith ===');
  const rw = await decryptEndpoint('https://d2r.world/zh-TW/info/item/runewords');
  const faith = rw.root.runewords_items.find(i => i.ename === 'Faith');
  console.log('Faith:', faith.name, `(${faith.ename})`);
  console.log('Decoded Stats:');
  console.log(decodeItemStats(faith.cli_attrs).join('\n'));

  console.log('\n=== Testing Unique: Biggins Bonnet ===');
  const helms = await decryptEndpoint('https://d2r.world/zh-TW/info/item/unique/helms');
  const bonnet = helms.pagedata.sections[0].items[0];
  console.log(bonnet.name, `(${bonnet.ename})`);
  console.log('Decoded Stats:');
  console.log(decodeItemStats(bonnet.cli_attrs).join('\n'));

  console.log('\n=== Testing Unique: Harlequin Crest (軍帽 / 諧角之冠) ===');
  const shako = helms.pagedata.sections.flatMap(s => s.items).find(i => i.ename === 'Harlequin Crest');
  if (shako) {
    console.log(shako.name, `(${shako.ename})`);
    console.log('Decoded Stats:');
    console.log(decodeItemStats(shako.cli_attrs).join('\n'));
  }
}

test().catch(console.error);
