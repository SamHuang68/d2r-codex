import React, { useState } from 'react';
import { Play, Sparkles, Trophy, ArrowRight, X } from 'lucide-react';

interface HeroSectionProps {
  onNavigateTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateTab }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-sanctuary-800">
      {/* Background Decorative Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-d2-fire/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute top-20 -left-20 w-80 h-80 bg-d2-unique/5 rounded-full blur-[100px]" />
        <div className="absolute top-40 -right-20 w-80 h-80 bg-d2-blood/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sanctuary-900 border border-d2-unique/30 text-xs text-d2-unique mb-6 shadow-glow-gold/40 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold tracking-wide">DLC《術士軍臨》REIGN OF THE WARLOCK 全新收錄</span>
          <span className="text-sanctuary-400 font-mono">v2.6+</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-diablo text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-wider text-sanctuary-100 max-w-4xl mx-auto leading-tight md:leading-none">
          聖休亞瑞的命運，<br />
          <span className="bg-gradient-to-r from-d2-unique via-amber-200 to-d2-fire bg-clip-text text-transparent drop-shadow-sm">
            由你執掌
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-sanctuary-300 max-w-2xl mx-auto font-sans leading-relaxed">
          歷久不衰的動作角色扮演傳奇。打造專屬於你的極速查裝工具、符文之語配裝矩陣、FCR/FHR 幀數斷點計算機與聖杯打寶挑戰追蹤器。
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigateTab('runewords')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-d2-unique to-amber-600 hover:from-amber-500 hover:to-d2-unique text-sanctuary-950 font-bold text-sm tracking-wide shadow-glow-gold transition-all duration-200 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>查閱符文之語資料庫</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => setShowVideoModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-700 text-sanctuary-200 hover:text-white font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 text-d2-fire fill-d2-fire" />
            <span>觀看官方宣傳實機影片</span>
          </button>

          <button
            onClick={() => onNavigateTab('grail')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-sanctuary-950 hover:bg-sanctuary-900 border border-d2-gold/40 text-d2-gold font-medium text-sm transition-all duration-200"
          >
            <Trophy className="w-4 h-4" />
            <span>聖杯打寶進度</span>
          </button>
        </div>

        {/* Feature Stat Matrix */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-sanctuary-800/60">
          <div className="p-4 rounded-xl bg-sanctuary-900/50 border border-sanctuary-800">
            <div className="font-diablo text-2xl font-bold text-d2-unique">33 枚</div>
            <div className="text-xs text-sanctuary-400 mt-1">全符文打孔與合成升級路徑</div>
          </div>
          <div className="p-4 rounded-xl bg-sanctuary-900/50 border border-sanctuary-800">
            <div className="font-diablo text-2xl font-bold text-d2-unique">100+ 款</div>
            <div className="text-xs text-sanctuary-400 mt-1">天梯與經典符文之語全屬性</div>
          </div>
          <div className="p-4 rounded-xl bg-sanctuary-900/50 border border-sanctuary-800">
            <div className="font-diablo text-2xl font-bold text-d2-fire">8 大職業</div>
            <div className="text-xs text-sanctuary-400 mt-1">含術士 (Warlock) 技能與斷點</div>
          </div>
          <div className="p-4 rounded-xl bg-sanctuary-900/50 border border-sanctuary-800">
            <div className="font-diablo text-2xl font-bold text-d2-set">100% 離線</div>
            <div className="text-xs text-sanctuary-400 mt-1">本機 LocalStorage 無痕保存</div>
          </div>
        </div>

        {/* Platforms Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-sanctuary-400">
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
