import { SkillTreeGroup } from "./types";

export const AMAZON_SKILLS: SkillTreeGroup = {
  characterClass: "亞馬遜",
  trees: [
    {
      name: "標槍與長矛技能",
      nameEn: "Javelin and Spear Skills",
      description: "以電系雷霆或劇毒強化標槍投擲與近戰突刺，擁有全遊戲頂級的群怪蒸發能力。",
      skills: [
        {
          id: "jab",
          name: "刺擊 (戳刺)",
          nameEn: "Jab",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 1,
          prerequisites: [],
          description: "使用長矛或標槍進行快速的連續三次猛刺。",
          details: "物理長矛或標馬前期拓荒必點技能，近戰觸發壓碎打擊極為迅速。"
        },
        {
          id: "power_strike",
          name: "威力一擊",
          nameEn: "Power Strike",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 6,
          prerequisites: ["jab"],
          synergies: ["充能一擊", "閃電攻擊", "閃電之怒"],
          description: "在近戰武器刺擊中灌注閃電能量，大幅提高傷害與準確率。",
          details: "閃電之怒與充能一擊的早期協同技能。"
        },
        {
          id: "poison_javelin",
          name: "毒槍",
          nameEn: "Poison Javelin",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 6,
          prerequisites: [],
          synergies: ["毒雲槍"],
          description: "投擲一柄在飛行軌跡上留下劇毒雲霧的標槍，使路徑上的敵人中毒。",
          details: "拓荒前期風箏大群小怪的神技，投擲後怪物踩過毒霧持續失血致死。"
        },
        {
          id: "impale",
          name: "穿刺",
          nameEn: "Impale",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 12,
          prerequisites: ["jab"],
          description: "發動極慢但傷害毀天滅地的破甲重刺，2.4 改版後大幅增加減速效果且攻擊不會被中斷！",
          details: "矛馬對決單體 Boss 的重型破壞招式，命中時嚴重降低敵方移動與防禦。"
        },
        {
          id: "lightning_bolt",
          name: "閃電之槍 (閃電球)",
          nameEn: "Lightning Bolt",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 12,
          prerequisites: ["poison_javelin"],
          synergies: ["威力一擊", "充能一擊", "閃電之怒"],
          description: "將投擲出的標槍化為一道純閃電弧光，將 100% 物理傷害完全轉化為閃電傷害且必中！",
          details: "面對高物抗或幽靈怪時的優良轉換射擊招式。"
        },
        {
          id: "charged_strike",
          name: "充能一擊 (CS)",
          nameEn: "Charged Strike",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 18,
          prerequisites: ["jab", "power_strike", "lightning_bolt"],
          synergies: ["威力一擊", "閃電之槍", "閃電之怒", "閃電攻擊"],
          description: "近身刺擊目標，並在命中點爆發釋放多道沿地面散射的高傷充能彈！",
          details: "D2R 全遊戲對體型巨大 Boss (巴爾、暗黑破壞神) 的單體秒殺天花板！所有充能彈貼身全吃瞬間蒸發百萬血量。"
        },
        {
          id: "plague_javelin",
          name: "毒雲槍",
          nameEn: "Plague Javelin",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 18,
          prerequisites: ["poison_javelin", "lightning_bolt"],
          synergies: ["毒槍"],
          description: "投擲一柄落地後爆發大片濃郁毒雲的標槍，感染大範圍內所有敵人。",
          details: "毒標馬核心，2.4 改版大幅縮減技能冷卻時間與毒素作用時間，傷害爆發力翻倍。"
        },
        {
          id: "fend",
          name: "狂怒揮刺 (擊退/狂怒)",
          nameEn: "Fend",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 24,
          prerequisites: ["jab", "impale"],
          description: "使用長矛或標槍向身邊所有相鄰的敵人發動疾風暴雨般的連續揮刺！",
          details: "2.4 改版修復了迴避中斷攻擊的惡性 Bug，近戰矛馬群戰主力輸出。"
        },
        {
          id: "lightning_strike",
          name: "閃電攻擊",
          nameEn: "Lightning Strike",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 30,
          prerequisites: ["jab", "power_strike", "impale", "charged_strike"],
          synergies: ["充能一擊", "閃電之怒"],
          description: "近身刺擊命中時，自打擊點釋放一道可在多個敵人之間瘋狂彈射的連鎖閃電！",
          details: "無限彈射神技，面對中型分散怪群時比投擲更省標槍耐久度。"
        },
        {
          id: "lightning_fury",
          name: "閃電之怒 (LF)",
          nameEn: "Lightning Fury",
          characterClass: "亞馬遜",
          tree: "標槍與長矛技能",
          requiredLevel: 30,
          prerequisites: ["poison_javelin", "lightning_bolt", "plague_javelin"],
          synergies: ["威力一擊", "閃電之槍", "充能一擊", "閃電攻擊"],
          description: "投擲一柄神聖雷霆標槍，命中時分裂出等同於怪物數量的無數道閃電貫穿全場！",
          details: "暗黑破壞神2群刷清場永遠的真神！牛關 (Secret Cow Level) 屠戮者，配合泰坦的復仇與穿透，一槍全屏蒸發。"
        }
      ]
    },
    {
      name: "被動與魔法技能",
      nameEn: "Passive and Magic Skills",
      description: "亞馬遜的神裔體質、被動穿透爆擊、召喚肉盾誘餌與無敵的女武神天兵。",
      skills: [
        {
          id: "inner_sight",
          name: "心靈之眼 (內視)",
          nameEn: "Inner Sight",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 1,
          prerequisites: [],
          description: "照亮附近所有敵人並削減其基礎防禦力，使在黑暗環境中目標無所遁形。",
          details: "早期破防與探路實用技能，也是 Act 1 京子弓箭手傭兵的招牌技。"
        },
        {
          id: "critical_strike",
          name: "致命一擊 (雙倍打擊)",
          nameEn: "Critical Strike",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 1,
          prerequisites: [],
          description: "被動技能：讓你的物理遠程與近戰攻擊有一定機率造成 200% 的雙倍物理傷害！",
          details: "弓馬與矛馬的物理爆發基石，與裝備上的 Deadly Strike (致命打擊) 形成獨立雙重檢定。"
        },
        {
          id: "dodge",
          name: "躲避",
          nameEn: "Dodge",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 6,
          prerequisites: [],
          description: "被動技能：在站立不動發動攻擊時，有機率完全閃避近戰敵人的打擊。",
          details: "三閃防禦之一，2.4 改版後不再鎖死攻擊動畫，安全性大幅提升。"
        },
        {
          id: "slow_missiles",
          name: "慢速箭",
          nameEn: "Slow Missiles",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 12,
          prerequisites: ["inner_sight"],
          description: "使周圍所有敵人的遠程飛行道具 (箭矢、電球、毒彈、骨魂) 飛行速度降低至原本的數分之一！",
          details: "面對電鬼怪群、黑魂、冥河女妖與大量骷髏射手時的神級防護罩。"
        },
        {
          id: "avoid",
          name: "避免",
          nameEn: "Avoid",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 12,
          prerequisites: ["dodge"],
          description: "被動技能：在站立不動攻擊時，有機率完全閃避所有遠程飛行道具打擊。",
          details: "對抗遠程弓箭手與電鬼法術打擊的被動保命神技。"
        },
        {
          id: "penetrate",
          name: "滲透 (刺穿)",
          nameEn: "Penetrate",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 18,
          prerequisites: ["critical_strike"],
          description: "被動技能：以巨額百分比倍增攻擊準確率 (Attack Rating)。",
          details: "弓馬核心被動，確保高等級地獄怪物面前箭無虛發。"
        },
        {
          id: "decoy",
          name: "誘餌",
          nameEn: "Decoy",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 24,
          prerequisites: ["inner_sight", "slow_missiles"],
          description: "在指定地點創造一個與本體外觀完全一致的幻象鏡像，吸引周圍所有敵人全力圍攻。",
          details: "極強的戰術控場道具，探視野、拉走狂熱電鬼仇恨的救命稻草。"
        },
        {
          id: "evade",
          name: "迴避",
          nameEn: "Evade",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 24,
          prerequisites: ["dodge", "avoid"],
          description: "被動技能：在跑動或行走過程中，有機率完全閃避近戰與遠程的一切攻擊！",
          details: "跑圖與拉怪時的被動神技，大幅減少奔跑中被怪物追尾猝死的機率。"
        },
        {
          id: "valkyrie",
          name: "女武神 (瓦爾基麗)",
          nameEn: "Valkyrie",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 30,
          prerequisites: ["inner_sight", "critical_strike", "dodge", "slow_missiles", "avoid", "penetrate", "decoy", "evade"],
          description: "從阿斯嘉特神殿召喚一名身披金甲的無畏女武神協助作戰，血量防禦極其雄厚！",
          details: "暗黑2最強頂級單兵肉盾之一！等級高時自動佩戴頂級金裝武器，能單挑地獄巴爾。"
        },
        {
          id: "pierce",
          name: "穿透",
          nameEn: "Pierce",
          characterClass: "亞馬遜",
          tree: "被動與魔法技能",
          requiredLevel: 30,
          prerequisites: ["critical_strike", "penetrate"],
          description: "被動技能：賦予你的遠程射擊與標槍投擲有機率直接穿透敵人軀體，繼續命中後方目標！",
          details: "標馬與弓馬的核心神技！配合剃刀之尾 (Razortail) 達到 100% 滿穿透，閃電之怒與多重箭成倍增幅。"
        }
      ]
    },
    {
      name: "弓與十字弓技能",
      nameEn: "Bow and Crossbow Skills",
      description: "超遠程漫天箭雨、急凍寒霜控場與極速爆裂火箭，兼具清屏與單體狙殺。",
      skills: [
        {
          id: "magic_arrow",
          name: "魔法箭",
          nameEn: "Magic Arrow",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 1,
          prerequisites: [],
          description: "射出一支不消耗任何箭矢的魔法純能量箭，並將部分物理傷害轉化為純魔法傷害。",
          details: "箭矢用盡時的備用保底，高難度面對物免怪物時的破免手段。"
        },
        {
          id: "fire_arrow",
          name: "火焰箭",
          nameEn: "Fire Arrow",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["爆裂箭", "燃燒箭"],
          description: "為箭矢附加火焰魔法傷害與命中率加成。",
          details: "火弓流前期起步技能，為後期強烈火焰技能提供協同加成。"
        },
        {
          id: "cold_arrow",
          name: "急凍箭 (冰箭)",
          nameEn: "Cold Arrow",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 6,
          prerequisites: [],
          synergies: ["急凍冰箭", "凍結箭"],
          description: "射出帶有冰霜寒氣的箭矢，造成額外冰冷傷害並大幅減緩敵人速度。",
          details: "凍結箭核心協同，每點提升凍結箭 12% 冰寒傷害。"
        },
        {
          id: "multiple_shot",
          name: "多重箭",
          nameEn: "Multiple Shot",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 6,
          prerequisites: ["magic_arrow"],
          description: "一次射出一大片扇形展開的漫天箭雨 (最多 24 支箭) 覆蓋整面戰場！",
          details: "物理弓馬 (風之力/信心) 的招牌清屏神技，超視距打擊，大範圍覆蓋群怪。"
        },
        {
          id: "exploding_arrow",
          name: "爆裂箭",
          nameEn: "Exploding Arrow",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 12,
          prerequisites: ["fire_arrow"],
          synergies: ["火焰箭", "燃燒箭"],
          description: "射出一支命中時產生範圍火焰爆炸的爆鳴箭，引爆周圍所有敵人。",
          details: "惡魔機器 (Demon Machine) 強化弓馬的核心玩法，射速極快且發發穿透連鎖爆炸。"
        },
        {
          id: "ice_arrow",
          name: "急凍冰箭 (碎冰箭)",
          nameEn: "Ice Arrow",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 18,
          prerequisites: ["cold_arrow"],
          synergies: ["急凍箭", "凍結箭"],
          description: "射出一枚高能冰晶箭，命中時將單一目標完全凍結為冰塊！",
          details: "單體強控技能，對付危險狂暴金怪時有奇效。"
        },
        {
          id: "guided_arrow",
          name: "導引箭 (追蹤箭)",
          nameEn: "Guided Arrow",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 18,
          prerequisites: ["magic_arrow", "cold_arrow", "multiple_shot"],
          description: "射出一枚具有自動導航追蹤特性的魔法神箭，箭矢在空中自動拐彎追咬目標！",
          details: "弓馬 PVP 與單挑打王神技，無需瞄準直接隔屏狂射，百分之百必中。"
        },
        {
          id: "strafe",
          name: "掃射 (砲轟)",
          nameEn: "Strafe",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 24,
          prerequisites: ["magic_arrow", "multiple_shot", "guided_arrow"],
          description: "站在原地發動疾風驟雨般的連珠快射，向視野內多個目標狂暴射出最多 10 支箭矢！",
          details: "2.4 改版全面解除了傷害懲罰並加入協同加成！極快觸發壓碎 (CB)、衰老 (喪鐘) 與偷血。"
        },
        {
          id: "immolation_arrow",
          name: "燃燒箭 (犧牲之箭)",
          nameEn: "Immolation Arrow",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 24,
          prerequisites: ["fire_arrow", "exploding_arrow"],
          synergies: ["火焰箭", "爆裂箭"],
          description: "射出一支熾熱火箭，命中時引發劇烈烈焰爆炸並在地面留下一片燃燒火坑！",
          details: "2.4 改版大幅縮短冷卻時間，火弓流的定點打擊王牌。"
        },
        {
          id: "freezing_arrow",
          name: "凍結箭 (霜凍箭)",
          nameEn: "Freezing Arrow",
          characterClass: "亞馬遜",
          tree: "弓與十字弓技能",
          requiredLevel: 30,
          prerequisites: ["cold_arrow", "ice_arrow"],
          synergies: ["急凍箭", "急凍冰箭"],
          description: "射出一顆極寒冰箭，命中時對整片區域爆發冰霜震波，將範圍內所有敵人集體凍成冰雕！",
          details: "冰弓馬絕招！配合穿透可在怪物堆中引發多次連鎖冰環爆炸，全場怪物寸步難行。"
        }
      ]
    }
  ]
};
