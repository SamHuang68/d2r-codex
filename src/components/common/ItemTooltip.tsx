import React from 'react';
import { ItemRarity } from '../../types';
import { ItemIcon } from './ItemIcon';
import { useLanguage } from '../../context/LanguageContext';

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
  imageUrl?: string;
  /** stack：圖在上（預設）；row：圖在左、文字在右，適合清單卡 */
  layout?: 'stack' | 'row';
  badges?: string[];
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
  imageUrl,
  layout = 'stack',
  badges,
}) => {
  const { isEn } = useLanguage();
  const primaryTitle = isEn && titleEn ? titleEn : title;
  const secondaryTitle = isEn ? undefined : (titleEn && titleEn !== title ? titleEn : undefined);
  const primaryBase = isEn && baseItemEn ? baseItemEn : baseItem;
  const secondaryBase = isEn ? undefined : (baseItemEn && baseItemEn !== baseItem ? baseItemEn : undefined);

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

  const row = layout === 'row';

  const header = (
    <>
      <div className={`font-diablo text-lg md:text-xl font-bold tracking-wide leading-tight ${getTitleColor()}`}>
        {primaryTitle}
      </div>
      {secondaryTitle && (
        <div className="text-xs text-sanctuary-400 font-mono italic mb-1">
          {secondaryTitle}
        </div>
      )}

      {primaryBase && (
        <div className={`text-xs text-sanctuary-300 font-medium pb-2 border-b border-sanctuary-800 ${row ? '' : ''}`}>
          {onNavigateToBase ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToBase(baseItem || primaryBase);
              }}
              className="hover:text-d2-socket hover:underline cursor-pointer transition-colors inline-flex items-center gap-1 group/base"
              title={isEn ? `Click to view base item guide` : `點擊查看【${baseItem}】符文底材指南`}
            >
              <span>{primaryBase}</span>
              {secondaryBase && <span className="text-sanctuary-400">({secondaryBase})</span>}
              <span className="text-[10px] text-d2-socket opacity-60 group-hover/base:opacity-100">↗</span>
            </button>
          ) : (
            <span>
              {primaryBase} {secondaryBase && <span className="text-sanctuary-400">({secondaryBase})</span>}
            </span>
          )}
        </div>
      )}

      {badges && badges.length > 0 && (
        <div className={`flex flex-wrap gap-1 pt-1.5 ${row ? '' : 'justify-center'}`}>
          {badges.map((b) => (
            <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-sanctuary-900 text-sanctuary-300 border border-sanctuary-800 font-mono">
              {b}
            </span>
          ))}
        </div>
      )}

      <div className="text-xs text-sanctuary-400 py-1 space-x-2">
        {requiredLevel !== undefined && requiredLevel > 0 && (
          <span>{isEn ? 'Required Level: ' : '需求等級: '}<strong className="text-sanctuary-200">{requiredLevel}</strong></span>
        )}
        {requiredStr !== undefined && requiredStr > 0 && (
          <span>{isEn ? 'Required Strength: ' : '需求力量: '}<strong className="text-sanctuary-200">{requiredStr}</strong></span>
        )}
        {requiredDex !== undefined && requiredDex > 0 && (
          <span>{isEn ? 'Required Dexterity: ' : '需求敏捷: '}<strong className="text-sanctuary-200">{requiredDex}</strong></span>
        )}
      </div>

      <div className="space-y-1 text-xs text-d2-magic font-sans text-left mt-2 border-t border-sanctuary-800/80 pt-2">
        {attributes.map((attr, idx) => (
          <div key={idx} className="leading-snug">
            {attr}
          </div>
        ))}
      </div>

      {setBonuses && setBonuses.length > 0 && (
        <div className="mt-3 pt-2 border-t border-d2-set/30 text-left text-xs space-y-1">
          <div className="text-d2-set font-semibold">{isEn ? 'Partial Set Bonuses:' : '部分套裝獎勵:'}</div>
          {setBonuses.map((sb, idx) => (
            <div key={idx} className="text-d2-set-dark">
              ({sb.count} {isEn ? 'Items' : '件'}) {sb.bonus}
            </div>
          ))}
        </div>
      )}

      {fullSetBonuses && fullSetBonuses.length > 0 && (
        <div className="mt-2 pt-1 border-t border-d2-set/30 text-left text-xs space-y-1">
          <div className="text-d2-set font-bold">{isEn ? 'Full Set Bonuses:' : '完整套裝獎勵:'}</div>
          {fullSetBonuses.map((fb, idx) => (
            <div key={idx} className="text-d2-set font-medium">
              {fb}
            </div>
          ))}
        </div>
      )}

      {flavorText && (
        <div className="mt-3 pt-2 border-t border-sanctuary-800 text-[11px] text-sanctuary-400 italic text-left">
          "{flavorText}"
        </div>
      )}
    </>
  );

  return (
    <div
      className={`bg-sanctuary-950 border rounded-2xl p-4 transition-all duration-200 ${getBorderColor()} ${className}`}
    >
      {row ? (
        <div className="flex items-start gap-4">
          <div className="shrink-0 p-2 bg-sanctuary-900/60 rounded-xl border border-sanctuary-800/80 flex items-center justify-center">
            <ItemIcon
              name={title}
              nameEn={titleEn}
              baseItem={baseItem}
              rarity={rarity}
              size="lg"
              showBorder={false}
              imageUrl={imageUrl}
            />
          </div>
          <div className="flex-1 min-w-0">{header}</div>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <div className="flex justify-center p-3 bg-sanctuary-900/40 rounded-xl border border-sanctuary-800/50">
            <ItemIcon
              name={title}
              nameEn={titleEn}
              baseItem={baseItem}
              rarity={rarity}
              size="xl"
              showBorder={false}
              imageUrl={imageUrl}
            />
          </div>
          {header}
        </div>
      )}
    </div>
  );
};
