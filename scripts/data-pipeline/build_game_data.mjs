// 由本機抽出的 D2R 資料表（excel .txt）與字串（zhTW）產生結構化 JSON。
// 用法：node scripts/data-pipeline/build_game_data.mjs <抽取根目錄> [輸出目錄]
//   抽取根目錄 = casc_extract/ex.exe 的輸出，內含 data_data/global/excel 與 data_data/local/lng/strings
// 只輸出模擬器需要的子集，不複製原始資料表。
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];
const outDir = process.argv[3] || 'src/data/game';
if (!root) { console.error('usage: build_game_data.mjs <extractRoot> [outDir]'); process.exit(1); }
const excelDir = path.join(root, 'data_data', 'global', 'excel');
const strDir = path.join(root, 'data_data', 'local', 'lng', 'strings');
const gameVersion = process.env.D2R_BUILD || '';

const num = (v) => (v === undefined || v === '' ? undefined : Number.isNaN(Number(v)) ? v : Number(v));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

function tsv(file) {
  const lines = fs.readFileSync(path.join(excelDir, file), 'utf8').replace(/^﻿/, '').replace(/\r/g, '').split('\n');
  const head = lines[0].split('\t');
  return lines.slice(1).filter((l) => l.trim()).map((l) => {
    const c = l.split('\t');
    const o = {};
    head.forEach((h, i) => { if (c[i] !== undefined && c[i] !== '') o[h] = c[i]; });
    return o;
  });
}
function strings(file) {
  const raw = fs.readFileSync(path.join(strDir, file), 'utf8').replace(/^﻿/, '');
  const m = new Map();
  for (const e of JSON.parse(raw)) m.set(e.Key, { zhTW: e.zhTW, enUS: e.enUS });
  return m;
}
const S = ['item-names.json', 'item-nameaffixes.json', 'item-runes.json', 'item-modifiers.json', 'skills.json', 'ui.json']
  .map(strings);
const zh = (key) => { for (const m of S) { const v = m.get(key); if (v) return v.zhTW; } return undefined; };

const missingZh = new Set();
const needZh = (key, label) => { const v = zh(key); if (!v) missingZh.add(`${label}:${key}`); return v; };

// 屬性（modifier）：prop / par / min / max
function mods(row, n, pre = 'prop', parK = 'par', minK = 'min', maxK = 'max', suffix = '') {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const code = row[`${pre}${i}${suffix}`];
    if (!code || code.startsWith('*')) continue; // 以 * 開頭＝遊戲資料中被註解停用的屬性
    const m = { code };
    const par = row[`${parK}${i}${suffix}`]; if (par !== undefined) m.par = num(par);
    const mn = row[`${minK}${i}${suffix}`]; if (mn !== undefined) m.min = num(mn);
    const mx = row[`${maxK}${i}${suffix}`]; if (mx !== undefined) m.max = num(mx);
    out.push(m);
  }
  return out;
}
const usedProps = new Set();
const track = (list) => { list.forEach((m) => usedProps.add(m.code)); return list; };

// --- itemtypes（含祖先與職業限定）---
const itemtypesRaw = tsv('itemtypes.txt').filter((r) => r.Code);
const itypeMap = new Map(itemtypesRaw.map((r) => [r.Code, r]));
function ancestors(code, seen = new Set()) {
  if (seen.has(code)) return [];
  seen.add(code);
  const r = itypeMap.get(code); if (!r) return [code];
  const res = [code];
  for (const k of ['Equiv1', 'Equiv2']) if (r[k]) res.push(...ancestors(r[k], seen));
  return res;
}
const itemtypes = itemtypesRaw.map((r) => ({
  code: r.Code, name: r.ItemType, equiv: [r.Equiv1, r.Equiv2].filter(Boolean),
  bodyLoc: [r.BodyLoc1, r.BodyLoc2].filter((x) => x && x !== 'none'),
  class: r.Class, uiCategory: r.UICategory, runewordCategory: [r.RunewordCategory1, r.RunewordCategory2].filter(Boolean),
  maxSockets: [r.MaxSockets1, r.MaxSockets2, r.MaxSockets3].map(num),
  socketThresholds: [r.MaxSocketsLevelThreshold1, r.MaxSocketsLevelThreshold2].map(num),
}));
const classOf = (type) => { for (const t of ancestors(type)) { const c = itypeMap.get(t)?.Class; if (c) return c; } return undefined; };

// --- 底材 ---
const bases = [];
function addBase(r, kind) {
  if (!r.code) return;
  const b = {
    code: r.code, nameEn: r.name, name: needZh(r.namestr || r.code, 'base'), kind, type: r.type, type2: r.type2,
    ancestors: ancestors(r.type), class: classOf(r.type),
    tier: r.code === r.normcode ? 'normal' : r.code === r.ubercode ? 'exceptional' : r.code === r.ultracode ? 'elite' : undefined,
    normcode: r.normcode, ubercode: r.ubercode, ultracode: r.ultracode,
    level: num(r.level), levelReq: num(r.levelreq), reqStr: num(r.reqstr) ?? 0, reqDex: num(r.reqdex) ?? 0,
    durability: num(r.durability), speed: num(r.speed), sockets: num(r.gemsockets),
    width: num(r.invwidth), height: num(r.invheight), invFile: r.invfile, uniqueInvFile: r.uniqueinvfile, setInvFile: r.setinvfile,
    spawnable: r.spawnable === '1', quest: r.quest === '1' ? true : undefined,
  };
  if (kind === 'armor') { b.minAc = num(r.minac); b.maxAc = num(r.maxac); b.block = num(r.block); }
  if (kind === 'weapon') {
    Object.assign(b, { minDam: num(r.mindam), maxDam: num(r.maxdam), twoHanded: r['2handed'] === '1',
      minDam2h: num(r['2handmindam']), maxDam2h: num(r['2handmaxdam']), minMisDam: num(r.minmisdam), maxMisDam: num(r.maxmisdam),
      strBonus: num(r.StrBonus), dexBonus: num(r.DexBonus), rangeAdder: num(r.rangeadder), wclass: r.wclass, wclass2h: r['2handedwclass'],
      oneOrTwoHanded: r['1or2handed'] === '1' });
  }
  bases.push(b);
}
tsv('armor.txt').forEach((r) => addBase(r, 'armor'));
tsv('weapons.txt').forEach((r) => addBase(r, 'weapon'));
const miscBases = tsv('misc.txt').filter((r) => r.code);
// misc 只保留與配裝相關者（護身符、戒指、項鍊、符文、寶石、藥水等皆納入以供名稱查詢）
miscBases.forEach((r) => {
  bases.push({ code: r.code, nameEn: r.name, name: needZh(r.namestr || r.code, 'misc'), kind: 'misc', type: r.type, type2: r.type2,
    ancestors: ancestors(r.type), class: classOf(r.type), level: num(r.level), levelReq: num(r.levelreq),
    width: num(r.invwidth), height: num(r.invheight), invFile: r.invfile, uniqueInvFile: r.uniqueinvfile, setInvFile: r.setinvfile, spawnable: r.spawnable === '1' });
});
const baseByCode = new Map(bases.map((b) => [b.code, b]));

// --- 暗金 ---
const uniques = [];
for (const r of tsv('uniqueitems.txt')) {
  if (!r.code || !r.index || r.index === 'Expansion') continue;
  const base = baseByCode.get(r.code);
  uniques.push({
    id: slug(r.index) + '_' + r['*ID'], gameId: num(r['*ID']), nameEn: r.index, name: needZh(r.index, 'unique'),
    code: r.code, baseNameEn: r['*ItemName'], baseName: base?.name, type: base?.type, class: base?.class, slotHint: base?.ancestors,
    level: num(r.lvl), levelReq: num(r['lvl req']), rarity: num(r.rarity), version: num(r.version),
    ladderFirst: num(r.firstLadderSeason), ladderLast: num(r.lastLadderSeason), disabled: r.disabled === '1' ? true : undefined,
    spawnable: r.spawnable === '1', invFile: r.invfile, crafted: /^Crafted /.test(r.index) ? true : undefined, mods: track(mods(r, 12)),
  });
}

// --- 套裝 ---
const sets = [];
for (const r of tsv('sets.txt')) {
  if (!r.index || r.index === 'Expansion') continue;
  const partial = [];
  for (const n of [2, 3, 4, 5]) for (const ab of ['a', 'b']) {
    const code = r[`PCode${n}${ab}`]; if (!code) continue;
    const m = { code, pieces: n }; if (r[`PParam${n}${ab}`] !== undefined) m.par = num(r[`PParam${n}${ab}`]);
    if (r[`PMin${n}${ab}`] !== undefined) m.min = num(r[`PMin${n}${ab}`]); if (r[`PMax${n}${ab}`] !== undefined) m.max = num(r[`PMax${n}${ab}`]);
    partial.push(m);
  }
  partial.forEach((m) => usedProps.add(m.code));
  const full = track(mods(r, 8, 'FCode', 'FParam', 'FMin', 'FMax'));
  sets.push({ id: slug(r.index), nameEn: r.index, name: needZh(r.index, 'set'), version: num(r.version), partial, full });
}
const setItems = [];
for (const r of tsv('setitems.txt')) {
  if (!r.index || !r.item) continue;
  const base = baseByCode.get(r.item);
  const bonus = [];
  for (let i = 1; i <= 5; i++) for (const ab of ['a', 'b']) {
    const code = r[`aprop${i}${ab}`]; if (!code) continue;
    const m = { code, slot: i }; if (r[`apar${i}${ab}`] !== undefined) m.par = num(r[`apar${i}${ab}`]);
    if (r[`amin${i}${ab}`] !== undefined) m.min = num(r[`amin${i}${ab}`]); if (r[`amax${i}${ab}`] !== undefined) m.max = num(r[`amax${i}${ab}`]);
    bonus.push(m);
  }
  bonus.forEach((m) => usedProps.add(m.code));
  setItems.push({
    id: slug(r.index) + '_' + r['*ID'], gameId: num(r['*ID']), nameEn: r.index, name: needZh(r.index, 'setitem'), set: slug(r.set), setNameEn: r.set,
    code: r.item, baseNameEn: r['*ItemName'], baseName: base?.name, type: base?.type, class: base?.class,
    level: num(r.lvl), levelReq: num(r['lvl req']), ladderFirst: num(r.firstLadderSeason), ladderLast: num(r.lastLadderSeason),
    disabled: r.disabled === '1' ? true : undefined, mods: track(mods(r, 9)), setBonusByCount: bonus,
  });
}

// --- 符文之語 ---
const runeNames = new Map(miscBases.filter((r) => r.type === 'rune').map((r) => [r.code, r]));
const runewords = [];
for (const r of tsv('runes.txt')) {
  if (r.complete !== '1') continue;
  const runes = [1, 2, 3, 4, 5, 6].map((i) => r[`Rune${i}`]).filter(Boolean);
  runewords.push({
    id: slug(r['*Rune Name'] || r.Name) + '_' + r.Name.replace(/\D/g, ''), key: r.Name, nameEn: r['*Rune Name'], name: needZh(r.Name, 'runeword'),
    patch: r['*Patch Release'], ladderFirst: num(r.firstLadderSeason), ladderLast: num(r.lastLadderSeason),
    itypes: [1, 2, 3, 4, 5, 6].map((i) => r[`itype${i}`]).filter(Boolean), etypes: [1, 2, 3].map((i) => r[`etype${i}`]).filter(Boolean),
    runes, runeNamesEn: runes.map((c) => runeNames.get(c)?.name), sockets: runes.length,
    mods: track(mods(r, 7, 'T1Code', 'T1Param', 'T1Min', 'T1Max')),
  });
}
// --- properties（modifier → stat 對映）、itemstatcost（子集）---
const propRows = tsv('properties.txt');
const properties = {};
for (const p of propRows) {
  if (!usedProps.has(p.code)) continue;
  const parts = [];
  for (let i = 1; i <= 7; i++) if (p[`func${i}`] !== undefined || p[`stat${i}`]) parts.push({ func: num(p[`func${i}`]), stat: p[`stat${i}`], set: num(p[`set${i}`]), val: num(p[`val${i}`]) });
  properties[p.code] = { id: num(p['*Id']), parts, tooltip: p['*Tooltip'] };
}
const missingProps = [...usedProps].filter((c) => !properties[c]);
const statCols = ['Stat', '*ID', 'Signed', 'Send Bits', 'Save Bits', 'Save Add', 'Save Param Bits', 'op', 'op param', 'op base', 'op stat1', 'op stat2', 'op stat3', 'direct', 'maxstat',
  'descpriority', 'descfunc', 'descval', 'descstrpos', 'descstrneg', 'descstr2', 'dgrp', 'dgrpfunc', 'dgrpval', 'dgrpstrpos', 'dgrpstrneg', 'dgrpstr2'];
const stats = {};
const usedStats = new Set(Object.values(properties).flatMap((p) => p.parts.map((x) => x.stat).filter(Boolean)));
for (const s of tsv('itemstatcost.txt')) {
  if (!usedStats.has(s.Stat) && !(s.op)) continue; // 保留被引用者與有 op（衍生屬性）者
  const o = {}; for (const c of statCols) if (s[c] !== undefined) o[c.replace(/\s+/g, '_').replace('*', '')] = num(s[c]);
  stats[s.Stat] = o;
}
// descstr 對應的 zhTW 模板
const strKeys = new Set(); Object.values(stats).forEach((s) => ['descstrpos', 'descstrneg', 'descstr2', 'dgrpstrpos', 'dgrpstrneg', 'dgrpstr2'].forEach((k) => s[k] && strKeys.add(s[k])));
const statStrings = {}; for (const k of strKeys) { const v = zh(k); if (v) statStrings[k] = v; }

// --- 職業 / 技能（精簡：僅名稱與歸屬，供參數解析；技能數值留待 S2/S6）---
const charstats = tsv('charstats.txt').filter((r) => r.class && r.class !== 'Expansion').map((r) => {
  const o = {}; for (const [k, v] of Object.entries(r)) if (!k.startsWith('Skill ') && !k.startsWith('item') && !/^(armor|weapon|head|torso|gloves|boots|belt|ring|amulet)/i.test(k)) o[k] = num(v);
  return o;
});
const skillRows = tsv('skills.txt').filter((r) => r.skill);
const skillDesc = new Map(tsv('skilldesc.txt').map((r) => [r.skilldesc, r]));
const skills = skillRows.map((r) => {
  const d = skillDesc.get(r.skilldesc);
  const nameKey = d?.['str name'];
  return { id: num(r['*Id']), nameEn: r.skill, charClass: r.charclass, reqLevel: num(r.reqlevel), tree: d?.SkillPage, row: d?.SkillRow, col: d?.SkillColumn,
    name: nameKey ? zh(nameKey) : undefined, nameKey };
});

// --- 版面：inventory.txt、UI 類別（拾取篩選器結構）---
const inventory = tsv('inventory.txt').map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, num(v)])));
const uiCategories = tsv('itemuicategories.txt').map((r) => ({ name: r.Name, isEquipment: r.isEquipment === '1', parent: r.ParentCategory, qualityFilter: num(r.QualityFilter), columns: num(r.NumColumns) }));

fs.mkdirSync(outDir, { recursive: true });
const meta = { generator: 'scripts/data-pipeline/build_game_data.mjs', gameVersion, source: 'D2R local CASC (excel + zhTW strings)', generatedAt: new Date().toISOString().slice(0, 10),
  counts: { bases: bases.length, uniques: uniques.length, sets: sets.length, setItems: setItems.length, runewords: runewords.length, skills: skills.length } };
const write = (n, d) => fs.writeFileSync(path.join(outDir, n), JSON.stringify(d));
write('meta.json', meta); write('itemtypes.json', itemtypes); write('bases.json', bases); write('uniques.json', uniques);
write('sets.json', sets); write('setItems.json', setItems); write('runewords.json', runewords);
write('properties.json', properties); write('stats.json', stats); write('statStrings.zhTW.json', statStrings);
write('charstats.json', charstats); write('skills.json', skills); write('inventory.json', inventory); write('uiCategories.json', uiCategories);

console.log(JSON.stringify(meta.counts));
console.log('missing property defs:', missingProps.length, missingProps.slice(0, 20).join(','));
console.log('missing zhTW names:', missingZh.size, [...missingZh].slice(0, 25).join(' | '));
console.log('used properties:', usedProps.size, 'stats:', Object.keys(stats).length, 'statStrings:', Object.keys(statStrings).length);
