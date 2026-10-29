import { AreaLevelData } from '../types';

export const AREA_LEVELS_DATA: AreaLevelData[] = [
  // ── 第一章 (Act 1) ──
  {
    act: 1,
    name: "大陵墓",
    nameEn: "The Mausoleum",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["閃電免疫 (Lightning)"],
    chestsAndBosses: "埋骨地血鴉身旁，只有閃電免疫怪物，極適合純冰法與火法清場，有金箱子。",
    chestsAndBossesEn: "Next to Blood Raven in Burial Grounds. Light immune only; ideal for Cold & Fire Sorcs. Features a sparkling chest."
  },
  {
    act: 1,
    name: "墓地",
    nameEn: "The Crypt",
    areaLevel: 83,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["閃電免疫 (Lightning)"]
  },
  {
    act: 1,
    name: "地穴 第 1 層",
    nameEn: "The Pit Level 1",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["火焰免疫", "冰寒免疫", "閃電免疫 (偶爾)"],
    chestsAndBosses: "泰摩高地地下，全遊戲最受歡迎的打寶聖地，怪物密度極高且血量偏低。",
    chestsAndBossesEn: "Underground in Tamoe Highland. Sanctuary's most iconic MF haven with dense, fragile monster packs."
  },
  {
    act: 1,
    name: "地穴 第 2 層",
    nameEn: "The Pit Level 2",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["火焰免疫", "冰寒免疫"],
    chestsAndBosses: "底層必有金色璀璨寶箱與 2-3 隊精英金怪。",
    chestsAndBossesEn: "Sparkling golden chest on Level 2 accompanied by 2-3 elite champion packs."
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
    chestsAndBosses: "失落古城地下，完全沒有原生冰寒免疫怪物！純冰暴風雪法師的首選天堂。",
    chestsAndBossesEn: "Beneath the Lost City. Zero native Cold immunes, making it absolute paradise for Blizzard Sorceresses."
  },
  {
    act: 2,
    name: "蛆蟲巢穴 第 3 層",
    nameEn: "Maggot Lair Level 3",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["毒素免疫", "物理免疫 (偶爾)"],
    chestsAndBosses: "鑽地蟲冰蟲固守處，通道狹窄，適合刺客陷阱或骨矛穿刺。",
    chestsAndBossesEn: "Lair of Coldworm the Burrower. Narrow choke points ideal for Trapsins and Bone Spear piercing."
  },
  {
    act: 2,
    name: "秘法聖殿",
    nameEn: "Arcane Sanctuary",
    areaLevel: 79,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["物理免疫 (幽靈)", "火焰免疫"],
    chestsAndBosses: "召喚師所在地，幽靈怪 (Ghosts) 掉落高級符文的權重大幅高於一般怪物！",
    chestsAndBossesEn: "Lair of The Summoner. Ghosts have drastically elevated rune drop tables."
  },

  // ── 第三章 (Act 3) ──
  {
    act: 3,
    name: "下水道 第 2 層",
    nameEn: "Sewers Level 2",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["毒素免疫"],
    chestsAndBosses: "庫拉斯特下水道深處，設有輝煌金箱子。",
    chestsAndBossesEn: "Deep within Kurast Sewers. Contains a glittering golden chest."
  },
  {
    act: 3,
    name: "遺忘神殿",
    nameEn: "Forgotten Temple",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["冰寒免疫", "火焰免疫", "閃電免疫"],
    chestsAndBosses: "庫拉斯特上層地下寺廟，怪物極度密集且凶狠，適合頂級裝備角色刷寶。",
    chestsAndBossesEn: "Underground temple in Upper Kurast. Extremely dense and vicious, rewarding geared champions."
  },
  {
    act: 3,
    name: "荒廢的寺院",
    nameEn: "Ruined Fane",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["冰寒免疫", "火焰免疫", "閃電免疫"]
  },
  {
    act: 3,
    name: "憎恨囚牢 第 3 層",
    nameEn: "Durance of Hate Level 3",
    areaLevel: 83,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["冰寒免疫", "毒素免疫"],
    chestsAndBosses: "墨菲斯托 (勞模) 固守處，周遭有瘸子議會成員與血河隔絕，經典隔岸卡位刷寶地。",
    chestsAndBossesEn: "Lair of Mephisto, separated by the River of Blood for classic moat-tricking."
  },

  // ── 第四章 (Act 4) ──
  {
    act: 4,
    name: "混沌魔殿 (暗黑殿堂)",
    nameEn: "The Chaos Sanctuary",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["火焰免疫 (毒魔領主)", "冰寒免疫 (指環鬼)", "閃電免疫 (暴風施術者)"],
    chestsAndBosses: "五處封印解鎖召喚迪亞布羅 (Diablo)，全遊戲密度最高、掉寶期望值最高的核心戰場。",
    chestsAndBossesEn: "Unlock 5 seals to summon Diablo. Sanctuary's premier high-density endgame battlefield."
  },
  {
    act: 4,
    name: "火焰之河",
    nameEn: "River of Flame",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["火焰免疫", "毒素免疫"],
    chestsAndBosses: "包含護甲鍛造師海法斯特 (鐵匠) 守護地獄熔爐，以及通往混沌魔殿的寬闊道路。",
    chestsAndBossesEn: "Home of Hephasto the Armorer guarding the Hellforge, leading to Chaos Sanctuary."
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
    chestsAndBosses: "危險性極高，隨機刷新狂暴牛頭怪與黑魂鬼火 (Black Souls)。",
    chestsAndBossesEn: "High danger zone with Frenzytaurs and deadly Black Souls (Burning Souls)."
  },
  {
    act: 5,
    name: "世界之石要塞 第 2 層",
    nameEn: "Worldstone Keep Level 2",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["各類混合免疫"],
    chestsAndBosses: "通往要塞第 3 層的必經樞紐，怪物密集。",
    chestsAndBossesEn: "Gateway to Keep Level 3 with dense elite clusters."
  },
  {
    act: 5,
    name: "世界之石要塞 第 3 層",
    nameEn: "Worldstone Keep Level 3",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["各類混合免疫"],
    chestsAndBosses: "直通毀滅王座。",
    chestsAndBossesEn: "Direct path leading down to the Throne of Destruction."
  },
  {
    act: 5,
    name: "毀滅王座",
    nameEn: "Throne of Destruction",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["各波次不同 (五波僕從)"],
    chestsAndBosses: "巴爾召喚五波強大精英隨從，練級 99 級必刷點。",
    chestsAndBossesEn: "Five waves of Baal's elite minions, the pinnacle grind to Level 99."
  },
  {
    act: 5,
    name: "沃特之廳 (尼拉塞克的神殿)",
    nameEn: "Halls of Vaught",
    areaLevel: 84,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["冰寒免疫", "毒素免疫"],
    chestsAndBosses: "尼拉塞克固守處，掉落毀滅之鑰 (Key of Destruction)，注意防禦屍爆 (CE)。",
    chestsAndBossesEn: "Lair of Nihlathak. Drops Key of Destruction; beware lethal Corpse Explosion."
  },
  {
    act: 1,
    name: "秘密乳牛關 (哞哞農莊)",
    nameEn: "The Secret Cow Level (Moo Moo Farm)",
    areaLevel: 81,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["無原生免疫 (非金怪)"],
    chestsAndBosses: "全遊戲平民怪物密度之最！極度適合標槍電馬、純冰法、屍爆死靈刷白色高級底材與高級符文，牛王掉落專屬牛王套裝。",
    chestsAndBossesEn: "Sanctuary's highest density! Legendary for Javazons & CE Necros hunting elite bases and High Runes."
  },
  {
    act: 1,
    name: "遺忘之塔 第 5 層 (女伯爵)",
    nameEn: "Forgotten Tower Level 5",
    areaLevel: 79,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["火焰免疫"],
    chestsAndBosses: "女伯爵 (The Countess) 固守處，擁有特殊獨立符文掉落表，最高掉落 28# 羅 (Lo)，專屬掉落 24# 伊司特 (Ist) 與恐懼之鑰。",
    chestsAndBossesEn: "The Countess has a dedicated rune drop table up to Lo (#28), special drops up to Ist (#24), and Key of Terror."
  },
  {
    act: 1,
    name: "崔斯特姆",
    nameEn: "Tristram",
    areaLevel: 76,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["物理免疫 (偶爾)", "火焰免疫"],
    chestsAndBosses: "拯救迪卡‧凱恩任務聖地，左上角獲取維特的腿 (Wirt's Leg)，精英鐵匠格里斯瓦德與精英怪群。",
    chestsAndBossesEn: "Cain rescue quest site. Retrieve Wirt's Leg in the northwest, battle Griswold and champions."
  },
  {
    act: 3,
    name: "崔凡克 (最高議會瘸子群)",
    nameEn: "Travincal",
    areaLevel: 82,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["火焰免疫 (瘸子長老)", "閃電免疫"],
    chestsAndBosses: "打錢與打符文野蠻人 (Horker) 的殿堂！最高議會瘸子掉落大量高級符文、首飾與金幣，打擊時注意多頭蛇火攻。",
    chestsAndBossesEn: "Gold-find and Horker Barbarian mecca! High Council drops massive runes, jewelry, and gold."
  },
  {
    act: 3,
    name: "剝皮地牢 第 3 層",
    nameEn: "Flayer Dungeon Level 3",
    areaLevel: 83,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["毒素免疫", "閃電免疫"],
    chestsAndBosses: "巫醫印都古所在地，狹小空間高密度小矮人。",
    chestsAndBossesEn: "Lair of Witch Doctor Endugu with dense Flayer packs."
  },
  {
    act: 5,
    name: "尼拉塞克的神殿 (暴皮 Pindleskin)",
    nameEn: "Nihlathak's Temple (Pindleskin)",
    areaLevel: 83,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["毒素免疫", "火焰免疫 (偶爾)"],
    chestsAndBosses: "安亞紅門直通門口，暴皮帶領 10-12 隻復生殭屍，進門 5 秒即殺，全遊戲最快重開局單刷目標之一。",
    chestsAndBossesEn: "Anya's portal leads directly to Pindleskin and undead pack. 5-second ultra-fast farming runs."
  },
  {
    act: 5,
    name: "冰凍高地 (督軍山克 & 矯正者艾德瑞奇)",
    nameEn: "Frigid Highlands (Shenk & Eldritch)",
    areaLevel: 81,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["寒冷免疫 (艾德瑞奇)", "各類免疫 (山克)"],
    chestsAndBosses: "傳送小站往上走 3 秒遇矯正者艾德瑞奇，往下一路到督軍山克，極其安全迅速的雙金怪刷寶熱點。",
    chestsAndBossesEn: "3 seconds north of waypoint for Eldritch the Rectifier, south for Shenk the Overseer. Safe, rapid double-unique runs."
  }
];

export interface TerrorZoneTier {
  tier: "S" | "A" | "B" | "C";
  title: string;
  description: string;
  areas: string[];
}

export const TERROR_ZONE_GUIDE = {
  mechanics: [
    {
      title: "等級動態縮放公式",
      titleEn: "Dynamic Level Scaling Formula",
      content: "邪惡威脅區域中的怪物等級 (Monster Level) 取決於房主 (或建立遊戲者) 當前角色等級 (clvl)：普通怪 = clvl + 2 (地獄上限 96)；精英怪 (Champion) = clvl + 4 (地獄上限 98)；暗金頭目與僕從 (Unique/Minion) = clvl + 5 (地獄上限 99)。",
      contentEn: "Monster Level in Terror Zones scales with game creator clvl: Regular = clvl + 2 (Hell cap 96); Champion = clvl + 4 (Hell cap 98); Unique/Minion = clvl + 5 (Hell cap 99)."
    },
    {
      title: "破除 TC87 裝備掉落天花板",
      titleEn: "Unlocks TC87 Drop Ceiling Everywhere",
      content: "當角色等級達到 85 級以上時，邪惡威脅區域內所有怪物皆能掉落全遊戲最頂級的 87 財寶階層 (TC87) 裝備，包含泰瑞爾之力、死亡之網、死亡深度、獅鷲之眼與風之力！",
      contentEn: "Once clvl reaches 85+, every monster in the Terror Zone can drop TC87 endgame items, including Tyrael's Might, Death's Web, Fathom, Griffon's Eye, and Windforce!"
    },
    {
      title: "破免咒符 (Sunder Charms) 唯一來源",
      titleEn: "Exclusive Source of Sunder Charms",
      content: "全 6 款破除免疫特大咒符 (破冰/破電/破火/破毒/破物/破魔) 僅能由地獄難度邪惡威脅區域中的精英怪、暗金怪以及 Boss 掉落 (角色需達 75 級以上)。",
      contentEn: "All 6 Sunder Grand Charms (Cold, Light, Fire, Poison, Physical, Magic) drop exclusively from Champions, Uniques, and Bosses in Hell Terror Zones (req clvl 75+)."
    },
    {
      title: "沖級 99 等級質變",
      titleEn: "Level 99 Grind Revolution",
      content: "在 2.5 之前，98 級升 99 級僅有巴爾、迪亞布羅與尼拉塞克有經驗值收益；邪惡威脅區域推出後，99 級怪物提供全額經驗，升級速度提升 5 至 10 倍！",
      contentEn: "Prior to Patch 2.5, only Baal, Diablo, and Nihlathak granted XP at lvl 98. With Terror Zones, lvl 99 monsters grant full XP, accelerating the 99 grind by 5-10x!"
    }
  ],
  tiers: [
    {
      tier: "S",
      title: "S 級 · 絕對必刷神區",
      titleEn: "S Tier · Absolute Must-Farm",
      description: "怪物極度密集、跑圖極快、經驗值與掉寶率頂天，開了立刻進！",
      descriptionEn: "Extreme monster density, rapid traversal, and maximum XP/drop rates. Drop everything and farm!",
      areas: [
        "秘密乳牛關 (The Secret Cow Level) - 全遊戲怪物密度之王",
        "混沌魔殿 (Chaos Sanctuary) - 惡魔群集 + 迪亞布羅",
        "世界之石要塞 1-3 層 & 毀滅王座 - 經驗最高 + 巴爾五小隊",
        "賢者之谷 & 塔拉夏的古墓 (全部 7 座古墓) - 怪物海洋",
        "崔凡克 (Travincal) - 最高議會瘸子打錢打符文極致"
      ],
      areasEn: [
        "The Secret Cow Level - Undisputed king of monster pack density",
        "Chaos Sanctuary - Dense demon clusters + Diablo",
        "Worldstone Keep 1-3 & Throne - Highest XP + Baal minion waves",
        "Canyon of the Magi & Tal Rasha's Tombs (7 Tombs) - Ocean of mobs",
        "Travincal - High Council gold, jewel, and high rune powerhouse"
      ]
    },
    {
      tier: "A",
      title: "A 級 · 高效率熱點",
      titleEn: "A Tier · High Efficiency Hotspots",
      description: "地圖動線清晰、精英怪量多、容易打出高級符文與破免板。",
      descriptionEn: "Clear pathing, abundant elite packs, and excellent rune/sunder charm yield.",
      areas: [
        "地穴 1-2 層 (The Pit) - 怪物脆皮且 2 層必出金箱子",
        "古代通道 (Ancient Tunnels) - 無原生冰免，冰法首選",
        "遺忘之塔 (The Forgotten Tower) - 女伯爵符文與恐懼之鑰",
        "崔斯特姆 (Tristram) - 傳送門直達，精英小隊扎堆",
        "尼拉塞克的神殿 (暴皮 & 沃特之廳) - 快速擊殺"
      ],
      areasEn: [
        "The Pit Lvl 1-2 - Fragile mobs with guaranteed Level 2 golden chest",
        "Ancient Tunnels - Zero native cold immunes, ideal for Blizzard",
        "The Forgotten Tower - Countess runes and Key of Terror",
        "Tristram - Instant portal access with clustered champion packs",
        "Nihlathak's Temple (Pindleskin & Halls of Vaught) - Fast runs"
      ]
    },
    {
      tier: "B",
      title: "B 級 · 中規中矩",
      titleEn: "B Tier · Decent Options",
      description: "怪物分佈較散或有電鬼/女妖等危險威脅，可視裝備強度選擇刷取。",
      descriptionEn: "Spread-out spawns or dangerous souls/succubi; farm depending on gear strength.",
      areas: [
        "亂石曠野 (Stony Field)",
        "黑暗森林 (Dark Wood)",
        "失落古城 (Lost City)",
        "庫拉斯特市集與廢墟 (Kurast Bazaar)",
        "冰凍高地與亞瑞特高原 (Frigid Highlands)"
      ],
      areasEn: [
        "Stony Field",
        "Dark Wood",
        "Lost City",
        "Kurast Bazaar & Ruined Temple",
        "Frigid Highlands & Arreat Plateau"
      ]
    },
    {
      tier: "C",
      title: "C 級 · 避雷糞區",
      titleEn: "C Tier · Avoid / Skip",
      description: "地圖極大怪物極稀疏、地形繞路障礙多、效率極低，建議趁這 1 小時休息或換房。",
      descriptionEn: "Sprawling maps with sparse mobs and tedious obstacles. Take a break or reset games.",
      areas: [
        "鮮血荒地 & 邪惡洞窟 (Blood Moor)",
        "大沼澤 (Great Marsh) - 地圖又繞又多小矮人吹箭",
        "庫拉斯特下水道 (Sewers)",
        "水晶通道與冰凍之河 (Crystal Passage)"
      ],
      areasEn: [
        "Blood Moor & Den of Evil",
        "Great Marsh - Maze-like winding paths and fetid blowdarts",
        "Kurast Sewers",
        "Crystal Passage & Frozen River"
      ]
    }
  ]
};


