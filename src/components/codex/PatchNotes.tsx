import React from 'react';
import { ScrollText, ExternalLink } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { pathForTab } from '../../utils/routes';
import { isPlainLeftClick } from '../layout/navConfig';
import { PATCH_SOURCE, type PatchChange, type PatchKind, type PatchVersion } from '../../data/patchNotes';
import { resolvedPatchNotes, resolvedNonLadder, type ResolvedRef, type NonLadderRef } from '../../utils/patchResolve';
import meta from '../../data/game/meta.json';

export interface PatchNotesProps {
  /** 點項目名稱時前往該單品網址（站內換頁） */
  onOpenItem?: (tab: 'items' | 'runewords', id: string) => void;
}

const KIND_LABEL: Record<PatchKind, { zh: string; en: string }> = {
  unique: { zh: '暗金', en: 'Unique' },
  runeword: { zh: '符文之語', en: 'Runeword' },
  set: { zh: '套裝', en: 'Set' },
  setItem: { zh: '套裝部件', en: 'Set item' },
};

const VERSIONS: { v: PatchVersion; zh: string; en: string; noteZh: string; noteEn: string }[] = [
  {
    v: '3.4', zh: 'Patch 3.4・天梯第 16 季', en: 'Patch 3.4 · Ladder Season 16',
    noteZh: '以下是 3.4 版的物品改動（舊值 → 新值）。本站物品的基本資料目前是 3.3.93847 版（取自遊戲檔案），還沒有套用這些數值；等 3.4 的遊戲資料出來後會更新單品頁。',
    noteEn: 'Item changes in patch 3.4 (old → new). The item data on this site is currently from game version 3.3.93847 and does not yet apply these values; item pages will be updated once the 3.4 game data is available.',
  },
  {
    v: '3.3', zh: 'Patch 3.3・天梯第 15 季', en: 'Patch 3.3 · Ladder Season 15',
    noteZh: '3.3 版的物品改動；這些在本站目前的資料（3.3.93847）裡大多已經是新值。',
    noteEn: 'Item changes in patch 3.3; most of these are already reflected in the data on this site (3.3.93847).',
  },
];

const MARK: Record<PatchChange['type'], { sym: string; cls: string; zh: string; en: string }> = {
  add: { sym: '＋', cls: 'text-emerald-400', zh: '新增', en: 'Added' },
  remove: { sym: '－', cls: 'text-rose-400', zh: '移除', en: 'Removed' },
  change: { sym: '◆', cls: 'text-amber-300', zh: '調整', en: 'Changed' },
};

/** 版本改動頁：列出 3.4／3.3 的物品改動（舊值 → 新值），每個項目連到它的單品頁 */
export const PatchNotes: React.FC<PatchNotesProps> = ({ onOpenItem }) => {
  const { t, isEn } = useLanguage();
  const entries = React.useMemo(() => resolvedPatchNotes(), []);
  const nonLadder = React.useMemo(() => resolvedNonLadder(), []);

  const itemLink = (ref: ResolvedRef) => (
    <a
      href={pathForTab(ref.tab, ref.id)}
      onClick={(e) => { if (!onOpenItem || !isPlainLeftClick(e)) return; e.preventDefault(); onOpenItem(ref.tab, ref.id); }}
      className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-d2-gold rounded"
    >
      {isEn ? ref.nameEn : ref.name}
    </a>
  );

  const chips = (list: NonLadderRef[]) => (
    <ul className="flex flex-wrap gap-2">
      {list.map((x) => (
        <li key={x.nameEn} className="rounded-lg border border-sanctuary-800 bg-sanctuary-900/60 px-2.5 py-1 text-sm text-sanctuary-200">
          {x.ref ? itemLink(x.ref) : <span>{x.nameEn}<span className="ml-1.5 text-xs text-sanctuary-400">{t('（本站尚未收錄）', '(not in this site\'s data yet)')}</span></span>}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <PageHeader
        icon={<ScrollText className="w-6 h-6" />}
        title={t('版本改動', 'Patch Changes')}
        desc={t('暗黑破壞神 II：獄火重生 3.3、3.4 版（天梯第 15、16 季）的物品改動：暗金、套裝與符文之語的數值調整。', 'Item changes in Diablo II: Resurrected patches 3.3 and 3.4 (Ladder Seasons 15 and 16): balance changes to uniques, sets and runewords.')}
      />

      {VERSIONS.map((ver) => (
        <section key={ver.v} aria-labelledby={`patch-${ver.v}`} className="space-y-3">
          <h3 id={`patch-${ver.v}`} className="font-diablo text-xl font-bold text-d2-unique">{isEn ? ver.en : ver.zh}</h3>
          <p className="text-sm text-sanctuary-400 max-w-3xl">{isEn ? ver.noteEn : ver.noteZh}</p>
          <ul className="grid gap-3 md:grid-cols-2">
            {entries.filter((e) => e.entry.version === ver.v).map((e) => (
              <li key={`${e.entry.kind}-${e.nameEn}`} className="rounded-xl border border-sanctuary-800 bg-sanctuary-950/70 p-4">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h4 className="font-diablo text-base font-bold text-d2-unique">{itemLink(e)}</h4>
                  {!isEn && <span className="text-xs text-sanctuary-400 font-mono italic">{e.nameEn}</span>}
                  <span className="text-[11px] rounded border border-sanctuary-700 px-1.5 py-0.5 text-sanctuary-300">{isEn ? KIND_LABEL[e.entry.kind].en : KIND_LABEL[e.entry.kind].zh}</span>
                  {e.entry.ladderOnly && <span className="text-[11px] rounded border border-amber-600/60 px-1.5 py-0.5 text-amber-300">{t('僅限天梯', 'Ladder only')}</span>}
                </div>
                {e.entry.parentSet && <div className="text-xs text-sanctuary-400 mt-0.5">{t('所屬套裝：', 'Set: ')}{e.entry.parentSet}</div>}
                <ul className="mt-2 space-y-1 text-sm text-sanctuary-200">
                  {e.entry.changes.map((c, i) => (
                    <li key={i} className="flex gap-2 leading-snug">
                      <span className={`shrink-0 w-4 text-center font-bold ${MARK[c.type].cls}`} aria-hidden="true">{MARK[c.type].sym}</span>
                      <span><span className="sr-only">{isEn ? MARK[c.type].en : MARK[c.type].zh}：</span>{isEn ? c.en : c.zh}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section aria-labelledby="patch-nonladder" className="space-y-3">
        <h3 id="patch-nonladder" className="font-diablo text-xl font-bold text-d2-unique">{t('非天梯新增', 'Now available in non-ladder')}</h3>
        <p className="text-sm text-sanctuary-400 max-w-3xl">{t('先前僅限天梯、現在非天梯也能取得的項目。', 'Items and runewords that were ladder-only before and can now also be found in non-ladder.')}</p>
        <h4 className="text-sm font-semibold text-sanctuary-300">{t('暗金與套裝', 'Uniques and sets')}</h4>
        {chips(nonLadder.items)}
        <h4 className="text-sm font-semibold text-sanctuary-300">{t('符文之語', 'Runewords')}</h4>
        {chips(nonLadder.runewords)}
      </section>

      <p className="text-xs text-sanctuary-400 border-t border-sanctuary-800 pt-4">
        {t('改動內容整理自 ', 'Change list compiled from ')}
        <a href={PATCH_SOURCE.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sanctuary-200 hover:underline">
          {PATCH_SOURCE.name}〈{PATCH_SOURCE.titleEn}〉<ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
        {t('，數值以原文為準。本站物品資料版本：', '; values follow the original article. Item data version on this site: ')}{meta.gameVersion}
        {t('。本站為粉絲網站，一切權利歸暴雪娛樂所有。', '. This is a fan page. All rights belong to Blizzard Entertainment.')}
      </p>
    </div>
  );
};
