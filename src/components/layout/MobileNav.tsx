import React from 'react';
import { Flame, Sparkles, Sword, BookOpen, Compass, Trophy, MapPin, ShieldAlert, Users, FlaskConical } from 'lucide-react';

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
    { id: 'characters', label: '英雄', icon: <Users className="w-5 h-5 text-d2-fire" /> },
    { id: 'skills', label: '技能', icon: <Sparkles className="w-5 h-5 text-d2-gold" /> },
    { id: 'runewords', label: '符文語', icon: <Sparkles className="w-5 h-5 text-d2-unique" /> },
    { id: 'items', label: '裝備', icon: <Sword className="w-5 h-5 text-d2-unique" /> },
    { id: 'props', label: '道具', icon: <FlaskConical className="w-5 h-5 text-d2-magic" /> },
    { id: 'bases', label: '底材', icon: <ShieldAlert className="w-5 h-5 text-d2-socket" /> },
    { id: 'quests', label: '任務', icon: <Compass className="w-5 h-5 text-d2-gold" /> },
    { id: 'areas', label: '場景', icon: <MapPin className="w-5 h-5 text-d2-fire" /> },
    { id: 'cube', label: '方塊', icon: <BookOpen className="w-5 h-5 text-d2-magic" /> },
    { id: 'grail', label: '聖杯', icon: <Trophy className="w-5 h-5 text-d2-gold" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-sanctuary-950/95 backdrop-blur-lg border-t border-sanctuary-800 px-1 py-1 flex items-center justify-around shadow-2xl safe-area-pb overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-colors duration-150 shrink-0 ${
              isActive
                ? 'text-d2-unique font-semibold'
                : 'text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            {tab.icon}
            <span className="text-[9px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
      {/* Mobile Search Button */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center py-1 px-1.5 text-d2-unique rounded-lg shrink-0"
      >
        <div className="w-6 h-6 rounded-full bg-d2-unique/20 flex items-center justify-center border border-d2-unique/40">
          <span className="text-[10px] font-bold font-mono">Q</span>
        </div>
        <span className="text-[9px] mt-0.5">搜尋</span>
      </button>
    </div>
  );
};
