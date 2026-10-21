// 比對「舊資料（src/data/*.ts，百科頁使用）」與「遊戲資料表（src/data/game/*.json，模擬器使用）」。
// 唯讀：不修改任何資料檔。以 esbuild 打包舊資料與 src/engine（skills、describe）後在 Node 內比對（作法同 scripts/test_engine.mjs）。
// 內容：1 暗金 2 套裝 3 符文之語 4 底材 5 技能 6 符文 7 配對交叉驗證（catalogImageMap）8 遊戲資料轉繁中描述的就緒度。
// 判定原則：遊戲表為準；英文名以正規化後比對，其次中文名，再其次拼寫相近。「關鍵數值」只比 STAT_DEFS 列出的類別。
// 用法：node scripts/data-pipeline/diff_legacy_vs_game.mjs [輸出資料夾=legacy_vs_game_diff_out]
// 輸出：diff.json（逐筆明細，含舊 id → 遊戲 id 對照）、appendix.md（可讀清單）；終端機印出摘要。
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const outDir = process.argv[2] || 'legacy_vs_game_diff_out';
fs.mkdirSync(outDir, { recursive: true });

const bundle = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'd2legacy-')), 'legacy.mjs');
await build({
  stdin: {
    contents: [
      "export { SKILLS_DATA } from './src/data/skills';",
      "export { SYNERGY_RELATIONS } from './src/data/skills/synergies';",
      "export { SKILL_GRID_LAYOUT } from './src/data/skills/layout';",
      "export { UNIQUE_ITEMS_DATA } from './src/data/uniqueItems';",
      "export { SET_ITEMS_DATA } from './src/data/setItems';",
      "export { BASE_ITEMS_DATA } from './src/data/bases';",
      "export { RUNEWORDS_DATA } from './src/data/runewords';",
      "export { RUNES_DATA } from './src/data/runes';",
      "export * from './src/engine/skills';",
      "export { describeModifiers } from './src/engine/describe';",
    ].join('\n'),
    resolveDir: process.cwd(), loader: 'ts',
  },
  bundle: true, platform: 'node', format: 'esm', outfile: bundle, logLevel: 'error', loader: { '.json': 'json' },
});
const L = await import(pathToFileURL(bundle).href);
const G = (n) => JSON.parse(fs.readFileSync(`src/data/game/${n}.json`, 'utf8'));
const gUniques = G('uniques'), gSetItems = G('setItems'), gSets = G('sets'), gRunewords = G('runewords'), gBases = G('bases');

// ───────── 共用小工具 ─────────
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const zhn = (s) => String(s ?? '').replace(/[（(][^）)]*[）)]/g, '').replace(/[\s·・]/g, '');
const cnt = (a, f) => a.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {});
const lev = (a, b) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
};

/**
 * 配對兩份清單：1) 英文名正規化後相同 2) 中文名相同 3) 拼寫相近（唯一最佳且距離 ≤ max(3, 長度 25%)）。
 * 回傳 pairs[{o, n, how}]、oldOnly、newOnly。同名多筆時依序一一配對。
 */
function matchLists(oldArr, newArr, { oldEn = (x) => x.nameEn, newEn = (x) => x.nameEn, oldZh = (x) => x.name, newZh = (x) => x.name, sameGroup = () => true, prefer = () => false } = {}) {
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

// ───────── 關鍵數值：舊屬性文字 ↔ 遊戲 modifier ─────────
const RNG = '(-?\\d+(?:\\.\\d+)?)(?:-(-?\\d+(?:\\.\\d+)?))?';
const STAT_DEFS = [
  { k: 'MF', zh: '尋獲魔法物品機率', re: new RegExp(`^尋獲魔法物品機率提高 ${RNG}%`), codes: ['mag%'] },
  { k: '金幣掉落', zh: '怪物金幣掉落量', re: new RegExp(`^怪物金幣掉落量提高 ${RNG}%`), codes: ['gold%'] },
  { k: '所有技能', zh: '+N 所有技能', re: new RegExp(`^\\+${RNG} 所有技能(?:等級)?$`), codes: ['allskills'] },
  { k: '亞馬遜技能', zh: '職業技能', re: new RegExp(`^\\+${RNG} 亞馬遜技能等級$`), codes: ['ama'] },
  { k: '魔法使技能', zh: '職業技能', re: new RegExp(`^\\+${RNG} 魔法使技能等級$`), codes: ['sor'] },
  { k: '死靈法師技能', zh: '職業技能', re: new RegExp(`^\\+${RNG} 死靈法師技能等級$`), codes: ['nec'] },
  { k: '聖騎士技能', zh: '職業技能', re: new RegExp(`^\\+${RNG} 聖騎士技能等級$`), codes: ['pal'] },
  { k: '野蠻人技能', zh: '職業技能', re: new RegExp(`^\\+${RNG} 野蠻人技能等級$`), codes: ['bar'] },
  { k: '德魯伊技能', zh: '職業技能', re: new RegExp(`^\\+${RNG} 德魯伊技能等級$`), codes: ['dru'] },
  { k: '刺客技能', zh: '職業技能', re: new RegExp(`^\\+${RNG} 刺客技能等級$`), codes: ['ass'] },
  { k: '術士技能', zh: '職業技能', re: new RegExp(`^\\+${RNG} 術士技能等級$`), codes: ['war'] },
  { k: 'FCR', zh: '施法速度', re: new RegExp(`^\\+${RNG}% 施法速度`), codes: ['cast1', 'cast2', 'cast3'] },
  { k: 'IAS', zh: '攻擊速度', re: new RegExp(`^攻擊速度 \\+${RNG}%`), codes: ['swing1', 'swing2', 'swing3'] },
  { k: 'FHR', zh: '打擊恢復', re: new RegExp(`^\\+${RNG}% 打擊恢復`), codes: ['balance1', 'balance2', 'balance3'] },
  { k: 'FRW', zh: '跑步／行走速度', re: new RegExp(`^\\+${RNG}% 跑步 / 行走速度`), codes: ['move1', 'move2', 'move3'] },
  { k: '傷害強化', zh: '+N% 傷害強化', re: new RegExp(`^\\+${RNG}% 傷害強化`), codes: ['dmg%'] },
  { k: '防禦強化', zh: '+N% 防禦強化', re: new RegExp(`^\\+${RNG}% 防禦強化`), codes: ['ac%'] },
  { k: '所有抗性', zh: '所有抗性', re: new RegExp(`^所有抗性 \\+${RNG}`), codes: ['res-all'] },
  { k: '火抗', zh: '火焰抗性', re: new RegExp(`^火焰抗性 \\+${RNG}%`), codes: ['res-fire'] },
  { k: '冰抗', zh: '冰寒抗性', re: new RegExp(`^冰寒抗性 \\+${RNG}%`), codes: ['res-cold'] },
  { k: '電抗', zh: '電擊抗性', re: new RegExp(`^電擊抗性 \\+${RNG}%`), codes: ['res-ltng'] },
  { k: '毒抗', zh: '毒素抗性', re: new RegExp(`^毒素抗性 \\+${RNG}%`), codes: ['res-pois'] },
  { k: '力量', zh: '+N 力量', re: new RegExp(`^\\+${RNG} 力量$`), codes: ['str'] },
  { k: '敏捷', zh: '+N 敏捷', re: new RegExp(`^\\+${RNG} 敏捷$`), codes: ['dex'] },
  { k: '體力', zh: '+N 體能', re: new RegExp(`^\\+${RNG} 體能$`), codes: ['vit'] },
  { k: '能量', zh: '+N 能量', re: new RegExp(`^\\+${RNG} 能量$`), codes: ['enr'] },
  { k: '偷命', zh: '擊中竊取生命', re: new RegExp(`^擊中竊取 ${RNG}% 生命`), codes: ['lifesteal'] },
  { k: '偷魔', zh: '擊中竊取法力', re: new RegExp(`^擊中竊取 ${RNG}% 法力`), codes: ['manasteal'] },
  { k: '粉碎打擊', zh: '粉碎打擊', re: new RegExp(`^\\+${RNG}% 機率造成粉碎打擊`), codes: ['crush'] },
  { k: '開放傷口', zh: '開放傷口', re: new RegExp(`^\\+${RNG}% 機率造成開放傷口`), codes: ['openwounds'] },
  { k: '致命打擊', zh: '致命打擊', re: new RegExp(`^\\+${RNG}% 致命打擊`), codes: ['deadly'] },
  { k: '孔數', zh: '鑲孔', re: new RegExp(`^鑲孔[（(]${RNG}`), codes: ['sock'] },
];
const parseOld = (attrs) => {
  const out = {};
  for (const a of attrs || []) {
    if (/\s\(\d\)\s*$/.test(a)) continue; // 套裝件的「(2)(3)」是成套加成，不是本體屬性
    const all = new RegExp(`^\\+${RNG} 所有屬性$`).exec(a.trim()); // 遊戲表是 str／dex／vit／enr 四條
    if (all) for (const k of ['力量', '敏捷', '體力', '能量']) out[k] ??= [Number(all[1]), all[2] === undefined ? Number(all[1]) : Number(all[2])];
    for (const d of STAT_DEFS) { const m = d.re.exec(a.trim()); if (m && !(d.k in out)) out[d.k] = [Number(m[1]), m[2] === undefined ? Number(m[1]) : Number(m[2])]; }
  }
  return out;
};
const parseNew = (mods) => {
  const out = {};
  for (const d of STAT_DEFS) {
    const hit = (mods || []).filter((m) => d.codes.includes(m.code)); if (!hit.length) continue;
    // sock 的孔數有些放在 par（固定孔數）、有些放在 min／max（範圍）
    const lo = (m) => m.min ?? (d.codes[0] === 'sock' ? m.par : undefined) ?? 0; const hi = (m) => m.max ?? (d.codes[0] === 'sock' ? m.par : undefined) ?? 0;
    out[d.k] = [hit.reduce((s, m) => s + lo(m), 0), hit.reduce((s, m) => s + hi(m), 0)];
  }
  // all-stats（+N 所有屬性）等於 str／dex／vit／enr 各 +N
  for (const m of (mods || []).filter((x) => x.code === 'all-stats')) for (const k of ['力量', '敏捷', '體力', '能量']) out[k] = [(out[k]?.[0] ?? 0) + (m.min ?? 0), (out[k]?.[1] ?? 0) + (m.max ?? 0)];
  return out;
};
const fmt = (r) => (r[0] === r[1] ? `${r[0]}` : `${r[0]}-${r[1]}`);
function compareStats(oldAttrs, newMods) {
  const o = parseOld(oldAttrs), n = parseNew(newMods); const diffs = [];
  for (const k of new Set([...Object.keys(o), ...Object.keys(n)])) {
    if (o[k] && n[k]) { if (o[k][0] !== n[k][0] || o[k][1] !== n[k][1]) diffs.push({ stat: k, kind: 'value', old: fmt(o[k]), game: fmt(n[k]) }); }
    else if (o[k]) diffs.push({ stat: k, kind: 'oldOnly', old: fmt(o[k]), game: null });
    else diffs.push({ stat: k, kind: 'gameOnly', old: null, game: fmt(n[k]) });
  }
  return diffs;
}

const report = { generatedAt: new Date().toISOString().slice(0, 10), gameVersion: G('meta').gameVersion, counts: {} };
const md = [];
const section = (t) => md.push(`\n## ${t}\n`);
const table = (head, rows) => { if (!rows.length) { md.push('（無）\n'); return; } md.push(`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map((c) => String(c ?? '').replace(/\|/g, '／')).join(' | ')} |`), ''); };
const presence = (arr, fields) => Object.fromEntries(fields.map((f) => [f, arr.filter((x) => { const v = x[f]; return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== '' && v !== false; }).length]));

// ───────── 1. 暗金 ─────────
{
  const oldU = L.UNIQUE_ITEMS_DATA;
  // 遊戲表有同名多筆（Rainbow Facet、Azurewrath）時，優先配底材相同者
  const m = matchLists(oldU, gUniques, { prefer: (o, n) => zhn(o.baseItem) === zhn(n.baseName) });
  const how = cnt(m.pairs, (p) => p.how);
  const rows = []; // 逐筆
  const lvDiff = [], baseDiff = [], zhDiff = [], statDiff = [], templateStatDiff = [];
  for (const { o, n, how: h } of m.pairs) {
    const base = (norm(o.baseItemId) === norm(n.baseNameEn) || zhn(o.baseItem) === zhn(n.baseName)) ? null : { old: `${o.baseItem}（${o.baseItemId}）`, game: `${n.baseName}（${n.baseNameEn}）` };
    if (o.requiredLevel !== n.levelReq) lvDiff.push({ nameEn: n.nameEn, name: n.name, old: o.requiredLevel, game: n.levelReq });
    if (base) baseDiff.push({ nameEn: n.nameEn, name: n.name, ...base });
    if (zhn(o.name) !== zhn(n.name)) zhDiff.push({ nameEn: n.nameEn, old: o.name, game: n.name });
    // Crafted／PreCrafted 是 Rift 護身符的製作範本，屬性在遊戲內隨機，資料表只有範本，不拿來判定舊資料對錯
    const sd = compareStats(o.attributes, n.mods); if (sd.length) (/^(Pre)?Crafted /.test(n.nameEn) ? templateStatDiff : statDiff).push({ nameEn: n.nameEn, name: n.name, diffs: sd });
    rows.push({ oldId: o.id, gameId: n.id, how: h });
  }
  const spelling = m.pairs.filter((p) => p.how === 'spelling' || (p.how !== 'nameEn' && norm(p.o.nameEn) !== norm(p.n.nameEn))).map((p) => ({ oldEn: p.o.nameEn, gameEn: p.n.nameEn, oldZh: p.o.name, gameZh: p.n.name, how: p.how, zhSame: zhn(p.o.name) === zhn(p.n.name) }));
  const statByKind = {}; for (const s of statDiff) for (const d of s.diffs) (statByKind[d.stat] ||= { value: 0, oldOnly: 0, gameOnly: 0 })[d.kind]++;
  report.uniques = {
    oldCount: oldU.length, gameCount: gUniques.length, matched: m.pairs.length, matchedBy: how,
    gameBreakdown: { crafted: gUniques.filter((x) => x.crafted).length, notSpawnable: gUniques.filter((x) => !x.spawnable).length, craftedAndNotSpawnable: gUniques.filter((x) => x.crafted && !x.spawnable).length, rarityCoefficientNot1: gUniques.filter((x) => x.rarity !== 1).length },
    oldOnly: m.oldOnly.map((o) => ({ id: o.id, nameEn: o.nameEn, name: o.name, base: o.baseItemId, requiredLevel: o.requiredLevel })),
    gameOnly: m.newOnly.map((n) => ({ id: n.id, nameEn: n.nameEn, name: n.name, base: n.baseNameEn, levelReq: n.levelReq, crafted: !!n.crafted, spawnable: n.spawnable })),
    spelling, zhNameDiffCount: zhDiff.length, zhNameDiff: zhDiff, levelDiff: lvDiff, baseDiff, statDiffItemCount: statDiff.length, statDiffByStat: statByKind, statDiff, templateStatDiffItemCount: templateStatDiff.length, templateStatDiff,
    idMap: Object.fromEntries(rows.map((r) => [r.oldId, r.gameId])),
    legacyOnlyFields: presence(oldU, ['flavorText', 'tags', 'imageUrl', 'ladderOnly', 'isNewDLC', 'nameClassic']),
    oldDuplicateGameNames: Object.entries(cnt(gUniques, (x) => x.nameEn)).filter(([, v]) => v > 1),
  };
  section('1. 暗金');
  md.push(`舊 ${oldU.length} 件、遊戲表 ${gUniques.length} 件；配對 ${m.pairs.length}（${JSON.stringify(how)}）。`);
  md.push('\n### 1.1 只在舊資料\n'); table(['id', 'nameEn', '中文', '底材', '需求等級'], m.oldOnly.map((o) => [o.id, o.nameEn, o.name, o.baseItemId, o.requiredLevel]));
  md.push('\n### 1.2 只在遊戲表\n'); table(['id', 'nameEn', '中文', '底材', '需求等級', '備註'], m.newOnly.map((n) => [n.id, n.nameEn, n.name, n.baseNameEn, n.levelReq, [n.crafted && 'Crafted 範本', !n.spawnable && '不會自然掉落'].filter(Boolean).join('、')]));
  md.push('\n### 1.3 英文拼寫不同但判定為同一件\n'); table(['舊 nameEn', '遊戲 nameEn', '舊中文', '遊戲中文', '中文是否相同'], spelling.map((s) => [s.oldEn, s.gameEn, s.oldZh, s.gameZh, s.zhSame ? '相同' : '不同']));
  md.push(`\n### 1.4 需求等級不一致（${lvDiff.length}）\n`); table(['nameEn', '中文', '舊', '遊戲'], lvDiff.map((d) => [d.nameEn, d.name, d.old, d.game]));
  md.push(`\n### 1.5 底材不一致（${baseDiff.length}）\n`); table(['nameEn', '中文', '舊底材', '遊戲底材'], baseDiff.map((d) => [d.nameEn, d.name, d.old, d.game]));
  md.push(`\n### 1.6 關鍵數值不一致：${statDiff.length} 件有差異\n`); table(['數值', '值不同', '舊有遊戲無', '遊戲有舊無'], Object.entries(statByKind).sort((a, b) => (b[1].value + b[1].oldOnly + b[1].gameOnly) - (a[1].value + a[1].oldOnly + a[1].gameOnly)).map(([k, v]) => [k, v.value, v.oldOnly, v.gameOnly]));
  md.push('\n逐件明細（前 60 件；完整見 diff.json）：\n'); table(['nameEn', '中文', '差異'], statDiff.slice(0, 60).map((s) => [s.nameEn, s.name, s.diffs.map((d) => `${d.stat}:${d.kind === 'value' ? `舊${d.old}→遊戲${d.game}` : d.kind === 'oldOnly' ? `僅舊(${d.old})` : `僅遊戲(${d.game})`}`).join('；')]));
  md.push(`\n### 1.7 中文名稱不同（${zhDiff.length}，以遊戲繁中字串為準）\n`); table(['nameEn', '舊中文', '遊戲中文'], zhDiff.slice(0, 80).map((d) => [d.nameEn, d.old, d.game]));
}

// ───────── 2. 套裝 ─────────
{
  const oldSets = L.SET_ITEMS_DATA;
  const ms = matchLists(oldSets, gSets);
  const oldPieces = oldSets.flatMap((s) => s.pieces.map((p) => ({ ...p, _set: s.nameEn })));
  const mp = matchLists(oldPieces, gSetItems, { sameGroup: () => true });
  const lvDiff = [], zhDiff = [], baseDiff = [], statDiff = [];
  for (const { o, n } of mp.pairs) {
    if (o.requiredLevel !== n.levelReq) lvDiff.push({ nameEn: n.nameEn, name: n.name, old: o.requiredLevel, game: n.levelReq });
    if (zhn(o.name) !== zhn(n.name)) zhDiff.push({ nameEn: n.nameEn, old: o.name, game: n.name });
    if (norm(o.baseItemId) !== norm(n.baseNameEn) && zhn(o.baseItem) !== zhn(n.baseName)) baseDiff.push({ nameEn: n.nameEn, old: `${o.baseItem}（${o.baseItemId}）`, game: `${n.baseName}（${n.baseNameEn}）` });
    const sd = compareStats(o.attributes, n.mods); if (sd.length) statDiff.push({ nameEn: n.nameEn, name: n.name, diffs: sd });
  }
  const setBonus = ms.pairs.map(({ o, n }) => ({ nameEn: n.nameEn, name: n.name, oldPartial: o.partialBonuses.length, gamePartial: n.partial.length, oldFull: o.fullBonuses.length, gameFull: n.full.length, oldPieces: o.pieces.length, gamePieces: gSetItems.filter((x) => x.set === n.id).length }));
  // 舊資料的「完整加成」列表已把部分加成累計進去，所以預期 舊完整＝遊戲完整＋遊戲部分
  const bonusDiff = setBonus.filter((b) => b.oldPartial !== b.gamePartial || b.oldFull !== b.gameFull + b.gamePartial || b.oldPieces !== b.gamePieces);
  const spelling = [...ms.pairs.map((p) => ({ kind: '套裝', p })), ...mp.pairs.map((p) => ({ kind: '單件', p }))].filter(({ p }) => norm(p.o.nameEn) !== norm(p.n.nameEn)).map(({ kind, p }) => ({ kind, oldEn: p.o.nameEn, gameEn: p.n.nameEn, oldZh: p.o.name, gameZh: p.n.name, zhSame: zhn(p.o.name) === zhn(p.n.name) }));
  const statByKind = {}; for (const s of statDiff) for (const d of s.diffs) (statByKind[d.stat] ||= { value: 0, oldOnly: 0, gameOnly: 0 })[d.kind]++;
  report.sets = {
    oldSetCount: oldSets.length, gameSetCount: gSets.length, oldPieceCount: oldPieces.length, gamePieceCount: gSetItems.length,
    setOldOnly: ms.oldOnly.map((s) => ({ id: s.id, nameEn: s.nameEn, name: s.name })), setGameOnly: ms.newOnly.map((s) => ({ id: s.id, nameEn: s.nameEn, name: s.name })),
    pieceOldOnly: mp.oldOnly.map((p) => ({ id: p.id, nameEn: p.nameEn, name: p.name, set: p._set })), pieceGameOnly: mp.newOnly.map((p) => ({ id: p.id, nameEn: p.nameEn, name: p.name, set: p.setNameEn })),
    spelling, zhNameDiffCount: zhDiff.length, zhNameDiff: zhDiff, levelDiff: lvDiff, baseDiff, statDiffItemCount: statDiff.length, statDiffByStat: statByKind, statDiff, bonusStructureDiff: bonusDiff,
    idMap: { sets: Object.fromEntries(ms.pairs.map((p) => [p.o.id, p.n.id])), pieces: Object.fromEntries(mp.pairs.map((p) => [p.o.id, p.n.id])) },
    legacyOnlyFields: presence(oldPieces, ['tags', 'imageUrl', 'nameClassic']),
  };
  section('2. 套裝');
  md.push(`舊 ${oldSets.length} 套／${oldPieces.length} 件，遊戲表 ${gSets.length} 套／${gSetItems.length} 件；配對 ${ms.pairs.length} 套、${mp.pairs.length} 件。`);
  md.push('\n### 2.1 只在舊資料／只在遊戲表（整套）\n'); table(['來源', 'nameEn', '中文'], [...ms.oldOnly.map((s) => ['舊', s.nameEn, s.name]), ...ms.newOnly.map((s) => ['遊戲', s.nameEn, s.name])]);
  md.push('\n### 2.2 只在舊資料／只在遊戲表（單件）\n'); table(['來源', 'nameEn', '中文', '所屬套裝'], [...mp.oldOnly.map((p) => ['舊', p.nameEn, p.name, p._set]), ...mp.newOnly.map((p) => ['遊戲', p.nameEn, p.name, p.setNameEn])]);
  md.push('\n### 2.3 英文拼寫不同但判定為同一件\n'); table(['類別', '舊 nameEn', '遊戲 nameEn', '舊中文', '遊戲中文', '中文是否相同'], spelling.map((s) => [s.kind, s.oldEn, s.gameEn, s.oldZh, s.gameZh, s.zhSame ? '相同' : '不同']));
  md.push(`\n### 2.4 單件需求等級不一致（${lvDiff.length}）\n`); table(['nameEn', '中文', '舊', '遊戲'], lvDiff.map((d) => [d.nameEn, d.name, d.old, d.game]));
  md.push(`\n### 2.5 單件底材不一致（${baseDiff.length}）\n`); table(['nameEn', '舊底材', '遊戲底材'], baseDiff.map((d) => [d.nameEn, d.old, d.game]));
  md.push(`\n### 2.6 單件關鍵數值不一致：${statDiff.length} 件\n`); table(['數值', '值不同', '舊有遊戲無', '遊戲有舊無'], Object.entries(statByKind).map(([k, v]) => [k, v.value, v.oldOnly, v.gameOnly]));
  md.push('\n逐件明細（前 40 件）：\n'); table(['nameEn', '中文', '差異'], statDiff.slice(0, 40).map((s) => [s.nameEn, s.name, s.diffs.map((d) => `${d.stat}:${d.kind === 'value' ? `舊${d.old}→遊戲${d.game}` : d.kind === 'oldOnly' ? `僅舊(${d.old})` : `僅遊戲(${d.game})`}`).join('；')]));
  md.push(`\n### 2.7 成套加成／件數結構不一致（${bonusDiff.length}）\n`); table(['套裝', '舊件數', '遊戲件數', '舊部分加成', '遊戲部分加成', '舊完整加成', '遊戲完整加成'], bonusDiff.map((b) => [b.nameEn, b.oldPieces, b.gamePieces, b.oldPartial, b.gamePartial, b.oldFull, b.gameFull]));
  md.push(`\n### 2.8 中文名稱不同（${zhDiff.length}）\n`); table(['nameEn', '舊中文', '遊戲中文'], zhDiff.slice(0, 60).map((d) => [d.nameEn, d.old, d.game]));
}

// ───────── 3. 符文之語 ─────────
{
  const oldR = L.RUNEWORDS_DATA;
  const runeLv = Object.fromEntries(gBases.filter((b) => b.type === 'rune').map((b) => [b.code, b.levelReq]));
  const m = matchLists(oldR, gRunewords);
  const runeSeq = (n) => n.runeNamesEn.map((x) => x.replace(/ Rune$/, ''));
  const seqDiff = [], sockDiff = [], lvDiff = [], zhDiff = [];
  for (const { o, n } of m.pairs) {
    if (o.runes.join(',') !== runeSeq(n).join(',')) seqDiff.push({ nameEn: n.nameEn, name: n.name, old: o.runes.join('+'), game: runeSeq(n).join('+') });
    if (o.sockets !== n.sockets) sockDiff.push({ nameEn: n.nameEn, old: o.sockets, game: n.sockets });
    const gl = Math.max(...n.runes.map((r) => runeLv[r] ?? 0));
    if (o.requiredLevel !== gl) lvDiff.push({ nameEn: n.nameEn, name: n.name, old: o.requiredLevel, gameMaxRune: gl });
    if (zhn(o.name) !== zhn(n.name)) zhDiff.push({ nameEn: n.nameEn, old: o.name, game: n.name });
  }
  const spelling = m.pairs.filter((p) => norm(p.o.nameEn) !== norm(p.n.nameEn)).map((p) => ({ oldEn: p.o.nameEn, gameEn: p.n.nameEn, oldZh: p.o.name, gameZh: p.n.name, zhSame: zhn(p.o.name) === zhn(p.n.name) }));
  // 舊資料的屬性是否已含符文本身的加成：以 Ancients' Pledge 為例檢查是否出現遊戲 mods 沒有的抗性
  const sample = m.pairs.find((p) => norm(p.n.nameEn) === 'ancientspledge');
  report.runewords = {
    oldCount: oldR.length, gameCount: gRunewords.length, matched: m.pairs.length, matchedBy: cnt(m.pairs, (p) => p.how),
    oldOnly: m.oldOnly.map((r) => ({ id: r.id, nameEn: r.nameEn, name: r.name, runes: r.runes.join('+') })), gameOnly: m.newOnly.map((r) => ({ id: r.id, nameEn: r.nameEn, name: r.name, runes: runeSeq(r).join('+'), patch: r.patch })),
    spelling, zhNameDiffCount: zhDiff.length, zhNameDiff: zhDiff, runeSequenceDiff: seqDiff, socketDiff: sockDiff, levelDiffVsMaxRune: lvDiff,
    attributesIncludeRuneBonus: sample ? { nameEn: sample.n.nameEn, oldAttributes: sample.o.attributes, gameOwnMods: sample.n.mods } : null,
    idMap: Object.fromEntries(m.pairs.map((p) => [p.o.id, p.n.id])),
    legacyOnlyFields: presence(oldR, ['tags', 'recommendedBases', 'description', 'imageUrl', 'ladderOnly', 'isNewDLC', 'nameClassic']),
    gamePatchField: cnt(gRunewords, (r) => r.patch ?? '(無)'),
  };
  section('3. 符文之語');
  md.push(`舊 ${oldR.length}、遊戲表 ${gRunewords.length}；配對 ${m.pairs.length}（${JSON.stringify(cnt(m.pairs, (p) => p.how))}）。`);
  md.push('\n### 3.1 只在舊資料／只在遊戲表\n'); table(['來源', 'nameEn', '中文', '符文', '備註'], [...m.oldOnly.map((r) => ['舊', r.nameEn, r.name, r.runes.join('+'), '']), ...m.newOnly.map((r) => ['遊戲', r.nameEn, r.name, runeSeq(r).join('+'), `patch=${r.patch}`])]);
  md.push('\n### 3.2 英文拼寫不同\n'); table(['舊 nameEn', '遊戲 nameEn', '舊中文', '遊戲中文', '中文是否相同'], spelling.map((s) => [s.oldEn, s.gameEn, s.oldZh, s.gameZh, s.zhSame ? '相同' : '不同']));
  md.push(`\n### 3.3 符文序列不一致（${seqDiff.length}）\n`); table(['nameEn', '中文', '舊', '遊戲'], seqDiff.map((d) => [d.nameEn, d.name, d.old, d.game]));
  md.push(`\n### 3.4 孔數不一致（${sockDiff.length}）\n`); table(['nameEn', '舊', '遊戲'], sockDiff.map((d) => [d.nameEn, d.old, d.game]));
  md.push(`\n### 3.5 需求等級與「符文最高需求等級」不一致（${lvDiff.length}）\n`); table(['nameEn', '中文', '舊', '符文最高需求'], lvDiff.map((d) => [d.nameEn, d.name, d.old, d.gameMaxRune]));
  if (sample) { md.push('\n### 3.6 屬性呈現口徑\n'); md.push(`以「${sample.n.nameEn}」為例：舊資料屬性＝${JSON.stringify(sample.o.attributes)}；遊戲表 modifier（不含符文本身的鑲嵌加成）＝${JSON.stringify(sample.n.mods)}。\n`); }
  md.push(`\n### 3.7 中文名稱不同（${zhDiff.length}）\n`); table(['nameEn', '舊中文', '遊戲中文'], zhDiff.map((d) => [d.nameEn, d.old, d.game]));
}

// ───────── 4. 底材 ─────────
{
  const oldB = L.BASE_ITEMS_DATA; const gEq = gBases.filter((b) => b.kind !== 'misc');
  // Demon Head／Demonhead 這類「去掉空白後同名」的兩件，要靠中文名配對，否則會互換
  const m = matchLists(oldB, gEq, { oldEn: (x) => x.nameEn, newEn: (x) => x.nameEn, prefer: (o, n) => zhn(o.name) === zhn(n.name) });
  const rng = (s) => { const r = /(\d+)\s*-\s*(\d+)/.exec(s || ''); return r ? [Number(r[1]), Number(r[2])] : s && /^\d+$/.test(String(s).trim()) ? [Number(s), Number(s)] : null; };
  const eq = (a, b) => (!a && !b) || (a && b && a[0] === b[0] && a[1] === b[1]);
  const d = { level: [], levelOldDefault1: [], str: [], dex: [], sockets: [], defense: [], dmg1h: [], dmg2h: [], zh: [], tier: [] };
  for (const { o, n } of m.pairs) {
    const tag = { nameEn: n.nameEn, name: n.name };
    // 舊資料把「無等級需求」填成 1，遊戲表是 0；兩者在遊戲內都不顯示需求等級，另外計數、不當作錯誤
    if (o.requiredLevel !== n.levelReq) (o.requiredLevel === 1 && n.levelReq === 0 ? d.levelOldDefault1 : d.level).push({ ...tag, old: o.requiredLevel, game: n.levelReq });
    if ((o.reqStr ?? 0) !== (n.reqStr ?? 0)) d.str.push({ ...tag, old: o.reqStr, game: n.reqStr ?? 0 });
    if ((o.reqDex ?? 0) !== (n.reqDex ?? 0)) d.dex.push({ ...tag, old: o.reqDex, game: n.reqDex ?? 0 });
    if (o.maxSockets !== (n.sockets ?? 0)) d.sockets.push({ ...tag, old: o.maxSockets, game: n.sockets ?? 0 });
    if (n.kind === 'armor') { const og = rng(o.baseDefense), gg = [n.minAc, n.maxAc]; if (!eq(og, gg)) d.defense.push({ ...tag, old: o.baseDefense, game: `${n.minAc} - ${n.maxAc}` }); }
    if (n.kind === 'weapon') {
      // 只有雙手傷害的武器（長柄、長矛、法杖等），舊資料把雙手傷害放在 damage1h／baseDamage；遊戲表在 minDam2h
      const twoOnly = n.minDam === undefined && n.minDam2h !== undefined;
      const og = rng(twoOnly ? (o.damage2h ?? o.damage1h ?? o.baseDamage) : (o.damage1h ?? o.baseDamage)); const gg = twoOnly ? [n.minDam2h, n.maxDam2h] : n.minDam !== undefined ? [n.minDam, n.maxDam] : null;
      if (!eq(og, gg)) d.dmg1h.push({ ...tag, old: o.damage1h ?? o.baseDamage, game: gg ? `${gg[0]} - ${gg[1]}` : null });
      if (!twoOnly) { const o2 = rng(o.damage2h); const g2 = n.minDam2h !== undefined ? [n.minDam2h, n.maxDam2h] : null; if (!eq(o2, g2)) d.dmg2h.push({ ...tag, old: o.damage2h, game: g2 ? `${g2[0]} - ${g2[1]}` : null }); }
    }
    if (zhn(o.name) !== zhn(n.name)) d.zh.push({ nameEn: n.nameEn, old: o.name, game: n.name });
    const tierMap = { 普通: 'normal', 進階: 'exceptional', 精華: 'elite', 菁英: 'elite' };
    if (o.grade && n.tier && o.grade !== n.tier) d.tier.push({ ...tag, old: o.grade, game: n.tier });
  }
  const spelling = m.pairs.filter((p) => norm(p.o.nameEn) !== norm(p.n.nameEn)).map((p) => ({ oldEn: p.o.nameEn, gameEn: p.n.nameEn, oldZh: p.o.name, gameZh: p.n.name, zhSame: zhn(p.o.name) === zhn(p.n.name) }));
  report.bases = {
    oldCount: oldB.length, oldByCategory: cnt(oldB, (x) => x.category), gameCount: gBases.length, gameByKind: cnt(gBases, (x) => x.kind), gameArmorWeapon: gEq.length, gameNotSpawnable: gEq.filter((x) => !x.spawnable).length,
    matched: m.pairs.length, matchedBy: cnt(m.pairs, (p) => p.how),
    oldOnly: m.oldOnly.map((b) => ({ id: b.id, nameEn: b.nameEn, name: b.name, category: b.category })), gameOnly: m.newOnly.map((b) => ({ code: b.code, nameEn: b.nameEn, name: b.name, kind: b.kind, type: b.type, tier: b.tier, spawnable: b.spawnable })),
    spelling, zhNameDiffCount: d.zh.length, zhNameDiff: d.zh, diffs: Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v])),
    idMap: Object.fromEntries(m.pairs.map((p) => [p.o.id, p.n.code])),
    legacyOnlyFields: presence(oldB, ['recommendedRunewords', 'tacticalNotes', 'dropRecommendation', 'isSuperiorValued', 'isEthPreferred', 'larzukSockets', 'speedGrade', 'imageUrl']),
    legacyOnlyCurated: oldB.filter((b) => (b.recommendedRunewords && b.recommendedRunewords.length) || b.tacticalNotes || b.dropRecommendation || b.isSuperiorValued || b.isEthPreferred).map((b) => ({ id: b.id, nameEn: b.nameEn, name: b.name, recommendedRunewords: b.recommendedRunewords, tacticalNotes: b.tacticalNotes, dropRecommendation: b.dropRecommendation, isSuperiorValued: b.isSuperiorValued, isEthPreferred: b.isEthPreferred })),
  };
  section('4. 底材（防具＋武器）');
  md.push(`舊 ${oldB.length}（${JSON.stringify(cnt(oldB, (x) => x.category))}）；遊戲表防具＋武器 ${gEq.length}（另有雜項 ${gBases.length - gEq.length}：藥水、符文、寶石、護身符、任務物品等）；配對 ${m.pairs.length}。`);
  md.push('\n### 4.1 只在舊資料／只在遊戲表\n'); table(['來源', 'nameEn', '中文', '類別／類型', '備註'], [...m.oldOnly.map((b) => ['舊', b.nameEn, b.name, b.category, '']), ...m.newOnly.map((b) => ['遊戲', b.nameEn, b.name, `${b.kind}/${b.type}`, [b.tier, !b.spawnable && '不會自然掉落'].filter(Boolean).join('、')])]);
  md.push('\n### 4.2 英文拼寫不同\n'); table(['舊 nameEn', '遊戲 nameEn', '舊中文', '遊戲中文', '中文是否相同'], spelling.map((s) => [s.oldEn, s.gameEn, s.oldZh, s.gameZh, s.zhSame ? '相同' : '不同']));
  const lab = { level: '需求等級（不含「舊=1、遊戲=0」）', str: '需求力量', dex: '需求敏捷', sockets: '最大孔數', defense: '防禦', dmg1h: '單手傷害', dmg2h: '雙手傷害', tier: '品階' };
  for (const k of Object.keys(lab)) { md.push(`\n### 4.x ${lab[k]}不一致（${d[k].length}）\n`); table(['nameEn', '中文', '舊', '遊戲'], d[k].slice(0, 40).map((x) => [x.nameEn, x.name, x.old, x.game])); }
  md.push(`\n### 4.y 中文名稱不同（${d.zh.length}）\n`); table(['nameEn', '舊中文', '遊戲中文'], d.zh.slice(0, 60).map((x) => [x.nameEn, x.old, x.game]));
}

// ───────── 5. 技能（技能寶典頁） ─────────
{
  const { SKILLS_DATA, SYNERGY_RELATIONS, SKILL_GRID_LAYOUT, GAME_SKILLS, CLASS_CODE_ZH, synergySources, pageName } = L;
  const classCode = Object.fromEntries(Object.entries(CLASS_CODE_ZH).map(([k, v]) => [v, k]));
  const flat = SKILLS_DATA.flatMap((c) => c.trees.map((t, ti) => t.skills.map((s) => ({ ...s, _class: c.characterClass, _cc: classCode[c.characterClass], _treeIdx: ti }))).flat());
  const byNorm = new Map(GAME_SKILLS.map((s) => [`${s.charClass}:${norm(s.nameEn)}`, s]));
  // skills.txt 的內部英文名與公開英文名不同的技能（舊資料用公開名）。屬人工對照，已逐項靠需求等級、樹與格位交叉核對，列入報告待覆核
  const SKILL_ALIASES = {
    Decoy: 'Dopplezon', 'Sword Mastery': 'Blade Mastery', Fissure: 'Eruption', 'Poison Creeper': 'Plague Poppy', 'Carrion Vine': 'Cycle of Life',
    'Solar Creeper': 'Vines', 'Summon Dire Wolf': 'Summon Fenris', 'Burst of Speed': 'Quickness', 'Fire Blast': 'Fire Trauma', 'Shock Web': 'Shock Field',
    'Wake of Fire': 'Wake of Fire Sentry', 'Wake of Inferno': 'Inferno Sentry',
  };
  const pairs = []; const oldOnly = [];
  for (const s of flat) {
    let g = byNorm.get(`${s._cc}:${norm(s.nameEn)}`); let how = 'nameEn';
    if (!g) { g = GAME_SKILLS.find((x) => x.charClass === s._cc && zhn(x.name) === zhn(s.name)); how = 'zh'; }
    if (!g && SKILL_ALIASES[s.nameEn]) { g = byNorm.get(`${s._cc}:${norm(SKILL_ALIASES[s.nameEn])}`); how = 'alias'; }
    if (g) pairs.push({ o: s, n: g, how }); else oldOnly.push(s);
  }
  const usedGame = new Set(pairs.map((p) => p.n.id)); const gameOnly = GAME_SKILLS.filter((s) => !usedGame.has(s.id));
  const oldToGame = new Map(pairs.map((p) => [p.o.id, p.n]));
  const gameById = new Map(GAME_SKILLS.map((s) => [s.id, s]));
  const closure = (id, getPre, seen = new Set()) => { for (const p of getPre(id)) if (!seen.has(p)) { seen.add(p); closure(p, getPre, seen); } return seen; };
  // 兩邊的前置都轉成遊戲 id 後比較；舊資料的前置是「全部祖先」，遊戲表只有直接前置，所以另算遊戲的祖先閉包
  const oldPreMap = new Map(pairs.map((p) => [p.n.id, (p.o.prerequisites || []).map((x) => oldToGame.get(x)?.id ?? `?${x}`)]));
  const oldPre = (gid) => oldPreMap.get(gid) || [];
  // 遊戲表的 prereq 存的是英文名，轉成 id 才能和舊資料比
  const nameToId = new Map(GAME_SKILLS.map((s) => [`${s.charClass}:${s.nameEn}`, s.id]));
  const newPre = (gid) => { const s = gameById.get(gid); return (s?.prereq || []).map((x) => nameToId.get(`${s.charClass}:${x}`) ?? `?${x}`); };
  const lvDiff = [], zhDiff = [], posDiff = [], preDirect = [], preClosure = [], treeDiff = [];
  for (const { o, n, how } of pairs) {
    const tag = { class: o._class, nameEn: n.nameEn, oldNameEn: o.nameEn };
    if (o.requiredLevel !== n.reqLevel) lvDiff.push({ ...tag, name: n.name, old: o.requiredLevel, game: n.reqLevel });
    if (zhn(o.name) !== zhn(n.name)) zhDiff.push({ ...tag, old: o.name, game: n.name });
    const L0 = SKILL_GRID_LAYOUT[o.id]; if (L0 && (L0.row !== n.row - 1 || L0.col !== n.col - 1)) posDiff.push({ ...tag, name: n.name, old: `列${L0.row + 1}欄${L0.col + 1}`, game: `列${n.row}欄${n.col}` });
    if (!L0) posDiff.push({ ...tag, name: n.name, old: '（舊表無座標）', game: `列${n.row}欄${n.col}` });
    const op = [...closure(n.id, oldPre)].sort().join(','), np = [...closure(n.id, newPre)].sort().join(',');
    const od = [...oldPre(n.id)].sort().join(','), nd = [...newPre(n.id)].sort().join(',');
    if (od !== nd) preDirect.push({ ...tag, name: n.name, old: od, game: nd });
    if (op !== np) preClosure.push({ ...tag, name: n.name, old: op, game: np });
  }
  // 換樹：每個舊樹內，遊戲頁碼不是該樹多數頁碼的技能（舊樹名與遊戲樹名措辭不同，不直接比字串）
  const treePages = {}; for (const { o, n } of pairs) { const k = `${o._class}/${o.tree}`; ((treePages[k] ||= {})[n.page] ||= []).push({ ...{ class: o._class, nameEn: n.nameEn, name: n.name }, oldTree: o.tree, gamePage: n.page, gameTree: pageName(n.charClass, n.page) }); }
  for (const byPage of Object.values(treePages)) { const major = Object.entries(byPage).sort((a, b) => b[1].length - a[1].length)[0][0]; for (const [pg, arr] of Object.entries(byPage)) if (pg !== major) treeDiff.push(...arr); }
  // 協同
  const gameRel = new Map();
  for (const t of GAME_SKILLS) { const { sources } = synergySources(t, {}); for (const x of sources) gameRel.set(`${x.skill.id}>${t.id}`, x.perPoint); }
  const syn = { agree: 0, pctDiff: [], oldOnly: [], oldUnmatched: [], gameOnly: [] }; const seenRel = new Set();
  for (const r of SYNERGY_RELATIONS) {
    const a = oldToGame.get(r.sourceId), b = oldToGame.get(r.targetId);
    if (!a || !b) { syn.oldUnmatched.push({ source: r.sourceName, target: r.targetName, pct: r.percentPerPoint, type: r.bonusType }); continue; }
    const k = `${a.id}>${b.id}`; seenRel.add(k);
    if (!gameRel.has(k)) {
      // 遊戲表有沒有在「其他計算式」（光環／被動／傷害）引用來源技能？有的話是引擎目前沒輸出的非傷害類協同，沒有的話舊資料很可能是錯的
      const calc = JSON.stringify({ e: b.elem, p: b.phys, a: b.auraStats, s: b.passiveStats, par: b.params });
      syn.oldOnly.push({ source: r.sourceName, target: r.targetName, pct: r.percentPerPoint, type: r.bonusType, text: r.displayText, sourceEn: a.nameEn, targetEn: b.nameEn, gameCalcReferencesSource: calc.includes(`skill('${a.nameEn}'`) });
    }
    else if (Math.abs(gameRel.get(k) - r.percentPerPoint) < 0.01) syn.agree++;
    else syn.pctDiff.push({ source: r.sourceName, target: r.targetName, old: r.percentPerPoint, game: gameRel.get(k), type: r.bonusType });
  }
  for (const [k, v] of gameRel) if (!seenRel.has(k)) { const [a, b] = k.split('>').map((id) => gameById.get(id)); syn.gameOnly.push({ source: `${a.name}（${a.nameEn}）`, target: `${b.name}（${b.nameEn}）`, pct: v }); }
  const oldPerClass = SKILLS_DATA.map((c) => ({ class: c.characterClass, trees: c.trees.map((t) => ({ name: t.name, count: t.skills.length })) }));
  const gameTrees = Object.keys(CLASS_CODE_ZH).map((cc) => ({ class: CLASS_CODE_ZH[cc], trees: [3, 2, 1].map((p) => ({ name: pageName(cc, p), count: GAME_SKILLS.filter((s) => s.charClass === cc && s.page === p).length })) }));
  const warlockFab = oldOnly.filter((s) => s._cc === 'war');
  report.skills = {
    oldCount: flat.length, gameCount: GAME_SKILLS.length, matched: pairs.length, matchedBy: cnt(pairs, (p) => p.how),
    oldOnly: oldOnly.map((s) => ({ class: s._class, tree: s.tree, id: s.id, nameEn: s.nameEn, name: s.name })), gameOnly: gameOnly.map((s) => ({ class: CLASS_CODE_ZH[s.charClass], id: s.id, nameEn: s.nameEn, name: s.name, page: s.page })),
    warlockOldNotInGame: warlockFab.length, warlockOldTotal: flat.filter((s) => s._cc === 'war').length,
    oldPerClass, gameTrees, zhNameDiffCount: zhDiff.length, zhNameDiff: zhDiff, levelDiff: lvDiff, positionDiffCount: posDiff.length, positionDiff: posDiff,
    prereqDirectDiffCount: preDirect.length, prereqClosureDiffCount: preClosure.length, prereqClosureDiff: preClosure, treeNameDiff: treeDiff,
    synergy: { oldRelations: SYNERGY_RELATIONS.length, gameRelations: gameRel.size, agree: syn.agree, pctDiff: syn.pctDiff, oldOnly: syn.oldOnly, oldUnmatched: syn.oldUnmatched, gameOnlyCount: syn.gameOnly.length, gameOnly: syn.gameOnly },
    idMap: Object.fromEntries(pairs.map((p) => [p.o.id, p.n.id])),
    legacyOnlyFields: presence(flat, ['description', 'details', 'synergies', 'iconName', 'maxPoints']),
    gameDescCoverage: GAME_SKILLS.filter((s) => s.desc).length,
  };
  section('5. 技能（技能寶典頁的資料）');
  md.push(`舊 ${flat.length}（${oldPerClass.map((c) => `${c.class}${c.trees.map((t) => t.count).join('/')}`).join('、')}），遊戲表 ${GAME_SKILLS.length}（每職業 3 樹×10）；配對 ${pairs.length}（${JSON.stringify(cnt(pairs, (p) => p.how))}）。`);
  md.push(`\n### 5.1 只在舊資料（${oldOnly.length}）\n`); table(['職業', '樹', 'id', 'nameEn', '中文'], oldOnly.map((s) => [s._class, s.tree, s.id, s.nameEn, s.name]));
  md.push(`\n### 5.2 只在遊戲表（${gameOnly.length}）\n`); table(['職業', '頁', 'id', 'nameEn', '中文'], gameOnly.map((s) => [CLASS_CODE_ZH[s.charClass], s.page, s.id, s.nameEn, s.name]));
  md.push(`\n### 5.3 需求等級不一致（${lvDiff.length}）\n`); table(['職業', 'nameEn', '舊', '遊戲'], lvDiff.map((d) => [d.class, d.nameEn, d.old, d.game]));
  md.push(`\n### 5.4 格位座標不一致：${posDiff.length}／${pairs.length}\n`); table(['職業', 'nameEn', '中文', '舊', '遊戲'], posDiff.slice(0, 100).map((d) => [d.class, d.nameEn, d.name, d.old, d.game]));
  md.push(`\n### 5.5 前置技能（以「全部祖先」比較）不一致：${preClosure.length}\n`); table(['職業', 'nameEn', '舊', '遊戲'], preClosure.slice(0, 60).map((d) => [d.class, d.nameEn, d.old, d.game]));
  md.push(`\n### 5.6 協同\n舊 ${SYNERGY_RELATIONS.length} 條、遊戲表（由計算式展開，僅傷害類）${gameRel.size} 條；相同 ${syn.agree}、百分比不同 ${syn.pctDiff.length}、僅舊 ${syn.oldOnly.length}、舊表技能對不到遊戲 ${syn.oldUnmatched.length}、僅遊戲 ${syn.gameOnly.length}。\n`);
  md.push('百分比不同：\n'); table(['來源', '目標', '舊％/點', '遊戲％/點', '類型'], syn.pctDiff.map((d) => [d.source, d.target, d.old, d.game, d.type]));
  md.push('僅舊資料（遊戲表展開式沒有；可能為非傷害類協同或舊資料錯誤，需另查）：\n'); table(['來源', '目標', '％/點', '類型', '遊戲計算式有引用來源技能'], syn.oldOnly.map((d) => [d.source, d.target, d.pct, d.type, d.gameCalcReferencesSource ? '有（引擎未輸出）' : '無']));
  md.push(`\n### 5.7 中文名稱不同（${zhDiff.length}，以遊戲繁中字串為準）\n`); table(['職業', 'nameEn', '舊中文', '遊戲中文'], zhDiff.map((d) => [d.class, d.nameEn, d.old, d.game]));
  md.push(`\n### 5.8 舊樹名 vs 遊戲樹名\n`); table(['職業', '舊樹（頁面順序）', '遊戲樹（由左到右）'], oldPerClass.map((c, i) => [c.class, c.trees.map((t) => `${t.name}(${t.count})`).join('／'), (gameTrees.find((g) => g.class === c.class)?.trees || []).map((t) => `${t.name}(${t.count})`).join('／')]));
}

// ───────── 符文（RuneCompendium 使用 src/data/runes.ts，遊戲表在 bases.json 的 type=rune） ─────────
{
  const gRunes = gBases.filter((b) => b.type === 'rune');
  const lvDiff = [], zhDiff = [], missing = [];
  for (const r of L.RUNES_DATA) {
    const g = gRunes.find((b) => b.code === `r${String(r.number).padStart(2, '0')}`);
    if (!g) { missing.push(r.nameEn); continue; }
    if (g.levelReq !== r.requiredLevel) lvDiff.push({ number: r.number, nameEn: r.nameEn, old: r.requiredLevel, game: g.levelReq });
    const gz = g.name.replace(/^符文：/, ''); if (zhn(gz) !== zhn(r.name)) zhDiff.push({ number: r.number, nameEn: r.nameEn, old: r.name, game: gz });
  }
  report.runes = { oldCount: L.RUNES_DATA.length, gameCount: gRunes.length, missingInGame: missing, levelDiff: lvDiff, zhNameDiff: zhDiff, legacyOnlyFields: presence(L.RUNES_DATA, ['weaponEffect', 'armorHelmEffect', 'shieldEffect', 'cubeRecipe']) };
  section('6. 符文（RuneCompendium）');
  md.push(`舊 ${L.RUNES_DATA.length}、遊戲表 ${gRunes.length}（bases.json type=rune）；需求等級不一致 ${lvDiff.length}；中文名不同 ${zhDiff.length}。鑲嵌效果文字（武器／防具／盾牌）與合成配方為舊資料手寫欄位；遊戲表的效果在 gems.json（結構化 modifier）。\n`);
  table(['#', 'nameEn', '舊中文', '遊戲中文'], zhDiff.map((d) => [d.number, d.nameEn, d.old, d.game]));
}

// ───────── 配對交叉驗證：用專案既有的 catalogImageMap.json（當初以舊資料 imageUrl 對應到遊戲目錄）檢查本腳本的新舊配對 ─────────
{
  const map = JSON.parse(fs.readFileSync('src/data/catalogImageMap.json', 'utf8'));
  const strip = (u) => (u || '').replace('https://static.d2r.world/img/items/', '');
  const check = (pairs, prefix) => { let agree = 0, none = 0; const disagree = []; for (const { o, n } of pairs) { const v = map.byId[`${prefix}:${n.id}`]; if (v === undefined) { none++; continue; } if (strip(o.imageUrl) === v) agree++; else disagree.push({ oldId: o.id, gameId: n.id, oldImage: strip(o.imageUrl), mapImage: v }); } return { agree, noMapEntry: none, disagree }; };
  const uPairs = matchLists(L.UNIQUE_ITEMS_DATA, gUniques, { prefer: (o, n) => zhn(o.baseItem) === zhn(n.baseName) }).pairs;
  const sPairs = matchLists(L.SET_ITEMS_DATA.flatMap((s) => s.pieces), gSetItems).pairs;
  report.pairingCrossCheck = { source: 'src/data/catalogImageMap.json', uniques: check(uPairs, 'unique'), setPieces: check(sPairs, 'set') };
  section('7. 配對交叉驗證');
  md.push(`以專案既有的 catalogImageMap.json（先前以舊資料 imageUrl 對應到遊戲目錄 id）檢查本腳本的配對：暗金 一致 ${report.pairingCrossCheck.uniques.agree}、不一致 ${report.pairingCrossCheck.uniques.disagree.length}、對照表無此項 ${report.pairingCrossCheck.uniques.noMapEntry}；套裝件 一致 ${report.pairingCrossCheck.setPieces.agree}、不一致 ${report.pairingCrossCheck.setPieces.disagree.length}、無此項 ${report.pairingCrossCheck.setPieces.noMapEntry}。
`);
}

// ───────── 6. 遊戲資料 → 繁中描述的就緒度（百科頁改用遊戲資料前，顯示文字不能比舊資料差） ─────────
{
  const rows = [['暗金', gUniques], ['套裝件', gSetItems], ['符文之語', gRunewords]];
  const out = {}; section('8. 遊戲資料轉繁中描述的就緒度（engine/describe.ts）');
  md.push('以 `describeModifiers(mods)` 產生每件物品的屬性行；統計無法描述（known=false，顯示成「代碼 數值」）與疑似錯誤的行（例如「+3 69」＝技能 id 未轉成名稱、「非數值屬性」）。這是百科頁切換前必須先補齊的缺口。\n');
  const detail = [];
  for (const [label, arr] of rows) {
    const byCode = {}; let lines = 0, unknown = 0, suspicious = 0; const itemsWith = new Set();
    for (const it of arr) {
      for (const m of it.mods) {
        const ls = L.describeModifiers([m], 1, 90);
        for (const l of ls) {
          lines++;
          const bad = !l.known ? 'unknown' : /^\+?-?\d+ \d+$/.test(l.text) ? 'skillIdNotResolved' : /非數值屬性/.test(l.text) ? 'nonNumeric' : null;
          if (!l.known) unknown++; if (bad) { suspicious++; itemsWith.add(it.id); (byCode[`${m.code}:${bad}`] ||= []).push(it.nameEn); }
        }
      }
    }
    out[label] = { items: arr.length, lines, unknownLines: unknown, suspiciousLines: suspicious, itemsWithSuspicious: itemsWith.size, byCode: Object.fromEntries(Object.entries(byCode).map(([k, v]) => [k, { count: v.length, examples: [...new Set(v)].slice(0, 4) }])) };
    for (const [k, v] of Object.entries(byCode)) detail.push([label, k, v.length, [...new Set(v)].slice(0, 3).join('、')]);
  }
  // descfunc 5（value×100/128）：只有 item_howl 使用，describe.ts 直接顯示原始值
  const howl = [['暗金', gUniques], ['套裝件', gSetItems], ['符文之語', gRunewords]].flatMap(([l, a]) => a.filter((x) => x.mods.some((m) => m.code === 'howl')).map((x) => ({ kind: l, nameEn: x.nameEn, raw: x.mods.find((m) => m.code === 'howl').min, shown: L.describeModifiers(x.mods.filter((m) => m.code === 'howl'), 1, 90)[0]?.text, expectedPercent: Math.floor((x.mods.find((m) => m.code === 'howl').min * 100) / 128) })));
  report.describeReadiness = { ...out, howlDescfunc5: howl };
  table(['類別', '項目數', '屬性行', '無法描述行', '疑似錯誤行', '有疑似錯誤的物品數'], Object.entries(out).map(([k, v]) => [k, v.items, v.lines, v.unknownLines, v.suspiciousLines, v.itemsWithSuspicious]));
  md.push('依屬性代碼：\n'); table(['類別', '代碼:問題', '次數', '例'], detail);
  md.push('descfunc 5（怪物逃跑％＝原始值×100/128）：\n'); table(['類別', 'nameEn', '遊戲表原始值', 'describe 顯示', '遊戲內應顯示'], howl.map((h) => [h.kind, h.nameEn, h.raw, h.shown, `${h.expectedPercent}%`]));
}

report.generatedMdSections = md.length;
fs.writeFileSync(path.join(outDir, 'diff.json'), JSON.stringify(report, null, 1));
fs.writeFileSync(path.join(outDir, 'appendix.md'), `# 舊資料 vs 遊戲資料表 — 差異附錄（腳本產生）\n\n產生日期：${report.generatedAt}；遊戲版本 ${report.gameVersion}。腳本：scripts/data-pipeline/diff_legacy_vs_game.mjs（唯讀）。\n${md.join('\n')}\n`);
const r = report;
console.log(`暗金   舊 ${r.uniques.oldCount} / 遊戲 ${r.uniques.gameCount}，配對 ${r.uniques.matched}，僅舊 ${r.uniques.oldOnly.length}，僅遊戲 ${r.uniques.gameOnly.length}，拼寫差異 ${r.uniques.spelling.length}，需求等級不符 ${r.uniques.levelDiff.length}，底材不符 ${r.uniques.baseDiff.length}，關鍵數值有差 ${r.uniques.statDiffItemCount} 件`);
console.log(`套裝   舊 ${r.sets.oldSetCount} 套/${r.sets.oldPieceCount} 件 / 遊戲 ${r.sets.gameSetCount} 套/${r.sets.gamePieceCount} 件，單件僅舊 ${r.sets.pieceOldOnly.length}、僅遊戲 ${r.sets.pieceGameOnly.length}，需求等級不符 ${r.sets.levelDiff.length}，關鍵數值有差 ${r.sets.statDiffItemCount} 件`);
console.log(`符語   舊 ${r.runewords.oldCount} / 遊戲 ${r.runewords.gameCount}，配對 ${r.runewords.matched}，僅舊 ${r.runewords.oldOnly.length}，僅遊戲 ${r.runewords.gameOnly.length}，符文序列不符 ${r.runewords.runeSequenceDiff.length}，孔數不符 ${r.runewords.socketDiff.length}，等級≠符文最高需求 ${r.runewords.levelDiffVsMaxRune.length}`);
console.log(`底材   舊 ${r.bases.oldCount} / 遊戲防具武器 ${r.bases.gameArmorWeapon}，配對 ${r.bases.matched}，僅舊 ${r.bases.oldOnly.length}，僅遊戲 ${r.bases.gameOnly.length}`);
console.log(`技能   舊 ${r.skills.oldCount} / 遊戲 ${r.skills.gameCount}，配對 ${r.skills.matched}，僅舊 ${r.skills.oldOnly.length}（術士 ${r.skills.warlockOldNotInGame}），僅遊戲 ${r.skills.gameOnly.length}，中文名不同 ${r.skills.zhNameDiffCount}，座標不同 ${r.skills.positionDiffCount}，前置（祖先）不同 ${r.skills.prereqClosureDiffCount}，需求等級不同 ${r.skills.levelDiff.length}`);
console.log(`配對交叉驗證（catalogImageMap） 暗金一致 ${r.pairingCrossCheck.uniques.agree}/不一致 ${r.pairingCrossCheck.uniques.disagree.length}，套裝件一致 ${r.pairingCrossCheck.setPieces.agree}/不一致 ${r.pairingCrossCheck.setPieces.disagree.length}`);
console.log(`描述就緒度  暗金疑似錯誤行 ${r.describeReadiness['暗金'].suspiciousLines}/${r.describeReadiness['暗金'].lines}（${r.describeReadiness['暗金'].itemsWithSuspicious} 件），套裝件 ${r.describeReadiness['套裝件'].suspiciousLines}/${r.describeReadiness['套裝件'].lines}，符文之語 ${r.describeReadiness['符文之語'].suspiciousLines}/${r.describeReadiness['符文之語'].lines}；howl 顯示偏差 ${r.describeReadiness.howlDescfunc5.length} 件`);
console.log(`輸出：${path.resolve(outDir)}`);
