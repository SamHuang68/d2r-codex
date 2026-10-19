import { GAME_SKILLS, auraEffects, effectiveLevel, skillByName, type EffectLine, type Elem, type GameSkill, type SkillBonuses } from './skills';
import type { StatEntry } from './types';

/**
 * 增益／光環／戰吼。來源：
 *  - 裝備光環（item_aura，如無限的 Conviction）：恆啟用，等級＝裝備給的等級
 *  - 裝備給的外職業技能（如戰爭召喚的 Battle Orders）：可勾選，等級＝裝備給的等級（不需硬點）
 *  - 本職業已投入的光環／戰吼：可勾選，等級＝硬點＋裝備加成
 * 效果只計算 lnXY 線性公式（Might、Concentration、Battle Orders 等）；dm 類（衰減）公式未支援，會明確標示。
 */
export interface BuffCandidate {
  skill: GameSkill;
  level: number;
  source: 'item-aura' | 'item-skill' | 'class';
  alwaysOn: boolean;
}

export function buffCandidates(classCode: string, hard: Record<string, number>, b: SkillBonuses, resultStats: Record<string, number>): BuffCandidate[] {
  const map = new Map<string, BuffCandidate>();
  const put = (c: BuffCandidate) => { const cur = map.get(c.skill.id); if (!cur || c.level > cur.level || (c.alwaysOn && !cur.alwaysOn)) map.set(c.skill.id, c); };
  for (const [k, v] of Object.entries(resultStats)) {
    if (!k.startsWith('item_aura:')) continue;
    const sk = skillByName(k.slice('item_aura:'.length)); if (sk?.auraStats) put({ skill: sk, level: v, source: 'item-aura', alwaysOn: true });
  }
  for (const [n, v] of Object.entries(b.single)) {
    const sk = skillByName(n); if (sk?.auraStats && sk.charClass !== classCode) put({ skill: sk, level: v, source: 'item-skill', alwaysOn: false });
  }
  for (const s of GAME_SKILLS) {
    if (s.charClass !== classCode || !s.auraStats) continue;
    const h = hard[s.id] ?? 0; if (h <= 0) continue;
    put({ skill: s, level: effectiveLevel(s, h, b), source: 'class', alwaysOn: false });
  }
  return [...map.values()].sort((a, c) => Number(c.alwaysOn) - Number(a.alwaysOn) || a.skill.reqLevel - c.skill.reqLevel);
}

const RES_ELEM: Record<string, Elem> = { fireresist: 'fire', coldresist: 'cold', lightresist: 'ltng', poisonresist: 'pois' };

export interface AppliedBuffs {
  /** 對自己生效的屬性（已轉成引擎使用的屬性名稱） */
  self: StatEntry[];
  /** 對敵人生效的抗性降低（%，正值＝降低） */
  enemyResReduction: Partial<Record<Elem, number>>;
  /** 每個增益的效果行（含不支援者） */
  lines: Map<string, EffectLine[]>;
}

export function applyBuffs(active: BuffCandidate[]): AppliedBuffs {
  const self: StatEntry[] = []; const enemy: Partial<Record<Elem, number>> = {}; const lines = new Map<string, EffectLine[]>();
  for (const c of active) {
    const eff = auraEffects(c.skill, c.level); lines.set(c.skill.id, eff);
    for (const e of eff) {
      if (!e.supported || e.value === undefined) continue;
      const el = RES_ELEM[e.stat];
      if (el && e.value < 0) { enemy[el] = Math.max(enemy[el] ?? 0, -e.value); continue; } // 降低敵人抗性（取最大，不疊加）
      if (e.stat === 'damagepercent') { self.push({ stat: 'item_mindamage_percent', value: e.value }, { stat: 'item_maxdamage_percent', value: e.value }); continue; }
      if (e.stat === 'skill_staminapercent') { self.push({ stat: 'item_staminapercent', value: e.value }); continue; }
      if (['item_maxhp_percent', 'item_maxmana_percent', 'item_armor_percent', 'armorclass', 'fireresist', 'coldresist', 'lightresist', 'poisonresist', 'strength', 'dexterity', 'damageresist'].includes(e.stat)) self.push({ stat: e.stat, value: e.value });
    }
  }
  return { self, enemyResReduction: enemy, lines };
}
