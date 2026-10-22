import React, { useState, useMemo } from 'react';
import { BASE_ITEMS_DATA, BaseItemData } from '../../data/bases';
import { ItemIcon } from '../common/ItemIcon';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import { PageHeader } from '../common/PageHeader';
import { TreeIndex, Crumbs, SectionHead, DirChip, ViewToggle, crumbsOf, useDirectory } from '../common/TreeIndex';
import {
  TaxDef, TierKey, TIER_LABEL, DEFAULT_TIER, TreeNode,
  buildTree, recount, findNode, leavesOf, tierDefs, inNode, relPath, leafOfBase, resolveGameBase, tierOfBase,
} from '../../utils/equipTaxonomy';
import { 
  ShieldAlert, 
  Search, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Zap, 
  HelpCircle,
  Gem
} from 'lucide-react';

export interface BaseItemGuideProps {
  initialQuery?: string;
  onNavigateToRuneword?: (runewordName: string) => void;
}

const hasDmg = (v?: string) => !!v && v !== '-';
const isShield = (i: BaseItemData) => i.category === 'armor' && i.name.includes('盾');

// ------------------------------------------------------------
// 分類樹：品階（普通／卓越／精英）→ 部位 → 類型。終局都停在精英，普通與卓越只在前期拓荒用到
// ------------------------------------------------------------
const TREE_DEFS: TaxDef[] = tierDefs('b');

interface BEntry { item: BaseItemData; leaf: string; tier: TierKey }

const B_ENTRIES: BEntry[] = BASE_ITEMS_DATA.map((item) => {
  const gb = resolveGameBase({ id: item.id, nameEn: item.nameEn, name: item.name });
  const tier = tierOfBase(gb, item.grade);
  const rel = leafOfBase(gb) ?? (isShield(item) ? 'armor/shield/shie' : item.category === 'armor' ? 'armor/body' : 'weapon/melee/swor');
  return { item, leaf: `b/${tier}/${rel}`, tier };
}).sort((a, b) => a.item.requiredLevel - b.item.requiredLevel || a.item.reqStr - b.item.reqStr || a.item.name.localeCompare(b.item.name, 'zh-Hant'));

/** 分類磚的代表底材（以去掉品階後的相對路徑查；該節點內沒有這件時改用節點內最高需求等級者） */
const REP_BASE_REL: Record<string, string> = {
  '': 'Archon Plate', armor: 'Archon Plate', 'armor/body': 'Archon Plate', 'armor/head': 'Shako', 'armor/shield': 'Monarch',
  weapon: 'Phase Blade', 'weapon/melee': 'Phase Blade', 'weapon/polearm': 'Thresher', 'weapon/ranged': 'Hydra Bow',
  'weapon/caster': 'Archon Staff', 'weapon/class': 'Runic Talons',
};
const relOf = (id: string) => id.replace(/^b\/(normal|exceptional|elite)\/?/, '');

type Hand = 'all' | '1h' | '2h';

export const BaseItemGuide: React.FC<BaseItemGuideProps> = ({
  initialQuery = "",
  onNavigateToRuneword,
}) => {
  const [sel, setSel] = useState<string>(`b/${DEFAULT_TIER}`);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [filterEthOnly, setFilterEthOnly] = useState<boolean>(false);
  const [filterSuperiorOnly, setFilterSuperiorOnly] = useState<boolean>(false);
  const [hand, setHand] = useState<Hand>('all');

  // Sync initialQuery when prop changes
  React.useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
      if (initialQuery) setSel('all');
    }
  }, [initialQuery]);

  const q = searchQuery.trim();
  const dir = useDirectory(sel, `${q}|${hand}|${filterEthOnly}|${filterSuperiorOnly}`);

  const filtered = useMemo(() => B_ENTRIES.filter(({ item }) => {
    // 握持：只看單手／雙手時僅列武器（與舊版「單手武器／雙手武器」分類磚相同）
    if (hand === '1h' && !(item.category === 'weapon' && hasDmg(item.damage1h))) return false;
    if (hand === '2h' && !(item.category === 'weapon' && hasDmg(item.damage2h))) return false;
    if (filterEthOnly && !item.isEthPreferred) return false;
    if (filterSuperiorOnly && !item.isSuperiorValued) return false;
    if (q) {
      const t = q.toLowerCase();
      const matchName = item.name.toLowerCase().includes(t) || item.nameEn.toLowerCase().includes(t);
      const matchType = (item.itemType || '').toLowerCase().includes(t);
      const matchRW = (item.recommendedRunewords || []).some((rw: string) => rw.toLowerCase().includes(t));
      const matchNotes = (item.tacticalNotes || '').toLowerCase().includes(t);
      if (!matchName && !matchType && !matchRW && !matchNotes) return false;
    }
    return true;
  }), [q, hand, filterEthOnly, filterSuperiorOnly]);

  // 樹的結構固定，數量隨篩選與搜尋即時變動
  const baseTree = useMemo(() => {
    const counts = new Map<string, number>();
    B_ENTRIES.forEach((e) => counts.set(e.leaf, (counts.get(e.leaf) ?? 0) + 1));
    return buildTree(TREE_DEFS, counts);
  }, []);
  const tree = useMemo(() => {
    const counts = new Map<string, number>();
    filtered.forEach((e) => counts.set(e.leaf, (counts.get(e.leaf) ?? 0) + 1));
    return recount(baseTree, counts);
  }, [baseTree, filtered]);
  const root: TreeNode = useMemo(() => ({ id: 'all', label: '全部底材', count: filtered.length, children: tree }), [tree, filtered.length]);
  const node = sel === 'all' ? root : findNode(tree, sel) ?? root;
  // 目前節點一筆都沒有、但別處有符合（搜尋或篩選的結果落在別的分類）時，自動放寬到全部
  React.useEffect(() => {
    if (node.id !== 'all' && node.count === 0 && root.count > 0) setSel('all');
  }, [node.id, node.count, root.count]);

  const here = useMemo(() => filtered.filter((e) => inNode(e.leaf, node.id)), [filtered, node.id]);
  const leaves = useMemo(() => leavesOf(node).filter((l) => l.count > 0), [node]);
  const isLeaf = !node.children;
  const dirMode = dir.isDir(isLeaf, here.length);
  const go = (id: string) => setSel(id);
  const crumbs = crumbsOf('全部底材', tree, sel);

  const repIcon = (n: TreeNode): CategoryTile['icon'] => {
    const pool = B_ENTRIES.filter((e) => inNode(e.leaf, n.id) && e.item.imageUrl);
    const want = REP_BASE_REL[relOf(n.id)];
    const rep = (want && pool.find((e) => e.item.nameEn === want)) ||
      [...pool].sort((a, b) => b.item.requiredLevel - a.item.requiredLevel)[0] || B_ENTRIES.find((e) => inNode(e.leaf, n.id));
    const i = rep?.item;
    return { name: i?.name, nameEn: i?.nameEn, baseItem: i?.name, rarity: 'normal', imageUrl: i?.imageUrl };
  };
  const tiles: CategoryTile[] = (node.children ?? []).filter((c) => c.count > 0).map((c) => ({
    id: c.id, label: c.label, sub: c.en, count: c.count, tone: 'unique', icon: repIcon(c),
  }));

  const labelPath = (leafId: string) => relPath(tree, leafId, node.id);

  const baseCard = ({ item }: BEntry) => (
          <div
            key={item.id}
            id={`base-${item.id}`}
            className={`bg-sanctuary-900/80 border border-sanctuary-800 rounded-2xl p-5 flex flex-col justify-between hover:border-sanctuary-700 transition-all duration-200 space-y-4 group shadow-xl scroll-mt-20 ${dir.flash === `base-${item.id}` ? 'ring-2 ring-d2-socket' : ''}`}
          >
            {/* 卡片頭部 */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <ItemIcon
                  name={item.name}
                  nameEn={item.nameEn}
                  baseItem={item.name}
                  slot={isShield(item) ? 'shield' : item.category === 'armor' ? 'armor' : 'weapon'}
                  rarity="normal"
                  size="lg"
                  imageUrl={item.imageUrl}
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div>
                    <h3 className="text-lg font-diablo font-bold text-sanctuary-100 group-hover:text-d2-socket transition-colors leading-tight break-words">
                      {item.name}
                    </h3>
                    <div className="text-xs font-mono text-sanctuary-400 break-words">
                      {item.nameEn}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-sanctuary-400">
                    <span className="px-1.5 py-0.5 rounded bg-sanctuary-800 text-sanctuary-300">
                      {item.category === 'weapon' ? '武器' : '防具'} · {item.itemType}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-d2-gold/10 text-d2-gold border border-d2-gold/20 whitespace-nowrap">
                      {TIER_LABEL[item.grade as TierKey] ?? item.qualityTier}品階
                    </span>
                    {/* 最大孔數徽章 */}
                    <span className="px-2 py-0.5 rounded-lg bg-sanctuary-800/90 border border-sanctuary-700 text-d2-socket font-bold whitespace-nowrap">
                      最多 {item.maxSockets} 孔
                    </span>
                  </div>
                </div>
              </div>

              {/* 核心屬性網格 */}
              <div className="grid grid-cols-2 gap-2 bg-sanctuary-950/70 p-3 rounded-xl border border-sanctuary-800/80 text-xs font-mono">
                <div>
                  <span className="text-sanctuary-500">需求: </span>
                  <span className="text-sanctuary-200 font-bold">
                    {item.reqStr > 0 ? `${item.reqStr} 力量` : "無力需"}
                    {item.reqDex > 0 ? ` / ${item.reqDex} 敏捷` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-sanctuary-500">拉蘇克打孔: </span>
                  <span className="text-d2-gold font-bold">{item.larzukSockets} 孔</span>
                </div>
                {item.baseDamage && (
                  <div>
                    <span className="text-sanctuary-500">基礎傷害: </span>
                    <span className="text-amber-300">{item.baseDamage}</span>
                  </div>
                )}
                {item.baseDefense && (
                  <div>
                    <span className="text-sanctuary-500">基礎防禦: </span>
                    <span className="text-sky-300">{item.baseDefense}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-sanctuary-500">攻速基準 (WSM): </span>
                  <span className="text-sanctuary-200">{item.speedGrade}</span>
                </div>
              </div>
            </div>

            {/* 推薦符文之語 */}
            {item.recommendedRunewords && item.recommendedRunewords.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-sanctuary-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-d2-gold" />
                  推薦頂級符文之語:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.recommendedRunewords.map((rw: string) => {
                    const rwCleanName = rw.split(' ')[0];
                    return (
                      <button
                        key={rw}
                        type="button"
                        onClick={() => onNavigateToRuneword?.(rwCleanName)}
                        className="group/rw px-2 py-0.5 rounded-lg bg-sanctuary-800 hover:bg-sanctuary-750 border border-sanctuary-750 hover:border-d2-gold text-[11px] font-mono text-d2-gold hover:text-white transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:scale-105"
                        title={`點擊查看【${rw}】完整組成符文與屬性`}
                      >
                        <span>{rw}</span>
                        <span className="text-[9px] text-d2-gold/60 group-hover/rw:text-d2-gold">↗</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 戰術圖說與評析 */}
            {item.tacticalNotes && (
              <div className="bg-sanctuary-950/90 p-3 rounded-xl border border-sanctuary-800/90 space-y-2 text-xs">
                <div className="flex items-center gap-1 text-[11px] font-mono text-d2-socket font-bold">
                  <Zap className="w-3.5 h-3.5 text-d2-socket" />
                  打寶與戰術圖說
                </div>
                <p className="text-sanctuary-300 leading-relaxed text-[11px]">
                  {item.tacticalNotes}
                </p>
                {item.dropRecommendation && (
                  <div className="text-[10px] text-sanctuary-400 pt-1 border-t border-sanctuary-800/60 font-mono">
                    <span className="text-sanctuary-500">掉落地點: </span>
                    {item.dropRecommendation}
                  </div>
                )}
              </div>
            )}

            {/* 底部特性標籤 */}
            <div className="flex items-center justify-between pt-1 border-t border-sanctuary-800/60 text-[11px] font-mono">
              <span className={`flex items-center gap-1 ${item.isEthPreferred ? 'text-d2-cold font-bold' : 'text-sanctuary-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.isEthPreferred ? "推薦無形 (Ethereal)" : "自穿非無形"}
              </span>

              <span className={`flex items-center gap-1 ${item.isSuperiorValued ? 'text-d2-gold font-bold' : 'text-sanctuary-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.isSuperiorValued ? "特等的 15%ED 天價" : "普通白板即可"}
              </span>
            </div>
          </div>
  );

  const baseChip = (e: BEntry) => (
    <DirChip
      key={e.item.id}
      tone="socket"
      icon={<ItemIcon name={e.item.name} nameEn={e.item.nameEn} baseItem={e.item.name} slot={isShield(e.item) ? 'shield' : e.item.category === 'armor' ? 'armor' : 'weapon'} rarity="normal" size="sm" imageUrl={e.item.imageUrl} showBorder={false} />}
      title={e.item.name}
      sub={`最多 ${e.item.maxSockets} 孔 · ${e.item.reqStr > 0 ? `力 ${e.item.reqStr}` : '無力需'}`}
      hint={`${e.item.name}（${e.item.nameEn}）`}
      onClick={() => dir.jump(`base-${e.item.id}`, e.leaf, go)}
    />
  );

  const section = (leaf: TreeNode) => {
    const rows = here.filter((e) => e.leaf === leaf.id);
    if (rows.length === 0) return null;
    return (
      <section key={leaf.id} id={`sec-${leaf.id}`} className="mb-9 scroll-mt-20">
        <SectionHead
          title={isLeaf ? leaf.label : labelPath(leaf.id)}
          sub={leaf.en}
          count={rows.length}
          tone="socket"
          onOpen={isLeaf ? undefined : () => go(leaf.id)}
          openLabel={`進入「${leaf.label}」`}
        />
        {dirMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">{rows.map(baseChip)}</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">{rows.map(baseCard)}</div>
        )}
      </section>
    );
  };

  const handOpts: { id: Hand; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: '1h', label: '單手' },
    { id: '2h', label: '雙手' },
  ];

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <PageHeader
        icon={<ShieldAlert className="w-6 h-6" />}
        tone="text-d2-socket"
        title="頂級符文之語底材與打孔寶典"
        desc="收錄悔恨幻化之刃、法師鎧甲謎團、無形銳利無限、神聖小盾精神等全職業 S 級畢業底材，提供 WSM 攻速、最大孔數、拉蘇克固定打孔機制與打寶估價戰術解析。依「普通／卓越／精英 → 部位 → 類型」分層，終局都停在精英，所以預設就看精英。"
        right={
          <div className="flex items-center gap-3 bg-sanctuary-900/80 p-2.5 rounded-2xl border border-sanctuary-800 shrink-0 self-start">
            <div className="text-right px-3 border-r border-sanctuary-800">
              <div className="text-[10px] text-sanctuary-400 font-mono">收錄經典底材</div>
              <div className="text-xl font-bold font-mono text-d2-socket">{BASE_ITEMS_DATA.length} 款</div>
            </div>
            <div className="text-right px-3">
              <div className="text-[10px] text-sanctuary-400 font-mono">符合條件</div>
              <div className="text-xl font-bold font-mono text-d2-gold">{filtered.length} 款</div>
            </div>
          </div>
        }
      />

      {/* 篩選與搜尋列 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* 握持（僅武器） */}
        <div className="flex items-center gap-1.5 bg-sanctuary-900/80 p-1.5 rounded-2xl border border-sanctuary-800 overflow-x-auto no-scrollbar">
          <span className="pl-2 pr-1 text-[11px] text-sanctuary-500 whitespace-nowrap">握持（僅武器）</span>
          {handOpts.map((o) => (
            <button
              key={o.id}
              onClick={() => setHand(o.id)}
              aria-pressed={hand === o.id}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                hand === o.id
                  ? 'bg-d2-socket text-sanctuary-950 font-bold shadow-md shadow-d2-socket/20'
                  : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-800/60'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* 快速開關與搜尋 */}
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
          <button
            onClick={() => setFilterEthOnly(!filterEthOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border flex items-center gap-1.5 shrink-0 ${
              filterEthOnly
                ? 'bg-sanctuary-800 border-d2-cold text-d2-cold font-bold'
                : 'bg-sanctuary-900 border-sanctuary-800 text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            偏好無形 (Eth)
          </button>

          <button
            onClick={() => setFilterSuperiorOnly(!filterSuperiorOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all border flex items-center gap-1.5 shrink-0 ${
              filterSuperiorOnly
                ? 'bg-sanctuary-800 border-d2-gold text-d2-gold font-bold'
                : 'bg-sanctuary-900 border-sanctuary-800 text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            特等的 15%ED 尊貴
          </button>

          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sanctuary-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋底材、英文名或推薦符文 (如: 悔恨、謎團)..."
              className="w-full bg-sanctuary-900 border border-sanctuary-800 rounded-xl pl-9 pr-4 py-2 text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-socket transition-colors"
            />
          </div>
        </div>
      </div>

      <TreeIndex title="底材索引" rootLabel="全部底材" rootCount={root.count} nodes={tree} activeId={node.id} onSelect={go} tone="socket" initialOpen="none">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Crumbs crumbs={crumbs} onSelect={go} tone="socket" />
            {!isLeaf && here.length > 0 && <ViewToggle dir={dirMode} onChange={dir.setView} />}
          </div>

          {tiles.length > 0 && (
            <CategoryTiles
              tiles={tiles}
              activeId={null}
              onSelect={go}
              iconSize="lg"
              className={tiles.length <= 3 ? 'grid-cols-2 sm:grid-cols-3' : tiles.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5'}
            />
          )}

          {here.length === 0 ? (
            <div className="text-center py-16 bg-sanctuary-900/40 rounded-2xl border border-sanctuary-800 space-y-3">
              <HelpCircle className="w-10 h-10 text-sanctuary-600 mx-auto" />
              <h3 className="text-lg font-diablo text-sanctuary-300">未找到符合條件的底材</h3>
              <p className="text-xs text-sanctuary-500">
                {root.count > 0 && node.id !== 'all' ? `「${node.label}」底下沒有符合的底材，其他分類共 ${root.count} 款符合，請看分類索引的數量。` : '請嘗試調整分類或清除搜尋關鍵字'}
              </p>
              {root.count > 0 && node.id !== 'all' && (
                <button type="button" onClick={() => go('all')} className="px-4 py-2 rounded-lg bg-sanctuary-800 border border-sanctuary-700 text-sm text-sanctuary-100 hover:border-d2-socket">
                  回到「全部底材」
                </button>
              )}
            </div>
          ) : (
            <div>{leaves.map(section)}</div>
          )}
        </div>
      </TreeIndex>
    </div>
  );
};
