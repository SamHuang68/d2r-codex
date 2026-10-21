import React from 'react';
import { Flame, ShieldCheck, Database, Zap } from 'lucide-react';
import meta from '../../data/game/meta.json';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-sanctuary-950 border-t border-sanctuary-850 mt-16 pb-20 xl:pb-8 text-xs text-sanctuary-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-sanctuary-850 border border-sanctuary-750 flex items-center justify-center">
            <Flame className="w-4 h-4 text-d2-unique" />
          </div>
          <div>
            <div className="font-diablo text-sm font-bold text-sanctuary-200 tracking-wider">
              SANCTUARY CODEX • 聖休亞瑞典藏中樞
            </div>
            <div className="text-[11px] text-sanctuary-500 font-sans">
              暗黑破壞神 II：獄火重生 (D2R) 旗艦遊戲專頁與全功能速查手冊
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-sanctuary-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-d2-set" />
            純本地無痕存儲 (LocalStorage)
          </span>
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-d2-unique" />
            完整典藏資料庫 (離線支援)
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-d2-fire" />
            秒級模糊檢索 (HotKey 'Q')
          </span>
          <span className="flex items-center gap-1.5 text-sanctuary-500" title="模擬器與百科的數值由此版本的遊戲資料表產生">
            遊戲資料版本 {meta.gameVersion}（{meta.generatedAt} 產生）
          </span>
        </div>
      </div>
    </footer>
  );
};
