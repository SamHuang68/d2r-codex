/**
 * 練等場景：角色等級與場景怪物等級的差距，決定擊殺經驗打幾折。
 * 規則來自暴雪 Arreat Summit「Experience」頁（資深版 LoD 時期的官方說明，D2R 3.3 沒有在遊戲內逐項實測）：
 *  - 怪物不高於角色：差 0～5 級全額；低 6、7、8、9 級各為 81、62、43、24%；低 10 級以上固定 5%。
 *  - 怪物高於角色：角色 25 級以上是「角色等級 ÷ 怪物等級」；25 級以下依表（高 1～5 級全額，高 6、7、8、9 級各為 88、68、36、15%，高 10 級以上 2%）。
 *  - 角色 70 級以上，算完後再乘一個固定折扣（與場景無關，見 LATE_LEVEL_FACTOR）。
 * 只算「單隻怪物經驗打幾折」：不含每隻怪物的基礎經驗、怪物密度、跑圖時間，所以不是「每小時經驗」；
 * 也不含冠軍、獨特怪的等級加成、組隊分配與死亡懲罰。
 */
export type LevelingDiff = 0 | 1 | 2;

/** 角色 70～98 級的固定經驗折扣（Arreat Summit）；70 級以下沒有折扣 */
export const LATE_LEVEL_FACTOR: Record<number, number> = {
  70: 0.9531, 71: 0.9063, 72: 0.8594, 73: 0.8125, 74: 0.7656, 75: 0.7188, 76: 0.6719, 77: 0.625, 78: 0.5781, 79: 0.5313,
  80: 0.4844, 81: 0.4375, 82: 0.3906, 83: 0.3438, 84: 0.2969, 85: 0.25, 86: 0.1875, 87: 0.1406, 88: 0.1055, 89: 0.0791,
  90: 0.0596, 91: 0.0449, 92: 0.0342, 93: 0.0254, 94: 0.0195, 95: 0.0146, 96: 0.0107, 97: 0.0078, 98: 0.0059,
};
export const lateLevelFactor = (clvl: number): number => (clvl < 70 ? 1 : LATE_LEVEL_FACTOR[Math.min(98, clvl)]);

/** 怪物比角色低 n 級（n ≥ 6）時的倍率 */
const BELOW: Record<number, number> = { 6: 0.81, 7: 0.62, 8: 0.43, 9: 0.24 };
/** 25 級以下的角色遇到比自己高 n 級（n ≥ 6）的怪物時的倍率 */
const ABOVE_LOW: Record<number, number> = { 6: 0.88, 7: 0.68, 8: 0.36, 9: 0.15 };

/** 等級差的經驗倍率（0～1，不含 70 級以上的固定折扣） */
export function levelDiffRatio(clvl: number, mlvl: number): number {
  const d = mlvl - clvl;
  if (d <= -10) return 0.05;
  if (d < -5) return BELOW[-d];
  if (d <= 0) return 1;
  if (clvl >= 25) return clvl / mlvl;
  if (d <= 5) return 1;
  return d >= 10 ? 0.02 : ABOVE_LOW[d];
}

export interface LevelingArea { id: number; mlvl: (number | null)[]; mon: string[][] }
export interface LevelingRow<A> { area: A; /** 該難度的場景怪物等級 */ mlvl: number; /** 等級差倍率 */ ratio: number }

/** 該難度有怪物、有怪物等級的場景，依等級差倍率由高到低（相同倍率依場景編號） */
export function levelingRows<A extends LevelingArea>(areas: readonly A[], clvl: number, diff: LevelingDiff): LevelingRow<A>[] {
  const out: LevelingRow<A>[] = [];
  for (const area of areas) {
    const mlvl = area.mlvl[diff];
    if (!mlvl || mlvl <= 0 || !area.mon[diff]?.length) continue;
    out.push({ area, mlvl, ratio: levelDiffRatio(clvl, mlvl) });
  }
  return out.sort((a, b) => b.ratio - a.ratio || a.area.id - b.area.id);
}
