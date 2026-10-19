import React from 'react';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import { UNIQUE_ITEMS_DATA } from '../../data/uniqueItems';
import { SET_ITEMS_DATA } from '../../data/setItems';
import { BASE_ITEMS_DATA } from '../../data/bases';
import { RUNEWORDS_DATA } from '../../data/runewords';
import { RUNES_DATA } from '../../data/runes';
import { NAV_GROUPS } from '../layout/navConfig';

interface CategoryGridProps {
  onNavigateTab: (tab: string) => void;
}

/** 首頁大圖分類格：裝備圖鑑用大尺寸物品圖，其餘 11 個分頁用分組入口卡，17 個分頁入口全數保留 */
export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigateTab }) => {
  const uniq = (en: string) => UNIQUE_ITEMS_DATA.find((u) => u.nameEn === en) || UNIQUE_ITEMS_DATA[0];
  const harlequin = uniq('Harlequin Crest');
  const pb = BASE_ITEMS_DATA.find((b) => b.nameEn === 'Phase Blade') || BASE_ITEMS_DATA[0];
  const setPiece = SET_ITEMS_DATA[0]?.pieces[0];
  const base = BASE_ITEMS_DATA.find((b) => b.nameEn === 'Archon Plate') || BASE_ITEMS_DATA[0];

  const gearTiles: CategoryTile[] = [
    { id: 'items', label: '暗金裝備', sub: '暗金 Unique', count: UNIQUE_ITEMS_DATA.length, tone: 'unique', icon: { name: harlequin.name, nameEn: harlequin.nameEn, baseItem: harlequin.baseItem, rarity: 'unique', imageUrl: harlequin.imageUrl } },
    { id: 'sets', label: '成套裝備', sub: '綠色套裝 Set', count: SET_ITEMS_DATA.length, tone: 'set', icon: { name: setPiece?.name, nameEn: setPiece?.nameEn, baseItem: setPiece?.baseItem, slot: setPiece?.slot, rarity: 'set', imageUrl: setPiece?.imageUrl } },
    { id: 'runewords', label: '符文之語', sub: 'Runeword', count: RUNEWORDS_DATA.length, tone: 'unique', icon: { name: pb?.name, nameEn: pb?.nameEn, baseItem: pb?.name, rarity: 'runeword', imageUrl: pb?.imageUrl } },
    { id: 'bases', label: '底材寶典', sub: '白色底材', count: BASE_ITEMS_DATA.length, tone: 'neutral', icon: { name: base.name, nameEn: base.nameEn, baseItem: base.name, rarity: 'normal', imageUrl: base.imageUrl } },
    { id: 'runes', label: '符文寶庫', sub: '1-33# 符文', count: RUNES_DATA.length, tone: 'rune', size: 'lg', icon: { runeNumber: 30, name: '貝', nameEn: 'Ber', rarity: 'rune' } },
    { id: 'props', label: '道具聖物', sub: '寶石・鑰匙・藥劑', tone: 'magic', size: 'lg', icon: { name: '完美紫寶石', nameEn: 'Perfect Amethyst', rarity: 'prop' } },
  ];

  // 非裝備類分頁：沿用導覽設定的圖示與說明，放大成入口卡
  const gearIds = new Set(['items', 'runewords', 'bases', 'runes', 'props', 'overview']);
  const toolGroups = NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => !gearIds.has(i.id)),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-diablo text-xl sm:text-2xl font-bold text-d2-unique">裝備圖鑑・大圖分類</h2>
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
            <span className="text-d2-unique">暗金</span>
            <span className="text-d2-set">套裝</span>
            <span className="text-d2-rare">稀有</span>
            <span className="text-d2-magic">魔法</span>
            <span className="text-d2-rune">符文／工藝</span>
          </div>
        </div>
        <CategoryTiles
          tiles={gearTiles}
          onSelect={(id) => onNavigateTab(id)}
          iconSize="xl"
          className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6"
        />
      </div>

      {toolGroups.map((g) => (
        <div key={g.category}>
          <h3 className="font-diablo text-base font-bold text-sanctuary-200 mb-3 border-l-2 border-d2-gold pl-2">{g.category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
            {g.items.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onNavigateTab(m.id)}
                className="group flex flex-col items-start gap-2 p-4 rounded-xl border border-sanctuary-800 bg-gradient-to-b from-sanctuary-900 to-sanctuary-950 hover:border-d2-gold/60 text-left transition-colors"
              >
                <span className="p-2.5 rounded-lg bg-sanctuary-950 border border-sanctuary-800 [&_svg]:w-7 [&_svg]:h-7">{m.icon}</span>
                <span className="font-diablo font-bold text-sm text-sanctuary-100 group-hover:text-d2-unique">{m.label}</span>
                <span className="text-[11px] text-sanctuary-400 leading-snug">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
