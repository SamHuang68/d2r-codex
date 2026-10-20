/**
 * 尋寶（MF）的遞減計算。
 * 社群公認的公式：有效 MF ＝ MF × 係數 ÷ (MF ＋ 係數)；暗金 250、套裝 500、稀有 600，魔法物品沒有遞減。
 * 來源：DiabloBytes、Diablo Wiki「Magic find diminishing returns」（兩者數值一致，100% MF 對應暗金 71、套裝 83、稀有 85）。
 * 注意：這是社群整理的公式，沒有在遊戲內逐項實測；掉落機率的倍率以「1＋有效 MF／100」近似，實際還受怪物等級與掉落表影響。
 */
export type MfKind = 'unique' | 'set' | 'rare' | 'magic';

export const MF_FACTOR: Record<Exclude<MfKind, 'magic'>, number> = { unique: 250, set: 500, rare: 600 };
export const MF_KIND_ZH: Record<MfKind, string> = { unique: '暗金', set: '套裝', rare: '稀有', magic: '魔法' };

export function effectiveMf(raw: number, kind: MfKind): number {
  if (raw <= 0 || kind === 'magic') return raw;
  const f = MF_FACTOR[kind];
  return (raw * f) / (raw + f);
}

export interface MfLine { kind: MfKind; effective: number; /** 掉落機率約為無 MF 時的幾倍 */ multiplier: number }

export function mfSummary(raw: number): MfLine[] {
  return (['unique', 'set', 'rare', 'magic'] as MfKind[]).map((kind) => {
    const effective = effectiveMf(raw, kind);
    return { kind, effective, multiplier: 1 + Math.max(0, effective) / 100 };
  });
}

/** 邊際效益：再加 1% 原始 MF，暗金有效 MF 增加多少（用來看「堆到什麼程度不划算」） */
export const marginalUnique = (raw: number): number => effectiveMf(raw + 1, 'unique') - effectiveMf(raw, 'unique');
