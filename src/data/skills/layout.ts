/**
 * 技能樹 6x3 畫布座標：直接取自遊戲技能表（列＝SkillRow、欄＝SkillColumn），不另存一份對照表。
 * 橫列 (Row): 0 = Lv 1, 1 = Lv 6, 2 = Lv 12, 3 = Lv 18, 4 = Lv 24, 5 = Lv 30；直行 (Col): 0 = 左, 1 = 中, 2 = 右
 */
import { GAME_SKILLS } from "../../engine/skills";

export interface SkillGridPos {
  row: number; // 0..5
  col: number; // 0..2
}

export const SKILL_GRID_LAYOUT: Record<string, SkillGridPos> = Object.fromEntries(GAME_SKILLS.map((s) => [s.id, { row: s.row - 1, col: s.col - 1 }]));

/** 根據技能 id 取得 6x3 棋盤上的定位座標；表中沒有時依需求等級推算列、依序分欄（備援） */
export function getSkillGridPosition(skillId: string, requiredLevel: number = 1, fallbackIndex: number = 0): SkillGridPos {
  if (SKILL_GRID_LAYOUT[skillId]) return SKILL_GRID_LAYOUT[skillId];
  const rowMap: Record<number, number> = { 1: 0, 6: 1, 12: 2, 18: 3, 24: 4, 30: 5 };
  return { row: rowMap[requiredLevel] !== undefined ? rowMap[requiredLevel] : 0, col: fallbackIndex % 3 };
}
