import React, { useState } from 'react';
import {
  SPECIAL_PROPERTIES,
  POPULAR_SPECIAL_PROPERTIES,
  UnifiedItemRarity,
} from '../../utils/propertyFilter';
import type { GearSlot } from '../../types';
import { X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface CrossPropertyFilterBarProps {
  selectedPropertyIds: string[];
  onToggleProperty: (id: string) => void;
  selectedRarity: 'all' | UnifiedItemRarity;
  onSelectRarity: (rarity: 'all' | UnifiedItemRarity) => void;
  selectedSlot: 'all' | GearSlot | 'multiple';
  onSelectSlot: (slot: 'all' | GearSlot | 'multiple') => void;
  onClearFilters: () => void;
  totalHits: number;
  propertyCounts: Record<string, number>;
  rarityCounts: { all: number; unique: number; set: number; runeword: number };
}

export const CrossPropertyFilterBar: React.FC<CrossPropertyFilterBarProps> = ({
  selectedPropertyIds,
  onToggleProperty,
  selectedRarity,
  onSelectRarity,
  selectedSlot,
  onSelectSlot,
  onClearFilters,
  totalHits,
  propertyCounts,
  rarityCounts,
}) => {
  const { t, isEn } = useLanguage();
  const [showAllProps, setShowAllProps] = useState(false);

  const hasActiveFilters =
    selectedPropertyIds.length > 0 ||
    selectedRarity !== 'all' ||
    selectedSlot !== 'all';

  const popularProps = SPECIAL_PROPERTIES.filter((p) =>
    POPULAR_SPECIAL_PROPERTIES.includes(p.id)
  );
  const remainingProps = SPECIAL_PROPERTIES.filter(
    (p) => !POPULAR_SPECIAL_PROPERTIES.includes(p.id)
  );

  const rarityTabs: { id: 'all' | UnifiedItemRarity; label: string; count: number; tone: string }[] = [
    { id: 'all', label: isEn ? 'All Qualities' : '全部品質', count: rarityCounts.all, tone: 'text-sanctuary-100 hover:border-sanctuary-500' },
    { id: 'unique', label: isEn ? 'Uniques' : '暗金 (Unique)', count: rarityCounts.unique, tone: 'text-d2-unique hover:border-d2-unique' },
    { id: 'set', label: isEn ? 'Sets' : '套裝 (Set)', count: rarityCounts.set, tone: 'text-d2-set hover:border-d2-set' },
    { id: 'runeword', label: isEn ? 'Runewords' : '符文之語 (Runewords)', count: rarityCounts.runeword, tone: 'text-d2-rune hover:border-d2-rune' },
  ];

  const slotOptions: { id: 'all' | GearSlot | 'multiple'; label: string }[] = [
    { id: 'all', label: isEn ? 'All Slots' : '全部部位' },
    { id: 'weapon', label: isEn ? 'Weapons' : '武器' },
    { id: 'helm', label: isEn ? 'Helms' : '頭盔' },
    { id: 'armor', label: isEn ? 'Body Armors' : '護甲' },
    { id: 'shield', label: isEn ? 'Shields' : '盾牌' },
    { id: 'gloves', label: isEn ? 'Gloves' : '手套' },
    { id: 'boots', label: isEn ? 'Boots' : '靴子' },
    { id: 'belt', label: isEn ? 'Belts' : '腰帶' },
    { id: 'amulet', label: isEn ? 'Amulets' : '護身符' },
    { id: 'ring', label: isEn ? 'Rings' : '戒指' },
    { id: 'charm', label: isEn ? 'Charms' : '咒符' },
    { id: 'jewel', label: isEn ? 'Jewels' : '珠寶' },
    { id: 'multiple', label: isEn ? 'Multi-slot Runewords' : '多部位符文組' },
  ];

  return (
    <div className="bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4 mb-6">
      {/* 頂部標題與狀態列 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sanctuary-850 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sanctuary-900 border border-sanctuary-750 text-d2-unique">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-diablo text-base font-bold text-sanctuary-100 flex items-center gap-2">
              <span>{t('跨裝備特殊屬性篩選', 'Cross-Equipment Special Property Filter')}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-d2-unique/15 text-d2-unique border border-d2-unique/30 font-sans font-semibold">
                {t('暗金 · 套裝 · 符文組', 'Uniques · Sets · Runewords')}
              </span>
            </h3>
            <p className="text-xs text-sanctuary-400 mt-0.5">
              {t('快速定位擁有關鍵 Meta 屬性（永不毀損、+全技能、全抗、MF 等）的代表性神裝', 'Filter iconic endgame gear by key meta properties like Indestructible, +All Skills, All Res, MF, etc.')}
            </p>
          </div>
        </div>

        {/* 篩選重置按鈕 */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-750 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-d2-fire" />
            <span>{t('重置篩選', 'Reset Filters')}</span>
          </button>
        )}
      </div>

      {/* 第一行：品質切換分頁 + 部位選單 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* 品質分頁切換 */}
        <div className="flex flex-wrap items-center gap-1.5">
          {rarityTabs.map((tab) => {
            const isSelected = selectedRarity === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectRarity(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sanctuary-850 border-sanctuary-600 shadow-sm ' + tab.tone
                    : 'bg-sanctuary-900/60 border-sanctuary-800 text-sanctuary-400 hover:bg-sanctuary-900 ' + tab.tone
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sanctuary-950 font-mono text-sanctuary-400">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 部位選單 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-sanctuary-400 font-medium shrink-0">部位:</span>
          <select
            value={selectedSlot}
            onChange={(e) => onSelectSlot(e.target.value as any)}
            className="bg-sanctuary-900 border border-sanctuary-750 rounded-lg px-2.5 py-1 text-xs text-sanctuary-200 focus:outline-none focus:border-d2-unique"
          >
            {slotOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 第二行：核心特殊屬性 Chips */}
      <div>
        <div className="text-xs text-sanctuary-400 mb-2 font-medium flex items-center justify-between">
          <span>{isEn ? 'Featured Properties (Click to filter):' : '精選核心屬性 (點擊切換篩選，可複選):'}</span>
          {selectedPropertyIds.length > 0 && (
            <span className="text-d2-unique text-xs font-mono">
              {isEn ? `${selectedPropertyIds.length} properties selected · ${totalHits} matched` : `已選取 ${selectedPropertyIds.length} 項屬性 · 符合 ${totalHits} 件`}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {popularProps.map((prop) => {
            const isSelected = selectedPropertyIds.includes(prop.id);
            const count = propertyCounts[prop.id] ?? 0;
            return (
              <button
                key={prop.id}
                type="button"
                onClick={() => onToggleProperty(prop.id)}
                title={isEn ? (prop.descriptionEn || prop.labelEn) : prop.description}
                className={`px-2.5 py-1.2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-d2-unique/20 text-d2-unique border-d2-unique shadow-sm ring-1 ring-d2-unique/40'
                    : count > 0
                    ? 'bg-sanctuary-900/70 text-sanctuary-300 border-sanctuary-750 hover:border-sanctuary-600 hover:text-sanctuary-100 hover:bg-sanctuary-850'
                    : 'bg-sanctuary-900/30 text-sanctuary-550 border-sanctuary-850 cursor-not-allowed opacity-60'
                }`}
              >
                <span>{isEn && prop.shortLabelEn ? prop.shortLabelEn : prop.shortLabel}</span>
                <span
                  className={`text-[10px] px-1.2 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-d2-unique/30 text-amber-200'
                      : 'bg-sanctuary-950 text-sanctuary-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* 展開更多屬性按鈕 */}
          <button
            type="button"
            onClick={() => setShowAllProps(!showAllProps)}
            className="px-2.5 py-1.2 rounded-lg text-xs font-medium bg-sanctuary-900 hover:bg-sanctuary-850 text-d2-magic border border-sanctuary-750 hover:border-d2-magic/60 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{showAllProps ? (isEn ? 'Show Less' : '收起更多') : (isEn ? `More Properties (${remainingProps.length})` : `更多屬性 (${remainingProps.length})`)}</span>
            {showAllProps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 展開之更多屬性清單 */}
        {showAllProps && (
          <div className="mt-3 p-3 bg-sanctuary-900/50 rounded-xl border border-sanctuary-800/80 space-y-2 animate-fade-in">
            <div className="text-[11px] text-sanctuary-400 font-medium">{isEn ? 'Other Properties:' : '其他機制屬性:'}</div>
            <div className="flex flex-wrap gap-1.5">
              {remainingProps.map((prop) => {
                const isSelected = selectedPropertyIds.includes(prop.id);
                const count = propertyCounts[prop.id] ?? 0;
                return (
                  <button
                    key={prop.id}
                    type="button"
                    onClick={() => onToggleProperty(prop.id)}
                    title={isEn ? (prop.descriptionEn || prop.labelEn) : prop.description}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-d2-magic/20 text-d2-magic border-d2-magic shadow-sm ring-1 ring-d2-magic/40'
                        : count > 0
                        ? 'bg-sanctuary-900 text-sanctuary-300 border-sanctuary-750 hover:border-sanctuary-600 hover:text-sanctuary-100'
                        : 'bg-sanctuary-900/30 text-sanctuary-550 border-sanctuary-850 opacity-60'
                    }`}
                  >
                    <span>{isEn && prop.shortLabelEn ? prop.shortLabelEn : prop.shortLabel}</span>
                    <span
                      className={`text-[10px] px-1.2 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? 'bg-d2-magic/30 text-cyan-200'
                          : 'bg-sanctuary-950 text-sanctuary-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
