/**
 * 聖休亞瑞符文取得聖地、固定任務與特殊掉落機制資料
 * 包含高塔女伯爵特殊符文 TC、地獄熔爐敲石頭、夸爾凱克救援、下庫拉斯特超級寶箱、崔凡克瘸子、秘法聖殿幽靈等。
 */

export interface RuneDropDifficultyInfo {
  difficulty: 'normal' | 'nightmare' | 'hell';
  labelZh: string;
  labelEn: string;
  maxRuneNumber: number;
  maxRuneNameZh: string;
  maxRuneNameEn: string;
  specialMaxRuneNumber?: number;
  specialMaxRuneNameZh?: string;
  specialMaxRuneNameEn?: string;
  runeRangeZh?: string;
  runeRangeEn?: string;
  noteZh: string;
  noteEn: string;
}

export interface RuneFarmingSource {
  id: string;
  nameZh: string;
  nameEn: string;
  act: number;
  category: 'boss' | 'quest' | 'superchest' | 'high_density' | 'special_mechanic';
  categoryLabelZh: string;
  categoryLabelEn: string;
  locationZh: string;
  locationEn: string;
  recommendedPlayerCountZh: string;
  recommendedPlayerCountEn: string;
  summaryZh: string;
  summaryEn: string;
  mechanicsZh: string[];
  mechanicsEn: string[];
  drops: RuneDropDifficultyInfo[];
  proTipsZh: string[];
  proTipsEn: string[];
}

export const RUNE_FARMING_SOURCES: RuneFarmingSource[] = [
  {
    id: 'countess',
    nameZh: '高塔女伯爵',
    nameEn: 'The Countess',
    act: 1,
    category: 'boss',
    categoryLabelZh: '特殊首領 (Dedicated Boss)',
    categoryLabelEn: 'Dedicated Boss',
    locationZh: '第一章・黑色荒地 遺忘之塔地窖第 5 層',
    locationEn: 'Act 1 • Black Marsh, Forgotten Tower Cellar Level 5',
    recommendedPlayerCountZh: '1 人房間 (/players 1) 掉落最多！',
    recommendedPlayerCountEn: 'Player 1 produces the most runes!',
    summaryZh: '聖休亞瑞最著名的符文供應商。擁有遊戲內最獨特的獨立符文掉落表 (Special Rune TC)，每次必定高機率噴出多枚符文。',
    summaryEn: 'The most renowned rune supplier in Sanctuary. Possesses a unique dedicated Rune Drop TC that consistently yields multiple runes.',
    mechanicsZh: [
      '【特殊掉落機制】：女伯爵被擊殺時，會先 roll 常規怪物裝備掉落（最多 5 件）；若未達 6 個掉落上限，剩餘欄位會全部 roll 專屬符文掉落表（最多 3 顆符文）。',
      '【反向人數定律】：在單人房間 (Player 1) 下，怪物掉落「No Drop」機率最高，反而能騰出足夠的欄位讓「專屬符文掉落表」完全發揮，平均出符文最多；若在 8 人房間，裝備掉滿會擠掉符文位置！',
      '【兼掉恐懼之鑰】：地獄難度女伯爵同時是紅門六王事件「恐懼之鑰 (Key of Terror)」的唯一掉落來源。'
    ],
    mechanicsEn: [
      '[Drop Mechanism]: Upon death, she first rolls regular item drops (up to 5 items); any remaining capacity up to 6 total slots is then filled by her dedicated Rune TC (up to 3 runes).',
      '[Inverse Player Count Rule]: In /players 1, regular item No-Drop chance is highest, leaving more empty slots for her dedicated rune drop table to trigger. Higher player counts dilute rune yields with equipment!',
      '[Key of Terror]: In Hell difficulty, she is also the primary source of the Key of Terror for the Pandemonium Event.'
    ],
    drops: [
      {
        difficulty: 'normal',
        labelZh: '普通難度',
        labelEn: 'Normal',
        maxRuneNumber: 8,
        maxRuneNameZh: '8# 拉爾 (Ral)',
        maxRuneNameEn: '8# Ral',
        specialMaxRuneNumber: 8,
        specialMaxRuneNameZh: '8# 拉爾 (Ral)',
        specialMaxRuneNameEn: '8# Ral',
        runeRangeZh: '1# 艾爾 ~ 8# 拉爾',
        runeRangeEn: '1# El ~ 8# Ral',
        noteZh: '拓荒必刷！可快速湊齊「隱密 (Stealth, 7#+5#)」與「天底 (Nadir, 4#+3#)」之符文。',
        noteEn: 'Essential for early leveling! Rapidly assemble Stealth (7#+5#) and Nadir (4#+3#).'
      },
      {
        difficulty: 'nightmare',
        labelZh: '惡夢難度',
        labelEn: 'Nightmare',
        maxRuneNumber: 18,
        maxRuneNameZh: '18# 科 (Ko)',
        maxRuneNameEn: '18# Ko',
        specialMaxRuneNumber: 16,
        specialMaxRuneNameZh: '16# 艾歐 (Io)',
        specialMaxRuneNameEn: '16# Io',
        runeRangeZh: '專屬符文池至 16# Io，常規怪池至 18# Ko',
        runeRangeEn: 'Special TC up to 16# Io, Monster TC up to 18# Ko',
        noteZh: '中期質變聖地！產出 12# 索爾 (Sol)、15# 海爾 (Hel)，是組裝「精神 (Spirit)」與「眼光 (Insight)」的核心來源。',
        noteEn: 'Mid-game cornerstone! Farms 12# Sol and 15# Hel for Spirit and Insight.'
      },
      {
        difficulty: 'hell',
        labelZh: '地獄難度',
        labelEn: 'Hell',
        maxRuneNumber: 28,
        maxRuneNameZh: '28# 羅 (Lo)',
        maxRuneNameEn: '28# Lo',
        specialMaxRuneNumber: 24,
        specialMaxRuneNameZh: '24# 伊司特 (Ist)',
        specialMaxRuneNameEn: '24# Ist',
        runeRangeZh: '專屬高頻池至 24# Ist，常規極罕見怪池至 28# Lo',
        runeRangeEn: 'Special TC up to 24# Ist, Monster TC up to 28# Lo',
        noteZh: '專屬高頻掉落池最高至 24# Ist，量產 20# Lem、21# Pul、22# Um、23# Mal、24# Ist 之穩定天花板；怪身極罕見可出 28# Lo。',
        noteEn: 'Dedicated pool caps at 24# Ist (farming Lem, Pul, Um, Mal, Ist); monster drop table can very rarely drop up to 28# Lo.'
      }
    ],
    proTipsZh: [
      '沿著盾牌左手法則尋找下一層入口（出口大多順著左手邊牆壁走）。',
      '女伯爵在地獄難度必帶火免疫與冰冷免疫，推薦純電系、物理系或由靈光傭兵戳死。'
    ],
    proTipsEn: [
      'Follow the shield/left-hand wall rule to locate staircases quickly.',
      'Hell Countess is always Fire & Cold immune; best handled by Lightning builds, physical attacks, or a strong mercenary.'
    ]
  },
  {
    id: 'hellforge',
    nameZh: '地獄熔爐任務 (敲石頭)',
    nameEn: 'The Hellforge Quest',
    act: 4,
    category: 'quest',
    categoryLabelZh: '固定任務 (Fixed Quest)',
    categoryLabelEn: 'Fixed Quest',
    locationZh: '第四章・火焰之河 地獄鐵砧',
    locationEn: 'Act 4 • River of Flame, The Hellforge',
    recommendedPlayerCountZh: '1 人即可，多人同行需輪流敲',
    recommendedPlayerCountEn: 'Soloable; party members must smash individually',
    summaryZh: '第四章任務二。擊敗護甲鍛造師海法斯特後，以熔爐之鎚敲碎墨菲斯托的靈魂石，必定 100% 噴出 1 枚符文與 4 顆寶石。',
    summaryEn: 'Act 4 Quest 2. Smashing Mephisto\'s Soulstone at the Hellforge with Hephasto\'s hammer guarantees exactly 1 rune and 4 gems.',
    mechanicsZh: [
      '【100% 必定掉落】：敲碎靈魂石時，必定掉落 1 枚符文 + 1 顆完美寶石 + 2 顆無瑕寶石 + 1 顆普通寶石。',
      '【等機率分佈 (1/11)】：各難度掉落範圍內共有 11 種符文，每一枚符文的出現機率嚴格均等為 1/11 (約 9.09%)。',
      '【窮人翻身第一桶金】：地獄難度最高出 25# 古爾 (Gul)，兩顆 Gul 即可方塊合成 26# 伐克斯 (Vex) 做成頂級施法武器「橡樹之心 (Heart of the Oak)」。'
    ],
    mechanicsEn: [
      '[100% Guaranteed Drop]: Smashing the Soulstone always drops exactly 1 Rune + 1 Perfect Gem + 2 Flawless Gems + 1 Regular Gem.',
      '[Equal Probability (1/11)]: Exactly 11 runes are eligible per difficulty, each with an identical 1/11 (~9.09%) drop rate.',
      '[Ladder Starter Capital]: Hell Forge caps at 25# Gul; two Guls cube into 26# Vex for Heart of the Oak (HOTO).'
    ],
    drops: [
      {
        difficulty: 'normal',
        labelZh: '普通難度',
        labelEn: 'Normal',
        maxRuneNumber: 11,
        maxRuneNameZh: '11# 安姆 (Amn)',
        maxRuneNameEn: '11# Amn',
        runeRangeZh: '1# 艾爾 (El) ~ 11# 安姆 (Amn)',
        runeRangeEn: '1# El ~ 11# Amn',
        noteZh: '可能出 10# Thul 或 11# Amn，是組裝精神劍的即時材料。',
        noteEn: 'Eligible for 10# Thul and 11# Amn, immediate components for Spirit sword.'
      },
      {
        difficulty: 'nightmare',
        labelZh: '惡夢難度',
        labelEn: 'Nightmare',
        maxRuneNumber: 22,
        maxRuneNameZh: '22# 烏姆 (Um)',
        maxRuneNameEn: '22# Um',
        runeRangeZh: '12# 索爾 (Sol) ~ 22# 烏姆 (Um)',
        runeRangeEn: '12# Sol ~ 22# Um',
        noteZh: '最高可出 20# Lem、21# Pul 或 22# Um，能直接做出強制 (Duress)、石塊 (Stone) 或鑲入暗金裝備補全抗。',
        noteEn: 'Can drop Lem, Pul, or Um (22#), instantly unlocking Duress, Stone, or +15/22 all resistances socketing.'
      },
      {
        difficulty: 'hell',
        labelZh: '地獄難度',
        labelEn: 'Hell',
        maxRuneNumber: 25,
        maxRuneNameZh: '25# 古爾 (Gul)',
        maxRuneNameEn: '25# Gul',
        runeRangeZh: '15# 海爾 (Hel) ~ 25# 古爾 (Gul)',
        runeRangeEn: '15# Hel ~ 25# Gul',
        noteZh: '拓荒期最重要的資產來源！範圍 15#~25#，出 Mal/Ist/Gul 都能極大加速裝備成形。',
        noteEn: 'Crucial early ladder wealth injection! Range is 15#~25#; rolling Mal, Ist, or Gul dramatically accelerates build progress.'
      }
    ],
    proTipsZh: [
      '若組隊過任務，務必一人一人輪流放置靈魂石並敲擊，以免掉落被他人拾取或任務判定衝突。',
      '鐵砧守護者「海法斯特」常帶詛咒、狂熱或特別強壯，近戰接觸前務必注意安全。'
    ],
    proTipsEn: [
      'When completing in a party, smash soulstones one by one so drops are not confused or lost.',
      'Hephasto frequently spawns with Extra Strong, Cursed, or Fanaticism; keep your distance if fragile.'
    ]
  },
  {
    id: 'lower_kurast',
    nameZh: '下庫拉斯特超級寶箱 (LK 開箱)',
    nameEn: 'Lower Kurast Super Chests (LK Runs)',
    act: 3,
    category: 'superchest',
    categoryLabelZh: '超級寶箱 (Super Chests)',
    categoryLabelEn: 'Super Chests',
    locationZh: '第三章・下庫拉斯特 營火長屋 (1~2 座營火，每座 3 箱)',
    locationEn: 'Act 3 • Lower Kurast, Campfire Huts (1-2 fires, 3 chests each)',
    recommendedPlayerCountZh: '7~8 人模式 (/players 7 或 /players 8) 產量最極致！',
    recommendedPlayerCountEn: '/players 7 or /players 8 for optimal HR pattern odds!',
    summaryZh: '單機自力與拓荒期產出頂級大號神符 (High Runes) 的第一聖地！地圖營火旁的木屋中固定生成總計 3 至 6 個「超級寶箱」。',
    summaryEn: 'The supreme farming spot for High Runes in Single Player / early ladder! Huts around campfires contain 3 to 6 fixed Super Chests.',
    mechanicsZh: [
      '【無 No-Drop 懲罰】：超級寶箱不同於普通怪物，開箱時從固定的 65,536 個掉落 Seed Patterns 中抽選，高階符文出土機率遠高於殺怪。',
      '【最高掉落 30# 貝 (Ber)】：地獄難度 LK 超級寶箱最高掉落為 30# Ber（無法開出 31# Jah 或 33# Zod），盛產 20# Lem ~ 30# Ber，是做「謎團」與「無限」的最佳原料庫。',
      '【單機離線之王】：單機模式地圖固定，搭配雙營火（6 個箱子）與傳送杖，單趟只需 20~30 秒，幾百趟即可拼出畢業高符。'
    ],
    mechanicsEn: [
      '[No No-Drop Penalty]: Super chests draw from 65,536 predefined item patterns rather than standard drop tables, yielding vastly higher HR odds.',
      '[Capped at 30# Ber]: Hell LK super chests cap at 30# Ber (cannot drop Jah or Zod). They excel at farming Lem, Pul, Um, Mal, Ist, Gul, Vex, Ohm, Lo, Sur, and Ber.',
      '[Single Player King]: With fixed maps and a 2-campfire layout (6 chests), tele-running takes 20-30 seconds per run, producing endgame HRs in a few hundred runs.'
    ],
    drops: [
      {
        difficulty: 'normal',
        labelZh: '普通難度',
        labelEn: 'Normal',
        maxRuneNumber: 10,
        maxRuneNameZh: '10# 蘇爾 (Thul)',
        maxRuneNameEn: '10# Thul',
        runeRangeZh: '最高至 10# Thul',
        runeRangeEn: 'Caps at 10# Thul',
        noteZh: '箱子最高可出 10# Thul，兼產大量早期寶石與中低階符文。',
        noteEn: 'Chests cap at 10# Thul; yields early gems and low runes.'
      },
      {
        difficulty: 'nightmare',
        labelZh: '惡夢難度',
        labelEn: 'Nightmare',
        maxRuneNumber: 22,
        maxRuneNameZh: '22# 烏姆 (Um)',
        maxRuneNameEn: '22# Um',
        runeRangeZh: '最高至 22# Um',
        runeRangeEn: 'Caps at 22# Um',
        noteZh: '惡夢箱子最高可出 22# Um，兼產大量中階護身符與寶石。',
        noteEn: 'Nightmare super chests cap at 22# Um; also yields plentiful charms and gems.'
      },
      {
        difficulty: 'hell',
        labelZh: '地獄難度',
        labelEn: 'Hell',
        maxRuneNumber: 30,
        maxRuneNameZh: '30# 貝 (Ber)',
        maxRuneNameEn: '30# Ber',
        runeRangeZh: '最高至 30# Ber（無法掉落 31# Jah、32# Cham、33# Zod）',
        runeRangeEn: 'Caps at 30# Ber (cannot drop 31# Jah, 32# Cham, 33# Zod)',
        noteZh: '高階符文產量之冠！尤其 28# Lo、29# Sur（兩顆合 Ber）、30# Ber 在 /players 7 下有大量對應的種子掉落模式。',
        noteEn: 'Unrivaled HR volume! Sur (29#) and Ber (30#) patterns abound on /players 7; two Surs cube directly into Ber.'
      }
    ],
    proTipsZh: [
      '營火特徵：地圖上有圓形火堆，右上與左上必有兩棟長屋。一張地圖可能隨機刷出 1 座或 2 座營火。',
      '開箱時順手翻動沿途的屍體、原木與武器架，經常有額外底材與驚喜。'
    ],
    proTipsEn: [
      'Campfire marker: A circular fire pit flanked by two distinctive wooden huts. Maps can spawn 1 or 2 campfires (3 or 6 chests).',
      'Pop loose logs, skeletons, and weapon racks along the path for extra bases and runes.'
    ]
  },
  {
    id: 'travincal',
    nameZh: '崔凡克瘸子議會',
    nameEn: 'Travincal High Council',
    act: 3,
    category: 'special_mechanic',
    categoryLabelZh: '議會精英群 (High Council)',
    categoryLabelEn: 'High Council',
    locationZh: '第三章・崔凡克 薩卡蘭姆神廟神殿前',
    locationEn: 'Act 3 • Travincal, Entrance to Durance of Hate',
    recommendedPlayerCountZh: '1~3 人均可，野蠻人翻屍體效果翻倍！',
    recommendedPlayerCountEn: '1-3 players; Barbarian Find Item doubles yields!',
    summaryZh: '線上天梯打錢、刷珠寶暗金與高階神符的第一聖地。最高議會瘸子議員 (Council Members) 掉落倍數極高，且能直接掉落全遊戲最高神符。',
    summaryEn: 'The supreme spot on ladder for Gold, Jewels, Uniques, and High Runes. Council members drop 3x items and can drop the highest runes in the game.',
    mechanicsZh: [
      '【3 倍掉落乘數】：每名議會成員被擊殺時固定掉落 3 件物品（遠超普通精英怪），整隊瘸子一趟下來相當於擊殺幾十隻怪物。',
      '【最高掉落 33# 薩德 (Zod)】：議會成員怪物等級 82，暗金頭目可解鎖至頂級 TC，可產出包括 30# Ber、31# Jah、33# Zod 在內的所有符文。',
      '【打錢野蠻人 (Horker) 主場】：野蠻人「尋找物品 (Find Item)」點滿可達 70%+ 翻屍率，相當於把崔凡克重刷一次，且不受遊戲人數 No-drop 稀釋影響。'
    ],
    mechanicsEn: [
      '[3x Drop Multiplier]: Each Council Member drops 3 items upon defeat (triple standard champions), yielding massive drops per run.',
      '[Caps at 33# Zod]: Council members (mlvl 82) and unique bosses can drop up to 33# Zod, with frequent Jah (31#) and Ber (30#) drops.',
      '[Horker Barbarian Capital]: Barbarian\'s Find Item gives a 70%+ chance to loot corpses a second time, unaffected by party size.'
    ],
    drops: [
      {
        difficulty: 'normal',
        labelZh: '普通難度',
        labelEn: 'Normal',
        maxRuneNumber: 11,
        maxRuneNameZh: '11# 安姆 (Amn)',
        maxRuneNameEn: '11# Amn',
        runeRangeZh: '最高至 11# Amn',
        runeRangeEn: 'Caps at 11# Amn',
        noteZh: '普通瘸子 (mlvl 28) 產出前期金幣、寶石與中階符文。',
        noteEn: 'Normal Council (mlvl 28) drops early gold, gems, and mid runes.'
      },
      {
        difficulty: 'nightmare',
        labelZh: '惡夢難度',
        labelEn: 'Nightmare',
        maxRuneNumber: 22,
        maxRuneNameZh: '22# 烏姆 (Um)',
        maxRuneNameEn: '22# Um',
        runeRangeZh: '最高至 22# Um',
        runeRangeEn: 'Caps at 22# Um',
        noteZh: '惡夢瘸子 (mlvl 58) 具備極佳的符文與暗金飾品產率，最高可出 22# Um。',
        noteEn: 'Nightmare Council (mlvl 58) boasts great rune/ring rates up to 22# Um.'
      },
      {
        difficulty: 'hell',
        labelZh: '地獄難度',
        labelEn: 'Hell',
        maxRuneNumber: 33,
        maxRuneNameZh: '33# 薩德 (Zod)',
        maxRuneNameEn: '33# Zod',
        runeRangeZh: '最高可達 33# 薩德 (Zod)，盛產 20#~31# 高符',
        runeRangeEn: 'Up to 33# Zod; renowned for frequent 20#~31# drops',
        noteZh: '天梯經濟支柱！高頻產出 24# Ist、26# Vex、28# Lo、30# Ber、31# Jah，兼產天量金幣與極品亮金頭環/戒指。',
        noteEn: 'Core ladder economy engine: frequent Ist, Vex, Lo, Ber, Jah, plus millions in gold and rare rings/circlets.'
      }
    ],
    proTipsZh: [
      '瘸子自帶多頭蛇火傷害，傭兵與角色務必穿戴「矮人之星 (Dwarf Star)」或撐高火抗與吸收。',
      '擊殺時避免使用帶冰凍碎屍或安息屬性的裝備，以保留屍體供野蠻人吼屍 (Hork)。'
    ],
    proTipsEn: [
      'Council members cast fierce Hydras; equip Dwarf Star or boost Fire Res/Absorb for yourself and merc.',
      'Avoid cold shatter (Freezes Target) or Rest in Peace mods so corpses remain intact for Barbarian Find Item.'
    ]
  },
  {
    id: 'arcane_sanctuary',
    nameZh: '秘法聖殿幽靈群',
    nameEn: 'Arcane Sanctuary Ghosts',
    act: 2,
    category: 'special_mechanic',
    categoryLabelZh: '特殊掉落怪群 (No Armor/Weapon Drop)',
    categoryLabelEn: 'Special Drop Pool',
    locationZh: '第二章・秘法聖殿 四條路徑',
    locationEn: 'Act 2 • Arcane Sanctuary, 4 Quadrants',
    recommendedPlayerCountZh: '1~3 人，或 /players 3~5',
    recommendedPlayerCountEn: '1-3 players or /players 3-5',
    summaryZh: '幽靈怪族群的掉落表中完全排除了武器與防具，符文與寶石的掉落機率被放大約 3~4 倍！同時盡頭的召喚師掉落憎恨之鑰。',
    summaryEn: 'Specters and Ghosts exclude weapons and armor from their drop pool, boosting rune/gem drop rates by ~3-4x! The Summoner also drops Key of Hate.',
    mechanicsZh: [
      '【排他性掉落池】：幽靈怪 (Specters) 永遠不會掉落武器、護甲、頭盔或盾牌，省下的掉落判定權重全數轉移至符文、寶石、珠寶、卷軸與藥水！',
      '【最高掉落 31# 喬 (Jah)】：地獄難度秘法聖殿中的幽靈群最高可掉落 31# 喬 (Jah)，是刷出謎團關鍵符文的冷門暴利點。',
      '【避開虛空擊殺】：幽靈死在沒有地面的宇宙虛空中時，物品會判定掉出地圖而直接蒸發！必須引到石板路上擊殺。'
    ],
    mechanicsEn: [
      '[Filtered Drop Pool]: Specters never drop weapons or armor; this pool weight shifts entirely to Runes, Gems, Jewels, and Charms (~3-4x rune rate).',
      '[Caps at 31# Jah]: Hell Specters can drop up to 31# Jah, an exceptional source for Enigma components.',
      '[Kill on Walkways]: If a specter dies hovering over the void/space, all loot drops into the abyss and vanishes! Lure them onto solid flagstones.'
    ],
    drops: [
      {
        difficulty: 'normal',
        labelZh: '普通難度',
        labelEn: 'Normal',
        maxRuneNumber: 8,
        maxRuneNameZh: '8# 拉爾 (Ral)',
        maxRuneNameEn: '8# Ral',
        runeRangeZh: '最高至 8# Ral',
        runeRangeEn: 'Caps at 8# Ral',
        noteZh: '普通幽靈無武器防具掉落干擾，前期極易噴出法力藥水與低階符文。',
        noteEn: 'Normal specters drop frequent mana potions and low runes.'
      },
      {
        difficulty: 'nightmare',
        labelZh: '惡夢難度',
        labelEn: 'Nightmare',
        maxRuneNumber: 18,
        maxRuneNameZh: '18# 科 (Ko)',
        maxRuneNameEn: '18# Ko',
        runeRangeZh: '最高至 18# Ko',
        runeRangeEn: 'Caps at 18# Ko',
        noteZh: '惡夢幽靈 (mlvl 48) 產出精神與眼光符文機率高。',
        noteEn: 'Nightmare specters (mlvl 48) farm Spirit and Insight runes quickly.'
      },
      {
        difficulty: 'hell',
        labelZh: '地獄難度',
        labelEn: 'Hell',
        maxRuneNumber: 31,
        maxRuneNameZh: '31# 喬 (Jah)',
        maxRuneNameEn: '31# Jah',
        runeRangeZh: '最高可達 31# 喬 (Jah)',
        runeRangeEn: 'Up to 31# Jah',
        noteZh: '沿途擊殺成群幽靈，盡頭開寶箱並擊殺召喚師取得「憎恨之鑰 (Key of Hate)」，效益極高。',
        noteEn: 'Clear specter packs along pathways, pop dead-end chests, and slay The Summoner for Keys of Hate.'
      }
    ],
    proTipsZh: [
      '非常適合標槍馬、冰法、電法或聖火聖騎等具備穿透直線彈道的職業，一條路拉成直線快速消滅。'
    ],
    proTipsEn: [
      'Ideal for Lightning Fury, Blizzard, Chain Lightning, or Holy Fire builds that wipe linear corridors instantly.'
    ]
  },
  {
    id: 'cow_level',
    nameZh: '秘密乳牛關 (乳牛關)',
    nameEn: 'The Secret Cow Level (Moo Moo Farm)',
    act: 1,
    category: 'high_density',
    categoryLabelZh: '極致怪物密度 (Max Density)',
    categoryLabelEn: 'Max Monster Density',
    locationZh: '第一章・俠盜營地 紅色傳送門 (維特的腿 + 書卷方塊合成)',
    locationEn: 'Act 1 • Rogue Encampment Red Portal (Wirt\'s Leg + Tome of Town Portal)',
    recommendedPlayerCountZh: '3~8 人模式效益最佳，單人亦極佳',
    recommendedPlayerCountEn: 'Best in /players 3-8, highly viable solo',
    summaryZh: '全遊戲怪物群體最密集的地圖（單場 400~600+ 隻地獄母牛）。雖然母牛無特殊符文機率，但純靠恐怖的擊殺總量成為符文與白色底材的王者。',
    summaryEn: 'Highest monster pack density in the game (400-600+ cows per run). Reliance on sheer kill volume makes it the king of raw High Runes and grey socket bases.',
    mechanicsZh: [
      '【無與倫比的擊殺總量】：地獄母牛 (Hell Bovine, mlvl 81) 一群群密集聚攏，無固定天生元素免疫，AOE 技能幾秒鐘即可蒸發幾十隻。',
      '【最高掉落 33# 薩德 (Zod)】：母牛擁有解鎖至滿階的符文掉落能力，包含 30# Ber、31# Jah、32# Cham、33# Zod 全數皆能出土。',
      '【符文與頂級底材雙修】：刷高符的同時，產出全遊戲最多的 4 孔君主盾、無形狂戰斧、無形巨神巨劍、無形巨型斬鐮等畢業底材。'
    ],
    mechanicsEn: [
      '[Extreme Kill Volume]: Hell Bovines (mlvl 81) cluster in massive packs without natural element immunities; AOE spells annihilate dozens per second.',
      '[Caps at 33# Zod]: Bovines can drop all runes up to 33# Zod (including Ber, Jah, Cham).',
      '[Runes & Elite Bases]: Simultaneously the undisputed best source for 4-socket Monarchs, Eth Berserker Axes, Eth Colossus Blades, and Eth Threshers.'
    ],
    drops: [
      {
        difficulty: 'normal',
        labelZh: '普通難度',
        labelEn: 'Normal',
        maxRuneNumber: 12,
        maxRuneNameZh: '12# 索爾 (Sol)',
        maxRuneNameEn: '12# Sol',
        runeRangeZh: '最高至 12# Sol',
        runeRangeEn: 'Caps at 12# Sol',
        noteZh: '普通母牛 (mlvl 28) 是組裝天底、精神、眼光前綴底材與符文的聖地。',
        noteEn: 'Normal cows (mlvl 28) farm early bases and runes for Nadir and Spirit.'
      },
      {
        difficulty: 'nightmare',
        labelZh: '惡夢難度',
        labelEn: 'Nightmare',
        maxRuneNumber: 24,
        maxRuneNameZh: '24# 伊司特 (Ist)',
        maxRuneNameEn: '24# Ist',
        runeRangeZh: '最高至 24# Ist',
        runeRangeEn: 'Caps at 24# Ist',
        noteZh: '惡夢母牛 (mlvl 64) 掉落高達 24# Ist，是拓荒進地獄前的頂級練功與打寶聖地！',
        noteEn: 'Nightmare cows (mlvl 64) drop up to 24# Ist; prime pre-Hell leveling spot.'
      },
      {
        difficulty: 'hell',
        labelZh: '地獄難度',
        labelEn: 'Hell',
        maxRuneNumber: 33,
        maxRuneNameZh: '33# 薩德 (Zod)',
        maxRuneNameEn: '33# Zod',
        runeRangeZh: '最高可達 33# 薩德 (Zod)',
        runeRangeEn: 'Up to 33# Zod',
        noteZh: '電標馬、死靈法師（屍爆）、冰法與陷阱刺客的刷寶天堂。',
        noteEn: 'Paradise for Javazons, Corpse Explosion Necromancers, Blizzard Sorcs, and Trapsins.'
      }
    ],
    proTipsZh: [
      'D2R 重生版已取消「殺死牛王無法再開門」的舊懲罰，現在可以放心擊殺牛王！',
      '刷牛時降低尋寶率 (MF) 能增加掉落白色與無形超強底材的機率，且完全不影響符文掉落。'
    ],
    proTipsEn: [
      'D2R removed the legacy Cow King lock penalty: you can freely kill the Cow King every single run!',
      'Low Magic Find (MF) increases white and ethereal base drops without penalizing rune drop rates at all.'
    ]
  },
  {
    id: 'qual_kehk',
    nameZh: '亞瑞特山救援 (夸爾凱克)',
    nameEn: 'Rescue on Mount Arreat (Qual-Kehk)',
    act: 5,
    category: 'quest',
    categoryLabelZh: '固定任務 (Fixed Quest)',
    categoryLabelEn: 'Fixed Quest',
    locationZh: '第五章・冰凍高地 拯救野蠻人囚籠',
    locationEn: 'Act 5 • Frigid Highlands, Barbarian Pens',
    recommendedPlayerCountZh: '1 人即可',
    recommendedPlayerCountEn: 'Soloable',
    summaryZh: '第五章任務二。打破冰凍高地的木籠解救 15 名野蠻人士兵，回城與夸爾凱克對話必定獲得 3 枚固定符文。',
    summaryEn: 'Act 5 Quest 2. Free 15 captured Barbarians from wooden pens in the Frigid Highlands to receive 3 guaranteed runes from Qual-Kehk.',
    mechanicsZh: [
      '【保證給予固定 3 符文】：每次解完任務，夸爾凱克必定固定獎勵 7# 塔爾 (Tal) + 8# 拉爾 (Ral) + 9# 歐特 (Ort)。',
      '【開荒第一自保神裝】：這三顆符文依序鑲入 3 孔盾牌中，剛好組成「古代人的誓約 (Ancient\'s Pledge)」，提供冰抗 43%、火/電/毒抗各 48%！'
    ],
    mechanicsEn: [
      '[Guaranteed 3 Runes]: Qual-Kehk awards 7# Tal + 8# Ral + 9# Ort with 100% certainty.',
      '[Ancient\'s Pledge Combo]: Socketing Tal-Ral-Ort into a 3-socket shield instantly forms Ancient\'s Pledge, giving Cold Res +43% and Fire/Light/Poison Res +48%!'
    ],
    drops: [
      {
        difficulty: 'normal',
        labelZh: '全難度通用 (任務獎勵)',
        labelEn: 'All Difficulties (Quest Reward)',
        maxRuneNumber: 9,
        maxRuneNameZh: '9# 歐特 (Ort)',
        maxRuneNameEn: '9# Ort',
        runeRangeZh: '固定贈送 7# Tal + 8# Ral + 9# Ort',
        runeRangeEn: 'Guaranteed 7# Tal + 8# Ral + 9# Ort',
        noteZh: '每個難度皆可解一次，無論普通或惡夢都是拓荒補抗性與做配方的穩定材料庫。',
        noteEn: 'Can be completed once per difficulty. Reliable recipe/resistance baseline on any run.'
      }
    ],
    proTipsZh: [
      '第一章阿卡拉或恰西、第二章法拉處可直接買到 3 孔白色大盾牌 (Large Shield) 或輕盾 (Kite Shield) 來鑲嵌。'
    ],
    proTipsEn: [
      'A 3-socket Large Shield or Kite Shield can be bought directly from vendors like Fara in Act 2.'
    ]
  },
  {
    id: 'terror_zones',
    nameZh: '恐怖區域 (TZ 恐區)',
    nameEn: 'Terror Zones (Patch 2.5+)',
    act: 0,
    category: 'high_density',
    categoryLabelZh: '動態等級區域 (Dynamic Level)',
    categoryLabelEn: 'Dynamic Level',
    locationZh: '全章節每小時輪替之特定場景',
    locationEn: 'Rotating hourly across all 5 Acts',
    recommendedPlayerCountZh: '1~8 人均可，等級越高越好',
    recommendedPlayerCountEn: '1-8 players; scales with host level',
    summaryZh: 'D2R Patch 2.5 引入的革命性機制。怪物等級隨房主角色動態提升（最高至 99 級），全場景全面解鎖最高級別的物品與符文 TC。',
    summaryEn: 'Revolutionary endgame mechanic introduced in Patch 2.5. Monster level scales dynamically with the game creator up to level 99, unlocking max-tier Rune TCs universally.',
    mechanicsZh: [
      '【怪物等級動態升級】：地獄難度下，恐怖區域怪物等級為房主等級 +2（小怪）、+4（精英）、+5（關底首領），最高上限達 99 級。',
      '【全場景解鎖 33# 薩德】：只要房主達到 71+ 級，任何被選為恐區的場景（哪怕原本是第一章血腥荒地）小怪均能掉落 33# 薩德 (Zod)！',
      '【破免板子加持】：恐區精英怪同時掉落對應屬性的「破免護身符 (Sunder Charms)」，進一步強化各流派在此無差別收割高符的能力。'
    ],
    mechanicsEn: [
      '[Dynamic Scaling]: Hell TZ monsters scale to Creator Level +2 (Regular), +4 (Champions), +5 (Bosses), capped at mlvl 99.',
      '[Universal 33# Zod]: Once the creator is level 71+, every monster in a TZ can drop up to 33# Zod, even in Act 1 areas like Blood Moor.',
      '[Sunder Charms]: Champions also drop Sundering Charms, breaking monster immunities and accelerating high rune farming.'
    ],
    drops: [
      {
        difficulty: 'hell',
        labelZh: '地獄難度 (71+ 級)',
        labelEn: 'Hell (Level 71+)',
        maxRuneNumber: 33,
        maxRuneNameZh: '33# 薩德 (Zod)',
        maxRuneNameEn: '33# Zod',
        runeRangeZh: '全區怪物全面解鎖 1# ~ 33# 薩德 (Zod)',
        runeRangeEn: 'All monsters unlocked for 1# ~ 33# Zod',
        noteZh: '結合 99 級經驗衝刺、破免護身符與全符文掉落，是現代 D2R 最受歡迎的終局農場。',
        noteEn: 'Combines level 99 progression, Sunder Charms, and universal max-tier rune drops for modern D2R endgame.'
      }
    ],
    proTipsZh: [
      '每逢「塔拉夏的古墓」、「混沌魔殿」、「崔凡克」或「牛關」成為恐怖區域時，怪物密度與高符產出極為驚人，務必把握當前小時全力刷！'
    ],
    proTipsEn: [
      'When Tombs, Chaos Sanctuary, Travincal, or Cows rotate as Terror Zones, pack density and HR frequency reach astronomical peaks.'
    ]
  }
];

/**
 * 符文獲取里程碑對照：當使用者查看特定符文時，標記出其在固定場景或掉落機制中的關鍵地位
 */
export interface RuneMilestoneBadge {
  runeNumber: number;
  badgeType: 'special_cap' | 'quest_cap' | 'spotlight' | 'guaranteed';
  badgeZh: string;
  badgeEn: string;
  sourceId: string;
  detailZh: string;
  detailEn: string;
}

export const RUNE_MILESTONE_BADGES: Record<number, RuneMilestoneBadge[]> = {
  7: [
    {
      runeNumber: 7,
      badgeType: 'guaranteed',
      badgeZh: 'A5Q2 必得符文',
      badgeEn: 'A5Q2 Guaranteed',
      sourceId: 'qual_kehk',
      detailZh: '第五章拯救野蠻人士兵必定獎勵 7# Tal + 8# Ral + 9# Ort。',
      detailEn: 'Act 5 Q2 guarantees 7# Tal, 8# Ral, and 9# Ort upon rescuing soldiers.'
    }
  ],
  8: [
    {
      runeNumber: 8,
      badgeType: 'special_cap',
      badgeZh: '女伯爵(普通)上限',
      badgeEn: 'Countess (Norm) Cap',
      sourceId: 'countess',
      detailZh: '普通女伯爵專屬符文掉落表之最高掉落符文（1#~8#）。',
      detailEn: 'Maximum drop cap for Normal Countess dedicated rune table (1#~8#).'
    },
    {
      runeNumber: 8,
      badgeType: 'guaranteed',
      badgeZh: 'A5Q2 必得符文',
      badgeEn: 'A5Q2 Guaranteed',
      sourceId: 'qual_kehk',
      detailZh: '第五章夸爾凱克救援固定獎勵，可直接做「古代人的誓約」。',
      detailEn: 'Act 5 Q2 reward; combines into Ancient\'s Pledge immediately.'
    }
  ],
  9: [
    {
      runeNumber: 9,
      badgeType: 'guaranteed',
      badgeZh: 'A5Q2 必得符文',
      badgeEn: 'A5Q2 Guaranteed',
      sourceId: 'qual_kehk',
      detailZh: '第五章夸爾凱克救援固定獎勵（7#+8#+9#）。',
      detailEn: 'Act 5 Q2 reward (Tal + Ral + Ort).'
    }
  ],
  10: [
    {
      runeNumber: 10,
      badgeType: 'special_cap',
      badgeZh: 'LK箱(普通)上限',
      badgeEn: 'LK Chests (Norm) Cap',
      sourceId: 'lower_kurast',
      detailZh: '普通難度下庫拉斯特超級寶箱最高可開出之符文。',
      detailEn: 'Maximum drop cap for Normal Lower Kurast super chests.'
    }
  ],
  11: [
    {
      runeNumber: 11,
      badgeType: 'quest_cap',
      badgeZh: '地獄熔爐(普通)上限',
      badgeEn: 'Hellforge (Norm) Cap',
      sourceId: 'hellforge',
      detailZh: '普通難度砸碎墨菲斯托的靈魂石最高可出之符文（1#~11# Amn）。',
      detailEn: 'Maximum drop cap for Normal Hellforge quest (1#~11# Amn).'
    }
  ],
  12: [
    {
      runeNumber: 12,
      badgeType: 'special_cap',
      badgeZh: '乳牛關(普通)上限',
      badgeEn: 'Cows (Norm) Cap',
      sourceId: 'cow_level',
      detailZh: '普通難度秘密乳牛關母牛最高可掉落之符文。',
      detailEn: 'Maximum drop cap for Normal Secret Cow Level.'
    }
  ],
  16: [
    {
      runeNumber: 16,
      badgeType: 'special_cap',
      badgeZh: '女伯爵(惡夢)上限',
      badgeEn: 'Countess (NM) Cap',
      sourceId: 'countess',
      detailZh: '惡夢女伯爵專屬符文掉落池最高符文（專屬池 1#~16# Io，怪身極微機率出 18# Ko）。',
      detailEn: 'Maximum drop cap for Nightmare Countess dedicated rune table (up to 16# Io).'
    }
  ],
  18: [
    {
      runeNumber: 18,
      badgeType: 'special_cap',
      badgeZh: '女伯爵(惡夢)怪身上限',
      badgeEn: 'Countess (NM) Monster Cap',
      sourceId: 'countess',
      detailZh: '惡夢女伯爵自身作為怪物掉落 (Monster Item TC) 之極限符文。',
      detailEn: 'Absolute ceiling of Nightmare Countess via regular monster drop table.'
    }
  ],
  22: [
    {
      runeNumber: 22,
      badgeType: 'quest_cap',
      badgeZh: '地獄熔爐(惡夢)上限',
      badgeEn: 'Hellforge (NM) Cap',
      sourceId: 'hellforge',
      detailZh: '惡夢地獄熔爐最高可敲出之符文（12# Sol ~ 22# Um 各 1/11 均等機率）。',
      detailEn: 'Maximum drop cap for Nightmare Hellforge quest (12# Sol ~ 22# Um, 1/11 each).'
    },
    {
      runeNumber: 22,
      badgeType: 'special_cap',
      badgeZh: 'LK箱(惡夢)上限',
      badgeEn: 'LK Chests (NM) Cap',
      sourceId: 'lower_kurast',
      detailZh: '惡夢下庫拉斯特超級寶箱最高可開出之符文。',
      detailEn: 'Maximum drop cap for Nightmare Lower Kurast super chests.'
    }
  ],
  24: [
    {
      runeNumber: 24,
      badgeType: 'special_cap',
      badgeZh: '女伯爵(地獄)專屬上限',
      badgeEn: 'Countess (Hell) Dedicated Cap',
      sourceId: 'countess',
      detailZh: '地獄女伯爵專屬高頻符文池之最高天花板！拓荒農 20#~24# 穩定產地。',
      detailEn: 'Ceiling of Hell Countess dedicated high-frequency rune table (farms 20#~24#).'
    },
    {
      runeNumber: 24,
      badgeType: 'special_cap',
      badgeZh: '乳牛關(惡夢)上限',
      badgeEn: 'Cows (NM) Cap',
      sourceId: 'cow_level',
      detailZh: '惡夢難度秘密乳牛關地獄母牛最高可掉落之符文！',
      detailEn: 'Maximum drop cap for Nightmare Secret Cow Level.'
    }
  ],
  25: [
    {
      runeNumber: 25,
      badgeType: 'quest_cap',
      badgeZh: '地獄熔爐(地獄)上限',
      badgeEn: 'Hellforge (Hell) Cap',
      sourceId: 'hellforge',
      detailZh: '全任務固定敲石頭之最高符文！兩顆 Gul 方塊合成即為 26# Vex 做橡樹之心。',
      detailEn: 'Highest drop from the Hellforge quest; two Guls cube into 26# Vex for HOTO.'
    }
  ],
  28: [
    {
      runeNumber: 28,
      badgeType: 'special_cap',
      badgeZh: '女伯爵(地獄)怪身上限',
      badgeEn: 'Countess (Hell) Monster Cap',
      sourceId: 'countess',
      detailZh: '地獄女伯爵自身作為普通怪物掉落 (Monster Item TC) 之極限最高符文。',
      detailEn: 'Absolute ceiling of Hell Countess via regular monster drop table.'
    }
  ],
  30: [
    {
      runeNumber: 30,
      badgeType: 'special_cap',
      badgeZh: '下庫拉斯特(LK)上限',
      badgeEn: 'Lower Kurast Cap',
      sourceId: 'lower_kurast',
      detailZh: '地獄下庫拉斯特超級寶箱之最高掉落符文！單機 /players 7 狂暴產出。',
      detailEn: 'Maximum drop cap for Hell Lower Kurast super chests; peak SP farming target.'
    }
  ],
  31: [
    {
      runeNumber: 31,
      badgeType: 'spotlight',
      badgeZh: '秘法聖殿推薦目標',
      badgeEn: 'Arcane Sanctuary Target',
      sourceId: 'arcane_sanctuary',
      detailZh: '秘法聖殿幽靈怪（無武器防具掉落干擾）地獄難度最高可掉落 31# Jah。',
      detailEn: 'Hell Specters (no weapon/armor drops) can drop up to 31# Jah.'
    }
  ],
  33: [
    {
      runeNumber: 33,
      badgeType: 'spotlight',
      badgeZh: '全符文之王・全境最高',
      badgeEn: 'Rarest Rune • Global Cap',
      sourceId: 'travincal',
      detailZh: '聖休亞瑞最稀有神符！崔凡克瘸子、乳牛關、85場景與恐怖區域之最高上限。',
      detailEn: 'Rarest rune in Sanctuary! Max cap of Travincal Council, Cow Level, L85, and Terror Zones.'
    }
  ]
};
