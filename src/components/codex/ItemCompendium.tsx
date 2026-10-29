import React, { useState, useMemo } from 'react';
import { cleanSearchQuery, normalizeItemQuery } from '../../utils/itemQueryNormalizer';
import { ItemTooltip } from '../common/ItemTooltip';
import { ItemIcon } from '../common/ItemIcon';
import { Sword, Search, X, ArrowUpDown, RotateCcw } from 'lucide-react';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import { PageHeader } from '../common/PageHeader';
import { TreeIndex, Crumbs, SectionHead, DirChip, ViewToggle, crumbsOf, useDirectory } from '../common/TreeIndex';
import type { SetItemCollection, UniqueItemData, GearSlot } from '../../types';
import { CLASS_ZH_TO_EN } from '../../engine/slots';
import { TIER_LABEL, DEFAULT_TIER, TreeNode, buildTree, recount, findNode, leavesOf, inNode, relPath } from '../../utils/equipTaxonomy';
import { ITEM_TREE_DEFS, CHARM_LABEL, CHARM_LABEL_EN, U_ENTRIES, S_ENTRIES, UEntry, SEntry } from '../../utils/itemIndex';
import { CrossPropertyFilterBar } from './CrossPropertyFilterBar';
import { CrossItemCard } from './CrossItemCard';
import { useLanguage } from '../../context/LanguageContext';
import {
  getAllUnifiedItems,
  filterUnifiedItems,
  getPropertyHitCounts,
  SPECIAL_PROPERTIES,
  UnifiedItemRarity,
} from '../../utils/propertyFilter';

export interface ItemCompendiumProps {
  initialQuery?: string;
  /** 一進頁面就停在的樹節點（例如首頁「成套裝備」磚傳 's'）；沒給就停在暗金·菁英 */
  initialNode?: string;
  onNavigateToBase?: (baseName: string) => void;
  onNavigateToRune?: (runeNumber: number) => void;
}

/** 分類磚的代表圖（以去掉品階後的相對路徑查；該節點內沒有這件時，改用節點內最高等級者） */
const REP_BY_REL: Record<string, string> = {
  u: "Tyrael's Might", armor: "Tyrael's Might", weapon: 'Windforce',
  'armor/head': 'Harlequin Crest', 'armor/body': 'Skin of the Vipermagi', 'armor/shield': 'Stormshield',
  'armor/gloves': "Dracul's Grasp", 'armor/boots': 'War Traveler', 'armor/belt': 'Arachnid Mesh',
  'u/jewelry': 'The Stone of Jordan', 'u/jewelry/ring': 'The Stone of Jordan', 'u/jewelry/amulet': "Mara's Kaleidoscope",
  'u/jewelry/charm': 'Annihilus', 'u/jewelry/jewel': 'Rainbow Facet',
};
const relOf = (id: string) => id.replace(/^u\/(normal|exceptional|elite)(\/|$)/, (_m, _t, tail) => (tail ? '' : 'u'));

/** 搜尋條件每個字串只需正規化一次：先算好別名比對與關鍵字，再回傳逐件比對的函式（避免每件都掃一次全資料） */
const makeUniqueMatcher = (q: string) => {
  const norm = normalizeItemQuery(q);
  const terms = cleanSearchQuery(q).map((term) => term.toLowerCase().trim());
  return (item: UniqueItemData) => {
    if (norm && norm.type === 'unique' && item.id === norm.id) return true;
    return terms.some((t) => {
      const matchName = item.name.toLowerCase().includes(t) || item.nameEn.toLowerCase().includes(t) ||
        (item.nameClassic && item.nameClassic.toLowerCase().includes(t));
      const matchBase = item.baseItem.toLowerCase().includes(t) || (item.baseItemEn ? item.baseItemEn.toLowerCase().includes(t) : false);
      const matchAttr = item.attributes.some((a) => a.toLowerCase().includes(t));
      return matchName || matchBase || matchAttr;
    });
  };
};

const makeSetMatcher = (q: string) => {
  const norm = normalizeItemQuery(q);
  const terms = cleanSearchQuery(q).map((term) => term.toLowerCase().trim());
  return (set: SetItemCollection) => {
    if (norm && norm.type === 'set' && (set.id === norm.id || set.pieces.some((p) => p.id === norm.id))) return true;
    return terms.some((t) => {
      const matchSetName = set.name.toLowerCase().includes(t) || set.nameEn.toLowerCase().includes(t);
      const matchPieces = set.pieces.some((p) =>
        p.name.toLowerCase().includes(t) || p.nameEn.toLowerCase().includes(t) ||
        (p.nameClassic && p.nameClassic.toLowerCase().includes(t)) || p.attributes.some((a) => a.toLowerCase().includes(t)));
      return matchSetName || matchPieces;
    });
  };
};

const CLASS_NAME_EN: Record<string, string> = {
  '亞馬遜': 'Amazon',
  '刺客': 'Assassin',
  '野蠻人': 'Barbarian',
  '德魯伊': 'Druid',
  '聖騎士': 'Paladin',
  '死靈法師': 'Necromancer',
  '魔法使': 'Sorceress',
  '術士': 'Warlock',
};

export const ItemCompendium: React.FC<ItemCompendiumProps> = ({
  initialQuery = '',
  initialNode,
  onNavigateToBase,
  onNavigateToRune,
}) => {
  const { t, isEn } = useLanguage();
  const [sel, setSel] = useState<string>(initialNode ?? `u/${DEFAULT_TIER}`);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // 跨裝備特殊屬性篩選 State
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<'all' | UnifiedItemRarity>('all');
  const [selectedSlot, setSelectedSlot] = useState<'all' | GearSlot | 'multiple'>('all');
  const [crossSortBy, setCrossSortBy] = useState<'level-desc' | 'level-asc' | 'name'>('level-desc');

  const handleToggleProperty = (propId: string) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const handleClearCrossFilters = () => {
    setSelectedPropertyIds([]);
    setSelectedRarity('all');
    setSelectedSlot('all');
  };

  const allUnifiedItems = useMemo(() => getAllUnifiedItems(), []);

  // 當前部位與搜尋字串下的裝備池（用於屬性數量統計）
  const contextUnifiedItems = useMemo(() => {
    return filterUnifiedItems(allUnifiedItems, {
      slot: selectedSlot,
      searchQuery: searchQuery.trim(),
    });
  }, [allUnifiedItems, selectedSlot, searchQuery]);

  // 各特殊屬性的命中件數
  const propertyCounts = useMemo(() => {
    return getPropertyHitCounts(contextUnifiedItems);
  }, [contextUnifiedItems]);

  // 各品質的命中件數（在當前屬性、部位與搜尋字串下）
  const rarityCounts = useMemo(() => {
    const base = filterUnifiedItems(allUnifiedItems, {
      selectedPropertyIds,
      slot: selectedSlot,
      searchQuery: searchQuery.trim(),
    });
    return {
      all: base.length,
      unique: base.filter((i) => i.rarity === 'unique').length,
      set: base.filter((i) => i.rarity === 'set').length,
      runeword: base.filter((i) => i.rarity === 'runeword').length,
    };
  }, [allUnifiedItems, selectedPropertyIds, selectedSlot, searchQuery]);

  // 跨裝備過濾結果清單
  const filteredCrossItems = useMemo(() => {
    const items = filterUnifiedItems(allUnifiedItems, {
      selectedPropertyIds,
      rarity: selectedRarity,
      slot: selectedSlot,
      searchQuery: searchQuery.trim(),
    });

    return [...items].sort((a, b) => {
      if (crossSortBy === 'level-desc') return b.requiredLevel - a.requiredLevel || a.name.localeCompare(b.name, 'zh-Hant');
      if (crossSortBy === 'level-asc') return a.requiredLevel - b.requiredLevel || a.name.localeCompare(b.name, 'zh-Hant');
      return a.name.localeCompare(b.name, 'zh-Hant');
    });
  }, [allUnifiedItems, selectedPropertyIds, selectedRarity, selectedSlot, searchQuery, crossSortBy]);

  // 目前活躍的特殊屬性定義
  const activePropertyDefs = useMemo(() => {
    return SPECIAL_PROPERTIES.filter((p) => selectedPropertyIds.includes(p.id));
  }, [selectedPropertyIds]);

  // 是否進入跨裝備屬性檢索模式
  const isCrossPropertyMode = selectedPropertyIds.length > 0 || selectedRarity === 'runeword';

  // Sync initialQuery when prop changes
  React.useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== '') {
      setSearchQuery(initialQuery);
      setSel('all');
    }
  }, [initialQuery]);

  const q = searchQuery.trim();
  const dir = useDirectory(sel, q);
  const uList = useMemo(() => {
    if (!q) return U_ENTRIES;
    const match = makeUniqueMatcher(q);
    return U_ENTRIES.filter((e) => match(e.item));
  }, [q]);
  const sList = useMemo(() => {
    if (!q) return S_ENTRIES;
    const match = makeSetMatcher(q);
    return S_ENTRIES.filter((e) => match(e.set));
  }, [q]);

  // 樹的結構固定（依全部資料），數量隨搜尋即時變動
  const baseTree = useMemo(() => {
    const counts = new Map<string, number>();
    U_ENTRIES.forEach((e) => counts.set(e.leaf, (counts.get(e.leaf) ?? 0) + 1));
    S_ENTRIES.forEach((e) => counts.set(e.leaf, (counts.get(e.leaf) ?? 0) + 1));
    return buildTree(ITEM_TREE_DEFS, counts);
  }, []);
  const tree = useMemo(() => {
    if (!q) return baseTree;
    const counts = new Map<string, number>();
    uList.forEach((e) => counts.set(e.leaf, (counts.get(e.leaf) ?? 0) + 1));
    sList.forEach((e) => counts.set(e.leaf, (counts.get(e.leaf) ?? 0) + 1));
    return recount(baseTree, counts);
  }, [q, baseTree, uList, sList]);

  const root: TreeNode = useMemo(
    () => ({ id: 'all', label: isEn ? 'All Equipment' : '全部裝備', count: tree.reduce((s, n) => s + n.count, 0), children: tree }),
    [tree, isEn],
  );
  const node = sel === 'all' ? root : findNode(tree, sel) ?? root;
  // 目前節點一筆都沒有、但別處有符合（例如在預設的菁英底下搜尋套裝名或戒指）時，自動放寬到全部，搜尋才不會死在預設節點
  React.useEffect(() => {
    if (node.id !== 'all' && node.count === 0 && root.count > 0) setSel('all');
  }, [node.id, node.count, root.count]);
  const isSetBranch = node.id === 's' || node.id.startsWith('s/');

  // 目前節點底下的內容
  const uHere = useMemo(() => uList.filter((e) => inNode(e.leaf, node.id)), [uList, node.id]);
  const sHere = useMemo(() => sList.filter((e) => inNode(e.leaf, node.id)), [sList, node.id]);
  const leaves = useMemo(() => leavesOf(node).filter((l) => l.count > 0), [node]);
  const isLeaf = !node.children;
  const total = uHere.length + sHere.length;
  const dirMode = dir.isDir(isLeaf, total);

  // 分類磚的代表圖
  const repIcon = (n: TreeNode): CategoryTile['icon'] => {
    if (n.id === 's' || n.id.startsWith('s/')) {
      const s = S_ENTRIES.find((e) => inNode(e.leaf, n.id))?.set;
      const p = s?.pieces.find((x) => x.imageUrl) ?? s?.pieces[0];
      return { name: p?.name, nameEn: p?.nameEn, baseItem: p?.baseItem, slot: p?.slot, rarity: 'set', imageUrl: p?.imageUrl };
    }
    const pool = U_ENTRIES.filter((e) => inNode(e.leaf, n.id) && e.item.imageUrl);
    const want = REP_BY_REL[relOf(n.id)];
    const rep = (want && pool.find((e) => e.item.nameEn === want)) ||
      [...pool].sort((a, b) => b.item.requiredLevel - a.item.requiredLevel)[0] || U_ENTRIES.find((e) => inNode(e.leaf, n.id));
    const it = rep?.item;
    return { name: it?.name, nameEn: it?.nameEn, baseItem: it?.baseItem, slot: it?.slot, rarity: 'unique', imageUrl: it?.imageUrl };
  };
  // 最上層只有「暗金／套裝」兩顆磚太空曠，直接展開成第二層（品階、飾品、職業套裝、通用套裝）
  const tileNodes = node.id === 'all' ? tree.flatMap((t) => t.children ?? []) : node.children ?? [];
  const tiles: CategoryTile[] = tileNodes.filter((c) => c.count > 0).map((c) => ({
    id: c.id, label: c.label, labelEn: c.en, sub: c.en, subEn: c.en, count: c.count,
    tone: c.id === 's' || c.id.startsWith('s/') ? 'set' : 'unique',
    icon: repIcon(c),
  }));

  const labelPath = (leafId: string) => relPath(tree, leafId, node.id, isEn);

  const crumbs = crumbsOf(isEn ? 'All Equipment' : '全部裝備', tree, sel, isEn);
  const go = (id: string) => setSel(id);

  const flashCls = (id: string) => (dir.flash === id ? 'ring-2 ring-d2-unique rounded-xl transition-shadow' : '');

  const uniqueCard = (e: UEntry) => {
    const item = e.item;
    const aid = `item-${item.id}`;
    return (
      <div key={item.id} id={aid} className={`scroll-mt-20 ${flashCls(aid)}`}>
        <ItemTooltip
          layout="row"
          title={item.name}
          titleEn={item.nameEn}
          baseItem={item.baseItem}
          baseItemEn={item.baseItemEn}
          rarity="unique"
          requiredLevel={item.requiredLevel}
          requiredStr={item.requiredStr}
          requiredDex={item.requiredDex}
          attributes={item.attributes}
          flavorText={item.flavorText}
          onNavigateToBase={onNavigateToBase}
          imageUrl={item.imageUrl}
          badges={[
            // 飾品的 grade 只是資料裡的預設值，樹裡飾品不分品階，所以不顯示品階標籤
            ...(item.grade && !e.leaf.startsWith('u/jewelry/') ? [isEn ? (item.grade.charAt(0).toUpperCase() + item.grade.slice(1)) : (TIER_LABEL[item.grade] || item.grade)] : []),
            ...(item.classOnly ? [isEn ? `${CLASS_ZH_TO_EN[item.classOnly] || item.classOnly} Only` : `${item.classOnly}專用`] : []),
            ...(item.ladderOnly ? [isEn ? 'Ladder Only' : '天梯限定'] : []),
            ...(item.isNewDLC ? ['RotW DLC'] : []),
          ]}
          className="h-full hover:border-d2-unique"
        />
      </div>
    );
  };

  /** 目錄模式的單件：小圖 + 名稱 + 需求等級，點了進入該分類並捲到該件 */
  const uniqueChip = (e: UEntry) => {
    const item = e.item;
    return (
      <DirChip
        key={item.id}
        icon={<ItemIcon name={item.name} nameEn={item.nameEn} baseItem={item.baseItem} slot={item.slot} rarity="unique" size="sm" imageUrl={item.imageUrl} showBorder={false} />}
        title={isEn ? item.nameEn : item.name}
        sub={`Lv${item.requiredLevel} · ${isEn && item.baseItemEn ? item.baseItemEn : item.baseItem}${item.classOnly ? (isEn ? ` · ${CLASS_ZH_TO_EN[item.classOnly] || item.classOnly}` : ` · ${item.classOnly}`) : ''}`}
        hint={isEn ? `${item.nameEn} | ${item.baseItemEn || item.baseItem}` : `${item.name}（${item.nameEn}）｜${item.baseItem}`}
        onClick={() => dir.jump(`item-${item.id}`, e.leaf, go)}
      />
    );
  };

  const setChip = (r: SEntry) => {
    const p = r.set.pieces.find((x) => x.imageUrl) ?? r.set.pieces[0];
    return (
      <DirChip
        key={r.set.id}
        tone="set"
        icon={<ItemIcon name={p?.name} nameEn={p?.nameEn} baseItem={p?.baseItem} slot={p?.slot} rarity="set" size="sm" imageUrl={p?.imageUrl} showBorder={false} />}
        title={isEn ? r.set.nameEn : r.set.name}
        sub={isEn ? `${r.set.pieces.length} Pieces · Req Lv${r.minLv}${r.set.class ? ` · ${CLASS_ZH_TO_EN[r.set.class] || r.set.class}` : ''}` : `${r.set.pieces.length} 件 · Lv${r.minLv} 起${r.set.class ? ` · ${r.set.class}` : ''}`}
        hint={isEn ? r.set.nameEn : `${r.set.name}（${r.set.nameEn}）`}
        onClick={() => dir.jump(`set-${r.set.id}`, r.leaf, go)}
      />
    );
  };

  const setCard = (set: SetItemCollection) => (
    <div key={set.id} id={`set-${set.id}`} className={`bg-sanctuary-950 border border-d2-set/30 rounded-xl p-4 sm:p-5 shadow-xl scroll-mt-20 ${dir.flash === `set-${set.id}` ? 'ring-2 ring-d2-set' : ''}`}>
      {/* Set Header */}
      <div className="border-b border-sanctuary-800 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="font-diablo text-xl font-bold text-d2-set">{isEn && set.nameEn ? set.nameEn : set.name}</h4>
          <div className="text-xs text-sanctuary-400 font-mono italic">
            {isEn ? '' : (set.nameEn ? `${set.nameEn} • ` : '')}{isEn ? `${set.pieces.length} Pieces` : `${set.pieces.length} 件套裝`}{set.class ? ` • ${isEn ? `${CLASS_NAME_EN[set.class] || set.class} Only` : `${set.class}專用`}` : ''}
          </div>
        </div>
      </div>

      {/* Set Pieces Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {set.pieces.map((piece) => (
          <div key={piece.id} className="p-3 rounded-lg bg-sanctuary-900/60 border border-sanctuary-800 text-xs flex gap-3 items-start">
            <ItemIcon
              name={piece.name}
              nameEn={piece.nameEn}
              baseItem={piece.baseItem}
              slot={piece.slot}
              rarity="set"
              size="lg"
              imageUrl={piece.imageUrl}
            />
            <div className="flex-1 min-w-0">
              <div className="font-diablo font-bold text-d2-set text-sm">{isEn && piece.nameEn ? piece.nameEn : piece.name} {!isEn && piece.nameEn && <span className="font-sans text-xs text-sanctuary-400 font-normal">({piece.nameEn})</span>}</div>
              <div className="text-[11px] text-sanctuary-400 mb-2 font-medium">
                {onNavigateToBase ? (
                  <button
                    type="button"
                    onClick={() => onNavigateToBase(piece.baseItem)}
                    className="hover:text-d2-socket hover:underline cursor-pointer transition-colors inline-flex items-center gap-0.5"
                    title={isEn ? `Click to view base item guide` : `點擊查看【${piece.baseItem}】符文底材指南`}
                  >
                    <span>{isEn && piece.baseItemEn ? piece.baseItemEn : piece.baseItem}</span>
                    <span className="text-[9px] text-d2-socket">↗</span>
                  </button>
                ) : (
                  <span>{isEn && piece.baseItemEn ? piece.baseItemEn : piece.baseItem}</span>
                )}{' '}
                ({isEn ? 'Req Level:' : '需求等級:'} {piece.requiredLevel})
              </div>
              <div className="space-y-0.5 text-d2-magic">
                {piece.attributes.map((attr, i) => (
                  <div key={i}>• {attr}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Set Bonuses Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-sanctuary-900 border border-sanctuary-800 text-xs">
        <div>
          <div className="text-d2-set font-bold mb-1">{isEn ? 'Partial Set Bonuses:' : '部分套裝加成效果:'}</div>
          {set.partialBonuses.map((pb, idx) => (
            <div key={idx} className="text-sanctuary-300">({pb.count} {isEn ? 'Pieces' : '件'}) {pb.bonus}</div>
          ))}
        </div>
        <div>
          <div className="text-d2-set font-bold mb-1">{isEn ? 'Complete Set Bonuses:' : '完整全套套裝加成:'}</div>
          {set.fullBonuses.map((fb, idx) => (
            <div key={idx} className="text-d2-set font-medium">• {fb}</div>
          ))}
        </div>
      </div>
    </div>
  );

  const LIST_GRID = 'grid grid-cols-1 xl:grid-cols-2 gap-4';
  const CHIP_GRID = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2';

  /** 一個葉節點的暗金段落：目錄模式只列名稱小圖；詳細模式列完整卡片（咒符再依尺寸分段） */
  const uniqueSection = (leaf: TreeNode) => {
    const rows = uHere.filter((e) => e.leaf === leaf.id);
    if (rows.length === 0) return null;
    const secs: { key: string; label: string; rows: UEntry[] }[] = [];
    for (const e of rows) {
      let sec = secs.find((x) => x.key === e.sec);
      if (!sec) {
        sec = { key: e.sec, label: (isEn ? CHARM_LABEL_EN[e.sec] : CHARM_LABEL[e.sec]) ?? '', rows: [] };
        secs.push(sec);
      }
      sec.rows.push(e);
    }
    const showSecHeads = secs.some((x) => x.label);
    return (
      <section key={leaf.id} id={`sec-${leaf.id}`} className="mb-9 scroll-mt-20">
        <SectionHead
          title={isEn ? (leaf.en || leaf.label) : (isLeaf ? leaf.label : labelPath(leaf.id))}
          sub={isEn ? undefined : leaf.en}
          count={rows.length}
          tone="unique"
          onOpen={isLeaf ? undefined : () => go(leaf.id)}
          openLabel={isEn ? `Enter "${leaf.en || leaf.label}"` : `進入「${leaf.label}」`}
        />
        {!dirMode && showSecHeads && secs.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
            <span className="text-sanctuary-500">{isEn ? 'Jump to:' : '跳到：'}</span>
            {secs.map((x) => (
              <button
                key={x.key}
                type="button"
                onClick={() => document.getElementById(`sec-${leaf.id}-${x.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="px-2.5 py-1 rounded-full bg-sanctuary-900 border border-sanctuary-700 text-sanctuary-200 hover:border-d2-unique"
              >
                {x.label} <span className="font-mono text-sanctuary-500">{x.rows.length}</span>
              </button>
            ))}
          </div>
        )}
        {secs.map((x) => (
          <div key={x.key} id={`sec-${leaf.id}-${x.key}`} className="mb-5 last:mb-0 scroll-mt-20">
            {showSecHeads && x.label && (
              <SectionHead title={x.label} count={x.rows.length} tone="unique" level={3} />
            )}
            <div className={dirMode ? CHIP_GRID : LIST_GRID}>{x.rows.map(dirMode ? uniqueChip : uniqueCard)}</div>
          </div>
        ))}
      </section>
    );
  };

  const setSection = (leaf: TreeNode) => {
    const rows = sHere.filter((e) => e.leaf === leaf.id);
    if (rows.length === 0) return null;
    return (
      <section key={leaf.id} id={`sec-${leaf.id}`} className="mb-9 scroll-mt-20">
        <SectionHead
          title={isEn ? (leaf.en || leaf.label) : (isLeaf ? leaf.label : labelPath(leaf.id))}
          count={rows.length}
          tone="set"
          onOpen={isLeaf ? undefined : () => go(leaf.id)}
          openLabel={isEn ? `Enter "${leaf.en || leaf.label}"` : `進入「${leaf.label}」`}
        />
        {dirMode ? (
          <div className={CHIP_GRID}>{rows.map(setChip)}</div>
        ) : (
          <>
            {/* 套裝目錄：快速跳到該套裝 */}
            {rows.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
                <span className="text-sanctuary-500">{isEn ? 'Sets in section:' : '本段套裝：'}</span>
                {rows.map((r) => (
                  <button
                    key={r.set.id}
                    type="button"
                    onClick={() => document.getElementById(`set-${r.set.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="px-2.5 py-1 rounded-full bg-sanctuary-900 border border-sanctuary-700 text-d2-set hover:border-d2-set"
                  >
                    {isEn && r.set.nameEn ? r.set.nameEn : r.set.name} <span className="font-mono text-sanctuary-500">Lv{r.minLv}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="space-y-6">{rows.map((r) => setCard(r.set))}</div>
          </>
        )}
      </section>
    );
  };

  return (
    <div className="py-8 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={<Sword className="w-6 h-6" />}
        title={t('裝備寶典 (暗金 · 套裝 · 符文之語)', 'Equipment Codex (Uniques · Sets · Runewords)')}
        desc={t('收錄暗黑破壞神二代各部位指標性暗金裝備、全套套裝與經典符文之語，支援跨裝備特殊屬性（永不毀損、+全技能、全抗、MF 等）一鍵篩選。未選取特殊屬性時保留階層式分類樹。', 'Comprehensive codex of iconic Unique gear, complete Sets, and Runewords. Supports one-click cross-equipment filtering by key special properties (Indestructible, +All Skills, All Res, MF, etc.).')}
        right={
          <div className="text-xs text-sanctuary-400 font-mono px-3 py-1.5 rounded-lg bg-sanctuary-900 border border-sanctuary-800 self-start shrink-0 whitespace-nowrap">
            {isCrossPropertyMode
              ? (isEn ? `Matched: ${filteredCrossItems.length} (Uniques ${rarityCounts.unique} · Sets ${rarityCounts.set} · Runewords ${rarityCounts.runeword})` : `跨裝備符合: ${filteredCrossItems.length} (暗金 ${rarityCounts.unique} · 套裝 ${rarityCounts.set} · 符文組 ${rarityCounts.runeword})`)
              : (isEn ? `Uniques ${uHere.length} · Sets ${sHere.length}` : `暗金 ${uHere.length} ・ 套裝 ${sHere.length}`)}
          </div>
        }
      />

      <div className="relative mb-5">
        <Search className="w-4 h-4 text-sanctuary-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('搜尋暗金、套裝或符文之語名稱、底材或屬性 (例如：軍帽、獅鷲、塔拉夏、精神、謎團、SOJ...)；索引數量會即時對應', 'Search Uniques, Sets, Runewords, Bases, or Affixes (e.g. Shako, Griffon, Tal Rasha, Spirit, Enigma, SOJ...)')}
          className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded-lg pl-10 pr-4 py-2.5 text-sm text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-unique/60"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} aria-label={isEn ? "Clear search" : "清除搜尋"} className="absolute right-3 top-1/2 -translate-y-1/2 text-sanctuary-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 跨裝備特殊屬性篩選列：預設收合，讓樹狀索引在第一屏；有套用篩選時自動展開 */}
      <details
        className="mb-5 group"
        open={selectedPropertyIds.length > 0 || selectedRarity !== 'all' || selectedSlot !== 'all' || undefined}
      >
        <summary className="cursor-pointer select-none rounded-xl border border-sanctuary-800 bg-sanctuary-900/60 px-4 py-2.5 text-sm text-sanctuary-200 hover:border-sanctuary-600">
          {isEn ? 'Cross-item special property filter' : '跨裝備特殊屬性篩選（永不毀損、全技能、全抗、MF…）'}
          {(selectedPropertyIds.length > 0 || selectedRarity !== 'all' || selectedSlot !== 'all') && (
            <span className="ml-2 text-d2-unique">{isEn ? 'active' : '已套用'}</span>
          )}
        </summary>
        <div className="mt-3">
      <CrossPropertyFilterBar
        selectedPropertyIds={selectedPropertyIds}
        onToggleProperty={handleToggleProperty}
        selectedRarity={selectedRarity}
        onSelectRarity={setSelectedRarity}
        selectedSlot={selectedSlot}
        onSelectSlot={setSelectedSlot}
        onClearFilters={handleClearCrossFilters}
        totalHits={filteredCrossItems.length}
        propertyCounts={propertyCounts}
        rarityCounts={rarityCounts}
      />
        </div>
      </details>

      {isCrossPropertyMode ? (
        <div className="space-y-4">
          {/* 跨裝備檢索工具列 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-sanctuary-950/60 p-3 rounded-xl border border-sanctuary-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sanctuary-200">
                {isEn ? `Found ${filteredCrossItems.length} matching items` : `共找到 ${filteredCrossItems.length} 件符合條件的裝備`}
              </span>
              <span className="text-sanctuary-400">
                {isEn ? `(Uniques ${rarityCounts.unique} · Sets ${rarityCounts.set} · Runewords ${rarityCounts.runeword})` : `(暗金 ${rarityCounts.unique} · 套裝 ${rarityCounts.set} · 符文組 ${rarityCounts.runeword})`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearCrossFilters}
                className="px-2.5 py-1 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-800 text-sanctuary-300 border border-sanctuary-750 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-d2-unique" />
                <span>{t('返回分類樹', 'Back to Tree')}</span>
              </button>

              <div className="flex items-center gap-1 border-l border-sanctuary-800 pl-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-sanctuary-400" />
                <select
                  value={crossSortBy}
                  onChange={(e) => setCrossSortBy(e.target.value as any)}
                  className="bg-sanctuary-900 border border-sanctuary-750 rounded px-2 py-0.5 text-sanctuary-200 focus:outline-none"
                >
                  <option value="level-desc">{isEn ? 'Req Level (High to Low)' : '需求等級 (高至低)'}</option>
                  <option value="level-asc">{isEn ? 'Req Level (Low to High)' : '需求等級 (低至高)'}</option>
                  <option value="name">{isEn ? 'Name (A to Z)' : '名稱筆劃排序'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* 裝備卡片清單 */}
          {filteredCrossItems.length === 0 ? (
            <div className="p-12 text-center text-sanctuary-400 bg-sanctuary-900/40 rounded-xl border border-sanctuary-800 space-y-3">
              <div>{isEn ? 'No equipment found matching current filters.' : '查無同時符合目前特殊屬性、品質與部位的裝備。'}</div>
              <button
                type="button"
                onClick={handleClearCrossFilters}
                className="px-4 py-2 rounded-lg bg-sanctuary-800 border border-sanctuary-700 text-sm text-sanctuary-100 hover:border-d2-unique cursor-pointer"
              >
                {isEn ? 'Reset Property Filters' : '重置屬性篩選'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredCrossItems.map((item) => (
                <CrossItemCard
                  key={item.id}
                  item={item}
                  activePropertyDefs={activePropertyDefs}
                  onNavigateToBase={onNavigateToBase}
                  onNavigateToRune={onNavigateToRune}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <TreeIndex
          title={isEn ? "Item Index" : "裝備索引"}
          rootLabel={isEn ? "All Equipment" : "全部裝備"}
          rootCount={root.count}
          nodes={tree}
          activeId={node.id}
          onSelect={go}
          tone={isSetBranch ? 'set' : 'unique'}
        >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Crumbs crumbs={crumbs} onSelect={go} tone={isSetBranch ? 'set' : 'unique'} />
            {!isLeaf && total > 0 && <ViewToggle dir={dirMode} onChange={dir.setView} />}
          </div>

          {tiles.length > 0 && (
            <CategoryTiles
              tiles={tiles}
              activeId={null}
              onSelect={go}
              iconSize="lg"
              className={
                tiles.length <= 3 ? 'grid-cols-2 sm:grid-cols-3'
                  : tiles.length === 4 ? 'grid-cols-2 sm:grid-cols-4'
                  : tiles.length === 5 ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5'
                  : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-6'
              }
            />
          )}

          {total === 0 ? (
            <div className="p-12 text-center text-sanctuary-400 bg-sanctuary-900/40 rounded-xl border border-sanctuary-800 space-y-3">
              <div>
                {q && root.count > 0
                  ? (isEn ? `No equipment matching "${q}" in "${node.en || node.label}", but ${root.count} items match in other categories.` : `「${node.label}」底下沒有符合「${q}」的裝備，但其他分類共有 ${root.count} 件符合，請看分類索引的數量。`)
                  : (isEn ? 'No equipment found matching current criteria.' : '查無符合目前條件的裝備，請更換分類或清除搜尋關鍵字。')}
              </div>
              {q && root.count > 0 && node.id !== 'all' && (
                <button type="button" onClick={() => go('all')} className="px-4 py-2 rounded-lg bg-sanctuary-800 border border-sanctuary-700 text-sm text-sanctuary-100 hover:border-d2-unique">
                  {isEn ? 'Back to "All Equipment"' : '回到「全部裝備」'}
                </button>
              )}
            </div>
          ) : (
            <div>
              {leaves.map((l) => (l.id.startsWith('s/') ? setSection(l) : uniqueSection(l)))}
            </div>
          )}
        </div>
        </TreeIndex>
      )}
    </div>
  );
};
