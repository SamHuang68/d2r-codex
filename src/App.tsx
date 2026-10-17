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

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedInitialClass, setSelectedInitialClass] = useState<string>('魔法使');

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

  const handleSelectSearchResult = (targetTab: string) => {
    setActiveTab(targetTab);
  };

  const handleCheckClassBreakpoints = (className: string) => {
    setSelectedInitialClass(className);
    setActiveTab('breakpoints');
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
            <HeroSection onNavigateTab={(tab) => setActiveTab(tab)} />
            <ClassShowcase 
              onCheckBreakpoints={handleCheckClassBreakpoints}
              onExploreSkills={(cls) => {
                setSelectedInitialClass(cls);
                setActiveTab('skills');
              }}
              onExploreBuilds={() => setActiveTab('planner')}
            />
            <DLCReign onExploreDLCItems={() => setActiveTab('runewords')} />
          </div>
        )}

        {activeTab === 'skills' && <SkillPlanner initialClass={selectedInitialClass} />}
        {activeTab === 'runewords' && <RunewordFinder />}
        {activeTab === 'items' && <ItemCompendium />}
        {activeTab === 'bases' && <BaseItemGuide />}
        {activeTab === 'quests' && <QuestGuide />}
        {activeTab === 'runes' && <RuneCompendium />}
        {activeTab === 'cube' && <CubeLab />}
        {activeTab === 'breakpoints' && (
          <BreakpointTable initialClass={selectedInitialClass} />
        )}
        {activeTab === 'areas' && <AreaGuide />}
        {activeTab === 'mercenaries' && <MercenaryGuide />}
        {activeTab === 'valuation' && <ValuationGuide />}
        {activeTab === 'uber' && <UberBossGuide />}
        {activeTab === 'grail' && <HolyGrailTracker />}
        {activeTab === 'planner' && (
          <BuildPlanner 
            onNavigateToSkills={(cls) => {
              setSelectedInitialClass(cls);
              setActiveTab('skills');
            }}
          />
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
