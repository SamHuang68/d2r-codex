/**
 * 技能樹資料：由遊戲技能表（game/skills.json，經 engine/skills.ts）即時產生，百科與模擬器共用同一份來源。
 * 技能名稱、樹、格位、前置、需求等級、說明、協同皆來自遊戲表；戰術解析、舊名與俗稱、樹的說明文字來自覆蓋層 codex/overlay.json。
 */
import { CLASS_CODE_ZH, pageName, skillByName, synergySources, synergyTargets, treesOf, type GameSkill } from "../../engine/skills";
import skillTabsEn from "../game/skillTabsEn.json";
import skillDescEn from "./skillDescEn.json";
import skillDetailsEn from "./skillDetailsEn.json";
import { overlay } from "../codex/common";
import { SkillData, SkillTreeGroup } from "./types";

export * from "./types";

const descEnMap = skillDescEn as Record<string, string>;
const detailsEnMap = skillDetailsEn as Record<string, string>;

/** 職業顯示順序（沿用舊百科） */
const CLASS_ORDER = ["sor", "pal", "ama", "nec", "bar", "dru", "ass", "war"];
/** 技能樹分頁順序：預設依遊戲內由左到右（第 3、2、1 頁）；聖騎士與野蠻人沿用舊百科的 1、2、3 頁順序 */
const PAGE_ORDER: Record<string, number[]> = { pal: [1, 2, 3], bar: [1, 2, 3] };

const TREE_DESCRIPTIONS_EN: Record<string, string> = {
  "sor/3": "Commands Blizzard, Frozen Orb, and biting frost with powerful chills, freezes, and peerless Cold Mastery piercing.",
  "sor/2": "Possesses the highest burst damage potential, chain lightning arcs across the screen, and the indispensable Teleport.",
  "sor/1": "Incinerates hellish legions with Fire Ball, Meteor, and Hydra, alongside Warmth and Enchant buffs.",
  "pal/1": "The martial prowess and holy magic of the Paladin, featuring reliable Smite, Blessed Hammer, and Zeal.",
  "pal/2": "Empowers the party with holy wrath, boosting physical damage, attack speed, or raining elemental retribution.",
  "pal/3": "Provides supreme survival, movement speed bonuses, Cleansing, and continuous life/mana recovery.",
  "ama/3": "Empowers javelins and spears with lightning or virulent poison, delivering supreme mob clearing.",
  "ama/2": "Enhances the Amazon's physique with pierce and critical strike, summoning decoy and the mighty Valkyrie.",
  "ama/1": "Rains arrows from afar, freezing enemies with Freezing Arrow or scorching crowds with Exploding Arrow.",
  "nec/3": "Commands an army of skeletons, golems, and revived monsters into an unstoppable legion across Hell.",
  "nec/2": "Controls Corpse Explosion, Poison Nova, and magical Bone Spear that pierces most defenses.",
  "nec/1": "Debilitates enemies' minds and bodies with ominous curses, including Amplify Damage and Life Tap.",
  "bar/1": "Mount Arreat's ferocious martial techniques, featuring Whirlwind, Frenzy, and magic-converting Berserk.",
  "bar/2": "Peak weapon masteries and physical conditioning, granting passive resistances, defense, and increased speed.",
  "bar/3": "Earth-shaking battle cries, featuring the party-doubling Battle Orders and Find Item trophy hunting.",
  "dru/3": "Commands subterranean flames and storms, summoning violent Tornados, Hurricanes, and Armageddon.",
  "dru/2": "Shapeshifts into a savage Werewolf or an impenetrable Werebear, mastering feral melee combat.",
  "dru/1": "Summon wild allies, including Heart of Wolverine, Spirit of Barbs, dire wolves, and Grizzly.",
  "ass/3": "Charges elemental and physical energy to release explosive finishers, reaching unmatched heights with Mosaic.",
  "ass/2": "Secret shinobi arts, featuring Fade for damage reduction, Weapon Block, and Mind Blast crowd control.",
  "ass/1": "Deploys automated hunting devices, featuring Lightning Sentry, Death Sentry corpse explosions, and Blade Fury.",
};

const toSkillData = (g: GameSkill): SkillData => {
  const o = overlay.skills[g.id];
  const related = new Set<string>();
  synergySources(g, {}).sources.forEach((x) => related.add(x.skill.name ?? x.skill.nameEn));
  synergyTargets(g).forEach((x) => related.add(x.name ?? x.nameEn));
  return {
    id: g.id,
    name: g.name ?? g.nameEn,
    nameEn: o?.nameEn ?? g.nameEnUS ?? g.nameEn,
    characterClass: CLASS_CODE_ZH[g.charClass],
    tree: pageName(g.charClass, g.page),
    treeEn: (skillTabsEn as Record<string, (string | null)[]>)[g.charClass]?.[g.charClass === "war" ? g.page - 1 : 3 - g.page] ?? "",
    requiredLevel: g.reqLevel,
    prerequisites: g.prereq.map((n) => skillByName(n)?.id).filter((x): x is string => !!x),
    synergies: related.size ? [...related] : undefined,
    description: g.desc ?? "",
    descriptionEn: descEnMap[g.id] ?? g.nameEn,
    details: o?.details ?? "",
    detailsEn: detailsEnMap[g.id] ?? o?.details ?? "",
    maxPoints: g.maxLvl,
    row: g.row - 1,
    col: g.col - 1,
    aliases: o?.aliases,
  };
};

export const SKILLS_DATA: SkillTreeGroup[] = CLASS_ORDER.map((code) => ({
  characterClass: CLASS_CODE_ZH[code],
  trees: (PAGE_ORDER[code] ?? [3, 2, 1]).map((page) => {
    const t = treesOf(code).find((x) => x.page === page)!;
    return {
      name: pageName(code, page),
      nameEn: (skillTabsEn as Record<string, (string | null)[]>)[code]?.[code === "war" ? page - 1 : 3 - page] ?? "",
      description: overlay.trees[`${code}/${page}`]?.description ?? "",
      descriptionEn: TREE_DESCRIPTIONS_EN[`${code}/${page}`] ?? overlay.trees[`${code}/${page}`]?.description ?? "",
      skills: t.skills.map(toSkillData),
    };
  }),
}));
