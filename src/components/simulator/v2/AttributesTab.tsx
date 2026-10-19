import React, { useState } from 'react';
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

export const AttributesTab: React.FC<Props> = ({ className, level, result, alloc, remaining, needStr, needDex, onAdd, onAutoReq, onAllVit, onReset, mainSkill, targetRes, onTargetRes, buffs, onToggleBuff, enemyReduction }) => {
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
                <div className="d2-row is-attr flex-1">
                  <span className="k">{label}</span>
                  <span className={`v ${bad ? 'is-bad' : ''}`} title={bad ? '未達裝備需求' : undefined}>{a[key]}</span>
                </div>
                <button
                  type="button" className="d2-plus" aria-label={`${label} 加點`}
                  disabled={remaining <= 0}
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
          <div className="d2-sub">點擊 ＋1，Shift ＋5；右鍵或 Alt 點擊 −1（Shift −5）。配點：力 {alloc.str}　敏 {alloc.dex}　體 {alloc.vit}　能 {alloc.ene}</div>
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
