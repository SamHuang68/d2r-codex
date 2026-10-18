import React from 'react';
import { ItemRarity } from '../../types';
import { ItemIcon } from './ItemIcon';

interface ItemTooltipProps {
  title: string;
  titleEn?: string;
  baseItem?: string;
  baseItemEn?: string;
  rarity?: ItemRarity;
  requiredLevel?: number;
  requiredStr?: number;
  requiredDex?: number;
  attributes: string[];
  setBonuses?: { count: number; bonus: string }[];
  fullSetBonuses?: string[];
  flavorText?: string;
  className?: string;
  onNavigateToBase?: (baseName: string) => void;
}

export const ItemTooltip: React.FC<ItemTooltipProps> = ({
  title,
  titleEn,
  baseItem,
  baseItemEn,
  rarity = 'unique',
  requiredLevel,
  requiredStr,
  requiredDex,
  attributes,
  setBonuses,
  fullSetBonuses,
  flavorText,
  className = '',
  onNavigateToBase,
}) => {
  // Title color according to rarity
  const getTitleColor = () => {
    switch (rarity) {
      case 'unique':
        return 'text-d2-unique';
      case 'set':
        return 'text-d2-set';
      case 'rune':
      case 'crafted':
        return 'text-d2-rune';
      case 'rare':
        return 'text-d2-rare';
      case 'magic':
        return 'text-d2-magic';
      default:
        return 'text-d2-white';
    }
  };

  const getBorderColor = () => {
    switch (rarity) {
      case 'unique':
        return 'border-d2-unique/40 shadow-glow-gold';
      case 'set':
        return 'border-d2-set/40 shadow-glow-green';
      case 'rune':
      case 'crafted':
        return 'border-d2-rune/40';
      default:
        return 'border-sanctuary-700';
    }
  };

  return (
    <div
      className={`bg-sanctuary-950/95 backdrop-blur-md border ${getBorderColor()} rounded p-4 text-center text-sm font-sans max-w-sm w-full transition-all duration-200 select-none ${className}`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 0 12px rgba(0, 0, 0, 0.6)'
      }}
    >
      {/* Item Icon */}
      <div className="flex justify-center mb-3">
        <ItemIcon
          name={title}
          nameEn={titleEn}
          baseItem={baseItem}
          rarity={rarity}
          size="lg"
        />
      </div>

      {/* Title */}
      <div className={`font-diablo text-base md:text-lg font-bold tracking-wide ${getTitleColor()}`}>
        {title}
      </div>
      {titleEn && (
        <div className="text-xs text-sanctuary-400 font-mono italic mb-1">
          {titleEn}
        </div>
      )}

      {/* Base Item */}
      {baseItem && (
        <div className="text-xs text-sanctuary-300 font-medium pb-2 border-b border-sanctuary-800">
          {onNavigateToBase ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToBase(baseItem);
              }}
              className="hover:text-d2-socket hover:underline cursor-pointer transition-colors inline-flex items-center gap-1 group/base"
              title={`點擊查看【${baseItem}】符文底材指南`}
            >
              <span>{baseItem}</span>
              {baseItemEn && <span className="text-sanctuary-400">({baseItemEn})</span>}
              <span className="text-[10px] text-d2-socket opacity-60 group-hover/base:opacity-100">↗</span>
            </button>
          ) : (
            <span>
              {baseItem} {baseItemEn && <span className="text-sanctuary-400">({baseItemEn})</span>}
            </span>
          )}
        </div>
      )}

      {/* Requirements */}
      <div className="text-xs text-sanctuary-400 py-1 space-x-2">
        {requiredLevel !== undefined && requiredLevel > 0 && (
          <span>需求等級: <strong className="text-sanctuary-200">{requiredLevel}</strong></span>
        )}
        {requiredStr !== undefined && requiredStr > 0 && (
          <span>需求力量: <strong className="text-sanctuary-200">{requiredStr}</strong></span>
        )}
        {requiredDex !== undefined && requiredDex > 0 && (
          <span>需求敏捷: <strong className="text-sanctuary-200">{requiredDex}</strong></span>
        )}
      </div>

      {/* Attributes */}
      <div className="space-y-1 text-xs text-d2-magic font-sans text-left mt-2 border-t border-sanctuary-800/80 pt-2">
        {attributes.map((attr, idx) => (
          <div key={idx} className="leading-snug">
            {attr}
          </div>
        ))}
      </div>

      {/* Set Bonuses (if applicable) */}
      {setBonuses && setBonuses.length > 0 && (
        <div className="mt-3 pt-2 border-t border-d2-set/30 text-left text-xs space-y-1">
          <div className="text-d2-set font-semibold">部分套裝獎勵:</div>
          {setBonuses.map((sb, idx) => (
            <div key={idx} className="text-d2-set-dark">
              ({sb.count} 件) {sb.bonus}
            </div>
          ))}
        </div>
      )}

      {fullSetBonuses && fullSetBonuses.length > 0 && (
        <div className="mt-2 pt-1 border-t border-d2-set/30 text-left text-xs space-y-1">
          <div className="text-d2-set font-bold">完整套裝獎勵:</div>
          {fullSetBonuses.map((fb, idx) => (
            <div key={idx} className="text-d2-set font-medium">
              {fb}
            </div>
          ))}
        </div>
      )}

      {/* Flavor Text */}
      {flavorText && (
        <div className="mt-3 pt-2 border-t border-sanctuary-800 text-[11px] text-sanctuary-400 italic text-left">
          "{flavorText}"
        </div>
      )}
    </div>
  );
};
