import { ENGINE_CLASS_BY_CODE, toEquipped, type CatalogEntry } from '../engine/catalog';
import { autoAllocate } from '../engine/alloc';
import { buildEngineItem } from '../engine/build';
import { gameData } from '../engine/data';
import type { EquippedItem } from '../engine/types';
import { planSkills } from '../engine/skillPlan';
import { resolvePreset } from './presetResolver';
import type { SimPreset } from './simulatorPresets';
import type { SimSnapshot } from './profileStore';
import { DOLL_SLOT_KIND, type DollSlot } from '../components/simulator/v2/types';

const baseByCode = new Map(gameData.bases.map((b) => [b.code, b]));

/** 流派範本 → 模擬器狀態：解析物品、依規則配屬性點、依技能規劃配技能點。找不到的項目與技能點不足都會列出 */
export function stateFromPreset(p: SimPreset): { snap: SimSnapshot; notes: string[] } {
  const r = resolvePreset(p);
  const className = ENGINE_CLASS_BY_CODE[p.classCode];
  const items: EquippedItem[] = [];
  (Object.keys(r.equipped) as DollSlot[]).forEach((k) => {
    if (k === 'weaponII' || k === 'shieldII') return;
    const eq = r.equipped[k]!; const kind = DOLL_SLOT_KIND[k];
    items.push(buildEngineItem(eq, kind === 'weapon' ? 'weapon' : kind === 'shield' ? (eq.entry.slot === 'weapon' ? 'weapon2' : 'shield') : k, true));
  });
  r.charms.forEach((ch: CatalogEntry, i: number) => items.push(toEquipped(ch, `charm${i}`, { roll: 1 })));
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
    notes,
  };
}
