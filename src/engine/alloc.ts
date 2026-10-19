import { computeCharacter } from './character';
import type { CharacterInput, GameData } from './types';

export interface AllocRule {
  /** 可分配的總點數 */
  totalPoints: number;
  /** 先滿足裝備的力量／敏捷需求 */
  meetRequirements?: boolean;
  /** 有盾牌時，加敏捷直到格擋達標（上限 75） */
  blockTarget?: number;
  /** 其餘點數投入的屬性 */
  rest?: 'str' | 'dex' | 'vit' | 'ene';
}

export type Alloc = { str: number; dex: number; vit: number; ene: number };

/** 依規則自動配點（範本載入、一鍵滿足需求共用）。裝備提供的屬性會被扣除，不重複配點 */
export function autoAllocate(data: GameData, input: Omit<CharacterInput, 'allocated'>, rule: AllocRule, reqs: { str: number; dex: number }): Alloc {
  const a: Alloc = { str: 0, dex: 0, vit: 0, ene: 0 };
  let left = rule.totalPoints;
  const base = computeCharacter(data, { ...input, allocated: a });
  if (rule.meetRequirements !== false) {
    const needStr = Math.max(0, reqs.str - base.attributes.str); const s = Math.min(left, needStr); a.str += s; left -= s;
    const needDex = Math.max(0, reqs.dex - base.attributes.dex); const d = Math.min(left, needDex); a.dex += d; left -= d;
  }
  if (rule.blockTarget) {
    while (left > 0) {
      const r = computeCharacter(data, { ...input, allocated: a });
      if (r.blockChance >= Math.min(75, rule.blockTarget)) break;
      a.dex += 1; left -= 1;
    }
  }
  a[rule.rest ?? 'vit'] += left;
  return a;
}
