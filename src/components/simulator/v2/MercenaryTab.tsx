import React from 'react';
import { eligibleBases, withBase, type CatalogEntry } from '../../../engine/catalog';
import { gameData } from '../../../engine/data';
import { describeEntry } from '../../../engine/describe';
import { DIFFICULTY_ZH, HIRELINGS, clampMercLevel, hirelingById, hirelingLabel, hirelingMinLevel, MERC_MAX_LEVEL, type MercResult } from '../../../engine/mercenary';
import { skillEffectText } from '../../../engine/skillEffects';
import { auraEffects } from '../../../engine/skills';
import { MERC_SLOTS, MERC_SLOT_ZH, type Equipped, type MercSlot, type MercState } from './types';

interface Props {
  merc: MercState;
  onChange: (m: MercState) => void;
  result: MercResult | null;
  playerLevel: number;
  /** 開啟裝備選擇視窗（挑到的裝備會依部位放進傭兵的格子） */
  onPick: (slot: MercSlot) => void;
}

const baseByCode = new Map(gameData.bases.map((b) => [b.code, b]));

/**
 * 傭兵能用的武器種類。遊戲資料表（hireling.txt）沒有這項規則，這是玩家社群的共識：
 * 第一幕弓與弩；第二幕長矛與長柄；第三幕單手劍；第五幕依子類型用雙手劍或單手劍。只提醒，不阻擋。
 */
const weaponWarning = (act: number, subType: string, entry: CatalogEntry): string | undefined => {
  const b = baseByCode.get(entry.baseCode); if (!b) return undefined;
  const a = b.ancestors; const two = !!b.twoHanded;
  const ok = act === 1 ? a.includes('bow') || a.includes('xbow')
    : act === 2 ? a.includes('pole') || a.includes('spea')
    : act === 3 ? a.includes('swor') && !two
    : subType.startsWith('2hs') ? a.includes('swor') && two : a.includes('swor') && !two;
  return ok ? undefined : '這個傭兵通常無法使用這種武器（社群共識，遊戲資料表沒有這項規則），數值仍會照算';
};

const SlotCard: React.FC<{ slot: MercSlot; eq?: Equipped; warn?: string; onPick: () => void; onChange: (e: Equipped | undefined) => void }> = ({ slot, eq, warn, onPick, onChange }) => {
  const bases = eq && eq.entry.kind === 'runeword' ? eligibleBases(eq.entry) : [];
  return (
    <div className="d2-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
      <span className="t-dim" style={{ minWidth: 48 }}>{MERC_SLOT_ZH[slot]}</span>
      <span className="min-w-0 flex-1">
        {eq ? (
          <>
            <span className={eq.entry.kind === 'set' ? 't-set' : eq.entry.kind === 'base' ? 't-base' : 't-unique'}>{eq.entry.name}</span>
            <span className="t-dim text-xs ml-2">{eq.entry.baseName}</span>
            {eq.entry.kind === 'runeword' && bases.length > 0 && (
              <select className="d2-select ml-2" value={eq.entry.baseCode} onChange={(e) => onChange({ ...eq, entry: withBase(eq.entry, e.target.value) })} aria-label={`${MERC_SLOT_ZH[slot]}底材`}>
                {bases.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
              </select>
            )}
            <label className="d2-field ml-3" title="無形：底材防禦／傷害 ×1.5">
              <input type="checkbox" className="d2-check" checked={!!eq.ethereal} onChange={(e) => onChange({ ...eq, ethereal: e.target.checked || undefined })} />無形
            </label>
            {warn && <span className="block text-xs t-bad">{warn}</span>}
          </>
        ) : <span className="t-dim">（空）</span>}
      </span>
      <span className="flex gap-1.5">
        <button type="button" className="d2-btn" onClick={onPick}>{eq ? '更換' : '選擇裝備'}</button>
        {eq && <button type="button" className="d2-btn is-quiet" onClick={() => onChange(undefined)}>移除</button>}
      </span>
    </div>
  );
};

const Row: React.FC<{ label: string; value: React.ReactNode; title?: string; tone?: string }> = ({ label, value, title, tone }) => (
  <div className="d2-row" title={title}><span>{label}</span><span className={tone ?? ''}>{value}</span></div>
);

export const MercenaryTab: React.FC<Props> = ({ merc, onChange, result, playerLevel, onPick }) => {
  const h = hirelingById(merc.id);
  const set = (patch: Partial<MercState>) => onChange({ ...merc, ...patch });
  const setSlot = (slot: MercSlot, e: Equipped | undefined) => { const next = { ...merc.equipped }; if (e) next[slot] = e; else delete next[slot]; set({ equipped: next }); };
  const byDiff = [1, 2, 3].map((d) => ({ d, list: HIRELINGS.filter((x) => x.difficulty === d) }));
  const minLv = h ? hirelingMinLevel(h) : 1;

  return (
    <div className="space-y-4" aria-label="傭兵">
      <div className="d2-row" style={{ flexWrap: 'wrap', gap: 10 }}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="d2-check" checked={merc.on} onChange={(e) => set({ on: e.target.checked })} aria-label="計入傭兵" />
          <span>計入傭兵的光環</span>
        </label>
        <span className="d2-sub">開啟後，傭兵的光環（原生與裝備給的，例如無限的信念）會出現在屬性頁的增益面板，恆啟用；傭兵死亡時請關掉。</span>
      </div>

      <div className="d2-row" style={{ flexWrap: 'wrap', gap: 10 }}>
        <label className="d2-field">傭兵
          <select className="d2-select" value={h?.id ?? ''} onChange={(e) => { const nh = hirelingById(Number(e.target.value)); if (nh) set({ id: nh.id, level: clampMercLevel(nh, merc.level) }); }} aria-label="傭兵類型">
            {byDiff.map(({ d, list }) => (
              <optgroup key={d} label={DIFFICULTY_ZH[d]}>
                {list.map((x) => <option key={x.id} value={x.id}>{hirelingLabel(x)}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="d2-field">傭兵等級
          <input type="number" className="d2-input" style={{ width: 66 }} min={minLv} max={MERC_MAX_LEVEL} value={merc.level}
            onChange={(e) => set({ level: h ? clampMercLevel(h, Number(e.target.value)) : merc.level })} aria-label="傭兵等級" />
        </label>
        <button type="button" className="d2-btn is-quiet" onClick={() => h && set({ level: clampMercLevel(h, playerLevel) })} title="把傭兵等級設成和玩家一樣（傭兵等級會隨經驗追上玩家）">同玩家等級（{playerLevel}）</button>
        {h && <span className="d2-sub">此類型最低 {minLv} 級</span>}
      </div>

      <div className="space-y-1.5" aria-label="傭兵裝備">
        {MERC_SLOTS.map((slot) => {
          const eq = merc.equipped[slot];
          const warn = slot === 'weaponI' && eq && h ? weaponWarning(h.act, h.subType, eq.entry) : undefined;
          return <SlotCard key={slot} slot={slot} eq={eq} warn={warn} onPick={() => onPick(slot)} onChange={(e) => setSlot(slot, e)} />;
        })}
        <div className="d2-sub">傭兵只能穿戴頭盔、護甲與武器。</div>
      </div>

      {result && (
        <div aria-label="傭兵數值">
          <div className="t-gold text-sm tracking-[.2em] mb-1.5" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>傭 兵 數 值</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <Row label="生命" value={result.life.toLocaleString()} title={`基礎 ${result.base.life}（${hirelingLabel(result.hireling)}，${result.level} 級）＋裝備`} />
            <Row label="防禦" value={result.defense.toLocaleString()} title={`基礎 ${result.base.defense} ＋ 裝備。不含敏捷帶來的防禦（沒有可核對的來源）`} />
            <Row label="命中（AR）" value={result.ar.toLocaleString()} title={`基礎 ${result.base.ar}，加上裝備的命中與命中%。遊戲內的命中率公式沒有納入`} />
            <Row label="力量／敏捷" value={`${result.str} / ${result.dex}`} title="基礎＋裝備" />
            <Row label="抗性" value={<><span className="t-fire">{result.resist.fire}</span> / <span className="t-cold">{result.resist.cold}</span> / <span className="t-lightning">{result.resist.lightning}</span> / <span className="t-poison">{result.resist.poison}</span></>}
              title={`基礎＋裝備，上限 75（加上最大抗性）。未截斷：${result.rawResist.fire} / ${result.rawResist.cold} / ${result.rawResist.lightning} / ${result.rawResist.poison}`} />
            <Row label="傭兵本身傷害" value={`${result.base.damage.min}–${result.base.damage.max}`} title="資料表的傭兵基礎傷害。遊戲內它和武器傷害如何合併沒有可核對的來源，這裡分開列出，不相加" />
            {result.weaponDamage && <Row label={`武器傷害${result.weaponDamage.twoHanded ? '（雙手）' : ''}`} value={`${result.weaponDamage.min}–${result.weaponDamage.max}`} title="底材 × 無形 × (1＋強化傷害％＋力量敏捷加成％) ＋ 固定傷害，用傭兵的力量與敏捷" />}
          </div>
          {result.bonuses.length > 0 && (
            <div className="mt-2 space-y-1">
              {result.bonuses.map((b) => <div key={b.stat} className="d2-row"><span className="t-dim text-xs">裝備提供</span><span className="t-magic">{describeEntry(b, result.level) ?? `${b.stat} ${b.value}`}</span></div>)}
            </div>
          )}
          <div className="mt-3">
            <div className="t-gold text-sm tracking-[.2em] mb-1.5" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>光 環 與 技 能</div>
            {/* 光環（mode 1）在下面和裝備給的光環一起列；mode 14 是普通攻擊（戳刺） */}
            {result.base.skills.filter((s) => s.mode !== 14 && s.mode !== 1).map((s) => (
              <div key={s.nameEn} className="d2-row"><span><span className="t-gold">{s.name}</span><span className="t-dim text-xs ml-2">Lv {s.level}</span></span><span className="t-dim text-xs">{`施放機率 ${s.chance}%`}</span></div>
            ))}
            {result.auras.length === 0 && <div className="d2-sub">這個傭兵沒有光環。</div>}
            {result.auras.map((a) => (
              <div key={a.skill.id} className="d2-row" style={{ alignItems: 'flex-start' }}>
                <span><span className="t-gold">{a.skill.name ?? a.skill.nameEn}</span><span className="t-dim text-xs ml-2">Lv {a.level}　{a.source === 'item' ? '裝備給的' : '傭兵原生'}</span></span>
                <span className="text-right">{auraEffects(a.skill, a.level).map((l, i) => <span key={i} className={`block text-xs ${l.supported ? 't-magic' : 't-dim'}`}>{l.supported && l.value !== undefined ? (skillEffectText(l.stat, l.value, result.level) ?? `${l.stat} ${l.value}`) : `${l.stat}（公式未支援）`}</span>)}</span>
              </div>
            ))}
          </div>
          {result.unhandled.length > 0 && (
            <div className="mt-2 d2-sub t-bad">有 {result.unhandled.length} 項裝備屬性無法計算：{result.unhandled.slice(0, 4).map((u) => `${u.code}（${u.reason}）`).join('、')}</div>
          )}
          <div className="d2-sub mt-2">傭兵數值來自遊戲資料表（hireling.txt），等級落在檢查點之間時以最近的下方檢查點外推；沒有在遊戲內逐項核對。</div>
        </div>
      )}
    </div>
  );
};
