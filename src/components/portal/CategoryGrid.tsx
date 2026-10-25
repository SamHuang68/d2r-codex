import React from 'react';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import portalSummary from '../../data/codex/portalSummary.json';
import { NAV_GROUPS } from '../layout/navConfig';
import { useLanguage } from '../../context/LanguageContext';

interface CategoryGridProps {
  /** node：裝備寶典要停在的樹節點（暗金裝備磚 'u'、成套裝備磚 's'） */
  onNavigateTab: (tab: string, node?: string) => void;
}

/** 首頁大圖分類格：裝備圖鑑用大尺寸物品圖，其餘 15 個分頁用分組入口卡，21 個分頁入口全數保留 */
const GEAR_TILE_EN: Record<string, { labelEn: string; subEn: string }> = {
  items: { labelEn: 'Unique Items', subEn: 'Uniques' },
  sets: { labelEn: 'Set Items', subEn: 'Sets' },
  runewords: { labelEn: 'Runewords', subEn: 'Runewords' },
  bases: { labelEn: 'Base Items', subEn: 'Bases & Sockets' },
  runes: { labelEn: 'Runes Vault', subEn: '#1–#33 Runes' },
  props: { labelEn: 'Relics & Charms', subEn: 'Gems, Keys & Potions' },
};
export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigateTab }) => {
  const { t } = useLanguage();
  // 各類筆數與代表物品圖示由 scripts/build_portal_summary.mjs 事先算好（首頁不必載入整份百科資料）
  const gearTiles = (portalSummary.gearTiles as unknown as CategoryTile[]).map((tile) => ({
    ...tile,
    labelEn: tile.labelEn ?? GEAR_TILE_EN[tile.id]?.labelEn,
    subEn: tile.subEn ?? GEAR_TILE_EN[tile.id]?.subEn,
  }));

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
          <h2 className="font-diablo text-xl sm:text-2xl font-bold text-d2-unique">
            {t('裝備圖鑑・大圖分類', 'Equipment Categories')}
          </h2>
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
            <span className="text-d2-unique">{t('暗金', 'Unique')}</span>
            <span className="text-d2-set">{t('套裝', 'Set')}</span>
            <span className="text-d2-rare">{t('稀有', 'Rare')}</span>
            <span className="text-d2-magic">{t('魔法', 'Magic')}</span>
            <span className="text-d2-rune">{t('符文／工藝', 'Rune / Crafted')}</span>
          </div>
        </div>
        <CategoryTiles
          tiles={gearTiles}
          onSelect={(id) => onNavigateTab(id, id === 'items' ? 'u' : id === 'sets' ? 's' : undefined)}
          iconSize="xl"
          className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6"
        />
      </div>

      {toolGroups.map((g) => (
        <div key={g.category}>
          <h3 className="font-diablo text-base font-bold text-sanctuary-200 mb-3 border-l-2 border-d2-gold pl-2">
            {t(g.category, g.categoryEn)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
            {g.items.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onNavigateTab(m.id)}
                className="group flex flex-col items-start gap-2 p-4 rounded-xl border border-sanctuary-800 bg-gradient-to-b from-sanctuary-900 to-sanctuary-950 hover:border-d2-gold/60 text-left transition-colors"
              >
                <span className="p-2.5 rounded-lg bg-sanctuary-950 border border-sanctuary-800 [&_svg]:w-7 [&_svg]:h-7">{m.icon}</span>
                <span className="font-diablo font-bold text-sm text-sanctuary-100 group-hover:text-d2-unique">
                  {t(m.label, m.labelEn)}
                </span>
                <span className="text-[11px] text-sanctuary-400 leading-snug">
                  {t(m.desc, m.descEn)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
