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
  },
  {
    act: 1,
    name: "秘密乳牛關卡 (乳牛牧場)",
    nameEn: "The Secret Cow Level (Moo Moo Farm)",
    areaLevel: 81,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["無原生免疫 (非金怪)"],
    chestsAndBosses: "全遊戲平民怪物密度之最！極度適合標槍電馬、純冰法、屍爆死靈刷白色高級底材與高級符文，母牛之王掉落專屬牛王套裝。"
  },
  {
    act: 1,
    name: "遺忘之塔 第 5 層 (女伯爵)",
    nameEn: "Forgotten Tower Level 5",
    areaLevel: 79,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["冰寒免疫", "火焰免疫"],
    chestsAndBosses: "女伯爵 (The Countess) 固守處，擁有特殊獨立符文掉落表，最高掉落 28# 羅 (Lo)，專屬掉落 24# 伊司特 (Ist) 與恐懼之鑰。"
  },
  {
    act: 1,
    name: "崔斯特姆",
    nameEn: "Tristram",
    areaLevel: 76,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["物理免疫 (偶爾)", "火焰免疫"],
    chestsAndBosses: "拯救迪卡·凱恩任務聖地，左上角獲取維特之腳 (Wirt's Leg)，精英鐵匠格里斯瓦德與勇士怪群。"
  },
  {
    act: 3,
    name: "崔凡克 (高階議會瘸子群)",
    nameEn: "Travincal",
    areaLevel: 82,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["火焰免疫 (瘸子長老)", "閃電免疫"],
    chestsAndBosses: "打錢與打符文野蠻人 (Horker) 的殿堂！高階議會瘸子掉落大量高級符文、首飾與金幣，打擊時注意九頭蛇火攻。"
  },
  {
    act: 3,
    name: "剝皮地窖 第 3 層",
    nameEn: "Flayer Dungeon Level 3",
    areaLevel: 85,
    isAlvl85: true,
    isTerrorZone: true,
    immunities: ["毒素免疫", "閃電免疫"],
    chestsAndBosses: "D2R 2.4 版本全新升格為 85 級場景！巫師會吉布斯所在地，狹小空間高密度小矮人。"
  },
  {
    act: 5,
    name: "尼拉塞克門廊 (暴躁外皮 Pindleskin)",
    nameEn: "Nihlathak's Temple (Pindleskin)",
    areaLevel: 83,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["毒素免疫", "火焰免疫 (偶爾)"],
    chestsAndBosses: "安亞紅門直通門口，暴躁外皮帶領 10-12 隻復生殭屍，進門 5 秒即殺，全遊戲最快重開局單刷目標之一。"
  },
  {
    act: 5,
    name: "冰凍高地 (督軍山克 & 矯正者怪異)",
    nameEn: "Frigid Highlands (Shenk & Eldritch)",
    areaLevel: 81,
    isAlvl85: false,
    isTerrorZone: true,
    immunities: ["寒冷免疫 (怪異)", "各類免疫 (山克)"],
    chestsAndBosses: "傳送小站往上走 3 秒遇矯正者怪異，往下一路到督軍山克，極其安全迅速的雙金怪刷寶熱點。"
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
      content: "恐怖領域中的怪物等級 (Monster Level) 取決於房主 (或建立遊戲者) 當前角色等級 (clvl)：普通怪 = clvl + 2 (地獄上限 96)；勇士怪 (Champion) = clvl + 4 (地獄上限 98)；暗金頭目與僕從 (Unique/Minion) = clvl + 5 (地獄上限 99)。"
    },
    {
      title: "破除 TC87 裝備掉落天花板",
      content: "當角色等級達到 85 級以上時，恐怖領域內所有怪物皆能掉落全遊戲最頂級的 87 財寶階層 (TC87) 裝備，包含泰瑞爾的力量、死亡之網、死亡深度、格利風之眼與風之力！"
    },
    {
      title: "破免護身符 (Sunder Charms) 唯一來源",
      content: "全 6 款破除免疫大護身符 (破冰/破電/破火/破毒/破物/破魔) 僅能由地獄難度恐怖領域中的勇士怪、暗金怪以及 Boss 掉落 (角色需達 75 級以上)。"
    },
    {
      title: "沖級 99 等級質變",
      content: "在 2.5 之前，98 級升 99 級僅有巴爾、暗黑破壞神與尼拉塞克有經驗值收益；恐怖領域推出後，99 級怪物提供全額經驗，升級速度提升 5 至 10 倍！"
    }
  ],
  tiers: [
    {
      tier: "S",
      title: "S 級 · 絕對必刷神區",
      description: "怪物極度密集、跑圖極快、經驗值與掉寶率頂天，開了立刻進！",
      areas: [
        "秘密乳牛關 (The Secret Cow Level) - 全遊戲怪物密度之王",
        "混沌避難所 (Chaos Sanctuary) - 惡魔群集 + 暗黑破壞神",
        "世界之石要塞 1-3 層 & 毀滅王座 - 經驗最高 + 巴爾五小隊",
        "術士峽谷 & 塔拉夏古墓 (全部 7 座古墓) - 怪物海洋",
        "崔凡克 (Travincal) - 高階議會瘸子打錢打符文極致"
      ]
    },
    {
      tier: "A",
      title: "A 級 · 高效率熱點",
      description: "地圖動線清晰、精英怪量多、容易打出高級符文與破免板。",
      areas: [
        "地穴 1-2 層 (The Pit) - 怪物脆皮且 2 層必出金箱子",
        "古代通道 (Ancient Tunnels) - 無原生冰免，冰法首選",
        "遺忘之塔 (The Forgotten Tower) - 女伯爵符文與恐懼之鑰",
        "崔斯特姆 (Tristram) - 傳送門直達，精英小隊扎堆",
        "尼拉塞克神殿 (暴躁外皮 & 瓦特之廳) - 快速擊殺"
      ]
    },
    {
      tier: "B",
      title: "B 級 · 中規中矩",
      description: "怪物分佈較散或有電鬼/女妖等危險威脅，可視裝備強度選擇刷取。",
      areas: [
        "石塊曠野 (Stony Field)",
        "黑暗森林 (Dark Wood)",
        "失落城市 (Lost City)",
        "庫拉斯特集市與廢墟 (Kurast Bazaar)",
        "冰凍高地與亞瑞特高原 (Frigid Highlands)"
      ]
    },
    {
      tier: "C",
      title: "C 級 · 避雷糞區",
      description: "地圖極大怪物極稀疏、地形繞路障礙多、效率極低，建議趁這 1 小時休息或換房。",
      areas: [
        "鮮血荒地 & 邪惡洞窟 (Blood Moor)",
        "大沼澤 (Great Marsh) - 地圖又繞又多小矮人吹箭",
        "庫拉斯特下水道 (Sewers)",
        "水晶通道與冰河 (Crystal Passage)"
      ]
    }
  ]
};


