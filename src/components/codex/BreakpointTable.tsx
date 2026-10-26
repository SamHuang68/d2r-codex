import React, { useState } from 'react';
import { BREAKPOINTS_DATA } from '../../data/breakpoints';
import { AREA_LEVELS_DATA } from '../../data/areaLevels';
import { CLASS_ZH_TO_EN } from '../../engine/slots';
import { getClassImage } from '../../utils/classImages';
import { Compass, Zap, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BreakpointGauge } from './BreakpointGauge';
import { MaxBlockAegis } from './MaxBlockAegis';

interface BreakpointTableProps {
  initialClass?: string;
}

const CLASS_ROLE_TAGS: Record<string, string> = {
  '魔法使': '法術極速',
  '聖騎士': '聖盾壁壘',
  '死靈法師': '白骨詛咒',
  '術士': '禁忌秘術',
  '亞馬遜': '標槍弓弩',
  '野蠻人': '狂暴戰吼',
  '刺客': '陷阱暗影',
  '德魯伊': '元素變形',
};

export const BreakpointTable: React.FC<BreakpointTableProps> = ({ initialClass = '魔法使' }) => {
  const { t, isEn } = useLanguage();
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
      FBR: [9, 20, 42, 86],
    },
    '聖騎士': {
      FCR: [35, 48, 75, 125],
      FHR: [15, 27, 48, 86, 200],
      FBR: [13, 32, 86],
    },
    '死靈法師': {
      FCR: [30, 48, 75, 125],
      FHR: [15, 26, 39, 56, 86, 152],
      FBR: [6, 13, 20, 32, 52],
    },
    '術士': {
      FCR: [35, 65, 105, 130],
      FHR: [20, 42, 60, 86],
      FBR: [15, 30, 55],
    },
    '亞馬遜': {
      FCR: [32, 68, 99, 152],
      FHR: [13, 20, 32, 52, 86],
      FBR: [13, 29, 56],
    },
    '野蠻人': {
      FCR: [37, 63, 105, 200],
      FHR: [15, 27, 48, 86],
      FBR: [9, 20, 42, 86],
    },
    '刺客': {
      FCR: [42, 65, 102, 174],
      FHR: [15, 27, 48, 86],
      FBR: [13, 27, 48],
    },
    '德魯伊': {
      FCR: [46, 68, 99, 163],
      FHR: [13, 20, 32, 54, 99],
      FBR: [15, 32, 67],
    },
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
      {/* 頂部標題 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sanctuary-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-d2-fire text-xs font-mono tracking-widest uppercase">
            <Compass className="w-4 h-4 text-d2-fire animate-pulse" />
            Combat Mechanics, Frame Breakpoints & Area Levels
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            {t('核心機制斷點與 85 級打寶場景表', 'Combat Breakpoints & Action Frames Guide')}
          </h1>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1 max-w-2xl">
            {t(
              '精準查詢施法速度 (FCR)、打擊恢復 (FHR)、格擋速度 (FBR) 幀數檔位與 75% 滿格擋敏捷試算，掌握 85 級地獄場景原生怪物免疫分佈。',
              'Look up frame breakpoints for Faster Cast Rate (FCR), Faster Hit Recovery (FHR), and Faster Block Rate (FBR) alongside a 75% Max Block Dex calculator.'
            )}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sanctuary-900 border border-sanctuary-800 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('breakpoints')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'breakpoints'
                ? 'bg-sanctuary-800 text-d2-fire font-bold shadow'
                : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>幀數斷點計算 (Breakpoints)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('areas')}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'areas'
                ? 'bg-sanctuary-800 text-d2-fire font-bold shadow'
                : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>85 場景與邪惡威脅區域 (Area Levels)</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'breakpoints' ? (
        <div className="space-y-6">
          {/* 八大職業原版原畫英雄卡片導航 (8 Class Avatar Hero Cards Navigation) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-sanctuary-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-d2-fire" />
                {isEn ? 'Select Character Class' : '選擇欲查詢之職業原版頭像卡：'}
              </span>
              <span className="text-d2-fire font-bold font-mono">
                {selectedClass} ({CLASS_ZH_TO_EN[selectedClass] || selectedClass})
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {classesList.map((cls) => {
                const isActive = selectedClass === cls;
                const roleZh = CLASS_ROLE_TAGS[cls] || '戰鬥大師';
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={`group relative rounded-xl p-2.5 flex flex-col items-center text-center transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-gradient-to-b from-sanctuary-850 to-sanctuary-950 border-d2-fire ring-2 ring-d2-fire/50 shadow-glow-red/30 scale-[1.03]'
                        : 'bg-sanctuary-950/80 border-sanctuary-800 hover:border-sanctuary-700 hover:bg-sanctuary-900/60'
                    }`}
                  >
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden mb-1.5 border border-sanctuary-750 shadow-inner">
                      <img
                        src={getClassImage(cls)}
                        alt={cls}
                        className="w-full h-full object-cover object-[75%_15%] transition-transform duration-300 group-hover:scale-110"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-d2-fire/15 ring-1 ring-d2-fire/60" />
                      )}
                    </div>
                    <span
                      className={`font-diablo text-sm font-bold truncate w-full ${
                        isActive ? 'text-d2-fire' : 'text-sanctuary-200 group-hover:text-white'
                      }`}
                    >
                      {cls}
                    </span>
                    <span className="text-[10px] font-mono text-sanctuary-400 truncate w-full">
                      {CLASS_ZH_TO_EN[cls]}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full mt-1 font-mono ${
                        isActive
                          ? 'bg-d2-fire/20 text-d2-fire font-bold'
                          : 'bg-sanctuary-900 text-sanctuary-500'
                      }`}
                    >
                      {roleZh}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 控制項：機制種類選擇與當前數值輸入 */}
          <div className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Mechanic Type Selector */}
              <div>
                <label className="block text-xs text-sanctuary-400 mb-1.5 font-medium">
                  {isEn ? 'Mechanic Type' : '機制種類'}
                </label>
                <div className="flex items-center gap-1.5">
                  {(['FCR', 'FHR', 'FBR'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                        selectedType === type
                          ? 'bg-sanctuary-800 text-d2-unique border-d2-unique/50 shadow'
                          : 'bg-sanctuary-900 text-sanctuary-400 border-sanctuary-800 hover:text-white'
                      }`}
                    >
                      {isEn
                        ? type === 'FCR'
                          ? 'Faster Cast Rate (FCR)'
                          : type === 'FHR'
                          ? 'Faster Hit Recovery (FHR)'
                          : 'Faster Block Rate (FBR)'
                        : type === 'FCR'
                        ? '快速施法 (FCR)'
                        : type === 'FHR'
                        ? '打擊恢復 (FHR)'
                        : '格擋速度 (FBR)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Calculator Input */}
              <div className="w-full sm:w-auto">
                <label className="block text-xs text-sanctuary-400 mb-1.5 font-medium">
                  {isEn
                    ? `Input Total Gear ${selectedType} %`
                    : `輸入當前裝備總數值 (${selectedType} %)`}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={currentValInput}
                    onChange={(e) => setCurrentValInput(Math.max(0, Number(e.target.value)))}
                    className="w-32 bg-sanctuary-900 border border-sanctuary-750 rounded-lg px-3 py-1.5 text-sm text-d2-fire font-bold focus:outline-none focus:border-d2-fire"
                    placeholder={isEn ? 'e.g. 105' : '例如: 105'}
                  />
                  <button
                    type="button"
                    onClick={() => setCurrentValInput(0)}
                    className="text-xs text-sanctuary-500 hover:text-sanctuary-300 font-mono px-2 py-1 rounded bg-sanctuary-900 border border-sanctuary-800"
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
                {isEn
                  ? `Common ${CLASS_ZH_TO_EN[selectedClass] || selectedClass} ${selectedType} Breakpoints:`
                  : `${selectedClass} 常用 ${selectedType} 質變檔位：`}
              </span>
              {currentPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCurrentValInput(val)}
                  className={`px-2.5 py-0.5 rounded-md font-mono text-[11px] border transition-colors cursor-pointer ${
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

          {/* 動態步進檔位卡片區塊 (Breakpoint Gauge Cards) */}
          <div className="space-y-6">
            {currentBpConfigs.map((cfg, idx) => (
              <BreakpointGauge
                key={idx}
                characterClass={cfg.characterClass}
                type={cfg.type}
                variant={cfg.variant}
                notes={cfg.notes}
                currentValue={currentValInput}
                breakpoints={cfg.breakpoints}
                onSetValue={(v) => setCurrentValInput(v)}
              />
            ))}
          </div>

          {/* 75% 滿格擋防禦圓盤儀表 (Max Block Aegis Defense Station) */}
          <MaxBlockAegis
            charLevel={charLevel}
            onChangeLevel={setCharLevel}
            shieldBlockPercent={shieldBlockPercent}
            onChangeShieldBlock={setShieldBlockPercent}
            requiredDexForMaxBlock={requiredDexForMaxBlock}
          />
        </div>
      ) : (
        /* Area Levels Table (100% 完整保全) */
        <div className="bg-sanctuary-950 border border-sanctuary-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-sanctuary-850 bg-sanctuary-900/60 flex items-center justify-between text-xs text-sanctuary-300">
            <span>
              ⭐ <strong>85 級場景 (Area Level 85)</strong> 怪物能掉落遊戲中全數暗金裝備 (包含泰瑞爾之力、獅鷲之眼、風之力)。
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
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold ${
                          area.isAlvl85
                            ? 'bg-d2-fire/20 text-d2-fire border border-d2-fire/40'
                            : 'bg-sanctuary-900 text-sanctuary-300'
                        }`}
                      >
                        Lv {area.areaLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {area.immunities.map((imm, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 text-[10px] rounded bg-sanctuary-900 text-sanctuary-300 border border-sanctuary-800"
                          >
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
