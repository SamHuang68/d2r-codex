import experienceJson from '../game/experience.json';

/**
 * 經驗值表。資料來自遊戲 experience.txt（資料管線輸出 experience.json）：EXP[n]＝升到 n 級需要的累計經驗（0~99 級）。
 * 八個職業的數值完全相同。
 *
 * 不含：怪物等級與角色等級差造成的經驗修正、組隊分配、死亡懲罰、經驗聖壇之外的加成；experience.txt 的 ExpRatio 欄（用途未驗證）。
 */
export const EXP = experienceJson as unknown as number[];
export const MAX_LEVEL = EXP.length - 1;

/** 升到 level 級需要的累計經驗 */
export const expToReach = (level: number): number => EXP[Math.max(0, Math.min(MAX_LEVEL, level))];
/** 從 level−1 級升到 level 級需要的經驗 */
export const expForLevel = (level: number): number => (level >= 1 && level <= MAX_LEVEL ? EXP[level] - EXP[level - 1] : 0);
/** 從 from 級升到 to 級需要的經驗（to ≤ from 時為 0） */
export const expBetween = (from: number, to: number): number => Math.max(0, expToReach(to) - expToReach(from));

export interface ExpProgress {
  level: number;
  /** 本級已累積的經驗（0 ~ need−1），滿級時為超出 99 級門檻的部分 */
  into: number;
  /** 升到下一級還差多少；滿級為 0 */
  remaining: number;
  /** 到下一級的完成度 0~1；滿級為 1 */
  fraction: number;
  /** 距離 99 級還差多少 */
  toMax: number;
}
/** 由累計經驗算出等級與進度 */
export function progressOf(xp: number): ExpProgress {
  let level = 0;
  for (let n = 1; n <= MAX_LEVEL; n++) if (xp >= EXP[n]) level = n; else break;
  if (level >= MAX_LEVEL) return { level, into: xp - EXP[MAX_LEVEL], remaining: 0, fraction: 1, toMax: 0 };
  const need = EXP[level + 1] - EXP[level];
  const into = xp - EXP[level];
  return { level, into, remaining: need - into, fraction: into / need, toMax: EXP[MAX_LEVEL] - xp };
}

export const fmtExp = (n: number): string => n.toLocaleString('en-US');
