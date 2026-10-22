import hirelingJson from '../data/game/hireling.json';
import { actZh } from '../utils/actLabel';
import { expandItem, hasWeaponDamage, itemDefenseOf, perLevelAdd, setBonusEntries, weaponRangeOf } from './character';
import { skillByName, type GameSkill } from './skills';
import type { CharacterResult, EquippedItem, GameData, StatEntry } from './types';

/**
 * 傭兵。資料來自遊戲 hireling.txt 的擴充版資料（資料管線輸出 hireling.json）。
 *
 * 成長規則：每個類型有幾個「等級檢查點」（rows）。傭兵等級落在兩個檢查點之間時，取最接近的下方檢查點，
 * 加上每級成長外推。每級成長的單位由相鄰檢查點驗證過（見 scripts/test_engine.mjs）：
 *   生命、防禦、命中 ×1；力量、敏捷 ÷8 進位；傷害 ÷8 四捨五入；抗性 ÷4 進位；技能等級 ÷32 進位；技能施放機率 ÷4 進位。
 * 外推到下一個檢查點時，防禦與抗性會有幾點的不連續（資料表本身如此），不是計算錯誤。
 * 遊戲內實測值沒有核對過；傭兵等級不能低於該難度的第一個檢查點（雇得到的最低等級）。
 */
export interface HireSkill { nameEn: string; name: string; mode: number; chance: number; chanceLvl: number; level: number; levelLvl: number }
export interface HireRow {
  level: number; hp: number; hpLvl: number; def: number; defLvl: number; str: number; strLvl: number; dex: number; dexLvl: number;
  ar: number; arLvl: number; dmgMin: number; dmgMax: number; dmgLvl: number;
  res: { fire: [number, number]; cold: [number, number]; lightning: [number, number]; poison: [number, number] };
  skills: HireSkill[];
}
export interface Hireling {
  id: number; ids: number[]; hireling: string; subType: string; act: number; difficulty: 1 | 2 | 3;
  typeZh: string; desc: string; class?: string; maxLevelDiff: number; rows: HireRow[];
}

export const HIRELINGS = hirelingJson as unknown as Hireling[];
const byId = new Map<number, Hireling>(HIRELINGS.flatMap((h) => h.ids.map((id) => [id, h] as [number, Hireling])));
export const hirelingById = (id: number): Hireling | undefined => byId.get(id);
export const DIFFICULTY_ZH: Record<number, string> = { 1: '普通', 2: '惡夢', 3: '地獄' };
export const hirelingLabel = (h: Hireling): string => `${actZh(h.act)} ${h.typeZh}・${h.desc}（${DIFFICULTY_ZH[h.difficulty]}）`;
/** 這個類型雇得到的最低等級（第一個檢查點） */
export const hirelingMinLevel = (h: Hireling): number => h.rows[0].level;
export const MERC_MAX_LEVEL = 99;
export const clampMercLevel = (h: Hireling, level: number): number => Math.max(hirelingMinLevel(h), Math.min(MERC_MAX_LEVEL, Math.round(level) || hirelingMinLevel(h)));

export interface MercSkillAt { nameEn: string; name: string; mode: number; level: number; chance: number }
export interface MercBase {
  /** 外推用的檢查點等級 */
  rowLevel: number;
  life: number; defense: number; ar: number; str: number; dex: number;
  damage: { min: number; max: number };
  resist: { fire: number; cold: number; lightning: number; poison: number };
  skills: MercSkillAt[];
}

/** 從一個檢查點往上外推到指定等級（等級不得低於該檢查點） */
export function mercBaseFromRow(row: HireRow, lv: number): MercBase {
  const dl = lv - row.level;
  const res = (p: [number, number]) => p[0] + Math.ceil((p[1] * dl) / 4);
  return {
    rowLevel: row.level,
    life: row.hp + row.hpLvl * dl, defense: row.def + row.defLvl * dl, ar: row.ar + row.arLvl * dl,
    str: row.str + Math.ceil((row.strLvl * dl) / 8), dex: row.dex + Math.ceil((row.dexLvl * dl) / 8),
    damage: { min: row.dmgMin + Math.round((row.dmgLvl * dl) / 8), max: row.dmgMax + Math.round((row.dmgLvl * dl) / 8) },
    resist: { fire: res(row.res.fire), cold: res(row.res.cold), lightning: res(row.res.lightning), poison: res(row.res.poison) },
    skills: row.skills.map((s) => ({ nameEn: s.nameEn, name: s.name, mode: s.mode, level: s.level + Math.ceil((s.levelLvl * dl) / 32), chance: s.chance + Math.ceil((s.chanceLvl * dl) / 4) })),
  };
}

/** 傭兵等級 → 基礎數值（未穿裝備）：取最接近的下方檢查點外推 */
export function mercBaseAt(h: Hireling, level: number): MercBase {
  const lv = clampMercLevel(h, level);
  let row = h.rows[0];
  for (const r of h.rows) if (r.level <= lv) row = r;
  return mercBaseFromRow(row, lv);
}

export interface MercAura { skill: GameSkill; level: number; source: 'native' | 'item' }
export interface MercResult {
  hireling: Hireling; level: number; base: MercBase;
  life: number; defense: number; ar: number; str: number; dex: number;
  /** 抗性（已套用上限 75＋最大抗性加成） */
  resist: { fire: number; cold: number; lightning: number; poison: number };
  /** 未截斷的抗性（基礎＋裝備） */
  rawResist: { fire: number; cold: number; lightning: number; poison: number };
  /** 武器傷害（含強化傷害、力量敏捷加成）；沒武器時沒有 */
  weaponDamage?: { min: number; max: number; twoHanded: boolean };
  /** 其他裝備提供的數值（已合計），供顯示 */
  bonuses: StatEntry[];
  auras: MercAura[];
  unhandled: CharacterResult['unhandled'];
}

const RES = [['fire', 'fireresist', 'maxfireresist'], ['cold', 'coldresist', 'maxcoldresist'], ['lightning', 'lightresist', 'maxlightresist'], ['poison', 'poisonresist', 'maxpoisonresist']] as const;
const RES_CAP = 75;
/** 顯示「其他裝備提供的數值」時要列出的屬性（沒有對應欄位的才列，生命／防禦／抗性／力敏另有專屬欄） */
const BONUS_STATS = ['item_fasterattackrate', 'item_fastergethitrate', 'lifedrainmindam', 'manadrainmindam', 'item_crushingblow', 'item_deadlystrike', 'item_openwounds', 'item_magicbonus', 'damageresist', 'normal_damage_reduction', 'magic_damage_reduction', 'item_cannotbefrozen', 'item_slow', 'item_attackertakesdamage', 'item_tohit_percent'];

/**
 * 傭兵 ＋ 最多三件裝備（頭盔、護甲、武器）→ 數值。裝備展開、防禦與武器傷害和玩家共用同一組公式。
 * 沒有納入的規則（遊戲內有，但沒有可核對的來源）：敏捷帶來的防禦、命中率公式、傭兵本身傷害與武器傷害如何合併。
 */
export function computeMercenary(data: GameData, input: { hireling: Hireling; level: number; items: EquippedItem[] }): MercResult {
  const { hireling } = input; const level = clampMercLevel(hireling, input.level);
  const base = mercBaseAt(hireling, level);
  const unhandled: CharacterResult['unhandled'] = [];
  const calcs = input.items.map((item) => expandItem(data, item, unhandled));
  const setBonus = setBonusEntries(data, input.items, unhandled);
  const bag: Record<string, number> = {}; const perLevelLife = { hp: 0 };
  const add = (k: string, v: number) => { bag[k] = (bag[k] ?? 0) + v; };
  const auraLevels = new Map<string, number>();
  for (const e of [...calcs.flatMap((c) => c.entries), ...setBonus.entries]) {
    if (e.stat === 'item_aura' && typeof e.param === 'string') { auraLevels.set(e.param, Math.max(auraLevels.get(e.param) ?? 0, e.value)); continue; }
    const pl = perLevelAdd(data, e.stat, e.value, level);
    if (pl) { if (pl.target === 'maxhp') perLevelLife.hp += pl.add; else add(pl.target, pl.add); continue; }
    if (e.param !== undefined) continue;
    add(e.stat, e.value);
  }
  const baseByCode = new Map(data.bases.map((b) => [b.code, b]));
  let gearDefense = 0;
  for (const c of calcs) gearDefense += itemDefenseOf(data, baseByCode.get(c.item.baseCode), c, level);
  // 套裝加成的固定防禦不屬於任何一件，另外加上
  const setDefense = setBonus.entries.filter((e) => e.stat === 'armorclass').reduce((s, e) => s + e.value, 0);

  const str = base.str + Math.floor(bag.strength ?? 0); const dex = base.dex + Math.floor(bag.dexterity ?? 0);
  const life = Math.floor((base.life + (bag.maxhp ?? 0)) * (1 + (bag.item_maxhp_percent ?? 0) / 100) + perLevelLife.hp);
  const ar = Math.floor((base.ar + (bag.tohit ?? 0)) * (1 + (bag.item_tohit_percent ?? 0) / 100));

  const resist = {} as MercResult['resist']; const rawResist = {} as MercResult['rawResist'];
  for (const [k, stat, maxStat] of RES) {
    rawResist[k] = base.resist[k] + (bag[stat] ?? 0);
    resist[k] = Math.min(RES_CAP + (bag[maxStat] ?? 0), rawResist[k]);
  }

  let weaponDamage: MercResult['weaponDamage'];
  const wi = input.items.find((i) => i.slot === 'weapon'); const wb = wi && baseByCode.get(wi.baseCode);
  if (wi && hasWeaponDamage(wb)) {
    const r = weaponRangeOf(wb, wi.ethereal, str, dex, { minPct: bag.item_mindamage_percent ?? 0, maxPct: bag.item_maxdamage_percent ?? 0, minFlat: bag.mindamage ?? 0, maxFlat: bag.maxdamage ?? 0 });
    weaponDamage = { ...r, twoHanded: !!(wb.twoHanded && wb.minDam2h !== undefined) };
  }

  const auras: MercAura[] = [];
  const addAura = (name: string, lvl: number, source: MercAura['source']) => {
    const sk = skillByName(name); if (!sk?.auraStats) return;
    const cur = auras.find((a) => a.skill.id === sk.id);
    if (cur) { if (lvl > cur.level) { cur.level = lvl; cur.source = source; } } else auras.push({ skill: sk, level: lvl, source });
  };
  for (const s of base.skills) if (s.mode === 1) addAura(s.nameEn, s.level, 'native');
  for (const [name, lvl] of auraLevels) addAura(name, lvl, 'item');

  const bonuses = BONUS_STATS.map((stat) => ({ stat, value: bag[stat] ?? 0 })).filter((b) => b.value);
  return { hireling, level, base, life, defense: base.defense + gearDefense + setDefense, ar, str, dex, resist, rawResist, weaponDamage, bonuses, auras, unhandled };
}
