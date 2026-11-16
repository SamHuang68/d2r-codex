import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import assert from 'node:assert/strict';
const out = 'C:/Users/Sam/AI-Workspace/docs/d2r-codex/英文顯示修復';
const root = process.cwd().replaceAll('\\', '/');
const file = `${out}/搜尋驗證暫存.mjs`;
await build({ stdin: { contents: `export {searchOmni} from '${root}/src/utils/search'; export {searchCodex} from '${root}/src/utils/searchCodex';`, resolveDir: root, loader: 'ts' }, bundle: true, platform: 'node', format: 'esm', outfile: file, logLevel: 'silent' });
const m = await import(pathToFileURL(file).href);
const queries = ['Harlequin', 'Enigma', 'Tal Rasha', 'Spirit', 'El', 'Zod', 'Perfect', 'Cube', 'Caster', 'Pit', 'Crypt', 'Terror', 'Desert', 'Rogue', 'Iron Wolf', 'Jewel', 'Diablo', 'Lightning', 'Fire Ball', 'Monarch', 'Archon', 'Phase Blade', 'Den of Evil', 'Anya', 'Cow', 'Amazon', 'Warlock', 'Key', 'Essence', 'Potion', 'Cold Rupture', '45', 'exp 99', 'Baal', 'Fallen', 'Shimmering', 'Experience Shrine'];
const failures = [];
const types = new Set();
let count = 0;
for (const query of queries) {
  const zh = [...m.searchOmni(query), ...await m.searchCodex(query)];
  const en = [...m.searchOmni(query, true), ...await m.searchCodex(query, true)];
  assert.deepEqual(en.map(r => [r.id, r.targetTab]), zh.map(r => [r.id, r.targetTab]), `${query} 搜尋目標與排序保留`);
  for (const row of en) {
    count++; types.add(row.type);
    for (const field of ['titleEn', 'category', 'badge', 'preview']) if (/[\u3400-\u9fff]/u.test(row[field])) failures.push({ query, id: row.id, field, text: row[field] });
  }
}
fs.writeFileSync(`${out}/搜尋語系結果.json`, JSON.stringify({ count, types: [...types], failures }, null, 2));
assert.equal(failures.length, 0, `搜尋英文殘留：${JSON.stringify(failures.slice(0, 8))}`);
console.log(JSON.stringify({ 搜尋結果: count, 類型: [...types], 中文殘留: 0 }));
