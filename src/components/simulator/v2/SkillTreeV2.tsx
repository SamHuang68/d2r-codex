import React, { useEffect, useMemo, useState } from 'react';
import { Crosshair, Flame, Shield, Skull, Snowflake, Sparkles, Sword, Zap, Lock } from 'lucide-react';
import {
  CLASS_CODE_ZH, GAME_SKILLS, damageText, effectiveLevel, manaCost, skillByName, skillDamage, skillLevelsFrom, synergySources, synergyTargets, treesOf,
  type GameSkill, type SkillBonuses,
} from '../../../engine/skills';

/** 技能樹頁：資料全部來自遊戲技能表（樹名、格位、前置、說明、傷害與協同公式）。 */
export interface SkillTreeV2Props {
  classCode: string;
  level: number;
  skillPoints: Record<string, number>;
  onUpdateSkillPoints: (next: Record<string, number>) => void;
  activeSkillId?: string;
  onSetActiveSkillId: (id: string) => void;
  /** 來自裝備的技能加成（全技能、職業、技能樹、單一技能） */
  bonuses: SkillBonuses;
}

const ROW_LEVELS = [1, 6, 12, 18, 24, 30];

function SkillGlyph({ skill }: { skill: GameSkill }) {
  const e = skill.elem?.type;
  const cls = 'w-6 h-6';
  if (e === 'cold') return <Snowflake className={`${cls} t-cold`} />;
  if (e === 'fire') return <Flame className={`${cls} t-fire`} />;
  if (e === 'ltng') return <Zap className={`${cls} t-lightning`} />;
  if (e === 'pois') return <Skull className={`${cls} t-poison`} />;
  if (e === 'mag') return <Sparkles className={`${cls} t-magic`} />;
  if (skill.aura || skill.passive) return <Shield className={`${cls} t-gold`} />;
  if (skill.summon) return <Skull className={`${cls} t-magic`} />;
  if (skill.srcDam || skill.phys) return <Sword className={`${cls} t-bad`} />;
  return <Crosshair className={`${cls} t-dim`} />;
}

export const SkillTreeV2: React.FC<SkillTreeV2Props> = ({ classCode, level, skillPoints, onUpdateSkillPoints, activeSkillId, onSetActiveSkillId, bonuses }) => {
  const trees = useMemo(() => treesOf(classCode), [classCode]);
  const [treeIdx, setTreeIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => { setTreeIdx(0); setSelectedId(null); }, [classCode]);
  const tree = trees[treeIdx] ?? trees[0];
  useEffect(() => { if (!selectedId && tree?.skills.length) setSelectedId(tree.skills[0].id); }, [tree, selectedId]);

  const selected = GAME_SKILLS.find((s) => s.id === selectedId) ?? tree.skills[0] ?? null;
  const focusId = hoverId || selectedId;
  const focus = focusId ? GAME_SKILLS.find((s) => s.id === focusId) : undefined;
  const partnerIds = useMemo(() => {
    if (!focus) return [] as string[];
    const ids = new Set<string>();
    synergySources(focus, {}).sources.forEach((x) => ids.add(x.skill.id));
    synergyTargets(focus).forEach((x) => ids.add(x.id));
    return [...ids];
  }, [focus]);

  const pts = (s: GameSkill) => skillPoints[s.id] || 0;
  const met = (s: GameSkill) => s.prereq.every((n) => { const p = skillByName(n); return !p || (skillPoints[p.id] || 0) > 0; });
  const totalInvested = Object.values(skillPoints).reduce((a, b) => a + b, 0);
  const levels = useMemo(() => skillLevelsFrom(skillPoints, bonuses), [skillPoints, bonuses]);

  const add = (s: GameSkill, n = 1) => {
    const cur = pts(s); if (cur >= s.maxLvl || !met(s)) return;
    onUpdateSkillPoints({ ...skillPoints, [s.id]: Math.min(s.maxLvl, cur + n) });
  };
  const remove = (s: GameSkill, n = 1) => {
    const cur = pts(s); if (cur <= 0) return;
    const next = { ...skillPoints }; const v = cur - n;
    if (v <= 0) delete next[s.id]; else next[s.id] = v;
    onUpdateSkillPoints(next);
  };

  const syn = selected ? synergySources(selected, skillPoints) : { sources: [], totalPct: 0 };
  const targets = selected ? synergyTargets(selected) : [];
  const maxSynergies = () => {
    if (!selected || syn.sources.length === 0) return;
    const next = { ...skillPoints, [selected.id]: selected.maxLvl };
    syn.sources.forEach((x) => { next[x.skill.id] = x.skill.maxLvl; });
    // 前置技能至少 1 點，避免產生未解鎖的點數
    const need = (s: GameSkill) => s.prereq.forEach((n) => { const p = skillByName(n); if (p && !next[p.id]) { next[p.id] = 1; need(p); } });
    need(selected); syn.sources.forEach((x) => need(x.skill));
    onUpdateSkillPoints(next);
    onSetActiveSkillId(selected.id);
  };
  const resetSynergies = () => {
    if (!selected) return;
    const next = { ...skillPoints };
    syn.sources.forEach((x) => { delete next[x.skill.id]; });
    onUpdateSkillPoints(next);
  };
  const jumpTo = (id: string) => {
    const s = GAME_SKILLS.find((x) => x.id === id); if (!s) return;
    const i = trees.findIndex((t) => t.page === s.page); if (i >= 0) { setTreeIdx(i); setSelectedId(id); }
  };

  // 位置（viewBox 300×600；3 欄 6 列）
  const pos = (s: GameSkill) => ({ x: (s.col - 1) * 100 + 50, y: (s.row - 1) * 100 + 50 });
  const prereqPaths = useMemo(() => {
    const out: { id: string; d: string; on: boolean }[] = [];
    tree.skills.forEach((s) => {
      const to = pos(s);
      s.prereq.forEach((n) => {
        const pre = skillByName(n); if (!pre || pre.page !== s.page) return;
        const from = pos(pre); const y1 = from.y + 30; const y2 = to.y - 32; const mid = (y1 + y2) / 2;
        out.push({ id: `${pre.id}>${s.id}`, on: (skillPoints[pre.id] || 0) > 0, d: from.x === to.x ? `M ${from.x} ${y1} L ${to.x} ${y2}` : `M ${from.x} ${y1} L ${from.x} ${mid} L ${to.x} ${mid} L ${to.x} ${y2}` });
      });
    });
    return out;
  }, [tree, skillPoints]);
  const arcs = useMemo(() => {
    if (!focus || focus.page !== tree.page) return [];
    const f = pos(focus);
    return partnerIds.map((id) => GAME_SKILLS.find((x) => x.id === id)).filter((o): o is GameSkill => !!o && o.page === tree.page && o.id !== focus.id).map((o) => {
      const p = pos(o); const mx = (f.x + p.x) / 2 + (p.y !== f.y ? 34 : 0); const my = (f.y + p.y) / 2 - (p.x !== f.x ? 34 : 0);
      return { id: `${focus.id}~${o.id}`, d: `M ${f.x} ${f.y} Q ${mx} ${my} ${p.x} ${p.y}` };
    });
  }, [focus, partnerIds, tree]);

  const invested = selected ? pts(selected) : 0;
  const effective = selected ? effectiveLevel(selected, invested, bonuses) : 0;
  const dmg = selected ? damageText(skillDamage(selected, effective, levels)) : undefined;
  const mana = selected && effective > 0 ? manaCost(selected, effective) : undefined;
  const softBonus = effective > 0 ? effective - invested : 0;

  return (
    <div>
      <div className="d2-tabs" style={{ padding: '0 0 12px' }} role="tablist" aria-label="技能樹">
        {trees.map((t, i) => (
          <button key={t.page} type="button" role="tab" aria-selected={treeIdx === i} className="d2-tab"
            onClick={() => { setTreeIdx(i); if (t.skills[0]) setSelectedId(t.skills[0].id); }}>{t.name}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-4 items-start">
        {/* 左：6×3 技能格 */}
        <div className="mx-auto w-full" style={{ maxWidth: 300 }}>
          <div className="d2-skillboard" aria-label={`${tree.name} 技能樹`}>
            <svg viewBox="0 0 300 600" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
              <defs>
                <marker id="d2-arrow-on" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0 1, 7 4, 0 7, 2 4" fill="#c9b277" /></marker>
                <marker id="d2-arrow-off" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0 1, 7 4, 0 7, 2 4" fill="#4a4233" /></marker>
              </defs>
              {prereqPaths.map((p) => (
                <path key={p.id} d={p.d} fill="none" stroke={p.on ? '#c9b277' : '#4a4233'} strokeWidth={p.on ? 3 : 2} strokeDasharray={p.on ? undefined : '4 3'} markerEnd={`url(#${p.on ? 'd2-arrow-on' : 'd2-arrow-off'})`} />
              ))}
              {arcs.map((a) => <path key={a.id} d={a.d} fill="none" stroke="#45d6ea" strokeWidth={3} strokeDasharray="6 4" opacity={0.9} />)}
            </svg>
            {ROW_LEVELS.map((lv, r) => <span key={lv} className="rowmark" style={{ top: `calc(${(r * 100) / 6}% + 1px)` }}>Lv{lv}</span>)}
            {tree.skills.map((s) => {
              const n = pts(s); const isMax = n >= s.maxLvl; const unlocked = met(s);
              const hasSyn = synergySources(s, {}).sources.length > 0 || synergyTargets(s).length > 0;
              const cls = ['d2-skill', n > 0 ? 'is-points' : '', isMax ? 'is-max' : '', selectedId === s.id ? 'is-selected' : '', partnerIds.includes(s.id) && selectedId !== s.id ? 'is-synergy' : '', unlocked ? '' : 'is-locked'].join(' ');
              return (
                <div key={s.id} className="absolute" style={{ left: `${((s.col - 1) * 100) / 3 + 100 / 6}%`, top: `${((s.row - 1) * 100) / 6 + 100 / 12}%`, width: '24%', transform: 'translate(-50%, -50%)' }}>
                  <button type="button" className={cls}
                    aria-label={`${s.name ?? s.nameEn} ${n} 點`} aria-pressed={selectedId === s.id}
                    onClick={() => setSelectedId(s.id)} onDoubleClick={() => add(s)}
                    onContextMenu={(e) => { e.preventDefault(); remove(s); }}
                    onMouseEnter={() => setHoverId(s.id)} onMouseLeave={() => setHoverId(null)}>
                    <SkillGlyph skill={s} />
                    <span className="nm">{s.name ?? s.nameEn}</span>
                    <span className="cnt">{n}</span>
                    {hasSyn && <span className="syn" title="有協同關係">⚡</span>}
                    {activeSkillId === s.id && <span className="star" title="主力技能">★</span>}
                    {!unlocked && <Lock className="absolute w-4 h-4 t-dim" style={{ left: 4, bottom: 4 }} />}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="d2-sub mt-2 text-center">點選查看；連點兩下或用右側 ＋ 加點；右鍵減點</div>
        </div>

        {/* 右：技能提示框與協同 */}
        <div className="min-w-0 space-y-3">
          {selected ? (
            <>
              <div className="d2-tip">
                <div className="nm t-gold">{selected.name ?? selected.nameEn}</div>
                <div className="base">{selected.nameEn}　·　{tree.name}</div>
                <div className="base">需要等級：{selected.reqLevel}{level < selected.reqLevel && <span className="t-bad">（目前等級不足）</span>}</div>
                {selected.prereq.length > 0 && <div className="base">前置：{selected.prereq.map((n) => skillByName(n)?.name ?? n).join('、')}</div>}
                {selected.desc && <div className="mod" style={{ color: 'var(--text)' }}>{selected.desc.replace(/\n/g, ' ')}</div>}
                {selected.passive && <div className="hint">被動技能</div>}
                {selected.aura && <div className="hint">光環</div>}
              </div>

              <div className="d2-row">
                <span className="k">技能等級</span>
                <span className="v t-gold">{effective > 0 ? `Lv ${effective}` : '—'}<span className="t-dim text-xs ml-2 font-normal">（硬點 {invested}{softBonus ? `＋裝備 ${softBonus}` : ''}／上限 {selected.maxLvl}）</span></span>
              </div>
              {(dmg || mana !== undefined) && (
                <div className="d2-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 2 }}>
                  {dmg && <div className="flex justify-between gap-2"><span className="k">傷害（表值）</span><span className="v t-set" style={{ fontSize: 14 }}>{dmg}</span></div>}
                  {mana !== undefined && <div className="flex justify-between gap-2"><span className="k">魔力消耗</span><span className="v t-cold" style={{ fontSize: 14 }}>{mana}</span></div>}
                  <div className="d2-sub">未含專精、敵人抗性、光環與武器；協同只計硬點（遊戲規則）。</div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <button type="button" className="d2-btn is-quiet" onClick={() => remove(selected)} disabled={invested <= 0} aria-label="減 1 點">－</button>
                <button type="button" className="d2-btn flex-1" onClick={() => add(selected)} disabled={invested >= selected.maxLvl || !met(selected)} aria-label="加 1 點" style={{ whiteSpace: 'nowrap' }}>＋ 加點</button>
                <button type="button" className="d2-btn" onClick={() => add(selected, selected.maxLvl)} disabled={invested >= selected.maxLvl || !met(selected)} style={{ whiteSpace: 'nowrap' }}>MAX</button>
                <button type="button" className={`d2-btn ${activeSkillId === selected.id ? '' : 'is-quiet'}`} onClick={() => onSetActiveSkillId(selected.id)} title="標記為主力技能（屬性頁會顯示其傷害）" style={{ whiteSpace: 'nowrap' }}>{activeSkillId === selected.id ? '★ 主力' : '設為主力'}</button>
              </div>

              {/* 協同 */}
              <div className="d2-well p-3 space-y-2" style={{ boxShadow: 'inset 0 0 14px #000, inset 0 0 0 1px #1f5a63' }}>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#7fe9f7', letterSpacing: '.12em', fontSize: 13 }}>協同加成（Synergy）</span>
                  <span style={{ color: '#7fe9f7', fontWeight: 700 }}>+{syn.totalPct}%</span>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="d2-btn flex-1" onClick={maxSynergies} disabled={syn.sources.length === 0}>⚡ 一鍵點滿相關協同</button>
                  <button type="button" className="d2-btn is-quiet" onClick={resetSynergies} disabled={syn.sources.length === 0} title="清空此技能的協同投入">重置</button>
                </div>
                <div className="d2-sub">會把「{selected.name ?? selected.nameEn}」與所有為它增傷的協同技能點到上限（並補上必要的前置技能各 1 點）。</div>
                {syn.sources.length === 0 ? (
                  <div className="d2-sub">此技能沒有接收協同加成。</div>
                ) : (
                  <ul className="space-y-1.5">
                    {syn.sources.map((x) => (
                      <li key={x.skill.id}>
                        <button type="button" onClick={() => jumpTo(x.skill.id)} className="d2-row w-full text-left" style={{ cursor: 'pointer' }}>
                          <span className="min-w-0 flex-1">
                            <span className="t-gold">{x.skill.name ?? x.skill.nameEn}</span>
                            <span className="t-dim text-xs ml-2">每點 +{x.perPoint}%</span>
                            <span className="d2-bar block mt-1"><i style={{ width: `${(x.points / x.skill.maxLvl) * 100}%` }} /></span>
                          </span>
                          <span className={`text-xs ${x.points > 0 ? 't-gold' : 't-dim'}`} style={{ whiteSpace: 'nowrap' }}>{x.points} / {x.skill.maxLvl}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {targets.length > 0 && <div className="d2-sub">本技能同時為 {targets.map((x) => x.name ?? x.nameEn).join('、')} 增傷。</div>}
              </div>
              <div className="d2-sub">已投入技能點合計 {totalInvested}；遊戲的技能點上限（{level - 1} 點＋任務獎勵）尚未強制檢查。{CLASS_CODE_ZH[classCode]}。</div>
            </>
          ) : (
            <div className="d2-sub text-center py-10">請在左側點選技能</div>
          )}
        </div>
      </div>
    </div>
  );
};
