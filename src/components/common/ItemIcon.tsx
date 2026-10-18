import React from 'react';
import { GearSlot, ItemRarity } from '../../types';

export interface ItemIconProps {
  name?: string;
  nameEn?: string;
  baseItem?: string;
  slot?: GearSlot | string;
  rarity?: ItemRarity | 'unique' | 'set' | 'runeword' | 'rune' | 'charm' | 'gem' | 'prop' | 'rare' | 'magic' | 'crafted';
  runeNumber?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

/**
 * 聖休亞瑞暗黑物品圖示解析與渲染器
 */
export const ItemIcon: React.FC<ItemIconProps> = ({
  name = '',
  nameEn = '',
  baseItem = '',
  slot = '',
  rarity = 'unique',
  runeNumber,
  size = 'md',
  className = '',
  showBorder = true,
}) => {
  const n = (name + ' ' + nameEn + ' ' + baseItem).toLowerCase();

  // 1. 決定尺寸類別
  const sizeMap = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  // 2. 決定稀有度與光暈顏色
  const getColors = () => {
    if (rarity === 'set' || n.includes('套裝')) {
      return {
        border: 'border-emerald-500/50 hover:border-emerald-400',
        bg: 'from-emerald-950/80 via-sanctuary-950 to-sanctuary-900',
        glow: 'shadow-emerald-950/50',
        accent: '#10b981',
      };
    }
    if (rarity === 'rune' || runeNumber !== undefined || n.includes('符文') || n.includes('runeword')) {
      return {
        border: 'border-amber-500/60 hover:border-amber-400',
        bg: 'from-amber-950/80 via-sanctuary-950 to-sanctuary-900',
        glow: 'shadow-amber-950/50',
        accent: '#f59e0b',
      };
    }
    if (rarity === 'magic' || n.includes('魔法') || n.includes('藍色')) {
      return {
        border: 'border-sky-500/50 hover:border-sky-400',
        bg: 'from-sky-950/80 via-sanctuary-950 to-sanctuary-900',
        glow: 'shadow-sky-950/50',
        accent: '#38bdf8',
      };
    }
    if (rarity === 'rare' || n.includes('亮金')) {
      return {
        border: 'border-yellow-400/60 hover:border-yellow-300',
        bg: 'from-yellow-950/80 via-sanctuary-950 to-sanctuary-900',
        glow: 'shadow-yellow-950/50',
        accent: '#facc15',
      };
    }
    // 預設暗金 (Unique)
    return {
      border: 'border-amber-600/60 hover:border-d2-unique',
      bg: 'from-amber-950/80 via-sanctuary-950 to-sanctuary-900',
      glow: 'shadow-amber-900/40',
      accent: '#c79b32',
    };
  };

  const colorConfig = getColors();

  // 3. 渲染特定的 SVG 物品圖騰
  const renderItemArt = () => {
    // ── 符文 (Rune 1-33#) ──
    if (runeNumber !== undefined || n.includes('符文') && runeNumber) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          {/* 石碑邊角 */}
          <polygon points="10,4 38,4 44,14 44,38 36,44 12,44 4,36 4,12" fill="#2d2217" stroke={colorConfig.accent} strokeWidth="1.5" />
          <polygon points="12,7 36,7 41,15 41,36 34,41 14,41 7,34 7,14" fill="#1b140f" />
          {/* 刻痕字母印記 */}
          <circle cx="24" cy="24" r="11" stroke={colorConfig.accent} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          <text x="24" y="28" textAnchor="middle" fill={colorConfig.accent} fontSize="14" fontWeight="bold" fontFamily="monospace">
            {runeNumber || 'R'}
          </text>
        </svg>
      );
    }

    // ── 珠寶 / 彩虹刻面 (Jewel) ──
    if (slot === 'jewel' || n.includes('珠寶') || n.includes('刻面') || n.includes('facet')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" fill="#3b0764" stroke="#c084fc" strokeWidth="1.5" />
          <polygon points="24,10 36,17 36,31 24,38 12,31 12,17" fill="#581c87" stroke="#f472b6" strokeWidth="1" />
          <circle cx="24" cy="24" r="4" fill="#e879f9" />
          <line x1="24" y1="4" x2="24" y2="44" stroke="#e879f9" strokeWidth="0.8" opacity="0.5" />
          <line x1="6" y1="14" x2="42" y2="34" stroke="#e879f9" strokeWidth="0.8" opacity="0.5" />
          <line x1="6" y1="34" x2="42" y2="14" stroke="#e879f9" strokeWidth="0.8" opacity="0.5" />
        </svg>
      );
    }

    // ── 護身符 (Charms) ──
    if (slot === 'charm' || n.includes('護身符') || n.includes('毀滅') || n.includes('火炬') || n.includes('破免') || n.includes('charm')) {
      if (n.includes('火炬') || n.includes('torch')) {
        // 地獄火炬 Torch
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
            <path d="M20,38 L28,38 L26,44 L22,44 Z" fill="#78350f" />
            <path d="M18,18 L30,18 L26,38 L22,38 Z" fill="#b45309" stroke="#d97706" strokeWidth="1" />
            {/* 火焰 */}
            <path d="M24,4 C27,10 34,12 32,18 C30,22 26,20 24,18 C22,20 18,22 16,18 C14,12 21,10 24,4 Z" fill="#ef4444" />
            <path d="M24,8 C25,12 29,13 28,17 C27,19 25,18 24,17 C23,18 21,19 20,17 C19,13 23,12 24,8 Z" fill="#f59e0b" />
            <circle cx="24" cy="15" r="2" fill="#fef08a" />
          </svg>
        );
      }
      if (n.includes('毀滅') || n.includes('anni')) {
        // 毀滅小符
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
            <rect x="15" y="10" width="18" height="28" rx="2" fill="#18181b" stroke="#a855f7" strokeWidth="1.5" />
            <circle cx="24" cy="20" r="5" fill="#7e22ce" stroke="#d8b4fe" strokeWidth="1" />
            <path d="M21,27 L27,27 L25,32 L23,32 Z" fill="#c084fc" />
          </svg>
        );
      }
      // 超大護身符 / 破免石板
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <rect x="16" y="6" width="16" height="36" rx="3" fill="#292524" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="20" y1="12" x2="28" y2="12" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="18" x2="28" y2="18" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" />
          <line x1="20" y1="24" x2="28" y2="24" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" />
          <line x1="20" y1="30" x2="28" y2="30" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" />
          <line x1="20" y1="36" x2="28" y2="36" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }

    // ── 戒指 (Ring) ──
    if (slot === 'ring' || n.includes('戒指') || n.includes('ring') || n.includes('喬丹') || n.includes('烏鴉') || n.includes('婚戒')) {
      const gemColor = n.includes('喬丹') ? '#38bdf8' : n.includes('烏鴉') ? '#e0f2fe' : n.includes('婚戒') ? '#ef4444' : '#f59e0b';
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <ellipse cx="24" cy="27" rx="14" ry="12" stroke="#d97706" strokeWidth="3" fill="none" />
          <ellipse cx="24" cy="27" rx="11" ry="9" stroke="#78350f" strokeWidth="1" fill="#1c1917" />
          {/* 寶石底座與戒面寶石 */}
          <polygon points="20,12 28,12 26,17 22,17" fill="#d97706" />
          <polygon points="21,7 27,7 29,12 24,15 19,12" fill={gemColor} stroke="#ffffff" strokeWidth="0.8" />
        </svg>
      );
    }

    // ── 項鍊 (Amulet) ──
    if (slot === 'amulet' || n.includes('項鍊') || n.includes('amulet') || n.includes('馬拉') || n.includes('大君') || n.includes('萬花筒')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          {/* 金項圈弧線 */}
          <path d="M12,10 Q24,28 36,10" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="24" cy="23" r="2" fill="#f59e0b" />
          {/* 墜飾 */}
          <polygon points="24,24 31,31 24,40 17,31" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="24" cy="32" r="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.6" />
        </svg>
      );
    }

    // ── 頭盔 (Helm) ──
    if (slot === 'helm' || n.includes('頭盔') || n.includes('冠') || n.includes('面甲') || n.includes('軍帽') || n.includes('獅鷲') || n.includes('shako') || n.includes('diadem')) {
      if (n.includes('軍帽') || n.includes('shako')) {
        // 經典綠軍帽
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
            <path d="M12,28 C12,14 36,14 36,28 L38,34 L10,34 Z" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
            <path d="M8,34 L40,34 L36,38 L12,38 Z" fill="#166534" stroke="#22c55e" strokeWidth="1" />
            <ellipse cx="24" cy="22" rx="4" ry="3" fill="#14532d" />
          </svg>
        );
      }
      if (n.includes('獅鷲') || n.includes('diadem') || n.includes('王冠') || n.includes('crown')) {
        // 金色寶石皇冠/三叉冠
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
            <path d="M10,34 L10,20 L16,26 L24,12 L32,26 L38,20 L38,34 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
            <circle cx="24" cy="14" r="2.5" fill="#38bdf8" />
            <circle cx="10" cy="20" r="1.5" fill="#ef4444" />
            <circle cx="38" cy="20" r="1.5" fill="#ef4444" />
            <rect x="12" y="30" width="24" height="4" fill="#78350f" />
          </svg>
        );
      }
      // 重盔十字面甲
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <path d="M14,18 C14,10 34,10 34,18 L36,36 L30,42 L18,42 L12,36 Z" fill="#3f3f46" stroke="#a1a1aa" strokeWidth="1.5" />
          {/* 面甲十字縫 */}
          <line x1="16" y1="24" x2="32" y2="24" stroke="#18181b" strokeWidth="3" />
          <line x1="24" y1="20" x2="24" y2="34" stroke="#18181b" strokeWidth="2.5" />
          <path d="M18,12 Q24,6 30,12" stroke="#d97706" strokeWidth="1.5" fill="none" />
        </svg>
      );
    }

    // ── 盾牌 (Shield) ──
    if (slot === 'shield' || n.includes('盾') || n.includes('shield') || n.includes('統治者') || n.includes('飾金') || n.includes('撒卡蘭姆')) {
      const isPaladinShield = n.includes('撒卡蘭姆') || n.includes('飾金') || n.includes('神聖');
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <path d="M12,10 L36,10 L36,24 C36,34 24,42 24,42 C24,42 12,34 12,24 Z" fill="#27272a" stroke={colorConfig.accent} strokeWidth="2" />
          {isPaladinShield ? (
            // 聖騎士金色十字
            <>
              <line x1="24" y1="14" x2="24" y2="34" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
              <line x1="17" y1="20" x2="31" y2="20" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            // 暴風/統治者符文徽章
            <>
              <circle cx="24" cy="22" r="7" stroke="#71717a" strokeWidth="1.5" fill="#18181b" />
              <circle cx="24" cy="22" r="3" fill="#38bdf8" />
            </>
          )}
        </svg>
      );
    }

    // ── 衣服 / 鎧甲 (Armor) ──
    if (slot === 'armor' || n.includes('甲') || n.includes('衣服') || n.includes('armor') || n.includes('謎團') || n.includes('剛毅') || n.includes('執政官') || n.includes('法袍')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          {/* 胸甲輪廓 */}
          <path d="M16,8 L20,14 L28,14 L32,8 L40,16 L36,26 L34,40 L14,40 L12,26 L8,16 Z" fill="#27272a" stroke={colorConfig.accent} strokeWidth="1.5" />
          {/* 護心鏡與線條 */}
          <path d="M20,16 L28,16 L26,28 L22,28 Z" fill="#3f3f46" stroke="#71717a" strokeWidth="1" />
          <line x1="14" y1="34" x2="34" y2="34" stroke="#71717a" strokeWidth="1" />
          <circle cx="24" cy="22" r="2" fill={colorConfig.accent} />
        </svg>
      );
    }

    // ── 手套 (Gloves) ──
    if (slot === 'gloves' || n.includes('手套') || n.includes('gloves') || n.includes('法拳') || n.includes('卓古拉')) {
      const flame = n.includes('法拳') || n.includes('magefist');
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <path d="M14,18 L18,10 L22,12 L26,8 L30,11 L34,14 L34,36 L14,36 Z" fill="#3f3f46" stroke={colorConfig.accent} strokeWidth="1.5" />
          {flame ? (
            <path d="M20,24 Q24,16 26,22 Q28,18 30,26 Z" fill="#f97316" />
          ) : (
            <line x1="16" y1="30" x2="32" y2="30" stroke="#71717a" strokeWidth="1.5" />
          )}
        </svg>
      );
    }

    // ── 靴子 (Boots) ──
    if (slot === 'boots' || n.includes('靴') || n.includes('鞋') || n.includes('boots') || n.includes('旅者') || n.includes('蝕肉')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <path d="M16,8 L28,8 L28,26 L38,32 L38,40 L14,40 L14,14 Z" fill="#3f3f46" stroke={colorConfig.accent} strokeWidth="1.5" />
          <line x1="14" y1="36" x2="38" y2="36" stroke="#71717a" strokeWidth="1.5" />
          <path d="M16,14 L28,14" stroke="#71717a" strokeWidth="1" />
          <circle cx="22" cy="26" r="2" fill={colorConfig.accent} />
        </svg>
      );
    }

    // ── 腰帶 (Belt) ──
    if (slot === 'belt' || n.includes('腰帶') || n.includes('束帶') || n.includes('belt') || n.includes('蛛網') || n.includes('雷神')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <rect x="6" y="16" width="36" height="16" rx="3" fill="#27272a" stroke="#71717a" strokeWidth="1.5" />
          <rect x="18" y="13" width="12" height="22" rx="2" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="22" y="17" width="4" height="14" fill="#18181b" />
          <circle cx="11" cy="24" r="2" fill={colorConfig.accent} />
          <circle cx="37" cy="24" r="2" fill={colorConfig.accent} />
        </svg>
      );
    }

    // ── 武器：連枷 / 釘頭槌 (Flail / Mace) ──
    if (n.includes('連枷') || n.includes('flail') || n.includes('橡樹') || n.includes('釘頭槌')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          {/* 木柄 */}
          <line x1="10" y1="38" x2="26" y2="22" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          {/* 鎖鏈 */}
          <path d="M26,22 Q32,20 34,14" stroke="#a1a1aa" strokeWidth="1.5" fill="none" strokeDasharray="2 1" />
          {/* 帶刺流星鐵球 */}
          <circle cx="36" cy="12" r="6" fill="#3f3f46" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="36" y1="4" x2="36" y2="8" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="42" y1="12" x2="46" y2="12" stroke="#fbbf24" strokeWidth="1.5" />
        </svg>
      );
    }

    // ── 武器：弓 / 十字弓 (Bow / Crossbow) ──
    if (n.includes('弓') || n.includes('bow') || n.includes('弩') || n.includes('crossbow') || n.includes('信心') || n.includes('風之力')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <path d="M12,6 Q36,24 12,42" stroke="#b45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <line x1="12" y1="6" x2="12" y2="42" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="1 1" />
          {/* 箭矢 */}
          <line x1="8" y1="24" x2="38" y2="24" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="38,24 32,21 34,24 32,27" fill="#fbbf24" />
        </svg>
      );
    }

    // ── 武器：標槍 (Javelin) ──
    if (n.includes('標槍') || n.includes('javelin') || n.includes('泰坦') || n.includes('雷霆')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <line x1="8" y1="40" x2="38" y2="10" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="42,6 34,10 38,14" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />
          {/* 閃電符紋 */}
          <path d="M22,26 L26,22 L24,24 L28,20" stroke="#facc15" strokeWidth="1.5" fill="none" />
        </svg>
      );
    }

    // ── 武器：法杖 / 短杖 (Staff / Wand) ──
    if (n.includes('杖') || n.includes('wand') || n.includes('staff') || n.includes('死亡之網') || n.includes('次元')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <line x1="10" y1="40" x2="32" y2="16" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="36" cy="12" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M30,18 Q36,6 42,12" stroke="#d97706" strokeWidth="1.5" fill="none" />
        </svg>
      );
    }

    // ── 武器：劍 / 悔恨 / 幻化之刃 / 水晶劍 (Sword / Blade) ──
    if (slot === 'weapon' || n.includes('劍') || n.includes('blade') || n.includes('sword') || n.includes('悔恨') || n.includes('精神') || n.includes('武器')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          {/* 劍刃 */}
          <path d="M14,34 L34,14 L38,10 L34,6 L30,10 L10,30 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          {/* 劍脊 */}
          <line x1="12" y1="32" x2="34" y2="10" stroke="#64748b" strokeWidth="1" />
          {/* 十字護手 */}
          <line x1="8" y1="28" x2="16" y2="36" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
          {/* 劍柄與劍首 */}
          <line x1="10" y1="34" x2="6" y2="38" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="5" cy="39" r="2" fill="#fbbf24" />
        </svg>
      );
    }

    // ── 鑰匙 (Keys) ──
    if (n.includes('鑰匙') || n.includes('key')) {
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <circle cx="16" cy="18" r="8" stroke="#fbbf24" strokeWidth="2" fill="#78350f" />
          <circle cx="16" cy="18" r="4" fill="#18181b" />
          <line x1="22" y1="24" x2="38" y2="40" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="34" x2="36" y2="30" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="36" y1="38" x2="40" y2="34" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }

    // ── 精華 (Essence) ──
    if (n.includes('精華') || n.includes('essence') || n.includes('赦免') || n.includes('token')) {
      const essenceColor = n.includes('扭曲') ? '#38bdf8' : n.includes('苦痛') ? '#facc15' : n.includes('充沛') ? '#ef4444' : '#10b981';
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <circle cx="24" cy="24" r="14" fill="#18181b" stroke={essenceColor} strokeWidth="2" />
          <circle cx="24" cy="24" r="9" fill={essenceColor} opacity="0.4" />
          <circle cx="22" cy="20" r="4" fill="#ffffff" opacity="0.8" />
          <path d="M16,30 Q24,36 32,30" stroke={essenceColor} strokeWidth="1.5" fill="none" />
        </svg>
      );
    }

    // ── 藥水 (Potions) ──
    if (n.includes('藥劑') || n.includes('藥水') || n.includes('potion')) {
      const potColor = n.includes('融冰') ? '#38bdf8' : n.includes('解毒') ? '#22c55e' : '#a855f7';
      return (
        <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
          <rect x="21" y="8" width="6" height="6" fill="#78350f" />
          <path d="M19,14 L29,14 L36,36 C36,40 32,42 24,42 C16,42 12,40 12,36 Z" fill="#1c1917" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M14,24 Q24,28 34,24 L34,36 C34,39 30,40 24,40 C18,40 14,39 14,36 Z" fill={potColor} />
          <ellipse cx="20" cy="30" rx="2" ry="4" fill="#ffffff" opacity="0.5" />
        </svg>
      );
    }

    // ── 預設通用聖物 / 寶箱圖示 ──
    return (
      <svg viewBox="0 0 48 48" className="w-full h-full p-1" fill="none">
        <polygon points="24,6 40,18 40,36 24,44 8,36 8,18" fill="#27272a" stroke={colorConfig.accent} strokeWidth="1.5" />
        <circle cx="24" cy="24" r="6" fill="#71717a" stroke="#ffffff" strokeWidth="1" />
        <line x1="24" y1="6" x2="24" y2="44" stroke={colorConfig.accent} strokeWidth="1" opacity="0.4" />
      </svg>
    );
  };

  return (
    <div
      className={`relative ${containerSize} rounded-xl flex items-center justify-center shrink-0 transition-all select-none overflow-hidden ${
        showBorder ? `border ${colorConfig.border} shadow-lg ${colorConfig.glow} bg-gradient-to-br ${colorConfig.bg}` : ''
      } ${className}`}
      title={name ? `${name} ${baseItem ? `(${baseItem})` : ''}` : undefined}
    >
      {renderItemArt()}
    </div>
  );
};
