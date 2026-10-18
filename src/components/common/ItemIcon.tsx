import React, { useState } from 'react';
import { GearSlot, ItemRarity } from '../../types';
import { resolveItemImagePath } from '../../utils/itemImageResolver';

export interface ItemIconProps {
  name?: string;
  nameEn?: string;
  baseItem?: string;
  slot?: GearSlot | string;
  rarity?: ItemRarity | 'unique' | 'set' | 'runeword' | 'rune' | 'charm' | 'gem' | 'prop' | 'rare' | 'magic' | 'crafted';
  runeNumber?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  imageUrl?: string;
}

/**
 * 聖休亞瑞暗黑物品真實遊戲立繪圖片渲染元件
 * 採用遊戲原版真實提取物品貼圖（Sprites），結合復古像素銳化渲染與動態品質光暈
 */
export const ItemIcon: React.FC<ItemIconProps> = ({
  name = '',
  nameEn = '',
  baseItem = '',
  slot = '',
  rarity = 'unique',
  runeNumber,
  size = 'md',
  className = '',
  showBorder = true,
  imageUrl,
}) => {
  const [imgError, setImgError] = useState(false);
  const n = `${name} ${nameEn} ${baseItem}`.toLowerCase();
  const envBase = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = envBase.endsWith('/') ? envBase : `${envBase}/`;

  // 1. 決定尺寸類別
  const sizeMap = {
    xs: 'w-5 h-5 min-w-[20px] min-h-[20px]',
    sm: 'w-7 h-7 min-w-[28px] min-h-[28px]',
    md: 'w-10 h-10 min-w-[40px] min-h-[40px]',
    lg: 'w-14 h-14 min-w-[56px] min-h-[56px]',
    xl: 'w-20 h-20 min-w-[80px] min-h-[80px]',
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  // 2. 決定稀有度光暈色彩
  const getColors = () => {
    if (
      rarity === 'set' ||
      n.includes('套裝') ||
      n.includes('tal rasha') ||
      n.includes('immortal king') ||
      n.includes('natalya') ||
      n.includes('guillaume') ||
      n.includes('aldur') ||
      n.includes('trang-oul') ||
      n.includes('m\'avina') ||
      n.includes('griswold') ||
      n.includes('sigon')
    ) {
      return {
        border: 'border-emerald-500/60 hover:border-emerald-400',
        bg: 'bg-emerald-950/40',
        glow: 'shadow-emerald-950/40',
        accent: '#10b981',
      };
    }
    if (
      rarity === 'rune' ||
      runeNumber !== undefined ||
      n.includes('符文') ||
      n.includes('runeword') ||
      rarity === 'runeword'
    ) {
      return {
        border: 'border-amber-500/70 hover:border-amber-400',
        bg: 'bg-amber-950/40',
        glow: 'shadow-amber-950/40',
        accent: '#f59e0b',
      };
    }
    if (rarity === 'magic' || n.includes('魔法') || n.includes('藍色')) {
      return {
        border: 'border-sky-500/60 hover:border-sky-400',
        bg: 'bg-sky-950/40',
        glow: 'shadow-sky-950/40',
        accent: '#38bdf8',
      };
    }
    if (rarity === 'rare' || n.includes('亮金')) {
      return {
        border: 'border-yellow-400/70 hover:border-yellow-300',
        bg: 'bg-yellow-950/40',
        glow: 'shadow-yellow-950/40',
        accent: '#facc15',
      };
    }
    // 預設暗金 (Unique)
    return {
      border: 'border-amber-600/70 hover:border-d2-unique',
      bg: 'bg-stone-950/60',
      glow: 'shadow-amber-900/30',
      accent: '#c79b32',
    };
  };

  const colorConfig = getColors();

  // 3. 呼叫專屬模組解析真實遊戲立繪圖片路徑
  const imageSrc = resolveItemImagePath({
    name,
    nameEn,
    baseItem,
    slot,
    rarity,
    runeNumber,
    baseUrl,
    imageUrl,
  });

  return (
    <div
      className={`relative flex items-center justify-center rounded transition-all duration-200 select-none overflow-hidden ${containerSize} ${
        showBorder ? `border ${colorConfig.border} ${colorConfig.bg} ${colorConfig.glow} shadow-sm` : ''
      } ${className}`}
      title={name || nameEn || baseItem}
    >
      {/* 像素暗黑背景網格質感 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

      {/* 遊戲真實貼圖 */}
      {!imgError ? (
        <img
          src={imageSrc}
          alt={name || nameEn || 'Item'}
          className="relative z-10 max-w-full max-h-full object-contain p-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [image-rendering:pixelated] transition-transform duration-200 hover:scale-110"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        /* 降級標籤 (極少情況) */
        <span className="relative z-10 font-bold font-serif text-[10px] text-amber-300/80 uppercase">
          {name ? name.slice(0, 2) : 'D2'}
        </span>
      )}
    </div>
  );
};
