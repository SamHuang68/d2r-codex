import React, { useState } from 'react';
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
 * 聖休亞瑞暗黑物品真實遊戲立繪圖片解析與渲染引擎
 * 採用遊戲原版真實提取物品貼圖（Sprites），結合復古像素銳化渲染
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
  const [imgError, setImgError] = useState(false);
  const n = `${name} ${nameEn} ${baseItem}`.toLowerCase();
  const envBase = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = envBase.endsWith('/') ? envBase : `${envBase}/`;

  // 1. 決定尺寸類別
  const sizeMap = {
    xs: 'w-5 h-5 min-w-[20px] min-h-[20px]',
    sm: 'w-7 h-7 min-w-[28px] min-h-[28px]',
    md: 'w-10 h-10 min-w-[40px] min-h-[40px]',
    lg: 'w-14 h-14 min-w-[56px] min-h-[56px]',
    xl: 'w-20 h-20 min-w-[80px] min-h-[80px]',
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  // 2. 決定稀有度光暈色彩
  const getColors = () => {
    if (rarity === 'set' || n.includes('套裝') || n.includes('tal rasha') || n.includes('immortal king') || n.includes('natalya') || n.includes('guillaume')) {
      return {
        border: 'border-emerald-500/60 hover:border-emerald-400',
        bg: 'bg-emerald-950/40',
        glow: 'shadow-emerald-950/40',
        accent: '#10b981',
      };
    }
    if (rarity === 'rune' || runeNumber !== undefined || n.includes('符文') || n.includes('runeword') || rarity === 'runeword') {
      return {
        border: 'border-amber-500/70 hover:border-amber-400',
        bg: 'bg-amber-950/40',
        glow: 'shadow-amber-950/40',
        accent: '#f59e0b',
      };
    }
    if (rarity === 'magic' || n.includes('魔法') || n.includes('藍色')) {
      return {
        border: 'border-sky-500/60 hover:border-sky-400',
        bg: 'bg-sky-950/40',
        glow: 'shadow-sky-950/40',
        accent: '#38bdf8',
      };
    }
    if (rarity === 'rare' || n.includes('亮金')) {
      return {
        border: 'border-yellow-400/70 hover:border-yellow-300',
        bg: 'bg-yellow-950/40',
        glow: 'shadow-yellow-950/40',
        accent: '#facc15',
      };
    }
    // 預設暗金 (Unique)
    return {
      border: 'border-amber-600/70 hover:border-d2-unique',
      bg: 'bg-stone-950/60',
      glow: 'shadow-amber-900/30',
      accent: '#c79b32',
    };
  };

  const colorConfig = getColors();

  // 3. 智能解析遊戲真實物品圖片路徑
  const resolveActualImagePath = (): string => {
    // ── 符文 (1-33#) ──
    const runeMap: Record<string, number> = {
      '艾爾': 1, 'el': 1, '艾德': 2, 'eld': 2, '特爾': 3, 'tir': 3, '奈夫': 4, 'nef': 4,
      '愛斯': 5, 'eth': 5, '伊蘇': 6, 'ith': 6, '塔爾': 7, 'tal': 7, '拉爾': 8, 'ral': 8,
      '歐特': 9, 'ort': 9, '書爾': 10, 'thul': 10, '安姆': 11, 'amn': 11, '索爾': 12, 'sol': 12,
      '夏': 13, 'shael': 13, '多爾': 14, 'dol': 14, '海爾': 15, 'hel': 15, '埃歐': 16, 'io': 16,
      '盧姆': 17, 'lum': 17, '科': 18, 'ko': 18, '法爾': 19, 'fal': 19, '藍姆': 20, 'lem': 20,
      '普爾': 21, 'pul': 21, '烏姆': 22, 'um': 22, '馬爾': 23, 'mal': 23, '伊斯特': 24, 'ist': 24,
      '古爾': 25, 'gul': 25, '伐克斯': 26, 'vex': 26, '歐姆': 27, 'ohm': 27, '羅': 28, 'lo': 28,
      '瑟': 29, 'sur': 29, '貝': 30, 'ber': 30, '喬': 31, 'jah': 31, '查姆': 32, 'cham': 32,
      '薩德': 33, 'zod': 33,
    };

    let targetRuneNum = runeNumber;
    if (targetRuneNum === undefined && (rarity === 'rune' || n.includes('符文') || n.includes('rune'))) {
      for (const [key, num] of Object.entries(runeMap)) {
        if (n.includes(key)) {
          targetRuneNum = num;
          break;
        }
      }
    }
    if (targetRuneNum !== undefined && targetRuneNum >= 1 && targetRuneNum <= 33) {
      return `${baseUrl}images/items/runes/r${String(targetRuneNum).padStart(2, '0')}.png`;
    }

    // ── 特殊道具、聖物、精華、方塊、藥劑 ──
    if (n.includes('方塊') || n.includes('cube') || n.includes('horadric')) {
      return `${baseUrl}images/items/props/horadric_cube.gif`;
    }
    if (n.includes('赦免') || n.includes('洗點') || n.includes('token') || n.includes('absolution')) {
      return `${baseUrl}images/items/props/token_of_absolution.jpg`;
    }
    if (n.includes('精華') || n.includes('essence')) {
      return `${baseUrl}images/items/props/essences.png`;
    }
    if (n.includes('鑰匙') || n.includes('恐懼之鑰') || n.includes('憎恨之鑰') || n.includes('毀滅之鑰') || n.includes('key of')) {
      return `${baseUrl}images/items/props/uber_key.gif`;
    }
    if (n.includes('角') || n.includes('暗黑破壞神之角') || n.includes('horn')) {
      return `${baseUrl}images/items/props/diablo_horn.gif`;
    }
    if (n.includes('眼') || n.includes('巴爾之眼') || n.includes('baal\'s eye')) {
      return `${baseUrl}images/items/props/baal_eye.gif`;
    }
    if (n.includes('腦') || n.includes('墨菲斯托之腦') || n.includes('mephisto\'s brain')) {
      return `${baseUrl}images/items/props/mephisto_brain.gif`;
    }
    if (n.includes('紅寶石') || n.includes('ruby')) {
      return `${baseUrl}images/items/props/perfect_ruby.gif`;
    }
    if (n.includes('藍寶石') || n.includes('sapphire')) {
      return `${baseUrl}images/items/props/perfect_sapphire.gif`;
    }
    if (n.includes('黃寶石') || n.includes('topaz')) {
      return `${baseUrl}images/items/props/perfect_topaz.gif`;
    }
    if (n.includes('綠寶石') || n.includes('emerald')) {
      return `${baseUrl}images/items/props/perfect_emerald.gif`;
    }
    if (n.includes('鑽石') || n.includes('diamond')) {
      return `${baseUrl}images/items/props/perfect_diamond.gif`;
    }
    if (n.includes('紫寶石') || n.includes('amethyst')) {
      return `${baseUrl}images/items/props/perfect_amethyst.gif`;
    }
    if (n.includes('骷髏') || n.includes('skull')) {
      return `${baseUrl}images/items/props/perfect_skull.gif`;
    }
    if (n.includes('全面恢復') || n.includes('大紫') || n.includes('rejuvenation')) {
      return `${baseUrl}images/items/props/full_rejuvenation.gif`;
    }
    if (n.includes('生命藥劑') || n.includes('大紅') || n.includes('healing')) {
      return `${baseUrl}images/items/props/super_healing.gif`;
    }
    if (n.includes('法力藥劑') || n.includes('大藍') || n.includes('mana potion')) {
      return `${baseUrl}images/items/props/super_mana.gif`;
    }

    // ── 護身符與珠寶 ──
    if (n.includes('毀滅') || n.includes('anni') || n.includes('annihilus')) {
      return `${baseUrl}images/items/charms/anni.gif`;
    }
    if (n.includes('火炬') || n.includes('torch') || n.includes('hellfire')) {
      return `${baseUrl}images/items/charms/torch.jpg`;
    }
    if (n.includes('破免') || n.includes('碎焰') || n.includes('破火') || n.includes('折雷') || n.includes('破電') || n.includes('寒骨') || n.includes('破冰') || n.includes('腐毒') || n.includes('破毒') || n.includes('破滅') || n.includes('黑結晶') || n.includes('破物') || n.includes('基德') || n.includes('gheed') || n.includes('超大護身符') || n.includes('技能板')) {
      return `${baseUrl}images/items/charms/gheeds.gif`;
    }
    if (n.includes('彩虹刻面') || n.includes('facet') || n.includes('rainbow')) {
      if (n.includes('冰') || n.includes('cold')) return `${baseUrl}images/items/jewels/cold.gif`;
      if (n.includes('火') || n.includes('fire')) return `${baseUrl}images/items/jewels/fire.gif`;
      if (n.includes('毒') || n.includes('poison')) return `${baseUrl}images/items/jewels/poison.gif`;
      return `${baseUrl}images/items/jewels/lightning.gif`;
    }
    if (slot === 'jewel' || rarity === 'gem') {
      return `${baseUrl}images/items/jewels/lightning.gif`;
    }

    // ── 經典暗金裝備 (Uniques) ──
    if (n.includes('軍帽') || n.includes('諧角之冠') || n.includes('harlequin') || n.includes('shako')) {
      return `${baseUrl}images/items/uniques/harlequin_crest.gif`;
    }
    if (n.includes('喬丹') || n.includes('stone of jordan') || n.includes('soj')) {
      return `${baseUrl}images/items/uniques/the_stone_of_jordan.gif`;
    }
    if (n.includes('烏鴉之霜') || n.includes('raven frost')) {
      return `${baseUrl}images/items/uniques/raven_frost.gif`;
    }
    if (n.includes('布爾凱索') || n.includes('bul-kathos') || n.includes('wedding band')) {
      return `${baseUrl}images/items/uniques/bul_kathos_wedding_band.gif`;
    }
    if (n.includes('馬拉') || n.includes('mara') || n.includes('kaleidoscope')) {
      return `${baseUrl}images/items/uniques/maras_kaleidoscope.gif`;
    }
    if (n.includes('大君') || n.includes('highlord')) {
      return `${baseUrl}images/items/uniques/highlords_wrath.gif`;
    }
    if (n.includes('年紀之冠') || n.includes('crown of ages') || n.includes('coa')) {
      return `${baseUrl}images/items/uniques/crown_of_ages.gif`;
    }
    if (n.includes('夜翼') || n.includes('nightwing')) {
      return `${baseUrl}images/items/uniques/nightwings_veil.gif`;
    }
    if (n.includes('巨骷髏') || n.includes('giant skull')) {
      return `${baseUrl}images/items/uniques/giant_skull.gif`;
    }
    if (n.includes('暴風之盾') || n.includes('stormshield')) {
      return `${baseUrl}images/items/uniques/stormshield.gif`;
    }
    if (n.includes('飾金盾') || n.includes('撒卡蘭姆') || n.includes('zakarum')) {
      return `${baseUrl}images/items/uniques/herald_of_zakarum.gif`;
    }
    if (n.includes('蛛網') || n.includes('arachnid')) {
      return `${baseUrl}images/items/uniques/arachnid_mesh.gif`;
    }
    if (n.includes('雷神') || n.includes('thundergod')) {
      return `${baseUrl}images/items/uniques/thundergods_vigor.gif`;
    }
    if (n.includes('戰旅') || n.includes('戰爭旅者') || n.includes('war traveler')) {
      return `${baseUrl}images/items/uniques/war_traveler.gif`;
    }
    if (n.includes('蝕肉') || n.includes('gore rider')) {
      return `${baseUrl}images/items/uniques/gore_rider.gif`;
    }
    if (n.includes('法師之拳') || n.includes('magefist')) {
      return `${baseUrl}images/items/uniques/magefist.gif`;
    }
    if (n.includes('獅鷲') || n.includes('格利風') || n.includes('griffon')) {
      return `${baseUrl}images/items/bases/diadem.gif`;
    }
    if (n.includes('眼球') || n.includes('oculus')) {
      return `${baseUrl}images/items/bases/the_oculus.gif`;
    }
    if (n.includes('泰坦') || n.includes('titan')) {
      return `${baseUrl}images/items/bases/titans_revenge.gif`;
    }
    if (n.includes('亞瑞特') || n.includes('arreat')) {
      return `${baseUrl}images/items/bases/arreats_face.gif`;
    }
    if (n.includes('巴特克') || n.includes('bartuc')) {
      return `${baseUrl}images/items/bases/bartucs_cutthroat.gif`;
    }
    if (n.includes('侏儒') || n.includes('homunculus')) {
      return `${baseUrl}images/items/bases/homunculus.gif`;
    }
    if (n.includes('死亡之網') || n.includes('破隱') || n.includes('death\'s web')) {
      return `${baseUrl}images/items/bases/bonewand.gif`;
    }
    if (n.includes('安達利爾') || n.includes('andariel')) {
      return `${baseUrl}images/items/bases/demonhead.gif`;
    }

    // ── 套裝裝備 (Sets) ──
    if (n.includes('塔拉夏') || n.includes('tal rasha')) {
      if (n.includes('護甲') || n.includes('守護') || n.includes('漆甲') || n.includes('guard')) return `${baseUrl}images/items/sets/talrashas_guardianship.gif`;
      if (n.includes('面甲') || n.includes('頭盔') || n.includes('crest')) return `${baseUrl}images/items/sets/talrashas_horadric_crest.gif`;
      if (n.includes('腰帶') || n.includes('織帶') || n.includes('cloth')) return `${baseUrl}images/items/sets/talrashas_fine_spun_cloth.gif`;
      if (n.includes('法杖') || n.includes('渦流水晶') || n.includes('eye')) return `${baseUrl}images/items/sets/talrashas_lidless_eye.gif`;
      return `${baseUrl}images/items/sets/amu2.gif`;
    }
    if (n.includes('不朽之王') || n.includes('immortal king')) {
      if (n.includes('靈魂牢籠') || n.includes('神聖鎧甲') || n.includes('cage') || slot === 'chest') return `${baseUrl}images/items/sets/immortal_kings_soul_cage.gif`;
      if (n.includes('意志') || n.includes('復仇者頭盔') || n.includes('will') || slot === 'helm') return `${baseUrl}images/items/sets/immortal_kings_will.gif`;
      if (n.includes('碎石者') || n.includes('食人魔之錘') || n.includes('crusher') || slot === 'weapon') return `${baseUrl}images/items/sets/immortal_kings_stone_crusher.gif`;
      if (n.includes('熔爐') || n.includes('手套') || n.includes('forge') || slot === 'gloves') return `${baseUrl}images/items/sets/immortal_kings_forge.gif`;
      if (n.includes('步態') || n.includes('鞋') || n.includes('pillar') || slot === 'boots') return `${baseUrl}images/items/sets/immortal_kings_pillar.gif`;
      return `${baseUrl}images/items/sets/immortal_kings_detail.gif`;
    }
    if (n.includes('吉永') || n.includes('guillaume')) {
      return `${baseUrl}images/items/bases/greathelm.gif`;
    }

    // ── 符文之語底材與武器防具 (Bases & Runewords) ──
    if (n.includes('悔恨') || n.includes('幻化之刃') || n.includes('phase blade') || n.includes('grief')) {
      return `${baseUrl}images/items/bases/phase_blade.gif`;
    }
    if (n.includes('水晶劍') || n.includes('crystal sword') || (n.includes('精神') && (slot === 'weapon' || n.includes('劍')))) {
      return `${baseUrl}images/items/bases/crystalsword.gif`;
    }
    if (n.includes('連枷') || n.includes('flail') || n.includes('橡樹之心') || n.includes('hoto')) {
      return `${baseUrl}images/items/bases/flail.gif`;
    }
    if (n.includes('統治者大盾') || n.includes('monarch') || (n.includes('精神') && (slot === 'shield' || n.includes('盾')))) {
      return `${baseUrl}images/items/bases/monarch.gif`;
    }
    if (n.includes('執政官') || n.includes('archon plate') || n.includes('謎團') || n.includes('剛毅') || n.includes('enigma') || n.includes('fortitude')) {
      return `${baseUrl}images/items/bases/archon_plate.gif`;
    }
    if (n.includes('法師鎧甲') || n.includes('mage plate') || n.includes('輕型裝甲')) {
      return `${baseUrl}images/items/bases/lightplate.gif`;
    }
    if (n.includes('狂戰士之斧') || n.includes('berserker axe') || n.includes('野獸') || n.includes('末日')) {
      return `${baseUrl}images/items/bases/berserker_axe.gif`;
    }
    if (n.includes('巨神之刃') || n.includes('colossus blade') || n.includes('最後希望')) {
      return `${baseUrl}images/items/bases/colossus_blade.gif`;
    }
    if (n.includes('銳利之斧') || n.includes('thresher') || n.includes('無限') || n.includes('驕傲') || n.includes('巨長斧')) {
      return `${baseUrl}images/items/bases/thresher.gif`;
    }
    if (n.includes('九頭蛇弓') || n.includes('hydra bow') || n.includes('信心') || n.includes('長弓')) {
      return `${baseUrl}images/items/bases/hydra_bow.gif`;
    }
    if (n.includes('神聖小盾') || n.includes('sacred targe') || n.includes('流亡')) {
      return `${baseUrl}images/items/bases/sacred_targe.gif`;
    }
    if (n.includes('權冠') || n.includes('diadem') || n.includes('三重冠')) {
      return `${baseUrl}images/items/bases/diadem.gif`;
    }

    // ── 依裝備部位槽位回退 (Slot Based Fallbacks) ──
    switch (slot) {
      case 'helm':
        return `${baseUrl}images/items/bases/crown.gif`;
      case 'chest':
        return `${baseUrl}images/items/bases/breastplate.gif`;
      case 'weapon':
      case 'mainHand':
        return `${baseUrl}images/items/bases/crystalsword.gif`;
      case 'shield':
      case 'offHand':
        return `${baseUrl}images/items/bases/monarch.gif`;
      case 'gloves':
        return `${baseUrl}images/items/uniques/magefist.gif`;
      case 'boots':
        return `${baseUrl}images/items/uniques/war_traveler.gif`;
      case 'belt':
        return `${baseUrl}images/items/uniques/arachnid_mesh.gif`;
      case 'ring':
      case 'ring1':
      case 'ring2':
        return `${baseUrl}images/items/uniques/the_stone_of_jordan.gif`;
      case 'amulet':
        return `${baseUrl}images/items/uniques/maras_kaleidoscope.gif`;
      case 'charm':
        return `${baseUrl}images/items/charms/anni.gif`;
      default:
        return `${baseUrl}images/items/uniques/harlequin_crest.gif`;
    }
  };

  const imageSrc = resolveActualImagePath();

  return (
    <div
      className={`relative flex items-center justify-center rounded transition-all duration-200 select-none overflow-hidden ${containerSize} ${
        showBorder ? `border ${colorConfig.border} ${colorConfig.bg} ${colorConfig.glow} shadow-sm` : ''
      } ${className}`}
      title={name || nameEn || baseItem}
    >
      {/* 像素暗黑背景網格質感 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

      {/* 遊戲真實貼圖 */}
      {!imgError ? (
        <img
          src={imageSrc}
          alt={name || nameEn || 'Item'}
          className="relative z-10 max-w-full max-h-full object-contain p-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [image-rendering:pixelated] transition-transform duration-200 hover:scale-110"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        /* 降級標籤 (極少情況) */
        <span className="relative z-10 font-bold font-serif text-[10px] text-amber-300/80 uppercase">
          {name ? name.slice(0, 2) : 'D2'}
        </span>
      )}
    </div>
  );
};
