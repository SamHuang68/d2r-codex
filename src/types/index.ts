/**
 * 聖休亞瑞典藏中樞 (D2R Sanctuary Codex) - 核心型別定義
 */

export type ItemRarity = 'normal' | 'magic' | 'rare' | 'set' | 'unique' | 'crafted' | 'rune';

export type GearSlot = 
  | 'weapon' 
  | 'shield' 
  | 'helm' 
  | 'armor' 
  | 'gloves' 
  | 'boots' 
  | 'belt' 
  | 'amulet' 
  | 'ring' 
  | 'charm'
  | 'jewel';

export interface BaseItem {
  id: string;
  name: string;
  nameEn: string;
  category: GearSlot;
  subCategory?: string;
  requiredLevel: number;
  requiredStr?: number;
  requiredDex?: number;
}

export interface RuneData {
  number: number;
  name: string;
  nameEn: string;
  weaponEffect: string;
  armorHelmEffect: string;
  shieldEffect: string;
  requiredLevel: number;
  cubeRecipe?: string;
}

export interface RunewordData {
  id: string;
  name: string;
  nameEn: string;
  runes: string[]; // e.g. ["Jah", "Ith", "Ber"]
  runeNumbers: number[]; // e.g. [31, 6, 30]
  sockets: number;
  allowedBases: string[];
  requiredLevel: number;
  attributes: string[];
  ladderOnly?: boolean;
  isNewDLC?: boolean; // RotW / 2.6
  tags: string[]; // e.g. ["FCR", "Teleport", "CB", "Magic Find", "All Skills"]
  recommendedBases?: string;
  description?: string;
}

export interface UniqueItemData {
  id: string;
  name: string;
  nameEn: string;
  baseItem: string;
  baseItemEn: string;
  slot: GearSlot;
  requiredLevel: number;
  requiredStr?: number;
  requiredDex?: number;
  ladderOnly?: boolean;
  isNewDLC?: boolean;
  attributes: string[];
  flavorText?: string;
  tags?: string[];
}

export interface SetPiece {
  id: string;
  name: string;
  nameEn: string;
  baseItem: string;
  slot: GearSlot;
  requiredLevel: number;
  attributes: string[];
  setBonuses?: string[];
}

export interface SetItemCollection {
  id: string;
  name: string;
  nameEn: string;
  pieces: SetPiece[];
  partialBonuses: { count: number; bonus: string }[];
  fullBonuses: string[];
}

export interface CubeRecipeData {
  id: string;
  category: 'socket' | 'upgrade' | 'repair' | 'craft' | 'misc';
  title: string;
  titleEn: string;
  inputs: string[];
  output: string;
  notes?: string;
}

export interface BreakpointData {
  characterClass: string;
  classNameEn: string;
  type: 'FCR' | 'FHR' | 'FBR' | 'IAS';
  variant?: string; // e.g. "Sorceress - Lightning/Chain Lightning" or "Paladin - Holy Shield"
  breakpoints: { frames: number; requiredValue: number }[];
  notes?: string;
}

export interface AreaLevelData {
  act: number;
  name: string;
  nameEn: string;
  areaLevel: number;
  isAlvl85: boolean;
  isTerrorZone: boolean;
  immunities: string[]; // e.g. ["Fire", "Cold"]
  chestsAndBosses?: string;
}

export interface CharacterClassData {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  description: string;
  primaryAttributes: string;
  startingStats: {
    str: number;
    dex: number;
    vit: number;
    ene: number;
    life: number;
    mana: number;
  };
  statGains: {
    lifePerVit: number;
    manaPerEne: number;
    staminaPerVit: number;
  };
  skillTrees: {
    name: string;
    description: string;
    keySkills: string[];
  }[];
  popularBuilds: {
    name: string;
    tier: 'S' | 'A' | 'B';
    coreSkills: string;
    gearSummary: string;
  }[];
  isDLC?: boolean;
}

export interface HolyGrailState {
  obtainedItemIds: Record<string, boolean>; // itemId -> boolean
  etherealItemIds: Record<string, boolean>; // itemId -> boolean
  perfectRollIds: Record<string, boolean>;
  notes: Record<string, string>;
  lastUpdated: string;
}

export interface BuildPlanGear {
  helm?: string;
  armor?: string;
  weapon1?: string;
  shield1?: string;
  weapon2?: string;
  shield2?: string;
  gloves?: string;
  boots?: string;
  belt?: string;
  amulet?: string;
  ring1?: string;
  ring2?: string;
}

export interface CharacterBuildPlan {
  id: string;
  characterClass: string;
  buildName: string;
  targetLevel: number;
  gear: BuildPlanGear;
  customStats: {
    fcr: number;
    fhr: number;
    allResist: number;
    magicFind: number;
    allSkills: number;
  };
  notes?: string;
}
