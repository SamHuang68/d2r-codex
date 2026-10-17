import { AreaLevelData } from '../types';

export const AREA_LEVELS_DATA: AreaLevelData[] = [
  // ── 第一章 (Act 1) ──
  {
    act: 1,
    name: "大陵寢",
    nameEn: "The Mausoleum",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["閃電免疫 (Lightning)"],
    chestsAndBosses: "埋骨地血烏身旁，只有閃電免疫怪物，極適合純冰法與火法清場，有金箱子。"
  },
  {
    act: 1,
    name: "大陵墓",
    nameEn: "The Crypt",
    areaLevel: 83,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["毒素免疫 (Poison)", "閃電免疫 (Lightning)"]
  },
  {
    act: 1,
    name: "地穴 第 1 層",
    nameEn: "The Pit Level 1",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["火焰免疫", "冰寒免疫", "閃電免疫 (偶爾)"],
    chestsAndBosses: "泰摩高地地下，全遊戲最受歡迎的打寶聖地，怪物密度極高且血量偏低。"
  },
  {
    act: 1,
    name: "地穴 第 2 層",
    nameEn: "The Pit Level 2",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["火焰免疫", "冰寒免疫"],
    chestsAndBosses: "底層必有金色璀璨寶箱與 2-3 隊精英金怪。"
  },

  // ── 第二章 (Act 2) ──
  {
    act: 2,
    name: "古代通道",
    nameEn: "Ancient Tunnels",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["閃電免疫", "火焰免疫", "毒素免疫"],
    chestsAndBosses: "失落城市地下，完全沒有原生冰寒免疫怪物！純冰暴風雪法師的首選天堂。"
  },
  {
    act: 2,
    name: "蛆蟲巢穴 第 3 層",
    nameEn: "Maggot Lair Level 3",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["毒素免疫", "物理免疫 (偶爾)"],
    chestsAndBosses: "鑽地蟲冰蟲固守處，通道狹窄，適合刺客陷阱或骨矛穿刺。"
  },
  {
    act: 2,
    name: "神秘避難所",
    nameEn: "Arcane Sanctuary",
    areaLevel: 79,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["物理免疫 (幽靈)", "火焰免疫"],
    chestsAndBosses: "召喚者所在地，幽靈怪 (Ghosts) 掉落高級符文的權重大幅高於一般怪物！"
  },

  // ── 第三章 (Act 3) ──
  {
    act: 3,
    name: "下水道 第 2 層",
    nameEn: "Sewers Level 2",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["毒素免疫", "火焰免疫"],
    chestsAndBosses: "庫拉斯特下水道深處，設有輝煌金箱子。"
  },
  {
    act: 3,
    name: "被遺忘的寺院",
    nameEn: "Forgotten Temple",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["冰寒免疫", "火焰免疫", "閃電免疫"],
    chestsAndBosses: "上庫拉斯特地下寺廟，怪物極度密集且凶狠，適合頂級裝備角色刷寶。"
  },
  {
    act: 3,
    name: "殘破的寺院",
    nameEn: "Ruined Fane",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["冰寒免疫", "火焰免疫", "閃電免疫"]
  },
  {
    act: 3,
    name: "憎恨的牢房 第 3 層",
    nameEn: "Durance of Hate Level 3",
    areaLevel: 83,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["火焰免疫", "閃電免疫"],
    chestsAndBosses: "墨菲斯托 (勞模) 固守處，周遭有瘸子議會成員與血河隔絕，經典隔岸卡位刷寶地。"
  },

  // ── 第四章 (Act 4) ──
  {
    act: 4,
    name: "混沌避難所 (暗黑殿堂)",
    nameEn: "The Chaos Sanctuary",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["火焰免疫 (深淵騎士)", "冰寒免疫 (指環鬼)", "閃電免疫 (暴風法師)"],
    chestsAndBosses: "五處封印解鎖召喚迪亞布羅 (Diablo)，全遊戲密度最高、掉寶期望值最高的核心戰場。"
  },
  {
    act: 4,
    name: "火焰之河",
    nameEn: "River of Flame",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["火焰免疫", "毒素免疫"],
    chestsAndBosses: "包含海法斯特盔甲製作者 (鐵匠) 守護地獄熔爐，以及通往混沌避難所的寬闊道路。"
  },

  // ── 第五章 (Act 5) ──
  {
    act: 5,
    name: "世界之石要塞 第 1 層",
    nameEn: "Worldstone Keep Level 1",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["各類混合免疫"],
    chestsAndBosses: "危險性極高，隨機刷新狂暴牛頭怪與黑魂 (Black Souls)。"
  },
  {
    act: 5,
    name: "世界之石要塞 第 2 層",
    nameEn: "Worldstone Keep Level 2",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["各類混合免疫"],
    chestsAndBosses: "通往要塞第 3 層的必經樞紐，怪物密集。"
  },
  {
    act: 5,
    name: "世界之石要塞 第 3 層",
    nameEn: "Worldstone Keep Level 3",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["各類混合免疫"],
    chestsAndBosses: "直通毀滅王座。"
  },
  {
    act: 5,
    name: "毀滅王座",
    nameEn: "Throne of Destruction",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["各波次不同 (五波僕從)"],
    chestsAndBosses: "巴爾召喚五波強大精英隨從，練級 99 級必刷點。"
  },
  {
    act: 5,
    name: "瓦特之廳 (尼拉塞克神殿)",
    nameEn: "Halls of Vaught",
    areaLevel: 83,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["冰寒免疫", "毒素免疫"],
    chestsAndBosses: "尼拉塞克固守處，掉落毀滅之鑰 (Key of Destruction)，注意防禦屍體爆炸 (CE)。"
  }
];
