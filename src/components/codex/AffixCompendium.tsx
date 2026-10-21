import React, { useMemo, useState } from 'react';
import { Search, Tag } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import {
  AFFIXES, AFFIX_KINDS, AFFIX_KIND_ZH, ITEM_TYPE_GROUPS, affixAppliesToType, affixAvailableAt, affixClass, affixLines, affixesFor, classZh, hasNegativeCharges, isUnknownType, itemTypeLabel,
  type Affix, type AffixKind,
} from '../../data/codex/magicAffixes';

const PAGE = 80;
const KIND_TONE: Record<AffixKind, string> = {
  prefix: 'text-d2-magic border-d2-magic/40 bg-d2-magic/10',
  suffix: 'text-d2-gold border-d2-gold/40 bg-d2-gold/10',
  auto: 'text-d2-unique border-d2-unique/40 bg-d2-unique/10',
};
const inputCls = 'bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-100 focus:outline-none focus:border-d2-magic/50';

const fmtPct = (v: number): string => (v >= 0.1 ? `${(v * 100).toFixed(1)}%` : `${(v * 100).toFixed(2)}%`);

const AffixRow: React.FC<{ a: Affix; share?: number; onGroup: (g: number) => void }> = ({ a, share, onGroup }) => {
  const cls = affixClass(a);
  const lines = affixLines(a);
  return (
    <div className="rounded-xl border border-sanctuary-800/80 bg-sanctuary-900/40 p-3 sm:p-4 flex flex-col lg:flex-row gap-2 lg:gap-4">
      <div className="lg:w-56 shrink-0 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sanctuary-100">{a.name}</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${KIND_TONE[a.kind]}`}>{AFFIX_KIND_ZH[a.kind]}</span>
          {a.rare && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sanctuary-800 text-sanctuary-300" title="稀有物品也可能抽到這個詞綴">稀有可出現</span>}
          {hasNegativeCharges(a) && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-d2-fire/40 text-d2-fire bg-d2-fire/10" title="資料表給的充能技能等級與次數都是負數；這種寫法在遊戲內的實際效果尚未驗證">充能數值為負</span>}
        </div>
        <div className="text-[11px] font-mono text-sanctuary-500 truncate">{a.nameEn}</div>
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <ul className="text-sm text-sanctuary-100 space-y-0.5">
          {lines.map((t, i) => <li key={i}>{t}</li>)}
          {lines.length === 0 && <li className="text-sanctuary-500">（沒有可顯示的屬性）</li>}
        </ul>
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] text-sanctuary-500 font-mono mr-0.5">可出現於</span>
          {a.itypes.map((t) => (
            <span key={t} className={`text-[11px] px-1.5 py-0.5 rounded border ${isUnknownType(t) ? 'border-d2-fire/40 text-d2-fire bg-d2-fire/10' : 'border-sanctuary-700 text-sanctuary-300 bg-sanctuary-950/60'}`}
              title={isUnknownType(t) ? `資料表的類型代碼「${t}」不存在（筆誤），遊戲讀表時不會符合任何物品` : t}>
              {itemTypeLabel(t)}
            </span>
          ))}
          {a.etypes.length > 0 && <span className="text-[10px] text-sanctuary-500 font-mono ml-1">排除</span>}
          {a.etypes.map((t) => <span key={t} className="text-[11px] px-1.5 py-0.5 rounded border border-sanctuary-700 text-sanctuary-400 line-through decoration-sanctuary-600">{itemTypeLabel(t)}</span>)}
        </div>
      </div>
      <div className="lg:w-60 shrink-0 text-[11px] font-mono text-sanctuary-400 flex flex-wrap lg:flex-col lg:items-end gap-x-3 gap-y-0.5">
        <span title="物品等級（alvl）要落在這個範圍才會抽到">物品等級 {a.level}–{a.maxLevel ?? '不限'}</span>
        <span title="這個詞綴讓物品增加的角色等級需求">需求等級 +{a.levelReq}</span>
        {cls && <span className="text-sanctuary-200" title="資料表的職業欄位">職業：{classZh(cls)}{a.classLevelReq ? `（等級需求 ${a.classLevelReq}）` : ''}</span>}
        <button type="button" onClick={() => onGroup(a.group)} className="underline decoration-dotted hover:text-sanctuary-100" title="同一組的詞綴在同一件物品上只會出現一個；點這裡只看這一組">組 {a.group}</button>
        <span title="抽選權重：同條件的候選詞綴裡，權重越大越容易抽到">權重 {a.frequency}{share !== undefined && <span className="text-d2-magic">　≈ {fmtPct(share)}</span>}</span>
      </div>
    </div>
  );
};

export const AffixCompendium: React.FC = () => {
  const [kind, setKind] = useState<AffixKind | 'all'>('all');
  const [type, setType] = useState('');
  const [ilvlText, setIlvlText] = useState('');
  const [q, setQ] = useState('');
  const [rareOnly, setRareOnly] = useState(false);
  const [hideNegative, setHideNegative] = useState(false);
  const [group, setGroup] = useState<number | null>(null);
  const [sort, setSort] = useState<'group' | 'level' | 'name'>('group');
  const [limit, setLimit] = useState(PAGE);

  const ilvl = /^\d+$/.test(ilvlText.trim()) ? Math.min(99, Math.max(1, Number(ilvlText.trim()))) : undefined;
  const reset = () => setLimit(PAGE);

  /** 目前「物品類型＋物品等級」下的候選詞綴；兩個都設了才算權重占比 */
  const totals = useMemo(() => {
    if (!type || ilvl === undefined) return undefined;
    const t: Record<AffixKind, number> = { prefix: 0, suffix: 0, auto: 0 };
    for (const a of affixesFor(type, ilvl)) t[a.kind] += a.frequency;
    return t;
  }, [type, ilvl]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const rows = AFFIXES.filter((a) => {
      if (kind !== 'all' && a.kind !== kind) return false;
      if (group !== null && a.group !== group) return false;
      if (rareOnly && !a.rare) return false;
      if (hideNegative && hasNegativeCharges(a)) return false;
      if (type && !affixAppliesToType(a, type)) return false;
      if (ilvl !== undefined && !affixAvailableAt(a, ilvl)) return false;
      if (t && !(a.name.toLowerCase().includes(t) || a.nameEn.toLowerCase().includes(t) || affixLines(a).some((l) => l.toLowerCase().includes(t)))) return false;
      return true;
    });
    const kindOrder = (a: Affix) => AFFIX_KINDS.indexOf(a.kind);
    if (sort === 'level') rows.sort((a, b) => a.level - b.level || kindOrder(a) - kindOrder(b) || a.group - b.group);
    else if (sort === 'name') rows.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant') || a.level - b.level);
    else rows.sort((a, b) => kindOrder(a) - kindOrder(b) || a.group - b.group || a.level - b.level);
    return rows;
  }, [kind, group, rareOnly, hideNegative, type, ilvl, q, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <PageHeader
        icon={<Tag className="w-7 h-7" />}
        title="詞綴寶典"
        tone="text-d2-magic"
        desc="魔法與稀有物品的前綴、後綴與自動詞綴全表：每個詞綴的屬性範圍、可以出現在哪些物品、要多高的物品等級、抽選權重。選一種物品類型和物品等級，就能看到那件物品實際可能長出哪些詞綴。"
      />

      <div className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1" role="group" aria-label="詞綴種類">
            {(['all', ...AFFIX_KINDS] as const).map((k) => (
              <button key={k} type="button" onClick={() => { setKind(k); reset(); }} aria-pressed={kind === k}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${kind === k ? 'bg-d2-magic text-sanctuary-950 font-bold shadow' : 'bg-sanctuary-950/80 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'}`}>
                {k === 'all' ? '全部' : AFFIX_KIND_ZH[k]}
              </button>
            ))}
          </div>
          <select value={type} onChange={(e) => { setType(e.target.value); reset(); }} aria-label="物品類型" className={inputCls}>
            <option value="">所有物品類型</option>
            {ITEM_TYPE_GROUPS.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}
              </optgroup>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-xs text-sanctuary-300" title="物品等級（ilvl）；遊戲用它判斷詞綴等級（alvl）。留空＝不限">
            物品等級
            <input type="text" inputMode="numeric" value={ilvlText} onChange={(e) => { setIlvlText(e.target.value); reset(); }} placeholder="1–99" aria-label="物品等級"
              className={`${inputCls} w-20 font-mono`} />
          </label>
          <div className="relative flex-1 md:max-w-xs">
            <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="search" value={q} onChange={(e) => { setQ(e.target.value); reset(); }} placeholder="搜尋詞綴名稱或屬性…" aria-label="搜尋詞綴" className={`${inputCls} w-full pl-9`} />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="排序" className={inputCls}>
            <option value="group">依組別</option><option value="level">依物品等級</option><option value="name">依名稱</option>
          </select>
        </div>
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <label className="flex items-center gap-1.5 text-sanctuary-300 cursor-pointer">
            <input type="checkbox" checked={rareOnly} onChange={(e) => { setRareOnly(e.target.checked); reset(); }} className="accent-d2-magic" />
            只看稀有物品也會出現的
          </label>
          <label className="flex items-center gap-1.5 text-sanctuary-300 cursor-pointer" title="職業專用後綴裡有 112 個，充能技能的等級與次數在資料表中是負數，實際效果尚未驗證">
            <input type="checkbox" checked={hideNegative} onChange={(e) => { setHideNegative(e.target.checked); reset(); }} className="accent-d2-magic" />
            隱藏充能數值為負的詞綴
          </label>
          {group !== null && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-d2-magic/40 text-d2-magic bg-d2-magic/10">
              只看組 {group}
              <button type="button" onClick={() => { setGroup(null); reset(); }} className="underline text-sanctuary-300 ml-1">清除</button>
            </span>
          )}
          {totals && <span className="text-sanctuary-500">已選物品類型與等級：每列的「≈ 百分比」＝同種類候選詞綴中的權重占比</span>}
          <span className="ml-auto text-sanctuary-500">{list.length} / {AFFIXES.length} 個詞綴</span>
        </div>
      </div>

      <div className="space-y-2" aria-label="詞綴清單">
        {list.slice(0, limit).map((a) => (
          <AffixRow key={a.id} a={a} share={totals && totals[a.kind] > 0 ? a.frequency / totals[a.kind] : undefined} onGroup={(g) => { setGroup(g); reset(); }} />
        ))}
        {list.length === 0 && <div className="text-sm text-sanctuary-500 py-8 text-center">沒有符合條件的詞綴</div>}
        {list.length > limit && (
          <button type="button" onClick={() => setLimit(limit + PAGE)} className="w-full py-2.5 rounded-xl border border-sanctuary-800 text-xs text-sanctuary-300 hover:text-sanctuary-100 hover:bg-sanctuary-900">
            再顯示 {Math.min(PAGE, list.length - limit)} 個（剩 {list.length - limit} 個）
          </button>
        )}
      </div>

      <div className="text-[11px] text-sanctuary-600 space-y-1">
        <p>資料來自遊戲 magicprefix.txt、magicsuffix.txt、automagic.txt（3.3.93847）。已排除遊戲設定為不會產生、權重為 0 或沒有任何屬性的列。屬性範圍以 99 級角色的數值呈現；「依角色等級」的屬性用算式表示。</p>
        <p>物品類型有繼承：選「大型護身符」會同時包含寫給「護身符」的詞綴。資料表裡有兩處類型代碼筆誤（staff、「ring 」帶空白），以紅框標示，遊戲讀表時不會符合任何物品，這裡照樣不符合。</p>
        <p>未納入：部分底材的詞綴等級加成（magic_lvl）、遊戲內其他影響抽選的修正；權重占比是資料表權重的相對值，不等於實際掉落機率。職業與職業等級需求照資料表欄位顯示，尚未在遊戲內逐項驗證。</p>
      </div>
    </div>
  );
};
