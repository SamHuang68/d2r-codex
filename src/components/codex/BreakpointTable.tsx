import React, { useState } from 'react';
import { BREAKPOINTS_DATA } from '../../data/breakpoints';
import { AREA_LEVELS_DATA } from '../../data/areaLevels';
import { Compass, Zap, MapPin, CheckCircle2 } from 'lucide-react';

interface BreakpointTableProps {
  initialClass?: string;
}

export const BreakpointTable: React.FC<BreakpointTableProps> = ({ initialClass = '魔法使' }) => {
  const [selectedClass, setSelectedClass] = useState<string>(initialClass);
  const [selectedType, setSelectedType] = useState<'FCR' | 'FHR' | 'FBR'>('FCR');
  const [currentValInput, setCurrentValInput] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'breakpoints' | 'areas'>('breakpoints');

  const classesList = ['魔法使', '聖騎士', '死靈法師', '術士', '亞馬遜', '野蠻人', '刺客', '德魯伊'];

  // Current Breakpoint Sets
  const currentBpConfigs = BREAKPOINTS_DATA.filter(
    (bp) => bp.characterClass === selectedClass && bp.type === selectedType
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-diablo text-2xl sm:text-3xl font-bold text-d2-fire flex items-center gap-2">
            <Compass className="w-6 h-6 text-d2-fire" />
            <span>核心機制斷點與 85 級打寶場景表</span>
          </h2>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1">
            精準查詢施法速度 (FCR)、打擊恢復 (FHR)、格擋速度 (FBR) 幀數檔位，並掌握 85 級地獄場景與恐懼區域免疫抗性。
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-sanctuary-900 border border-sanctuary-800 self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveSubTab('breakpoints')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'breakpoints' ? 'bg-sanctuary-800 text-d2-fire' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>幀數斷點計算 (Breakpoints)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('areas')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'areas' ? 'bg-sanctuary-800 text-d2-fire' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>85 場景與恐懼區域 (Area Levels)</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'breakpoints' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-sanctuary-950 border border-sanctuary-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Class Selector */}
              <div>
                <label className="block text-xs text-sanctuary-400 mb-1 font-medium">選擇職業</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {classesList.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                        selectedClass === cls
                          ? 'bg-sanctuary-800 text-d2-fire border-d2-fire/50'
                          : 'bg-sanctuary-900 text-sanctuary-400 border-sanctuary-800 hover:text-white'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mechanic Type Selector */}
              <div>
                <label className="block text-xs text-sanctuary-400 mb-1 font-medium">機制種類</label>
                <div className="flex items-center gap-1.5">
                  {(['FCR', 'FHR', 'FBR'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        selectedType === type
                          ? 'bg-sanctuary-800 text-d2-unique border-d2-unique/50'
                          : 'bg-sanctuary-900 text-sanctuary-400 border-sanctuary-800 hover:text-white'
                      }`}
                    >
                      {type === 'FCR' ? '快速施法 (FCR)' : type === 'FHR' ? '打擊恢復 (FHR)' : '格擋速度 (FBR)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Calculator Input */}
              <div className="w-full sm:w-auto">
                <label className="block text-xs text-sanctuary-400 mb-1 font-medium">
                  輸入當前裝備總數值 ({selectedType} %)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={currentValInput}
                  onChange={(e) => setCurrentValInput(Math.max(0, Number(e.target.value)))}
                  className="w-36 bg-sanctuary-900 border border-sanctuary-750 rounded-lg px-3 py-1.5 text-sm text-d2-fire font-bold focus:outline-none"
                  placeholder="例如: 105"
                />
              </div>
            </div>
          </div>

          {/* Breakpoint Result Cards */}
          <div className="space-y-6">
            {currentBpConfigs.map((cfg, idx) => {
              // Calculate current frame achieved
              const sortedBps = [...cfg.breakpoints].sort((a, b) => a.requiredValue - b.requiredValue);
              let achievedFrame = sortedBps[0].frames;
              let nextBp: { frames: number; requiredValue: number } | null = null;

              for (let i = 0; i < sortedBps.length; i++) {
                if (currentValInput >= sortedBps[i].requiredValue) {
                  achievedFrame = sortedBps[i].frames;
                  nextBp = sortedBps[i + 1] || null;
                }
              }

              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-sanctuary-950 border border-sanctuary-800 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sanctuary-850">
                    <div>
                      <h3 className="font-diablo text-lg font-bold text-sanctuary-100">
                        {cfg.characterClass} • {cfg.type} {cfg.variant ? `(${cfg.variant})` : ''}
                      </h3>
                      {cfg.notes && (
                        <p className="text-xs text-d2-unique mt-0.5">
                          💡 {cfg.notes}
                        </p>
                      )}
                    </div>

                    {/* Calculator Result Pill */}
                    <div className="p-2.5 rounded-lg bg-sanctuary-900 border border-sanctuary-750 flex items-center gap-3 text-xs shrink-0">
                      <div>
                        當前達成：<strong className="text-d2-fire text-sm">{achievedFrame} 幀</strong>
                      </div>
                      {nextBp ? (
                        <div className="text-sanctuary-400">
                          距離下一檔 ({nextBp.frames} 幀) 還差：
                          <span className="text-d2-unique font-bold ml-1">
                            +{nextBp.requiredValue - currentValInput}%
                          </span>
                        </div>
                      ) : (
                        <div className="text-d2-set font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 頂級極速檔位已封頂！
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Breakpoints Matrix Grid */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2">
                    {cfg.breakpoints.map((bp, i) => {
                      const isCurrent = bp.frames === achievedFrame;
                      return (
                        <div
                          key={i}
                          className={`p-2.5 rounded-lg border text-center transition-all ${
                            isCurrent
                              ? 'bg-d2-fire/15 border-d2-fire/60 text-d2-fire shadow-glow-red/20 scale-105'
                              : 'bg-sanctuary-900/60 border-sanctuary-800/80 text-sanctuary-300'
                          }`}
                        >
                          <div className="text-xs font-mono font-bold">
                            {bp.frames} 幀
                          </div>
                          <div className="text-[11px] text-sanctuary-400 mt-1">
                            需要: <strong className={isCurrent ? 'text-d2-fire' : 'text-sanctuary-100'}>{bp.requiredValue}%</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Area Levels Table */
        <div className="bg-sanctuary-950 border border-sanctuary-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-sanctuary-850 bg-sanctuary-900/60 flex items-center justify-between text-xs text-sanctuary-300">
            <span>
              ⭐ <strong>85 級場景 (Area Level 85)</strong> 怪物能掉落遊戲中全數暗金裝備 (包含泰瑞爾的力量、獅鷲之眼、風之力)。
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sanctuary-900 text-sanctuary-400 font-semibold border-b border-sanctuary-800">
                <tr>
                  <th className="py-3 px-4">章節</th>
                  <th className="py-3 px-4">場景名稱 (中文/英文)</th>
                  <th className="py-3 px-4 text-center">場景等級</th>
                  <th className="py-3 px-4">常見原生免疫抗性</th>
                  <th className="py-3 px-4">打寶特色與備註</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sanctuary-850">
                {AREA_LEVELS_DATA.map((area, idx) => (
                  <tr key={idx} className="hover:bg-sanctuary-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-sanctuary-400">第 {area.act} 章</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-sanctuary-100">{area.name}</div>
                      <div className="text-[11px] text-sanctuary-500 font-mono">{area.nameEn}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                        area.isAlvl85 ? 'bg-d2-fire/20 text-d2-fire border border-d2-fire/40' : 'bg-sanctuary-900 text-sanctuary-300'
                      }`}>
                        Lv {area.areaLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {area.immunities.map((imm, i) => (
                          <span key={i} className="px-1.5 py-0.5 text-[10px] rounded bg-sanctuary-900 text-sanctuary-300 border border-sanctuary-800">
                            {imm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sanctuary-300 max-w-xs">
                      {area.chestsAndBosses || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
