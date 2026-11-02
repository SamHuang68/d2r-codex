import React, { useMemo, useState } from 'react';
import { GameIcon } from '../common/GameIcons';
import { PageHeader } from '../common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { ELEMS, ELEM_ZH, type ElemKey } from '../../data/codex/monsters';
import { BUILD_ELEMENT, farmingRows } from '../../data/codex/farming';
import { BUILDS } from '../../data/simulatorPresets';
import { CLASS_CODES, CLASS_CODE_EN, CLASS_CODE_ZH } from '../../engine/classes';
import { AreaImmunityChips } from './AreaImmunityChips';
import { ELEM_EN } from './monsterLabels';

const btnCls = (on: boolean): string => `px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${on ? 'bg-d2-gold text-sanctuary-950 font-bold border-d2-gold' : 'text-sanctuary-300 border-sanctuary-800 hover:text-sanctuary-100 hover:bg-sanctuary-800/50'}`;
const selectCls = 'bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-100 focus:outline-none focus:border-d2-gold/50 max-w-full';
const MIN_LEVELS = [85, 83, 75];

export const FarmingScenes: React.FC = () => {
  const { isEn, t } = useLanguage();
  const [buildId, setBuildId] = useState('');
  const [elem, setElem] = useState<ElemKey | null>(null);
  const [minLevel, setMinLevel] = useState(85);

  const build = BUILDS.find((b) => b.id === buildId);
  const pickBuild = (id: string) => { setBuildId(id); if (id) setElem(BUILD_ELEMENT[id] ?? null); };
  const buildLabel = (b: (typeof BUILDS)[number]) => (isEn ? `${b.skill.main}` : b.name);
  const elemLabel = (e: ElemKey) => (isEn ? ELEM_EN[e] : ELEM_ZH[e]);

  const rows = useMemo(() => farmingRows(minLevel, elem), [minLevel, elem]);
  const clean = rows.filter((r) => r.immune === 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<GameIcon name="chest" className="w-7 h-7" />}
        title={t('打寶場景', 'Farming Areas')}
        desc={t(
          '選流派或主要傷害元素，列出地獄難度高等級場景裡免疫怪物最少的地方，附上箱子與首領備註。',
          'Pick a build or main damage element to list high-level Hell areas with the fewest immune monsters, with chest and boss notes.',
        )}
        tone="text-d2-gold"
      />

      <section aria-label={t('條件', 'Filters')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-4">
        <label className="flex flex-wrap items-center gap-2 text-xs text-sanctuary-300">
          {t('流派', 'Build')}
          <select value={buildId} onChange={(e) => pickBuild(e.target.value)} aria-label={t('流派', 'Build')} className={selectCls}>
            <option value="">{t('不指定（自選元素）', 'None (pick an element)')}</option>
            {CLASS_CODES.filter((c) => BUILDS.some((b) => b.classCode === c)).map((c) => (
              <optgroup key={c} label={isEn ? CLASS_CODE_EN[c] : CLASS_CODE_ZH[c]}>
                {BUILDS.filter((b) => b.classCode === c).map((b) => <option key={b.id} value={b.id}>{buildLabel(b)}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap items-center gap-2 text-xs text-sanctuary-300" role="group" aria-label={t('主要傷害元素', 'Main damage element')}>
          <span className="mr-1">{t('主要傷害', 'Main damage')}</span>
          <button type="button" onClick={() => setElem(null)} aria-pressed={elem === null} className={btnCls(elem === null)}>{t('不指定', 'Any')}</button>
          {ELEMS.map((e) => <button key={e} type="button" onClick={() => setElem(e)} aria-pressed={elem === e} className={btnCls(elem === e)}>{elemLabel(e)}</button>)}
        </div>
        {build && BUILD_ELEMENT[build.id] === null && (
          <p className="text-[11px] text-sanctuary-400">{t('這個流派的傷害是召喚物或多種元素混合，沒有單一主要元素，請自己選上面的元素。', 'This build deals summoned or mixed damage, so it has no single main element. Pick one above.')}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs text-sanctuary-300" role="group" aria-label={t('場景怪物等級', 'Area monster level')}>
          <span className="mr-1">{t('地獄場景怪物等級', 'Hell area monster level')}</span>
          {MIN_LEVELS.map((lv) => <button key={lv} type="button" onClick={() => setMinLevel(lv)} aria-pressed={minLevel === lv} className={btnCls(minLevel === lv)}>{`≥ ${lv}`}</button>)}
        </div>
      </section>

      <section aria-label={t('結果', 'Results')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-4">
        <div className="text-sm text-sanctuary-100">
          {elem
            ? (isEn
              ? <>{rows.length} Hell areas at Lv ≥ {minLevel}: <b className="text-emerald-300 font-mono">{clean}</b> have no monster immune to {elemLabel(elem)}. Listed from the lowest immune share.</>
              : <>地獄、怪物等級 ≥ {minLevel} 的場景共 {rows.length} 個，其中 <b className="text-emerald-300 font-mono">{clean}</b> 個沒有任何怪物免疫{elemLabel(elem)}。依免疫比例由低到高排列。</>)
            : (isEn ? <>{rows.length} Hell areas at Lv ≥ {minLevel}. Pick an element to rank them by immunity.</> : <>地獄、怪物等級 ≥ {minLevel} 的場景共 {rows.length} 個。選一個元素就會依免疫比例排序。</>)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-sanctuary-500 text-[11px] font-mono text-left">
              <th className="font-normal pb-1 pr-3">{t('場景', 'Area')}</th>
              <th className="font-normal pb-1 pr-3">{t('怪物等級', 'Monster Lv')}</th>
              <th className="font-normal pb-1 pr-3">{t('免疫（地獄怪物）', 'Immunities (Hell monsters)')}</th>
              <th className="font-normal pb-1">{t('箱子與首領', 'Chests & bosses')}</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.area.id} className="border-t border-sanctuary-800/60 align-top">
                  <td className="py-2 pr-3">
                    <div className="text-sanctuary-100 font-medium">{isEn ? r.area.nameEn : (r.area.name ?? r.area.nameEn)}</div>
                    <div className="text-[11px] font-mono text-sanctuary-500">{isEn ? `Act ${r.area.act}` : `第 ${r.area.act} 章　${r.area.nameEn}`}</div>
                  </td>
                  <td className="py-2 pr-3 font-mono text-sanctuary-300 whitespace-nowrap">Lv {r.mlvl}</td>
                  <td className="py-2 pr-3"><AreaImmunityChips area={r.area} diff={2} elem={elem ?? 'any'} /></td>
                  <td className="py-2 text-sanctuary-300 min-w-[14rem]">{r.note ? (isEn ? r.note.en : r.note.zh) : <span className="text-sanctuary-600">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label={t('說明與限制', 'Notes and limits')} className="text-[11px] text-sanctuary-500 space-y-1">
        <p>{t(
          '這是「避開免疫」的推薦，不是掉寶機率排名：還沒有抽掉落表，所以不能說哪個場景比較容易出某個符文或裝備。',
          'This ranks areas by how little immunity they have, not by drop chance: drop tables have not been extracted, so it cannot say which area drops a given rune or item more easily.',
        )}</p>
        <p>{t(
          '免疫比例以怪物「種類」計（該場景地獄難度的怪物清單裡有幾種免疫），不是實際出現的比例；也不含精英與獨特怪的額外抗性。免疫來自遊戲資料表，與「怪物圖鑑」同一份。',
          'The immune share counts monster types in the area\'s Hell list, not how often they spawn, and excludes extra resistances from champions and uniques. Data comes from the game tables, the same as the Monsters page.',
        )}</p>
        <p>{t(
          '流派的主要元素是依各流派的說明整理的：召喚物與混合傷害的流派沒有單一答案，請自選。箱子與首領備註沿用「場景恐區」頁；秘密乳牛關等沒有怪物清單的場景不在這裡。邪惡威脅區域的分級請看「場景恐區」頁。',
          'The main element per build follows each build\'s description; summoner and mixed-damage builds have no single answer, so pick one. Chest and boss notes reuse the Areas & Terror page; areas without a monster list, such as the Secret Cow Level, are not listed. See that page for Terror Zone tiers.',
        )}</p>
      </section>
    </div>
  );
};
