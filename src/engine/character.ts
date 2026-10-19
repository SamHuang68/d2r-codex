import { resolveModifier } from './modifiers';
import type { CharacterInput, CharacterResult, EquippedItem, GameData, StatEntry } from './types';

export const CLASS_INDEX = ['Amazon', 'Sorceress', 'Necromancer', 'Paladin', 'Barbarian', 'Druid', 'Assassin', 'Warlock'];
const DIFFICULTY_PENALTY = { normal: 0, nightmare: -40, hell: -100 } as const;
const ANYA_PER_DIFFICULTY = 10;
const RES_CAP = 75;
const RES_HARD_CAP = 95;
const BLOCK_CAP = 75;

const q = (n: number) => n / 4; // charstats 的「每點」數值以 1/4 為單位

/** 每等級屬性（op 2/3/4）：value × clvl / 2^op_param，加到 op_stat1 */
function perLevelAdd(data: GameData, stat: string, value: number, level: number): { target: string; add: number } | undefined {
  const d = data.stats[stat];
  if (!d || !d.op || ![2, 3, 4].includes(d.op) || !d.op_stat1) return undefined;
  // 遊戲逐件取整：Lv67 軍帽 12/8×67＝100.5 → 提示框顯示 +100（截圖驗證）
  return { target: d.op_stat1, add: Math.floor((value * level) / 2 ** (d.op_param ?? 0)) };
}

interface ItemCalc { item: EquippedItem; entries: StatEntry[] }

export function computeCharacter(data: GameData, input: CharacterInput): CharacterResult {
  const cs = data.charstats.find((c) => c.class === input.className);
  if (!cs) throw new Error(`未知職業 ${input.className}`);
  const level = input.level;
  const unhandled: CharacterResult['unhandled'] = [];
  const baseByCode = new Map(data.bases.map((b) => [b.code, b]));

  // 1. 展開所有 modifier → stat 條目
  const gemByCode = new Map(data.gems.map((g) => [g.code, g]));
  const calcs: ItemCalc[] = input.items.map((item) => {
    const entries: StatEntry[] = [];
    const base = baseByCode.get(item.baseCode);
    const cat: 'weapon' | 'shield' | 'armor' = base?.kind === 'weapon' ? 'weapon' : base?.ancestors.includes('shld') ? 'shield' : 'armor';
    const socketMods = (item.sockets ?? []).flatMap((c) => {
      const g = gemByCode.get(c);
      if (!g) { unhandled.push({ slot: item.slot, code: c, reason: `未知鑲嵌物 ${c}` }); return []; }
      return g[cat];
    });
    for (const m of [...item.mods, ...socketMods]) {
      const r = resolveModifier(m, data.properties, item.roll ?? 1);
      if (r.unresolved) unhandled.push({ slot: item.slot, code: m.code, reason: r.unresolved });
      else if (r.note && r.note.startsWith('未明確')) unhandled.push({ slot: item.slot, code: m.code, reason: r.note });
      entries.push(...r.entries);
    }
    return { item, entries };
  });
  const allEntries: StatEntry[] = [...calcs.flatMap((c) => c.entries), ...(input.extraStats ?? [])];

  // 2. 累加（無 param 的數值進 bag；有 param 的技能類另存）
  const bag: Record<string, number> = {};
  const perLevelLife = { hp: 0, mana: 0 };
  const add = (k: string, v: number) => { bag[k] = (bag[k] ?? 0) + v; };
  const skills: CharacterResult['skills'] = { all: 0, byClass: {}, byTab: {}, single: {} };
  const bucket = (e: StatEntry) => {
    const s = e.stat;
    if (s === 'item_allskills') { skills.all += e.value; return; }
    if (s === 'item_addclassskills') { const cn = CLASS_INDEX[Number(e.param)]; if (cn) skills.byClass[cn] = (skills.byClass[cn] ?? 0) + e.value; return; }
    if (s === 'item_addskill_tab') { const t = Number(e.param); skills.byTab[t] = (skills.byTab[t] ?? 0) + e.value; return; }
    if (s === 'item_singleskill' || s === 'item_nonclassskill') { const n = String(e.param); skills.single[n] = (skills.single[n] ?? 0) + e.value; return; }
    const pl = perLevelAdd(data, s, e.value, level);
    if (pl) {
      if (pl.target === 'maxhp') perLevelLife.hp += pl.add;
      else if (pl.target === 'maxmana') perLevelLife.mana += pl.add;
      else add(pl.target, pl.add);
      return;
    }
    if (e.param !== undefined) { add(`${s}:${e.param}`, e.value); return; }
    add(s, e.value);
  };
  allEntries.forEach(bucket);

  // 3. 四維
  const hard = {
    str: cs.str + input.allocated.str, dex: cs.dex + input.allocated.dex,
    vit: cs.vit + input.allocated.vit, ene: cs.int + input.allocated.ene,
  };
  const softBonus = (k: 'strength' | 'dexterity' | 'vitality' | 'energy') => Math.floor(bag[k] ?? 0);
  const total = {
    str: hard.str + softBonus('strength'), dex: hard.dex + softBonus('dexterity'),
    vit: hard.vit + softBonus('vitality'), ene: hard.ene + softBonus('energy'),
  };

  // 4. 生命／法力／耐力（順序：基礎＋等級＋硬點＋固定加成 → ×(1+IML%) → +依等級 → +軟點屬性；Maxroll）
  const startLife = cs.hpadd + cs.vit; // charstats：起始生命＝hpadd＋起始體力（與 7 職業公開數值一致）
  const baseLife = startLife + q(cs.LifePerLevel) * (level - 1) + q(cs.LifePerVitality) * (hard.vit - cs.vit);
  const iml = bag.item_maxhp_percent ?? 0;
  const questLife = (input.quests?.lifePotions ?? 0) * 20;
  const life = Math.floor((baseLife + (bag.maxhp ?? 0) + questLife) * (1 + iml / 100) + perLevelLife.hp + q(cs.LifePerVitality) * softBonus('vitality'));

  const startMana = cs.int; // 起始法力＝起始精力
  const baseMana = startMana + q(cs.ManaPerLevel) * (level - 1) + q(cs.ManaPerMagic) * (hard.ene - cs.int);
  const imm = bag.item_maxmana_percent ?? 0;
  const mana = Math.floor((baseMana + (bag.maxmana ?? 0)) * (1 + imm / 100) + perLevelLife.mana + q(cs.ManaPerMagic) * softBonus('energy'));

  const baseSta = cs.stamina + q(cs.StaminaPerLevel) * (level - 1) + q(cs.StaminaPerVitality) * (hard.vit - cs.vit);
  const stamina = Math.floor((baseSta + (bag.maxstamina ?? 0) + q(cs.StaminaPerVitality) * softBonus('vitality')) * (1 + (bag.item_staminapercent ?? 0) / 100));

  // 5. 防禦：逐件（底材 × 無形 × (1+強化防禦%)＋固定防禦），再加 敏捷/4
  let gearDefense = 0;
  for (const c of calcs) {
    const base = baseByCode.get(c.item.baseCode);
    let own = 0;
    if (base?.kind === 'armor' && base.minAc !== undefined && base.maxAc !== undefined) {
      let b = Math.floor(base.minAc + (base.maxAc - base.minAc) * (c.item.defRoll ?? 1));
      if (c.item.ethereal) b = Math.floor(b * 1.5);
      const pct = c.entries.filter((e) => e.stat === 'item_armor_percent').reduce((s, e) => s + e.value, 0);
      own = Math.floor(b * (1 + pct / 100));
    }
    own += c.entries.filter((e) => e.stat === 'armorclass').reduce((s, e) => s + e.value, 0);
    for (const e of c.entries) { const pl = perLevelAdd(data, e.stat, e.value, level); if (pl?.target === 'armorclass') own += Math.floor(pl.add); }
    gearDefense += own;
  }
  const extraDef = (input.extraStats ?? []).filter((e) => e.stat === 'armorclass').reduce((s, e) => s + e.value, 0);
  const defense = gearDefense + extraDef + Math.floor(total.dex / 4);

  // 6. 格擋：min(75, floor((盾牌格擋＋提高格擋＋職業係數) × (敏捷−15) / (2×等級)))；需裝備盾牌
  let blockChance = 0;
  const shield = calcs.find((c) => c.item.slot === 'shield' && baseByCode.get(c.item.baseCode)?.block !== undefined);
  if (shield) {
    const sb = baseByCode.get(shield.item.baseCode)?.block ?? 0;
    const sum = sb + (bag.toblock ?? 0) + cs.BlockFactor;
    blockChance = Math.max(0, Math.min(BLOCK_CAP, Math.floor((sum * (total.dex - 15)) / (2 * level))));
  }

  // 7. 抗性
  const diff = input.difficulty ?? 'hell';
  const idx = diff === 'normal' ? 0 : diff === 'nightmare' ? 1 : 2;
  const anya = (input.anyaScrolls ?? idx + 1) * ANYA_PER_DIFFICULTY;
  const penalty = DIFFICULTY_PENALTY[diff];
  const resKinds = [['fire', 'fireresist', 'maxfireresist'], ['cold', 'coldresist', 'maxcoldresist'], ['lightning', 'lightresist', 'maxlightresist'], ['poison', 'poisonresist', 'maxpoisonresist']] as const;
  const resist = {} as CharacterResult['resist']; const maxResist = {} as CharacterResult['maxResist']; const rawResist = {} as CharacterResult['rawResist'];
  for (const [k, rs, mx] of resKinds) {
    const cap = Math.min(RES_HARD_CAP, RES_CAP + (bag[mx] ?? 0));
    const raw = penalty + anya + (bag[rs] ?? 0);
    rawResist[k] = raw; maxResist[k] = cap; resist[k] = Math.min(cap, raw);
  }

  // 8. 武器傷害（主手）：base×(1+強化傷害%＋屬性加成%)＋固定傷害
  let weaponDamage: CharacterResult['weaponDamage'];
  const wc = calcs.find((c) => c.item.slot === 'weapon');
  const wb = wc && baseByCode.get(wc.item.baseCode);
  if (wc && wb?.kind === 'weapon' && wb.maxDam !== undefined) {
    const two = wb.twoHanded && wb.minDam2h !== undefined;
    let mn = (two ? wb.minDam2h : wb.minDam) ?? 0; let mx = (two ? wb.maxDam2h : wb.maxDam) ?? 0;
    if (wc.item.ethereal) { mn = Math.floor(mn * 1.5); mx = Math.floor(mx * 1.5); }
    const statPct = ((wb.strBonus ?? 0) * total.str + (wb.dexBonus ?? 0) * total.dex) / 100;
    const mult = (ed: number) => 1 + (ed + statPct) / 100;
    weaponDamage = {
      slot: 'weapon',
      min: Math.floor(mn * mult(bag.item_mindamage_percent ?? 0)) + (bag.mindamage ?? 0),
      max: Math.floor(mx * mult(bag.item_maxdamage_percent ?? 0)) + (bag.maxdamage ?? 0),
    };
  }

  // 9. 需求檢查（底材需求；暗金／套裝等級需求由 item.requiredLevel 提供）
  const requirementsUnmet: CharacterResult['requirementsUnmet'] = [];
  for (const c of calcs) {
    const b = baseByCode.get(c.item.baseCode); if (!b) continue;
    if ((b.reqStr ?? 0) > total.str) requirementsUnmet.push({ slot: c.item.slot, need: `力量 ${b.reqStr}` });
    if ((b.reqDex ?? 0) > total.dex) requirementsUnmet.push({ slot: c.item.slot, need: `敏捷 ${b.reqDex}` });
    const lr = c.item.requiredLevel ?? 0; if (lr > level) requirementsUnmet.push({ slot: c.item.slot, need: `等級 ${lr}` });
  }

  return { attributes: total, life, mana, stamina, defense, blockChance, resist, maxResist, rawResist, skills, weaponDamage, requirementsUnmet, stats: bag, unhandled };
}
