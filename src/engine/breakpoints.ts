/**
 * 快速施法（FCR）、快速打擊恢復（FHR）、快速格擋（FBR）的斷點表。
 * 這些不是遊戲資料表裡的欄位，而是由動畫影格數算出來的，所以資料來自社群整理，不是我們從遊戲檔抽的：
 * - 主要來源：Maxroll「Breakpoints / Animations」（2026-02 更新）。該頁自己註記：德魯伊與死靈法師的 0% 施法影格有幾格與它的公式差 1，這裡照頁面印的值。
 * - 交叉比對：魔法使一般法術（0／9／20／37／63／105／200％）來自論壇與 PureDiablo；DiabloBytes 的常用目標（魔法使 63%＝9 影格、
 *   死靈法師 125%＝9、聖騎士 75%＝10 與 125%＝9、野蠻人 63%＝9、刺客 102%＝10）都與此表一致；德魯伊狼人的快速打擊恢復、人形快速格擋與 Wiki 一致。
 * - Maxroll 頁面有三格缺少影格值（死靈法師一般型態 377%、聖騎士矛與杖 280%、德魯伊其他武器 377% 的最後一格），這裡依該表「每過一個斷點少一格」的規律補成 4，已在資料中標示。
 * - 術士（Warlock）不在該頁，沒有資料，所以不顯示。
 * 注意：實際影格還受武器種類、技能與動作旗標影響；聖騎士開聖盾時的快速格擋另有算法，這裡沒有收錄；這裡只回答「目前這個百分比落在哪個斷點、下一個在哪」。
 */
export type BpKind = 'fcr' | 'fhr' | 'fbr';

export interface BpTable {
  id: string;
  label: string;
  labelEn?: string;
  /** 達到（含）這個百分比才會少一格；第一個一定是 0 */
  thresholds: number[];
  /** 對應的影格數，與 thresholds 一一對應 */
  frames: number[];
  /** 影格值是依規律補上的（來源頁面缺漏） */
  inferredLast?: boolean;
}

const t = (id: string, label: string, labelEn: string, thresholds: number[], frames: number[], inferredLast = false): BpTable => ({ id, label, labelEn, thresholds, frames, inferredLast: inferredLast || undefined });
const seq = (from: number, count: number) => Array.from({ length: count }, (_, i) => from - i);

export const BREAKPOINTS: Record<BpKind, Record<string, BpTable[]>> = {
  fcr: {
    ama: [
      t('bow', '弓', 'Bow', [0, 7, 14, 22, 32, 48, 68, 99, 152], seq(19, 9)),
      t('xbow', '弩／雙手劍', 'Crossbow / 2H Sword', [0, 7, 11, 14, 22, 26, 32, 48, 68, 86, 99, 152, 180], [19, 18, 18, 17, 16, 16, 15, 14, 13, 13, 12, 11, 11]),
      t('none', '空手', 'Unarmed', [0, 7, 13, 14, 22, 29, 32, 48, 56, 68, 99, 113, 152], [19, 18, 18, 17, 16, 16, 15, 14, 14, 13, 12, 12, 11]),
      t('other', '雙手杖／錘／斧／長柄／矛、單手匕首、標槍', 'Staves / Polearms / Spears / Daggers / Javelins', [0, 7, 10, 14, 22, 23, 32, 42, 48, 68, 72, 99, 133, 152], [19, 18, 18, 17, 16, 16, 15, 15, 14, 13, 13, 12, 12, 11]),
    ],
    ass: [t('default', '一般', 'Default', [0, 8, 15, 16, 27, 39, 42, 65, 86, 102, 174], [16, 15, 15, 14, 13, 13, 12, 11, 11, 10, 9])],
    bar: [t('default', '一般', 'Default', [0, 9, 15, 20, 37, 39, 63, 86, 105, 200], [13, 12, 12, 11, 10, 10, 9, 9, 8, 7])],
    dru: [
      t('human', '人形', 'Human Form', [0, 4, 10, 11, 19, 30, 46, 63, 68, 99, 142, 163], [18, 17, 16, 16, 15, 14, 13, 13, 12, 11, 11, 10]),
      t('wolf', '狼人', 'Werewolf Form', [0, 6, 10, 14, 26, 37, 40, 60, 95, 157], [16, 15, 15, 14, 13, 13, 12, 11, 10, 9]),
      t('bear', '熊人', 'Werebear Form', [0, 7, 15, 26, 40, 63, 99, 163], [16, 15, 14, 13, 12, 11, 10, 9]),
    ],
    nec: [
      t('normal', '一般型態', 'Normal Form', [0, 9, 18, 30, 48, 75, 125], seq(15, 7)),
      t('vampire', '吸血鬼型態', 'Vampire Form', [0, 6, 11, 18, 24, 35, 48, 65, 86, 120, 180], seq(23, 11)),
    ],
    pal: [t('default', '一般', 'Default', [0, 9, 15, 18, 30, 39, 48, 75, 86, 125], [15, 14, 14, 13, 12, 12, 11, 10, 10, 9])],
    sor: [
      t('regular', '一般法術', 'Standard Spells', [0, 9, 20, 37, 63, 105, 200], seq(13, 7)),
      t('lightning', '閃電箭／連鎖閃電', 'Lightning / Chain Lightning', [0, 7, 15, 20, 23, 35, 52, 63, 78, 117, 194, 200], [19, 18, 17, 17, 16, 15, 14, 14, 13, 12, 11, 11]),
    ],
  },
  fhr: {
    ama: [t('default', '一般', 'Default', [0, 6, 13, 20, 32, 52, 86, 174], seq(11, 8))],
    ass: [t('default', '一般', 'Default', [0, 7, 15, 27, 48, 86, 200], seq(9, 7))],
    bar: [t('default', '一般', 'Default', [0, 7, 15, 27, 48, 86, 200], seq(9, 7))],
    dru: [
      t('swing1h', '單手揮擊武器（斧、棍、錘、權杖、劍、飛斧、魔杖）', '1H Swing Weapons (Axe/Club/Mace/Scepter/Sword/Wand)', [0, 3, 7, 13, 19, 29, 42, 63, 99, 174, 456], seq(14, 11)),
      t('other', '其他武器', 'Other Weapons', [0, 5, 10, 16, 26, 39, 56, 86, 152, 377], seq(13, 10), true),
      t('wolf', '狼人', 'Werewolf Form', [0, 9, 20, 42, 86, 280], seq(7, 6)),
      t('bear', '熊人', 'Werebear Form', [0, 5, 10, 16, 24, 37, 54, 86, 152, 360], seq(13, 10)),
    ],
    nec: [
      t('normal', '一般型態', 'Normal Form', [0, 5, 10, 16, 26, 39, 56, 86, 152, 377], seq(13, 10), true),
      t('vampire', '吸血鬼型態', 'Vampire Form', [0, 2, 6, 10, 16, 24, 34, 48, 72, 117, 208], seq(15, 11)),
    ],
    pal: [
      t('other', '一般武器', 'General Weapons', [0, 7, 15, 27, 48, 86, 200], seq(9, 7)),
      t('spear', '矛與杖', 'Spears & Staves', [0, 3, 7, 13, 20, 32, 48, 75, 129, 280], seq(13, 10), true),
    ],
    sor: [t('default', '一般', 'Default', [0, 5, 9, 14, 20, 30, 42, 60, 86, 142, 280], seq(15, 11))],
  },
  fbr: {
    ama: [
      t('other', '一般武器', 'General Weapons', [0, 13, 32, 86], [5, 4, 3, 2]),
      t('swing1h', '單手揮擊武器（斧、棍、錘、權杖、劍、飛斧）', '1H Swing Weapons', [0, 4, 6, 11, 15, 23, 29, 40, 56, 80, 120], seq(17, 11)),
    ],
    ass: [t('default', '一般', 'Default', [0, 13, 32, 86], [5, 4, 3, 2])],
    bar: [t('default', '一般', 'Default', [0, 9, 20, 42, 86], seq(7, 5))],
    dru: [
      t('human', '人形', 'Human Form', [0, 6, 13, 20, 32, 52, 86], seq(11, 7)),
      t('wolf', '狼人', 'Werewolf Form', [0, 7, 15, 27, 48, 86], seq(9, 6)),
      t('bear', '熊人', 'Werebear Form', [0, 5, 10, 16, 27, 40, 65, 109], seq(12, 8)),
    ],
    nec: [t('default', '一般', 'Default', [0, 6, 13, 20, 32, 52, 86], seq(11, 7))],
    pal: [t('default', '未開聖盾', 'Without Holy Shield', [0, 13, 32, 86], [5, 4, 3, 2])],
    sor: [t('default', '一般', 'Default', [0, 7, 15, 27, 48, 86], seq(9, 6))],
  },
};

export interface BpStatus {
  /** 目前的影格數 */
  frames: number;
  /** 目前所在斷點的百分比 */
  current: number;
  /** 下一個斷點（已到最高則沒有）與還差多少 */
  next?: { threshold: number; frames: number; missing: number };
}

/** 目前百分比落在哪個斷點、下一個斷點在哪。value 小於 0 當作 0 */
export function bpStatus(table: BpTable, value: number): BpStatus {
  const v = Math.max(0, Math.floor(value));
  let i = 0;
  while (i + 1 < table.thresholds.length && v >= table.thresholds[i + 1]) i++;
  const next = i + 1 < table.thresholds.length ? { threshold: table.thresholds[i + 1], frames: table.frames[i + 1], missing: table.thresholds[i + 1] - v } : undefined;
  return { frames: table.frames[i], current: table.thresholds[i], next };
}
