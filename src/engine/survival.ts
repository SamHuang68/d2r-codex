import type { CharacterResult } from './types';

/**
 * 生存力摘要（只用來比較配裝，不是遊戲內的數值）。
 * - 物理傷害減免（「受到的傷害降低 N%」）上限 50%：來源 Wowhead「Defensive properties」；元素抗性上限 75%、可由「最大抗性」提高到 95%（Maxroll）。
 * - 有效生命 ＝ 生命 ÷ (1 − 減免)：把「生命」與「百分比減傷」合成一個可比較的數字。
 *   不含固定傷害減免（Damage Reduced by N）、魔法傷害減免（Magic Damage Reduced）、格擋、閃避與防禦、傭兵、藥水與回復，
 *   所以只能比較兩套配裝誰比較耐打，不能當成「能承受幾下怪物攻擊」。
 */
export const PDR_CAP = 50;

export interface Survival {
  life: number;
  /** 物理傷害減免％（已套上限） */
  pdr: number;
  /** 裝備提供的物理傷害減免％（未套上限；超過上限的部分沒有作用） */
  pdrRaw: number;
  /** 固定傷害減免（Damage Reduced by N） */
  flatDr: number;
  /** 魔法傷害減免（Magic Damage Reduced by N） */
  magicDr: number;
  /** 四項元素抗性中最低的一項（已套各自的上限） */
  minRes: number;
  block: number;
  /** 有效生命：物理 */
  ehpPhys: number;
  /** 有效生命：最弱的元素（抗性不足時就是弱點） */
  ehpElem: number;
}

export function survivalSummary(r: CharacterResult): Survival {
  const pdrRaw = r.stats.damageresist ?? 0;
  const pdr = Math.max(0, Math.min(PDR_CAP, pdrRaw));
  const minRes = Math.min(r.resist.fire, r.resist.cold, r.resist.lightning, r.resist.poison);
  const resCapped = Math.max(0, Math.min(95, minRes));
  return {
    life: r.life, pdr, pdrRaw, flatDr: r.stats.normal_damage_reduction ?? 0, magicDr: r.stats.magic_damage_reduction ?? 0, minRes, block: r.blockChance,
    ehpPhys: Math.round(r.life / (1 - pdr / 100)), ehpElem: Math.round(r.life / (1 - resCapped / 100)),
  };
}
