import React, { useState, useMemo } from 'react';
import { AREA_LEVELS_DATA, TERROR_ZONE_GUIDE } from '../../data/areaLevels';
import { 
  MapPin, 
  Flame, 
  Zap, 
  Award, 
  Search, 
  Sparkles
} from 'lucide-react';

export const AreaGuide: React.FC = () => {
  const [selectedAct, setSelectedAct] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [onlyAlvl85, setOnlyAlvl85] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'areas' | 'terror_zone'>('areas');

  // Filtered areas
  const filteredAreas = useMemo(() => {
    return AREA_LEVELS_DATA.filter((area) => {
      // Act filter
      if (selectedAct !== 'all' && area.act !== selectedAct) return false;

      // 85 filter
      if (onlyAlvl85 && !area.isAlvl85) return false;

      // Search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchName = area.name.toLowerCase().includes(term);
        const matchNameEn = area.nameEn.toLowerCase().includes(term);
        const matchImmunities = area.immunities.some((im) => im.toLowerCase().includes(term));
        const matchNotes = area.chestsAndBosses?.toLowerCase().includes(term);
        if (!matchName && !matchNameEn && !matchImmunities && !matchNotes) {
          return false;
        }
      }

      return true;
    });
  }, [selectedAct, onlyAlvl85, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sanctuary-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-d2-fire text-xs font-mono tracking-widest uppercase">
            <Flame className="w-4 h-4 text-d2-fire animate-pulse" />
            Endgame Farming & Terror Zones
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            場景寶典與恐怖領域
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-2xl">
            收錄 D2R 全 85 級頂級打寶場景 (TC87 掉落聖地)、原生怪物免疫分佈，以及 2.5 恐怖領域 (Terror Zone) 縮放機制與梯隊評級。
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-sanctuary-900/80 p-1 rounded-xl border border-sanctuary-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('areas')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSubTab === 'areas'
                ? 'bg-d2-fire text-sanctuary-950 font-bold shadow-lg shadow-d2-fire/20'
                : 'text-sanctuary-300 hover:text-sanctuary-100 hover:bg-sanctuary-800/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            85 級打寶場景
          </button>
          <button
            onClick={() => setActiveSubTab('terror_zone')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSubTab === 'terror_zone'
                ? 'bg-d2-fire text-sanctuary-950 font-bold shadow-lg shadow-d2-fire/20'
                : 'text-sanctuary-300 hover:text-sanctuary-100 hover:bg-sanctuary-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            恐怖領域攻略指南
          </button>
        </div>
      </div>

      {/* ── SubTab 1: 85 場景檢索 ── */}
      {activeSubTab === 'areas' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Act Filter */}
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <span className="text-xs text-sanctuary-400 font-mono mr-1">章節：</span>
              {(['all', 1, 2, 3, 4, 5] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => setSelectedAct(act)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedAct === act
                      ? 'bg-d2-fire text-sanctuary-950 font-bold shadow'
                      : 'bg-sanctuary-950/80 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'
                  }`}
                >
                  {act === 'all' ? '全部章節' : `第 ${act} 章 (Act ${act})`}
                </button>
              ))}
            </div>

            {/* Alvl 85 Toggle & Search */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setOnlyAlvl85(!onlyAlvl85)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 shrink-0 ${
                  onlyAlvl85
                    ? 'bg-d2-gold/20 text-d2-gold border-d2-gold/40'
                    : 'bg-sanctuary-950/60 text-sanctuary-400 border-sanctuary-800 hover:text-sanctuary-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                僅顯示 85 級場景 ({AREA_LEVELS_DATA.filter((a) => a.isAlvl85).length})
              </button>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜尋場景名稱或免疫..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-fire/50"
                />
              </div>
            </div>
          </div>

          {/* Area Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAreas.map((area, idx) => (
              <div
                key={idx}
                className="bg-sanctuary-900/40 rounded-2xl border border-sanctuary-800/80 p-5 hover:border-sanctuary-700 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sanctuary-800 text-sanctuary-300">
                      第 {area.act} 章
                    </span>
                    <div className="flex items-center gap-1.5">
                      {area.isAlvl85 && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-d2-gold/15 text-d2-gold border border-d2-gold/30 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          TC87 85級
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sanctuary-950 text-sanctuary-400 border border-sanctuary-800">
                        alvl {area.areaLevel}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-sanctuary-100 group-hover:text-d2-fire transition-colors">
                    {area.name}
                  </h3>
                  <div className="text-xs font-mono text-sanctuary-400 mb-3">
                    {area.nameEn}
                  </div>

                  {/* Immunities */}
                  <div className="space-y-1 mb-3">
                    <div className="text-[11px] font-mono text-sanctuary-500">原生怪物免疫：</div>
                    <div className="flex flex-wrap gap-1.5">
                      {area.immunities.length === 0 ? (
                        <span className="text-xs text-sanctuary-500">無明顯固定免疫</span>
                      ) : (
                        area.immunities.map((im, i) => {
                          let colorClass = "bg-sanctuary-800 text-sanctuary-300 border-sanctuary-700";
                          if (im.includes("冰寒")) colorClass = "bg-d2-cold/15 text-d2-cold border-d2-cold/30";
                          if (im.includes("火焰")) colorClass = "bg-d2-fire/15 text-d2-fire border-d2-fire/30";
                          if (im.includes("閃電")) colorClass = "bg-d2-lightning/15 text-d2-lightning border-d2-lightning/30";
                          if (im.includes("毒素")) colorClass = "bg-d2-poison/15 text-d2-poison border-d2-poison/30";
                          if (im.includes("物理")) colorClass = "bg-sanctuary-700 text-sanctuary-200 border-sanctuary-600";

                          return (
                            <span
                              key={i}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${colorClass}`}
                            >
                              {im}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes & Bosses */}
                {area.chestsAndBosses && (
                  <div className="mt-3 pt-3 border-t border-sanctuary-800/60 text-xs text-sanctuary-400 leading-relaxed bg-sanctuary-950/40 p-2.5 rounded-xl">
                    <span className="text-d2-unique font-medium font-mono">特色：</span> {area.chestsAndBosses}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SubTab 2: 恐怖領域 (Terror Zone) 攻略指南 ── */}
      {activeSubTab === 'terror_zone' && (
        <div className="space-y-8">
          {/* Mechanics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TERROR_ZONE_GUIDE.mechanics.map((item, idx) => (
              <div
                key={idx}
                className="bg-sanctuary-900/60 border border-sanctuary-800 p-5 rounded-2xl flex gap-3.5 items-start"
              >
                <div className="p-2 rounded-xl bg-d2-fire/10 text-d2-fire border border-d2-fire/20 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-sanctuary-100 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-sanctuary-400 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tier List */}
          <div className="space-y-4">
            <h3 className="text-xl font-diablo font-bold text-sanctuary-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-d2-gold" />
              恐怖領域 (TZ) 輪替刷取效率梯隊排行榜
            </h3>

            <div className="space-y-4">
              {TERROR_ZONE_GUIDE.tiers.map((tierData) => {
                let badgeClass = "bg-sanctuary-800 text-sanctuary-300 border-sanctuary-700";
                if (tierData.tier === 'S') badgeClass = "bg-d2-gold/20 text-d2-gold border-d2-gold/40 shadow-glow-gold";
                if (tierData.tier === 'A') badgeClass = "bg-d2-fire/20 text-d2-fire border-d2-fire/40";
                if (tierData.tier === 'B') badgeClass = "bg-d2-unique/20 text-d2-unique border-d2-unique/40";
                if (tierData.tier === 'C') badgeClass = "bg-sanctuary-800 text-sanctuary-400 border-sanctuary-700";

                return (
                  <div
                    key={tierData.tier}
                    className="bg-sanctuary-900/40 border border-sanctuary-800 rounded-2xl p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl font-diablo font-bold text-lg flex items-center justify-center border ${badgeClass}`}>
                          {tierData.tier}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-sanctuary-100">
                            {tierData.title}
                          </h4>
                          <p className="text-xs text-sanctuary-400">
                            {tierData.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 pt-3 border-t border-sanctuary-800/60">
                      {tierData.areas.map((areaName, i) => (
                        <div
                          key={i}
                          className="bg-sanctuary-950/60 px-3 py-2 rounded-xl border border-sanctuary-800/80 text-xs text-sanctuary-200 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-d2-fire shrink-0" />
                          <span>{areaName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
