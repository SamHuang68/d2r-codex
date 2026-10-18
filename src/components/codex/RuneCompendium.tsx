import React, { useState, useEffect } from 'react';
import { RUNES_DATA } from '../../data/runes';
import { RUNEWORDS_DATA } from '../../data/runewords';
import { ItemIcon } from '../common/ItemIcon';
import { Layers, ArrowRight, Sparkles, Flame } from 'lucide-react';

export interface RuneCompendiumProps {
  targetRuneNumber?: number;
  onNavigateToRuneword?: (runewordName: string) => void;
}

export const RuneCompendium: React.FC<RuneCompendiumProps> = ({
  targetRuneNumber,
  onNavigateToRuneword,
}) => {
  const [tierFilter, setTierFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  // 若外部指定了目標符文，自動切換至相應階層並平滑滾動至目標卡片
  useEffect(() => {
    if (targetRuneNumber) {
      if (targetRuneNumber <= 10) setTierFilter('low');
      else if (targetRuneNumber <= 21) setTierFilter('mid');
      else setTierFilter('high');

      setTimeout(() => {
        const el = document.getElementById(`rune-${targetRuneNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    }
  }, [targetRuneNumber]);

  const filteredRunes = RUNES_DATA.filter((r) => {
    if (tierFilter === 'low') return r.number <= 10;
    if (tierFilter === 'mid') return r.number >= 11 && r.number <= 21;
    if (tierFilter === 'high') return r.number >= 22;
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sanctuary-800 pb-6">
        <div>
          <h2 className="font-diablo text-2xl sm:text-3xl font-bold text-d2-rune flex items-center gap-2">
            <Layers className="w-6 h-6 text-d2-rune" />
            <span>33 枚符文全典藏與熱門符文語互聯</span>
          </h2>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1">
            從 1# 艾爾 (El) 到 33# 薩德 (Zod)，完整收錄鑲嵌屬性、方塊升級公式，並支援點擊「相關符文之語」直達組成細節。
          </p>
        </div>

        {/* Tier filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-sanctuary-900 border border-sanctuary-800 self-start md:self-auto text-xs">
          <button
            onClick={() => setTierFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tierFilter === 'all' ? 'bg-sanctuary-800 text-d2-rune font-bold' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            全部 (1-33#)
          </button>
          <button
            onClick={() => setTierFilter('low')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tierFilter === 'low' ? 'bg-sanctuary-800 text-d2-rune font-bold' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            低階 (1-10#)
          </button>
          <button
            onClick={() => setTierFilter('mid')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tierFilter === 'mid' ? 'bg-sanctuary-800 text-d2-rune font-bold' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            中階 (11-21#)
          </button>
          <button
            onClick={() => setTierFilter('high')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tierFilter === 'high' ? 'bg-sanctuary-800 text-d2-rune font-bold' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            高階神符 (22-33#)
          </button>
        </div>
      </div>

      {/* Runes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRunes.map((rune) => {
          const isHighRune = rune.number >= 22;
          const isTarget = targetRuneNumber === rune.number;

          // 找出所有需要使用這顆符文的符文之語
          const relevantRunewords = RUNEWORDS_DATA.filter((rw) =>
            rw.runeNumbers.includes(rune.number)
          );

          return (
            <div
              key={rune.number}
              id={`rune-${rune.number}`}
              className={`p-5 rounded-2xl bg-sanctuary-950 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isTarget
                  ? 'border-d2-rune ring-2 ring-d2-rune/60 shadow-glow-gold'
                  : isHighRune
                  ? 'border-d2-rune/40 hover:border-d2-rune shadow-sm'
                  : 'border-sanctuary-800 hover:border-sanctuary-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-sanctuary-850">
                  <div className="flex items-center gap-3">
                    <ItemIcon
                      runeNumber={rune.number}
                      name={rune.name}
                      nameEn={rune.nameEn}
                      rarity="rune"
                      size="md"
                    />
                    <div>
                      <h3 className="font-diablo text-base font-bold text-d2-rune flex items-center gap-1.5">
                        {rune.name}
                        {isTarget && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-d2-gold text-sanctuary-950 font-bold font-mono">
                            目標
                          </span>
                        )}
                      </h3>
                      <div className="text-[11px] text-sanctuary-400 font-mono italic">
                        {rune.nameEn}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-sanctuary-400">
                      需求等級: <strong className="text-sanctuary-200">{rune.requiredLevel}</strong>
                    </span>
                    {isHighRune && (
                      <div className="text-[10px] text-d2-unique font-bold flex items-center justify-end gap-1 mt-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> 大號神符
                      </div>
                    )}
                  </div>
                </div>

                {/* Sockets Details */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-sanctuary-400 font-medium">武器鑲嵌：</span>
                    <span className="text-sanctuary-200 ml-1">{rune.weaponEffect}</span>
                  </div>
                  <div>
                    <span className="text-sanctuary-400 font-medium">防具/頭盔：</span>
                    <span className="text-sanctuary-200 ml-1">{rune.armorHelmEffect}</span>
                  </div>
                  <div>
                    <span className="text-sanctuary-400 font-medium">盾牌鑲嵌：</span>
                    <span className="text-sanctuary-200 ml-1">{rune.shieldEffect}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Sections: Cube Recipe & Related Runewords */}
              <div className="space-y-3 pt-2 border-t border-sanctuary-850">
                {/* Cube Upgrade Formula */}
                {rune.cubeRecipe && (
                  <div className="flex items-center justify-between text-[11px] text-d2-magic font-mono bg-sanctuary-900/60 p-2 rounded-xl border border-sanctuary-850">
                    <span className="text-sanctuary-400 flex items-center gap-1 font-sans">
                      <ArrowRight className="w-3 h-3 text-d2-rune shrink-0" /> 升級:
                    </span>
                    <span className="font-semibold text-sanctuary-200 truncate ml-2">
                      {rune.cubeRecipe}
                    </span>
                  </div>
                )}

                {/* Related Runewords Links */}
                {relevantRunewords.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-sanctuary-400 font-mono flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-d2-rune" />
                        組成之符文語 ({relevantRunewords.length}組):
                      </span>
                      <span className="text-[9px] text-sanctuary-500">點擊查看配方</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin">
                      {relevantRunewords.map((rw) => (
                        <button
                          key={rw.id}
                          type="button"
                          onClick={() => onNavigateToRuneword?.(rw.name)}
                          className="group/tag px-2 py-0.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-800 border border-sanctuary-750 hover:border-d2-unique text-[11px] font-mono text-d2-unique transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                          title={`點擊跳轉至【${rw.name} (${rw.nameEn})】完整組成細節與屬性`}
                        >
                          <span>{rw.name}</span>
                          <span className="text-[9px] text-d2-unique/60 group-hover/tag:text-d2-unique">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
