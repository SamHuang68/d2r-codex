export interface ValuationItem {
  id: string;
  category: string;
  name: string;
  nameEn: string;
  itemType: string;
  itemTypeEn?: string;
  rarity: 'magic' | 'rare';
  idealStats: string[];
  idealStatsEn?: string[];
  estimatedValue: string;
  estimatedValueEn?: string;
  description: string;
  descriptionEn?: string;
  farmingSources: string;
  farmingSourcesEn?: string;
  keyRule: string;
  keyRuleEn?: string;
}

export const VALUATION_ITEMS_DATA: ValuationItem[] = [
  {
    id: "jmod",
    category: "shield",
    name: "珠寶匠之偏折君主盾 (JMoD)",
    nameEn: "Jeweler's Monarch of Deflecting (JMoD)",
    itemType: "君主盾 (Monarch)",
    rarity: "magic",
    idealStats: [
      "天然 4 鑲孔 (Jeweler's 詞綴)",
      "+30% 快速格擋速度 (FBR)",
      "+20% 增加格擋機率 (Deflecting 偏折詞綴)"
    ],
    estimatedValue: "全暗黑交易市場最天價！身價 80-150 顆貝符文 (Ber / Jah)！",
    description: "全遊戲標馬 (Javazon)、電法與 PvP 頂級對決的終極夢幻神盾！鑲嵌 4 顆 5/5 閃電彩虹刻面後，直接獲得 -20% 敵電抗與 +20% 電傷，同時擁有極高格擋率與極低敏捷投入，被譽為暗黑藍裝身價之王。",
    farmingSources: "地獄難度任何怪物或邪惡威脅區域 (Terror Zone) 均有極低機率掉落藍色君主盾，亦可使用 3 顆完美寶石重骰洗出。",
    keyRule: "必須是「4 孔 (Jeweler's)」與「偏折 (Deflecting)」同時出現！若只有 3 孔或普通格擋則價值暴跌。",
    itemTypeEn: "Monarch",
    idealStatsEn: [
      "Natural 4 Sockets (Jeweler's prefix)",
      "+30% Faster Block Rate (FBR)",
      "+20% Increased Chance of Blocking (Deflecting suffix)"
    ],
    estimatedValueEn: "Most expensive trophy in D2R! Worth 80-150 Ber / Jah Runes!",
    descriptionEn: "The ultimate dream shield for Javazons, Lightning Sorcs, and PvP elites! Socketed with four 5/5 Lightning Facets, it yields -20% Enemy Light Res & +20% Light Dmg with max block at minimal dexterity.",
    farmingSourcesEn: "Drops from any Hell monster or Terror Zone blue Monarch; can also be rerolled with 3 Perfect Gems.",
    keyRuleEn: "Must roll both Jeweler's (4 sockets) AND Deflecting! 3 sockets or normal block causes value to plummet.",
  },
  {
    id: "sc_3_20_20",
    category: "charm",
    name: "3/20/20 極品物理小型咒符",
    nameEn: "Fine Small Charm of Vita (3/20/20)",
    itemType: "小型咒符 (Small Charm 1格)",
    rarity: "magic",
    idealStats: [
      "+3 最大傷害 (Fine 良質詞綴滿變)",
      "+20 攻擊準確率 (Fine 良質詞綴滿變)",
      "+20 生命 (Vita 活力詞綴滿變)"
    ],
    estimatedValue: "極品滿變身價 40-80 顆貝符文 (Ber)！",
    description: "物理弓馬、旋風野蠻人與雙熱聖騎士背包裡鋪滿 37 片的終極奢華硬幣。每片僅占 1 格空間，卻同時將攻擊力、命中率與血量推向數學極限。",
    farmingSources: "惡夢第三章後半與地獄難度任意區域掉落的小型咒符皆有機會出現。",
    keyRule: "即使非滿變（例如 3/18/19 或 3/15/20），身價依然在數顆高階符文以上，撿到絕不可隨意丟棄！",
    itemTypeEn: "Small Charm (1 slot)",
    idealStatsEn: [
      "+3 Maximum Damage (Fine prefix perfect roll)",
      "+20 Attack Rating (Fine prefix perfect roll)",
      "+20 Life (Vita suffix perfect roll)"
    ],
    estimatedValueEn: "Perfect roll worth 40-80 Ber Runes!",
    descriptionEn: "The luxury currency for Bowazons, Whirlwind Barbs, and Zealots. Taking only 1 slot, it pushes damage, attack rating, and life to the mathematical pinnacle.",
    farmingSourcesEn: "Drops from late Nightmare Act III through all Hell difficulty zones.",
    keyRuleEn: "Even non-perfect rolls (e.g. 3/18/19 or 3/15/20) remain worth multiple High Runes. Never discard!",
  },
  {
    id: "sc_20_5",
    category: "charm",
    name: "20/5 生命全抗小型咒符",
    nameEn: "Shimmering Small Charm of Vita (20/5)",
    itemType: "小型咒符 (Small Charm 1格)",
    rarity: "magic",
    idealStats: [
      "+20 生命 (Vita 滿變)",
      "所有抗性 +5 (Shimmering 閃耀詞綴滿變)"
    ],
    estimatedValue: "極品滿變身價 10-25 顆貝符文 (Ber)！",
    description: "全職業通用！背包塞滿數片 20/5 小板，角色在地獄難度瞬間達到 75% 全抗滿抗，同時暴增數百點純生命值。",
    farmingSources: "地獄難度任意小怪或邪惡威脅區域均可掉落。",
    keyRule: "只要是『生命 (15-20) + 全抗 (4-5)』的組合，都是硬通貨！",
    itemTypeEn: "Small Charm (1 slot)",
    idealStatsEn: [
      "+20 Life (Vita suffix perfect roll)",
      "All Resistances +5% (Shimmering prefix perfect roll)"
    ],
    estimatedValueEn: "Perfect roll worth 25-50 Ber Runes!",
    descriptionEn: "Universal endgame small charm for all classes. Stacking a row effortlessly caps elemental resistances in Hell while inflating life pools.",
    farmingSourcesEn: "Drops from mid-Nightmare Act IV through all Hell difficulty areas.",
    keyRuleEn: "20 Life + 5 All Res is the gold standard. 20/4 or 19/5 are also worth high runes.",
  },
  {
    id: "gc_skill_life_45",
    category: "charm",
    name: "技能 45 生命特大咒符 (45L Skiller)",
    nameEn: "Grand Charm of Vita (+1 Skill / 45 Life)",
    itemType: "特大咒符 (Grand Charm 3格)",
    rarity: "magic",
    idealStats: [
      "+1 核心單系技能 (閃電法術 / 標槍長矛 / 毒素與骸骨 / 聖戰技能 / 冰寒技能)",
      "+41-45 生命 (Vita 最高檔位，需 ilvl 91+)"
    ],
    estimatedValue: "熱門電法/標馬 45 生命板身價 30-60 顆貝符文 (Ber)！",
    description: "全遊戲最主流的終局背包填充物！41-45 生命詞綴的物品等級要求極高，唯有地獄巴爾 (ilvl 99)、大菠蘿 (ilvl 94)、尼拉塞克 (ilvl 95) 或 91 等級以上邪惡威脅區域的大板才能洗出。",
    farmingSources: "擊殺巴爾、迪亞布羅、尼拉塞克或 91+ 級邪惡威脅區域掉落大板，使用 3 顆完美寶石無限重骰。",
    keyRule: "只有 ilvl 91+ 的大板才能出現 41-45 生命！一般 85 場景掉落最高只能到 40 生命。",
    itemTypeEn: "Grand Charm (3 slots)",
    idealStatsEn: [
      "+1 to [Lightning / Cold / Javelin / Combat] Skill Tree",
      "+45 Life (ilvl 91+ Baal / Diablo / Nihlathak drop only)"
    ],
    estimatedValueEn: "Lightning/Cold/Paladin Combat +45 Life worth 30-70 Ber Runes!",
    descriptionEn: "Top skill grand charm with maximum possible life roll. Essential for spellcasters seeking maximum skill levels and survivability.",
    farmingSourcesEn: "Only dropped by Hell Diablo (ilvl 94), Nihlathak (ilvl 95), Baal (ilvl 99), or Level 89+ Terror Zones.",
    keyRuleEn: "+41 to +45 Life Grand Charms CAN ONLY drop from Hell Diablo, Nihlathak, Baal, or high-level Terror Zones. Keep these for gem rerolls!",
  },
  {
    id: "circlet_2_20_30_2s",
    category: "helm",
    name: "2/20/30/2S 極品黃色頭飾",
    nameEn: "God-Tier Rare Diadem (2/20/30/2S)",
    itemType: "頭環 / 頭冠 / 權冠 (Circlet / Tiara / Diadem)",
    rarity: "rare",
    idealStats: [
      "+2 職業全技能等級 (Prefix)",
      "+20% 快速施法速度 (FCR) (Suffix)",
      "+30% 跑步/步行速度 (FRW) (Suffix)",
      "鑲孔 2 (Socketed 2S) (Prefix)",
      "附加額外屬性：20 力量 / 20 敏捷 / 20 全抗"
    ],
    estimatedValue: "可遇不可求的神器！拍賣行天價可達 100+ 顆高階符文！",
    description: "法系與陷阱刺客、風德超越軍帽的絕對神頭！完美兼顧了傳送術機動性 (30 FRW)、最高檔位 (20 FCR) 與鑲嵌 2 顆彩虹刻面的爆發力。",
    farmingSources: "地獄賭博 (Gambling)、恰西灌注魔力 (Imbue)、6 完美骷髏石洗權冠。",
    keyRule: "洗權冠 (Diadem) 具有無限洗詞綴優勢，因其品質等級極高，哪怕降 ilvl 也能反覆出現 2/20/2S。",
    itemTypeEn: "Tiara / Diadem (Headgear)",
    idealStatsEn: [
      "+2 to Class Skills (Sorceress, Paladin, Necromancer, Assassin)",
      "+20% Faster Cast Rate (FCR)",
      "+30% Faster Run/Walk (FRW)",
      "2 Natural Sockets (Mechanic's roll)"
    ],
    estimatedValueEn: "Worth 50-120 Ber Runes!",
    descriptionEn: "The undisputed holy grail of PvP and caster headgear, combining mobility, casting frames, and double socket versatility.",
    farmingSourcesEn: "Rare diadems dropped in Hell, imbues by Charsi (clvl 83+), or rerolled with 6 Perfect Skulls.",
    keyRuleEn: "+2 Skills + 20% FCR + 2 Sockets is the baseline; rolled stats or FRW elevate it to astronomical heights.",
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
    keyRule: "估價先看有效詞綴數量：FCR + 雙吸 + 力量/敏捷 + 生命/法力 + 全抗，命中 4 條以上即為高價珍品。",
    itemTypeEn: "Ring",
    idealStatsEn: [
      "+10% Faster Cast Rate (FCR)",
      "6% Mana Leech + 8% Life Leech (Dual Leech)",
      "+15-20 Strength or +12-15 Dexterity",
      "+30-40 Life or +60-90 Mana",
      "All Resistances +10-11%"
    ],
    estimatedValueEn: "5-affix to 6-affix perfect ring worth 30-80 Ber Runes!",
    descriptionEn: "Enigma physical builds (e.g. Frenzy Barb, Bowazon) require 10% FCR for fast Teleport plus dual leech to sustain attacks.",
    farmingSourcesEn: "Drops from Hell monsters or gambling with Gheed/Elzix/Jamella/Alkor/Anya at clvl 90+.",
    keyRuleEn: "Valuation uses the 'Point System': FCR, Str, Dex, Life, Mana, Resists each count as 1 point. 5-point rings are trophies; 6-point rings are historic.",
  },
  {
    id: "gloves_2_20_dual_stats",
    category: "gloves",
    name: "2/20 極品亮黃戰鬥手套",
    nameEn: "Godly 2/20 Rare Gloves",
    itemType: "厚皮手套 (Heavy Gloves / Sharkskin Gauntlets)",
    rarity: "rare",
    idealStats: [
      "+2 標槍與長矛技能 或 +2 武學技藝技能",
      "+20% 攻擊速度 (IAS)",
      "每次命中偷取 3% 生命",
      "+10-15 力量",
      "+10-15 敏捷",
      "抗火 / 抗電 +20-30%"
    ],
    estimatedValue: "標馬與武學刺客極品，身價 10-30 顆貝符文！",
    description: "標馬與 2.6 嵌飾武學刺客的終極手套。在 20% 攻速與 +2 技能的基礎上，補足大量力量敏捷與最稀缺的火/電抗性。",
    farmingSources: "地獄賭博、地獄牛關、手工藝 (Blood Gloves 血腥手套)。",
    keyRule: "藍色 3/20 手套（+3 技能 / 20 IAS）亦極具價值，可在安亞處重複進出紅門刷新商店購買！",
    itemTypeEn: "Heavy / Sharkskin / Vampirebone Gloves",
    idealStatsEn: [
      "+2 to Javelin and Spear Skills (or Bow Skills)",
      "+20% Increased Attack Speed (IAS)",
      "+12-15 Strength",
      "+12-15 Dexterity",
      "Single Resistance +25-30% (Fire/Light)"
    ],
    estimatedValueEn: "+2/20 with dual stats & res worth 20-50 Ber Runes!",
    descriptionEn: "Top-end gloves for Lightning Javazons, hitting both attack speed breakpoints and heavy stat requirements for gear.",
    farmingSourcesEn: "Hell drops or Crafted Blood Gloves (Magic Gloves + Nef #4 + P-Ruby + Jewel).",
    keyRuleEn: "+2 Skills + 20% IAS is the core baseline. Without Strength/Dexterity or resists, value is modest.",
  },
  {
    id: "circlet_3_20_2s",
    category: "helm",
    name: "3/20/2S 純法系藍色極限頭",
    nameEn: "Magical 3/20/2S Tiara",
    itemType: "頭環 / 頭冠 / 權冠",
    rarity: "magic",
    idealStats: [
      "+3 閃電技能 或 +3 火焰技能 或 +3 毒素與骸骨技能",
      "+20% 快速施法速度 (FCR)",
      "打孔工匠打出 2 鑲孔 (2 Sockets)"
    ],
    estimatedValue: "極限法系競速標配，身價 15-35 顆貝符文！",
    description: "極端純法傷害的極限突破頭具！鑲嵌 2 顆 5/5 彩虹刻面後，能提供高達 +3 技能、20% FCR、+10% 技能傷害與 -10% 敵抗性，傷害直接超越獅鷲之眼！",
    farmingSources: "地獄賭博與大怪掉落藍色頭飾，在第五章拉蘇克處打孔（藍裝打孔有 50% 機率出 2 孔）。",
    keyRule: "必須在拉蘇克打孔成功出 2 孔才值錢！若只打出 1 孔則價值暴跌。",
    itemTypeEn: "Tiara / Diadem (Headgear)",
    idealStatsEn: [
      "+3 to Skill Tab (e.g. +3 Lightning / +3 Cold / +3 Poison & Bone)",
      "+20% Faster Cast Rate (FCR)",
      "2 Natural Sockets (Jeweler's prefix roll)"
    ],
    estimatedValueEn: "3/20/2os Lightning/Poison Tiara worth 20-45 Ber Runes!",
    descriptionEn: "Glass-cannon damage optimization helm. Socketing two 5/5 Rainbow Facets yields +3 Skills, 20% FCR, -10% Enemy Res, +10% Dmg.",
    farmingSourcesEn: "Drops from Nightmare Act IV onward, or gambled from vendors.",
    keyRuleEn: "Must roll exactly 2 sockets from Larzuk! If Larzuk gives only 1 socket, value drops by 80%.",
  },
  {
    id: "tri_res_boots",
    category: "boots",
    name: "百抗高跑 FHR 極品亮黃三抗鞋",
    nameEn: "Godly Tri-Res Rare Boots",
    itemType: "輕鎧靴 / 鯊皮靴 / 龍皮靴 (Boots)",
    rarity: "rare",
    idealStats: [
      "+30% 跑步/步行速度 (FRW 滿變)",
      "+10% 快速打擊恢復 (FHR 滿變)",
      "抗火 +35-40%",
      "抗電 +35-40%",
      "抗毒 / 抗寒 +35-40%",
      "+25% 較低毒素持續時間 (PLR) 或 打寶率 (MF)"
    ],
    estimatedValue: "總抗 110+ 滿跑 FHR 頂級三抗鞋身價 50-100+ 顆貝符文！",
    description: "全遊戲抗性最極致的腳部神器！在缺少抗性的謎團配裝中，一雙三抗鞋能直接拉滿火抗與電抗，免去背包佔用大量咒符的困擾，競標市場永遠的神。",
    farmingSources: "地獄賭博、瘸子議會成員、牛關小怪掉落亮黃靴子。",
    keyRule: "三抗總和低於 80% 價值偏低；火抗 + 電抗 + (毒或寒) 總和突破 100% 且帶 30FRW 方可稱天價神鞋！",
    itemTypeEn: "Boots (Greaves / Sharkskin Boots)",
    idealStatsEn: [
      "+30% Faster Run/Walk (FRW max roll)",
      "+10% Faster Hit Recovery (FHR max roll)",
      "+35-40% Lightning Resistance",
      "+35-40% Fire Resistance",
      "+35-40% Cold or Poison Resistance"
    ],
    estimatedValueEn: "True Tri-Res 30/10 with total res > 110% worth 40-100 Ber Runes!",
    descriptionEn: "The legendary Tri-Res boots. Sunder Charms in D2R inflict -70% to -90% resist penalties, making heavy triple-res boots the hottest commodity on the market.",
    farmingSourcesEn: "Drops from Hell monsters or gambled with vendors.",
    keyRuleEn: "Fire + Lightning resistances are mandatory! Combined total resistances should exceed 100%+ alongside 30% FRW.",
  },
  {
    id: "crafted_caster_amulet_2_20",
    category: "amulet",
    name: "2/20 極品手工施法護身符",
    nameEn: "Crafted Caster Amulet (+2 Skill / 20 FCR)",
    itemType: "護身符 (Amulet)",
    rarity: "rare",
    idealStats: [
      "+2 職業全技能等級 (聖騎士 / 法師 / 死靈 / 術士)",
      "+20% 快速施法速度 (FCR 手工固化 5-10% + 隨機詞綴 10%)",
      "+20-30 力量 或 +15-20 敏捷",
      "+40-60 生命 或 +80-110 法力",
      "全抗性 +15-20%"
    ],
    estimatedValue: "頂級大極品 2/20/30力/20全抗身價 80-200 顆貝符文！",
    description: "打破傳送與施法幀數臨界點的神物！暗金馬拉的萬花筒只有 2 技能與 30 全抗，而手工 2/20 護身符提供了全遊戲唯二能湊齊 125 FCR 或 200 FCR 的關鍵拼圖。",
    farmingSources: "方塊手工藝：魔法護身符 (ilvl 90+) + 8號拉爾 (Ral) + 完美紫寶石 + 珠寶 (Jewel)。",
    keyRule: "角色等級需達 93 級賭博出的護身符才能穩定合成出 +2 職業技能！必須突破 15-20% FCR 才能超越馬拉。",
    itemTypeEn: "Crafted Caster Amulet",
    idealStatsEn: [
      "+2 to Class Skills (Paladin, Sorceress, Necromancer)",
      "+15-20% Faster Cast Rate (Crafted only roll)",
      "+20-30 Strength",
      "+40-60 Life",
      "+80-110 Mana",
      "All Resistances +15-20%"
    ],
    estimatedValueEn: "+2/20 with high stats & resists worth 50-150 Ber Runes!",
    descriptionEn: "The undisputed apex of amulet crafting. 20% FCR unlocks the mythical 200% FCR Sorc or 125% FCR Hammerdin without sacrificing belt or ring slots.",
    farmingSourcesEn: "Horadric Cube: Magic Amulet (ilvl 88+) + Ral #8 + P-Amethyst + Jewel at clvl 93+.",
    keyRuleEn: "Character must be level 93+ and gamble amulets before crafting to guarantee +2 Class Skill affixes can spawn!",
  },
  {
    id: "fools_eth_rep_claw",
    category: "weapon",
    name: "愚者之自修快速極品巨鷹爪",
    nameEn: "Fool's Eth Rep Greater Talons",
    itemType: "巨鷹爪 / 符紋爪 (Claw)",
    rarity: "rare",
    idealStats: [
      "愚者詞綴 (Fool's: 隨等級大幅增加攻擊準確率與最大傷害)",
      "+40% 攻擊速度 (IAS 滿變)",
      "+2 刺客技能 / +3 雷光衛哨 / +3 武器格擋",
      "無形 (Ethereal 基礎增傷 50%)",
      "自動修復耐久度 (Replenish Durability 33秒回1)"
    ],
    estimatedValue: "PvP 刺客至尊神兵！身價超越數百顆貝符文！",
    description: "全暗黑世界最昂貴的近戰爪類武器之一！無形提升巨額基礎物理面板，自動修復保證永久不壞，愚者詞綴給予幾千點額外命中率，是刺客內戰與天梯對抗的終極殺手鐧。",
    farmingSources: "地獄牛關、恰西灌注魔力、邪惡威脅區域黃色爪。",
    keyRule: "必須是『無形 (Eth)』且同時帶有『自修 (Rep)』！若無自修則耐久打光即報廢。",
    itemTypeEn: "Suwayyah / Runic Talons (Claws)",
    idealStatsEn: [
      "Fool's Prefix (+0.5 Max Damage & +16.5 AR per character level)",
      "+250-300% Enhanced Damage (ED)",
      "+40% Increased Attack Speed (IAS)",
      "Ethereal with Self-Repair (Repairs 1 Durability every 33 seconds)",
      "2 Natural Sockets"
    ],
    estimatedValueEn: "God-tier PvP trophy claw worth 60-150 Ber Runes!",
    descriptionEn: "Ghost Assassin and Whirlwind Sin's ultimate weapon. Fool's affix scales massive attack rating to guarantee hits against high-defense Paladins in PvP.",
    farmingSourcesEn: "Rare claw drops in Hell or gambled from Anya.",
    keyRuleEn: "Must be Ethereal with Self-Repair! Ethereal items without self-repair will permanently break and become useless.",
  },
  {
    id: "ruby_jewel_of_fervor_40_15",
    category: "jewel",
    name: "40增傷 / 15攻速 極品紅電珠寶 (40/15)",
    nameEn: "Ruby Jewel of Fervor (40% ED / 15% IAS)",
    itemType: "珠寶 (Jewel)",
    rarity: "magic",
    idealStats: [
      "+40% 增強傷害 (Enhanced Damage, Ruby 滿變)",
      "+15% 增加攻擊速度 (IAS, Fervor 滿變)"
    ],
    estimatedValue: "滿變單顆身價 15-25 顆貝符文！",
    description: "物理弓馬風之力、食人妖骨盾、吉永之臉與各類頂級物理武器的最佳鑲嵌物。同時兼顧拉滿最高攻速檔位與百分比物理輸出爆發。",
    farmingSources: "惡夢第三章後至地獄全圖掉落的魔法珠寶。",
    keyRule: "ED (30-40%) 與 IAS (15%) 同時存在即為高價；未滿變 38/15 或 35/15 亦有極高價值。",
    itemTypeEn: "Jewel (1 slot)",
    idealStatsEn: [
      "+40% Enhanced Damage (Ruby prefix perfect roll)",
      "+15% Increased Attack Speed (Fervor suffix)"
    ],
    estimatedValueEn: "Perfect 40/15 Ruby Jewel worth 15-30 Ber Runes!",
    descriptionEn: "The undisputed king of physical jewels. Used to socket Windforce, Tomb Reaver, Guillaume's Face, and Griffon's Eye for physical damage builds.",
    farmingSourcesEn: "Drops from late Nightmare Act III through all Hell difficulty areas.",
    keyRuleEn: "Beware of identical 15% IAS / +Damage jewels with min/max bugs in non-weapon gear. 40% ED / 15% IAS is flawless.",
  }
];
