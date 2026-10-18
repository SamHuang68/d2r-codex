import type { CatalogEntry, SlotKind } from '../../../engine/catalog';

/** 紙娃娃上的實體槽位（武器 I／II 各有主手與副手） */
export type DollSlot = 'head' | 'neck' | 'body' | 'gloves' | 'belt' | 'ring1' | 'ring2' | 'boots' | 'weaponI' | 'shieldI' | 'weaponII' | 'shieldII';

export interface Equipped {
  entry: CatalogEntry;
  ethereal?: boolean;
}

export type EquippedMap = Partial<Record<DollSlot, Equipped>>;

export const DOLL_SLOT_KIND: Record<DollSlot, SlotKind> = {
  head: 'head', neck: 'neck', body: 'body', gloves: 'gloves', belt: 'belt', ring1: 'ring', ring2: 'ring', boots: 'boots',
  weaponI: 'weapon', shieldI: 'shield', weaponII: 'weapon', shieldII: 'shield',
};

export const DOLL_SLOT_ZH: Record<DollSlot, string> = {
  head: '頭盔', neck: '項鍊', body: '護甲', gloves: '手套', belt: '腰帶', ring1: '左戒指', ring2: '右戒指', boots: '鞋靴',
  weaponI: '主手武器 I', shieldI: '副手 I', weaponII: '主手武器 II', shieldII: '副手 II',
};

export type TabKey = 'stats' | 'gear' | 'skills';
export type Difficulty = 'normal' | 'nightmare' | 'hell';
export interface Quests { lifePotions: number; anya: number; lamEsen: number }
export interface Alloc { str: number; dex: number; vit: number; ene: number }
