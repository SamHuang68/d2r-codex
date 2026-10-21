import { categoryOfEntry, findSocketable, toEquipped, type CatalogEntry } from './catalog';
import type { EquippedItem, Modifier } from './types';

export interface EquippedLike { entry: CatalogEntry; ethereal?: boolean; sockets?: string[]; randomSkill?: string }

/** 畫面上的穿戴物（含使用者鑲嵌的寶石／符文／珠寶）→ 引擎輸入 */
export function buildEngineItem(eq: EquippedLike, slot: string, rollMax = true): EquippedItem {
  const gemCodes: string[] = []; const jewelMods: Modifier[] = [];
  void categoryOfEntry;
  (eq.sockets ?? []).forEach((id) => {
    const sk = findSocketable(id); if (!sk) return;
    if (sk.jewelMods) jewelMods.push(...sk.jewelMods); else if (sk.code) gemCodes.push(sk.code);
  });
  const base = toEquipped(eq.entry, slot, { ethereal: eq.ethereal, roll: rollMax ? 1 : 0, randomSkill: eq.randomSkill });
  return { ...base, mods: [...base.mods, ...jewelMods], sockets: [...(base.sockets ?? []), ...gemCodes] };
}
