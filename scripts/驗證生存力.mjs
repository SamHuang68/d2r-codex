// 僅驗證有效生命；不執行 test_engine.mjs 的其他案例。
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'd2r-survival-'));
const out = path.join(dir, 'survival.mjs');
try {
  await build({
    stdin: { contents: "export { survivalSummary } from './src/engine/survival'; export { computeCharacter } from './src/engine/character'; export { gameData } from './src/engine/data';", resolveDir: process.cwd(), loader: 'ts' },
    bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error',
  });
  const { survivalSummary, computeCharacter, gameData } = await import(pathToFileURL(out).href);
  const result = (res, life = 189, stats = {}) => ({ life, stats, blockChance: 10, resist: { fire: res, cold: res, lightning: res, poison: res } });
  let count = 0;
  const test = (name, fn) => { fn(); count++; console.log('通過：' + name); };
  for (const [res, expected] of [[-100, 94.5], [-70, 111.2], [0, 189], [75, 756], [95, 3780], [100, 3780]]) {
    test('生命 189／元素抗性 ' + res + '% → ' + expected, () => assert.equal(survivalSummary(result(res)).ehpElem, expected));
  }
  test('最弱元素含負抗性，其他元素較高不能掩蓋弱點', () => {
    const r = result(75); r.resist.cold = -70;
    const s = survivalSummary(r);
    assert.equal(s.minRes, -70); assert.equal(s.ehpElem, 111.2);
  });
  test('舊錯誤案例：生命 1000、抗性 -30% → 769.2', () => assert.equal(survivalSummary(result(-30, 1000)).ehpElem, 769.2));
  test('物理減免及正抗性既有行為保留', () => {
    const r = result(75, 1000, { damageresist: 80 }); r.resist.cold = 60;
    const s = survivalSummary(r);
    assert.equal(s.pdr, 50); assert.equal(s.pdrRaw, 80); assert.equal(s.ehpPhys, 2000);
    assert.equal(s.minRes, 60); assert.equal(s.ehpElem, 2500);
    assert.equal(survivalSummary(result(0, 189)).ehpPhys, 189);
  });
  test('零生命不產生有效生命', () => assert.equal(survivalSummary(result(-70, 0)).ehpElem, 0));
  test('實際角色引擎：魔法使 Lv90 地獄／三次任務／未配裝', () => {
    const r = computeCharacter(gameData, { className: 'Sorceress', level: 90, allocated: { str: 0, dex: 0, vit: 0, ene: 0 }, items: [], difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } });
    const s = survivalSummary(r);
    assert.equal(r.life, 189); assert.equal(s.minRes, -70); assert.equal(s.ehpElem, 111.2);
  });
  console.log('有效生命定點案例：' + count + ' 項通過');
} finally {
  if (fs.existsSync(out)) fs.unlinkSync(out);
  fs.rmdirSync(dir);
}
