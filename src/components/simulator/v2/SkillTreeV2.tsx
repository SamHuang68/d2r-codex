import React, { useEffect, useMemo, useState } from 'react';
import { Crosshair, Flame, Shield, Skull, Snowflake, Sparkles, Sword, Zap, Lock } from 'lucide-react';
import { SKILLS_DATA, type SkillData } from '../../../data/skills';
import { getSkillGridPosition } from '../../../data/skills/layout';
import { calculateSkillSynergies, getRelatedSynergySkillIds, SYNERGY_RELATIONS } from '../../../data/skills/synergies';

/** 技能樹頁（沿用既有技能資料、位置表與協同關係；僅重做呈現與操作） */
export interface SkillTreeV2Props {
  className: string;
  level: number;
  skillPoints: Record<string, number>;
  onUpdateSkillPoints: (next: Record<string, number>) => void;
  activeSkillId?: string;
  onSetActiveSkillId: (id: string) => void;
  /** 來自裝備的「全技能＋職業技能」加成（只影響顯示的有效等級，不影響協同——遊戲規則） */
  allSkillsBonus: number;
}

const ROW_LEVELS = [1, 6, 12, 18, 24, 30];
const MAX_POINTS = 20;

function SkillGlyph({ skill }: { skill: SkillData }) {
  const name = skill.name.toLowerCase();
  const tree = skill.tree.toLowerCase();
  const cls = 'w-6 h-6';
  if (name.includes('冰') || name.includes('寒') || name.includes('雪')) return <Snowflake className={`${cls} t-cold`} />;
  if (name.includes('火') || name.includes('炎') || name.includes('燃')) return <Flame className={`${cls} t-fire`} />;
  if (name.includes('電') || name.includes('雷') || name.includes('光') || name.includes('星')) return <Zap className={`${cls} t-lightning`} />;
  if (name.includes('甲') || name.includes('盾') || name.includes('抗') || tree.includes('防禦')) return <Shield className={`${cls} t-poison`} />;
  if (name.includes('箭') || name.includes('瞄準') || name.includes('標槍')) return <Crosshair className={`${cls} t-cold`} />;
  if (name.includes('毒') || name.includes('骨') || name.includes('詛咒') || tree.includes('召喚')) return <Skull className={`${cls} t-magic`} />;
  if (name.includes('打擊') || name.includes('熱誠') || name.includes('旋風') || tree.includes('戰鬥')) return <Sword className={`${cls} t-bad`} />;
  return <Sparkles className={`${cls} t-gold`} />;
}

export const SkillTreeV2: React.FC<SkillTreeV2Props> = ({ className, level, skillPoints, onUpdateSkillPoints, activeSkillId, onSetActiveSkillId, allSkillsBonus }) => {
  const [treeIdx, setTreeIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const classData = SKILLS_DATA.find((c) => c.characterClass === className) || SKILLS_DATA[0];
  const tree = classData.trees[treeIdx] || classData.trees[0];
  const allSkills = useMemo(() => classData.trees.flatMap((t) => t.skills), [classData]);

  // 換職業時回到第一棵樹
  useEffect(() => { setTreeIdx(0); setSelectedId(null); }, [className]);
  useEffect(() => { if (!selectedId && tree?.skills.length) setSelectedId(tree.skills[0].id); }, [tree, selectedId]);

  const selected = allSkills.find((s) => s.id === selectedId) || tree.skills[0] || null;
  const focusId = hoverId || selectedId;
  const partnerIds = useMemo(() => (focusId ? getRelatedSynergySkillIds(focusId) : []), [focusId]);

  const met = (s: SkillData) => !s.prerequisites?.length || s.prerequisites.every((p) => (skillPoints[p] || 0) > 0);
  const pts = (s: SkillData) => skillPoints[s.id] || 0;
  const totalInvested = Object.values(skillPoints).reduce((a, b) => a + b, 0);

  const add = (s: SkillData, n = 1) => {
    const cur = pts(s); const max = s.maxPoints || MAX_POINTS;
    if (cur >= max || !met(s)) return;
    onUpdateSkillPoints({ ...skillPoints, [s.id]: Math.min(max, cur + n) });
  };
  const remove = (s: SkillData, n = 1) => {
    const cur = pts(s); if (cur <= 0) return;
    const next = { ...skillPoints }; const v = cur - n;
    if (v <= 0) delete next[s.id]; else next[s.id] = v;
    onUpdateSkillPoints(next);
  };

  const syn = selected ? calculateSkillSynergies(selected.id, skillPoints) : { incoming: [], outgoing: [], totalIncomingPercent: 0 };
  const maxSynergies = () => {
    if (!selected || syn.incoming.length === 0) return;
    const next = { ...skillPoints, [selected.id]: MAX_POINTS };
    syn.incoming.forEach((i) => { next[i.skillId] = MAX_POINTS; });
    onUpdateSkillPoints(next);
    onSetActiveSkillId(selected.id);
  };
  const resetSynergies = () => {
    if (!selected) return;
    const next = { ...skillPoints };
    syn.incoming.forEach((i) => { delete next[i.skillId]; });
    onUpdateSkillPoints(next);
  };
  const jumpTo = (id: string) => {
    for (let i = 0; i < classData.trees.length; i++) {
      if (classData.trees[i].skills.some((s) => s.id === id)) { setTreeIdx(i); setSelectedId(id); return; }
    }
  };

  // 位置（viewBox 300×600；3 欄 6 列）
  const positions = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    tree.skills.forEach((s, i) => { const p = getSkillGridPosition(s.id, s.requiredLevel, i); m.set(s.id, { x: p.col * 100 + 50, y: p.row * 100 + 50 }); });
    return m;
  }, [tree]);

  const prereqPaths = useMemo(() => {
    const out: { id: string; d: string; on: boolean }[] = [];
    tree.skills.forEach((s) => {
      const to = positions.get(s.id); if (!to) return;
      (s.prerequisites || []).forEach((pre) => {
        const from = positions.get(pre); if (!from) return;
        const y1 = from.y + 30; const y2 = to.y - 32; const mid = (y1 + y2) / 2;
        out.push({ id: `${pre}>${s.id}`, on: (skillPoints[pre] || 0) > 0, d: from.x === to.x ? `M ${from.x} ${y1} L ${to.x} ${y2}` : `M ${from.x} ${y1} L ${from.x} ${mid} L ${to.x} ${mid} L ${to.x} ${y2}` });
      });
    });
    return out;
  }, [tree, positions, skillPoints]);

  const arcs = useMemo(() => {
    if (!focusId) return [];
    const f = positions.get(focusId); if (!f) return [];
    const out: { id: string; d: string }[] = [];
    SYNERGY_RELATIONS.forEach((r) => {
      const other = r.targetId === focusId ? r.sourceId : r.sourceId === focusId ? r.targetId : '';
      const o = other ? positions.get(other) : undefined; if (!o) return;
      const mx = (f.x + o.x) / 2 + (o.y !== f.y ? 34 : 0); const my = (f.y + o.y) / 2 - (o.x !== f.x ? 34 : 0);
      out.push({ id: `${r.sourceId}>${r.targetId}`, d: `M ${f.x} ${f.y} Q ${mx} ${my} ${o.x} ${o.y}` });
    });
    return out;
  }, [focusId, positions]);

  const invested = selected ? pts(selected) : 0;
  const effective = invested > 0 ? invested + allSkillsBonus : 0;

  return (
    <div>
      <div className="d2-tabs" style={{ padding: '0 0 12px' }} role="tablist" aria-label="技能樹">
        {classData.trees.map((t, i) => (
          <button key={t.name} type="button" role="tab" aria-selected={treeIdx === i} className="d2-tab"
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
            {tree.skills.map((s, idx) => {
              const p = getSkillGridPosition(s.id, s.requiredLevel, idx);
              const n = pts(s); const isMax = n >= (s.maxPoints || MAX_POINTS); const unlocked = met(s);
              const cls = ['d2-skill', n > 0 ? 'is-points' : '', isMax ? 'is-max' : '', selectedId === s.id ? 'is-selected' : '', partnerIds.includes(s.id) && selectedId !== s.id ? 'is-synergy' : '', unlocked ? '' : 'is-locked'].join(' ');
              return (
                <div key={s.id} className="absolute" style={{ left: `${(p.col * 100) / 3 + 100 / 6}%`, top: `${(p.row * 100) / 6 + 100 / 12}%`, width: '24%', transform: 'translate(-50%, -50%)' }}>
                  <button type="button" className={cls}
                    aria-label={`${s.name} ${n} 點`} aria-pressed={selectedId === s.id}
                    onClick={() => setSelectedId(s.id)} onDoubleClick={() => add(s)}
                    onContextMenu={(e) => { e.preventDefault(); remove(s); }}
                    onMouseEnter={() => setHoverId(s.id)} onMouseLeave={() => setHoverId(null)}>
                    <SkillGlyph skill={s} />
                    <span className="nm">{s.name}</span>
                    <span className="cnt">{n}</span>
                    {s.synergies && s.synergies.length > 0 && <span className="syn" title={`${s.synergies.length} 項協同關聯`}>⚡</span>}
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
                <div className="nm t-gold">{selected.name}</div>
                <div className="base">{selected.nameEn}　·　{selected.tree}</div>
                <div className="base">需要等級：{selected.requiredLevel}{level < selected.requiredLevel && <span className="t-bad">（目前等級不足）</span>}</div>
                {selected.prerequisites?.length > 0 && (
                  <div className="base">前置：{selected.prerequisites.map((id) => allSkills.find((s) => s.id === id)?.name ?? id).join('、')}</div>
                )}
                <div className="mod" style={{ color: 'var(--text)' }}>{selected.description}</div>
                {selected.details && <div className="hint">{selected.details}</div>}
              </div>

              <div className="d2-row">
                <span className="k">技能等級</span>
                <span className="v t-gold">{effective > 0 ? `Lv ${effective}` : '—'}<span className="t-dim text-xs ml-2 font-normal">（投入 {invested}{allSkillsBonus ? `＋裝備 ${allSkillsBonus}` : ''}）</span></span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="d2-btn is-quiet" onClick={() => remove(selected)} disabled={invested <= 0} aria-label="減 1 點">－</button>
                <button type="button" className="d2-btn flex-1" onClick={() => add(selected)} disabled={invested >= (selected.maxPoints || MAX_POINTS) || !met(selected)} aria-label="加 1 點" style={{ whiteSpace: 'nowrap' }}>＋ 加點</button>
                <button type="button" className="d2-btn" onClick={() => add(selected, MAX_POINTS)} disabled={invested >= (selected.maxPoints || MAX_POINTS) || !met(selected)} style={{ whiteSpace: 'nowrap' }}>MAX</button>
                <button type="button" className={`d2-btn ${activeSkillId === selected.id ? '' : 'is-quiet'}`} onClick={() => onSetActiveSkillId(selected.id)} title="標記為主力技能" style={{ whiteSpace: 'nowrap' }}>{activeSkillId === selected.id ? '★ 主力' : '設為主力'}</button>
              </div>

              {/* 協同 */}
              <div className="d2-well p-3 space-y-2" style={{ boxShadow: 'inset 0 0 14px #000, inset 0 0 0 1px #1f5a63' }}>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#7fe9f7', letterSpacing: '.12em', fontSize: 13 }}>協同加成（Synergy）</span>
                  <span style={{ color: '#7fe9f7', fontWeight: 700 }}>+{syn.totalIncomingPercent}%</span>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="d2-btn flex-1" onClick={maxSynergies} disabled={syn.incoming.length === 0}>⚡ 一鍵點滿相關協同</button>
                  <button type="button" className="d2-btn is-quiet" onClick={resetSynergies} disabled={syn.incoming.length === 0} title="清空此技能的協同投入">重置</button>
                </div>
                <div className="d2-sub">會把「{selected.name}」與所有為它增傷的協同技能點到 {MAX_POINTS} 點。</div>
                {syn.incoming.length === 0 ? (
                  <div className="d2-sub">此技能沒有接收協同加成。</div>
                ) : (
                  <ul className="space-y-1.5">
                    {syn.incoming.map((i) => (
                      <li key={i.skillId}>
                        <button type="button" onClick={() => jumpTo(i.skillId)} className="d2-row w-full text-left" style={{ cursor: 'pointer' }}>
                          <span className="min-w-0">
                            <span className="t-gold">{i.skillName}</span>
                            <span className="t-dim text-xs ml-2">{i.displayText}</span>
                            <span className="d2-bar block mt-1"><i style={{ width: `${(i.points / MAX_POINTS) * 100}%` }} /></span>
                          </span>
                          <span className={`text-xs ${i.points > 0 ? 't-gold' : 't-dim'}`} style={{ whiteSpace: 'nowrap' }}>{i.points} / {MAX_POINTS}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="d2-sub">已投入技能點合計 {totalInvested}；各技能點數與遊戲的總點數上限（{level - 1} 點＋任務獎勵）尚未強制檢查。</div>
            </>
          ) : (
            <div className="d2-sub text-center py-10">請在左側點選技能</div>
          )}
        </div>
      </div>
    </div>
  );
};
