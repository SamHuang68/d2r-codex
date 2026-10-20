import { toEquipped, type CatalogEntry } from '../../../engine/catalog';
import { buildEngineItem } from '../../../engine/build';
import type { EquippedItem } from '../../../engine/types';
import { DOLL_SLOT_KIND, type DollSlot, type EquippedMap } from './types';

const ARM: Record<'I' | 'II', DollSlot[]> = { I: ['weaponI', 'shieldI'], II: ['weaponII', 'shieldII'] };

/**
 * 物品欄上的裝備與護身符 → 引擎輸入。模擬器、流派範本、測試共用這一份，避免各自重寫槽位對應。
 * - 只算目前使用的那一組武器／盾（I 或 II），另一組是待命、不算數值。
 * - 副手欄放武器（雙持）時，引擎槽位用 weapon2，不當作盾牌。
 */
export function engineItemsOf(equipped: EquippedMap, charms: CatalogEntry[], swap: 'I' | 'II' = 'I', rollMax = true): EquippedItem[] {
  const out: EquippedItem[] = [];
  const arm = ARM[swap];
  (Object.keys(equipped) as DollSlot[]).forEach((k) => {
    if ((k === 'weaponI' || k === 'shieldI' || k === 'weaponII' || k === 'shieldII') && !arm.includes(k)) return;
    const eq = equipped[k]; if (!eq) return;
    const kind = DOLL_SLOT_KIND[k];
    const slot = kind === 'weapon' ? 'weapon' : kind === 'shield' ? (eq.entry.slot === 'weapon' ? 'weapon2' : 'shield') : k;
    out.push(buildEngineItem(eq, slot, rollMax));
  });
  charms.forEach((c, i) => out.push(toEquipped(c, `charm${i}`, { roll: rollMax ? 1 : 0 })));
  return out;
}
