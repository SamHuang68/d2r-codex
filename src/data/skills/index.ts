import { SkillTreeGroup } from "./types";
import { SORCERESS_SKILLS } from "./sorceress";
import { PALADIN_SKILLS } from "./paladin";
import { AMAZON_SKILLS } from "./amazon";
import { NECROMANCER_SKILLS } from "./necromancer";
import { BARBARIAN_SKILLS } from "./barbarian";
import { DRUID_SKILLS } from "./druid";
import { ASSASSIN_SKILLS } from "./assassin";

export * from "./types";
export { SORCERESS_SKILLS } from "./sorceress";
export { PALADIN_SKILLS } from "./paladin";
export { AMAZON_SKILLS } from "./amazon";
export { NECROMANCER_SKILLS } from "./necromancer";
export { BARBARIAN_SKILLS } from "./barbarian";
export { DRUID_SKILLS } from "./druid";
export { ASSASSIN_SKILLS } from "./assassin";

export const SKILLS_DATA: SkillTreeGroup[] = [
  SORCERESS_SKILLS,
  PALADIN_SKILLS,
  AMAZON_SKILLS,
  NECROMANCER_SKILLS,
  BARBARIAN_SKILLS,
  DRUID_SKILLS,
  ASSASSIN_SKILLS
];
