// 裝備分類樹的資料完整性測試：暗金、套裝、底材每一筆都要落在樹裡存在的葉節點，數量要與資料筆數一致。
// 為什麼要有這支：分類樹是依遊戲物品類型算出來的，新增物品或改分類規則時，歸不到類的項目會在樹裡「悄悄消失」，
// 畫面不會報錯，只是少一筆。這裡把這種情況變成測試失敗。
// 用法：node scripts/test_item_taxonomy.mjs（失敗時離開碼為 1）
import { build } from 'esbuild';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'taxonomy-test-'));
const entry = path.join(tmp, 'entry.ts');
const src = (p) => JSON.stringify(path.join(root, p));
fs.writeFileSync(entry, `
export * as IDX from ${src('src/utils/itemIndex')};
export * as TAX from ${src('src/utils/equipTaxonomy')};
export { UNIQUE_ITEMS_DATA } from ${src('src/data/uniqueItems')};
export { SET_ITEMS_DATA } from ${src('src/data/setItems')};
export { BASE_ITEMS_DATA } from ${src('src/data/bases')};
`);
const out = path.join(tmp, 'out.mjs');
await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error' });
const m = await import(pathToFileURL(out).href);
fs.rmSync(tmp, { recursive: true, force: true });

const { IDX, TAX, UNIQUE_ITEMS_DATA, SET_ITEMS_DATA, BASE_ITEMS_DATA } = m;
let failed = 0;
const t = (name, fn) => { try { fn(); console.log(`  ✓ ${name}`); } catch (e) { failed++; console.error(`  ✗ ${name}\n    ${e.message}`); } };
const leavesOf = (defs, out = new Set()) => { for (const d of defs) { if (d.children?.length) leavesOf(d.children, out); else out.add(d.id); } return out; };

console.log('【裝備分類樹：資料完整性】');
const itemLeaves = leavesOf(IDX.ITEM_TREE_DEFS);
const baseLeaves = leavesOf(TAX.tierDefs('b'));

t('每件暗金都歸到樹裡存在的葉節點，總數等於資料筆數', () => {
  assert.equal(IDX.U_ENTRIES.length, UNIQUE_ITEMS_DATA.length);
  const bad = IDX.U_ENTRIES.filter((e) => !itemLeaves.has(e.leaf)).map((e) => `${e.item.nameEn} → ${e.leaf}`);
  assert.deepEqual(bad, [], '歸不到分類的暗金');
});
t('每套套裝都歸到樹裡存在的葉節點，總數等於資料筆數', () => {
  assert.equal(IDX.S_ENTRIES.length, SET_ITEMS_DATA.length);
  const bad = IDX.S_ENTRIES.filter((e) => !itemLeaves.has(e.leaf)).map((e) => `${e.set.nameEn} → ${e.leaf}`);
  assert.deepEqual(bad, [], '歸不到分類的套裝');
});
t('暗金與底材的品階（一般／進階／菁英）和物品自己的 grade 欄位一致（飾品除外）', () => {
  const bad = IDX.U_ENTRIES.filter((e) => !e.leaf.startsWith('u/jewelry/') && e.item.grade && e.leaf.split('/')[1] !== e.item.grade).map((e) => `${e.item.nameEn}: grade=${e.item.grade} leaf=${e.leaf}`);
  assert.deepEqual(bad, [], '品階與 grade 不一致');
});
t('每款底材都對得到遊戲資料的類型，且歸到樹裡存在的葉節點', () => {
  const bad = [];
  for (const b of BASE_ITEMS_DATA) {
    const gb = TAX.resolveGameBase({ id: b.id, nameEn: b.nameEn, name: b.name });
    const rel = TAX.leafOfBase(gb);
    const tier = TAX.tierOfBase(gb, b.grade);
    if (!gb || !rel || !baseLeaves.has(`b/${tier}/${rel}`)) bad.push(`${b.nameEn} (${b.id})`);
  }
  assert.deepEqual(bad, [], '歸不到分類的底材');
});
t('用 buildTree 算出的根節點數量不會比資料少（沒有被修剪掉的項目）', () => {
  const counts = new Map();
  for (const e of IDX.U_ENTRIES) counts.set(e.leaf, (counts.get(e.leaf) ?? 0) + 1);
  for (const e of IDX.S_ENTRIES) counts.set(e.leaf, (counts.get(e.leaf) ?? 0) + 1);
  const tree = TAX.buildTree(IDX.ITEM_TREE_DEFS, counts);
  assert.equal(tree.reduce((s, n) => s + n.count, 0), UNIQUE_ITEMS_DATA.length + SET_ITEMS_DATA.length);
});

if (failed) { console.error(`\n${failed} 項失敗`); process.exit(1); }
console.log('\n裝備分類樹測試全部通過');
