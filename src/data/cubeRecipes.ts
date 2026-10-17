import { CubeRecipeData } from '../types';

export const CUBE_RECIPES_DATA: CubeRecipeData[] = [
  // ── 打孔配方 (Socketing) ──
  {
    id: "socket_weapon",
    category: "socket",
    title: "白色普通武器打孔",
    titleEn: "Socket Normal Weapon",
    inputs: ["1x Ral (8#)", "1x Amn (11#)", "1x 完美紫寶石", "1x 一般無孔白色武器"],
    output: "隨機孔數該武器 (1 至該物品當前物品等級最大孔數)",
    notes: "只能用於無前綴的普通白裝或無形白裝，超強的 (Superior) 或劣質的不可用。"
  },
  {
    id: "socket_armor",
    category: "socket",
    title: "白色普通胸甲打孔 (防具打孔BUG修復後依然可用)",
    titleEn: "Socket Normal Body Armor",
    inputs: ["1x Tal (7#)", "1x Thul (10#)", "1x 完美黃寶石", "1x 一般無孔白色胸甲"],
    output: "隨機孔數該盔甲 (1 至最大孔數)",
    notes: "洗無形盔甲給剛毅傭兵底材時最常用。"
  },
  {
    id: "socket_helm",
    category: "socket",
    title: "白色普通頭盔打孔",
    titleEn: "Socket Normal Helm",
    inputs: ["1x Ral (8#)", "1x Thul (10#)", "1x 完美藍寶石", "1x 一般無孔白色頭盔"],
    output: "隨機孔數該頭盔 (1 至最大孔數)",
    notes: "常用於洗搖曳焰火、治癒等頭盔底材。"
  },
  {
    id: "socket_shield",
    category: "socket",
    title: "白色普通盾牌打孔",
    titleEn: "Socket Normal Shield",
    inputs: ["1x Tal (7#)", "1x Amn (11#)", "1x 完美紅寶石", "1x 一般無孔白色盾牌"],
    output: "隨機孔數該盾牌 (1 至最大孔數)",
    notes: "統治者大盾洗 4 孔（精神盾）或聖騎士專用盾洗孔。"
  },

  // ── 裝備升級配方 (Upgrades) ──
  {
    id: "upgrade_unique_weapon_norm_to_excep",
    category: "upgrade",
    title: "暗金武器：普通階級 升級為 進階階級",
    titleEn: "Upgrade Unique Weapon (Normal to Exceptional)",
    inputs: ["1x Ral (8#)", "1x Sol (12#)", "1x 完美綠寶石", "1x 普通暗金武器"],
    output: "進階版同款暗金武器",
    notes: "基礎攻擊力上升，需求力量與等級相應提高。"
  },
  {
    id: "upgrade_unique_weapon_excep_to_elite",
    category: "upgrade",
    title: "暗金武器：進階階級 升級為 精英階級",
    titleEn: "Upgrade Unique Weapon (Exceptional to Elite)",
    inputs: ["1x Lum (17#)", "1x Pul (21#)", "1x 完美綠寶石", "1x 進階暗金武器"],
    output: "精英版同款暗金武器",
    notes: "例如：海鷗升級、泰坦的復仇升級為女族長標槍、阿里巴巴升級。"
  },
  {
    id: "upgrade_unique_armor_norm_to_excep",
    category: "upgrade",
    title: "暗金防具：普通階級 升級為 進階階級",
    titleEn: "Upgrade Unique Armor (Normal to Exceptional)",
    inputs: ["1x Tal (7#)", "1x Shael (13#)", "1x 完美鑽石", "1x 普通暗金防具"],
    output: "進階版同款暗金防具",
    notes: "例如：法師之拳 (輕型鐵手套) 升級為戰場手套 (Battle Gauntlets)。"
  },
  {
    id: "upgrade_unique_armor_excep_to_elite",
    category: "upgrade",
    title: "暗金防具：進階階級 升級為 精英階級",
    titleEn: "Upgrade Unique Armor (Exceptional to Elite)",
    inputs: ["1x Ko (18#)", "1x Lem (20#)", "1x 完美鑽石", "1x 進階暗金防具"],
    output: "精英版同款暗金防具",
    notes: "例如：蝮蛇法師之皮升級為古龍皮甲 (Wyrmhide)、飾金盾牌升級為薩卡蘭姆盾。"
  },

  // ── 手工合成配方 (Crafted Items) ──
  {
    id: "craft_caster_amulet",
    category: "craft",
    title: "施法者手工項鍊 (Caster Amulet)",
    titleEn: "Crafted Caster Amulet",
    inputs: ["1x 魔法項鍊 (藍色)", "1x Ral (8#)", "1x 完美紫寶石", "1x 任意珠寶 (Jewel)"],
    output: "手工施法項鍊 (附帶 +5-10% 快速施法速度 FCR、法力回充 +4-10%、+10-20 法力)",
    notes: "人物 93 級以上配合 93 等級項鍊賭博或打 88+ 場景掉落項鍊，最高可洗出 +2 職業技能與 +20% FCR 的神級項鍊！"
  },
  {
    id: "craft_blood_gloves",
    category: "craft",
    title: "吸血鬼血腥手套 (Blood Gloves)",
    titleEn: "Crafted Blood Gloves",
    inputs: ["1x 魔法重型手套/鯊皮手套/吸血鬼手套", "1x Nef (4#)", "1x 完美紅寶石", "1x 任意珠寶"],
    output: "手工血腥手套 (附帶 5-10% 壓碎打擊 CB、每次命中偷取 1-3% 生命、+10-20 生命)",
    notes: "物理近戰（標馬、雙熱丁、弓馬）畢業手套首選，有機會同時出現 +2 標槍 +20% 攻速。"
  },
  {
    id: "craft_caster_ring",
    category: "craft",
    title: "施法者手工戒指 (Caster Ring)",
    titleEn: "Crafted Caster Ring",
    inputs: ["1x 魔法戒指 (藍色)", "1x Amn (11#)", "1x 完美紫寶石", "1x 任意珠寶"],
    output: "手工施法戒指 (附帶 +1-5 生命、法力回充 +4-10%、+10-20 法力，有機會出 10 FCR)",
    notes: "適合彌補法力抗性或衝刺 105/200 FCR 斷點。"
  },
  {
    id: "craft_hit_power_gloves",
    category: "craft",
    title: "打擊力量擊退手套 (Hit Power Gloves)",
    titleEn: "Crafted Hit Power Gloves",
    inputs: ["1x 魔法鎖鏈手套/重裝手套/吸魂手套", "1x Ort (9#)", "1x 完美藍寶石", "1x 任意珠寶"],
    output: "手工打擊手套 (固定自帶擊退 Knockback、被擊中時 5% 施展霜之新星)",
    notes: "物理弓馬的最愛，免於被近戰怪包圍。"
  },

  // ── 洗裝與重置配方 (Misc & Respec) ──
  {
    id: "token_of_absolution",
    category: "misc",
    title: "赦免徽章 (重置技能與屬性點數)",
    titleEn: "Token of Absolution",
    inputs: [
      "1x 扭曲的痛苦精華 (Twisted Essence of Suffering - 安達利爾/都瑞爾掉落)",
      "1x 充能的憎恨精華 (Charged Essence of Hatred - 墨菲斯托掉落)",
      "1x 燃燒的恐懼精華 (Burning Essence of Terror - 迪亞布羅掉落)",
      "1x 潰爛的毀滅精華 (Festering Essence of Destruction - 巴爾掉落)"
    ],
    output: "1x 赦免徽章 (右鍵點擊可重置全部技能點與屬性點)",
    notes: "地獄難度四大關底 Boss 掉落精華，供無限次洗點使用。"
  },
  {
    id: "secret_cow_level",
    category: "misc",
    title: "開啟秘密乳牛關卡",
    titleEn: "Open Secret Cow Level Portal",
    inputs: ["1x 維特之腳 (Wirt's Leg)", "1x 城鎮傳送之書 (Tome of Town Portal)"],
    output: "開啟通往秘密乳牛關卡 (Moo Moo Farm) 的紅色傳送門",
    notes: "需在同一難度完成擊殺巴爾後，於第一章蘿格營地內放入方塊轉化。"
  },
  {
    id: "repair_weapon",
    category: "repair",
    title: "完全修理武器並補充充能 (免金幣)",
    titleEn: "Fully Repair and Recharge Weapon",
    inputs: ["1x Ral (8#)", "1x 損壞的武器"],
    output: "耐久度全滿且聚氣技能次數全補滿的武器",
    notes: "無形 (Ethereal) 裝備無法透過此配方修復耐久。"
  },
  {
    id: "repair_armor",
    category: "repair",
    title: "完全修理防具並補充充能 (免金幣)",
    titleEn: "Fully Repair and Recharge Armor",
    inputs: ["1x Ort (9#)", "1x 損壞的防具"],
    output: "耐久度全滿且聚氣技能次數全補滿的防具",
    notes: "修理高額維修費的符文之語（如剛毅、謎團）時省錢妙招。"
  },
  {
    id: "reroll_grand_charm",
    category: "misc",
    title: "重置魔法超大護身符 (洗技能板)",
    titleEn: "Reroll Magic Grand Charm",
    inputs: ["3x 任意完美寶石 (Perfect Gems)", "1x 魔法超大護身符 (ilvl 85+)"],
    output: "隨機重新生成屬性的魔法超大護身符",
    notes: "使用巴爾、迪亞布羅、尼拉塞克掉落的 91+ 級護身符，有機會洗出 +1 技能 +45 生命的夢幻神板！"
  }
];
