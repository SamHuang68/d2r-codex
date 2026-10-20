import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { categoryOfEntry, getSocketables, socketCapacity, socketEffectMods, TIER_ZH } from '../../../engine/catalog';
import { itemOwnStats } from '../../../engine/character';
import { buildEngineItem } from '../../../engine/build';
import { gameData } from '../../../engine/data';
import { describeModifiers } from '../../../engine/describe';
import type { Equipped } from './types';

const baseByCode = new Map(gameData.bases.map((b) => [b.code, b]));
const runeName = (code: string) => (gameData.gems.find((g) => g.code === code)?.name ?? code).replace(/^符文[：:]/, '');
const tone = (k: Equipped['entry']['kind']) => (k === 'set' ? 't-set' : k === 'unique' || k === 'runeword' ? 't-unique' : 't-base');

interface BodyProps {
  eq: Equipped;
  level: number;
  rollMax: boolean;
  /** 目前角色的總力量／敏捷（需求顯示紅字、武器傷害的屬性加成用） */
  attrs: { str: number; dex: number };
}

/** 物品提示框內容：依遊戲提示框的順序——名稱、底材、防禦／傷害、需求、屬性、鑲孔 */
export const ItemTooltipBody: React.FC<BodyProps> = ({ eq, level, rollMax, attrs }) => {
  const e = eq.entry;
  const base = baseByCode.get(e.baseCode);
  const own = useMemo(() => itemOwnStats(gameData, buildEngineItem(eq, 'tip', rollMax), level, attrs), [eq, level, rollMax, attrs]);
  const mods = describeModifiers(e.mods, rollMax ? 1 : 0, level);
  const cap = socketCapacity(e);
  const all = getSocketables();
  const socketed = (eq.sockets ?? []).map((id) => all.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s);
  const cat = categoryOfEntry(e);
  const total = e.kind === 'runeword' ? (e.sockets?.length ?? 0) : cap.fixed ? cap.count : Math.max(cap.count, Math.min(eq.socketCount ?? cap.count, cap.max));
  const reqStr = base?.reqStr ?? 0; const reqDex = base?.reqDex ?? 0; const reqLv = Math.max(base?.levelReq ?? 0, e.levelReq ?? 0);
  const req = (label: string, need: number, have: number) => need > 0 && <div className={`req ${have < need ? 'is-bad' : ''}`}>{label}：{need}</div>;
  const stat = (label: string, v: React.ReactNode) => <div className="stat">{label}：<b>{v}</b></div>;

  return (
    <>
      <div className={`nm ${tone(e.kind)}`}>{e.name}</div>
      <div className={`base ${e.kind === 'base' ? '' : tone(e.kind)}`}>{e.baseName}{base?.tier && e.kind !== 'base' ? `（${TIER_ZH[base.tier]}）` : ''}</div>
      {e.setName && <div className="t-set">{e.setName}</div>}
      {own.defense !== undefined && stat('防禦', own.defense)}
      {base?.block !== undefined && base.block > 0 && base.ancestors.includes('shld') && stat('格擋機率', `${base.block}%`)}
      {own.damage && stat(own.damage.twoHanded ? '雙手傷害' : '單手傷害', `${own.damage.min} 至 ${own.damage.max}`)}
      {req('需求力量', reqStr, attrs.str)}
      {req('需求敏捷', reqDex, attrs.dex)}
      {req('需求等級', reqLv, level)}
      {eq.ethereal && <div className="mod">無形（無法修復）</div>}
      {mods.map((l, i) => <div key={i} className={`mod ${l.known ? '' : 'is-unknown'}`}>{l.text}</div>)}
      {e.kind === 'runeword' && e.sockets && <div className="hint">符文之語：{e.sockets.map(runeName).join(' + ')}</div>}
      {socketed.map((s, i) => (
        <div key={i} className="sock">
          <span className="t-dim">鑲嵌 {s.name}：</span>
          {describeModifiers(socketEffectMods(s, cat), 1, level).map((l) => l.text).join('，') || '無效果'}
        </div>
      ))}
      {total > 0 && <div className="mod">鑲孔 ({e.kind === 'runeword' ? total : `${socketed.length}/${total}`})</div>}
      {e.kind === 'base' && mods.length === 0 && !eq.ethereal && <div className="hint">基礎底材，無額外屬性</div>}
    </>
  );
};

interface FloatProps extends BodyProps {
  /** 游標位置（視窗座標）；沒有滑鼠時用元素位置 */
  at: { x: number; y: number };
  /** 掛載到哪個節點（需在 .d2sim 底下，才吃得到配色變數） */
  host: HTMLElement;
}

const GAP = 18;

/** 跟著游標浮動的提示框：靠近視窗邊緣時翻到另一側，不會被裁掉；不攔截滑鼠 */
export const FloatingItemTip: React.FC<FloatProps> = ({ at, host, ...body }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const w = el.offsetWidth; const h = el.offsetHeight; const vw = window.innerWidth; const vh = window.innerHeight;
    let left = at.x + GAP; if (left + w > vw - 8) left = Math.max(8, at.x - GAP - w);
    let top = at.y + GAP; if (top + h > vh - 8) top = Math.max(8, vh - 8 - h);
    setPos({ left, top });
  }, [at.x, at.y, body.eq, body.rollMax, body.level]);
  return createPortal(
    <div ref={ref} role="tooltip" className="d2-tip d2-tip-float" style={{ left: pos?.left ?? at.x + GAP, top: pos?.top ?? at.y + GAP, visibility: pos ? 'visible' : 'hidden' }}>
      <ItemTooltipBody {...body} />
    </div>,
    host,
  );
};

