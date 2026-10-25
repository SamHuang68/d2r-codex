import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { categoryOfEntry, getCatalog, getSocketables, socketCapacity, socketEffectMods, TIER_ZH } from '../../../engine/catalog';
import { itemOwnStats } from '../../../engine/character';
import { buildEngineItem } from '../../../engine/build';
import { gameData } from '../../../engine/data';
import { describeModifiers } from '../../../engine/describe';
import { skillByName } from '../../../engine/skills';
import { useLanguage } from '../../../context/LanguageContext';
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
  /** 目前物品欄裡同一套裝的件名（套裝進度與加成是否生效用）；沒有套裝就不用給 */
  equippedSetNames?: string[];
}

/** 物品提示框內容：依遊戲提示框的順序——名稱、底材、防禦／傷害、需求、屬性、鑲孔 */
export const ItemTooltipBody: React.FC<BodyProps> = ({ eq, level, rollMax, attrs, equippedSetNames }) => {
  const { isEn } = useLanguage();
  const e = eq.entry;
  const base = baseByCode.get(e.baseCode);
  const own = useMemo(() => itemOwnStats(gameData, buildEngineItem(eq, 'tip', rollMax), level, attrs), [eq, level, rollMax, attrs]);
  const mods = describeModifiers(e.mods, rollMax ? 1 : 0, level);
  const setDef = e.setId ? gameData.sets?.find((d) => d.id === e.setId) : undefined;
  const setMembers = useMemo(() => (e.setId ? getCatalog().filter((x) => x.kind === 'set' && x.setId === e.setId) : []), [e.setId]);
  const have = new Set(equippedSetNames ?? []); const setCount = have.size;
  // 套裝加成文字（state 是全套時的光環特效，沒有文字說明，不列）
  const setLines = (m: { code: string }[]) => describeModifiers(m.filter((x) => x.code !== 'state'), rollMax ? 1 : 0, level);
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
      <div className={`nm ${e.custom ? 't-magic' : tone(e.kind)}`}>{isEn ? (e.nameEn || e.name) : e.name}</div>
      <div className={`base ${e.kind === 'base' ? '' : tone(e.kind)}`}>{isEn ? (e.baseNameEn || e.baseName) : e.baseName}{base?.tier && e.kind !== 'base' ? (isEn ? ` (${base.tier.toUpperCase()})` : `（${TIER_ZH[base.tier]}）`) : ''}</div>
      {own.defense !== undefined && stat(isEn ? 'Defense' : '防禦', own.defense)}
      {base?.block !== undefined && base.block > 0 && base.ancestors.includes('shld') && stat(isEn ? 'Chance to Block' : '格擋機率', `${base.block}%`)}
      {own.damage && stat(own.damage.twoHanded ? (isEn ? 'Two-Hand Damage' : '雙手傷害') : (isEn ? 'One-Hand Damage' : '單手傷害'), isEn ? `${own.damage.min} to ${own.damage.max}` : `${own.damage.min} 至 ${own.damage.max}`)}
      {req(isEn ? 'Required Strength' : '需求力量', reqStr, attrs.str)}
      {req(isEn ? 'Required Dexterity' : '需求敏捷', reqDex, attrs.dex)}
      {req(isEn ? 'Required Level' : '需求等級', reqLv, level)}
      {eq.ethereal && <div className="mod">{isEn ? "Ethereal (Cannot be Repaired)" : "無形（無法修復）"}</div>}
      {mods.map((l, i) => <div key={i} className={`mod ${l.known ? '' : 'is-unknown'}`}>{l.text}</div>)}
      {e.kind === 'runeword' && e.sockets && <div className="hint">{isEn ? "Runeword: " : "符文之語："}{e.sockets.map(runeName).join(' + ')}</div>}
      {e.mods.some((m) => m.code.toLowerCase() === 'skill-rand') && <div className="hint">{eq.randomSkill ? (isEn ? `Random Skill: ${(skillByName(eq.randomSkill) as any)?.nameEn ?? skillByName(eq.randomSkill)?.name ?? eq.randomSkill}` : `隨機技能：${skillByName(eq.randomSkill)?.name ?? eq.randomSkill}`) : (isEn ? 'Random skill not chosen yet; bonus not included' : '尚未選擇隨機技能，該項加成未計入')}</div>}
      {setDef && (
        <div className="set-block">
          <div className="t-set">{isEn ? (setDef.nameEn ?? setDef.name ?? e.setName) : (setDef.name ?? e.setName)} ({setCount}/{setDef.size})</div>
          {setMembers.map((m) => <div key={m.id} className={have.has(m.name) ? 't-set' : 't-dim'}>{isEn && m.nameEn ? m.nameEn : m.name}</div>)}
          {(e.setBonus ?? []).flatMap((b) => setLines(b.mods).map((l, i) => <div key={`i${b.pieces}-${i}`} className={setCount >= b.pieces ? 't-set' : 't-dim'}>{isEn ? `(${b.pieces} Pieces) ` : `（${b.pieces} 件）`}{l.text}</div>))}
          {setDef.partial.flatMap((p) => setLines(p.mods).map((l, i) => <div key={`p${p.pieces}-${i}`} className={setCount >= p.pieces ? 't-set' : 't-dim'}>{isEn ? `(${p.pieces} Pieces) ` : `（${p.pieces} 件）`}{l.text}</div>))}
          {setLines(setDef.full).map((l, i) => <div key={`f${i}`} className={setDef.size > 0 && setCount >= setDef.size ? 't-set' : 't-dim'}>{isEn ? '(Full Set) ' : '（全套）'}{l.text}</div>)}
        </div>
      )}
      {socketed.map((s, i) => (
        <div key={i} className="sock">
          <span className="t-dim">{isEn ? `Socketed (${s.nameEn || s.name}): ` : `鑲嵌 ${s.name}：`}</span>
          {describeModifiers(socketEffectMods(s, cat), 1, level).map((l) => l.text).join('，') || (isEn ? 'No Effect' : '無效果')}
        </div>
      ))}
      {total > 0 && <div className="mod">{isEn ? "Sockets" : "鑲孔"} ({e.kind === 'runeword' ? total : `${socketed.length}/${total}`})</div>}
      {e.kind === 'base' && mods.length === 0 && !eq.ethereal && <div className="hint">{isEn ? "Normal base item, no extra modifiers" : "基礎底材，無額外屬性"}</div>}
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

