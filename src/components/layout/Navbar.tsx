import React from 'react';
import { ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { GameIcon } from '../common/GameIcons';
import { NAV_GROUPS, ALL_NAV_MODULES, isPlainLeftClick, tabHref } from './navConfig';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import { MusicControl } from '../common/MusicControl';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
}

/** 頂部列：品牌、目前所在頁、語言切換、搜尋；桌面版的完整分頁導覽由 SideNav 提供 */
export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSearch }) => {
  const { t } = useLanguage();
  const current = ALL_NAV_MODULES.find((m) => m.id === activeTab);
  const [scrollPercent, setScrollPercent] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const currentY = window.scrollY || document.documentElement.scrollTop;
      setScrollPercent(total > 0 ? Math.min(100, Math.max(0, (currentY / total) * 100)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-sanctuary-950/90 backdrop-blur-md border-b border-sanctuary-800/80">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <a
          href={tabHref('overview')}
          onClick={(e) => { if (!isPlainLeftClick(e)) return; e.preventDefault(); setActiveTab('overview'); }}
          aria-label={t('回到主頁', 'Back to Home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-d2-unique to-sanctuary-900 p-0.5 shadow-glow-gold flex items-center justify-center">
            <div className="w-full h-full bg-sanctuary-950 rounded-[7px] flex items-center justify-center">
              <GameIcon name="gate" className="w-4 h-4 text-d2-unique group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
          <div className="max-[439px]:hidden">
            <div className="font-diablo text-sm md:text-base font-bold tracking-wider text-sanctuary-100 group-hover:text-d2-unique transition-colors">
              SANCTUARY CODEX
            </div>
            <div className="hidden sm:block text-[9px] text-d2-unique/80 font-mono tracking-widest uppercase">
              {t('暗黑II：獄火重生 全資料庫', 'D2: Resurrected Database')}
            </div>
          </div>
        </a>

        {current && (
          <button
            type="button"
            onClick={scrollToTop}
            className="hidden md:flex items-center gap-2 text-sm text-sanctuary-300 min-w-0 hover:text-d2-unique transition-colors cursor-pointer group"
            title={t('點擊回到頂端', 'Scroll to top')}
          >
            <span className="text-sanctuary-500">/</span>
            {current.icon}
            <span className="font-bold text-d2-unique group-hover:underline truncate">
              {t(current.label, current.labelEn)}
            </span>
            <span className="hidden xl:inline text-xs text-sanctuary-500 truncate">
              {t(current.desc, current.descEn)}
            </span>
          </button>
        )}

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* 背景音樂開關（預設關閉） */}
          <MusicControl />

          {/* 中／英雙語切換按鈕 */}
          <LanguageToggle />

          {/* 全域搜尋按鈕 */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-sanctuary-300 hover:text-sanctuary-100 text-xs transition-colors shadow-inner"
            title={t('按下 Q 或 / 鍵快速搜尋', 'Press Q or / to search')}
          >
            <Search className="w-3.5 h-3.5 text-sanctuary-400" />
            <span className="hidden sm:inline">{t('搜尋資料庫', 'Search')}</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-sanctuary-800 border border-sanctuary-700 rounded text-d2-unique font-bold">
              Q
            </kbd>
          </button>
        </div>
      </div>
      {/* 頂部閱讀滾動進度條 */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-600 via-d2-unique to-amber-300 transition-all duration-150 pointer-events-none opacity-80"
        style={{ width: `${scrollPercent}%` }}
        role="progressbar"
        aria-label={t('閱讀進度', 'Reading progress')}
        aria-valuenow={Math.round(scrollPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </header>
  );
};

/** 桌面側邊導覽：5 組、21 個分頁全部常駐可見；預設緊湊，可收合成純圖示欄（偏好會記住） */
const COLLAPSE_KEY = 'sanctuary.sidenav.collapsed';
const readCollapsed = () => {
  try { return window.localStorage.getItem(COLLAPSE_KEY) === '1'; } catch { return false; }
};

export const SideNav: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab,
}) => {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = React.useState<boolean>(readCollapsed);
  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try { window.localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0'); } catch { /* 無痕或封鎖時略過 */ }
  };

  return (
    <aside aria-label={t('全站功能列', 'Site Navigation')} className={`hidden lg:block shrink-0 border-r border-sanctuary-800/80 bg-sanctuary-950/60 transition-[width] duration-150 ${collapsed ? 'w-10' : 'w-32'}`}>
      <nav
        aria-label={t('全站分頁', 'Site Tabs')}
        className={`sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar py-1 px-1`}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? t('展開側邊欄', 'Expand sidebar') : t('收合側邊欄', 'Collapse sidebar')}
          title={collapsed ? t('展開側邊欄', 'Expand sidebar') : t('收合側邊欄', 'Collapse sidebar')}
          className={`mb-0.5 w-full flex items-center rounded-md h-6 text-[11px] text-sanctuary-400 hover:text-sanctuary-100 hover:bg-sanctuary-900 border border-transparent transition-colors ${collapsed ? 'justify-center' : 'gap-1.5 px-1.5'}`}
        >
          {collapsed ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronsLeft className="w-4 h-4" />
              <span>{t('收合側邊欄', 'Collapse')}</span>
            </>
          )}
        </button>
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.category} role="group" aria-label={t(group.category, group.categoryEn)} className={gi === 0 ? '' : collapsed ? 'mt-1 pt-1 border-t border-sanctuary-800/70' : 'mt-1.5'}>
            <div className={collapsed ? 'sr-only' : 'px-1.5 text-[10px] leading-4 font-mono font-bold tracking-wider text-sanctuary-400 uppercase truncate'}>
              {t(group.category, group.categoryEn)}
            </div>
            <div>
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const label = t(item.label, item.labelEn);
                const desc = t(item.desc, item.descEn);
                return (
                  <a
                    key={item.id}
                    href={tabHref(item.id)}
                    onClick={(e) => {
                      if (!isPlainLeftClick(e)) return;
                      e.preventDefault();
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    title={collapsed ? `${label}：${desc}` : desc}
                    aria-label={label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center rounded-md text-[13px] leading-5 text-left transition-colors border ${
                      collapsed ? 'justify-center h-7' : 'gap-1.5 px-1.5 py-[3px]'
                    } ${
                      isActive
                        ? 'bg-sanctuary-800 text-d2-unique border-d2-unique/40 font-bold'
                        : 'text-sanctuary-300 border-transparent hover:text-sanctuary-100 hover:bg-sanctuary-900'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && <span className="truncate">{label}</span>}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
