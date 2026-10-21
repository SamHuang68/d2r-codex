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
// 遊戲內的英文顯示名（enUS）：資料表的 index／skill 欄是內部名（含拼寫錯誤與別名），玩家看到的英文名在字串表
const en = (key) => { for (const m of S) { const v = m.get(key); if (v) return v.enUS; } return undefined; };

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
const beltBoxes = tsv('belts.txt').filter((r) => r.name && r.numboxes !== undefined).slice(0, 7).map((r) => num(r.numboxes));
const bases = [];
function addBase(r, kind) {
  if (!r.code) return;
  const b = {
    code: r.code, nameEn: r.name, nameEnUS: en(r.namestr || r.code), name: needZh(r.namestr || r.code, 'base'), kind, type: r.type, type2: r.type2,
    ancestors: ancestors(r.type), class: classOf(r.type),
    tier: r.code === r.normcode ? 'normal' : r.code === r.ubercode ? 'exceptional' : r.code === r.ultracode ? 'elite' : undefined,
    normcode: r.normcode, ubercode: r.ubercode, ultracode: r.ultracode,
    level: num(r.level), levelReq: num(r.levelreq) ?? 0, reqStr: num(r.reqstr) ?? 0, reqDex: num(r.reqdex) ?? 0,
    durability: num(r.durability), speed: num(r.speed), sockets: num(r.gemsockets),
    width: num(r.invwidth), height: num(r.invheight), invFile: r.invfile, uniqueInvFile: r.uniqueinvfile, setInvFile: r.setinvfile,
    spawnable: r.spawnable === '1', quest: r.quest === '1' ? true : undefined,
  };
  if (kind === 'armor') {
    b.minAc = num(r.minac); b.maxAc = num(r.maxac); b.block = num(r.block);
    // armor.txt 的 mindam／maxdam：盾牌＝重擊傷害、靴子＝踢擊傷害；belt＝腰帶格數（belts.txt 的列）
    const dmin = num(r.mindam), dmax = num(r.maxdam);
    if (dmax && ancestors(r.type).includes('shld')) { b.smiteMin = dmin; b.smiteMax = dmax; }
    if (dmax && ancestors(r.type).includes('boot')) { b.kickMin = dmin; b.kickMax = dmax; }
    if (ancestors(r.type).includes('belt') && num(r.belt) !== undefined) b.beltSlots = beltBoxes[num(r.belt)];
  }
  if (kind === 'weapon') {
    Object.assign(b, { minDam: num(r.mindam), maxDam: num(r.maxdam), twoHanded: r['2handed'] === '1',
      minDam2h: num(r['2handmindam']), maxDam2h: num(r['2handmaxdam']), minMisDam: num(r.minmisdam), maxMisDam: num(r.maxmisdam),
      strBonus: num(r.StrBonus), dexBonus: num(r.DexBonus), rangeAdder: num(r.rangeadder), wclass: r.wclass, wclass2h: r['2handedwclass'],
      oneOrTwoHanded: r['1or2handed'] === '1' });
    if (r.stackable === '1') b.maxStack = num(r.maxstack); // 投擲武器的堆疊數量（提示框顯示「數量：N / N」，不顯示耐久度）
  }
  bases.push(b);
}
tsv('armor.txt').forEach((r) => addBase(r, 'armor'));
tsv('weapons.txt').forEach((r) => addBase(r, 'weapon'));
const miscBases = tsv('misc.txt').filter((r) => r.code);
// misc 只保留與配裝相關者（護身符、戒指、項鍊、符文、寶石、藥水等皆納入以供名稱查詢）
miscBases.forEach((r) => {
  bases.push({ code: r.code, nameEn: r.name, nameEnUS: en(r.namestr || r.code), name: needZh(r.namestr || r.code, 'misc'), kind: 'misc', type: r.type, type2: r.type2,
    ancestors: ancestors(r.type), class: classOf(r.type), level: num(r.level), levelReq: num(r.levelreq) ?? 0,
    width: num(r.invwidth), height: num(r.invheight), invFile: r.invfile, uniqueInvFile: r.uniqueinvfile, setInvFile: r.setinvfile, spawnable: r.spawnable === '1' });
});
const baseByCode = new Map(bases.map((b) => [b.code, b]));


// --- 寶石／符文（鑲嵌效果：武器／頭甲身甲／盾牌三類）---
const gemMods = (r, pre) => {
  const out = [];
  for (let i = 1; i <= 3; i++) {
    const code = r[`${pre}${i}Code`]; if (!code) continue;
    const m = { code };
    if (r[`${pre}${i}Param`] !== undefined) m.par = num(r[`${pre}${i}Param`]);
    if (r[`${pre}${i}Min`] !== undefined) m.min = num(r[`${pre}${i}Min`]);
    if (r[`${pre}${i}Max`] !== undefined) m.max = num(r[`${pre}${i}Max`]);
    out.push(m);
  }
  return track(out);
};
const gems = tsv('gems.txt').filter((r) => r.code).map((r) => ({
  code: r.code, nameEn: r.name, nameEnUS: en(r.code) ?? en(r.name), name: zh(r.code) ?? zh(r.name), weapon: gemMods(r, 'weaponMod'), armor: gemMods(r, 'helmMod'), shield: gemMods(r, 'shieldMod'),
}));

// --- 暗金 ---
const uniques = [];
for (const r of tsv('uniqueitems.txt')) {
  if (!r.code || !r.index || r.index === 'Expansion') continue;
  const base = baseByCode.get(r.code);
  uniques.push({
    id: slug(r.index) + '_' + r['*ID'], gameId: num(r['*ID']), nameEn: r.index, nameEnUS: en(r.index), name: needZh(r.index, 'unique'),
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
  sets.push({ id: slug(r.index), nameEn: r.index, nameEnUS: en(r.index), name: needZh(r.index, 'set'), version: num(r.version), partial, full });
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
    id: slug(r.index) + '_' + r['*ID'], gameId: num(r['*ID']), nameEn: r.index, nameEnUS: en(r.index), name: needZh(r.index, 'setitem'), set: slug(r.set), setNameEn: r.set,
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
    id: slug(r['*Rune Name'] || r.Name) + '_' + r.Name.replace(/\D/g, ''), key: r.Name, nameEn: r['*Rune Name'], nameEnUS: en(r.Name), name: needZh(r.Name, 'runeword'),
    patch: r['*Patch Release'], ladderFirst: num(r.firstLadderSeason), ladderLast: num(r.lastLadderSeason),
    itypes: [1, 2, 3, 4, 5, 6].map((i) => r[`itype${i}`]).filter(Boolean), etypes: [1, 2, 3].map((i) => r[`etype${i}`]).filter(Boolean),
    runes, runeNamesEn: runes.map((c) => runeNames.get(c)?.name), sockets: runes.length,
    mods: track(mods(r, 7, 'T1Code', 'T1Param', 'T1Min', 'T1Max')),
  });
}
// --- 魔法詞綴（magicprefix.txt、magicsuffix.txt、automagic.txt；稀有物品的前後綴也從這裡抽）---
// level＝詞綴最低等級（alvl）、maxLevel＝最高（0 表示沒有上限）、levelReq＝這個詞綴讓物品增加的角色等級需求（沒填＝0）、group＝同一組只會出現一個、
// frequency＝抽中的相對權重、itypes／etypes＝可出現的物品類型與排除的類型（類型的相等關係見 itemtypes.json）、rare＝稀有物品也可能抽到。
// 職業欄位：classOnly＝資料表 classspecific 欄（前綴與自動詞綴用，職業代碼，例如 ama）；class＋classLevelReq＝資料表 class／classlevelreq 欄（後綴用，該職業的等級需求）。
// 沒有屬性的空殼列、遊戲設定為不會產生（spawnable 不是 1）的列、權重沒填或 0（不會被隨機抽到，多半是舊版本殘留的列）不收。
// 詞綴名稱在字串表裡的鍵大小寫不一定跟資料表一樣（資料表「of Darkness」、字串表「Of Darkness」；遊戲查字串不分大小寫），所以這裡補一個不分大小寫的查詢。
// 字串表完全沒有這個鍵的詞綴（of Shadows、of Despair、of Nightmares、of Ember、of Cinders、of Flames、of Inferno）沒有中文名，輸出時留空，由網站顯示英文名。
const zhCI = new Map();
for (const m of S) for (const [k, v] of m) if (v.zhTW && !zhCI.has(k.toLowerCase())) zhCI.set(k.toLowerCase(), v.zhTW);
const affixZh = (name) => zh(name) ?? zhCI.get(name.toLowerCase());
const affixItypes = (r) => [1, 2, 3, 4, 5, 6, 7].map((i) => r[`itype${i}`]).filter(Boolean);
const affixEtypes = (r) => [1, 2, 3, 4, 5].map((i) => r[`etype${i}`]).filter(Boolean);
const affixes = [];
for (const [file, kind] of [['magicprefix.txt', 'prefix'], ['magicsuffix.txt', 'suffix'], ['automagic.txt', 'auto']]) {
  tsv(file).forEach((r, i) => {
    if (!r.Name || r.spawnable !== '1' || !(num(r.frequency) > 0)) return; // 權重沒填或 0＝不會被隨機抽到（舊版本殘留的列）
    const ms = [1, 2, 3].filter((k) => r[`mod${k}code`]).map((k) => {
      const m = { code: r[`mod${k}code`] };
      if (r[`mod${k}param`] !== undefined) m.par = num(r[`mod${k}param`]);
      m.min = num(r[`mod${k}min`]) ?? 0; m.max = num(r[`mod${k}max`]) ?? m.min;
      return m;
    });
    if (!ms.length) return;
    affixes.push({
      id: `${kind[0]}${i}`, kind, nameEn: r.Name, name: affixZh(r.Name), level: num(r.level), maxLevel: num(r.maxlevel) || undefined, levelReq: num(r.levelreq) ?? 0,
      classOnly: r.classspecific || undefined, class: r.class || undefined, classLevelReq: num(r.classlevelreq) || undefined,
      frequency: num(r.frequency), group: num(r.group), rare: r.rare === '1' || undefined,
      mods: track(ms), itypes: affixItypes(r), etypes: affixEtypes(r),
    });
  });
}
// --- 聖壇（shrines.txt；中文名與提示語取自 shrines.json）---
// frames＝持續影格（遊戲每秒 25 影格）、reset＝重置時間（分鐘）、arg0／arg1＝各效果自己的參數（意義依效果而定，只在頁面解讀效果明確的幾項）、
// rarity／effectClass／levelMin 照資料表原值。Code 0 的「None」空列不收；效果文字標「(Not Used)」的是資料表標示未使用的聖壇，保留並標記。
const shrineStrings = strings('shrines.json');
const shrines = tsv('shrines.txt').filter((r) => r.Code && r.Code !== '0').map((r) => ({
  code: num(r.Code), nameEn: r.Name, name: shrineStrings.get(r.StringName)?.zhTW, msg: shrineStrings.get(r.StringPhrase)?.zhTW,
  type: r['*Shrine Type'], effect: r['*Effect'], arg0: num(r.Arg0), arg1: num(r.Arg1), frames: num(r['Duration in frames']), reset: num(r['reset time in minutes']),
  rarity: num(r.rarity), effectClass: num(r.effectclass), levelMin: num(r.LevelMin), unused: /\(Not Used\)/.test(r['*Effect'] ?? '') || undefined,
}));
// --- 經驗值表（experience.txt）：experience[n]＝升到 n 級需要的累計經驗（0~99 級）---
// 八個職業的數值完全相同（哪天不同就停下來，頁面目前只有一欄）。ExpRatio 欄（用途未驗證）與 MaxLvl 列不收。
const expRows = tsv('experience.txt').filter((r) => /^\d+$/.test(r.Level));
for (const r of expRows) {
  if (['Sorceress', 'Necromancer', 'Paladin', 'Barbarian', 'Druid', 'Assassin', 'Warlock'].some((c) => r[c] !== r.Amazon)) throw new Error(`experience.txt 第 ${r.Level} 級各職業的經驗不同，頁面需要改成分職業`);
}
const experience = expRows.map((r) => num(r.Amazon));
if (experience.length !== 100 || experience.some((v, i) => i > 0 && !(v > experience[i - 1]))) throw new Error('experience.txt 不是 0~99 級的遞增表');
// --- 赫拉迪姆方塊配方（cubemain.txt）：只收啟用的列。網站的方塊工坊、道具頁等是手寫文字，這份資料用來在測試裡逐項對照，網站本身不載入 ---
// row＝資料表裡的列號（含標題列，從 2 開始）；inputs＝input 1～7 的原始內容（例如 r08＝符文、gpv＝完美紫寶石、"weap,nor,nos"＝無孔普通武器；
// qty＝數量）；lvl／plvl／ilvl＝輸出物品等級的固定值、玩家等級百分比、輸入物品等級百分比；mods＝輸出的固定屬性（手工配方用）。
const cube = tsv('cubemain.txt').map((r, i) => ({ r, row: i + 2 })).filter(({ r }) => r.enabled === '1').map(({ r, row }) => ({
  row, description: (r.description ?? '').trim(),
  inputs: [1, 2, 3, 4, 5, 6, 7].map((k) => r[`input ${k}`]).filter(Boolean), output: r.output,
  lvl: num(r.lvl), plvl: num(r.plvl), ilvl: num(r.ilvl),
  mods: [1, 2, 3, 4, 5].filter((k) => r[`mod ${k}`]).map((k) => ({ code: r[`mod ${k}`], par: num(r[`mod ${k} param`]), min: num(r[`mod ${k} min`]), max: num(r[`mod ${k} max`]) })),
}));
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
for (const r of tsv('skills.txt')) {
  if (!r.charclass) continue;
  for (let i = 1; i <= 6; i++) if (r[`aurastat${i}`]) usedStats.add(r[`aurastat${i}`]);
  for (let i = 1; i <= 14; i++) if (r[`passivestat${i}`]) usedStats.add(r[`passivestat${i}`]);
}
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
const lev = (r, pre) => [1, 2, 3, 4, 5].map((i) => num(r[`${pre}${i}`]) ?? 0);
const hasDamage = (r) => !!(r.EType || r.MinDam || r.MaxDam || r.SrcDam);
const skills = skillRows.filter((r) => r.charclass && skillDesc.get(r.skilldesc)?.SkillPage).map((r) => {
  const d = skillDesc.get(r.skilldesc);
  const params = {};
  for (let i = 1; i <= 20; i++) if (r[`Param${i}`] !== undefined) params[i] = num(r[`Param${i}`]);
  const sk = {
    id: slug(r.skill), gameId: num(r['*Id']), nameEn: r.skill, nameEnUS: d['str name'] ? en(d['str name']) : undefined, name: d['str name'] ? zh(d['str name']) : undefined,
    charClass: r.charclass, page: num(d.SkillPage), row: num(d.SkillRow), col: num(d.SkillColumn),
    reqLevel: num(r.reqlevel) ?? 1, maxLvl: num(r.maxlvl) ?? 20,
    prereq: [r.reqskill1, r.reqskill2, r.reqskill3].filter(Boolean),
    desc: zh(d['str long']) ?? zh(d['str short']) ?? undefined, alt: zh(d['str alt']) ?? undefined,
    mana: { base: num(r.mana) ?? 0, perLvl: num(r.lvlmana) ?? 0, shift: num(r.manashift) ?? 0, min: num(r.minmana) ?? 0 },
    passive: r.passive === '1' ? true : undefined, aura: r.aura === '1' ? true : undefined, summon: r.summon ? true : undefined,
    params,
  };
  const unq = (v) => (v === undefined ? v : String(v).replace(/^"|"$/g, ''));
  // 召喚技能：召喚的怪物（monstats 的 Id，見 summons.json）與同時存在的數量算式
  if (r.summon) { sk.summonId = r.summon; if (r.petmax) sk.petMax = unq(r.petmax); }
  if (r.ToHit !== undefined || r.LevToHit !== undefined) { sk.toHit = num(r.ToHit) ?? 0; sk.levToHit = num(r.LevToHit) ?? 0; }
  const auraStats = []; for (let i = 1; i <= 6; i++) if (r[`aurastat${i}`]) auraStats.push({ stat: r[`aurastat${i}`], calc: unq(r[`aurastatcalc${i}`]) });
  const passiveStats = []; for (let i = 1; i <= 14; i++) if (r[`passivestat${i}`]) passiveStats.push({ stat: r[`passivestat${i}`], calc: unq(r[`passivecalc${i}`]) });
  if (auraStats.length) { sk.auraStats = auraStats; sk.auraState = r.aurastate; sk.auraTargetState = r.auratargetstate; sk.auraLen = r.auralencalc; }
  if (passiveStats.length) sk.passiveStats = passiveStats;
  if (hasDamage(r)) {
    sk.hitShift = num(r.HitShift) ?? 0;
    if (r.EType) sk.elem = { type: r.EType, min: { b: num(r.EMin) ?? 0, lv: lev(r, 'EMinLev') }, max: { b: num(r.EMax) ?? 0, lv: lev(r, 'EMaxLev') }, syn: r.EDmgSymPerCalc };
    if (r.MinDam || r.MaxDam) sk.phys = { min: { b: num(r.MinDam) ?? 0, lv: lev(r, 'MinLevDam') }, max: { b: num(r.MaxDam) ?? 0, lv: lev(r, 'MaxLevDam') }, syn: r.DmgSymPerCalc };
    if (r.SrcDam) sk.srcDam = num(r.SrcDam);
  }
  // 沒有元素類型、但有元素傷害欄位的技能（例如骷髏戰士的 edmn）：計算式裡的 edmn／edmx 用
  if (!r.EType && (r.EMin !== undefined || r.EMax !== undefined)) {
    sk.hitShift = num(r.HitShift) ?? 0;
    sk.edmg = { min: { b: num(r.EMin) ?? 0, lv: lev(r, 'EMinLev') }, max: { b: num(r.EMax) ?? 0, lv: lev(r, 'EMaxLev') } };
  }
  return sk;
});
// --- 怪物與場景（monstats.txt、levels.txt；中文名取自 monsters.json、levels.json）---
// 怪物：三個難度（普通、惡夢、地獄）各一組等級與抗性。資料表裡「沒填」的抗性格是 0；抗性 ≥100 是免疫、負值是弱點。
// 吸取效率（Drain，生命／法力偷取對這隻怪的效果 %）沒填就留空（輸出成 null，沒有可核對的預設值），不當成 0。
// 不含：精英、冠軍、首領詞綴（例如火焰附魔）帶來的額外抗性，以及遊戲內再依等級換算的生命。
const monStrings = strings('monsters.json'); const levelStrings = strings('levels.json');
const triple = (r, k, dflt) => [r[k], r[`${k}(N)`], r[`${k}(H)`]].map((v) => (v === undefined || v === '' ? dflt : num(v)));
const monTypeEquiv = new Map(tsv('montype.txt').map((r) => [r.type, [r.equiv1, r.equiv2, r.equiv3].filter(Boolean)]));
const monTypeIs = (t, want) => { const seen = new Set(); const walk = (x) => { if (!x || seen.has(x)) return false; seen.add(x); return x === want || (monTypeEquiv.get(x) ?? []).some(walk); }; return walk(t); };
// 玩家的召喚物（骷髏、魔像、女武神、哨衛…）也在 monstats 裡，不是敵人，排除。沒有中文名的只留首領（例如尼拉塞克），其餘是陷阱、哨衛、傳送門之類
const summonIdSet = new Set(skills.map((x) => x.summonId).filter(Boolean).map((x) => x.toLowerCase()));
const monKind = (t) => ['undead', 'demon', 'insect', 'construct', 'human'].find((k) => monTypeIs(t, k));
const monsters = tsv('monstats.txt')
  .filter((r) => r.enabled === '1' && r.killable === '1' && r.npc !== '1' && r.inTown !== '1' && r.NameStr && !/dummy/i.test(r.NameStr) && !summonIdSet.has(r.Id.toLowerCase()))
  .filter((r) => monStrings.get(r.NameStr)?.zhTW || r.boss === '1')
  .map((r) => ({
    id: r.Id, nameEn: r.NameStr, name: monStrings.get(r.NameStr)?.zhTW ?? r.NameStr, type: r.MonType, kind: monKind(r.MonType),
    boss: r.boss === '1' || undefined, primeEvil: r.primeevil === '1' || undefined,
    levels: triple(r, 'Level'),
    res: { physical: triple(r, 'ResDm', 0), magic: triple(r, 'ResMa', 0), fire: triple(r, 'ResFi', 0), lightning: triple(r, 'ResLi', 0), cold: triple(r, 'ResCo', 0), poison: triple(r, 'ResPo', 0) },
    drain: triple(r, 'Drain'),
  }));
const monsterIds = new Set(monsters.map((m) => m.id));
// 場景：每個難度各有一份出現的怪物清單（mon＝普通、nmon＝惡夢、umon＝地獄）與怪物等級（擴充版 MonLvlEx）
const areas = tsv('levels.txt').filter((r) => r.LevelName).map((r) => {
  const list = (pre) => { const out = []; for (let i = 1; i <= 25; i++) { const id = r[`${pre}${i}`]; if (id && monsterIds.has(id) && !out.includes(id)) out.push(id); } return out; };
  return { id: num(r.Id), nameEn: r.LevelName, name: levelStrings.get(r.LevelName)?.zhTW, act: (num(r.Act) ?? 0) + 1, mlvl: triple(r, 'MonLvlEx'), mon: [list('mon'), list('nmon'), list('umon')] };
}).filter((a) => a.mon.some((l) => l.length));
// --- 召喚物的怪物基礎數值（monstats.txt；普通／惡夢／地獄三組）---
// 召喚技能（skills.json 的 summonId）召喚的怪物。生命沒有難度區分（遊戲再依等級換算），其餘三組依序是 普通、惡夢、地獄。
// 只輸出資料表的值，不合併技能提供的加成（合併規則沒有可核對的來源）。
// 技能表的 summon 欄與 monstats 的 Id 大小寫不一定一致（技能表 ClayGolem，monstats claygolem），用小寫對照
const monstatsRows = new Map(tsv('monstats.txt').map((r) => [r.Id.toLowerCase(), r]));
const diffTriple = (r, k) => [num(r[k]), num(r[`${k}(N)`]), num(r[`${k}(H)`])];
const summonMonsters = [];
for (const id of [...new Set(skills.map((x) => x.summonId).filter(Boolean).map((x) => x.toLowerCase()))].sort()) {
  const r = monstatsRows.get(id.toLowerCase()); if (!r) continue;
  summonMonsters.push({
    id: r.Id, minHP: num(r.minHP), maxHP: num(r.maxHP), ac: diffTriple(r, 'AC'), tohit: diffTriple(r, 'A1TH'),
    dmg: [1, 2].map((a) => ({ min: diffTriple(r, `A${a}MinD`), max: diffTriple(r, `A${a}MaxD`), tohit: diffTriple(r, `A${a}TH`) })).filter((x) => x.max.some((v) => v)),
    res: { physical: diffTriple(r, 'ResDm'), magic: diffTriple(r, 'ResMa'), fire: diffTriple(r, 'ResFi'), lightning: diffTriple(r, 'ResLi'), cold: diffTriple(r, 'ResCo'), poison: diffTriple(r, 'ResPo') },
  });
}
// 技能計算式裡的函式（lnXY 線性、dmXY 遞減）。定義在遊戲的 skillcalc.txt，括號內是遊戲自己的寫法，引擎用同一份定義求值，不自己寫死參數配對
// （例如 ln91 是 par9＋(lvl−1)×par10、ln21 是 par11＋(lvl−1)×par12，不是字面上的第 9／1、第 2／1 個參數）
const skillCalcFns = Object.fromEntries(tsv('skillcalc.txt').filter((r) => /^(ln|dm)\d\d$/.test(r.code)).map((r) => [r.code, r['*Description']]));
// 全部技能（含道具專用、怪物技能）的名稱表：觸發技能、充能的技能名稱用。
// charClass 只有職業技能（skills.json 裡有的）才有；放在這張小表裡，物品描述不必為了查「這個技能屬於哪個職業」而載入整份 skills.json（136 kB）
const classOfSkill = new Map(skills.map((x) => [x.gameId, x.charClass]));
const skillNames = skillRows.map((r) => { const d = skillDesc.get(r.skilldesc); const k = d?.['str name']; const gameId = num(r['*Id']); return { gameId, nameEn: r.skill, nameEnUS: k ? en(k) : undefined, name: k ? zh(k) : undefined, charClass: classOfSkill.get(gameId) }; }).filter((x) => x.name);
// --- 傭兵（hireling.txt 的擴充版資料 Version 100）---
// 每個類型（Id）一組，rows 是不同等級的「檢查點」：等級落在兩個檢查點之間時，用最接近的下方檢查點加上每級成長外推（引擎的 mercenary.ts）。
// 每級成長的單位（HP／防禦／命中 1；力量／敏捷 1/8 進位；傷害 1/8 四捨五入；抗性 1/4 進位；技能等級 1/32 進位；施放機率 1/4）
// 由相鄰檢查點驗證過，見 scripts/test_engine.mjs。完全相同的重複列（例如兩個雙手劍野蠻人）合併成一組，ids 記錄原本的 Id。
const hirelingActZh = { 1: '俠盜斥候', 2: '沙漠傭兵', 3: '鐵狼衛士', 5: '野蠻人' };
const hirelingSkillZh = (nameEn) => skillNames.find((x) => x.nameEn === nameEn)?.name ?? nameEn;
const hirelingGroups = new Map();
for (const r of tsv('hireling.txt').filter((x) => x.Version === '100')) (hirelingGroups.get(r.Id) ?? hirelingGroups.set(r.Id, []).get(r.Id)).push(r);
const hirelingRow = (r) => ({
  level: num(r.Level), hp: num(r.HP), hpLvl: num(r['HP/Lvl']), def: num(r.Defense), defLvl: num(r['Def/Lvl']),
  str: num(r.Str), strLvl: num(r['Str/Lvl']), dex: num(r.Dex), dexLvl: num(r['Dex/Lvl']), ar: num(r.AR), arLvl: num(r['AR/Lvl']),
  dmgMin: num(r['Dmg-Min']), dmgMax: num(r['Dmg-Max']), dmgLvl: num(r['Dmg/Lvl']),
  res: { fire: [num(r.ResistFire), num(r['ResistFire/Lvl'])], cold: [num(r.ResistCold), num(r['ResistCold/Lvl'])], lightning: [num(r.ResistLightning), num(r['ResistLightning/Lvl'])], poison: [num(r.ResistPoison), num(r['ResistPoison/Lvl'])] },
  skills: [1, 2, 3, 4, 5, 6].filter((i) => r[`Skill${i}`]).map((i) => ({ nameEn: r[`Skill${i}`], name: hirelingSkillZh(r[`Skill${i}`]), mode: num(r[`Mode${i}`]), chance: num(r[`Chance${i}`]), chanceLvl: num(r[`ChancePerLvl${i}`]), level: num(r[`Level${i}`]), levelLvl: num(r[`LvlPerLvl${i}`]) })),
});
const hirelingRaw = [...hirelingGroups.entries()].map(([id, g]) => {
  const first = g[0];
  const descKey = first.HireDesc;
  const rows = g.map(hirelingRow).sort((a, b) => a.level - b.level);
  const act = num(first.Act);
  const desc = (descKey && zh(descKey)) || [...new Set(rows[0].skills.filter((x) => x.mode !== 14).map((x) => x.name))].join('／');
  return { id: num(id), ids: [num(id)], hireling: first.Hireling, subType: first['*SubType'], act, difficulty: num(first.Difficulty), typeZh: hirelingActZh[act], desc, class: first.equivalentcharclass, maxLevelDiff: num(first.HiringMaxLevelDifference), rows };
});
const hireling = [];
for (const h of hirelingRaw) {
  const dup = hireling.find((x) => x.act === h.act && x.difficulty === h.difficulty && x.desc === h.desc && JSON.stringify(x.rows) === JSON.stringify(h.rows));
  if (dup) dup.ids.push(h.id); else hireling.push(h);
}
const skillByName = new Set(skills.map((x) => x.nameEn));
const badPrereq = skills.flatMap((x) => x.prereq.filter((n) => !skillByName.has(n)).map((n) => `${x.nameEn}->${n}`));
const CLASS_PREFIX = { ama: 'Am', sor: 'So', nec: 'Ne', pal: 'Pa', bar: 'Ba', dru: 'Dr', ass: 'As', war: 'Wa' };
const skillTabs = {}; const skillTabsEn = {};
for (const [code, pre] of Object.entries(CLASS_PREFIX)) { skillTabs[code] = [1, 2, 3].map((i) => zh(`SkillCategory${pre}${i}`) ?? null); skillTabsEn[code] = [1, 2, 3].map((i) => en(`SkillCategory${pre}${i}`) ?? null); }
console.log('skills(UI):', skills.length, 'bad prereq:', badPrereq.length, badPrereq.slice(0, 5).join(','), '| tabs missing:', Object.values(skillTabs).flat().filter((x) => !x).length);

// --- 版面：inventory.txt、UI 類別（拾取篩選器結構）---
const inventory = tsv('inventory.txt').map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, num(v)])));
const uiCategories = tsv('itemuicategories.txt').map((r) => ({ name: r.Name, isEquipment: r.isEquipment === '1', parent: r.ParentCategory, qualityFilter: num(r.QualityFilter), columns: num(r.NumColumns) }));

// 沒有職業的「物品技能」（印記、蜘蛛網、譫妄、生命連結）的狀態持續時間：auralencalc 是影格數，遊戲 25 影格＝1 秒。
// 描述屬性時用（例如熊人／狼人印記持續幾秒），不再把秒數寫死在程式裡。
const itemSkills = {};
for (const r of skillRows) {
  if (r.charclass || !/^\d+$/.test(r.auralencalc ?? '')) continue;
  itemSkills[r.skill] = { id: slug(r.skill), frames: num(r.auralencalc), seconds: num(r.auralencalc) / 25 };
}

fs.mkdirSync(outDir, { recursive: true });
const meta = { generator: 'scripts/data-pipeline/build_game_data.mjs', gameVersion, source: 'D2R local CASC (excel + zhTW strings)', generatedAt: new Date().toISOString().slice(0, 10),
  counts: { bases: bases.length, uniques: uniques.length, gems: gems.length, sets: sets.length, setItems: setItems.length, runewords: runewords.length, skills: skills.length } };
const write = (n, d) => fs.writeFileSync(path.join(outDir, n), JSON.stringify(d));
write('meta.json', meta); write('itemtypes.json', itemtypes); write('bases.json', bases); write('uniques.json', uniques);
write('gems.json', gems); write('sets.json', sets); write('setItems.json', setItems); write('runewords.json', runewords);
write('properties.json', properties); write('stats.json', stats); write('statStrings.zhTW.json', statStrings);
write('charstats.json', charstats); write('skills.json', skills); write('skillNames.json', skillNames); write('skillTabs.json', skillTabs); write('skillTabsEn.json', skillTabsEn); write('inventory.json', inventory); write('uiCategories.json', uiCategories); write('itemSkills.json', itemSkills); write('skillCalc.json', skillCalcFns); write('hireling.json', hireling); write('summons.json', summonMonsters); write('monsters.json', monsters); write('areas.json', areas); write('affixes.json', affixes); write('shrines.json', shrines); write('experience.json', experience); write('cube.json', cube);

console.log(JSON.stringify(meta.counts));
console.log('missing property defs:', missingProps.length, missingProps.slice(0, 20).join(','));
console.log('missing zhTW names:', missingZh.size, [...missingZh].slice(0, 25).join(' | '));
console.log('used properties:', usedProps.size, 'stats:', Object.keys(stats).length, 'statStrings:', Object.keys(statStrings).length);
