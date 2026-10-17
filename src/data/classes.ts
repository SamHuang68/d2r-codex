import { CharacterClassData } from '../types';

export const CHARACTER_CLASSES_DATA: CharacterClassData[] = [
  {
    id: "warlock",
    name: "術士",
    nameEn: "Warlock",
    title: "禁忌深淵之主",
    isDLC: true,
    description: "《暗黑破壞神 II：獄火重生 - 術士軍臨》全新登場職業！掌控地獄禁忌力量，能使役強大的高階惡魔成為前線奴僕、以邪異符印附魔武具，並在遠處召喚虛空與混沌烈焰徹底碾碎強敵。",
    primaryAttributes: "精力、活力、力量",
    startingStats: {
      str: 15,
      dex: 20,
      vit: 25,
      ene: 30,
      life: 55,
      mana: 45
    },
    statGains: {
      lifePerVit: 2.0,
      manaPerEne: 2.0,
      staminaPerVit: 1.2
    },
    skillTrees: [
      {
        name: "惡魔奴僕 (Demon Enslavement)",
        description: "支配地獄原生惡魔，將其轉化為擁有獨特攻擊技能與光環的僕從戰士。",
        keySkills: ["召喚折磨惡魔", "深淵支配", "靈魂榨取", "狂暴儀式"]
      },
      {
        name: "邪異武裝 (Eldritch Infusion)",
        description: "引導遠古虛空與邪異能量灌注於雙手武具，將物理劈砍轉變為純粹破壞媒介。",
        keySkills: ["邪異刃芒", "虛空共振", "深淵護盾", "破滅之觸"]
      },
      {
        name: "混沌暗影 (Chaos Magic)",
        description: "向戰場傾瀉無邊地獄熾焰與暗影裂痕，製造恐怖的範圍毀滅。",
        keySkills: ["暗影裂隙", "地獄熾焰", "混沌崩解", "厄運降臨"]
      }
    ],
    popularBuilds: [
      {
        name: "惡魔使役流 (Demon Commander)",
        tier: "S",
        coreSkills: "召喚折磨惡魔 + 深淵支配 + 狂暴儀式",
        gearSummary: "權威魔典 + 貝恩套裝 + 喬丹之石"
      },
      {
        name: "混沌火影術士 (Chaos Pyromancer)",
        tier: "S",
        coreSkills: "暗影裂隙 + 地獄熾焰 + 混沌崩解",
        gearSummary: "巫師會匕首 + 謎團 + 獅鷲之眼"
      }
    ]
  },
  {
    id: "sorceress",
    name: "魔法使",
    nameEn: "Sorceress",
    title: "元素風暴主宰",
    description: "元素魔法的女王，精通冰寒、火焰與閃電三系法術。天生具備瞬息移動的「傳送」神技，是開荒拓荒第一人與高難度打寶的終極常勝軍。",
    primaryAttributes: "活力、精力",
    startingStats: {
      str: 10,
      dex: 25,
      vit: 10,
      ene: 35,
      life: 40,
      mana: 35
    },
    statGains: {
      lifePerVit: 2.0,
      manaPerEne: 2.0,
      staminaPerVit: 1.0
    },
    skillTrees: [
      {
        name: "冰凍法術 (Cold Spells)",
        description: "凍結戰場的絕對零度，兼顧控場減速與大範圍清怪。",
        keySkills: ["暴風雪 (Blizzard)", "冰風暴 (Glacial Spike)", "冰凍專精", "冰封球"]
      },
      {
        name: "閃電法術 (Lightning Spells)",
        description: "瞬發穿透的高額電能打擊，擁有無上限的最高面板單次傷害。",
        keySkills: ["閃電 (Lightning)", "連鎖閃電", "傳送 (Teleport)", "靜態力場"]
      },
      {
        name: "火焰法術 (Fire Spells)",
        description: "焚盡一切的烈火，在破火護身符支援下擁有最極致的 DPS。",
        keySkills: ["火球 (Fire Ball)", "隕石 (Meteor)", "九頭蛇 (Hydra)", "暖氣 (Warmth)"]
      }
    ],
    popularBuilds: [
      {
        name: "純冰暴風雪 (Pure Blizzard)",
        tier: "S",
        coreSkills: "暴風雪 + 冰風暴 + 冰凍專精滿",
        gearSummary: "次元碎片 + 蛇皮/漆甲 + 精神盾 + 軍帽"
      },
      {
        name: "無限電法 (Lightning Infinity)",
        tier: "S",
        coreSkills: "閃電 + 連鎖閃電 + 閃電專精 + 靜態力場",
        gearSummary: "獅鷲之眼 + 無限長柄 (自持或傭兵) + 謎團"
      }
    ]
  },
  {
    id: "paladin",
    name: "聖騎士",
    nameEn: "Paladin",
    title: "聖光堅定捍衛者",
    description: "受聖光祝福的重裝戰士，融合神聖靈氣光環與防禦神技「神聖之盾」，擁有全遊戲最高抗性、超高格擋率與最頂尖的抗擊打能力。",
    primaryAttributes: "活力、力量、敏捷",
    startingStats: {
      str: 25,
      dex: 20,
      vit: 25,
      ene: 15,
      life: 55,
      mana: 15
    },
    statGains: {
      lifePerVit: 3.0,
      manaPerEne: 1.5,
      staminaPerVit: 1.2
    },
    skillTrees: [
      {
        name: "作戰技能 (Combat Skills)",
        description: "聖錘旋轉、神聖衝擊與盾牌猛擊的戰鬥本能。",
        keySkills: ["祝福之槌 (Blessed Hammer)", "神聖之盾", "重擊 (Smite)", "熱誠 (Zeal)"]
      },
      {
        name: "進攻靈氣 (Offensive Auras)",
        description: "鼓舞全隊輸出爆發的神聖光環。",
        keySkills: ["專注 (Concentration)", "狂熱 (Fanaticism)", "審判 (Conviction)", "神聖衝擊"]
      },
      {
        name: "防禦靈氣 (Defensive Auras)",
        description: "庇護同伴免受元素侵蝕與淨化狀態的堅固屏障。",
        keySkills: ["活力 (Vigor)", "救贖 (Redemption)", "抗火/抗電", "祈禱"]
      }
    ],
    popularBuilds: [
      {
        name: "祝槌騎 (Hammerdin)",
        tier: "S",
        coreSkills: "祝福之槌 + 專注靈氣 + 神聖之盾滿",
        gearSummary: "橡樹之心 + 謎團 + 飾金盾牌/精神盾 + 蛛網腰帶"
      },
      {
        name: "盾擊重擊騎 (Smiter)",
        tier: "S",
        coreSkills: "重擊 (Smite) + 神聖之盾 + 狂熱靈氣",
        gearSummary: "悔恨 + 飾金盾牌 + 剛毅/背信 + 卓古拉之握"
      }
    ]
  },
  {
    id: "necromancer",
    name: "死靈法師",
    nameEn: "Necromancer",
    title: "生死界限掌門人",
    description: "行於幽冥的召喚宗師。能喚醒龐大骷髏軍團與石魔為己作戰，以致命白骨長矛擊穿敵陣，並以全遊戲最霸道之範圍技能「屍體爆炸」清空戰場。",
    primaryAttributes: "活力、力量",
    startingStats: {
      str: 15,
      dex: 25,
      vit: 15,
      ene: 25,
      life: 45,
      mana: 25
    },
    statGains: {
      lifePerVit: 2.0,
      manaPerEne: 2.0,
      staminaPerVit: 1.0
    },
    skillTrees: [
      {
        name: "召喚法術 (Summoning)",
        description: "統帥骷髏狂潮、復 raw 怪物與鮮血石魔的強大軍勢。",
        keySkills: ["骷髏復甦", "骷髏支配", "鋼鐵石魔", "重生 (Revive)"]
      },
      {
        name: "毒素與白骨 (Poison & Bone)",
        description: "操縱純粹骨質魔法與致命劇毒的直接破壞法術。",
        keySkills: ["屍體爆炸 (Corpse Explosion)", "骨矛", "骨魂", "劇毒新星"]
      },
      {
        name: "詛咒 (Curses)",
        description: "大幅削弱敵人防禦、傷害與抗性的靈魂咒縛。",
        keySkills: ["傷害加深 (Amplify Damage)", "衰老 (Decrepify)", "降低抗性"]
      }
    ],
    popularBuilds: [
      {
        name: "純召死靈 (Fishymancer)",
        tier: "S",
        coreSkills: "骷髏復甦 + 骷髏支配 + 屍體爆炸滿",
        gearSummary: "野獸/李奧瑞克王魔杖 + 謎團 + 侏儒盾 + 軍帽"
      },
      {
        name: "毒死靈 (Poison Nova Necro)",
        tier: "S",
        coreSkills: "劇毒新星 + 毒爆 + 劇毒匕首滿",
        gearSummary: "破隱法杖 (Death's Web) + 塔格奧三件套 + 謎團"
      }
    ]
  },
  {
    id: "amazon",
    name: "亞馬遜",
    nameEn: "Amazon",
    title: "雙系神射長矛女傑",
    description: "馳騁叢林的精準戰士，無論是以閃電狂怒撕裂整屏怪物的標槍系，或是以物理掃射穿刺百步穿楊的弓箭系，皆具備極度華麗的視覺回饋。",
    primaryAttributes: "敏捷、活力、力量",
    startingStats: {
      str: 20,
      dex: 25,
      vit: 20,
      ene: 15,
      life: 50,
      mana: 15
    },
    statGains: {
      lifePerVit: 3.0,
      manaPerEne: 1.5,
      staminaPerVit: 1.2
    },
    skillTrees: [
      {
        name: "標槍與長矛 (Javelin & Spear)",
        description: "投擲蘊含雷電神威的標槍，造成海量彈跳連鎖與單體戳刺。",
        keySkills: ["閃電狂怒 (Lightning Fury)", "充能一擊", "劇毒標槍"]
      },
      {
        name: "弓與十字弓 (Bow & Crossbow)",
        description: "長程箭雨傾瀉，覆蓋物理與急凍/爆裂元素打擊。",
        keySkills: ["多重箭 (Multiple Shot)", "掃射 (Strafe)", "導引箭", "急凍箭"]
      },
      {
        name: "被動與魔法 (Passive & Magic)",
        description: "強化命中、閃避與致命暴擊的內在武道境界。",
        keySkills: ["女武神 (Valkyrie)", "致命攻擊 (Critical Strike)", "穿刺 (Pierce)"]
      }
    ],
    popularBuilds: [
      {
        name: "標槍電馬 (Javazon)",
        tier: "S",
        coreSkills: "閃電狂怒 + 充能一擊 + 相關電系協同滿",
        gearSummary: "無形泰坦的復仇 + 獅鷲之眼 + 謎團 + 鳳凰/統治者大盾"
      },
      {
        name: "信心物理弓馬 (Physical Bowazon)",
        tier: "A",
        coreSkills: "多重箭 + 掃射 + 導引箭 + 女武神",
        gearSummary: "信心 (Faith GMB) + 剛毅甲 + 巨骷髏/安頭 + 戰旅"
      }
    ]
  },
  {
    id: "barbarian",
    name: "野蠻人",
    nameEn: "Barbarian",
    title: "亞瑞特山鐵血雄獅",
    description: "亞瑞特聖山的守護者，兼具雙持重型兵刃與無畏狂暴力量。戰鬥體質 (BO) 戰吼使全隊生存能力提升數倍，並能利用「尋找物品」實現無人能及的打寶翻屍收益。",
    primaryAttributes: "力量、活力",
    startingStats: {
      str: 30,
      dex: 20,
      vit: 25,
      ene: 10,
      life: 55,
      mana: 10
    },
    statGains: {
      lifePerVit: 4.0,
      manaPerEne: 1.0,
      staminaPerVit: 1.4
    },
    skillTrees: [
      {
        name: "戰鬥技能 (Combat Skills)",
        description: "旋風斬、狂亂加速與撕裂敵人的原始物理戰技。",
        keySkills: ["旋風斬 (Whirlwind)", "狂乱 (Frenzy)", "狂戰士 (Berserk)", "跳躍攻擊"]
      },
      {
        name: "戰鬥支配 (Combat Masteries)",
        description: "專精刀、斧、槌等各式武器熟練度與天然抗性。",
        keySkills: ["劍專精", "斧專精", "鐵布衫 (Iron Skin)", "自然抵抗 (Natural Resistance)"]
      },
      {
        name: "吶喊技能 (Warcries)",
        description: "震撼敵方耳膜、激發同胞生命潛能的雄渾戰吼。",
        keySkills: ["戰鬥體質 (Battle Orders)", "戰鬥指揮", "狂嗥 (Howl)", "尋找物品 (Find Item)"]
      }
    ],
    popularBuilds: [
      {
        name: "打寶翻屍狂 (Horker / Gold Find Barb)",
        tier: "S",
        coreSkills: "旋風斬 + 尋找物品 + 尋找藥劑 + 戰鬥體質滿",
        gearSummary: "悔恨 (Grief) + 阿里巴巴/海鷗 + 謎團 + 亞瑞特的面容"
      },
      {
        name: "狂暴近戰野蠻人 (Berserk Barb)",
        tier: "A",
        coreSkills: "狂戰士 (100% 魔法傷害) + 戰鬥體質 + 吶喊",
        gearSummary: "悔恨 + 暴風之盾 (物免盾) + 剛毅 + 蝕肉騎士"
      }
    ]
  },
  {
    id: "assassin",
    name: "刺客",
    nameEn: "Assassin",
    title: "維茲耶雷秘密暗殺者",
    description: "獵殺失控魔法師的無形幽魂。精通置放各類自動射擊的陷阱裝置、運用影子大師分身作戰，更能在武學連擊下積蓄聚氣，施展毀天滅地的終結技。",
    primaryAttributes: "敏捷、活力、力量",
    startingStats: {
      str: 20,
      dex: 20,
      vit: 20,
      ene: 25,
      life: 50,
      mana: 25
    },
    statGains: {
      lifePerVit: 3.0,
      manaPerEne: 1.5,
      staminaPerVit: 1.2
    },
    skillTrees: [
      {
        name: "陷阱 (Traps)",
        description: "佈置雷光守衛與亡者守衛，提供遠距無傷自動清場。",
        keySkills: ["雷光守衛 (Lightning Sentry)", "亡者守衛 (Death Sentry)", "火焰復甦"]
      },
      {
        name: "影子訓練 (Shadow Disciplines)",
        description: "操控能量消解 (Fade) 與速度爆發，召喚影子並釋放心靈震爆控場。",
        keySkills: ["速度爆發", "能量消解 (Fade)", "影子大師", "心靈震爆"]
      },
      {
        name: "武學藝術 (Martial Arts)",
        description: "積累三種元素與吸血連擊，配合終結踢擊引爆龐大能量。",
        keySkills: ["鳳凰攻擊 (Phoenix Strike)", "雷電爪", "虎擊", "神龍擺尾"]
      }
    ],
    popularBuilds: [
      {
        name: "馬賽克武學刺客 (Mosaic Martial Arts)",
        tier: "S",
        coreSkills: "鳳凰攻擊 + 虎擊 + 眼睛蛇擊 + 龍爪終結",
        gearSummary: "雙持馬賽克爪 (Mosaic 2S) + 謎團 + 獅鷲之眼"
      },
      {
        name: "電陷阱刺客 (Trapasin)",
        tier: "A",
        coreSkills: "雷光守衛 + 亡者守衛 + 電系連鎖滿",
        gearSummary: "巨鷹之爪 (+3陷阱) + 精神盾 + 謎團 + 蛛網腰帶"
      }
    ]
  },
  {
    id: "druid",
    name: "德魯伊",
    nameEn: "Druid",
    title: "自然野性守護德魯伊",
    description: "古老部族的自然祭司。能與狂風冰雹融為一體呼喚毀天滅地，召喚巨熊與幽靈狼伴隨作戰，亦能化身為嗜血狂暴之巨狼或皮糙肉厚之狂怒暴熊。",
    primaryAttributes: "活力、力量",
    startingStats: {
      str: 15,
      dex: 20,
      vit: 25,
      ene: 20,
      life: 55,
      mana: 20
    },
    statGains: {
      lifePerVit: 2.0,
      manaPerEne: 2.0,
      staminaPerVit: 1.5
    },
    skillTrees: [
      {
        name: "元素 (Elemental)",
        description: "掌控狂暴烈焰與極地冰風暴的廣域自然魔法。",
        keySkills: ["龍捲風 (Tornado)", "暴風 (Hurricane)", "毀天滅地 (Armageddon)", "裂地"]
      },
      {
        name: "變形 (Shape Shifting)",
        description: "化身狂狼撕裂獵物或化身巨熊硬撼強敵的肉搏神技。",
        keySkills: ["狼人變化", "狂怒 (Fury)", "熊人變化", "撞擊 (Maul)"]
      },
      {
        name: "召喚 (Summoning)",
        description: "召集橡樹智者提供巨幅生命、狼群牽制與灰熊痛擊。",
        keySkills: ["橡樹智者 (Oak Sage)", "召喚灰熊", "狂狼", "劇毒藤蔓"]
      }
    ],
    popularBuilds: [
      {
        name: "風德 (Wind Druid)",
        tier: "S",
        coreSkills: "龍捲風 + 暴風 + 旋風裝甲 + 橡樹智者滿",
        gearSummary: "橡樹之心 + 謎團 + 加爾的長髮/鹿角 + 精神盾"
      },
      {
        name: "狂怒變形狼德 (Fury Wolf)",
        tier: "A",
        coreSkills: "狼人變化 + 變形術 + 狂怒 + 狼灌之心滿",
        gearSummary: "變形頭盔 (Metamorphosis) + 死亡呼吸/盜墓者 + 剛毅"
      }
    ]
  }
];
