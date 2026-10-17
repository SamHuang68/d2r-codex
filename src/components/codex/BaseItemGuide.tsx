import React, { useState, useMemo } from 'react';
import { BASE_ITEMS_DATA, BaseItemData } from '../../data/bases';
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

  const categories = ["全部", "單手武器", "雙手武器", "防具鎧甲", "盾牌"];

  const filteredItems = useMemo(() => {
    return BASE_ITEMS_DATA.filter((item: BaseItemData) => {
      // 分類篩選
      if (selectedCategory !== "全部" && item.category !== selectedCategory) {
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
        const matchType = item.itemType.toLowerCase().includes(q);
        const matchRW = item.recommendedRunewords.some(rw => rw.toLowerCase().includes(q));
        const matchNotes = item.tacticalNotes.toLowerCase().includes(q);
        if (!matchName && !matchType && !matchRW && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery, filterEthOnly, filterSuperiorOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 標題與說明 */}
      <div className="border-b border-sanctuary-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-d2-socket text-xs font-mono tracking-widest uppercase">
            <ShieldAlert className="w-4 h-4 text-d2-socket animate-pulse" />
            Endgame Runeword Bases & Socketing Codex
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            頂級符文之語底材與打孔寶典
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-3xl">
            收錄悔恨幻化之刃、法師鎧甲謎團、無形銳利無限、神聖小盾精神等全職業 S 級畢業底材，提供 WSM 攻速、最大孔數、拉蘇克固定打孔機制與打寶估價戰術解析。
          </p>
        </div>

        {/* 統計指標 */}
        <div className="flex items-center gap-3 bg-sanctuary-900/80 p-2.5 rounded-2xl border border-sanctuary-800 shrink-0">
          <div className="text-right px-3 border-r border-sanctuary-800">
            <div className="text-[10px] text-sanctuary-400 font-mono">收錄經典底材</div>
            <div className="text-xl font-bold font-mono text-d2-socket">{BASE_ITEMS_DATA.length} 款</div>
          </div>
          <div className="text-right px-3">
            <div className="text-[10px] text-sanctuary-400 font-mono">符合條件</div>
            <div className="text-xl font-bold font-mono text-d2-gold">{filteredItems.length} 款</div>
          </div>
        </div>
      </div>

      {/* 篩選與搜尋列 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* 分類按鈕 */}
        <div className="flex items-center gap-1.5 bg-sanctuary-900/80 p-1.5 rounded-2xl border border-sanctuary-800 overflow-x-auto scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-d2-socket text-sanctuary-950 font-bold shadow-md shadow-d2-socket/20'
                  : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 快速開關與搜尋 */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
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

          <div className="relative flex-1">
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
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-sanctuary-900/80 border border-sanctuary-800 rounded-2xl p-5 flex flex-col justify-between hover:border-sanctuary-700 transition-all duration-200 space-y-4 group shadow-xl"
          >
            {/* 卡片頭部 */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-diablo font-bold text-sanctuary-100 group-hover:text-d2-socket transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-xs font-mono text-sanctuary-400">
                      {item.nameEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-sanctuary-400 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-sanctuary-800 text-sanctuary-300">
                      {item.category} · {item.itemType}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-d2-gold/10 text-d2-gold border border-d2-gold/20">
                      {item.qualityTier}品階
                    </span>
                  </div>
                </div>

                {/* 最大孔數徽章 */}
                <div className="px-2.5 py-1 rounded-xl bg-sanctuary-800/90 border border-sanctuary-700 text-d2-socket font-mono text-xs font-bold shrink-0">
                  最多 {item.maxSockets} 孔
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
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-sanctuary-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-d2-gold" />
                推薦頂級符文之語:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.recommendedRunewords.map((rw) => {
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

            {/* 戰術圖說與評析 */}
            <div className="bg-sanctuary-950/90 p-3 rounded-xl border border-sanctuary-800/90 space-y-2 text-xs">
              <div className="flex items-center gap-1 text-[11px] font-mono text-d2-socket font-bold">
                <Zap className="w-3.5 h-3.5 text-d2-socket" />
                打寶與戰術圖說
              </div>
              <p className="text-sanctuary-300 leading-relaxed text-[11px]">
                {item.tacticalNotes}
              </p>
              <div className="text-[10px] text-sanctuary-400 pt-1 border-t border-sanctuary-800/60 font-mono">
                <span className="text-sanctuary-500">掉落地點: </span>
                {item.dropRecommendation}
              </div>
            </div>

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
