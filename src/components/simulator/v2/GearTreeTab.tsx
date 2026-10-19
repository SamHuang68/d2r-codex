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

const tone = (k: Rarity) => (k === 'set' ? 't-set' : k === 'unique' || k === 'runeword' ? 't-unique' : 't-base');
const iconRarity = (e: CatalogEntry) => (e.kind === 'base' ? (e.slot === 'charm' ? 'charm' : 'prop') : e.kind === 'unique' ? 'unique' : e.kind);

const Check: React.FC<{ on: boolean; label: string; onChange: () => void }> = ({ on, label, onChange }) => (
  <label className="inline-flex items-center gap-2 mr-5 mb-2 cursor-pointer text-sm">
    <input type="checkbox" checked={on} onChange={onChange} className="d2-check" />{label}
  </label>
);

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="t-gold text-sm tracking-[.2em] mt-3 mb-2" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>{children}</div>
);

const Node: React.FC<{ label: string; n: number; open: boolean; onClick: () => void; indent?: number }> = ({ label, n, open, onClick, indent = 0 }) => (
  <button type="button" onClick={onClick} aria-expanded={open} className="d2-node" style={{ marginLeft: indent }}>
    <span>{label}</span><span className="n">{n} 項</span><span className="chev">{open ? '▲' : '▼'}</span>
  </button>
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
      <div className="d2-sub mb-3">
        仿遊戲「拾取篩選器」：先以核取框縮小範圍，再依 類別 → 強度 → 一般／職業專屬 展開。把項目拖到左側對應槽位，或按「穿戴」。
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋名稱（中／英）…" className="d2-input w-full mb-2" aria-label="搜尋裝備" />

      <Section>稀有度</Section>
      <div>{RARITIES.map((r) => <Check key={r} on={rarity[r]} label={RARITY_ZH[r]} onChange={() => setRarity((o) => ({ ...o, [r]: !o[r] }))} />)}</div>
      <Section>品質</Section>
      <div>
        {TIERS.map((t) => <Check key={t} on={tiers[t]} label={TIER_ZH[t]} onChange={() => setTiers((o) => ({ ...o, [t]: !o[t] }))} />)}
        <Check on={onlyMyClass} label="隱藏其他職業專屬" onChange={() => setOnlyMyClass((v) => !v)} />
      </div>

      <Section>裝備（共 {filtered.length} 項）</Section>
      <div className="space-y-1">
        {GROUPS.map((g) => {
          const gOpen = !!open[g];
          return (
            <div key={g}>
              <Node label={GROUP_ZH[g]} n={count(`${g}|`)} open={gOpen} onClick={() => toggle(g)} />
              {gOpen && (
                <div className="mt-1 space-y-1">
                  {tierNames.map((tn) => {
                    const tk = `${g}|${tn}`; const n = count(`${tk}|`); if (!n) return null; const tOpen = !!open[tk];
                    return (
                      <div key={tk}>
                        <Node label={tn} n={n} open={tOpen} onClick={() => toggle(tk)} indent={16} />
                        {tOpen && ['一般', '職業專屬'].map((cn) => {
                          const lk = `${tk}|${cn}`; const list = tree.get(lk); if (!list?.length) return null; const lOpen = !!open[lk];
                          return (
                            <div key={lk} className="mt-1">
                              <Node label={cn} n={list.length} open={lOpen} onClick={() => toggle(lk)} indent={32} />
                              {lOpen && (
                                <ul className="mt-1 space-y-1" style={{ marginLeft: 48 }}>
                                  {list.slice(0, MAX_PER_LEAF).map((e) => (
                                    <li key={e.id}>
                                      <div draggable className="d2-item"
                                        onDragStart={(ev) => { ev.dataTransfer.setData('text/plain', e.id); ev.dataTransfer.effectAllowed = 'copy'; onDragStart(e); }}
                                        onDragEnd={() => onDragStart(null)}>
                                        <div className="d2-well shrink-0" style={{ width: 56, height: 56 }}>
                                          <ItemIcon name={e.name} nameEn={e.nameEn} baseItem={e.baseNameEn} slot={e.slot} rarity={iconRarity(e)} fit="fill" showBorder={false} />
                                        </div>
                                        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setDetail(detail === e.id ? null : e.id)}>
                                          <div className={`truncate font-semibold ${tone(e.kind)}`}>{e.name}<span className="ml-2 text-xs t-dim font-normal">{e.nameEn}</span></div>
                                          <div className="truncate text-xs t-dim">{SLOT_ZH[e.slot]} · {e.baseName}{e.classCode ? ` · ${CLASS_ZH[e.classCode]}專用` : ''}{e.levelReq ? ` · 需求 Lv${e.levelReq}` : ''}{e.setName ? ` · ${e.setName}` : ''}</div>
                                        </div>
                                        <button type="button" onClick={() => onEquip(e)} className="d2-btn shrink-0" style={{ padding: '3px 12px' }}>穿戴</button>
                                      </div>
                                      {detail === e.id && (
                                        <div className="d2-tip my-1">
                                          <div className={`nm ${tone(e.kind)}`}>{e.name}</div>
                                          <div className="base">{e.baseName}</div>
                                          {describeModifiers(e.mods, 1, level).map((l, i) => <div key={i} className={`mod ${l.known ? '' : 'is-unknown'}`}>{l.text}</div>)}
                                          {e.sockets && <div className="hint">符文：{e.sockets.join(' + ')}（鑲嵌效果已計入）</div>}
                                          {e.mods.length === 0 && <div className="hint">基礎底材，無額外屬性</div>}
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                  {list.length > MAX_PER_LEAF && <li className="text-xs t-dim px-2">僅顯示前 {MAX_PER_LEAF} 項，請用搜尋縮小範圍</li>}
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
