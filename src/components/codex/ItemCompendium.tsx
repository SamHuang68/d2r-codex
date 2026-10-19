import React, { useState, useMemo } from 'react';
import { UNIQUE_ITEMS_DATA } from '../../data/uniqueItems';
import { SET_ITEMS_DATA } from '../../data/setItems';
import { cleanSearchQuery, normalizeItemQuery } from '../../utils/itemQueryNormalizer';
import { ItemTooltip } from '../common/ItemTooltip';
import { ItemIcon } from '../common/ItemIcon';
import { Sword, Search, Shield, Sparkles, X } from 'lucide-react';
import { GearSlot } from '../../types';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import { PageHeader } from '../common/PageHeader';

export interface ItemCompendiumProps {
  initialQuery?: string;
  onNavigateToBase?: (baseName: string) => void;
}

export const ItemCompendium: React.FC<ItemCompendiumProps> = ({
  initialQuery = '',
  onNavigateToBase,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | GearSlot | 'sets'>('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // Sync initialQuery when prop changes
  React.useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== '') {
      setSearchQuery(initialQuery);
      setActiveCategory('all');
    }
  }, [initialQuery]);

  const catDefs: { id: string; label: string; rep: string; tone: CategoryTile['tone'] }[] = [
    { id: 'all', label: '全部裝備', rep: "Tyrael's Might", tone: 'neutral' },
    { id: 'helm', label: '頭盔', rep: "Harlequin Crest", tone: 'unique' },
    { id: 'weapon', label: '武器', rep: "Windforce", tone: 'unique' },
    { id: 'armor', label: '衣服', rep: "Skin of the Vipermagi", tone: 'unique' },
    { id: 'shield', label: '盾牌', rep: "Stormshield", tone: 'unique' },
    { id: 'gloves', label: '手套', rep: "Dracul's Grasp", tone: 'unique' },
    { id: 'boots', label: '靴子', rep: "War Traveler", tone: 'unique' },
    { id: 'belt', label: '腰帶', rep: "Arachnid Mesh", tone: 'unique' },
    { id: 'ring', label: '戒指', rep: "Stone of Jordan", tone: 'unique' },
    { id: 'amulet', label: '項鍊', rep: "Mara's Kaleidoscope", tone: 'unique' },
    { id: 'charm', label: '護身符', rep: "Annihilus", tone: 'unique' },
    { id: 'jewel', label: '暗金珠寶', rep: "Rainbow Facet", tone: 'unique' },
  ];
  const tiles: CategoryTile[] = [
    ...catDefs.map((c) => {
      const pool = c.id === 'all' ? UNIQUE_ITEMS_DATA : UNIQUE_ITEMS_DATA.filter((u) => u.slot === c.id);
      const rep = pool.find((u) => u.nameEn === c.rep) || pool[0];
      return {
        id: c.id,
        label: c.label,
        count: pool.length,
        tone: c.tone,
        icon: { name: rep?.name, nameEn: rep?.nameEn, baseItem: rep?.baseItem, slot: rep?.slot, rarity: 'unique' as const, imageUrl: rep?.imageUrl },
      };
    }),
    (() => {
      const rep = SET_ITEMS_DATA[0]?.pieces[0];
      return {
        id: 'sets',
        label: '成套裝備',
        sub: '綠色套裝',
        count: SET_ITEMS_DATA.length,
        tone: 'set' as const,
        icon: { name: rep?.name, nameEn: rep?.nameEn, baseItem: rep?.baseItem, slot: rep?.slot, rarity: 'set' as const, imageUrl: rep?.imageUrl },
      };
    })(),
  ];

  // Filtered Uniques
  const filteredUniques = useMemo(() => {
    if (activeCategory === 'sets') return [];
    return UNIQUE_ITEMS_DATA.filter((item) => {
      if (activeCategory !== 'all' && item.slot !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const norm = normalizeItemQuery(searchQuery);
        if (norm && norm.type === 'unique' && item.id === norm.id) {
          return true;
        }
        const queryTerms = cleanSearchQuery(searchQuery);
        const matchesQuery = queryTerms.some((term) => {
          const q = term.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q) || 
                            item.nameEn.toLowerCase().includes(q) ||
                            (item.nameClassic && item.nameClassic.toLowerCase().includes(q));
          const matchBase = item.baseItem.toLowerCase().includes(q) || 
                            (item.baseItemEn ? item.baseItemEn.toLowerCase().includes(q) : false);
          const matchAttr = item.attributes.some((a) => a.toLowerCase().includes(q));
          return matchName || matchBase || matchAttr;
        });
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Filtered Sets
  const filteredSets = useMemo(() => {
    if (activeCategory !== 'all' && activeCategory !== 'sets') return [];
    return SET_ITEMS_DATA.filter((set) => {
      if (searchQuery.trim()) {
        const norm = normalizeItemQuery(searchQuery);
        if (norm && norm.type === 'set' && (set.id === norm.id || set.pieces.some(p => p.id === norm.id))) {
          return true;
        }
        const queryTerms = cleanSearchQuery(searchQuery);
        const matchesQuery = queryTerms.some((term) => {
          const q = term.toLowerCase().trim();
          const matchSetName = set.name.toLowerCase().includes(q) || set.nameEn.toLowerCase().includes(q);
          const matchPieces = set.pieces.some(
            (p) => p.name.toLowerCase().includes(q) || 
                   p.nameEn.toLowerCase().includes(q) || 
                   (p.nameClassic && p.nameClassic.toLowerCase().includes(q)) ||
                   p.attributes.some(a => a.toLowerCase().includes(q))
          );
          return matchSetName || matchPieces;
        });
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  React.useEffect(() => { setVisibleCount(36); }, [activeCategory, searchQuery]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={<Sword className="w-6 h-6" />}
        title="裝備寶典 (暗金與套裝全覽)"
        desc="收錄暗黑破壞神二代各部位指標性暗金裝備與知名全套套裝，包含屬性浮動範圍與完整套裝效果。"
        right={
          <div className="text-xs text-sanctuary-400 font-mono px-3 py-1.5 rounded-lg bg-sanctuary-900 border border-sanctuary-800 self-start">
            暗金 <span className="text-d2-unique font-bold">{filteredUniques.length}</span> ・ 套裝 <span className="text-d2-set font-bold">{filteredSets.length}</span>
          </div>
        }
      />

      <div className="space-y-4 mb-8">
        <CategoryTiles
          tiles={tiles}
          activeId={activeCategory}
          onSelect={(id) => setActiveCategory(id as 'all' | GearSlot | 'sets')}
          iconSize="lg"
          className="grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7"
        />

        <div className="relative">
          <Search className="w-4 h-4 text-sanctuary-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋暗金或套裝名稱、底材或屬性 (例如：軍帽、獅鷲、塔拉夏、SOJ...)"
            className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded-lg pl-10 pr-4 py-2.5 text-sm text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-unique/60"
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredUniques.slice(0, visibleCount).map((item) => (
                <ItemTooltip
                  key={item.id}
                  layout="row"
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
                  onNavigateToBase={onNavigateToBase}
                  imageUrl={item.imageUrl}
                  badges={[
                    ...(item.grade ? [({ normal: '普通', exceptional: '擴展', elite: '精華' } as Record<string, string>)[item.grade] || item.grade] : []),
                    ...(item.classOnly ? [`${item.classOnly}專用`] : []),
                    ...(item.ladderOnly ? ['天梯限定'] : []),
                    ...(item.isNewDLC ? ['RotW DLC'] : []),
                  ]}
                  className="h-full hover:border-d2-unique"
                />
              ))}
            </div>
            {filteredUniques.length > visibleCount && (
              <div className="text-center mt-5">
                <button
                  onClick={() => setVisibleCount((c) => c + 36)}
                  className="px-6 py-2.5 rounded-xl bg-sanctuary-900 border border-sanctuary-700 hover:border-d2-unique text-sm text-sanctuary-200"
                >
                  顯示更多（已顯示 {visibleCount} / {filteredUniques.length} 件）
                </button>
              </div>
            )}
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {set.pieces.map((piece) => (
                      <div
                        key={piece.id}
                        className="p-3 rounded-lg bg-sanctuary-900/60 border border-sanctuary-800 text-xs flex gap-3 items-start"
                      >
                        <ItemIcon
                          name={piece.name}
                          nameEn={piece.nameEn}
                          baseItem={piece.baseItem}
                          slot={piece.slot}
                          rarity="set"
                          size="lg"
                          imageUrl={piece.imageUrl}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-diablo font-bold text-d2-set text-sm">
                            {piece.name}
                          </div>
                          <div className="text-[11px] text-sanctuary-400 mb-2 font-medium">
                          {onNavigateToBase ? (
                            <button
                              type="button"
                              onClick={() => onNavigateToBase(piece.baseItem)}
                              className="hover:text-d2-socket hover:underline cursor-pointer transition-colors inline-flex items-center gap-0.5"
                              title={`點擊查看【${piece.baseItem}】符文底材指南`}
                            >
                              <span>{piece.baseItem}</span>
                              <span className="text-[9px] text-d2-socket">↗</span>
                            </button>
                          ) : (
                            <span>{piece.baseItem}</span>
                          )}{' '}
                          (需求等級: {piece.requiredLevel})
                        </div>
                        <div className="space-y-0.5 text-d2-magic">
                          {piece.attributes.map((attr, i) => (
                            <div key={i}>• {attr}</div>
                          ))}
                        </div>
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
