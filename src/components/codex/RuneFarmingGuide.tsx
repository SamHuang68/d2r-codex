import React, { useState } from 'react';
import { RUNE_FARMING_SOURCES } from '../../data/codex/runeFarming';
import { ItemIcon } from '../common/ItemIcon';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  Flame,
  Users,
  Compass,
  Award,
  ChevronDown,
  ChevronUp,
  Table,
  LayoutGrid,
  Info,
  CheckCircle2
} from 'lucide-react';

export interface RuneFarmingGuideProps {
  onSelectRune?: (runeNumber: number) => void;
}

export const RuneFarmingGuide: React.FC<RuneFarmingGuideProps> = ({ onSelectRune }) => {
  const { t, isEn } = useLanguage();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'normal' | 'nightmare' | 'hell'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'boss' | 'quest' | 'superchest' | 'high_density' | 'special_mechanic'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  const filteredSources = RUNE_FARMING_SOURCES.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all') {
      const hasDiff = s.drops.some((d) => d.difficulty === selectedDifficulty || d.difficulty === 'normal' && s.id === 'qual_kehk');
      if (!hasDiff) return false;
    }
    return true;
  });

  const categoryFilters = [
    { id: 'all', labelZh: '全部場景', labelEn: 'All Sources' },
    { id: 'boss', labelZh: '專屬首領', labelEn: 'Bosses' },
    { id: 'quest', labelZh: '固定任務', labelEn: 'Fixed Quests' },
    { id: 'superchest', labelZh: '超級寶箱', labelEn: 'Super Chests' },
    { id: 'special_mechanic', labelZh: '特殊機制怪', labelEn: 'Special Mechanics' },
    { id: 'high_density', labelZh: '高怪密度區', labelEn: 'High Density' }
  ] as const;

  const difficultyFilters = [
    { id: 'all', labelZh: '全部難度', labelEn: 'All Difficulties' },
    { id: 'normal', labelZh: '普通難度 (Normal)', labelEn: 'Normal' },
    { id: 'nightmare', labelZh: '惡夢難度 (Nightmare)', labelEn: 'Nightmare' },
    { id: 'hell', labelZh: '地獄難度 (Hell)', labelEn: 'Hell' }
  ] as const;

  return (
    <div className="space-y-6 rounded-2xl bg-gradient-to-b from-sanctuary-900/90 via-sanctuary-950 to-sanctuary-950 border border-sanctuary-800 p-4 sm:p-6 shadow-xl">
      {/* 標題與簡介 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sanctuary-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-d2-fire text-xs font-mono tracking-widest uppercase">
            <Compass className="w-4 h-4 text-d2-fire animate-pulse" />
            {t('符文取得聖地與固定掉落機制全鑑', 'Rune Farming Spots & Fixed Drop Mechanics')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-diablo font-bold text-sanctuary-100 mt-1 flex items-center gap-2.5">
            <span>{t('符文產地與最高掉落上限指引', 'Rune Sources & Max Drop Caps Guide')}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 font-mono font-normal">
              Patch 2.4 ~ 2.7
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1 max-w-3xl leading-relaxed">
            {t(
              '詳解高塔女伯爵專屬掉落表與單人反向人數定律、第四章敲石頭 (地獄熔爐) 1/11 等機率產出、下庫拉斯特超級寶箱 30# 貝上限、崔凡克瘸子 3 倍掉落與秘法聖殿幽靈無防具掉落機制。',
              'Detailed analysis of The Countess dedicated Rune TC and P1 rules, Hellforge 1/11 equal probability caps, Lower Kurast 30# Ber patterns, Travincal 3x drop multipliers, and Arcane Sanctuary specter loot pools.'
            )}
          </p>
        </div>

        {/* 視圖切換器（卡片 / 對照表） */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <div className="p-1 rounded-xl bg-sanctuary-900 border border-sanctuary-800 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-amber-600 text-sanctuary-950 font-bold shadow'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t('攻略卡片', 'Detail Cards')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-amber-600 text-sanctuary-950 font-bold shadow'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{t('速查對照表', 'Quick Matrix')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 篩選控制器 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-sanctuary-950/70 p-3 rounded-xl border border-sanctuary-850">
        {/* 類型篩選 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-sanctuary-400 font-mono mr-1">
            {t('分類:', 'Category:')}
          </span>
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-sanctuary-800 text-d2-gold border-d2-gold/50 font-bold'
                  : 'bg-sanctuary-900/60 text-sanctuary-400 border-sanctuary-800 hover:text-sanctuary-200 hover:border-sanctuary-700'
              }`}
            >
              {isEn ? cat.labelEn : cat.labelZh}
            </button>
          ))}
        </div>

        {/* 難度篩選 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-sanctuary-400 font-mono mr-1">
            {t('難度:', 'Difficulty:')}
          </span>
          {difficultyFilters.map((diff) => (
            <button
              key={diff.id}
              type="button"
              onClick={() => setSelectedDifficulty(diff.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                selectedDifficulty === diff.id
                  ? 'bg-sanctuary-800 text-amber-300 border-amber-500/50 font-bold'
                  : 'bg-sanctuary-900/60 text-sanctuary-400 border-sanctuary-800 hover:text-sanctuary-200 hover:border-sanctuary-700'
              }`}
            >
              {isEn ? diff.labelEn : diff.labelZh}
            </button>
          ))}
        </div>
      </div>

      {/* 視圖 A：詳盡攻略卡片視圖 */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredSources.map((source) => {
            const isExpanded = expandedSourceId === source.id;
            const dropCount = source.drops.length;
            const gridColsClass =
              dropCount === 1
                ? 'grid-cols-1'
                : dropCount === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-3';

            return (
              <div
                key={source.id}
                className="rounded-xl bg-sanctuary-950 border border-sanctuary-800 hover:border-sanctuary-700 transition-all shadow-md flex flex-col justify-between overflow-hidden"
              >
                {/* 卡片頭部：分層佈局，徹底根除標題被右側標籤壓縮折行的排版失誤 */}
                <div className="p-4 sm:p-5 space-y-2.5 border-b border-sanctuary-850 bg-gradient-to-r from-sanctuary-900/40 to-transparent">
                  {/* 第一層：章節、分類標籤與推薦人數徽章 */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-700/40">
                        {source.act === 0 ? t('全章節', 'All Acts') : isEn ? `Act ${source.act}` : `第 ${source.act} 章`}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sanctuary-850 text-sanctuary-300 border border-sanctuary-750">
                        {isEn ? source.categoryLabelEn : source.categoryLabelZh}
                      </span>
                    </div>

                    {/* 推薦人數標章（獨立於上方右側，享有充裕空間） */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-sanctuary-900 border border-sanctuary-750 text-[11px] font-mono text-d2-gold shrink-0">
                      <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{isEn ? source.recommendedPlayerCountEn : source.recommendedPlayerCountZh}</span>
                    </div>
                  </div>

                  {/* 第二層：完整標題獨立佔用一行，字體大氣舒展，絕不被擠壓換行 */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-diablo font-bold text-sanctuary-100 tracking-wide">
                      {isEn ? source.nameEn : source.nameZh}
                    </h3>
                    {!isEn && (
                      <div className="text-xs font-mono text-sanctuary-400 mt-0.5">
                        {source.nameEn}
                      </div>
                    )}
                  </div>

                  {/* 第三層：地點標記 */}
                  <div className="text-xs text-sanctuary-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-d2-fire shrink-0" />
                    <span>{isEn ? source.locationEn : source.locationZh}</span>
                  </div>

                  {/* 第四層：簡介文字 */}
                  <p className="text-xs text-sanctuary-300 leading-relaxed pt-0.5">
                    {isEn ? source.summaryEn : source.summaryZh}
                  </p>
                </div>

                {/* 難度與掉落上限區塊 */}
                <div className="p-4 sm:p-5 space-y-3 bg-sanctuary-950/80">
                  <div className="text-[11px] font-mono text-sanctuary-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-d2-unique" />
                    <span>{t('各難度最高符文上限與產出範圍:', 'Max Rune Caps by Difficulty:')}</span>
                  </div>

                  <div className={`grid ${gridColsClass} gap-2.5`}>
                    {source.drops.map((drop) => {
                      const isHell = drop.difficulty === 'hell';
                      const isNM = drop.difficulty === 'nightmare';
                      const isSingleCard = dropCount === 1;

                      return (
                        <div
                          key={drop.difficulty}
                          className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 ${
                            isHell
                              ? 'bg-red-950/20 border-red-900/40'
                              : isNM
                              ? 'bg-amber-950/20 border-amber-900/40'
                              : 'bg-sanctuary-900/40 border-sanctuary-800'
                          } ${isSingleCard ? 'sm:flex-row sm:items-center sm:space-y-0 sm:gap-4' : ''}`}
                        >
                          <div className={isSingleCard ? 'sm:w-1/3 space-y-1' : ''}>
                            <div className="flex items-center justify-between pb-1.5 border-b border-sanctuary-800/60">
                              <span className="text-[11px] font-bold font-mono text-sanctuary-200">
                                {isEn ? drop.labelEn : drop.labelZh}
                              </span>
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                                  isHell
                                    ? 'bg-red-900/60 text-red-300'
                                    : isNM
                                    ? 'bg-amber-900/60 text-amber-300'
                                    : 'bg-sanctuary-800 text-sanctuary-300'
                                }`}
                              >
                                {drop.difficulty}
                              </span>
                            </div>

                            <div className="pt-1">
                              <span className="text-[11px] text-sanctuary-400 mr-2">{t('最高掉落:', 'Max Drop:')}</span>
                              <button
                                type="button"
                                onClick={() => onSelectRune?.(drop.specialMaxRuneNumber ?? drop.maxRuneNumber)}
                                className="font-diablo text-xs font-bold text-d2-rune hover:underline cursor-pointer inline-flex items-center gap-1"
                                title={t('點擊定位此符文', 'Click to view rune details')}
                              >
                                <ItemIcon runeNumber={drop.specialMaxRuneNumber ?? drop.maxRuneNumber} size="xs" showBorder={false} />
                                <span>{isEn ? drop.specialMaxRuneNameEn ?? drop.maxRuneNameEn : drop.specialMaxRuneNameZh ?? drop.maxRuneNameZh}</span>
                              </button>
                            </div>

                            {drop.runeRangeZh && (
                              <div className="text-[10px] text-sanctuary-400 font-mono">
                                {isEn ? drop.runeRangeEn : drop.runeRangeZh}
                              </div>
                            )}
                          </div>

                          <p className={`text-[11px] text-sanctuary-300 leading-snug ${isSingleCard ? 'sm:w-2/3 sm:border-l sm:border-sanctuary-800/60 sm:pl-4' : 'pt-1'}`}>
                            {isEn ? drop.noteEn : drop.noteZh}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 核心機制與專家技巧折疊面板 */}
                <div className="border-t border-sanctuary-850 bg-sanctuary-900/30">
                  <button
                    type="button"
                    onClick={() => setExpandedSourceId(isExpanded ? null : source.id)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-sanctuary-400 hover:text-sanctuary-200 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 font-mono">
                      <Flame className="w-3.5 h-3.5 text-d2-fire" />
                      {isExpanded
                        ? t('收合特殊機制與專家技巧', 'Hide Mechanics & Pro Tips')
                        : t('展開深入掉落機制與專家技巧', 'View In-Depth Mechanics & Pro Tips')}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-3 border-t border-sanctuary-850/60 bg-sanctuary-950/60 animate-fade-in text-xs">
                      {/* 機制清單 */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold font-mono text-amber-300 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          <span>{t('核心掉落機制 (Drop Mechanics):', 'Drop Mechanics:')}</span>
                        </div>
                        <ul className="space-y-1 text-sanctuary-300 pl-4 list-disc marker:text-amber-500">
                          {(isEn ? source.mechanicsEn : source.mechanicsZh).map((m, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 專家技巧 */}
                      {source.proTipsZh.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-sanctuary-850/60">
                          <div className="text-[11px] font-bold font-mono text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('拓荒實戰建議 (Pro Tips):', 'Pro Tips:')}</span>
                          </div>
                          <ul className="space-y-1 text-sanctuary-300 pl-4 list-disc marker:text-emerald-500">
                            {(isEn ? source.proTipsEn : source.proTipsZh).map((tip, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 視圖 B：緊湊速查對照表視圖 */}
      {viewMode === 'table' && (
        <div className="rounded-xl border border-sanctuary-800 bg-sanctuary-950 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sanctuary-900 border-b border-sanctuary-800 text-[11px] font-mono text-sanctuary-300">
              <tr>
                <th className="py-3 px-4">{t('場景 / 任務名稱', 'Source / Quest')}</th>
                <th className="py-3 px-3">{t('章節', 'Act')}</th>
                <th className="py-3 px-3">{t('類別', 'Category')}</th>
                <th className="py-3 px-4">{t('普通最高', 'Normal Max')}</th>
                <th className="py-3 px-4">{t('惡夢最高', 'NM Max')}</th>
                <th className="py-3 px-4">{t('地獄最高', 'Hell Max')}</th>
                <th className="py-3 px-4">{t('推薦人數', 'Player Count')}</th>
                <th className="py-3 px-4">{t('核心特性備忘', 'Key Takeaway')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sanctuary-850">
              {filteredSources.map((s) => {
                const normDrop = s.drops.find((d) => d.difficulty === 'normal');
                const nmDrop = s.drops.find((d) => d.difficulty === 'nightmare');
                const hellDrop = s.drops.find((d) => d.difficulty === 'hell');

                return (
                  <tr key={s.id} className="hover:bg-sanctuary-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-sanctuary-100 flex items-center gap-1.5">
                        <span>{isEn ? s.nameEn : s.nameZh}</span>
                        {!isEn && <span className="text-[10px] font-mono text-sanctuary-400">({s.nameEn})</span>}
                      </div>
                      <div className="text-[10px] text-sanctuary-500">{isEn ? s.locationEn : s.locationZh}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-sanctuary-300">
                      {s.act === 0 ? t('全章', 'All') : isEn ? `Act ${s.act}` : `第 ${s.act} 章`}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sanctuary-900 border border-sanctuary-800 text-sanctuary-300">
                        {isEn ? s.categoryLabelEn : s.categoryLabelZh}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {normDrop ? (
                        <button
                          type="button"
                          onClick={() => onSelectRune?.(normDrop.specialMaxRuneNumber ?? normDrop.maxRuneNumber)}
                          className="text-d2-rune hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                        >
                          <ItemIcon runeNumber={normDrop.specialMaxRuneNumber ?? normDrop.maxRuneNumber} size="xs" showBorder={false} />
                          <span>{isEn ? normDrop.specialMaxRuneNameEn ?? normDrop.maxRuneNameEn : normDrop.specialMaxRuneNameZh ?? normDrop.maxRuneNameZh}</span>
                        </button>
                      ) : (
                        <span className="text-sanctuary-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {nmDrop ? (
                        <button
                          type="button"
                          onClick={() => onSelectRune?.(nmDrop.specialMaxRuneNumber ?? nmDrop.maxRuneNumber)}
                          className="text-d2-rune hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                        >
                          <ItemIcon runeNumber={nmDrop.specialMaxRuneNumber ?? nmDrop.maxRuneNumber} size="xs" showBorder={false} />
                          <span>{isEn ? nmDrop.specialMaxRuneNameEn ?? nmDrop.maxRuneNameEn : nmDrop.specialMaxRuneNameZh ?? nmDrop.maxRuneNameZh}</span>
                        </button>
                      ) : (
                        <span className="text-sanctuary-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {hellDrop ? (
                        <button
                          type="button"
                          onClick={() => onSelectRune?.(hellDrop.specialMaxRuneNumber ?? hellDrop.maxRuneNumber)}
                          className="text-d2-rune hover:underline cursor-pointer flex items-center gap-1 font-bold text-amber-300"
                        >
                          <ItemIcon runeNumber={hellDrop.specialMaxRuneNumber ?? hellDrop.maxRuneNumber} size="xs" showBorder={false} />
                          <span>{isEn ? hellDrop.specialMaxRuneNameEn ?? hellDrop.maxRuneNameEn : hellDrop.specialMaxRuneNameZh ?? hellDrop.maxRuneNameZh}</span>
                        </button>
                      ) : (
                        <span className="text-sanctuary-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-d2-gold text-[11px]">
                      {isEn ? s.recommendedPlayerCountEn : s.recommendedPlayerCountZh}
                    </td>
                    <td className="py-3 px-4 text-sanctuary-300 max-w-xs leading-relaxed text-[11px]">
                      {isEn ? s.summaryEn : s.summaryZh}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
