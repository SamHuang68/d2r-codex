import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const out = 'C:/Users/Sam/AI-Workspace/docs/d2r-codex/英文顯示修復';
const root = process.cwd().replaceAll('\\', '/');
const bundled = path.join(out, '英文資料驗證暫存.mjs');
await build({ stdin: { contents: `export {UNIQUE_ITEMS_DATA} from '${root}/src/data/uniqueItems';export {SET_ITEMS_DATA} from '${root}/src/data/setItems';export {RUNEWORDS_DATA} from '${root}/src/data/runewords';export {getCatalog} from '${root}/src/engine/catalog';export {describeModifiers,describeRanges} from '${root}/src/engine/describe';`, resolveDir: root, loader: 'ts' }, bundle: true, platform: 'node', format: 'esm', outfile: bundled, logLevel: 'silent' });
const m = await import(pathToFileURL(bundled).href);
const baseline = JSON.parse(fs.readFileSync(path.join(out, '繁中資料基準.json'), 'utf8'));
const actual = { uniques: m.UNIQUE_ITEMS_DATA, sets: m.SET_ITEMS_DATA, runewords: m.RUNEWORDS_DATA, descriptions: m.getCatalog().map(e => ({ id: e.id, ranges: m.describeRanges(e.mods), rolls: [1, 45, 99].map(level => [0, 1].map(roll => m.describeModifiers(e.mods, roll, level))) })) };
const originalFields = JSON.parse(JSON.stringify(actual, (key, value) => ['attributesEn', 'partialBonusesEn', 'fullBonusesEn'].includes(key) ? undefined : value));
assert.deepEqual(originalFields, baseline, '原有繁中資料、識別碼與數值必須完全保留');
const failures = [];
let count = 0;
function check(id, zh, en) {
  assert.equal(en?.length, zh.length, `${id} 英文行數須完整`);
  for (const line of en) { count++; if (/[\u3400-\u9fff]/u.test(line)) failures.push({ id, line }); }
}
for (const item of [...actual.uniques, ...actual.runewords, ...actual.sets.flatMap(s => s.pieces)]) check(item.id, item.attributes, item.attributesEn);
for (const set of actual.sets) {
  check(set.id, set.fullBonuses, set.fullBonusesEn);
  check(set.id, set.partialBonuses.map(b => b.bonus), set.partialBonusesEn?.map(b => b.bonus));
}
for (const item of m.getCatalog()) {
  check(item.id, m.describeRanges(item.mods).map(l => l.text), m.describeRanges(item.mods, { lang: 'en' }).map(l => l.text));
  for (const level of [1, 45, 99]) for (const roll of [0, 1]) check(item.id, m.describeModifiers(item.mods, roll, level).map(l => l.text), m.describeModifiers(item.mods, roll, level, 'en').map(l => l.text));
}
fs.writeFileSync(path.join(out, '資料語系驗證結果.json'), JSON.stringify({ count, failures, chineseBaselineUnchanged: true }, null, 2));
assert.equal(failures.length, 0, `英文描述殘留：${JSON.stringify(failures.slice(0, 10))}`);
console.log(JSON.stringify({ 繁中基準: '完全一致', 英文描述行: count, 中文殘留: failures.length }));
