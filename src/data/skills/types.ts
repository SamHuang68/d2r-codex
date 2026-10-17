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
