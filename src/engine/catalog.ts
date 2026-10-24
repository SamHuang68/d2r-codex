import uniques from '../data/game/uniques.json';
import setItems from '../data/game/setItems.json';
import runewords from '../data/game/runewords.json';
import { gameData } from './data';
import { uniqueBaseAc } from './referenceOverrides';
import { slotOfBase, type SlotKind, type Rarity, type Tier, type Group } from './slots';
// 部位、職業名稱等輕量對照表在 slots.ts（百科頁只要這些，不該為此載入暗金與符文之語的整份資料）；這裡原樣轉出，既有的匯入不用改
export * from './slots';
import type { BaseItem, EquippedItem, Modifier } from './types';


export interface CatalogEntry {
  id: string;
  kind: Rarity;
  name: string;
  nameEn: string;
  slot: SlotKind;
  group: Group;
  tier?: Tier;
  /** 職業專屬（代碼，如 sor） */
  classCode?: string;
  baseCode: string;
  baseName: string;
  baseNameEn: string;
  levelReq?: number;
  mods: Modifier[];
  sockets?: string[];
  twoHanded?: boolean;
  width: number;
  height: number;
  /** 套裝名稱（套裝件） */
  setName?: string;
  /** 套裝 id 與此件自己的套裝加成（見 engine/types EquippedItem） */
  setId?: string;
  setBonus?: { pieces: number; mods: Modifier[] }[];
  /** 自訂飾品（魔法／稀有的戒指、護身符、咒符）：使用者組出來的詞綴，見 engine/customItem.ts */
  custom?: import('./customItem').CustomItemDef;
  /** 底材防禦範圍覆寫（只有與遊戲資料表不一致、改採參考網站數值的暗金），見 engine/referenceOverrides.ts */
  baseAc?: [number, number];
}

const baseByCode = new Map<string, BaseItem>(gameData.bases.map((b) => [b.code, b]));

const groupOfSlot = (s: SlotKind): Group => (s === 'weapon' ? 'weapon' : s === 'neck' || s === 'ring' || s === 'charm' ? 'jewelry' : 'armor');

interface Row { id: string; name: string; nameEn: string; code: string; levelReq?: number; mods: Modifier[]; crafted?: boolean; disabled?: boolean; setNameEn?: string; set?: string; setBonusByCount?: (Modifier & { slot: number })[] }

/** 資料的 aprop 第 N 組＝穿戴同套裝 N+1 件時生效（例：塔拉夏的判決護身符第 3 組＝4 件，+10% 快速施法；兩個社群來源一致） */
const bonusByPieces = (rows?: (Modifier & { slot: number })[]): { pieces: number; mods: Modifier[] }[] | undefined => {
  if (!rows?.length) return undefined;
  const m = new Map<number, Modifier[]>();
  for (const { slot, ...mod } of rows) (m.get(slot + 1) ?? m.set(slot + 1, []).get(slot + 1)!).push(mod);
  return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([pieces, mods]) => ({ pieces, mods }));
};

function fromRow(r: Row, kind: Rarity, setName?: string): CatalogEntry | undefined {
  const b = baseByCode.get(r.code); if (!b) return undefined;
  const slot = slotOfBase(b); if (!slot) return undefined;
  return {
    id: `${kind}:${r.id}`, kind, name: r.name, nameEn: r.nameEn, slot, group: groupOfSlot(slot), tier: b.tier as Tier | undefined,
    classCode: b.class, baseCode: b.code, baseName: b.name, baseNameEn: b.nameEn, levelReq: r.levelReq, mods: r.mods,
    twoHanded: b.twoHanded, width: b.width ?? 1, height: b.height ?? 1, setName,
    ...(kind === 'set' ? { setId: r.set, setBonus: bonusByPieces(r.setBonusByCount) } : {}),
    ...(kind === 'unique' && uniqueBaseAc(r.id) ? { baseAc: uniqueBaseAc(r.id) } : {}),
  };
}

function runewordEntries(r: typeof runewords[number]): CatalogEntry[] {
  const rw = r as unknown as { id: string; name: string; nameEn: string; itypes: string[]; etypes: string[]; runes: string[]; mods: Modifier[] };
  const ok = (b: BaseItem) => rw.itypes.some((t) => b.ancestors.includes(t)) && !rw.etypes.some((t) => b.ancestors.includes(t)) && (b.sockets ?? 0) >= rw.runes.length && !!slotOfBase(b);
  // 預設底材：非職業專屬、非圓環類，精英、需求最低者（容易穿戴）；之後可由 UI 更換。
  // 圓環類（頭環／寶冠／頭冠／權冠，ancestors 含 circ）只在沒有其他可用底材時才會被選：
  // 它們的需求力量為 0，過去會搶到所有頭盔符文之語的預設底材，圖與數值都不像一般頭盔
  const isCirclet = (b: BaseItem) => b.ancestors.includes('circ');
  const cands = gameData.bases.filter((b) => b.kind !== 'misc' && ok(b)).sort((a, b) => (a.class ? 1 : 0) - (b.class ? 1 : 0) || (isCirclet(a) ? 1 : 0) - (isCirclet(b) ? 1 : 0) || (b.tier === 'elite' ? 1 : 0) - (a.tier === 'elite' ? 1 : 0) || (a.reqStr ?? 0) - (b.reqStr ?? 0));
  if (!cands.length) return [];

  // 若符文組跨多個部位（如剛毅：武器/護甲、精神/鳳凰：武器/盾牌、飛龍：護甲/盾牌、夢境：頭盔/盾牌），為每個相容部位皆建立 CatalogEntry
  const slots = new Set<SlotKind>();
  for (const b of cands) {
    const s = slotOfBase(b);
    if (s) slots.add(s);
  }

  const primarySlot = slotOfBase(cands[0])!;
  const entries: CatalogEntry[] = [];

  for (const slot of slots) {
    const isPrimary = slot === primarySlot;
    const b = cands.find((cand) => slotOfBase(cand) === slot) ?? cands[0];
    const id = isPrimary ? `runeword:${rw.id}` : `runeword:${rw.id}:${slot}`;

    let displayName = rw.name;
    if (rw.id === 'hustle_weapon_172') {
      displayName = '歇斯底里（武器）';
    } else if (rw.id === 'hustle_armor_171') {
      displayName = '歇斯底里（護甲）';
    }

    entries.push({
      id, kind: 'runeword', name: displayName, nameEn: rw.nameEn, slot, group: groupOfSlot(slot), tier: b.tier as Tier | undefined,
      classCode: b.class, baseCode: b.code, baseName: b.name, baseNameEn: b.nameEn, mods: rw.mods, sockets: rw.runes,
      twoHanded: b.twoHanded, width: b.width ?? 1, height: b.height ?? 1,
    });
  }

  return entries;
}

/** 符文之語可用的底材（依遊戲規則：類型符合、未被排除、孔數足夠、且部位相符）。非符文之語回傳空陣列 */
export function eligibleBases(entry: CatalogEntry): BaseItem[] {
  if (entry.kind !== 'runeword') return [];
  const rwId = entry.id.replace(/^runeword:/, '').split(':')[0];
  const rw = (runewords as unknown as { id: string; itypes: string[]; etypes: string[]; runes: string[] }[]).find((r) => r.id === rwId);
  if (!rw) return [];
  return gameData.bases.filter((b) => b.kind !== 'misc' && slotOfBase(b) === entry.slot && rw.itypes.some((t) => b.ancestors.includes(t)) && !rw.etypes.some((t) => b.ancestors.includes(t)) && (b.sockets ?? 0) >= rw.runes.length)
    .sort((a, b) => (a.class ? 1 : 0) - (b.class ? 1 : 0) || (a.tier === b.tier ? 0 : a.tier === 'elite' ? -1 : b.tier === 'elite' ? 1 : a.tier === 'exceptional' ? -1 : 1) || (a.reqStr ?? 0) - (b.reqStr ?? 0));
}

/** 換底材（符文之語用） */
export function withBase(entry: CatalogEntry, baseCode: string): CatalogEntry {
  const b = baseByCode.get(baseCode); if (!b) return entry;
  const slot = slotOfBase(b) ?? entry.slot;
  return { ...entry, slot, group: groupOfSlot(slot), tier: b.tier as Tier | undefined, classCode: b.class, baseCode: b.code, baseName: b.name, baseNameEn: b.nameEn, twoHanded: b.twoHanded, width: b.width ?? 1, height: b.height ?? 1 };
}

/**
 * 此物品的孔數：
 * - 符文之語＝符文數（固定）
 * - 暗金／套裝＝屬性中的「插槽」數為自帶孔數；遊戲內實測（撒卡蘭姆使者提示框「鑲孔 (1)」而資料表無插槽屬性）顯示玩家可額外打孔，故允許增加到底材上限
 * - 白裝底材＝0 到底材上限
 */
export function socketCapacity(entry: CatalogEntry): { fixed: boolean; count: number; max: number } {
  if (entry.kind === 'runeword') return { fixed: true, count: entry.sockets?.length ?? 0, max: entry.sockets?.length ?? 0 };
  const b = baseByCode.get(entry.baseCode);
  const baseMax = b && b.kind !== 'misc' ? b.sockets ?? 0 : 0;
  if (entry.kind === 'base') return { fixed: false, count: 0, max: baseMax };
  const sock = entry.mods.find((m) => m.code === 'sock');
  const n = sock ? (sock.max ?? sock.min ?? 0) : 0;
  return { fixed: false, count: n, max: Math.max(n, baseMax) };
}

export type SocketCategory = 'weapon' | 'armor' | 'shield';
export const categoryOfEntry = (e: CatalogEntry): SocketCategory => (e.slot === 'weapon' ? 'weapon' : e.slot === 'shield' ? 'shield' : 'armor');

export interface Socketable { id: string; kind: 'gem' | 'rune' | 'jewel'; name: string; nameEn: string; code?: string; jewelMods?: Modifier[] }
let sockCache: Socketable[] | undefined;
/** 可鑲嵌物：寶石、符文、暗金珠寶（彩虹刻面等）。魔法／稀有珠寶的詞綴隨機，尚未支援 */
export function getSocketables(): Socketable[] {
  if (sockCache) return sockCache;
  const out: Socketable[] = [];
  for (const g of gameData.gems) out.push({ id: `gem:${g.code}`, kind: /^r\d+$/.test(g.code) ? 'rune' : 'gem', name: g.name ?? g.nameEn, nameEn: g.nameEn, code: g.code });
  for (const u of uniques as unknown as (Row & { code: string })[]) {
    if (u.code === 'jew' && !u.disabled) out.push({ id: `jewel:${u.id}`, kind: 'jewel', name: `${u.name}（${(u.mods.find((m) => /skill$/.test(m.code))?.par ?? '')}）`, nameEn: u.nameEn, jewelMods: u.mods });
  }
  sockCache = out; return out;
}
export function findSocketable(id: string): Socketable | undefined { return getSocketables().find((s) => s.id === id); }
/** 鑲嵌物對此部位的效果（寶石／符文依部位不同；珠寶不分） */
export function socketEffectMods(s: Socketable, cat: SocketCategory): Modifier[] {
  if (s.jewelMods) return s.jewelMods;
  const g = gameData.gems.find((x) => x.code === s.code); return g ? g[cat] : [];
}

let cache: CatalogEntry[] | undefined;
export function getCatalog(): CatalogEntry[] {
  if (cache) return cache;
  const out: CatalogEntry[] = [];
  for (const u of uniques as unknown as Row[]) { if (u.crafted || u.disabled) continue; const e = fromRow(u, 'unique'); if (e) out.push(e); }
  for (const s of setItems as unknown as Row[]) { if (s.disabled) continue; const e = fromRow(s, 'set', s.setNameEn); if (e) out.push(e); }
  for (const r of runewords) { for (const e of runewordEntries(r)) out.push(e); }
  // 白裝／基礎底材（含護身符）：讓使用者能放任意底材
  for (const b of gameData.bases) {
    const slot = slotOfBase(b); if (!slot || (b.kind === 'misc' && slot !== 'charm' && slot !== 'neck' && slot !== 'ring')) continue;
    out.push({ id: `base:${b.code}`, kind: 'base', name: b.name, nameEn: b.nameEn, slot, group: groupOfSlot(slot), tier: b.tier as Tier | undefined, classCode: b.class,
      baseCode: b.code, baseName: b.name, baseNameEn: b.nameEn, mods: [], twoHanded: b.twoHanded, width: b.width ?? 1, height: b.height ?? 1 });
  }
  cache = out;
  return out;
}

export function findEntry(id: string): CatalogEntry | undefined { return getCatalog().find((e) => e.id === id); }

/** 目錄項目 → 引擎穿戴物 */
export function toEquipped(entry: CatalogEntry, slot: string, opts: Partial<EquippedItem> = {}): EquippedItem {
  return { slot, baseCode: entry.baseCode, mods: entry.mods, sockets: entry.sockets, requiredLevel: entry.levelReq, name: entry.name, setId: entry.setId, setBonus: entry.setBonus, ...(entry.baseAc ? { baseAc: entry.baseAc } : {}), ...opts };
}
