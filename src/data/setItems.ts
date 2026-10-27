/**
 * 百科頁的套裝資料：由遊戲資料表（game/sets.json、game/setItems.json）即時產生。
 * 舊 id、舊譯名、套裝內單件的顯示順序、職業套裝標記來自覆蓋層 codex/overlay.json。
 */
import type { SetItemCollection, SetPiece } from '../types';
import setsJson from './game/sets.json';
import setItemsJson from './game/setItems.json';
import { imageForEntry } from '../utils/catalogImage';
import { baseByCode, classOnlyOf, gearSlotOf, overlay, slug, uniqueId } from './codex/common';
import { itemAttributes, scaledRequirements } from './codex/itemLines';
import { describeRanges } from '../engine/describe';
import type { Modifier } from '../engine/types';

interface ItemRow { id: string; gameId: number; nameEn: string; nameEnUS?: string; name: string; set: string; code: string; levelReq?: number; level?: number; mods: Modifier[]; setBonusByCount: (Modifier & { slot: number })[] }
interface SetRow { id: string; nameEn: string; nameEnUS?: string; name: string; partial: (Modifier & { pieces: number })[]; full: Modifier[] }
const itemRows = setItemsJson as unknown as ItemRow[];
const setRows = setsJson as unknown as SetRow[];

const usedPieceIds = new Set<string>(Object.values(overlay.setItems).map((o) => o.id as string));
const usedSetIds = new Set<string>(Object.values(overlay.sets).map((o) => o.id as string));

const pieceOf = (r: ItemRow, setSize: number): SetPiece => {
  const o = overlay.setItems[r.id];
  const base = baseByCode.get(r.code);
  // 這件單品自己的成套加成（湊齊件數才生效）：以「(件數)」標在行尾，沿用舊百科的寫法
  const bonus = r.setBonusByCount.flatMap((m) => describeRanges([m]).map((l) => `${l.text} (${m.slot + 1 >= setSize ? '全套' : m.slot + 1})`));
  return {
    id: o?.id ?? uniqueId(slug(r.nameEn), usedPieceIds, r.gameId),
    name: r.name,
    nameEn: o?.nameEn ?? r.nameEnUS ?? r.nameEn,
    nameClassic: o?.nameClassic,
    baseItem: base?.name ?? '',
    baseItemEn: base ? (base.nameEnUS ?? base.nameEn) : undefined,
    baseItemId: base ? slug(base.nameEnUS ?? base.nameEn) : undefined,
    slot: base ? gearSlotOf(base) : 'weapon',
    requiredLevel: Math.max(r.levelReq ?? 0, base?.levelReq ?? 0),
    requiredStr: scaledRequirements(base, r.mods).str || undefined,
    requiredDex: scaledRequirements(base, r.mods).dex || undefined,
    attributes: [...itemAttributes(base, r.mods, { levelReq: r.levelReq }), ...bonus],
    imageUrl: o?.imageUrl ?? (imageForEntry({ id: `set:${r.id}`, kind: 'set', baseCode: r.code }) || undefined),
    grade: base?.tier ?? 'normal',
    classOnly: base ? classOnlyOf(base) : null,
    qlvl: r.level,
  };
};

const lines = (mods: Modifier[]) => describeRanges(mods).map((l) => l.text);

export const SET_ITEMS_DATA: SetItemCollection[] = setRows.map((s) => {
  const o = overlay.sets[s.id];
  const items = itemRows.filter((i) => i.set === s.id);
  // 顯示順序：舊百科已有的沿用舊順序，新增的接在後面
  const order = o?.order ?? [];
  items.sort((a, b) => (order.indexOf(a.id) < 0 ? 99 : order.indexOf(a.id)) - (order.indexOf(b.id) < 0 ? 99 : order.indexOf(b.id)) || a.gameId - b.gameId);
  const pieces = items.map((i) => pieceOf(i, items.length));
  const partialBonuses = s.partial.flatMap((m) => lines([m]).map((bonus) => ({ count: m.pieces, bonus })));
  // 遊戲內「完整套裝」的提示框會把部分加成一併列出，同一屬性合併（例如 +50 防禦 與 +50 防禦 顯示為 +100）
  const fullBonuses = lines([...s.full, ...s.partial]);
  const classes = items.map((i) => baseByCode.get(i.code)?.class).filter(Boolean) as string[];
  const cls = o?.class ?? (o ? undefined : classes.length ? classOnlyOf(baseByCode.get(items.find((i) => baseByCode.get(i.code)?.class)!.code)!) ?? undefined : undefined);
  return {
    id: o?.id ?? uniqueId(slug(s.nameEn), usedSetIds, s.nameEn),
    name: s.name,
    nameEn: o?.nameEn ?? s.nameEnUS ?? s.nameEn,
    isClassSet: o ? !!o.isClassSet : !!cls,
    class: cls ?? null,
    pieces,
    partialBonuses,
    fullBonuses,
  };
});

export const ALL_SET_PIECES: SetPiece[] = SET_ITEMS_DATA.flatMap((s) => s.pieces);
