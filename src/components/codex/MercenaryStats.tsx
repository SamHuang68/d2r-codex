import React, { useMemo, useState } from 'react';
import { Database } from 'lucide-react';
import { DIFFICULTY_ZH, HIRELINGS, MERC_MAX_LEVEL, clampMercLevel, hirelingMinLevel, mercBaseAt } from '../../engine/mercenary';
import { skillEffectText } from '../../engine/skillEffects';
import { auraEffects, skillByName } from '../../engine/skills';

/**
 * 傭兵資料表數值（hireling.txt）：每個難度雇得到哪些類型、傭兵等級對應的生命／防禦／命中／抗性／傷害與技能。
 * 與配裝模擬的傭兵分頁用同一份資料與外推規則（engine/mercenary.ts），這裡只列傭兵本身（不含裝備）。
 */
const DIFFS = [1, 2, 3] as const;
const inputCls = 'bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-100 font-mono focus:outline-none focus:border-d2-fire/50';

/** 資料表和頁面上方敘述不同之處（依據在 scripts/test_engine.mjs 的傭兵測試裡逐項驗證）；沒有列的幕沒有發現差異 */
const NOTES: Record<number, string> = {
  2: '資料表的難度分法與上方「原生技能與光環靈氣」的敘述不同：普通只有祈禱、反抗、精準祝福三種；惡夢與地獄都雇得到六種（祈禱、反抗、精準祝福、荊棘、神聖冰凍、力量）。上方敘述尚未更正。',
  3: '資料表的冰寒型技能是冰川之槍、寒冰甲、寒冰球，沒有暴風雪，與上方敘述不同。上方敘述尚未更正。',
};

export const MercenaryStats: React.FC<{ act: number }> = ({ act }) => {
  const types = useMemo(() => HIRELINGS.filter((h) => h.act === act), [act]);
  const [diff, setDiff] = useState<1 | 2 | 3>(3);
  const [kindId, setKindId] = useState<number | null>(null);
  const [levelText, setLevelText] = useState('85');

  const inDiff = types.filter((h) => h.difficulty === diff);
  const h = inDiff.find((x) => x.id === kindId) ?? inDiff[0];
  const minLv = h ? hirelingMinLevel(h) : 1;
  const level = h ? clampMercLevel(h, /^\d+$/.test(levelText.trim()) ? Number(levelText.trim()) : 85) : 1;
  const base = h ? mercBaseAt(h, level) : undefined;

  if (!h || !base) return null;
  return (
    <section aria-label="傭兵資料表數值" className="space-y-4">
      <div className="flex items-center gap-2">
        <Database className="w-5 h-5 text-d2-fire" />
        <h3 className="text-xl font-diablo font-bold text-sanctuary-100">資料表數值（hireling.txt）</h3>
      </div>
      <div className="bg-sanctuary-900/40 border border-sanctuary-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1" role="group" aria-label="難度">
            {DIFFS.map((d) => (
              <button key={d} type="button" aria-pressed={diff === d} disabled={!types.some((x) => x.difficulty === d)}
                onClick={() => { setDiff(d); setKindId(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${diff === d ? 'bg-d2-fire text-sanctuary-950 font-bold shadow' : 'bg-sanctuary-950/80 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'}`}>
                {DIFFICULTY_ZH[d]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="傭兵類型">
            {inDiff.map((x) => (
              <button key={x.id} type="button" aria-pressed={x.id === h.id} onClick={() => setKindId(x.id)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${x.id === h.id ? 'bg-sanctuary-700 text-sanctuary-50 font-bold border border-d2-fire/60' : 'bg-sanctuary-950/80 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'}`}>
                {x.desc}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-xs text-sanctuary-300 md:ml-auto">
            傭兵等級
            <input type="text" inputMode="numeric" value={levelText} onChange={(e) => setLevelText(e.target.value)} aria-label="傭兵等級" className={`${inputCls} w-20`} />
            <span className="text-sanctuary-500">（{minLv}–{MERC_MAX_LEVEL}）</span>
          </label>
        </div>

        <div className="text-xs text-sanctuary-400">第 {h.act} 幕 {h.typeZh}・{h.desc}・{DIFFICULTY_ZH[h.difficulty]}　目前 <span className="text-sanctuary-100 font-mono">{level}</span> 級</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm" aria-label="傭兵基礎數值">
          {[
            ['生命', base.life.toLocaleString()], ['防禦', base.defense.toLocaleString()], ['命中（AR）', base.ar.toLocaleString()],
            ['力量／敏捷', `${base.str} / ${base.dex}`], ['傭兵本身傷害', `${base.damage.min}–${base.damage.max}`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-xl border border-sanctuary-800/80 bg-sanctuary-950/60 px-3 py-2"><span className="text-sanctuary-400">{k}</span><span className="font-mono text-sanctuary-100">{v}</span></div>
          ))}
          <div className="flex items-center justify-between rounded-xl border border-sanctuary-800/80 bg-sanctuary-950/60 px-3 py-2">
            <span className="text-sanctuary-400">抗性</span>
            <span className="font-mono"><span className="text-d2-fire">{base.resist.fire}</span> / <span className="text-d2-cold">{base.resist.cold}</span> / <span className="text-d2-lightning">{base.resist.lightning}</span> / <span className="text-d2-poison">{base.resist.poison}</span></span>
          </div>
        </div>

        <div className="space-y-1.5" aria-label="傭兵技能">
          <div className="text-xs font-mono font-bold text-sanctuary-400">技能與光環（{level} 級）</div>
          {base.skills.map((s) => {
            const sk = s.mode === 1 ? skillByName(s.nameEn) : undefined;
            const lines = sk?.auraStats ? auraEffects(sk, s.level) : [];
            return (
              <div key={s.nameEn} className="flex items-start justify-between gap-3 rounded-xl border border-sanctuary-800/80 bg-sanctuary-950/60 px-3 py-2 text-xs">
                <span><span className="text-d2-gold font-bold">{s.name}</span><span className="text-sanctuary-500 ml-2 font-mono">Lv {s.level}{s.mode === 1 ? '　光環' : s.mode === 14 ? '　普通攻擊' : ''}</span></span>
                <span className="text-right text-sanctuary-400">
                  {s.mode === 1
                    ? lines.map((l, i) => <span key={i} className={`block ${l.supported ? 'text-d2-magic' : 'text-sanctuary-500'}`}>{l.supported && l.value !== undefined ? (skillEffectText(l.stat, l.value, level) ?? `${l.stat} ${l.value}`) : `${l.stat}（公式未支援）`}</span>)
                    : s.mode === 14 ? null : `施放機率 ${s.chance}%`}
                </span>
              </div>
            );
          })}
        </div>

        {NOTES[act] && <div className="text-xs text-d2-gold bg-sanctuary-950/70 border border-d2-gold/30 rounded-xl p-3 leading-relaxed">{NOTES[act]}</div>}

        <div className="overflow-x-auto" aria-label="各難度雇得到的類型">
          <table className="text-xs w-full min-w-[420px]">
            <thead><tr className="text-sanctuary-500 font-mono"><th className="text-left font-normal pb-1 pr-3">難度</th><th className="text-left font-normal pb-1">雇得到的類型（最低傭兵等級）</th></tr></thead>
            <tbody>
              {DIFFS.map((d) => (
                <tr key={d} className="border-t border-sanctuary-800/60 align-top">
                  <td className="py-1.5 pr-3 text-sanctuary-300 whitespace-nowrap">{DIFFICULTY_ZH[d]}</td>
                  <td className="py-1.5 text-sanctuary-200">{types.filter((x) => x.difficulty === d).map((x) => `${x.desc}（${hirelingMinLevel(x)}）`).join('、') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-sanctuary-600">傭兵數值來自遊戲資料表 hireling.txt（3.3.93847），傭兵等級落在檢查點之間時以最近的下方檢查點外推，與配裝模擬的傭兵分頁相同；不含裝備，沒有在遊戲內逐項核對。傭兵等級不能低於該類型雇得到的最低等級。</p>
      </div>
    </section>
  );
};
