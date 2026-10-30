import React, { useState, useMemo } from 'react';
import { HolyGrailState } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { loadHolyGrailState, saveHolyGrailState, exportAllUserData, importUserData } from '../../utils/storage';
import { ItemIcon } from '../common/ItemIcon';
import { TreeIndex, Crumbs, SectionHead, crumbsOf } from '../common/TreeIndex';
import { TreeNode, buildTree, recount, findNode, leavesOf, inNode, relPath } from '../../utils/equipTaxonomy';
import { ITEM_TREE_DEFS, CHARM_LABEL, CHARM_LABEL_EN, U_ENTRIES, S_ENTRIES } from '../../utils/itemIndex';
import { 
  Trophy, 
  CheckCircle2, 
  Circle, 
  Download, 
  Upload, 
  Sparkles, 
  Sword, 
  Shield, 
  Crown, 
  Gem, 
  Layers, 
  Award,
  Lock,
  Unlock
} from 'lucide-react';
import { GameIcon } from '../common/GameIcons';

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

interface BigFourTrophy {
  id: string;
  name: string;
  nameEn: string;
  baseItem: string;
  baseItemEn?: string;
  slot: string;
  taglineZh: string;
  taglineEn: string;
  keyStatsZh: string;
  keyStatsEn: string;
  dropRarityZh: string;
  dropRarityEn: string;
}

const BIG_FOUR_TROPHIES: BigFourTrophy[] = [
  {
    id: 'tyraels_might',
    name: '泰瑞爾之力',
    nameEn: "Tyrael's Might",
    baseItem: '神聖戰甲 (Sacred Armor)',
    baseItemEn: 'Sacred Armor',
    slot: 'armor',
    taglineZh: '全暗黑掉落率最低之神物 • 聖杯終極大魔王',
    taglineEn: 'Lowest drop rate in D2R • The Ultimate Holy Grail Boss',
    keyStatsZh: '無法破壞 · 裝備需求 -100% · 無法凍結 · 全抗 +20-30',
    keyStatsEn: 'Indestructible · -100% Req · Cannot Be Frozen · All Res +20-30',
    dropRarityZh: '掉落率約 1/400,000 (限巴爾/迪亞布羅/85場景)',
    dropRarityEn: '~1/400,000 drop chance from Baal/Diablo/alvl85',
  },
  {
    id: 'windforce',
    name: '風之力',
    nameEn: 'Windforce',
    baseItem: '多頭蛇弓 (Hydra Bow)',
    baseItemEn: 'Hydra Bow',
    slot: 'weapon',
    taglineZh: '物理弓馬信仰神兵 • 二十載不墜之傳奇',
    taglineEn: 'Physical Bowazon Legend • Iconic 20-Year Heritage',
    keyStatsZh: '+依等級最大傷害 · 擊退 · 20% 攻擊速度 · 8% 偷取法力',
    keyStatsEn: '+Max Dmg/Lvl · Knockback · 20% IAS · 8% Mana Leech',
    dropRarityZh: 'TC87 武器精華 (地穴/古代通道/混沌魔殿)',
    dropRarityEn: 'TC87 Weapon (The Pit / Ancient Tunnels)',
  },
  {
    id: 'deaths_web',
    name: '死亡之網',
    nameEn: "Death's Web",
    baseItem: '埋骨魔杖 (Unearthed Wand)',
    baseItemEn: 'Unearthed Wand',
    slot: 'weapon',
    taglineZh: '劇毒死靈唯一真神 • 毒系破免必備權杖',
    taglineEn: 'Poison Necromancer God Tier • Crucial -50% Poison Res',
    keyStatsZh: '-40% 至 -50% 敵人毒素抗性 · +1-2 毒素與白骨技能',
    keyStatsEn: '-40% to -50% Enemy Poison Res · +1-2 Poison & Bone',
    dropRarityZh: 'TC87 最稀有法杖 (極度罕見掉落)',
    dropRarityEn: 'Rarest Wand in D2R (TC87 Unearthed Wand)',
  },
  {
    id: 'griffons_eye',
    name: '獅鷲之眼',
    nameEn: "Griffon's Eye",
    baseItem: '權冠 (Diadem)',
    baseItemEn: 'Diadem',
    slot: 'helm',
    taglineZh: '閃電系流派終極畢業冠冕 • 標馬/電法神頂配',
    taglineEn: 'Endgame Lightning Crown • Javazon & Light Sorc Dream',
    keyStatsZh: '-15% 至 -20% 敵人閃電抗性 · +10-15% 閃電技能傷害 · 25% 快速施法',
    keyStatsEn: '-15% to -20% Enemy Light Res · +10-15% Light Dmg · 25% FCR',
    dropRarityZh: 'TC87 權冠掉落 (限 85 場景/巴爾)',
    dropRarityEn: 'TC87 Diadem (Only Level 85 Zones & Hell Baal)',
  },
];

export const HolyGrailTracker: React.FC = () => {
  const { isEn } = useLanguage();
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
      categoryEn: string;
      slot: string;
      isSet: boolean;
      isTC87: boolean;
      imageUrl?: string;
      leaf: string;
      /** 同一段內的小標（咒符尺寸、套裝名稱）；沒有則為空字串 */
      group: string;
      groupEn: string;
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
        categoryEn: item.baseItemEn || item.baseItem,
        slot: item.slot,
        isSet: false,
        isTC87,
        imageUrl: item.imageUrl,
        leaf,
        group: CHARM_LABEL[sec] ?? '',
        groupEn: CHARM_LABEL_EN[sec] ?? '',
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
          categoryEn: piece.baseItemEn || piece.baseItem,
          slot: piece.slot,
          isSet: true,
          isTC87: false,
          imageUrl: piece.imageUrl,
          leaf,
          group: set.name,
          groupEn: set.nameEn,
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
  const progressNum = parseFloat(progressPercent);

  // 榮譽稱號階級
  const rankInfo = useMemo(() => {
    if (progressNum >= 100) return { title: isEn ? "Lord of the Holy Grail" : "萬物歸一 • 白金至高神", color: "text-d2-gold", border: "border-d2-gold" };
    if (progressNum >= 80) return { title: isEn ? "Chosen of Tyrael" : "泰瑞爾之選 • 傳奇宗師", color: "text-amber-400", border: "border-amber-400/60" };
    if (progressNum >= 50) return { title: isEn ? "Master Treasure Hunter" : "傳奇尋寶大師", color: "text-d2-unique", border: "border-d2-unique/50" };
    if (progressNum >= 20) return { title: isEn ? "Sanctuary Explorer" : "庇護冒險家", color: "text-d2-magic", border: "border-d2-magic/40" };
    return { title: isEn ? "Treasure Seeker" : "初醒探求者", color: "text-sanctuary-400", border: "border-sanctuary-800" };
  }, [progressNum, isEn]);

  // TC87 Stats
  const tc87Items = useMemo(() => allGrailItems.filter(i => i.isTC87), [allGrailItems]);
  const tc87Obtained = useMemo(() => tc87Items.filter(i => Boolean(grailState.obtainedItemIds[i.id])).length, [tc87Items, grailState]);

  // Slot Breakdown Stats
  const slotStats = useMemo(() => {
    const slots = [
      { id: 'weapon', label: isEn ? 'Weapons' : '武器類', icon: <Sword className="w-3.5 h-3.5 text-d2-fire" /> },
      { id: 'armor', label: isEn ? 'Armor' : '衣服護甲', icon: <Shield className="w-3.5 h-3.5 text-d2-gold" /> },
      { id: 'helm', label: isEn ? 'Helms' : '頭盔類', icon: <Crown className="w-3.5 h-3.5 text-amber-300" /> },
      { id: 'shield', label: isEn ? 'Shields' : '盾牌類', icon: <Shield className="w-3.5 h-3.5 text-blue-400" /> },
      { id: 'jewelry', label: isEn ? 'Jewelry' : '首飾護符', icon: <Gem className="w-3.5 h-3.5 text-d2-magic" /> },
      { id: 'set', label: isEn ? 'Set Items' : '綠色套裝', icon: <Layers className="w-3.5 h-3.5 text-d2-set" /> },
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
  }, [allGrailItems, grailState, isEn]);

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
  const root: TreeNode = useMemo(() => ({ id: 'all', label: isEn ? 'All Holy Grail' : '全部聖杯', count: displayedItems.length, children: tree }), [tree, displayedItems.length]);
  const node = sel === 'all' ? root : findNode(tree, sel) ?? root;

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
  const crumbs = crumbsOf(isEn ? 'All Holy Grail' : '全部聖杯', tree, sel, isEn);

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
            <GameIcon name="grail" className="w-4 h-4 text-d2-gold animate-pulse" />
            Diablo II: Resurrected Holy Grail Checklist
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            {isEn ? "Diablo II: Resurrected Holy Grail Checklist" : "暗黑聖杯挑戰進度追蹤 (Holy Grail Tracker)"}
          </h1>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1 max-w-2xl">
            {isEn 
              ? "Local-only offline tracking of all unique and set items in Diablo II: Resurrected. Challenge yourself to 100% complete collection! Includes TC87 hall of fame filters." 
              : "純本地無痕紀錄遊戲內全數暗金與成套套裝掉落，挑戰 100% 圓滿收藏！支援 TC87 殿堂神物專屬篩選與分類進度分析。"}
          </p>
        </div>

        {/* Export / Import Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs shrink-0">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-sanctuary-300 hover:text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isEn ? "Export Backup JSON" : "匯出備份 JSON"}</span>
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-sanctuary-300 hover:text-white cursor-pointer transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>{isEn ? "Import Backup" : "匯入進度"}</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Progress Dashboard */}
      <div className="p-6 rounded-3xl bg-sanctuary-950 border border-sanctuary-800 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-sanctuary-400 font-medium flex items-center gap-2">
              <span>{isEn ? "Holy Grail Completion Rate" : "總體聖杯收集完成率"}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${rankInfo.border} ${rankInfo.color} bg-sanctuary-900/60 flex items-center gap-1`}>
                <Award className="w-3 h-3" />
                <span>{rankInfo.title}</span>
              </span>
            </div>
            <div className="font-diablo text-4xl font-black text-d2-gold mt-1 flex items-baseline gap-2">
              <span>{progressPercent}%</span>
              <span className="text-xs font-mono font-normal text-sanctuary-500">
                {isEn ? `(${obtainedCount} / ${totalCount} items)` : `(${obtainedCount} / ${totalCount} 件)`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="text-center px-3 py-2 rounded-xl bg-sanctuary-900/80 border border-sanctuary-800">
              <div className="text-sanctuary-400 text-[10px]">{isEn ? "TC87 Hall of Fame" : "TC87 殿堂級神物"}</div>
              <div className="text-amber-400 font-bold text-sm mt-0.5">{tc87Obtained} / {tc87Items.length}</div>
            </div>
            <div className="text-center px-3 py-2 rounded-xl bg-sanctuary-900/80 border border-sanctuary-800">
              <div className="text-sanctuary-400 text-[10px]">{isEn ? "Missing Items" : "尚缺件數"}</div>
              <div className="text-d2-fire font-bold text-sm mt-0.5">{totalCount - obtainedCount} {isEn ? "items" : "件"}</div>
            </div>
            <div className="text-center px-3 py-2 rounded-xl bg-sanctuary-900/80 border border-sanctuary-800">
              <div className="text-sanctuary-400 text-[10px]">{isEn ? "Ethereal (ETH)" : "無形 (ETH) 收藏"}</div>
              <div className="text-cyan-400 font-bold text-sm mt-0.5">{ethCount} {isEn ? "items" : "件"}</div>
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

        {/* Category Breakdown Progress Mini-Cards with Icons */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {slotStats.map((slot) => (
            <div
              key={slot.id}
              className="bg-sanctuary-900/50 p-2.5 rounded-xl border border-sanctuary-800/80 space-y-1.5 hover:border-sanctuary-700 transition-colors"
            >
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-sanctuary-300 font-medium flex items-center gap-1.5">
                  {slot.icon}
                  <span>{slot.label}</span>
                </span>
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

      {/* ── 聖杯榮譽殿堂 • 四大終極天王 (The Holy Grail Wall of Fame • The Big Four) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-d2-gold/15 text-d2-gold border border-d2-gold/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-diablo text-lg sm:text-xl font-bold text-sanctuary-100 flex items-center gap-2">
                <span>{isEn ? "The Holy Grail - Hall of the Big Four" : "聖杯榮譽殿堂 • 四大終極天王"}</span>
                <span className="text-xs font-mono font-normal text-d2-gold">
                  ({BIG_FOUR_TROPHIES.filter(t => Boolean(grailState.obtainedItemIds[t.id])).length} / 4)
                </span>
              </h2>
              <p className="text-xs text-sanctuary-400">
                {isEn 
                  ? "The lowest drop rates in Diablo II: Resurrected. Click a card to toggle collection status!" 
                  : "全暗黑掉落率最極限的四大神裝。點擊卡片即可快速標記/切換收集狀態！"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BIG_FOUR_TROPHIES.map((trophy) => {
            const isClaimed = Boolean(grailState.obtainedItemIds[trophy.id]);

            return (
              <div
                key={trophy.id}
                role="button"
                tabIndex={0}
                aria-pressed={isClaimed}
                aria-label={isEn ? `${trophy.nameEn} ${isClaimed ? 'Claimed' : 'Unfound'}` : `${trophy.name} (${trophy.nameEn}) ${isClaimed ? '已收集' : '未收集'}`}
                onClick={() => toggleObtained(trophy.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleObtained(trophy.id);
                  }
                }}
                className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 group flex flex-col justify-between select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-d2-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sanctuary-950 ${
                  isClaimed
                    ? 'bg-gradient-to-b from-sanctuary-900/90 via-sanctuary-950 to-sanctuary-900/90 border-d2-unique/80 shadow-[0_0_20px_rgba(200,165,100,0.25)] hover:border-d2-gold'
                    : 'bg-sanctuary-950/70 border-sanctuary-800/80 hover:border-sanctuary-700 [&_img]:opacity-60 [&_img]:grayscale hover:[&_img]:opacity-90 hover:[&_img]:grayscale-0'
                }`}
              >
                <div>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                      isClaimed
                        ? 'bg-d2-gold/20 text-d2-gold border-d2-gold/50'
                        : 'bg-sanctuary-900 text-sanctuary-400 border-sanctuary-800'
                    }`}>
                      {isClaimed ? (
                        <>
                          <Unlock className="w-3 h-3 text-d2-gold" />
                          <span>{isEn ? "Grail Claimed" : "🏆 已刻入聖杯"}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-sanctuary-500" />
                          <span>{isEn ? "Sealed / Unfound" : "🔒 封印尋獲中"}</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-sanctuary-400">TC87</span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-1.5 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isClaimed 
                        ? 'bg-sanctuary-900 border-d2-unique/60 shadow-[0_0_12px_rgba(200,165,100,0.3)]' 
                        : 'bg-sanctuary-900/50 border-sanctuary-800 grayscale'
                    }`}>
                      <ItemIcon
                        name={trophy.name}
                        nameEn={trophy.nameEn}
                        slot={trophy.slot}
                        rarity="unique"
                        size="md"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className={`font-diablo text-base font-bold truncate transition-colors ${
                        isClaimed ? 'text-d2-unique group-hover:text-amber-200' : 'text-sanctuary-300'
                      }`}>
                        {isEn ? trophy.nameEn : trophy.name}
                      </h3>
                      {!isEn && (
                        <div className="text-[11px] font-mono text-sanctuary-400 truncate">
                          {trophy.nameEn}
                        </div>
                      )}
                      <div className="text-[10px] text-sanctuary-500 font-mono truncate">
                        {isEn ? (trophy.baseItemEn || trophy.baseItem) : trophy.baseItem}
                      </div>
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="text-[11px] text-sanctuary-300 font-medium mb-2 leading-snug">
                    {isEn ? trophy.taglineEn : trophy.taglineZh}
                  </div>

                  {/* Key Stats */}
                  <div className="p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 text-[10px] text-sanctuary-300 leading-relaxed font-sans mb-2">
                    {isEn ? trophy.keyStatsEn : trophy.keyStatsZh}
                  </div>
                </div>

                {/* Drop Rarity Footer */}
                <div className="pt-2 border-t border-sanctuary-850/80 flex items-center justify-between text-[10px] font-mono text-sanctuary-500">
                  <span>{isEn ? trophy.dropRarityEn : trophy.dropRarityZh}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isEn ? "Search grail item name, English or base..." : "搜尋聖杯清單裝備名稱、英文或底材..."}
          className="w-full sm:w-80 bg-sanctuary-950 border border-sanctuary-800 rounded-xl px-4 py-2 text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-gold"
        />

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sanctuary-900 border border-sanctuary-800 self-stretch sm:self-auto text-xs justify-center flex-wrap">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterMode === 'all' ? 'bg-sanctuary-800 text-d2-gold font-bold shadow' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            {isEn ? `All (${allGrailItems.length})` : `全部 (${allGrailItems.length})`}
          </button>
          <button
            onClick={() => setFilterMode('tc87')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              filterMode === 'tc87' ? 'bg-amber-400 text-sanctuary-950 font-bold shadow' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? `TC87 (${tc87Items.length})` : `TC87 殿堂 (${tc87Items.length})`}</span>
          </button>
          <button
            onClick={() => setFilterMode('missing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterMode === 'missing' ? 'bg-sanctuary-800 text-d2-fire font-bold shadow' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            {isEn ? `Missing (${totalCount - obtainedCount})` : `未獲得 (${totalCount - obtainedCount})`}
          </button>
          <button
            onClick={() => setFilterMode('obtained')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterMode === 'obtained' ? 'bg-sanctuary-800 text-d2-set font-bold shadow' : 'text-sanctuary-400 hover:text-white'
            }`}
          >
            {isEn ? `Obtained (${obtainedCount})` : `已收集 (${obtainedCount})`}
          </button>
        </div>
      </div>

      {/* Items Checklist：樹狀索引 + 依分類分段的清單 */}
      <TreeIndex title={isEn ? "Holy Grail Index" : "聖杯索引"} rootLabel={isEn ? "All Holy Grail" : "全部聖杯"} rootCount={root.count} nodes={tree} activeId={node.id} onSelect={setSel} tone="unique">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Crumbs crumbs={crumbs} onSelect={setSel} />
            <div className="text-xs font-mono text-sanctuary-400">
              {isEn ? "Section Progress" : "本層進度"} <span className="text-d2-gold font-bold">{nodeProgress.done} / {nodeProgress.total}</span>
              {nodeProgress.total > 0 && <span className="ml-1">（{Math.round((nodeProgress.done / nodeProgress.total) * 100)}%）</span>}
            </div>
          </div>

          {displayedItems.filter((i) => inNode(i.leaf, node.id)).length === 0 ? (
            <div className="p-12 text-center text-sanctuary-400 bg-sanctuary-900/40 rounded-xl border border-sanctuary-800 space-y-3">
              <div>
                {root.count > 0 && node.id !== 'all'
                  ? (isEn ? `No items in "${node.en || node.label}" matching current filters, ${root.count} items match in other categories.` : `「${node.label}」底下沒有符合目前篩選的項目，其他分類共 ${root.count} 件符合，請看分類索引的數量。`)
                  : (isEn ? 'No items matching current filters.' : '沒有符合目前條件的項目。')}
              </div>
              {root.count > 0 && node.id !== 'all' && (
                <button type="button" onClick={() => setSel('all')} className="px-4 py-2 rounded-lg bg-sanctuary-800 border border-sanctuary-700 text-sm text-sanctuary-100 hover:border-d2-gold">
                  {isEn ? "Back to All Holy Grail" : "回到「全部聖杯」"}
                </button>
              )}
            </div>
          ) : (
            leaves.map((leaf) => {
              const rows = displayedItems.filter((i) => i.leaf === leaf.id);
              if (rows.length === 0) return null;
              const prog = progressOf(leaf.id);
              const groups: { key: string; keyEn: string; rows: typeof rows }[] = [];
              rows.forEach((r) => {
                let g = groups.find((x) => x.key === r.group);
                if (!g) { g = { key: r.group, keyEn: r.groupEn, rows: [] }; groups.push(g); }
                g.rows.push(r);
              });
              const isSetLeaf = leaf.id.startsWith('s/');
              return (
                <section key={leaf.id} id={`sec-${leaf.id}`} className="mb-8 scroll-mt-20">
                  <SectionHead
                    title={isEn ? (leaf.en || leaf.label) : (isLeaf ? leaf.label : relPath(tree, leaf.id, node.id))}
                    sub={`${prog.done}/${prog.total} ${isEn ? 'obtained' : '已收集'}`}
                    count={rows.length}
                    tone={isSetLeaf ? 'set' : 'unique'}
                    tag="h2"
                    onOpen={isLeaf ? undefined : () => setSel(leaf.id)}
                    openLabel={isEn ? `Enter "${leaf.en || leaf.label}"` : `進入「${leaf.label}」`}
                  />
                  {groups.map((g) => {
                    const gProg = g.key ? (() => {
                      const all = allGrailItems.filter((i) => i.leaf === leaf.id && i.group === g.key);
                      return { done: all.filter((i) => grailState.obtainedItemIds[i.id]).length, total: all.length };
                    })() : null;
                    return (
                      <div key={g.key || 'all'} className="mb-5 last:mb-0">
                        {g.key && gProg && (
                          <SectionHead title={isEn ? (g.keyEn || g.key) : g.key} sub={`${gProg.done}/${gProg.total}`} count={g.rows.length} tone={isSetLeaf ? 'set' : 'unique'} level={3} tag="h3" />
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3">
                          {g.rows.map((item) => {
                            const isObtained = Boolean(grailState.obtainedItemIds[item.id]);
                            const isEth = Boolean(grailState.etherealItemIds[item.id]);

                            return (
                              <div
                                key={item.id}
                                className={`p-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 focus-within:opacity-100 ${
                                  isObtained
                                    ? 'bg-sanctuary-900/80 border-d2-set/50 shadow-md ring-1 ring-d2-set/20'
                                    : item.isTC87
                                    ? 'bg-sanctuary-950 border-amber-500/40 [&_img]:opacity-80 hover:[&_img]:opacity-100 hover:border-amber-400'
                                    : 'bg-sanctuary-950 border-sanctuary-800/80 [&_img]:opacity-60 [&_img]:grayscale hover:[&_img]:opacity-100 hover:[&_img]:grayscale-0'
                                }`}
                              >
                                <button
                                  type="button"
                                  aria-label={isEn ? `${item.nameEn} collected` : `${item.name}（${item.nameEn}）收藏`}
                                  aria-pressed={isObtained}
                                  onClick={() => toggleObtained(item.id)}
                                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-d2-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sanctuary-950"
                                >
                                  <span className="shrink-0">
                                    {isObtained ? (
                                      <CheckCircle2 className="w-5 h-5 text-d2-set" />
                                    ) : (
                                      <Circle className={`w-5 h-5 ${item.isTC87 ? 'text-amber-400/60' : 'text-sanctuary-500'}`} />
                                    )}
                                  </span>

                                  <ItemIcon
                                    as="span"
                                    name={item.name}
                                    nameEn={item.nameEn}
                                    slot={item.slot}
                                    rarity={item.isSet ? 'set' : 'unique'}
                                    imageUrl={item.imageUrl}
                                    size="sm"
                                  />

                                  <span className="block min-w-0">
                                    <span className="flex items-center gap-1.5 flex-wrap">
                                      <span
                                        className={`font-diablo font-bold text-sm truncate ${
                                          item.isSet
                                            ? 'text-d2-set'
                                            : item.isTC87
                                            ? 'text-amber-300'
                                            : 'text-d2-unique'
                                        }`}
                                      >
                                        {isEn ? item.nameEn : item.name}
                                      </span>
                                      {item.isTC87 && (
                                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700">
                                          TC87
                                        </span>
                                      )}
                                    </span>
                                    <span className="block text-[10px] font-mono text-sanctuary-400 truncate">
                                      {isEn ? item.categoryEn : `${item.nameEn} • ${item.category}`}
                                    </span>
                                  </span>
                                </button>

                                {/* 獨立的無形收藏切換 */}
                                <button
                                  type="button"
                                  onClick={() => toggleEthereal(item.id)}
                                  aria-label={isEn ? `${item.nameEn} Ethereal (ETH) collection` : `${item.name}（${item.nameEn}）無形 (ETH) 收藏`}
                                  aria-pressed={isEth}
                                  title={isEn ? "Mark as obtained in Ethereal (ETH)" : "標記是否打到無形 (ETH) 版本"}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-d2-gold focus-visible:ring-offset-2 focus-visible:ring-offset-sanctuary-950 ${
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
