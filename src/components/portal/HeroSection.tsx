import React, { useState } from 'react';
import { Play, Sparkles, ArrowRight, X } from 'lucide-react';
import portalSummary from '../../data/codex/portalSummary.json';

// 與首頁分類磚共用預先產生的小摘要，不在首頁載入百科大資料。
const runewordCount = portalSummary.gearTiles.find((tile) => tile.id === 'runewords')!.count;
const { classCount: skillClassCount, treeCount: skillTreeCount } = portalSummary.skills;

interface HeroSectionProps {
  onNavigateTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateTab }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className="relative overflow-hidden pt-8 pb-10 md:pt-10 md:pb-12 border-b border-sanctuary-800">
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-d2-fire/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute top-20 -left-20 w-80 h-80 bg-d2-unique/5 rounded-full blur-[100px]" />
        <div className="absolute top-40 -right-20 w-80 h-80 bg-d2-blood/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sanctuary-900 border border-d2-unique/30 text-xs text-d2-unique mb-4 shadow-glow-gold/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold tracking-wide">DLC《術士軍臨》REIGN OF THE WARLOCK 全新收錄</span>
          <span className="text-sanctuary-400 font-mono">v2.6+</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-diablo text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-wider text-sanctuary-100 max-w-4xl mx-auto leading-tight">
          聖休亞瑞的命運，
          <span className="bg-gradient-to-r from-d2-unique via-amber-200 to-d2-fire bg-clip-text text-transparent drop-shadow-sm">
            由你執掌
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-sanctuary-300 max-w-2xl mx-auto font-sans leading-relaxed">
          歷久不衰的動作角色扮演傳奇。打造專屬於你的極速查裝工具、符文之語配裝矩陣、FCR/FHR 幀數斷點計算機與聖杯打寶挑戰追蹤器。
        </p>

        {/* Action CTAs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigateTab('skills')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-d2-gold to-amber-500 hover:from-amber-400 hover:to-d2-gold text-sanctuary-950 font-bold text-sm tracking-wide shadow-glow-gold transition-all duration-200 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-sanctuary-950" />
            <span>職業技能樹模擬器</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => onNavigateTab('runewords')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-d2-unique font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
          >
            <span>符文之語（{runewordCount} 組）</span>
          </button>

          <button
            onClick={() => onNavigateTab('bases')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-d2-socket font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
          >
            <span>頂級底材寶典</span>
          </button>

          <button
            onClick={() => onNavigateTab('quests')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-sanctuary-200 font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
          >
            <span>全章節任務</span>
          </button>

          <button
            onClick={() => setShowVideoModal(true)}
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-sanctuary-950 hover:bg-sanctuary-900 border border-sanctuary-800 text-sanctuary-400 hover:text-white text-sm transition-all duration-200"
          >
            <Play className="w-4 h-4 text-d2-fire fill-d2-fire" />
            <span>宣傳影片</span>
          </button>
        </div>

        {/* Feature Stat Matrix */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-sanctuary-800/60">
          <div className="p-4 rounded-xl bg-sanctuary-900/50 border border-sanctuary-800">
            <div className="font-diablo text-2xl font-bold text-d2-gold">{skillTreeCount} 系技能樹</div>
            <div className="text-xs text-sanctuary-400 mt-1">{skillClassCount} 職業技能資料・110 點配點</div>
          </div>
          <div className="p-4 rounded-xl bg-sanctuary-900/50 border border-sanctuary-800">
            <div className="font-diablo text-2xl font-bold text-d2-unique">{runewordCount} 組</div>
            <div className="text-xs text-sanctuary-400 mt-1">已收錄符文之語・與寶典同步</div>
          </div>
          <div className="p-4 rounded-xl bg-sanctuary-900/50 border border-sanctuary-800">
            <div className="font-diablo text-2xl font-bold text-d2-socket">27 任務</div>
            <div className="text-xs text-sanctuary-400 mt-1">永久+12技能/+15屬性/+30全抗</div>
          </div>
          <div className="p-4 rounded-xl bg-sanctuary-900/50 border border-sanctuary-800">
            <div className="font-diablo text-2xl font-bold text-d2-fire">4 大事件</div>
            <div className="text-xs text-sanctuary-400 mt-1">紅門六王·地表大菠蘿·牛關·TZ</div>
          </div>
        </div>

        {/* Platforms Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-sanctuary-400">
          <span className="text-sanctuary-500 uppercase tracking-widest font-mono text-[11px]">支援平台:</span>
          <span className="px-2.5 py-1 rounded bg-sanctuary-900/80 border border-sanctuary-800">PC (Battle.net & Steam)</span>
          <span className="px-2.5 py-1 rounded bg-sanctuary-900/80 border border-sanctuary-800">PlayStation 5 | PS4</span>
          <span className="px-2.5 py-1 rounded bg-sanctuary-900/80 border border-sanctuary-800">Xbox Series X|S | Xbox One</span>
          <span className="px-2.5 py-1 rounded bg-sanctuary-900/80 border border-sanctuary-800">Nintendo Switch</span>
        </div>
      </div>

      {/* Video Modal (Blizzard Official Trailer) */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-sanctuary-950 border border-sanctuary-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-sanctuary-800 bg-sanctuary-900">
              <span className="font-diablo font-bold text-d2-unique text-base">《暗黑破壞神 II：獄火重生》實機展示影片</span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-lg text-sanctuary-400 hover:text-white hover:bg-sanctuary-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src="https://www.youtube-nocookie.com/embed/iKMh4dRPXa8?autoplay=1"
                title="Diablo II Resurrected Trailer"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
