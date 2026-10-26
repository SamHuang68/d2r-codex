/**
 * 傭兵寶典圖像與名將長官解析模組 (Mercenary Visual Assets Resolver)
 * 提供 Act 1 - Act 5 四大章節傭兵的原版肖像、招募長官與定位標籤。
 */

export interface MercenaryVisualInfo {
  image: string;
  captainImage?: string;
  nameZh: string;
  nameEn: string;
  captainZh: string;
  captainEn: string;
  locationZh: string;
  locationEn: string;
  roleTagZh: string;
  roleTagEn: string;
}

const MERC_VISUAL_MAP: Record<string, MercenaryVisualInfo> = {
  act1_rogue: {
    image: 'images/mercenaries/act1_rogue.jpg',
    captainImage: 'images/mercenaries/act1_rogue.jpg',
    nameZh: '俠盜斥候 (羅格弓手)',
    nameEn: 'Rogue Scout (Archer)',
    captainZh: '卡夏 (Kashya)',
    captainEn: 'Kashya',
    locationZh: '第一章：俠盜營地',
    locationEn: 'Act I: Rogue Encampment',
    roleTagZh: '遠程物理 / 冰火元素減速',
    roleTagEn: 'Ranged Phys / Cold-Fire Slow',
  },
  act2_desert: {
    image: 'images/mercenaries/kaelan.gif',
    captainImage: 'images/mercenaries/act2_desert.gif',
    nameZh: '沙漠守衛 (槍兵 / 米山)',
    nameEn: 'Desert Mercenary (Spearman)',
    captainZh: '格雷茲 (Greiz)',
    captainEn: 'Greiz',
    locationZh: '第二章：魯高因',
    locationEn: 'Act II: Lut Gholein',
    roleTagZh: '近戰光環核心 / 破免回魔神器',
    roleTagEn: 'Aura Carrier / Infinity & Insight',
  },
  act3_ironwolf: {
    image: 'images/mercenaries/act3_ironwolf.gif',
    captainImage: 'images/mercenaries/asheara.png',
    nameZh: '鐵狼衛士 (元素戰士)',
    nameEn: 'Iron Wolf (Battle Mage)',
    captainZh: '艾席拉 (Asheara)',
    captainEn: 'Asheara',
    locationZh: '第三章：庫拉斯特港口',
    locationEn: 'Act III: Kurast Docks',
    roleTagZh: '元素法術轟炸 / 劍盾防護',
    roleTagEn: 'Elemental Caster / Sword & Shield',
  },
  act5_barbarian: {
    image: 'images/mercenaries/act5_barbarian.gif',
    captainImage: 'images/mercenaries/qual_kehk.gif',
    nameZh: '亞瑞特野蠻人戰士',
    nameEn: 'Barbarian Warrior',
    captainZh: '夸爾凱克 (Qual-Kehk)',
    captainEn: 'Qual-Kehk',
    locationZh: '第五章：哈洛加斯',
    locationEn: 'Act V: Harrogath',
    roleTagZh: '狂暴雙揮戰神 / 物理粉碎重擊',
    roleTagEn: 'Frenzy Dual-Wield / Crushing Blow',
  },
};

/**
 * 取得指定章節傭兵的視覺與長官資料
 */
export function getMercenaryVisual(actId: string): MercenaryVisualInfo {
  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = env.endsWith('/') ? env : `${env}/`;

  const info = MERC_VISUAL_MAP[actId] || MERC_VISUAL_MAP.act2_desert;

  return {
    ...info,
    image: `${baseUrl}${info.image}`,
    captainImage: info.captainImage ? `${baseUrl}${info.captainImage}` : undefined,
  };
}
