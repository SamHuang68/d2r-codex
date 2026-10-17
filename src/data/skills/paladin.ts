import { SkillTreeGroup } from "./types";

export const PALADIN_SKILLS: SkillTreeGroup = {
  characterClass: "聖騎士",
  trees: [
    {
      name: "作戰技能",
      nameEn: "Combat Skills",
      description: "聖殿騎士的武藝與神聖魔法，包含全遊戲最穩定的盾擊、魔法之錘與狂熱白刃戰。",
      skills: [
        {
          id: "sacrifice",
          name: "犧牲",
          nameEn: "Sacrifice",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["熱誠", "狂熱"],
          description: "以自身 8% 生命值為代價，發動造成極高傷害與準確率的猛烈攻擊。",
          details: "熱誠 (Zeal) 的核心協同技能，每點增加熱誠 12% 傷害。"
        },
        {
          id: "smite",
          name: "盾擊 (重擊)",
          nameEn: "Smite",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 1,
          prerequisites: [],
          description: "使用盾牌猛撞敵人造成傷害與暈眩，此攻擊 100% 絕對必中且無視防禦！",
          details: "殺紅門六王神技！完美繼承壓碎打擊 (CB)、撕開傷口 (OW) 與偷取生命 (Life Tap)。"
        },
        {
          id: "holy_bolt",
          name: "聖光彈",
          nameEn: "Holy Bolt",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 6,
          prerequisites: [],
          synergies: ["祝福之錘", "天堂之拳"],
          description: "射出一道神聖光彈，穿透並傷害不死與惡魔怪物，若命中隊友則給予大量生命治療。",
          details: "2.4 改版後能傷害惡魔！且具備穿透特性，配合天堂之拳清場極為霸道。"
        },
        {
          id: "zeal",
          name: "熱誠 (白熱)",
          nameEn: "Zeal",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 12,
          prerequisites: ["sacrifice"],
          synergies: ["犧牲"],
          description: "發動一連串狂暴的連續 5 次急速武器斬擊，並大幅提升命中率與傷害。",
          details: "雙熱騎 (Zealot) 的主力物理打擊技能，配合狂熱靈氣能達到極限 4 幀攻速。"
        },
        {
          id: "charge",
          name: "衝鋒",
          nameEn: "Charge",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 12,
          prerequisites: ["smite"],
          description: "以極限狂飆的速度衝向目標並發動毀滅性的撞擊，擊退並造成高達 1000%+ 的傷害增幅。",
          details: "野外疾速趕路、追擊弓箭手、以及 PVP 瞬間秒殺對手的衝刺招式。"
        },
        {
          id: "vengeance",
          name: "復仇",
          nameEn: "Vengeance",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 18,
          prerequisites: ["sacrifice", "zeal"],
          description: "在武器打擊上同時附加巨額的火、冰、電三元素傷害。",
          details: "復仇騎士主力，天生自帶三系元素混傷，完全無懼任何單一甚至雙重免疫怪物。"
        },
        {
          id: "blessed_hammer",
          name: "祝福之錘",
          nameEn: "Blessed Hammer",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 18,
          prerequisites: ["holy_bolt"],
          synergies: ["祝福瞄準", "活力"],
          description: "釋放一顆旋轉向外擴散的金色魔法光錘，對路徑上的敵人造成極高純魔法傷害。",
          details: "全 D2R 傳奇流派「槌子騎 (Hammerdin)」靈魂技能，幾乎無怪具備魔法免疫，通刷地獄全場。"
        },
        {
          id: "conversion",
          name: "轉換 (感化)",
          nameEn: "Conversion",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 24,
          prerequisites: ["sacrifice", "zeal", "vengeance"],
          description: "以神聖意志感化敵人，暫時將怪物轉化為己方忠誠盟友攻擊其他惡魔。",
          details: "巧妙的控場保命奇招，被感化的怪物會吸引周圍敵人的全部仇恨火網。"
        },
        {
          id: "holy_shield",
          name: "神聖之盾 (聖盾)",
          nameEn: "Holy Shield",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 24,
          prerequisites: ["smite", "holy_bolt", "charge", "blessed_hammer"],
          description: "為盾牌注入神聖能量，暴增基礎防禦力、提高格擋率至上限 75%，並將格擋速度提升至極限 2 幀！",
          details: "聖騎士生存神技！只需極少敏捷即可達到 75% 滿格擋，堅如磐石的防護靈魂。"
        },
        {
          id: "fist_of_the_heavens",
          name: "天堂之拳 (FoH)",
          nameEn: "Fist of the Heavens",
          characterClass: "聖騎士",
          tree: "作戰技能",
          requiredLevel: 30,
          prerequisites: ["holy_bolt", "blessed_hammer", "conversion"],
          synergies: ["聖光彈"],
          description: "從天堂引召一道雷霆霹靂轟擊目標，命中後向四面八方炸出無數具備穿透性的神聖光彈！",
          details: "2.4 改版封神！混沌避難所 (CS) 清場之王，大範圍聖光彈自動融化所有惡魔與不死怪物。"
        }
      ]
    },
    {
      name: "攻擊靈氣",
      nameEn: "Offensive Auras",
      description: "激發神聖怒火的光環，提升全隊物理傷害、狂暴攻速或持續對全場釋放元素天罰。",
      skills: [
        {
          id: "might",
          name: "力量",
          nameEn: "Might",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 1,
          prerequisites: [],
          description: "光環靈氣：提升全隊成員的物理攻擊傷害百分比。",
          details: "Act 2 進攻型傭兵的招牌光環，物理系最親民的常駐加傷。"
        },
        {
          id: "holy_fire",
          name: "神聖火焰 (聖火)",
          nameEn: "Holy Fire",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 6,
          prerequisites: ["might"],
          description: "光環靈氣：每隔數秒對周圍所有敵人造成火焰脈衝波，並為近戰武器附加額外火焰傷害。",
          details: "1-30級普通難度拓荒戰神！雙飛龍 (Dragon) 與正義之手 (Hand of Justice) 疊加 44 級聖火走路秒怪套路。"
        },
        {
          id: "thorns",
          name: "荊棘",
          nameEn: "Thorns",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 6,
          prerequisites: [],
          description: "光環靈氣：將受到的近戰物理傷害以數倍百分比反彈回攻擊者身上。",
          details: "2.4 改版後受到物理攻擊時反彈固定額外物理傷害，對抗快速連擊怪物效果顯著。"
        },
        {
          id: "blessed_aim",
          name: "祝福瞄準",
          nameEn: "Blessed Aim",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 12,
          prerequisites: ["might"],
          synergies: ["祝福之錘"],
          description: "光環靈氣：大幅提升全隊的攻擊準確率 (AR)；被動為祝福之錘提供傷害協同。",
          details: "每點被動提升祝福之錘 14% 傷害，槌子騎必滿核心協同。"
        },
        {
          id: "holy_freeze",
          name: "神聖冰凍 (聖冰)",
          nameEn: "Holy Freeze",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 18,
          prerequisites: [],
          description: "光環靈氣：向四周釋放刺骨極寒，無視怪物冰冷抗性強制減緩其移動與攻擊速度 50%+！",
          details: "末日 (Doom) 符文之語自帶靈氣；Act 2 防禦型傭兵王牌光環，極致安全控場。"
        },
        {
          id: "holy_shock",
          name: "神聖衝擊 (聖衝)",
          nameEn: "Holy Shock",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 24,
          prerequisites: ["holy_fire"],
          description: "光環靈氣：脈衝轟擊周邊敵人並為武器附加極高的閃電傷害上限。",
          details: "雙夢騎 (Dual Dream) 核心套路！頭盾雙夢境疊加 30 級神聖衝擊，平 A 一刀數萬輸出。"
        },
        {
          id: "sanctuary_aura",
          name: "庇護所 (聖域)",
          nameEn: "Sanctuary",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 24,
          prerequisites: ["holy_freeze"],
          description: "光環靈氣：持續擊退不死怪物，並使持有者的武器直接無視所有不死怪物的物理抗性！",
          details: "執法者 (Lawbringer) 與藍晶石自帶靈氣，幽靈怪與物理免疫不死怪的天命剋星。"
        },
        {
          id: "fanaticism",
          name: "狂熱",
          nameEn: "Fanaticism",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 30,
          prerequisites: ["blessed_aim", "concentration"],
          description: "光環靈氣：狂飆全隊的攻擊速度、巨額提升自身物理傷害與命中率。",
          details: "信心 (Faith) 與野獸 (Beast) 的核心光環！近戰物理與弓馬突破極限攻速幀數的無上神技。"
        },
        {
          id: "concentration",
          name: "專注",
          nameEn: "Concentration",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 18,
          prerequisites: ["blessed_aim"],
          synergies: ["祝福之錘"],
          description: "光環靈氣：巨幅增幅全隊傷害，並使攻擊在受到打擊時極難被打斷；加成祝福之錘傷害！",
          details: "驕傲 (Pride) 符文之語靈氣；唯一能對魔法傷害「祝福之錘」提供 50% 效果傷害增幅的光環！"
        },
        {
          id: "conviction",
          name: "審判 (信念)",
          nameEn: "Conviction",
          characterClass: "聖騎士",
          tree: "攻擊靈氣",
          requiredLevel: 30,
          prerequisites: ["sanctuary_aura"],
          description: "光環靈氣：大幅削弱周圍所有敵人的防禦力最高達 90%，並降低其火/電/冰抗性最高達 150%！",
          details: "無限 (Infinity) 符文之語的靈魂光環！破除怪物元素免疫的核心支柱。"
        }
      ]
    },
    {
      name: "防禦靈氣",
      nameEn: "Defensive Auras",
      description: "提供極致的生存防護、跑速加成、解毒淨化與回魔回血。",
      skills: [
        {
          id: "prayer",
          name: "祈禱",
          nameEn: "Prayer",
          characterClass: "聖騎士",
          tree: "防禦靈氣",
          requiredLevel: 1,
          prerequisites: [],
          description: "光環靈氣：持續以法力為代價治療全隊生命值。",
          details: "與淨化 (Cleansing) 及冥想 (Meditation) 形成三靈氣協同回血連鎖。"
        },
        {
          id: "resist_fire",
          name: "抗火",
          nameEn: "Resist Fire",
          characterClass: "聖騎士",
          tree: "防禦靈氣",
          requiredLevel: 1,
          prerequisites: [],
          description: "光環靈氣：巨幅提升全隊火焰抗性，每投 2 點被動提升 1% 最大抗火上限！",
          details: "被動加最大抗性，對抗大菠蘿火風暴神技。"
        },
        {
          id: "defiance",
          name: "反抗",
          nameEn: "Defiance",
          characterClass: "聖騎士",
          tree: "防禦靈氣",
          requiredLevel: 6,
          prerequisites: [],
          description: "光環靈氣：以高額百分比倍增全隊的防禦力。",
          details: "流亡盾 (Exile) 自帶的同款靈氣，防禦破萬的基石。"
        },
        {
          id: "cleansing",
          name: "淨化",
          nameEn: "Cleansing",
          characterClass: "聖騎士",
          tree: "防禦靈氣",
          requiredLevel: 12,
          prerequisites: ["prayer"],
          description: "光環靈氣：大幅縮短全隊受到的毒素與詛咒持續時間最高達 80% 以上！",
          details: "2.6 治癒頭 (Cure) 的核心靈氣，詛咒與劇毒剛上身瞬間消散。"
        },
        {
          id: "vigor",
          name: "活力",
          nameEn: "Vigor",
          characterClass: "聖騎士",
          tree: "防禦靈氣",
          requiredLevel: 18,
          prerequisites: ["defiance", "cleansing"],
          description: "光環靈氣：狂飆全隊跑步與步行速度，並大幅增加耐力恢復速度！",
          details: "和諧弓 (Harmony) 自帶的跑路光環，城鎮與野外跑圖必開。"
        },
        {
          id: "meditation",
          name: "冥想 (沉思)",
          nameEn: "Meditation",
          characterClass: "聖騎士",
          tree: "防禦靈氣",
          requiredLevel: 24,
          prerequisites: ["cleansing"],
          description: "光環靈氣：使全隊的法力恢復速度最高提升至 700%+！",
          details: "眼光 (Insight) 符文之語的核心靈氣，全法系永動機的泉源。"
        },
        {
          id: "redemption",
          name: "救贖",
          nameEn: "Redemption",
          characterClass: "聖騎士",
          tree: "防禦靈氣",
          requiredLevel: 30,
          prerequisites: ["vigor"],
          description: "光環靈氣：超度周圍怪物屍體，每超度一具屍體瞬間轉化回復大量生命與法力！",
          details: "鳳凰盾 (Phoenix) 自帶的核心靈氣，清完怪群一開靈氣，瞬間雙球滿血滿魔。"
        },
        {
          id: "salvation",
          name: "救助",
          nameEn: "Salvation",
          characterClass: "聖騎士",
          tree: "防禦靈氣",
          requiredLevel: 30,
          prerequisites: [],
          description: "光環靈氣：同時巨額提升全隊的火、電、冰三元素抗性！",
          details: "對抗超級崔斯特姆墨菲斯托 20 級審判靈氣的救命光環。"
        }
      ]
    }
  ]
};
