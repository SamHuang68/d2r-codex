import React, { useEffect, useMemo, useState } from 'react';
import { Ghost, MapPin, Search, ShieldOff, Flame } from 'lucide-react';
import { GameIcon } from '../common/GameIcons';
import { PageHeader } from '../common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { getMonsterImage, MAJOR_BOSS_SPOTLIGHT, type BossSpotlightItem } from '../../utils/monsterImages';
import { BossTacticsShowcase } from './BossTacticsShowcase';
import {
  AREAS, DIFF_ZH, ELEMS, ELEM_ZH, KIND_ZH, MONSTERS, areaImmunity, areaLevel, areasOfMonster, immunitiesOf, isImmune, resistOf,
  type Area, type Diff, type ElemKey, type Monster,
} from '../../data/codex/monsters';

const ELEM_EN: Record<ElemKey, string> = {
  physical: 'Phys',
  magic: 'Mag',
  fire: 'Fire',
  lightning: 'Light',
  cold: 'Cold',
  poison: 'Pois',
};

const ELEM_TONE: Record<ElemKey, string> = {
  physical: 'text-sanctuary-200 border-sanctuary-600 bg-sanctuary-700/40',
  magic: 'text-d2-magic border-d2-magic/40 bg-d2-magic/10',
  fire: 'text-d2-fire border-d2-fire/40 bg-d2-fire/10',
  lightning: 'text-d2-lightning border-d2-lightning/40 bg-d2-lightning/10',
  cold: 'text-d2-cold border-d2-cold/40 bg-d2-cold/10',
  poison: 'text-d2-poison border-d2-poison/40 bg-d2-poison/10',
};
const KIND_EN: Record<string, string> = { demon: 'Demon', undead: 'Undead', insect: 'Insect', beast: 'Beast', human: 'Human', construct: 'Construct', other: 'Other' };
const DIFF_EN: Record<Diff, string> = ['Normal', 'Nightmare', 'Hell'];
const PAGE = 100;

/** 一格抗性：免疫、弱點（負值）、一般數值。顏色只標出「值得注意」的，其餘淡色 */
const ResChip: React.FC<{ elem: ElemKey; value: number }> = ({ elem, value }) => {
  const { isEn } = useLanguage();
  const imm = isImmune(value);
  const elemLabel = isEn ? ELEM_EN[elem] : ELEM_ZH[elem];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-mono ${imm ? ELEM_TONE[elem] + ' font-bold' : value < 0 ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' : 'text-sanctuary-400 border-sanctuary-800 bg-sanctuary-950/60'}`}
      title={isEn ? `${elemLabel} Res ${value}%${imm ? ' (Immune)' : value < 0 ? ' (Weak)' : ''}` : `${ELEM_ZH[elem]}抗性 ${value}%${imm ? '（免疫）' : value < 0 ? '（弱點）' : ''}`}
    >
      {elemLabel}
      <span>{imm ? (isEn ? 'Immune' : '免疫') : `${value}%`}</span>
    </span>
  );
};

const DiffButtons: React.FC<{ diff: Diff; onChange: (d: Diff) => void }> = ({ diff, onChange }) => {
  const { isEn } = useLanguage();
  const diffLabels = isEn ? DIFF_EN : DIFF_ZH;
  return (
    <div className="flex items-center gap-1" role="group" aria-label="難度">
      {([0, 1, 2] as Diff[]).map((d) => (
        <button key={d} type="button" onClick={() => onChange(d)} aria-pressed={diff === d}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${diff === d ? 'bg-d2-fire text-sanctuary-950 font-bold shadow' : 'bg-sanctuary-950/80 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'}`}>
          {diffLabels[d]}
        </button>
      ))}
    </div>
  );
};

const MonsterRow: React.FC<{ m: Monster; diff: Diff; open: boolean; onToggle: () => void }> = ({ m, diff, open, onToggle }) => {
  const { isEn } = useLanguage();
  const imms = immunitiesOf(m, diff);
  const imgSrc = getMonsterImage(m);

  return (
    <div
      id={`monster-${m.id}`}
      className={`rounded-xl border transition-all duration-200 scroll-mt-24 ${open ? 'border-sanctuary-700 bg-sanctuary-900/60 shadow-lg ring-1 ring-d2-fire/40' : 'border-sanctuary-800/80 bg-sanctuary-900/40 hover:border-sanctuary-700/70'}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 group cursor-pointer"
      >
        {/* Monster Avatar Thumbnail & Title Block */}
        <div className="flex items-center gap-3 min-w-0 lg:w-72 shrink-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-sanctuary-800 bg-sanctuary-950 flex items-center justify-center group-hover:border-sanctuary-600 transition-colors shadow-inner">
            <img
              src={imgSrc}
              alt={isEn ? (m.nameEn || m.name) : m.name}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            {m.boss && (
              <div className="absolute inset-0 border-2 border-d2-unique/60 rounded-xl pointer-events-none shadow-[inset_0_0_8px_rgba(200,165,100,0.35)]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`font-bold truncate ${m.boss ? 'text-d2-unique group-hover:text-amber-300' : 'text-sanctuary-100 group-hover:text-white'} transition-colors`}>
                {isEn ? (m.nameEn || m.name) : m.name}
              </span>
              {m.boss && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-d2-unique/15 text-d2-unique border border-d2-unique/30 font-semibold shrink-0">
                  {isEn ? 'Boss' : '頭目'}
                </span>
              )}
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sanctuary-800/90 text-sanctuary-300 border border-sanctuary-700/50 shrink-0">
                {isEn ? (KIND_EN[m.kind ?? 'other'] || m.kind) : (KIND_ZH[m.kind ?? 'other'] || m.kind)}
              </span>
            </div>
            <div className="text-[11px] font-mono text-sanctuary-500 truncate mt-0.5">
              {isEn ? m.id : (m.nameEn !== m.name ? `${m.nameEn}　${m.id}` : m.id)}
            </div>
          </div>
        </div>

        <div className="text-xs text-sanctuary-300 font-mono lg:w-20 shrink-0" title={isEn ? "Monster Level (this difficulty)" : "怪物等級（該難度）"}>
          Lv {m.levels[diff] ?? '—'}
        </div>
        <div className="flex flex-wrap gap-1 flex-1">
          {ELEMS.map((e) => <ResChip key={e} elem={e} value={resistOf(m, e, diff)} />)}
        </div>
        <div className="text-[11px] text-sanctuary-500 lg:w-24 shrink-0 text-right">
          {imms.length ? (isEn ? `Immune to ${imms.length}` : `免疫 ${imms.length} 項`) : (isEn ? 'No Immunity' : '無免疫')}
        </div>
      </button>

      {open && (
        <div className="border-t border-sanctuary-800/80 p-3 sm:p-5 space-y-4 bg-sanctuary-950/40">
          {/* Monster Visual Profile Showcase Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-sanctuary-800/90 bg-gradient-to-r from-sanctuary-900/90 via-sanctuary-900/60 to-sanctuary-950/90 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border ${m.boss ? 'border-d2-unique/60 shadow-[0_0_16px_rgba(200,165,100,0.25)]' : 'border-sanctuary-700/80'} bg-sanctuary-950 flex items-center justify-center`}>
              <img
                src={imgSrc}
                alt={isEn ? (m.nameEn || m.name) : m.name}
                className="w-full h-full object-cover object-top"
              />
              {m.boss && (
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-d2-unique/90 text-sanctuary-950 text-[10px] font-bold font-mono tracking-wider shadow">
                  BOSS
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`text-lg sm:text-xl font-bold tracking-wide ${m.boss ? 'text-d2-unique' : 'text-sanctuary-100'}`}>
                  {isEn ? (m.nameEn || m.name) : m.name}
                </h3>
                {!isEn && m.nameEn && m.nameEn !== m.name && (
                  <span className="text-sm font-serif italic text-sanctuary-400">
                    ({m.nameEn})
                  </span>
                )}
                {m.boss && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-d2-unique/20 text-d2-unique border border-d2-unique/40 font-semibold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-d2-fire" />
                    {isEn ? 'Boss / Superunique' : '首領 / 暗金頭目'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-sanctuary-800/90 text-sanctuary-200 border border-sanctuary-700/60">
                  {isEn ? `Category: ${KIND_EN[m.kind ?? 'other'] || m.kind}` : `種族大類：${KIND_ZH[m.kind ?? 'other'] || m.kind}`}
                </span>
                {m.type && (
                  <span className="px-2 py-0.5 rounded bg-sanctuary-800/90 text-sanctuary-300 border border-sanctuary-700/60">
                    Type: <span className="text-amber-300/90">{m.type}</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-sanctuary-950 text-sanctuary-400 border border-sanctuary-800">
                  ID: <span className="text-sanctuary-300">{m.id}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-sanctuary-400 text-[11px] font-mono">{isEn ? 'Level by Diff:' : '各難度等級：'}</span>
                {([0, 1, 2] as Diff[]).map((d) => (
                  <span
                    key={d}
                    className={`px-2 py-0.5 rounded-md font-mono text-[11px] border ${
                      d === diff
                        ? 'border-d2-fire/50 bg-d2-fire/20 text-d2-fire font-bold'
                        : 'border-sanctuary-800 bg-sanctuary-900/60 text-sanctuary-400'
                    }`}
                  >
                    {isEn ? DIFF_EN[d] : DIFF_ZH[d]}: Lv {m.levels[d] ?? '—'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="text-xs w-full min-w-[420px]">
              <thead><tr className="text-sanctuary-500 font-mono"><th className="text-left font-normal pb-1">{isEn ? 'Difficulty' : '難度'}</th><th className="font-normal pb-1">{isEn ? 'Level' : '等級'}</th>{ELEMS.map((e) => <th key={e} className="font-normal pb-1">{isEn ? ELEM_EN[e] : ELEM_ZH[e]}</th>)}<th className="font-normal pb-1" title={isEn ? "Life/Mana leech effectiveness against this monster" : "生命／法力偷取對這隻怪的效果"}>{isEn ? 'Drain' : '吸取'}</th></tr></thead>
              <tbody>
                {([0, 1, 2] as Diff[]).map((d) => (
                  <tr key={d} className={d === diff ? 'text-sanctuary-100 font-medium bg-sanctuary-800/30' : 'text-sanctuary-400'}>
                    <td className="py-1 px-1">{isEn ? DIFF_EN[d] : DIFF_ZH[d]}</td>
                    <td className="text-center font-mono py-1">{m.levels[d] ?? '—'}</td>
                    {ELEMS.map((e) => { const v = resistOf(m, e, d); return <td key={e} className={`text-center font-mono py-1 ${isImmune(v) ? 'text-d2-fire font-bold' : v < 0 ? 'text-emerald-300' : ''}`}>{isImmune(v) ? (isEn ? 'Immune' : '免疫') : v}</td>; })}
                    <td className="text-center font-mono py-1">{m.drain[d] == null ? '—' : `${m.drain[d]}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-sanctuary-500">{isEn ? 'Resist ≥100 is Immune; negative is weakness; blank table cell is 0; blank Drain is "—".' : '抗性 ≥100 為免疫、負值為弱點；資料表沒填的抗性格視為 0；吸取沒填顯示「—」（沒有可核對的預設值）。'}</div>
          <div>
            <div className="text-[11px] font-mono text-sanctuary-500 mb-1">{isEn ? 'Spawn Areas (regular monster list from game data; excludes fixed boss locations):' : '出現的場景（遊戲資料的一般怪物清單，不含頭目的固定出沒點）：'}</div>
            {areasOfMonster(m.id).length === 0 ? <span className="text-xs text-sanctuary-500">{isEn ? 'Does not spawn as regular area monsters (e.g. bosses, event spawns, summons)' : '沒有出現在一般場景的怪物清單（例如頭目、事件怪物、召喚物）'}</span> : (
              <div className="flex flex-wrap gap-1.5">
                {areasOfMonster(m.id).map(({ area, diffs }) => (
                  <span key={area.id} className="text-[11px] px-2 py-0.5 rounded-full border border-sanctuary-700 bg-sanctuary-950/60 text-sanctuary-300">
                    {isEn ? (area.nameEn || area.name) : (area.name ?? area.nameEn)}<span className="text-sanctuary-500 font-mono"> ({diffs.map((d) => isEn ? DIFF_EN[d] : DIFF_ZH[d]).join(' / ')})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MonstersTab: React.FC<{ initialQuery?: string }> = ({ initialQuery }) => {
  const { isEn } = useLanguage();
  const [diff, setDiff] = useState<Diff>(2);
  const [q, setQ] = useState(initialQuery ?? '');
  // 從全域搜尋點進來時帶入怪物名稱（同一頁再搜一次也要更新）
  useEffect(() => { if (initialQuery !== undefined) setQ(initialQuery); }, [initialQuery]);
  const [kind, setKind] = useState<string>('all');
  const [immune, setImmune] = useState<ElemKey[]>([]);
  const [sort, setSort] = useState<'name' | 'level' | 'immunity'>('name');
  const [open, setOpen] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const rows = MONSTERS.filter((m) => {
      if (kind === 'boss' ? !m.boss : kind !== 'all' && (m.kind ?? 'other') !== kind) return false;
      if (t && !(m.name.toLowerCase().includes(t) || m.nameEn.toLowerCase().includes(t) || m.id.toLowerCase().includes(t))) return false;
      if (immune.length && !immune.some((e) => isImmune(resistOf(m, e, diff)))) return false;
      return true;
    });
    const cmpName = (a: Monster, b: Monster) => a.name.localeCompare(b.name, 'zh-Hant') || (a.levels[diff] ?? 0) - (b.levels[diff] ?? 0);
    if (sort === 'level') rows.sort((a, b) => (b.levels[diff] ?? 0) - (a.levels[diff] ?? 0) || cmpName(a, b));
    else if (sort === 'immunity') rows.sort((a, b) => immunitiesOf(b, diff).length - immunitiesOf(a, diff).length || cmpName(a, b));
    else rows.sort(cmpName);
    return rows;
  }, [q, kind, immune, sort, diff]);

  const toggleImmune = (e: ElemKey) => { setImmune((cur) => (cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e])); setLimit(PAGE); };

  const handleBossClick = (boss: BossSpotlightItem) => {
    setImmune([]);
    setKind('boss');
    setQ(isEn ? boss.nameEn : boss.name);
    setOpen(boss.id);
  };

  const handleSelectBossById = (bossId: string) => {
    const boss = MAJOR_BOSS_SPOTLIGHT.find((b) => b.id === bossId) || {
      id: bossId,
      name: bossId === 'baalcrab' ? '巴爾' : bossId,
      nameEn: bossId === 'baalcrab' ? 'Baal' : bossId,
    };
    setImmune([]);
    setKind('boss');
    setQ(isEn ? (boss.nameEn || boss.name) : boss.name);
    setOpen(boss.id);

    setTimeout(() => {
      const el = document.getElementById(`monster-${boss.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* 五大章節核心首領弱點、逃課與打寶提款聖典展廳 */}
      <BossTacticsShowcase onSelectBoss={handleSelectBossById} />

      {/* Prime Evils & Act Bosses Spotlight */}
      <div className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-d2-unique uppercase tracking-wider">
            <GameIcon name="demon" className="w-4 h-4 text-d2-fire animate-pulse" />
            <span>{isEn ? 'Act Bosses & Prime Evils Spotlight' : '章節核心首領與終極魔王速查'}</span>
          </div>
          <span className="text-[11px] text-sanctuary-500 font-mono">
            {isEn ? 'Click portrait to inspect' : '點擊頭像快速定位魔王檔案'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {MAJOR_BOSS_SPOTLIGHT.map((boss) => {
            const bossImg = getMonsterImage({ id: boss.id, boss: true, kind: 'demon' });
            const isSelected = open === boss.id;
            return (
              <button
                key={boss.id}
                type="button"
                onClick={() => handleBossClick(boss)}
                className={`group text-left p-2 rounded-xl border transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'border-d2-unique bg-d2-unique/15 shadow-[0_0_12px_rgba(200,165,100,0.3)] ring-1 ring-d2-unique/50'
                    : 'border-sanctuary-800/90 bg-sanctuary-950/60 hover:border-sanctuary-700 hover:bg-sanctuary-900/80'
                }`}
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-sanctuary-700/60 bg-sanctuary-950">
                  <img
                    src={bossImg}
                    alt={isEn ? boss.nameEn : boss.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 border border-d2-unique/30 rounded-lg pointer-events-none" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs truncate text-sanctuary-100 group-hover:text-d2-unique transition-colors">
                    {isEn ? boss.nameEn : boss.name}
                  </div>
                  <div className="text-[10px] font-mono text-sanctuary-400 truncate">
                    {isEn ? boss.titleEn : boss.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Controls */}
      <div className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <DiffButtons diff={diff} onChange={setDiff} />
          <div className="relative flex-1 md:max-w-sm">
            <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder={isEn ? "Search monster by name, English name, or ID..." : "搜尋怪物名稱、英文名或代碼…"} aria-label="搜尋怪物"
              className="w-full pl-9 pr-3 py-2 bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-fire/50" />
          </div>
          <select value={kind} onChange={(e) => { setKind(e.target.value); setLimit(PAGE); }} aria-label="分類" className="bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-200">
            <option value="all">{isEn ? 'All Categories' : '全部分類'}</option>
            <option value="boss">{isEn ? 'Bosses & Superuniques' : '頭目'}</option>
            {(Object.keys(KIND_ZH) as (keyof typeof KIND_ZH)[]).map((k) => <option key={k} value={k}>{isEn ? (KIND_EN[k] || k) : KIND_ZH[k]}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="排序" className="bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-200">
            <option value="name">{isEn ? 'Sort by Name' : '依名稱'}</option><option value="level">{isEn ? 'Sort by Level (High to Low)' : '依等級（高到低）'}</option><option value="immunity">{isEn ? 'Sort by Immunities' : '依免疫項數'}</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-sanctuary-400 font-mono flex items-center gap-1"><ShieldOff className="w-3.5 h-3.5" />{isEn ? 'Immunity (any): ' : '免疫（任一）：'}</span>
          {ELEMS.map((e) => (
            <button key={e} type="button" onClick={() => toggleImmune(e)} aria-pressed={immune.includes(e)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${immune.includes(e) ? ELEM_TONE[e] + ' font-bold' : 'text-sanctuary-400 border-sanctuary-800 bg-sanctuary-950/60 hover:text-sanctuary-200'}`}>
              {isEn ? ELEM_EN[e] : ELEM_ZH[e]}
            </button>
          ))}
          {immune.length > 0 && <button type="button" onClick={() => setImmune([])} className="text-xs text-sanctuary-500 underline ml-1">{isEn ? 'Clear' : '清除'}</button>}
          <span className="ml-auto text-xs text-sanctuary-500">{isEn ? `${list.length} / ${MONSTERS.length} monsters (${DIFF_EN[diff]})` : `${list.length} / ${MONSTERS.length} 隻（${DIFF_ZH[diff]}）`}</span>
        </div>
      </div>

      <div className="space-y-2" aria-label="怪物清單">
        {list.slice(0, limit).map((m) => <MonsterRow key={m.id} m={m} diff={diff} open={open === m.id} onToggle={() => setOpen(open === m.id ? null : m.id)} />)}
        {list.length === 0 && <div className="text-sm text-sanctuary-500 py-8 text-center">{isEn ? 'No monsters match the criteria' : '沒有符合條件的怪物'}</div>}
        {list.length > limit && <button type="button" onClick={() => setLimit(limit + PAGE)} className="w-full py-2.5 rounded-xl border border-sanctuary-800 text-xs text-sanctuary-300 hover:text-sanctuary-100">{isEn ? `Show more (${list.length - limit} remaining)` : `顯示更多（還有 ${list.length - limit} 隻）`}</button>}
      </div>
    </div>
  );
};

const AreaCard: React.FC<{ area: Area; diff: Diff }> = ({ area, diff }) => {
  const { isEn } = useLanguage();
  const [open, setOpen] = useState(false);
  const info = useMemo(() => areaImmunity(area, diff), [area, diff]);
  const total = info.monsters.length;
  return (
    <div className="rounded-2xl border border-sanctuary-800/80 bg-sanctuary-900/40 p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-sanctuary-100">{area.name ?? area.nameEn}</h3>
          <div className="text-[11px] font-mono text-sanctuary-500">{area.nameEn}　·　{isEn ? `Act ${area.act}` : `第 ${area.act} 章`}</div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sanctuary-950 text-sanctuary-300 border border-sanctuary-800 shrink-0" title="怪物等級（該難度）">Lv {areaLevel(area, diff) ?? '—'}</span>
      </div>
      {total === 0 ? <div className="text-xs text-sanctuary-500">{isEn ? 'No monster spawns in this difficulty' : '此難度沒有怪物清單'}</div> : (
        <>
          <div className="flex flex-wrap gap-1.5">
            {ELEMS.map((e) => (
              <span key={e} className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${info.immuneCount[e] ? ELEM_TONE[e] + ' font-bold' : 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'}`}
                title={info.immuneCount[e] ? `${total} 種怪物中有 ${info.immuneCount[e]} 種免疫${isEn ? ELEM_EN[e] : ELEM_ZH[e]}` : `沒有任何怪物免疫${isEn ? ELEM_EN[e] : ELEM_ZH[e]}`}>
                {isEn ? ELEM_EN[e] : ELEM_ZH[e]}{info.immuneCount[e] ? (isEn ? ` Imm ${info.immuneCount[e]}/${total}` : `免疫 ${info.immuneCount[e]}/${total}`) : (isEn ? ' Clear' : '全無免疫')}
              </span>
            ))}
          </div>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="text-xs text-sanctuary-400 underline">{open ? (isEn ? 'Collapse monster list' : '收合怪物清單') : (isEn ? `View ${total} monsters` : `看 ${total} 種怪物`)}</button>
          {open && (
            <ul className="space-y-1.5 text-xs pt-1">
              {info.monsters.map((m) => {
                const aImg = getMonsterImage(m);
                return (
                  <li key={m.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 py-0.5 border-b border-sanctuary-800/40 last:border-b-0">
                    <img src={aImg} alt="" className="w-5 h-5 rounded object-cover object-top border border-sanctuary-800 shrink-0" loading="lazy" />
                    <span className="text-sanctuary-200 font-medium">{isEn ? (m.nameEn || m.name) : m.name}</span>
                    <span className="text-sanctuary-500 font-mono text-[11px]">Lv {m.levels[diff] ?? '—'}</span>
                    <div className="flex flex-wrap gap-1 ml-auto">
                      {immunitiesOf(m, diff).map((e) => (
                        <span key={e} className={`text-[10px] font-mono px-1.5 rounded border ${ELEM_TONE[e]}`}>
                          {isEn ? `${ELEM_EN[e]} Imm.` : `${ELEM_ZH[e]}免疫`}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

const AreasTab: React.FC = () => {
  const { isEn } = useLanguage();
  const [diff, setDiff] = useState<Diff>(2);
  const [act, setAct] = useState<number | 'all'>('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return AREAS.filter((a) => (act === 'all' || a.act === act) && a.mon[diff].length > 0 && (!t || (a.name ?? '').toLowerCase().includes(t) || a.nameEn.toLowerCase().includes(t)));
  }, [diff, act, q]);
  return (
    <div className="space-y-4">
      <div className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 flex flex-col md:flex-row md:items-center gap-3">
        <DiffButtons diff={diff} onChange={setDiff} />
        <div className="flex items-center gap-1 flex-wrap">
          {(['all', 1, 2, 3, 4, 5] as const).map((a) => (
            <button key={a} type="button" onClick={() => setAct(a)} aria-pressed={act === a}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${act === a ? 'bg-d2-fire text-sanctuary-950 font-bold' : 'bg-sanctuary-950/80 text-sanctuary-300 border border-sanctuary-800'}`}>
              {a === 'all' ? (isEn ? 'All Acts' : '全部章節') : (isEn ? `Act ${a}` : `第 ${a} 章`)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={isEn ? "Search area name..." : "搜尋場景名稱…"} aria-label="搜尋場景"
            className="w-full pl-9 pr-3 py-2 bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-fire/50" />
        </div>
        <span className="md:ml-auto text-xs text-sanctuary-500">{isEn ? `${list.length} Areas (${DIFF_EN[diff]})` : `${list.length} 個場景（${DIFF_ZH[diff]}）`}</span>
      </div>
      <div className="text-xs text-sanctuary-500">{isEn ? 'Green = No regular monsters are immune to this element; Colored = Number of immune monsters. Excludes champion/unique modifiers.' : '綠色＝這個場景（該難度）出現的一般怪物裡沒有任何一種免疫該元素；紅色等＝有幾種免疫。不含精英與獨特詞綴帶來的額外免疫（例如火焰附魔）。'}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" aria-label="場景清單">
        {list.map((a) => <AreaCard key={a.id} area={a} diff={diff} />)}
      </div>
    </div>
  );
};

export const MonsterCompendium: React.FC<{ initialQuery?: string }> = ({ initialQuery }) => {
  const { t, isEn } = useLanguage();
  const [tab, setTab] = useState<'monsters' | 'areas'>('monsters');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <PageHeader
        icon={<Ghost className="w-7 h-7" />}
        title={t('怪物圖鑑', 'Monster Bestiary')}
        tone="text-d2-fire"
        desc={t('遊戲資料表（monstats、levels）裡每種怪物在三個難度的等級與六種抗性，以及每個場景出現哪些怪物、有哪些元素免疫。規劃配裝與選場景時，用它查「這個場景能不能用我的元素」。', 'Game data tables detailing monster levels, 6 resistance types across 3 difficulties, and area monster spawns.')}
        right={
          <div className="flex items-center gap-1 bg-sanctuary-900/80 p-1 rounded-xl border border-sanctuary-800 shrink-0" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'monsters'} onClick={() => setTab('monsters')}
              className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 ${tab === 'monsters' ? 'bg-d2-fire text-sanctuary-950 font-bold' : 'text-sanctuary-300 hover:text-sanctuary-100'}`}>
              <Ghost className="w-4 h-4" />{isEn ? 'Monsters' : '怪物'}
            </button>
            <button type="button" role="tab" aria-selected={tab === 'areas'} onClick={() => setTab('areas')}
              className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 ${tab === 'areas' ? 'bg-d2-fire text-sanctuary-950 font-bold' : 'text-sanctuary-300 hover:text-sanctuary-100'}`}>
              <MapPin className="w-4 h-4" />{isEn ? 'Area Immunities' : '場景免疫'}
            </button>
          </div>
        }
      />
      {tab === 'monsters' ? <MonstersTab initialQuery={initialQuery} /> : <AreasTab />}
      <div className="text-[11px] text-sanctuary-600">{isEn ? 'Data from monstats.txt & levels.txt (3.3.93847). Resist ≥100 is immune; for sunder mechanics, see target resistance in the Simulator.' : '資料來自遊戲 monstats.txt 與 levels.txt（3.3.93847）。抗性 ≥100 為免疫；破免（例如裝備的「怪物免疫被穿透」）請看模擬器的目標抗性。'}</div>
    </div>
  );
};
