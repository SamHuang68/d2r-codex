import animationsJson from '../data/game/animations.json';
import type { BaseItem } from './types';

/**
 * 攻擊速度（IAS）：每次普通攻擊要幾個影格（遊戲以每秒 25 影格運作）。
 * - 影格長度與動畫速度來自遊戲檔案 animdata.d2（見 data/game/animations.json，由資料管線產生）；
 * - 武器速度修正（WSM）是武器底材的 speed（bases.json）；
 * - 公式採 Maxroll「Attack Speed」(2026-02 更新)：
 *     EIAS = floor(120 × IAS ÷ (120 + IAS))，IAS 只計裝備（含主手武器），副手不計
 *     速度加成 = clamp(技能 IAS + EIAS − WSM, −85, 75)
 *     影格 = ceil(動畫影格數 × 256 ÷ floor(動畫速度 × (100 + 速度加成) ÷ 100)) − 1
 *   上限 75 與下限 −85 來自 DiabloBytes 的 IAS 計算機（Maxroll 頁面沒有寫這兩個界限）。
 * - 同一組公式與動畫資料也能重現社群整理的快速施法（FCR）斷點，見 scripts/test_engine.mjs。
 * 不含：雙持（野蠻人、刺客雙爪）、揮擊序列技能（刺擊、衝鋒、雷爪等）、旋風斬、輪迴型（狂熱、狂怒、掃射）、變形（狼人、熊人、吸血鬼）、投擲、術士。
 */
export type AttackClass = 'ama' | 'sor' | 'nec' | 'pal' | 'bar' | 'dru' | 'ass';
export const ATTACK_CLASSES: AttackClass[] = ['ama', 'sor', 'nec', 'pal', 'bar', 'dru', 'ass'];

/** [動畫影格數, 動畫速度（256＝一般）] */
export type AnimRecord = [frames: number, speed: number];
type AnimTable = Record<string, Record<string, Record<string, AnimRecord>>>;
export const ANIMATIONS = animationsJson as unknown as AnimTable;

export const SPEED_MAX = 75;
export const SPEED_MIN = -85;

/** 有效加速：IAS／FCR／FHR 共用的邊際遞減（小數捨去） */
export const effectiveRate = (pct: number): number => { const v = Math.max(0, Math.floor(pct)); return Math.floor((120 * v) / (120 + v)); };
export const speedBonus = (iasItem: number, sias: number, wsm: number): number => Math.min(SPEED_MAX, Math.max(SPEED_MIN, sias + effectiveRate(iasItem) - wsm));
export const framesFor = ([len, speed]: AnimRecord, bonus: number): number => Math.max(1, Math.ceil((len * 256) / Math.floor((speed * (100 + bonus)) / 100)) - 1);

export interface Breakpoint { /** 裝備需要的 IAS（%） */ ias: number; frames: number }
/** 由 0% 起，每次影格變少時的最小 IAS；加成到達上限後不再有更高的檔位 */
export function animBreakpoints(rec: AnimRecord, sias = 0, wsm = 0, maxIas = 1000): Breakpoint[] {
  const out: Breakpoint[] = [];
  let last = -1;
  for (let ias = 0; ias <= maxIas; ias++) {
    const bonus = speedBonus(ias, sias, wsm);
    const f = framesFor(rec, bonus);
    if (f !== last) { out.push({ ias, frames: f }); last = f; }
    if (bonus >= SPEED_MAX) break;
  }
  return out;
}

/** 此武器底材用哪一組動畫；不支援（雙爪）回傳 undefined，空手用 'hth'。oneHanded：野蠻人單手持握可雙手持握的武器 */
export function weaponAnimClass(base: BaseItem | undefined, oneHanded = false): string | undefined {
  if (!base) return 'hth';
  if (base.kind !== 'weapon') return undefined;
  const wc = base.twoHanded && !oneHanded ? (base.wclass2h ?? base.wclass) : base.wclass;
  return wc === 'ht1' || wc === 'ht2' ? undefined : wc;
}

export interface AttackRow {
  /** 這一列涵蓋的攻擊動作（A1、A2 影格相同時合併成一列） */
  modes: string[];
  anim: AnimRecord;
  frames: number;
  /** 每秒攻擊次數 */
  perSecond: number;
  breakpoints: Breakpoint[];
  /** 下一個更快的檔位（已是最快則沒有） */
  next?: Breakpoint & { missing: number };
}
export interface AttackResult { eias: number; bonus: number; capped: boolean; rows: AttackRow[] }

export function attackResult(cls: AttackClass, wclass: string, iasItem: number, sias: number, wsm: number): AttackResult | undefined {
  const table = ANIMATIONS[cls]?.A1 && wclass ? { A1: ANIMATIONS[cls].A1?.[wclass], A2: ANIMATIONS[cls].A2?.[wclass] } : undefined;
  if (!table || !table.A1) return undefined;
  const bonus = speedBonus(iasItem, sias, wsm);
  const ias = Math.max(0, Math.floor(iasItem));
  const rows: AttackRow[] = [];
  for (const mode of ['A1', 'A2'] as const) {
    const anim = table[mode];
    if (!anim) continue;
    const same = rows.find((r) => r.anim[0] === anim[0] && r.anim[1] === anim[1]);
    if (same) { same.modes.push(mode); continue; }
    const frames = framesFor(anim, bonus);
    const breakpoints = animBreakpoints(anim, sias, wsm);
    const nx = breakpoints.find((b) => b.frames < frames);
    rows.push({ modes: [mode], anim, frames, perSecond: 25 / frames, breakpoints, next: nx ? { ...nx, missing: Math.max(0, nx.ias - ias) } : undefined });
  }
  return { eias: effectiveRate(iasItem), bonus, capped: bonus >= SPEED_MAX, rows };
}
