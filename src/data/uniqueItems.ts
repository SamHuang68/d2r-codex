/**
 * 百科頁的暗金資料：由遊戲資料表（game/uniques.json）即時產生，不再另存一份物品資料。
 * 舊 id（聖杯存檔、社群別名使用）、公開英文名、舊譯名來自覆蓋層 codex/overlay.json；遊戲表新增的項目用穩定的 slug 當 id。
 */
import type { UniqueItemData } from '../types';
import uniquesJson from './game/uniques.json';
import { imageForEntry } from '../utils/catalogImage';
import { baseByCode, classOnlyOf, gearSlotOf, overlay, slug, uniqueId } from './codex/common';
import { itemAttributes, scaledRequirements } from './codex/itemLines';
import type { Modifier } from '../engine/types';
import { uniqueBaseAc } from '../engine/referenceOverrides';

interface Row { id: string; gameId: number; nameEn: string; nameEnUS?: string; name: string; code: string; baseName: string; levelReq?: number; level?: number; spawnable?: boolean; crafted?: boolean; mods: Modifier[] }
const rows = uniquesJson as unknown as Row[];

/** 任務物品：不是掉落裝備，不收進暗金列表 */
const QUEST_ITEMS = new Set(['Amulet of the Viper', 'Staff of Kings', 'Horadric Staff', 'Hell Forge Hammer', 'KhalimFlail', 'SuperKhalimFlail']);
/** 收錄規則：舊百科已有的一律保留；新增項目排除任務物品與不會自然掉落者（束縛之戒、黑暗恐懼、舊版碧藍怒火、Rift 護身符本體） */
const included = (r: Row) => !!overlay.uniques[r.id]?.id || (!QUEST_ITEMS.has(r.nameEn) && r.spawnable !== false);

const used = new Set<string>(Object.values(overlay.uniques).map((o) => o.id as string));

export const UNIQUE_ITEMS_DATA: UniqueItemData[] = rows.filter(included).map((r) => {
  const o = overlay.uniques[r.id];
  const base = baseByCode.get(r.code);
  const id = o?.id ?? uniqueId(slug(r.nameEn), used, r.gameId);
  return {
    id,
    name: r.name,
    nameEn: o?.nameEn ?? r.nameEnUS ?? r.nameEn,
    nameClassic: o?.nameClassic,
    baseItem: base?.name ?? r.baseName,
    baseItemId: base ? slug(base.nameEnUS ?? base.nameEn) : undefined,
    slot: base ? gearSlotOf(base) : 'weapon',
    requiredLevel: Math.max(r.levelReq ?? 0, base?.levelReq ?? 0),
    requiredStr: scaledRequirements(base, r.mods).str || undefined,
    requiredDex: scaledRequirements(base, r.mods).dex || undefined,
    ladderOnly: false,
    attributes: itemAttributes(base, r.mods, { levelReq: r.levelReq, staticLines: o?.staticLines, extraLines: o?.extraLines, dropMods: o?.dropMods, baseAc: uniqueBaseAc(r.id) }),
    imageUrl: o?.imageUrl ?? (imageForEntry({ id: `unique:${r.id}`, kind: 'unique', baseCode: r.code }) || undefined),
    grade: base?.tier ?? 'normal',
    classOnly: base ? classOnlyOf(base) : null,
    qlvl: r.level,
  };
});
