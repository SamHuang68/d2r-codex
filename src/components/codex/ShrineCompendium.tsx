import React, { useEffect, useMemo, useState } from 'react';
import { Landmark, Search } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { SHRINES, SHRINE_TYPES, SHRINE_TYPE_ZH, durationSeconds, shrineSummary, type Shrine, type ShrineType } from '../../data/codex/shrines';

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
  const sec = durationSeconds(s);
  const args = [s.arg0, s.arg1].filter((v) => v !== undefined);
  return (
    <div className={`rounded-2xl border bg-sanctuary-900/40 p-4 space-y-2.5 ${s.unused ? 'border-sanctuary-800/60 opacity-80' : 'border-sanctuary-800/80'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-sanctuary-100">{s.name}</h3>
          <div className="text-[11px] font-mono text-sanctuary-500">{s.nameEn}　·　編號 {s.code}</div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${TYPE_TONE[s.type]}`}>{SHRINE_TYPE_ZH[s.type]}</span>
          {s.unused && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-d2-fire/40 text-d2-fire bg-d2-fire/10" title="資料表的效果文字標示「Not Used」">資料表標示未使用</span>}
        </div>
      </div>
      <p className="text-sm text-sanctuary-100">{shrineSummary(s)}{sec !== undefined && <span className="text-d2-gold">　持續 {sec} 秒</span>}</p>
      {s.msg && <p className="text-[11px] text-sanctuary-500">觸發時的提示：「{s.msg}」</p>}
      <div className="border-t border-sanctuary-800/70 pt-2 space-y-1">
        <Fact k="最低場景等級" v={s.levelMin} title="資料表 LevelMin 欄，視為這種聖壇出現的最低場景等級" />
        {s.reset !== undefined && <Fact k="重置時間" v={`${s.reset} 分鐘`} title="資料表 reset time in minutes 欄" />}
        {s.type !== 'Booster' && s.frames !== undefined && <Fact k="持續影格（原值）" v={s.frames} title="資料表 Duration in frames 欄；這個類型的用途沒有驗證" />}
        {args.length > 0 && <Fact k="資料表參數" v={args.join('、')} title="資料表 Arg0、Arg1 欄" />}
        <Fact k="稀有度欄（原值）" v={s.rarity} title="資料表 rarity 欄；數值與出現機率的關係沒有驗證" />
      </div>
      <p className="text-[11px] font-mono text-sanctuary-600 leading-snug">{s.effect}</p>
    </div>
  );
};

export const ShrineCompendium: React.FC<{ initialQuery?: string }> = ({ initialQuery }) => {
  const [type, setType] = useState<ShrineType | 'all'>('all');
  const [q, setQ] = useState(initialQuery ?? '');
  // 從全域搜尋點進來時帶入聖壇名稱（同一頁再搜一次也要更新）
  useEffect(() => { if (initialQuery !== undefined) setQ(initialQuery); }, [initialQuery]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return SHRINES.filter((s) => (type === 'all' || s.type === type) && (!t || s.name.toLowerCase().includes(t) || s.nameEn.toLowerCase().includes(t) || shrineSummary(s).toLowerCase().includes(t)));
  }, [type, q]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <PageHeader
        icon={<Landmark className="w-7 h-7" />}
        title="聖壇圖鑑"
        tone="text-d2-gold"
        desc="場景裡的聖壇（Shrine，簡體常稱神龕）：每種聖壇的效果、增益持續時間、重置時間與出現的最低場景等級。資料來自遊戲資料表，繁中名稱與提示語是遊戲內的字串。"
      />
      <div className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="聖壇類型">
          {(['all', ...SHRINE_TYPES] as const).map((k) => (
            <button key={k} type="button" onClick={() => setType(k)} aria-pressed={type === k}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${type === k ? 'bg-d2-gold text-sanctuary-950 font-bold shadow' : 'bg-sanctuary-950/80 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'}`}>
              {k === 'all' ? '全部' : SHRINE_TYPE_ZH[k]}
            </button>
          ))}
        </div>
        <div className="relative flex-1 md:max-w-sm">
          <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜尋聖壇名稱或效果…" aria-label="搜尋聖壇"
            className="w-full pl-9 pr-3 py-2 bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-gold/50" />
        </div>
        <span className="md:ml-auto text-xs text-sanctuary-500">{list.length} / {SHRINES.length} 種</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" aria-label="聖壇清單">
        {list.map((s) => <ShrineCard key={s.code} s={s} />)}
        {list.length === 0 && <div className="text-sm text-sanctuary-500 py-8 text-center md:col-span-2 xl:col-span-3">沒有符合條件的聖壇</div>}
      </div>
      <div className="text-[11px] text-sanctuary-600 space-y-1">
        <p>資料來自遊戲 shrines.txt 與 shrines.json（3.3.93847）。遊戲每秒 25 影格，增益的持續秒數＝資料表持續影格 ÷ 25。效果說明是依資料表的英文效果與參數整理；防禦、抗性、技能、經驗等數值取自資料表參數，沒有在遊戲內逐項核對。</p>
        <p>未納入：聖壇出現在哪些場景與實際出現機率（資料表的稀有度欄只列原值）。</p>
      </div>
    </div>
  );
};
