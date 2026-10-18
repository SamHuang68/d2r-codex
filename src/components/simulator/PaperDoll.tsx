import React, { useState } from 'react';
import { CatalogItem, EquippedSlots } from '../../types/simulator';
import { GearSlot } from '../../types';
import { ItemIcon } from '../common/ItemIcon';
import { 
  Shield, 
  Sword, 
  Sparkles, 
  X, 
  Repeat, 
  Trophy, 
  Flame, 
  Zap, 
  Crosshair 
} from 'lucide-react';

export interface PaperDollProps {
  equipped: EquippedSlots;
  onEquipItem: (slot: keyof EquippedSlots, item: CatalogItem) => void;
  onUnequipItem: (slot: keyof EquippedSlots, itemIndex?: number) => void;
  weaponSwap: 'I' | 'II';
  onToggleWeaponSwap: () => void;
}

export const PaperDoll: React.FC<PaperDollProps> = ({
  equipped,
  onEquipItem,
  onUnequipItem,
  weaponSwap,
  onToggleWeaponSwap,
}) => {
  const [draggedOverSlot, setDraggedOverSlot] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ item: CatalogItem; x: number; y: number } | null>(null);

  // 處理拖曳放置
  const handleDragOver = (e: React.DragEvent, slot: string) => {
    e.preventDefault();
    setDraggedOverSlot(slot);
  };

  const handleDragLeave = () => {
    setDraggedOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, targetSlot: keyof EquippedSlots) => {
    e.preventDefault();
    setDraggedOverSlot(null);
    try {
      const itemDataStr = e.dataTransfer.getData('application/json');
      if (itemDataStr) {
        const item: CatalogItem = JSON.parse(itemDataStr);
        onEquipItem(targetSlot, item);
      }
    } catch (err) {
      console.error("拖曳解析失敗", err);
    }
  };

  // 槽位圖示映射
  const getSlotIcon = (slot: string) => {
    switch (slot) {
      case 'helm': return <Shield className="w-6 h-6 text-sanctuary-600" />;
      case 'amulet': return <Sparkles className="w-5 h-5 text-sanctuary-600" />;
      case 'weapon1':
      case 'weapon2': return <Sword className="w-7 h-7 text-sanctuary-600" />;
      case 'shield1':
      case 'shield2': return <Shield className="w-7 h-7 text-sanctuary-600" />;
      case 'armor': return <Flame className="w-8 h-8 text-sanctuary-600" />;
      case 'gloves': return <Crosshair className="w-5 h-5 text-sanctuary-600" />;
      case 'belt': return <Zap className="w-5 h-5 text-sanctuary-600" />;
      case 'boots': return <Flame className="w-5 h-5 text-sanctuary-600" />;
      case 'ring1':
      case 'ring2': return <Sparkles className="w-4 h-4 text-sanctuary-600" />;
      default: return <Sparkles className="w-5 h-5 text-sanctuary-600" />;
    }
  };

  // 渲染單個裝備槽位
  const renderSlot = (
    slotKey: keyof EquippedSlots,
    label: string,
    sizeClass: string,
    _expectedSlot: GearSlot
  ) => {
    const item = equipped[slotKey] as CatalogItem | undefined;
    const isOver = draggedOverSlot === slotKey;

    return (
      <div
        className={`relative ${sizeClass} rounded-2xl border-2 transition-all flex flex-col items-center justify-center select-none group ${
          isOver
            ? 'border-d2-gold bg-d2-gold/20 shadow-glow-gold scale-105'
            : item
            ? 'border-sanctuary-700 bg-sanctuary-900/90 shadow-xl hover:border-d2-gold/80'
            : 'border-dashed border-sanctuary-800 bg-sanctuary-950/70 hover:border-sanctuary-700'
        }`}
        onDragOver={(e) => handleDragOver(e, slotKey)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, slotKey)}
        onMouseEnter={(e) => {
          if (item) {
            const rect = e.currentTarget.getBoundingClientRect();
            setHoveredItem({ item, x: rect.right + 10, y: rect.top });
          }
        }}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {item ? (
          <div className="w-full h-full p-1.5 flex flex-col items-center justify-between text-center relative overflow-hidden">
            {/* 卸除按鈕 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnequipItem(slotKey);
                setHoveredItem(null);
              }}
              title="卸下裝備"
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-d2-blood text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow"
            >
              <X className="w-3 h-3" />
            </button>

            {/* 裝備圖示 */}
            <div className="my-auto">
              <ItemIcon
                name={item.name}
                nameEn={item.nameEn}
                baseItem={item.baseItem}
                slot={item.slot}
                rarity={item.itemType}
                size={sizeClass.includes('w-28') ? 'md' : 'sm'}
                showBorder={false}
              />
            </div>

            {/* 裝備品級色彩外框標記 */}
            <div className="w-full truncate text-[10px] font-diablo font-bold text-d2-gold group-hover:text-amber-300 leading-tight">
              {item.name}
            </div>

            <div className="text-[8px] font-mono text-sanctuary-400 truncate max-w-full">
              {item.baseItem}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 opacity-40 group-hover:opacity-70 transition-opacity">
            {getSlotIcon(slotKey)}
            <span className="text-[10px] font-mono text-sanctuary-400">{label}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative bg-sanctuary-950/95 rounded-3xl border-2 border-sanctuary-800 shadow-2xl p-5 sm:p-6 space-y-6 flex flex-col justify-between">
      {/* 頂部控制列：武器切換與標題 */}
      <div className="flex items-center justify-between border-b border-sanctuary-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-d2-unique flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-d2-unique" />
            IN-GAME INVENTORY PAPER DOLL
          </div>
          <h2 className="text-xl font-diablo font-bold text-sanctuary-100 mt-0.5">
            遊戲裝備紙娃娃 (1:1 佈局)
          </h2>
        </div>

        {/* 武器切換按鈕 I / II (Switch Weapons) */}
        <button
          onClick={onToggleWeaponSwap}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-xs font-mono font-bold text-d2-gold shadow-sm transition-all"
        >
          <Repeat className="w-3.5 h-3.5 text-d2-gold" />
          <span>武器槽位: [{weaponSwap}]</span>
        </button>
      </div>

      {/* 經典暗黑二代裝備網格佈局 (Paper Doll Grid) */}
      <div className="max-w-md mx-auto w-full py-4 space-y-3">
        {/* Row 1: 頭盔 & 項鍊 */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-24 h-24">
            {renderSlot('helm', '頭盔 (Helm)', 'w-full h-full', 'helm')}
          </div>
          <div className="w-16 h-16">
            {renderSlot('amulet', '項鍊 (Amulet)', 'w-full h-full', 'amulet')}
          </div>
        </div>

        {/* Row 2: 主手武器 (I/II) + 護甲 + 副手盾牌 (I/II) */}
        <div className="flex items-center justify-center gap-4">
          {/* 主手武器 */}
          <div className="w-24 h-36">
            {renderSlot(
              weaponSwap === 'I' ? 'weapon1' : 'weapon2',
              `主手武器 [${weaponSwap}]`,
              'w-full h-full',
              'weapon'
            )}
          </div>

          {/* 軀幹護甲 */}
          <div className="w-28 h-36">
            {renderSlot('armor', '軀幹護甲 (Armor)', 'w-full h-full', 'armor')}
          </div>

          {/* 副手盾牌 */}
          <div className="w-24 h-36">
            {renderSlot(
              weaponSwap === 'I' ? 'shield1' : 'shield2',
              `副手盾牌 [${weaponSwap}]`,
              'w-full h-full',
              'shield'
            )}
          </div>
        </div>

        {/* Row 3: 手套 + 腰帶 + 靴子 */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-20 h-20">
            {renderSlot('gloves', '手套 (Gloves)', 'w-full h-full', 'gloves')}
          </div>
          <div className="w-28 h-14">
            {renderSlot('belt', '腰帶 (Belt)', 'w-full h-full', 'belt')}
          </div>
          <div className="w-20 h-20">
            {renderSlot('boots', '靴子 (Boots)', 'w-full h-full', 'boots')}
          </div>
        </div>

        {/* Row 4: 左戒指 & 右戒指 */}
        <div className="flex items-center justify-center gap-8 pt-1">
          <div className="w-16 h-16">
            {renderSlot('ring1', '左戒指', 'w-full h-full', 'ring')}
          </div>
          <div className="text-[10px] font-mono text-sanctuary-500 uppercase tracking-widest">
            戒指欄位
          </div>
          <div className="w-16 h-16">
            {renderSlot('ring2', '右戒指', 'w-full h-full', 'ring')}
          </div>
        </div>
      </div>

      {/* 底部：背包核心聖物護身符欄 (Charms Bar) */}
      <div className="border-t border-sanctuary-800/80 pt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-sanctuary-400">
          <span className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-d2-gold" />
            <span>背包核心聖物護身符 ({equipped.charms.length} 件)</span>
          </span>
          <span className="text-[10px] text-sanctuary-500">拖曳護身符至此處裝備</span>
        </div>

        <div
          className={`min-h-[64px] p-2 rounded-2xl border-2 border-dashed transition-all flex items-center gap-2 flex-wrap ${
            draggedOverSlot === 'charms'
              ? 'border-d2-gold bg-d2-gold/15'
              : 'border-sanctuary-800 bg-sanctuary-900/50'
          }`}
          onDragOver={(e) => handleDragOver(e, 'charms')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'charms' as any)}
        >
          {equipped.charms.length > 0 ? (
            equipped.charms.map((charm, idx) => (
              <div
                key={idx}
                className="group relative bg-sanctuary-850 px-2.5 py-1.5 rounded-xl border border-sanctuary-750 flex items-center gap-1.5 text-xs text-sanctuary-200 shadow"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredItem({ item: charm, x: rect.right + 10, y: rect.top });
                }}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <ItemIcon 
                  name={charm.name} 
                  nameEn={charm.nameEn} 
                  baseItem={charm.baseItem} 
                  slot="charm" 
                  rarity="charm" 
                  size="xs" 
                  showBorder={false} 
                />
                <span className="font-diablo text-xs text-d2-gold truncate max-w-[120px]">
                  {charm.name}
                </span>
                <button
                  onClick={() => onUnequipItem('charms' as any, idx)}
                  className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-white transition-opacity ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-xs text-sanctuary-500 font-mono py-2">
              尚未裝備任何護身符 (可從右側 Tab 2 拖入毀符、火炬、破免板、技能大板)
            </div>
          )}
        </div>
      </div>

      {/* 浮動 D2R 原生暗黑懸浮窗 (Item Tooltip) */}
      {hoveredItem && (
        <div
          style={{ top: `${hoveredItem.y}px`, left: `${hoveredItem.x}px` }}
          className="fixed z-50 pointer-events-none bg-black/95 border-2 border-d2-gold/70 rounded-xl p-4 shadow-2xl max-w-xs space-y-2 text-center text-xs animate-fade-in"
        >
          <div className="flex justify-center mb-1">
            <ItemIcon
              name={hoveredItem.item.name}
              nameEn={hoveredItem.item.nameEn}
              baseItem={hoveredItem.item.baseItem}
              slot={hoveredItem.item.slot}
              rarity={hoveredItem.item.itemType}
              size="md"
            />
          </div>
          <div className="font-diablo text-base font-bold text-d2-gold">
            {hoveredItem.item.name}
          </div>
          <div className="text-[11px] font-mono text-sanctuary-400">
            {hoveredItem.item.nameEn} • {hoveredItem.item.baseItem}
          </div>
          {hoveredItem.item.requiredLevel > 1 && (
            <div className="text-[11px] font-mono text-d2-blood font-bold">
              需要等級: {hoveredItem.item.requiredLevel}
            </div>
          )}
          <div className="border-t border-sanctuary-800 pt-2 space-y-1 text-left">
            {hoveredItem.item.attributes.map((attr, aIdx) => (
              <div key={aIdx} className="text-blue-300 text-[11px] leading-tight">
                {attr}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
