import type { CategoryTile } from '../../components/common/CategoryTiles';
import type { ItemIconProps } from '../../components/common/ItemIcon';

/**
 * 首頁「裝備圖鑑」大圖分類磚（暗金、套裝、符文之語、底材、符文、道具聖物）。
 * 這些磚只需要「各類筆數」與幾個代表物品的圖示，卻要載入整份百科資料（約 1.3 MB）才算得出來，
 * 所以由 scripts/build_portal_summary.mjs 事先算好存成 portalSummary.json，首頁只讀那個小檔，百科各頁進頁面才載入資料。
 * 資料更新後要重跑 `npm run data:portal`；引擎測試會檢查 portalSummary.json 與這裡的計算結果一致，不會悄悄過期。
 */
interface Named { name: string; nameEn: string; baseItem?: string; slot?: ItemIconProps['slot']; imageUrl?: string }
export interface PortalSource {
  uniques: Named[];
  sets: { pieces: Named[] }[];
  bases: Named[];
  runewords: unknown[];
  runes: unknown[];
}

export function buildGearTiles(d: PortalSource): CategoryTile[] {
  const harlequin = d.uniques.find((u) => u.nameEn === 'Harlequin Crest') || d.uniques[0];
  const pb = d.bases.find((b) => b.nameEn === 'Phase Blade') || d.bases[0];
  const setPiece = d.sets[0]?.pieces[0];
  const base = d.bases.find((b) => b.nameEn === 'Archon Plate') || d.bases[0];
  return [
    { id: 'items', label: '暗金裝備', sub: '暗金 Unique', count: d.uniques.length, tone: 'unique', icon: { name: harlequin.name, nameEn: harlequin.nameEn, baseItem: harlequin.baseItem, rarity: 'unique', imageUrl: harlequin.imageUrl } },
    { id: 'sets', label: '成套裝備', sub: '綠色套裝 Set', count: d.sets.length, tone: 'set', icon: { name: setPiece?.name, nameEn: setPiece?.nameEn, baseItem: setPiece?.baseItem, slot: setPiece?.slot, rarity: 'set', imageUrl: setPiece?.imageUrl } },
    { id: 'runewords', label: '符文之語', sub: 'Runeword', count: d.runewords.length, tone: 'unique', icon: { name: pb?.name, nameEn: pb?.nameEn, baseItem: pb?.name, rarity: 'runeword', imageUrl: pb?.imageUrl } },
    { id: 'bases', label: '底材寶典', sub: '白色底材', count: d.bases.length, tone: 'neutral', icon: { name: base.name, nameEn: base.nameEn, baseItem: base.name, rarity: 'normal', imageUrl: base.imageUrl } },
    { id: 'runes', label: '符文寶庫', sub: '1-33# 符文', count: d.runes.length, tone: 'rune', size: 'lg', icon: { runeNumber: 30, name: '貝', nameEn: 'Ber', rarity: 'rune' } },
    { id: 'props', label: '道具聖物', sub: '寶石・鑰匙・藥劑', tone: 'magic', size: 'lg', icon: { name: '完美紫寶石', nameEn: 'Perfect Amethyst', rarity: 'prop' } },
  ];
}
