import React, { useMemo } from 'react';
import { categoryOfEntry, eligibleBases, getSocketables, socketCapacity, socketEffectMods, type CatalogEntry } from '../../../engine/catalog';
import { gameData } from '../../../engine/data';
import { describeModifiers } from '../../../engine/describe';
import type { Equipped } from './types';

interface Props {
  eq: Equipped;
  level: number;
  onChange: (patch: Partial<Equipped>) => void;
  onChangeBase: (baseCode: string) => void;
}

const runeName = (code: string) => gameData.gems.find((g) => g.code === code)?.name ?? code;

export const SocketEditor: React.FC<Props> = ({ eq, level, onChange, onChangeBase }) => {
  const entry: CatalogEntry = eq.entry;
  const cap = socketCapacity(entry);
  const cat = categoryOfEntry(entry);
  const all = useMemo(() => getSocketables(), []);
  const bases = useMemo(() => eligibleBases(entry), [entry]);

  const effect = (id: string) => {
    const s = all.find((x) => x.id === id); if (!s) return '';
    return describeModifiers(socketEffectMods(s, cat), 1, level).map((l) => l.text).join('，');
  };
  const count = cap.fixed ? cap.count : Math.max(cap.count, Math.min(eq.socketCount ?? cap.count, cap.max));
  const socks = eq.sockets ?? [];
  const setSock = (i: number, id: string) => {
    const next = Array.from({ length: count }, (_, k) => socks[k] ?? '');
    next[i] = id;
    onChange({ sockets: next.filter((x, k) => x || k < count) });
  };

  const opt = (kind: 'rune' | 'gem' | 'jewel', label: string) => (
    <optgroup label={label}>
      {all.filter((s) => s.kind === kind).map((s) => <option key={s.id} value={s.id}>{s.name}　{effect(s.id)}</option>)}
    </optgroup>
  );

  return (
    <div className="mt-3 space-y-2 text-xs">
      {entry.kind === 'runeword' && bases.length > 1 && (
        <label className="flex items-center gap-2 text-sanctuary-300">底材
          <select value={entry.baseCode} onChange={(e) => onChangeBase(e.target.value)} className="flex-1 bg-sanctuary-950 border border-sanctuary-600 text-sanctuary-100 px-1 py-0.5">
            {bases.map((b) => <option key={b.code} value={b.code}>{b.name}（{b.nameEn}）{b.tier === 'elite' ? ' 精英' : b.tier === 'exceptional' ? ' 卓越' : ' 普通'}{b.class ? ' · 職業專屬' : ''} · 需求力量 {b.reqStr ?? 0}</option>)}
          </select>
        </label>
      )}
      {entry.kind === 'runeword' && (
        <div className="text-sanctuary-300">符文：{(entry.sockets ?? []).map(runeName).join(' + ')}<span className="text-sanctuary-500">（符文本身的鑲嵌效果已計入）</span></div>
      )}
      {!cap.fixed && cap.max > cap.count && (
        <label className="flex items-center gap-2 text-sanctuary-300">孔數
          <select value={count} onChange={(e) => { const n = Number(e.target.value); onChange({ socketCount: n, sockets: socks.slice(0, n) }); }} className="bg-sanctuary-950 border border-sanctuary-600 text-sanctuary-100 px-1 py-0.5">
            {Array.from({ length: cap.max - cap.count + 1 }, (_, i) => <option key={i} value={cap.count + i}>{cap.count + i}</option>)}
          </select>
          <span className="text-sanctuary-500">{cap.count > 0 ? `自帶 ${cap.count} 孔，` : ''}最多 {cap.max} 孔</span>
        </label>
      )}
      {entry.kind !== 'runeword' && count > 0 && (
        <div className="space-y-1">
          <div className="text-sanctuary-300">鑲嵌（{count} 孔）</div>
          {Array.from({ length: count }, (_, i) => (
            <select key={i} aria-label={`第 ${i + 1} 孔`} value={socks[i] ?? ''} onChange={(e) => setSock(i, e.target.value)}
              className="w-full bg-sanctuary-950 border border-sanctuary-600 text-sanctuary-100 px-1 py-1">
              <option value="">（空）</option>
              {opt('rune', '符文')}{opt('gem', '寶石')}{opt('jewel', '珠寶（暗金）')}
            </select>
          ))}
          <div className="text-sanctuary-500">魔法／稀有珠寶的詞綴為隨機，尚未支援；目前可放暗金珠寶（彩虹刻面）。</div>
        </div>
      )}
      {entry.kind !== 'runeword' && cap.max === 0 && <div className="text-sanctuary-500">此物品沒有鑲孔</div>}
    </div>
  );
};
