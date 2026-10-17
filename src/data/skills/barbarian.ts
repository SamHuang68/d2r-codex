import { SkillTreeGroup } from "./types";

export const BARBARIAN_SKILLS: SkillTreeGroup = {
  characterClass: "野蠻人",
  trees: [
    {
      name: "戰鬥技能",
      nameEn: "Combat Skills",
      description: "亞瑞特聖山的狂暴武術，包含標誌性的大風車旋風斬、高速雙持狂亂與破除物免的狂戰士。",
      skills: [
        {
          id: "bash",
          name: "重擊 (重擊擊退)",
          nameEn: "Bash",
          characterClass: "野蠻人",
          tree: "戰鬥技能",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["擊昏", "專注"],
          description: "揮舞強力的沉重一擊，擊退敵人並造成額外物理傷害與命中加成。",
          details: "1級近戰起手技能，為狂亂與專注提供早期協同加成。"
        },
        {
          id: "leap",
          name: "狂躍 (跳躍)",
          nameEn: "Leap",
          characterClass: "野蠻人",
          tree: "戰鬥技能",
          requiredLevel: 6,
          prerequisites: [],
          description: "躍向空中跨越障礙物、河流與深淵，落地時產生衝擊波震退周圍所有敵人！",
          details: "早期翻牆跑圖神技，高等級衝擊波震退全屏小怪，控場極佳。"
        },
        {
          id: "stun",
          name: "擊昏 (暈眩)",
          nameEn: "Stun",
          characterClass: "野蠻人",
          tree: "戰鬥技能",
          requiredLevel: 12,
          prerequisites: ["bash"],
          synergies: ["重擊", "專注"],
          description: "重擊敵人使其陷入長時間眩暈狀態，眩暈期間敵人無法移動、攻擊或施法。",
          details: "單挑控制狂暴精英怪的穩定招式。"
        },
        {
          id: "leap_attack",
          name: "狂跳斬 (跳躍攻擊)",
          nameEn: "Leap Attack",
          characterClass: "野蠻人",
          tree: "戰鬥技能",
          requiredLevel: 18,
          prerequisites: ["leap"],
          description: "躍入空中跨越超遠距離，落下時對鎖定目標施展毀滅性重劈，並造成範圍擊退與高額傷害！",
          details: "2.4 改版大幅提高起跳速度與落地平滑度，並附帶強大 AOE 範圍傷害，超遠程突刺切後排神技。"
        },
        {
          id: "concentrate",
          name: "專注 (專注打擊)",
          nameEn: "Concentrate",
          characterClass: "野蠻人",
          tree: "戰鬥技能",
          requiredLevel: 18,
          prerequisites: ["bash", "stun"],
          synergies: ["重擊", "擊昏", "狂戰士"],
          description: "集中全力發動不可被打斷的一擊，攻擊時自身防禦力暴增數倍，絕對保證出刀命中！",
          details: "單挑高攻 Boss 絕對穩妥的近戰打擊，即使遭受重擊也不會中斷出招。"
        },
        {
          id: "frenzy",
          name: "狂亂 (狂暴狂擊)",
          nameEn: "Frenzy",
          characterClass: "野蠻人",
          tree: "戰鬥技能",
          requiredLevel: 24,
          prerequisites: ["bash", "double_swing"],
          synergies: ["雙重打擊", "嘲弄", "狂戰士"],
          description: "雙持武器快速連續砍擊，每次擊中敵人疊加狂暴層數，使移動速度與攻擊速度飆升至極限！",
          details: "狂亂野蠻人主力，疊滿層數後跑得比法師傳送還快，刀如旋風瘋狂觸發壓碎打擊。"
        },
        {
          id: "whirlwind",
          name: "旋風 (大風車 / WW)",
          nameEn: "Whirlwind",
          characterClass: "野蠻人",
          tree: "戰鬥技能",
          requiredLevel: 30,
          prerequisites: ["bash", "leap", "stun", "leap_attack", "concentrate"],
          description: "旋轉身軀化為死亡旋風穿越整群敵人，在旋轉旋風路徑上對所有相撞目標進行極速連續斬擊！",
          details: "野蠻人標誌性神技！2.4 改版重新計算攻速機制，雙持悔恨 (Grief) 旋風斬是物理清怪與崔凡克打錢的終極殺戮美學。"
        },
        {
          id: "berserk",
          name: "狂戰士 (狂暴)",
          nameEn: "Berserk",
          characterClass: "野蠻人",
          tree: "戰鬥技能",
          requiredLevel: 30,
          prerequisites: ["bash", "stun", "concentrate"],
          synergies: ["嚎叫", "戰吼"],
          description: "將自身防禦降為 0，將全部物理破壞力 100% 轉化為純魔法傷害，一刀爆發十萬魔法核彈！",
          details: "物理免疫怪物的末日！也是頂級打寶野蠻人 (Pit Zerker) 瞬秒 85 場景金怪的王牌殺招。"
        }
      ]
    },
    {
      name: "戰鬥專精",
      nameEn: "Combat Masteries",
      description: "登峰造極的兵器掌握與肉體鍛鍊，提供永久白嫖的全抗性、防禦與極速奔跑。",
      skills: [
        {
          id: "sword_mastery",
          name: "劍術專精",
          nameEn: "Sword Mastery",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 1,
          prerequisites: [],
          description: "被動技能：大幅提升使用單手或雙手劍時的傷害、攻擊準確率與致命一擊機率。",
          details: "主流悔恨劍 (幻化之刃/巨神之刃) 的核心被動必滿項。"
        },
        {
          id: "axe_mastery",
          name: "斧術專精",
          nameEn: "Axe Mastery",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 1,
          prerequisites: [],
          description: "被動技能：大幅提升使用斧類武器時的傷害、攻擊準確率與致命打擊機率。",
          details: "狂戰士斧 (BA) 悔恨或野獸流派的核心被動。"
        },
        {
          id: "mace_mastery",
          name: "錘術專精",
          nameEn: "Mace Mastery",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 1,
          prerequisites: [],
          description: "被動技能：大幅提升使用錘棒、連枷與權杖類鈍器時的傷害、命中與致命一擊機率。",
          details: "拓荒不朽之王套裝或雷霆之錘核心專精。"
        },
        {
          id: "polearm_mastery",
          name: "長柄武器專精",
          nameEn: "Polearm Mastery",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 6,
          prerequisites: [],
          description: "被動技能：大幅提升使用長柄武器 (如末日、驕傲、無盡長矛) 時的戰鬥表現。",
          details: "雙手重型長兵器流派的傷害源泉。"
        },
        {
          id: "throwing_mastery",
          name: "投擲專精",
          nameEn: "Throwing Mastery",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 6,
          prerequisites: [],
          description: "被動技能：大幅提升投擲武器的傷害、命中率、穿透機率，爆擊時自動回復投擲武器數量！",
          details: "2.4 改版神技！賦予投擲武器爆擊時自動補充數量特性，投擲蠻人 (Throw Barb) 從此告別回城修武器。"
        },
        {
          id: "spear_mastery",
          name: "長矛專精",
          nameEn: "Spear Mastery",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 6,
          prerequisites: [],
          description: "被動技能：提升雙手長矛刺殺傷害、攻擊準確率與爆擊機率。",
          details: "長矛獵殺戰士的基礎修煉。"
        },
        {
          id: "increased_stamina",
          name: "增加耐力",
          nameEn: "Increased Stamina",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 12,
          prerequisites: [],
          description: "被動技能：恆定提升耐力總量與恢復速度，告別奔跑疲勞。",
          details: "加速技能的前置，也是耐力永動的保障。"
        },
        {
          id: "iron_skin",
          name: "鐵布衫 (鋼鐵皮膚)",
          nameEn: "Iron Skin",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 18,
          prerequisites: [],
          description: "被動技能：恆定以高額百分比增幅本體的基礎防禦力。",
          details: "使野蠻人在不開任何主動技能的情況下自然擁有破萬防禦。"
        },
        {
          id: "increased_speed",
          name: "增加速度 (加速奔馳)",
          nameEn: "Increased Speed",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 24,
          prerequisites: ["increased_stamina"],
          description: "被動技能：永久性提升行走與奔跑移動速度 (高達 40%+)。",
          details: "野蠻人天生飛毛腿的核心，刷催凡克與跑圖極為流暢。"
        },
        {
          id: "natural_resistance",
          name: "自然抵抗 (全抗天賦)",
          nameEn: "Natural Resistance",
          characterClass: "野蠻人",
          tree: "戰鬥專精",
          requiredLevel: 30,
          prerequisites: ["iron_skin"],
          description: "被動技能：永久性被動增加火焰、冰冷、閃電與毒素全四系元素抗性！",
          details: "全 D2R 最幸福的抗性被動！只需投入 1 點加上技能裝備加成，即可白嫖 50%+ 全抗，配裝極致自由。"
        }
      ]
    },
    {
      name: "戰吼",
      nameEn: "Warcries",
      description: "撼動天地的戰吼狂嗥，包含全暗黑最強輔助血魔翻倍的 BO，以及翻屍體打寶的至尊神技。",
      skills: [
        {
          id: "howl",
          name: "嚎叫 (戰吼嚇退)",
          nameEn: "Howl",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 1,
          prerequisites: [],
          description: "發出威嚴咆哮，強迫周圍所有普通怪物尖叫四散奔逃！",
          details: "打寶野蠻人 (Pit Zerker) 神技：嚎叫一嗓子嚇跑所有小怪，直取金怪人頭！"
        },
        {
          id: "find_potion",
          name: "尋找藥劑",
          nameEn: "Find Potion",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["尋找遺物"],
          description: "從怪物屍體中搜尋提取高品質紅藍藥水或全面回復活力藥劑。",
          details: "為尋找遺物 (翻屍體) 提供核心機率加成，2.4 改版後每點提升翻屍機率 1%。"
        },
        {
          id: "taunt",
          name: "嘲弄",
          nameEn: "Taunt",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 6,
          prerequisites: ["howl"],
          description: "激怒遠處單一怪物，削弱其攻擊傷害與準確率，並強迫其走到野蠻人面前進行近戰！",
          details: "破解遠程弓箭手、沉淪魔巫師與逃跑怪群的點名拉怪神技。"
        },
        {
          id: "shout",
          name: "狂嚎 (大吼 / 防禦戰吼)",
          nameEn: "Shout",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 6,
          prerequisites: ["howl"],
          description: "發出激昂咆哮，使自身與全隊成員的防禦力暴增 200%~300%+！",
          details: "三戰吼之一，大幅減少全隊被近戰怪物命中的機率。"
        },
        {
          id: "find_item",
          name: "尋找遺物 (翻屍體 / Hork)",
          nameEn: "Find Item",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 12,
          prerequisites: ["find_potion"],
          synergies: ["尋找藥劑"],
          description: "對倒下的金怪與暗金首領屍體進行第二次搜尋，有機率再次完整掉落一次獨立的全部戰利品！",
          details: "暗黑2全遊戲獨一無二的打寶財富密碼！崔凡克跛足跛行者議會議員被翻兩次，高階符文 (伯特/喬) 產出天花板。"
        },
        {
          id: "battle_cry",
          name: "戰鬥狂嗥 (破防戰吼)",
          nameEn: "Battle Cry",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 18,
          prerequisites: ["taunt"],
          description: "向身邊敵人怒吼，大幅削減周圍所有敵人的基礎防禦力與物理傷害輸出 (防禦削減最高達 80%+)！",
          details: "近戰命中率不足時的大殺器，一吼即可將怪物防禦砍成薄紙。"
        },
        {
          id: "battle_orders",
          name: "戰鬥體質 (BO / 戰鬥號令)",
          nameEn: "Battle Orders",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 24,
          prerequisites: ["shout"],
          description: "發出震撼人心的戰吼，使自身與全隊所有隊友的生命上限、法力上限與耐力上限狂暴翻倍 (最高提升 100%+ 生命)！",
          details: "D2R 全遊戲最不可或缺的 SSS 級團隊神技！戰爭召喚 (Call to Arms / CTA) 符文之語人人必備的根本原因。"
        },
        {
          id: "grim_ward",
          name: "殘酷之號 (恐懼圖騰)",
          nameEn: "Grim Ward",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 24,
          prerequisites: ["find_potion"],
          description: "將屍體改造成血肉圖騰，驅散附近小怪；2.4 改版後使圖騰周圍的敵人受到的物理傷害巨幅增加，並減速目標！",
          details: "2.4 改版重大增強，相當於自帶一個範圍增傷光環，物理蠻人殺群怪利器。"
        },
        {
          id: "battle_command",
          name: "戰鬥指揮 (BC / 技能戰吼)",
          nameEn: "Battle Command",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 30,
          prerequisites: ["battle_orders"],
          description: "發出威嚴號令，暫時賦予自身與全隊成員 +1 所有技能等級！",
          details: "開戰儀式第一吼！先吼 BC 提升 1 級技能，再吼 BO 與防禦戰吼，增益最大化。"
        },
        {
          id: "war_cry",
          name: "戰吼 (音波功 / 戰嚎)",
          nameEn: "War Cry",
          characterClass: "野蠻人",
          tree: "戰吼",
          requiredLevel: 30,
          prerequisites: ["howl", "taunt", "shout", "battle_cry", "battle_orders"],
          description: "釋放具備物理殺傷力的高頻聲波震爆，對周邊所有敵人造成直接物理傷害並強制陷入數秒眩暈！",
          details: "吶喊蠻 (Singer Barb) 的主力輸出兼無限強控神技，配合高施法速度 (FCR) 吼得怪物從頭暈到死。"
        }
      ]
    }
  ]
};
