import React from 'react';
import inventory from '../../../data/game/inventory.json';
import type { CatalogEntry } from '../../../engine/catalog';
import { ItemIcon } from '../../common/ItemIcon';
import { DOLL_SLOT_ZH, type DollSlot, type EquippedMap } from './types';

interface InvRow { class: string; [k: string]: string | number }
const INV = inventory as unknown as InvRow[];

/** 遊戲 inventory.txt 座標（原始面板 320×441）放大倍率 */
const SCALE = 1.5;
const PANEL_LEFT = 320;

type Box = { l: number; t: number; w: number; h: number };
const box = (row: InvRow, key: string): Box => ({
  l: ((row[`${key}Left`] as number) - PANEL_LEFT) * SCALE,
  t: (row[`${key}Top`] as number) * SCALE,
  w: (row[`${key}Width`] as number) * SCALE,
  h: (row[`${key}Height`] as number) * SCALE,
});

const rarityOf = (e: CatalogEntry) => (e.kind === 'base' ? (e.slot === 'charm' ? 'charm' : 'prop') : e.kind === 'unique' ? 'unique' : e.kind);

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

  const dropHandlers = (target: DollSlot | 'charms') => ({
    onDragOver: (e: React.DragEvent) => { if (dragging && canDrop(target, dragging) === null) { e.preventDefault(); setHover(target); } else if (dragging) { e.preventDefault(); setHover(target); } },
    onDragLeave: () => setHover(null),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setHover(null); if (dragging) onDropItem(target, dragging); },
  });
  const state = (target: DollSlot | 'charms') => {
    if (!dragging) return '';
    const err = canDrop(target, dragging);
    if (hover === target) return err ? 'ring-2 ring-red-500' : 'ring-2 ring-d2-set';
    return err ? '' : 'ring-1 ring-d2-gold/70';
  };

  return (
    <div className="relative mx-auto bg-sanctuary-800 border border-sanctuary-600 select-none" style={{ width: 480, height: 662, maxWidth: '100%' }} aria-label="裝備欄">
      <div className="absolute top-1 left-2 flex gap-1 z-10">
        {(['I', 'II'] as const).map((s) => (
          <button key={s} type="button" onClick={() => onSwap(s)} className={`px-3 text-xs border ${swap === s ? 'border-d2-gold text-d2-gold' : 'border-sanctuary-600 text-sanctuary-400'}`}>{s}</button>
        ))}
      </div>
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
            className={`absolute flex items-center justify-center border bg-sanctuary-950 cursor-pointer ${isSel ? 'border-d2-gold' : unmet[key] ? 'border-red-500' : 'border-sanctuary-600'} ${state(key)}`}
            style={{ left: b.l, top: b.t, width: b.w, height: b.h }}
          >
            {eq ? (
              <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden p-0.5">
                <div className="flex-1 min-h-0 w-full">
                  <ItemIcon name={eq.entry.name} nameEn={eq.entry.nameEn} baseItem={eq.entry.baseNameEn} slot={eq.entry.slot} rarity={rarityOf(eq.entry)} fit="fill" showBorder={false} />
                </div>
                {b.h > 60 && <span className={`mt-0.5 text-center leading-tight text-[11px] ${eq.entry.kind === 'set' ? 'text-d2-set' : eq.entry.kind === 'unique' ? 'text-d2-unique' : eq.entry.kind === 'runeword' ? 'text-d2-unique' : 'text-sanctuary-200'}`}>{eq.entry.name}{eq.ethereal ? '（無形）' : ''}</span>}
              </div>
            ) : (
              <span className="text-[11px] text-sanctuary-500 text-center px-1">{DOLL_SLOT_ZH[key].replace(/ [I]+$/, '')}</span>
            )}
          </div>
        );
      })}

      {/* 背包 10×4 與護身符 */}
      <div
        className={`absolute grid border border-sanctuary-700 bg-sanctuary-950 ${state('charms')}`}
        style={{ left: gridL, top: gridT, width: cell * GRID_COLS, height: cell * GRID_ROWS, gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}
        {...dropHandlers('charms')}
        aria-label="背包（護身符）"
      >
        {Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => <i key={i} className="border border-sanctuary-800" />)}
      </div>
      {packed.map((p, i) => p.ok && (
        <div key={`${p.entry.id}-${i}`} className="absolute border border-d2-magic bg-sanctuary-900/90 flex items-center justify-center cursor-pointer"
          style={{ left: gridL + p.x * cell, top: gridT + p.y * cell, width: cell * (p.entry.width || 1), height: cell * (p.entry.height || 1) }}
          title={`${p.entry.name}（點擊卸下）`} onClick={() => onRemoveCharm(i)}>
          <ItemIcon name={p.entry.name} nameEn={p.entry.nameEn} baseItem={p.entry.baseNameEn} slot="charm" rarity={rarityOf(p.entry)} fit="fill" showBorder={false} />
        </div>
      ))}
      <div className="absolute right-4 bottom-4 w-14 h-14 border border-sanctuary-600 text-[11px] text-sanctuary-500 flex items-center justify-center">方塊</div>
      <div className="absolute left-2 bottom-3 text-[11px] text-sanctuary-500">護身符只有放在背包內才生效（遊戲規則）</div>
    </div>
  );
};
