import React, { useState, useMemo } from 'react';
import { UNIQUE_ITEMS_DATA } from '../../data/uniqueItems';
import { SET_ITEMS_DATA } from '../../data/setItems';
import { ItemTooltip } from '../common/ItemTooltip';
import { Sword, Search, Shield, Sparkles, X } from 'lucide-react';
import { GearSlot } from '../../types';

export const ItemCompendium: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | GearSlot | 'sets'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: '全部裝備' },
    { id: 'helm', label: '頭盔 (Helms)' },
    { id: 'weapon', label: '武器 (Weapons)' },
    { id: 'armor', label: '衣服 (Armor)' },
    { id: 'shield', label: '盾牌 (Shields)' },
    { id: 'gloves', label: '手套 (Gloves)' },
    { id: 'boots', label: '靴子 (Boots)' },
    { id: 'belt', label: '腰帶 (Belts)' },
    { id: 'ring', label: '戒指 (Rings)' },
    { id: 'amulet', label: '項鍊 (Amulets)' },
    { id: 'charm', label: '護身符 (Charms)' },
    { id: 'jewel', label: '暗金珠寶 (Jewels)' },
    { id: 'sets', label: '成套裝備 (Sets)' },
  ];

  // Filtered Uniques
  const filteredUniques = useMemo(() => {
    if (activeCategory === 'sets') return [];
    return UNIQUE_ITEMS_DATA.filter((item) => {
      if (activeCategory !== 'all' && item.slot !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q);
        const matchBase = item.baseItem.toLowerCase().includes(q) || item.baseItemEn.toLowerCase().includes(q);
        const matchAttr = item.attributes.some((a) => a.toLowerCase().includes(q));
        if (!matchName && !matchBase && !matchAttr) return false;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Filtered Sets
  const filteredSets = useMemo(() => {
    if (activeCategory !== 'all' && activeCategory !== 'sets') return [];
    return SET_ITEMS_DATA.filter((set) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSetName = set.name.toLowerCase().includes(q) || set.nameEn.toLowerCase().includes(q);
        const matchPieces = set.pieces.some(
          (p) => p.name.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q) || p.attributes.some(a => a.toLowerCase().includes(q))
        );
        if (!matchSetName && !matchPieces) return false;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-6">
        <h2 className="font-diablo text-2xl sm:text-3xl font-bold text-d2-unique flex items-center gap-2">
          <Sword className="w-6 h-6 text-d2-unique" />
          <span>裝備寶典 (暗金與套裝全覽)</span>
        </h2>
        <p className="text-xs sm:text-sm text-sanctuary-400 mt-1">
          收錄暗黑破壞神二代各部位指標性暗金裝備與知名全套套裝，包含屬性浮動範圍與完整套裝效果。
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-sanctuary-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋暗金或套裝名稱、底材或屬性 (例如：軍帽、獅鷲、塔拉夏、SOJ...)"
            className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded-lg pl-10 pr-4 py-2 text-sm text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-unique/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sanctuary-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors border ${
                  isActive
                    ? 'bg-sanctuary-800 text-d2-unique border-d2-unique/50'
                    : 'bg-sanctuary-950 text-sanctuary-400 border-sanctuary-800 hover:text-sanctuary-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-10">
        {/* Unique Items Section */}
        {filteredUniques.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-d2-unique" />
              <h3 className="font-diablo text-lg font-bold text-d2-unique">
                獨特暗金裝備 ({filteredUniques.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniques.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)}
                  className="cursor-pointer"
                >
                  <ItemTooltip
                    title={item.name}
                    titleEn={item.nameEn}
                    baseItem={item.baseItem}
                    baseItemEn={item.baseItemEn}
                    rarity="unique"
                    requiredLevel={item.requiredLevel}
                    requiredStr={item.requiredStr}
                    requiredDex={item.requiredDex}
                    attributes={item.attributes}
                    flavorText={item.flavorText}
                    className="h-full hover:border-d2-unique hover:scale-[1.01]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Set Items Section */}
        {filteredSets.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-d2-set" />
              <h3 className="font-diablo text-lg font-bold text-d2-set">
                成套套裝裝備 ({filteredSets.length})
              </h3>
            </div>
            <div className="space-y-8">
              {filteredSets.map((set) => (
                <div
                  key={set.id}
                  className="bg-sanctuary-950 border border-d2-set/30 rounded-xl p-5 shadow-xl"
                >
                  {/* Set Header */}
                  <div className="border-b border-sanctuary-800 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-diablo text-xl font-bold text-d2-set">
                        {set.name}
                      </h4>
                      <div className="text-xs text-sanctuary-400 font-mono italic">
                        {set.nameEn} • {set.pieces.length} 件套裝
                      </div>
                    </div>
                  </div>

                  {/* Set Pieces Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {set.pieces.map((piece) => (
                      <div
                        key={piece.id}
                        className="p-3 rounded-lg bg-sanctuary-900/60 border border-sanctuary-800 text-xs"
                      >
                        <div className="font-diablo font-bold text-d2-set text-sm">
                          {piece.name}
                        </div>
                        <div className="text-[11px] text-sanctuary-400 mb-2 font-medium">
                          {piece.baseItem} (需求等級: {piece.requiredLevel})
                        </div>
                        <div className="space-y-0.5 text-d2-magic">
                          {piece.attributes.map((attr, i) => (
                            <div key={i}>• {attr}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Set Bonuses Footer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-sanctuary-900 border border-sanctuary-800 text-xs">
                    <div>
                      <div className="text-d2-set font-bold mb-1">部分套裝加成效果:</div>
                      {set.partialBonuses.map((pb, idx) => (
                        <div key={idx} className="text-sanctuary-300">
                          ({pb.count} 件) {pb.bonus}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-d2-set font-bold mb-1">完整全套套裝加成:</div>
                      {set.fullBonuses.map((fb, idx) => (
                        <div key={idx} className="text-d2-set font-medium">
                          • {fb}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredUniques.length === 0 && filteredSets.length === 0 && (
          <div className="p-12 text-center text-sanctuary-400 bg-sanctuary-900/40 rounded-xl border border-sanctuary-800">
            查無符合目前條件的裝備，請更換分類或清除搜尋關鍵字。
          </div>
        )}
      </div>
    </div>
  );
};
