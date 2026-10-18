import { GearSlot } from './index';

/**
 * 模擬器裝備結構
 */
export interface SimulatorItemStats {
  strength?: number;
  dexterity?: number;
  vitality?: number;
  energy?: number;
  life?: number;
  mana?: number;
  lifePercent?: number; // e.g. +5% from Jah
  manaPercent?: number; // e.g. +25% from SOJ / +40% Frostburn
  allSkills?: number;
  classSkills?: { className: string; bonus: number };
  treeSkills?: { treeName: string; bonus: number };
  singleSkills?: Record<string, number>;
  fcr?: number;
  fhr?: number;
  ias?: number;
  fbr?: number;
  defense?: number;
  defensePercent?: number;
  blockChance?: number; // on shields (e.g. 60%)
  fireRes?: number;
  coldRes?: number;
  lightningRes?: number;
  poisonRes?: number;
  allRes?: number;
  maxFireRes?: number;
  maxColdRes?: number;
  maxLightningRes?: number;
  maxPoisonRes?: number;
  magicFind?: number;
  crushingBlow?: number;
  deadlyStrike?: number;
  openWounds?: number;
  lifeLeech?: number;
  manaLeech?: number;
  damageReducedPercent?: number; // DR% (e.g. 8% Enigma, 35% Stormshield)
  cannotBeFrozen?: boolean;
  baseDamageMin?: number;
  baseDamageMax?: number;
  enhancedDamage?: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  nameEn: string;
  slot: GearSlot;
  itemType: 'unique' | 'runeword' | 'set' | 'crafted' | 'charm';
  categoryTier1: 'armor' | 'weapon' | 'jewelry';
  categoryTier2: string; // e.g. '菁英 (Elite)', '卓越 (Exceptional)', '職業專屬 (Class-Specific)'
  baseItem: string;
  requiredLevel: number;
  requiredStr?: number;
  requiredDex?: number;
  attributes: string[];
  stats: SimulatorItemStats;
  iconType?: string;
  isClassSpecific?: string;
}

export interface EquippedSlots {
  helm?: CatalogItem;
  amulet?: CatalogItem;
  weapon1?: CatalogItem;
  shield1?: CatalogItem;
  weapon2?: CatalogItem;
  shield2?: CatalogItem;
  armor?: CatalogItem;
  gloves?: CatalogItem;
  ring1?: CatalogItem;
  belt?: CatalogItem;
  ring2?: CatalogItem;
  boots?: CatalogItem;
  charms: CatalogItem[];
}

export interface CharacterAttributes {
  baseStr: number;
  baseDex: number;
  baseVit: number;
  baseEne: number;
  allocatedStr: number;
  allocatedDex: number;
  allocatedVit: number;
  allocatedEne: number;
  level: number;
}

export interface CalculatedCombatStats {
  totalStr: number;
  totalDex: number;
  totalVit: number;
  totalEne: number;
  totalLife: number;
  totalMana: number;
  totalStamina: number;
  totalDefense: number;
  chanceToBlock: number;
  fireRes: number;
  coldRes: number;
  lightningRes: number;
  poisonRes: number;
  maxFireRes: number;
  maxColdRes: number;
  maxLightningRes: number;
  maxPoisonRes: number;
  fcr: number;
  fcrFrame: number;
  fhr: number;
  fhrFrame: number;
  ias: number;
  fbr: number;
  magicFind: number;
  crushingBlow: number;
  deadlyStrike: number;
  openWounds: number;
  lifeLeech: number;
  manaLeech: number;
  damageReducedPercent: number;
  cannotBeFrozen: boolean;
  allSkillsBonus: number;
  classSkillsBonus: number;
  activeSkillId?: string;
  activeSkillName?: string;
  activeSkillLevel?: number;
  activeSkillDamageMin?: number;
  activeSkillDamageMax?: number;
  activeSkillDamageType?: string;
  attackRating?: number;
}
