import React from 'react';
import { 
  Flame, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Compass, 
  Trophy, 
  Wrench, 
  Search, 
  Sword, 
  MapPin, 
  Users, 
  Gem, 
  Skull,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
}) => {
  const navItems = [
    { id: 'overview', label: '主頁展演', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'skills', label: '技能寶典', icon: <Sparkles className="w-3.5 h-3.5 text-d2-gold" /> },
    { id: 'runewords', label: '符文之語', icon: <Sparkles className="w-3.5 h-3.5 text-d2-unique" /> },
    { id: 'items', label: '裝備寶典', icon: <Sword className="w-3.5 h-3.5 text-d2-unique" /> },
    { id: 'bases', label: '底材寶典', icon: <ShieldAlert className="w-3.5 h-3.5 text-d2-socket" /> },
    { id: 'quests', label: '任務事件', icon: <Compass className="w-3.5 h-3.5 text-d2-gold" /> },
    { id: 'mercenaries', label: '傭兵寶典', icon: <Users className="w-3.5 h-3.5 text-d2-gold" /> },
    { id: 'valuation', label: '鑑寶估價', icon: <Gem className="w-3.5 h-3.5 text-d2-magic" /> },
    { id: 'uber', label: '紅門六王', icon: <Skull className="w-3.5 h-3.5 text-d2-fire" /> },
    { id: 'runes', label: '符文寶庫', icon: <Layers className="w-3.5 h-3.5 text-d2-rune" /> },
    { id: 'cube', label: '方塊工坊', icon: <BookOpen className="w-3.5 h-3.5 text-d2-magic" /> },
    { id: 'breakpoints', label: '機制斷點', icon: <Compass className="w-3.5 h-3.5 text-d2-fire" /> },
    { id: 'areas', label: '場景恐區', icon: <MapPin className="w-3.5 h-3.5 text-d2-fire" /> },
    { id: 'grail', label: '聖杯打寶', icon: <Trophy className="w-3.5 h-3.5 text-d2-gold" /> },
    { id: 'planner', label: '配裝工坊', icon: <Wrench className="w-3.5 h-3.5 text-sanctuary-300" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-sanctuary-950/90 backdrop-blur-md border-b border-sanctuary-800/80 transition-all duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-d2-unique to-sanctuary-900 p-0.5 shadow-glow-gold flex items-center justify-center">
            <div className="w-full h-full bg-sanctuary-950 rounded-[7px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-d2-unique group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
          <div>
            <div className="font-diablo text-sm md:text-base font-bold tracking-wider text-sanctuary-100 group-hover:text-d2-unique transition-colors">
              SANCTUARY CODEX
            </div>
            <div className="text-[9px] text-d2-unique/80 font-mono tracking-widest uppercase">
              暗黑II：獄火重生 全資料庫
            </div>
          </div>
        </div>

        {/* Center Nav tabs - Desktop */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-sanctuary-800 text-d2-unique shadow-sm border border-sanctuary-700 font-bold'
                    : 'text-sanctuary-300 hover:text-sanctuary-100 hover:bg-sanctuary-900/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-sanctuary-300 hover:text-sanctuary-100 text-xs transition-colors shadow-inner"
            title="按下 Q 或 / 鍵快速搜尋"
          >
            <Search className="w-3.5 h-3.5 text-sanctuary-400" />
            <span className="hidden sm:inline">搜尋資料庫</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-sanctuary-800 border border-sanctuary-700 rounded text-d2-unique font-bold">
              Q
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
