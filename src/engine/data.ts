import charstats from '../data/game/charstats.json';
import properties from '../data/game/properties.json';
import stats from '../data/game/stats.json';
import bases from '../data/game/bases.json';
import uniques from '../data/game/uniques.json';
import setItems from '../data/game/setItems.json';
import runewords from '../data/game/runewords.json';
import gems from '../data/game/gems.json';
import sets from '../data/game/sets.json';
import type { BaseItem, CharStats, EquippedItem, GameData, Gem, Modifier, PropertyDef, SetDef, StatDef } from './types';

interface SetRow { id: string; nameEn: string; name?: string; partial: (Modifier & { pieces: number })[]; full: Modifier[] }
const setSizes = new Map<string, number>();
for (const it of setItems as unknown as { set: string; disabled?: boolean }[]) { if (!it.disabled) setSizes.set(it.set, (setSizes.get(it.set) ?? 0) + 1); }
const buildSets = (): SetDef[] => (sets as unknown as SetRow[]).map((r) => {
  const byPieces = new Map<number, Modifier[]>();
  for (const { pieces, ...m } of r.partial) (byPieces.get(pieces) ?? byPieces.set(pieces, []).get(pieces)!).push(m);
  return { id: r.id, nameEn: r.nameEn, name: r.name, size: setSizes.get(r.id) ?? 0, partial: [...byPieces.entries()].sort((a, b) => a[0] - b[0]).map(([pieces, mods]) => ({ pieces, mods })), full: r.full };
});

export const gameData: GameData = {
  charstats: charstats as unknown as CharStats[],
  properties: properties as unknown as Record<string, PropertyDef>,
  stats: stats as unknown as Record<string, StatDef>,
  bases: bases as unknown as BaseItem[],
  gems: gems as unknown as Gem[],
  sets: buildSets(),
};

interface UniqueRow { id: string; code: string; levelReq?: number; mods: Modifier[]; name: string }
interface RunewordRow { id: string; levelReq?: number; mods: Modifier[]; name: string; runes: string[] }

/** 由暗金 id 建立穿戴物（屬性取上限） */
export function itemFromUnique(id: string, slot: string, opts: Partial<EquippedItem> = {}): EquippedItem {
  const u = (uniques as unknown as UniqueRow[]).find((x) => x.id === id);
  if (!u) throw new Error(`找不到暗金 ${id}`);
  return { slot, baseCode: u.code, mods: u.mods, requiredLevel: u.levelReq, name: u.name, ...opts };
}
export function itemFromSet(id: string, slot: string, opts: Partial<EquippedItem> = {}): EquippedItem {
  const u = (setItems as unknown as UniqueRow[]).find((x) => x.id === id);
  if (!u) throw new Error(`找不到套裝件 ${id}`);
  return { slot, baseCode: u.code, mods: u.mods, requiredLevel: u.levelReq, name: u.name, ...opts };
}
/** 符文之語：需指定底材 code（底材本身無額外屬性） */
export function itemFromRuneword(id: string, slot: string, baseCode: string, opts: Partial<EquippedItem> = {}): EquippedItem {
  const r = (runewords as unknown as RunewordRow[]).find((x) => x.id === id);
  if (!r) throw new Error(`找不到符文之語 ${id}`);
  return { slot, baseCode, mods: r.mods, sockets: r.runes, name: r.name, ...opts };
}
