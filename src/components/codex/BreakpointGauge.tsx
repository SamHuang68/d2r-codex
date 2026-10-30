import React from 'react';
import { CheckCircle2, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CLASS_ZH_TO_EN } from '../../engine/slots';

export interface BreakpointItem {
  frames: number;
  requiredValue: number;
}

export interface BreakpointGaugeProps {
  characterClass: string;
  type: 'FCR' | 'FHR' | 'FBR' | 'IAS' | string;
  variant?: string;
  variantEn?: string;
  notes?: string;
  notesEn?: string;
  currentValue: number;
  breakpoints: BreakpointItem[];
  onSetValue: (value: number) => void;
}

export const BreakpointGauge: React.FC<BreakpointGaugeProps> = ({
  characterClass,
  type,
  variant,
  variantEn,
  notes,
  notesEn,
  currentValue,
  breakpoints,
  onSetValue,
}) => {
  const { isEn } = useLanguage();

  const sortedBps = [...breakpoints].sort((a, b) => a.requiredValue - b.requiredValue);
  const maxReq = sortedBps[sortedBps.length - 1].requiredValue;

  let achievedIndex = 0;
  for (let i = 0; i < sortedBps.length; i++) {
    if (currentValue >= sortedBps[i].requiredValue) {
      achievedIndex = i;
    }
  }

  const achieved = sortedBps[achievedIndex];
  const nextBp = achievedIndex < sortedBps.length - 1 ? sortedBps[achievedIndex + 1] : null;
  const isCapped = !nextBp;
  const diff = nextBp ? nextBp.requiredValue - currentValue : 0;

  // 進度百分比計算 (以最頂檔數值為 100%)
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentValue / Math.max(1, maxReq)) * 100)));

  const displayVariant = isEn ? (variantEn || variant) : variant;
  const displayNotes = isEn ? (notesEn || notes) : notes;

  return (
    <div className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 shadow-xl space-y-5">
      {/* 檔位標題與即時達成狀態 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sanctuary-850">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-diablo text-lg font-bold text-sanctuary-100">
              {isEn ? (CLASS_ZH_TO_EN[characterClass] || characterClass) : characterClass} • {type}{' '}
              {displayVariant ? `(${displayVariant})` : ''}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sanctuary-900 border border-sanctuary-750 text-sanctuary-300 font-mono">
              {sortedBps.length} {isEn ? 'Breakpoints' : '個幀數階層'}
            </span>
          </div>
          {displayNotes && (
            <p className="text-xs text-d2-unique mt-1 flex items-center gap-1 font-medium">
              <span>💡</span>
              <span>{displayNotes}</span>
            </p>
          )}
        </div>

        {/* 達成幀數藥丸徽章 */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-sanctuary-900 to-sanctuary-950 border border-sanctuary-750 flex items-center gap-3.5 text-xs shrink-0 shadow-inner">
          <div className="border-r border-sanctuary-800 pr-3">
            <div className="text-[10px] font-mono text-sanctuary-400 uppercase">
              {isEn ? 'Achieved Speed:' : '當前達成極速：'}
            </div>
            <div className="font-diablo text-lg font-bold text-d2-fire leading-tight">
              {achieved.frames} {isEn ? 'Frames' : '幀'}
            </div>
          </div>

          <div>
            {isCapped ? (
              <div className="text-d2-set font-semibold flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-d2-set shrink-0" />
                <span>{isEn ? 'Max Breakpoint Capped!' : '頂級極速檔位已封頂！'}</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sanctuary-300 text-[11px]">
                  {isEn ? `Next (${nextBp.frames} f): ` : `距離下一檔 (${nextBp.frames} 幀) 還差：`}
                  <strong className="text-d2-unique font-bold ml-1 font-mono">+{diff}%</strong>
                </div>
                <button
                  type="button"
                  onClick={() => onSetValue(nextBp.requiredValue)}
                  className="px-2 py-0.5 rounded bg-d2-fire/20 hover:bg-d2-fire/30 border border-d2-fire/40 text-[10px] font-mono text-d2-fire flex items-center gap-1 transition-all cursor-pointer"
                  title={isEn ? `Step to ${nextBp.requiredValue}% for ${nextBp.frames} frames` : `一鍵將數值調至 ${nextBp.requiredValue}% 達成 ${nextBp.frames} 幀`}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{isEn ? `Step to ${nextBp.requiredValue}%` : `一鍵對齊 ${nextBp.requiredValue}%`}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 動態檔位步進軌道 (Breakpoint Stepper Gauge Track) */}
      <div className="py-2 px-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-sanctuary-400 mb-2">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-d2-fire" />
            {isEn ? 'Dynamic Frame Stepper Gauge' : '動態檔位步進軌道'}
          </span>
          <span className="text-sanctuary-300">
            {isEn ? 'Current: ' : '當前：'}
            <strong className="text-d2-fire font-bold font-mono">{currentValue}%</strong> / {maxReq}%
          </span>
        </div>

        {/* 軌道主體 */}
        <div className="relative">
          {/* 背景軌道線 */}
          <div className="h-2.5 w-full bg-sanctuary-900 rounded-full border border-sanctuary-800 overflow-hidden">
            {/* 動態進度條填充 */}
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-d2-fire to-amber-300 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 步進節點分佈 */}
          <div className="flex items-center justify-between mt-3 gap-1 overflow-x-auto scrollbar-none pb-1">
            {sortedBps.map((bp, i) => {
              const isPast = currentValue >= bp.requiredValue;
              const isCurrent = bp.frames === achieved.frames;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSetValue(bp.requiredValue)}
                  className={`group flex flex-col items-center min-w-[48px] sm:min-w-[56px] text-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'scale-105'
                      : 'hover:brightness-125'
                  }`}
                  title={isEn ? `Set ${type} to ${bp.requiredValue}% (${bp.frames} frames)` : `點擊將 ${type} 數值設為 ${bp.requiredValue}% (${bp.frames} 幀)`}
                >
                  {/* 節點圓點 */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                      isCurrent
                        ? 'bg-d2-fire text-sanctuary-950 ring-4 ring-d2-fire/30 shadow-glow-red scale-110'
                        : isPast
                        ? 'bg-emerald-600/80 text-white border border-emerald-400/60'
                        : 'bg-sanctuary-900 border border-sanctuary-750 text-sanctuary-500'
                    }`}
                  >
                    {isCurrent ? bp.frames : isPast ? '✓' : bp.frames}
                  </div>

                  {/* 幀數與需求數值標籤 */}
                  <div className="mt-1 text-[11px] font-mono leading-tight">
                    <span
                      className={`block font-bold ${
                        isCurrent
                          ? 'text-d2-fire'
                          : isPast
                          ? 'text-sanctuary-200'
                          : 'text-sanctuary-400'
                      }`}
                    >
                      {bp.frames} {isEn ? 'f' : '幀'}
                    </span>
                    <span
                      className={`block text-[10px] ${
                        isCurrent
                          ? 'text-amber-300 font-bold'
                          : isPast
                          ? 'text-emerald-400'
                          : 'text-sanctuary-500'
                      }`}
                    >
                      {bp.requiredValue}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 矩陣網格卡片 (Breakpoints Matrix Cards Grid) */}
      <div className="pt-2 border-t border-sanctuary-850">
        <div className="text-[11px] font-mono text-sanctuary-400 mb-2 flex items-center justify-between">
          <span>{isEn ? 'All Frame Breakpoints Table:' : '全階層幀數與需求門檻對照卡：'}</span>
          <span className="text-[10px] text-sanctuary-500">{isEn ? 'Click card to preview' : '點擊卡片可快速套用'}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2">
          {sortedBps.map((bp, i) => {
            const isCurrent = bp.frames === achieved.frames;
            const isPast = currentValue >= bp.requiredValue;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSetValue(bp.requiredValue)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-d2-fire/20 border-d2-fire text-d2-fire shadow-glow-red/30 scale-105 ring-1 ring-d2-fire/50'
                    : isPast
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300 hover:border-emerald-600'
                    : 'bg-sanctuary-900/60 border-sanctuary-800/80 text-sanctuary-300 hover:border-sanctuary-700'
                }`}
              >
                <div className="text-xs font-mono font-bold">
                  {bp.frames} {isEn ? 'frames' : '幀'}
                </div>
                <div className="text-[11px] text-sanctuary-300 mt-1 font-mono">
                  {isEn ? 'Req: ' : '需要: '}
                  <strong className={isCurrent ? 'text-d2-fire' : isPast ? 'text-emerald-400' : 'text-sanctuary-100'}>
                    {bp.requiredValue}%
                  </strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
