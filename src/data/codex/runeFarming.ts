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
  },
  {
    id: 'chaos_sanctuary',
    nameZh: '混沌魔殿 (CS 開封印)',
    nameEn: 'The Chaos Sanctuary (Seal Popping)',
    act: 4,
    category: 'high_density',
    categoryLabelZh: '頂級85場景 (alvl 85)',
    categoryLabelEn: 'Level 85 Area',
    locationZh: '第四章・混沌魔殿 (五處封印與中央五芒星)',
    locationEn: 'Act 4 • Chaos Sanctuary (5 Seals & Star)',
    recommendedPlayerCountZh: '1~8 人，開封印全圖秒殺時人數越多收益越狂暴！',
    recommendedPlayerCountEn: '1-8 players; higher player count scales seal popping dramatically!',
    summaryZh: '地獄 85 級殿堂級場景。擁有 3 組固定暗金首領群，全區怪物與迪亞布羅皆能掉落 33# 薩德，並可活用「開封印秒殺判定機制 (Seal Glitch)」瞬間收割全圖符文！',
    summaryEn: 'Premier Level 85 area. Features 3 fixed superunique packs, drops up to 33# Zod across all monsters, and enables the legendary "Seal Popping" trick to instantly loot the entire map!',
    mechanicsZh: [
      '【全區最高 33# 薩德】：混沌魔殿為 85 級場景，全區所有小怪、精英怪與迪亞布羅皆解鎖頂級 Runes 17 掉落池（最高出 33# Zod），盛產 30# Ber 與 31# Jah。',
      '【暴風施法者 (Storm Casters)】：此處飛行的暴風施法者與秘法聖殿幽靈同屬 Wraith 族群，永遠不掉落武器與防具，符文與寶石掉落率提升約 3~4 倍！',
      '【開封印秒殺機制 (Seal Popping)】：啟動 5 個封印並召喚迪亞布羅時，全場景剩餘未擊殺的怪物會被瞬間全滅。只要角色在開最後一個封印前的 6 秒內曾傳送飛過怪物身邊（引發怪物 Active 狀態），這些怪物死亡時會判定為角色擊殺，並完整噴出所有符文與物品！完全不受 MF 稀釋，堪稱全遊戲產出符文最快的密技。'
    ],
    mechanicsEn: [
      '[alvl 85 Universal 33# Zod]: All regular monsters, champions, and Diablo drop from the top Runes 17 TC (up to 33# Zod), making Ber and Jah drops frequent.',
      '[Storm Casters (Ghost TC)]: Flying Storm Casters share the specter drop table (no weapons/armor), increasing rune and gem drop rates by ~3-4x!',
      '[Seal Popping Mechanic]: Breaking the 5th seal triggers a global kill wave that obliterates all remaining monsters. If the player teleported within vision of those packs within 6 seconds prior to seal activation, all monsters roll full drop tables credited to the player! Unaffected by MF, this is the fastest raw rune generator in the game.'
    ],
    drops: [
      {
        difficulty: 'normal',
        labelZh: '普通難度',
        labelEn: 'Normal',
        maxRuneNumber: 21,
        maxRuneNameZh: '21# 普爾 (Pul)',
        maxRuneNameEn: '21# Pul',
        runeRangeZh: '迪亞布羅至 21# Pul，小怪至 15# Hel',
        runeRangeEn: 'Diablo caps at 21# Pul; regular monsters cap at 15# Hel',
        noteZh: '迪亞布羅最高可出 21# Pul，小怪最高出 15# Hel。',
        noteEn: 'Diablo can drop up to 21# Pul; normal monsters cap at 15# Hel.'
      },
      {
        difficulty: 'nightmare',
        labelZh: '惡夢難度',
        labelEn: 'Nightmare',
        maxRuneNumber: 27,
        maxRuneNameZh: '27# 歐姆 (Ohm)',
        maxRuneNameEn: '27# Ohm',
        runeRangeZh: '迪亞布羅至 27# Ohm，小怪至 22# Um',
        runeRangeEn: 'Diablo caps at 27# Ohm; regular monsters cap at 22# Um',
        noteZh: '惡夢迪亞布羅最高可出 27# Ohm，是惡夢難度極罕見能出高符的大首領。',
        noteEn: 'Nightmare Diablo can drop up to 27# Ohm, exceptionally rare for Nightmare.'
      },
      {
        difficulty: 'hell',
        labelZh: '地獄難度',
        labelEn: 'Hell',
        maxRuneNumber: 33,
        maxRuneNameZh: '33# 薩德 (Zod)',
        maxRuneNameEn: '33# Zod',
        runeRangeZh: '全場景解鎖 1# ~ 33# 薩德 (Zod)',
        runeRangeEn: 'All monsters drop up to 33# Zod',
        noteZh: '全場景小怪與首領皆解鎖至 33# 薩德！出 Jah 與 Ber 的世界級打寶殿堂。',
        noteEn: 'Universal drop cap up to 33# Zod across all monsters; world-class Jah & Ber farm.'
      }
    ],
    proTipsZh: [
      '熟練練習「開封印秒殺 (Seal Pop)」路徑：先清理混沌首相、迪塞斯勳爵與靈魂傳染者所在封印，留最後一個封印不點，快速傳送繞全場引活小怪，最後點擊封印收割全圖！',
      '迪塞斯勳爵周圍隨從必帶詛咒與強大光環，物理與遠程傷害極高，開荒脆皮法師切勿近身停留。'
    ],
    proTipsEn: [
      'Master the Seal Pop route: clear the 3 seal bosses first, leave the final seal untouched, tele-dash through remaining corridors to activate monsters, then hit the final seal!',
      'Lord De Seis always spawns with Extra Fast, Strong, and Auras; maintain safe distance on fragile casters.'
    ]
  },
  {
    id: 'worldstone_keep',
    nameZh: '世界之石要塞與毀滅王座',
    nameEn: 'Worldstone Keep & Throne of Destruction',
    act: 5,
    category: 'high_density',
    categoryLabelZh: '終局85場景 (alvl 85)',
    categoryLabelEn: 'Endgame alvl 85',
    locationZh: '第五章・世界之石要塞 1~3 層、毀滅王座與世界之石大殿',
    locationEn: 'Act 5 • Worldstone Keep Levels 1-3, Throne of Destruction & Chamber',
    recommendedPlayerCountZh: '3~8 人模式經驗與掉落極致，單人亦可穩定通刷',
    recommendedPlayerCountEn: '3-8 players for peak XP & drops; highly viable solo',
    summaryZh: '全遊戲等級最高、難度最硬核的終局 85 級場景。巴爾五波固定精英怪群與 99 級巴爾提供最豐厚的頂級高符與畢業裝備。',
    summaryEn: 'The highest-level and most challenging endgame 85 area. Baal\'s 5 waves of fixed champion packs and level 99 Baal offer unparalleled high rune and item yields.',
    mechanicsZh: [
      '【終極 85 場景】：世界之石要塞 1、2、3 層與毀滅王座皆為 85 級場景，小怪最高可出 33# 薩德 (Zod)，精英怪掉落品質極高。',
      '【巴爾五波精英僕從】：毀滅王座每波召喚的僕從必定掉落大量暗金、護身符與高階符文，是高等級衝等與打寶核心。',
      '【99 級巴爾終極掉落】：關底巴爾 (mlvl 99) 為全遊戲常規怪物最高等級，符文掉落上限為 33# 薩德，且能產出全遊戲所有暗金裝備。'
    ],
    mechanicsEn: [
      '[Premier 85 Areas]: Keep Levels 1-3 and the Throne are all level 85, allowing any monster to drop up to 33# Zod.',
      '[Baal\'s 5 Minion Waves]: Each wave delivers guaranteed champion packs with massive drop quantities and top-tier rune potential.',
      '[mlvl 99 Baal]: Baal sits at mlvl 99 with full access to max-tier item and rune pools (up to 33# Zod).'
    ],
    drops: [
      {
        difficulty: 'normal',
        labelZh: '普通難度',
        labelEn: 'Normal',
        maxRuneNumber: 25,
        maxRuneNameZh: '25# 古爾 (Gul)',
        maxRuneNameEn: '25# Gul',
        runeRangeZh: '巴爾至 25# Gul，小怪至 18# Ko',
        runeRangeEn: 'Baal caps at 25# Gul; monsters cap at 18# Ko',
        noteZh: '普通巴爾最高可掉出 25# Gul，小怪最高出 18# Ko。',
        noteEn: 'Normal Baal caps at 25# Gul; regular minions cap at 18# Ko.'
      },
      {
        difficulty: 'nightmare',
        labelZh: '惡夢難度',
        labelEn: 'Nightmare',
        maxRuneNumber: 28,
        maxRuneNameZh: '28# 羅 (Lo)',
        maxRuneNameEn: '28# Lo',
        runeRangeZh: '巴爾至 28# Lo，小怪至 24# Ist',
        runeRangeEn: 'Baal caps at 28# Lo; monsters cap at 24# Ist',
        noteZh: '惡夢巴爾驚人地能掉出 28# Lo，小怪最高至 24# Ist。',
        noteEn: 'Nightmare Baal can drop up to 28# Lo; regular monsters cap at 24# Ist.'
      },
      {
        difficulty: 'hell',
        labelZh: '地獄難度',
        labelEn: 'Hell',
        maxRuneNumber: 33,
        maxRuneNameZh: '33# 薩德 (Zod)',
        maxRuneNameEn: '33# Zod',
        runeRangeZh: '全場景解鎖 1# ~ 33# 薩德 (Zod)',
        runeRangeEn: 'All monsters drop up to 33# Zod',
        noteZh: '小怪與巴爾全面解鎖 33# 薩德，兼具衝 99 級經驗與全裝備掉落極限。',
        noteEn: 'Universal 33# Zod drop ceiling; apex of level 99 leveling and grail hunting.'
      }
    ],
    proTipsZh: [
      '世界之石常有電鬼與冥河鬼娃，務必備妥雷神之力或撐滿電抗，傭兵切勿秒殺鬼娃引發自爆。',
      '如果只刷五波僕從，殺完第五波古難怪後不必進紅門殺巴爾，可直接退房重開提高每小時期望效率。'
    ],
    proTipsEn: [
      'Gloams and Stygian Dolls frequent the Keep; pack Lightning Absorb / 85% Light Res, and prevent merc from detonating dolls.',
      'If focusing on wave clear speed, exit after the 5th wave instead of fighting Baal to maximize runes and XP per minute.'
    ]
  },
  {
    id: 'alvl_85_areas',
    nameZh: '經典 85 級特區 (地穴 / 古代通道 / 古老石墓)',
    nameEn: 'Iconic Level 85 Areas (The Pit / Ancient Tunnels / Stony Tomb)',
    act: 0,
    category: 'special_mechanic',
    categoryLabelZh: '85級全境特區 (alvl 85)',
    categoryLabelEn: 'Level 85 Areas',
    locationZh: '第一至五章各著名地下洞穴與墓穴',
    locationEn: 'Famous caves & dungeons across all Acts',
    recommendedPlayerCountZh: '1~3 人拓荒通刷最佳',
    recommendedPlayerCountEn: '1-3 players optimal for solo speed farming',
    summaryZh: '地獄難度中怪物等級躍升至 85 級的特定地下場景。怪物脆弱且無固定全元素免疫，是開荒角色越級打高符與暗金的最佳跳板。',
    summaryEn: 'Dungeons in Hell where monster levels jump to 85. Fragile monsters without universal immunities make them the best stepping stones for early ladder HR farming.',
    mechanicsZh: [
      '【地穴 (The Pit - 第一章泰摩高地)】：怪物血量極薄且抗性低，無天生全元素免疫，是弓馬、野蠻人、純死靈與電系職業早期打高符與 4 孔君主盾聖地。',
      '【古代通道 (Ancient Tunnels - 第二章遺失的城市)】：全區完全無天生冰冷免疫怪，是拓荒期純暴風雪法師最舒服、最安全的打寶地。',
      '【古老石墓 (Stony Tomb - 第二章碎石荒地旁)】：D2R 2.4 新增 85 場景，鄰近魯高因城門，怪物無天生火免疫且極為密集，是火法與毒死靈的專屬提款機。',
      '【全場景小怪最高 33# 薩德】：所有 85 級場景小怪均解鎖最高 TC，普通怪最高可出 33# Zod，暗金怪 mlvl 88。'
    ],
    mechanicsEn: [
      '[The Pit (Act 1 Tamoe Highland)]: Fragile monsters with low resistances and zero universal immunities; top pick for Bowazons, Necros, and Trapsins.',
      '[Ancient Tunnels (Act 2 Lost City)]: Naturally lacks Cold Immune monsters; the undisputed early ladder home of Blizzard Sorceresses.',
      '[Stony Tomb (Act 2 Rocky Waste)]: Added in Patch 2.4 right outside Lut Gholein; virtually immune-free for Fire builds, turning Fire Sorcs into HR magnets.',
      '[Universal 33# Zod]: Regular monsters (mlvl 85) and champions (mlvl 88) can drop all runes up to 33# Zod.'
    ],
    drops: [
      {
        difficulty: 'hell',
        labelZh: '地獄難度 (85 級場景)',
        labelEn: 'Hell (alvl 85 Areas)',
        maxRuneNumber: 33,
        maxRuneNameZh: '33# 薩德 (Zod)',
        maxRuneNameEn: '33# Zod',
        runeRangeZh: '全區怪物全面解鎖 1# ~ 33# 薩德 (Zod)',
        runeRangeEn: 'All monsters drop up to 33# Zod',
        noteZh: '小怪 mlvl 85、精英怪 mlvl 88，全面解鎖 1#~33# Zod 與全遊戲所有底材。',
        noteEn: 'Regular monsters mlvl 85, bosses mlvl 88; drops up to 33# Zod and all elite bases.'
      }
    ],
    proTipsZh: [
      '根據你的流派主力傷害屬性選擇對應 85 場景：冰法去「古代通道」、火法去「古老石墓」、電法去「地穴」或「蛛網洞穴」、物理去「地穴」。',
      '85 場景重點在擊殺精英怪群 (Champions & Unique Packs)，沿途小怪快速清理即可，不需翻箱倒櫃地毯式搜索。'
    ],
    proTipsEn: [
      'Match your elemental damage: Blizzard -> Ancient Tunnels; Fire -> Stony Tomb; Lightning -> The Pit or Arachnid Lair; Physical -> The Pit.',
      'Focus on hunting Champion and Unique packs rather than searching every empty corner.'
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
  26: [
    {
      runeNumber: 26,
      badgeType: 'spotlight',
      badgeZh: '橡樹之心門檻・高符基石',
      badgeEn: 'HOTO Threshold • HR Core',
      sourceId: 'hellforge',
      detailZh: '頂級施法武器「橡樹之心 (HOTO)」核心！熔爐敲出 2 顆 Gul 方塊合成即得。',
      detailEn: 'Core for Heart of the Oak; cubes directly from 2 Hellforge Guls.'
    }
  ],
  27: [
    {
      runeNumber: 27,
      badgeType: 'spotlight',
      badgeZh: '戰爭召喚(CTA)之魂',
      badgeEn: 'Call to Arms Core',
      sourceId: 'chaos_sanctuary',
      detailZh: '全職業副手必備「戰爭召喚 (CTA)」核心！提供戰鬥體質全隊血量暴增。',
      detailEn: 'Essential component for Call to Arms (CTA), granting Battle Orders to all classes.'
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
  29: [
    {
      runeNumber: 29,
      badgeType: 'spotlight',
      badgeZh: '合成 30# 貝之關鍵',
      badgeEn: 'Foundation for 30# Ber',
      sourceId: 'lower_kurast',
      detailZh: '下庫拉斯特超級寶箱狂暴掉落；2 顆 Sur 方塊合成即為無價之寶 30# Ber！',
      detailEn: 'Abundant in Hell LK super chests; 2 Surs cube directly into 30# Ber.'
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
  32: [
    {
      runeNumber: 32,
      badgeType: 'spotlight',
      badgeZh: '無法凍結・合成 33# 薩德',
      badgeEn: 'Cannot Be Frozen • Zod Step',
      sourceId: 'cow_level',
      detailZh: '鑲嵌提供無法凍結，亦為「傲慢」核心；天梯市價親民，2 顆 Cham 可合成 33# 薩德。',
      detailEn: 'Provides Cannot Be Frozen and core for Pride; 2 Chams cube into 33# Zod.'
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

/**
 * 農符文核心機制與硬核迷思破除資料介面
 */
export interface RuneDropMechanicInsight {
  id: string;
  titleZh: string;
  titleEn: string;
  tagZh: string;
  tagEn: string;
  summaryZh: string;
  summaryEn: string;
  iconType: 'players' | 'magic_find' | 'cube' | 'gem' | 'coins';
  pointsZh: string[];
  pointsEn: string[];
  tableData?: {
    headersZh: string[];
    headersEn: string[];
    rows: {
      col1Zh: string;
      col1En: string;
      col2: string;
      col3?: string;
      col3Zh?: string;
      col3En?: string;
      col4Zh: string;
      col4En: string;
    }[];
  };
}

export const RUNE_MECHANICS_GUIDE: RuneDropMechanicInsight[] = [
  {
    id: 'player_count_no_drop',
    titleZh: '房間人數與 No-Drop 機率換算（破解 8 人迷思）',
    titleEn: 'Player Count & No-Drop Odds (The P8 Myth Debunked)',
    tagZh: '掉落底層公式',
    tagEn: 'Drop Formula',
    summaryZh: '聖休亞瑞掉落機制的靈魂是「No-Drop（不掉落率）」。人數越高，不掉落率越低，噴出符文的次數越多；但注意 7 人與 8 人的掉落完全一致！',
    summaryEn: 'The core of D2R item generation is "No-Drop". Higher player counts reduce empty drop chances, but /players 7 and 8 share the exact same drop rate!',
    iconType: 'players',
    pointsZh: [
      '【No-Drop 階躍法則】：怪物死亡時的 No-Drop 機率只在「奇數人數」（1、3、5、7 人）時發生階躍性下降。',
      '【破解 8 人迷思】：8 人模式 (/players 8) 的 No-Drop 機率與 7 人模式 (/players 7) 完全相同（均為 ~14.3%）！多開 8 人只會額外增加怪物 50% 血量並大幅拖慢殺怪速度。農符文最極限推薦設定為 /players 7。',
      '【女伯爵反向定律】：女伯爵先判定普通裝備掉落（上限 5 件），剩餘空間才判定符文（最多 3 顆）。單人模式 (/players 1) 普通裝備 No-Drop 最高，反而騰出最多剩餘空間給專屬符文表；8 人模式裝備噴滿反而會擠掉符文！'
    ],
    pointsEn: [
      '[Odd-Number Progression]: No-Drop chance only drops at odd player counts (players 1, 3, 5, 7).',
      '[The P8 Myth]: /players 8 has the EXACT same drop rate as /players 7 (~14.3% No-Drop). P8 merely grants +50% monster HP, wasting time without extra rune drops. Always use /players 7 for peak efficiency.',
      '[Countess Inverse Law]: The Countess rolls regular items first (up to 5); remaining capacity rolls runes (up to 3). In /players 1, item No-Drop is highest, preserving slots for her rune table. Full games choke out runes!'
    ],
    tableData: {
      headersZh: ['房間人數設定', '普通小怪 No-Drop', '有效物品判定機率', '怪物血量與實戰建議'],
      headersEn: ['Player Count', 'Regular No-Drop', 'Effective Drop Rate', 'Monster HP & Practical Advice'],
      rows: [
        {
          col1Zh: '/players 1 (單人)',
          col1En: '/players 1 (Solo)',
          col2: '62.5%',
          col3: '37.5%',
          col4Zh: '血量 100%。女伯爵專屬符文掉落最高！拓荒期快速收割首選。',
          col4En: '100% HP. Best for Countess dedicated rune pool! Prime for early speed runs.'
        },
        {
          col1Zh: '/players 3 (三人)',
          col1En: '/players 3 (3 Players)',
          col2: '38.8%',
          col3: '61.2%',
          col4Zh: '血量 200%。單機拓荒性價比之王！大幅降低不掉落率且清怪阻力小。',
          col4En: '200% HP. Best value for single player ladder start! Huge drop boost with low resistance.'
        },
        {
          col1Zh: '/players 5 (五人)',
          col1En: '/players 5 (5 Players)',
          col2: '24.0%',
          col3: '76.0%',
          col4Zh: '血量 300%。角色成形（如電標馬、死靈法師、雙悔恨狂亂）後刷牛關絕佳配置。',
          col4En: '300% HP. Superb for geared AOE builds (Javazon, Poison Necro, Dual Grief Frenzy).'
        },
        {
          col1Zh: '/players 7 (七人)',
          col1En: '/players 7 (7 Players)',
          col2: '14.3%',
          col3: '85.7%',
          col4Zh: '血量 400%。【農符文天花板】LK 超級寶箱、崔凡克與秘密乳牛關極致高符產率！',
          col4En: '400% HP. [Peak Rune Farming] Optimal for LK super chests, Travincal, and Cow runs!'
        },
        {
          col1Zh: '/players 8 (八人)',
          col1En: '/players 8 (8 Players)',
          col2: '14.3%',
          col3: '85.7%',
          col4Zh: '血量 450%。【迷思警告】掉落率與 P7 完全一致，只多給經驗，刷符文不推薦。',
          col4En: '450% HP. [Myth Warning] Identical drop rate to P7; only increases XP. Not recommended for runes.'
        }
      ]
    }
  },
  {
    id: 'magic_find_myth',
    titleZh: '尋寶率 (MF) 對符文完全無效',
    titleEn: 'Magic Find (MF) Has Zero Effect on Runes',
    tagZh: '配裝關鍵思維',
    tagEn: 'Gear Philosophy',
    summaryZh: '這是暗黑破壞神二最常被誤解的機制：尋寶率 (MF) 只能讓物品變成魔法、亮金或暗金，完全無法提升任何符文的掉落機率！',
    summaryEn: 'One of the most common misconceptions: Magic Find only affects item quality (magic, rare, unique) and has absolutely zero impact on rune drops!',
    iconType: 'magic_find',
    pointsZh: [
      '【底層掉落兩階段判定】：怪物死亡時，系統先判定「掉落哪種基礎物品 (Base Item Type)」（如符文、君主盾、藥水）；第二步才根據 MF 判定該物品是否晉級為藍色、亮金或暗金。',
      '【符文屬於白色/雜項品質】：符文在引擎中被歸類為不可具有品質等級的特殊雜項 (Misc)，它的掉落權重在第一階段就已敲定，完全不參與第二階段的 MF 運算！',
      '【農高符的終極配裝法則】：若目標是農高階神符與白色打洞底材，請果斷脫下諧角之冠(軍帽)、財富、拿各等純 MF 裝備，全力堆疊傷害、攻擊速度(IAS)、施法速度(FCR)、跑速與生存抗性，用「更快的殺怪頻率」直接堆出高符期望值！'
    ],
    pointsEn: [
      '[Two-Stage Generation]: The engine first decides the Base Item Type (rune, monarch, potion); only in stage 2 does MF determine whether it rolls magic, rare, or unique.',
      '[Runes are Misc Items]: Runes are categorized as unmodifiable miscellaneous items. Their generation is finalized in stage 1, completely bypassing MF calculations!',
      '[The Pure Speed Strategy]: When hunting high runes and grey socket bases, drop pure MF gear like Shako and Wealth. Stack pure DPS, FCR, IAS, Movement Speed, and survivability to maximize kills per hour!'
    ]
  },
  {
    id: 'gem_color_cycle',
    titleZh: '符文合成「黃紫藍紅綠白」寶石色彩循環口訣',
    titleEn: 'Rune Cubing "Topaz-Amethyst-Sapphire-Ruby-Emerald-Diamond" Gem Cycle',
    tagZh: '方塊口訣記憶法',
    tagEn: 'Cube Mnemonics',
    summaryZh: '10#~32# 符文升級所需的寶石種類並非隨機分配，而是嚴格遵循固定的 6 色循環！只要記住口訣，任何符文合成配方一秒心算，免去繁瑣查表負擔。',
    summaryEn: 'The gems required for 10#~32# rune upgrades strictly follow a recurring 6-color sequence: Topaz -> Amethyst -> Sapphire -> Ruby -> Emerald -> Diamond!',
    iconType: 'gem',
    pointsZh: [
      '【六色彩色循環口訣】：【黃 ➔ 紫 ➔ 藍 ➔ 紅 ➔ 綠 ➔ 白】（Topaz ➔ Amethyst ➔ Sapphire ➔ Ruby ➔ Emerald ➔ Diamond）。',
      '【四階段品質進階規則】：\n・10#～15#（3 合 1）：依序配【碎裂 (Chipped)】黃、紫、藍、紅、綠、白寶石。\n・16#～21#（3 合 1）：依序配【瑕疵 (Flawed)】黃、紫、藍、紅、綠、白寶石。\n・22#～27#（2 合 1）：依序配【普通 (Regular)】黃、紫、藍、紅、綠、白寶石。\n・28#～32#（2 合 1）：依序配【無瑕 (Flawless)】黃、紫、藍、紅、綠寶石（32# 合 33# 剛好到綠寶石結束）。',
      '【速算實例】：想合 30# 貝？29# 瑟是無瑕組的第 2 顆，循環第二位是「紫」，因此配方必定是「2 Sur + 無瑕紫寶石 ➔ 1 Ber」！想合 26# 伐克斯？25# 古爾是普通組第 4 顆，第四位是「紅」，因此必定是「2 Gul + 紅寶石 ➔ 1 Vex」！'
    ],
    pointsEn: [
      '[The 6-Color Sequence]: Topaz -> Amethyst -> Sapphire -> Ruby -> Emerald -> Diamond (Yellow -> Purple -> Blue -> Red -> Green -> White).',
      '[4 Quality Tiers]:\n• 10#~15# (3 to 1): Chipped Topaz, Amethyst, Sapphire, Ruby, Emerald, Diamond.\n• 16#~21# (3 to 1): Flawed Topaz, Amethyst, Sapphire, Ruby, Emerald, Diamond.\n• 22#~27# (2 to 1): Regular Topaz, Amethyst, Sapphire, Ruby, Emerald, Diamond.\n• 28#~32# (2 to 1): Flawless Topaz, Amethyst, Sapphire, Ruby, Emerald (stops at Emerald for Zod).',
      '[Mental Calculation Example]: Cubing into 30# Ber? 29# Sur is the 2nd in the Flawless tier; the 2nd color is Amethyst. Thus formula is 2 Sur + Flawless Amethyst -> Ber!'
    ],
    tableData: {
      headersZh: ['階層範圍', '合成數量', '需求寶石品質', '對應 6 色寶石循環 (黃➔紫➔藍➔紅➔綠➔白)'],
      headersEn: ['Rune Range', 'Ratio', 'Gem Quality', 'Gem Cycle (Topaz -> Amethyst -> Sapphire -> Ruby -> Emerald -> Diamond)'],
      rows: [
        {
          col1Zh: '1# El ~ 9# Ort',
          col1En: '1# El ~ 9# Ort',
          col2: '3 : 1',
          col3Zh: '無需寶石',
          col3En: 'No Gems',
          col4Zh: '直接將 3 顆相同符文放入方塊點擊合成即可。',
          col4En: 'Transmute 3 matching runes directly without any gems.'
        },
        {
          col1Zh: '10# Thul ~ 15# Hel',
          col1En: '10# Thul ~ 15# Hel',
          col2: '3 : 1',
          col3Zh: '碎裂寶石 (Chipped)',
          col3En: 'Chipped Gems',
          col4Zh: '10#配碎黃、11#配碎紫、12#配碎藍、13#配碎紅、14#配碎綠、15#配碎白。',
          col4En: '10# Chipped Topaz, 11# Amethyst, 12# Sapphire, 13# Ruby, 14# Emerald, 15# Diamond.'
        },
        {
          col1Zh: '16# Io ~ 21# Pul',
          col1En: '16# Io ~ 21# Pul',
          col2: '3 : 1',
          col3Zh: '瑕疵寶石 (Flawed)',
          col3En: 'Flawed Gems',
          col4Zh: '16#配瑕黃、17#配瑕紫、18#配瑕藍、19#配瑕紅、20#配瑕綠、21#配瑕白。',
          col4En: '16# Flawed Topaz, 17# Amethyst, 18# Sapphire, 19# Ruby, 20# Emerald, 21# Diamond.'
        },
        {
          col1Zh: '22# Um ~ 27# Ohm',
          col1En: '22# Um ~ 27# Ohm',
          col2: '2 : 1',
          col3Zh: '普通寶石 (Regular)',
          col3En: 'Regular Gems',
          col4Zh: '22#配黃寶石、23#配紫寶石、24#配藍寶石、25#配紅寶石、26#配綠寶石、27#配白寶石。',
          col4En: '22# Topaz, 23# Amethyst, 24# Sapphire, 25# Ruby, 26# Emerald, 27# Diamond.'
        },
        {
          col1Zh: '28# Lo ~ 32# Cham',
          col1En: '28# Lo ~ 32# Cham',
          col2: '2 : 1',
          col3Zh: '無瑕寶石 (Flawless)',
          col3En: 'Flawless Gems',
          col4Zh: '28#配無瑕黃、29#配無瑕紫、30#配無瑕藍、31#配無瑕紅、32#配無瑕綠。',
          col4En: '28# Flawless Topaz, 29# Amethyst, 30# Sapphire, 31# Ruby, 32# Emerald.'
        }
      ]
    }
  },
  {
    id: 'cube_upgrade_economy',
    titleZh: '高階神符方塊合成性價比盤點',
    titleEn: 'Cube Upgrade Economy: What to Upgrade & What NOT to',
    tagZh: '資產管理指南',
    tagEn: 'Wealth Guide',
    summaryZh: '符文方塊向上合成採用幾何級數消耗（2 顆合 1 顆）。某些合成能讓你瞬間湊出關鍵神裝，某些合成卻會讓你慘賠身家！',
    summaryEn: 'Cube recipe upgrades double costs geometrically. Some upgrades immediately unlock game-changing runewords, while others destroy immense trade value!',
    iconType: 'cube',
    pointsZh: [
      '【必合推薦 ★★★★★】：\n・2× 25# 古爾 (Gul) + 紅寶石 → 26# 伐克斯 (Vex)：敲石頭常出 25#，兩顆直出法系終極武器「橡樹之心 (HOTO)」。\n・2× 29# 瑟 (Sur) + 無瑕紫寶石 → 30# 貝 (Ber)：下庫拉斯特超級寶箱與天梯最核心的「合貝途徑」，組裝「謎團」與「無限」的最短捷徑！\n・2× 32# 查姆 (Cham) + 無瑕綠寶石 → 33# 薩德 (Zod)：天梯中 Cham 的流通需求極低（通常市價 < 0.5 Ber），合為 33# 薩德做「死亡呼吸」或鑲無形頂級暗金極具性價比。',
      '【情況合 ★★★☆☆】：\n・2× 21# 普爾 (Pul) → 22# 烏姆 (Um)：做「強制」或衣帽鑲嵌補 15 全抗。\n・2× 23# 馬爾 (Mal) → 24# 伊司特 (Ist)：自用打寶鑲嵌或做精神/誓約缺料時可合。\n・2× 27# 歐姆 (Ohm) → 28# 羅 (Lo)：迫切需要做物理第一神甲「剛毅」或單手武器「悔恨」時可合。',
      '【千萬別合 ❌ 禁忌】：\n・2× 30# 貝 (Ber) → 31# 喬 (Jah)：在天梯與單機經濟中，Ber（可做無限、謎團、野獸）的泛用性與交易價值普遍等於或超越 Jah，用兩顆 Ber 合一顆 Jah 相當於白白蒸發半套神裝！'
    ],
    pointsEn: [
      '[Must Upgrade ★★★★★]:\n• 2x 25# Gul + Ruby -> 26# Vex: Hellforge frequently yields Gul; two instantly forge Heart of the Oak (HOTO).\n• 2x 29# Sur + Flawless Amethyst -> 30# Ber: The universal route to craft Enigma and Infinity from LK chests and ladder drops!\n• 2x 32# Cham + Flawless Emerald -> 33# Zod: Cham trades cheaply due to lower demand (<0.5 Ber); cubing into 33# Zod for Breath of the Dying is phenomenal value.',
      '[Situational ★★★☆☆]:\n• 2x 21# Pul -> 22# Um: For Duress or +15/22 all resistances socketing.\n• 2x 23# Mal -> 24# Ist: When crafting Call to Arms or needing pure 25% MF socketing.\n• 2x 27# Ohm -> 28# Lo: When desperately needing Grief or Fortitude immediately.',
      '[NEVER Upgrade ❌ Trap]:\n• 2x 30# Ber -> 31# Jah: In ladder and single-player economies, Ber trades at or above Jah due to Infinity, Enigma, and Beast recipes. Cubing 2 Bers into 1 Jah evaporates half a fortune!'
    ]
  },
  {
    id: 'high_rune_currency_index',
    titleZh: '天梯高階神符流通硬通貨與相對經濟標竿',
    titleEn: 'Ladder High Rune Currency Index & Relative Value Guide',
    tagZh: '天梯經濟市場學',
    tagEn: 'Economy & Trading',
    summaryZh: '在 D2R 天梯經濟與社群交易中，「符文編號大小」絕對不等於「交易價值大小」！全天梯以 30# 貝 (Ber) 與 31# 喬 (Jah) 為黃金儲備本位幣。',
    summaryEn: 'In D2R ladder trading, rune number does NOT equal market value! 30# Ber and 31# Jah act as the ultimate gold standard currencies of Sanctuary.',
    iconType: 'coins',
    pointsZh: [
      '【雙王本位幣 (30# Ber & 31# Jah)】：整個 D2R 經濟體系的定價錨點。幾乎所有頂級裝備與手工飾品皆以 Ber / Jah 為單位計價。早期 Ber 稍貴（開荒做無限與謎團），中後期 Jah 與 Ber 等價。',
      '【0.5 Ber 錨定幣 (29# Sur)】：因為 2 顆 Sur 必定可方塊合成 1 顆 Ber，因此 Sur 的交易價值在全賽季精準鎖定為 0.5 ~ 0.52 Ber，是最穩定、無折價的抗通膨高符。',
      '【實戰性硬通貨 (28# Lo, 27# Ohm, 26# Vex, 24# Ist)】：Lo (悔恨/剛毅核心，約 0.5~0.6 Ber)、Ohm (戰爭召喚核心，約 0.25~0.3 Ber)、Vex (橡樹之心核心，約 0.12~0.15 Ber)、Ist (打寶與中階交易基準幣，約 0.04~0.05 Ber)。',
      '【高號低價陷阱 (32# Cham & 33# Zod)】：很多新手常誤以為 32# 與 33# 號碼最大所以最貴。事實上因其能組裝的主流神裝較少，Cham 通常僅值 0.2~0.4 Ber，Zod 僅值 0.4~0.6 Ber，切勿拿 30# 貝去 1:1 等價交換 33# 薩德！'
    ],
    pointsEn: [
      '[The Twin Kings (30# Ber & 31# Jah)]: The universal anchor of D2R trade economy. All godly items trade in units of Ber and Jah. Early ladder favors Ber (Infinity); mid-to-late ladder Jah and Ber trade at par.',
      '[The Pure 0.5 Anchor (29# Sur)]: Because 2 Surs cube directly into 1 Ber, Sur strictly holds 0.5 ~ 0.52 Ber value throughout entire ladders with zero inflation risk.',
      '[Core Functional Runes (28# Lo, 27# Ohm, 26# Vex, 24# Ist)]: Lo (Grief/Fortitude, ~0.5-0.6 Ber), Ohm (CTA, ~0.25-0.3 Ber), Vex (HOTO, ~0.12-0.15 Ber), Ist (MF & currency sub-unit, ~0.04-0.05 Ber).',
      '[The High-Number Trap (32# Cham & 33# Zod)]: New players frequently assume highest number = highest value. Due to limited meta runeword recipes, Cham trades at only 0.2-0.4 Ber, and Zod at 0.4-0.6 Ber! Never trade a Ber 1:1 for a Zod.'
    ]
  }
];

/**
 * 熱門快刷首領與固定暗金怪符文掉落上限資料介面
 */
export interface BossRuneDropCap {
  id: string;
  nameZh: string;
  nameEn: string;
  act: number;
  locationZh: string;
  locationEn: string;
  mlvlHell: number;
  normalMaxRune: number;
  normalMaxRuneZh: string;
  normalMaxRuneEn: string;
  nightmareMaxRune: number;
  nightmareMaxRuneZh: string;
  nightmareMaxRuneEn: string;
  hellMaxRune: number;
  hellMaxRuneZh: string;
  hellMaxRuneEn: string;
  farmRoleZh: string;
  farmRoleEn: string;
  proTipZh: string;
  proTipEn: string;
}

export const BOSS_RUNE_DROP_CAPS: BossRuneDropCap[] = [
  {
    id: 'pindleskin',
    nameZh: '暴皮',
    nameEn: 'Pindleskin',
    act: 5,
    locationZh: '第五章・尼拉塞克的神殿庭院 (紅門旁)',
    locationEn: 'Act 5 • Nihlathak\'s Temple courtyard',
    mlvlHell: 86,
    normalMaxRune: 12,
    normalMaxRuneZh: '12# 索爾 (Sol)',
    normalMaxRuneEn: '12# Sol',
    nightmareMaxRune: 24,
    nightmareMaxRuneZh: '24# 伊司特 (Ist)',
    nightmareMaxRuneEn: '24# Ist',
    hellMaxRune: 33,
    hellMaxRuneZh: '33# 薩德 (Zod)',
    hellMaxRuneEn: '33# Zod',
    farmRoleZh: '15 秒快刷之王・全符文全暗金',
    farmRoleEn: '15-sec Speedrun King • Full Drop Pool',
    proTipZh: '進紅門直走 2 秒即打，小怪帶亡者復活與衝鋒，擊殺後撿寶立即重開遊戲，效率冠絕全天梯。',
    proTipEn: 'Step into the red portal and attack instantly. Slay and reset in 15 seconds flat.'
  },
  {
    id: 'shenk_eldritch',
    nameZh: '督軍山克 & 矯正者艾德瑞奇',
    nameEn: 'Shenk the Overseer & Eldritch',
    act: 5,
    locationZh: '第五章・冰凍高地 傳送點上下兩側',
    locationEn: 'Act 5 • Frigid Highlands WP (North & South)',
    mlvlHell: 84,
    normalMaxRune: 9,
    normalMaxRuneZh: '9# 歐特 (Ort)',
    normalMaxRuneEn: '9# Ort',
    nightmareMaxRune: 22,
    nightmareMaxRuneZh: '22# 烏姆 (Um)',
    nightmareMaxRuneEn: '22# Um',
    hellMaxRune: 33,
    hellMaxRuneZh: '33# 薩德 (Zod)',
    hellMaxRuneEn: '33# Zod',
    farmRoleZh: '傳送點零門檻快刷雙星',
    farmRoleEn: 'Zero-Distance WP Twin Bosses',
    proTipZh: '飛到冰凍高地傳送點，往北 3 步殺艾德瑞奇、往南走下階梯殺山克，雙倍精英掉落只需 30 秒。',
    proTipEn: 'Take Frigid Highlands waypoint: step north for Eldritch, south down steps for Shenk; 30s double clear.'
  },
  {
    id: 'nihlathak',
    nameZh: '尼拉塞克',
    nameEn: 'Nihlathak',
    act: 5,
    locationZh: '第五章・沃特之廳 最深處',
    locationEn: 'Act 5 • Halls of Vaught, Inner Sanctum',
    mlvlHell: 95,
    normalMaxRune: 18,
    normalMaxRuneZh: '18# 科 (Ko)',
    normalMaxRuneEn: '18# Ko',
    nightmareMaxRune: 26,
    nightmareMaxRuneZh: '26# 伐克斯 (Vex)',
    nightmareMaxRuneEn: '26# Vex',
    hellMaxRune: 33,
    hellMaxRuneZh: '33# 薩德 (Zod)',
    hellMaxRuneEn: '33# Zod',
    farmRoleZh: '95級首領・破壞之鑰唯一產地',
    farmRoleEn: 'Level 95 Boss • Key of Destruction',
    proTipZh: '極其致命的屍體爆炸 (CE)，務必穿戴「安息 (Rest in Peace)」裝備（如大自然之戒或執法者）讓怪物靈魂昇華無法被引爆。',
    proTipEn: 'Deadly Corpse Explosion! Equip Nature\'s Peace or Lawbringer (Rest in Peace) to prevent corpse popping.'
  },
  {
    id: 'mephisto',
    nameZh: '墨菲斯托',
    nameEn: 'Mephisto',
    act: 3,
    locationZh: '第三章・憎恨的牢獄第三層',
    locationEn: 'Act 3 • Durance of Hate Level 3',
    mlvlHell: 87,
    normalMaxRune: 15,
    normalMaxRuneZh: '15# 海爾 (Hel)',
    normalMaxRuneEn: '15# Hel',
    nightmareMaxRune: 22,
    nightmareMaxRuneZh: '22# 烏姆 (Um)',
    nightmareMaxRuneEn: '22# Um',
    hellMaxRune: 32,
    hellMaxRuneZh: '32# 查姆 (Cham)',
    hellMaxRuneEn: '32# Cham',
    farmRoleZh: '天梯拓荒提款機・隔河卡位暴風雪',
    farmRoleEn: 'Ladder Starter Bank • Moat Trick',
    proTipZh: '活用紅色血池隔河卡位 (Moat Trick)，暴風雪法師站在血池另一側可無損安全擊殺。身後紅門大寶箱必順手翻開。',
    proTipEn: 'Abuse the Moat Trick across the red pool to Blizzard him down safely. Pop the super chest behind the red portal!'
  },
  {
    id: 'andariel',
    nameZh: '安達莉爾',
    nameEn: 'Andariel',
    act: 1,
    locationZh: '第一章・地下墓穴第四層',
    locationEn: 'Act 1 • Catacombs Level 4',
    mlvlHell: 75,
    normalMaxRune: 6,
    normalMaxRuneZh: '6# 伊斯 (Ith)',
    normalMaxRuneEn: '6# Ith',
    nightmareMaxRune: 18,
    nightmareMaxRuneZh: '18# 科 (Ko)',
    nightmareMaxRuneEn: '18# Ko',
    hellMaxRune: 30,
    hellMaxRuneZh: '30# 貝 (Ber)',
    hellMaxRuneEn: '30# Ber',
    farmRoleZh: '暗金飾品與 30# 貝來源・天生弱火',
    farmRoleEn: 'Unique Rings & 30# Ber • Fire Weakness',
    proTipZh: '天生火抗為 -50%，火法、火德與火陷阱刺客可在數秒內熔化。惡夢與地獄為全遊戲掉落喬丹之石 (SOJ) 期望值最高之首領。',
    proTipEn: 'Natural -50% Fire Resistance melts to fire damage. Prime source for Stone of Jordan (SOJ) rings.'
  },
  {
    id: 'duriel',
    nameZh: '都瑞爾',
    nameEn: 'Duriel',
    act: 2,
    locationZh: '第二章・塔拉夏的古墓 真正的術士之墓內室',
    locationEn: 'Act 2 • Tal Rasha\'s Chamber',
    mlvlHell: 88,
    normalMaxRune: 11,
    normalMaxRuneZh: '11# 安姆 (Amn)',
    normalMaxRuneEn: '11# Amn',
    nightmareMaxRune: 22,
    nightmareMaxRuneZh: '22# 烏姆 (Um)',
    nightmareMaxRuneEn: '22# Um',
    hellMaxRune: 30,
    hellMaxRuneZh: '30# 貝 (Ber)',
    hellMaxRuneEn: '30# Ber',
    farmRoleZh: '高階暗金護甲與飾品',
    farmRoleEn: 'Armor & Jewelry Drop Multipliers',
    proTipZh: '自帶神聖冰凍光環無法被「無法凍結」抵銷減速，戰前傭兵與自己喝 4~6 瓶解凍藥水直接撐高冰抗與上限。',
    proTipEn: 'Holy Freeze slows through Cannot Be Frozen. Chug 4-6 Thawing Potions beforehand for bonus Cold Res and max cap.'
  },
  {
    id: 'summoner',
    nameZh: '召喚師',
    nameEn: 'The Summoner',
    act: 2,
    locationZh: '第二章・秘法聖殿 四向路徑終點之一',
    locationEn: 'Act 2 • Arcane Sanctuary, End of 1 of 4 paths',
    mlvlHell: 80,
    normalMaxRune: 8,
    normalMaxRuneZh: '8# 拉爾 (Ral)',
    normalMaxRuneEn: '8# Ral',
    nightmareMaxRune: 18,
    nightmareMaxRuneZh: '18# 科 (Ko)',
    nightmareMaxRuneEn: '18# Ko',
    hellMaxRune: 31,
    hellMaxRuneZh: '31# 喬 (Jah)',
    hellMaxRuneEn: '31# Jah',
    farmRoleZh: '憎恨之鑰唯一掉落者・身旁固定大寶箱',
    farmRoleEn: 'Key of Hate Source • 2-3 Super Chests',
    proTipZh: '沿途清幽靈高頻出符文，召喚師血量極薄可秒殺，其站立台子周圍必有 2~3 個寶箱，開出高符機率極高。',
    proTipEn: 'Summoner is very frail and drops Key of Hate. Always pop the 2-3 chests on his platform for frequent runes.'
  }
];

/**
 * 符文特異功能對照資料介面（免金幣修裝、方塊洗孔、打孔、手工合成核心）
 */
export interface RuneSpecialUtility {
  runeNumber: number;
  badgeZh: string;
  badgeEn: string;
  category: 'repair' | 'craft' | 'unsocket' | 'upgrade' | 'socket';
  descZh: string;
  descEn: string;
}

export const RUNE_SPECIAL_UTILITIES: Record<number, RuneSpecialUtility[]> = {
  7: [
    {
      runeNumber: 7,
      badgeZh: '胸甲打孔',
      badgeEn: 'Armor Socketing',
      category: 'socket',
      descZh: '7# Tal + 10# Thul + 完美黃寶石 + 白色胸甲 = 隨機孔數（洗剛毅傭兵底材常用）。',
      descEn: '7# Tal + 10# Thul + PTopaz + Plain Armor = Random sockets (Fortitude merc bases).'
    },
    {
      runeNumber: 7,
      badgeZh: '盾牌打孔',
      badgeEn: 'Shield Socketing',
      category: 'socket',
      descZh: '7# Tal + 11# Amn + 完美紅寶石 + 白色盾牌 = 隨機孔數（洗 4 孔君主盾或聖騎盾）。',
      descEn: '7# Tal + 11# Amn + PRuby + Plain Shield = Random sockets (4os Monarch/Paladin shield).'
    }
  ],
  8: [
    {
      runeNumber: 8,
      badgeZh: '100% 免金幣修防具',
      badgeEn: 'Free Armor Repair',
      category: 'repair',
      descZh: '【省百萬維修費】1x Ral + 任意防具 = 100% 恢復耐久度（免回鐵匠花幾十萬修超強謎團/剛毅！）。',
      descEn: '1x Ral + Any Armor = 100% Fully Repaired (bypasses massive 500k+ gold fees on Superior runewords!).'
    },
    {
      runeNumber: 8,
      badgeZh: '施法者手工項鍊核心',
      badgeEn: 'Caster Amulet Core',
      category: 'craft',
      descZh: '1x Ral + 完美紫寶石 + 珠寶 + 魔法項鍊 = 施法者項鍊（衝 +2 技能 / +20% FCR 頂裝必備，全季剛需大量收購）。',
      descEn: '1x Ral + PAmethyst + Jewel + Magic Amulet = Caster Amulet (+2 Skill / +20% FCR endgame pursuit).'
    },
    {
      runeNumber: 8,
      badgeZh: '武器打孔',
      badgeEn: 'Weapon Socketing',
      category: 'socket',
      descZh: '8# Ral + 11# Amn + 完美紫寶石 + 白色武器 = 隨機孔數。',
      descEn: '8# Ral + 11# Amn + PAmethyst + Plain Weapon = Random sockets.'
    },
    {
      runeNumber: 8,
      badgeZh: '暗金武器升級',
      badgeEn: 'Unique Weapon Upgrade',
      category: 'upgrade',
      descZh: '8# Ral + 12# Sol + 完美綠寶石 + 一般暗金武器 = 升級為進階暗金武器。',
      descEn: '8# Ral + 12# Sol + PEmerald + Normal Unique Weapon = Exceptional upgrade.'
    }
  ],
  9: [
    {
      runeNumber: 9,
      badgeZh: '100% 免金幣修武器',
      badgeEn: 'Free Weapon Repair',
      category: 'repair',
      descZh: '1x Ort + 任意武器 = 100% 恢復耐久度（亦可加碎裂寶石同時充能聚氣技能）。',
      descEn: '1x Ort + Any Weapon = 100% Fully Repaired (add chipped gem to recharge skill charges too).'
    },
    {
      runeNumber: 9,
      badgeZh: '打擊手套手工核心',
      badgeEn: 'Hit Power Gloves Core',
      category: 'craft',
      descZh: '1x Ort + 完美藍寶石 + 珠寶 + 魔法手套 = 打擊手套（自帶「擊退 (Knockback)」與隨機攻速/吸血屬性，弓馬最愛）。',
      descEn: '1x Ort + PSapphire + Jewel + Magic Gloves = Hit Power Gloves (guaranteed Knockback for Bowazons).'
    }
  ],
  10: [
    {
      runeNumber: 10,
      badgeZh: '安全手工靴核心',
      badgeEn: 'Safety Boots Core',
      category: 'craft',
      descZh: '1x Thul + 完美綠寶石 + 珠寶 + 魔法靴 = 安全靴（帶火抗與減傷）。',
      descEn: '1x Thul + PEmerald + Jewel + Magic Boots = Safety Boots (Fire Res & Damage Reduction).'
    },
    {
      runeNumber: 10,
      badgeZh: '頭盔打孔',
      badgeEn: 'Helm Socketing',
      category: 'socket',
      descZh: '8# Ral + 10# Thul + 完美藍寶石 + 白色頭盔 = 隨機孔數（洗閃爍火焰或治癒底材）。',
      descEn: '8# Ral + 10# Thul + PSapphire + Plain Helm = Random sockets (Flickering Flame/Cure helm).'
    }
  ],
  11: [
    {
      runeNumber: 11,
      badgeZh: '血腥壓碎手套核心',
      badgeEn: 'Blood Gloves Core',
      category: 'craft',
      descZh: '1x Amn + 完美紅寶石 + 珠寶 + 魔法重手套/吸血鬼骸骨手套 = 必帶 5~10% 壓碎打擊 (CB) + 1~3% 吸血，近戰頂級手套！',
      descEn: '1x Amn + PRuby + Jewel + Magic Heavy Gloves / Vampirebone Gloves = Blood Gloves (guaranteed 5-10% Crushing Blow & Life Steal).'
    },
    {
      runeNumber: 11,
      badgeZh: '血腥戒指核心',
      badgeEn: 'Blood Ring Core',
      category: 'craft',
      descZh: '1x Amn + 完美紅寶石 + 珠寶 + 魔法戒指 = 血腥戒指（必帶 1~3% 吸血 + 10~20 生命 + 1~5 力量）。',
      descEn: '1x Amn + PRuby + Jewel + Magic Ring = Blood Ring (guaranteed Life Steal, Life, and Strength).'
    }
  ],
  12: [
    {
      runeNumber: 12,
      badgeZh: '血腥頭盔核心',
      badgeEn: 'Blood Helm Core',
      category: 'craft',
      descZh: '1x Sol + 完美紅寶石 + 珠寶 + 魔法頭盔 = 必帶 5~10% 致命打擊 (Deadly Strike) + 吸血。',
      descEn: '1x Sol + PRuby + Jewel + Magic Helm = Blood Helm (guaranteed 5-10% Deadly Strike & Life Steal).'
    }
  ],
  15: [
    {
      runeNumber: 15,
      badgeZh: '方塊洗孔 (清空鑲孔)',
      badgeEn: 'Unsocket (Clean Sockets)',
      category: 'unsocket',
      descZh: '【符文之語洗爛重做必備】1x Hel + 城鎮傳送卷軸 + 已鑲嵌裝備 = 徹底清空孔內符文與寶石，底材原樣完好保留！',
      descEn: '1x Hel + Scroll of Town Portal + Socketed Item = Permanently destroys socketed items, leaving clean open base.'
    }
  ],
  20: [
    {
      runeNumber: 20,
      badgeZh: '防具升級 (進階→菁英)',
      badgeEn: 'Armor Elite Upgrade',
      category: 'upgrade',
      descZh: '20# Lem + 18# Ko + 完美鑽石 + 進階暗金防具 = 升級為菁英暗金防具（如法師鎧甲升統御者鎧甲、蛇魔法師之皮升級為古龍皮）。',
      descEn: '20# Lem + 18# Ko + PDiamond + Exceptional Armor = Elite Armor upgrade (Skin of the Vipermagi -> Wyrmhide, Mage Plate -> Archon Plate).'
    }
  ]
};
