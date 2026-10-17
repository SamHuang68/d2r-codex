import React from 'react';
import { Flame, Sparkles, Sword, BookOpen, Compass, Trophy, MapPin } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
}) => {
  const tabs = [
    { id: 'overview', label: '主頁', icon: <Flame className="w-5 h-5" /> },
    { id: 'runewords', label: '符文語', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'items', label: '裝備', icon: <Sword className="w-5 h-5" /> },
    { id: 'areas', label: '場景', icon: <MapPin className="w-5 h-5" /> },
    { id: 'cube', label: '方塊', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'breakpoints', label: '機制', icon: <Compass className="w-5 h-5" /> },
    { id: 'grail', label: '聖杯', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-sanctuary-950/95 backdrop-blur-lg border-t border-sanctuary-800 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors duration-150 ${
              isActive
                ? 'text-d2-unique font-semibold'
                : 'text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
      {/* Mobile Search Button */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center py-1 px-2 text-d2-unique rounded-lg"
      >
        <div className="w-7 h-7 rounded-full bg-d2-unique/20 flex items-center justify-center border border-d2-unique/40">
          <span className="text-xs font-bold font-mono">Q</span>
        </div>
        <span className="text-[10px] mt-0.5">搜尋</span>
      </button>
    </div>
  );
};
