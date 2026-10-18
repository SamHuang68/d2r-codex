import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Sword, 
  BookOpen, 
  Compass, 
  Trophy, 
  MapPin, 
  ShieldAlert, 
  Users, 
  FlaskConical,
  Menu,
  X,
  Gem,
  Skull,
  Layers,
  Wrench
} from 'lucide-react';

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

  // 全站 17 大功能完整分類模組
  const allModules = [
    {
      category: '英雄與加點',
      items: [
        { id: 'characters', label: '英雄寶典', icon: <Users className="w-4 h-4 text-d2-fire" />, desc: '8大職業屬性與Meta流派' },
        { id: 'skills', label: '全技能樹', icon: <Sparkles className="w-4 h-4 text-d2-gold" />, desc: '6x3 遊戲畫布與協同矩陣' },
        { id: 'planner', label: '配裝工坊', icon: <Wrench className="w-4 h-4 text-sanctuary-300" />, desc: '全身 10 部位配裝試算' },
      ]
    },
    {
      category: '神兵與基底',
      items: [
        { id: 'runewords', label: '符文之語', icon: <Sparkles className="w-4 h-4 text-d2-unique" />, desc: '全天梯符文之語速查' },
        { id: 'items', label: '暗金套裝', icon: <Sword className="w-4 h-4 text-d2-unique" />, desc: '暗金神裝與綠色全套' },
        { id: 'bases', label: '底材寶典', icon: <ShieldAlert className="w-4 h-4 text-d2-socket" />, desc: '打孔、超強與力量敏捷要求' },
        { id: 'runes', label: '符文寶庫', icon: <Layers className="w-4 h-4 text-d2-rune" />, desc: '1~33號符文掉落與鑲嵌' },
      ]
    },
    {
      category: '聖物與方塊工藝',
      items: [
        { id: 'props', label: '道具聖物', icon: <FlaskConical className="w-4 h-4 text-d2-magic" />, desc: '寶石、鑰匙、精華與藥劑' },
        { id: 'cube', label: '方塊工坊', icon: <BookOpen className="w-4 h-4 text-d2-magic" />, desc: '打孔、升級、手工裝配方' },
        { id: 'valuation', label: '鑑寶估價', icon: <Gem className="w-4 h-4 text-d2-fire" />, desc: '極品詞綴與線上估價器' },
      ]
    },
    {
      category: '戰役、機制與終局',
      items: [
        { id: 'quests', label: '任務世界事件', icon: <Compass className="w-4 h-4 text-d2-gold" />, desc: '永久獎勵任務與事件圖說' },
        { id: 'breakpoints', label: '機制斷點', icon: <Compass className="w-4 h-4 text-d2-fire" />, desc: 'FCR/FHR/FBR與滿格擋試算' },
        { id: 'areas', label: '場景恐區', icon: <MapPin className="w-4 h-4 text-d2-fire" />, desc: '85 級場景與恐怖領域' },
        { id: 'uber', label: '紅門六王', icon: <Skull className="w-4 h-4 text-d2-fire" />, desc: '火炬地獄崔斯特姆流水線' },
        { id: 'mercenaries', label: '傭兵寶典', icon: <Users className="w-4 h-4 text-d2-gold" />, desc: '四大傭兵光環與終極神裝' },
        { id: 'grail', label: '聖杯打寶', icon: <Trophy className="w-4 h-4 text-d2-gold" />, desc: 'TC87 殿堂與全裝備打寶打勾' },
      ]
    }
  ];

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
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 shrink-0 ${
                isActive
                  ? 'text-d2-unique font-bold scale-105'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
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
                <div className="text-[10px] text-sanctuary-400 font-mono">暗黑破壞神 II：獄火重生 17 大核心寶典</div>
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
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id)}
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
                        </button>
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
