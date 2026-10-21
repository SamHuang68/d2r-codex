import skillTabsJson from '../data/game/skillTabs.json';

/** 職業代碼、職業名稱、技能樹名稱與技能樹加成編號。從 skills.ts 獨立出來：物品描述只需要這些，不必為此載入整份技能表（skills.json，約 136 kB）。 */
export const SKILL_TABS = skillTabsJson as Record<string, (string | null)[]>;
export const CLASS_CODE_ZH: Record<string, string> = { ama: '亞馬遜', sor: '魔法使', nec: '死靈法師', pal: '聖騎士', bar: '野蠻人', dru: '德魯伊', ass: '刺客', war: '術士' };
export const CLASS_CODE_EN: Record<string, string> = { ama: 'Amazon', sor: 'Sorceress', nec: 'Necromancer', pal: 'Paladin', bar: 'Barbarian', dru: 'Druid', ass: 'Assassin', war: 'Warlock' };
export const CLASS_CODES = ['ama', 'sor', 'nec', 'pal', 'bar', 'dru', 'ass', 'war'];

/**
 * 第 page 頁的樹名。遊戲字串 SkillCategory<職業><1..3> 的編號：舊 7 職業與 SkillPage 相反（編號＝4−頁碼），
 * 術士則與頁碼相同（以內容核對：頁 1＝惡魔(召喚羊頭人)、頁 2＝邪異(迴響打擊)、頁 3＝混沌(瘴氣彈)；
 * 舊職業：魔法使頁 1＝火焰(火焰彈)、聖騎士頁 1＝戰鬥(犧牲打擊)、亞馬遜頁 1＝弓與弩(魔法箭)）。
 */
export function pageName(classCode: string, page: number): string {
  const names = SKILL_TABS[classCode] ?? [];
  return (classCode === 'war' ? names[page - 1] : names[3 - page]) ?? `技能樹 ${page}`;
}

/**
 * 裝備「技能樹加成」的編號：職業序號×3＋(頁碼−1)。
 * 依據：撒卡蘭姆使者資料為 skilltab 9，遊戲內提示框顯示「+2 戰鬥技能（只限聖騎士）」（聖騎士頁 1＝戰鬥）。
 */
export function tabId(classCode: string, page: number): number { return CLASS_CODES.indexOf(classCode) * 3 + (page - 1); }
export function tabName(id: number): string | undefined { const code = CLASS_CODES[Math.floor(id / 3)]; return code ? pageName(code, (id % 3) + 1) : undefined; }
