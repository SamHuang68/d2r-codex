import React, { useState, useMemo } from 'react';
import {
  MERCENARY_MATRIX_DATA,
  type ClassMercMatrixEntry,
  type MercTierKey,
  type MercTierBuild,
  type MercGearItemRef,
} from '../../data/mercenaryMatrix';
import { applyMercenaryPresetToSimulator } from '../../utils/mercPresetBridge';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  Sparkles,
  Zap,
  Shield,
  Check,
  CheckCircle2,
  ExternalLink,
  Crown,
  Coins,
  Filter,
} from 'lucide-react';

export interface MercenaryMatrixProps {
  onNavigateItem?: (itemName: string) => void;
  onNavigateToSimulator?: (tier: MercTierBuild, classCode?: string) => void;
}

const CLASS_BADGES: { code: string; zh: string; en: string; color: string; border: string; bg: string }[] = [
  { code: 'all', zh: '全部職業', en: 'All Classes', color: 'text-sanctuary-200', border: 'border-sanctuary-600', bg: 'bg-sanctuary-800/80' },
  { code: 'sor', zh: '魔法使', en: 'Sorceress', color: 'text-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-950/40' },
  { code: 'pal', zh: '聖騎士', en: 'Paladin', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/40' },
  { code: 'ama', zh: '亞馬遜', en: 'Amazon', color: 'text-orange-400', border: 'border-orange-500/40', bg: 'bg-orange-950/40' },
  { code: 'nec', zh: '死靈法師', en: 'Necromancer', color: 'text-teal-400', border: 'border-teal-500/40', bg: 'bg-teal-950/40' },
  { code: 'bar', zh: '野蠻人', en: 'Barbarian', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-950/40' },
  { code: 'dru', zh: '德魯伊', en: 'Druid', color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/40' },
  { code: 'ass', zh: '刺客', en: 'Assassin', color: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-950/40' },
  { code: 'war', zh: '術士', en: 'Warlock', color: 'text-violet-400', border: 'border-violet-500/40', bg: 'bg-violet-950/40' },
];

const TIER_META: Record<
  MercTierKey,
  { label: string; labelEn: string; sub: string; subEn: string; badgeCls: string; borderCls: string; bgCls: string; icon: React.ReactNode }
> = {
  start: {
    label: '全裝成形',
    labelEn: 'Starter',
    sub: '造價親民 · 迅速通關',
    subEn: 'Budget · Quick Progression',
    badgeCls: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    borderCls: 'border-amber-500/30 hover:border-amber-400/50',
    bgCls: 'from-amber-950/20 via-sanctuary-900/60 to-sanctuary-950',
    icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
  },
  mf: {
    label: '打寶專精',
    labelEn: 'Magic Find',
    sub: '極限尋寶 · 穩健生存',
    subEn: 'Max MF · Solid Survival',
    badgeCls: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    borderCls: 'border-cyan-500/30 hover:border-cyan-400/50',
    bgCls: 'from-cyan-950/20 via-sanctuary-900/60 to-sanctuary-950',
    icon: <Coins className="w-3.5 h-3.5 text-cyan-400" />,
  },
  bis: {
    label: '頂規畢業',
    labelEn: 'Best in Slot',
    sub: '破免神裝 · 終極輸出',
    subEn: 'Sunder Piercing · Endgame DPS',
    badgeCls: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    borderCls: 'border-purple-500/30 hover:border-purple-400/50',
    bgCls: 'from-purple-950/20 via-sanctuary-900/60 to-sanctuary-950',
    icon: <Crown className="w-3.5 h-3.5 text-purple-400" />,
  },
};

export const MercenaryMatrix: React.FC<MercenaryMatrixProps> = ({
  onNavigateItem,
  onNavigateToSimulator,
}) => {
  const { t, isEn } = useLanguage();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tierView, setTierView] = useState<'all' | MercTierKey>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 複合搜尋與篩選邏輯
  const filteredData = useMemo(() => {
    return MERCENARY_MATRIX_DATA.filter((entry) => {
      // 1. 職業篩選
      if (selectedClass !== 'all' && entry.classCode !== selectedClass) {
        return false;
      }
      // 2. 關鍵字比對
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const inClass = entry.classZh.toLowerCase().includes(q) || entry.classEn.toLowerCase().includes(q);
      const inBuild = entry.buildName.toLowerCase().includes(q) || entry.role.toLowerCase().includes(q);
      const inProblem = entry.coreProblem.toLowerCase().includes(q) || entry.bestMercSummary.toLowerCase().includes(q);

      // 檢查三種配置中的裝備與光環
      const inTiers = (['start', 'mf', 'bis'] as MercTierKey[]).some((tk) => {
        const t = entry.tiers[tk];
        const inAuras = t.keyAuras.some((a) => a.toLowerCase().includes(q));
        const inItems = [t.weapon, t.weapon2, t.helm, t.armor]
          .filter(Boolean)
          .some(
            (it) =>
              it!.name.toLowerCase().includes(q) ||
              it!.nameEn.toLowerCase().includes(q) ||
              (it!.baseName && it!.baseName.toLowerCase().includes(q)) ||
              (it!.note && it!.note.toLowerCase().includes(q))
          );
        const inMerc = t.mercTypeZh.toLowerCase().includes(q) || t.synergyNote.toLowerCase().includes(q);
        return inAuras || inItems || inMerc;
      });

      return inClass || inBuild || inProblem || inTiers;
    });
  }, [selectedClass, searchQuery]);

  // 一鍵帶入裝備至配裝模擬器
  const handleApplyPreset = (entry: ClassMercMatrixEntry, tier: MercTierBuild) => {
    const res = applyMercenaryPresetToSimulator(tier, entry.classCode);
    setCopiedId(`${entry.id}-${tier.tier}`);
    setToastMessage(res.message);

    setTimeout(() => {
      setCopiedId(null);
    }, 2500);

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);

    // 觸發切換到模擬器分頁
    if (onNavigateToSimulator) {
      onNavigateToSimulator(tier, entry.classCode);
    }
  };

  // 渲染單件裝備列
  const renderGearRow = (labelZh: string, labelEn: string, item: MercGearItemRef | undefined) => {
    if (!item) return null;
    const itemName = isEn ? item.nameEn : item.name;
    const itemSub = isEn ? item.name : item.nameEn;
    const base = isEn && item.baseNameEn ? item.baseNameEn : item.baseName;

    return (
      <div className="flex items-start justify-between gap-2 py-1.5 border-b border-sanctuary-800/50 last:border-0 group">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-sanctuary-400 shrink-0">
              {t(labelZh, labelEn)}：
            </span>
            <button
              type="button"
              onClick={() => onNavigateItem?.(item.name)}
              className="text-xs font-semibold text-d2-unique hover:text-amber-300 hover:underline transition-colors cursor-pointer text-left inline-flex items-center gap-1"
              title={`在百科中查看【${item.name}】（${item.nameEn}）詳細數值`}
            >
              <span>{itemName}</span>
              {itemSub && <span className="text-[11px] text-sanctuary-400 font-mono italic">({itemSub})</span>}
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
            </button>
            {item.ethereal && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono" title={t('無形裝備（傭兵不消耗耐久，數值高1.5倍）', 'Ethereal Item')}>
                {t('無形', 'Eth')}
              </span>
            )}
            {base && (
              <span className="text-[10px] text-sanctuary-400 font-mono" title={t('推薦搭配底材', 'Recommended Base')}>
                ({base})
              </span>
            )}
          </div>
          {item.note && (
            <p className="text-[11px] text-sanctuary-400/90 mt-0.5 leading-relaxed pl-3.5 border-l border-sanctuary-800">
              {item.note}
            </p>
          )}
        </div>
      </div>
    );
  };

  // 渲染梯次配置卡片
  const renderTierCard = (entry: ClassMercMatrixEntry, tierKey: MercTierKey) => {
    const tier = entry.tiers[tierKey];
    const meta = TIER_META[tierKey];
    const isCopied = copiedId === `${entry.id}-${tierKey}`;

    return (
      <div
        key={tierKey}
        className={`flex-1 flex flex-col justify-between rounded-xl border bg-gradient-to-b p-3.5 transition-all shadow-sm ${meta.borderCls} ${meta.bgCls}`}
      >
        <div>
          {/* 卡片頂部梯次標籤與傭兵型態 */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-sanctuary-800">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-sanctuary-900 border border-sanctuary-700">
                {meta.icon}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${meta.badgeCls}`}>
                    {t(meta.label, meta.labelEn)}
                  </span>
                  <span className="text-[11px] text-sanctuary-400 font-diablo">
                    {t(meta.sub, meta.subEn)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 推薦傭兵類型 */}
          <div className="mb-2.5 px-2 py-1.5 rounded-lg bg-sanctuary-950/70 border border-sanctuary-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sanctuary-400 shrink-0" />
              <span className="text-xs font-medium text-sanctuary-200">
                {tier.mercTypeZh}
              </span>
            </div>
            <span className="text-[10px] text-sanctuary-400 uppercase tracking-wide">
              Act {tier.mercAct}
            </span>
          </div>

          {/* 裝備三件套清單 */}
          <div className="space-y-1 mb-3 bg-sanctuary-950/40 rounded-lg p-2 border border-sanctuary-800/40">
            {renderGearRow('武器', 'Weapon', tier.weapon)}
            {tier.weapon2 && renderGearRow('副手武器', 'Offhand', tier.weapon2)}
            {renderGearRow('頭盔', 'Helm', tier.helm)}
            {renderGearRow('護甲', 'Armor', tier.armor)}
          </div>

          {/* 核心光環標籤群 */}
          <div className="mb-2.5">
            <div className="text-[10px] text-sanctuary-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-d2-unique" />
              <span>{t('核心賦予光環：', 'Key Granted Auras:')}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tier.keyAuras.map((aura, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-d2-gold/10 border border-d2-gold/30 text-amber-200 font-mono shadow-xs"
                >
                  ⚡ {aura}
                </span>
              ))}
            </div>
          </div>

          {/* 流派協同效應 */}
          <div className="p-2 rounded bg-sanctuary-950/60 border border-sanctuary-800/70 mb-3 text-[11px] text-sanctuary-300 leading-relaxed">
            <span className="text-amber-400 font-medium">{t('戰術協同：', 'Combat Synergy: ')}</span>
            {tier.synergyNote}
          </div>
        </div>

        {/* 底部一鍵帶入操作列 */}
        <div className="pt-2 border-t border-sanctuary-800/60 mt-auto">
          <button
            type="button"
            onClick={() => handleApplyPreset(entry, tier)}
            className={`w-full py-2 px-3 rounded-lg text-xs font-bold font-diablo transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
              isCopied
                ? 'bg-emerald-600 text-white shadow-emerald-900/50'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-sanctuary-950 hover:text-white shadow-amber-950/50'
            }`}
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white animate-bounce" />
                <span>{t('已成功帶入模擬器！', 'Loaded into Simulator!')}</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>{t('⚡ 一鍵帶入配裝模擬器', '⚡ Load Into Simulator')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 提示訊息 Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-sanctuary-900 to-sanctuary-950 border border-amber-500/60 text-amber-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fade-in">
          <div className="p-1.5 rounded-full bg-amber-500/20 text-amber-400">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">{toastMessage}</p>
            <p className="text-[10px] text-sanctuary-400 mt-0.5">
              {t('傭兵裝備已就緒，可隨時在「配裝模擬器」查看光環與數值！', 'Mercenary gear loaded! Check auras & stats in Build Planner.')}
            </p>
          </div>
        </div>
      )}

      {/* 控制與篩選總覽列 */}
      <div className="p-4 rounded-2xl bg-sanctuary-900/80 border border-sanctuary-800 shadow-xl space-y-4">
        {/* 上層：職業標籤 Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sanctuary-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-d2-unique" />
              {t('依主角職業篩選搭配：', 'Filter by Hero Class:')}
            </span>
            <span className="text-[11px] text-sanctuary-400">
              {t(
                `顯示 ${filteredData.length} / ${MERCENARY_MATRIX_DATA.length} 款流派矩陣`,
                `Showing ${filteredData.length} / ${MERCENARY_MATRIX_DATA.length} Builds`
              )}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CLASS_BADGES.map((b) => {
              const isSelected = selectedClass === b.code;
              const count =
                b.code === 'all'
                  ? MERCENARY_MATRIX_DATA.length
                  : MERCENARY_MATRIX_DATA.filter((e) => e.classCode === b.code).length;

              return (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => setSelectedClass(b.code)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? `${b.bg} ${b.color} border ${b.border} shadow-sm font-bold ring-1 ring-amber-500/30`
                      : 'bg-sanctuary-950/60 text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-800 border border-sanctuary-800'
                  }`}
                >
                  <span>{t(b.zh, b.en)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-sanctuary-900 text-amber-300' : 'bg-sanctuary-900/60 text-sanctuary-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 下層：即時搜尋框與梯次切換 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-sanctuary-800/60">
          {/* 搜尋框 */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-sanctuary-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                '搜尋流派、武器 (如靈光/死神喪鐘)、光環、傭兵型態…',
                'Search builds, weapons (e.g. Insight), auras, merc...'
              )}
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-sanctuary-950/90 border border-sanctuary-700/80 text-xs text-sanctuary-100 placeholder-sanctuary-400 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-sanctuary-400 hover:text-sanctuary-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* 梯次切換開關 */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800 self-stretch sm:self-auto justify-center">
            <button
              type="button"
              onClick={() => setTierView('all')}
              className={`px-3 py-1 rounded-lg text-xs font-diablo transition-all cursor-pointer ${
                tierView === 'all'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-sanctuary-950 font-bold shadow-xs'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              {t('📊 完整矩陣對照', '📊 All Matrix')}
            </button>
            <button
              type="button"
              onClick={() => setTierView('start')}
              className={`px-3 py-1 rounded-lg text-xs font-diablo transition-all cursor-pointer ${
                tierView === 'start'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              {t('⚡ 全裝成形', '⚡ Starter')}
            </button>
            <button
              type="button"
              onClick={() => setTierView('mf')}
              className={`px-3 py-1 rounded-lg text-xs font-diablo transition-all cursor-pointer ${
                tierView === 'mf'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              {t('💎 打寶專精', '💎 Magic Find')}
            </button>
            <button
              type="button"
              onClick={() => setTierView('bis')}
              className={`px-3 py-1 rounded-lg text-xs font-diablo transition-all cursor-pointer ${
                tierView === 'bis'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              {t('🏆 頂規畢業', '🏆 Best in Slot')}
            </button>
          </div>
        </div>
      </div>

      {/* 矩陣清單本體 */}
      {filteredData.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-sanctuary-900/50 border border-sanctuary-800 text-sanctuary-400 space-y-2">
          <p className="text-base font-diablo text-sanctuary-300">
            {t('找不到符合條件的流派搭配', 'No matching builds found')}
          </p>
          <p className="text-xs text-sanctuary-400">
            {t('請嘗試更換搜尋關鍵字，或切換至其他職業分類標籤。', 'Try another search term or switch hero classes.')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredData.map((entry) => {
            const classBadge = CLASS_BADGES.find((b) => b.code === entry.classCode);

            return (
              <div
                key={entry.id}
                className="rounded-2xl bg-sanctuary-900/90 border border-sanctuary-800 p-5 shadow-xl transition-all hover:border-sanctuary-700"
              >
                {/* 流派標題與核心分析 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-sanctuary-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-bold border ${classBadge?.bg} ${classBadge?.color} ${classBadge?.border}`}
                      >
                        {t(entry.classZh, entry.classEn)}
                      </span>
                      <h3 className="text-lg font-bold font-diablo text-sanctuary-100">
                        {entry.buildName}
                      </h3>
                      <span className="text-xs text-sanctuary-400">
                        ({entry.role})
                      </span>
                    </div>
                    {/* 痛點與最佳解 */}
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-start gap-1.5 text-sanctuary-300 bg-sanctuary-950/70 p-2 rounded-lg border border-sanctuary-800/80">
                        <span className="text-rose-400 font-bold shrink-0">
                          {t('◆ 流派痛點：', '◆ Core Need: ')}
                        </span>
                        <span className="leading-relaxed">{entry.coreProblem}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-sanctuary-300 bg-sanctuary-950/70 p-2 rounded-lg border border-sanctuary-800/80">
                        <span className="text-d2-unique font-bold shrink-0">
                          {t('★ 推薦傭兵：', '★ Best Merc: ')}
                        </span>
                        <span className="leading-relaxed">{entry.bestMercSummary}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 梯次卡片網格 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {tierView === 'all' ? (
                    <>
                      {renderTierCard(entry, 'start')}
                      {renderTierCard(entry, 'mf')}
                      {renderTierCard(entry, 'bis')}
                    </>
                  ) : (
                    <div className="col-span-full">
                      {renderTierCard(entry, tierView)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
