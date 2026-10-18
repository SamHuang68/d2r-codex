import React, { useMemo, useState } from 'react';
import { computeCharacter } from '../../../engine/character';
import { gameData } from '../../../engine/data';
import { ENGINE_CLASS_BY_CODE, SLOT_ZH, toEquipped, type CatalogEntry } from '../../../engine/catalog';
import { describeModifiers } from '../../../engine/describe';
import type { EquippedItem } from '../../../engine/types';
import { SkillTreeSimulator } from './../SkillTreeSimulator';
import { PaperDollV2, canFitCharm } from './PaperDollV2';
import { AttributesTab } from './AttributesTab';
import { GearTreeTab } from './GearTreeTab';
import { DOLL_SLOT_KIND, DOLL_SLOT_ZH, type Alloc, type Difficulty, type DollSlot, type EquippedMap, type Quests, type TabKey } from './types';

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
  <label className="inline-flex items-center gap-1 text-xs text-sanctuary-300" title={title}>
    {label}
    <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="bg-sanctuary-950 border border-sanctuary-600 text-sanctuary-100 px-1 py-0.5">
      {Array.from({ length: max + 1 }, (_, i) => <option key={i} value={i}>{i}</option>)}
    </select>
  </label>
);

export const SimulatorV2: React.FC<SimulatorV2Props> = ({ initialClass = '魔法使' }) => {
  const [cls, setCls] = useState(CLASSES.find((c) => c.zh === initialClass) ?? CLASSES[1]);
  const [level, setLevel] = useState(90);
  const [difficulty, setDifficulty] = useState<Difficulty>('hell');
  const [quests, setQuests] = useState<Quests>({ lifePotions: 3, anya: 3, lamEsen: 3 }) // 預設地獄、三難度任務皆完成；可調整;
  const [alloc, setAlloc] = useState<Alloc>(ZERO);
  const [equipped, setEquipped] = useState<EquippedMap>({});
  const [charms, setCharms] = useState<CatalogEntry[]>([]);
  const [swap, setSwap] = useState<'I' | 'II'>('I');
  const [rollMax, setRollMax] = useState(true);
  const [tab, setTab] = useState<TabKey>('stats');
  const [selected, setSelected] = useState<DollSlot | null>(null);
  const [dragging, setDragging] = useState<CatalogEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [skillPoints, setSkillPoints] = useState<Record<string, number>>({});
  const [activeSkillId, setActiveSkillId] = useState<string>('');

  const say = (m: string) => { setToast(m); window.setTimeout(() => setToast((t) => (t === m ? null : t)), 3500); };

  // ── 引擎輸入 ──
  const engineItems: EquippedItem[] = useMemo(() => {
    const out: EquippedItem[] = [];
    const arm: DollSlot[] = swap === 'I' ? ['weaponI', 'shieldI'] : ['weaponII', 'shieldII'];
    (Object.keys(equipped) as DollSlot[]).forEach((k) => {
      if ((k === 'weaponI' || k === 'shieldI' || k === 'weaponII' || k === 'shieldII') && !arm.includes(k)) return;
      const eq = equipped[k]; if (!eq) return;
      const kind = DOLL_SLOT_KIND[k];
      out.push(toEquipped(eq.entry, kind === 'weapon' ? 'weapon' : kind === 'shield' ? 'shield' : k, { ethereal: eq.ethereal, roll: rollMax ? 1 : 0 }));
    });
    charms.forEach((c, i) => out.push(toEquipped(c, `charm${i}`, { roll: rollMax ? 1 : 0 })));
    return out;
  }, [equipped, charms, swap, rollMax]);

  const result = useMemo(() => computeCharacter(gameData, {
    className: cls.en, level, allocated: alloc, items: engineItems, difficulty, anyaScrolls: quests.anya, quests: { lifePotions: quests.lifePotions },
  }), [cls, level, alloc, engineItems, difficulty, quests]);

  const totalPoints = (level - 1) * 5 + quests.lamEsen * 5;
  const used = alloc.str + alloc.dex + alloc.vit + alloc.ene;
  const remaining = Math.max(0, totalPoints - used);
  const needStr = Math.max(0, ...engineItems.map((i) => baseByCode.get(i.baseCode)?.reqStr ?? 0));
  const needDex = Math.max(0, ...engineItems.map((i) => baseByCode.get(i.baseCode)?.reqDex ?? 0));
  const unmetSlots = useMemo(() => {
    const m: Record<string, boolean> = {};
    result.requirementsUnmet.forEach((u) => { m[u.slot === 'weapon' ? (swap === 'I' ? 'weaponI' : 'weaponII') : u.slot === 'shield' ? (swap === 'I' ? 'shieldI' : 'shieldII') : u.slot] = true; });
    return m;
  }, [result, swap]);

  // ── 穿戴規則 ──
  const targetFor = (entry: CatalogEntry, hint?: DollSlot | 'charms'): DollSlot | 'charms' | null => {
    if (entry.slot === 'charm') return 'charms';
    if (hint && hint !== 'charms') return DOLL_SLOT_KIND[hint] === entry.slot ? hint : null;
    switch (entry.slot) {
      case 'ring': return !equipped.ring1 ? 'ring1' : !equipped.ring2 ? 'ring2' : 'ring1';
      case 'weapon': return swap === 'I' ? 'weaponI' : 'weaponII';
      case 'shield': return swap === 'I' ? 'shieldI' : 'shieldII';
      default: return entry.slot as DollSlot;
    }
  };
  const canDrop = (target: DollSlot | 'charms', entry: CatalogEntry): string | null => {
    if (target === 'charms') return entry.slot !== 'charm' ? '只有護身符能放進背包' : canFitCharm(charms, entry) ? null : '背包空間不足';
    if (DOLL_SLOT_KIND[target] !== entry.slot) return `「${entry.name}」是${SLOT_ZH[entry.slot]}，不能放在${DOLL_SLOT_ZH[target]}`;
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
    setCls(c); setAlloc(ZERO); setSkillPoints({}); setActiveSkillId('');
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
  const clearAll = () => { setEquipped({}); setCharms([]); setAlloc(ZERO); setSelected(null); };

  const selEq = selected ? equipped[selected] : undefined;
  const skillsBonus = result.skills.all + (result.skills.byClass[cls.en] ?? 0);

  return (
    <section className="space-y-3" aria-label="配裝模擬器">
      {/* 頂部列 */}
      <div className="border border-sanctuary-600 bg-sanctuary-900 p-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="職業">
          {CLASSES.map((c) => (
            <button key={c.code} type="button" role="tab" aria-selected={c.code === cls.code} onClick={() => selectClass(c)}
              className={`px-2.5 py-1 text-sm border ${c.code === cls.code ? 'border-d2-gold text-d2-gold' : 'border-sanctuary-600 text-sanctuary-300 hover:text-sanctuary-100'}`}>{c.zh}</button>
          ))}
        </div>
        <label className="text-xs text-sanctuary-300 inline-flex items-center gap-1">等級
          <input type="number" min={1} max={99} value={level} onChange={(e) => setLevel(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} className="w-14 bg-sanctuary-950 border border-sanctuary-600 text-sanctuary-100 px-1 py-0.5" />
        </label>
        <label className="text-xs text-sanctuary-300 inline-flex items-center gap-1">難度
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="bg-sanctuary-950 border border-sanctuary-600 text-sanctuary-100 px-1 py-0.5">
            {(Object.keys(DIFF_ZH) as Difficulty[]).map((d) => <option key={d} value={d}>{DIFF_ZH[d]}</option>)}
          </select>
        </label>
        <span className="text-xs text-sanctuary-400">任務：</span>
        <NumSelect label="生命藥水" value={quests.lifePotions} max={3} onChange={(n) => setQuests((q) => ({ ...q, lifePotions: n }))} title="第三幕「金鳥」，每難度 +20 最大生命" />
        <NumSelect label="安亞卷軸" value={quests.anya} max={3} onChange={(n) => setQuests((q) => ({ ...q, anya: n }))} title="第五幕，每難度 +10 全抗" />
        <NumSelect label="拉姆艾森之書" value={quests.lamEsen} max={3} onChange={(n) => setQuests((q) => ({ ...q, lamEsen: n }))} title="第三幕，每難度 +5 屬性點" />
        <label className="text-xs text-sanctuary-300 inline-flex items-center gap-1" title="裝備詞綴範圍值取上限或下限">屬性取值
          <select value={rollMax ? 'max' : 'min'} onChange={(e) => setRollMax(e.target.value === 'max')} className="bg-sanctuary-950 border border-sanctuary-600 text-sanctuary-100 px-1 py-0.5">
            <option value="max">上限</option><option value="min">下限</option>
          </select>
        </label>
        <div className="flex-1" />
        <span className="text-xs text-sanctuary-300">剩餘屬性點 <b className={remaining ? 'text-red-400' : 'text-d2-gold'}>{remaining}</b></span>
        <button type="button" onClick={share} className="text-xs border border-sanctuary-600 px-2 py-1 text-sanctuary-200 hover:bg-sanctuary-700">分享</button>
        <button type="button" onClick={clearAll} className="text-xs border border-sanctuary-600 px-2 py-1 text-sanctuary-200 hover:bg-sanctuary-700">清空</button>
      </div>

      {toast && <div role="status" className="border border-red-500/60 bg-red-950/40 text-red-200 text-sm px-3 py-2">{toast}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* 左半：裝備頁 */}
        <div className="border border-sanctuary-600 bg-sanctuary-900 p-3">
          <div className="text-d2-gold text-sm font-semibold mb-2">裝備欄</div>
          <PaperDollV2 engineClass={cls.en} equipped={equipped} charms={charms} swap={swap} onSwap={setSwap} dragging={dragging}
            canDrop={canDrop} onDropItem={place} onRemoveCharm={(i) => setCharms((c) => c.filter((_, j) => j !== i))}
            selected={selected} onSelect={setSelected} unmet={unmetSlots} />
          {selEq && selected && (
            <div className="mt-3 border border-sanctuary-600 bg-sanctuary-950 p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className={selEq.entry.kind === 'set' ? 'text-d2-set' : 'text-d2-unique'}>{selEq.entry.name}<span className="ml-2 text-xs text-sanctuary-500">{selEq.entry.nameEn}</span></div>
                  <div className="text-xs text-sanctuary-400">{selEq.entry.baseName}{selEq.entry.levelReq ? ` · 需求 Lv${selEq.entry.levelReq}` : ''}{selEq.entry.setName ? ` · ${selEq.entry.setName}` : ''}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {(selEq.entry.group === 'armor' || selEq.entry.group === 'weapon') && (
                    <label className="text-xs text-sanctuary-300 inline-flex items-center gap-1"><input type="checkbox" checked={!!selEq.ethereal} onChange={(e) => setEquipped((m) => ({ ...m, [selected]: { ...m[selected]!, ethereal: e.target.checked } }))} />無形</label>
                  )}
                  <button type="button" onClick={() => unequip(selected)} className="text-xs border border-red-500/60 text-red-300 px-2 py-0.5 hover:bg-red-500/10">卸下</button>
                </div>
              </div>
              <ul className="mt-2 text-xs space-y-0.5 text-d2-magic">
                {describeModifiers(selEq.entry.mods, rollMax ? 1 : 0, level).map((l, i) => <li key={i} className={l.known ? '' : 'text-red-400'}>{l.text}</li>)}
                {selEq.entry.sockets && <li className="text-sanctuary-400">符文：{selEq.entry.sockets.join(' + ')}（鑲嵌效果已計入）</li>}
              </ul>
            </div>
          )}
        </div>

        {/* 右半：三個 tab */}
        <div className="border border-sanctuary-600 bg-sanctuary-900">
          <div className="flex" role="tablist">
            {([['stats', '屬性頁'], ['gear', '樹狀裝備庫'], ['skills', '技能樹']] as [TabKey, string][]).map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`flex-1 py-2.5 text-sm border-b ${tab === k ? 'border-d2-gold text-d2-gold bg-sanctuary-800' : 'border-sanctuary-600 text-sanctuary-400 hover:text-sanctuary-100'}`}>{label}</button>
            ))}
          </div>
          <div className="p-3">
            {tab === 'stats' && (
              <AttributesTab className={cls.zh} level={level} result={result} alloc={alloc} remaining={remaining} needStr={needStr} needDex={needDex}
                onAdd={onAdd} onAutoReq={onAutoReq} onAllVit={onAllVit} onReset={() => setAlloc(ZERO)} />
            )}
            {tab === 'gear' && <GearTreeTab level={level} engineClassCode={cls.code} onEquip={equip} onDragStart={setDragging} />}
            {tab === 'skills' && (
              <SkillTreeSimulator className={cls.zh} skillPoints={skillPoints} onUpdateSkillPoints={setSkillPoints}
                activeSkillId={activeSkillId} onSetActiveSkillId={setActiveSkillId} allSkillsBonus={skillsBonus} />
            )}
          </div>
        </div>
      </div>

      {/* 底部即時摘要 */}
      <div className="border border-sanctuary-600 bg-sanctuary-900 px-4 py-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-sanctuary-300" aria-live="polite">
        <span>生命 <b className="text-d2-gold">{result.life.toLocaleString()}</b></span>
        <span>法力 <b className="text-d2-gold">{result.mana.toLocaleString()}</b></span>
        <span>防禦 <b className="text-d2-gold">{result.defense.toLocaleString()}</b></span>
        <span>格擋 <b className="text-d2-gold">{result.blockChance}%</b></span>
        <span>抗性 <b className="text-d2-gold">{result.resist.fire}/{result.resist.cold}/{result.resist.lightning}/{result.resist.poison}</b></span>
        {result.weaponDamage && <span>武器傷害 <b className="text-d2-gold">{result.weaponDamage.min}–{result.weaponDamage.max}</b></span>}
        <span className="text-sanctuary-500">未計入：光環／戰吼／BO／變身／技能傷害</span>
      </div>
    </section>
  );
};
