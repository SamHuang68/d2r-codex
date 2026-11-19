import React, { useMemo, useState } from 'react';
import { computeCharacter } from '../../../engine/character';
import { gameData } from '../../../engine/data';
import { applyBuffs, buffCandidates } from '../../../engine/buffs';
import { skillLevelsFrom } from '../../../engine/skills';
import { passiveSummary } from '../../../engine/skillEffects';
import { computeMercenary, hirelingById } from '../../../engine/mercenary';
import { survivalSummary } from '../../../engine/survival';
import { mfSummary } from '../../../engine/magicFind';
import { BREAKPOINTS, bpStatus } from '../../../engine/breakpoints';
import { fromSavedData, type SavedProfile, type SimSnapshot } from '../../../data/profileStore';
import { SIM_PRESETS } from '../../../data/simulatorPresets';
import { stateFromPreset } from '../../../data/presetState';
import { engineItemsOf } from './engineItems';
import { useLanguage } from '../../../context/LanguageContext';

const CLASS_CODE_TO_EN: Record<string, string> = {
  ama: 'Amazon', sor: 'Sorceress', nec: 'Necromancer', pal: 'Paladin',
  bar: 'Barbarian', dru: 'Druid', ass: 'Assassin', war: 'Warlock',
};

/** 單份配裝快照的核心數值摘要（供 A / B 對比使用） */
export interface BuildSummary {
  life: number;
  mana: number;
  defense: number;
  block: number;
  fireRes: number;
  coldRes: number;
  lightRes: number;
  poisRes: number;
  minRes: number;
  pdr: number;
  ehpPhys: number;
  ehpElem: number;
  fcr: number;
  fcrFrames: number | null;
  fhr: number;
  fhrFrames: number | null;
  ias: number;
  mf: number;
  effUniqueMf: number;
  allSkills: number;
}

/** 計算單份配裝快照的完整角色數值（含已開啟之增益與傭兵光環） */
export function summarizeSnapshot(snap: SimSnapshot): BuildSummary {
  const className = CLASS_CODE_TO_EN[snap.classCode] ?? 'Sorceress';
  const items = engineItemsOf(snap.equipped, snap.charms, snap.swap, snap.rollMax);
  const baseInput = {
    className,
    level: snap.level,
    allocated: snap.alloc,
    items,
    difficulty: snap.difficulty,
    anyaScrolls: snap.quests.anya,
    quests: { lifePotions: snap.quests.lifePotions },
  };
  const baseResult = computeCharacter(gameData, baseInput);
  const skillBonuses = {
    all: baseResult.skills.all,
    byClass: baseResult.skills.byClass[className] ?? 0,
    byTab: baseResult.skills.byTab,
    single: baseResult.skills.single,
  };
  const mercHire = snap.merc ? hirelingById(snap.merc.id) : undefined;
  const mercResult = snap.merc && mercHire
    ? computeMercenary(gameData, { hireling: mercHire, level: snap.merc.level, items: engineItemsOf(snap.merc.equipped, [], 'I', snap.rollMax) })
    : null;
  const candidates = buffCandidates(
    snap.classCode,
    snap.skillPoints,
    skillBonuses,
    baseResult.stats,
    snap.merc?.on && mercResult ? mercResult.auras.map((a) => ({ skill: a.skill, level: a.level })) : [],
  );
  const activeBuffs = candidates.filter((c) => c.alwaysOn || snap.buffsOn[c.rowId]);
  const levels = skillLevelsFrom(snap.skillPoints, skillBonuses);
  const applied = applyBuffs(activeBuffs, levels);
  const passives = passiveSummary(snap.skillPoints, skillBonuses, levels);
  const res = computeCharacter(gameData, { ...baseInput, extraStats: [...applied.self, ...passives.self] });
  const sv = survivalSummary(res);
  const s = res.stats;
  const fcr = s.item_fastercastrate ?? 0;
  const fhr = s.item_fastergethitrate ?? 0;
  const ias = s.item_fasterattackrate ?? 0;
  const mf = s.item_magicbonus ?? 0;
  const effUniqueMf = Math.floor(mfSummary(mf).find((m) => m.kind === 'unique')?.effective ?? 0);
  const fcrTable = BREAKPOINTS.fcr[snap.classCode]?.[0];
  const fhrTable = BREAKPOINTS.fhr[snap.classCode]?.[0];

  return {
    life: res.life,
    mana: res.mana,
    defense: res.defense,
    block: res.blockChance,
    fireRes: res.resist.fire,
    coldRes: res.resist.cold,
    lightRes: res.resist.lightning,
    poisRes: res.resist.poison,
    minRes: sv.minRes,
    pdr: sv.pdr,
    ehpPhys: Math.round(sv.ehpPhys),
    ehpElem: Math.round(sv.ehpElem),
    fcr,
    fcrFrames: fcrTable ? bpStatus(fcrTable, fcr).frames : null,
    fhr,
    fhrFrames: fhrTable ? bpStatus(fhrTable, fhr).frames : null,
    ias,
    mf,
    effUniqueMf,
    allSkills: res.skills.all,
  };
}

interface CompareOption {
  id: string;
  label: string;
  resolve: () => SimSnapshot | null;
}

interface Props {
  classCode: string;
  capture: () => SimSnapshot;
  profiles: SavedProfile[];
}

interface MetricRow {
  label: string;
  labelEn: string;
  a: number;
  b: number;
  suffix?: string;
  /** true 表示數值越低越好（例如影格數） */
  lowerIsBetter?: boolean;
  subA?: string;
  subB?: string;
}

export const ProfileCompare: React.FC<Props> = ({ classCode, capture, profiles }) => {
  const { isEn } = useLanguage();
  const [open, setOpen] = useState(false);

  const options: CompareOption[] = useMemo(() => {
    const list: CompareOption[] = [
      { id: '__current__', label: isEn ? 'Current Setup' : '目前配裝', resolve: capture },
    ];
    for (const p of profiles) {
      list.push({
        id: `prof:${p.id}`,
        label: isEn ? `[Saved] ${p.name}` : `【存檔】${p.name}`,
        resolve: () => fromSavedData(p.data, isEn).snap,
      });
    }
    for (const pr of SIM_PRESETS.filter((x) => x.classCode === classCode)) {
      list.push({
        id: `preset:${pr.build}:${pr.tier}`,
        label: isEn ? `[Preset] ${pr.name}` : `【範本】${pr.name}`,
        resolve: () => stateFromPreset(pr, isEn).snap,
      });
    }
    return list;
  }, [classCode, capture, profiles, isEn]);

  const [pickA, setPickA] = useState('__current__');
  const [pickB, setPickB] = useState(() => (options[1]?.id ?? '__current__'));

  const idA = options.some((o) => o.id === pickA) ? pickA : '__current__';
  const idB = options.some((o) => o.id === pickB) ? pickB : (options[1]?.id ?? '__current__');

  const summaryA = useMemo(() => {
    if (!open) return null;
    const snap = options.find((o) => o.id === idA)?.resolve();
    return snap ? summarizeSnapshot(snap) : null;
  }, [open, options, idA]);

  const summaryB = useMemo(() => {
    if (!open) return null;
    const snap = options.find((o) => o.id === idB)?.resolve();
    return snap ? summarizeSnapshot(snap) : null;
  }, [open, options, idB]);

  const rows: MetricRow[] = useMemo(() => {
    if (!summaryA || !summaryB) return [];
    const fr = (f: number | null) => (f !== null ? (isEn ? ` (${f}f)` : `（${f} 影格）`) : '');
    return [
      { label: '生命', labelEn: 'Life', a: summaryA.life, b: summaryB.life },
      { label: '法力', labelEn: 'Mana', a: summaryA.mana, b: summaryB.mana },
      { label: '防禦', labelEn: 'Defense', a: summaryA.defense, b: summaryB.defense },
      { label: '格擋機率', labelEn: 'Block Chance', a: summaryA.block, b: summaryB.block, suffix: '%' },
      { label: '物理減免 (PDR)', labelEn: 'Physical DR', a: summaryA.pdr, b: summaryB.pdr, suffix: '%' },
      { label: '最低元素抗性', labelEn: 'Lowest Elem Res', a: summaryA.minRes, b: summaryB.minRes, suffix: '%' },
      { label: '有效生命（物理）', labelEn: 'EHP (Physical)', a: summaryA.ehpPhys, b: summaryB.ehpPhys },
      { label: '有效生命（元素）', labelEn: 'EHP (Elemental)', a: summaryA.ehpElem, b: summaryB.ehpElem },
      { label: '快速施法 (FCR)', labelEn: 'FCR', a: summaryA.fcr, b: summaryB.fcr, suffix: '%', subA: fr(summaryA.fcrFrames), subB: fr(summaryB.fcrFrames) },
      { label: '打擊恢復 (FHR)', labelEn: 'FHR', a: summaryA.fhr, b: summaryB.fhr, suffix: '%', subA: fr(summaryA.fhrFrames), subB: fr(summaryB.fhrFrames) },
      { label: '攻擊速度 (IAS)', labelEn: 'IAS', a: summaryA.ias, b: summaryB.ias, suffix: '%' },
      { label: '總 MF', labelEn: 'Total MF', a: summaryA.mf, b: summaryB.mf, suffix: '%' },
      { label: '暗金有效 MF', labelEn: 'Effective Unique MF', a: summaryA.effUniqueMf, b: summaryB.effUniqueMf, suffix: '%' },
      { label: '所有技能', labelEn: '+All Skills', a: summaryA.allSkills, b: summaryB.allSkills },
    ];
  }, [summaryA, summaryB, isEn]);

  const fmtNum = (n: number, suffix = '') => `${n.toLocaleString('en-US')}${suffix}`;

  return (
    <section aria-label={isEn ? 'Compare Two Builds' : '配裝對比'} style={{ borderTop: '1px solid #2e271c', paddingTop: 12 }}>
      <div className="flex items-center justify-between gap-2">
        <div className="t-gold text-sm tracking-[.2em]" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>
          {isEn ? 'COMPARE BUILDS (A vs B)' : '配 裝 數 值 對 比（A vs B）'}
        </div>
        <button
          type="button"
          className="d2-btn is-quiet"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (isEn ? 'Hide Compare' : '收合對比') : (isEn ? 'Open Compare' : '展開對比')}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="d2-field">
              <span className="text-xs font-mono t-gold">A</span>
              <select aria-label={isEn ? 'Build A' : '對比配裝 A'} value={idA} onChange={(e) => setPickA(e.target.value)} className="d2-select flex-1 min-w-0">
                {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </label>
            <label className="d2-field">
              <span className="text-xs font-mono text-d2-magic">B</span>
              <select aria-label={isEn ? 'Build B' : '對比配裝 B'} value={idB} onChange={(e) => setPickB(e.target.value)} className="d2-select flex-1 min-w-0">
                {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </label>
          </div>

          {rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-sanctuary-800 text-sanctuary-400">
                    <th className="text-left py-1.5 pr-2 font-medium">{isEn ? 'Metric' : '指標'}</th>
                    <th className="text-right py-1.5 px-2 font-medium t-gold">A</th>
                    <th className="text-right py-1.5 px-2 font-medium text-d2-magic">B</th>
                    <th className="text-right py-1.5 pl-2 font-medium">{isEn ? 'Diff (B − A)' : '差值 (B − A)'}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const diff = r.b - r.a;
                    const good = r.lowerIsBetter ? diff < 0 : diff > 0;
                    const bad = r.lowerIsBetter ? diff > 0 : diff < 0;
                    const diffText = diff === 0 ? '—' : `${diff > 0 ? '+' : ''}${fmtNum(diff, r.suffix)}`;
                    return (
                      <tr key={r.labelEn} className="border-b border-sanctuary-900/80">
                        <td className="py-1.5 pr-2 text-sanctuary-300">{isEn ? r.labelEn : r.label}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-sanctuary-100">
                          {fmtNum(r.a, r.suffix)}
                          {r.subA && <span className="text-sanctuary-400">{r.subA}</span>}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-sanctuary-100">
                          {fmtNum(r.b, r.suffix)}
                          {r.subB && <span className="text-sanctuary-400">{r.subB}</span>}
                        </td>
                        <td className={`py-1.5 pl-2 text-right font-mono font-semibold ${good ? 'text-emerald-400' : bad ? 'text-red-400' : 'text-sanctuary-500'}`}>
                          {diffText}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
