import { ENGINE_CLASS_BY_CODE } from '../engine/catalog';
import { autoAllocate } from '../engine/alloc';
import { computeCharacter } from '../engine/character';
import { survivalSummary, type Survival } from '../engine/survival';
import { gameData } from '../engine/data';
import type { EquippedItem } from '../engine/types';
import { planSkills } from '../engine/skillPlan';
import { resolvePreset } from './presetResolver';
import type { SimPreset } from './simulatorPresets';
import type { SimSnapshot } from './profileStore';
import { engineItemsOf } from '../components/simulator/v2/engineItems';

const baseByCode = new Map(gameData.bases.map((b) => [b.code, b]));

/** 流派範本 → 模擬器狀態：解析物品、依規則配屬性點、依技能規劃配技能點。找不到的項目與技能點不足都會列出 */
function build(p: SimPreset): { snap: SimSnapshot; notes: string[]; items: EquippedItem[]; className: string } {
  const r = resolvePreset(p);
  const className = ENGINE_CLASS_BY_CODE[p.classCode];
  const items = engineItemsOf(r.equipped, r.charms, 'I', true);
  const reqs = { str: Math.max(0, ...items.map((i) => baseByCode.get(i.baseCode)?.reqStr ?? 0)), dex: Math.max(0, ...items.map((i) => baseByCode.get(i.baseCode)?.reqDex ?? 0)) };
  const alloc = autoAllocate(gameData, { className, level: p.level, items, difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } },
    { totalPoints: (p.level - 1) * 5 + 15, blockTarget: p.blockTarget, rest: p.rest }, reqs);
  const plan = planSkills(p.classCode, p.level, p.skill, 3);
  const notes = [...r.errors.map((e) => `裝備：${e}`), ...plan.notes.map((x) => `技能：${x}`)];
  return {
    snap: {
      classCode: p.classCode, level: p.level, difficulty: 'hell', quests: { lifePotions: 3, anya: 3, lamEsen: 3, skillPts: 3 }, alloc,
      equipped: r.equipped, charms: r.charms, swap: 'I', skillPoints: plan.points, activeSkillId: plan.mainId, buffsOn: {}, targetRes: 0, rollMax: true,
    },
    notes, items, className,
  };
}

export function stateFromPreset(p: SimPreset): { snap: SimSnapshot; notes: string[] } {
  const { snap, notes } = build(p);
  return { snap, notes };
}

/** 範本套用後的主要數值（卡片上顯示 MF、生存力等，讓使用者先比較再套用）。不含光環、增益 */
export function previewPreset(p: SimPreset): { mf: number; gold: number; life: number; defense: number; survival: Survival } {
  const { snap, items, className } = build(p);
  const r = computeCharacter(gameData, { className, level: p.level, allocated: snap.alloc, items, difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } });
  return { mf: r.stats.item_magicbonus ?? 0, gold: r.stats.item_goldbonus ?? 0, life: r.life, defense: r.defense, survival: survivalSummary(r) };
}
