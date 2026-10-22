import type { BaseItem } from './types';

/** 部位、稀有度、職業名稱的對照表與底材→部位判斷。從 catalog.ts 獨立出來：它們不依賴暗金／符文之語資料，百科頁（底材、技能）只用這些，不必為此載入約 290 kB 的裝備資料。 */
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
  head: '頭盔', body: '護甲', shield: '盾牌', gloves: '手套', belt: '腰帶', boots: '鞋靴', neck: '項鍊', ring: '戒指', weapon: '武器', charm: '咒符',
};
export const GROUP_ZH: Record<Group, string> = { armor: '護甲', weapon: '武器', jewelry: '飾品' };
export const TIER_ZH: Record<Tier, string> = { normal: '普通', exceptional: '卓越', elite: '精英' };
export const RARITY_ZH: Record<Rarity, string> = { unique: '獨特', set: '套裝', runeword: '符文之語', base: '基礎' };

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
