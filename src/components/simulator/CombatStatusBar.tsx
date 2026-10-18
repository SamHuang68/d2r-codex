import React from 'react';
import { CalculatedCombatStats } from '../../types/simulator';
import { 
  Heart, 
  Droplet, 
  Swords, 
  Shield, 
  Flame, 
  Snowflake, 
  Zap, 
  Skull, 
  ShieldCheck 
} from 'lucide-react';

export interface CombatStatusBarProps {
  combatStats: CalculatedCombatStats;
  characterClass: string;
}

/**
 * 聖休亞瑞典藏中樞 (D2R Codex) - 底部全景即時戰鬥數值連動條
 * 嚴格依照 1:1 經典原版比例即時連動生命 (BO後)、法力、主動傷害、防禦、滿格擋與地獄四抗
 */
export const CombatStatusBar: React.FC<CombatStatusBarProps> = ({
  combatStats,
}) => {
  const isMaxBlock = combatStats.chanceToBlock >= 75;

  return (
    <div className="w-full bg-sanctuary-950/95 backdrop-blur-md border-2 border-sanctuary-800 rounded-3xl p-4 sm:p-5 shadow-2xl">
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
        {/* 左側：核心生存面板 (生命 & 法力) */}
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap w-full xl:w-auto">
          {/* 生命值球 */}
          <div className="flex items-center gap-3 bg-red-950/40 border border-red-800/60 rounded-2xl px-4 py-2.5 shadow-inner">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-950 border border-red-500/60 flex items-center justify-center shadow-glow-fire shrink-0">
              <Heart className="w-5 h-5 text-red-200 fill-red-200" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-red-300/80 uppercase tracking-wider flex items-center gap-1">
                <span>生命值 (LIFE)</span>
                <span className="text-[9px] text-amber-300 font-bold bg-amber-950/60 px-1 py-0.2 rounded border border-amber-800/50">
                  BO後
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-diablo font-bold text-red-100 tracking-wide">
                {combatStats.totalLife.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 法力值球 */}
          <div className="flex items-center gap-3 bg-sky-950/40 border border-sky-800/60 rounded-2xl px-4 py-2.5 shadow-inner">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-950 border border-sky-400/60 flex items-center justify-center shadow-sky-950/50 shrink-0">
              <Droplet className="w-5 h-5 text-sky-200 fill-sky-200" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-sky-300/80 uppercase tracking-wider">
                法力值 (MANA)
              </div>
              <div className="text-xl sm:text-2xl font-diablo font-bold text-sky-100 tracking-wide">
                {combatStats.totalMana.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 中間：戰鬥攻防數據 (主力傷害、總防禦、格擋率) */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center w-full xl:w-auto">
          {/* 主力技能傷害 */}
          <div className="bg-sanctuary-900/90 border border-sanctuary-800 rounded-2xl px-3.5 py-2 min-w-[170px] text-center shadow-md">
            <div className="text-[10px] font-mono text-d2-gold flex items-center justify-center gap-1">
              <Swords className="w-3 h-3 text-d2-gold" />
              <span>主力傷害 ({combatStats.activeSkillName ? combatStats.activeSkillName.split(' ')[0] : '常規普攻'})</span>
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-sanctuary-100 mt-0.5">
              {(combatStats.activeSkillDamageMin ?? 0).toLocaleString()} - {(combatStats.activeSkillDamageMax ?? 0).toLocaleString()}
            </div>
            <div className="text-[9px] font-mono text-sanctuary-400">
              {combatStats.activeSkillDamageType || 'PHYSICAL'}
            </div>
          </div>

          {/* 總防禦力 */}
          <div className="bg-sanctuary-900/90 border border-sanctuary-800 rounded-2xl px-3.5 py-2 min-w-[120px] text-center shadow-md">
            <div className="text-[10px] font-mono text-sanctuary-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-sanctuary-400" />
              <span>總防禦力</span>
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-sanctuary-200 mt-0.5">
              {combatStats.totalDefense.toLocaleString()}
            </div>
            <div className="text-[9px] font-mono text-sanctuary-500">
              DEFENSE
            </div>
          </div>

          {/* 格擋率 (滿格擋 75% 標章) */}
          <div className={`border rounded-2xl px-3.5 py-2 min-w-[130px] text-center shadow-md transition-all ${
            isMaxBlock 
              ? 'bg-amber-950/40 border-amber-600/70 shadow-glow-gold' 
              : 'bg-sanctuary-900/90 border-sanctuary-800'
          }`}>
            <div className="text-[10px] font-mono text-d2-gold flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-d2-gold" />
              <span>格擋率 (BLOCK)</span>
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-d2-gold mt-0.5">
              {combatStats.chanceToBlock}%
            </div>
            <div className="text-[9px] font-mono font-bold text-amber-300">
              {isMaxBlock ? '★ 滿格擋 (Max Block)' : '未達滿格擋'}
            </div>
          </div>
        </div>

        {/* 右側：地獄難度四抗即時徽章 */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full xl:w-auto justify-end">
          {/* 火抗 */}
          <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-700/60 rounded-xl px-2.5 py-1.5 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] font-mono text-red-300 font-bold">火 {combatStats.fireRes}%</span>
          </div>

          {/* 冰抗 */}
          <div className="flex items-center gap-1.5 bg-sky-950/60 border border-sky-700/60 rounded-xl px-2.5 py-1.5 shadow-sm">
            <Snowflake className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-mono text-sky-300 font-bold">冰 {combatStats.coldRes}%</span>
          </div>

          {/* 電抗 */}
          <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-700/60 rounded-xl px-2.5 py-1.5 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-mono text-amber-300 font-bold">電 {combatStats.lightningRes}%</span>
          </div>

          {/* 毒抗 */}
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/60 rounded-xl px-2.5 py-1.5 shadow-sm">
            <Skull className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono text-emerald-300 font-bold">毒 {combatStats.poisonRes}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
