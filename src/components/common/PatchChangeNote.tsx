import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { type PatchEntry, type PatchChange, S16_SCOPE_NOTES } from '../../data/patchNotes';

export interface PatchChangeNoteProps {
  entry: PatchEntry;
  className?: string;
  compact?: boolean;
}

const MARK: Record<PatchChange['type'], { sym: string; cls: string; zh: string; en: string }> = {
  add: { sym: '＋', cls: 'text-emerald-400', zh: '新增', en: 'Added' },
  remove: { sym: '－', cls: 'text-rose-400', zh: '移除', en: 'Removed' },
  change: { sym: '◆', cls: 'text-amber-300', zh: '調整', en: 'Changed' },
};

export const PatchChangeNote: React.FC<PatchChangeNoteProps> = ({
  entry,
  className = '',
  compact = false
}) => {
  const { t, isEn } = useLanguage();

  return (
    <div
      className={`rounded-xl border border-purple-600/40 bg-gradient-to-br from-purple-950/40 via-sanctuary-950/90 to-sanctuary-950 p-3 text-xs shadow-md transition-all ${className}`}
      aria-label={t('天梯第16季調整預覽', 'Ladder Season 16 Adjustment Preview')}
    >
      {/* 標題與適用模式提示列 */}
      <div className="flex flex-col gap-1 pb-2 border-b border-purple-900/40">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-diablo text-xs font-bold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>{isEn ? 'Ladder Season 16 Preview' : '天梯第 16 季調整預覽'}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-200 border border-purple-500/40 font-normal">
              Patch 3.4
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-600/40 font-semibold shrink-0">
            {isEn ? S16_SCOPE_NOTES.modeScopeEn : S16_SCOPE_NOTES.modeScopeZh}
          </span>
        </div>

        {/* 嚴格遵循使用者指示之改動範圍說明 */}
        <p className="text-[11px] text-sanctuary-400 leading-tight">
          {isEn ? S16_SCOPE_NOTES.expansionScopeEn : S16_SCOPE_NOTES.expansionScopeZh}
        </p>
      </div>

      {/* 改動清單 */}
      <ul className={`mt-2.5 space-y-1.5 text-sanctuary-200 font-sans ${compact ? 'text-[11px]' : 'text-xs'}`}>
        {entry.changes.map((c, i) => (
          <li key={i} className="flex items-start gap-1.5 leading-snug">
            <span className={`shrink-0 w-4 text-center font-bold ${MARK[c.type].cls}`} aria-hidden="true">
              {MARK[c.type].sym}
            </span>
            <span className="text-sanctuary-100">
              <span className="sr-only">{isEn ? MARK[c.type].en : MARK[c.type].zh}：</span>
              {isEn ? c.en : c.zh}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
