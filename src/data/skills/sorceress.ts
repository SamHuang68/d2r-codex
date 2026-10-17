import { SkillTreeGroup } from "./types";

export const SORCERESS_SKILLS: SkillTreeGroup = {
  characterClass: "魔法使",
  trees: [
    {
      name: "冰霜法術",
      nameEn: "Cold Spells",
      description: "掌控暴風雪、冰封球與嚴冬寒氣，具備強大減速凍結與全遊戲最強的冰冷支配破防能力。",
      skills: [
        {
          id: "ice_bolt",
          name: "冰彈",
          nameEn: "Ice Bolt",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["冰風暴", "冰尖柱", "暴風雪", "冰封球"],
          description: "射出一枚冰彈，傷害並減緩敵人速度。",
          details: "1級可用，為所有高階冰霜法術提供基礎傷害協同加成。"
        },
        {
          id: "frozen_armor",
          name: "冰甲",
          nameEn: "Frozen Armor",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 1,
          prerequisites: [],
          description: "提供防禦加成，並將任何近戰攻擊你的敵人凍結。",
          details: "法師早期必點 1 點防禦技，持續時間長且能強制凍結貼臉敵人。"
        },
        {
          id: "frost_nova",
          name: "霜之新星",
          nameEn: "Frost Nova",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 6,
          prerequisites: [],
          description: "向四周釋放一圈冰霜之環，減緩範圍內所有敵人的移動與攻擊速度。",
          details: "極佳的瞬間大範圍控場技能，適合近身自保。"
        },
        {
          id: "ice_blast",
          name: "冰風暴",
          nameEn: "Ice Blast",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 6,
          prerequisites: ["ice_bolt"],
          synergies: ["冰彈", "冰尖柱", "暴風雪", "冰封球"],
          description: "發射一枚高速魔法冰球，命中時造成高額傷害並將目標完全凍結為冰塊。",
          details: "單體爆發高，可完全凍住小怪使其無法動彈與反擊。"
        },
        {
          id: "shiver_armor",
          name: "碎冰甲",
          nameEn: "Shiver Armor",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 12,
          prerequisites: ["frozen_armor", "ice_bolt", "ice_blast"],
          description: "提升高額防禦，並在敵人發起攻擊時直接對其造成冰寒傷害與減速。",
          details: "防禦加成高於冰甲，敵人只要出手未命中也會受到反擊減速。"
        },
        {
          id: "glacial_spike",
          name: "冰尖柱",
          nameEn: "Glacial Spike",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 18,
          prerequisites: ["ice_bolt", "ice_blast", "frost_nova"],
          synergies: ["冰彈", "冰風暴", "暴風雪"],
          description: "發射一枚巨型冰晶彗星，爆炸時對範圍內所有敵人造成傷害並集體凍結。",
          details: "暴風雪流派的最佳右鍵單體/小範圍速凍點殺控場神技。"
        },
        {
          id: "blizzard",
          name: "暴風雪",
          nameEn: "Blizzard",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 24,
          prerequisites: ["ice_bolt", "ice_blast", "frost_nova", "glacial_spike"],
          synergies: ["冰彈", "冰風暴", "冰尖柱"],
          description: "在指定區域召喚持續降下的大型冰晶暴風，對範圍內所有目標造成毀滅性持續打擊。",
          details: "拓荒與刷寶 (MF) S 級神技，打古代通道、墨菲斯托、暴躁外皮的核心首選。"
        },
        {
          id: "chilling_armor",
          name: "寒冰甲",
          nameEn: "Chilling Armor",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 24,
          prerequisites: ["frozen_armor", "shiver_armor"],
          description: "極巨化防禦力，並在遭受遠程飛行道具射擊時發射冰彈反擊射擊者。",
          details: "剛毅 (Fortitude) 符文之語被擊中時自動觸發的同款甲術。"
        },
        {
          id: "frozen_orb",
          name: "冰封球",
          nameEn: "Frozen Orb",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 30,
          prerequisites: ["ice_bolt", "ice_blast", "frost_nova", "glacial_spike", "blizzard"],
          synergies: ["冰彈"],
          description: "射出一顆旋轉飛行的巨大冰球，沿途向四周狂暴噴射無數冰彈，飛行終點爆裂造成極限傷害。",
          details: "只需點滿本體與冰彈即可成型，是雙修法師 (如冰火法) 最親民靈活的清場利器。"
        },
        {
          id: "cold_mastery",
          name: "冰冷專精 (冰冷支配)",
          nameEn: "Cold Mastery",
          characterClass: "魔法使",
          tree: "冰霜法術",
          requiredLevel: 30,
          prerequisites: [],
          description: "被動技能：大幅削弱敵人的冰冷抗性，使冰霜法術造成貫穿傷害。",
          details: "D2R 破免板版本中，配合破冰板能大幅削減破免怪抗性，保證冰法頂級清場地位。"
        }
      ]
    },
    {
      name: "閃電法術",
      nameEn: "Lightning Spells",
      description: "擁有全遊戲上限最高的瞬間爆發力、全螢幕彈射電芒，以及無可替代的神級位移傳送術。",
      skills: [
        {
          id: "charged_bolt",
          name: "充能彈",
          nameEn: "Charged Bolt",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["連鎖閃電", "閃電"],
          description: "釋放多道沿地面蜿蜒前進的不規則電弧。",
          details: "貼身近戰對大型 Boss 釋放時多發全中，早期單挑主力。"
        },
        {
          id: "static_field",
          name: "靜態力場 (靜態場)",
          nameEn: "Static Field",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 6,
          prerequisites: [],
          description: "瞬間削減周圍所有敵人目前生命值的 25%！",
          details: "打 Boss 神技！普通難度可削至 1 點血，地獄難度可快速將任何怪削至 50% 血線。"
        },
        {
          id: "telekinesis",
          name: "心靈傳動",
          nameEn: "Telekinesis",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 6,
          prerequisites: [],
          synergies: ["能量護盾"],
          description: "以念力隔空拾取藥水、金幣、開啟寶箱、門、祭壇或傳送門，並擊退暈眩敵人。",
          details: "能量護盾 (ES) 的極核心協同被動：每級減少 ES 承受傷害時的法力損耗比率。"
        },
        {
          id: "nova",
          name: "新星 (閃電新星)",
          nameEn: "Nova",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 12,
          prerequisites: ["static_field"],
          synergies: ["靜態力場"],
          description: "自身為中心向 360 度釋放瞬發電環，快速打擊周圍所有怪物。",
          details: "2.4 改版後獲得靜態力場傷害協同，配合自持無限成為頂級刷圖 Meta。"
        },
        {
          id: "lightning",
          name: "閃電",
          nameEn: "Lightning",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 12,
          prerequisites: ["charged_bolt"],
          synergies: ["充能彈", "新星", "連鎖閃電"],
          description: "發射一道筆直貫穿整個螢幕的直線強光閃電，單發傷害上限極高 (可破萬)。",
          details: "電法主力單體與狹長走廊穿刺技能，配合高施法速度 (117 FCR 檔位) 連續轟炸。"
        },
        {
          id: "chain_lightning",
          name: "連鎖閃電",
          nameEn: "Chain Lightning",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 18,
          prerequisites: ["charged_bolt", "lightning"],
          synergies: ["充能彈", "新星", "閃電"],
          description: "釋放一道可在多個敵人之間自動連續彈射的閃電弧線。",
          details: "電法大面積清怪的絕佳主力，面對分散怪群自動鎖定彈射。"
        },
        {
          id: "teleport",
          name: "傳送術",
          nameEn: "Teleport",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 18,
          prerequisites: ["telekinesis"],
          description: "瞬間將自身與傭兵、召喚物移動至滑鼠指定的螢幕任何位置！",
          details: "暗黑2全遊戲核心位移神技，穿牆過圖、跑王、重整傭兵陣型的終極手段。"
        },
        {
          id: "thunder_storm",
          name: "雷雲風暴",
          nameEn: "Thunder Storm",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 24,
          prerequisites: ["charged_bolt", "static_field", "lightning", "nova", "chain_lightning"],
          description: "召喚頭頂雷雲，在技能持續期間每隔數秒自動劈下一道落雷轟擊周邊隨機敵人。",
          details: "自動跟隨被動輸出，補刀與 PVP 騷擾非常實用。"
        },
        {
          id: "energy_shield",
          name: "能量護盾",
          nameEn: "Energy Shield",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 24,
          prerequisites: ["charged_bolt", "telekinesis", "lightning", "teleport", "chain_lightning"],
          description: "建立法力護盾，將自身受到的傷害按百分比 (最高 95%) 轉移至法力球吸收。",
          details: "頂球法師核心保命技，點滿心靈傳動減少法力消耗比率，使生命僅數百的法師硬如鋼鐵。"
        },
        {
          id: "lightning_mastery",
          name: "閃電專精 (閃電支配)",
          nameEn: "Lightning Mastery",
          characterClass: "魔法使",
          tree: "閃電法術",
          requiredLevel: 30,
          prerequisites: [],
          description: "被動技能：以極其恐怖的百分比大幅倍增所有閃電法術的直接傷害 (可達 400%+)。",
          details: "電法傷害數字逆天的根源，每一點技能提升都能帶來巨量輸出躍升。"
        }
      ]
    },
    {
      name: "火焰法術",
      nameEn: "Fire Spells",
      description: "以火球、隕石與多頭蛇焚燒地獄大軍，兼具強化隊友近戰攻擊的輔助神技。",
      skills: [
        {
          id: "fire_bolt",
          name: "火彈",
          nameEn: "Fire Bolt",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["火球", "隕石"],
          description: "發射一顆微型魔法火球，造成火焰傷害。",
          details: "1 級起手小法術，為火球與隕石提供堅實協同加成。"
        },
        {
          id: "warmth",
          name: "溫暖",
          nameEn: "Warmth",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 1,
          prerequisites: [],
          description: "被動技能：恆定提升法力自然恢復速度。",
          details: "幾乎全法系必定投資 1 點的基本功，大幅緩解法力乾涸困擾。"
        },
        {
          id: "inferno",
          name: "地獄之火",
          nameEn: "Inferno",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 6,
          prerequisites: [],
          description: "持續向前噴射一道高溫火焰流，燒灼路徑上的目標。",
          details: "直線持續引導技能，早期拓荒狹窄通道好用。"
        },
        {
          id: "blaze",
          name: "熾烈之徑",
          nameEn: "Blaze",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 12,
          prerequisites: ["inferno"],
          description: "在奔跑身後留下一道燃燒的火海，並在持續時間內提升自身跑步速度！",
          details: "2.4 改版後大幅增加跑速，拓荒引怪繞圈風箏 (例如都瑞爾) 奇效神技。"
        },
        {
          id: "fire_ball",
          name: "火球",
          nameEn: "Fire Ball",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 12,
          prerequisites: ["fire_bolt"],
          synergies: ["火彈", "隕石"],
          description: "發射一枚高速爆裂火球，命中時產生小範圍烈焰爆炸。",
          details: "火法靈魂主力，施法速度極快、彈道爽快、爆發驚人。"
        },
        {
          id: "fire_wall",
          name: "火牆",
          nameEn: "Fire Wall",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 18,
          prerequisites: ["inferno", "blaze"],
          synergies: ["溫暖"],
          description: "在指定地面升起一道橫向熊熊烈焰之牆，對站立其中的敵人造成毀滅性秒傷。",
          details: "定點木樁怪與 Boss 的噩夢，極少點數即可打出誇張面板輸出。"
        },
        {
          id: "enchant",
          name: "強化",
          nameEn: "Enchant",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 18,
          prerequisites: ["warmth", "fire_bolt", "fire_ball"],
          synergies: ["溫暖"],
          description: "為自身、隊友、傭兵或召喚物的武器附加高額火焰傷害與巨幅命中率加成！",
          details: "熱門強化法師套路，弓法、雙熱騎、召喚死靈與小號升級的最佳保姆神技。"
        },
        {
          id: "meteor",
          name: "隕石",
          nameEn: "Meteor",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 24,
          prerequisites: ["fire_bolt", "inferno", "blaze", "fire_ball", "fire_wall"],
          synergies: ["火彈", "火球"],
          description: "從天際召喚一顆巨大燃燒隕石轟擊地面，造成毀滅性砸落衝擊並在地面留下燃燒火坑。",
          details: "火法極限單發傷害代表，重砸配合火球轟炸能瞬間融化非火免敵人。"
        },
        {
          id: "hydra",
          name: "九頭蛇 (多頭蛇)",
          nameEn: "Hydra",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 30,
          prerequisites: ["fire_bolt", "warmth", "fire_ball", "enchant"],
          synergies: ["火彈", "火球"],
          description: "在地面召喚多頭火焰巨蛇守衛，自動向視野內的敵人連續吐出火彈。",
          details: "2.4 改版解除召喚冷卻時間！最多可召喚多組守衛，開門放狗、隔牆探路安全安逸。"
        },
        {
          id: "fire_mastery",
          name: "火焰專精 (火焰支配)",
          nameEn: "Fire Mastery",
          characterClass: "魔法使",
          tree: "火焰法術",
          requiredLevel: 30,
          prerequisites: [],
          description: "被動技能：以極高百分比大幅提升所有火焰法術造成的直接傷害。",
          details: "使火球、隕石與九頭蛇輸出產生質變的頂級被動技能。"
        }
      ]
    }
  ]
};
