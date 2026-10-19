import React from 'react';
import inventory from '../../../data/game/inventory.json';
import type { CatalogEntry } from '../../../engine/catalog';
import { ItemIcon } from '../../common/ItemIcon';
import { imageForEntry } from '../../../utils/catalogImage';
import { DOLL_SLOT_ZH, type DollSlot, type EquippedMap } from './types';

interface InvRow { class: string; [k: string]: string | number }
const INV = inventory as unknown as InvRow[];

/** 遊戲 inventory.txt 座標（原始面板 320×441）放大倍率 */
const SCALE = 1.5;
const PANEL_LEFT = 320;
const DOLL_W = 480;
const DOLL_H = 662;

type Box = { l: number; t: number; w: number; h: number };
const box = (row: InvRow, key: string): Box => ({
  l: ((row[`${key}Left`] as number) - PANEL_LEFT) * SCALE,
  t: (row[`${key}Top`] as number) * SCALE,
  w: (row[`${key}Width`] as number) * SCALE,
  h: (row[`${key}Height`] as number) * SCALE,
});

const rarityOf = (e: CatalogEntry) => (e.kind === 'base' ? (e.slot === 'charm' ? 'charm' : 'prop') : e.kind === 'unique' ? 'unique' : e.kind);
const toneOf = (e: CatalogEntry) => (e.kind === 'set' ? 't-set' : e.kind === 'unique' || e.kind === 'runeword' ? 't-unique' : 't-base');

interface Props {
  engineClass: string;
  equipped: EquippedMap;
  charms: CatalogEntry[];
  swap: 'I' | 'II';
  onSwap: (s: 'I' | 'II') => void;
  dragging: CatalogEntry | null;
  canDrop: (slot: DollSlot | 'charms', entry: CatalogEntry) => string | null;
  onDropItem: (slot: DollSlot | 'charms', entry: CatalogEntry) => void;
  onRemoveCharm: (index: number) => void;
  selected: DollSlot | null;
  onSelect: (slot: DollSlot | null) => void;
  unmet: Record<string, boolean>;
}

const GRID_COLS = 10;
const GRID_ROWS = 4;

/** 護身符在 10×4 背包的簡易排列：由上而下、由左而右找第一個放得下的位置 */
export function packCharms(charms: CatalogEntry[]): { entry: CatalogEntry; x: number; y: number; ok: boolean }[] {
  const used = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false));
  return charms.map((entry) => {
    const w = entry.width || 1; const h = entry.height || 1;
    for (let x = 0; x < GRID_COLS; x++) {
      for (let y = 0; y + h <= GRID_ROWS && x + w <= GRID_COLS; y++) {
        let free = true;
        for (let dx = 0; dx < w && free; dx++) for (let dy = 0; dy < h; dy++) if (used[y + dy][x + dx]) { free = false; break; }
        if (free) { for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < h; dy++) used[y + dy][x + dx] = true; return { entry, x, y, ok: true }; }
      }
    }
    return { entry, x: 0, y: 0, ok: false };
  });
}
export const canFitCharm = (charms: CatalogEntry[], extra: CatalogEntry) => packCharms([...charms, extra]).every((p) => p.ok);

const SwapTabs: React.FC<{ swap: 'I' | 'II'; onSwap: (s: 'I' | 'II') => void; style: React.CSSProperties }> = ({ swap, onSwap, style }) => (
  <div className="absolute flex gap-1 z-10" style={style} role="group" aria-label="武器切換">
    {(['I', 'II'] as const).map((s) => (
      <button key={s} type="button" aria-pressed={swap === s} onClick={() => onSwap(s)}
        className="d2-tab" style={{ flex: 'none', width: 40, padding: '3px 0', fontFamily: 'Cinzel, serif', fontSize: 13 }} aria-selected={swap === s}>{s}</button>
    ))}
  </div>
);

export const PaperDollV2: React.FC<Props> = ({ engineClass, equipped, charms, swap, onSwap, dragging, canDrop, onDropItem, onRemoveCharm, selected, onSelect, unmet }) => {
  const row = INV.find((r) => r.class === engineClass) ?? INV.find((r) => r.class === 'Sorceress') ?? INV[0];
  const slots: { key: DollSlot; b: Box }[] = [
    { key: 'head', b: box(row, 'head') }, { key: 'neck', b: box(row, 'neck') }, { key: 'body', b: box(row, 'torso') },
    { key: swap === 'I' ? 'weaponI' : 'weaponII', b: box(row, 'rArm') }, { key: swap === 'I' ? 'shieldI' : 'shieldII', b: box(row, 'lArm') },
    { key: 'gloves', b: box(row, 'gloves') }, { key: 'ring1', b: box(row, 'rHand') }, { key: 'belt', b: box(row, 'belt') },
    { key: 'ring2', b: box(row, 'lHand') }, { key: 'boots', b: box(row, 'feet') },
  ];
  const gridL = ((row.gridLeft as number) - PANEL_LEFT) * SCALE; const gridT = (row.gridTop as number) * SCALE;
  const cell = ((row.gridBoxWidth as number) || 29) * SCALE;
  const packed = packCharms(charms);
  const [hover, setHover] = React.useState<string | null>(null);
  // 手機窄螢幕：以縮放保持遊戲座標不變（不產生橫向捲動）
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / DOLL_W));
    update();
    const ro = new ResizeObserver(update); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dropHandlers = (target: DollSlot | 'charms') => ({
    onDragOver: (e: React.DragEvent) => { if (dragging) { e.preventDefault(); setHover(target); } },
    onDragLeave: () => setHover(null),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setHover(null); if (dragging) onDropItem(target, dragging); },
  });
  const dragState = (target: DollSlot | 'charms') => {
    if (!dragging) return '';
    const err = canDrop(target, dragging);
    if (hover === target) return err ? 'is-over-bad' : 'is-over-ok';
    return err ? '' : 'is-valid';
  };
  const gridRing = dragState('charms');

  return (
    <div ref={wrapRef} className="w-full min-w-0 mx-auto overflow-hidden" style={{ maxWidth: DOLL_W, height: DOLL_H * scale }}>
      <div className="relative select-none origin-top-left" style={{ width: DOLL_W, height: DOLL_H, transform: `scale(${scale})` }} aria-label="裝備欄">
        {/* 面板底：石材＋暈影，讓槽位像嵌在石板上 */}
        <div className="absolute inset-0 d2-well" style={{ background: 'var(--noise), radial-gradient(70% 55% at 50% 38%, #251e15 0%, #0e0b08 100%)' }} />
        <SwapTabs swap={swap} onSwap={onSwap} style={{ left: 30, top: 34 }} />
        <SwapTabs swap={swap} onSwap={onSwap} style={{ left: 376, top: 34 }} />

        {slots.map(({ key, b }) => {
          const eq = equipped[key];
          const isSel = selected === key;
          return (
            <div
              key={key}
              role="button" tabIndex={0}
              title={eq ? `${eq.entry.name}（${eq.entry.nameEn}）` : DOLL_SLOT_ZH[key]}
              onClick={() => onSelect(eq ? (isSel ? null : key) : null)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelect(eq ? key : null); }}
              {...dropHandlers(key)}
              className={`d2-slot ${isSel ? 'is-selected' : ''} ${unmet[key] ? 'is-unmet' : ''} ${dragState(key)}`}
              style={{ left: b.l, top: b.t, width: b.w, height: b.h }}
            >
              {eq ? (
                <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden p-1">
                  <div className="flex-1 min-h-0 w-full" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.8))' }}>
                    <ItemIcon name={eq.entry.name} nameEn={eq.entry.nameEn} baseItem={eq.entry.baseNameEn} slot={eq.entry.slot} rarity={rarityOf(eq.entry)} imageUrl={imageForEntry(eq.entry)} noGuess fit="fill" showBorder={false} />
                  </div>
                  {b.h > 60 && <span className={`d2-slot-name ${toneOf(eq.entry)}`}>{eq.entry.name}{eq.ethereal ? '（無形）' : ''}</span>}
                </div>
              ) : (
                <span className="d2-slot-empty">{DOLL_SLOT_ZH[key].replace(/ [I]+$/, '')}</span>
              )}
            </div>
          );
        })}

        {/* 背包 10×4 與護身符 */}
        <div
          className="absolute grid d2-well"
          style={{ left: gridL, top: gridT, width: cell * GRID_COLS, height: cell * GRID_ROWS, gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
            outline: gridRing === 'is-valid' ? '1px solid var(--gold)' : gridRing === 'is-over-ok' ? '2px solid #6fe06f' : gridRing === 'is-over-bad' ? '2px solid #ff5e50' : 'none' }}
          {...dropHandlers('charms')}
          aria-label="背包（護身符）"
        >
          {Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => <i key={i} style={{ boxShadow: 'inset 0 0 0 1px #1f1a12' }} />)}
        </div>
        {packed.map((p, i) => p.ok && (
          <div key={`${p.entry.id}-${i}`} className="absolute flex items-center justify-center cursor-pointer"
            style={{ left: gridL + p.x * cell + 1, top: gridT + p.y * cell + 1, width: cell * (p.entry.width || 1) - 2, height: cell * (p.entry.height || 1) - 2,
              background: 'rgba(30, 30, 80, .35)', boxShadow: 'inset 0 0 0 1px #5a5ad0, inset 0 0 10px rgba(80,80,255,.25)' }}
            title={`${p.entry.name}（點擊卸下）`} onClick={() => onRemoveCharm(i)}>
            <ItemIcon name={p.entry.name} nameEn={p.entry.nameEn} baseItem={p.entry.baseNameEn} slot="charm" rarity={rarityOf(p.entry)} imageUrl={imageForEntry(p.entry)} noGuess fit="fill" showBorder={false} />
          </div>
        ))}
        <div className="absolute d2-well flex items-center justify-center t-dim" style={{ right: 20, bottom: 20, width: 60, height: 60, fontSize: 12, letterSpacing: '.2em' }}>方塊</div>
        <div className="absolute t-dim" style={{ left: 28, bottom: 14, fontSize: 11 }}>護身符只有放在背包內才生效（遊戲規則）</div>
      </div>
    </div>
  );
};
