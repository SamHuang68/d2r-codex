/**
 * 技能樹資料：由遊戲技能表（game/skills.json，經 engine/skills.ts）即時產生，百科與模擬器共用同一份來源。
 * 技能名稱、樹、格位、前置、需求等級、說明、協同皆來自遊戲表；戰術解析、舊名與俗稱、樹的說明文字來自覆蓋層 codex/overlay.json。
 */
import { CLASS_CODE_ZH, pageName, skillByName, synergySources, synergyTargets, treesOf, type GameSkill } from "../../engine/skills";
import skillTabsEn from "../game/skillTabsEn.json";
import { overlay } from "../codex/common";
import { SkillData, SkillTreeGroup } from "./types";

export * from "./types";

/** 職業顯示順序（沿用舊百科） */
const CLASS_ORDER = ["sor", "pal", "ama", "nec", "bar", "dru", "ass", "war"];
/** 技能樹分頁順序：預設依遊戲內由左到右（第 3、2、1 頁）；聖騎士與野蠻人沿用舊百科的 1、2、3 頁順序 */
const PAGE_ORDER: Record<string, number[]> = { pal: [1, 2, 3], bar: [1, 2, 3] };

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
    requiredLevel: g.reqLevel,
    prerequisites: g.prereq.map((n) => skillByName(n)?.id).filter((x): x is string => !!x),
    synergies: related.size ? [...related] : undefined,
    description: g.desc ?? "",
    details: o?.details ?? "",
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
      skills: t.skills.map(toSkillData),
    };
  }),
}));
