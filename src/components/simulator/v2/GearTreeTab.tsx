import React, { useMemo, useState } from 'react';
import { getCatalog, CLASS_ZH, GROUP_ZH, RARITY_ZH, SLOT_ZH, TIER_ZH, type CatalogEntry, type Group, type Rarity, type Tier } from '../../../engine/catalog';
import { describeModifiers } from '../../../engine/describe';
import { ItemIcon } from '../../common/ItemIcon';

interface Props {
  level: number;
  engineClassCode: string;
  onEquip: (entry: CatalogEntry) => void;
  onDragStart: (entry: CatalogEntry | null) => void;
}

const RARITIES: Rarity[] = ['unique', 'set', 'runeword', 'base'];
const TIERS: Tier[] = ['normal', 'exceptional', 'elite'];
const GROUPS: Group[] = ['armor', 'weapon', 'jewelry'];
const MAX_PER_LEAF = 150;

const rarityTone = (k: Rarity) => (k === 'set' ? 'text-d2-set' : k === 'unique' || k === 'runeword' ? 'text-d2-unique' : 'text-sanctuary-100');
const iconRarity = (e: CatalogEntry) => (e.kind === 'base' ? (e.slot === 'charm' ? 'charm' : 'prop') : e.kind === 'unique' ? 'unique' : e.kind);

const Check: React.FC<{ on: boolean; label: string; onChange: () => void }> = ({ on, label, onChange }) => (
  <label className="inline-flex items-center gap-1.5 mr-4 mb-1 cursor-pointer text-sm text-sanctuary-200">
    <input type="checkbox" checked={on} onChange={onChange} className="accent-yellow-600" />{label}
  </label>
);

export const GearTreeTab: React.FC<Props> = ({ level, engineClassCode, onEquip, onDragStart }) => {
  const [rarity, setRarity] = useState<Record<Rarity, boolean>>({ unique: true, set: true, runeword: true, base: false });
  const [tiers, setTiers] = useState<Record<Tier, boolean>>({ normal: true, exceptional: true, elite: true });
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({ 'armor': true });
  const [onlyMyClass, setOnlyMyClass] = useState(true);
  const [detail, setDetail] = useState<string | null>(null);

  const all = useMemo(() => getCatalog(), []);
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => all.filter((e) => {
    if (!rarity[e.kind]) return false;
    if (e.tier && !tiers[e.tier]) return false;
    if (onlyMyClass && e.classCode && e.classCode !== engineClassCode) return false;
    if (q && !(e.name.toLowerCase().includes(q) || e.nameEn.toLowerCase().includes(q) || e.baseName.toLowerCase().includes(q) || e.baseNameEn.toLowerCase().includes(q))) return false;
    return true;
  }), [all, rarity, tiers, q, onlyMyClass, engineClassCode]);

  // 類別 → 強度 → 一般／職業專屬
  const tree = useMemo(() => {
    const out = new Map<string, CatalogEntry[]>();
    for (const e of filtered) {
      const tier = e.tier ? TIER_ZH[e.tier] : '不分強度';
      const k = `${e.group}|${tier}|${e.classCode ? '職業專屬' : '一般'}`;
      (out.get(k) ?? out.set(k, []).get(k)!).push(e);
    }
    out.forEach((v) => v.sort((a, b) => (a.levelReq ?? 0) - (b.levelReq ?? 0) || a.name.localeCompare(b.name)));
    return out;
  }, [filtered]);

  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const count = (prefix: string) => [...tree.entries()].filter(([k]) => k.startsWith(prefix)).reduce((s, [, v]) => s + v.length, 0);
  const tierNames = [...TIERS.map((t) => TIER_ZH[t]), '不分強度'];

  return (
    <div>
      <div className="text-xs text-sanctuary-400 mb-2">
        仿遊戲「拾取篩選器」：先以核取框縮小範圍，再依 類別 → 強度 → 一般／職業專屬 展開。拖曳項目到左側對應槽位，或按「穿戴」。
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋名稱（中／英）…"
        className="w-full mb-3 bg-sanctuary-950 border border-sanctuary-600 px-3 py-1.5 text-sm text-sanctuary-100" aria-label="搜尋裝備" />

      <div className="mb-1 text-d2-gold text-sm font-semibold">稀有度</div>
      <div>{RARITIES.map((r) => <Check key={r} on={rarity[r]} label={RARITY_ZH[r]} onChange={() => setRarity((o) => ({ ...o, [r]: !o[r] }))} />)}</div>
      <div className="mb-1 mt-1 text-d2-gold text-sm font-semibold">品質</div>
      <div>
        {TIERS.map((t) => <Check key={t} on={tiers[t]} label={TIER_ZH[t]} onChange={() => setTiers((o) => ({ ...o, [t]: !o[t] }))} />)}
        <Check on={onlyMyClass} label="隱藏其他職業專屬" onChange={() => setOnlyMyClass((v) => !v)} />
      </div>

      <div className="mt-2 text-d2-gold text-sm font-semibold">裝備（共 {filtered.length} 項）</div>
      <div className="mt-1 space-y-1">
        {GROUPS.map((g) => {
          const gk = g; const gOpen = !!open[gk];
          return (
            <div key={g}>
              <button type="button" onClick={() => toggle(gk)} aria-expanded={gOpen}
                className="w-full flex items-center justify-between border border-sanctuary-600 bg-sanctuary-950 px-3 py-2 text-sanctuary-100">
                <span>{GROUP_ZH[g]}</span><span className="text-xs text-sanctuary-400">{count(`${g}|`)} 項 {gOpen ? '▲' : '▼'}</span>
              </button>
              {gOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {tierNames.map((tn) => {
                    const tk = `${g}|${tn}`; const n = count(`${tk}|`); if (!n) return null; const tOpen = !!open[tk];
                    return (
                      <div key={tk}>
                        <button type="button" onClick={() => toggle(tk)} aria-expanded={tOpen}
                          className="w-full flex items-center justify-between border border-sanctuary-700 bg-sanctuary-900 px-3 py-1.5 text-sanctuary-200 text-sm">
                          <span>{tn}</span><span className="text-xs text-sanctuary-400">{n} 項 {tOpen ? '▲' : '▼'}</span>
                        </button>
                        {tOpen && ['一般', '職業專屬'].map((cn) => {
                          const lk = `${tk}|${cn}`; const list = tree.get(lk); if (!list?.length) return null; const lOpen = !!open[lk];
                          return (
                            <div key={lk} className="ml-4 mt-1">
                              <button type="button" onClick={() => toggle(lk)} aria-expanded={lOpen}
                                className="w-full flex items-center justify-between border border-sanctuary-700 bg-sanctuary-900/60 px-3 py-1 text-sanctuary-300 text-sm">
                                <span>{cn}</span><span className="text-xs text-sanctuary-400">{list.length} 項 {lOpen ? '▲' : '▼'}</span>
                              </button>
                              {lOpen && (
                                <ul className="mt-1 space-y-1">
                                  {list.slice(0, MAX_PER_LEAF).map((e) => (
                                    <li key={e.id}>
                                      <div draggable onDragStart={(ev) => { ev.dataTransfer.setData('text/plain', e.id); ev.dataTransfer.effectAllowed = 'copy'; onDragStart(e); }} onDragEnd={() => onDragStart(null)}
                                        className="flex items-center gap-2 border border-sanctuary-700 bg-sanctuary-850 px-2 py-1 cursor-grab hover:border-d2-gold/50">
                                        <ItemIcon name={e.name} nameEn={e.nameEn} baseItem={e.baseNameEn} slot={e.slot} rarity={iconRarity(e)} size="sm" showBorder={false} />
                                        <div className="min-w-0 flex-1" onClick={() => setDetail(detail === e.id ? null : e.id)}>
                                          <div className={`truncate ${rarityTone(e.kind)}`}>{e.name}<span className="ml-2 text-xs text-sanctuary-500">{e.nameEn}</span></div>
                                          <div className="truncate text-xs text-sanctuary-400">{SLOT_ZH[e.slot]} · {e.baseName}{e.classCode ? ` · ${CLASS_ZH[e.classCode]}專用` : ''}{e.levelReq ? ` · 需求 Lv${e.levelReq}` : ''}{e.setName ? ` · ${e.setName}` : ''}</div>
                                        </div>
                                        <button type="button" onClick={() => onEquip(e)} className="shrink-0 text-xs border border-d2-gold/60 text-d2-gold px-2 py-0.5 hover:bg-d2-gold/10">穿戴</button>
                                      </div>
                                      {detail === e.id && (
                                        <ul className="ml-10 my-1 text-xs space-y-0.5 text-d2-magic">
                                          {describeModifiers(e.mods, 1, level).map((l, i) => <li key={i} className={l.known ? '' : 'text-red-400'}>{l.text}</li>)}
                                          {e.sockets && <li className="text-sanctuary-400">符文：{e.sockets.join(' + ')}（鑲嵌效果已計入）</li>}
                                          {e.mods.length === 0 && <li className="text-sanctuary-500">基礎底材，無額外屬性</li>}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                  {list.length > MAX_PER_LEAF && <li className="text-xs text-sanctuary-500 px-2">僅顯示前 {MAX_PER_LEAF} 項，請用搜尋縮小範圍</li>}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
