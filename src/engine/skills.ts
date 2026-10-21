import skillsJson from '../data/game/skills.json';
import { CalcError, evalCalc, referencedSkills } from './calc';
import { pageName, tabId } from './classes';
// 職業與技能樹名稱在 classes.ts（物品描述也要用，不該為此載入整份技能表）；這裡原樣轉出，既有的匯入不用改
export { SKILL_TABS, CLASS_CODE_ZH, CLASS_CODE_EN, CLASS_CODES, pageName, tabId, tabName } from './classes';

/** 遊戲技能表（skills.txt＋skilldesc.txt，3.3.93847）。 */
export interface Bracket { b: number; lv: number[] }
export interface GameSkill {
  id: string; gameId: number; nameEn: string; /** 遊戲內的英文顯示名（nameEn 是 skills.txt 的內部名） */ nameEnUS?: string; name?: string; charClass: string;
  page: number; row: number; col: number; reqLevel: number; maxLvl: number; prereq: string[];
  desc?: string; alt?: string;
  mana: { base: number; perLvl: number; shift: number; min: number };
  passive?: boolean; aura?: boolean; summon?: boolean;
  params: Record<string, number | string>;
  hitShift?: number;
  elem?: { type: string; min: Bracket; max: Bracket; syn?: string };
  phys?: { min: Bracket; max: Bracket; syn?: string };
  srcDam?: number;
  auraStats?: StatLine[]; auraState?: string; auraTargetState?: string; auraLen?: string;
  passiveStats?: StatLine[];
}
export interface StatLine { stat: string; calc?: string }

export const GAME_SKILLS = skillsJson as unknown as GameSkill[];

export const ELEMENT_ZH: Record<string, string> = { fire: '火焰', cold: '冰寒', ltng: '閃電', mag: '魔法', pois: '毒素', stun: '擊暈' };

const byName = new Map(GAME_SKILLS.map((s) => [s.nameEn, s]));
export const skillByName = (n: string) => byName.get(n);
export const skillById = (id: string) => GAME_SKILLS.find((s) => s.id === id);


/** 顯示順序＝遊戲內由左到右（頁碼 3、2、1；術士截圖：混沌、邪異、惡魔） */
export function treesOf(classCode: string): { page: number; name: string; skills: GameSkill[] }[] {
  return [3, 2, 1].map((page) => ({
    page, name: pageName(classCode, page),
    skills: GAME_SKILLS.filter((s) => s.charClass === classCode && s.page === page).sort((a, b) => a.row - b.row || a.col - b.col),
  }));
}

/** 技能點數（硬點）與裝備加成後的有效等級；加成只對至少有 1 點硬點的技能生效 */
export interface SkillBonuses { all: number; byClass: number; byTab: Record<number, number>; single: Record<string, number> }
export function effectiveLevel(s: GameSkill, hard: number, b: SkillBonuses): number {
  if (hard <= 0) return 0;
  return hard + b.all + b.byClass + (b.byTab[tabId(s.charClass, s.page)] ?? 0) + (b.single[s.nameEn] ?? 0);
}

/** 依等級累加每級增量：2–8 級用 Lev1、9–16 用 Lev2、17–22 用 Lev3、23–28 用 Lev4、29 以上用 Lev5 */
export function bracketValue(br: Bracket, level: number): number {
  let v = br.b;
  for (let l = 2; l <= level; l++) v += br.lv[l <= 8 ? 0 : l <= 16 ? 1 : l <= 22 ? 2 : l <= 28 ? 3 : 4] ?? 0;
  return v;
}
const shiftScale = (hs?: number) => 2 ** (hs ?? 0) / 256;

export interface SkillLevels { [nameEn: string]: { lvl: number; blvl: number } }

function synPercent(syn: string | undefined, s: GameSkill, levels: SkillLevels): number {
  if (!syn) return 0;
  try { return evalCalc(syn, { params: s.params, lvl: levels[s.nameEn]?.lvl, blvl: levels[s.nameEn]?.blvl, skill: (n) => levels[n] ?? { lvl: 0, blvl: 0 }, skillParams: (n) => byName.get(n)?.params }); } catch (e) { if (e instanceof CalcError) return NaN; throw e; }
}

export interface DamageOptions {
  /** 元素專精加成（%，技能專精＋裝備「+% 元素技能傷害」） */
  masteryPct?: number;
  /** 目標抗性（%，−100～100） */
  targetRes?: number;
  /** 穿透（%，降低目標抗性：冰寒專精、衝擊光環、裝備） */
  pierce?: number;
}
export interface DamageResult {
  element?: string; min: number; max: number; synergyPct: number; masteryPct: number; kind: 'elemental' | 'physical'; weaponPct?: number;
  /** 對目標（抗性已扣穿透）的傷害；未指定目標抗性時不提供 */
  target?: { res: number; min: number; max: number };
}

/** 技能傷害（遊戲表值）：基礎值×(1＋協同％)×(1＋專精％)，再依目標抗性縮放。專精與協同相乘為假設（待遊戲內核對）；未含武器與傷害加成 */
export function skillDamage(s: GameSkill, effLevel: number, levels: SkillLevels, opts: DamageOptions = {}): DamageResult | { weaponPct: number; kind: 'weapon'; synergyPct: number; masteryPct: number } | undefined {
  if (effLevel <= 0) return undefined;
  if (s.elem) {
    const pct = synPercent(s.elem.syn, s, levels); const k = shiftScale(s.hitShift);
    const m = (Number.isNaN(pct) ? 1 : 1 + pct / 100) * (1 + (opts.masteryPct ?? 0) / 100);
    const min = Math.floor(bracketValue(s.elem.min, effLevel) * k * m); const max = Math.floor(bracketValue(s.elem.max, effLevel) * k * m);
    const out: DamageResult = { kind: 'elemental', element: s.elem.type, min, max, synergyPct: Number.isNaN(pct) ? 0 : pct, masteryPct: opts.masteryPct ?? 0 };
    if (opts.targetRes !== undefined) {
      const res = Math.max(-100, Math.min(100, opts.targetRes - (opts.pierce ?? 0)));
      out.target = { res, min: Math.floor(min * (1 - res / 100)), max: Math.floor(max * (1 - res / 100)) };
    }
    return out;
  }
  if (s.phys) {
    const pct = synPercent(s.phys.syn, s, levels); const k = shiftScale(s.hitShift);
    const m = Number.isNaN(pct) ? 1 : 1 + pct / 100;
    return { kind: 'physical', min: Math.floor(bracketValue(s.phys.min, effLevel) * k * m), max: Math.floor(bracketValue(s.phys.max, effLevel) * k * m), synergyPct: Number.isNaN(pct) ? 0 : pct, masteryPct: 0, weaponPct: s.srcDam };
  }
  if (s.srcDam) return { kind: 'weapon', weaponPct: s.srcDam, synergyPct: 0, masteryPct: 0 };
  return undefined;
}

export function manaCost(s: GameSkill, effLevel: number): number {
  if (effLevel <= 0) return 0;
  const raw = (s.mana.base + s.mana.perLvl * (effLevel - 1)) * 2 ** s.mana.shift / 256;
  return Math.max(s.mana.min, Math.round(raw * 100) / 100);
}

export interface SynergySource { skill: GameSkill; perPoint: number; points: number; total: number }

/** 為本技能提供傷害加成的技能與每點加成（以逐一探測計算式取得，不另存關係表） */
export function synergySources(s: GameSkill, hardPoints: Record<string, number>): { sources: SynergySource[]; totalPct: number } {
  const syn = s.elem?.syn ?? s.phys?.syn; const names = referencedSkills(syn);
  const sources: SynergySource[] = [];
  for (const n of names) {
    const src = byName.get(n); if (!src || src.id === s.id) continue;
    const probe = synPercent(syn, s, { [n]: { lvl: 1, blvl: 1 } });
    const points = hardPoints[src.id] ?? 0;
    sources.push({ skill: src, perPoint: probe, points, total: probe * points });
  }
  const levels: SkillLevels = {}; for (const x of GAME_SKILLS) { const h = hardPoints[x.id] ?? 0; if (h) levels[x.nameEn] = { lvl: h, blvl: h }; }
  const total = synPercent(syn, s, levels);
  return { sources, totalPct: Number.isNaN(total) ? 0 : total };
}

/** 技能提供協同給誰（本技能為來源的目標技能） */
export function synergyTargets(s: GameSkill): GameSkill[] {
  return GAME_SKILLS.filter((t) => t.charClass === s.charClass && t.id !== s.id && referencedSkills(t.elem?.syn ?? t.phys?.syn).includes(s.nameEn));
}

/** 全職業技能的等級表（供計算式引用）：lvl＝有效等級、blvl＝硬點 */
export function skillLevelsFrom(hard: Record<string, number>, b: SkillBonuses): SkillLevels {
  const out: SkillLevels = {};
  for (const s of GAME_SKILLS) { const h = hard[s.id] ?? 0; if (h > 0) out[s.nameEn] = { lvl: effectiveLevel(s, h, b), blvl: h }; }
  return out;
}

/** 傷害結果 → 顯示文字（繁中） */
export function damageText(d: ReturnType<typeof skillDamage>): string | undefined {
  if (!d) return undefined;
  if (d.kind === 'weapon') return `武器傷害 ${d.weaponPct}%`;
  const bonus = [d.synergyPct ? `協同 +${d.synergyPct}%` : '', d.masteryPct ? `專精 +${d.masteryPct}%` : ''].filter(Boolean).join('、');
  const tail = bonus ? `（含${bonus}）` : '';
  if (d.kind === 'elemental') return `${ELEMENT_ZH[d.element ?? ''] ?? d.element}傷害 ${d.min.toLocaleString()}–${d.max.toLocaleString()}${tail}`;
  return `物理傷害 ${d.min.toLocaleString()}–${d.max.toLocaleString()}${d.weaponPct ? `＋武器傷害 ${d.weaponPct}%` : ''}${tail}`;
}
export function targetDamageText(d: ReturnType<typeof skillDamage>): string | undefined {
  if (!d || d.kind !== 'elemental' || !d.target) return undefined;
  return `對抗性 ${d.target.res}% 的目標：${d.target.min.toLocaleString()}–${d.target.max.toLocaleString()}`;
}

// ── 被動（專精、穿透）與光環／戰吼（lnXY 線性、dmXY 遞減公式都支援；其餘算不出來的明確標示）──
export interface EffectLine { stat: string; value?: number; supported: boolean }
/**
 * 求一個技能的效果行。levels 是全職業技能的等級表（skillLevelsFrom）：公式引用別的技能或自己的硬點（skill('Resist Fire'.blvl)）時用它；
 * 沒給就假設其他技能 0 點、自己的硬點等於 lvl。
 */
function evalLines(lines: StatLine[] | undefined, s: GameSkill, lvl: number, levels?: SkillLevels): EffectLine[] {
  const lookup = (n: string) => levels ? (levels[n] ?? { lvl: 0, blvl: 0 }) : n === s.nameEn ? { lvl, blvl: lvl } : { lvl: 0, blvl: 0 };
  return (lines ?? []).map((l) => {
    if (!l.calc) return { stat: l.stat, supported: false };
    try { return { stat: l.stat, value: evalCalc(l.calc, { params: s.params, lvl, blvl: levels?.[s.nameEn]?.blvl ?? lvl, skill: lookup, skillParams: (n) => byName.get(n)?.params }), supported: true }; } catch (e) { if (e instanceof CalcError) return { stat: l.stat, supported: false }; throw e; }
  });
}
export const auraEffects = (s: GameSkill, lvl: number, levels?: SkillLevels) => evalLines(s.auraStats, s, lvl, levels);
export const passiveEffects = (s: GameSkill, lvl: number, levels?: SkillLevels) => evalLines(s.passiveStats, s, lvl, levels);

export type Elem = 'fire' | 'cold' | 'ltng' | 'pois' | 'mag';
export interface PassiveMods { mastery: Partial<Record<Elem, number>>; pierce: Partial<Record<Elem, number>> }
/** 由技能點（含裝備加成）計算元素專精與穿透。僅計算本職業已投入技能 */
export function passiveMods(hard: Record<string, number>, b: SkillBonuses): PassiveMods {
  const out: PassiveMods = { mastery: {}, pierce: {} };
  for (const s of GAME_SKILLS) {
    if (!s.passiveStats) continue; const h = hard[s.id] ?? 0; if (h <= 0) continue;
    const lvl = effectiveLevel(s, h, b);
    for (const e of passiveEffects(s, lvl)) {
      const m = /^passive_(fire|cold|ltng|pois|mag)_(mastery|pierce)$/.exec(e.stat); if (!m || !e.supported || e.value === undefined) continue;
      const bucket = m[2] === 'mastery' ? out.mastery : out.pierce; bucket[m[1] as Elem] = (bucket[m[1] as Elem] ?? 0) + e.value;
    }
  }
  return out;
}

/** 技能點預算：每級 1 點（2 級起）＋任務（每難度：魔物巢穴 1、拉瑪達 1、伊祖爾 2＝4 點）。任務點數為社群共識，未於遊戲內核對 */
export const skillPointBudget = (level: number, questDifficulties: number) => Math.max(0, level - 1) + 4 * Math.max(0, Math.min(3, questDifficulties));
