import cubeJson from '../game/cube.json';
import basesJson from '../game/bases.json';
import gemsJson from '../game/gems.json';
import { describeRanges } from '../../engine/describe';
import type { Modifier } from '../../engine/types';

export type CraftFamilyId = 'blood' | 'caster' | 'hitpower' | 'safety';
export type CraftSlotId = 'helm' | 'body' | 'shield' | 'gloves' | 'boots' | 'belt' | 'weapon' | 'amulet' | 'ring';

export interface CraftFamilyMeta {
  id: CraftFamilyId;
  label: string;
  labelEn: string;
  gemCode: string;
  gemName: string;
  gemNameEn: string;
  theme: string;
  themeEn: string;
  accent: string;
  badgeCls: string;
}

export const CRAFT_FAMILIES: CraftFamilyMeta[] = [
  {
    id: 'blood',
    label: '血腥系',
    labelEn: 'Blood',
    gemCode: 'gpr',
    gemName: '完美紅寶石',
    gemNameEn: 'Perfect Ruby',
    theme: '固定附帶生命偷取、生命與近戰輸出（壓碎、致命打擊、撕裂傷口）',
    themeEn: 'Fixed Life Leech, Life, and melee offense (Crushing Blow, Deadly Strike, Open Wounds)',
    accent: 'text-red-400',
    badgeCls: 'bg-red-950/60 text-red-300 border-red-500/40',
  },
  {
    id: 'caster',
    label: '施法系',
    labelEn: 'Caster',
    gemCode: 'gpv',
    gemName: '完美紫寶石',
    gemNameEn: 'Perfect Amethyst',
    theme: '固定附帶法力、法力回復與施法速度（FCR）／擊殺回魔',
    themeEn: 'Fixed Mana, Mana Regen, Faster Cast Rate (FCR), and Mana After Each Kill',
    accent: 'text-purple-300',
    badgeCls: 'bg-purple-950/60 text-purple-200 border-purple-500/40',
  },
  {
    id: 'hitpower',
    label: '重擊系',
    labelEn: 'Hit Power',
    gemCode: 'gpb',
    gemName: '完美藍寶石',
    gemNameEn: 'Perfect Sapphire',
    theme: '固定附帶受擊施放冰霜新星、反傷與擊退（弓馬／標馬手套核心）',
    themeEn: 'Fixed Frost Nova when struck, Attacker Takes Damage, and Knockback (Bowazon gloves)',
    accent: 'text-sky-300',
    badgeCls: 'bg-sky-950/60 text-sky-200 border-sky-500/40',
  },
  {
    id: 'safety',
    label: '防護系',
    labelEn: 'Safety',
    gemCode: 'gpg',
    gemName: '完美綠寶石',
    gemNameEn: 'Perfect Emerald',
    theme: '固定附帶固定物理減傷、魔法減傷、防禦強化與單項抗性／格擋',
    themeEn: 'Fixed Flat Physical & Magic Damage Reduction, Enhanced Defense, Resistances, and Block',
    accent: 'text-emerald-300',
    badgeCls: 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40',
  },
];

export const CRAFT_SLOTS: { id: CraftSlotId; label: string; labelEn: string }[] = [
  { id: 'amulet', label: '項鍊', labelEn: 'Amulet' },
  { id: 'ring', label: '戒指', labelEn: 'Ring' },
  { id: 'gloves', label: '手套', labelEn: 'Gloves' },
  { id: 'belt', label: '腰帶', labelEn: 'Belt' },
  { id: 'boots', label: '靴子', labelEn: 'Boots' },
  { id: 'helm', label: '頭盔', labelEn: 'Helm' },
  { id: 'body', label: '盔甲', labelEn: 'Body Armor' },
  { id: 'shield', label: '盾牌', labelEn: 'Shield' },
  { id: 'weapon', label: '武器', labelEn: 'Weapon' },
];

export interface CraftedRecipeEntry {
  id: string;
  row: number;
  family: CraftFamilyId;
  slot: CraftSlotId;
  name: string;
  nameEn: string;
  /** 可用的魔法底材清單（一般／進階／菁英三階名稱，皆取自遊戲資料） */
  bases: string[];
  basesEn: string[];
  /** 是否為泛用武器類型（如鈍器、斧、法杖類、長矛） */
  isWeaponType: boolean;
  runeCode: string;
  runeNumber: number;
  runeName: string;
  runeNameEn: string;
  gemCode: string;
  gemName: string;
  gemNameEn: string;
  /** 固定手工屬性（繁中／英文，由遊戲資料 describeRanges 產生） */
  fixedMods: string[];
  fixedModsEn: string[];
  /** 熱門終局手工推薦標記（選填） */
  highlight?: { tag: string; tagEn: string; tip: string; tipEn: string };
}

interface RawCubeRow {
  row: number;
  description: string;
  inputs: string[];
  output: string;
  plvl?: number;
  ilvl?: number;
  mods: Modifier[];
}

interface RawBaseRow {
  code: string;
  name: string;
  nameEn: string;
  ubercode?: string;
  ultracode?: string;
}

interface RawGemRow {
  code: string;
  name?: string;
  nameEn: string;
}

const NON_BASE_INPUTS: Record<string, { zh: string[]; en: string[]; weapon: boolean }> = {
  amul: { zh: ['魔法項鍊'], en: ['Magic Amulet'], weapon: false },
  ring: { zh: ['魔法戒指'], en: ['Magic Ring'], weapon: false },
  blun: { zh: ['魔法鈍器（棍棒／釘頭鎚／戰鎚／權杖／法杖／魔杖）'], en: ['Magic Blunt Weapon (Clubs, Maces, Hammers, Scepters, Staves, Wands)'], weapon: true },
  axe: { zh: ['魔法斧類武器'], en: ['Magic Axe'], weapon: true },
  rod: { zh: ['魔法法杖類（法杖／魔杖／權杖）'], en: ['Magic Rod (Staves, Wands, Scepters)'], weapon: true },
  spea: { zh: ['魔法長矛類武器'], en: ['Magic Spear'], weapon: true },
};

const SLOT_ZH: Record<CraftSlotId, string> = {
  helm: '頭盔',
  body: '盔甲',
  shield: '盾牌',
  gloves: '手套',
  boots: '靴子',
  belt: '腰帶',
  weapon: '武器',
  amulet: '項鍊',
  ring: '戒指',
};

const FAMILY_ZH: Record<CraftFamilyId, string> = {
  blood: '血腥',
  caster: '施法',
  hitpower: '重擊',
  safety: '防護',
};

const HIGHLIGHTS: Record<string, CraftedRecipeEntry['highlight']> = {
  caster_amulet: {
    tag: '2/20 畢業首選',
    tagEn: '+2/20 FCR BiS',
    tip: '全法系頂級項鍊來源。角色 93 級以上賭博項鍊再合成，保證成品 ilvl ≥ 90，可骰出 +2 職業技能與累計最高 20% FCR。',
    tipEn: 'Top caster amulet craft. Gamble and craft at clvl 93+ to guarantee ilvl ≥ 90 for +2 Class Skills and up to 20% total FCR.',
  },
  blood_gloves: {
    tag: '10% CB 近戰神手',
    tagEn: '10% CB Melee BiS',
    tip: '近戰、雙熱、標馬打王神物。固定 5–10% 壓碎打擊與吸血，可同時骰出 +2 技能樹與 20% IAS。',
    tipEn: 'Premier melee & boss-hunting gloves. Fixed 5–10% Crushing Blow + Life Leech, can roll +2 Skill Tab and 20% IAS.',
  },
  blood_ring: {
    tag: '力血雙吸神戒',
    tagEn: 'Melee Dual-Leech',
    tip: '物理系近戰最常洗的手工戒。固定 +1–5 力量、吸血與生命，可疊出高達 25 力量、11% 吸血與 60 生命。',
    tipEn: 'Staple physical melee ring craft. Fixed Str, Life Leech, and Life can stack up to 25 Str, 11% LL, and 60 Life.',
  },
  caster_belt: {
    tag: 'FCR 斷點腰帶',
    tagEn: 'FCR Breakpoint Belt',
    tip: '缺乏蜘蛛之網或需要補 5–10% FCR 過斷點時的最佳選擇，同時可洗出 24% FHR、高生命與抗性。',
    tipEn: 'Ideal when needing 5–10% FCR to hit a breakpoint alongside 24% FHR, Life, and Resistances.',
  },
  hitpower_gloves: {
    tag: '弓馬擊退神手',
    tagEn: 'Bowazon Knockback',
    tip: '全遊戲唯一穩定附帶「擊退」的手套手工配方，配合 +2 弓／被動技能與 20% IAS 是物理弓馬畢業裝。',
    tipEn: 'Only glove craft with guaranteed Knockback; paired with +2 Bow/Passive Skills and 20% IAS for physical Bowazons.',
  },
  caster_ring: {
    tag: '高魔力施法戒',
    tagEn: 'High-Mana Caster Ring',
    tip: '能量護盾（ES）法師極佳選擇，固定法力與回魔可搭配 10% FCR 與高法力詞綴。',
    tipEn: 'Strong pick for Energy Shield Sorceresses; stacks fixed Mana & Mana Regen with 10% FCR and +Mana affixes.',
  },
  blood_boots: {
    tag: '三抗回血靴',
    tagEn: 'Tri-Res Regen Boots',
    tip: '可洗出 30% 跑速、10% FHR、三抗加上固定生命與生命回復，適合專家級與 PvP。',
    tipEn: 'Can roll 30% FRW, 10% FHR, and Tri-Res on top of fixed Life and Life Replenish.',
  },
  safety_amulet: {
    tag: '最高 10% 格擋鍊',
    tagEn: 'Max-Block Amulet',
    tip: '自帶 1–10% 格擋機率，能大幅節省滿格擋所需敏捷點數，專家級與 PvP 聖騎士／法師常用。',
    tipEn: 'Innate 1–10% Increased Chance of Blocking saves heavy Dexterity for Max Block in Hardcore & PvP.',
  },
};

function parseFamilyAndSlot(desc: string): { family: CraftFamilyId; slot: CraftSlotId; nameEn: string } | null {
  const after = desc.split('->')[1]?.trim() ?? '';
  const m = after.match(/^(Hit Power|Blood|Caster|Safety)\s+(Helm|Boots|Gloves|Belt|Shield|Body|Amulet|Ring|Weapon)$/i);
  if (!m) return null;
  const famMap: Record<string, CraftFamilyId> = {
    'hit power': 'hitpower',
    blood: 'blood',
    caster: 'caster',
    safety: 'safety',
  };
  const family = famMap[m[1].toLowerCase()];
  const slot = m[2].toLowerCase() as CraftSlotId;
  const slotEn = slot === 'body' ? 'Body Armor' : m[2];
  return { family, slot, nameEn: `${m[1]} ${slotEn}` };
}

let cached: CraftedRecipeEntry[] | undefined;

/** 由遊戲資料 src/data/game/cube.json 動態解析全部 36 條手工合成配方（4 系列 × 9 部位） */
export function getAllCraftedRecipes(): CraftedRecipeEntry[] {
  if (cached) return cached;
  const bases = basesJson as unknown as RawBaseRow[];
  const gems = gemsJson as unknown as RawGemRow[];
  const cube = cubeJson as unknown as RawCubeRow[];
  const baseByCode = new Map(bases.map((b) => [b.code, b]));
  const gemByCode = new Map(gems.map((g) => [g.code, g]));

  const out: CraftedRecipeEntry[] = [];
  for (const r of cube) {
    if (!/crf/.test(r.output)) continue;
    const parsed = parseFamilyAndSlot(r.description);
    if (!parsed) continue;
    const { family, slot, nameEn } = parsed;

    const rawBaseCode = (r.inputs[0] ?? '').replace(/^"|"$/g, '').split(',')[0].trim();
    const nonBase = NON_BASE_INPUTS[rawBaseCode];
    let baseListZh: string[];
    let baseListEn: string[];
    let isWeaponType = false;
    if (nonBase) {
      baseListZh = nonBase.zh;
      baseListEn = nonBase.en;
      isWeaponType = nonBase.weapon;
    } else {
      const b = baseByCode.get(rawBaseCode);
      const exc = b?.ubercode ? baseByCode.get(b.ubercode) : undefined;
      const eli = b?.ultracode ? baseByCode.get(b.ultracode) : undefined;
      const chain = [b, exc, eli].filter((x): x is RawBaseRow => Boolean(x));
      baseListZh = chain.map((x) => x.name);
      baseListEn = chain.map((x) => x.nameEn);
    }

    const runeCode = (r.inputs[2] ?? '').trim();
    const runeNum = Number(runeCode.replace(/^r/, '')) || 0;
    const runeGem = gemByCode.get(runeCode);
    const gemCode = (r.inputs[3] ?? '').trim();
    const perfGem = gemByCode.get(gemCode);

    const fixedMods = describeRanges(r.mods, { lang: 'zh' }).map((l) => l.text);
    const fixedModsEn = describeRanges(r.mods, { lang: 'en' }).map((l) => l.text);
    const id = `${family}_${slot}`;

    out.push({
      id,
      row: r.row,
      family,
      slot,
      name: `${FAMILY_ZH[family]}手工${SLOT_ZH[slot]}`,
      nameEn,
      bases: baseListZh,
      basesEn: baseListEn,
      isWeaponType,
      runeCode,
      runeNumber: runeNum,
      runeName: runeGem?.name ?? runeCode,
      runeNameEn: runeGem?.nameEn ?? runeCode,
      gemCode,
      gemName: perfGem?.name ?? gemCode,
      gemNameEn: perfGem?.nameEn ?? gemCode,
      fixedMods,
      fixedModsEn,
      highlight: HIGHLIGHTS[id],
    });
  }

  // 依系列順序（血腥 → 施法 → 重擊 → 防護）與部位順序排序
  const famOrder: Record<CraftFamilyId, number> = { blood: 0, caster: 1, hitpower: 2, safety: 3 };
  const slotOrder: Record<CraftSlotId, number> = { amulet: 0, ring: 1, gloves: 2, belt: 3, boots: 4, helm: 5, body: 6, shield: 7, weapon: 8 };
  out.sort((a, b) => famOrder[a.family] - famOrder[b.family] || slotOrder[a.slot] - slotOrder[b.slot]);
  cached = out;
  return out;
}

/** 計算手工成品物品等級：floor(clvl / 2) + floor(inputIlvl / 2) */
export function calcCraftedIlvl(clvl: number, inputIlvl: number): number {
  const c = Math.max(1, Math.min(99, Math.floor(clvl)));
  const i = Math.max(1, Math.min(99, Math.floor(inputIlvl)));
  return Math.floor(c / 2) + Math.floor(i / 2);
}

/** 依成品 ilvl 回傳隨機詞綴數量的機率分布 */
export function affixRollChances(craftedIlvl: number): { minAffixes: number; chances: { count: number; pct: number }[] } {
  if (craftedIlvl >= 71) return { minAffixes: 4, chances: [{ count: 4, pct: 100 }] };
  if (craftedIlvl >= 51) return { minAffixes: 3, chances: [{ count: 3, pct: 80 }, { count: 4, pct: 20 }] };
  if (craftedIlvl >= 31) return { minAffixes: 2, chances: [{ count: 2, pct: 60 }, { count: 3, pct: 20 }, { count: 4, pct: 20 }] };
  return { minAffixes: 1, chances: [{ count: 1, pct: 40 }, { count: 2, pct: 20 }, { count: 3, pct: 20 }, { count: 4, pct: 20 }] };
}
