import React, { useState } from 'react';
import { RUNES_DATA } from '../../data/runes';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';

export const RuneCompendium: React.FC = () => {
  const [tierFilter, setTierFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  const filteredRunes = RUNES_DATA.filter((r) => {
    if (tierFilter === 'low') return r.number <= 10;
    if (tierFilter === 'mid') return r.number >= 11 && r.number <= 21;
    if (tierFilter === 'high') return r.number >= 22;
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-diablo text-2xl sm:text-3xl font-bold text-d2-rune flex items-center gap-2">
            <Layers className="w-6 h-6 text-d2-rune" />
            <span>33 枚符文全典藏與合成路徑</span>
          </h2>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1">
            從 1# 艾爾 (El) 到 33# 薩德 (Zod)，完整收錄鑲嵌屬性與方塊合成升級所需寶石。
          </p>
        </div>

        {/* Tier filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-sanctuary-900 border border-sanctuary-800 self-start md:self-auto text-xs">
          <button
            onClick={() => setTierFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tierFilter === 'all' ? 'bg-sanctuary-800 text-d2-rune' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            全部 (1-33#)
          </button>
          <button
            onClick={() => setTierFilter('low')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tierFilter === 'low' ? 'bg-sanctuary-800 text-d2-rune' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            低階 (1-10#)
          </button>
          <button
            onClick={() => setTierFilter('mid')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tierFilter === 'mid' ? 'bg-sanctuary-800 text-d2-rune' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            中階 (11-21#)
          </button>
          <button
            onClick={() => setTierFilter('high')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              tierFilter === 'high' ? 'bg-sanctuary-800 text-d2-rune' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            高階神符 (22-33#)
          </button>
        </div>
      </div>

      {/* Runes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRunes.map((rune) => {
          const isHighRune = rune.number >= 22;
          return (
            <div
              key={rune.number}
              className={`p-4 rounded-xl bg-sanctuary-950 border transition-all duration-200 flex flex-col justify-between ${
                isHighRune
                  ? 'border-d2-rune/50 shadow-glow-gold/20 hover:border-d2-rune'
                  : 'border-sanctuary-800 hover:border-sanctuary-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-sanctuary-850">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-d2-rune/20 border border-d2-rune/40 flex items-center justify-center font-mono font-bold text-d2-rune text-xs">
                      {rune.number}#
                    </div>
                    <div>
                      <h3 className="font-diablo text-base font-bold text-d2-rune">
                        {rune.name}
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
                      <div className="text-[10px] text-d2-unique font-bold flex items-center justify-end gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> 大號神符
                      </div>
                    )}
                  </div>
                </div>

                {/* Sockets Details */}
                <div className="py-3 space-y-2 text-xs">
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

              {/* Cube Upgrade Formula */}
              {rune.cubeRecipe && (
                <div className="mt-2 pt-2 border-t border-sanctuary-850 flex items-center justify-between text-[11px] text-d2-magic font-mono bg-sanctuary-900/60 p-2 rounded-lg">
                  <span className="text-sanctuary-400 flex items-center gap-1 font-sans">
                    <ArrowRight className="w-3 h-3 text-d2-rune" /> 升級配方:
                  </span>
                  <span className="font-semibold text-sanctuary-200">{rune.cubeRecipe}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
