import React, { useEffect, useMemo, useState } from 'react';
import { Landmark, Search, Sparkles, Clock, Flame, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { SHRINES, SHRINE_TYPES, SHRINE_TYPE_ZH, durationSeconds, shrineSummary, shrineSummaryEn, shrineMsgEn, type Shrine, type ShrineType } from '../../data/codex/shrines';
import { getShrineVisual } from '../../utils/shrineImages';

const TYPE_TONE: Record<ShrineType, string> = {
  Recharge: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
  Booster: 'text-d2-gold border-d2-gold/40 bg-d2-gold/10',
  Magic: 'text-d2-magic border-d2-magic/40 bg-d2-magic/10',
};

const Fact: React.FC<{ k: string; v: React.ReactNode; title?: string }> = ({ k, v, title }) => (
  <div className="flex items-baseline justify-between gap-2 text-xs" title={title}>
    <span className="text-sanctuary-500">{k}</span>
    <span className="font-mono text-sanctuary-200 text-right">{v}</span>
  </div>
);

const ShrineCard: React.FC<{ s: Shrine }> = ({ s }) => {
  const { isEn } = useLanguage();
  const sec = durationSeconds(s);
  const args = [s.arg0, s.arg1].filter((v) => v !== undefined);
  const visual = getShrineVisual(s.code);
  const isHighValue = s.code === 15 || s.code === 18 || s.code === 12 || s.code === 7;

  return (
    <div
      className={`rounded-2xl border bg-sanctuary-900/40 p-4 space-y-3 transition-all hover:border-sanctuary-700/80 group ${
        s.unused
          ? 'border-sanctuary-800/60 opacity-80'
          : isHighValue
          ? 'border-sanctuary-700/90 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(200,165,100,0.15)]'
          : 'border-sanctuary-800/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Shrine Visual Icon Box */}
          <div
            className={`relative w-12 h-12 rounded-xl shrink-0 border flex items-center justify-center p-1.5 overflow-hidden transition-transform group-hover:scale-105 ${visual.glowColor}`}
          >
            <img
              src={visual.icon}
              alt=""
              className="w-8 h-8 object-contain drop-shadow"
              loading="lazy"
            />
          </div>

          <div className="min-w-0">
            <h3 className={`font-bold transition-colors ${visual.accentColor}`}>
              {isEn && s.nameEn ? s.nameEn : s.name}
            </h3>
            <div className="text-[11px] font-mono text-sanctuary-500">
              {!isEn && s.nameEn && <>{s.nameEn}　·　</>}{isEn ? 'Code' : '編號'} {s.code}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${TYPE_TONE[s.type]}`}>
            {isEn ? s.type : SHRINE_TYPE_ZH[s.type]}
          </span>
          {isHighValue && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-d2-gold/50 text-d2-gold bg-d2-gold/10 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              {isEn ? 'High Priority' : '首選必踩'}
            </span>
          )}
          {s.unused && (
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-d2-fire/40 text-d2-fire bg-d2-fire/10"
              title="資料表的效果文字標示「Not Used」"
            >
              {isEn ? 'Unused in Data' : '資料表標示未使用'}
            </span>
          )}
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-sanctuary-950/60 border border-sanctuary-800/60">
        <p className="text-sm text-sanctuary-100 font-medium leading-relaxed">
          {isEn ? shrineSummaryEn(s) : shrineSummary(s)}
          {sec !== undefined && (
            <span className="text-d2-gold font-mono font-bold inline-flex items-center gap-1 ml-1.5">
              <Clock className="w-3 h-3 inline" />
              {isEn ? `${sec}s` : `持續 ${sec} 秒`}
            </span>
          )}
        </p>
      </div>

      {(isEn ? shrineMsgEn(s) : s.msg) && (
        <p className="text-[11px] text-sanctuary-400 italic">
          {isEn ? `Prompt: "${shrineMsgEn(s)}"` : `觸發提示：「${s.msg}」`}
        </p>
      )}

      <div className="border-t border-sanctuary-800/70 pt-2 space-y-1">
        <Fact
          k={isEn ? 'Min Area Level' : '最低場景等級'}
          v={s.levelMin}
          title="資料表 LevelMin 欄，視為這種聖壇出現的最低場景等級"
        />
        {s.reset !== undefined && (
          <Fact
            k={isEn ? 'Reset Time' : '重置時間'}
            v={isEn ? `${s.reset} mins` : `${s.reset} 分鐘`}
            title="資料表 reset time in minutes 欄"
          />
        )}
        {s.type !== 'Booster' && s.frames !== undefined && (
          <Fact
            k={isEn ? 'Duration Frames (Raw)' : '持續影格（原值）'}
            v={s.frames}
            title={isEn ? 'Duration in frames column' : '資料表 Duration in frames 欄；這個類型的用途沒有驗證'}
          />
        )}
        {args.length > 0 && (
          <Fact
            k={isEn ? 'Table Parameters' : '資料表參數'}
            v={args.join(isEn ? ', ' : '、')}
            title="Arg0 / Arg1"
          />
        )}
        <Fact
          k={isEn ? 'Rarity (Raw)' : '稀有度欄（原值）'}
          v={s.rarity}
          title={isEn ? 'Rarity column from table' : '資料表 rarity 欄；數值與出現機率的關係沒有驗證'}
        />
      </div>

      <p className="text-[11px] font-mono text-sanctuary-600 leading-snug">{s.effect}</p>
    </div>
  );
};

export const ShrineCompendium: React.FC<{ initialQuery?: string }> = ({ initialQuery }) => {
  const { t, isEn } = useLanguage();
  const [type, setType] = useState<ShrineType | 'all'>('all');
  const [q, setQ] = useState(initialQuery ?? '');

  // 從全域搜尋點進來時帶入聖壇名稱（同一頁再搜一次也要更新）
  useEffect(() => {
    if (initialQuery !== undefined) setQ(initialQuery);
  }, [initialQuery]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return SHRINES.filter(
      (s) =>
        (type === 'all' || s.type === type) &&
        (!term ||
          s.name.toLowerCase().includes(term) ||
          s.nameEn.toLowerCase().includes(term) ||
          shrineSummary(s).toLowerCase().includes(term))
    );
  }, [type, q]);

  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = env.endsWith('/') ? env : `${env}/`;
  const imgShrinePillar = `${baseUrl}images/shrines/shrine.gif`;
  const imgWell = `${baseUrl}images/shrines/well.gif`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <PageHeader
        icon={<Landmark className="w-7 h-7" />}
        title={t('聖壇圖鑑', 'Shrines Compendium')}
        tone="text-d2-gold"
        desc={t(
          '場景裡的聖壇（Shrine）：每種聖壇的效果、增益持續時間、重置時間與出現的最低場景等級。資料來自遊戲資料表。',
          'Effects, buff durations, reset timers, and minimum area levels for all Shrines.'
        )}
      />

      {/* 原版聖壇與機制圖解橫幅 */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sanctuary-950 via-sanctuary-900 to-sanctuary-950 border border-sanctuary-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-14 h-16 rounded-2xl bg-sanctuary-950/90 border border-d2-gold/30 flex items-center justify-center p-1 shadow-inner">
              <img src={imgShrinePillar} alt="Shrine" className="h-12 w-auto object-contain" />
            </div>
            <div className="w-14 h-16 rounded-2xl bg-sanctuary-950/90 border border-blue-500/30 flex items-center justify-center p-1 shadow-inner">
              <img src={imgWell} alt="Well" className="h-12 w-auto object-contain" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-sanctuary-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-d2-fire" />
              <span>{isEn ? 'Shrine Mechanics & Heritage' : '聖休亞瑞聖壇與神聖之井法則'}</span>
            </div>
            <p className="text-xs text-sanctuary-400 max-w-2xl leading-relaxed">
              {isEn
                ? 'Pillars and Wells scatter across Sanctuary. Booster shrines confer powerful buffs (up to +50% XP, +2 Skills, +200% DMG), while Gem Shrines randomly upgrade a gem in your inventory (ideal for creating a Perfect Gem directly).'
                : '漫遊於荒野與地牢的石柱與水井。增益類聖壇能賦予強大光環（如 +50% 經驗、+2 全技能、+200% 傷害）；寶石聖壇更會隨機將背包內的一顆寶石升級一階（拓荒直升完美寶石必備神器）。'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs">
          <div className="px-3 py-2 rounded-xl bg-sanctuary-950/70 border border-sanctuary-800 text-center">
            <div className="text-sanctuary-400 text-[10px]">{isEn ? 'Total Types' : '總聖壇數'}</div>
            <div className="text-d2-gold font-bold font-mono text-sm">22 {isEn ? 'Types' : '種'}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-sanctuary-950/70 border border-sanctuary-800 text-center">
            <div className="text-sanctuary-400 text-[10px]">{isEn ? 'Buff Overwrite' : '增益覆蓋'}</div>
            <div className="text-sanctuary-200 font-bold text-xs flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? 'Single Buff' : '單一光環'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="聖壇類型">
          {(['all', ...SHRINE_TYPES] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setType(k)}
              aria-pressed={type === k}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                type === k
                  ? 'bg-d2-gold text-sanctuary-950 font-bold shadow'
                  : 'bg-sanctuary-950/80 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'
              }`}
            >
              {k === 'all' ? (isEn ? 'All' : '全部') : isEn ? k : SHRINE_TYPE_ZH[k]}
            </button>
          ))}
        </div>
        <div className="relative flex-1 md:max-w-sm">
          <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('搜尋聖壇名稱或效果…', 'Search shrine name or effect...')}
            aria-label="搜尋聖壇"
            className="w-full pl-9 pr-3 py-2 bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-gold/50"
          />
        </div>
        <span className="md:ml-auto text-xs text-sanctuary-500 font-mono">
          {isEn ? `${list.length} / ${SHRINES.length} shrines` : `${list.length} / ${SHRINES.length} 種`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" aria-label="聖壇清單">
        {list.map((s) => (
          <ShrineCard key={s.code} s={s} />
        ))}
        {list.length === 0 && (
          <div className="text-sm text-sanctuary-500 py-8 text-center md:col-span-2 xl:col-span-3">
            {isEn ? 'No shrines match criteria' : '沒有符合條件的聖壇'}
          </div>
        )}
      </div>

      <div className="text-[11px] text-sanctuary-600 space-y-1">
        <p>
          {isEn
            ? "Data sourced from shrines.txt and shrines.json (3.3.93847). The game runs at 25 fps; buff duration in seconds = frames / 25. Effects, defense, resistance, skill levels, and experience values are extracted directly from game data tables."
            : "資料來自遊戲 shrines.txt 與 shrines.json（3.3.93847）。遊戲每秒 25 影格，增益的持續秒數＝資料表持續影格 ÷ 25。效果說明是依資料表的英文效果與參數整理；防禦、抗性、技能、經驗等數值取自資料表參數，沒有在遊戲內逐項核對。"}
        </p>
        <p>
          {isEn
            ? "Excluded: Exact spawn locations across areas and actual spawn chances (rarity column reflects raw table values)."
            : "未納入：聖壇出現在哪些場景與實際出現機率（資料表的稀有度欄只列原值）。"}
        </p>
      </div>
    </div>
  );
};
