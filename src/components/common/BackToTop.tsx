import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, Search } from 'lucide-react';

export interface BackToTopProps {
  /** 滾動超過多少像素時顯示，預設 280px */
  threshold?: number;
  /** 可選提供快速開啟全域搜尋 Modal 的回呼函式 */
  onOpenSearch?: () => void;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 280,
  onOpenSearch,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 監聽滾動事件並計算進度
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0;

    setScrollProgress(progress);
    setIsVisible(scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初始化執行一次
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 鍵盤 Home 鍵快捷支援（非輸入狀態下）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Home') {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        scrollToTop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  // SVG 圓環進度計算 (半徑 r = 18, 周長 = 2 * PI * 18 ≈ 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-40 flex flex-col items-center gap-2 transition-all duration-300 animate-fade-in"
      role="region"
      aria-label="頁面導航快捷按鈕"
    >
      {/* 快捷全域搜尋小按鈕（滾動深處時隨時可搜，免去手動滾到最頂端） */}
      {onOpenSearch && scrollProgress > 15 && (
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="快速開啟全域搜尋"
          title="快速開啟全域搜尋 (HotKey: Q)"
          className="group relative w-9 h-9 rounded-full bg-sanctuary-900/90 hover:bg-sanctuary-850 border border-sanctuary-750 hover:border-d2-unique text-sanctuary-400 hover:text-d2-unique shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        >
          <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
          {/* Tooltip */}
          <span className="hidden lg:group-hover:inline-block absolute right-11 px-2 py-1 rounded bg-sanctuary-950 border border-sanctuary-750 text-[11px] text-sanctuary-200 whitespace-nowrap shadow-xl pointer-events-none font-sans font-medium">
            全站搜尋 <kbd className="font-mono text-d2-unique ml-0.5 font-bold">Q</kbd>
          </span>
        </button>
      )}

      {/* 主按鈕：返回頂端 (帶動態圓形滾動進度條) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="返回頁面頂端"
        title="返回頂端 (或按 Home 鍵)"
        className="group relative w-11 h-11 rounded-full bg-sanctuary-950/90 hover:bg-sanctuary-900 border border-sanctuary-750 hover:border-d2-unique shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ring-1 ring-black/40 hover:shadow-glow-gold"
      >
        {/* 背景環形 SVG 滾動進度條 */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 44 44"
        >
          {/* 底圈軌道 */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-sanctuary-850"
          />
          {/* 動態進度圈 */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-d2-unique transition-all duration-150"
          />
        </svg>

        {/* 向上箭頭圖標 */}
        <div className="relative z-10 flex flex-col items-center justify-center text-sanctuary-300 group-hover:text-amber-200 transition-colors">
          <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
          <span className="text-[8px] font-mono leading-none font-bold text-d2-unique/90 scale-90">
            {Math.round(scrollProgress)}%
          </span>
        </div>

        {/* Tooltip 提示 */}
        <span className="hidden lg:group-hover:inline-block absolute right-13 px-2 py-1 rounded bg-sanctuary-950 border border-sanctuary-750 text-[11px] text-sanctuary-200 whitespace-nowrap shadow-xl pointer-events-none font-sans font-medium">
          返回頂端 <span className="text-sanctuary-500 font-mono text-[10px]">(Home)</span>
        </span>
      </button>
    </div>
  );
};
