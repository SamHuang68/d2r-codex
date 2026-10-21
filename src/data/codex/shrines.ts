import shrinesJson from '../game/shrines.json';

/**
 * 聖壇（Shrine，簡體常稱神龕）。資料來自遊戲 shrines.txt，中文名與提示語來自 shrines.json 字串；資料管線輸出 shrines.json。
 *
 * 規則與限制：
 *  - 遊戲每秒 25 影格，持續時間＝持續影格 ÷ 25。只有「增益」類聖壇的持續時間有明確意義；其他類型資料表雖有影格欄，用途沒有驗證，頁面只照列原值。
 *  - arg0／arg1 是各效果自己的參數，下面的說明只解讀效果明確的聖壇（防禦、抗性、技能、經驗…），其餘照資料表英文效果與原值列出。
 *  - rarity、effectClass、levelMin 是資料表原值；levelMin 視為「出現的最低場景等級」，rarity 數值大小與出現機率的關係沒有驗證。
 *  - 資料表有三個效果文字標「(Not Used)」的聖壇，保留並標記。
 *  - 不含：聖壇會出現在哪些場景、實際出現機率與遊戲內的效果數值驗證。
 */
export type ShrineType = 'Recharge' | 'Booster' | 'Magic';
export interface Shrine {
  code: number; nameEn: string; name: string; msg?: string; type: ShrineType; effect: string;
  arg0?: number; arg1?: number; frames?: number; reset?: number; rarity: number; effectClass: number; levelMin: number; unused?: boolean;
}

export const SHRINES = shrinesJson as unknown as Shrine[];
export const SHRINE_TYPE_ZH: Record<ShrineType, string> = { Recharge: '回復', Booster: '增益', Magic: '特殊' };
export const SHRINE_TYPES: ShrineType[] = ['Recharge', 'Booster', 'Magic'];
export const FRAMES_PER_SECOND = 25;

/** 持續秒數（只有增益類聖壇有明確的持續時間） */
export const durationSeconds = (s: Shrine): number | undefined => (s.type === 'Booster' && s.frames ? s.frames / FRAMES_PER_SECOND : undefined);

const RESIST_ZH: Record<number, string> = { 8: '火焰', 9: '冰寒', 10: '閃電', 11: '毒素' };

/** 效果說明（繁中）。數字取自資料表參數；效果不明確的聖壇只翻譯資料表的效果文字，不推測數值 */
export function shrineSummary(s: Shrine): string {
  const a0 = s.arg0; const a1 = s.arg1;
  switch (s.code) {
    case 1: return '立刻回復全部生命與法力';
    case 2: return '立刻回復全部生命';
    case 3: return '立刻回復全部法力';
    case 4: return '把目前生命換成法力';
    case 5: return '把目前法力換成生命';
    case 6: return `防禦 +${a0}%`;
    case 7: return `物理傷害 +${a0}%、命中率 +${a1}%`;
    case 8: case 9: case 10: case 11: return `${RESIST_ZH[s.code]}抗性 +${a0}%`;
    case 12: return `所有技能 +${a0}`;
    case 13: return `法力恢復速率 +${a0}%`;
    case 14: return '不消耗耐力';
    case 15: return `擊殺怪物的經驗 +${a0}%`;
    case 16: return '暫時把角色名字倒過來顯示';
    case 17: return '在目前章節的城鎮開一個中立傳送門';
    case 18: return '隨機把背包裡一顆寶石升一階；背包沒有寶石就產生一顆隨機碎裂寶石';
    case 19: return '釋放火球新星，範圍內的玩家與怪物損失一定比例的生命';
    case 20: return '讓最近的怪物升級為冠軍或首領（Unique）型';
    case 21: return '對附近怪物造成火焰傷害，並產生隨機數量的爆炸藥水';
    case 22: return '產生毒氣傷害附近怪物，並產生隨機數量的毒氣藥水';
    default: return s.effect;
  }
}
