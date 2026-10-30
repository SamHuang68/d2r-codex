import React from 'react';
import { Shield, ShieldCheck, Calculator, Sparkles, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface MaxBlockAegisProps {
  charLevel: number;
  onChangeLevel: (level: number) => void;
  shieldBlockPercent: number;
  onChangeShieldBlock: (percent: number) => void;
  requiredDexForMaxBlock: number;
}

export const MaxBlockAegis: React.FC<MaxBlockAegisProps> = ({
  charLevel,
  onChangeLevel,
  shieldBlockPercent,
  onChangeShieldBlock,
  requiredDexForMaxBlock,
}) => {
  const { isEn } = useLanguage();

  const shieldPresets = [
    { labelZh: '聖騎神聖之盾開啟', labelEn: 'Paladin Holy Shield', val: 75, repZh: '神聖小盾', repEn: 'Sacred Targe' },
    { labelZh: '撒卡蘭姆使者', labelEn: 'Herald of Zakarum', val: 82, repZh: '飾金聖盾', repEn: 'HoZ' },
    { labelZh: '暴風之盾', labelEn: 'Stormshield', val: 67, repZh: '物免盾', repEn: 'Stormshield' },
    { labelZh: '侏儒 (魔胎)', labelEn: 'Homunculus', val: 60, repZh: '死靈專用盾', repEn: 'Necro Shield' },
    { labelZh: '君主盾 (精神盾)', labelEn: 'Monarch Spirit', val: 42, repZh: '法系標配', repEn: 'Monarch Spirit' },
  ];

  const levelPresets = [75, 80, 85, 90, 95, 99];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-sanctuary-950 via-sanctuary-950 to-amber-950/20 border border-amber-600/40 shadow-2xl space-y-6">
      {/* 標題與簡介 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sanctuary-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-glow-gold/20">
            <ShieldCheck className="w-5 h-5 text-d2-gold animate-pulse" />
          </div>
          <div>
            <h3 className="font-diablo text-xl font-bold text-sanctuary-100 flex items-center gap-2">
              <span>{isEn ? '75% Max Block Aegis Defense Station' : '75% 滿格擋防禦圓盤儀表 (Max Block Aegis)'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-d2-gold/20 text-d2-gold border border-d2-gold/40 font-mono font-bold">
                75% CAP
              </span>
            </h3>
            <p className="text-xs text-sanctuary-400 mt-0.5">
              {isEn
                ? 'Precision Dexterity calculation for 75% max block rate scaling with character level and shield properties.'
                : '暗黑破壞神二代經典滿格擋公式秒算，隨角色升級動態追蹤所需敏捷，兼具滿格擋與純體力生存策略指引。'}
            </p>
          </div>
        </div>

        {/* 核心公式角標 */}
        <div className="px-3 py-1.5 rounded-xl bg-sanctuary-900 border border-sanctuary-750 text-right shrink-0">
          <div className="text-[10px] text-sanctuary-400 font-mono">
            {isEn ? 'Classic Formula:' : '經典格擋公式：'}
          </div>
          <div className="text-xs font-mono font-bold text-amber-300">
            Dex = ⌈(150 × Lv) ÷ Shield%⌉ + 15
          </div>
        </div>
      </div>

      {/* 雙欄主控台：左側控制參數，右側圓盤盾徽儀表 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 左側：控制與微調面板 (7 欄) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 角色等級設定 */}
          <div className="p-4 rounded-xl bg-sanctuary-900/80 border border-sanctuary-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-sanctuary-300 font-medium font-mono flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-d2-gold" />
                <span>{isEn ? 'Character Level (Lv 1 - 99):' : '角色當前等級 (Character Level):'}</span>
              </label>
              <div className="text-sm font-mono font-bold text-d2-gold">
                Lv {charLevel}
              </div>
            </div>

            {/* 等級滑桿與步進微調 */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                aria-label="角色等級 (Character level)"
                min="1"
                max="99"
                value={charLevel}
                onChange={(e) => onChangeLevel(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onChangeLevel(Math.max(1, charLevel - 1))}
                  className="px-2 py-1 rounded bg-sanctuary-950 border border-sanctuary-750 text-xs font-mono text-sanctuary-300 hover:text-white"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => onChangeLevel(Math.min(99, charLevel + 1))}
                  className="px-2 py-1 rounded bg-sanctuary-950 border border-sanctuary-750 text-xs font-mono text-sanctuary-300 hover:text-white"
                >
                  +1
                </button>
              </div>
            </div>

            {/* 常見等級快捷按鈕 */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-sanctuary-400 font-mono mr-1">
                {isEn ? 'Quick Levels:' : '快捷等級：'}
              </span>
              {levelPresets.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChangeLevel(lvl)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                    charLevel === lvl
                      ? 'bg-d2-gold text-sanctuary-950 font-bold border-d2-gold'
                      : 'bg-sanctuary-950 text-sanctuary-400 border-sanctuary-750 hover:text-sanctuary-200'
                  }`}
                >
                  Lv {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 盾牌實際格擋機率設定 */}
          <div className="p-4 rounded-xl bg-sanctuary-900/80 border border-sanctuary-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-sanctuary-300 font-medium font-mono flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-d2-fire" />
                <span>{isEn ? 'Shield Actual Block Rate %:' : '盾牌實際格擋率 (Shield Block %):'}</span>
              </label>
              <div className="text-sm font-mono font-bold text-d2-fire">
                {shieldBlockPercent}%
              </div>
            </div>

            {/* 數值輸入與快捷盾牌標籤 */}
            <div className="flex items-center gap-3">
              <input
                type="number"
                aria-label="目標格擋率 (Target block chance %)"
                min="1"
                max="95"
                value={shieldBlockPercent}
                onChange={(e) => onChangeShieldBlock(Math.min(95, Math.max(1, Number(e.target.value))))}
                className="w-28 bg-sanctuary-950 border border-sanctuary-750 rounded-lg px-3 py-1.5 text-sm text-d2-gold font-bold focus:outline-none focus:border-d2-gold"
              />
              <span className="text-xs text-sanctuary-400 font-mono">
                {isEn ? '(Derived from Shield Base + Class Modifier)' : '(包含底材基礎、詞綴增幅與職業加成)'}
              </span>
            </div>

            {/* 經典名盾快捷選單 */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-sanctuary-400 font-mono block">
                {isEn ? 'Classic Shields One-Click Block %:' : '經典名盾格擋率一鍵套用：'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {shieldPresets.map((sp) => (
                  <button
                    key={sp.labelZh}
                    type="button"
                    onClick={() => onChangeShieldBlock(sp.val)}
                    className={`px-2 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col ${
                      shieldBlockPercent === sp.val
                        ? 'bg-amber-950/80 border-d2-gold text-white shadow'
                        : 'bg-sanctuary-950 border-sanctuary-800 text-sanctuary-400 hover:text-sanctuary-200'
                    }`}
                  >
                    <span className="text-[11px] font-bold font-mono text-amber-300 truncate">
                      {isEn ? sp.labelEn : sp.labelZh}
                    </span>
                    <span className="text-[10px] text-sanctuary-400 font-mono">
                      {sp.val}% ({isEn ? sp.repEn : sp.repZh})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右側：黃金圓盤盾徽儀表 (5 欄) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-sanctuary-900/90 to-sanctuary-950 border border-amber-600/30 shadow-2xl relative overflow-hidden">
          {/* 背景光環圖騰 */}
          <div className="absolute inset-0 bg-d2-gold/5 rounded-full blur-3xl pointer-events-none" />

          {/* 圓盤儀表 SVG 呈現 */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* 背景外軌道 */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                className="text-sanctuary-900"
                fill="none"
              />
              {/* 75% 刻度指示弧線 */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#goldGradient)"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 70 * 0.75} ${2 * Math.PI * 70 * 0.25}`}
                className="transition-all duration-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                fill="none"
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>

            {/* 圓盤中心數值 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <ShieldCheck className="w-8 h-8 text-d2-gold mb-1 animate-pulse" />
              <div className="text-[10px] font-mono text-sanctuary-400 uppercase tracking-wider">
                {isEn ? 'Required Dexterity' : '所需敏捷點數'}
              </div>
              <div className="font-diablo text-4xl font-bold text-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]">
                {requiredDexForMaxBlock}
              </div>
              <div className="text-[11px] font-mono text-sanctuary-300 mt-0.5">
                {isEn ? 'Dex Points' : '點敏捷'}
              </div>
            </div>
          </div>

          {/* 達成狀態摘要 */}
          <div className="mt-4 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/50 text-xs font-bold text-amber-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-d2-gold" />
              <span>{isEn ? '75% Max Physical Block Cap Reached' : '75% 物理硬減免達成'}</span>
            </div>
            <p className="text-[11px] text-sanctuary-400 font-mono">
              {isEn
                ? `Level ${charLevel} • Shield ${shieldBlockPercent}% • Base Offset +15`
                : `角色 ${charLevel} 級 • 盾牌 ${shieldBlockPercent}% • 基礎補償 +15`}
            </p>
          </div>
        </div>
      </div>

      {/* 滿格擋流 vs 純體力流 戰略分析建議 */}
      <div className="p-4 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{isEn ? '[Max Block Strategy] Analysis:' : '【滿格擋流 (Max Block)】戰略解析：'}</span>
          </div>
          <p className="text-sanctuary-300 leading-relaxed pl-5">
            {isEn
              ? 'Forces enemy melee and ranged physical hit chance down to the 25% floor (75% attacks blocked). A golden survival rule for Hardcore mode and melee Paladins, providing supreme protection against frenzy mobs and archers.'
              : '強制將敵方近戰攻擊與遠程箭矢的命中率壓至 25% 下限。專家級 (Hardcore) 模式與近戰聖騎士的必備生存鐵律；面對狂暴牛群、死靈法師骨矛與狂怒近戰怪物時擁有不可撼動的防猝死容錯率。'}
          </p>
        </div>

        <div className="space-y-1">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{isEn ? '[Max Vitality Strategy] Trade-off:' : '【純體力血牛流 (Max Vita)】權衡提醒：'}</span>
          </div>
          <p className="text-sanctuary-300 leading-relaxed pl-5">
            {isEn
              ? 'If casters equip Monarch Spirit (42% base block), achieving 75% block at Lv90 demands 337 Dexterity, heavily sacrificing 400-600 base life. Ranged casters (Sorceress, Necromancer) are strongly recommended to invest Dexterity only for gear requirements and funnel the rest into Vitality.'
              : '若法系角色裝備君主盾 (精神盾)（基礎格擋僅約 42%），90 級時撐滿格擋需投資高達 337 點敏捷，會劇烈犧牲約 400~600 點基礎生命。法師與死靈若走遠程拉打路線，多數推薦敏捷僅點至裝備需求，其餘全加體力。'}
          </p>
        </div>
      </div>
    </div>
  );
};
