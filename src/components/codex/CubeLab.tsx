import React, { useEffect, useRef, useState } from 'react';
import { CUBE_RECIPES_DATA } from '../../data/cubeRecipes';
import { ItemIcon } from '../common/ItemIcon';
import { GameIcon } from '../common/GameIcons';
import { Plus, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { CubeRecipeData } from '../../types';
import { SectionHead } from '../common/TreeIndex';
import { HeadingText } from '../common/HeadingText';
import { useLanguage } from '../../context/LanguageContext';
import { CubeCraftShowcase } from './CubeCraftShowcase';
import { CraftedItemsCatalog } from './CraftedItemsCatalog';

export interface CubeLabProps {
  onNavigateToRune?: (runeNumber: number) => void;
}

type CubeCategory = CubeRecipeData['category'];
type CubeFilter = 'all' | CubeCategory;

/**
 * 分類用頁內 hash 表示（#cube-socket、#cube-all…）。
 * 這些 hash 不是 App 的已知分頁名，tab router 會忽略它們；單品 id 來自路徑，也不受影響。
 */
const filterFromHash = (hash: string): CubeFilter | null => {
  const m = /^#cube-(all|socket|upgrade|craft|repair|misc)$/.exec(hash);
  return m ? (m[1] as CubeFilter) : null;
};

/** 升級類依既有標題前綴（暗金武器／暗金防具／亮黃武器／亮黃防具）再分小組；分組只看 id，不改資料 */
const UPGRADE_GROUP_RE = /^upgrade_(unique|rare)_(weapon|armor)_/;
const UPGRADE_GROUP_EN: Record<string, string> = {
  unique_weapon: 'Unique Weapons',
  unique_armor: 'Unique Armor',
  rare_weapon: 'Rare Weapons',
  rare_armor: 'Rare Armor',
};
const UPGRADE_GROUP_ZH: Record<string, string> = {
  unique_weapon: '暗金武器',
  unique_armor: '暗金防具',
  rare_weapon: '亮黃武器',
  rare_armor: '亮黃防具',
};

export const CubeLab: React.FC<CubeLabProps> = ({ onNavigateToRune }) => {
  const { t, isEn } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CubeFilter>(() =>
    typeof window === 'undefined' ? 'all' : filterFromHash(window.location.hash) ?? 'all'
  );
  /** 待執行的捲動（選類型後等新內容畫出來再捲）；tick 讓重複點同一類也會再捲一次 */
  const pendingScroll = useRef<{ id: string; delay: number } | null>(
    typeof window !== 'undefined' && filterFromHash(window.location.hash)
      ? { id: window.location.hash.slice(1), delay: 150 }
      : null
  );
  const [scrollTick, setScrollTick] = useState(0);

  const categories: { id: CubeFilter; label: string }[] = [
    { id: 'all', label: isEn ? 'All Recipes' : '全部配方' },
    { id: 'socket', label: isEn ? 'Socketing' : '裝備打孔' },
    { id: 'upgrade', label: isEn ? 'Item Upgrades' : '裝備階級升級' },
    { id: 'craft', label: isEn ? 'Crafted Items' : '手工神裝工藝' },
    { id: 'repair', label: isEn ? 'Repairs & Recharging' : '免錢修理充能' },
    { id: 'misc', label: isEn ? 'Rerolling & Respec' : '洗裝與洗點' },
  ];

  const countOf = (id: CubeFilter) =>
    id === 'all' ? CUBE_RECIPES_DATA.length : CUBE_RECIPES_DATA.filter((r) => r.category === id).length;

  const filteredRecipes = CUBE_RECIPES_DATA.filter(
    (recipe) => activeCategory === 'all' || recipe.category === activeCategory
  );

  // 選定類型後捲到該段（或「全部」的開頭），並把焦點移到該段，方便鍵盤／報讀器接續閱讀
  useEffect(() => {
    const req = pendingScroll.current;
    if (!req) return;
    const timer = window.setTimeout(() => {
      // 等到真正要捲時才清掉，避免 React StrictMode 先清 effect 再重跑時把 pending 弄丟
      pendingScroll.current = null;
      const el = document.getElementById(req.id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.focus({ preventScroll: true });
    }, req.delay);
    return () => window.clearTimeout(timer);
  }, [activeCategory, scrollTick]);

  // 使用者手動改網址列的 #cube-xxx：只更新本頁狀態，不呼叫 history API（App 的 hashchange 規則）。
  // 手動改 hash 也會觸發 popstate，App 會在 0／150／500ms 捲回頂端，所以這裡延後到那之後再捲。
  useEffect(() => {
    const onHash = () => {
      const next = filterFromHash(window.location.hash);
      if (!next) return;
      pendingScroll.current = { id: `cube-${next}`, delay: 650 };
      setActiveCategory(next);
      setScrollTick((n) => n + 1);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /**
   * 目錄連結用完整路徑（/cube/#cube-socket、/en/cube/#cube-socket）：
   * 靜態外殼有 <base href="../">，只寫 "#cube-socket" 會被解析到上一層路徑。
   */
  const hrefFor = (id: CubeFilter) =>
    typeof window === 'undefined'
      ? `#cube-${id}`
      : `${window.location.pathname}${window.location.search}#cube-${id}`;

  /** 點目錄：切換類型、把 hash 寫進網址（replaceState，不新增歷史、不觸發 hashchange／popstate），再捲到該段 */
  const selectCategory = (id: CubeFilter) => {
    window.history.replaceState(window.history.state, '', hrefFor(id));
    pendingScroll.current = { id: `cube-${id}`, delay: 40 };
    setActiveCategory(id);
    setScrollTick((n) => n + 1);
  };

  const handleScrollToRecipe = (recipeId: string) => {
    // 若特定配方被類別篩選隱藏，先還原至全部配方（網址的分類 hash 一併移除）
    if (activeCategory !== 'all') {
      setActiveCategory('all');
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
    }

    setTimeout(() => {
      const el = document.getElementById(`recipe-${recipeId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-d2-magic', 'border-d2-magic');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-d2-magic', 'border-d2-magic');
        }, 2000);
      }
    }, 120);
  };

  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = env.endsWith('/') ? env : `${env}/`;
  const imgCube = `${baseUrl}images/items/props/horadric_cube.gif`;

  const renderRecipeCard = (recipe: CubeRecipeData, HeadingTag: 'h3' | 'h4') => (
    <div
      key={recipe.id}
      id={`recipe-${recipe.id}`}
      className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-magic/50 shadow-xl transition-all duration-200 flex flex-col justify-between group scroll-mt-36"
    >
      <div>
        {/* Title & Badge */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-sanctuary-850">
          <div>
            <HeadingTag className="font-diablo text-base font-bold text-d2-magic group-hover:text-blue-300 transition-colors">
              {isEn && recipe.titleEn ? recipe.titleEn : recipe.title}
            </HeadingTag>
            {!isEn && recipe.titleEn && (
              <div className="text-[11px] text-sanctuary-400 font-mono italic">
                {recipe.titleEn}
              </div>
            )}
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-d2-magic/10 text-d2-magic border border-d2-magic/30 font-medium font-mono">
            {recipe.category.toUpperCase()}
          </span>
        </div>

        {/* Recipe Formula Visualizer: 升級為立體轉化槽位 */}
        <div className="py-4 space-y-3">
          <div className="text-xs text-sanctuary-400 font-medium flex items-center justify-between">
            <span>{isEn ? 'Transmutation Inputs:' : '方塊投入材料 (Inputs)：'}</span>
            <span className="text-[10px] text-sanctuary-500 font-mono">
              {isEn ? `${(isEn && recipe.inputsEn ? recipe.inputsEn : recipe.inputs).length} Items` : `${recipe.inputs.length} 件材料`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 shadow-inner">
            {(isEn && recipe.inputsEn ? recipe.inputsEn : recipe.inputs).map((inp, idx) => {
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
                  {idx < (isEn && recipe.inputsEn ? recipe.inputsEn : recipe.inputs).length - 1 && (
                    <Plus className="w-3.5 h-3.5 text-sanctuary-500 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* 產出成果槽位 */}
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

      {/* Recipe Notes */}
      {(isEn && recipe.notesEn ? recipe.notesEn : recipe.notes) && (
        <div className="mt-3 pt-3 border-t border-sanctuary-850/80 text-xs text-sanctuary-400 italic bg-sanctuary-900/40 p-2.5 rounded-lg leading-relaxed">
          💡 <span className="text-sanctuary-300">{isEn && recipe.notesEn ? recipe.notesEn : recipe.notes}</span>
        </div>
      )}
    </div>
  );

  /** 升級類：依既有標題分 H3 小組，卡片標題降為 H4 */
  const renderUpgradeGroups = (rows: CubeRecipeData[]) => {
    const groups: { key: string; label: string; rows: CubeRecipeData[] }[] = [];
    rows.forEach((r) => {
      const m = UPGRADE_GROUP_RE.exec(r.id);
      const key = m ? `${m[1]}_${m[2]}` : 'other';
      let g = groups.find((x) => x.key === key);
      if (!g) {
        const label = isEn
          ? (UPGRADE_GROUP_EN[key] ?? 'Other Upgrades')
          : (UPGRADE_GROUP_ZH[key] ?? '其他升級');
        g = { key, label, rows: [] };
        groups.push(g);
      }
      g.rows.push(r);
    });
    return (
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.key} id={`cube-upgrade-${g.key.replace('_', '-')}`} className="scroll-mt-36">
            <SectionHead title={g.label} count={g.rows.length} tone="magic" level={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {g.rows.map((recipe) => renderRecipeCard(recipe, 'h4'))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-diablo text-2xl sm:text-3xl font-bold text-d2-magic leading-tight flex items-start gap-2 min-w-0">
          <GameIcon name="cube" className="w-7 h-7 text-d2-magic shrink-0 mt-0.5" />
          <span className="min-w-0 flex-1 text-pretty">
            <HeadingText text={t('赫拉迪姆方塊煉金工坊 (Cube Recipes)', 'Horadric Cube Alchemy Lab')} />
          </span>
        </h1>
        <p className="text-sm text-sanctuary-400 mt-1">
          {t(
            '白裝打孔隨機公式、暗金／亮黃底材升級、完整 36 條四大系列手工合成物品（血腥／施法／重擊／防護）與赦免徽章洗點全收錄。',
            'Comprehensive recipes for socketing white bases, upgrading Unique/Rare gear, all 36 Crafted Items (Blood, Caster, Hit Power, Safety), and Token of Absolution respecs.'
          )}
        </p>
      </div>

      {/* 配方分類目錄：固定在頁首導覽列下方，捲到任何一段都能直接跳到其他類型 */}
      <nav
        aria-label={isEn ? 'Cube recipe categories' : '方塊配方分類目錄'}
        className="sticky top-14 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-2 bg-sanctuary-950/95 backdrop-blur-md border-b border-sanctuary-800/70"
      >
        <ul className="flex items-stretch gap-2 overflow-x-auto no-scrollbar snap-x">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = countOf(cat.id);
            return (
              <li key={cat.id} className="shrink-0 xl:flex-1 snap-start">
                <a
                  href={hrefFor(cat.id)}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => {
                    // 保留以修飾鍵開新分頁／新視窗的預設行為
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    selectCategory(cat.id);
                  }}
                  className={`min-h-11 h-full px-3 rounded-xl border flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-d2-magic ${
                    isActive
                      ? 'bg-d2-magic/15 text-d2-magic border-d2-magic/60 shadow-[0_0_12px_rgba(105,105,255,0.2)]'
                      : 'bg-sanctuary-900/70 text-sanctuary-300 border-sanctuary-800 hover:text-white hover:border-d2-magic/40'
                  }`}
                >
                  <span className="whitespace-nowrap">{cat.label}</span>
                  <span
                    className={`shrink-0 min-w-[1.75rem] px-1.5 py-0.5 rounded-md text-xs font-mono tabular-nums text-center ${
                      isActive ? 'bg-d2-magic text-sanctuary-950' : 'bg-sanctuary-950 text-sanctuary-300'
                    }`}
                  >
                    {count}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 赫拉迪姆方塊原版圖解橫幅 */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sanctuary-950 via-sanctuary-900 to-sanctuary-950 border border-sanctuary-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-sanctuary-950/90 border border-d2-magic/40 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(105,105,255,0.2)] shrink-0">
            <img src={imgCube} alt="Horadric Cube" width={48} height={48} className="w-12 h-12 object-contain" loading="lazy" decoding="async" />
            <div className="absolute -bottom-1 -right-1 px-1 rounded bg-d2-magic/20 text-[9px] font-mono text-d2-magic border border-d2-magic/40">
              {isEn ? '4 Slots' : '4格'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-sanctuary-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-d2-magic" />
              <span>{isEn ? 'Horadric Transmutation Principles' : '赫拉迪姆古代賢者轉化秘義'}</span>
            </div>
            <p className="text-xs text-sanctuary-400 max-w-2xl leading-relaxed">
              {isEn
                ? 'The Horadric Cube transmutes matter. Socket white bases for runewords, upgrade Unique armor defenses and weapon bases without losing variable rolls, and craft GG 2/20 amulets.'
                : '轉化萬物、賦予神力的赫拉迪姆神器。白裝打孔博取隨機洞數（符文之語必備）、暗金裝備跨階級底材升級（保留變動數值並大幅提升防禦/傷害）、施法手工飾品追尋 2/20 天價項鍊。'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs">
          <div className="px-3 py-2 rounded-xl bg-sanctuary-950/70 border border-sanctuary-800 text-center">
            <div className="text-sanctuary-400 text-[10px]">{isEn ? 'Total Recipes' : '總配方數'}</div>
            <div className="text-d2-magic font-bold font-mono text-sm">
              {CUBE_RECIPES_DATA.length} {isEn ? 'Sets' : '條'}
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-sanctuary-950/70 border border-sanctuary-800 text-center">
            <div className="text-sanctuary-400 text-[10px]">{isEn ? 'Craft Level' : '工藝機制'}</div>
            <div className="text-d2-gold font-bold text-xs flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-d2-fire" />
              <span>{isEn ? 'ilvl=0.5+0.5' : '等級公式'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 展廳：四大極品手工藝神裝、經典暗金跨階升級與打孔博弈輪盤 */}
      <CubeCraftShowcase
        onNavigateToRune={onNavigateToRune}
        onScrollToRecipe={handleScrollToRecipe}
      />

      {/* Recipes Cards：依配方類別分段，每段有 H2 標題與數量；#cube-all 指向整個清單開頭 */}
      <div id="cube-all" tabIndex={-1} className="space-y-9 scroll-mt-36 focus:outline-none">
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => {
            const rows = filteredRecipes.filter((r) => r.category === cat.id);
            // 手工段即使配方列為空仍要顯示 36 條手工裝大全
            if (rows.length === 0 && cat.id !== 'craft') return null;
            return (
              <section
                key={cat.id}
                id={`cube-${cat.id}`}
                tabIndex={-1}
                aria-label={cat.label}
                className="scroll-mt-36 focus:outline-none"
              >
                <SectionHead title={cat.label} count={rows.length} tone="magic" level={2} />
                {cat.id === 'upgrade' ? (
                  renderUpgradeGroups(rows)
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rows.map((recipe) => renderRecipeCard(recipe, 'h3'))}
                  </div>
                )}
                {/* 完整 36 條手工合成物品大全放在「手工」段內，讓它的 H3 標題掛在正確的 H2 之下 */}
                {cat.id === 'craft' && (
                  <div className="mt-8">
                    <CraftedItemsCatalog onNavigateToRune={onNavigateToRune} />
                  </div>
                )}
              </section>
            );
          })}
      </div>
    </div>
  );
};
