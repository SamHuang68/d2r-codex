import React from 'react';
import { CharacterAttributes, CalculatedCombatStats } from '../../types/simulator';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Shield, 
  Flame, 
  Zap, 
  Skull, 
  Sparkles, 
  CheckCircle2, 
  Swords, 
  Activity
} from 'lucide-react';

export interface StatsScreenProps {
  className: string;
  level: number;
  setLevel: (lvl: number) => void;
  attributes: CharacterAttributes;
  combatStats: CalculatedCombatStats;
  onAddStatPoint: (stat: 'str' | 'dex' | 'vit' | 'ene', amount?: number) => void;
  onRemoveStatPoint: (stat: 'str' | 'dex' | 'vit' | 'ene', amount?: number) => void;
  onAutoFillReqs: () => void;
  onAllInVitality: () => void;
  onResetStats: () => void;
  unallocatedPoints: number;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  className,
  level,
  setLevel,
  attributes,
  combatStats,
  onAddStatPoint,
  onRemoveStatPoint,
  onAutoFillReqs,
  onAllInVitality,
  onResetStats,
  unallocatedPoints,
}) => {
  return (
    <div className="bg-sanctuary-950/95 rounded-3xl border-2 border-sanctuary-800 shadow-2xl p-5 sm:p-6 space-y-6">
      {/* 標頭資訊：等級、職業與未分配點數 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sanctuary-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-d2-fire flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-d2-fire" />
            1:1 CHARACTER STATS & COMBAT ATTRIBUTES
          </div>
          <h2 className="text-2xl font-diablo font-bold text-sanctuary-100 mt-0.5 flex items-center gap-2">
            <span>{className} 屬性配點頁</span>
            <span className="text-xs font-mono font-normal text-sanctuary-400">
              (等級 Lv {level})
            </span>
          </h2>
        </div>

        {/* 等級調整與剩餘點數 */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-sanctuary-400 font-mono">剩餘未分配屬性點</div>
            <div className={`text-xl font-mono font-bold ${unallocatedPoints > 0 ? 'text-d2-gold' : 'text-sanctuary-500'}`}>
              {unallocatedPoints} <span className="text-xs font-normal">點</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-sanctuary-900 px-3 py-1.5 rounded-xl border border-sanctuary-750">
            <span className="text-xs font-mono text-sanctuary-400">Lv:</span>
            <input
              type="number"
              min="1"
              max="99"
              value={level}
              onChange={(e) => setLevel(Math.min(99, Math.max(1, Number(e.target.value))))}
              className="w-12 bg-sanctuary-950 border border-sanctuary-700 rounded text-center text-xs text-d2-gold font-bold font-mono py-0.5 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 快捷輔助配點工具列 */}
      <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
        <span className="text-sanctuary-400 font-mono">快捷配點守則：</span>
        <button
          onClick={onAutoFillReqs}
          className="px-2.5 py-1 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-800 text-d2-gold border border-sanctuary-750 font-medium transition-colors"
          title="自動將力量與敏捷點滿至能拿起當前所有裝備的門檻"
        >
          一鍵滿足裝備門檻 (Auto Req)
        </button>
        <button
          onClick={onAllInVitality}
          className="px-2.5 py-1 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-800 text-emerald-400 border border-sanctuary-750 font-medium transition-colors"
          title="將剩餘所有未分配屬性點數全部投資入體力"
        >
          剩餘全灌體力 (All-in Vita)
        </button>
        <button
          onClick={onResetStats}
          className="px-2.5 py-1 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-800 text-sanctuary-400 hover:text-white border border-sanctuary-750 font-medium transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>重置配點</span>
        </button>
      </div>

      {/* ── 1:1 遊戲四維屬性分配區 (不用加減框，點擊原生按鈕) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800">
        {/* 力量 (Strength) */}
        <div className="bg-sanctuary-950/80 p-3.5 rounded-xl border border-sanctuary-800 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-sanctuary-400 font-semibold">力量 (STRENGTH)</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-mono font-bold text-blue-300">
                {combatStats.totalStr}
              </span>
              <span className="text-[10px] font-mono text-sanctuary-500">
                (基礎 {attributes.baseStr + attributes.allocatedStr} + 裝備 +{combatStats.totalStr - (attributes.baseStr + attributes.allocatedStr)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRemoveStatPoint('str', 1)}
              disabled={attributes.allocatedStr <= 0}
              className="w-7 h-7 rounded-lg bg-sanctuary-850 hover:bg-sanctuary-750 text-sanctuary-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="扣除 1 點"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => onAddStatPoint('str', e.shiftKey ? 5 : 1)}
              disabled={unallocatedPoints <= 0}
              className="w-8 h-8 rounded-lg bg-d2-fire text-sanctuary-950 hover:bg-amber-400 font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md shadow-d2-fire/20"
              title="點擊 +1 / 按住 Shift + 點擊 +5"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 敏捷 (Dexterity) */}
        <div className="bg-sanctuary-950/80 p-3.5 rounded-xl border border-sanctuary-800 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-sanctuary-400 font-semibold">敏捷 (DEXTERITY)</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-mono font-bold text-blue-300">
                {combatStats.totalDex}
              </span>
              <span className="text-[10px] font-mono text-sanctuary-500">
                (基礎 {attributes.baseDex + attributes.allocatedDex} + 裝備 +{combatStats.totalDex - (attributes.baseDex + attributes.allocatedDex)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRemoveStatPoint('dex', 1)}
              disabled={attributes.allocatedDex <= 0}
              className="w-7 h-7 rounded-lg bg-sanctuary-850 hover:bg-sanctuary-750 text-sanctuary-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="扣除 1 點"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => onAddStatPoint('dex', e.shiftKey ? 5 : 1)}
              disabled={unallocatedPoints <= 0}
              className="w-8 h-8 rounded-lg bg-d2-fire text-sanctuary-950 hover:bg-amber-400 font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md shadow-d2-fire/20"
              title="點擊 +1 / 按住 Shift + 點擊 +5"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 體力 (Vitality) */}
        <div className="bg-sanctuary-950/80 p-3.5 rounded-xl border border-sanctuary-800 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-sanctuary-400 font-semibold">體力 (VITALITY)</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-mono font-bold text-blue-300">
                {combatStats.totalVit}
              </span>
              <span className="text-[10px] font-mono text-sanctuary-500">
                (基礎 {attributes.baseVit + attributes.allocatedVit} + 裝備 +{combatStats.totalVit - (attributes.baseVit + attributes.allocatedVit)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRemoveStatPoint('vit', 1)}
              disabled={attributes.allocatedVit <= 0}
              className="w-7 h-7 rounded-lg bg-sanctuary-850 hover:bg-sanctuary-750 text-sanctuary-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="扣除 1 點"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => onAddStatPoint('vit', e.shiftKey ? 5 : 1)}
              disabled={unallocatedPoints <= 0}
              className="w-8 h-8 rounded-lg bg-d2-fire text-sanctuary-950 hover:bg-amber-400 font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md shadow-d2-fire/20"
              title="點擊 +1 / 按住 Shift + 點擊 +5"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 精力 (Energy) */}
        <div className="bg-sanctuary-950/80 p-3.5 rounded-xl border border-sanctuary-800 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-sanctuary-400 font-semibold">精力 (ENERGY)</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-mono font-bold text-blue-300">
                {combatStats.totalEne}
              </span>
              <span className="text-[10px] font-mono text-sanctuary-500">
                (基礎 {attributes.baseEne + attributes.allocatedEne} + 裝備 +{combatStats.totalEne - (attributes.baseEne + attributes.allocatedEne)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onRemoveStatPoint('ene', 1)}
              disabled={attributes.allocatedEne <= 0}
              className="w-7 h-7 rounded-lg bg-sanctuary-850 hover:bg-sanctuary-750 text-sanctuary-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              title="扣除 1 點"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => onAddStatPoint('ene', e.shiftKey ? 5 : 1)}
              disabled={unallocatedPoints <= 0}
              className="w-8 h-8 rounded-lg bg-d2-fire text-sanctuary-950 hover:bg-amber-400 font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md shadow-d2-fire/20"
              title="點擊 +1 / 按住 Shift + 點擊 +5"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 核心戰鬥產出面板 (生命/法力/傷害/防禦/格擋) ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-sanctuary-800 pb-2">
          <Activity className="w-4 h-4 text-d2-gold" />
          <h3 className="font-diablo text-sm font-bold text-sanctuary-200 uppercase tracking-wider">
            即時戰鬥綜合數值反饋 (Combat Reactivity Output)
          </h3>
        </div>

        {/* 生命 & 法力 & 耐力 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-sanctuary-900/80 p-3 rounded-2xl border border-sanctuary-800">
            <div className="text-[10px] font-mono text-sanctuary-400">生命上限 (LIFE)</div>
            <div className="text-2xl font-mono font-bold text-rose-400 mt-0.5">
              {combatStats.totalLife}
            </div>
            <div className="text-[9px] font-mono text-sanctuary-500">含 BO 喊血與裝備生命加成</div>
          </div>

          <div className="bg-sanctuary-900/80 p-3 rounded-2xl border border-sanctuary-800">
            <div className="text-[10px] font-mono text-sanctuary-400">法力上限 (MANA)</div>
            <div className="text-2xl font-mono font-bold text-sky-400 mt-0.5">
              {combatStats.totalMana}
            </div>
            <div className="text-[9px] font-mono text-sanctuary-500">含 SOJ/裝備法力放大</div>
          </div>

          <div className="bg-sanctuary-900/80 p-3 rounded-2xl border border-sanctuary-800">
            <div className="text-[10px] font-mono text-sanctuary-400">耐力值 (STAMINA)</div>
            <div className="text-2xl font-mono font-bold text-amber-300 mt-0.5">
              {Math.round(combatStats.totalStamina)}
            </div>
            <div className="text-[9px] font-mono text-sanctuary-500">無限長跑不疲憊</div>
          </div>
        </div>

        {/* 攻擊輸出 (ATK) & 防禦格擋 (DFS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 主力技能傷害 */}
          <div className="bg-sanctuary-900/80 p-4 rounded-2xl border border-d2-gold/40 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-d2-gold flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-d2-gold" />
                主力技能: {combatStats.activeSkillName}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-d2-gold/15 text-d2-gold border border-d2-gold/30">
                Lv {combatStats.activeSkillLevel}
              </span>
            </div>

            <div>
              <div className="text-[10px] font-mono text-sanctuary-400 uppercase">輸出傷害區間 ({combatStats.activeSkillDamageType}):</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-d2-fire mt-0.5">
                {combatStats.activeSkillDamageMin?.toLocaleString()} - {combatStats.activeSkillDamageMax?.toLocaleString()}
              </div>
            </div>

            <div className="text-[11px] font-mono text-sanctuary-400 pt-1 border-t border-sanctuary-800/80 flex justify-between">
              <span>攻擊命中率 (AR): {combatStats.attackRating}</span>
              <span className="text-d2-set font-semibold">全技能加成: +{combatStats.allSkillsBonus + combatStats.classSkillsBonus}</span>
            </div>
          </div>

          {/* 防禦與格擋機率 */}
          <div className="bg-sanctuary-900/80 p-4 rounded-2xl border border-sanctuary-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sanctuary-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sanctuary-300" />
                裝甲防護與格擋率
              </span>
              <span className="text-[10px] font-mono text-sanctuary-400">
                總減傷: {combatStats.damageReducedPercent}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] font-mono text-sanctuary-400">總體防禦力 (DEFENSE):</div>
                <div className="text-xl font-mono font-bold text-sanctuary-100 mt-0.5">
                  {combatStats.totalDefense?.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-sanctuary-400">格擋機率 (BLOCK):</div>
                <div className="text-xl font-mono font-bold mt-0.5 flex items-baseline gap-1">
                  <span className={combatStats.chanceToBlock >= 75 ? 'text-emerald-400 font-extrabold' : 'text-amber-400'}>
                    {combatStats.chanceToBlock}%
                  </span>
                  {combatStats.chanceToBlock >= 75 && (
                    <span className="text-[9px] font-mono text-emerald-400 font-normal">★ 滿格擋</span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-sanctuary-400 pt-1 border-t border-sanctuary-800/80 flex items-center gap-2">
              {combatStats.cannotBeFrozen ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 無法被凍結 (CBF)
                </span>
              ) : (
                <span className="text-rose-400">易受凍結減速</span>
              )}
            </div>
          </div>
        </div>

        {/* 地獄難度抗性盤 (四色圓盤) */}
        <div className="bg-sanctuary-900/50 p-4 rounded-2xl border border-sanctuary-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sanctuary-400">地獄難度全抗性 (已扣除地獄難度 -100% 懲罰)：</span>
            <span className="text-sanctuary-500 text-[10px]">基礎上限 75%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 火抗 */}
            <div className="bg-sanctuary-950 p-2.5 rounded-xl border border-red-900/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-d2-fire" />
                <span className="text-xs font-mono font-bold text-d2-fire">抗火</span>
              </div>
              <div className="text-sm font-mono font-bold text-sanctuary-100">
                {combatStats.fireRes}% / {combatStats.maxFireRes}%
              </div>
            </div>

            {/* 冰抗 */}
            <div className="bg-sanctuary-950 p-2.5 rounded-xl border border-cyan-900/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-cyan-400">抗寒</span>
              </div>
              <div className="text-sm font-mono font-bold text-sanctuary-100">
                {combatStats.coldRes}% / {combatStats.maxColdRes}%
              </div>
            </div>

            {/* 電抗 */}
            <div className="bg-sanctuary-950 p-2.5 rounded-xl border border-yellow-900/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-mono font-bold text-yellow-400">抗電</span>
              </div>
              <div className="text-sm font-mono font-bold text-sanctuary-100">
                {combatStats.lightningRes}% / {combatStats.maxLightningRes}%
              </div>
            </div>

            {/* 毒抗 */}
            <div className="bg-sanctuary-950 p-2.5 rounded-xl border border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Skull className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400">抗毒</span>
              </div>
              <div className="text-sm font-mono font-bold text-sanctuary-100">
                {combatStats.poisonRes}% / {combatStats.maxPoisonRes}%
              </div>
            </div>
          </div>
        </div>

        {/* 進階檔位快速檢視 (FCR, FHR, IAS, CB, DS, MF) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
          <div className="bg-sanctuary-900/40 p-2 rounded-xl border border-sanctuary-800">
            <div className="text-[10px] text-sanctuary-400">施法速度 (FCR)</div>
            <div className="font-bold text-d2-unique mt-0.5">{combatStats.fcr}% ({combatStats.fcrFrame} 幀)</div>
          </div>
          <div className="bg-sanctuary-900/40 p-2 rounded-xl border border-sanctuary-800">
            <div className="text-[10px] text-sanctuary-400">打擊恢復 (FHR)</div>
            <div className="font-bold text-sanctuary-200 mt-0.5">{combatStats.fhr}% ({combatStats.fhrFrame} 幀)</div>
          </div>
          <div className="bg-sanctuary-900/40 p-2 rounded-xl border border-sanctuary-800">
            <div className="text-[10px] text-sanctuary-400">攻擊速度 (IAS)</div>
            <div className="font-bold text-amber-300 mt-0.5">{combatStats.ias}%</div>
          </div>
          <div className="bg-sanctuary-900/40 p-2 rounded-xl border border-sanctuary-800">
            <div className="text-[10px] text-sanctuary-400">壓碎打擊 (CB)</div>
            <div className="font-bold text-d2-fire mt-0.5">{combatStats.crushingBlow}%</div>
          </div>
          <div className="bg-sanctuary-900/40 p-2 rounded-xl border border-sanctuary-800">
            <div className="text-[10px] text-sanctuary-400">致命攻擊 (DS)</div>
            <div className="font-bold text-rose-400 mt-0.5">{combatStats.deadlyStrike}%</div>
          </div>
          <div className="bg-sanctuary-900/40 p-2 rounded-xl border border-sanctuary-800">
            <div className="text-[10px] text-sanctuary-400">打寶率 (MF)</div>
            <div className="font-bold text-d2-gold mt-0.5">{combatStats.magicFind}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
