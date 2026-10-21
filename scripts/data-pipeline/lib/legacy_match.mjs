// 舊資料（百科頁 src/data/*.ts）與遊戲資料表（src/data/game/*.json）的配對工具。
// 供 diff_legacy_vs_game.mjs（差異報告）與 build_codex_overlay.mjs（產生覆蓋層與舊 id 對照）共用，確保兩者用同一套配對規則。
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
export const zhn = (s) => String(s ?? '').replace(/[（(][^）)]*[）)]/g, '').replace(/[\s·・]/g, '');
export const cnt = (a, f) => a.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {});
export const slug = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const lev = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
};

/**
 * 配對兩份清單：1) 英文名正規化後相同 2) 中文名相同 3) 拼寫相近（唯一最佳且距離 ≤ max(3, 長度 25%)）。
 * 回傳 pairs[{o, n, how}]、oldOnly、newOnly。同名多筆時依序一一配對，prefer 可指定優先配哪一筆。
 */
export function matchLists(oldArr, newArr, { oldEn = (x) => x.nameEn, newEn = (x) => x.nameEn, oldZh = (x) => x.name, newZh = (x) => x.name, sameGroup = () => true, prefer = () => false } = {}) {
  const pairs = []; const usedN = new Set(); const usedO = new Set();
  const pass = (keyO, keyN, how) => {
    const idx = new Map();
    newArr.forEach((n, i) => { if (usedN.has(i)) return; const k = keyN(n); if (!k) return; (idx.get(k) || idx.set(k, []).get(k)).push(i); });
    oldArr.forEach((o, i) => {
      if (usedO.has(i)) return; const k = keyO(o); const c = idx.get(k); if (!c) return;
      const ok = c.filter((x) => !usedN.has(x) && sameGroup(o, newArr[x])); const j = ok.find((x) => prefer(o, newArr[x])) ?? ok[0]; if (j === undefined) return;
      usedO.add(i); usedN.add(j); pairs.push({ o, n: newArr[j], how });
    });
  };
  pass((o) => norm(oldEn(o)), (n) => norm(newEn(n)), 'nameEn');
  pass((o) => zhn(oldZh(o)), (n) => zhn(newZh(n)), 'zh');
  const restO = oldArr.map((o, i) => i).filter((i) => !usedO.has(i)); const restN = newArr.map((n, i) => i).filter((i) => !usedN.has(i));
  const best = (fromArr, toArr, fromIdx, toIdx, fe, te) => fromIdx.map((i) => {
    const a = norm(fe(fromArr[i])); let bd = 99, bj = -1, tie = false;
    for (const j of toIdx) { if (!sameGroup(...(fromArr === oldArr ? [fromArr[i], toArr[j]] : [toArr[j], fromArr[i]]))) continue; const d = lev(a, norm(te(toArr[j]))); if (d < bd) { bd = d; bj = j; tie = false; } else if (d === bd) tie = true; }
    return { i, j: bj, d: bd, tie, lim: Math.max(3, Math.floor(a.length * 0.25)) };
  });
  const fwd = best(oldArr, newArr, restO, restN, oldEn, newEn); const bwd = best(newArr, oldArr, restN, restO, newEn, oldEn);
  for (const f of fwd) {
    if (f.j < 0 || f.tie || f.d > f.lim) continue; const b = bwd.find((x) => x.i === f.j);
    if (!b || b.j !== f.i || b.tie) continue;
    usedO.add(f.i); usedN.add(f.j); pairs.push({ o: oldArr[f.i], n: newArr[f.j], how: 'spelling' });
  }
  return { pairs, oldOnly: oldArr.filter((_, i) => !usedO.has(i)), newOnly: newArr.filter((_, i) => !usedN.has(i)) };
}

/**
 * skills.txt 的內部英文名與公開英文名不同的技能（舊資料用公開名）。屬人工對照，
 * 已逐項靠需求等級與所屬樹交叉核對一致。
 */
export const SKILL_ALIASES = {
  Decoy: 'Dopplezon', 'Sword Mastery': 'Blade Mastery', Fissure: 'Eruption', 'Poison Creeper': 'Plague Poppy', 'Carrion Vine': 'Cycle of Life',
  'Solar Creeper': 'Vines', 'Summon Dire Wolf': 'Summon Fenris', 'Burst of Speed': 'Quickness', 'Fire Blast': 'Fire Trauma', 'Shock Web': 'Shock Field',
  'Wake of Fire': 'Wake of Fire Sentry', 'Wake of Inferno': 'Inferno Sentry',
};

/** 讀遊戲資料表（相對於目前工作目錄的 src/data/game） */
export const loadGame = (name) => JSON.parse(fs.readFileSync(`src/data/game/${name}.json`, 'utf8'));

/**
 * 用 esbuild 打包「舊資料」與引擎後載入。legacyRoot 是含 src/data/*.ts 的資料夾（舊資料已從主樹移除時，
 * 以 `git archive <commit> src/data src/types | tar -x -C <dir>` 取出）；引擎一律取目前工作目錄的 src/engine。
 */
export async function loadLegacy(legacyRoot = process.cwd(), extraEntries = []) {
  const root = legacyRoot.split(path.sep).join('/');
  const bundle = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'd2legacy-')), 'legacy.mjs');
  await build({
    stdin: {
      contents: [
        `export { SKILLS_DATA } from '${root}/src/data/skills';`,
        `export { SYNERGY_RELATIONS } from '${root}/src/data/skills/synergies';`,
        `export { SKILL_GRID_LAYOUT } from '${root}/src/data/skills/layout';`,
        `export { UNIQUE_ITEMS_DATA } from '${root}/src/data/uniqueItems';`,
        `export { SET_ITEMS_DATA } from '${root}/src/data/setItems';`,
        `export { BASE_ITEMS_DATA } from '${root}/src/data/bases';`,
        `export { RUNEWORDS_DATA } from '${root}/src/data/runewords';`,
        `export { RUNES_DATA } from '${root}/src/data/runes';`,
        "export * from './src/engine/skills';",
        "export { describeModifiers, describeRanges } from './src/engine/describe';",
        ...extraEntries,
      ].join('\n'),
      resolveDir: process.cwd(), loader: 'ts',
    },
    bundle: true, platform: 'node', format: 'esm', outfile: bundle, logLevel: 'error', loader: { '.json': 'json' },
  });
  return import(pathToFileURL(bundle).href);
}

/** 打包並載入「目前工作目錄」的百科資料模組（遊戲資料表即時產生的版本），供與舊資料做逐行對照 */
export async function loadCodex() {
  const bundle = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'd2codex-')), 'codex.mjs');
  await build({
    stdin: {
      contents: [
        "export { UNIQUE_ITEMS_DATA } from './src/data/uniqueItems';",
        "export { SET_ITEMS_DATA } from './src/data/setItems';",
        "export { BASE_ITEMS_DATA } from './src/data/bases';",
        "export { RUNEWORDS_DATA } from './src/data/runewords';",
        "export { RUNES_DATA } from './src/data/runes';",
        "export { SKILLS_DATA } from './src/data/skills';",
        "export { SYNERGY_RELATIONS } from './src/data/skills/synergies';",
        "export { modLines } from './src/data/codex/itemLines';",
      ].join('\n'),
      resolveDir: process.cwd(), loader: 'ts',
    },
    bundle: true, platform: 'node', format: 'esm', outfile: bundle, logLevel: 'error', loader: { '.json': 'json' },
  });
  return import(pathToFileURL(bundle).href);
}

/** 屬性行的正規化：去空白、括號、加號與「依角色等級而定」；新舊文字只差這些時視為相同 */
export const normLine = (s) => String(s).replace(/\s+/g, '').replace(/[()（）\[\]【】]/g, '').replace(/\+/g, '').replace(/依角色等級而定/g, '');
