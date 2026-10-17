import { SkillTreeGroup } from "./types";

export const NECROMANCER_SKILLS: SkillTreeGroup = {
  characterClass: "死靈法師",
  trees: [
    {
      name: "召喚法術",
      nameEn: "Summoning Spells",
      description: "驅使骷髏大軍、不滅魔像與冥界亡魂，組成堅不可摧的不死軍團平推地獄。",
      skills: [
        {
          id: "raise_skeleton",
          name: "骷髏復生 (復生骷髏)",
          nameEn: "Raise Skeleton",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["支配骷髏"],
          description: "從敵人的屍體上召喚一名忠誠的骷髏戰士協助戰鬥。",
          details: "純召死靈的最核心基石，高等級配合支配骷髏血厚攻高，能頂住地獄難度任何 Boss。"
        },
        {
          id: "skeleton_mastery",
          name: "支配骷髏",
          nameEn: "Skeleton Mastery",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 1,
          prerequisites: ["raise_skeleton"],
          description: "被動技能：大幅增加所有骷髏戰士、骷髏法師與重生怪物的生命值與物理攻擊傷害！",
          details: "純召死靈必滿核心被動，直接使骷髏戰力產生質的飛躍。"
        },
        {
          id: "clay_golem",
          name: "黏土魔像 (土魔)",
          nameEn: "Clay Golem",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 6,
          prerequisites: [],
          synergies: ["支配魔像"],
          description: "從泥土中捏造一具高生命值的黏土魔像，每次擊中敵人或被敵人擊中時大幅減緩敵人的攻擊與移動速度！",
          details: "打王最強控場肉盾！黏土魔像的減速效果與衰老詛咒疊加，能將巴爾徹底定型變成慢動作木樁。"
        },
        {
          id: "golem_mastery",
          name: "支配魔像",
          nameEn: "Golem Mastery",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 12,
          prerequisites: ["clay_golem"],
          description: "被動技能：大幅提升所有魔像的生命總量與移動奔跑速度。",
          details: "保證鐵魔 (Iron Golem) 長久存活不猝死的核心必點被動技能。"
        },
        {
          id: "raise_skeletal_mage",
          name: "復生法師 (骷髏法師)",
          nameEn: "Raise Skeletal Mage",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 12,
          prerequisites: ["raise_skeleton"],
          synergies: ["支配骷髏"],
          description: "從屍體上召喚精通火、冰、電、毒四系元素魔法遠程射擊的骷髏法師。",
          details: "2.4 改版全面加強其傷害與生命，冰法師自帶碎冰控場，毒法師自帶阻止怪回血。"
        },
        {
          id: "blood_golem",
          name: "鮮血魔像 (血魔)",
          nameEn: "Blood Golem",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 18,
          prerequisites: ["clay_golem"],
          synergies: ["支配魔像"],
          description: "創造一具生命鏈接魔像，攻擊敵人時偷取生命並將血量共享治療給主人。",
          details: "2.4 改版解除了受到傷害扣除死靈本體血量的負面懲罰，生存能力大幅提升。"
        },
        {
          id: "iron_golem",
          name: "鋼鐵魔像 (鐵魔)",
          nameEn: "Iron Golem",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 24,
          prerequisites: ["clay_golem", "blood_golem"],
          synergies: ["支配魔像"],
          description: "選中一件金屬武器或防具，將其金屬質地轉化為鋼鐵魔像，魔像永久繼承該裝備的所有神級詞綴！",
          details: "頂級死靈套路：使用「眼光 (Insight)」符文之語底材召喚冥想鐵魔，隨身永動自帶回魔回血！"
        },
        {
          id: "summon_resist",
          name: "召喚抗性",
          nameEn: "Summon Resist",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 24,
          prerequisites: ["clay_golem", "raise_skeleton", "raise_skeletal_mage"],
          description: "被動技能：大幅提升所有骷髏、魔像與重生召喚物的四系元素抗性 (最高可達 70%+)。",
          details: "地獄難度面對大菠蘿火風暴與巴爾連環霜凍時，確保召喚大軍不被瞬間蒸發的保命神技。"
        },
        {
          id: "fire_golem",
          name: "火焰魔像 (火魔)",
          nameEn: "Fire Golem",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 30,
          prerequisites: ["clay_golem", "blood_golem", "iron_golem"],
          synergies: ["支配魔像"],
          description: "召喚燃燒著地獄烈焰的巨型火焰魔像，自帶聖火靈氣脈衝，並將受到的火焰傷害轉化為生命治療自身。",
          details: "自帶高嘲諷吸怪仇恨，死亡時引發烈焰自爆重創周圍敵人。"
        },
        {
          id: "revive",
          name: "重生 (復活)",
          nameEn: "Revive",
          characterClass: "死靈法師",
          tree: "召喚法術",
          requiredLevel: 30,
          prerequisites: ["clay_golem", "raise_skeleton", "raise_skeletal_mage", "iron_golem"],
          synergies: ["支配骷髏"],
          description: "從倒下的怪物屍體中將其靈魂喚回，復活為擁有 200% 原生血量與傷害的狂暴亡靈隨從！",
          details: "召喚死靈打大 Boss 與紅門的神技！復活大笨獸 (Urdar) 等自帶壓碎打擊 (CB) 的重型怪，數秒敲死六王。"
        }
      ]
    },
    {
      name: "毒素與白骨法術",
      nameEn: "Poison and Bone Spells",
      description: "掌控全暗黑最強的物理清場神技「屍體爆炸」、劇毒新星與無視大部分抗性的魔法骨矛。",
      skills: [
        {
          id: "teeth",
          name: "牙",
          nameEn: "Teeth",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["骨矛", "骨牢", "骨魂"],
          description: "發射多枚扇形擴散的魔法尖牙打擊敵人。",
          details: "死靈 1 級遠程起手法術，高等級時為骨矛與骨魂提供穩健協同加成。"
        },
        {
          id: "bone_armor",
          name: "骸骨裝甲 (骨甲)",
          nameEn: "Bone Armor",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 1,
          prerequisites: [],
          synergies: ["骨牆", "骨牢"],
          description: "召喚旋轉的白色骸骨環繞身軀，吸收指定數值的物理傷害打擊。",
          details: "吸收量只受骨牆與骨牢的協同加成，是死靈應對物理刺客與重擊小怪的核心保命甲。"
        },
        {
          id: "poison_dagger",
          name: "毒匕首",
          nameEn: "Poison Dagger",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 6,
          prerequisites: [],
          synergies: ["毒爆", "劇毒新星"],
          description: "在匕首武器上塗抹致命劇毒，近身刺擊造成巨額攻擊準確率加成與持續高傷劇毒。",
          details: "為劇毒新星提供重要的傷害協同，毒系死靈必滿被動鏈條。"
        },
        {
          id: "corpse_explosion",
          name: "屍體爆炸 (屍爆 / CE)",
          nameEn: "Corpse Explosion",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 6,
          prerequisites: ["teeth"],
          description: "引爆指定怪物屍體，造成相當於該怪物生前最大生命值 70%~120% 的範圍傷害 (50% 物理 + 50% 火焰)！",
          details: "暗黑破壞神2全遊戲最具代表性的 S 級清場天花板神技！只要怪群倒下一隻，連環引爆瞬間清屏整張地圖。"
        },
        {
          id: "bone_wall",
          name: "骨牆",
          nameEn: "Bone Wall",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 12,
          prerequisites: ["bone_armor"],
          synergies: ["骸骨裝甲", "骨牢"],
          description: "在戰場上立起一道高耐用度的堅固白骨之牆，阻擋怪物通行並吸引周邊怪物仇恨火網。",
          details: "隔開怪群、製造狹窄地形的戰術防護神技，同時也是骨甲與骨矛的核心協同來源。"
        },
        {
          id: "poison_explosion",
          name: "毒爆",
          nameEn: "Poison Explosion",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 18,
          prerequisites: ["poison_dagger", "corpse_explosion"],
          synergies: ["毒匕首", "劇毒新星"],
          description: "引爆屍體釋放一團極度濃稠的致命毒雲，對站立其中的敵人造成狂暴毒傷。",
          details: "為劇毒新星每點提供 10% 劇毒傷害協同。"
        },
        {
          id: "bone_spear",
          name: "骨矛",
          nameEn: "Bone Spear",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 18,
          prerequisites: ["teeth", "corpse_explosion"],
          synergies: ["牙", "骨牆", "骨牢", "骨魂"],
          description: "向前射出一道高速直線穿透的骨質長矛，對路徑上所有敵人造成純魔法傷害！",
          details: "純骨死靈主力推進技能，彈道筆直穿透，在地牢通道中如同死神射線。"
        },
        {
          id: "bone_prison",
          name: "骨牢",
          nameEn: "Bone Prison",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 24,
          prerequisites: ["bone_wall", "bone_spear"],
          synergies: ["骸骨裝甲", "骨牆"],
          description: "在目標敵人腳下瞬間召喚一圈緊密的骨之牢籠，將其完全禁錮在原地無法移動！",
          details: "封鎖 Boss (如暗黑破壞神) 的神技，怪物在骨牢內無法貼臉近戰，只能任人宰割。"
        },
        {
          id: "poison_nova",
          name: "劇毒新星 (毒環)",
          nameEn: "Poison Nova",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 30,
          prerequisites: ["poison_dagger", "poison_explosion"],
          synergies: ["毒匕首", "毒爆"],
          description: "自身向 360 度噴射一圈綠色劇毒骨刺新星，在 2 秒內對周圍全螢幕所有怪物造成毀滅性劇毒傷害！",
          details: "毒死靈 (Poisonmancer) 招牌神技！配合破毒板與死靈降抗詛咒，2 秒融化地獄牛關與 85 級場景。"
        },
        {
          id: "bone_spirit",
          name: "骨魂",
          nameEn: "Bone Spirit",
          characterClass: "死靈法師",
          tree: "毒素與白骨法術",
          requiredLevel: 30,
          prerequisites: ["bone_spear"],
          synergies: ["牙", "骨牆", "骨矛", "骨牢"],
          description: "釋放一顆具有追蹤靈性的魔法骨魂，在空中盤旋鎖定單一敵人進行精準轟炸！",
          details: "純骨靈單體對王與 PVP 狙殺的最強純魔法單發輸出技能。"
        }
      ]
    },
    {
      name: "詛咒",
      nameEn: "Curses",
      description: "削弱地獄惡魔心智與肉體的不祥降咒，包含使物理抗性腰斬的傷害加深與救命吸血光環。",
      skills: [
        {
          id: "amplify_damage",
          name: "傷害加深 (放大傷害 / AD)",
          nameEn: "Amplify Damage",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 1,
          prerequisites: [],
          description: "詛咒大片區域內的敵人，使其承受的物理傷害巨幅增加，直接降低敵方 100% 物理抗性！",
          details: "破除物理免疫的神級詛咒！也是屍體爆炸 (CE) 傷害翻倍的至尊黃金搭檔。"
        },
        {
          id: "dim_vision",
          name: "微暗靈視 (迷茫)",
          nameEn: "Dim Vision",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 6,
          prerequisites: [],
          description: "詛咒目標視野，大幅縮減敵人的偵測範圍至 1 格，使其失去目標呆立在原地！",
          details: "應對危險遠程怪物 (黑魂、電鬼、弓箭手、女妖) 的至尊控場解法，一放全場安靜。"
        },
        {
          id: "weaken",
          name: "削弱",
          nameEn: "Weaken",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 6,
          prerequisites: ["amplify_damage"],
          description: "削弱敵人的力量，使其造成的物理傷害直接降低 33%。",
          details: "衰老詛咒的前置，早期減少傭兵暴斃的自保小咒語。"
        },
        {
          id: "iron_maiden",
          name: "攻擊反噬 (鐵娘子)",
          nameEn: "Iron Maiden",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 12,
          prerequisites: ["amplify_damage"],
          description: "詛咒敵人，當其造成近戰物理傷害時，將該傷害以數倍百分比 (最高 600%+) 反噬給自己！",
          details: "早期普通難度配合黏土魔像，讓頭目 Boss 攻擊魔像時將自己彈死的神奇戰術。"
        },
        {
          id: "terror",
          name: "恐懼 (逃跑)",
          nameEn: "Terror",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 12,
          prerequisites: ["weaken"],
          description: "向敵人心中灌注極致恐懼，強迫範圍內的怪物尖叫著轉身四散逃跑！",
          details: "被怪物近身包圍時的救命脫身技能，也是衰老的前置。"
        },
        {
          id: "confuse",
          name: "幽冥迷霧 (迷亂)",
          nameEn: "Confuse",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 18,
          prerequisites: ["dim_vision"],
          description: "擾亂怪物心智，使其陷入瘋狂混亂，隨機攻擊身邊的所有其他同類怪物！",
          details: "看神仙打架神技！牛關或高密怪堆中一放，整群牛群開始自相殘殺。"
        },
        {
          id: "life_tap",
          name: "生命偷取 (偷取生命 / LT)",
          nameEn: "Life Tap",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 18,
          prerequisites: ["iron_maiden"],
          description: "詛咒敵人，任何友方單位攻擊被詛咒者時，將其造成的 50% 物理傷害瞬間轉化為生命治療自身！",
          details: "盾擊騎士殺超級崔斯特姆紅門六王的必備生命線！只要命中一拳瞬間滿血，永不暴斃。"
        },
        {
          id: "attract",
          name: "吸引",
          nameEn: "Attract",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 24,
          prerequisites: ["confuse"],
          description: "指定一名敵人為仇恨靶心，強迫周圍所有怪物將所有攻擊全部集中打在該目標身上！",
          details: "不會被其他詛咒覆蓋的神奇詛咒，聚怪與製造肉盾的最佳利器。"
        },
        {
          id: "decrepify",
          name: "衰老",
          nameEn: "Decrepify",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 24,
          prerequisites: ["weaken", "terror"],
          description: "使敵方同時遭受三大懲罰：移動速度降低 50%、攻擊速度降低 50%、物理抗性降低 50%、物理傷害降低 50%！",
          details: "暗黑2全遊戲綜合戰略價值最高的詛咒！死神的喪鐘 (The Reaper's Toll) 傭兵必備，破除物免並徹底廢掉 Boss 行動能力。"
        },
        {
          id: "lower_resist",
          name: "降低抗性 (降抗 / LR)",
          nameEn: "Lower Resist",
          characterClass: "死靈法師",
          tree: "詛咒",
          requiredLevel: 30,
          prerequisites: ["weaken", "terror", "iron_maiden", "life_tap", "decrepify"],
          description: "大幅削弱範圍內所有敵人的火焰、冰冷、閃電與毒素抗性 (最高可降 60%+)，並能破除元素免疫！",
          details: "毒死靈必備破防主咒！也是法師、電標馬、陷阱刺組隊時最喜愛的神級輔助隊友詛咒。"
        }
      ]
    }
  ]
};
