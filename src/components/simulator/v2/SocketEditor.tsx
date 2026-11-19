import React, { useMemo, useState } from 'react';
import { categoryOfEntry, eligibleBases, findSocketable, getSocketables, socketCapacity, socketEffectMods, TIER_ZH, type CatalogEntry } from '../../../engine/catalog';
import {
  CUSTOM_JEWEL_AFFIXES,
  CUSTOM_JEWEL_PRESETS,
  MAX_CUSTOM_JEWEL_AFFIXES,
  decodeCustomJewelAffixes,
  encodeCustomJewel,
  isCustomJewelId,
  type CustomJewelAffixEntry,
} from '../../../engine/customJewel';
import { gameData } from '../../../engine/data';
import { describeModifiers } from '../../../engine/describe';
import type { Equipped } from './types';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  eq: Equipped;
  level: number;
  onChange: (patch: Partial<Equipped>) => void;
  onChangeBase: (baseCode: string) => void;
}

const runeName = (code: string, en: boolean) => { const gem = gameData.gems.find(g => g.code === code); return (en ? gem?.nameEn : gem?.name) ?? code; };
const PRESET_IDS = new Set(CUSTOM_JEWEL_PRESETS.map((p) => p.id));

/** 單孔自訂魔法／稀有珠寶的內嵌編輯器（最多 4 條詞綴） */
const CustomJewelInlineEditor: React.FC<{
  initialId: string;
  onApply: (id: string) => void;
  onCancel: () => void;
}> = ({ initialId, onApply, onCancel }) => {
  const { isEn } = useLanguage();
  const [rows, setRows] = useState<CustomJewelAffixEntry[]>(() => {
    const parsed = decodeCustomJewelAffixes(initialId);
    return parsed.length > 0 ? parsed : [{ code: 'swing2', value: 15 }, { code: 'dmg%', value: 40 }];
  });

  const usedCodes = new Set(rows.map((r) => r.code));
  const addRow = () => {
    if (rows.length >= MAX_CUSTOM_JEWEL_AFFIXES) return;
    const nextDef = CUSTOM_JEWEL_AFFIXES.find((a) => !usedCodes.has(a.code));
    if (!nextDef) return;
    setRows([...rows, { code: nextDef.code, value: nextDef.defaultVal }]);
  };
  const updateCode = (idx: number, code: string) => {
    const def = CUSTOM_JEWEL_AFFIXES.find((a) => a.code === code);
    if (!def) return;
    setRows(rows.map((r, i) => (i === idx ? { code, value: def.defaultVal } : r)));
  };
  const updateVal = (idx: number, raw: string) => {
    const num = Number(raw);
    if (!Number.isFinite(num)) return;
    setRows(rows.map((r, i) => (i === idx ? { ...r, value: num } : r)));
  };
  const removeRow = (idx: number) => setRows(rows.filter((_, i) => i !== idx));

  const encoded = encodeCustomJewel(rows);

  return (
    <div className="p-2.5 rounded border border-d2-magic/40 bg-sanctuary-950/90 space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-d2-magic font-semibold">{isEn ? 'Custom Magic / Rare Jewel (up to 4 affixes)' : '自訂魔法／稀有珠寶（最多 4 條詞綴）'}</span>
        <button type="button" onClick={onCancel} className="text-sanctuary-400 hover:text-white cursor-pointer">{isEn ? 'Cancel' : '取消'}</button>
      </div>
      <div className="space-y-1.5">
        {rows.map((row, idx) => {
          const def = CUSTOM_JEWEL_AFFIXES.find((a) => a.code === row.code) ?? CUSTOM_JEWEL_AFFIXES[0];
          const fixed = def.min === def.max;
          return (
            <div key={idx} className="flex items-center gap-1.5">
              <select
                aria-label={isEn ? `Affix ${idx + 1}` : `第 ${idx + 1} 條詞綴`}
                value={row.code}
                onChange={(e) => updateCode(idx, e.target.value)}
                className="d2-select flex-1 min-w-0"
              >
                {CUSTOM_JEWEL_AFFIXES.map((a) => (
                  <option key={a.code} value={a.code} disabled={a.code !== row.code && usedCodes.has(a.code)}>
                    {isEn ? a.labelEn : a.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                aria-label={isEn ? `Affix ${idx + 1} value` : `第 ${idx + 1} 條數值`}
                min={def.min}
                max={def.max}
                value={row.value}
                disabled={fixed}
                onChange={(e) => updateVal(idx, e.target.value)}
                className="d2-input w-16 text-center font-mono"
              />
              {rows.length > 1 && (
                <button type="button" onClick={() => removeRow(idx)} aria-label={isEn ? 'Remove affix' : '移除詞綴'} className="d2-btn is-quiet px-2 py-0.5">
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={addRow}
          disabled={rows.length >= MAX_CUSTOM_JEWEL_AFFIXES}
          className="d2-btn is-quiet text-[11px]"
        >
          {isEn ? '+ Add Affix' : '＋ 新增詞綴'}
        </button>
        <button
          type="button"
          onClick={() => { if (encoded) onApply(encoded); }}
          disabled={!encoded}
          className="d2-btn text-[11px]"
        >
          {isEn ? 'Socket Jewel' : '套用此珠寶'}
        </button>
      </div>
    </div>
  );
};

export const SocketEditor: React.FC<Props> = ({ eq, level, onChange, onChangeBase }) => {
  const { isEn } = useLanguage();
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const entry: CatalogEntry = eq.entry;
  const cap = socketCapacity(entry);
  const cat = categoryOfEntry(entry);
  const all = useMemo(() => getSocketables(), []);
  const bases = useMemo(() => eligibleBases(entry), [entry]);

  const effect = (id: string) => {
    const s = findSocketable(id); if (!s) return '';
    return describeModifiers(socketEffectMods(s, cat), 1, level, isEn ? 'en' : 'zh').map((l) => l.text).join('，');
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
      {all.filter((s) => s.kind === kind).map((s) => <option key={s.id} value={s.id}>{isEn ? s.nameEn || s.name : s.name}　{effect(s.id)}</option>)}
    </optgroup>
  );

  return (
    <div className="mt-3 space-y-2 text-xs">
      {entry.kind === 'runeword' && bases.length > 1 && (
        <label className="d2-field w-full">{isEn ? "Base Item" : "底材"}
          <select value={entry.baseCode} onChange={(e) => onChangeBase(e.target.value)} className="d2-select flex-1 min-w-0">
            {bases.map((b) => <option key={b.code} value={b.code}>{isEn ? `${b.nameEn} · ${b.tier ?? 'normal'}${b.class ? ' · Class Specific' : ''} · Req Str ${b.reqStr ?? 0}` : `${b.name}（${b.nameEn}） ${TIER_ZH[b.tier ?? 'normal']}${b.class ? ' · 職業專屬' : ''} · 需求力量 ${b.reqStr ?? 0}`}</option>)}
          </select>
        </label>
      )}
      {entry.kind === 'runeword' && (
        <div className="t-dim">{isEn ? "Runes: " : "符文："}{(entry.sockets ?? []).map(code => runeName(code, isEn)).join(' + ')}<span style={{ color: 'var(--faint)' }}>{isEn ? " (Socketing bonuses from runes/gems already included)" : "（符文本身的鑲嵌效果已計入）"}</span></div>
      )}
      {!cap.fixed && cap.max > cap.count && (
        <label className="d2-field">{isEn ? "Sockets" : "孔數"}
          <select value={count} onChange={(e) => { const n = Number(e.target.value); onChange({ socketCount: n, sockets: socks.slice(0, n) }); }} className="d2-select">
            {Array.from({ length: cap.max - cap.count + 1 }, (_, i) => <option key={i} value={cap.count + i}>{cap.count + i}</option>)}
          </select>
          <span style={{ color: 'var(--faint)' }}>{isEn ? `${cap.count > 0 ? `${cap.count} innate sockets; ` : ''}maximum ${cap.max} sockets` : `${cap.count > 0 ? `自帶 ${cap.count} 孔，` : ''}最多 ${cap.max} 孔`}</span>
        </label>
      )}
      {entry.kind !== 'runeword' && count > 0 && (
        <div className="space-y-1.5">
          <div className="t-dim">{isEn ? `Sockets (${count})` : `鑲嵌（${count} 孔）`}</div>
          {Array.from({ length: count }, (_, i) => {
            const cur = socks[i] ?? '';
            const isAdHocCustom = isCustomJewelId(cur) && !PRESET_IDS.has(cur);
            const curObj = isAdHocCustom ? findSocketable(cur) : undefined;
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <select aria-label={isEn ? `Socket #${i + 1}` : `第 ${i + 1} 孔`} value={cur} onChange={(e) => setSock(i, e.target.value)} className="d2-select flex-1 min-w-0">
                    <option value="">{isEn ? "(Empty)" : "（空）"}</option>
                    {isAdHocCustom && curObj && (
                      <option value={cur}>{isEn ? curObj.nameEn : curObj.name}</option>
                    )}
                    <optgroup label={isEn ? 'Magic / Rare Jewels (Common)' : '珠寶（魔法／稀有常用）'}>
                      {CUSTOM_JEWEL_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>{isEn ? p.nameEn : p.name}</option>
                      ))}
                    </optgroup>
                    {opt('rune', isEn ? 'Runes' : '符文')}{opt('gem', isEn ? 'Gems' : '寶石')}{opt('jewel', isEn ? 'Jewels (Unique)' : '珠寶（暗金）')}
                  </select>
                  <button
                    type="button"
                    onClick={() => setEditingSlot(editingSlot === i ? null : i)}
                    className={`d2-btn shrink-0 text-[11px] ${editingSlot === i || isCustomJewelId(cur) ? '' : 'is-quiet'}`}
                    title={isEn ? 'Customize magic/rare jewel affixes (IAS, ED, All Res, -Req, etc.)' : '自訂魔法／稀有珠寶詞綴（IAS、ED、抗性、減需求等）'}
                  >
                    {isEn ? 'Custom' : '自訂珠寶'}
                  </button>
                </div>
                {editingSlot === i && (
                  <CustomJewelInlineEditor
                    initialId={cur}
                    onApply={(id) => { setSock(i, id); setEditingSlot(null); }}
                    onCancel={() => setEditingSlot(null)}
                  />
                )}
              </div>
            );
          })}
          <div style={{ color: 'var(--faint)' }}>
            {isEn
              ? 'Supports runes, gems, Unique Facets, and custom Magic/Rare jewels (IAS, ED, All Res, Single Res, -15% Req, FHR, Str/Dex/Life/MF).'
              : '支援符文、寶石、暗金彩虹刻面與自訂魔法／稀有珠寶（IAS、ED、全抗／單抗、-15% 需求、FHR、力敏生命、MF）。'}
          </div>
        </div>
      )}
      {entry.kind !== 'runeword' && cap.max === 0 && <div style={{ color: 'var(--faint)' }}>{isEn ? "This item has no sockets" : "此物品沒有鑲孔"}</div>}
    </div>
  );
};
