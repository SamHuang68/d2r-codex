import React, { useState, useMemo } from 'react';
import { HolyGrailState } from '../../types';
import { loadHolyGrailState, saveHolyGrailState, exportAllUserData, importUserData } from '../../utils/storage';
import { ItemIcon } from '../common/ItemIcon';
import { TreeIndex, Crumbs, SectionHead, crumbsOf } from '../common/TreeIndex';
import { TreeNode, buildTree, recount, findNode, leavesOf, inNode, relPath } from '../../utils/equipTaxonomy';
import { ITEM_TREE_DEFS, CHARM_LABEL, U_ENTRIES, S_ENTRIES } from '../../utils/itemIndex';
import { Trophy, CheckCircle2, Circle, Download, Upload, Sparkles } from 'lucide-react';

const TC87_IDENTIFIERS = [
  "tyraels_might",
  "templars_might",
  "windforce",
  "deaths_web",
  "griffons_eye",
  "deaths_fathom",
  "shadow_dancer",
  "mang_songs_lesson",
  "astreons_iron_ward",
  "the_grandfather",
  "crown_of_ages",
  "executioners_justice",
  "deathcleaver",
  "stormspire",
  "steel_pillar",
  "cranial_basher",
  "earth_shifter",
  "the_reapers_toll"
];

export const HolyGrailTracker: React.FC = () => {
  const [grailState, setGrailState] = useState<HolyGrailState>(loadHolyGrailState());
  const [filterMode, setFilterMode] = useState<'all' | 'missing' | 'obtained' | 'tc87'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sel, setSel] = useState<string>('all');

  // Collect all grail items（與裝備寶典共用同一份分類索引：品階 → 部位 → 類型；套裝依職業／等級再依套裝分組）
  const allGrailItems = useMemo(() => {
    const list: {
      id: string;
      name: string;
      nameEn: string;
      category: string;
      slot: string;
      isSet: boolean;
      isTC87: boolean;
      imageUrl?: string;
      leaf: string;
      /** 同一段內的小標（護身符尺寸、套裝名稱）；沒有則為空字串 */
      group: string;
    }[] = [];

    // Unique Items
    U_ENTRIES.forEach(({ item, leaf, sec }) => {
      const isTC87 = TC87_IDENTIFIERS.includes(item.id) || 
        item.name.includes("泰瑞爾") || 
        item.name.includes("風之力") || 
        item.name.includes("死亡之網") || 
        item.name.includes("獅鷲之眼") || 
        item.name.includes("死亡深度") || 
        item.name.includes("歲月之冠") || 
        item.name.includes("高祖");

      list.push({
        id: item.id,
        name: item.name,
        nameEn: item.nameEn,
        category: item.baseItem,
        slot: item.slot,
        isSet: false,
        isTC87,
        imageUrl: item.imageUrl,
        leaf,
        group: CHARM_LABEL[sec] ?? '',
      });
    });

    // Set Items
    S_ENTRIES.forEach(({ set, leaf }) => {
      set.pieces.forEach((piece) => {
        list.push({
          id: piece.id,
          name: piece.name,
          nameEn: piece.nameEn,
          category: piece.baseItem,
          slot: piece.slot,
          isSet: true,
          isTC87: false,
          imageUrl: piece.imageUrl,
          leaf,
          group: set.name,
        });
      });
    });

    return list;
  }, []);

  // Save changes
  const toggleObtained = (id: string) => {
    setGrailState((prev) => {
      const nextObtained = { ...prev.obtainedItemIds };
      if (nextObtained[id]) {
        delete nextObtained[id];
      } else {
        nextObtained[id] = true;
      }
      const updated = { ...prev, obtainedItemIds: nextObtained };
      saveHolyGrailState(updated);
      return updated;
    });
  };

  const toggleEthereal = (id: string) => {
    setGrailState((prev) => {
      const nextEth = { ...prev.etherealItemIds };
      if (nextEth[id]) {
        delete nextEth[id];
      } else {
        nextEth[id] = true;
      }
      const updated = { ...prev, etherealItemIds: nextEth };
      saveHolyGrailState(updated);
      return updated;
    });
  };

  // Stats calculation
  const totalCount = allGrailItems.length;
  const obtainedCount = Object.keys(grailState.obtainedItemIds).length;
  const ethCount = Object.keys(grailState.etherealItemIds).length;
  const progressPercent = totalCount > 0 ? ((obtainedCount / totalCount) * 100).toFixed(1) : '0';

  // TC87 Stats
  const tc87Items = useMemo(() => allGrailItems.filter(i => i.isTC87), [allGrailItems]);
  const tc87Obtained = useMemo(() => tc87Items.filter(i => Boolean(grailState.obtainedItemIds[i.id])).length, [tc87Items, grailState]);

  // Slot Breakdown Stats
  const slotStats = useMemo(() => {
    const slots = [
      { id: 'weapon', label: '武器類' },
      { id: 'armor', label: '衣服護甲' },
      { id: 'helm', label: '頭部頭盔' },
      { id: 'shield', label: '盾牌類' },
      { id: 'jewelry', label: '首飾護符' },
      { id: 'set', label: '綠色套裝' },
    ];

    return slots.map(slot => {
      let filtered = allGrailItems;
      if (slot.id === 'set') {
        filtered = allGrailItems.filter(i => i.isSet);
      } else if (slot.id === 'jewelry') {
        filtered = allGrailItems.filter(i => !i.isSet && ['ring', 'amulet', 'charm', 'jewel'].includes(i.slot));
      } else {
        filtered = allGrailItems.filter(i => !i.isSet && i.slot === slot.id);
      }

      const total = filtered.length;
      const obtained = filtered.filter(i => Boolean(grailState.obtainedItemIds[i.id])).length;
      const pct = total > 0 ? Math.round((obtained / total) * 100) : 0;

      return {
        ...slot,
        total,
        obtained,
        pct
      };
    });
  }, [allGrailItems, grailState]);

  // Filter items
  const displayedItems = useMemo(() => {
    return allGrailItems.filter((item) => {
      const isObtained = Boolean(grailState.obtainedItemIds[item.id]);

      if (filterMode === 'missing' && isObtained) return false;
      if (filterMode === 'obtained' && !isObtained) return false;
      if (filterMode === 'tc87' && !item.isTC87) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q) || item.nameEn.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }

      return true;
    });
  }, [allGrailItems, grailState, filterMode, searchQuery]);

  // 分類樹：結構固定，數量隨篩選與搜尋即時變動；各段標題另外顯示不受篩選影響的收集進度
  const baseTree = useMemo(() => {
    const counts = new Map<string, number>();
    allGrailItems.forEach((i) => counts.set(i.leaf, (counts.get(i.leaf) ?? 0) + 1));
    return buildTree(ITEM_TREE_DEFS, counts);
  }, [allGrailItems]);
  const tree = useMemo(() => {
    const counts = new Map<string, number>();
    displayedItems.forEach((i) => counts.set(i.leaf, (counts.get(i.leaf) ?? 0) + 1));
    return recount(baseTree, counts);
  }, [baseTree, displayedItems]);
  const root: TreeNode = useMemo(() => ({ id: 'all', label: '全部聖杯', count: displayedItems.length, children: tree }), [tree, displayedItems.length]);
  const node = sel === 'all' ? root : findNode(tree, sel) ?? root;
  // 目前節點一筆都沒有、但別處有符合（搜尋或篩選的結果落在別的分類）時，自動放寬到全部
  React.useEffect(() => {
    if (node.id !== 'all' && node.count === 0 && root.count > 0) setSel('all');
  }, [node.id, node.count, root.count]);
  const isLeaf = !node.children;
  const leaves = useMemo(() => leavesOf(node).filter((l) => l.count > 0), [node]);
  const progressOf = (nodeId: string) => {
    const all = allGrailItems.filter((i) => inNode(i.leaf, nodeId));
    return { done: all.filter((i) => grailState.obtainedItemIds[i.id]).length, total: all.length };
  };
  const nodeProgress = progressOf(node.id);
  const crumbs = crumbsOf('全部聖杯', tree, sel);

  // Export JSON
  const handleExport = () => {
    const json = exportAllUserData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `d2r-sanctuary-grail-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importUserData(content);
        if (success) {
          setGrailState(loadHolyGrailState());
          alert('打寶進度備份成功還原！');
        } else {
          alert('還原失敗：檔案格式不正確。');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="py-8 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sanctuary-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-d2-gold text-xs font-mono tracking-widest uppercase">
            <Trophy className="w-4 h-4 text-d2-gold animate-pulse" />
            Diablo II: Resurrected Holy Grail Checklist
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            暗黑聖杯挑戰進度追蹤 (Holy Grail Tracker)
          </h1>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1 max-w-2xl">
            純本地無痕紀錄遊戲內全數暗金與成套套裝掉落，挑戰 100% 圓滿收藏！支援 TC87 殿堂神物專屬篩選與分類進度分析。
          </p>
        </div>

        {/* Export / Import Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs shrink-0">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-sanctuary-300 hover:text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯出備份 JSON</span>
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-sanctuary-300 hover:text-white cursor-pointer transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>匯入進度</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Progress Dashboard */}
      <div className="p-6 rounded-3xl bg-sanctuary-950 border border-sanctuary-800 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-sanctuary-400 font-medium">總體聖杯收集完成率</div>
            <div className="font-diablo text-4xl font-black text-d2-gold mt-1 flex items-baseline gap-2">
              <span>{progressPercent}%</span>
              <span className="text-xs font-mono font-normal text-sanctuary-500">
                ({obtainedCount} / {totalCount} 件)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="text-center px-3 py-2 rounded-xl bg-sanctuary-900/80 border border-sanctuary-800">
              <div className="text-sanctuary-400 text-[10px]">TC87 殿堂級神物</div>
              <div className="text-amber-400 font-bold text-sm mt-0.5">{tc87Obtained} / {tc87Items.length}</div>
            </div>
            <div className="text-center px-3 py-2 rounded-xl bg-sanctuary-900/80 border border-sanctuary-800">
              <div className="text-sanctuary-400 text-[10px]">尚缺件數</div>
              <div className="text-d2-fire font-bold text-sm mt-0.5">{totalCount - obtainedCount} 件</div>
            </div>
            <div className="text-center px-3 py-2 rounded-xl bg-sanctuary-900/80 border border-sanctuary-800">
              <div className="text-sanctuary-400 text-[10px]">無形 (ETH) 收藏</div>
              <div className="text-cyan-400 font-bold text-sm mt-0.5">{ethCount} 件</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 rounded-full bg-sanctuary-900 overflow-hidden border border-sanctuary-800">
          <div
            className="h-full bg-gradient-to-r from-d2-fire via-d2-gold to-d2-set transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Category Breakdown Progress Mini-Cards */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {slotStats.map((slot) => (
            <div
              key={slot.id}
              className="bg-sanctuary-900/50 p-2.5 rounded-xl border border-sanctuary-800/80 space-y-1.5"
            >
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-sanctuary-300 font-medium">{slot.label}</span>
                <span className="text-d2-gold font-bold">{slot.pct}%</span>
              </div>
              <div className="w-full h-1.5 bg-sanctuary-950 rounded-full overflow-hidden border border-sanctuary-800">
                <div
                  className="h-full bg-d2-gold/80 transition-all duration-300"
                  style={{ width: `${slot.pct}%` }}
                />
              </div>
              <div className="text-[10px] text-sanctuary-500 font-mono text-right">
                {slot.obtained}/{slot.total}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜尋聖杯清單裝備名稱、英文或底材..."
          className="w-full sm:w-80 bg-sanctuary-950 border border-sanctuary-800 rounded-xl px-4 py-2 text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-gold"
        />

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sanctuary-900 border border-sanctuary-800 self-stretch sm:self-auto text-xs justify-center flex-wrap">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterMode === 'all' ? 'bg-sanctuary-800 text-d2-gold font-bold shadow' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            全部 ({allGrailItems.length})
          </button>
          <button
            onClick={() => setFilterMode('tc87')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              filterMode === 'tc87' ? 'bg-amber-400 text-sanctuary-950 font-bold shadow' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>TC87 殿堂 ({tc87Items.length})</span>
          </button>
          <button
            onClick={() => setFilterMode('missing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterMode === 'missing' ? 'bg-sanctuary-800 text-d2-fire font-bold shadow' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            未獲得 ({totalCount - obtainedCount})
          </button>
          <button
            onClick={() => setFilterMode('obtained')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterMode === 'obtained' ? 'bg-sanctuary-800 text-d2-set font-bold shadow' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            已收集 ({obtainedCount})
          </button>
        </div>
      </div>

      {/* Items Checklist：樹狀索引 + 依分類分段的清單 */}
      <TreeIndex title="聖杯索引" rootLabel="全部聖杯" rootCount={root.count} nodes={tree} activeId={node.id} onSelect={setSel} tone="unique">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Crumbs crumbs={crumbs} onSelect={setSel} />
            <div className="text-xs font-mono text-sanctuary-400">
              本層進度 <span className="text-d2-gold font-bold">{nodeProgress.done} / {nodeProgress.total}</span>
              {nodeProgress.total > 0 && <span className="ml-1">（{Math.round((nodeProgress.done / nodeProgress.total) * 100)}%）</span>}
            </div>
          </div>

          {displayedItems.filter((i) => inNode(i.leaf, node.id)).length === 0 ? (
            <div className="p-12 text-center text-sanctuary-400 bg-sanctuary-900/40 rounded-xl border border-sanctuary-800 space-y-3">
              <div>
                {root.count > 0 && node.id !== 'all'
                  ? `「${node.label}」底下沒有符合目前篩選的項目，其他分類共 ${root.count} 件符合，請看分類索引的數量。`
                  : '沒有符合目前條件的項目。'}
              </div>
              {root.count > 0 && node.id !== 'all' && (
                <button type="button" onClick={() => setSel('all')} className="px-4 py-2 rounded-lg bg-sanctuary-800 border border-sanctuary-700 text-sm text-sanctuary-100 hover:border-d2-gold">
                  回到「全部聖杯」
                </button>
              )}
            </div>
          ) : (
            leaves.map((leaf) => {
              const rows = displayedItems.filter((i) => i.leaf === leaf.id);
              if (rows.length === 0) return null;
              const prog = progressOf(leaf.id);
              const groups: { key: string; rows: typeof rows }[] = [];
              rows.forEach((r) => {
                let g = groups.find((x) => x.key === r.group);
                if (!g) { g = { key: r.group, rows: [] }; groups.push(g); }
                g.rows.push(r);
              });
              const isSetLeaf = leaf.id.startsWith('s/');
              return (
                <section key={leaf.id} id={`sec-${leaf.id}`} className="mb-8 scroll-mt-20">
                  <SectionHead
                    title={isLeaf ? leaf.label : relPath(tree, leaf.id, node.id)}
                    sub={`${prog.done}/${prog.total} 已收集`}
                    count={rows.length}
                    tone={isSetLeaf ? 'set' : 'unique'}
                    tag="h2"
                    onOpen={isLeaf ? undefined : () => setSel(leaf.id)}
                    openLabel={`進入「${leaf.label}」`}
                  />
                  {groups.map((g) => {
                    const gProg = g.key ? (() => {
                      const all = allGrailItems.filter((i) => i.leaf === leaf.id && i.group === g.key);
                      return { done: all.filter((i) => grailState.obtainedItemIds[i.id]).length, total: all.length };
                    })() : null;
                    return (
                      <div key={g.key || 'all'} className="mb-5 last:mb-0">
                        {g.key && gProg && (
                          <SectionHead title={g.key} sub={`${gProg.done}/${gProg.total}`} count={g.rows.length} tone={isSetLeaf ? 'set' : 'unique'} level={3} tag="h3" />
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3">
                          {g.rows.map((item) => {
          const isObtained = Boolean(grailState.obtainedItemIds[item.id]);
                            const isEth = Boolean(grailState.etherealItemIds[item.id]);

                            return (
                              <div
                                key={item.id}
                                className={`p-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                                  isObtained
                                    ? 'bg-sanctuary-900/80 border-d2-set/50 shadow-md ring-1 ring-d2-set/20'
                                    : item.isTC87
                                    ? 'bg-sanctuary-950 border-amber-500/40 opacity-80 hover:opacity-100 hover:border-amber-400'
                                    : 'bg-sanctuary-950 border-sanctuary-800/80 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <div
                                  onClick={() => toggleObtained(item.id)}
                                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                                >
                                  <div className="shrink-0">
                                    {isObtained ? (
                                      <CheckCircle2 className="w-5 h-5 text-d2-set" />
                                    ) : (
                                      <Circle className={`w-5 h-5 ${item.isTC87 ? 'text-amber-400/60' : 'text-sanctuary-600'}`} />
                                    )}
                                  </div>

                                  <ItemIcon
                                    name={item.name}
                                    nameEn={item.nameEn}
                                    slot={item.slot}
                                    rarity={item.isSet ? 'set' : 'unique'}
                                    imageUrl={item.imageUrl}
                                    size="sm"
                                  />

                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span
                                        className={`font-diablo font-bold text-sm truncate ${
                                          item.isSet
                                            ? 'text-d2-set'
                                            : item.isTC87
                                            ? 'text-amber-300'
                                            : 'text-d2-unique'
                                        }`}
                                      >
                                        {item.name}
                                      </span>
                                      {item.isTC87 && (
                                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700">
                                          TC87
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] font-mono text-sanctuary-400 truncate">
                                      {item.nameEn} • {item.category}
                                    </div>
                                  </div>
                                </div>

                                {/* ETH checkbox toggle */}
                                <button
                                  type="button"
                                  onClick={() => toggleEthereal(item.id)}
                                  title="標記是否打到無形 (ETH) 版本"
                                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors shrink-0 ${
                                    isEth
                                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm'
                                      : 'bg-sanctuary-900 text-sanctuary-500 border-sanctuary-800 hover:text-sanctuary-300'
                                  }`}
                                >
                                  ETH
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })
          )}
        </div>
      </TreeIndex>
    </div>
  );
};
