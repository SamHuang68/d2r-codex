import React, { useMemo, useState } from 'react';
import { computeCharacter } from '../../../engine/character';
import { gameData } from '../../../engine/data';
import { ENGINE_CLASS_BY_CODE, SLOT_ZH, toEquipped, withBase, type CatalogEntry, type Group } from '../../../engine/catalog';
import { autoAllocate } from '../../../engine/alloc';
import { buildEngineItem } from '../../../engine/build';
import { resolvePreset } from '../../../data/presetResolver';
import { SIM_PRESETS } from '../../../data/simulatorPresets';
import { describeModifiers } from '../../../engine/describe';
import type { EquippedItem } from '../../../engine/types';
import { SkillTreeV2 } from './SkillTreeV2';
import { auraEffects, damageText, effectiveLevel, passiveMods, skillById, skillDamage, skillLevelsFrom, skillPointBudget, targetDamageText, type DamageOptions, type GameSkill, type SkillBonuses } from '../../../engine/skills';
import { applyBuffs, buffCandidates } from '../../../engine/buffs';
import { describeEntry } from '../../../engine/describe';
import { PaperDollV2, canFitCharm } from './PaperDollV2';
import { AttributesTab } from './AttributesTab';
import { GearTreeTab } from './GearTreeTab';
import { GearPicker } from './GearPicker';
import { SocketEditor } from './SocketEditor';
import './d2skin.css';
import { DOLL_SLOT_KIND, DOLL_SLOT_ZH, type Alloc, type Difficulty, type DollSlot, type Equipped, type EquippedMap, type Quests, type TabKey } from './types';

const CLASSES: { zh: string; en: string; code: string }[] = [
  { zh: '亞馬遜', en: 'Amazon', code: 'ama' }, { zh: '魔法使', en: 'Sorceress', code: 'sor' }, { zh: '死靈法師', en: 'Necromancer', code: 'nec' },
  { zh: '聖騎士', en: 'Paladin', code: 'pal' }, { zh: '野蠻人', en: 'Barbarian', code: 'bar' }, { zh: '德魯伊', en: 'Druid', code: 'dru' },
  { zh: '刺客', en: 'Assassin', code: 'ass' }, { zh: '術士', en: 'Warlock', code: 'war' },
];
const DIFF_ZH: Record<Difficulty, string> = { normal: '普通', nightmare: '惡夢', hell: '地獄' };
const ZERO: Alloc = { str: 0, dex: 0, vit: 0, ene: 0 };
const baseByCode = new Map(gameData.bases.map((b) => [b.code, b]));

export interface SimulatorV2Props { initialClass?: string }

const NumSelect: React.FC<{ label: string; value: number; max: number; onChange: (n: number) => void; title?: string }> = ({ label, value, max, onChange, title }) => (
  <label className="d2-field" title={title}>
    {label}
    <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="d2-select">
      {Array.from({ length: max + 1 }, (_, i) => <option key={i} value={i}>{i}</option>)}
    </select>
  </label>
);

export const SimulatorV2: React.FC<SimulatorV2Props> = ({ initialClass = '魔法使' }) => {
  const [cls, setCls] = useState(CLASSES.find((c) => c.zh === initialClass) ?? CLASSES[1]);
  const [level, setLevel] = useState(90);
  const [difficulty, setDifficulty] = useState<Difficulty>('hell');
  const [quests, setQuests] = useState<Quests>({ lifePotions: 3, anya: 3, lamEsen: 3, skillPts: 3 }) // 預設地獄、三難度任務皆完成；可調整;
  const [alloc, setAlloc] = useState<Alloc>(ZERO);
  const [equipped, setEquipped] = useState<EquippedMap>({});
  const [charms, setCharms] = useState<CatalogEntry[]>([]);
  const [swap, setSwap] = useState<'I' | 'II'>('I');
  const [rollMax, setRollMax] = useState(true);
  const [tab, setTab] = useState<TabKey>('stats');
  const [selected, setSelected] = useState<DollSlot | null>(null);
  const [dragging, setDragging] = useState<CatalogEntry | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerJump, setPickerJump] = useState<{ group: Group; seq: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [skillPoints, setSkillPoints] = useState<Record<string, number>>({});
  const [activeSkillId, setActiveSkillId] = useState<string>('');
  const [buffsOn, setBuffsOn] = useState<Record<string, boolean>>({});
  const [targetRes, setTargetRes] = useState(0);

  const say = (m: string) => { setToast(m); window.setTimeout(() => setToast((t) => (t === m ? null : t)), 3500); };

  // ── 引擎輸入 ──
  const engineItems: EquippedItem[] = useMemo(() => {
    const out: EquippedItem[] = [];
    const arm: DollSlot[] = swap === 'I' ? ['weaponI', 'shieldI'] : ['weaponII', 'shieldII'];
    (Object.keys(equipped) as DollSlot[]).forEach((k) => {
      if ((k === 'weaponI' || k === 'shieldI' || k === 'weaponII' || k === 'shieldII') && !arm.includes(k)) return;
      const eq = equipped[k]; if (!eq) return;
      const kind = DOLL_SLOT_KIND[k];
      // 副手欄放武器（雙持）時，引擎槽位用 weapon2，不當作盾牌
      const slot = kind === 'weapon' ? 'weapon' : kind === 'shield' ? (eq.entry.slot === 'weapon' ? 'weapon2' : 'shield') : k;
      out.push(buildEngineItem(eq, slot, rollMax));
    });
    charms.forEach((c, i) => out.push(toEquipped(c, `charm${i}`, { roll: rollMax ? 1 : 0 })));
    return out;
  }, [equipped, charms, swap, rollMax]);

  const baseInput = useMemo(() => ({
    className: cls.en, level, allocated: alloc, items: engineItems, difficulty, anyaScrolls: quests.anya, quests: { lifePotions: quests.lifePotions },
  }), [cls, level, alloc, engineItems, difficulty, quests]);
  const baseResult = useMemo(() => computeCharacter(gameData, baseInput), [baseInput]);

  const skillBonuses: SkillBonuses = useMemo(() => ({
    all: baseResult.skills.all, byClass: baseResult.skills.byClass[cls.en] ?? 0, byTab: baseResult.skills.byTab, single: baseResult.skills.single,
  }), [baseResult, cls]);

  // 增益／光環：候選（裝備光環恆啟用；裝備給的外職業技能與本職業光環可勾選）
  const candidates = useMemo(() => buffCandidates(cls.code, skillPoints, skillBonuses, baseResult.stats), [cls, skillPoints, skillBonuses, baseResult]);
  const activeBuffs = useMemo(() => candidates.filter((c) => c.alwaysOn || buffsOn[c.skill.id]), [candidates, buffsOn]);
  const applied = useMemo(() => applyBuffs(activeBuffs), [activeBuffs]);
  const result = useMemo(() => computeCharacter(gameData, { ...baseInput, extraStats: applied.self }), [baseInput, applied]);

  const totalPoints = (level - 1) * 5 + quests.lamEsen * 5;
  const used = alloc.str + alloc.dex + alloc.vit + alloc.ene;
  const remaining = Math.max(0, totalPoints - used);
  const needStr = Math.max(0, ...engineItems.map((i) => baseByCode.get(i.baseCode)?.reqStr ?? 0));
  const needDex = Math.max(0, ...engineItems.map((i) => baseByCode.get(i.baseCode)?.reqDex ?? 0));
  const unmetSlots = useMemo(() => {
    const m: Record<string, boolean> = {};
    result.requirementsUnmet.forEach((u) => { m[u.slot === 'weapon' ? (swap === 'I' ? 'weaponI' : 'weaponII') : u.slot === 'shield' || u.slot === 'weapon2' ? (swap === 'I' ? 'shieldI' : 'shieldII') : u.slot] = true; });
    return m;
  }, [result, swap]);

  // ── 穿戴規則 ──
  const targetFor = (entry: CatalogEntry, hint?: DollSlot | 'charms'): DollSlot | 'charms' | null => {
    if (entry.slot === 'charm') return 'charms';
    if (hint && hint !== 'charms') return DOLL_SLOT_KIND[hint] === entry.slot ? hint : null;
    switch (entry.slot) {
      case 'ring': return !equipped.ring1 ? 'ring1' : !equipped.ring2 ? 'ring2' : 'ring1';
      case 'weapon': {
        const main: DollSlot = swap === 'I' ? 'weaponI' : 'weaponII'; const off: DollSlot = swap === 'I' ? 'shieldI' : 'shieldII';
        return equipped[main] && !equipped[off] && !entry.twoHanded && canDrop(off, entry) === null ? off : main;
      }
      case 'shield': return swap === 'I' ? 'shieldI' : 'shieldII';
      default: return entry.slot as DollSlot;
    }
  };
  const canDrop = (target: DollSlot | 'charms', entry: CatalogEntry): string | null => {
    if (target === 'charms') return entry.slot !== 'charm' ? '只有護身符能放進背包' : canFitCharm(charms, entry) ? null : '背包空間不足';
    const dualWield = entry.slot === 'weapon' && (target === 'shieldI' || target === 'shieldII') && (cls.en === 'Barbarian' || cls.en === 'Assassin');
    if (dualWield) {
      const main = equipped[target === 'shieldI' ? 'weaponI' : 'weaponII']?.entry;
      if (entry.twoHanded) return '雙手武器不能放在副手欄';
      if (main?.twoHanded) return '主手為雙手武器，副手欄不能放武器';
      if (cls.en === 'Assassin' && !/^(h2h|h2h2)$/.test(baseByCode.get(entry.baseCode)?.type ?? '')) return '刺客雙持只能使用爪類武器';
    } else if (DOLL_SLOT_KIND[target] !== entry.slot) return `「${entry.name}」是${SLOT_ZH[entry.slot]}，不能放在${DOLL_SLOT_ZH[target]}`;
    if (entry.classCode && ENGINE_CLASS_BY_CODE[entry.classCode] !== cls.en) return `「${entry.name}」只有${CLASSES.find((c) => c.code === entry.classCode)?.zh}能使用`;
    if (entry.slot === 'shield') {
      const w = equipped[target === 'shieldI' ? 'weaponI' : 'weaponII']?.entry;
      const wb = w && baseByCode.get(w.baseCode);
      if (w?.twoHanded && !(wb?.oneOrTwoHanded && cls.en === 'Barbarian')) return '雙手武器無法搭配盾牌';
    }
    return null;
  };
  const place = (target: DollSlot | 'charms', entry: CatalogEntry) => {
    const err = canDrop(target, entry);
    if (err) { say(err); return; }
    if (target === 'charms') { setCharms((c) => [...c, entry]); return; }
    setEquipped((m) => {
      const next: EquippedMap = { ...m, [target]: { entry } };
      if (entry.slot === 'weapon' && entry.twoHanded) {
        const sh = target === 'weaponI' ? 'shieldI' : 'shieldII';
        const wb = baseByCode.get(entry.baseCode);
        if (next[sh] && !(wb?.oneOrTwoHanded && cls.en === 'Barbarian')) { delete next[sh]; say('雙手武器：已卸下同組副手'); }
      }
      return next;
    });
    setSelected(target);
  };
  const equip = (entry: CatalogEntry) => { const t = targetFor(entry); if (!t) { say('找不到對應槽位'); return; } place(t, entry); };
  const unequip = (slot: DollSlot) => { setEquipped((m) => { const n = { ...m }; delete n[slot]; return n; }); setSelected(null); };

  const selectClass = (c: typeof CLASSES[number]) => {
    setCls(c); setAlloc(ZERO); setSkillPoints({}); setActiveSkillId(''); setBuffsOn({});
    const dropped: string[] = [];
    setEquipped((m) => {
      const n: EquippedMap = {};
      (Object.keys(m) as DollSlot[]).forEach((k) => { const e = m[k]!; if (e.entry.classCode && e.entry.classCode !== c.code) dropped.push(e.entry.name); else n[k] = e; });
      return n;
    });
    if (dropped.length) say(`已卸下其他職業專屬裝備：${dropped.join('、')}`);
  };

  const onAdd = (k: keyof Alloc, n: number) => setAlloc((a) => {
    const delta = n > 0 ? Math.min(n, remaining) : -Math.min(-n, a[k]);
    return { ...a, [k]: a[k] + delta };
  });
  const onAutoReq = () => setAlloc((a) => {
    const baseStr = result.attributes.str - a.str; const baseDex = result.attributes.dex - a.dex;
    let left = remaining;
    const str = Math.max(a.str, needStr - baseStr); const ds = Math.min(left, str - a.str); left -= ds;
    const dex = Math.max(a.dex, needDex - baseDex); const dd = Math.min(left, dex - a.dex);
    return { ...a, str: a.str + ds, dex: a.dex + dd };
  });
  const onAllVit = () => setAlloc((a) => ({ ...a, vit: a.vit + remaining }));

  const share = () => {
    const lines = [`${cls.zh} Lv${level}（${DIFF_ZH[difficulty]}）`, `力${result.attributes.str} 敏${result.attributes.dex} 體${result.attributes.vit} 能${result.attributes.ene}`,
      `生命 ${result.life} 法力 ${result.mana} 防禦 ${result.defense} 格擋 ${result.blockChance}%`,
      `抗性 火${result.resist.fire} 冰${result.resist.cold} 電${result.resist.lightning} 毒${result.resist.poison}`,
      ...(Object.keys(equipped) as DollSlot[]).map((k) => `${DOLL_SLOT_ZH[k]}：${equipped[k]!.entry.name}`), ...charms.map((c) => `護身符：${c.name}`)];
    navigator.clipboard?.writeText(lines.join('\n')).then(() => say('已複製配裝摘要'), () => say('無法複製（瀏覽器未授權）'));
  };
  const patchEquipped = (slot: DollSlot, patch: Partial<Equipped>) => setEquipped((m) => (m[slot] ? { ...m, [slot]: { ...m[slot]!, ...patch } } : m));
  const changeBase = (slot: DollSlot, baseCode: string) => setEquipped((m) => (m[slot] ? { ...m, [slot]: { ...m[slot]!, entry: withBase(m[slot]!.entry, baseCode) } } : m));

  const loadPreset = (id: string) => {
    const p = SIM_PRESETS.find((x) => x.id === id); if (!p) return;
    const c = CLASSES.find((x) => x.code === p.classCode)!;
    const r = resolvePreset(p);
    setCls(c); setLevel(p.level); setDifficulty('hell'); setQuests({ lifePotions: 3, anya: 3, lamEsen: 3, skillPts: 3 }); setSkillPoints({}); setActiveSkillId(''); setBuffsOn({});
    setEquipped(r.equipped); setCharms(r.charms); setSwap('I'); setSelected(null);
    // 以新狀態配點
    const items: EquippedItem[] = [];
    (Object.keys(r.equipped) as DollSlot[]).forEach((k) => {
      if (k === 'weaponII' || k === 'shieldII') return;
      const eq = r.equipped[k]!; const kind = DOLL_SLOT_KIND[k];
      items.push(buildEngineItem(eq, kind === 'weapon' ? 'weapon' : kind === 'shield' ? (eq.entry.slot === 'weapon' ? 'weapon2' : 'shield') : k, true));
    });
    r.charms.forEach((ch, i) => items.push(toEquipped(ch, `charm${i}`, { roll: 1 })));
    const reqs = { str: Math.max(0, ...items.map((i) => baseByCode.get(i.baseCode)?.reqStr ?? 0)), dex: Math.max(0, ...items.map((i) => baseByCode.get(i.baseCode)?.reqDex ?? 0)) };
    const total = (p.level - 1) * 5 + 15;
    setAlloc(autoAllocate(gameData, { className: c.en, level: p.level, items, difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } }, { totalPoints: total, blockTarget: p.blockTarget, rest: p.rest }, reqs));
    if (r.errors.length) say(`範本有 ${r.errors.length} 項無法載入：${r.errors.join('；')}`); else say(`已載入範本：${p.name}`);
  };
  const clearAll = () => { setEquipped({}); setCharms([]); setAlloc(ZERO); setSelected(null); };

  const selEq = selected ? equipped[selected] : undefined;
  // 專精、穿透、目標抗性 → 技能傷害選項
  const mods = useMemo(() => passiveMods(skillPoints, skillBonuses), [skillPoints, skillBonuses]);
  const damageOpts = (sk: GameSkill): DamageOptions => {
    const el = sk.elem?.type as 'fire' | 'cold' | 'ltng' | 'pois' | 'mag' | undefined;
    if (!el) return {};
    return {
      masteryPct: (mods.mastery[el] ?? 0) + (result.stats[`passive_${el}_mastery`] ?? 0),
      pierce: (mods.pierce[el] ?? 0) + (result.stats[`passive_${el}_pierce`] ?? 0) + (applied.enemyResReduction[el] ?? 0),
      targetRes,
    };
  };
  // 主力技能的傷害（遊戲技能表值，含協同與專精；未含武器、傷害加成、敵人其他減傷）
  const mainSkill = useMemo(() => {
    const sk = activeSkillId ? skillById(activeSkillId) : undefined;
    if (!sk) return null;
    const hard = skillPoints[sk.id] ?? 0; const lvl = effectiveLevel(sk, hard, skillBonuses);
    const d = skillDamage(sk, lvl, skillLevelsFrom(skillPoints, skillBonuses), damageOpts(sk));
    return { name: sk.name ?? sk.nameEn, level: lvl, text: damageText(d) ?? (hard > 0 ? '此技能沒有傷害欄位' : '尚未投入技能點'), targetText: targetDamageText(d) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSkillId, skillPoints, skillBonuses, mods, result, applied, targetRes]);

  const skillBudget = skillPointBudget(level, quests.skillPts);
  const skillUsed = Object.values(skillPoints).reduce((a2, b2) => a2 + b2, 0);

  const buffPanel = candidates.map((c) => ({
    id: c.skill.id, name: c.skill.name ?? c.skill.nameEn, level: c.level, alwaysOn: c.alwaysOn, on: c.alwaysOn || !!buffsOn[c.skill.id],
    source: c.source === 'item-aura' ? '裝備光環' : c.source === 'item-skill' ? '裝備提供' : '本職業',
    lines: auraEffects(c.skill, c.level),
  })).map((b2) => ({ ...b2, lines: b2.lines.map((l) => ({ supported: l.supported, text: l.supported && l.value !== undefined ? (describeEntry({ stat: l.stat, value: l.value }, level) ?? `${l.stat} ${l.value}`) : `${l.stat}（公式未支援，未計入）` })) }));

  return (
    <section className="d2sim space-y-4" aria-label="配裝模擬器">
      {/* 頂部列 */}
      <div className="d2-panel">
        <div className="d2-panel-body space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="職業">
              {CLASSES.map((c) => (
                <button key={c.code} type="button" role="tab" aria-selected={c.code === cls.code} onClick={() => selectClass(c)} className="d2-class">{c.zh}</button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="d2-field">範本
                <select value="" onChange={(e) => { if (e.target.value) loadPreset(e.target.value); }} className="d2-select" aria-label="載入配裝範本">
                  <option value="">載入…</option>
                  {SIM_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </label>
              <button type="button" onClick={share} className="d2-btn is-quiet">分享</button>
              <button type="button" onClick={clearAll} className="d2-btn is-danger">清空</button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2" style={{ borderTop: '1px solid #2e271c', paddingTop: 10 }}>
            <label className="d2-field">等級
              <input type="number" min={1} max={99} value={level} onChange={(e) => setLevel(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} className="d2-input" style={{ width: 62 }} />
            </label>
            <label className="d2-field">難度
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="d2-select">
                {(Object.keys(DIFF_ZH) as Difficulty[]).map((d) => <option key={d} value={d}>{DIFF_ZH[d]}</option>)}
              </select>
            </label>
            <span className="d2-sub" style={{ letterSpacing: '.2em' }}>任務</span>
            <NumSelect label="生命藥水" value={quests.lifePotions} max={3} onChange={(n) => setQuests((q) => ({ ...q, lifePotions: n }))} title="第三幕「金鳥」，每難度 +20 最大生命" />
            <NumSelect label="安亞卷軸" value={quests.anya} max={3} onChange={(n) => setQuests((q) => ({ ...q, anya: n }))} title="第五幕，每難度 +10 全抗" />
            <NumSelect label="拉姆艾森之書" value={quests.lamEsen} max={3} onChange={(n) => setQuests((q) => ({ ...q, lamEsen: n }))} title="第三幕，每難度 +5 屬性點" />
            <NumSelect label="技能點任務" value={quests.skillPts} max={3} onChange={(n) => setQuests((q) => ({ ...q, skillPts: n }))} title="魔物巢穴 1、拉瑪達 1、伊祖爾 2，每難度共 +4 技能點（社群共識，未於遊戲內核對）" />
            <label className="d2-field" title="裝備詞綴範圍值取上限或下限">屬性取值
              <select value={rollMax ? 'max' : 'min'} onChange={(e) => setRollMax(e.target.value === 'max')} className="d2-select">
                <option value="max">上限</option><option value="min">下限</option>
              </select>
            </label>
            <span className="flex-1" />
            <span className="d2-field">剩餘屬性點 <b style={{ color: remaining ? 'var(--bad)' : 'var(--gold-bright)', fontSize: 16 }}>{remaining}</b></span>
          </div>
        </div>
      </div>

      {toast && <div role="status" className="d2-toast">{toast}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* 左半：物品欄 */}
        <div className="d2-panel min-w-0">
          <div className="d2-title">物 品 欄</div>
          <div className="d2-panel-body">
            <PaperDollV2 engineClass={cls.en} equipped={equipped} charms={charms} swap={swap} onSwap={setSwap} dragging={dragging}
              canDrop={canDrop} onDropItem={place} onRemoveCharm={(i) => setCharms((c) => c.filter((_, j) => j !== i))}
              selected={selected} onSelect={setSelected} unmet={unmetSlots} />
            {selEq && selected && (
              <div className="mt-4">
                <div className="d2-tip">
                  <div className={`nm ${selEq.entry.kind === 'set' ? 't-set' : 't-unique'}`}>{selEq.entry.name}</div>
                  <div className="base">{selEq.entry.baseName}{selEq.ethereal ? '（無形）' : ''}</div>
                  {selEq.entry.levelReq ? <div className="base">需要等級：{selEq.entry.levelReq}</div> : null}
                  {describeModifiers(selEq.entry.mods, rollMax ? 1 : 0, level).map((l, i) => <div key={i} className={`mod ${l.known ? '' : 'is-unknown'}`}>{l.text}</div>)}
                  {selEq.entry.setName && <div className="t-set">{selEq.entry.setName}</div>}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                  {(selEq.entry.group === 'armor' || selEq.entry.group === 'weapon') && (
                    <label className="d2-field"><input type="checkbox" className="d2-check" checked={!!selEq.ethereal} onChange={(e) => setEquipped((m) => ({ ...m, [selected]: { ...m[selected]!, ethereal: e.target.checked } }))} />無形</label>
                  )}
                  <button type="button" onClick={() => unequip(selected)} className="d2-btn is-danger">卸下</button>
                </div>
                <SocketEditor eq={selEq} level={level} onChange={(patch) => patchEquipped(selected, patch)} onChangeBase={(code) => changeBase(selected, code)} />
              </div>
            )}
          </div>
        </div>

        {/* 右半：三個 tab */}
        <div className="d2-panel min-w-0">
          <div className="d2-tabs" role="tablist">
            {([['stats', '屬性頁'], ['gear', '樹狀裝備庫'], ['skills', '技能樹']] as [TabKey, string][]).map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => { setTab(k); if (k === 'gear') setPickerOpen(true); }} className="d2-tab">{label}</button>
            ))}
          </div>
          <div className="d2-panel-body">
            {tab === 'stats' && (
              <AttributesTab className={cls.zh} level={level} result={result} alloc={alloc} remaining={remaining} needStr={needStr} needDex={needDex}
                onAdd={onAdd} onAutoReq={onAutoReq} onAllVit={onAllVit} onReset={() => setAlloc(ZERO)} mainSkill={mainSkill}
                targetRes={targetRes} onTargetRes={setTargetRes} buffs={buffPanel} onToggleBuff={(id) => setBuffsOn((m) => ({ ...m, [id]: !m[id] }))}
                enemyReduction={applied.enemyResReduction} />
            )}
            {tab === 'gear' && (
              <GearTreeTab open={pickerOpen} onClose={() => setPickerOpen(false)}
                onOpen={(g) => { setPickerOpen(true); if (g) setPickerJump((j) => ({ group: g, seq: (j?.seq ?? 0) + 1 })); }} />
            )}
            {tab === 'skills' && (
              <SkillTreeV2 classCode={cls.code} level={level} skillPoints={skillPoints} onUpdateSkillPoints={setSkillPoints}
                activeSkillId={activeSkillId} onSetActiveSkillId={setActiveSkillId} bonuses={skillBonuses}
                damageOpts={damageOpts} budget={skillBudget} used={skillUsed} />
            )}
          </div>
        </div>
      </div>

      {/* 底部：生命球／摘要／法力球 */}
      <div className="d2-panel" aria-live="polite">
        <div className="d2-panel-body flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <div className="d2-orb is-life" title="生命"><b>{result.life.toLocaleString()}</b><span>生命</span></div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 flex-1 min-w-[220px]">
            <div className="d2-stat"><span className="k">防禦</span><span className="v">{result.defense.toLocaleString()}</span></div>
            <div className="d2-stat"><span className="k">格擋</span><span className="v">{result.blockChance}%</span></div>
            <div className="d2-stat"><span className="k">抗性</span>
              <span className="v" style={{ fontSize: 15 }}>
                <span className="t-fire">{result.resist.fire}</span> / <span className="t-cold">{result.resist.cold}</span> / <span className="t-lightning">{result.resist.lightning}</span> / <span className="t-poison">{result.resist.poison}</span>
              </span>
            </div>
            {result.weaponDamage && <div className="d2-stat"><span className="k">武器傷害</span><span className="v">{result.weaponDamage.min}–{result.weaponDamage.max}</span></div>}
            <div className="d2-sub w-full text-center">光環與戰吼只計 lnXY 公式；變身、衰減類光環未計入</div>
          </div>
          <div className="d2-orb is-mana" title="法力"><b>{result.mana.toLocaleString()}</b><span>法力</span></div>
        </div>
      </div>

      <GearPicker open={pickerOpen} onClose={() => setPickerOpen(false)} level={level} engineClassCode={cls.code}
        onEquip={equip} onDragStart={setDragging} jump={pickerJump} />
    </section>
  );
};
