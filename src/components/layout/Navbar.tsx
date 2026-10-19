import React from 'react';
import { Flame, Search } from 'lucide-react';
import { NAV_GROUPS, ALL_NAV_MODULES } from './navConfig';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
}

/** 頂部列：品牌、目前所在頁、搜尋；桌面版的完整分頁導覽由 SideNav 提供 */
export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSearch }) => {
  const current = ALL_NAV_MODULES.find((m) => m.id === activeTab);

  return (
    <header className="sticky top-0 z-40 w-full bg-sanctuary-950/90 backdrop-blur-md border-b border-sanctuary-800/80">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
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
            <div className="hidden sm:block text-[9px] text-d2-unique/80 font-mono tracking-widest uppercase">
              暗黑II：獄火重生 全資料庫
            </div>
          </div>
        </div>

        {current && (
          <div className="hidden md:flex items-center gap-2 text-sm text-sanctuary-300 min-w-0">
            <span className="text-sanctuary-600">/</span>
            {current.icon}
            <span className="font-bold text-d2-unique truncate">{current.label}</span>
            <span className="hidden xl:inline text-xs text-sanctuary-500 truncate">{current.desc}</span>
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0 ml-auto">
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

/** 桌面側邊導覽：5 組、17 個分頁全部常駐可見 */
export const SideNav: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab,
}) => (
  <aside className="hidden lg:block w-56 shrink-0 border-r border-sanctuary-800/80 bg-sanctuary-950/60">
    <nav className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar py-3 px-3 space-y-3">
      {NAV_GROUPS.map((group) => (
        <div key={group.category}>
          <div className="px-2 mb-1.5 text-[10px] font-mono font-bold tracking-widest text-sanctuary-500 uppercase">
            {group.category}
          </div>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title={item.desc}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-left transition-colors border ${
                    isActive
                      ? 'bg-sanctuary-800 text-d2-unique border-d2-unique/40 font-bold'
                      : 'text-sanctuary-300 border-transparent hover:text-sanctuary-100 hover:bg-sanctuary-900'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  </aside>
);
