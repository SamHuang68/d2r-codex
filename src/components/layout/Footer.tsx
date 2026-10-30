import React from 'react';
import { ShieldCheck, Database, Zap, ArrowUp } from 'lucide-react';
import { GameIcon } from '../common/GameIcons';
import meta from '../../data/game/meta.json';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { isEn } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <footer className="w-full bg-sanctuary-950 border-t border-sanctuary-850 mt-16 pb-20 xl:pb-8 text-xs text-sanctuary-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-sanctuary-850 border border-sanctuary-750 flex items-center justify-center">
            <GameIcon name="gate" className="w-4 h-4 text-d2-unique" />
          </div>
          <div>
            <div className="font-diablo text-sm font-bold text-sanctuary-200 tracking-wider">
              {isEn ? "SANCTUARY CODEX • DIABLO II ARCHIVE" : "SANCTUARY CODEX • 聖休亞瑞典藏中樞"}
            </div>
            <div className="text-[11px] text-sanctuary-500 font-sans">
              {isEn ? "Diablo II: Resurrected (D2R) Sanctuary Codex & Armor Simulator" : "暗黑破壞神 II：獄火重生 (D2R) 旗艦遊戲專頁與全功能速查手冊"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-sanctuary-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-d2-set" />
            {isEn ? "Client-side Storage (LocalStorage)" : "純本地無痕存儲 (LocalStorage)"}
          </span>
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-d2-unique" />
            {isEn ? "Full Game Database (Offline Ready)" : "完整典藏資料庫 (離線支援)"}
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-d2-fire" />
            {isEn ? "Instant Search (HotKey 'Q')" : "秒級模糊檢索 (HotKey 'Q')"}
          </span>
          <span className="flex items-center gap-1.5 text-sanctuary-500" title={isEn ? "Simulator and codex values are generated from this game data version" : "模擬器與百科的數值由此版本的遊戲資料表產生"}>
            {isEn ? `Game Data Version ${meta.gameVersion} (Built ${meta.generatedAt})` : `遊戲資料版本 ${meta.gameVersion}（${meta.generatedAt} 產生）`}
          </span>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="underline underline-offset-2 hover:text-d2-unique transition-colors cursor-pointer"
            >
              {isEn ? 'Sources & Copyright' : '資料來源與版權聲明'}
            </button>
          )}
          <button
            type="button"
            onClick={scrollToTop}
            className="px-3 py-1.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 hover:border-d2-unique text-sanctuary-300 hover:text-d2-unique transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ml-2"
            title={isEn ? "Back to top (or press Home key)" : "回到頁面頂端 (或按 Home 鍵)"}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{isEn ? "Back to Top" : "回到頂端"}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
