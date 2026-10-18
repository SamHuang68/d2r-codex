import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';

import { HeroSection } from './components/portal/HeroSection';
import { ClassShowcase } from './components/portal/ClassShowcase';
import { DLCReign } from './components/portal/DLCReign';

import { SkillPlanner } from './components/codex/SkillPlanner';
import { RunewordFinder } from './components/codex/RunewordFinder';
import { ItemCompendium } from './components/codex/ItemCompendium';
import { BaseItemGuide } from './components/codex/BaseItemGuide';
import { QuestGuide } from './components/codex/QuestGuide';
import { RuneCompendium } from './components/codex/RuneCompendium';
import { CubeLab } from './components/codex/CubeLab';
import { BreakpointTable } from './components/codex/BreakpointTable';
import { AreaGuide } from './components/codex/AreaGuide';
import { MercenaryGuide } from './components/codex/MercenaryGuide';
import { ValuationGuide } from './components/codex/ValuationGuide';
import { UberBossGuide } from './components/codex/UberBossGuide';
import { HolyGrailTracker } from './components/vault/HolyGrailTracker';
import { BuildPlanner } from './components/vault/BuildPlanner';
import { CharacterGuide } from './components/codex/CharacterGuide';
import { PropCompendium } from './components/codex/PropCompendium';
import { RUNEWORDS_DATA } from './data/runewords';
import { normalizeItemQuery } from './utils/itemQueryNormalizer';
import { ArmorySimulator } from './components/simulator/ArmorySimulator';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedInitialClass, setSelectedInitialClass] = useState<string>('魔法使');
  const [targetQuery, setTargetQuery] = useState<string>('');
  const [targetRuneNumber, setTargetRuneNumber] = useState<number | undefined>();
  const [plannerSubMode, setPlannerSubMode] = useState<'armory' | 'notes'>('armory');

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

  const handleNavigate = (tab: string, query?: string, runeNumber?: number) => {
    const effectiveTab = tab === 'sets' ? 'items' : tab;
    setActiveTab(effectiveTab);
    if (query !== undefined) {
      setTargetQuery(query);
    }
    if (runeNumber !== undefined) {
      setTargetRuneNumber(runeNumber);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemOrRunewordNavigate = (rawName: string) => {
    const cleanName = rawName.replace(/[【】]/g, '').trim();
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
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 lg:pb-0">
        {activeTab === 'overview' && (
          <div>
            <HeroSection onNavigateTab={(tab) => handleNavigate(tab)} />
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
              <ArmorySimulator 
                initialClass={selectedInitialClass} 
                onNavigateItem={handleItemOrRunewordNavigate}
              />
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
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Mobile Bottom Dock */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;
