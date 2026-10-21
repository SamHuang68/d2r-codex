/**
 * 百科頁資料層的共用工具：百科頁的物品／技能資料全部由遊戲資料表（src/data/game/*.json）即時產生，
 * 這裡放「遊戲資料 → 百科頁欄位」的共用對照與覆蓋層（舊 id、公開英文名、標籤、備註）的存取。
 */
import { gameData } from '../../engine/data';
import { slotOfBase, CLASS_ZH } from '../../engine/slots';
import type { BaseItem } from '../../engine/types';
import type { GearSlot } from '../../types';
import overlayJson from './overlay.json';

export interface ItemOverlay { id?: string; nameEn?: string; nameClassic?: string; imageUrl?: string; staticLines?: string[]; extraLines?: string[]; dropMods?: number[] }
export interface SetOverlay { id?: string; nameEn?: string; isClassSet?: boolean; class?: string; order?: string[] }
export interface RunewordOverlay extends ItemOverlay { tags?: string[]; ladderOnly?: boolean; isNewDLC?: boolean; recommendedBases?: string; description?: string }
export interface BaseOverlay extends ItemOverlay {
  recommendedRunewords?: string[]; tacticalNotes?: string; dropRecommendation?: string; isSuperiorValued?: boolean; isEthPreferred?: boolean;
  itemType?: string; speedGrade?: string; attackSpeedModifier?: number;
}
export interface RuneOverlay { nameEn?: string; cubeRecipe?: string; oldName?: string }
export interface SkillOverlay { nameEn?: string; aliases?: string[]; details?: string }
export interface LegacySynergy { source: string; target: string; percent: number; type: string; text: string; gameCalcReferencesSource: boolean }
export interface Overlay {
  uniques: Record<string, ItemOverlay>; sets: Record<string, SetOverlay>; setItems: Record<string, ItemOverlay>;
  runewords: Record<string, RunewordOverlay>; bases: Record<string, BaseOverlay>; runes: Record<string, RuneOverlay>;
  skills: Record<string, SkillOverlay>; legacySynergies: LegacySynergy[];
  /** 技能樹說明（鍵：職業代碼/頁碼，例如 sor/3） */
  trees: Record<string, { description?: string }>;
}
export const overlay = overlayJson as unknown as Overlay;

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

export const baseByCode = new Map<string, BaseItem>(gameData.bases.map((b) => [b.code, b]));

/** 遊戲部位 → 百科頁部位 */
const SLOT_MAP = { head: 'helm', body: 'armor', shield: 'shield', gloves: 'gloves', belt: 'belt', boots: 'boots', neck: 'amulet', ring: 'ring', weapon: 'weapon', charm: 'charm' } as const;
export function gearSlotOf(b: BaseItem): GearSlot {
  if (b.ancestors.includes('jewl')) return 'jewel'; // 含 cjw（類型 cjwl，Rainbow Facet 變體使用的底材）
  const s = slotOfBase(b);
  return s ? SLOT_MAP[s] : 'weapon';
}

/** 職業專屬底材 → 繁中職業名；非專屬回傳 null */
export const classOnlyOf = (b: BaseItem): string | null => (b.class ? CLASS_ZH[b.class] ?? null : null);

export const TIER_QUALITY_ZH = { normal: '普通', exceptional: '卓越', elite: '精英' } as const;

/** 可用的最大孔數：遊戲表的孔數上限，再受物品格數限制（1 格 1 孔、2 格 2 孔、3 格 3 孔、4 格 4 孔、6 格以上 6 孔；與舊百科 508 筆逐筆核對一致） */
export function maxSocketsOf(b: BaseItem): number {
  const cap = { 1: 1, 2: 2, 3: 3, 4: 4, 6: 6, 8: 6 }[(b.width ?? 1) * (b.height ?? 1)] ?? 6;
  return Math.min(b.sockets ?? 0, cap);
}

/** 在一組已用過的 id 中取得不重複的 id（新增項目遇到同名時加上遊戲列號） */
export function uniqueId(base: string, used: Set<string>, suffix: string | number): string {
  const id = used.has(base) ? `${base}_${suffix}` : base;
  used.add(id);
  return id;
}
