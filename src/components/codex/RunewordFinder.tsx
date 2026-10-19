import React, { useState, useMemo } from 'react';
import { RUNEWORDS_DATA } from '../../data/runewords';
import { cleanSearchQuery, normalizeItemQuery } from '../../utils/itemQueryNormalizer';
import { ItemIcon } from '../common/ItemIcon';
import { BASE_ITEMS_DATA } from '../../data/bases';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import { PageHeader } from '../common/PageHeader';
import { Search, Sparkles, Filter, X } from 'lucide-react';

export interface RunewordFinderProps {
  initialQuery?: string;
  onNavigateToRune?: (runeNumber: number) => void;
  onNavigateToBase?: (baseName: string) => void;
}

export const RunewordFinder: React.FC<RunewordFinderProps> = ({
  initialQuery = '',
  onNavigateToRune,
  onNavigateToBase,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSockets, setSelectedSockets] = useState<number | 'all'>('all');
  const [selectedBase, setSelectedBase] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyLadder, setOnlyLadder] = useState<boolean>(false);
  const [onlyDLC, setOnlyDLC] = useState<boolean>(false);
  const [group, setGroup] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // 以可鑲嵌底材分組的大圖分類磚（與下方底材下拉並行運作）
  const GROUPS: { id: string; label: string; match: (b: string[]) => boolean; rep: string }[] = [
    { id: 'all', label: '全部符文之語', match: () => true, rep: 'Archon Plate' },
    { id: 'armor', label: '護甲', match: (b) => b.some((x) => x.includes('護甲')), rep: 'Archon Plate' },
    { id: 'helm', label: '頭盔', match: (b) => b.some((x) => x.includes('頭盔')), rep: 'Shako' },
    { id: 'shield', label: '盾牌', match: (b) => b.some((x) => x.includes('盾牌')), rep: 'Monarch' },
    { id: 'melee', label: '近戰武器', match: (b) => b.some((x) => /近戰武器|^武器$|刀劍|斧|釘鎚|重槌|權杖|短棒/.test(x)), rep: 'Phase Blade' },
    { id: 'bow', label: '弓或弩', match: (b) => b.some((x) => x.includes('弓')), rep: 'Hydra Bow' },
    { id: 'staff', label: '法杖・魔杖', match: (b) => b.some((x) => /法杖|魔杖/.test(x)), rep: 'Archon Staff' },
    { id: 'polearm', label: '長柄・長矛', match: (b) => b.some((x) => /長柄|長矛/.test(x)), rep: 'Thresher' },
    { id: 'claw', label: '爪・匕首', match: (b) => b.some((x) => /爪|拳刃|匕首/.test(x)), rep: 'Runic Talons' },
  ];
  const baseImg = (nameEn: string) => {
    const b = BASE_ITEMS_DATA.find((i) => i.nameEn === nameEn);
    return { name: b?.name, nameEn: b?.nameEn, baseItem: b?.name, rarity: 'normal' as const, imageUrl: b?.imageUrl };
  };
  const repFor = (bases: string[]) => {
    const g = GROUPS.find((x) => x.id !== 'all' && x.match(bases));
    return baseImg(g ? g.rep : 'Phase Blade');
  };
  const groupTiles: CategoryTile[] = GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    count: RUNEWORDS_DATA.filter((rw) => g.match(rw.allowedBases)).length,
    tone: g.id === 'all' ? 'neutral' : 'rune',
    icon: baseImg(g.rep),
  }));

  // Sync initialQuery when prop changes
  React.useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Extract all unique bases & tags
  const allBases = useMemo(() => {
    const set = new Set<string>();
    RUNEWORDS_DATA.forEach((rw) => rw.allowedBases.forEach((b) => set.add(b)));
    return Array.from(set);
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    RUNEWORDS_DATA.forEach((rw) => rw.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  // Filter logic
  const filteredRunewords = useMemo(() => {
    return RUNEWORDS_DATA.filter((rw) => {
      // Search
      if (searchQuery.trim()) {
        const norm = normalizeItemQuery(searchQuery);
        if (norm && norm.type === 'runeword' && rw.id === norm.id) {
          // Exact alias or normalized match (e.g. 剛毅甲 -> fortitude, 信心弓 -> faith)
        } else {
          const queryTerms = cleanSearchQuery(searchQuery);
          const matchesQuery = queryTerms.some((term) => {
            const q = term.toLowerCase().trim();
            const matchesName = rw.name.toLowerCase().includes(q) || 
                                rw.nameEn.toLowerCase().includes(q) ||
                                (rw.nameClassic && rw.nameClassic.toLowerCase().includes(q));
            const matchesRunes = rw.runes.some((r) => r.toLowerCase().includes(q));
            const matchesAttrs = rw.attributes.some((a) => a.toLowerCase().includes(q));
            const matchesBases = rw.allowedBases.some((b) => b.toLowerCase().includes(q));
            return matchesName || matchesRunes || matchesAttrs || matchesBases;
          });
          if (!matchesQuery) return false;
        }
      }

      // 分類磚
      const g = GROUPS.find((x) => x.id === group);
      if (g && !g.match(rw.allowedBases)) return false;

      // Sockets
      if (selectedSockets !== 'all' && rw.sockets !== selectedSockets) {
        return false;
      }

      // Base
      if (selectedBase !== 'all' && !rw.allowedBases.includes(selectedBase)) {
        return false;
      }

      // Tag
      if (selectedTag !== 'all' && !rw.tags.includes(selectedTag)) {
        return false;
      }

      // Ladder Only
      if (onlyLadder && !rw.ladderOnly) {
        return false;
      }

      // RotW DLC
      if (onlyDLC && !rw.isNewDLC) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedSockets, selectedBase, selectedTag, onlyLadder, onlyDLC, group]);

  React.useEffect(() => { setVisibleCount(24); }, [searchQuery, selectedSockets, selectedBase, selectedTag, onlyLadder, onlyDLC, group]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSockets('all');
    setSelectedBase('all');
    setSelectedTag('all');
    setOnlyLadder(false);
    setOnlyDLC(false);
    setGroup('all');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={<Sparkles className="w-6 h-6" />}
        title="符文之語全能檢索手冊"
        desc="包含全經典、天梯限定及最新《術士軍臨》DLC 符文之語，支援按底材孔數與關鍵屬性即時交叉篩選。"
        right={
          <div className="text-xs text-sanctuary-400 font-mono self-start px-3 py-1.5 rounded-lg bg-sanctuary-900 border border-sanctuary-800">
            已收錄 <span className="text-d2-unique font-bold">{RUNEWORDS_DATA.length}</span> 組 • 篩選符合 <span className="text-d2-set font-bold">{filteredRunewords.length}</span> 組
          </div>
        }
      />

      <div className="mb-5">
        <CategoryTiles
          tiles={groupTiles}
          activeId={group}
          onSelect={setGroup}
          iconSize="lg"
          className="grid-cols-3 sm:grid-cols-5 xl:grid-cols-9"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-sanctuary-900/90 border border-sanctuary-800 shadow-xl space-y-4 mb-8">
        {/* Top: Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-sanctuary-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="快速搜尋符文之語 (例如：謎團、精神、悔恨、Jah、FCR、Teleport...)"
            className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded-lg pl-10 pr-4 py-2 text-sm text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-unique/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sanctuary-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Socket Filter */}
          <div>
            <label className="block text-sanctuary-400 mb-1 font-medium">孔數 (Sockets)</label>
            <select
              value={selectedSockets}
              onChange={(e) => setSelectedSockets(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded px-2.5 py-1.5 text-sanctuary-200 focus:outline-none"
            >
              <option value="all">全部孔數</option>
              <option value="2">2 孔 (Sockets)</option>
              <option value="3">3 孔 (Sockets)</option>
              <option value="4">4 孔 (Sockets)</option>
              <option value="5">5 孔 (Sockets)</option>
              <option value="6">6 孔 (Sockets)</option>
            </select>
          </div>

          {/* Base Type Filter */}
          <div>
            <label className="block text-sanctuary-400 mb-1 font-medium">底材類別 (Bases)</label>
            <select
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded px-2.5 py-1.5 text-sanctuary-200 focus:outline-none"
            >
              <option value="all">全部底材</option>
              {allBases.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sanctuary-400 mb-1 font-medium">核心詞綴 (Tags)</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded px-2.5 py-1.5 text-sanctuary-200 focus:outline-none"
            >
              <option value="all">全部標籤</option>
              {allTags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Ladder toggle */}
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-sanctuary-300">
              <input
                type="checkbox"
                checked={onlyLadder}
                onChange={(e) => setOnlyLadder(e.target.checked)}
                className="rounded bg-sanctuary-950 border-sanctuary-700 text-d2-unique focus:ring-0"
              />
              <span>天梯限定 (Ladder)</span>
            </label>
          </div>

          {/* DLC RotW toggle */}
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-d2-fire">
              <input
                type="checkbox"
                checked={onlyDLC}
                onChange={(e) => setOnlyDLC(e.target.checked)}
                className="rounded bg-sanctuary-950 border-sanctuary-700 text-d2-fire focus:ring-0"
              />
              <span>術士軍臨 (RotW)</span>
            </label>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-1.5 px-3 rounded bg-sanctuary-800 hover:bg-sanctuary-750 text-sanctuary-300 text-xs flex items-center justify-center gap-1.5 border border-sanctuary-700"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>清除篩選</span>
            </button>
          </div>
        </div>
      </div>

      {/* Runewords Cards Grid */}
      {filteredRunewords.length === 0 ? (
        <div className="p-12 text-center text-sanctuary-400 bg-sanctuary-900/40 rounded-xl border border-sanctuary-800">
          查無符合目前條件的符文之語，請嘗試放寬篩選條件。
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredRunewords.slice(0, visibleCount).map((rw) => (
            <div
              key={rw.id}
              className="bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-unique/50 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Title & Runes Badges */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-sanctuary-850">
                  <div className="flex items-start gap-3">
                    <ItemIcon
                      {...repFor(rw.allowedBases)}
                      rarity="runeword"
                      size="lg"
                      imageUrl={rw.imageUrl || repFor(rw.allowedBases).imageUrl}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-diablo text-lg font-bold text-d2-unique group-hover:text-amber-300 transition-colors">
                          {rw.name}
                        </h3>
                        <span className="text-xs text-sanctuary-400 font-mono italic">
                          {rw.nameEn}
                        </span>
                      </div>
                      <div className="text-xs text-sanctuary-300 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>需求等級: <strong className="text-sanctuary-100">{rw.requiredLevel}</strong> • {rw.sockets} 孔</span>
                      <span>(</span>
                      {rw.allowedBases.map((base, bIdx) => (
                        <React.Fragment key={bIdx}>
                          {bIdx > 0 && <span className="text-sanctuary-600">/</span>}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToBase?.(base);
                            }}
                            className="text-sanctuary-300 hover:text-d2-socket hover:underline cursor-pointer transition-colors"
                            title={`點擊查看【${base}】頂級符文底材指南`}
                          >
                            {base}
                          </button>
                        </React.Fragment>
                      ))}
                      <span>)</span>
                    </div>
                  </div>
                </div>

                  {/* Badges */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {rw.isNewDLC && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-d2-fire/20 text-d2-fire border border-d2-fire/40 font-bold font-mono">
                        RotW DLC
                      </span>
                    )}
                    {rw.ladderOnly && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-d2-unique/20 text-d2-unique border border-d2-unique/40 font-medium">
                        天梯限定
                      </span>
                    )}
                  </div>
                </div>

                {/* Rune Sequence */}
                <div className="py-3 flex items-end gap-2 flex-wrap">
                  <span className="text-xs text-sanctuary-400 font-semibold mr-1 self-center">鑲嵌順序:</span>
                  {rw.runes.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToRune?.(rw.runeNumbers[i]);
                      }}
                      className="group/rune flex flex-col items-center gap-1 px-2 pt-2 pb-1.5 rounded-lg bg-d2-rune/10 hover:bg-d2-rune/25 border border-d2-rune/30 hover:border-d2-rune transition-all hover:scale-105 cursor-pointer min-w-[64px]"
                      title={`點擊跳轉查看 ${rw.runeNumbers[i]}號 符文詳細屬性與方塊合成`}
                    >
                      <ItemIcon runeNumber={rw.runeNumbers[i]} size="sm" showBorder={false} />
                      <span className="text-[11px] font-mono font-bold text-d2-rune group-hover/rune:text-white leading-none">
                        {rw.runeNumbers[i]}# {r}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Description / Playstyle */}
                {rw.description && (
                  <p className="text-xs text-sanctuary-300 italic bg-sanctuary-900/60 p-2.5 rounded-lg border border-sanctuary-850 mb-3">
                    {rw.description}
                  </p>
                )}

                {/* Attributes List */}
                <div className="space-y-1 text-xs text-d2-magic font-sans pt-1">
                  {rw.attributes.map((attr, idx) => (
                    <div key={idx} className="leading-relaxed">
                      • {attr}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Bases & Tags Footer */}
              <div className="mt-4 pt-3 border-t border-sanctuary-850/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sanctuary-400">
                {rw.recommendedBases ? (
                  <div className="truncate">
                    <strong className="text-sanctuary-300">推薦底材：</strong>
                    <span className="text-d2-white font-medium">{rw.recommendedBases}</span>
                  </div>
                ) : <div />}
                <div className="flex items-center gap-1 flex-wrap shrink-0">
                  {rw.tags.map((t, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-sanctuary-900 text-sanctuary-400 border border-sanctuary-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {filteredRunewords.length > visibleCount && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount((c) => c + 24)}
            className="px-6 py-2.5 rounded-xl bg-sanctuary-900 border border-sanctuary-700 hover:border-d2-unique text-sm text-sanctuary-200"
          >
            顯示更多（已顯示 {visibleCount} / {filteredRunewords.length} 組）
          </button>
        </div>
      )}
    </div>
  );
};
