import React, { useEffect, useMemo, useState } from 'react';
import { Search, Tag } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import affixLinesEnJson from '../../data/codex/affixLinesEn.json';
import {
  AFFIXES, AFFIX_KINDS, AFFIX_KIND_ZH, ITEM_TYPE_GROUPS, affixAppliesToType, affixAvailableAt, affixClass, affixLines, affixesFor, classZh, classEn, hasNegativeCharges, isUnknownType, itemTypeLabel,
  type Affix, type AffixKind,
} from '../../data/codex/magicAffixes';

const affixLinesEnMap = affixLinesEnJson as Record<string, string>;
const PAGE = 80;
const AFFIX_KIND_EN: Record<AffixKind, string> = {
  prefix: 'Prefix',
  suffix: 'Suffix',
  auto: 'Auto-Affix',
};

const KIND_TONE: Record<AffixKind, string> = {
  prefix: 'text-d2-magic border-d2-magic/40 bg-d2-magic/10',
  suffix: 'text-d2-gold border-d2-gold/40 bg-d2-gold/10',
  auto: 'text-d2-unique border-d2-unique/40 bg-d2-unique/10',
};
const inputCls = 'bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-100 focus:outline-none focus:border-d2-magic/50';

const fmtPct = (v: number): string => (v >= 0.1 ? `${(v * 100).toFixed(1)}%` : `${(v * 100).toFixed(2)}%`);

const AffixRow: React.FC<{ a: Affix; share?: number; onGroup: (g: number) => void }> = ({ a, share, onGroup }) => {
  const { isEn } = useLanguage();
  const cls = affixClass(a);
  const lines = affixLines(a).map((l) => (isEn ? (affixLinesEnMap[l] ?? l) : l));
  return (
    <div className="rounded-xl border border-sanctuary-800/80 bg-sanctuary-900/40 p-3 sm:p-4 flex flex-col lg:flex-row gap-2 lg:gap-4">
      <div className="lg:w-56 shrink-0 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sanctuary-100">{isEn && a.nameEn ? a.nameEn : a.name}</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${KIND_TONE[a.kind]}`}>{isEn ? AFFIX_KIND_EN[a.kind] : AFFIX_KIND_ZH[a.kind]}</span>
          {a.rare && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sanctuary-800 text-sanctuary-300" title={isEn ? "Can spawn on rare items" : "稀有物品也可能抽到這個詞綴"}>{isEn ? "Rare eligible" : "稀有可出現"}</span>}
          {hasNegativeCharges(a) && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-d2-fire/40 text-d2-fire bg-d2-fire/10" title={isEn ? "Charge skill level and charges are negative in data table" : "資料表給的充能技能等級與次數都是負數；這種寫法在遊戲內的實際效果尚未驗證"}>{isEn ? "Negative charges" : "充能數值為負"}</span>}
        </div>
        {!isEn && a.nameEn && <div className="text-[11px] font-mono text-sanctuary-500 truncate">{a.nameEn}</div>}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <ul className="text-sm text-sanctuary-100 space-y-0.5">
          {lines.map((t, i) => <li key={i}>{t}</li>)}
          {lines.length === 0 && <li className="text-sanctuary-500">{isEn ? "(No displayable properties)" : "（沒有可顯示的屬性）"}</li>}
        </ul>
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] text-sanctuary-500 font-mono mr-0.5">{isEn ? "Spawns on: " : "可出現於"}</span>
          {a.itypes.map((t) => (
            <span key={t} className={`text-[11px] px-1.5 py-0.5 rounded border ${isUnknownType(t) ? 'border-d2-fire/40 text-d2-fire bg-d2-fire/10' : 'border-sanctuary-700 text-sanctuary-300 bg-sanctuary-950/60'}`}
              title={isUnknownType(t) ? (isEn ? `Type code "${t}" does not exist in game table` : `資料表的類型代碼「${t}」不存在（筆誤），遊戲讀表時不會符合任何物品`) : t}>
              {itemTypeLabel(t, isEn)}
            </span>
          ))}
          {a.etypes.length > 0 && <span className="text-[10px] text-sanctuary-500 font-mono ml-1">{isEn ? "Excludes: " : "排除"}</span>}
          {a.etypes.map((t) => <span key={t} className="text-[11px] px-1.5 py-0.5 rounded border border-sanctuary-700 text-sanctuary-400 line-through decoration-sanctuary-600">{itemTypeLabel(t, isEn)}</span>)}
        </div>
      </div>
      <div className="lg:w-60 shrink-0 text-[11px] font-mono text-sanctuary-400 flex flex-wrap lg:flex-col lg:items-end gap-x-3 gap-y-0.5">
        <span title={isEn ? "Item level (alvl) required to roll" : "物品等級（alvl）要落在這個範圍才會抽到"}>{isEn ? `alvl ${a.level}–${a.maxLevel ?? "Any"}` : `物品等級 ${a.level}–${a.maxLevel ?? "不限"}`}</span>
        <span title={isEn ? "Required character level added by this affix" : "這個詞綴讓物品增加的角色等級需求"}>{isEn ? `reqLvl +${a.levelReq}` : `需求等級 +${a.levelReq}`}</span>
        {cls && <span className="text-sanctuary-200" title={isEn ? "Class constraint" : "資料表的職業欄位"}>{isEn ? `Class: ${classEn(cls)}` : `職業：${classZh(cls)}`}{a.classLevelReq ? (isEn ? ` (Req Lv ${a.classLevelReq})` : `（等級需求 ${a.classLevelReq}）`) : ''}</span>}
        <button type="button" onClick={() => onGroup(a.group)} className="underline decoration-dotted hover:text-sanctuary-100" title={isEn ? "Only one affix from the same group can appear on an item" : "同一組的詞綴在同一件物品上只會出現一個；點這裡只看這一組"}>{isEn ? `Group ${a.group}` : `組 ${a.group}`}</button>
        <span title={isEn ? "Spawn weight: higher is more common" : "抽選權重：同條件的候選詞綴裡，權重越大越容易抽到"}>{isEn ? `Weight ${a.frequency}` : `權重 ${a.frequency}`}{share !== undefined && <span className="text-d2-magic">　≈ {fmtPct(share)}</span>}</span>
      </div>
    </div>
  );
};

export const AffixCompendium: React.FC<{ initialQuery?: string }> = ({ initialQuery }) => {
  const { isEn } = useLanguage();
  const [kind, setKind] = useState<AffixKind | 'all'>('all');
  const [type, setType] = useState('');
  const [ilvlText, setIlvlText] = useState('');
  const [q, setQ] = useState(initialQuery ?? '');
  // 從全域搜尋點進來時帶入詞綴名稱（同一頁再搜一次也要更新）
  useEffect(() => { if (initialQuery !== undefined) setQ(initialQuery); }, [initialQuery]);
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
      if (t && !(a.name.toLowerCase().includes(t) || a.nameEn.toLowerCase().includes(t) || affixLines(a).some((l) => l.toLowerCase().includes(t) || (affixLinesEnMap[l] && affixLinesEnMap[l].toLowerCase().includes(t))))) return false;
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
        title={isEn ? "Magic Affix Compendium" : "詞綴寶典"}
        tone="text-d2-magic"
        desc={isEn ? "Complete catalog of prefixes, suffixes, and auto-affixes for magic and rare items: modifier ranges, eligible base types, required item levels (alvl), and spawn weights. Select an item type and item level to see what affixes can actually spawn on that item." : "魔法與稀有物品的前綴、後綴與自動詞綴全表：每個詞綴的屬性範圍、可以出現在哪些物品、要多高的物品等級、抽選權重。選一種物品類型和物品等級，就能看到那件物品實際可能長出哪些詞綴。"}
      />

      <div className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1" role="group" aria-label="詞綴種類">
            {(['all', ...AFFIX_KINDS] as const).map((k) => (
              <button key={k} type="button" onClick={() => { setKind(k); reset(); }} aria-pressed={kind === k}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${kind === k ? 'bg-d2-magic text-sanctuary-950 font-bold shadow' : 'bg-sanctuary-950/80 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'}`}>
                {k === 'all' ? (isEn ? 'All' : '全部') : (isEn ? AFFIX_KIND_EN[k] : AFFIX_KIND_ZH[k])}
              </button>
            ))}
          </div>
          <select value={type} onChange={(e) => { setType(e.target.value); reset(); }} aria-label={isEn ? "Item Type" : "物品類型"} className={inputCls}>
            <option value="">{isEn ? "All Item Types" : "所有物品類型"}</option>
            {ITEM_TYPE_GROUPS.map((g) => (
              <optgroup key={g.label} label={isEn && g.labelEn ? g.labelEn : g.label}>
                {g.options.map((o) => <option key={o.code} value={o.code}>{isEn && o.labelEn ? o.labelEn : o.label}</option>)}
              </optgroup>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-xs text-sanctuary-300" title="物品等級（ilvl）；遊戲用它判斷詞綴等級（alvl）。留空＝不限">
            {isEn ? "Item Level" : "物品等級"}
            <input type="text" inputMode="numeric" value={ilvlText} onChange={(e) => { setIlvlText(e.target.value); reset(); }} placeholder="1–99" aria-label="物品等級"
              className={`${inputCls} w-20 font-mono`} />
          </label>
          <div className="relative flex-1 md:max-w-xs">
            <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="search" value={q} onChange={(e) => { setQ(e.target.value); reset(); }} placeholder={isEn ? "Search affix name or stat..." : "搜尋詞綴名稱或屬性…"} aria-label="搜尋詞綴" className={`${inputCls} w-full pl-9`} />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="排序" className={inputCls}>
            <option value="group">{isEn ? "By Group" : "依組別"}</option><option value="level">{isEn ? "By Item Level" : "依物品等級"}</option><option value="name">{isEn ? "By Name" : "依名稱"}</option>
          </select>
        </div>
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <label className="flex items-center gap-1.5 text-sanctuary-300 cursor-pointer">
            <input type="checkbox" checked={rareOnly} onChange={(e) => { setRareOnly(e.target.checked); reset(); }} className="accent-d2-magic" />
            {isEn ? "Rare eligible only" : "只看稀有物品也會出現的"}
          </label>
          <label className="flex items-center gap-1.5 text-sanctuary-300 cursor-pointer" title="職業專用後綴裡有 112 個，充能技能的等級與次數在資料表中是負數，實際效果尚未驗證">
            <input type="checkbox" checked={hideNegative} onChange={(e) => { setHideNegative(e.target.checked); reset(); }} className="accent-d2-magic" />
            {isEn ? "Hide negative charges" : "隱藏充能數值為負的詞綴"}
          </label>
          {group !== null && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-d2-magic/40 text-d2-magic bg-d2-magic/10">
              {isEn ? `Group ${group} only` : `只看組 ${group}`}
              <button type="button" onClick={() => { setGroup(null); reset(); }} className="underline text-sanctuary-300 ml-1">{isEn ? "Clear" : "清除"}</button>
            </span>
          )}
          {totals && <span className="text-sanctuary-500">{isEn ? "Selected item type & level: \"%\" = weight percentage among candidates of same kind" : "已選物品類型與等級：每列的「≈ 百分比」＝同種類候選詞綴中的權重占比"}</span>}
          <span className="ml-auto text-sanctuary-500">{isEn ? `${list.length} / ${AFFIXES.length} affixes` : `${list.length} / ${AFFIXES.length} 個詞綴`}</span>
        </div>
      </div>

      <div className="space-y-2" aria-label={isEn ? "Affix List" : "詞綴清單"}>
        {list.slice(0, limit).map((a) => (
          <AffixRow key={a.id} a={a} share={totals && totals[a.kind] > 0 ? a.frequency / totals[a.kind] : undefined} onGroup={(g) => { setGroup(g); reset(); }} />
        ))}
        {list.length === 0 && <div className="text-sm text-sanctuary-500 py-8 text-center">{isEn ? "No matching affixes" : "沒有符合條件的詞綴"}</div>}
        {list.length > limit && (
          <button type="button" onClick={() => setLimit(limit + PAGE)} className="w-full py-2.5 rounded-xl border border-sanctuary-800 text-xs text-sanctuary-300 hover:text-sanctuary-100 hover:bg-sanctuary-900">
            {isEn ? `Show ${Math.min(PAGE, list.length - limit)} more (${list.length - limit} remaining)` : `再顯示 ${Math.min(PAGE, list.length - limit)} 個（剩 ${list.length - limit} 個）`}
          </button>
        )}
      </div>

      <div className="text-[11px] text-sanctuary-500 space-y-1">
        {isEn ? (
          <>
            <p>Data sourced from game tables: magicprefix.txt, magicsuffix.txt, automagic.txt (3.3.93847). Filtered out non-spawning, zero-weight, or empty affixes. Ranges evaluated at level 99.</p>
            <p>Item type inheritance supported: selecting &quot;Large Charm&quot; includes affixes applicable to &quot;Charms&quot;. Two typos in game data (staff, &quot;ring &quot;) are highlighted.</p>
            <p>Omitted: base magic_lvl bonuses and external drop modifiers. Weight percentages are relative and do not reflect raw drop probability.</p>
          </>
        ) : (
          <>
            <p>資料來自遊戲 magicprefix.txt、magicsuffix.txt、automagic.txt（3.3.93847）。已排除遊戲設定為不會產生、權重為 0 或沒有任何屬性的列。屬性範圍以 99 級角色的數值呈現；「依角色等級」的屬性用算式表示。</p>
            <p>物品類型有繼承：選「大型咒符」會同時包含寫給「咒符」的詞綴。資料表裡有兩處類型代碼筆誤（staff、「ring 」帶空白），以紅框標示，遊戲讀表時不會符合任何物品，這裡照樣不符合。</p>
            <p>未納入：部分底材的詞綴等級加成（magic_lvl）、遊戲內其他影響抽選的修正；權重占比是資料表權重的相對值，不等於實際掉落機率。職業與職業等級需求照資料表欄位顯示，尚未在遊戲內逐項驗證。</p>
          </>
        )}
      </div>
    </div>
  );
};
