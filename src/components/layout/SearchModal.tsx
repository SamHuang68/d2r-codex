import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Shield } from 'lucide-react';
import { GameIcon } from '../common/GameIcons';
import { searchOmni, SearchResultItem } from '../../utils/search';
import { searchCodex } from '../../utils/searchCodex';
import { expandLegacyQuery } from '../../utils/termAliases';
import { useLanguage } from '../../context/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (targetTab: string, itemId: string, itemTitle?: string, runeNumber?: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const { t, isEn } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return undefined; }
    // 查詢字串裡若有舊寫法（站內用字已統一成遊戲字串），也用遊戲寫法搜一次；原查詢的結果在前，附加的結果依 id 去重
    const queries = expandLegacyQuery(query);
    const dedupe = (list: SearchResultItem[]) => { const seen = new Set<string>(); return list.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true))); };
    const hits = dedupe(queries.flatMap((q) => searchOmni(q)));
    setResults(hits);
    // 怪物、詞綴、聖壇、經驗值表的資料較大，輸入之後才載入；結果附加在原本的結果後面。輸入又變了就丟掉舊的結果
    let alive = true;
    Promise.all(queries.map((q) => searchCodex(q)))
      .then((lists) => { const more = dedupe(lists.flat()); if (alive && more.length) setResults(dedupe([...hits, ...more])); })
      .catch(() => undefined);
    return () => { alive = false; };
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'runeword':
        return <GameIcon name="rune" className="w-4 h-4 text-d2-unique" />;
      case 'unique':
        return <GameIcon name="sword" className="w-4 h-4 text-d2-unique" />;
      case 'set':
        return <Shield className="w-4 h-4 text-d2-set" />;
      case 'rune':
        return <GameIcon name="stone" className="w-4 h-4 text-d2-rune" />;
      case 'cube':
        return <GameIcon name="cube" className="w-4 h-4 text-d2-magic" />;
      case 'area':
        return <GameIcon name="map" className="w-4 h-4 text-d2-fire" />;
      case 'mercenary':
        return <GameIcon name="swords" className="w-4 h-4 text-d2-gold" />;
      case 'valuation':
        return <GameIcon name="gem" className="w-4 h-4 text-d2-magic" />;
      case 'uber':
        return <GameIcon name="skull" className="w-4 h-4 text-d2-fire" />;
      case 'skill':
        return <GameIcon name="tree" className="w-4 h-4 text-d2-gold" />;
      case 'base':
        return <GameIcon name="shield" className="w-4 h-4 text-d2-socket" />;
      case 'quest':
        return <GameIcon name="scroll" className="w-4 h-4 text-d2-gold" />;
      case 'prop':
        return <GameIcon name="flask" className="w-4 h-4 text-d2-magic" />;
      case 'character':
        return <GameIcon name="helm" className="w-4 h-4 text-d2-fire" />;
      case 'monster':
        return <GameIcon name="demon" className="w-4 h-4 text-d2-fire" />;
      case 'affix':
        return <GameIcon name="tag" className="w-4 h-4 text-d2-magic" />;
      case 'shrine':
        return <GameIcon name="altar" className="w-4 h-4 text-d2-gold" />;
      case 'exp':
        return <GameIcon name="levelup" className="w-4 h-4 text-d2-gold" />;
    }
  };

  const getTypeBadgeClass = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'runeword':
      case 'unique':
        return 'bg-d2-unique/10 text-d2-unique border-d2-unique/30';
      case 'set':
        return 'bg-d2-set/10 text-d2-set border-d2-set/30';
      case 'rune':
        return 'bg-d2-rune/10 text-d2-rune border-d2-rune/30';
      case 'cube':
        return 'bg-d2-magic/10 text-d2-magic border-d2-magic/30';
      case 'area':
      case 'uber':
      case 'character':
      case 'monster':
        return 'bg-d2-fire/10 text-d2-fire border-d2-fire/30';
      case 'affix':
        return 'bg-d2-magic/10 text-d2-magic border-d2-magic/30';
      case 'shrine':
      case 'exp':
        return 'bg-d2-gold/10 text-d2-gold border-d2-gold/30';
      case 'mercenary':
        return 'bg-d2-gold/10 text-d2-gold border-d2-gold/30';
      case 'valuation':
      case 'prop':
        return 'bg-d2-magic/10 text-d2-magic border-d2-magic/30';
      case 'skill':
        return 'bg-d2-gold/10 text-d2-gold border-d2-gold/30';
      case 'base':
        return 'bg-d2-socket/10 text-d2-socket border-d2-socket/30';
      case 'quest':
        return 'bg-d2-gold/10 text-d2-gold border-d2-gold/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-sanctuary-900 border border-sanctuary-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-sanctuary-800 bg-sanctuary-950">
          <Search className="w-5 h-5 text-sanctuary-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('搜尋符文之語、暗金、套裝、符文、配方、85場景、怪物、詞綴、聖壇、經驗... (支援中英文)', 'Search Runewords, Uniques, Sets, Runes, Recipes, TC85, Monsters, Affixes... (EN / 中文)')}
            className="w-full bg-transparent text-sanctuary-100 placeholder-sanctuary-500 text-base focus:outline-none font-sans"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-sanctuary-400 hover:text-sanctuary-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-sanctuary-400 bg-sanctuary-850 rounded border border-sanctuary-700">
              {t('ESC 關閉', 'ESC to Close')}
            </kbd>
          )}
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto flex-1 divide-y divide-sanctuary-800/60 p-2">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-sanctuary-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-sanctuary-400" />
              {t('輸入關鍵字進行秒級速查，例如：', 'Type keywords for instant lookup, e.g.:')}<br />
              <span className="text-d2-unique font-medium">{isEn ? 'Enigma' : '謎團'}</span>{isEn ? ', ' : '、'}
              <span className="text-d2-unique font-medium">{isEn ? 'Infinity' : '無限'}</span>{isEn ? ', ' : '、'}
              <span className="text-d2-set font-medium">{isEn ? 'Tal Rasha' : '塔拉夏'}</span>{isEn ? ', ' : '、'}
              <span className="text-d2-rune font-medium">{isEn ? 'Stone of Jordan' : '喬丹'}</span>{isEn ? ', ' : '、'}
              <span className="text-d2-magic font-medium">{isEn ? 'Sockets' : '打孔'}</span>{isEn ? ', ' : '、'}
              <span className="text-d2-fire font-medium">{isEn ? 'The Pit' : '地穴'}</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sanctuary-400 text-sm">
              {isEn ? (
                <>No game data found matching &ldquo;<span className="text-sanctuary-200 font-semibold">{query}</span>&rdquo;</>
              ) : (
                <>查無與「<span className="text-sanctuary-200 font-semibold">{query}</span>」相符之遊戲資料</>
              )}
            </div>
          ) : (
            results.map((item) => {
              const mainTitle = isEn && item.titleEn ? item.titleEn : item.title;
              const subTitle = isEn && item.titleEn ? item.title : item.titleEn;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    let runeNum: number | undefined;
                    if (item.type === 'rune') {
                      const match = item.id.match(/\d+/);
                      if (match) runeNum = parseInt(match[0], 10);
                    }
                    onSelectResult(item.targetTab, item.id, item.title, runeNum);
                    onClose();
                  }}
                  className="p-3 hover:bg-sanctuary-800/60 rounded-lg cursor-pointer transition-colors duration-150 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0">{getTypeIcon(item.type)}</span>
                      <span className="font-semibold text-sanctuary-100 group-hover:text-d2-unique truncate text-sm">
                        {mainTitle}
                      </span>
                      {subTitle && (
                        <span className="text-xs text-sanctuary-400 font-mono hidden sm:inline truncate">
                          {subTitle}
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded border shrink-0 font-medium ${getTypeBadgeClass(item.type)}`}>
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-xs text-sanctuary-400 mt-1 pl-6 truncate font-sans">
                    {item.category} • <span className="text-sanctuary-300">{item.preview}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-sanctuary-800 bg-sanctuary-950 flex items-center justify-between text-xs text-sanctuary-400">
          <span>{isEn ? `Found ${results.length} results` : `共找到 ${results.length} 筆資料`}</span>
          <span className="text-[11px]">{t('按「Q」鍵隨時喚出此視窗', 'Press "Q" anytime to search')}</span>
        </div>
      </div>
    </div>
  );
};
