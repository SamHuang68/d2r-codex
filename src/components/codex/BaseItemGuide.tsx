import React, { useState, useMemo } from 'react';
import { BASE_ITEMS_DATA, BaseItemData } from '../../data/bases';
import { ItemIcon } from '../common/ItemIcon';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import { PageHeader } from '../common/PageHeader';
import { 
  ShieldAlert, 
  Search, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Zap, 
  HelpCircle,
  Gem
} from 'lucide-react';

export interface BaseItemGuideProps {
  initialQuery?: string;
  onNavigateToRuneword?: (runewordName: string) => void;
}

export const BaseItemGuide: React.FC<BaseItemGuideProps> = ({
  initialQuery = "",
  onNavigateToRuneword,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [filterEthOnly, setFilterEthOnly] = useState<boolean>(false);
  const [filterSuperiorOnly, setFilterSuperiorOnly] = useState<boolean>(false);

  // Sync initialQuery when prop changes
  React.useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const [selectedTier, setSelectedTier] = useState<string>("全部");
  const [visibleCount, setVisibleCount] = useState<number>(48);

  const hasDmg = (v?: string) => !!v && v !== '-';
  const isShield = (i: BaseItemData) => i.category === 'armor' && i.name.includes('盾');
  // 資料的 category 為 weapon / armor；單手、雙手與盾牌依傷害欄位與名稱判斷
  const matchCategory = (i: BaseItemData, cat: string) => {
    switch (cat) {
      case '單手武器': return i.category === 'weapon' && hasDmg(i.damage1h);
      case '雙手武器': return i.category === 'weapon' && hasDmg(i.damage2h);
      case '防具鎧甲': return i.category === 'armor' && !isShield(i);
      case '盾牌': return isShield(i);
      default: return true;
    }
  };

  const tierOptions = ["全部", "普通", "進階", "精華"];

  const filteredItems = useMemo(() => {
    return BASE_ITEMS_DATA.filter((item: BaseItemData) => {
      // 分類篩選
      if (!matchCategory(item, selectedCategory)) {
        return false;
      }
      if (selectedTier !== "全部" && item.qualityTier !== selectedTier) {
        return false;
      }
      // 無形篩選
      if (filterEthOnly && !item.isEthPreferred) {
        return false;
      }
      // 超強篩選
      if (filterSuperiorOnly && !item.isSuperiorValued) {
        return false;
      }
      // 搜尋關鍵字
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q);
        const matchType = (item.itemType || '').toLowerCase().includes(q);
        const matchRW = (item.recommendedRunewords || []).some((rw: string) => rw.toLowerCase().includes(q));
        const matchNotes = (item.tacticalNotes || '').toLowerCase().includes(q);
        if (!matchName && !matchType && !matchRW && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedTier, searchQuery, filterEthOnly, filterSuperiorOnly]);

  React.useEffect(() => { setVisibleCount(48); }, [selectedCategory, selectedTier, searchQuery, filterEthOnly, filterSuperiorOnly]);

  const pick = (cat: string, nameEn: string) =>
    BASE_ITEMS_DATA.find((i) => matchCategory(i, cat) && i.nameEn === nameEn) ||
    BASE_ITEMS_DATA.find((i) => matchCategory(i, cat));
  const tileSrc = (cat: string, nameEn: string): CategoryTile['icon'] => {
    const i = pick(cat, nameEn);
    return { name: i?.name, nameEn: i?.nameEn, baseItem: i?.name, rarity: 'normal', imageUrl: i?.imageUrl };
  };
  const tiles: CategoryTile[] = [
    { id: '全部', label: '全部底材', sub: '武器・防具', count: BASE_ITEMS_DATA.length, icon: tileSrc('防具鎧甲', 'Archon Plate'), tone: 'neutral' },
    { id: '單手武器', label: '單手武器', count: BASE_ITEMS_DATA.filter((i) => matchCategory(i, '單手武器')).length, icon: tileSrc('單手武器', 'Phase Blade'), tone: 'unique' },
    { id: '雙手武器', label: '雙手武器', count: BASE_ITEMS_DATA.filter((i) => matchCategory(i, '雙手武器')).length, icon: tileSrc('雙手武器', 'Colossus Blade'), tone: 'unique' },
    { id: '防具鎧甲', label: '防具鎧甲', count: BASE_ITEMS_DATA.filter((i) => matchCategory(i, '防具鎧甲')).length, icon: tileSrc('防具鎧甲', 'Archon Plate'), tone: 'magic' },
    { id: '盾牌', label: '盾牌', count: BASE_ITEMS_DATA.filter((i) => matchCategory(i, '盾牌')).length, icon: tileSrc('盾牌', 'Monarch'), tone: 'rare' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <PageHeader
        icon={<ShieldAlert className="w-6 h-6" />}
        tone="text-d2-socket"
        title="頂級符文之語底材與打孔寶典"
        desc="收錄悔恨幻化之刃、法師鎧甲謎團、無形銳利無限、神聖小盾精神等全職業 S 級畢業底材，提供 WSM 攻速、最大孔數、拉蘇克固定打孔機制與打寶估價戰術解析。"
        right={
          <div className="flex items-center gap-3 bg-sanctuary-900/80 p-2.5 rounded-2xl border border-sanctuary-800 shrink-0 self-start">
            <div className="text-right px-3 border-r border-sanctuary-800">
              <div className="text-[10px] text-sanctuary-400 font-mono">收錄經典底材</div>
              <div className="text-xl font-bold font-mono text-d2-socket">{BASE_ITEMS_DATA.length} 款</div>
            </div>
            <div className="text-right px-3">
              <div className="text-[10px] text-sanctuary-400 font-mono">符合條件</div>
              <div className="text-xl font-bold font-mono text-d2-gold">{filteredItems.length} 款</div>
            </div>
          </div>
        }
      />

      {/* 大圖分類磚 */}
      <CategoryTiles
        tiles={tiles}
        activeId={selectedCategory}
        onSelect={setSelectedCategory}
        iconSize="lg"
        className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      />

      {/* 篩選與搜尋列 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* 品階按鈕 */}
        <div className="flex items-center gap-1.5 bg-sanctuary-900/80 p-1.5 rounded-2xl border border-sanctuary-800 overflow-x-auto no-scrollbar">
          {tierOptions.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedTier === t
                  ? 'bg-d2-socket text-sanctuary-950 font-bold shadow-md shadow-d2-socket/20'
                  : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-800/60'
              }`}
            >
              {t === '全部' ? '全部品階' : `${t}品階`}
            </button>
          ))}
        </div>

        {/* 快速開關與搜尋 */}
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
          <button
            onClick={() => setFilterEthOnly(!filterEthOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border flex items-center gap-1.5 shrink-0 ${
              filterEthOnly
                ? 'bg-sanctuary-800 border-d2-cold text-d2-cold font-bold'
                : 'bg-sanctuary-900 border-sanctuary-800 text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            偏好無形 (Eth)
          </button>

          <button
            onClick={() => setFilterSuperiorOnly(!filterSuperiorOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border flex items-center gap-1.5 shrink-0 ${
              filterSuperiorOnly
                ? 'bg-sanctuary-800 border-d2-gold text-d2-gold font-bold'
                : 'bg-sanctuary-900 border-sanctuary-800 text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            超強 15%ED 尊貴
          </button>

          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sanctuary-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋底材、英文名或推薦符文 (如: 悔恨、謎團)..."
              className="w-full bg-sanctuary-900 border border-sanctuary-800 rounded-xl pl-9 pr-4 py-2 text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-socket transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 底材卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.slice(0, visibleCount).map((item) => (
          <div
            key={item.id}
            className="bg-sanctuary-900/80 border border-sanctuary-800 rounded-2xl p-5 flex flex-col justify-between hover:border-sanctuary-700 transition-all duration-200 space-y-4 group shadow-xl"
          >
            {/* 卡片頭部 */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <ItemIcon
                  name={item.name}
                  nameEn={item.nameEn}
                  baseItem={item.name}
                  slot={isShield(item) ? 'shield' : item.category === 'armor' ? 'armor' : 'weapon'}
                  rarity="normal"
                  size="lg"
                  imageUrl={item.imageUrl}
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div>
                    <h3 className="text-lg font-diablo font-bold text-sanctuary-100 group-hover:text-d2-socket transition-colors leading-tight break-words">
                      {item.name}
                    </h3>
                    <div className="text-xs font-mono text-sanctuary-400 break-words">
                      {item.nameEn}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-sanctuary-400">
                    <span className="px-1.5 py-0.5 rounded bg-sanctuary-800 text-sanctuary-300">
                      {item.category === 'weapon' ? '武器' : '防具'} · {item.itemType}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-d2-gold/10 text-d2-gold border border-d2-gold/20 whitespace-nowrap">
                      {item.qualityTier}品階
                    </span>
                    {/* 最大孔數徽章 */}
                    <span className="px-2 py-0.5 rounded-lg bg-sanctuary-800/90 border border-sanctuary-700 text-d2-socket font-bold whitespace-nowrap">
                      最多 {item.maxSockets} 孔
                    </span>
                  </div>
                </div>
              </div>

              {/* 核心屬性網格 */}
              <div className="grid grid-cols-2 gap-2 bg-sanctuary-950/70 p-3 rounded-xl border border-sanctuary-800/80 text-xs font-mono">
                <div>
                  <span className="text-sanctuary-500">需求: </span>
                  <span className="text-sanctuary-200 font-bold">
                    {item.reqStr > 0 ? `${item.reqStr} 力量` : "無力需"}
                    {item.reqDex > 0 ? ` / ${item.reqDex} 敏捷` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-sanctuary-500">拉蘇克打孔: </span>
                  <span className="text-d2-gold font-bold">{item.larzukSockets} 孔</span>
                </div>
                {item.baseDamage && (
                  <div>
                    <span className="text-sanctuary-500">基礎傷害: </span>
                    <span className="text-amber-300">{item.baseDamage}</span>
                  </div>
                )}
                {item.baseDefense && (
                  <div>
                    <span className="text-sanctuary-500">基礎防禦: </span>
                    <span className="text-sky-300">{item.baseDefense}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-sanctuary-500">攻速基準 (WSM): </span>
                  <span className="text-sanctuary-200">{item.speedGrade}</span>
                </div>
              </div>
            </div>

            {/* 推薦符文之語 */}
            {item.recommendedRunewords && item.recommendedRunewords.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-sanctuary-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-d2-gold" />
                  推薦頂級符文之語:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.recommendedRunewords.map((rw: string) => {
                    const rwCleanName = rw.split(' ')[0];
                    return (
                      <button
                        key={rw}
                        type="button"
                        onClick={() => onNavigateToRuneword?.(rwCleanName)}
                        className="group/rw px-2 py-0.5 rounded-lg bg-sanctuary-800 hover:bg-sanctuary-750 border border-sanctuary-750 hover:border-d2-gold text-[11px] font-mono text-d2-gold hover:text-white transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:scale-105"
                        title={`點擊查看【${rw}】完整組成符文與屬性`}
                      >
                        <span>{rw}</span>
                        <span className="text-[9px] text-d2-gold/60 group-hover/rw:text-d2-gold">↗</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 戰術圖說與評析 */}
            {item.tacticalNotes && (
              <div className="bg-sanctuary-950/90 p-3 rounded-xl border border-sanctuary-800/90 space-y-2 text-xs">
                <div className="flex items-center gap-1 text-[11px] font-mono text-d2-socket font-bold">
                  <Zap className="w-3.5 h-3.5 text-d2-socket" />
                  打寶與戰術圖說
                </div>
                <p className="text-sanctuary-300 leading-relaxed text-[11px]">
                  {item.tacticalNotes}
                </p>
                {item.dropRecommendation && (
                  <div className="text-[10px] text-sanctuary-400 pt-1 border-t border-sanctuary-800/60 font-mono">
                    <span className="text-sanctuary-500">掉落地點: </span>
                    {item.dropRecommendation}
                  </div>
                )}
              </div>
            )}

            {/* 底部特性標籤 */}
            <div className="flex items-center justify-between pt-1 border-t border-sanctuary-800/60 text-[11px] font-mono">
              <span className={`flex items-center gap-1 ${item.isEthPreferred ? 'text-d2-cold font-bold' : 'text-sanctuary-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.isEthPreferred ? "推薦無形 (Ethereal)" : "自穿非無形"}
              </span>

              <span className={`flex items-center gap-1 ${item.isSuperiorValued ? 'text-d2-gold font-bold' : 'text-sanctuary-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.isSuperiorValued ? "超強 15%ED 天價" : "普通白板即可"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length > visibleCount && (
        <div className="text-center">
          <button
            onClick={() => setVisibleCount((c) => c + 48)}
            className="px-6 py-2.5 rounded-xl bg-sanctuary-900 border border-sanctuary-700 hover:border-d2-socket text-sm text-sanctuary-200"
          >
            顯示更多（已顯示 {visibleCount} / {filteredItems.length} 款）
          </button>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-sanctuary-900/40 rounded-2xl border border-sanctuary-800 space-y-3">
          <HelpCircle className="w-10 h-10 text-sanctuary-600 mx-auto" />
          <h3 className="text-lg font-diablo text-sanctuary-300">未找到符合條件的底材</h3>
          <p className="text-xs text-sanctuary-500">請嘗試調整分類或清除搜尋關鍵字</p>
        </div>
      )}
    </div>
  );
};
