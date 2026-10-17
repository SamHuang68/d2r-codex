import { SkillTreeGroup } from "./types";

export const ASSASSIN_SKILLS: SkillTreeGroup = {
  characterClass: "刺客",
  trees: [
    {
      name: "武學藝術",
      nameEn: "Martial Arts",
      description: "聚集元素與物理殺意的充能連擊，配合終結技引爆；2.6 馬賽克 (Mosaic) 誕生後的全遊戲天花板。",
      skills: [
        {
          id: "tiger_strike",
          name: "虎擊 (猛虎擊)",
          nameEn: "Tiger Strike",
          characterClass: "刺客",
          tree: "武學藝術",
          requiredLevel: 1,
          prerequisites: [],
          description: "近身打擊為下次終結技充能，最多疊加 3 層，第 3 層提供高達 1440% 的巨額物理傷害倍率！",
          details: "物理踢刺與武學刺客最霸道的單發物理增傷充能招式。"
        },
        {
          id: "dragon_talon",
          name: "龍爪 (連續踢擊 / 龍踢)",
          nameEn: "Dragon Talon",
          characterClass: "刺客",
          tree: "武學藝術",
          requiredLevel: 1,
          prerequisites: [],
          description: "終結技：發動疾風驟雨般的連續迴旋踢擊 (最多 6-7 連踢)，每次踢擊皆可釋放充能並觸發壓碎打擊！",
          details: "馬賽克刺客 (Mosaic) 與盾擊殺王踢刺的靈魂終結技！配合雙馬賽克不耗充能，踢一下引發全屏百道雷光冰火核爆。"
        },
        {
          id: "fists_of_fire",
          name: "烈火拳 (炎拳)",
          nameEn: "Fists of Fire",
          characterClass: "武學藝術",
          tree: "武學藝術",
          requiredLevel: 6,
          prerequisites: [],
          description: "拳爪打擊充能：1段附加火傷、2段引發火焰爆炸、3段在地面留下一片高傷燃燒烈焰！",
          details: "火系武學充能，馬賽克刺客火球火坑的視覺特效源頭。"
        },
        {
          id: "dragon_claw",
          name: "雙爪揮擊 (神龍擺尾 / 雙爪剪)",
          nameEn: "Dragon Claw",
          characterClass: "刺客",
          tree: "武學藝術",
          requiredLevel: 6,
          prerequisites: ["dragon_talon"],
          description: "終結技：雙爪同時進行交叉剪擊，雙爪各自計算傷害與命中判定並釋放武學充能！",
          details: "雙爪刺客主力近身雙持終結招式。"
        },
        {
          id: "cobra_strike",
          name: "眼鏡蛇攻擊 (蛇擊)",
          nameEn: "Cobra Strike",
          characterClass: "刺客",
          tree: "武學藝術",
          requiredLevel: 12,
          prerequisites: ["tiger_strike"],
          description: "充能招式：1段偷取生命、2段同時偷血偷魔、3段偷取高達 80%+ 生命與法力！",
          details: "馬賽克刺客的永動機心臟！只要疊上 2-3 段蛇擊，戰鬥中雙球永遠 100% 滿血滿魔，絕對死不了。"
        },
        {
          id: "claws_of_thunder",
          name: "雷爪 (雷電拳)",
          nameEn: "Claws of Thunder",
          characterClass: "刺客",
          tree: "武學藝術",
          requiredLevel: 18,
          prerequisites: ["fists_of_fire"],
          description: "拳爪打擊充能：1段附加電傷、2段釋放新星環、3段爆發出全屏瘋狂散射的充能彈！",
          details: "馬賽克刺客核心輸出！充能彈與電新星同時常駐觸發，融化地獄 8 人難度一切怪物。"
        },
        {
          id: "dragon_tail",
          name: "神龍擺尾 (龍尾神踢)",
          nameEn: "Dragon Tail",
          characterClass: "刺客",
          tree: "武學藝術",
          requiredLevel: 18,
          prerequisites: ["dragon_talon", "dragon_claw"],
          description: "終結技：迴旋飛踢目標引發驚天動地的物理火焰震盪波，將範圍內所有敵人震飛擊退！",
          details: "虎擊搭配神龍擺尾能打出數十萬單發火傷 AOE，踢爆群怪。"
        },
        {
          id: "blades_of_ice",
          name: "寒冰刃 (冰爪)",
          nameEn: "Blades of Ice",
          characterClass: "刺客",
          tree: "武學藝術",
          requiredLevel: 24,
          prerequisites: ["fists_of_fire", "claws_of_thunder"],
          description: "拳爪打擊充能：1段冰霜傷害、2段寒氣爆炸、3段大範圍將周圍所有敵人完全凍結為冰雕！",
          details: "馬賽克刺客的最強控場充能，發動時全螢幕怪物全部變成不會動的冰塊任你踢。"
        },
        {
          id: "dragon_flight",
          name: "飛龍在天 (瞬移飛踢)",
          nameEn: "Dragon Flight",
          characterClass: "刺客",
          tree: "武學藝術",
          requiredLevel: 24,
          prerequisites: ["dragon_talon", "dragon_claw", "dragon_tail"],
          description: "終結技：刺客瞬間傳送至螢幕任何敵人頭頂，施展一記從天而降的致命飛踢並釋放充能！",
          details: "刺客天生的位移刺殺神技！無需謎團即可跨越地形直接貼臉切入目標首領。"
        },
        {
          id: "phoenix_strike",
          name: "鳳凰擊 (鳳凰三段擊)",
          nameEn: "Phoenix Strike",
          characterClass: "刺客",
          tree: "武學藝術",
          requiredLevel: 30,
          prerequisites: ["tiger_strike", "cobra_strike", "claws_of_thunder", "blades_of_ice"],
          description: "三位一體終極充能：1段從天召喚流星隕石、2段連鎖閃電彈射、3段爆發出無數混沌冰球！",
          details: "武學刺客的巔峰技能！在雙馬賽克符文之語下，隕石、連鎖閃電與混沌冰球每秒連續轟炸十幾次，毀天滅地。"
        }
      ]
    },
    {
      name: "影子訓練",
      nameEn: "Shadow Disciplines",
      description: "刺客的隱秘秘術，包含全遊戲最強抗性減傷「消解」、無視法術的「武器格擋」與神級眩暈「心靈爆震」。",
      skills: [
        {
          id: "claw_mastery",
          name: "利爪專精",
          nameEn: "Claw Mastery",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 1,
          prerequisites: [],
          description: "被動技能：大幅提升使用爪類武器時的傷害、攻擊準確率與致命打擊機率。",
          details: "武學刺與狂怒飛刃刺客的底層物理被動基石。"
        },
        {
          id: "psychic_hammer",
          name: "心靈震擊 (念力錘)",
          nameEn: "Psychic Hammer",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 1,
          prerequisites: [],
          description: "以意念隔空重擊目標心靈，造成魔法打擊並將其強行擊退暈眩。",
          details: "早期遠程打斷敵人施法的小法術。"
        },
        {
          id: "burst_of_speed",
          name: "加速 (急速奔馳 / BoS)",
          nameEn: "Burst of Speed",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 6,
          prerequisites: ["claw_mastery"],
          description: "在持續時間內瘋狂暴增移動速度與攻擊速度 (攻擊速度最高加成 60%+，移速加成 70%+)！",
          details: "跑圖如飛、極速出手！與消解 (Fade) 互斥，安全環境下開加速能極大提高刷圖效率。"
        },
        {
          id: "weapon_block",
          name: "武器格擋 (雙爪格擋)",
          nameEn: "Weapon Block",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 12,
          prerequisites: ["claw_mastery"],
          description: "被動技能：當雙持爪類武器時，獲得高達 60%+ 的機率格擋任何物理攻擊與所有魔法/元素傷害！",
          details: "暗黑2全遊戲唯一能「格擋魔法法術 (如隕石、骨魂、閃電)」的神級防禦天賦！"
        },
        {
          id: "cloak_of_shadows",
          name: "幽靈偽裝 (暗影斗篷 / CoS)",
          nameEn: "Cloak of Shadows",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 12,
          prerequisites: ["psychic_hammer"],
          description: "召喚暗影遮蔽全場光明，致盲全螢幕所有遠程怪物使它們無法射擊，並巨幅削減怪物防禦力，同時提升自身防禦！",
          details: "黑魂、電鬼與女妖的終極剋星！一放斗篷，全場怪物失明呆立，防禦砍半。"
        },
        {
          id: "fade",
          name: "消解 (能量消退 / 遁影)",
          nameEn: "Fade",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 18,
          prerequisites: ["burst_of_speed"],
          description: "使身軀半透明化，巨幅增加火冰電毒全四系元素抗性 (最高 +60%+)、提供固定物理傷害減免 (每級 +1% DR)，並縮短受到詛咒的時間達 80%！",
          details: "背信 (Treachery) 符文之語自帶同款！對抗超級崔斯特姆與任何危險環境的至尊保命神技。"
        },
        {
          id: "shadow_warrior",
          name: "暗影戰士 (影武者)",
          nameEn: "Shadow Warrior",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 18,
          prerequisites: ["claw_mastery", "psychic_hammer", "weapon_block", "cloak_of_shadows"],
          description: "召喚一名影武者幻影，該影武者會主動使用刺客本體當前設置在左右鍵上的相同技能進行協同攻擊！",
          details: "可精確控制影武者施放技能 (如放置特定陷阱或施展暗影斗篷)，極佳的戰術分身。"
        },
        {
          id: "mind_blast",
          name: "心靈爆震 (心靈震盪 / MB)",
          nameEn: "Mind Blast",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 24,
          prerequisites: ["psychic_hammer", "cloak_of_shadows"],
          description: "以精神念力轟炸指定區域，擊退並群體眩暈所有敵人，同時有機率將怪物轉化為盟友攻擊同伴！",
          details: "全遊戲最霸道群體軟硬兼施控場！在危險死角連續點擊數下，怪物集體眩暈或倒戈相向。"
        },
        {
          id: "venom",
          name: "毒牙 (塗毒)",
          nameEn: "Venom",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 18,
          prerequisites: ["claw_mastery", "psychic_hammer", "burst_of_speed", "fade"],
          description: "為武器附著致命濃縮劇毒，將毒素持續時間強制壓縮至 0.4 秒內瞬間爆發造成極速高額毒傷！",
          details: "快速打擊武器 (如踢擊或狂怒飛刃) 的好幫手，0.4 秒短週期讓每次攻擊都重置高額毒傷。"
        },
        {
          id: "shadow_master",
          name: "暗影大師 (影子分身)",
          nameEn: "Shadow Master",
          characterClass: "刺客",
          tree: "影子訓練",
          requiredLevel: 30,
          prerequisites: ["claw_mastery", "psychic_hammer", "weapon_block", "cloak_of_shadows", "shadow_warrior"],
          description: "召喚一名擁有極高自主 AI 的暗影大師，她能自由使用刺客全系技能，並佩戴高階黃金神裝！",
          details: "單兵戰力極強的影子隨從，會自行放置雷光陷阱、開消解、丟心靈爆震控場，血量極厚。"
        }
      ]
    },
    {
      name: "陷阱",
      nameEn: "Traps",
      description: "放置全自動獵殺機械關卡，包含電光四射的雷光守衛、屍爆清屏的亡者守衛與極速飛刃風暴。",
      skills: [
        {
          id: "fire_blast",
          name: "火焰復生 (火爆彈)",
          nameEn: "Fire Blast",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["電能網", "復生之刃", "雷光守衛", "亡者守衛"],
          description: "投擲一枚接觸地面即引發火焰爆炸的烈焰手雷炸彈。",
          details: "陷阱刺在電免怪物面前的最佳火系副修輸出，投擲速度快且傷害不俗。"
        },
        {
          id: "shock_web",
          name: "電能網",
          nameEn: "Shock Web",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 6,
          prerequisites: ["fire_blast"],
          synergies: ["火焰復生", "雷電復生", "雷光守衛"],
          description: "在地面鋪下一張覆蓋多個閃電節點的電網，踏上的敵人持續遭受電擊。",
          details: "雷光守衛傷害協同技能，定點封門傷害很高。"
        },
        {
          id: "blade_sentinel",
          name: "刃之守護 (旋轉飛刃)",
          nameEn: "Blade Sentinel",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 6,
          prerequisites: [],
          description: "釋放一柄在兩點之間來回旋轉穿梭的鋒利旋轉刀輪，碾壓路徑上的敵人！",
          details: "2.4 改版大幅提高轉化武器傷害百分比並消除冷卻，物理飛刀流的新寵。"
        },
        {
          id: "charged_bolt_sentry",
          name: "雷電復生 (充能彈守衛)",
          nameEn: "Charged Bolt Sentry",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 12,
          prerequisites: ["shock_web"],
          synergies: ["雷光守衛", "電能網"],
          description: "放置一座小型機關陷阱，向周圍發射密集的地裂充能電球。",
          details: "雷光守衛的前置與核心協同技能之一。"
        },
        {
          id: "wake_of_fire",
          name: "復生之刃 (火焰之甦醒 / 火陷阱)",
          nameEn: "Wake of Fire",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 12,
          prerequisites: ["fire_blast"],
          synergies: ["火焰復生", "復生之怒"],
          description: "放置一座火焰陷阱，連續向前方扇形噴射多道重疊的烈焰波紋橫掃整群敵人！",
          details: "刺客 1-40 級普通與惡夢難度拓荒戰神！放 5 個火陷阱怪物走過來直接被火浪蒸發。"
        },
        {
          id: "blade_fury",
          name: "飛刃風暴 (飛刀機關槍)",
          nameEn: "Blade Fury",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 18,
          prerequisites: ["fire_blast", "blade_sentinel"],
          description: "雙手向前狂暴連續射出無數鋒利飛刃，繼承武器的物理傷害、壓碎打擊 (CB) 與偷血特效！",
          details: "飛刀刺客的主力！站在超遠距離像機關槍一樣狂射飛刀，攻速高達每秒 6 刀，打 Boss 極速觸發 CB。"
        },
        {
          id: "lightning_sentry",
          name: "雷光守衛 (雷電陷阱 / LS)",
          nameEn: "Lightning Sentry",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 24,
          prerequisites: ["shock_web", "charged_bolt_sentry"],
          synergies: ["電能網", "雷電復生", "亡者守衛"],
          description: "放置一座強力雷電陷阱，自動向視野內敵人發射多發貫穿全場的強力直線穿刺閃電！",
          details: "陷阱刺客 (Trapsin) 絕對靈魂！最多可同時放置 5 座，自動索敵連續射擊，極其安全舒適安逸。"
        },
        {
          id: "wake_of_inferno",
          name: "復生之怒 (煉獄陷阱)",
          nameEn: "Wake of Inferno",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 24,
          prerequisites: ["fire_blast", "wake_of_fire"],
          synergies: ["火焰復生", "復生之刃"],
          description: "放置一座烈焰噴射器陷阱，向單一敵人持續噴吐長距離地獄火流！",
          details: "2.4 改版大幅增加射程與傷害，對付單體大木樁 Boss 的火焰灼燒陷阱。"
        },
        {
          id: "death_sentry",
          name: "亡者守衛 (屍爆陷阱 / DS)",
          nameEn: "Death Sentry",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 30,
          prerequisites: ["lightning_sentry"],
          synergies: ["雷光守衛"],
          description: "放置一座死靈機關，射出閃電攻擊敵人，並在周圍有怪物倒下時自動引爆屍體造成巨額範圍屍爆 (CE)！",
          details: "刺客自帶的自動化屍體爆炸神技！雷光守衛打死第一隻怪後，亡者守衛瞬間連環引爆，全屏清場。"
        },
        {
          id: "blade_shield",
          name: "刃之盾 (利刃護盾)",
          nameEn: "Blade Shield",
          characterClass: "刺客",
          tree: "陷阱",
          requiredLevel: 30,
          prerequisites: ["fire_blast", "blade_sentinel", "blade_fury"],
          description: "以旋轉的刀刃風暴環繞身體，任何貼身接觸的敵人都會被利刃持續切割並觸發武器特效！",
          details: "2.4 改版大幅提高持續時間並減少武器耐久度損耗，近戰刺客的隨身防護反傷絞肉機。"
        }
      ]
    }
  ]
};
