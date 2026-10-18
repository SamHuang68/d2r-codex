import React, { useState, useMemo } from 'react';
import { CatalogItem } from '../../types/simulator';
import { ItemIcon } from '../common/ItemIcon';
import { 
  Shield, 
  Sword, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Layers, 
  ArrowRight,
  GripVertical
} from 'lucide-react';

export interface LootFilterTreeProps {
  items: CatalogItem[];
  onEquipItem: (item: CatalogItem) => void;
}

export const LootFilterTree: React.FC<LootFilterTreeProps> = ({
  items,
  onEquipItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTier1, setExpandedTier1] = useState<Record<string, boolean>>({
    armor: true,
    weapon: true,
    jewelry: true,
  });
  const [expandedTier2, setExpandedTier2] = useState<Record<string, boolean>>({
    'armor_菁英 (Elite)': true,
    'armor_職業專屬 (Class-Specific)': true,
    'weapon_菁英 (Elite)': true,
    'jewelry_傳奇聖物護身符': true,
  });

  const toggleTier1 = (key: string) => {
    setExpandedTier1(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTier2 = (key: string) => {
    setExpandedTier2(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 搜尋過濾裝備
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const q = searchTerm.toLowerCase();
    return items.filter(i => 
      i.name.toLowerCase().includes(q) ||
      i.nameEn.toLowerCase().includes(q) ||
      i.baseItem.toLowerCase().includes(q) ||
      i.attributes.some(a => a.toLowerCase().includes(q))
    );
  }, [items, searchTerm]);

  // 分組階層
  const treeData = useMemo(() => {
    const groups: Record<string, Record<string, CatalogItem[]>> = {
      armor: {},
      weapon: {},
      jewelry: {},
    };

    filteredItems.forEach(item => {
      const t1 = item.categoryTier1 || 'armor';
      const t2 = item.categoryTier2 || '普通 (Normal)';

      if (!groups[t1]) groups[t1] = {};
      if (!groups[t1][t2]) groups[t1][t2] = [];

      groups[t1][t2].push(item);
    });

    return groups;
  }, [filteredItems]);

  const tier1Labels: Record<string, { label: string; icon: React.ReactNode }> = {
    armor: { label: '🛡️ 護甲防具類 (Armors & Shields)', icon: <Shield className="w-4 h-4 text-d2-socket" /> },
    weapon: { label: '⚔️ 武器神兵類 (Weapons & Runewords)', icon: <Sword className="w-4 h-4 text-d2-fire" /> },
    jewelry: { label: '💍 飾品與聖物護身符 (Jewelry & Charms)', icon: <Sparkles className="w-4 h-4 text-d2-gold" /> },
  };

  return (
    <div className="bg-sanctuary-950/95 rounded-3xl border-2 border-sanctuary-800 shadow-2xl p-5 sm:p-6 space-y-5">
      {/* 標題與拾取過濾器風格說明 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sanctuary-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-d2-gold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-d2-gold" />
            LOOT-FILTER HIERARCHICAL ITEM BROWSER
          </div>
          <h2 className="text-xl font-diablo font-bold text-sanctuary-100 mt-0.5">
            樹狀拾取過濾裝備庫
          </h2>
          <p className="text-xs text-sanctuary-400 mt-0.5">
            依類別 ➔ 強度 ➔ 專屬層層篩選，支援直接拖曳至左側裝備槽或點擊一鍵穿戴。
          </p>
        </div>

        {/* 搜尋欄 */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋神裝 (如 謎團、軍帽、40/15)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-sanctuary-900 border border-sanctuary-750 rounded-xl text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-gold"
          />
        </div>
      </div>

      {/* 樹狀結構展開列表 */}
      <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1 scrollbar-thin">
        {(['armor', 'weapon', 'jewelry'] as const).map(t1Key => {
          const t1Info = tier1Labels[t1Key];
          const t2Groups = treeData[t1Key] || {};
          const t2Keys = Object.keys(t2Groups);
          const isT1Open = expandedTier1[t1Key] ?? true;

          if (t2Keys.length === 0) return null;

          return (
            <div key={t1Key} className="border border-sanctuary-800 rounded-2xl overflow-hidden bg-sanctuary-900/40">
              {/* 第一層：大類別 (護甲 / 武器 / 飾品) */}
              <button
                onClick={() => toggleTier1(t1Key)}
                className="w-full px-4 py-3 bg-sanctuary-900/80 hover:bg-sanctuary-850 flex items-center justify-between transition-colors border-b border-sanctuary-800/80"
              >
                <div className="flex items-center gap-2 text-sm font-diablo font-bold text-sanctuary-100">
                  {isT1Open ? <ChevronDown className="w-4 h-4 text-d2-gold" /> : <ChevronRight className="w-4 h-4 text-sanctuary-400" />}
                  <span>{t1Info.label}</span>
                </div>
                <span className="text-[10px] font-mono text-sanctuary-500">
                  {Object.values(t2Groups).reduce((sum, list) => sum + list.length, 0)} 件
                </span>
              </button>

              {/* 第二層：強度階級 / 專屬 */}
              {isT1Open && (
                <div className="p-3 space-y-3">
                  {t2Keys.map(t2Key => {
                    const groupItems = t2Groups[t2Key] || [];
                    const subKey = `${t1Key}_${t2Key}`;
                    const isT2Open = expandedTier2[subKey] ?? true;

                    return (
                      <div key={t2Key} className="bg-sanctuary-950/80 rounded-xl border border-sanctuary-800/80 overflow-hidden">
                        <button
                          onClick={() => toggleTier2(subKey)}
                          className="w-full px-3 py-2 bg-sanctuary-900/50 hover:bg-sanctuary-850/60 flex items-center justify-between text-xs font-mono text-sanctuary-300 transition-colors"
                        >
                          <div className="flex items-center gap-1.5 font-bold">
                            {isT2Open ? <ChevronDown className="w-3.5 h-3.5 text-d2-fire" /> : <ChevronRight className="w-3.5 h-3.5 text-sanctuary-500" />}
                            <span>{t2Key}</span>
                          </div>
                          <span className="text-[10px] text-sanctuary-500">
                            {groupItems.length} 項
                          </span>
                        </button>

                        {/* 第三層：具體裝備卡片 (帶圖示、可拖曳、一鍵穿戴) */}
                        {isT2Open && (
                          <div className="p-2.5 grid grid-cols-1 gap-2">
                            {groupItems.map(item => {
                              const isRW = item.itemType === 'runeword';
                              const isSet = item.itemType === 'set';
                              const isUnique = item.itemType === 'unique';
                              const isCharm = item.itemType === 'charm';

                              const nameColor = isCharm ? 'text-cyan-400' : isRW ? 'text-amber-400' : isSet ? 'text-d2-set' : isUnique ? 'text-d2-unique' : 'text-d2-gold';

                              return (
                                <div
                                  key={item.id}
                                  draggable
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData('application/json', JSON.stringify(item));
                                  }}
                                  className="group bg-sanctuary-900/70 hover:bg-sanctuary-850 p-3 rounded-xl border border-sanctuary-800 hover:border-d2-gold/60 transition-all flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing shadow-sm"
                                >
                                  {/* 左側拖曳圖標與裝備名稱 */}
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <GripVertical className="w-4 h-4 text-sanctuary-600 group-hover:text-d2-gold shrink-0 transition-colors" />
                                    <ItemIcon
                                      name={item.name}
                                      nameEn={item.nameEn}
                                      baseItem={item.baseItem}
                                      slot={item.slot}
                                      rarity={item.itemType}
                                      size="sm"
                                    />

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`font-diablo font-bold text-sm truncate ${nameColor}`}>
                                          {item.name}
                                        </span>
                                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sanctuary-950 text-sanctuary-400 border border-sanctuary-800 shrink-0">
                                          {item.slot}
                                        </span>
                                      </div>
                                      <div className="text-[10px] font-mono text-sanctuary-400 truncate">
                                        {item.nameEn} • {item.baseItem}
                                      </div>
                                    </div>
                                  </div>

                                  {/* 右側一鍵穿戴按鈕 */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-right hidden sm:block">
                                      {item.requiredLevel > 1 && (
                                        <div className="text-[10px] font-mono text-sanctuary-400">
                                          需 Lv {item.requiredLevel}
                                        </div>
                                      )}
                                    </div>

                                    <button
                                      onClick={() => onEquipItem(item)}
                                      className="px-2.5 py-1.5 rounded-lg bg-sanctuary-800 hover:bg-d2-gold hover:text-sanctuary-950 text-xs font-mono font-bold text-sanctuary-200 transition-colors border border-sanctuary-700 flex items-center gap-1"
                                      title="點擊穿戴到對應裝備槽位"
                                    >
                                      <span>穿戴</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
