// 百科頁資料「能力保全」對照：由遊戲資料表即時產生的新版百科資料，逐筆比對舊百科資料（以舊 id 配對）。
// 規則 0009 第 3、5 條：舊版有的資訊，新版要有（原樣、等價替換、或舊資料錯誤已更正），差異逐項列出。
// 用法：node scripts/data-pipeline/parity_codex_vs_legacy.mjs <舊資料根目錄> [輸出檔.json]
//   舊資料根目錄需含 src/data/*.ts：git archive e5b3f02 src/data src/types | tar -x -C <dir>
import fs from 'node:fs';
import { loadCodex, loadLegacy, normLine } from './lib/legacy_match.mjs';

const legacyRoot = process.argv[2];
if (!legacyRoot) { console.error('用法：node scripts/data-pipeline/parity_codex_vs_legacy.mjs <舊資料根目錄> [輸出檔.json]'); process.exit(1); }
const O = await loadLegacy(legacyRoot);
const N = await loadCodex();

const template = (s) => String(s).replace(/\d+(?:\.\d+)?/g, 'N');
const diffLines = (a, b) => {
  const cb = new Map(); for (const x of b.map(normLine)) cb.set(x, (cb.get(x) || 0) + 1);
  const onlyA = [];
  for (const l of a) { const k = normLine(l); if (cb.get(k)) cb.set(k, cb.get(k) - 1); else onlyA.push(l); }
  const ca = new Map(); for (const x of a.map(normLine)) ca.set(x, (ca.get(x) || 0) + 1);
  const onlyB = [];
  for (const l of b) { const k = normLine(l); if (ca.get(k)) ca.set(k, ca.get(k) - 1); else onlyB.push(l); }
  return { onlyOld: onlyA, onlyNew: onlyB };
};

const report = {};
function compare(label, oldItems, newItems, getLines, idOf = (x) => x.id) {
  const nm = new Map(newItems.map((x) => [idOf(x), x]));
  let same = 0; const diffs = []; const missing = [];
  for (const o of oldItems) {
    const n = nm.get(idOf(o)); if (!n) { missing.push(o.id); continue; }
    const d = diffLines(getLines(o), getLines(n));
    if (!d.onlyOld.length && !d.onlyNew.length) same++; else diffs.push({ id: o.id, name: o.name, ...d });
  }
  const tpl = {};
  for (const d of diffs) { for (const l of d.onlyOld) (tpl[`舊有 ${template(l)}`] ||= []).push(d.name); for (const l of d.onlyNew) (tpl[`新有 ${template(l)}`] ||= []).push(d.name); }
  const top = Object.entries(tpl).sort((a, b) => b[1].length - a[1].length);
  report[label] = { old: oldItems.length, new: newItems.length, matchedById: oldItems.length - missing.length, missingInNew: missing, identical: same, differing: diffs.length, diffs, topDifferenceTemplates: top.map(([k, v]) => [k, v.length, [...new Set(v)].slice(0, 3)]) };
  console.log(`${label}：舊 ${oldItems.length}／新 ${newItems.length}；以 id 對到 ${oldItems.length - missing.length}（新版缺 ${missing.length}）；逐行完全相同 ${same}，有差異 ${diffs.length}`);
  for (const [k, names] of top.slice(0, 16)) console.log(`   ${String(names.length).padStart(3)} × ${k}   例：${[...new Set(names)].slice(0, 3).join('、')}`);
}

compare('暗金', O.UNIQUE_ITEMS_DATA, N.UNIQUE_ITEMS_DATA, (x) => x.attributes);
const pieces = (D) => D.SET_ITEMS_DATA.flatMap((s) => s.pieces);
compare('套裝件', pieces(O), pieces(N), (x) => x.attributes);
compare('符文之語', O.RUNEWORDS_DATA, N.RUNEWORDS_DATA, (x) => x.attributes);


// ── 套裝加成、符文之語與其他欄位 ──
function scalars(label, oldItems, newItems, fields, idOf = (x) => x.id) {
  const nm = new Map(newItems.map((x) => [idOf(x), x])); const out = {};
  for (const o of oldItems) {
    const n = nm.get(idOf(o)); if (!n) continue;
    for (const f of fields) {
      const a = o[f], b = n[f];
      const same = Array.isArray(a) || Array.isArray(b) ? JSON.stringify(a ?? []) === JSON.stringify(b ?? []) : (a ?? null) === (b ?? null);
      if (!same) (out[f] ||= []).push({ id: idOf(o), old: a, new: b });
    }
  }
  report[`${label}-欄位`] = out;
  console.log(`${label}欄位差異：`, Object.entries(out).map(([f, v]) => `${f}=${v.length}`).join('、') || '無');
  for (const [f, v] of Object.entries(out)) console.log(`   ${f}：${v.slice(0, 3).map((x) => `${x.id}(${JSON.stringify(x.old)}→${JSON.stringify(x.new)})`).join('；')}`);
}
scalars('暗金', O.UNIQUE_ITEMS_DATA, N.UNIQUE_ITEMS_DATA, ['name', 'nameEn', 'baseItem', 'baseItemId', 'slot', 'requiredLevel', 'requiredStr', 'requiredDex', 'classOnly', 'grade', 'qlvl', 'imageUrl', 'ladderOnly']);
scalars('套裝件', pieces(O), pieces(N), ['name', 'nameEn', 'baseItem', 'baseItemId', 'slot', 'requiredLevel', 'requiredStr', 'requiredDex', 'classOnly', 'grade', 'qlvl', 'imageUrl']);
scalars('套裝', O.SET_ITEMS_DATA, N.SET_ITEMS_DATA, ['name', 'nameEn', 'isClassSet', 'class']);
{
  const nm = new Map(N.SET_ITEMS_DATA.map((s) => [s.id, s])); let orderDiff = 0; const bonusDiff = [];
  for (const o of O.SET_ITEMS_DATA) {
    const n = nm.get(o.id); if (!n) continue;
    if (JSON.stringify(o.pieces.map((p) => p.id)) !== JSON.stringify(n.pieces.slice(0, o.pieces.length).map((p) => p.id))) orderDiff++;
    const dp = diffLines(o.partialBonuses.map((x) => `${x.count}件${String(x.bonus).replace(/ \(\d\)$/, '')}`), n.partialBonuses.map((x) => `${x.count}件${x.bonus}`));
    const df = diffLines(o.fullBonuses.map((x) => String(x).replace(/ \(\d\)$/, '')), n.fullBonuses);
    if (dp.onlyOld.length || dp.onlyNew.length || df.onlyOld.length || df.onlyNew.length) bonusDiff.push({ id: o.id, name: o.name, partial: dp, full: df });
  }
  report['套裝-加成'] = { orderDiff, bonusDiffSets: bonusDiff.length, bonusDiff };
  console.log(`套裝加成：單件順序不同 ${orderDiff} 套；成套加成文字有差異 ${bonusDiff.length} 套`);
  for (const b of bonusDiff.slice(0, 6)) console.log(`   ${b.name}：部分 舊${JSON.stringify(b.partial.onlyOld)} 新${JSON.stringify(b.partial.onlyNew)}；全套 舊${JSON.stringify(b.full.onlyOld)} 新${JSON.stringify(b.full.onlyNew)}`);
}
scalars('符文之語', O.RUNEWORDS_DATA, N.RUNEWORDS_DATA, ['name', 'nameEn', 'nameClassic', 'runes', 'runeNumbers', 'sockets', 'requiredLevel', 'ladderOnly', 'isNewDLC', 'tags', 'recommendedBases', 'description']);
{
  const nm = new Map(N.RUNEWORDS_DATA.map((r) => [r.id, r])); const miss = [];
  for (const o of O.RUNEWORDS_DATA) { const n = nm.get(o.id); if (!n) continue; const a = new Set(o.allowedBases), b = new Set(n.allowedBases); const lost = [...a].filter((x) => !b.has(x)); if (lost.length) miss.push({ id: o.id, lost, old: o.allowedBases, new: n.allowedBases }); }
  report['符文之語-可用底材'] = miss; console.log(`符文之語可用底材：舊有、新版沒有 ${miss.length} 筆`, JSON.stringify(miss.slice(0, 5)));
}
scalars('底材', O.BASE_ITEMS_DATA, N.BASE_ITEMS_DATA, ['name', 'nameEn', 'category', 'itemType', 'grade', 'qualityTier', 'maxSockets', 'reqStr', 'reqDex', 'requiredStr', 'requiredDex', 'baseDamage', 'damage1h', 'damage2h', 'baseDefense', 'defense', 'speedGrade', 'attackSpeedModifier', 'larzukSockets', 'recommendedRunewords', 'tacticalNotes', 'dropRecommendation', 'isSuperiorValued', 'isEthPreferred', 'imageUrl']);
scalars('符文', O.RUNES_DATA, N.RUNES_DATA, ['name', 'nameEn', 'requiredLevel', 'cubeRecipe', 'weaponEffect', 'armorHelmEffect', 'shieldEffect'], (x) => x.number);
{
  // 技能：舊 id 對到新 id（相同 id 或別名），欄位與搜尋涵蓋
  const flatO = O.SKILLS_DATA.flatMap((c) => c.trees.flatMap((t) => t.skills.map((s) => ({ ...s, _class: c.characterClass }))));
  const flatN = N.SKILLS_DATA.flatMap((c) => c.trees.flatMap((t) => t.skills));
  const byId = new Map(flatN.map((s) => [s.id, s])); const byEn = new Map(flatN.map((s) => [s.nameEn.toLowerCase(), s]));
  let same = 0, viaOther = 0, lost = []; const detailsLost = []; const aliasLost = [];
  for (const o of flatO) {
    let n = byId.get(o.id) ?? byEn.get(o.nameEn.toLowerCase()); if (n) { if (n.id === o.id) same++; else viaOther++; }
    if (!n) { lost.push(`${o._class}:${o.name}`); continue; }
    if (o.details && !n.details) detailsLost.push(o.name);
    const names = [n.name, ...(n.aliases ?? [])].join('|'); if (!names.includes(o.name)) aliasLost.push(`${o.name}→${n.name}`);
  }
  report['技能'] = { old: flatO.length, new: flatN.length, sameId: same, otherId: viaOther, notInNew: lost, detailsLost, oldNamesNotSearchable: aliasLost };
  console.log(`技能：舊 ${flatO.length}／新 ${flatN.length}；同 id ${same}、他 id ${viaOther}；新版找不到 ${lost.length}（術士虛構技能）；戰術解析遺失 ${detailsLost.length}；舊名稱無法被搜尋 ${aliasLost.length}`);
  if (aliasLost.length) console.log('   ', aliasLost.slice(0, 10).join('、'));
  const trees = O.SKILLS_DATA.map((c) => `${c.characterClass}:${c.trees.map((t) => t.name).join('/')}`);
  report['技能-樹'] = { old: trees, new: N.SKILLS_DATA.map((c) => `${c.characterClass}:${c.trees.map((t) => t.name).join('/')}`) };
}

if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(report, null, 1));
