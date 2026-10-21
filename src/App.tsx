import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Navbar, SideNav } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { ALL_NAV_MODULES } from './components/layout/navConfig';
import { Footer } from './components/layout/Footer';

import { HeroSection } from './components/portal/HeroSection';
import { CategoryGrid } from './components/portal/CategoryGrid';
import { ClassShowcase } from './components/portal/ClassShowcase';
import { DLCReign } from './components/portal/DLCReign';

// 百科各頁、搜尋面板連同它們用到的資料表（合計約 1.3 MB）都只在用到時才載入，首頁不必等它們
const SkillPlanner = lazy(() => import('./components/codex/SkillPlanner').then((m) => ({ default: m.SkillPlanner })));
const RunewordFinder = lazy(() => import('./components/codex/RunewordFinder').then((m) => ({ default: m.RunewordFinder })));
const ItemCompendium = lazy(() => import('./components/codex/ItemCompendium').then((m) => ({ default: m.ItemCompendium })));
const BaseItemGuide = lazy(() => import('./components/codex/BaseItemGuide').then((m) => ({ default: m.BaseItemGuide })));
const QuestGuide = lazy(() => import('./components/codex/QuestGuide').then((m) => ({ default: m.QuestGuide })));
const RuneCompendium = lazy(() => import('./components/codex/RuneCompendium').then((m) => ({ default: m.RuneCompendium })));
const CubeLab = lazy(() => import('./components/codex/CubeLab').then((m) => ({ default: m.CubeLab })));
const BreakpointTable = lazy(() => import('./components/codex/BreakpointTable').then((m) => ({ default: m.BreakpointTable })));
const MonsterCompendium = lazy(() => import('./components/codex/MonsterCompendium').then((m) => ({ default: m.MonsterCompendium })));
const AffixCompendium = lazy(() => import('./components/codex/AffixCompendium').then((m) => ({ default: m.AffixCompendium })));
const ShrineCompendium = lazy(() => import('./components/codex/ShrineCompendium').then((m) => ({ default: m.ShrineCompendium })));
const ExperienceTable = lazy(() => import('./components/codex/ExperienceTable').then((m) => ({ default: m.ExperienceTable })));
const AreaGuide = lazy(() => import('./components/codex/AreaGuide').then((m) => ({ default: m.AreaGuide })));
const MercenaryGuide = lazy(() => import('./components/codex/MercenaryGuide').then((m) => ({ default: m.MercenaryGuide })));
const ValuationGuide = lazy(() => import('./components/codex/ValuationGuide').then((m) => ({ default: m.ValuationGuide })));
const UberBossGuide = lazy(() => import('./components/codex/UberBossGuide').then((m) => ({ default: m.UberBossGuide })));
const HolyGrailTracker = lazy(() => import('./components/vault/HolyGrailTracker').then((m) => ({ default: m.HolyGrailTracker })));
const BuildPlanner = lazy(() => import('./components/vault/BuildPlanner').then((m) => ({ default: m.BuildPlanner })));
const CharacterGuide = lazy(() => import('./components/codex/CharacterGuide').then((m) => ({ default: m.CharacterGuide })));
const PropCompendium = lazy(() => import('./components/codex/PropCompendium').then((m) => ({ default: m.PropCompendium })));
const SearchModal = lazy(() => import('./components/layout/SearchModal').then((m) => ({ default: m.SearchModal })));
// 配裝模擬器連同遊戲資料表很大，只在進入該頁時才載入，首頁不必等它
const SimulatorV2 = lazy(() => import('./components/simulator/v2/SimulatorV2').then((m) => ({ default: m.SimulatorV2 })));

const KNOWN_TABS = ['overview', 'characters', 'skills', 'runewords', 'items', 'props', 'bases', 'quests', 'mercenaries', 'valuation', 'uber', 'runes', 'cube', 'breakpoints', 'areas', 'monsters', 'affixes', 'shrines', 'experience', 'grail', 'planner'];
/** 網址 #planner 可直接開啟對應分頁（例如配裝模擬器） */
const tabFromHash = (): string => {
  const h = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
  return KNOWN_TABS.includes(h) ? h : 'overview';
};

/**
 * 一次「導覽」的完整狀態。每次點進另一頁都會在瀏覽器歷史紀錄新增一筆（history.pushState）並帶著這份狀態，
 * 所以上一頁／下一頁（滑鼠側鍵、手機返回）會回到前後的分頁，連同當時帶進來的搜尋字串、樹節點、符文編號與職業。
 */
interface NavState { tab: string; query: string; node?: string; runeNumber?: number; cls?: string }
const NAV_KEY = 'd2nav';
const sameNav = (a: NavState, b: NavState) => a.tab === b.tab && a.query === b.query && a.node === b.node && a.runeNumber === b.runeNumber && a.cls === b.cls;
const TITLE_BASE = '聖休亞瑞典藏中樞 | D2R Sanctuary Codex';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(tabFromHash);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchLoaded, setSearchLoaded] = useState<boolean>(false);
  useEffect(() => { if (isSearchOpen) setSearchLoaded(true); }, [isSearchOpen]);
  const [selectedInitialClass, setSelectedInitialClassState] = useState<string>('魔法使');
  const [targetQuery, setTargetQuery] = useState<string>('');
  /** 裝備寶典要停在的樹節點（首頁「成套裝備」磚傳 's'、「暗金裝備」磚傳 'u'）；沒有就用預設的暗金·精英 */
  const [itemsNode, setItemsNode] = useState<string | undefined>();
  const [targetRuneNumber, setTargetRuneNumber] = useState<number | undefined>();
  const [plannerSubMode, setPlannerSubMode] = useState<'armory' | 'notes'>('armory');

  // 目前這一筆導覽的狀態（用 ref 記，pushState 時才拿得到「剛剛才設定」的職業）
  const navRef = useRef<NavState>({ tab: activeTab, query: '', cls: '魔法使' });
  const setSelectedInitialClass = (cls: string) => { navRef.current = { ...navRef.current, cls }; setSelectedInitialClassState(cls); };
  const applyNav = (n: NavState) => {
    navRef.current = n;
    setActiveTab(n.tab); setTargetQuery(n.query); setItemsNode(n.node); setTargetRuneNumber(n.runeNumber);
    if (n.cls) setSelectedInitialClassState(n.cls);
  };

  // 分頁與網址 hash 同步，方便直接連結與重新整理後停留原頁；上一頁／下一頁依歷史紀錄裡的狀態還原
  useEffect(() => {
    // 第一筆歷史紀錄補上狀態，之後回到它才知道當時的分頁與搜尋字串
    window.history.replaceState({ [NAV_KEY]: navRef.current }, '', window.location.href);
    const onPop = (e: PopStateEvent) => {
      const saved = (e.state as { [NAV_KEY]?: NavState; scrollY?: number } | null);
      // 沒有狀態＝使用者直接改了網址列的 hash：只看分頁
      applyNav(saved?.[NAV_KEY] ?? { tab: tabFromHash(), query: '', cls: navRef.current.cls });
      const y = saved?.scrollY ?? 0;
      // 分頁內容是延遲載入的，高度不是一次到位：還原捲動位置分幾次嘗試
      [0, 150, 500].forEach((ms) => window.setTimeout(() => window.scrollTo(0, y), ms));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 分頁標題：瀏覽器的歷史紀錄清單、分頁列才看得出是哪一頁
  useEffect(() => {
    const label = ALL_NAV_MODULES.find((m) => m.id === activeTab)?.label;
    document.title = activeTab === 'overview' || !label ? TITLE_BASE : `${label} | ${TITLE_BASE}`;
  }, [activeTab]);

  // Global hotkey 'Q' or '/' to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'q' || e.key === 'Q' || e.key === '/' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: string, query?: string, runeNumber?: number, node?: string) => {
    const effectiveTab = tab === 'sets' ? 'items' : tab;
    // 沒帶搜尋字串的導覽（側欄、首頁磚）要清掉上一次跨頁帶來的搜尋字串，否則各清單頁會帶著舊關鍵字重新載入
    const next: NavState = { tab: effectiveTab, query: query ?? '', node: node ?? (tab === 'sets' ? 's' : undefined), runeNumber, cls: navRef.current.cls };
    if (!sameNav(navRef.current, next)) {
      // 離開之前先把目前這一筆的捲動位置存進去，按上一頁時回到原本看的位置
      window.history.replaceState({ ...(window.history.state ?? {}), [NAV_KEY]: navRef.current, scrollY: window.scrollY }, '');
      window.history.pushState({ [NAV_KEY]: next }, '', `#${effectiveTab}`);
    }
    applyNav(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemOrRunewordNavigate = async (rawName: string) => {
    const cleanName = rawName.replace(/[【】]/g, '').trim();
    // 比對用的資料表很大，點了連結才載入
    const [{ normalizeItemQuery }, { RUNEWORDS_DATA }] = await Promise.all([import('./utils/itemQueryNormalizer'), import('./data/runewords')]);
    const normalized = normalizeItemQuery(cleanName);

    if (normalized) {
      handleNavigate(normalized.targetTab, normalized.name);
      return;
    }

    const isRuneword = RUNEWORDS_DATA.some(
      (rw) => rw.name.includes(cleanName) || cleanName.includes(rw.name)
    );

    if (isRuneword) {
      handleNavigate('runewords', cleanName);
    } else {
      handleNavigate('items', cleanName);
    }
  };

  const handleSelectSearchResult = (
    targetTab: string,
    _itemId: string,
    itemTitle?: string,
    runeNumber?: number
  ) => {
    handleNavigate(targetTab, itemTitle, runeNumber);
  };

  const handleCheckClassBreakpoints = (className: string) => {
    setSelectedInitialClass(className);
    handleNavigate('breakpoints');
  };

  return (
    <div className="min-h-screen bg-sanctuary-950 text-sanctuary-100 flex flex-col font-sans selection:bg-d2-unique/25 selection:text-d2-unique">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => handleNavigate(t)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <div className="flex-1 flex min-w-0">
      <SideNav activeTab={activeTab} setActiveTab={(t) => handleNavigate(t)} />
      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-16 lg:pb-0">
        <Suspense fallback={<div className="p-8 text-center text-sanctuary-400" role="status">載入中…</div>}>
        {activeTab === 'overview' && (
          <div>
            <HeroSection onNavigateTab={(tab) => handleNavigate(tab)} />
            <CategoryGrid onNavigateTab={(tab, node) => handleNavigate(tab, undefined, undefined, node)} />
            <ClassShowcase 
              onCheckBreakpoints={handleCheckClassBreakpoints}
              onExploreSkills={(cls) => {
                setSelectedInitialClass(cls);
                handleNavigate('skills');
              }}
              onExploreBuilds={() => handleNavigate('planner')}
            />
            <DLCReign 
              onExploreDLCItems={() => handleNavigate('runewords')}
              onNavigateToRuneword={(rw) => handleNavigate('runewords', rw)}
              onNavigateItem={handleItemOrRunewordNavigate}
            />
          </div>
        )}

        {activeTab === 'characters' && (
          <CharacterGuide 
            onNavigateToSkills={(cls) => {
              setSelectedInitialClass(cls);
              handleNavigate('skills');
            }}
            onNavigateToBreakpoints={(cls) => {
              setSelectedInitialClass(cls);
              handleNavigate('breakpoints');
            }}
            onNavigateToRunewords={handleItemOrRunewordNavigate}
            onNavigateToItems={handleItemOrRunewordNavigate}
          />
        )}
        {activeTab === 'skills' && <SkillPlanner initialClass={selectedInitialClass} />}
        {activeTab === 'runewords' && (
          <RunewordFinder 
            initialQuery={targetQuery}
            onNavigateToRune={(n) => handleNavigate('runes', undefined, n)}
            onNavigateToBase={(base) => handleNavigate('bases', base)}
          />
        )}
        {activeTab === 'items' && (
          <ItemCompendium 
            initialQuery={targetQuery}
            initialNode={itemsNode}
            onNavigateToBase={(base) => handleNavigate('bases', base)}
          />
        )}
        {activeTab === 'props' && (
          <PropCompendium 
            onNavigateToRunes={() => handleNavigate('runes')}
            onNavigateToCube={() => handleNavigate('cube')}
            onNavigateToRunewords={(rw) => handleNavigate('runewords', rw)}
          />
        )}
        {activeTab === 'bases' && (
          <BaseItemGuide 
            initialQuery={targetQuery}
            onNavigateToRuneword={(rw) => handleNavigate('runewords', rw)}
          />
        )}
        {activeTab === 'quests' && <QuestGuide />}
        {activeTab === 'runes' && (
          <RuneCompendium 
            targetRuneNumber={targetRuneNumber}
            onNavigateToRuneword={(rw) => handleNavigate('runewords', rw)}
          />
        )}
        {activeTab === 'cube' && (
          <CubeLab 
            onNavigateToRune={(n) => handleNavigate('runes', undefined, n)}
          />
        )}
        {activeTab === 'breakpoints' && (
          <BreakpointTable initialClass={selectedInitialClass} />
        )}
        {activeTab === 'areas' && <AreaGuide />}
        {activeTab === 'monsters' && <MonsterCompendium initialQuery={targetQuery} />}
        {activeTab === 'affixes' && <AffixCompendium initialQuery={targetQuery} />}
        {activeTab === 'shrines' && <ShrineCompendium initialQuery={targetQuery} />}
        {activeTab === 'experience' && <ExperienceTable />}
        {activeTab === 'mercenaries' && (
          <MercenaryGuide onNavigateItem={handleItemOrRunewordNavigate} />
        )}
        {activeTab === 'valuation' && <ValuationGuide />}
        {activeTab === 'uber' && <UberBossGuide />}
        {activeTab === 'grail' && <HolyGrailTracker />}
        {activeTab === 'planner' && (
          <div className="space-y-4">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-sanctuary-950/80 p-1.5 rounded-2xl border border-sanctuary-800">
                <button
                  onClick={() => setPlannerSubMode('armory')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-diablo transition-all ${
                    plannerSubMode === 'armory'
                      ? 'bg-gradient-to-r from-d2-unique to-amber-600 text-sanctuary-950 font-bold shadow-md'
                      : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-900'
                  }`}
                >
                  🎮 1:1 全息配裝模擬器
                </button>
                <button
                  onClick={() => setPlannerSubMode('notes')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-diablo transition-all ${
                    plannerSubMode === 'notes'
                      ? 'bg-gradient-to-r from-d2-unique to-amber-600 text-sanctuary-950 font-bold shadow-md'
                      : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-900'
                  }`}
                >
                  📋 傳統流派筆記清單
                </button>
              </div>
            </div>

            {plannerSubMode === 'armory' ? (
              <Suspense fallback={<div className="p-8 text-center text-sanctuary-400" role="status">載入配裝模擬器…</div>}>
                <SimulatorV2 initialClass={selectedInitialClass} onNavigateItem={handleItemOrRunewordNavigate} onClassChange={setSelectedInitialClass} />
              </Suspense>
            ) : (
              <BuildPlanner 
                onNavigateToSkills={(cls) => {
                  setSelectedInitialClass(cls);
                  handleNavigate('skills');
                }}
                onNavigateItem={handleItemOrRunewordNavigate}
              />
            )}
          </div>
        )}
        </Suspense>
      </main>
      </div>

      {/* Search Modal */}
      {searchLoaded && (
        <Suspense fallback={null}>
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectResult={handleSelectSearchResult}
          />
        </Suspense>
      )}

      {/* Mobile Bottom Dock */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={(t) => handleNavigate(t)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;
