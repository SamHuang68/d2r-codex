import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCatalog, CLASS_ZH, GROUP_ZH, RARITY_ZH, SLOT_ZH, TIER_ZH, type CatalogEntry, type Group, type Rarity, type Tier } from '../../../engine/catalog';
import { describeModifiers } from '../../../engine/describe';
import { ItemIcon } from '../../common/ItemIcon';
import { imageForEntry } from '../../../utils/catalogImage';

interface Props {
  open: boolean;
  onClose: () => void;
  level: number;
  engineClassCode: string;
  onEquip: (entry: CatalogEntry) => void;
  onDragStart: (entry: CatalogEntry | null) => void;
  /** 從「樹狀裝備庫」分頁的快速入口直接跳到某一類 */
  jump?: { group: Group; seq: number } | null;
}

const RARITIES: Rarity[] = ['unique', 'set', 'runeword', 'base'];
const TIERS: Tier[] = ['normal', 'exceptional', 'elite'];
const GROUPS: Group[] = ['armor', 'weapon', 'jewelry'];
const KINDS = ['一般', '職業專屬'];
const NO_TIER = '不分強度';
const MAX_LIST = 150;
const WIDTH = 440;
const TOP_MIN = 64;
const POS_KEY = 'd2sim.gearPicker.pos';

const tone = (k: Rarity) => (k === 'set' ? 't-set' : k === 'unique' || k === 'runeword' ? 't-unique' : 't-base');
const iconRarity = (e: CatalogEntry) => (e.kind === 'base' ? (e.slot === 'charm' ? 'charm' : 'prop') : e.kind === 'unique' ? 'unique' : e.kind);

const readPos = (): { x: number; y: number } | null => {
  try {
    const v = JSON.parse(window.localStorage.getItem(POS_KEY) || 'null');
    return v && typeof v.x === 'number' && typeof v.y === 'number' ? v : null;
  } catch { return null; }
};
const writePos = (p: { x: number; y: number }) => { try { window.localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch { /* 無痕或封鎖時略過 */ } };

const useWide = () => {
  const q = '(min-width: 1280px)';
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q); const f = () => setWide(m.matches);
    m.addEventListener('change', f); f();
    return () => m.removeEventListener('change', f);
  }, []);
  return wide;
};

/** 窄螢幕底部抽屜要讓出左側導覽欄：側欄寬度會隨「收合」變動（176 ↔ 48），需即時量測；<1024px 側欄隱藏時為 0 */
const useSideNavWidth = () => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = document.querySelector('aside');
    if (!el) { setW(0); return; }
    const measure = () => setW(getComputedStyle(el).display === 'none' ? 0 : Math.round(el.getBoundingClientRect().width));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  return w;
};

const Chip: React.FC<{ on: boolean; label: string; onClick: () => void }> = ({ on, label, onClick }) => (
  <button type="button" aria-pressed={on} onClick={onClick} className={`d2-chip ${on ? 'is-on' : ''}`}>{label}</button>
);

export const GearPicker: React.FC<Props> = ({ open, onClose, level, engineClassCode, onEquip, onDragStart, jump }) => {
  const wide = useWide();
  const sideW = useSideNavWidth();
  const [rarity, setRarity] = useState<Record<Rarity, boolean>>({ unique: true, set: true, runeword: true, base: false });
  const [tiers, setTiers] = useState<Record<Tier, boolean>>({ normal: true, exceptional: true, elite: true });
  const [onlyMyClass, setOnlyMyClass] = useState(true);
  const [query, setQuery] = useState('');
  const [path, setPath] = useState<string[]>([]);
  const [flat, setFlat] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [dragSource, setDragSource] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(() => (typeof window === 'undefined' ? null : readPos()));
  const winRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<{ dx: number; dy: number } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const all = useMemo(() => getCatalog(), []);
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => all.filter((e) => {
    if (!rarity[e.kind]) return false;
    if (e.tier && !tiers[e.tier]) return false;
    if (onlyMyClass && e.classCode && e.classCode !== engineClassCode) return false;
    if (q && !(e.name.toLowerCase().includes(q) || e.nameEn.toLowerCase().includes(q) || e.baseName.toLowerCase().includes(q) || e.baseNameEn.toLowerCase().includes(q))) return false;
    return true;
  }), [all, rarity, tiers, q, onlyMyClass, engineClassCode]);

  // 類別 → 強度 → 一般／職業專屬（與原樹狀分層一致）
  const tree = useMemo(() => {
    const out = new Map<string, CatalogEntry[]>();
    for (const e of filtered) {
      const tier = e.tier ? TIER_ZH[e.tier] : NO_TIER;
      const k = `${e.group}|${tier}|${e.classCode ? '職業專屬' : '一般'}`;
      (out.get(k) ?? out.set(k, []).get(k)!).push(e);
    }
    return out;
  }, [filtered]);
  const sortList = (l: CatalogEntry[]) => [...l].sort((a, b) => (a.levelReq ?? 0) - (b.levelReq ?? 0) || a.name.localeCompare(b.name));
  const entriesUnder = useCallback((prefix: string[]) => {
    const p = prefix.join('|');
    const out: CatalogEntry[] = [];
    tree.forEach((v, k) => { if (!p || k === p || k.startsWith(`${p}|`)) out.push(...v); });
    return out;
  }, [tree]);
  const countUnder = (prefix: string[]) => entriesUnder(prefix).length;

  // 預設位置：靠右、頂部列下方；只在寬螢幕使用
  useEffect(() => {
    if (!open || !wide || pos) return;
    setPos({ x: Math.max(8, window.innerWidth - WIDTH - 24), y: 80 });
  }, [open, wide, pos]);
  // 視窗縮放時把位置夾回可視範圍
  useEffect(() => {
    if (!wide) return;
    const fit = () => setPos((p) => (p ? { x: Math.min(Math.max(8, p.x), Math.max(8, window.innerWidth - WIDTH - 8)), y: Math.min(Math.max(TOP_MIN, p.y), Math.max(TOP_MIN, window.innerHeight - 120)) } : p));
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [wide]);

  // 從分頁快速入口跳到某類
  useEffect(() => { if (jump) { setPath([jump.group]); setFlat(false); setQuery(''); setDetail(null); } }, [jump?.seq]); // eslint-disable-line react-hooks/exhaustive-deps
  // 換層就回到清單頂端
  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }); }, [path, flat, q]);
  // 換職業等造成路徑無內容時不用處理：節點數量即時重算

  const onTitleDown = (e: React.PointerEvent) => {
    if (!wide || (e.target as HTMLElement).closest('button')) return;
    const r = winRef.current?.getBoundingClientRect(); if (!r) return;
    moveRef.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onTitleMove = (e: React.PointerEvent) => {
    const m = moveRef.current; if (!m) return;
    const h = winRef.current?.offsetHeight ?? 200;
    setPos({
      x: Math.min(Math.max(8, e.clientX - m.dx), Math.max(8, window.innerWidth - WIDTH - 8)),
      y: Math.min(Math.max(TOP_MIN, e.clientY - m.dy), Math.max(TOP_MIN, window.innerHeight - Math.min(h, 120))),
    });
  };
  const onTitleUp = () => { if (moveRef.current) { moveRef.current = null; setPos((p) => { if (p) writePos(p); return p; }); } };

  if (!open) return null;

  const searching = q.length > 0;
  const showList = searching || flat || path.length >= 3;
  const list = showList ? sortList(searching ? filtered : entriesUnder(path)) : [];
  const levelOptions: { label: string; n: number; next: string[] }[] =
    path.length === 0 ? GROUPS.map((g) => ({ label: GROUP_ZH[g], n: countUnder([g]), next: [g] }))
    : path.length === 1 ? [...TIERS.map((t) => TIER_ZH[t]), NO_TIER].map((t) => ({ label: t, n: countUnder([path[0], t]), next: [path[0], t] }))
    : KINDS.map((k) => ({ label: k, n: countUnder([path[0], path[1], k]), next: [path[0], path[1], k] }));
  const crumbLabels = path.map((p, i) => (i === 0 ? GROUP_ZH[p as Group] ?? p : p));
  const goUp = () => { if (flat) { setFlat(false); return; } setPath((p) => p.slice(0, -1)); };
  const rarityText = RARITIES.filter((r) => rarity[r]).map((r) => RARITY_ZH[r]).join('・') || '未選';
  const tierText = TIERS.filter((t) => tiers[t]).map((t) => TIER_ZH[t]).join('・') || '未選';

  const floatStyle: React.CSSProperties = wide
    ? (pos ? { left: pos.x, top: pos.y, width: WIDTH, height: minimized ? 'auto' : 'min(72vh, 680px)' } : {})
    : { left: sideW };

  return (
    <>
      <div
        ref={winRef}
        role="dialog"
        aria-label="裝備庫"
        aria-modal="false"
        className={`d2-float ${minimized ? 'is-min' : ''} ${dragSource ? 'is-dragging' : ''}`}
        style={floatStyle}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      >
        <div className="d2-float-title" onPointerDown={onTitleDown} onPointerMove={onTitleMove} onPointerUp={onTitleUp} onPointerCancel={onTitleUp}>
          <span className="d2-float-name">裝 備 庫</span>
          <span className="d2-sub" style={{ marginRight: 'auto' }}>{wide ? '可拖曳標題移動' : '底部抽屜'}</span>
          <button type="button" className="d2-icon-btn" onClick={() => setMinimized((v) => !v)} aria-label={minimized ? '展開裝備庫' : '收合裝備庫'} title={minimized ? '展開' : '收合'}>{minimized ? '▢' : '—'}</button>
          <button type="button" className="d2-icon-btn" onClick={onClose} aria-label="關閉裝備庫" title="關閉（Esc）">✕</button>
        </div>

        {!minimized && (
          <>
            <div className="d2-float-tools">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋名稱（中／英）、底材…" className="d2-input w-full" aria-label="搜尋裝備" />
              <button type="button" className="d2-filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((v) => !v)}>
                <span>篩選</span>
                <span className="d2-filter-sum">{rarityText}｜{tierText}{onlyMyClass ? '｜隱藏他職專屬' : ''}</span>
                <span aria-hidden>{filtersOpen ? '▲' : '▼'}</span>
              </button>
              {filtersOpen && (
                <div className="d2-filter-box">
                  <div className="d2-filter-row"><span className="k">稀有度</span>{RARITIES.map((r) => <Chip key={r} on={rarity[r]} label={RARITY_ZH[r]} onClick={() => setRarity((o) => ({ ...o, [r]: !o[r] }))} />)}</div>
                  <div className="d2-filter-row"><span className="k">品質</span>{TIERS.map((t) => <Chip key={t} on={tiers[t]} label={TIER_ZH[t]} onClick={() => setTiers((o) => ({ ...o, [t]: !o[t] }))} />)}</div>
                  <div className="d2-filter-row"><span className="k">職業</span><Chip on={onlyMyClass} label="隱藏其他職業專屬" onClick={() => setOnlyMyClass((v) => !v)} /></div>
                </div>
              )}
            </div>

            <nav className="d2-crumbs" aria-label="目前層級">
              <button type="button" className="d2-icon-btn" disabled={searching || (path.length === 0 && !flat)} onClick={goUp} aria-label="回上一層" title="回上一層">←</button>
              {searching ? (
                <span className="t-gold">搜尋結果</span>
              ) : (
                <>
                  <button type="button" className={`d2-crumb ${path.length === 0 ? 'is-here' : ''}`} onClick={() => { setPath([]); setFlat(false); }}>全部</button>
                  {crumbLabels.map((l, i) => (
                    <React.Fragment key={i}>
                      <span className="t-dim" aria-hidden>›</span>
                      <button type="button" className={`d2-crumb ${i === path.length - 1 && !flat ? 'is-here' : ''}`} onClick={() => { setPath(path.slice(0, i + 1)); setFlat(false); }}>{l}</button>
                    </React.Fragment>
                  ))}
                  {flat && <><span className="t-dim" aria-hidden>›</span><span className="t-gold">全部列出</span></>}
                </>
              )}
              <span className="d2-crumbs-n">{showList ? list.length : countUnder(path)} 項</span>
            </nav>

            <div ref={bodyRef} className="d2-float-body">
              {!showList && (
                <div className="space-y-1.5">
                  {path.length > 0 && countUnder(path) > 0 && (
                    <button type="button" className="d2-node is-all" onClick={() => setFlat(true)}>
                      <span>直接列出此層全部</span><span className="n">{countUnder(path)} 項</span><span className="chev">☰</span>
                    </button>
                  )}
                  {levelOptions.map((o) => (
                    <button key={o.label} type="button" className="d2-node" disabled={o.n === 0} onClick={() => setPath(o.next)} style={o.n === 0 ? { opacity: .4, cursor: 'not-allowed' } : undefined}>
                      <span>{o.label}</span><span className="n">{o.n} 項</span><span className="chev">›</span>
                    </button>
                  ))}
                  {countUnder(path) === 0 && <div className="d2-empty">目前篩選條件下沒有項目，請展開「篩選」放寬範圍。</div>}
                </div>
              )}

              {showList && (
                <ul className="space-y-1">
                  {list.slice(0, MAX_LIST).map((e) => (
                    <li key={e.id}>
                      <div
                        draggable
                        className="d2-item"
                        onDragStart={(ev) => { ev.dataTransfer.setData('text/plain', e.id); ev.dataTransfer.effectAllowed = 'copy'; onDragStart(e); setDragSource(true); }}
                        onDragEnd={() => { onDragStart(null); setDragSource(false); }}
                      >
                        <div className="d2-well shrink-0" style={{ width: 56, height: 56 }}>
                          <ItemIcon name={e.name} nameEn={e.nameEn} baseItem={e.baseNameEn} slot={e.slot} rarity={iconRarity(e)} imageUrl={imageForEntry(e)} noGuess fit="fill" showBorder={false} />
                        </div>
                        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setDetail(detail === e.id ? null : e.id)}>
                          <div className={`truncate font-semibold ${tone(e.kind)}`}>{e.name}</div>
                          <div className="truncate text-xs t-dim">{e.nameEn}</div>
                          <div className="truncate text-xs t-dim">{SLOT_ZH[e.slot]} · {e.baseName}{e.classCode ? ` · ${CLASS_ZH[e.classCode]}專用` : ''}{e.levelReq ? ` · Lv${e.levelReq}` : ''}{e.setName ? ` · ${e.setName}` : ''}</div>
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
                  {list.length === 0 && <li className="d2-empty">沒有符合的項目。</li>}
                  {list.length > MAX_LIST && <li className="text-xs t-dim px-2 py-1">僅顯示前 {MAX_LIST} 項，請用搜尋縮小範圍</li>}
                </ul>
              )}
            </div>

            <div className="d2-float-foot">把項目拖到左側物品欄槽位，或按「穿戴」。</div>
          </>
        )}
      </div>
      {/* 窄螢幕底部抽屜會蓋住頁面下緣，留出等高空間讓頁面仍能捲動到底 */}
      {!wide && !minimized && <div aria-hidden className="d2-float-spacer" />}
    </>
  );
};
