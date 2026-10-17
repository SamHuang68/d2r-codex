import { SkillTreeGroup } from "./types";

export const DRUID_SKILLS: SkillTreeGroup = {
  characterClass: "德魯伊",
  trees: [
    {
      name: "元素法術",
      nameEn: "Elemental",
      description: "驅使大地烈焰撕裂地殼，或召喚刺骨嚴冬的狂暴龍捲風與暴風雪護體。",
      skills: [
        {
          id: "firestorm",
          name: "火焰風暴",
          nameEn: "Firestorm",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["熔岩巨石", "地裂"],
          description: "向前釋放三道蜿蜒前進的熾熱火蛇灼燒路徑上的所有敵人。",
          details: "火德 1 級拓荒起手神技，地獄火炬 (Torch) 打擊時有機率自動觸發的同款法術。"
        },
        {
          id: "molten_boulder",
          name: "熔岩巨石",
          nameEn: "Molten Boulder",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 6,
          prerequisites: ["firestorm"],
          synergies: ["火焰風暴", "火山", "末日毀滅"],
          description: "滾出一顆燃燒的滾燙巨石，沿途擊退並碾壓敵人，撞擊硬物時產生劇烈烈焰爆炸！",
          details: "附帶強大物理與火焰混合傷害，狹長過道推怪清場極為解壓。"
        },
        {
          id: "arctic_blast",
          name: "極地風暴 (寒冰風暴)",
          nameEn: "Arctic Blast",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 6,
          prerequisites: [],
          synergies: ["旋風裝甲", "狂風暴雨"],
          description: "向前持續噴射一道冰晶寒流，減緩並凍結路徑上的敵人。",
          details: "2.4 改版修正傷害 Bug 並大幅增強射程，風德前期控場好幫手。"
        },
        {
          id: "fissure",
          name: "地裂 (裂隙)",
          nameEn: "Fissure",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 12,
          prerequisites: ["firestorm"],
          synergies: ["火焰風暴", "火山"],
          description: "撕裂指定地表形成多處熔岩裂口，持續噴發高溫岩漿火柱灼燒上方所有敵人！",
          details: "德魯伊 1-30 級拓荒真神技能！面對體型龐大的怪群或 Boss，多個地裂點同時觸發，傷害秒殺一切。"
        },
        {
          id: "cyclone_armor",
          name: "旋風裝甲 (風甲)",
          nameEn: "Cyclone Armor",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 12,
          prerequisites: ["arctic_blast"],
          synergies: ["小旋風", "龍捲風", "狂風暴雨"],
          description: "以疾風旋流環繞身軀，百分之百完全吸收火焰、冰冷與閃電的元素傷害！",
          details: "風德必備保命神技！將吸收數千點元素傷害，任何黑魂電球與巴爾霜凍皆被完全抵消。"
        },
        {
          id: "twister",
          name: "小旋風",
          nameEn: "Twister",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 18,
          prerequisites: ["arctic_blast", "cyclone_armor"],
          synergies: ["龍捲風", "狂風暴雨"],
          description: "釋放多股小型龍捲旋風，造成小額物理傷害並強制擊暈命中的敵人。",
          details: "風德的核心暈眩控場技能，為主力龍捲風提供強大的傷害協同。"
        },
        {
          id: "volcano",
          name: "火山",
          nameEn: "Volcano",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 24,
          prerequisites: ["firestorm", "molten_boulder", "fissure"],
          synergies: ["熔岩巨石", "地裂", "末日毀滅"],
          description: "在地面直接立起一座噴發的迷你火山，持續向空中噴射熔岩火球轟炸周圍區域！",
          details: "火德對決單體 Boss 的最強攻堅技能，兼具物理與火焰雙重打擊屬性。"
        },
        {
          id: "tornado",
          name: "龍捲風 (龍捲)",
          nameEn: "Tornado",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 24,
          prerequisites: ["arctic_blast", "cyclone_armor", "twister"],
          synergies: ["小旋風", "狂風暴雨", "旋風裝甲"],
          description: "釋放一股向隨機曲線狂暴肆虐的大型龍捲風，穿透並對路徑上的敵人造成巨額純物理傷害！",
          details: "風德 (Wind Druid) 的絕對核心主攻技能！由於是純物理傷害法術，完全無懼元素免疫，通刷地獄全場。"
        },
        {
          id: "armageddon",
          name: "末日毀滅 (末日浩劫)",
          nameEn: "Armageddon",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 30,
          prerequisites: ["firestorm", "molten_boulder", "arctic_blast", "fissure", "cyclone_armor", "volcano"],
          synergies: ["火焰風暴", "熔岩巨石", "火山"],
          description: "在頭頂引召天崩地裂的流星雨，隨著德魯伊移動持續將毀滅性的隕石砸向周圍全屏敵人！",
          details: "2.4 改版取消了前置限制並允許在變形為狼/熊狀態下施放！火狼火熊流派的毀滅天災。"
        },
        {
          id: "hurricane",
          name: "狂風暴雨 (暴風)",
          nameEn: "Hurricane",
          characterClass: "德魯伊",
          tree: "元素法術",
          requiredLevel: 30,
          prerequisites: ["arctic_blast", "cyclone_armor", "twister", "tornado"],
          synergies: ["旋風裝甲", "小旋風", "龍捲風"],
          description: "在自身周圍召喚一道持續跟隨的刺骨暴風雪漩渦，持續對範圍內所有敵人造成冰寒傷害與強制減速！",
          details: "風德的常駐被動輸出與極致控場光環，只要靠近德魯伊的怪物瞬間被凍結減速。"
        }
      ]
    },
    {
      name: "變形技能",
      nameEn: "Shape Shifting",
      description: "化身為狂怒嗜血的荒野巨狼或堅不可摧的鋼鐵巨熊，掌控野性肉搏與狂暴連擊。",
      skills: [
        {
          id: "werewolf",
          name: "狼人變化 (變狼)",
          nameEn: "Werewolf",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["變形術"],
          description: "變形為動作迅捷的巨狼，巨幅提升命中率、攻擊速度與生命值。",
          details: "狂怒狼德的基礎形態，2.4 改版大幅放寬武器攻速計算機制，可搭配更多高攻武器。"
        },
        {
          id: "lycanthropy",
          name: "變形術",
          nameEn: "Lycanthropy",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 1,
          prerequisites: ["werewolf"],
          description: "被動技能：大幅延長狼人與熊人形態的持續時間，並在變形時額外提供巨額生命上限加成！",
          details: "變形系必滿被動神技，使變形德魯伊天生擁有高達數千點的雄厚生命球。"
        },
        {
          id: "werebear",
          name: "熊人變化 (變熊)",
          nameEn: "Werebear",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 6,
          prerequisites: [],
          synergies: ["變形術"],
          description: "變形為體魄無比龐大的狂暴巨熊，巨幅暴增物理傷害、基礎防禦力與生命值。",
          details: "拍熊流派核心形態，硬如坦克的防禦與誇張的近戰平 A 面板。"
        },
        {
          id: "feral_rage",
          name: "野性狂暴 (野性)",
          nameEn: "Feral Rage",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 12,
          prerequisites: ["werewolf"],
          description: "狼人撕咬敵人，生成旋轉的嗜血紅球，持續提供巨量吸血百分比與飛毛腿般的狂飆移速！",
          details: "狼德維持戰鬥續航的神技，打一下疊滿紅球，近戰平砍一刀吸滿整顆血球。"
        },
        {
          id: "maul",
          name: "撞擊 (重擊拍擊)",
          nameEn: "Maul",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 12,
          prerequisites: ["werebear"],
          description: "熊人用巨掌重拍目標，生成增傷綠球，每次打擊大幅增加物理傷害與眩暈敵人的機率！",
          details: "熊德主力輸出充能招式，疊滿綠球後攻擊傷害提升數倍。"
        },
        {
          id: "rabies",
          name: "狂犬病 (瘋狗症)",
          nameEn: "Rabies",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 18,
          prerequisites: ["werewolf", "feral_rage"],
          synergies: ["猛毒花藤"],
          description: "狼人咬中目標使其感染烈性狂犬病毒，該病毒會像瘟疫般在相鄰怪物之間瘋狂自動傳染擴散！",
          details: "毒狼核心招式，咬中一隻小怪，整群怪堆如同多米諾骨牌般全員染毒倒地。"
        },
        {
          id: "fire_claws",
          name: "火焰之爪 (火爪)",
          nameEn: "Fire Claws",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 18,
          prerequisites: ["werewolf", "werebear", "feral_rage", "maul"],
          synergies: ["火焰風暴", "熔岩巨石", "地裂", "火山"],
          description: "在利爪重擊上附魔高溫烈焰，造成極為狂暴的火焰元素近戰重擊！",
          details: "火爪熊/狼的核心，攻速極快，專門用來融化物理免疫怪物。"
        },
        {
          id: "hunger",
          name: "飢渴",
          nameEn: "Hunger",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 24,
          prerequisites: ["werewolf", "werebear", "fire_claws"],
          description: "犧牲部分攻擊傷害，發動一次瞬間吸取高達 100%+ 生命與法力的貪婪撕咬！",
          details: "變形系緊急救命補給技，殘血時咬上一口瞬間雙球回滿。"
        },
        {
          id: "shock_wave",
          name: "震波 (拍拍熊衝擊波)",
          nameEn: "Shock Wave",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 24,
          prerequisites: ["werebear", "maul"],
          description: "熊掌猛擊地面向前方釋放弧形震波，將前方大片扇形區域內所有怪物強制眩暈長達 10 秒！",
          details: "暗黑2全遊戲最強的群體無腦控場神技！在震波面前，哪怕是冥河娃娃或狂暴電鬼也只能任由宰割。"
        },
        {
          id: "fury",
          name: "狂怒 (連環撕咬)",
          nameEn: "Fury",
          characterClass: "德魯伊",
          tree: "變形技能",
          requiredLevel: 30,
          prerequisites: ["werewolf", "feral_rage", "rabies"],
          description: "狼人進入血腥狂怒狀態，向周邊敵人發動風馳電掣的連續 5 次急速撕咬！",
          details: "物理狼德的核心終結技！配合盜墓者 (Tomb Reaver) 或死神 (Death)，五連咬秒殺任何金怪。"
        }
      ]
    },
    {
      name: "召喚技能",
      nameEn: "Summoning",
      description: "召喚大自然的夥伴，包含增益全隊血量傷害的自然之靈、獵鷹狂狼與無敵的拍人巨熊。",
      skills: [
        {
          id: "raven",
          name: "烏鴉 (獵鷹)",
          nameEn: "Raven",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 1,
          prerequisites: [],
          description: "召喚一群魔法烏鴉盤旋空襲敵人，每次俯衝啄擊敵人雙眼造成致盲與高額傷害！",
          details: "2.4 改版神話級重做！烏鴉傷害大幅狂飆且不再受攻擊次數限制，純召德拓荒主力核心輸出。"
        },
        {
          id: "poison_creeper",
          name: "猛毒花藤",
          nameEn: "Poison Creeper",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["狂犬病"],
          description: "召喚在地底穿行的劇毒藤蔓，從地下破土纏繞敵人並釋放致命劇毒。",
          details: "早期拓荒毒死小怪神器，也是狼德狂犬病核心傷害協同來源。"
        },
        {
          id: "oak_sage",
          name: "橡木智者 (血靈)",
          nameEn: "Oak Sage",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 6,
          prerequisites: [],
          description: "召喚自然生命之靈，形成光環使自身、隊友與所有召喚物的生命上限暴增 100%+！",
          details: "團隊最愛神級輔助靈！與野蠻人 BO 疊加後，全隊血量輕鬆突破 5000 點大關。"
        },
        {
          id: "spirit_wolf",
          name: "召喚靈狼 (幽靈狼)",
          nameEn: "Summon Spirit Wolf",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 12,
          prerequisites: ["raven"],
          synergies: ["狂狼", "召喚灰熊"],
          description: "召喚最多 5 隻具備傳送能力的幽靈狼，造成冰寒傷害並被動提升狼群防禦。",
          details: "2.4 改版後狼群與巨熊可以同時全部召喚！形成龐大的動物軍團。"
        },
        {
          id: "carrion_vine",
          name: "食屍藤",
          nameEn: "Carrion Vine",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 12,
          prerequisites: ["poison_creeper"],
          description: "召喚鑽地吞噬怪物屍體的食屍藤，每吞噬一具屍體為德魯伊恢復一定百分比的生命值！",
          details: "毀屍滅跡神技！吞掉屍體徹底防止沉淪魔巫師復活小怪，同時保證自身生命續航。"
        },
        {
          id: "heart_of_wolverine",
          name: "狼靈 (狼獾之心 / 傷靈)",
          nameEn: "Heart of Wolverine",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 18,
          prerequisites: ["oak_sage"],
          description: "召喚狂暴戰意之靈，光環大幅提升全隊的物理傷害與攻擊準確率！",
          details: "物理狼德與純召德的核心增益光環，大幅拔高軍團平砍輸出。"
        },
        {
          id: "dire_wolf",
          name: "狂狼 (恐狼)",
          nameEn: "Summon Dire Wolf",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 18,
          prerequisites: ["raven", "spirit_wolf"],
          synergies: ["召喚靈狼", "召喚灰熊"],
          description: "召喚最多 3 隻狂暴噬血的恐狼，恐狼吞食屍體後會陷入狂暴狀態傷害翻倍！",
          details: "動物園的核心主力戰犬，撕咬傷害極高且動作極其敏捷。"
        },
        {
          id: "solar_creeper",
          name: "太陽藤",
          nameEn: "Solar Creeper",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 24,
          prerequisites: ["poison_creeper", "carrion_vine"],
          description: "召喚吸收陽光與屍體的綠藤，吞食地面的怪物屍體為德魯伊持續恢復法力值！",
          details: "徹底解決變形與風德法力消耗的自然永動藤蔓。"
        },
        {
          id: "spirit_of_barbs",
          name: "棘刺靈氣之靈 (棘刺之靈)",
          nameEn: "Spirit of Barbs",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 30,
          prerequisites: ["oak_sage", "heart_of_wolverine"],
          description: "召喚尖刺復仇之靈，使全隊成員獲得反彈傷害光環，並附加固定物理反擊傷害！",
          details: "2.4 改版大幅提高反彈倍率與固定傷害，怪物攻擊德魯伊軍團如同撞上鋼刺鐵板。"
        },
        {
          id: "summon_grizzly",
          name: "召喚灰熊 (大熊熊)",
          nameEn: "Summon Grizzly",
          characterClass: "德魯伊",
          tree: "召喚技能",
          requiredLevel: 30,
          prerequisites: ["raven", "spirit_wolf", "dire_wolf"],
          synergies: ["召喚靈狼", "狂狼"],
          description: "召喚一隻體型遮天蔽日的暴怒灰熊，具備恐怖的物理打擊力與擊退重拍！",
          details: "德魯伊軍團終極王牌肉盾！一掌將金怪拍出硬直，血量與防禦厚得驚人，單挑巴爾毫不遜色。"
        }
      ]
    }
  ]
};
