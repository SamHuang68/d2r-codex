import React, { useState } from 'react';
import type { CharacterResult } from '../../../engine/types';
import type { Alloc } from './types';

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
}

const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (n?: number) => (n ? `${n}%` : '0%');

const ATTRS: { key: keyof Alloc; label: string; res: 'str' | 'dex' | 'vit' | 'ene' }[] = [
  { key: 'str', label: '力量', res: 'str' }, { key: 'dex', label: '敏捷', res: 'dex' },
  { key: 'vit', label: '體能', res: 'vit' }, { key: 'ene', label: '能量', res: 'ene' },
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

export const AttributesTab: React.FC<Props> = ({ className, level, result, alloc, remaining, needStr, needDex, onAdd, onAutoReq, onAllVit, onReset }) => {
  const [more, setMore] = useState(false);
  const a = result.attributes;
  const unmetKey: Record<string, boolean> = { str: a.str < needStr, dex: a.dex < needDex };
  const res = result.resist; const raw = result.rawResist; const mx = result.maxResist;
  const resRows: [string, number, number, number, string][] = [
    ['火焰抗性', res.fire, raw.fire, mx.fire, 'text-d2-fire'], ['電擊抗性', res.lightning, raw.lightning, mx.lightning, 'text-d2-lightning'],
    ['冰寒抗性', res.cold, raw.cold, mx.cold, 'text-d2-cold'], ['毒素抗性', res.poison, raw.poison, mx.poison, 'text-d2-poison'],
  ];
  const wd = result.weaponDamage;
  const s = result.stats;
  const moreRows = MORE.map((m) => ({ ...m, v: s[m.stat] ?? 0 })).filter((m) => m.v);
  const skillRows: string[] = [];
  if (result.skills.all) skillRows.push(`所有技能 +${result.skills.all}`);
  Object.entries(result.skills.byClass).forEach(([c, v]) => skillRows.push(`${c} 技能 +${v}`));
  Object.entries(result.skills.byTab).forEach(([t, v]) => skillRows.push(`技能樹 #${t} +${v}`));
  Object.entries(result.skills.single).forEach(([n, v]) => skillRows.push(`${n} +${v}`));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 text-xs">
        <button type="button" onClick={onAutoReq} className="px-2 py-1 border border-d2-gold/50 text-d2-gold hover:bg-d2-gold/10">一鍵滿足裝備需求</button>
        <button type="button" onClick={onAllVit} className="px-2 py-1 border border-d2-gold/50 text-d2-gold hover:bg-d2-gold/10">剩餘全灌體能</button>
        <button type="button" onClick={onReset} className="px-2 py-1 border border-sanctuary-600 text-sanctuary-300 hover:bg-sanctuary-700">重置配點</button>
        <span className="text-sanctuary-400 self-center">點擊 ＋1，Shift ＋5；右鍵／Alt 點擊 −1（Shift −5）</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-3">
        <div className="space-y-2">
          {ATTRS.map(({ key, label, res: rk }) => {
            const bad = unmetKey[key] ?? false;
            const gear = a[rk] - (/* 起始＋配點由引擎總和反推 */ a[rk]) ;
            void gear;
            return (
              <div key={key} className="flex gap-2 items-stretch">
                <div className="flex-1 flex justify-between items-center border border-sanctuary-600 bg-sanctuary-950 px-3 py-2">
                  <span className="text-sanctuary-200">{label}</span>
                  <b className={`tabular-nums text-lg ${bad ? 'text-red-400' : 'text-d2-magic'}`} title={bad ? '未達裝備需求' : undefined}>{a[rk]}</b>
                </div>
                <button
                  type="button" aria-label={`${label} 加點`}
                  disabled={remaining <= 0}
                  onClick={(e) => (e.altKey ? onAdd(key, e.shiftKey ? -5 : -1) : onAdd(key, e.shiftKey ? 5 : 1))}
                  onContextMenu={(e) => { e.preventDefault(); onAdd(key, e.shiftKey ? -5 : -1); }}
                  className="w-10 border border-d2-gold bg-d2-gold/10 text-d2-gold text-xl hover:bg-d2-gold/20 disabled:opacity-30"
                >＋</button>
              </div>
            );
          })}
          <div className={`text-center border border-sanctuary-600 py-2 ${remaining > 0 ? 'text-red-400' : 'text-sanctuary-400'}`}>
            {remaining > 0 ? `還有 ${remaining} 點屬性點數` : '屬性點已分配完畢'}
          </div>
          <div className="text-xs text-sanctuary-500">{className} · Lv {level} · 配點：力 {alloc.str} 敏 {alloc.dex} 體 {alloc.vit} 能 {alloc.ene}</div>
        </div>

        <div className="space-y-1.5">
          <Row label="攻擊傷害（武器，未含技能）" value={wd ? `${fmt(wd.min)}–${fmt(wd.max)}` : '—'} tone="text-d2-set" />
          <Row label="防禦" value={fmt(result.defense)} />
          <Row label="耐力" value={`${fmt(result.stamina)} / ${fmt(result.stamina)}`} tone="text-d2-magic" />
          <Row label="生命" value={`${fmt(result.life)} / ${fmt(result.life)}`} tone="text-d2-magic" />
          <Row label="法力" value={`${fmt(result.mana)} / ${fmt(result.mana)}`} tone="text-d2-magic" />
          <Row label="格擋機率" value={`${result.blockChance}%`} />
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {resRows.map(([n, v, r, m, c]) => (
              <div key={n} className="flex justify-between border border-sanctuary-600 bg-sanctuary-950 px-2 py-1" title={`未截斷 ${r}%，上限 ${m}%`}>
                <span className={c}>{n}</span><b className={v < 0 ? 'text-red-400' : v >= m ? 'text-d2-set' : 'text-sanctuary-100'}>{v}%</b>
              </div>
            ))}
          </div>
          {result.requirementsUnmet.length > 0 && (
            <div className="text-xs text-red-400 border border-red-500/40 p-2">
              未達需求：{result.requirementsUnmet.map((u) => `${u.slot} 需 ${u.need}`).join('；')}
            </div>
          )}
        </div>
      </div>

      <button type="button" onClick={() => setMore((v) => !v)} className="mt-4 text-sm text-d2-gold" aria-expanded={more}>
        {more ? '▼' : '▶'} 更多數值（遊戲角色頁沒有，模擬器獨有）
      </button>
      {more && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {moreRows.length === 0 && <div className="text-sanctuary-500 text-sm">目前沒有這類加成</div>}
          {moreRows.map((m) => <Row key={m.stat} label={m.label} value={`${m.v}${m.suffix ?? ''}`} />)}
          {skillRows.length > 0 && <div className="sm:col-span-2 border border-sanctuary-600 bg-sanctuary-950 px-2 py-1 text-sm"><span className="text-sanctuary-300">技能加成：</span>{skillRows.join('、')}</div>}
          <div className="sm:col-span-2 text-xs text-sanctuary-500">
            FCR/FHR 斷點影格、技能傷害、光環／戰吼／BO／變身尚未實作，數值不含這些來源。
          </div>
        </div>
      )}
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; tone?: string }> = ({ label, value, tone }) => (
  <div className="flex justify-between items-center border border-sanctuary-600 bg-sanctuary-950 px-3 py-1.5">
    <span className="text-sanctuary-300 text-sm">{label}</span>
    <b className={`tabular-nums ${tone ?? 'text-sanctuary-100'}`}>{value}</b>
  </div>
);
void pct;
