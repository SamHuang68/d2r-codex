import { S_ENTRIES, U_ENTRIES } from './itemIndex';

export interface SameBaseHit {
  id: string;
  name: string;
  nameEn: string;
  kind: 'unique' | 'set';
}

const norm = (s: string) => s.trim().toLowerCase();

/** 其他暗金或套裝部件：底材 id 相同，或沒有 id 時底材名稱相同。 */
export function sameBaseItems(baseItem: string, baseItemId: string | undefined, excludeId: string): SameBaseHit[] {
  const idKey = baseItemId?.trim();
  const nameKey = norm(baseItem);
  if (!idKey && !nameKey) return [];
  const hits: SameBaseHit[] = [];
  const consider = (
    id: string,
    name: string,
    nameEn: string,
    kind: SameBaseHit['kind'],
    otherId?: string,
    otherName?: string,
  ) => {
    if (id === excludeId) return;
    const byId = !!(idKey && otherId && idKey === otherId);
    const byName = !!(nameKey && otherName && norm(otherName) === nameKey);
    if (byId || byName) hits.push({ id, name, nameEn, kind });
  };
  for (const entry of U_ENTRIES) {
    const item = entry.item;
    consider(item.id, item.name, item.nameEn, 'unique', item.baseItemId, item.baseItem);
  }
  for (const entry of S_ENTRIES) {
    for (const piece of entry.set.pieces) {
      consider(piece.id, piece.name, piece.nameEn, 'set', piece.baseItemId, piece.baseItem);
    }
  }
  return hits;
}
