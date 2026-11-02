import React, { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ELEMS, ELEM_ZH, areaImmunity, type Area, type Diff, type ElemKey } from '../../data/codex/monsters';
import { ELEM_EN, ELEM_TONE } from './monsterLabels';

/** 一個場景在該難度的免疫標籤：選了主要傷害元素就先標它安不安全，其餘有免疫的元素用小標籤（分母是該場景的怪物種類數，不是出現比例） */
export const AreaImmunityChips: React.FC<{ area: Area; diff: Diff; elem: ElemKey | 'any' }> = ({ area, diff, elem }) => {
  const { isEn } = useLanguage();
  const info = useMemo(() => areaImmunity(area, diff), [area, diff]);
  const total = info.monsters.length;
  const label = (e: ElemKey) => (isEn ? ELEM_EN[e] : ELEM_ZH[e]);
  return (
    <div className="flex flex-wrap gap-1">
      {elem !== 'any' && (info.immuneCount[elem]
        ? <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded border font-bold ${ELEM_TONE[elem]}`}>{isEn ? `${label(elem)} Imm ${info.immuneCount[elem]}/${total}` : `${label(elem)}免疫 ${info.immuneCount[elem]}/${total}`}</span>
        : <span className="text-[11px] font-mono px-1.5 py-0.5 rounded border text-emerald-300 border-emerald-500/30 bg-emerald-500/10">{isEn ? `${label(elem)} clear` : `${label(elem)}全無免疫`}</span>)}
      {ELEMS.filter((e) => e !== elem && info.immuneCount[e] > 0).map((e) => (
        <span key={e} className="text-[10px] font-mono px-1.5 py-0.5 rounded border text-sanctuary-400 border-sanctuary-800" title={isEn ? `${info.immuneCount[e]} of ${total} monsters are immune` : `${total} 種怪物中有 ${info.immuneCount[e]} 種免疫`}>
          {`${label(e)} ${info.immuneCount[e]}/${total}`}
        </span>
      ))}
    </div>
  );
};
