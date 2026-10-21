/**
 * 暗黑破壞神 II：獄火重生 (D2R) 技能系統核心型別定義
 */

export interface SkillData {
  id: string;
  name: string;
  nameEn: string;
  characterClass: string;
  tree: string;
  requiredLevel: number;
  prerequisites: string[];
  synergies?: string[];
  description: string;
  details: string;
  iconName?: string;
  maxPoints?: number;
  /** 在技能樹中的格位（0 起算：列 0～5、欄 0～2），來自遊戲技能表 */
  row?: number;
  col?: number;
  /** 舊版百科使用的名稱與社群俗稱，只供搜尋比對 */
  aliases?: string[];
}

export interface SkillTree {
  name: string;
  nameEn: string;
  description: string;
  skills: SkillData[];
}

export interface SkillTreeGroup {
  characterClass: string;
  trees: SkillTree[];
}
