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
        inputsEn: ["1x Ral (#8)","1x Amn (#11)","1x Perfect Amethyst","1x Normal Plain Weapon"],
    outputEn: "Socketed Weapon (Random 1 to max sockets for ilvl)",
notes: "只能用於無前綴的普通白裝或無形白裝，特等的 (Superior) 或劣質的不可用。",
    notesEn: "Only works on non-socketed normal or ethereal weapons. Superior or low-quality cannot be cube-socketed."
  },
  {
    id: "socket_armor",
    category: "socket",
    title: "白色普通胸甲打孔 (防具打孔BUG修復後依然可用)",
    titleEn: "Socket Normal Body Armor",
    inputs: ["1x Tal (7#)", "1x Thul (10#)", "1x 完美黃寶石", "1x 一般無孔白色胸甲"],
    output: "隨機孔數該盔甲 (1 至最大孔數)",
        inputsEn: ["1x Tal (#7)","1x Thul (#10)","1x Perfect Topaz","1x Normal Plain Body Armor"],
    outputEn: "Socketed Body Armor (Random 1 to max sockets for ilvl)",
notes: "洗無形盔甲給剛毅傭兵底材時最常用。",
    notesEn: "Commonly used on ethereal armor for mercenary Fortitude bases."
  },
  {
    id: "socket_helm",
    category: "socket",
    title: "白色普通頭盔打孔",
    titleEn: "Socket Normal Helm",
    inputs: ["1x Ral (8#)", "1x Thul (10#)", "1x 完美藍寶石", "1x 一般無孔白色頭盔"],
    output: "隨機孔數該頭盔 (1 至最大孔數)",
        inputsEn: ["1x Ral (#8)","1x Thul (#10)","1x Perfect Sapphire","1x Normal Plain Helm"],
    outputEn: "Socketed Helm (Random 1 to max sockets for ilvl)",
notes: "常用於洗閃爍火焰、治癒等頭盔底材。",
    notesEn: "Used for Flickering Flame and Cure helm bases."
  },
  {
    id: "socket_shield",
    category: "socket",
    title: "白色普通盾牌打孔",
    titleEn: "Socket Normal Shield",
    inputs: ["1x Tal (7#)", "1x Amn (11#)", "1x 完美紅寶石", "1x 一般無孔白色盾牌"],
    output: "隨機孔數該盾牌 (1 至最大孔數)",
        inputsEn: ["1x Tal (#7)","1x Amn (#11)","1x Perfect Ruby","1x Normal Plain Shield"],
    outputEn: "Socketed Shield (Random 1 to max sockets for ilvl)",
notes: "君主盾洗 4 孔（精神盾）或聖騎士專用盾洗孔。",
    notesEn: "Used to roll 4 sockets on Monarch (Spirit) or Paladin shields."
  },

  // ── 裝備升級配方 (Upgrades) ──
  {
    id: "upgrade_unique_weapon_norm_to_excep",
    category: "upgrade",
    title: "暗金武器：普通階級 升級為 卓越階級",
    titleEn: "Upgrade Unique Weapon (Normal to Exceptional)",
    inputs: ["1x Ral (8#)", "1x Sol (12#)", "1x 完美綠寶石", "1x 普通暗金武器"],
    output: "卓越版同款暗金武器",
        inputsEn: ["1x Ral (#8)","1x Sol (#12)","1x Perfect Emerald","1x Normal Unique Weapon"],
    outputEn: "Exceptional Version of Unique Weapon",
notes: "基礎攻擊力上升，需求力量與等級相應提高。",
    notesEn: "Base weapon damage increases; required strength and level increase accordingly."
  },
  {
    id: "upgrade_unique_weapon_excep_to_elite",
    category: "upgrade",
    title: "暗金武器：卓越階級 升級為 精英階級",
    titleEn: "Upgrade Unique Weapon (Exceptional to Elite)",
    inputs: ["1x Lum (17#)", "1x Pul (21#)", "1x 完美綠寶石", "1x 卓越暗金武器"],
    output: "精英版同款暗金武器",
        inputsEn: ["1x Lum (#17)","1x Pul (#21)","1x Perfect Emerald","1x Exceptional Unique Weapon"],
    outputEn: "Elite Version of Unique Weapon",
notes: "例如：海鷗升級、泰坦的復仇升級為女傑標槍、阿里巴巴升級。",
    notesEn: "Examples: Seagull, Titan's Revenge to Matriarchal Javelin, Blade of Ali Baba."
  },
  {
    id: "upgrade_unique_armor_norm_to_excep",
    category: "upgrade",
    title: "暗金防具：普通階級 升級為 卓越階級",
    titleEn: "Upgrade Unique Armor (Normal to Exceptional)",
    inputs: ["1x Tal (7#)", "1x Shael (13#)", "1x 完美鑽石", "1x 普通暗金防具"],
    output: "卓越版同款暗金防具",
        inputsEn: ["1x Tal (#7)","1x Shael (#13)","1x Perfect Diamond","1x Normal Unique Armor"],
    outputEn: "Exceptional Version of Unique Armor",
notes: "例如：法師之拳 (輕型護手) 升級為戰鬥護手 (Battle Gauntlets)。",
    notesEn: "Examples: Magefist (Light Gauntlets) upgraded to Battle Gauntlets."
  },
  {
    id: "upgrade_unique_armor_excep_to_elite",
    category: "upgrade",
    title: "暗金防具：卓越階級 升級為 精英階級",
    titleEn: "Upgrade Unique Armor (Exceptional to Elite)",
    inputs: ["1x Ko (18#)", "1x Lem (20#)", "1x 完美鑽石", "1x 卓越暗金防具"],
    output: "精英版同款暗金防具",
        inputsEn: ["1x Ko (#18)","1x Lem (#20)","1x Perfect Diamond","1x Exceptional Unique Armor"],
    outputEn: "Elite Version of Unique Armor",
notes: "例如：蛇魔法師之皮升級為龍皮甲 (Wyrmhide)、撒卡蘭姆使者升級為撒卡蘭姆盾。",
    notesEn: "Examples: Skin of the Vipermagi to Wyrmhide, Herald of Zakarum to Zakarum Shield."
  },

  // ── 手工合成配方 (Crafted Items) ──
  {
    id: "craft_caster_amulet",
    category: "craft",
    title: "施法者手工護身符 (Caster Amulet)",
    titleEn: "Crafted Caster Amulet",
    inputs: ["1x 魔法項鍊 (藍色)", "1x Ral (8#)", "1x 完美紫寶石", "1x 任意珠寶 (Jewel)"],
    output: "手工施法項鍊 (附帶 +5-10% 快速施法速度 FCR、法力回充 +4-10%、+10-20 法力)",
        inputsEn: ["1x Magic Amulet (Blue)","1x Ral (#8)","1x Perfect Amethyst","1x Any Jewel"],
    outputEn: "Crafted Caster Amulet (+5-10% FCR, Regenerate Mana +4-10%, +10-20 Mana)",
notes: "人物 93 級以上配合 93 等級護身符賭博或打 88+ 場景掉落護身符，最高可洗出 +2 職業技能與 +20% FCR 的神級護身符！",
    notesEn: "Gamble at character level 93+ to guarantee ilvl >= 88, capable of rolling +2 Class Skills and 20% FCR!"
  },
  {
    id: "craft_blood_gloves",
    category: "craft",
    title: "吸血鬼血腥手套 (Blood Gloves)",
    titleEn: "Crafted Blood Gloves",
    inputs: ["1x 魔法厚皮手套/鯊皮手套/吸血鬼骸骨手套", "1x Nef (4#)", "1x 完美紅寶石", "1x 任意珠寶"],
    output: "手工血腥手套 (附帶 5-10% 粉碎打擊 CB、每次命中偷取 1-3% 生命、+10-20 生命)",
        inputsEn: ["1x Magic Heavy/Sharkskin/Vampirebone Gloves","1x Nef (#4)","1x Perfect Ruby","1x Any Jewel"],
    outputEn: "Crafted Blood Gloves (5-10% Crushing Blow, 1-3% Life Stolen, +10-20 Life)",
notes: "物理近戰（標馬、雙熱丁、弓馬）畢業手套首選，有機會同時出現 +2 標槍 +20% 攻速。",
    notesEn: "Premier gloves for physical melee & Javazon; can roll +2 Javelin skills and 20% IAS."
  },
  {
    id: "craft_caster_ring",
    category: "craft",
    title: "施法者手工戒指 (Caster Ring)",
    titleEn: "Crafted Caster Ring",
    inputs: ["1x 魔法戒指 (藍色)", "1x Amn (11#)", "1x 完美紫寶石", "1x 任意珠寶"],
    output: "手工施法戒指 (附帶 +1-5 能量、法力回充 +4-10%、+10-20 法力，有機會出 10 FCR)",
        inputsEn: ["1x Magic Ring (Blue)","1x Amn (#11)","1x Perfect Amethyst","1x Any Jewel"],
    outputEn: "Crafted Caster Ring (+1-5 Energy, Regenerate Mana +4-10%, +10-20 Mana, up to 10% FCR)",
notes: "適合彌補法力抗性或衝刺 105/200 FCR 斷點。",
    notesEn: "Ideal for hitting 105% or 200% FCR breakpoints while bolstering mana pool."
  },
  {
    id: "craft_hit_power_gloves",
    category: "craft",
    title: "打擊力量擊退手套 (Hit Power Gloves)",
    titleEn: "Crafted Hit Power Gloves",
    inputs: ["1x 魔法鍊甲手套/重型護腕/護臂", "1x Ort (9#)", "1x 完美藍寶石", "1x 任意珠寶"],
    output: "手工打擊手套 (固定自帶擊退 Knockback、攻擊者反傷 3-7、被擊中時 5% 機率施展等級 4 冰霜新星)",
        inputsEn: ["1x Magic Chain Gloves/Heavy Bracers/Vambraces","1x Ort (#9)","1x Perfect Sapphire","1x Any Jewel"],
    outputEn: "Crafted Hit Power Gloves (Knockback, Attacker Takes Dmg 3-7, 5% Chance Lv4 Frost Nova on struck)",
notes: "物理弓馬的最愛，免於被近戰怪包圍。",
    notesEn: "Favorite gloves for physical Bowazons to keep enemies knocked back."
  },

  // ── 洗裝與重置配方 (Misc & Respec) ──
  {
    id: "token_of_absolution",
    category: "misc",
    title: "赦免徽章 (重置技能與屬性點數)",
    titleEn: "Token of Absolution",
    inputs: [
      "1x 扭曲的苦怨精華 (Twisted Essence of Suffering - 安達莉爾/都瑞爾掉落)",
      "1x 充盈的憎恨精華 (Charged Essence of Hatred - 墨菲斯托掉落)",
      "1x 燃燒的恐懼精華 (Burning Essence of Terror - 迪亞布羅掉落)",
      "1x 潰爛的毀滅精華 (Festering Essence of Destruction - 巴爾掉落)"
    ],
    output: "1x 赦免徽章 (右鍵點擊可重置全部技能點與屬性點)",
        inputsEn: ["1x Twisted Essence of Suffering (Andariel / Duriel)","1x Charged Essence of Hatred (Mephisto)","1x Burning Essence of Terror (Diablo)","1x Festering Essence of Destruction (Baal)"],
    outputEn: "1x Token of Absolution (Right-click to reset all stats and skills)",
notes: "地獄難度四大關底 Boss 掉落精華，供無限次洗點使用。",
    notesEn: "Essences drop from Hell difficulty Act bosses, providing unlimited stat and skill respecs."
  },
  {
    id: "secret_cow_level",
    category: "misc",
    title: "開啟秘密乳牛關",
    titleEn: "Open Secret Cow Level Portal",
    inputs: ["1x 維特的腿 (Wirt's Leg)", "1x 城鎮傳送之書 (Tome of Town Portal)"],
    output: "開啟通往秘密乳牛關 (Moo Moo Farm) 的紅色傳送門",
        inputsEn: ["1x Wirt's Leg","1x Tome of Town Portal"],
    outputEn: "Red Portal to the Secret Cow Level (Moo Moo Farm)",
notes: "需在同一難度完成擊殺巴爾後，於第一章俠盜營地內放入方塊轉化。",
    notesEn: "Must defeat Baal on the same difficulty; transmute inside Act 1 Rogue Encampment."
  },
  {
    id: "repair_weapon",
    category: "repair",
    title: "完全修理武器 (免金幣)",
    titleEn: "Fully Repair Weapon",
    inputs: ["1x Ort (9#)", "1x 損壞的武器"],
    output: "耐久度全滿的武器",
        inputsEn: ["1x Ort (#9)","1x Damaged Weapon"],
    outputEn: "Fully Repaired Weapon (Full Durability)",
notes: "無形 (Ethereal) 裝備無法透過此配方修復耐久。要連聚氣技能次數一起補滿，請用下方「武器快速修復與聚氣充能」（再加 1 顆碎裂寶石）。",
    notesEn: "Ethereal items cannot be repaired. To recharge spell charges as well, add a chipped gem."
  },
  {
    id: "repair_armor",
    category: "repair",
    title: "完全修理防具 (免金幣)",
    titleEn: "Fully Repair Armor",
    inputs: ["1x Ral (8#)", "1x 損壞的防具"],
    output: "耐久度全滿的防具",
        inputsEn: ["1x Ral (#8)","1x Damaged Armor"],
    outputEn: "Fully Repaired Armor (Full Durability)",
notes: "修理高額維修費的符文之語（如剛毅、謎團）時省錢妙招。無形裝備無法修復耐久。要連聚氣技能次數一起補滿，請用下方「防具快速修復與聚氣充能」（再加 1 顆瑕疵寶石）。",
    notesEn: "Saves massive gold on high-repair Runewords like Fortitude or Enigma. Ethereal items cannot be repaired."
  },
  {
    id: "reroll_grand_charm",
    category: "misc",
    title: "重置魔法特大咒符 (洗技能板)",
    titleEn: "Reroll Magic Grand Charm",
    inputs: ["3x 任意完美寶石 (Perfect Gems)", "1x 魔法特大咒符 (遊戲配方接受任何魔法物品；洗板建議 ilvl 85+)"],
    output: "隨機重新生成屬性的魔法特大咒符",
        inputsEn: ["3x Any Perfect Gems","1x Magic Grand Charm (ilvl 85+ recommended)"],
    outputEn: "Rerolled Magic Grand Charm (New Random Affixes, same ilvl)",
notes: "使用巴爾、迪亞布羅、尼拉塞克掉落的 91+ 級咒符，有機會洗出 +1 技能 +45 生命的夢幻神板！",
    notesEn: "Using ilvl 91+ charms from Baal, Diablo, or Nihlathak can roll +1 Skill and +45 Life!"
  },
  {
    id: "unsocket_item",
    category: "repair",
    title: "拔除已鑲嵌物 (清空鑲孔)",
    titleEn: "Unsocket Item (Remove socketed gems/runes)",
    inputs: ["1x Hel (15#)", "1x 城鎮傳送卷軸 (Scroll of Town Portal)", "1x 已鑲嵌物品"],
    output: "鑲孔完全清空的原本裝備 (孔數保留)",
        inputsEn: ["1x Hel (#15)","1x Scroll of Town Portal","1x Socketed Item"],
    outputEn: "Cleared Base Item (Preserves sockets, destroys all socketed gems/runes)",
notes: "【警告】：孔內原先鑲嵌的符文、寶石或珠寶將永久銷毀摧毀，裝備本體與孔位完好保留。常用於重洗精神盾/精神劍 FCR。",
    notesEn: "WARNING: All socketed items are permanently destroyed. Base item and sockets are preserved."
  },
  {
    id: "upgrade_rare_weapon_norm_to_excep",
    category: "upgrade",
    title: "亮黃武器：普通階級 升級為 卓越階級",
    titleEn: "Upgrade Rare Weapon (Normal to Exceptional)",
    inputs: ["1x Ort (9#)", "1x Amn (11#)", "1x 完美藍寶石", "1x 普通亮黃武器"],
    output: "卓越版同款亮黃武器 (保留所有詞綴屬性與鑲孔)",
        inputsEn: ["1x Ort (#9)","1x Amn (#11)","1x Perfect Sapphire","1x Normal Rare Weapon"],
    outputEn: "Exceptional Rare Weapon (Preserves all affixes and sockets)",
notes: "升級後基礎傷害提升，需求等級與屬性增加。",
    notesEn: "Base weapon damage increases; required strength, dexterity, and level increase."
  },
  {
    id: "upgrade_rare_weapon_excep_to_elite",
    category: "upgrade",
    title: "亮黃武器：卓越階級 升級為 精英階級",
    titleEn: "Upgrade Rare Weapon (Exceptional to Elite)",
    inputs: ["1x Fal (19#)", "1x Um (22#)", "1x 完美藍寶石", "1x 卓越亮黃武器"],
    output: "精英版同款亮黃武器",
        inputsEn: ["1x Fal (#19)","1x Um (#22)","1x Perfect Sapphire","1x Exceptional Rare Weapon"],
    outputEn: "Elite Rare Weapon (Preserves all affixes and sockets)",
notes: "例如極品無形自回亮黃近戰武器（如狂戰斧、幻化之刃）升頂。",
    notesEn: "Used to upgrade godly ethereal self-repair rare weapons (Berserker Axe, Phase Blade)."
  },
  {
    id: "upgrade_rare_armor_norm_to_excep",
    category: "upgrade",
    title: "亮黃防具：普通階級 升級為 卓越階級",
    titleEn: "Upgrade Rare Armor (Normal to Exceptional)",
    inputs: ["1x Ral (8#)", "1x Thul (10#)", "1x 完美紫寶石", "1x 普通亮黃防具"],
    output: "卓越版同款亮黃防具",
        inputsEn: ["1x Ral (#8)","1x Thul (#10)","1x Perfect Amethyst","1x Normal Rare Armor"],
    outputEn: "Exceptional Rare Armor (Preserves all affixes and sockets)",
notes: "適用於亮黃頭盔、盾牌、鞋子、手套或腰帶。",
    notesEn: "Works on rare helms, shields, boots, gloves, and belts."
  },
  {
    id: "upgrade_rare_armor_excep_to_elite",
    category: "upgrade",
    title: "亮黃防具：卓越階級 升級為 精英階級",
    titleEn: "Upgrade Rare Armor (Exceptional to Elite)",
    inputs: ["1x Ko (18#)", "1x Pul (21#)", "1x 完美紫寶石", "1x 卓越亮黃防具"],
    output: "精英版同款亮黃防具",
        inputsEn: ["1x Ko (#18)","1x Pul (#21)","1x Perfect Amethyst","1x Exceptional Rare Armor"],
    outputEn: "Elite Rare Armor (Preserves all affixes and sockets)",
notes: "常用於升級極品雙抗跑鞋或高防禦稀有頭甲。",
    notesEn: "Commonly used for rare tri-res boots or godly rare helms."
  },
  {
    id: "craft_caster_belt",
    category: "craft",
    title: "施法者手工腰帶 (Caster Belt)",
    titleEn: "Crafted Caster Belt",
    inputs: ["1x 魔法輕腰帶/鯊皮腰帶/吸血鬼牙腰帶", "1x Ith (6#)", "1x 完美紫寶石", "1x 任意珠寶"],
    output: "手工施法腰帶 (固定附帶 +5-10% 快速施法速度 FCR、法力回充 +4-10%、+10-20 法力)",
        inputsEn: ["1x Magic Light Belt/Sharkskin Belt/Vampirefang Belt","1x Ith (#6)","1x Perfect Amethyst","1x Any Jewel"],
    outputEn: "Crafted Caster Belt (+5-10% FCR, Regenerate Mana +4-10%, +10-20 Mana)",
notes: "在沒有蜘蛛之網前，唯一的 10% FCR 腰帶來源！",
    notesEn: "The only belt in the game besides Arachnid Mesh that provides 10% Faster Cast Rate!"
  },
  {
    id: "craft_blood_ring",
    category: "craft",
    title: "血腥手工戒指 (Blood Ring)",
    titleEn: "Crafted Blood Ring",
    inputs: ["1x 魔法戒指", "1x Sol (12#)", "1x 完美紅寶石", "1x 任意珠寶"],
    output: "手工血腥戒指 (每次命中偷取 1-3% 生命、+10-20 生命、+1-5 力量)",
        inputsEn: ["1x Magic Ring (Blue)","1x Sol (#12)","1x Perfect Ruby","1x Any Jewel"],
    outputEn: "Crafted Blood Ring (1-3% Life Stolen, +10-20 Life, +1-5 Strength)",
notes: "能隨機再出 +6% 吸血、全抗、準確率與 10% FCR，極品近戰戒指來源。",
    notesEn: "Can roll additional +6% LL, all resistances, attack rating, and 10% FCR."
  },
  {
    id: "uber_tristram_portals",
    category: "misc",
    title: "群魔亂舞事件 (Pandemonium Event)",
    titleEn: "Uber Tristram & Organ Portals",
    inputs: [
      "1x 恐懼之鑰 (Key of Terror - 女伯爵掉落)",
      "1x 憎恨之鑰 (Key of Hate - 召喚師掉落)",
      "1x 毀滅之鑰 (Key of Destruction - 尼拉塞克掉落)"
    ],
    output: "於地獄難度第 5 章城鎮開啟：魔母巢穴、遺忘沙漠或苦痛熔爐隨機一道紅門",
        inputsEn: ["1x Key of Terror (Countess)","1x Key of Hate (Summoner)","1x Key of Destruction (Nihlathak)"],
    outputEn: "Red Portal in Act 5 Hell: Matron's Den, Forgotten Sands, or Furnace of Pain",
notes: "收集『墨菲斯托之腦 + 巴爾之眼 + 迪亞布羅之角』三樣器官，再次放入方塊轉化，即可開啟通往【超級崔斯特姆 (Uber Tristram)】的終極紅門，擊殺三大魔神取得【地獄火炬 (Hellfire Torch)】！",
    notesEn: "Combine Mephisto's Brain + Baal's Eye + Diablo's Horn in Act 5 Hell to open Uber Tristram!"
  },
  {
    id: "reroll_magic_charm",
    category: "misc",
    title: "洗大板：重骰魔法物品 (咒符/珠寶)",
    titleEn: "Reroll Magic Item (Charms / Jewels)",
    inputs: [
      "3x 完美寶石 (Perfect Gems，任意種類，包含骷髏石)",
      "1x 藍色魔法物品 (如特大咒符 Grand Charm、珠寶、頭飾)"
    ],
    output: "全新隨機屬性的同類型魔法物品 (維持原物品等級 ilvl 不變)",
        inputsEn: ["3x Any Perfect Gems (Including Skulls)","1x Magic Item (Grand Charm, Jewel, Circlet)"],
    outputEn: "Rerolled Magic Item (New random affixes, same ilvl preserved)",
notes: "【神級致富公式】！使用巴爾 (ilvl 99)、迪亞布羅 (ilvl 94)、尼拉塞克 (ilvl 95) 或 Terror Zone 邪惡威脅區域 (ilvl 91+) 掉落的大板，可用 3 顆雜碎紫/紅/黃等完美寶石無限洗出『+1 職業單系技能 + 41-45 生命』的天價畢業板！",
    notesEn: "Endless source of wealth: reroll high-level Grand Charms for +1 Skill and +41-45 Life."
  },
  {
    id: "reroll_rare_item",
    category: "misc",
    title: "洗亮黃物品：重骰稀有黃裝",
    titleEn: "Reroll Rare Item with Skulls",
    inputs: [
      "6x 完美骷髏石 (Perfect Skulls)",
      "1x 亮黃稀有物品 (Rare Item)"
    ],
    output: "全新屬性的稀有物品 (ilvl = 0.4 * clvl + 0.4 * 原 ilvl)",
        inputsEn: ["6x Perfect Skulls","1x Rare Item"],
    outputEn: "Rerolled Rare Item (ilvl = 0.4 * clvl + 0.4 * original ilvl)",
notes: "洗權冠 (Diadem) 的最強神技！由於權冠具有極高的品質等級 (qlvl 85) 與魔法等級 (magic_lvl 18)，即使公式會降低 ilvl，洗權冠永遠能夠出現 +2 全技能、20% FCR 與 2 孔的頂級詞綴！",
    notesEn: "Godly on Diadems: qlvl 85 and magic_lvl 18 guarantees +2 Skills and 20% FCR can always roll!"
  },
  {
    id: "repair_armor_recharge",
    category: "repair",
    title: "防具快速修復與聚氣充能",
    titleEn: "Fully Repair and Recharge Armor",
    inputs: [
      "1x 8# 拉爾 (Ral)",
      "1x 瑕疵寶石 (Flawed Gem，充能選用)",
      "1x 耐久度受損或充能耗盡的防具"
    ],
    output: "耐久度與聚氣次數 100% 完整修復的防具",
        inputsEn: ["1x Ral (#8)","1x Flawed Gem (optional for spell charges)","1x Damaged/Depleted Armor"],
    outputEn: "Fully Repaired and Recharged Armor",
notes: "節省數十萬修理費的神技！對於特等的 (Superior) 詞綴的謎團甲或剛毅甲，鐵匠修理費用常高達 50-80 萬金幣；使用 1 顆 8# Ral 放入方塊即可 0 元秒修！若加上 1 顆瑕疵寶石，還能同時補滿所有聚氣次數。",
    notesEn: "Saves up to 800k gold repairing Superior Enigma or Fortitude armor."
  },
  {
    id: "repair_weapon_recharge",
    category: "repair",
    title: "武器快速修復與聚氣充能",
    titleEn: "Fully Repair and Recharge Weapon",
    inputs: [
      "1x 9# 歐特 (Ort)",
      "1x 碎裂寶石 (Chipped Gem，充能選用)",
      "1x 耐久度受損或充能耗盡的武器"
    ],
    output: "耐久度與聚氣次數 100% 完整修復的武器",
        inputsEn: ["1x Ort (#9)","1x Chipped Gem (optional for spell charges)","1x Damaged/Depleted Weapon"],
    outputEn: "Fully Repaired and Recharged Weapon",
notes: "使用 1 顆 9# Ort 即可完全修復任何非無形武器的耐久度，省去昂貴的鐵匠修理金幣。",
    notesEn: "1x Ort completely repairs any non-ethereal weapon, saving costly blacksmith repair fees."
  },
  {
    id: "cow_level_portal",
    category: "misc",
    title: "開啟秘密乳牛關 (The Secret Cow Level)",
    titleEn: "Open The Secret Cow Level",
    inputs: [
      "1x 維特的腿 (Wirt's Leg - 於崔斯特姆左上角維特的屍體取得)",
      "1x 城鎮傳送之書 (Tome of Town Portal)"
    ],
    output: "開啟通往【秘密乳牛關】的深紅色傳送門",
        inputsEn: ["1x Wirt's Leg (from Wirt's corpse in Tristram)","1x Tome of Town Portal"],
    outputEn: "Deep Red Portal to the Secret Cow Level",
notes: "需在已擊敗該難度巴爾的狀態下，於第 1 章俠盜營地放入方塊轉化開啟。在 D2R 中擊殺『牛王 (Cow King)』後，未來仍然可以無限重複開啟乳牛關，不必再擔心鎖關！是刷鑲嵌底材與高階符文的聖地。",
    notesEn: "In D2R, killing the Cow King no longer locks the Cow Level; you can open it infinitely!"
  }
];


