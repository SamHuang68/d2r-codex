import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Sword, 
  Users, 
  Menu,
  X,
} from 'lucide-react';

import { NAV_GROUPS, isPlainLeftClick, tabHref } from './navConfig';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 底部快捷直達鍵 (最常用的 5 大模組)
  const quickTabs = [
    { id: 'overview', label: '主頁', icon: <Flame className="w-5 h-5" /> },
    { id: 'characters', label: '英雄', icon: <Users className="w-5 h-5 text-d2-fire" /> },
    { id: 'skills', label: '技能樹', icon: <Sparkles className="w-5 h-5 text-d2-gold" /> },
    { id: 'runewords', label: '符文語', icon: <Sparkles className="w-5 h-5 text-d2-unique" /> },
    { id: 'items', label: '裝備', icon: <Sword className="w-5 h-5 text-d2-unique" /> },
  ];

  // 全站 19 大功能完整分類模組（與桌面側邊欄共用同一份設定）
  const allModules = NAV_GROUPS;

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 底部浮動導航條 (Mobile Dock) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-sanctuary-950/95 backdrop-blur-lg border-t border-sanctuary-800 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
        {quickTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <a
              key={tab.id}
              href={tabHref(tab.id)}
              onClick={(e) => { if (!isPlainLeftClick(e)) return; e.preventDefault(); handleSelectTab(tab.id); }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 shrink-0 ${
                isActive
                  ? 'text-d2-unique font-bold scale-105'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </a>
          );
        })}

        {/* 更多模組抽屜切換鍵 */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 shrink-0 ${
            isDrawerOpen ? 'text-d2-gold font-bold scale-105' : 'text-sanctuary-400 hover:text-sanctuary-200'
          }`}
        >
          {isDrawerOpen ? <X className="w-5 h-5 text-d2-gold" /> : <Menu className="w-5 h-5" />}
          <span className="text-[10px] mt-0.5">全站功能</span>
        </button>

        {/* 全域快速搜尋按鈕 */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 px-2 text-d2-unique rounded-xl shrink-0"
        >
          <div className="w-6 h-6 rounded-full bg-d2-unique/20 flex items-center justify-center border border-d2-unique/40 shadow-glow-gold/20">
            <span className="text-[10px] font-bold font-mono">Q</span>
          </div>
          <span className="text-[10px] mt-0.5 font-bold">搜尋</span>
        </button>
      </div>

      {/* 全功能清單抽屜面板 (Mobile Drawer) */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
          <div 
            className="flex-1"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="bg-sanctuary-950 border-t-2 border-d2-gold/50 rounded-t-3xl max-h-[80vh] overflow-y-auto p-5 pb-24 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-sanctuary-800 pb-3">
              <div>
                <div className="font-diablo text-lg font-bold text-d2-gold">SANCTUARY CODEX 全站導航</div>
                <div className="text-[10px] text-sanctuary-400 font-mono">暗黑破壞神 II：獄火重生 19 大核心寶典</div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-sanctuary-900 border border-sanctuary-750 flex items-center justify-center text-sanctuary-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 模組分類網格 */}
            <div className="space-y-5">
              {allModules.map((cat, cIdx) => (
                <div key={cIdx} className="space-y-2">
                  <div className="text-xs font-mono font-bold text-sanctuary-400 border-l-2 border-d2-gold pl-2">
                    {cat.category}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.items.map((item) => {
                      const isCurrent = activeTab === item.id;
                      return (
                        <a
                          key={item.id}
                          href={tabHref(item.id)}
                          onClick={(e) => { if (!isPlainLeftClick(e)) return; e.preventDefault(); handleSelectTab(item.id); }}
                          aria-current={isCurrent ? 'page' : undefined}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                            isCurrent
                              ? 'bg-sanctuary-850 border-d2-gold text-d2-gold font-bold shadow-md'
                              : 'bg-sanctuary-900/60 border-sanctuary-800 text-sanctuary-200 hover:border-sanctuary-700'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-sanctuary-950 border border-sanctuary-800 shrink-0">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-diablo font-bold truncate">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-sanctuary-400 truncate">
                              {item.desc}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
