import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CUBE_RECIPES_DATA } from '../../data/cubeRecipes';
import { ItemIcon } from '../common/ItemIcon';
import { GameIcon } from '../common/GameIcons';
import { Plus, ArrowRight, Search } from 'lucide-react';
import { CubeRecipeData } from '../../types';
import { SectionHead } from '../common/TreeIndex';
import { HeadingText } from '../common/HeadingText';
import { useLanguage } from '../../context/LanguageContext';
import { CubeCraftShowcase, CubeShowcaseTab } from './CubeCraftShowcase';
import { CraftedItemsCatalog } from './CraftedItemsCatalog';
import { getAllCraftedRecipes } from '../../data/codex/craftedItems';
import { CUBE_CATEGORY_LABEL, CUBE_NAV_EVENT, CUBE_RECIPE_ALIASES } from '../../data/cubeCategories';

export interface CubeLabProps {
  initialQuery?: string;
  onNavigateToRune?: (runeNumber: number) => void;
}

type Cat = CubeRecipeData['category'];
type Sub = 'unique-weapon' | 'unique-armor' | 'rare-weapon' | 'rare-armor';

const CATS: Cat[] = ['socket', 'upgrade', 'craft', 'repair', 'misc'];
const SUBS: Sub[] = ['unique-weapon', 'unique-armor', 'rare-weapon', 'rare-armor'];

const CAT_LABEL = CUBE_CATEGORY_LABEL;
const CRAFTED_COUNT = getAllCraftedRecipes().length;

/** 短說明只根據本站已收錄的方塊配方與手工大全（筆數由資料計算），不擴大成尚未核可的配方類型 */
const CAT_DESC: Record<Cat, [string, string]> = {
  socket: [
    '白裝打孔隨機公式：只能用在無前綴的普通白裝或無形白裝，特等或劣質無法以方塊打孔。依武器、胸甲、頭盔、盾牌使用不同符文與完美寶石，孔數由物品等級與底材上限決定，是準備符文之語底材的常用方式。',
    'Socket recipes for plain normal or ethereal white bases. Superior or low-quality items cannot be cube-socketed. Each slot (weapon, armor, helm, shield) uses a different rune and perfect-gem mix; the roll is 1 to the base’s ilvl cap — the usual way to prepare runeword bases.',
  ],
  upgrade: [
    '將暗金或亮黃武器與防具從一般階級升到進階，或從進階升到菁英。升級保留原有變動數值，需求力量與敏捷會隨新底材提高。依品質與部位分成暗金武器、暗金防具、亮黃武器、亮黃防具四組。',
    'Upgrade Unique or Rare weapons and armor from Normal to Exceptional, or Exceptional to Elite. Variable rolls are kept; strength and dexterity requirements follow the new base. Grouped into Unique Weapons, Unique Armor, Rare Weapons and Rare Armor.',
  ],
  craft: [
    `四大系列手工合成（血腥、施法、重擊、防護）共 ${CRAFTED_COUNT} 條完整配方，另附 6 則精選卡片。以指定底材加上符文、寶石與珠寶合成，固定屬性之外再隨機附加數條詞綴。本頁可用名稱、底材或符文搜尋大全。`,
    `All ${CRAFTED_COUNT} crafted recipes in the Blood, Caster, Hit Power and Safety families, plus six featured cards. A named base plus a rune, a gem and a jewel yields fixed mods and several random affixes. The catalog on this page is searchable by name, base or rune.`,
  ],
  repair: [
    '免金幣完全修理武器或防具；加上必要的寶石則可一次修復並為充能物品重新聚氣。另有用 Hel 符文加傳送卷軸拔除已鑲嵌物（鑲嵌物會消失）。無形裝備無法以方塊修理耐久。',
    'Fully repair a weapon or armor for no gold; adding the required gem repairs and recharges in one recipe. A Hel rune plus a Town Portal scroll unsockets an item (the socketed gems or runes are destroyed). Ethereal items cannot be repaired with the cube.',
  ],
  misc: [
    '本站目前收錄的雜項方塊公式：赦免徽章洗點、開啟秘密乳牛關、重骰魔法咒符／珠寶與亮黃物品，以及群魔亂舞儀式材料。不含尚未核可中英對照的符文或寶石升級表。',
    'The miscellaneous recipes in this codex: Token of Absolution respecs, the Secret Cow Level portal, rerolling magic charms or jewels and rare items, and Pandemonium Event organs. Rune and gem upgrade tables are not listed here until a verified bilingual overlay exists.',
  ],
};

const SUB_LABEL: Record<Sub, [string, string]> = {
  'unique-weapon': ['暗金武器', 'Unique Weapons'],
  'unique-armor': ['暗金防具', 'Unique Armor'],
  'rare-weapon': ['亮黃武器', 'Rare Weapons'],
  'rare-armor': ['亮黃防具', 'Rare Armor'],
};

const SHOWCASE_TAB: Partial<Record<Cat, CubeShowcaseTab>> = {
  socket: 'roulette',
  upgrade: 'upgrades',
  craft: 'crafts',
};

const subOf = (r: CubeRecipeData): Sub | null => {
  const m = /^upgrade_(unique|rare)_(weapon|armor)/.exec(r.id);
  return m ? (`${m[1]}-${m[2]}` as Sub) : null;
};

type View =
  | { kind: 'dir' }
  | { kind: 'cat'; cat: Cat }
  | { kind: 'sub'; sub: Sub }
  | { kind: 'recipe'; r: CubeRecipeData };

const findRecipe = (id: string) => CUBE_RECIPES_DATA.find((x) => x.id === id);

const parseHash = (h: string): View => {
  const s = decodeURIComponent(h.replace(/^#/, ''));
  if (s.startsWith('recipe-')) {
    const id = s.slice(7);
    const r = findRecipe(CUBE_RECIPE_ALIASES[id] ?? id);
    if (r) return { kind: 'recipe', r };
  }
  if (s.startsWith('cube-upgrade-')) {
    const sub = s.slice('cube-upgrade-'.length) as Sub;
    if (SUBS.includes(sub)) return { kind: 'sub', sub };
  }
  if (s.startsWith('cube-')) {
    const c = s.slice(5) as Cat;
    if (CATS.includes(c)) return { kind: 'cat', cat: c };
  }
  return { kind: 'dir' };
};

const recipeHash = (id: string) => `recipe-${id}`;

export const CubeLab: React.FC<CubeLabProps> = ({ initialQuery, onNavigateToRune }) => {
  const { t, isEn } = useLanguage();
  const L = (p: [string, string]) => (isEn ? p[1] : p[0]);
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''));
  const [catalogQuery, setCatalogQuery] = useState<string | undefined>(undefined);
  const [lookup, setLookup] = useState('');
  const pendingScroll = useRef<string | null>(null);
  const lastQuery = useRef<string | undefined>(undefined);

  const view = useMemo(() => parseHash(hash), [hash]);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    // 只讀網址、不呼叫 history API；App 以 pushState 導覽後送出 CUBE_NAV_EVENT（pushState 不觸發 hashchange / popstate）
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    window.addEventListener(CUBE_NAV_EVENT, sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
      window.removeEventListener(CUBE_NAV_EVENT, sync);
    };
  }, []);

  const go = useCallback((h: string, scrollId?: string) => {
    const isIndex = !h || h === 'cube-all';
    const url = isIndex
      ? `${window.location.pathname}${window.location.search}`
      : `${window.location.pathname}${window.location.search}#${h}`;
    window.history.pushState(window.history.state, '', url);
    pendingScroll.current = scrollId ?? 'cube-lab-top';
    setHash(isIndex ? '' : `#${h}`);
  }, []);

  useEffect(() => {
    const id = pendingScroll.current ?? (view.kind === 'recipe' ? recipeHash(view.r.id) : null);
    if (!id) return;
    const timer = window.setTimeout(() => {
      pendingScroll.current = null;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [view, hash]);

  useEffect(() => {
    const q = initialQuery?.trim();
    if (!q) {
      lastQuery.current = undefined;
      return;
    }
    if (lastQuery.current === q) return;
    lastQuery.current = q;
    const lq = q.toLowerCase();
    const alias = CUBE_RECIPE_ALIASES[lq.replace(/^recipe-/, '')];
    const r =
      (alias && findRecipe(alias)) ||
      CUBE_RECIPES_DATA.find(
        (x) => x.id.toLowerCase() === lq || x.title === q || x.titleEn.toLowerCase() === lq || recipeHash(x.id) === lq,
      );
    if (r) {
      go(recipeHash(r.id), recipeHash(r.id));
      return;
    }
    const term = q.startsWith('crafted_') ? q.slice(8).replace(/_/g, ' ') : q;
    setCatalogQuery(term);
    go('cube-craft', 'cube-crafted-catalog');
  }, [initialQuery, go]);

  const byCat = useMemo(() => {
    const m: Record<Cat, CubeRecipeData[]> = { socket: [], upgrade: [], craft: [], repair: [], misc: [] };
    CUBE_RECIPES_DATA.forEach((r) => m[r.category].push(r));
    return m;
  }, []);
  const bySub = useMemo(() => {
    const m: Record<Sub, CubeRecipeData[]> = {
      'unique-weapon': [],
      'unique-armor': [],
      'rare-weapon': [],
      'rare-armor': [],
    };
    byCat.upgrade.forEach((r) => {
      const s = subOf(r);
      if (s) m[s].push(r);
    });
    return m;
  }, [byCat]);

  const activeCat: Cat | null =
    view.kind === 'cat'
      ? view.cat
      : view.kind === 'sub'
        ? 'upgrade'
        : view.kind === 'recipe'
          ? view.r.category
          : null;
  const activeSub: Sub | null = view.kind === 'sub' ? view.sub : view.kind === 'recipe' ? subOf(view.r) : null;

  const href = (h: string) => {
    const isIndex = !h || h === 'cube-all';
    const path = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/cube/';
    return isIndex ? path : `${path}#${h}`;
  };
  const link = (h: string, scrollId?: string) => ({
    href: href(h),
    onClick: (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      go(h, scrollId);
    },
  });

  const badge = (n: number, on: boolean) => (
    <span
      className={`ml-2 inline-block min-w-[1.75rem] px-1.5 py-0.5 rounded-md text-xs font-mono tabular-nums text-center ${
        on ? 'bg-d2-magic text-sanctuary-950' : 'bg-sanctuary-950 text-sanctuary-300'
      }`}
    >
      {n}
    </span>
  );

  const craftedList = useMemo(() => getAllCraftedRecipes(), []);
  const lookupHits = useMemo(() => {
    const q = lookup.trim().toLowerCase();
    if (!q) return [] as { key: string; label: string; onPick: () => void }[];
    const rows: { key: string; label: string; onPick: () => void }[] = [];
    CUBE_RECIPES_DATA.forEach((r) => {
      if (r.title.toLowerCase().includes(q) || r.titleEn.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) {
        rows.push({
          key: r.id,
          label: isEn ? r.titleEn : r.title,
          onPick: () => go(recipeHash(r.id), recipeHash(r.id)),
        });
      }
    });
    craftedList.forEach((cr) => {
      const hay = `${cr.name} ${cr.nameEn} ${cr.id}`.toLowerCase();
      if (hay.includes(q)) {
        rows.push({
          key: `crafted_${cr.id}`,
          label: isEn ? cr.nameEn : cr.name,
          onPick: () => {
            setCatalogQuery(isEn ? cr.nameEn : cr.name);
            go('cube-craft', 'cube-crafted-catalog');
          },
        });
      }
    });
    return rows;
  }, [lookup, isEn, craftedList, go]);

  const renderRecipeCard = (recipe: CubeRecipeData, HeadingTag: 'h3' | 'h4') => {
    const inputs = isEn && recipe.inputsEn ? recipe.inputsEn : recipe.inputs;
    return (
      <div
        key={recipe.id}
        id={recipeHash(recipe.id)}
        className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-magic/50 shadow-xl transition-all duration-200 flex flex-col justify-between group scroll-mt-36"
      >
        <div>
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-sanctuary-850">
            <div className="min-w-0">
              <HeadingTag className="font-diablo text-base font-bold text-d2-magic group-hover:text-blue-300 transition-colors">
                {isEn && recipe.titleEn ? recipe.titleEn : recipe.title}
              </HeadingTag>
              {!isEn && recipe.titleEn && (
                <div className="text-xs text-sanctuary-400 font-mono italic">{recipe.titleEn}</div>
              )}
            </div>
            <span className="shrink-0 whitespace-nowrap text-[11px] px-2 py-0.5 rounded bg-d2-magic/10 text-d2-magic border border-d2-magic/30 font-medium">
              {L(CAT_LABEL[recipe.category])}
            </span>
          </div>
          <div className="py-4 space-y-3">
            <div className="text-[13px] text-sanctuary-400 font-medium flex items-center justify-between gap-2">
              <span className="whitespace-nowrap">{isEn ? 'Transmutation Inputs:' : '方塊投入材料 (Inputs)：'}</span>
              <span className="text-xs text-sanctuary-500 font-mono shrink-0 whitespace-nowrap">
                {isEn ? `${inputs.length} Items` : `${recipe.inputs.length} 件材料`}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 shadow-inner">
              {inputs.map((inp, idx) => {
                const runeMatch = inp.match(/(\d+)#/);
                const runeNum = runeMatch ? parseInt(runeMatch[1], 10) : null;
                return (
                  <React.Fragment key={idx}>
                    {runeNum && onNavigateToRune ? (
                      <button
                        type="button"
                        onClick={() => onNavigateToRune(runeNum)}
                        className="px-2.5 py-1.5 rounded-lg bg-sanctuary-950 hover:bg-d2-rune/20 border border-d2-rune/40 hover:border-d2-rune text-xs text-d2-rune hover:text-white font-mono font-medium transition-all cursor-pointer shadow-sm flex items-center gap-1.5 group/rune"
                        title={
                          isEn
                            ? `View Rune #${runeNum} details & upgrade recipe`
                            : `點擊查看 ${runeNum}# 符文詳細屬性與升級配方`
                        }
                      >
                        <ItemIcon runeNumber={runeNum} size="sm" showBorder={false} />
                        <span>{inp}</span>
                        <span className="text-[9px] opacity-60 group-hover/rune:opacity-100">↗</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1.5 rounded-lg bg-sanctuary-950 border border-sanctuary-800 text-xs text-sanctuary-200 font-medium flex items-center gap-1.5 shadow-sm">
                        <ItemIcon name={inp} size="sm" showBorder={false} />
                        <span className="truncate max-w-[160px]">{inp}</span>
                      </span>
                    )}
                    {idx < inputs.length - 1 && <Plus className="w-3.5 h-3.5 text-sanctuary-500 shrink-0" />}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="pt-2 flex items-center gap-2.5 text-xs font-semibold text-sanctuary-300">
              <ArrowRight className="w-4 h-4 text-d2-unique shrink-0 animate-pulse" />
              <span className="shrink-0">{isEn ? 'Transmuted Output: ' : '煉金轉化產出：'}</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sanctuary-900/90 border border-d2-unique/40 shadow-sm text-d2-unique font-bold flex-wrap">
                <ItemIcon name={recipe.output} nameEn={recipe.outputEn} size="sm" showBorder={false} />
                <span>{isEn && recipe.outputEn ? recipe.outputEn : recipe.output}</span>
              </div>
            </div>
          </div>
        </div>
        {(isEn && recipe.notesEn ? recipe.notesEn : recipe.notes) && (
          <div className="mt-3 pt-3 border-t border-sanctuary-850/80 text-[13px] text-sanctuary-400 italic bg-sanctuary-900/40 p-2.5 rounded-lg leading-relaxed">
            💡 <span className="text-sanctuary-300 whitespace-pre-line">{isEn && recipe.notesEn ? recipe.notesEn : recipe.notes}</span>
          </div>
        )}
      </div>
    );
  };

  const showcase = (c: Cat) => {
    const tab = SHOWCASE_TAB[c];
    if (!tab) return null;
    return (
      <div className="mt-8">
        <CubeCraftShowcase
          key={tab}
          defaultExpanded={false}
          initialTab={tab}
          allowedTabs={[tab]}
          onNavigateToRune={onNavigateToRune}
          onScrollToRecipe={(id) => go(recipeHash(id), recipeHash(id))}
        />
      </div>
    );
  };

  const grid = (list: CubeRecipeData[], heading: 'h3' | 'h4' = 'h3') => (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
      {list.map((r) => renderRecipeCard(r, heading))}
    </div>
  );

  const option = (key: string, h: string, title: string, n: number, desc: string) => (
    <a
      key={key}
      {...link(h)}
      className="block min-w-0 rounded-2xl border border-sanctuary-800 bg-sanctuary-950/80 p-4 sm:p-5 hover:border-d2-magic/50 transition-colors"
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="whitespace-nowrap font-diablo font-bold text-d2-magic truncate" title={title}>
          {title}
        </span>
        {badge(n, false)}
      </div>
      <p className="mt-2 text-sm text-sanctuary-300 leading-relaxed">{desc}</p>
    </a>
  );

  const breadcrumb = (
    <nav aria-label={isEn ? 'Breadcrumb' : '麵包屑導覽'} className="flex flex-wrap items-center gap-1.5 text-xs text-sanctuary-400">
      <a className="whitespace-nowrap hover:text-white" {...link('cube-all')}>
        {t('方塊工坊', 'Horadric Cube')}
      </a>
      {activeCat && (
        <>
          <span aria-hidden="true">›</span>
          {activeSub ? (
            <a className="whitespace-nowrap hover:text-white" {...link(`cube-${activeCat}`)}>
              {L(CAT_LABEL[activeCat])}
            </a>
          ) : (
            <span className="whitespace-nowrap text-sanctuary-200">{L(CAT_LABEL[activeCat])}</span>
          )}
        </>
      )}
      {activeSub && (
        <>
          <span aria-hidden="true">›</span>
          <span className="whitespace-nowrap text-sanctuary-200">{L(SUB_LABEL[activeSub])}</span>
        </>
      )}
    </nav>
  );

  const stickyNav = (
    <nav
      aria-label={isEn ? 'Cube recipe categories' : '方塊配方分類目錄'}
      className="sticky top-14 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-2 bg-sanctuary-950/95 backdrop-blur-md border-b border-sanctuary-800/70"
    >
      <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar snap-x">
        <a
          className="shrink-0 snap-start min-h-11 px-3 rounded-xl border border-sanctuary-800 bg-sanctuary-900/70 text-sanctuary-300 hover:text-white hover:border-d2-magic/40 flex items-center whitespace-nowrap text-sm font-medium"
          {...link('cube-all')}
        >
          {isEn ? '← All categories' : '← 總目錄'}
        </a>
        {CATS.map((c) => {
          const on = c === activeCat;
          return (
            <a
              key={c}
              aria-current={on ? 'location' : undefined}
              className={`shrink-0 snap-start min-h-11 px-3 rounded-xl border flex items-center gap-2 whitespace-nowrap text-sm font-medium ${
                on
                  ? 'bg-d2-magic/15 text-d2-magic border-d2-magic/60'
                  : 'bg-sanctuary-900/70 text-sanctuary-300 border-sanctuary-800 hover:text-white hover:border-d2-magic/40'
              }`}
              {...link(`cube-${c}`)}
            >
              <span className="whitespace-nowrap">{L(CAT_LABEL[c])}</span>
              {badge(byCat[c].length, on)}
            </a>
          );
        })}
      </div>
    </nav>
  );

  let body: React.ReactNode;
  if (view.kind === 'dir') {
    body = (
      <>
        <div className="min-w-0 max-w-xl">
          <label className="block text-sm text-sanctuary-300" htmlFor="cube-lookup">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Search className="w-3.5 h-3.5" />
              {isEn ? 'Find a recipe' : '查找配方'}
            </span>
          </label>
          <input
            id="cube-lookup"
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || !lookupHits[0]) return;
              lookupHits[0].onPick();
            }}
            placeholder={isEn ? 'Recipe or crafted item name' : '配方或手工物品名稱'}
            className="mt-1 w-full rounded-xl border border-sanctuary-800 bg-sanctuary-950 px-3 py-2 text-sm min-h-11"
          />
          {lookup.trim() && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {lookupHits.map((hit) => (
                <li key={hit.key} className="min-w-0">
                  <button
                    type="button"
                    className="inline-block max-w-full truncate rounded-lg bg-sanctuary-900 border border-sanctuary-800 px-2 py-1 text-xs hover:border-d2-magic/50"
                    onClick={hit.onPick}
                  >
                    {hit.label}
                  </button>
                </li>
              ))}
              {lookupHits.length === 0 && (
                <li className="text-xs text-sanctuary-500">{isEn ? 'No matching recipe in this codex.' : '本典目前沒有符合的配方。'}</li>
              )}
            </ul>
          )}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 min-w-0">
          {CATS.map((c) => option(c, `cube-${c}`, L(CAT_LABEL[c]), byCat[c].length, L(CAT_DESC[c])))}
        </div>
        <div className="mt-8 space-y-5 min-w-0">
          <h2 className="font-diablo text-lg font-bold text-d2-magic">{isEn ? 'Recipe index' : '公式詞條'}</h2>
          <p className="text-sm text-sanctuary-400">
            {isEn
              ? 'Choose a name to open its category (or upgrade sub-group) at that recipe.'
              : '點選名稱會打開該分類（升級則進入子群組）並跳到那張配方。'}
          </p>
          {CATS.map((c) => (
            <div key={`idx-${c}`}>
              <h3 className="text-sm font-semibold text-sanctuary-200 whitespace-nowrap">
                {L(CAT_LABEL[c])}
                {badge(byCat[c].length, false)}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {byCat[c].map((r) => (
                  <li key={r.id} className="min-w-0">
                    <a
                      className="inline-block max-w-full truncate rounded-lg border border-sanctuary-800 bg-sanctuary-950 px-2 py-1 text-xs hover:border-d2-magic/50"
                      title={isEn ? r.titleEn : r.title}
                      {...link(recipeHash(r.id), recipeHash(r.id))}
                    >
                      {isEn ? r.titleEn : r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold text-sanctuary-200">
              {isEn ? 'Crafted item catalog' : '手工合成物品大全'}
              {badge(craftedList.length, false)}
            </h3>
            <p className="mt-1 text-xs text-sanctuary-500">
              {isEn ? 'Opens the Crafted Items category and searches the catalog.' : '會打開手工分類，並帶入大全搜尋。'}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {craftedList.map((cr) => (
                <li key={cr.id} className="min-w-0">
                  <button
                    type="button"
                    className="inline-block max-w-full truncate rounded-lg border border-sanctuary-800 bg-sanctuary-950 px-2 py-1 text-xs hover:border-d2-magic/50"
                    onClick={() => {
                      setCatalogQuery(isEn ? cr.nameEn : cr.name);
                      go('cube-craft', 'cube-crafted-catalog');
                    }}
                  >
                    {isEn ? cr.nameEn : cr.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  } else if (view.kind === 'cat' && view.cat === 'upgrade') {
    body = (
      <>
        <SectionHead title={L(CAT_LABEL.upgrade)} count={byCat.upgrade.length} tone="magic" level={2} />
        <p className="mt-2 text-sm text-sanctuary-400 leading-relaxed">{L(CAT_DESC.upgrade)}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 min-w-0">
          {SUBS.map((s) =>
            option(
              s,
              `cube-upgrade-${s}`,
              L(SUB_LABEL[s]),
              bySub[s].length,
              isEn ? `Open the ${SUB_LABEL[s][1]} upgrade recipes.` : `查看${SUB_LABEL[s][0]}的升級配方。`,
            ),
          )}
        </div>
        {showcase('upgrade')}
      </>
    );
  } else {
    const cat = activeCat as Cat;
    const sub = activeSub;
    const list = sub ? bySub[sub] : byCat[cat];
    body = (
      <>
        <SectionHead title={sub ? L(SUB_LABEL[sub]) : L(CAT_LABEL[cat])} count={list.length} tone="magic" level={2} />
        {!sub && <p className="mt-2 text-sm text-sanctuary-400 leading-relaxed">{L(CAT_DESC[cat])}</p>}
        {sub && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUBS.map((s) => (
              <a
                key={s}
                aria-current={s === sub ? 'location' : undefined}
                className={`whitespace-nowrap rounded-xl border min-h-11 px-3 flex items-center text-sm ${
                  s === sub ? 'border-d2-magic text-d2-magic bg-d2-magic/15' : 'border-sanctuary-800 text-sanctuary-300'
                }`}
                {...link(`cube-upgrade-${s}`)}
              >
                {L(SUB_LABEL[s])}
                {badge(bySub[s].length, s === sub)}
              </a>
            ))}
          </div>
        )}
        {grid(list, 'h3')}
        {showcase(cat)}
        {cat === 'craft' && (
          <div id="cube-crafted-catalog" className="mt-8 scroll-mt-36 min-w-0">
            <CraftedItemsCatalog onNavigateToRune={onNavigateToRune} initialQuery={catalogQuery} />
          </div>
        )}
      </>
    );
  }

  return (
    <div id="cube-lab-top" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in min-w-0">
      <div>
        <h1 className="font-diablo text-2xl sm:text-3xl font-bold text-d2-magic leading-tight flex items-start gap-2 min-w-0">
          <GameIcon name="cube" className="w-7 h-7 text-d2-magic shrink-0 mt-0.5" />
          <span className="min-w-0 flex-1 text-pretty">
            <HeadingText text={t('赫拉迪姆方塊煉金工坊 (Cube Recipes)', 'Horadric Cube Alchemy Lab')} />
          </span>
        </h1>
        {view.kind === 'dir' && (
          <p className="text-sm text-sanctuary-400 mt-1">
            {t(
              `收錄 ${CUBE_RECIPES_DATA.length} 條方塊公式與 ${CRAFTED_COUNT} 條手工合成物品，可直接查找或依分類查閱；未經核可的符文／寶石升級表不列入。`,
              `${CUBE_RECIPES_DATA.length} cube recipes and ${CRAFTED_COUNT} crafted items: search by name or browse by category. Unverified rune and gem upgrade tables are not listed.`,
            )}
          </p>
        )}
      </div>
      {view.kind !== 'dir' && (
        <>
          {breadcrumb}
          {stickyNav}
        </>
      )}
      {body}
    </div>
  );
};

export default CubeLab;
