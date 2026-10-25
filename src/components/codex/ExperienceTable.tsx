import React, { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { EXP, MAX_LEVEL, expBetween, expForLevel, expToReach, fmtExp, progressOf } from '../../data/codex/experience';

const inputCls = 'bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-100 font-mono focus:outline-none focus:border-d2-gold/50';
const clampLevel = (v: string, lo: number, hi: number, dflt: number): number => (/^\d+$/.test(v.trim()) ? Math.min(hi, Math.max(lo, Number(v.trim()))) : dflt);
const KEY_LEVELS = [30, 45, 60, 75, 85, 90, 95, 98, 99];

const RangeCalculator: React.FC = () => {
  const { isEn } = useLanguage();
  const [from, setFrom] = useState('85');
  const [to, setTo] = useState('90');
  const f = clampLevel(from, 1, MAX_LEVEL - 1, 85);
  const t = clampLevel(to, 2, MAX_LEVEL, 90);
  const need = expBetween(f, t);
  return (
    <section aria-label="升級計算" className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 space-y-3">
      <h3 className="font-bold text-sanctuary-100">{isEn ? "Level Range XP Calculator" : "從幾級升到幾級"}</h3>
      <div className="flex flex-wrap items-center gap-2 text-xs text-sanctuary-300">
        從 <input type="text" inputMode="numeric" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="起始等級" className={`${inputCls} w-20`} />
        級升到 <input type="text" inputMode="numeric" value={to} onChange={(e) => setTo(e.target.value)} aria-label="目標等級" className={`${inputCls} w-20`} /> 級
      </div>
      <div className="text-sm text-sanctuary-100">
        {t > f ? <>需要 <b className="text-d2-gold font-mono">{fmtExp(need)}</b> 經驗（升到 {t} 級的累計 {fmtExp(expToReach(t))} − {f} 級的累計 {fmtExp(expToReach(f))}）</> : <span className="text-sanctuary-500">目標等級要比起始等級高</span>}
      </div>
    </section>
  );
};

const ProgressCalculator: React.FC = () => {
  const { isEn } = useLanguage();
  const [xpText, setXpText] = useState('');
  const xp = /^[\d,]+$/.test(xpText.trim()) ? Math.min(Number(xpText.trim().replace(/,/g, '')), Number.MAX_SAFE_INTEGER) : undefined;
  const p = xp !== undefined ? progressOf(xp) : undefined;
  return (
    <section aria-label="經驗進度" className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 space-y-3">
      <h3 className="font-bold text-sanctuary-100">{isEn ? "XP to Level & Progress Calculator" : "由目前經驗算等級與進度"}</h3>
      <label className="flex flex-wrap items-center gap-2 text-xs text-sanctuary-300">
        目前累計經驗
        <input type="text" inputMode="numeric" value={xpText} onChange={(e) => setXpText(e.target.value)} placeholder={isEn ? "e.g. 1,234,567,890" : "例如 1,234,567,890"} aria-label="目前累計經驗" className={`${inputCls} w-52`} />
      </label>
      {p ? (
        <div className="text-sm text-sanctuary-100 space-y-1">
          <div>目前 <b className="text-d2-gold font-mono">{p.level}</b> 級{p.level < MAX_LEVEL ? <>，到下一級完成 <b className="font-mono">{(p.fraction * 100).toFixed(2)}%</b>，還差 <b className="font-mono">{fmtExp(p.remaining)}</b></> : '（滿級）'}</div>
          {p.level < MAX_LEVEL && <div className="text-xs text-sanctuary-400">距離 {MAX_LEVEL} 級還差 <span className="font-mono">{fmtExp(p.toMax)}</span> 經驗</div>}
        </div>
      ) : <div className="text-xs text-sanctuary-500">輸入遊戲角色資訊裡的累計經驗（Experience）。</div>}
    </section>
  );
};

export const ExperienceTable: React.FC = () => {
  const { t, isEn } = useLanguage();
  const total = EXP[MAX_LEVEL];
  const rows = useMemo(() => Array.from({ length: MAX_LEVEL }, (_, i) => {
    const level = i + 1; const need = expForLevel(level);
    return { level, total: EXP[level], need, ratio: level > 1 ? need / expForLevel(level - 1) : undefined, share: EXP[level] / total };
  }), [total]);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <PageHeader
        icon={<TrendingUp className="w-7 h-7" />}
        title={t('經驗值表', 'Experience Table')}
        tone="text-d2-gold"
        desc={t('1 到 99 級每一級需要的累計經驗與單級經驗，以及升級計算。八個職業的經驗表完全相同。資料來自遊戲資料表。', 'Experience curve from Level 1 to 99, cumulative XP, XP per level, and level calculators for all 8 classes.')}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" aria-label="重點數字">
        <div className="rounded-xl border border-sanctuary-800 bg-sanctuary-900/40 p-3"><div className="text-[11px] text-sanctuary-500">{isEn ? 'Total XP to Level 99' : '升到 99 級的累計經驗'}</div><div className="font-mono text-sanctuary-100 text-sm">{fmtExp(total)}</div></div>
        <div className="rounded-xl border border-sanctuary-800 bg-sanctuary-900/40 p-3"><div className="text-[11px] text-sanctuary-500">{isEn ? 'Level 98 → 99 Required' : '98 → 99 級需要'}</div><div className="font-mono text-sanctuary-100 text-sm">{fmtExp(expForLevel(99))}</div></div>
        <div className="rounded-xl border border-sanctuary-800 bg-sanctuary-900/40 p-3"><div className="text-[11px] text-sanctuary-500">{isEn ? 'Level 90 Share of Max' : '升到 90 級占 99 級累計'}</div><div className="font-mono text-sanctuary-100 text-sm">{((EXP[90] / total) * 100).toFixed(2)}%</div></div>
        <div className="rounded-xl border border-sanctuary-800 bg-sanctuary-900/40 p-3"><div className="text-[11px] text-sanctuary-500">{isEn ? 'Level 85 Share of Max' : '升到 85 級占 99 級累計'}</div><div className="font-mono text-sanctuary-100 text-sm">{((EXP[85] / total) * 100).toFixed(2)}%</div></div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <RangeCalculator />
        <ProgressCalculator />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap text-xs" aria-label="快速跳到等級">
        <span className="text-sanctuary-500 font-mono">{isEn ? 'Jump to:' : '快速跳到：'}</span>
        {KEY_LEVELS.map((l) => (
          <button key={l} type="button" onClick={() => document.getElementById(`exp-lv-${l}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })}
            className="px-2.5 py-1 rounded-lg border border-sanctuary-800 bg-sanctuary-950/60 text-sanctuary-300 hover:text-sanctuary-100">{isEn ? `Lv ${l}` : `${l} 級`}</button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-sanctuary-800">
        <table className="w-full text-xs min-w-[560px]">
          <thead className="bg-sanctuary-900 text-sanctuary-400 font-mono">
            <tr><th className="text-right px-3 py-2 font-normal">{isEn ? 'Level' : '等級'}</th><th className="text-right px-3 py-2 font-normal">{isEn ? 'Total XP' : '累計經驗'}</th><th className="text-right px-3 py-2 font-normal">{isEn ? 'XP Needed' : '本級所需'}</th><th className="text-right px-3 py-2 font-normal" title="本級所需 ÷ 上一級所需">{isEn ? 'Ratio' : '倍率'}</th><th className="text-right px-3 py-2 font-normal">{isEn ? '% of Max' : '占 99 級累計'}</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.level} id={`exp-lv-${r.level}`} className={`border-t border-sanctuary-800/60 ${KEY_LEVELS.includes(r.level) ? 'bg-sanctuary-900/50' : ''}`}>
                <td className="text-right px-3 py-1 font-mono text-sanctuary-100">{r.level}</td>
                <td className="text-right px-3 py-1 font-mono text-sanctuary-200">{fmtExp(r.total)}</td>
                <td className="text-right px-3 py-1 font-mono text-sanctuary-300">{fmtExp(r.need)}</td>
                <td className="text-right px-3 py-1 font-mono text-sanctuary-400">{r.ratio === undefined ? '—' : `×${r.ratio.toFixed(2)}`}</td>
                <td className="text-right px-3 py-1 font-mono text-sanctuary-400">{(r.share * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[11px] text-sanctuary-600 space-y-1">
        <p>資料來自遊戲 experience.txt（3.3.93847）。「累計經驗」是升到該等級需要的總經驗，「本級所需」是從上一級升到該級要再累積的經驗。</p>
        <p>未納入：怪物與角色的等級差造成的經驗修正、組隊分配、死亡懲罰；資料表的 ExpRatio 欄用途未驗證，沒有收錄。</p>
      </div>
    </div>
  );
};
