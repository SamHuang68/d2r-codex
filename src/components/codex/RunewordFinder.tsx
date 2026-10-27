import React, { useState, useMemo } from 'react';
import { RUNEWORDS_DATA } from '../../data/runewords';
import { cleanSearchQuery, normalizeItemQuery } from '../../utils/itemQueryNormalizer';
import { ItemIcon } from '../common/ItemIcon';
import { BASE_ITEMS_DATA } from '../../data/bases';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import { PageHeader } from '../common/PageHeader';
import { TreeIndex, Crumbs, SectionHead, DirChip, ViewToggle, crumbsOf, useDirectory } from '../common/TreeIndex';
import { TaxDef, TreeNode, buildTree, recount, findNode } from '../../utils/equipTaxonomy';
import { Search, Sparkles, Filter, X, ArrowRight } from 'lucide-react';
import { RunewordShowcase } from './RunewordShowcase';
import { useLanguage } from '../../context/LanguageContext';

export interface RunewordFinderProps {
  initialQuery?: string;
  onNavigateToRune?: (runeNumber: number) => void;
  onNavigateToBase?: (baseName: string) => void;
}

type RW = (typeof RUNEWORDS_DATA)[number];

// 以可鑲嵌底材分組（同一組符文之語可能適用多種底材，會同時出現在多個分組）
const GROUPS: { id: string; label: string; labelEn: string; match: (b: string[]) => boolean; rep: string }[] = [
  { id: 'armor', label: '護甲', labelEn: 'Body Armor', match: (b) => b.some((x) => x.includes('護甲')), rep: 'Archon Plate' },
  { id: 'helm', label: '頭盔', labelEn: 'Helms', match: (b) => b.some((x) => x.includes('頭盔')), rep: 'Shako' },
  { id: 'shield', label: '盾牌', labelEn: 'Shields', match: (b) => b.some((x) => x.includes('盾牌')), rep: 'Monarch' },
  { id: 'melee', label: '近戰武器', labelEn: 'Melee Weapons', match: (b) => b.some((x) => /近戰武器|^武器$|刀劍|斧|釘鎚|重槌|權杖|短棒/.test(x)), rep: 'Phase Blade' },
  { id: 'bow', label: '弓或弩', labelEn: 'Missile Weapons', match: (b) => b.some((x) => x.includes('弓')), rep: 'Hydra Bow' },
  { id: 'staff', label: '法杖・魔杖', labelEn: 'Staves & Wands', match: (b) => b.some((x) => /法杖|魔杖/.test(x)), rep: 'Archon Staff' },
  { id: 'polearm', label: '長柄・長矛', labelEn: 'Polearms & Spears', match: (b) => b.some((x) => /長柄|長矛/.test(x)), rep: 'Thresher' },
  { id: 'claw', label: '爪・匕首', labelEn: 'Claws & Daggers', match: (b) => b.some((x) => /爪|拳刃|匕首/.test(x)), rep: 'Runic Talons' },
];
const SOCKETS = [2, 3, 4, 5, 6];

const BASE_ZH_TO_EN: Record<string, string> = {
  '武器': 'Weapons',
  '近戰武器': 'Melee Weapons',
  '遠程武器': 'Missile Weapons',
  '弓或弩': 'Missile Weapons',
  '弓': 'Bows',
  '弩': 'Crossbows',
  '刀劍': 'Swords',
  '劍': 'Swords',
  '斧': 'Axes',
  '釘鎚': 'Maces',
  '短棒': 'Clubs',
  '重槌': 'Hammers',
  '權杖': 'Scepters',
  '長柄武器': 'Polearms',
  '長矛': 'Spears',
  '法杖': 'Staves',
  '魔杖': 'Wands',
  '匕首': 'Daggers',
  '爪或拳刃': 'Claws',
  '爪': 'Claws',
  '護甲': 'Body Armor',
  '頭盔': 'Helms',
  '盾牌': 'Shields',
  '聖騎士盾牌': 'Paladin Shields',
  '巫毒頭顱': 'Shrunken Heads',
  '魔典': 'Grimoires',
};

const TAG_ZH_TO_EN: Record<string, string> = {
  '謎團': 'Enigma',
  '無限': 'Infinity',
  '悔恨': 'Grief',
  '剛毅': 'Fortitude',
  '精神': 'Spirit',
  '靈光': 'Insight',
  '信心': 'Faith',
  '野獸': 'Beast',
  '流亡': 'Exile',
  '末日': 'Doom',
  '夢境': 'Dream',
  '榮耀之鍊': 'CoH',
  '鳳凰': 'Phoenix',
  '最後遺願': 'Last Wish',
  '死神': 'Death',
  '誓約': 'Oath',
  '執法者': 'Lawbringer',
  '強制': 'Duress',
  '石塊': 'Stone',
  '背信': 'Treachery',
  '煙霧': 'Smoke',
  '獅子心': 'Lionheart',
  '神聖雷霆': 'Holy Thunder',
  '黑色': 'Black',
  '記憶': 'Memory',
  '葉子': 'Leaf',
  '白骨': 'White',
  '微風': 'Zephyr',
  '怨恨': 'Malice',
  '鋼鐵': 'Steel',
  '隱密': 'Stealth',
  '學識': 'Lore',
  '天底': 'Nadir',
  '光輝': 'Radiance',
  '韻律': 'Rhyme',
  '燦爛': 'Splendor',
  '古代人的誓約': "Ancient's Pledge",
  '和平': 'Peace',
  '神話': 'Myth',
  '原則': 'Principle',
  '開明': 'Enlightenment',
  '骨頭': 'Bone',
  '雨雲': 'Rain',
  '催眠': 'Delirium',
  '閃爍火焰': 'Flickering Flame',
  '迷霧': 'Mist',
  '執念': 'Obsession',
  '典範': 'Pattern',
  '瘟疫': 'Plague',
  '不屈意志': 'Unbending Will',
  '智慧': 'Wisdom',
  '壓碎性打擊': 'Crushing Blow',
  '致命攻勢': 'Deadly Strike',
  '撕裂傷口': 'Open Wounds',
  '偷取生命': 'Life Steal',
  '偷取法力': 'Mana Steal',
  '快速施法速度': 'Faster Cast Rate',
  '快速打擊恢復': 'Faster Hit Recovery',
  '快速格擋速度': 'Faster Block Rate',
  '增加格擋機率': 'Increased Chance of Blocking',
  '攻擊速度': 'Attack Speed',
  '攻速': 'Attack Speed',
  '靈氣': 'Aura',
  '跑步速度': 'Faster Run/Walk',
  '跑速': 'Faster Run/Walk',
  '打擊恢復': 'Faster Hit Recovery',
  '減傷': 'Damage Reduced',
  '魔減': 'Magic Damage Reduced',
  '全抗': 'All Resistances',
  '無法被凍結': 'Cannot Be Frozen',
  '衰老': 'Decrepify',
  '傳送術': 'Teleport',
};

// 分類樹：底材類型 → 孔數（孔數越多越晚期；同孔數依需求等級排序）
const TREE_DEFS: TaxDef[] = GROUPS.map((g) => ({
  id: g.id,
  label: g.label,
  en: g.labelEn,
  children: SOCKETS.map((n) => ({ id: `${g.id}/${n}`, label: `${n} 孔`, en: `${n} Sockets` })),
}));
const groupsOf = (rw: RW) => GROUPS.filter((g) => g.match(rw.allowedBases));
const byLevel = (a: RW, b: RW) => a.requiredLevel - b.requiredLevel || a.name.localeCompare(b.name, 'zh-Hant');

export const RunewordFinder: React.FC<RunewordFinderProps> = ({
  initialQuery = '',
  onNavigateToRune,
  onNavigateToBase,
}) => {
  const { t, isEn } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSockets, setSelectedSockets] = useState<number | 'all'>('all');
  const [selectedBase, setSelectedBase] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyLadder, setOnlyLadder] = useState<boolean>(false);
  const [onlyDLC, setOnlyDLC] = useState<boolean>(false);
  const [sel, setSel] = useState<string>('all');

  const baseImg = (nameEn: string) => {
    const b = BASE_ITEMS_DATA.find((i) => i.nameEn === nameEn);
    return { name: b?.name, nameEn: b?.nameEn, baseItem: b?.name, rarity: 'normal' as const, imageUrl: b?.imageUrl };
  };
  const repFor = (bases: string[]) => {
    const g = GROUPS.find((x) => x.match(bases));
    return baseImg(g ? g.rep : 'Phase Blade');
  };

  // Sync initialQuery when prop changes
  React.useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
      if (initialQuery) setSel('all');
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

  // Filter logic（搜尋與篩選；分類由分類索引負責）
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

      // Sockets
      if (selectedSockets !== 'all' && rw.sockets !== selectedSockets) return false;
      // Base
      if (selectedBase !== 'all' && !rw.allowedBases.includes(selectedBase)) return false;
      // Tag
      if (selectedTag !== 'all' && !rw.tags.includes(selectedTag)) return false;
      // Ladder Only
      if (onlyLadder && !rw.ladderOnly) return false;
      // RotW DLC
      if (onlyDLC && !rw.isNewDLC) return false;

      return true;
    });
  }, [searchQuery, selectedSockets, selectedBase, selectedTag, onlyLadder, onlyDLC]);

  const dir = useDirectory(sel, `${searchQuery}|${selectedSockets}|${selectedBase}|${selectedTag}|${onlyLadder}|${onlyDLC}`);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSockets('all');
    setSelectedBase('all');
    setSelectedTag('all');
    setOnlyLadder(false);
    setOnlyDLC(false);
    setSel('all');
  };

  // 樹的結構固定（依全部資料），數量隨搜尋與篩選即時變動
  const baseTree = useMemo(() => {
    const counts = new Map<string, number>();
    RUNEWORDS_DATA.forEach((rw) => groupsOf(rw).forEach((g) => counts.set(`${g.id}/${rw.sockets}`, (counts.get(`${g.id}/${rw.sockets}`) ?? 0) + 1)));
    return buildTree(TREE_DEFS, counts);
  }, []);
  const tree = useMemo(() => {
    const counts = new Map<string, number>();
    filteredRunewords.forEach((rw) => groupsOf(rw).forEach((g) => counts.set(`${g.id}/${rw.sockets}`, (counts.get(`${g.id}/${rw.sockets}`) ?? 0) + 1)));
    return recount(baseTree, counts);
  }, [baseTree, filteredRunewords]);
  const root: TreeNode = useMemo(() => ({ id: 'all', label: isEn ? 'All Runewords' : '全部符文之語', count: filteredRunewords.length, children: tree }), [tree, filteredRunewords.length, isEn]);
  const node = sel === 'all' ? root : findNode(tree, sel) ?? root;
  // 目前節點一筆都沒有、但別處有符合（搜尋或篩選的結果落在別的分類）時，自動放寬到全部
  React.useEffect(() => {
    if (node.id !== 'all' && node.count === 0 && root.count > 0) setSel('all');
  }, [node.id, node.count, root.count]);
  const [selGroupId, selSockets] = node.id === 'all' ? ['', 0] : node.id.split('/');
  const selGroup = GROUPS.find((g) => g.id === selGroupId);
  const isLeaf = !!selSockets;

  // 目前節點內的符文之語（一組可能同屬多個底材分組，全部視圖只算一次）
  const here = useMemo(() => filteredRunewords
    .filter((rw) => (!selGroup || selGroup.match(rw.allowedBases)) && (!selSockets || rw.sockets === Number(selSockets)))
    .sort(byLevel), [filteredRunewords, selGroup, selSockets]);
  const dirMode = dir.isDir(isLeaf, here.length);
  const go = (id: string) => setSel(id);
  const crumbs = crumbsOf(isEn ? 'All Runewords' : '全部符文之語', tree, sel, isEn);

  // 區段：依孔數；全部視圖與底材分組視圖都是 2→6 孔，進入葉節點後只剩一段
  const sections = SOCKETS
    .map((n) => ({ n, rows: here.filter((rw) => rw.sockets === n) }))
    .filter((x) => x.rows.length > 0);

  const tiles: CategoryTile[] = (node.children ?? []).filter((c) => c.count > 0).map((c) => {
    const g = GROUPS.find((x) => x.id === c.id.split('/')[0]);
    return {
      id: c.id,
      label: c.label,
      labelEn: c.en,
      sub: selGroup ? (isEn && selGroup.labelEn ? selGroup.labelEn : selGroup.label) : (isEn && g?.labelEn ? g.labelEn : g?.label),
      subEn: selGroup ? selGroup.labelEn : g?.labelEn,
      count: c.count,
      tone: 'rune',
      icon: baseImg(g ? g.rep : 'Phase Blade'),
    };
  });

  const rwChip = (rw: RW) => {
    const g = selGroup ?? groupsOf(rw)[0];
    return (
      <DirChip
        key={rw.id}
        tone="rune"
        icon={<ItemIcon {...repFor(rw.allowedBases)} rarity="runeword" size="sm" showBorder={false} imageUrl={rw.imageUrl || repFor(rw.allowedBases).imageUrl} />}
        title={isEn ? rw.nameEn : rw.name}
        sub={`Lv${rw.requiredLevel} · ${rw.runes.join(' ')}`}
        hint={isEn ? `${rw.nameEn} | ${rw.sockets} Sockets | ${isEn && rw.allowedBasesEn ? rw.allowedBasesEn.join(', ') : rw.allowedBases.join('、')}` : `${rw.name}（${rw.nameEn}）｜${rw.sockets} 孔｜${rw.allowedBases.join('、')}`}
        onClick={() => dir.jump(`rw-${rw.id}`, `${g?.id ?? 'melee'}/${rw.sockets}`, go)}
      />
    );
  };

  const runewordCard = (rw: RW) => (
            <div
              key={rw.id}
              id={`rw-${rw.id}`}
              className={`bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-unique/50 rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between group scroll-mt-20 ${dir.flash === `rw-${rw.id}` ? 'ring-2 ring-d2-unique' : ''}`}
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
                          {isEn && rw.nameEn ? rw.nameEn : rw.name}
                        </h3>
                        {!isEn && rw.nameEn && (
                          <span className="text-xs text-sanctuary-400 font-mono italic">
                            {rw.nameEn}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-sanctuary-300 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>{isEn ? 'Req Level:' : '需求等級:'} <strong className="text-sanctuary-100">{rw.requiredLevel}</strong> • {rw.sockets} {isEn ? 'Sockets' : '孔'}</span>
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
                            title={isEn ? `Click to view [${base}] Runeword Base Guide` : `點擊查看【${base}】頂級符文底材指南`}
                          >
                            {isEn && rw.allowedBasesEn?.[bIdx] ? rw.allowedBasesEn[bIdx] : base}
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
                        {isEn ? 'Ladder Only' : '天梯限定'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rune Inscription Sockets Sequence */}
                <div className="my-3 p-3 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-sanctuary-400 font-mono mb-2">
                    <span className="flex items-center gap-1.5 font-bold text-d2-rune">
                      <Sparkles className="w-3.5 h-3.5 text-d2-rune" />
                      {isEn ? 'Socket Inscription Order:' : '符文鑲嵌槽位先後順序：'}
                    </span>
                    <span className="text-[10px] text-amber-500/80 font-mono">
                      {isEn ? '⚠ Strict Order Required' : '⚠ 必須依序鑲嵌・順序錯誤無法成形'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {rw.runes.map((r, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && (
                          <ArrowRight className="w-3.5 h-3.5 text-d2-rune/60 shrink-0" />
                        )}
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToRune?.(rw.runeNumbers[i]);
                          }}
                          className="group/rune flex flex-col items-center gap-1 px-2.5 pt-1.5 pb-2 rounded-lg bg-sanctuary-900/90 hover:bg-d2-rune/20 border border-sanctuary-750 hover:border-d2-rune transition-all hover:scale-105 cursor-pointer min-w-[66px] shadow-sm"
                          title={isEn ? `Click to view Rune #${rw.runeNumbers[i]} details & recipes` : `點擊跳轉查看 ${rw.runeNumbers[i]}號 符文詳細屬性與方塊合成`}
                        >
                          <span className="text-[9px] font-mono text-sanctuary-500 leading-none group-hover/rune:text-amber-300">
                            #{i + 1}
                          </span>
                          <ItemIcon runeNumber={rw.runeNumbers[i]} size="sm" showBorder={false} />
                          <span className="text-[11px] font-mono font-bold text-d2-rune group-hover/rune:text-white leading-none mt-0.5">
                            {rw.runeNumbers[i]}# {r}
                          </span>
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Description / Playstyle */}
                {rw.description && (
                  <p className="text-xs text-sanctuary-300 italic bg-sanctuary-900/60 p-2.5 rounded-lg border border-sanctuary-850 mb-3">
                    {rw.description}
                  </p>
                )}

                {/* Attributes List */}
                <div className="space-y-1 text-xs text-d2-magic font-sans pt-1">
                  {rw.attributes.map((attr, idx) => {
                    const isSection = /^【.+】$/.test(attr);
                    if (isSection) {
                      return (
                        <div key={idx} className="text-amber-400 font-bold font-diablo text-xs pt-2 pb-0.5 border-b border-sanctuary-850/60 first:pt-0">
                          {attr}
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="leading-relaxed pl-1">
                        • {attr}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Bases & Tags Footer */}
              <div className="mt-4 pt-3 border-t border-sanctuary-850/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sanctuary-400">
                {rw.recommendedBases ? (
                  <div className="truncate">
                    <strong className="text-sanctuary-300">{isEn ? 'Recommended Bases: ' : '推薦底材：'}</strong>
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
  );

  return (
    <div className="py-8 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={<Sparkles className="w-6 h-6" />}
        title={t('符文之語全能檢索手冊', 'Runewords Complete Codex')}
        desc={t('包含全經典、天梯限定及最新《術士軍臨》DLC 符文之語，支援按底材孔數與關鍵屬性即時交叉篩選。依「底材類型 → 孔數」分層，每層內依需求等級排序。', 'Complete database of Classic, Ladder-only, and Reign of the Warlock DLC runewords with multi-dimensional filtering by sockets, bases, and affixes.')}
        right={
          <div className="text-xs text-sanctuary-400 font-mono self-start shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg bg-sanctuary-900 border border-sanctuary-800">
            {isEn ? (
              <>Recorded <span className="text-d2-unique font-bold">{RUNEWORDS_DATA.length}</span> • Matched <span className="text-d2-set font-bold">{filteredRunewords.length}</span></>
            ) : (
              <>已收錄 <span className="text-d2-unique font-bold">{RUNEWORDS_DATA.length}</span> 組 • 篩選符合 <span className="text-d2-set font-bold">{filteredRunewords.length}</span> 組</>
            )}
          </div>
        }
      />

      {/* 四大終極信仰神裝名人堂 & 四大平民拓荒神器展廳 */}
      <RunewordShowcase
        onSelectRuneword={(rwId, sockets) => {
          const targetRw = RUNEWORDS_DATA.find((r) => r.id === rwId);
          if (!targetRw) return;
          resetFilters();
          const g = groupsOf(targetRw)[0];
          dir.jump(`rw-${targetRw.id}`, `${g?.id ?? 'melee'}/${sockets}`, go);
        }}
        onNavigateToRune={onNavigateToRune}
        onNavigateToBase={onNavigateToBase}
      />

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-sanctuary-900/90 border border-sanctuary-800 shadow-xl space-y-4 mb-8">
        {/* Top: Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-sanctuary-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('快速搜尋符文之語 (例如：謎團、精神、悔恨、Jah、FCR、Teleport...)', 'Search Runewords (e.g. Enigma, Spirit, Grief, Jah, FCR, Teleport...)')}
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
            <label className="block text-sanctuary-400 mb-1 font-medium">{t('孔數 (Sockets)', 'Sockets')}</label>
            <select
              value={selectedSockets}
              onChange={(e) => setSelectedSockets(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded px-2.5 py-1.5 text-sanctuary-200 focus:outline-none"
            >
              <option value="all">{isEn ? 'All Sockets' : '全部孔數'}</option>
              <option value="2">2 {isEn ? 'Sockets' : '孔'}</option>
              <option value="3">3 {isEn ? 'Sockets' : '孔'}</option>
              <option value="4">4 {isEn ? 'Sockets' : '孔'}</option>
              <option value="5">5 {isEn ? 'Sockets' : '孔'}</option>
              <option value="6">6 {isEn ? 'Sockets' : '孔'}</option>
            </select>
          </div>

          {/* Base Type Filter */}
          <div>
            <label className="block text-sanctuary-400 mb-1 font-medium">{t('底材類別 (Bases)', 'Bases')}</label>
            <select
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded px-2.5 py-1.5 text-sanctuary-200 focus:outline-none"
            >
              <option value="all">{isEn ? 'All Bases' : '全部底材'}</option>
              {allBases.map((b) => (
                <option key={b} value={b}>{isEn ? (BASE_ZH_TO_EN[b] ?? b) : b}</option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sanctuary-400 mb-1 font-medium">{t('核心詞綴 (Tags)', 'Key Affixes')}</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded px-2.5 py-1.5 text-sanctuary-200 focus:outline-none"
            >
              <option value="all">{isEn ? 'All Tags' : '全部標籤'}</option>
              {allTags.map((t) => (
                <option key={t} value={t}>{isEn ? (TAG_ZH_TO_EN[t] ?? t) : t}</option>
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
              <span>{isEn ? 'Ladder Only' : '天梯限定 (Ladder)'}</span>
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
              <span>{isEn ? 'Reign of the Warlock (RotW)' : '術士軍臨 (RotW)'}</span>
            </label>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-1.5 px-3 rounded bg-sanctuary-800 hover:bg-sanctuary-750 text-sanctuary-300 text-xs flex items-center justify-center gap-1.5 border border-sanctuary-700"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{t('清除篩選', 'Reset')}</span>
            </button>
          </div>
        </div>
      </div>

      <TreeIndex title={t('底材索引', 'Base Index')} rootLabel={t('全部符文之語', 'All Runewords')} rootCount={root.count} nodes={tree} activeId={node.id} onSelect={go} tone="rune" initialOpen="none">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Crumbs crumbs={crumbs} onSelect={go} tone="rune" />
            {!isLeaf && here.length > 0 && <ViewToggle dir={dirMode} onChange={dir.setView} />}
          </div>

          {tiles.length > 0 && (
            <CategoryTiles
              tiles={tiles}
              activeId={null}
              onSelect={go}
              iconSize="lg"
              className={tiles.length <= 5 ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8'}
            />
          )}

          {here.length === 0 ? (
            <div className="p-12 text-center text-sanctuary-400 bg-sanctuary-900/40 rounded-xl border border-sanctuary-800 space-y-3">
              <div>
                {root.count > 0 && node.id !== 'all'
                  ? (isEn ? `No runewords matching in "${node.en || node.label}", ${root.count} match in other categories.` : `「${node.label}」底下沒有符合目前條件的符文之語，其他分類共 ${root.count} 組符合，請看分類索引的數量。`)
                  : (isEn ? 'No runewords found matching current criteria.' : '查無符合目前條件的符文之語，請嘗試放寬篩選條件。')}
              </div>
              {root.count > 0 && node.id !== 'all' && (
                <button type="button" onClick={() => go('all')} className="px-4 py-2 rounded-lg bg-sanctuary-800 border border-sanctuary-700 text-sm text-sanctuary-100 hover:border-d2-unique">
                  {isEn ? 'Back to "All Runewords"' : '回到「全部符文之語」'}
                </button>
              )}
            </div>
          ) : (
            sections.map(({ n, rows }) => (
              <section key={n} id={`sec-${selGroupId || 'all'}-${n}`} className="mb-9 scroll-mt-20">
                <SectionHead
                  title={isEn ? `${n} Sockets` : `${n} 孔`}
                  sub={selGroup ? (isEn ? selGroup.labelEn : selGroup.label) : undefined}
                  count={rows.length}
                  tone="rune"
                  onOpen={selGroup && !isLeaf ? () => go(`${selGroup.id}/${n}`) : undefined}
                  openLabel={isEn ? `Enter "${selGroup?.labelEn ?? selGroup?.label ?? ''} ${n} Sockets"` : `進入「${selGroup?.label ?? ''} ${n} 孔」`}
                />
                {dirMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">{rows.map(rwChip)}</div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">{rows.map(runewordCard)}</div>
                )}
              </section>
            ))
          )}
        </div>
      </TreeIndex>
    </div>
  );
};
