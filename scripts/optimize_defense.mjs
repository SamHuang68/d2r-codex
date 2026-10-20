// 減傷配裝的搜尋工具（離線執行，結果手動寫入 src/data/simulatorPresets.ts 的 TANK_*）。
// 用法：node scripts/optimize_defense.mjs [--max] [流派 id …]；不帶參數就跑全部流派（平衡版：不降輸出）。
//       --max：極致版，不設輸出條件，只要求裝備需求滿足；武器與盾保持不動（用於技能綁定武器的流派，其餘流派的極致組合見 TANK_MAX）。
//
// 目的：為每個流派找出「不降低輸出能力、盡量提高生存」的裝備替換（效率平衡版），以及不顧輸出的極致減傷組合。
// 評分：有效生命（物理）＝生命 ÷ (1 − 物理傷害減免%，上限 50)；有效生命（元素）＝生命 ÷ (1 − 最低元素抗性%)；
//       兩者取調和平均，再加魔法傷害減免與固定傷害減免的小量加權；裝備需求沒滿足者大幅扣分。
// 輸出能力的代理指標（效率平衡版必須不低於頂裝）：全技能／本職業／各技能樹／單項技能（含傳送術）的裝備加成、快速施法（FCR）、攻擊速度（IAS）、
//       武器與盾保持不動（它們通常就是輸出與施法速度的來源）。
// 限制：這是依引擎數值搜尋的結果，不是社群公認配裝；引擎沒有 FCR／IAS 斷點影格、傭兵與召喚物，結果只能當起點。
import { build } from 'esbuild'; import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { pathToFileURL } from 'node:url';

const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'def-')), 'e.mjs');
await build({ stdin: { contents: "export * from './src/engine/catalog'; export * from './src/engine/data'; export * from './src/engine/build'; export * from './src/engine/index'; export * from './src/engine/alloc'; export * from './src/engine/skills'; export * from './src/data/presetResolver'; export * from './src/data/simulatorPresets';", resolveDir: process.cwd(), loader: 'ts' }, bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error', loader: { '.json': 'json' } });
const E = await import(pathToFileURL(out).href);

const uniq = JSON.parse(fs.readFileSync('src/data/game/uniques.json', 'utf8')); const unspawn = new Set(uniq.filter((u) => u.spawnable === false).map((u) => u.nameEn));
const baseByCode = new Map(E.gameData.bases.map((b) => [b.code, b]));
const CLASS_EN = E.ENGINE_CLASS_BY_CODE;
const FREE = ['head', 'neck', 'body', 'gloves', 'belt', 'ring1', 'ring2', 'boots'];
const kindOf = (s) => (s === 'ring1' || s === 'ring2' ? 'ring' : s);

function evalSet(b, level, items, charms, rest, blockTarget) {
  const eng = [];
  for (const [sl, e] of Object.entries(items)) { if (!e) continue; eng.push(E.buildEngineItem({ entry: e.entry ?? e, ethereal: e.ethereal, sockets: e.sockets }, (e.entry ?? e).slot === 'weapon' ? (sl.startsWith('shield') ? 'weapon2' : 'weapon') : (e.entry ?? e).slot === 'shield' ? 'shield' : sl, true)); }
  charms.forEach((c, i) => eng.push(E.buildEngineItem({ entry: c }, 'charm' + i, true)));
  const reqs = { str: Math.max(0, ...eng.map((i) => baseByCode.get(i.baseCode)?.reqStr ?? 0)), dex: Math.max(0, ...eng.map((i) => baseByCode.get(i.baseCode)?.reqDex ?? 0)) };
  const input = { className: CLASS_EN[b.classCode], level, items: eng, difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } };
  const alloc = E.autoAllocate(E.gameData, input, { totalPoints: (level - 1) * 5 + 15, blockTarget, rest }, reqs);
  const r = E.computeCharacter(E.gameData, { ...input, allocated: alloc });
  const main = E.skillByName(b.skill.main);
  const bonus = r.skills.all + (r.skills.byClass[CLASS_EN[b.classCode]] ?? 0) + (r.skills.byTab[E.tabId(main.charClass, main.page)] ?? 0) + (r.skills.single[main.nameEn] ?? 0);
  const pdr = Math.min(50, r.stats.damageresist ?? 0);
  const ephys = r.life / (1 - pdr / 100);
  const minRes = Math.max(0, Math.min(r.resist.fire, r.resist.cold, r.resist.lightning, r.resist.poison));
  const eelem = r.life / (1 - Math.min(minRes, 95) / 100);
  const harm = 2 / (1 / ephys + 1 / eelem);
  const unmet = r.requirementsUnmet.length;
  const score = harm + (r.stats.magic_damage_reduction ?? 0) * 8 + (r.stats.normal_damage_reduction ?? 0) * 10 - unmet * 5000;
  return { score, skills: r.skills, life: r.life, pdr, ephys: Math.round(ephys), eelem: Math.round(eelem), minRes, bonus, fcr: r.stats.item_fastercastrate ?? 0, ias: r.stats.item_fasterattackrate ?? 0, mdr: r.stats.magic_damage_reduction ?? 0, unmet, block: r.blockChance, res: r.resist, defense: r.defense };
}

function pools(b, level) {
  const cat = E.getCatalog().filter((e) => e.kind !== 'base' && (!e.classCode || e.classCode === b.classCode) && (e.levelReq ?? 0) <= level && !unspawn.has(e.nameEn));
  const p = {};
  for (const sl of FREE) {
    const k = kindOf(sl);
    const scored = cat.filter((e) => e.slot === k).map((e) => {
      const it = E.buildEngineItem({ entry: e }, e.slot, true);
      const r = E.computeCharacter(E.gameData, { className: CLASS_EN[b.classCode], level, allocated: { str: 0, dex: 0, vit: 0, ene: 0 }, items: [it], difficulty: 'hell' }); const s = r.stats; const rr = r.rawResist;
      return { e, p: (s.damageresist ?? 0) * 3 + (s.normal_damage_reduction ?? 0) * 2 + (s.magic_damage_reduction ?? 0) * 1.5 + (rr.fire + rr.cold + rr.lightning + rr.poison) * 0.3 + ((s.maxfireresist ?? 0) + (s.maxcoldresist ?? 0) + (s.maxlightresist ?? 0) + (s.maxpoisonresist ?? 0)) * 3 + (s.maxhp ?? 0) * 0.25 };
    }).sort((a, b2) => b2.p - a.p).slice(0, 14).map((x) => x.e);
    p[sl] = scored;
  }
  return p;
}

const MAX = process.argv.includes('--max');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const result = {};
for (const b of E.BUILDS) {
  if (only.length && !only.includes(b.id)) continue;
  const preset = E.SIM_PRESETS.find((x) => x.id === `${b.id}:bis`);
  const level = preset.level;
  const r0 = E.resolvePreset(preset);
  const items = {}; for (const [k, v] of Object.entries(r0.equipped)) if (!k.endsWith('II')) items[k] = v;
  const charms = r0.charms;
  const blockTarget = b.blockTarget; const rest = b.rest;
  const baseline = evalSet(b, level, items, charms, rest, blockTarget);
  const pl = pools(b, level);
  let cur = { ...items }; let best = baseline;
  // 技能加成一項都不能少（含傳送術等單項技能）：全技能、本職業、各技能樹、單項技能都不低於頂裝
  const skillsOk = (a, base) => a.all >= base.all && Object.entries(base.byClass).every(([k, v]) => (a.byClass[k] ?? 0) >= v) && Object.entries(base.byTab).every(([k, v]) => (a.byTab[k] ?? 0) >= v) && Object.entries(base.single).every(([k, v]) => (a.single[k] ?? 0) >= v);
  const ok = (ev) => MAX ? ev.unmet === 0 : ev.unmet === 0 && ev.bonus >= baseline.bonus && ev.fcr >= baseline.fcr && ev.ias >= baseline.ias && skillsOk(ev.skills, baseline.skills);
  for (let pass = 0; pass < 3; pass++) {
    let improved = false;
    for (const sl of FREE) {
      for (const cand of pl[sl]) {
        if (cur[sl]?.entry?.id === cand.id) continue;
        const next = { ...cur, [sl]: { entry: cand } };
        const ev = evalSet(b, level, next, charms, rest, blockTarget);
        if (ok(ev) && ev.score > best.score + 1) { cur = next; best = ev; improved = true; }
      }
    }
    if (!improved) break;
  }
  const changes = {};
  for (const sl of FREE) if ((cur[sl]?.entry?.id) !== (items[sl]?.entry?.id)) { const e = cur[sl].entry; changes[sl] = e.kind === 'runeword' ? { nameEn: e.nameEn, baseNameEn: e.baseNameEn } : { nameEn: e.nameEn }; }
  result[b.id] = { changes, baseline: { life: baseline.life, pdr: baseline.pdr, ephys: baseline.ephys, eelem: baseline.eelem, minRes: baseline.minRes, bonus: baseline.bonus, fcr: baseline.fcr, ias: baseline.ias }, best: { life: best.life, pdr: best.pdr, ephys: best.ephys, eelem: best.eelem, minRes: best.minRes, bonus: best.bonus, fcr: best.fcr, ias: best.ias } };
  console.log(b.id, JSON.stringify(result[b.id]));
}
