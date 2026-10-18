import React, { useState } from 'react';
import { BREAKPOINTS_DATA } from '../../data/breakpoints';
import { AREA_LEVELS_DATA } from '../../data/areaLevels';
import { Compass, Zap, MapPin, CheckCircle2, Sparkles, Calculator } from 'lucide-react';

interface BreakpointTableProps {
  initialClass?: string;
}

export const BreakpointTable: React.FC<BreakpointTableProps> = ({ initialClass = '魔法使' }) => {
  const [selectedClass, setSelectedClass] = useState<string>(initialClass);
  const [selectedType, setSelectedType] = useState<'FCR' | 'FHR' | 'FBR'>('FCR');
  const [currentValInput, setCurrentValInput] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'breakpoints' | 'areas'>('breakpoints');

  // 75% 滿格擋試算器狀態
  const [charLevel, setCharLevel] = useState<number>(85);
  const [shieldBlockPercent, setShieldBlockPercent] = useState<number>(75);

  const classesList = ['魔法使', '聖騎士', '死靈法師', '術士', '亞馬遜', '野蠻人', '刺客', '德魯伊'];

  // 職業常用檔位速查快捷按鈕
  const classPresets: Record<string, Record<'FCR' | 'FHR' | 'FBR', number[]>> = {
    '魔法使': {
      FCR: [37, 63, 105, 117, 200],
      FHR: [20, 30, 42, 60, 86, 142],
      FBR: [9, 20, 42, 86]
    },
    '聖騎士': {
      FCR: [35, 48, 75, 125],
      FHR: [15, 27, 48, 86, 200],
      FBR: [13, 32, 86] // 聖盾狀態通常 2 幀
    },
    '死靈法師': {
      FCR: [30, 48, 75, 125],
      FHR: [15, 26, 39, 56, 86, 152],
      FBR: [6, 13, 20, 32, 52]
    },
    '術士': {
      FCR: [35, 65, 105, 130],
      FHR: [20, 42, 60, 86],
      FBR: [15, 30, 55]
    },
    '亞馬遜': {
      FCR: [32, 68, 99, 152],
      FHR: [13, 20, 32, 52, 86],
      FBR: [13, 29, 56]
    },
    '野蠻人': {
      FCR: [37, 63, 105, 200],
      FHR: [15, 27, 48, 86],
      FBR: [9, 20, 42, 86]
    },
    '刺客': {
      FCR: [42, 65, 102, 174],
      FHR: [15, 27, 48, 86],
      FBR: [13, 27, 48]
    },
    '德魯伊': {
      FCR: [46, 68, 99, 163],
      FHR: [13, 20, 32, 54, 99],
      FBR: [15, 32, 67]
    }
  };

  const currentPresets = classPresets[selectedClass]?.[selectedType] || [0, 50, 100];

  // 計算 75% 滿格擋所需敏捷: Dex = ceil( (75 * Level) / ShieldBlock ) + 15
  const requiredDexForMaxBlock = Math.ceil((75 * charLevel) / Math.max(1, shieldBlockPercent)) + 15;

  // Current Breakpoint Sets
  const currentBpConfigs = BREAKPOINTS_DATA.filter(
    (bp) => bp.characterClass === selectedClass && bp.type === selectedType
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sanctuary-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-d2-fire text-xs font-mono tracking-widest uppercase">
            <Compass className="w-4 h-4 text-d2-fire animate-pulse" />
            Combat Mechanics, Frame Breakpoints & Area Levels
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            核心機制斷點與 85 級打寶場景表
          </h1>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1 max-w-2xl">
            精準查詢施法速度 (FCR)、打擊恢復 (FHR)、格擋速度 (FBR) 幀數檔位與 75% 滿格擋敏捷試算，掌握 85 級地獄場景原生怪物免疫分佈。
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sanctuary-900 border border-sanctuary-800 shrink-0 text-xs">
          <button
            onClick={() => setActiveSubTab('breakpoints')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'breakpoints' ? 'bg-sanctuary-800 text-d2-fire font-bold shadow' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>幀數斷點計算 (Breakpoints)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('areas')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'areas' ? 'bg-sanctuary-800 text-d2-fire font-bold shadow' : 'text-sanctuary-400 hover:text-white'
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
          <div className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Class Selector */}
              <div>
                <label className="block text-xs text-sanctuary-400 mb-1.5 font-medium">選擇職業</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {classesList.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                        selectedClass === cls
                          ? 'bg-sanctuary-800 text-d2-fire border-d2-fire/50 shadow'
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
                <label className="block text-xs text-sanctuary-400 mb-1.5 font-medium">機制種類</label>
                <div className="flex items-center gap-1.5">
                  {(['FCR', 'FHR', 'FBR'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        selectedType === type
                          ? 'bg-sanctuary-800 text-d2-unique border-d2-unique/50 shadow'
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
                <label className="block text-xs text-sanctuary-400 mb-1.5 font-medium">
                  輸入當前裝備總數值 ({selectedType} %)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={currentValInput}
                    onChange={(e) => setCurrentValInput(Math.max(0, Number(e.target.value)))}
                    className="w-32 bg-sanctuary-900 border border-sanctuary-750 rounded-lg px-3 py-1.5 text-sm text-d2-fire font-bold focus:outline-none focus:border-d2-fire"
                    placeholder="例如: 105"
                  />
                  <button
                    onClick={() => setCurrentValInput(0)}
                    className="text-xs text-sanctuary-500 hover:text-sanctuary-300 font-mono"
                  >
                    歸零
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Presets Chips */}
            <div className="pt-2 border-t border-sanctuary-850 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-sanctuary-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-d2-gold" />
                {selectedClass} 常用 {selectedType} 質變檔位：
              </span>
              {currentPresets.map((val) => (
                <button
                  key={val}
                  onClick={() => setCurrentValInput(val)}
                  className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] border transition-colors ${
                    currentValInput === val
                      ? 'bg-d2-fire text-sanctuary-950 font-bold border-d2-fire'
                      : 'bg-sanctuary-900 text-sanctuary-300 border-sanctuary-750 hover:bg-sanctuary-850 hover:text-white'
                  }`}
                >
                  {val}%
                </button>
              ))}
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
                  className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 shadow-xl space-y-4"
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
                    <div className="p-2.5 rounded-xl bg-sanctuary-900 border border-sanctuary-750 flex items-center gap-3 text-xs shrink-0">
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2">
                    {cfg.breakpoints.map((bp, i) => {
                      const isCurrent = bp.frames === achievedFrame;
                      return (
                        <div
                          key={i}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
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

          {/* 75% 滿格擋敏捷試算器 (Max Block Calculator) */}
          <div className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-d2-gold border-b border-sanctuary-800 pb-3">
              <Calculator className="w-5 h-5 text-d2-gold" />
              <h3 className="font-diablo text-lg font-bold text-sanctuary-100">
                75% 滿格擋率 (Max Block) 敏捷精確計算器
              </h3>
            </div>
            <p className="text-xs text-sanctuary-400">
              暗黑破壞神二代的格擋公式中，角色等級每升一級，達到 75% 滿格擋所需要的敏捷點數就會遞增。輸入您的等級與盾牌實際格擋率即可秒算所需敏捷：
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-sanctuary-900/70 p-4 rounded-xl border border-sanctuary-800">
              <div>
                <label className="block text-xs text-sanctuary-400 mb-1 font-mono">角色當前等級 (Character Level):</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={charLevel}
                  onChange={(e) => setCharLevel(Math.min(99, Math.max(1, Number(e.target.value))))}
                  className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded-lg px-3 py-1.5 text-sm text-d2-gold font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-sanctuary-400 mb-1 font-mono">盾牌實際格擋機率 (Shield Block %):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="95"
                    value={shieldBlockPercent}
                    onChange={(e) => setShieldBlockPercent(Math.min(95, Math.max(1, Number(e.target.value))))}
                    className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded-lg px-3 py-1.5 text-sm text-d2-gold font-bold focus:outline-none"
                  />
                </div>
                <div className="text-[10px] text-sanctuary-500 font-mono mt-1">
                  例：神聖小盾(聖盾開) 75%、暴風盾 67%、侏儒 60%
                </div>
              </div>

              <div className="flex flex-col justify-center bg-sanctuary-950 p-3 rounded-lg border border-sanctuary-800 text-center">
                <div className="text-[10px] font-mono text-sanctuary-400 uppercase">達到 75% 滿格擋所需敏捷：</div>
                <div className="text-2xl font-bold font-mono text-d2-gold mt-0.5">
                  {requiredDexForMaxBlock} <span className="text-xs font-normal text-sanctuary-400">點敏捷</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Area Levels Table */
        <div className="bg-sanctuary-950 border border-sanctuary-800 rounded-2xl overflow-hidden shadow-2xl">
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
