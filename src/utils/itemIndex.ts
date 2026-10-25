/**
 * 暗金與套裝的分類索引：裝備寶典、聖杯打寶共用，確保兩頁的分層與數量一致。
 * 資料仍來自 src/data/uniqueItems.ts、setItems.ts，分類依據來自 equipTaxonomy（遊戲物品類型）。
 */
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { CLASS_ZH_TO_EN } from '../engine/slots';
import { SET_ITEMS_DATA } from '../data/setItems';
import type { SetItemCollection, UniqueItemData } from '../types';
import {
  JEWELRY_DEF, TaxDef, prefixDefs, tierDefs, leafOfItem, resolveGameBase, tierOfBase, charmSize,
} from './equipTaxonomy';

// ------------------------------------------------------------
// 分類樹：品質（暗金／套裝）→ 品階（普通／卓越／精英）→ 部位 → 類型；飾品沒有品階，獨立一支
// ------------------------------------------------------------
export const CLASS_ORDER = ['亞馬遜', '刺客', '野蠻人', '德魯伊', '聖騎士', '死靈法師', '魔法使', '術士'];
export const SET_DEFS: TaxDef[] = [
  {
    id: 'class',
    label: '職業套裝',
    en: 'Class Sets',
    children: CLASS_ORDER.map((c) => ({
      id: `class/${c}`,
      label: `${c}套裝`,
      en: `${CLASS_ZH_TO_EN[c] || c} Sets`,
    })),
  },
  {
    id: 'common',
    label: '通用套裝',
    en: 'General Sets',
    children: [
      { id: 'common/early', label: '初階（Lv 1–9）', en: 'Early (Lv 1–9)' },
      { id: 'common/mid', label: '中階（Lv 10–19）', en: 'Mid (Lv 10–19)' },
      { id: 'common/late', label: '高階（Lv 20 以上）', en: 'High (Lv 20+)' },
    ],
  },
];
export const ITEM_TREE_DEFS: TaxDef[] = [
  { id: 'u', label: '暗金裝備', en: 'Unique Items', children: [...tierDefs('u'), ...prefixDefs([JEWELRY_DEF], 'u')] },
  { id: 's', label: '套裝', en: 'Set Items', children: prefixDefs(SET_DEFS, 's') },
];

export const CHARM_LABEL: Record<string, string> = { small: '小型咒符', large: '大型咒符', grand: '特大咒符' };
export const CHARM_ORDER = ['small', 'large', 'grand'];

export interface UEntry { item: UniqueItemData; leaf: string; sec: string; secIdx: number }
export interface SEntry { set: SetItemCollection; leaf: string; minLv: number }

export const byText = (a: string, b: string) => a.localeCompare(b, 'zh-Hant');

/** 暗金：護甲武器依底材品階掛到「品階 → 部位 → 類型」；飾品直接依部位；咒符再依尺寸分段；同段依需求等級排序 */
export const U_ENTRIES: UEntry[] = UNIQUE_ITEMS_DATA.map((item) => {
  const rel = leafOfItem(item);
  if (rel.startsWith('jewelry/')) {
    const isCharm = rel === 'jewelry/charm';
    const sec = isCharm ? charmSize(item.baseItemId) ?? 'small' : 'all';
    return { item, leaf: `u/${rel}`, sec, secIdx: isCharm ? CHARM_ORDER.indexOf(sec) : 0 };
  }
  const tier = tierOfBase(resolveGameBase({ id: item.baseItemId, name: item.baseItem }), item.grade);
  return { item, leaf: `u/${tier}/${rel}`, sec: 'all', secIdx: 0 };
}).sort((a, b) => a.secIdx - b.secIdx || a.item.requiredLevel - b.item.requiredLevel || byText(a.item.name, b.item.name));

/** 套裝：職業套裝依職業；其餘依「最低一件的需求等級」分三階 */
export const S_ENTRIES: SEntry[] = SET_ITEMS_DATA.map((set) => {
  const minLv = Math.min(...set.pieces.map((p) => p.requiredLevel));
  const leaf = set.isClassSet && set.class && CLASS_ORDER.includes(set.class)
    ? `s/class/${set.class}`
    : `s/common/${minLv <= 9 ? 'early' : minLv <= 19 ? 'mid' : 'late'}`;
  return { set, leaf, minLv };
}).sort((a, b) => a.minLv - b.minLv || byText(a.set.name, b.set.name));
