// 產生首頁分類磚的小檔 src/data/codex/portalSummary.json（各類筆數、代表物品圖示與非空技能職業／樹數）。
// 為什麼：首頁只需要這幾個數字與圖示，卻要載入整份百科資料（約 1.3 MB）才算得出來；事先算好，首頁就不必載入百科資料。
// 用法：node scripts/build_portal_summary.mjs          重新產生
//       node scripts/build_portal_summary.mjs --check  只檢查檔案是否與現在的資料一致（不一致就失敗）
// 資料（遊戲資料表、覆蓋層）更新後要重跑一次；引擎測試也會做同樣的檢查。
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'portal-')), 'tiles.mjs');
await build({
  stdin: {
    contents: "export { UNIQUE_ITEMS_DATA } from './src/data/uniqueItems'; export { SET_ITEMS_DATA } from './src/data/setItems'; export { BASE_ITEMS_DATA } from './src/data/bases'; export { RUNEWORDS_DATA } from './src/data/runewords'; export { RUNES_DATA } from './src/data/runes'; export { SKILLS_DATA } from './src/data/skills'; export { buildGearTiles, buildSkillSummary } from './src/data/codex/portalTiles';",
    resolveDir: process.cwd(), loader: 'ts',
  },
  bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error', loader: { '.json': 'json' },
  define: { 'import.meta.env.BASE_URL': '"./"' },
});
const M = await import(pathToFileURL(out).href);
const tiles = M.buildGearTiles({ uniques: M.UNIQUE_ITEMS_DATA, sets: M.SET_ITEMS_DATA, bases: M.BASE_ITEMS_DATA, runewords: M.RUNEWORDS_DATA, runes: M.RUNES_DATA });
const summary = { gearTiles: tiles, skills: M.buildSkillSummary(M.SKILLS_DATA) };
const text = `${JSON.stringify(summary, null, 2)}\n`;
const target = 'src/data/codex/portalSummary.json';
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(target) ? fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n') : '';
  if (cur !== text) { console.error(`${target} 與現在的資料不一致，請執行 npm run data:portal`); process.exit(1); }
  console.log(`${target} 與現在的資料一致`);
} else {
  fs.writeFileSync(target, text);
  console.log(`已寫入 ${target}：${tiles.map((t) => `${t.id}${t.count !== undefined ? '=' + t.count : ''}`).join('、')}`);
}
