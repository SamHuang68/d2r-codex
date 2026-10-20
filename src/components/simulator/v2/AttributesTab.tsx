import React, { useEffect, useState } from 'react';
import { MF_KIND_ZH, marginalUnique, mfSummary } from '../../../engine/magicFind';
import type { CharacterResult } from '../../../engine/types';
import type { Alloc } from './types';
import { skillByName, tabName } from '../../../engine/skills';

interface Props {
  className: string;
  level: number;
  result: CharacterResult;
  alloc: Alloc;
  remaining: number;
  needStr: number;
  needDex: number;
  onAdd: (k: keyof Alloc, n: number) => void;
  /** 直接設定配點（已限制在 0～可用點數內） */
  onSet: (k: keyof Alloc, value: number) => void;
  onAutoReq: () => void;
  onAllVit: () => void;
  onReset: () => void;
  mainSkill?: { name: string; level: number; text: string; targetText?: string } | null;
  targetRes: number;
  onTargetRes: (n: number) => void;
  buffs: { id: string; name: string; level: number; alwaysOn: boolean; on: boolean; source: string; lines: { supported: boolean; text: string }[] }[];
  onToggleBuff: (id: string) => void;
  enemyReduction: Partial<Record<string, number>>;
}

const fmt = (n: number) => n.toLocaleString('en-US');

const ATTRS: { key: keyof Alloc; label: string }[] = [
  { key: 'str', label: '力量' }, { key: 'dex', label: '敏捷' }, { key: 'vit', label: '體能' }, { key: 'ene', label: '能量' },
];

const MORE: { label: string; stat: string; suffix?: string }[] = [
  { label: '快速施法速度 (FCR)', stat: 'item_fastercastrate', suffix: '%' },
  { label: '快速打擊恢復 (FHR)', stat: 'item_fastergethitrate', suffix: '%' },
  { label: '快速格擋速度 (FBR)', stat: 'item_fasterblockrate', suffix: '%' },
  { label: '攻擊速度 (IAS)', stat: 'item_fasterattackrate', suffix: '%' },
  { label: '跑步／行走速度', stat: 'item_fastermovevelocity', suffix: '%' },
  { label: '尋獲魔法物品 (MF)', stat: 'item_magicbonus', suffix: '%' },
  { label: '金幣掉落', stat: 'item_goldbonus', suffix: '%' },
  { label: '生命偷取', stat: 'lifedrainmindam', suffix: '%' },
  { label: '法力偷取', stat: 'manadrainmindam', suffix: '%' },
  { label: '粉碎打擊 (CB)', stat: 'item_crushingblow', suffix: '%' },
  { label: '致命打擊 (DS)', stat: 'item_deadlystrike', suffix: '%' },
  { label: '開放傷口 (OW)', stat: 'item_openwounds', suffix: '%' },
  { label: '物理傷害降低（%）', stat: 'damageresist', suffix: '%' },
  { label: '物理傷害降低（固定）', stat: 'normal_damage_reduction' },
  { label: '魔法傷害降低', stat: 'magic_damage_reduction' },
  { label: '生命回復／秒', stat: 'hpregen' },
  { label: '無法凍結', stat: 'item_cannotbefrozen' },
];

const Row: React.FC<{ label: string; value: string; tone?: string; title?: string }> = ({ label, value, tone, title }) => (
  <div className="d2-row" title={title}>
    <span className="k">{label}</span>
    <span className={`v ${tone ?? ''}`}>{value}</span>
  </div>
);


/**
 * 直接輸入屬性總值（遊戲角色頁顯示的那個數字）。
 * 輸入 T → 配點 = T −（起始＋裝備＋技能加成）；低於基礎值或超過可用點數時自動夾住並提示。
 * 操作：點擊自動全選、Enter／離開欄位套用、Esc 取消、↑↓ ±1（Shift ±10）。
 */
const AttrInput: React.FC<{ label: string; total: number; base: number; alloc: number; maxAlloc: number; bad: boolean; onCommit: (alloc: number) => void }> = ({ label, total, base, alloc, maxAlloc, bad, onCommit }) => {
  const [text, setText] = useState(String(total));
  const [focused, setFocused] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => { if (!focused) setText(String(total)); }, [total, focused]);
  useEffect(() => { if (!note) return; const t = window.setTimeout(() => setNote(null), 3500); return () => window.clearTimeout(t); }, [note]);

  const commit = (raw: string) => {
    const t = raw.trim();
    if (!/^-?\d+$/.test(t)) { setText(String(total)); return; } // 不是整數：還原，不改配點
    const n = Number(t);
    const want = Math.round(n) - base; const next = Math.max(0, Math.min(maxAlloc, want));
    if (want < 0) setNote(`最低 ${base}（起始＋裝備），已調整`);
    else if (want > maxAlloc) setNote(`點數不足，最高 ${base + maxAlloc}，已調整`);
    onCommit(next); setText(String(base + next));
  };
  const step = (d: number) => { const next = Math.max(0, Math.min(maxAlloc, alloc + d)); onCommit(next); setText(String(base + next)); };

  return (
    <div className="d2-row is-attr flex-1" style={{ position: 'relative' }}>
      <span className="k">{label}</span>
      <input
        className={`d2-attr-input ${bad ? 'is-bad' : ''}`} inputMode="numeric" value={text} aria-label={`${label}（直接輸入總值）`}
        title={`${bad ? '未達裝備需求。' : ''}起始＋裝備 ${base}，配點 ${alloc}。直接輸入想要的總值`}
        onFocus={(e) => { setFocused(true); e.currentTarget.select(); }}
        onBlur={(e) => { setFocused(false); commit(e.currentTarget.value); }}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { commit(e.currentTarget.value); e.currentTarget.select(); }
          else if (e.key === 'Escape') { setText(String(total)); e.currentTarget.blur(); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); step(e.shiftKey ? 10 : 1); }
          else if (e.key === 'ArrowDown') { e.preventDefault(); step(e.shiftKey ? -10 : -1); }
        }}
      />
      {note && <span role="status" className="d2-sub" style={{ position: 'absolute', right: 8, bottom: -16, color: 'var(--bad)', whiteSpace: 'nowrap', zIndex: 2 }}>{note}</span>}
    </div>
  );
};

export const AttributesTab: React.FC<Props> = ({ className, level, result, alloc, remaining, needStr, needDex, onAdd, onSet, onAutoReq, onAllVit, onReset, mainSkill, targetRes, onTargetRes, buffs, onToggleBuff, enemyReduction }) => {
  const [more, setMore] = useState(false);
  const a = result.attributes;
  const unmet: Record<string, boolean> = { str: a.str < needStr, dex: a.dex < needDex };
  const res = result.resist; const raw = result.rawResist; const mx = result.maxResist;
  const resRows: [string, number, number, number, string][] = [
    ['火焰抗性', res.fire, raw.fire, mx.fire, 't-fire'], ['電擊抗性', res.lightning, raw.lightning, mx.lightning, 't-lightning'],
    ['冰寒抗性', res.cold, raw.cold, mx.cold, 't-cold'], ['毒素抗性', res.poison, raw.poison, mx.poison, 't-poison'],
  ];
  const wd = result.weaponDamage;
  const s = result.stats;
  const mfRaw = s.item_magicbonus ?? 0;
  const moreRows = MORE.map((m) => ({ ...m, v: s[m.stat] ?? 0 })).filter((m) => m.v);
  const skillRows: string[] = [];
  if (result.skills.all) skillRows.push(`所有技能 +${result.skills.all}`);
  Object.entries(result.skills.byClass).forEach(([c, v]) => skillRows.push(`${c} 技能 +${v}`));
  Object.entries(result.skills.byTab).forEach(([t, v]) => skillRows.push(`${tabName(Number(t)) ?? `技能樹 #${t}`} +${v}`));
  Object.entries(result.skills.single).forEach(([n, v]) => skillRows.push(`${skillByName(n)?.name ?? n} +${v}`));

  return (
    <div>
      <div className="d2-title" style={{ fontSize: 13, padding: '2px 0 12px', marginBottom: 12 }}>
        {className}　<span style={{ fontFamily: 'Cinzel, serif', letterSpacing: '.1em' }}>LV {level}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.35fr] gap-4">
        {/* 左：四屬性＋加點 */}
        <div className="space-y-2">
          {ATTRS.map(({ key, label }) => {
            const bad = unmet[key] ?? false;
            return (
              <div key={key} className="flex gap-2 items-stretch">
                <AttrInput label={label} total={a[key]} base={a[key] - alloc[key]} alloc={alloc[key]} maxAlloc={alloc[key] + remaining} bad={bad} onCommit={(v) => onSet(key, v)} />
                <button
                  type="button" className="d2-plus" aria-label={`${label} 加點`}
                  disabled={remaining <= 0}
                  title="點擊 ＋1；Shift ＋5"
                  onClick={(e) => (e.altKey ? onAdd(key, e.shiftKey ? -5 : -1) : onAdd(key, e.shiftKey ? 5 : 1))}
                  onContextMenu={(e) => { e.preventDefault(); onAdd(key, e.shiftKey ? -5 : -1); }}
                >＋</button>
              </div>
            );
          })}
          <div className="d2-row" style={{ justifyContent: 'center', color: remaining > 0 ? 'var(--bad)' : 'var(--dim)' }}>
            {remaining > 0 ? `還有 ${remaining} 點屬性點數` : '屬性點已分配完畢'}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={onAutoReq} className="d2-btn">一鍵滿足裝備需求</button>
            <button type="button" onClick={onAllVit} className="d2-btn">剩餘全灌體能</button>
            <button type="button" onClick={onReset} className="d2-btn is-quiet">重置配點</button>
          </div>
          <div className="d2-sub">直接點數字輸入總值（Enter 套用，↑↓ 微調，Shift ×10）；或點 ＋1／Shift ＋5，右鍵或 Alt 點擊 −1。配點：力 {alloc.str}　敏 {alloc.dex}　體 {alloc.vit}　能 {alloc.ene}</div>
        </div>

        {/* 右：結果欄位 */}
        <div className="space-y-1.5">
          <Row label="攻擊傷害（武器，未含技能）" value={wd ? `${fmt(wd.min)}–${fmt(wd.max)}` : '—'} tone="t-set" />
          {mainSkill && <Row label={`主力技能：${mainSkill.name}${mainSkill.level ? ` Lv${mainSkill.level}` : ''}`} value={mainSkill.text} tone="t-set" title="遊戲技能表值（含協同、專精）；未含武器與傷害加成" />}
          {mainSkill?.targetText && <Row label="　" value={mainSkill.targetText} tone="t-gold" />}
          <Row label="防禦" value={fmt(result.defense)} />
          <Row label="耐力" value={`${fmt(result.stamina)} / ${fmt(result.stamina)}`} tone="t-magic" />
          <Row label="生命" value={`${fmt(result.life)} / ${fmt(result.life)}`} tone="t-magic" />
          <Row label="法力" value={`${fmt(result.mana)} / ${fmt(result.mana)}`} tone="t-magic" />
          <Row label="格擋機率" value={`${result.blockChance}%`} />
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {resRows.map(([n, v, r, m, c]) => (
              <div key={n} className="d2-row" title={`未截斷 ${r}%，上限 ${m}%`}>
                <span className={`k ${c}`}>{n}</span>
                <span className={`v ${v < 0 ? 't-bad' : v >= m ? 't-set' : ''}`}>{v}%</span>
              </div>
            ))}
          </div>
          {result.requirementsUnmet.length > 0 && (
            <div className="d2-toast" style={{ fontSize: 12 }}>
              未達需求：{result.requirementsUnmet.map((u) => `${u.slot} 需 ${u.need}`).join('；')}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="t-gold text-sm tracking-[.2em] mb-2" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>戰鬥條件</div>
        <div className="d2-row" style={{ flexWrap: 'wrap' }}>
          <label className="d2-field">目標抗性
            <select className="d2-select" value={[0, 25, 50, 75, 100].includes(targetRes) ? targetRes : 'custom'} onChange={(e) => { if (e.target.value !== 'custom') onTargetRes(Number(e.target.value)); }} aria-label="目標抗性預設">
              {[0, 25, 50, 75, 100].map((n) => <option key={n} value={n}>{n === 100 ? '100（免疫）' : `${n}%`}</option>)}
              <option value="custom">自訂</option>
            </select>
            <input type="number" className="d2-input" style={{ width: 70 }} min={-100} max={100} value={targetRes} onChange={(e) => onTargetRes(Math.max(-100, Math.min(100, Number(e.target.value) || 0)))} aria-label="目標抗性數值" />%
          </label>
          <span className="d2-sub">只影響主力技能的元素傷害；穿透（專精、衝擊光環、裝備）會先降低抗性{Object.keys(enemyReduction).length > 0 ? `（光環降低敵人抗性：${Object.entries(enemyReduction).map(([k, v]) => `${k} ${v}%`).join('、')}）` : ''}。</span>
        </div>
        <div className="mt-2 space-y-1.5">
          {buffs.length === 0 && <div className="d2-sub">目前沒有可用的增益／光環。投入光環或戰吼技能，或裝備提供光環（如無限）後會出現在這裡。</div>}
          {buffs.map((b) => (
            <div key={b.id} className="d2-row" style={{ alignItems: 'flex-start' }}>
              <label className="flex items-start gap-3 cursor-pointer min-w-0 flex-1">
                <input type="checkbox" className="d2-check mt-0.5" checked={b.on} disabled={b.alwaysOn} onChange={() => onToggleBuff(b.id)} aria-label={`啟用 ${b.name}`} />
                <span className="min-w-0">
                  <span className="t-gold">{b.name}</span><span className="t-dim text-xs ml-2">Lv {b.level}　{b.source}{b.alwaysOn ? '（恆啟用）' : ''}</span>
                  {b.lines.map((l, i) => <span key={i} className={`block text-xs ${l.supported ? 't-magic' : 't-dim'}`}>{l.text}</span>)}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {mfRaw > 0 && (
        <div className="mt-5" aria-label="尋寶效益">
          <div className="t-gold text-sm tracking-[.2em] mb-1.5" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>尋 寶 效 益</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <Row label="MF（裝備合計）" value={`${mfRaw}%`} tone="t-unique" title="裝備提供的魔法物品尋獲率（含依等級成長的部分）" />
            {s.item_goldbonus ? <Row label="金幣掉落" value={`${s.item_goldbonus}%`} /> : null}
            {mfSummary(mfRaw).filter((l) => l.kind !== 'magic').map((l) => (
              <Row key={l.kind} label={`${MF_KIND_ZH[l.kind]}有效 MF`} value={`${Math.floor(l.effective)}%（掉落約 ×${l.multiplier.toFixed(2)}）`}
                title="有效 MF ＝ MF×係數÷(MF＋係數)，係數：暗金 250、套裝 500、稀有 600；魔法物品沒有遞減" />
            ))}
            <Row label="魔法物品" value={`${mfRaw}%（無遞減）`} />
          </div>
          <div className="d2-sub mt-1">再加 1% MF 約讓暗金有效 MF +{marginalUnique(mfRaw).toFixed(2)}%：MF 越高，每點越不划算。公式為社群整理，沒有在遊戲內逐項實測；傭兵尚未模擬，不含傭兵提供的 MF。</div>
        </div>
      )}

      <button type="button" onClick={() => setMore((v) => !v)} className="mt-5 t-gold text-sm tracking-wider" aria-expanded={more} style={{ background: 'none', border: 0, cursor: 'pointer' }}>
        {more ? '▼' : '▶'} 更多數值　<span className="t-dim">（遊戲角色頁沒有，模擬器獨有）</span>
      </button>
      {more && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {moreRows.length === 0 && <div className="t-dim text-sm">目前沒有這類加成</div>}
          {moreRows.map((m) => <Row key={m.stat} label={m.label} value={`${m.v}${m.suffix ?? ''}`} />)}
          {skillRows.length > 0 && <div className="sm:col-span-2 d2-row text-sm"><span className="k">技能加成</span><span className="t-magic text-right">{skillRows.join('、')}</span></div>}
          <div className="sm:col-span-2 d2-sub">FCR／FHR 斷點影格、光環／戰吼／BO／變身、元素專精尚未實作，數值不含這些來源。</div>
        </div>
      )}
    </div>
  );
};
