import React, { useMemo, useState } from 'react';
import { GameIcon } from '../common/GameIcons';
import { PageHeader } from '../common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { AREAS, DIFF_ZH, ELEMS, ELEM_ZH, areaImmunity, type Diff, type ElemKey } from '../../data/codex/monsters';
import { lateLevelFactor, levelingRows } from '../../engine/leveling';
import { AreaImmunityChips } from './AreaImmunityChips';
import { DIFF_EN, ELEM_EN } from './monsterLabels';

const MAX_CLVL = 98;
const KEY_LEVELS = [1, 12, 24, 30, 45, 60, 75, 85, 90, 95];
const inputCls = 'bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-100 font-mono focus:outline-none focus:border-d2-gold/50';
const clampLevel = (v: string): number => (/^\d+$/.test(v.trim()) ? Math.min(MAX_CLVL, Math.max(1, Number(v.trim()))) : 1);
const pct = (r: number): string => `${Math.round(r * 100)}%`;
const btnCls = (on: boolean): string => `px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${on ? 'bg-d2-gold text-sanctuary-950 font-bold border-d2-gold' : 'text-sanctuary-300 border-sanctuary-800 hover:text-sanctuary-100 hover:bg-sanctuary-800/50'}`;

export const LevelingScenes: React.FC = () => {
  const { isEn, t } = useLanguage();
  const [lvText, setLvText] = useState('60');
  const [diff, setDiff] = useState<Diff>(1);
  const [elem, setElem] = useState<ElemKey | 'any'>('any');
  const [showAll, setShowAll] = useState(false);
  const clvl = clampLevel(lvText);
  const late = lateLevelFactor(clvl);

  const rows = useMemo(() => {
    const all = levelingRows(AREAS, clvl, diff);
    if (elem === 'any') return all;
    // 倍率相同時，選的元素有免疫怪物的場景排後面
    const bad = (r: (typeof all)[number]) => areaImmunity(r.area, diff).immuneCount[elem];
    return [...all].sort((a, b) => b.ratio - a.ratio || bad(a) - bad(b) || a.area.id - b.area.id);
  }, [clvl, diff, elem]);
  const full = rows.filter((r) => r.ratio >= 1);
  const partial = rows.filter((r) => r.ratio < 1);
  const shownPartial = showAll ? partial : partial.slice(0, 8);

  const overview = useMemo(() => KEY_LEVELS.map((lv) => ({ lv, counts: ([0, 1, 2] as Diff[]).map((d) => levelingRows(AREAS, lv, d).filter((r) => r.ratio >= 1).length) })), []);
  const diffName = (d: Diff) => (isEn ? DIFF_EN[d] : DIFF_ZH[d]);

  const renderRow = (r: (typeof rows)[number]) => (
    <tr key={r.area.id} className="border-t border-sanctuary-800/60 align-top">
      <td className="py-2 pr-3">
        <div className="text-sanctuary-100 font-medium">{isEn ? r.area.nameEn : (r.area.name ?? r.area.nameEn)}</div>
        <div className="text-[11px] font-mono text-sanctuary-500">{isEn ? `Act ${r.area.act}` : `第 ${r.area.act} 章　${r.area.nameEn}`}</div>
      </td>
      <td className="py-2 pr-3 font-mono text-sanctuary-300 whitespace-nowrap">Lv {r.mlvl}</td>
      <td className={`py-2 pr-3 font-mono whitespace-nowrap ${r.ratio >= 1 ? 'text-emerald-300 font-bold' : r.ratio >= 0.5 ? 'text-d2-gold' : 'text-d2-fire'}`}>{pct(r.ratio)}</td>
      <td className="py-2"><AreaImmunityChips area={r.area} diff={diff} elem={elem} /></td>
    </tr>
  );
  const head = (
    <thead><tr className="text-sanctuary-500 text-[11px] font-mono text-left">
      <th className="font-normal pb-1 pr-3">{t('場景', 'Area')}</th>
      <th className="font-normal pb-1 pr-3">{t('怪物等級', 'Monster Lv')}</th>
      <th className="font-normal pb-1 pr-3">{t('經驗倍率', 'XP Ratio')}</th>
      <th className="font-normal pb-1">{t('免疫（該難度的怪物）', 'Immunities (this difficulty)')}</th>
    </tr></thead>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<GameIcon name="flag" className="w-7 h-7" />}
        title={t('練等場景', 'Leveling Areas')}
        desc={t(
          '輸入角色等級，列出各難度哪些場景的怪物經驗不會被等級差打折，並標出你的主要傷害元素會不會遇到免疫。',
          'Enter your character level to see which areas keep full per-kill XP in each difficulty, and whether your main damage element runs into immune monsters.',
        )}
        tone="text-d2-gold"
      />

      <section aria-label={t('條件', 'Filters')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-sanctuary-300">
          <label className="flex items-center gap-2">{t('角色等級', 'Character level')}
            <input type="text" inputMode="numeric" value={lvText} onChange={(e) => setLvText(e.target.value)} aria-label={t('角色等級（1～98）', 'Character level (1-98)')} className={`${inputCls} w-16 text-center`} />
          </label>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('常用等級', 'Common levels')}>
            {KEY_LEVELS.map((lv) => <button key={lv} type="button" onClick={() => setLvText(String(lv))} className={btnCls(clvl === lv)}>{lv}</button>)}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-sanctuary-300" role="group" aria-label={t('難度', 'Difficulty')}>
          <span className="mr-1">{t('難度', 'Difficulty')}</span>
          {([0, 1, 2] as Diff[]).map((d) => <button key={d} type="button" onClick={() => setDiff(d)} aria-pressed={diff === d} className={btnCls(diff === d)}>{diffName(d)}</button>)}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-sanctuary-300" role="group" aria-label={t('主要傷害元素', 'Main damage element')}>
          <span className="mr-1">{t('主要傷害', 'Main damage')}</span>
          <button type="button" onClick={() => setElem('any')} aria-pressed={elem === 'any'} className={btnCls(elem === 'any')}>{t('不指定', 'Any')}</button>
          {ELEMS.map((e) => <button key={e} type="button" onClick={() => setElem(e)} aria-pressed={elem === e} className={btnCls(elem === e)}>{isEn ? ELEM_EN[e] : ELEM_ZH[e]}</button>)}
        </div>
      </section>

      <section aria-label={t('結果', 'Results')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-4">
        <div className="text-sm text-sanctuary-100">
          {isEn
            ? <>At Lv <b className="text-d2-gold font-mono">{clvl}</b> in {diffName(diff)}: <b className="text-emerald-300 font-mono">{full.length}</b> areas keep full per-kill XP.</>
            : <>{clvl} 級在{diffName(diff)}難度：<b className="text-emerald-300 font-mono">{full.length}</b> 個場景的怪物經驗不被等級差打折。</>}
          {late < 1 && (
            <span className="block text-xs text-sanctuary-400 mt-1">
              {isEn ? `At Lv ${clvl} all XP is further multiplied by ${(late * 100).toFixed(2)}% (same in every area, so it does not change the order).` : `${clvl} 級的所有經驗另外再乘 ${(late * 100).toFixed(2)}%（每個場景都一樣，不影響排序）。`}
            </span>
          )}
        </div>
        {full.length > 0 ? (
          <div className="overflow-x-auto"><table className="w-full text-xs">{head}<tbody>{full.map(renderRow)}</tbody></table></div>
        ) : (
          <p className="text-xs text-sanctuary-400">{t('這個難度沒有場景能拿全額經驗，下面列出倍率最高的幾個。換難度看看。', 'No area in this difficulty gives full XP. The closest ones are listed below; try another difficulty.')}</p>
        )}
        {partial.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-sanctuary-300">{t('經驗被等級差打折的場景（倍率由高到低）', 'Areas with a level-difference penalty (highest ratio first)')}</h3>
            <div className="overflow-x-auto"><table className="w-full text-xs">{head}<tbody>{shownPartial.map(renderRow)}</tbody></table></div>
            {partial.length > 8 && (
              <button type="button" onClick={() => setShowAll(!showAll)} aria-expanded={showAll} className="text-xs text-sanctuary-400 underline">
                {showAll ? t('只看前 8 個', 'Show top 8 only') : (isEn ? `Show all ${partial.length}` : `顯示全部 ${partial.length} 個`)}
              </button>
            )}
          </div>
        )}
      </section>

      <section aria-label={t('各等級速覽', 'Overview by level')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-3">
        <h3 className="font-bold text-sanctuary-100">{t('各等級的全額經驗場景數', 'Full-XP areas by level')}</h3>
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead><tr className="text-sanctuary-500 font-mono text-left">
              <th className="font-normal pb-1 pr-6">{t('角色等級', 'Level')}</th>
              {([0, 1, 2] as Diff[]).map((d) => <th key={d} className="font-normal pb-1 pr-6">{diffName(d)}</th>)}
            </tr></thead>
            <tbody>
              {overview.map(({ lv, counts }) => (
                <tr key={lv} className="border-t border-sanctuary-800/60">
                  <td className="py-1.5 pr-6 font-mono text-sanctuary-200">{lv}</td>
                  {counts.map((n, d) => (
                    <td key={d} className="py-1.5 pr-6">
                      <button type="button" onClick={() => { setLvText(String(lv)); setDiff(d as Diff); }} className={`font-mono underline-offset-2 hover:underline ${n ? 'text-emerald-300' : 'text-sanctuary-600'}`}>{n}</button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-sanctuary-500">{t('點數字會套用該等級與難度。0 代表那個難度沒有場景能拿全額經驗。', 'Click a number to apply that level and difficulty. 0 means no area keeps full XP there.')}</p>
      </section>

      <section aria-label={t('說明與限制', 'Notes and limits')} className="text-[11px] text-sanctuary-500 space-y-1">
        <p>{t(
          '經驗倍率依暴雪 Arreat Summit「Experience」頁的等級差規則計算（怪物比角色低 6～9 級依序為 81／62／43／24%，低 10 級以上 5%；高於角色時 25 級以上為角色等級 ÷ 怪物等級；70 級以上另乘固定折扣）。那是 LoD 時期的官方說明，D2R 3.3 沒有在遊戲內逐項實測。',
          'The ratio follows the level-difference rules on Blizzard\'s Arreat Summit "Experience" page (monsters 6-9 levels below you give 81/62/43/24%, 10+ below 5%; above you at Lv 25+ it is your level / monster level; Lv 70+ gets a further fixed multiplier). That page dates from the LoD era and was not re-measured in-game for D2R 3.3.',
        )}</p>
        <p>{t(
          '場景的怪物等級與怪物清單來自遊戲資料表 levels.txt、monstats.txt，與「怪物圖鑑」同一份資料。',
          'Area monster levels and monster lists come from the game tables levels.txt and monstats.txt, the same data as the Monsters page.',
        )}</p>
        <p>{t(
          '這不是「每小時經驗」：沒有算每隻怪物的基礎經驗、怪物密度、地圖大小與跑圖時間，所以倍率相同的場景不代表練起來一樣快。也不含冠軍與獨特怪的等級加成、首領場景、組隊分配與死亡懲罰。',
          'This is not XP per hour: base XP per monster, monster density, map size and run time are not modelled, so areas with the same ratio are not equally fast. Champion and unique level bonuses, boss areas, party XP splits and death penalties are not included either.',
        )}</p>
      </section>
    </div>
  );
};
