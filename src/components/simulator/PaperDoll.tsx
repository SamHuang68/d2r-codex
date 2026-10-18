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
  Crosshair,
  Gem
} from 'lucide-react';

export interface PaperDollProps {
  equipped: EquippedSlots;
  onEquipItem: (slot: keyof EquippedSlots, item: CatalogItem) => void;
  onUnequipItem: (slot: keyof EquippedSlots, itemIndex?: number) => void;
  weaponSwap: 'I' | 'II';
  onToggleWeaponSwap: () => void;
}

/**
 * 聖休亞瑞典藏中樞 (D2R Codex) - 1:1 遊戲原生裝備紙娃娃 (Inventory Paper Doll)
 * 依照暗黑破壞神二代 1:1 比例槽位佈局，精確還原頭盔、項鍊、雙手武器、胸甲、手套、腰帶、雙戒指、靴子與背包護身符區
 */
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

  // 槽位佔位圖示
  const getSlotPlaceholder = (slot: string, label: string) => {
    const iconClass = "w-5 h-5 text-sanctuary-600/70";
    let icon = <Sparkles className={iconClass} />;
    if (slot === 'helm') icon = <Shield className={iconClass} />;
    else if (slot.startsWith('weapon')) icon = <Sword className={iconClass} />;
    else if (slot.startsWith('shield')) icon = <Shield className={iconClass} />;
    else if (slot === 'armor') icon = <Flame className={iconClass} />;
    else if (slot === 'gloves') icon = <Crosshair className={iconClass} />;
    else if (slot === 'belt') icon = <Zap className={iconClass} />;
    else if (slot === 'boots') icon = <Flame className={iconClass} />;
    else if (slot === 'amulet') icon = <Gem className={iconClass} />;
    else if (slot.startsWith('ring')) icon = <Sparkles className={iconClass} />;

    return (
      <div className="flex flex-col items-center justify-center gap-1 opacity-50 group-hover:opacity-80 transition-opacity">
        {icon}
        <span className="text-[10px] font-mono text-sanctuary-400">{label}</span>
      </div>
    );
  };

  // 渲染標準裝備槽位
  const renderSlot = (
    slotKey: keyof EquippedSlots,
    label: string,
    widthHeightClass: string,
    _expectedSlot: GearSlot
  ) => {
    const item = equipped[slotKey] as CatalogItem | undefined;
    const isOver = draggedOverSlot === slotKey;

    return (
      <div
        className={`relative ${widthHeightClass} rounded-xl border-2 transition-all flex flex-col items-center justify-center select-none group cursor-pointer ${
          isOver
            ? 'border-d2-gold bg-d2-gold/25 shadow-glow-gold scale-105'
            : item
            ? 'border-sanctuary-700 bg-sanctuary-900/90 shadow-xl hover:border-d2-gold/90'
            : 'border-dashed border-sanctuary-800/90 bg-sanctuary-950/80 hover:border-sanctuary-600'
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
              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-900/80 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow"
            >
              <X className="w-2.5 h-2.5" />
            </button>

            {/* 裝備真實立繪貼圖 */}
            <div className="my-auto drop-shadow-md">
              <ItemIcon
                name={item.name}
                nameEn={item.nameEn}
                baseItem={item.baseItem}
                slot={item.slot}
                rarity={item.itemType}
                imageUrl={item.imageUrl}
                size={widthHeightClass.includes('h-36') ? 'lg' : widthHeightClass.includes('w-20') ? 'md' : 'sm'}
                showBorder={false}
              />
            </div>

            {/* 裝備名稱與底材標籤 */}
            <div className="w-full">
              <div className="w-full truncate text-[11px] font-diablo font-bold text-d2-gold group-hover:text-amber-300 leading-tight">
                {item.name}
              </div>
              <div className="text-[9px] font-mono text-sanctuary-400 truncate max-w-full">
                {item.baseItem}
              </div>
            </div>
          </div>
        ) : (
          getSlotPlaceholder(slotKey, label)
        )}
      </div>
    );
  };

  const activeWeaponSlot = weaponSwap === 'I' ? 'weapon1' : 'weapon2';
  const activeShieldSlot = weaponSwap === 'I' ? 'shield1' : 'shield2';

  return (
    <div className="relative bg-sanctuary-950/95 rounded-3xl border-2 border-sanctuary-800 shadow-2xl p-5 sm:p-6 space-y-5 flex flex-col justify-between">
      {/* 頂部武器切換按鈕 I / II (Switch Weapons) */}
      <div className="flex items-center justify-between border-b border-sanctuary-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-d2-gold font-bold">
            ⚔️ 1:1 原生裝備頁 (PAPER DOLL)
          </span>
        </div>

        {/* 武器切換 I / II 按鈕 */}
        <div className="flex items-center gap-1.5 bg-sanctuary-900 p-1 rounded-xl border border-sanctuary-800">
          <button
            onClick={() => { if (weaponSwap !== 'I') onToggleWeaponSwap(); }}
            className={`px-3 py-1 rounded-lg text-xs font-diablo font-bold transition-all ${
              weaponSwap === 'I'
                ? 'bg-d2-unique text-sanctuary-950 shadow-md'
                : 'text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            主武器 [ I ]
          </button>
          <button
            onClick={() => { if (weaponSwap !== 'II') onToggleWeaponSwap(); }}
            className={`px-3 py-1 rounded-lg text-xs font-diablo font-bold transition-all ${
              weaponSwap === 'II'
                ? 'bg-d2-unique text-sanctuary-950 shadow-md'
                : 'text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            副武器 [ II ]
          </button>
          <button
            onClick={onToggleWeaponSwap}
            className="p-1 rounded-lg hover:bg-sanctuary-800 text-sanctuary-400 hover:text-d2-gold transition-colors"
            title="快捷切換武器 (W)"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1:1 暗黑二代經典裝備網格佈局 (Paper Doll Grid) */}
      <div className="max-w-md mx-auto w-full py-2 space-y-3">
        {/* Row 1: 頭盔 Helm (居中) + 右側項鍊 Amulet */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24">
            {renderSlot('helm', '頭盔 Helm', 'w-full h-full', 'helm')}
          </div>
          <div className="absolute right-4 sm:right-10 top-2 w-16 h-16">
            {renderSlot('amulet', '項鍊 Amulet', 'w-full h-full', 'amulet')}
          </div>
        </div>

        {/* Row 2: 主手武器 (I/II) + 胸甲護甲 Armor + 副手盾牌 (I/II) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {/* 主手武器 */}
          <div className="w-24 h-36">
            {renderSlot(
              activeWeaponSlot,
              `主手 [${weaponSwap}]`,
              'w-full h-full',
              'weapon'
            )}
          </div>

          {/* 軀幹護甲 */}
          <div className="w-28 h-36">
            {renderSlot('armor', '護甲 Armor', 'w-full h-full', 'armor')}
          </div>

          {/* 副手盾牌 */}
          <div className="w-24 h-36">
            {renderSlot(
              activeShieldSlot,
              `副手 [${weaponSwap}]`,
              'w-full h-full',
              'shield'
            )}
          </div>
        </div>

        {/* Row 3: 左手套 + 腰帶 + 右靴子 (兩側夾左戒指與右戒指) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* 手套 Gloves */}
          <div className="w-20 h-20">
            {renderSlot('gloves', '手套 Gloves', 'w-full h-full', 'gloves')}
          </div>

          {/* 左戒指 Ring 1 */}
          <div className="w-14 h-14">
            {renderSlot('ring1', '左戒指', 'w-full h-full', 'ring')}
          </div>

          {/* 腰帶 Belt */}
          <div className="w-24 h-14">
            {renderSlot('belt', '腰帶 Belt', 'w-full h-full', 'belt')}
          </div>

          {/* 右戒指 Ring 2 */}
          <div className="w-14 h-14">
            {renderSlot('ring2', '右戒指', 'w-full h-full', 'ring')}
          </div>

          {/* 靴子 Boots */}
          <div className="w-20 h-20">
            {renderSlot('boots', '靴子 Boots', 'w-full h-full', 'boots')}
          </div>
        </div>
      </div>

      {/* 底部：背包護身符區 (Charms Bar: 毀符 / 火炬 / 破免 / 大板) */}
      <div className="border-t border-sanctuary-800/80 pt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-sanctuary-400">
          <span className="flex items-center gap-1.5 font-bold text-sanctuary-200">
            <Trophy className="w-3.5 h-3.5 text-d2-gold" />
            <span>背包護身符區 (Charms Bar: 毀符 / 火炬 / 破免 / 大板)</span>
          </span>
          <span className="text-[10px] text-sanctuary-500">已裝備 {equipped.charms.length} 件</span>
        </div>

        <div
          className={`min-h-[64px] p-2.5 rounded-2xl border-2 border-dashed transition-all flex items-center gap-2 flex-wrap ${
            draggedOverSlot === 'charms'
              ? 'border-d2-gold bg-d2-gold/15'
              : 'border-sanctuary-800 bg-sanctuary-900/60'
          }`}
          onDragOver={(e) => handleDragOver(e, 'charms')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'charms')}
        >
          {equipped.charms.length > 0 ? (
            equipped.charms.map((charm, idx) => (
              <div
                key={idx}
                className="group relative bg-sanctuary-950 px-3 py-1.5 rounded-xl border border-sanctuary-750 flex items-center gap-2 text-xs text-sanctuary-200 shadow hover:border-d2-gold"
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
                  imageUrl={charm.imageUrl}
                  size="xs" 
                  showBorder={false} 
                />
                <span className="font-diablo text-xs text-d2-gold truncate max-w-[130px]">
                  {charm.name}
                </span>
                <button
                  onClick={() => onUnequipItem('charms', idx)}
                  className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-white transition-opacity ml-1"
                  title="卸下護身符"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-xs text-sanctuary-500 font-mono py-2">
              尚未裝備任何護身符 (可從右側 Tab 2 樹狀裝備庫拖曳毀符、火炬、破免板、技能大板至此)
            </div>
          )}
        </div>
      </div>

      {/* 浮動 D2R 原生暗黑懸浮窗 (Item Tooltip) */}
      {hoveredItem && (
        <div
          style={{ top: `${hoveredItem.y}px`, left: `${hoveredItem.x}px` }}
          className="fixed z-50 pointer-events-none bg-black/95 border-2 border-d2-gold/80 rounded-2xl p-4 shadow-2xl max-w-xs space-y-2 text-center text-xs animate-fade-in ring-1 ring-amber-500/30"
        >
          <div className="flex justify-center mb-1">
            <ItemIcon
              name={hoveredItem.item.name}
              nameEn={hoveredItem.item.nameEn}
              baseItem={hoveredItem.item.baseItem}
              slot={hoveredItem.item.slot}
              rarity={hoveredItem.item.itemType}
              imageUrl={hoveredItem.item.imageUrl}
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
              <div key={aIdx} className="text-blue-300 text-[11px] leading-tight font-sans">
                {attr}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
