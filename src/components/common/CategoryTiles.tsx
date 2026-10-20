import React from 'react';
import { ItemIcon, ItemIconProps } from './ItemIcon';

export type TileTone = 'unique' | 'set' | 'rune' | 'magic' | 'rare' | 'neutral';

export interface CategoryTile {
  id: string;
  label: string;
  sub?: string;
  count?: number;
  icon: ItemIconProps;
  tone?: TileTone;
  /** 覆寫單一磚的圖示尺寸（本機小尺寸 sprite 不宜過度放大） */
  size?: 'md' | 'lg' | 'xl';
}

const TONE: Record<TileTone, { text: string; border: string; glow: string }> = {
  unique: { text: 'text-d2-unique', border: 'hover:border-d2-unique/70', glow: 'from-d2-unique/10' },
  set: { text: 'text-d2-set', border: 'hover:border-d2-set/70', glow: 'from-d2-set/10' },
  rune: { text: 'text-d2-rune', border: 'hover:border-d2-rune/70', glow: 'from-d2-rune/10' },
  magic: { text: 'text-d2-magic', border: 'hover:border-d2-magic/70', glow: 'from-d2-magic/10' },
  rare: { text: 'text-d2-rare', border: 'hover:border-d2-rare/70', glow: 'from-d2-rare/10' },
  neutral: { text: 'text-sanctuary-100', border: 'hover:border-sanctuary-500', glow: 'from-sanctuary-500/10' },
};

interface CategoryTilesProps {
  tiles: CategoryTile[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  iconSize?: 'md' | 'lg' | 'xl';
  className?: string;
}

/** 大圖分類磚：大尺寸物品圖示 + 色碼名稱 + 數量，點擊切換分類 */
export const CategoryTiles: React.FC<CategoryTilesProps> = ({
  tiles,
  activeId,
  onSelect,
  iconSize = 'lg',
  className = 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7',
}) => (
  <div className={`grid gap-2.5 sm:gap-3 ${className}`}>
    {tiles.map((t) => {
      const tone = TONE[t.tone ?? 'unique'];
      const active = activeId === t.id;
      return (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t.id)}
          aria-pressed={activeId == null ? undefined : active}
          className={`relative flex flex-col items-center justify-end gap-1.5 rounded-xl border px-2 pt-3 pb-2.5 text-center transition-all bg-gradient-to-b ${tone.glow} to-sanctuary-950 ${
            active ? 'border-d2-gold shadow-glow-gold' : `border-sanctuary-800 ${tone.border}`
          }`}
        >
          <div className="flex items-end justify-center flex-1">
            <ItemIcon {...t.icon} size={t.size ?? iconSize} showBorder={false} />
          </div>
          <div className={`font-diablo font-bold text-sm leading-tight ${tone.text}`}>{t.label}</div>
          {(t.sub || t.count !== undefined) && (
            <div className="text-[11px] text-sanctuary-400 font-mono leading-none">
              {t.sub}
              {t.sub && t.count !== undefined ? ' · ' : ''}
              {t.count !== undefined ? `${t.count} 項` : ''}
            </div>
          )}
        </button>
      );
    })}
  </div>
);
