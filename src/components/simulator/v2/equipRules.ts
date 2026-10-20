import { CLASS_ZH, ENGINE_CLASS_BY_CODE, SLOT_ZH, type CatalogEntry } from '../../../engine/catalog';
import { gameData } from '../../../engine/data';
import { DOLL_SLOT_KIND, DOLL_SLOT_ZH, type DollSlot, type EquippedMap } from './types';

const baseByCode = new Map(gameData.bases.map((b) => [b.code, b]));

/**
 * 物品能不能放進物品欄的某個槽位（遊戲規則）。回傳 null 表示可以，否則是原因。
 * 介面拖放與穿戴、範本合法性測試共用這一份，避免兩邊規則不一致。
 * - 槽位種類要對；野蠻人與刺客的副手欄可以放武器（雙持），刺客只能放爪，雙手武器不能放在副手欄。
 * - 職業專屬物品只能給該職業。
 * - 雙手武器不能搭配盾牌（野蠻人的「單雙手皆可」武器除外）。
 * 護身符放背包的規則（只能放護身符、空間夠不夠）不在這裡，由背包排列決定。
 */
export function slotPlacementError(target: DollSlot, entry: CatalogEntry, equipped: EquippedMap, engineClass: string): string | null {
  const dualWield = entry.slot === 'weapon' && (target === 'shieldI' || target === 'shieldII') && (engineClass === 'Barbarian' || engineClass === 'Assassin');
  if (dualWield) {
    const main = equipped[target === 'shieldI' ? 'weaponI' : 'weaponII']?.entry;
    if (entry.twoHanded) return '雙手武器不能放在副手欄';
    if (main?.twoHanded) return '主手為雙手武器，副手欄不能放武器';
    if (engineClass === 'Assassin' && !/^(h2h|h2h2)$/.test(baseByCode.get(entry.baseCode)?.type ?? '')) return '刺客雙持只能使用爪類武器';
  } else if (DOLL_SLOT_KIND[target] !== entry.slot) return `「${entry.name}」是${SLOT_ZH[entry.slot]}，不能放在${DOLL_SLOT_ZH[target]}`;
  if (entry.classCode && ENGINE_CLASS_BY_CODE[entry.classCode] !== engineClass) return `「${entry.name}」只有${CLASS_ZH[entry.classCode] ?? entry.classCode}能使用`;
  if (entry.slot === 'shield') {
    const w = equipped[target === 'shieldI' ? 'weaponI' : 'weaponII']?.entry;
    const wb = w && baseByCode.get(w.baseCode);
    if (w?.twoHanded && !(wb?.oneOrTwoHanded && engineClass === 'Barbarian')) return '雙手武器無法搭配盾牌';
  }
  return null;
}

/** 一整組裝備是否都合法（逐槽位檢查最終狀態）。回傳每個不合法槽位的原因 */
export function equippedErrors(equipped: EquippedMap, engineClass: string): { slot: DollSlot; reason: string }[] {
  const out: { slot: DollSlot; reason: string }[] = [];
  (Object.keys(equipped) as DollSlot[]).forEach((slot) => {
    const e = equipped[slot]; if (!e) return;
    const reason = slotPlacementError(slot, e.entry, equipped, engineClass);
    if (reason) out.push({ slot, reason });
  });
  return out;
}
