// 稽核 src/data/game/*.json：筆數、屬性可解析率、zhTW 名稱覆蓋率，並可選擇與 d2data JSON 逐筆交叉比對。
// 用法：node scripts/data-pipeline/audit_game_data.mjs [game資料夾=src/data/game] [d2data/json 資料夾]
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2] || 'src/data/game';
const d2dir = process.argv[3];
const load = (n) => JSON.parse(fs.readFileSync(path.join(dir, n), 'utf8'));
const uniques = load('uniques.json'), setItems = load('setItems.json'), sets = load('sets.json'), runewords = load('runewords.json');
const bases = load('bases.json'), props = load('properties.json');

let failures = 0;
const fail = (m) => { failures++; console.log('✗', m); };
const ok = (m) => console.log('✓', m);

// 1. 屬性可解析：除已知的「資料表本身未定義」之外，必須全部能對映到 properties.txt
const KNOWN_UNDEFINED = new Set(['skilltab-war', 'roguesbow-affix1', 'magdam-rand', 'Gethit-skill']);
const unresolved = new Map();
const scan = (label, it, list) => list.forEach((m) => { if (!props[m.code]) { const k = m.code; (unresolved.get(k) || unresolved.set(k, []).get(k)).push(`${label}:${it.nameEn}`); } });
uniques.forEach((u) => scan('unique', u, u.mods));
setItems.forEach((u) => { scan('setitem', u, u.mods); scan('setitem', u, u.setBonusByCount); });
sets.forEach((s) => { scan('set', s, s.partial); scan('set', s, s.full); });
runewords.forEach((r) => scan('runeword', r, r.mods));
const real = [...unresolved.entries()].filter(([code, who]) => !KNOWN_UNDEFINED.has(code) && !who.every((w) => /Crafted /.test(w)));
if (real.length) fail(`未定義屬性 ${real.length} 種：${real.map(([c, w]) => `${c}(${w[0]})`).join(', ')}`);
else ok(`所有屬性皆可對映（${unresolved.size} 種已知例外：資料表未定義或 Crafted 範本）`);
console.log('  已知例外明細：', [...unresolved.entries()].map(([c, w]) => `${c}→${w[0]}`).slice(0, 8).join('; '));

// 2. zhTW 名稱覆蓋
const noZh = (arr, f = 'name') => arr.filter((x) => !x[f] && !(x.kind === 'misc' && /Potion$/.test(x.nameEn || '')));  // 通用藥水變體無繁中字串，屬非配裝物品
for (const [label, arr] of [['uniques', uniques], ['setItems', setItems], ['sets', sets], ['runewords', runewords], ['bases', bases]]) {
  const m = noZh(arr);
  if (m.length) fail(`${label} 缺繁中名稱 ${m.length} 筆：${m.slice(0, 5).map((x) => x.nameEn || x.code).join(', ')}`); else ok(`${label} 繁中名稱 ${arr.length}/${arr.length}`);
}

// 3. 結構檢查
const dupe = (arr, f) => { const s = new Set(); return arr.filter((x) => (s.has(x[f]) ? true : (s.add(x[f]), false))); };
for (const [label, arr] of [['uniques', uniques], ['setItems', setItems], ['runewords', runewords], ['bases(code)', bases]]) {
  const key = label === 'bases(code)' ? 'code' : 'id';
  const d = dupe(arr, key); if (d.length) fail(`${label} 重複 ${key}：${d.slice(0, 3).map((x) => x[key])}`); else ok(`${label} ${key} 皆唯一`);
}
const noBase = [...uniques, ...setItems].filter((x) => !bases.find((b) => b.code === x.code));
noBase.length ? fail(`找不到底材 ${noBase.length}：${noBase.slice(0, 3).map((x) => x.nameEn)}`) : ok('暗金／套裝皆能對到底材');
// func 11（觸發技能：min=機率、max=等級）與 19（充能）的 min/max 語意不同，不檢查大小
const rangeless = (code) => props[code]?.parts.some((p) => p.func === 11 || p.func === 19);
const badRange = [...uniques, ...setItems, ...runewords].flatMap((x) => x.mods.filter((m) => !rangeless(m.code) && typeof m.min === 'number' && typeof m.max === 'number' && m.min > m.max));
badRange.length ? fail(`min>max ${badRange.length}`) : ok('所有 modifier min ≤ max');

// 4. 與 d2data 交叉比對（同版號的獨立來源）
if (d2dir) {
  const dj = (n) => JSON.parse(fs.readFileSync(path.join(d2dir, n), 'utf8').replace(/^﻿/, ''));
  const eq = (a, b) => String(a ?? '') === String(b ?? '');
  const cmpMods = (mine, row, n, pre = 'prop', par = 'par', mn = 'min', mx = 'max', suf = '') => {
    const theirs = [];
    for (let i = 1; i <= n; i++) { const c = row[`${pre}${i}${suf}`]; if (c && !String(c).startsWith('*')) theirs.push({ code: c, par: row[`${par}${i}${suf}`], min: row[`${mn}${i}${suf}`], max: row[`${mx}${i}${suf}`] }); }
    if (theirs.length !== mine.length) return false;
    const z = (v) => (v === 0 || v === '0' ? '' : v); // d2data 會省略 par=0
    return mine.every((m, i) => eq(m.code, theirs[i].code) && eq(z(m.par), z(theirs[i].par)) && eq(m.min, theirs[i].min) && eq(m.max, theirs[i].max));
  };
  const du = Object.values(dj('uniqueitems.json')).filter((r) => r.code && r.index);
  let bad = 0; const byId = new Map(du.map((r) => [Number(r['*ID']), r]));
  for (const u of uniques) { const r = byId.get(u.gameId); if (!r || !eq(r.code, u.code) || !eq(r['lvl req'], u.levelReq) || !cmpMods(u.mods, r, 12)) { bad++; if (bad <= 3) console.log('  差異 unique', u.nameEn); } }
  bad ? fail(`暗金與 d2data 不一致 ${bad}/${uniques.length}`) : ok(`暗金 ${uniques.length} 筆與 d2data 逐欄一致（code、需求等級、屬性 prop/par/min/max）`);
  const dsi = dj('setitems.json'); bad = 0;
  for (const s of setItems) { const r = dsi[s.nameEn]; if (!r || !eq(r.item, s.code) || !cmpMods(s.mods, r, 9)) { bad++; if (bad <= 3) console.log('  差異 setitem', s.nameEn); } }
  bad ? fail(`套裝件與 d2data 不一致 ${bad}/${setItems.length}`) : ok(`套裝件 ${setItems.length} 筆與 d2data 一致`);
  const drw = Object.values(dj('runes.json')).filter((r) => r.complete === 1 || r.complete === '1'); bad = 0;
  const rwBy = new Map(drw.map((r) => [r.Name, r]));
  for (const r of runewords) { const t = rwBy.get(r.key); if (!t || !cmpMods(r.mods, t, 7, 'T1Code', 'T1Param', 'T1Min', 'T1Max')) { bad++; if (bad <= 3) console.log('  差異 runeword', r.key); } }
  bad ? fail(`符文之語與 d2data 不一致 ${bad}/${runewords.length}`) : ok(`符文之語 ${runewords.length} 筆與 d2data 一致`);
  const dw = { ...Object.fromEntries(Object.values(dj('weapons.json')).map((r) => [r.code, r])), ...Object.fromEntries(Object.values(dj('armor.json')).map((r) => [r.code, r])) };
  bad = 0;
  for (const b of bases.filter((x) => x.kind !== 'misc')) { const r = dw[b.code]; const f = b.kind === 'weapon' ? ['mindam', 'maxdam', 'reqstr', 'reqdex', 'speed'] : ['minac', 'maxac', 'reqstr', 'reqdex', 'block']; const mine = b.kind === 'weapon' ? [b.minDam, b.maxDam, b.reqStr, b.reqDex, b.speed] : [b.minAc, b.maxAc, b.reqStr, b.reqDex, b.block];
    if (!r || f.some((k, i) => !eq(r[k] ?? 0, mine[i] ?? 0))) { bad++; if (bad <= 3) console.log('  差異 base', b.code, b.nameEn); } }
  bad ? fail(`底材數值與 d2data 不一致 ${bad}`) : ok('武器／防具底材數值與 d2data 一致');
}
console.log(failures ? `\n稽核失敗 ${failures} 項` : '\n稽核全數通過');
process.exit(failures ? 1 : 0);
