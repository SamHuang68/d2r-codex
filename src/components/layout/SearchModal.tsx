import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Flame, Shield, Sparkles, BookOpen, MapPin, Users, Gem, Skull, ShieldAlert, Compass, FlaskConical, Swords, Ghost, Tag, Landmark, TrendingUp } from 'lucide-react';
import { searchOmni, SearchResultItem } from '../../utils/search';
import { searchCodex } from '../../utils/searchCodex';
import { expandLegacyQuery } from '../../utils/termAliases';

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
        return <Flame className="w-4 h-4 text-d2-unique" />;
      case 'unique':
        return <Sparkles className="w-4 h-4 text-d2-unique" />;
      case 'set':
        return <Shield className="w-4 h-4 text-d2-set" />;
      case 'rune':
        return <Flame className="w-4 h-4 text-d2-rune" />;
      case 'cube':
        return <BookOpen className="w-4 h-4 text-d2-magic" />;
      case 'area':
        return <MapPin className="w-4 h-4 text-d2-fire" />;
      case 'mercenary':
        return <Users className="w-4 h-4 text-d2-gold" />;
      case 'valuation':
        return <Gem className="w-4 h-4 text-d2-magic" />;
      case 'uber':
        return <Skull className="w-4 h-4 text-d2-fire" />;
      case 'skill':
        return <Sparkles className="w-4 h-4 text-d2-gold" />;
      case 'base':
        return <ShieldAlert className="w-4 h-4 text-d2-socket" />;
      case 'quest':
        return <Compass className="w-4 h-4 text-d2-gold" />;
      case 'prop':
        return <FlaskConical className="w-4 h-4 text-d2-magic" />;
      case 'character':
        return <Swords className="w-4 h-4 text-d2-fire" />;
      case 'monster':
        return <Ghost className="w-4 h-4 text-d2-fire" />;
      case 'affix':
        return <Tag className="w-4 h-4 text-d2-magic" />;
      case 'shrine':
        return <Landmark className="w-4 h-4 text-d2-gold" />;
      case 'exp':
        return <TrendingUp className="w-4 h-4 text-d2-gold" />;
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
            placeholder="搜尋符文之語、暗金、套裝、符文、配方、85場景、怪物、詞綴、聖壇、經驗... (支援中英文)"
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
              ESC 關閉
            </kbd>
          )}
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto flex-1 divide-y divide-sanctuary-800/60 p-2">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-sanctuary-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-sanctuary-400" />
              輸入關鍵字進行秒級速查，例如：<br />
              <span className="text-d2-unique font-medium">謎團</span>、
              <span className="text-d2-unique font-medium">Enigma</span>、
              <span className="text-d2-set font-medium">塔拉夏</span>、
              <span className="text-d2-rune font-medium">喬丹</span>、
              <span className="text-d2-magic font-medium">打孔</span>、
              <span className="text-d2-fire font-medium">地穴</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sanctuary-400 text-sm">
              查無與「<span className="text-sanctuary-200 font-semibold">{query}</span>」相符之遊戲資料
            </div>
          ) : (
            results.map((item) => (
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
                      {item.title}
                    </span>
                    <span className="text-xs text-sanctuary-400 font-mono hidden sm:inline truncate">
                      {item.titleEn}
                    </span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded border shrink-0 font-medium ${getTypeBadgeClass(item.type)}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="text-xs text-sanctuary-400 mt-1 pl-6 truncate font-sans">
                  {item.category} • <span className="text-sanctuary-300">{item.preview}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-sanctuary-800 bg-sanctuary-950 flex items-center justify-between text-xs text-sanctuary-400">
          <span>共找到 {results.length} 筆資料</span>
          <span className="text-[11px]">按「Q」鍵隨時喚出此視窗</span>
        </div>
      </div>
    </div>
  );
};
