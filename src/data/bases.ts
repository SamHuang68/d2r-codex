/**
 * 百科頁的白色底材資料（防具＋武器）：由遊戲資料表（game/bases.json）即時產生。
 * 推薦符文之語、戰術備註、舊 id 來自覆蓋層 codex/overlay.json；孔數、需求、防禦、傷害、速度全部取自遊戲表。
 */
import { gameData } from '../engine/data';
import type { BaseItem } from '../engine/types';
import { imageForEntry } from '../utils/catalogImage';
import { TIER_QUALITY_ZH, maxSocketsOf, overlay, slug, uniqueId } from './codex/common';

export interface BaseItemData {
  id: string;
  name: string;
  nameEn: string;
  nameClassic?: string;
  category: string;
  itemType?: string;
  grade?: string;
  qualityTier?: string;
  maxSockets: number;
  requiredLevel: number;
  reqStr: number;
  reqDex: number;
  requiredStr?: number;
  requiredDex?: number;
  baseDamage?: string;
  baseDefense?: string;
  defense?: string;
  damage1h?: string;
  damage2h?: string;
  speedGrade?: string;
  attackSpeedModifier?: number;
  larzukSockets?: number;
  recommendedRunewords?: string[];
  tacticalNotes?: string;
  dropRecommendation?: string;
  isSuperiorValued?: boolean;
  isEthPreferred?: boolean;
  imageUrl?: string;
}

export type BaseEquipmentData = BaseItemData;

/**
 * 收錄規則：舊百科已有的一律保留；新增項目排除投擲藥水與任務物品（不是可打孔、可做符文之語的白色底材）。
 */
const included = (b: BaseItem) => b.kind !== 'misc' && (!!overlay.bases[b.code]?.id || (b.spawnable !== false && !b.quest && b.type !== 'tpot'));

const used = new Set<string>(Object.values(overlay.bases).map((o) => o.id as string));
const range = (a?: number, b?: number) => (a !== undefined && b !== undefined ? `${a} - ${b}` : undefined);
const defense = (b: BaseItem) => (b.minAc !== undefined && b.minAc === b.maxAc ? String(b.minAc) : range(b.minAc, b.maxAc));

export const BASE_ITEMS_DATA: BaseItemData[] = gameData.bases.filter(included).map((b) => {
  const o = overlay.bases[b.code];
  const weapon = b.kind === 'weapon';
  const oneHand = range(b.minDam, b.maxDam);
  const twoHand = range(b.minDam2h, b.maxDam2h);
  const sockets = maxSocketsOf(b);
  return {
    id: o?.id ?? uniqueId(slug(b.nameEnUS ?? b.nameEn), used, b.code),
    name: b.name,
    nameEn: o?.nameEn ?? b.nameEnUS ?? b.nameEn,
    nameClassic: o?.nameClassic,
    category: b.kind,
    itemType: o?.itemType ?? (weapon ? '武器鑲材' : '鎧甲防具'),
    grade: b.tier,
    qualityTier: b.tier ? TIER_QUALITY_ZH[b.tier] : undefined,
    maxSockets: sockets,
    requiredLevel: b.levelReq ?? 0,
    reqStr: b.reqStr ?? 0,
    reqDex: b.reqDex ?? 0,
    requiredStr: b.reqStr ?? 0,
    requiredDex: b.reqDex ?? 0,
    // 只有雙手傷害的武器（長柄、長矛、法杖…）：基礎傷害放雙手數值，「單手」欄位留空（篩選器靠這兩欄判斷單手／雙手）
    baseDamage: weapon ? (oneHand ?? twoHand) : undefined,
    damage1h: weapon ? oneHand : undefined,
    damage2h: weapon ? twoHand : undefined,
    baseDefense: b.kind === 'armor' ? defense(b) : undefined,
    defense: b.kind === 'armor' ? defense(b) : undefined,
    speedGrade: o?.speedGrade ?? (weapon ? `[${b.speed ?? 0}]` : '-'),
    attackSpeedModifier: o?.attackSpeedModifier ?? (weapon ? b.speed ?? 0 : 0),
    larzukSockets: sockets,
    recommendedRunewords: o?.recommendedRunewords ?? [],
    tacticalNotes: o?.tacticalNotes,
    dropRecommendation: o?.dropRecommendation,
    isSuperiorValued: o?.isSuperiorValued ?? false,
    isEthPreferred: o?.isEthPreferred ?? false,
    imageUrl: o?.imageUrl ?? (imageForEntry({ id: `base:${b.code}`, kind: 'base', baseCode: b.code }) || undefined),
  };
});
