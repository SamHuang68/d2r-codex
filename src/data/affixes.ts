export interface ValuationItem {
  id: string;
  category: string;
  name: string;
  nameEn: string;
  itemType: string;
  rarity: 'magic' | 'rare';
  idealStats: string[];
  estimatedValue: string;
  description: string;
  farmingSources: string;
  keyRule: string;
}

export const VALUATION_ITEMS_DATA: ValuationItem[] = [
  {
    id: "jmod",
    category: "shield",
    name: "珠寶匠之偏向統治者大盾 (JMoD)",
    nameEn: "Jeweler's Monarch of Deflecting (JMoD)",
    itemType: "統治者大盾 (Monarch)",
    rarity: "magic",
    idealStats: [
      "天然 4 凹槽 (Jeweler's 詞綴)",
      "+30% 快速格擋速度 (FBR)",
      "+20% 增加格擋機率 (Deflecting 偏向詞綴)"
    ],
    estimatedValue: "全暗黑交易市場最天價！身價 80-150 顆貝符文 (Ber / Jah)！",
    description: "全遊戲標馬 (Javazon)、電法與 PvP 頂級對決的終極夢幻神盾！鑲嵌 4 顆 5/5 閃電彩虹刻面後，直接獲得 -20% 敵電抗與 +20% 電傷，同時擁有極高格擋率與極低敏捷投入，被譽為暗黑藍裝身價之王。",
    farmingSources: "地獄難度任何怪物或恐怖領域 (Terror Zone) 均有極低機率掉落藍色統治者大盾，亦可使用 3 顆完美寶石重骰洗出。",
    keyRule: "必須是「4 孔 (Jeweler's)」與「偏向 (Deflecting)」同時出現！若只有 3 孔或普通格擋則價值暴跌。"
  },
  {
    id: "sc_3_20_20",
    category: "charm",
    name: "3/20/20 極品物理小護身符",
    nameEn: "Fine Small Charm of Vita (3/20/20)",
    itemType: "小護身符 (Small Charm 1格)",
    rarity: "magic",
    idealStats: [
      "+3 最大傷害 (Fine 精良詞綴滿變)",
      "+20 攻擊準確率 (Fine 精良詞綴滿變)",
      "+20 生命 (Vita 活力詞綴滿變)"
    ],
    estimatedValue: "極品滿變身價 40-80 顆貝符文 (Ber)！",
    description: "物理弓馬、旋風野蠻人與雙熱聖騎士背包裡鋪滿 37 片的終極奢華硬幣。每片僅占 1 格空間，卻同時將攻擊力、命中率與血量推向數學極限。",
    farmingSources: "惡夢第三章後半與地獄難度任意區域掉落的小護身符皆有機會出現。",
    keyRule: "即使非滿變（例如 3/18/19 或 3/15/20），身價依然在數顆高階符文以上，撿到絕不可隨意丟棄！"
  },
  {
    id: "sc_20_5",
    category: "charm",
    name: "20/5 生命全抗小護身符",
    nameEn: "Shimmering Small Charm of Vita (20/5)",
    itemType: "小護身符 (Small Charm 1格)",
    rarity: "magic",
    idealStats: [
      "+20 生命 (Vita 滿變)",
      "所有抗性 +5 (Shimmering 閃爍詞綴滿變)"
    ],
    estimatedValue: "極品滿變身價 10-25 顆貝符文 (Ber)！",
    description: "全職業通用！背包塞滿數片 20/5 小板，角色在地獄難度瞬間達到 75% 全抗滿抗，同時暴增數百點純生命值。",
    farmingSources: "地獄難度任意小怪或恐怖領域均可掉落。",
    keyRule: "只要是『生命 (15-20) + 全抗 (4-5)』的組合，都是硬通貨！"
  },
  {
    id: "gc_skill_life_45",
    category: "charm",
    name: "技能 45 生命超大護身符 (45L Skiller)",
    nameEn: "Grand Charm of Vita (+1 Skill / 45 Life)",
    itemType: "超大護身符 (Grand Charm 3格)",
    rarity: "magic",
    idealStats: [
      "+1 核心單系技能 (閃電法術 / 標槍長矛 / 毒素白骨 / 聖戰技能 / 冰霜技能)",
      "+41-45 生命 (Vita 最高檔位，需 ilvl 91+)"
    ],
    estimatedValue: "熱門電法/標馬 45 生命板身價 30-60 顆貝符文 (Ber)！",
    description: "全遊戲最主流的終局背包填充物！41-45 生命詞綴的物品等級要求極高，唯有地獄巴爾 (ilvl 99)、大菠蘿 (ilvl 94)、尼拉塞克 (ilvl 95) 或 91 等級以上恐怖領域的大板才能洗出。",
    farmingSources: "擊殺巴爾、暗黑破壞神、尼拉塞克或 91+ 級恐怖領域掉落大板，使用 3 顆完美寶石無限重骰。",
    keyRule: "只有 ilvl 91+ 的大板才能出現 41-45 生命！一般 85 場景掉落最高只能到 40 生命。"
  },
  {
    id: "circlet_2_20_30_2s",
    category: "helm",
    name: "2/20/30/2S 極品黃色頭飾",
    nameEn: "God-Tier Rare Diadem (2/20/30/2S)",
    itemType: "頭飾 / 權冠 (Circlet / Tiara / Diadem)",
    rarity: "rare",
    idealStats: [
      "+2 職業全技能等級 (Prefix)",
      "+20% 快速施法速度 (FCR) (Suffix)",
      "+30% 跑步/步行速度 (FRW) (Suffix)",
      "凹槽 2 (Socketed 2S) (Prefix)",
      "附加額外屬性：20 力量 / 20 敏捷 / 20 全抗"
    ],
    estimatedValue: "可遇不可求的神器！拍賣行天價可達 100+ 顆高階符文！",
    description: "法系與陷阱刺客、風德超越軍帽的絕對神頭！完美兼顧了傳送機動性 (30 FRW)、最高檔位 (20 FCR) 與鑲嵌 2 顆彩虹刻面的爆發力。",
    farmingSources: "地獄賭博 (Gambling)、恰西注入 (Imbue)、6 完美骷髏洗權冠。",
    keyRule: "洗權冠 (Diadem) 具有無限洗詞綴優勢，因其品質等級極高，哪怕降 ilvl 也能反覆出現 2/20/2S。"
  },
  {
    id: "rare_ring_fcr_dual_leech",
    category: "ring",
    name: "百抗雙吸 FCR 極品亮黃戒指",
    nameEn: "Godly 6-Mod Rare Ring",
    itemType: "戒指 (Ring)",
    rarity: "rare",
    idealStats: [
      "+10% 快速施法速度 (FCR)",
      "每次命中偷取 6% 生命 (LL 滿變)",
      "每次命中偷取 6% 法力 (ML 滿變)",
      "+15-20 力量 或 +15 敏捷",
      "+30-40 生命 或 +60-90 法力",
      "所有抗性 +11 (或單抗 +30%)"
    ],
    estimatedValue: "滿變 5-6 核心有效詞綴身價 20-50 顆貝符文！",
    description: "近戰法系雙棲、謎團物理戰士的夢幻戒指。既要 FCR 傳送，又需要物理偷血偷魔與海量屬性抗性支撐，是全遊戲隨機詞綴組合的極致。",
    farmingSources: "地獄難度崔凡克瘸子、大菠蘿、巴爾、賭博。",
    keyRule: "估價先看有效詞綴數量：FCR + 雙吸 + 力量/敏捷 + 生命/法力 + 全抗，命中 4 條以上即為高價珍品。"
  },
  {
    id: "gloves_2_20_dual_stats",
    category: "gloves",
    name: "2/20 極品亮黃戰鬥手套",
    nameEn: "Godly 2/20 Rare Gloves",
    itemType: "重裝手套 (Heavy Gloves / Sharkskin Gauntlets)",
    rarity: "rare",
    idealStats: [
      "+2 標槍與長矛技能 或 +2 武學藝術技能",
      "+20% 攻擊速度 (IAS)",
      "每次命中偷取 3% 生命",
      "+10-15 力量",
      "+10-15 敏捷",
      "抗火 / 抗電 +20-30%"
    ],
    estimatedValue: "標馬與武學刺客極品，身價 10-30 顆貝符文！",
    description: "標馬與 2.6 馬賽克武學刺客的終極手套。在 20% 攻速與 +2 技能的基礎上，補足大量力量敏捷與最稀缺的火/電抗性。",
    farmingSources: "地獄賭博、地獄牛關、手工藝 (Blood Gloves 血腥手套)。",
    keyRule: "藍色 3/20 手套（+3 技能 / 20 IAS）亦極具價值，可在安亞處重複進出紅門刷新商店購買！"
  },
  {
    id: "circlet_3_20_2s",
    category: "helm",
    name: "3/20/2S 純法系藍色極限頭",
    nameEn: "Magical 3/20/2S Tiara",
    itemType: "頭飾 / 權冠",
    rarity: "magic",
    idealStats: [
      "+3 閃電技能 或 +3 火焰技能 或 +3 毒素與白骨技能",
      "+20% 快速施法速度 (FCR)",
      "打孔工匠打出 2 凹槽 (2 Sockets)"
    ],
    estimatedValue: "極限法系競速標配，身價 15-35 顆貝符文！",
    description: "極端純法傷害的極限突破頭具！鑲嵌 2 顆 5/5 彩虹刻面後，能提供高達 +3 技能、20% FCR、+10% 技能傷害與 -10% 敵抗性，傷害直接超越格利風！",
    farmingSources: "地獄賭博與大怪掉落藍色頭飾，在第五幕拉蘇克處打孔（藍裝打孔有 50% 機率出 2 孔）。",
    keyRule: "必須在拉蘇克打孔成功出 2 孔才值錢！若只打出 1 孔則價值暴跌。"
  }
];
