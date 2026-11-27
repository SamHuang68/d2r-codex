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
    title: "暗金武器：一般階級 升級為 進階階級",
    titleEn: "Upgrade Unique Weapon (Normal to Exceptional)",
    inputs: ["1x Ral (8#)", "1x Sol (12#)", "1x 完美綠寶石", "1x 一般暗金武器"],
    output: "進階版同款暗金武器",
        inputsEn: ["1x Ral (#8)","1x Sol (#12)","1x Perfect Emerald","1x Normal Unique Weapon"],
    outputEn: "Exceptional Version of Unique Weapon",
notes: "基礎攻擊力上升，需求力量與等級相應提高。",
    notesEn: "Base weapon damage increases; required strength and level increase accordingly."
  },
  {
    id: "upgrade_unique_weapon_excep_to_elite",
    category: "upgrade",
    title: "暗金武器：進階階級 升級為 菁英階級",
    titleEn: "Upgrade Unique Weapon (Exceptional to Elite)",
    inputs: ["1x Lum (17#)", "1x Pul (21#)", "1x 完美綠寶石", "1x 進階暗金武器"],
    output: "菁英版同款暗金武器",
        inputsEn: ["1x Lum (#17)","1x Pul (#21)","1x Perfect Emerald","1x Exceptional Unique Weapon"],
    outputEn: "Elite Version of Unique Weapon",
notes: "例如：泰坦的復仇升級為女傑標槍、阿里巴巴升級。",
    notesEn: "Examples: Titan's Revenge to Matriarchal Javelin, Blade of Ali Baba."
  },
  {
    id: "upgrade_unique_armor_norm_to_excep",
    category: "upgrade",
    title: "暗金防具：一般階級 升級為 進階階級",
    titleEn: "Upgrade Unique Armor (Normal to Exceptional)",
    inputs: ["1x Tal (7#)", "1x Shael (13#)", "1x 完美鑽石", "1x 一般暗金防具"],
    output: "進階版同款暗金防具",
        inputsEn: ["1x Tal (#7)","1x Shael (#13)","1x Perfect Diamond","1x Normal Unique Armor"],
    outputEn: "Exceptional Version of Unique Armor",
notes: "例如：法師之拳 (輕型護手) 升級為戰鬥護手 (Battle Gauntlets)。",
    notesEn: "Examples: Magefist (Light Gauntlets) upgraded to Battle Gauntlets."
  },
  {
    id: "upgrade_unique_armor_excep_to_elite",
    category: "upgrade",
    title: "暗金防具：進階階級 升級為 菁英階級",
    titleEn: "Upgrade Unique Armor (Exceptional to Elite)",
    inputs: ["1x Ko (18#)", "1x Lem (20#)", "1x 完美鑽石", "1x 進階暗金防具"],
    output: "菁英版同款暗金防具",
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
notes: "需在已擊敗該難度巴爾之後，於第 1 章俠盜營地放入維特的腿與城鎮傳送之書轉化。D2R 中擊殺牛王不會鎖關，之後仍可再開門。",
    notesEn: "Must have defeated Baal on that difficulty; transmute Wirt's Leg + Tome of Town Portal in the Act 1 Rogue Encampment. In D2R, killing the Cow King no longer locks the portal."
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
notes: "無形 (Ethereal) 裝備無法透過此配方修復耐久。若要一併充能，請用另一條「武器快速修復與聚氣充能」（Ort + 必要的碎裂寶石 + 武器）。",
    notesEn: "Ethereal items cannot be repaired this way. To also refill charges, use the separate recharge recipe (Ort + the required chipped gem + weapon)."
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
notes: "修理高額維修費的符文之語（如剛毅、謎團）時省錢妙招。無形裝備無法以此修復耐久。若要一併充能，請用另一條「防具快速修復與聚氣充能」（Ral + 必要的瑕疵寶石 + 防具）。",
    notesEn: "Saves gold on high-repair Runewords like Fortitude or Enigma. Ethereal items cannot be repaired this way. To also refill charges, use the separate recharge recipe (Ral + the required flawed gem + armor)."
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
    title: "亮黃武器：一般階級 升級為 進階階級",
    titleEn: "Upgrade Rare Weapon (Normal to Exceptional)",
    inputs: ["1x Ort (9#)", "1x Amn (11#)", "1x 完美藍寶石", "1x 一般亮黃武器"],
    output: "進階版同款亮黃武器 (保留所有詞綴屬性與鑲孔)",
        inputsEn: ["1x Ort (#9)","1x Amn (#11)","1x Perfect Sapphire","1x Normal Rare Weapon"],
    outputEn: "Exceptional Rare Weapon (Preserves all affixes and sockets)",
notes: "升級後基礎傷害提升，需求等級與屬性增加。",
    notesEn: "Base weapon damage increases; required strength, dexterity, and level increase."
  },
  {
    id: "upgrade_rare_weapon_excep_to_elite",
    category: "upgrade",
    title: "亮黃武器：進階階級 升級為 菁英階級",
    titleEn: "Upgrade Rare Weapon (Exceptional to Elite)",
    inputs: ["1x Fal (19#)", "1x Um (22#)", "1x 完美藍寶石", "1x 進階亮黃武器"],
    output: "菁英版同款亮黃武器",
        inputsEn: ["1x Fal (#19)","1x Um (#22)","1x Perfect Sapphire","1x Exceptional Rare Weapon"],
    outputEn: "Elite Rare Weapon (Preserves all affixes and sockets)",
notes: "例如極品無形自回亮黃近戰武器（如狂戰斧、幻化之刃）升頂。",
    notesEn: "Used to upgrade godly ethereal self-repair rare weapons (Berserker Axe, Phase Blade)."
  },
  {
    id: "upgrade_rare_armor_norm_to_excep",
    category: "upgrade",
    title: "亮黃防具：一般階級 升級為 進階階級",
    titleEn: "Upgrade Rare Armor (Normal to Exceptional)",
    inputs: ["1x Ral (8#)", "1x Thul (10#)", "1x 完美紫寶石", "1x 一般亮黃防具"],
    output: "進階版同款亮黃防具",
        inputsEn: ["1x Ral (#8)","1x Thul (#10)","1x Perfect Amethyst","1x Normal Rare Armor"],
    outputEn: "Exceptional Rare Armor (Preserves all affixes and sockets)",
notes: "適用於亮黃頭盔、盾牌、鞋子、手套或腰帶。",
    notesEn: "Works on rare helms, shields, boots, gloves, and belts."
  },
  {
    id: "upgrade_rare_armor_excep_to_elite",
    category: "upgrade",
    title: "亮黃防具：進階階級 升級為 菁英階級",
    titleEn: "Upgrade Rare Armor (Exceptional to Elite)",
    inputs: ["1x Ko (18#)", "1x Pul (21#)", "1x 完美紫寶石", "1x 進階亮黃防具"],
    output: "菁英版同款亮黃防具",
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
notes: "手工施法腰帶是 5–10% FCR 的腰帶來源之一；暗金 FCR 腰帶另有蜘蛛之網 (20% FCR) 與基德的賭注 (10–20% FCR)。",
    notesEn: "Crafted caster belts are one source of 5–10% FCR belts; unique FCR belts include Arachnid Mesh (20% FCR) and Gheed's Wager (10–20% FCR)."
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
notes: "高等級特大咒符重洗：以 3 顆完美寶石（紫、紅、黃等皆可）將魔法物品重洗為新的魔法物品，物品等級 (ilvl) 維持不變。巴爾 (ilvl 99)、迪亞布羅 (ilvl 94)、尼拉塞克 (ilvl 92) 或 Terror Zone 邪惡威脅區域 (ilvl 91+) 掉落的特大咒符，可反覆重洗以嘗試『+1 職業單系技能 + 41-45 生命』的詞綴組合。\n附註（洗技能板）：ilvl 91 以上的特大咒符（巴爾、迪亞布羅、尼拉塞克等來源）才有機會洗出 +1 職業單系技能與高生命；每次結果隨機，不保證洗出。",
    notesEn: "Reroll high-level Grand Charms repeatedly while hunting for +1 Skill and +41-45 Life.\nSub-note (skiller boards): only grand charms with ilvl 91+ (e.g. from Baal, Diablo, Nihlathak) can roll +1 skill tree and high life; every reroll is random and nothing is guaranteed."
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
notes: "權冠 (Diadem) 重洗說明：由於權冠具有極高的品質等級 (qlvl 85) 與魔法等級 (magic_lvl 18)，即使公式會降低 ilvl，洗權冠永遠能夠出現 +2 職業技能、20% FCR 與 2 孔的頂級詞綴！",
    notesEn: "Rerolling Diadems: qlvl 85 and magic_lvl 18 guarantees +2 Skills and 20% FCR can always roll!"
  },
  {
    id: "repair_armor_recharge",
    category: "repair",
    title: "防具快速修復與聚氣充能",
    titleEn: "Fully Repair and Recharge Armor",
    inputs: [
      "1x 8# 拉爾 (Ral)",
      "1x 瑕疵寶石 (Flawed Gem，充能必要)",
      "1x 耐久度受損或充能耗盡的防具"
    ],
    output: "耐久度與聚氣次數 100% 完整修復的防具",
        inputsEn: ["1x Ral (#8)","1x Flawed Gem (required for recharging)","1x Damaged/Depleted Armor"],
    outputEn: "Fully Repaired and Recharged Armor",
notes: "節省數十萬修理費的神技！對於特等的 (Superior) 詞綴的謎團甲或剛毅甲，鐵匠修理費用常高達 50-80 萬金幣；以方塊修理可省下這筆金幣。本配方的瑕疵寶石是必要材料，能在修滿耐久的同時補滿聚氣次數；只需修理時用「完全修理防具」（Ral + 防具）即可。無形裝備無法以此修復。",
    notesEn: "Saves up to 800k gold repairing Superior Enigma or Fortitude armor. The flawed gem is required here: it refills charges along with full durability. For repair only, use Fully Repair Armor (Ral + armor). Ethereal items cannot be repaired this way."
  },
  {
    id: "repair_weapon_recharge",
    category: "repair",
    title: "武器快速修復與聚氣充能",
    titleEn: "Fully Repair and Recharge Weapon",
    inputs: [
      "1x 9# 歐特 (Ort)",
      "1x 碎裂寶石 (Chipped Gem，充能必要)",
      "1x 耐久度受損或充能耗盡的武器"
    ],
    output: "耐久度與聚氣次數 100% 完整修復的武器",
        inputsEn: ["1x Ort (#9)","1x Chipped Gem (required for recharging)","1x Damaged/Depleted Weapon"],
    outputEn: "Fully Repaired and Recharged Weapon",
notes: "本配方的碎裂寶石是必要材料，能在修滿非無形武器耐久的同時補滿聚氣次數，省去鐵匠修理金幣；只需修理時用「完全修理武器」（Ort + 武器）即可。",
    notesEn: "The chipped gem is required here: it refills charges along with full durability on any non-ethereal weapon, saving blacksmith fees. For repair only, use Fully Repair Weapon (Ort + weapon)."
  }
];


