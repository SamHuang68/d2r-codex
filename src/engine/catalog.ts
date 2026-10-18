import uniques from '../data/game/uniques.json';
import setItems from '../data/game/setItems.json';
import runewords from '../data/game/runewords.json';
import { gameData } from './data';
import type { BaseItem, EquippedItem, Modifier } from './types';

/** 穿戴部位（與遊戲裝備頁一致） */
export type SlotKind = 'head' | 'body' | 'shield' | 'gloves' | 'belt' | 'boots' | 'neck' | 'ring' | 'weapon' | 'charm';
export type Rarity = 'unique' | 'set' | 'runeword' | 'base';
export type Tier = 'normal' | 'exceptional' | 'elite';
export type Group = 'armor' | 'weapon' | 'jewelry';

export const CLASS_ZH: Record<string, string> = {
  ama: '亞馬遜', sor: '魔法使', nec: '死靈法師', pal: '聖騎士', bar: '野蠻人', dru: '德魯伊', ass: '刺客', war: '術士',
};
export const ENGINE_CLASS_BY_CODE: Record<string, string> = {
  ama: 'Amazon', sor: 'Sorceress', nec: 'Necromancer', pal: 'Paladin', bar: 'Barbarian', dru: 'Druid', ass: 'Assassin', war: 'Warlock',
};
export const SLOT_ZH: Record<SlotKind, string> = {
  head: '頭盔', body: '護甲', shield: '盾牌', gloves: '手套', belt: '腰帶', boots: '鞋靴', neck: '項鍊', ring: '戒指', weapon: '武器', charm: '護身符',
};
export const GROUP_ZH: Record<Group, string> = { armor: '護甲', weapon: '武器', jewelry: '飾品' };
export const TIER_ZH: Record<Tier, string> = { normal: '普通', exceptional: '卓越', elite: '精英' };
export const RARITY_ZH: Record<Rarity, string> = { unique: '獨特', set: '套裝', runeword: '符文之語', base: '基礎' };

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
}

const baseByCode = new Map<string, BaseItem>(gameData.bases.map((b) => [b.code, b]));

export function slotOfBase(b: BaseItem): SlotKind | undefined {
  const a = b.ancestors;
  if (a.includes('shld')) return 'shield';
  if (a.includes('helm')) return 'head';
  if (a.includes('tors')) return 'body';
  if (a.includes('glov')) return 'gloves';
  if (a.includes('belt')) return 'belt';
  if (a.includes('boot')) return 'boots';
  if (a.includes('amul')) return 'neck';
  if (a.includes('ring')) return 'ring';
  if (a.includes('char')) return 'charm';
  if (a.includes('weap')) return 'weapon';
  return undefined;
}
const groupOfSlot = (s: SlotKind): Group => (s === 'weapon' ? 'weapon' : s === 'neck' || s === 'ring' || s === 'charm' ? 'jewelry' : 'armor');

interface Row { id: string; name: string; nameEn: string; code: string; levelReq?: number; mods: Modifier[]; crafted?: boolean; disabled?: boolean; setNameEn?: string }

function fromRow(r: Row, kind: Rarity, setName?: string): CatalogEntry | undefined {
  const b = baseByCode.get(r.code); if (!b) return undefined;
  const slot = slotOfBase(b); if (!slot) return undefined;
  return {
    id: `${kind}:${r.id}`, kind, name: r.name, nameEn: r.nameEn, slot, group: groupOfSlot(slot), tier: b.tier as Tier | undefined,
    classCode: b.class, baseCode: b.code, baseName: b.name, baseNameEn: b.nameEn, levelReq: r.levelReq, mods: r.mods,
    twoHanded: b.twoHanded, width: b.width ?? 1, height: b.height ?? 1, setName,
  };
}

function runewordEntry(r: typeof runewords[number]): CatalogEntry | undefined {
  const rw = r as unknown as { id: string; name: string; nameEn: string; itypes: string[]; etypes: string[]; runes: string[]; mods: Modifier[] };
  const ok = (b: BaseItem) => rw.itypes.some((t) => b.ancestors.includes(t)) && !rw.etypes.some((t) => b.ancestors.includes(t)) && (b.sockets ?? 0) >= rw.runes.length && !!slotOfBase(b);
  // 預設底材：精英、需求最低者（容易穿戴）；之後可由 UI 更換
  const cands = gameData.bases.filter((b) => b.kind !== 'misc' && ok(b)).sort((a, b) => (b.tier === 'elite' ? 1 : 0) - (a.tier === 'elite' ? 1 : 0) || (a.reqStr ?? 0) - (b.reqStr ?? 0));
  const b = cands[0]; if (!b) return undefined;
  const slot = slotOfBase(b)!;
  return {
    id: `runeword:${rw.id}`, kind: 'runeword', name: rw.name, nameEn: rw.nameEn, slot, group: groupOfSlot(slot), tier: b.tier as Tier | undefined,
    classCode: undefined, baseCode: b.code, baseName: b.name, baseNameEn: b.nameEn, mods: rw.mods, sockets: rw.runes,
    twoHanded: b.twoHanded, width: b.width ?? 1, height: b.height ?? 1,
  };
}

let cache: CatalogEntry[] | undefined;
export function getCatalog(): CatalogEntry[] {
  if (cache) return cache;
  const out: CatalogEntry[] = [];
  for (const u of uniques as unknown as Row[]) { if (u.crafted || u.disabled) continue; const e = fromRow(u, 'unique'); if (e) out.push(e); }
  for (const s of setItems as unknown as Row[]) { if (s.disabled) continue; const e = fromRow(s, 'set', s.setNameEn); if (e) out.push(e); }
  for (const r of runewords) { const e = runewordEntry(r); if (e) out.push(e); }
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
  return { slot, baseCode: entry.baseCode, mods: entry.mods, sockets: entry.sockets, requiredLevel: entry.levelReq, name: entry.name, ...opts };
}
