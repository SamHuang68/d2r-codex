import { GAME_SKILLS, effectiveLevel, passiveEffects, type SkillBonuses, type SkillLevels } from './skills';
import { describeEntry } from './describe';
import type { StatEntry } from './types';

/**
 * 技能效果行的文字與被動技能的套用。
 * 文字措辭取自遊戲自己的技能面板字串（skilldesc 引用的 StrSkillNN）與技能說明，不另外發明用語。
 * 遊戲屬性表本來就有中文描述的屬性（抗性、格擋、物理傷害降低…）直接用屬性表的描述；沒有的才查這張表。
 */
const SKILL_STAT_LABEL: Record<string, string> = {
  passive_dodge: '閃躲近戰攻擊機率（站立不動或攻擊時）',
  passive_avoid: '閃躲遠程攻擊機率（站立不動或攻擊時）',
  passive_evade: '閃躲近戰或遠程攻擊機率（行走或奔跑時）',
  passive_critical_strike: '攻擊造成兩倍傷害機率',
  passive_mastery_melee_crit: '攻擊造成兩倍傷害機率',
  passive_mastery_throw_crit: '攻擊造成兩倍傷害機率',
  passive_mastery_melee_th: '準確率',
  passive_mastery_throw_th: '準確率',
  passive_mastery_melee_dmg: '傷害',
  passive_mastery_throw_dmg: '傷害',
  skill_pierce: '遠程攻擊穿透敵人機率',
  passive_mastery_noconsume: '投擲武器不消耗機率',
  passive_weaponblock: '雙持爪類武器格擋機率',
  passive_summon_resist: '召喚物所有抗性',
  velocitypercent: '跑步／行走速度',
  attackrate: '攻擊速度',
  skill_armor_percent: '敵人防禦',
  curse_resistance: '詛咒持續時間降低',
  skill_handofathena: '敵人遠程攻擊減慢至',
};

const PERCENT_NO_SIGN = new Set(['passive_dodge', 'passive_avoid', 'passive_evade', 'passive_critical_strike', 'passive_mastery_melee_crit', 'passive_mastery_throw_crit', 'skill_pierce', 'passive_mastery_noconsume', 'passive_weaponblock', 'curse_resistance', 'skill_handofathena']);

/** 一條技能效果行的顯示文字；查不到說法時回傳 undefined，由呼叫端決定怎麼標示 */
export function skillEffectText(stat: string, value: number, level = 90): string | undefined {
  const d = describeEntry({ stat, value }, level);
  if (d) return d;
  const label = SKILL_STAT_LABEL[stat];
  if (!label) return undefined;
  return PERCENT_NO_SIGN.has(stat) ? `${label}：${value}%` : `${label}：${value > 0 ? '+' : ''}${value}%`;
}

export interface PassiveLine {
  skillId: string; skill: string; level: number; stat: string; value: number; text: string;
  /** true＝已計入上方的角色數值；false＝只顯示（遊戲內有效果，但這個模擬器沒有對應的數值欄位） */
  applied: boolean;
}
export interface PassiveSummary { lines: PassiveLine[]; self: StatEntry[] }

const RES = ['fireresist', 'coldresist', 'lightresist', 'poisonresist'];
const MAXRES = ['maxfireresist', 'maxcoldresist', 'maxlightresist', 'maxpoisonresist'];
const DISPLAY_ONLY = ['passive_dodge', 'passive_avoid', 'passive_evade', 'passive_critical_strike', 'passive_mastery_melee_crit', 'passive_mastery_throw_crit', 'skill_pierce', 'passive_mastery_noconsume', 'passive_weaponblock', 'passive_summon_resist'];

/**
 * 已投入技能點的被動技能效果。計入數值：抗性（自然抵抗）、最大抗性（抗火／抗寒／抗電的被動）、跑步／行走速度（提高速度，記在 skill_frw）。
 * 其餘（閃躲、閃身、閃避、致命攻勢、專精的致命一擊、貫穿、投擲不消耗、武器格擋、召喚物抗性）只列出數值。
 * 元素專精與穿透另由 passiveMods 處理（影響技能傷害），不在這裡。
 */
export function passiveSummary(hard: Record<string, number>, b: SkillBonuses, levels: SkillLevels): PassiveSummary {
  const lines: PassiveLine[] = []; const self: StatEntry[] = [];
  for (const s of GAME_SKILLS) {
    if (!s.passiveStats) continue; const h = hard[s.id] ?? 0; if (h <= 0) continue;
    const lvl = effectiveLevel(s, h, b);
    for (const e of passiveEffects(s, lvl, levels)) {
      if (!e.supported || e.value === undefined) continue;
      const apply = RES.includes(e.stat) || MAXRES.includes(e.stat) || (e.stat === 'velocitypercent' && !s.summon);
      if (!apply && !DISPLAY_ONLY.includes(e.stat)) continue;
      if (e.value === 0) continue;
      const text = skillEffectText(e.stat, e.value, lvl) ?? `${e.stat} ${e.value}`;
      lines.push({ skillId: s.id, skill: s.name ?? s.nameEn, level: lvl, stat: e.stat, value: e.value, text, applied: apply });
      if (apply) self.push({ stat: e.stat === 'velocitypercent' ? 'skill_frw' : e.stat, value: e.value });
    }
  }
  return { lines, self };
}
