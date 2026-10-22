/**
 * 暗黑破壞神 II：獄火重生 (D2R) 完整任務與世界事件資料庫
 * 包含 Act 1 - Act 5 全部 27 個任務、永久屬性/技能獎勵、通關技巧與隱藏世界事件
 */

export interface QuestData {
  id: string;
  act: number;
  questNumber: number;
  name: string;
  nameEn: string;
  givenBy: string;
  location: string;
  isMandatory: boolean; // 是否為通關主線強制任務
  permanentReward?: {
    type: "skill_point" | "attribute_point" | "life" | "resistance" | "socket" | "imbue" | "respec";
    description: string;
    value: string;
  };
  summary: string;
  walkthrough: string[];
  tacticalTips: string;
}

export interface WorldEventData {
  id: string;
  name: string;
  nameEn: string;
  triggerCondition: string;
  location: string;
  keyRewards: string[];
  guide: string;
}

export const QUESTS_DATA: QuestData[] = [
  // ── ACT 1: 羅格營地 ──
  {
    id: "act1_q1",
    act: 1,
    questNumber: 1,
    name: "邪惡洞窟",
    nameEn: "Den of Evil",
    givenBy: "阿卡拉 (Akara)",
    location: "鮮血荒地 (Blood Moor)",
    isMandatory: false,
    permanentReward: {
      type: "skill_point",
      description: "獲得 +1 技能點數，並獲得 1 次免費重置技能與屬性點機會！",
      value: "+1 技能點 & 免費洗點"
    },
    summary: "清除鮮血荒地洞穴中的全部 66 隻惡魔，為盲眼修女會淨化避難所周邊土地。",
    walkthrough: [
      "走出俠盜營地進入鮮血荒地，沿泥土小路搜尋邪惡洞窟入口。",
      "消滅洞窟內所有怪物，當剩餘怪物少於 5 隻時，任務日誌會顯示剩餘怪物數量。",
      "擊殺最後一隻怪物後洞窟充滿光芒，回城與阿卡拉對話領取獎勵。"
    ],
    tacticalTips: "【三難度必解】普通、惡夢、地獄三難度各送 1 點技能點與 1 次洗點機會，合計白嫖 +3 技能點與 3 次免費重新配點！"
  },
  {
    id: "act1_q2",
    act: 1,
    questNumber: 2,
    name: "褻瀆的墓地",
    nameEn: "Sisters' Burial Grounds",
    givenBy: "卡夏 (Kashya)",
    location: "埋骨之地 (Burial Grounds)",
    isMandatory: false,
    summary: "前往埋骨之地消滅墮落的古代英雄「血鴉 (Blood Raven)」，解救修女會的英靈墓地。",
    walkthrough: [
      "從冰冷之原穿越進入埋骨之地墓園。",
      "找到在墓碑群中疾跑放箭的血鴉，將其擊殺。",
      "回營地與卡夏對話，免費雇傭一名俠盜斥候傭兵 (京子)。"
    ],
    tacticalTips: "前期拓荒獲得免費遠程傭兵的途徑；墓園旁的「大陵墓」與「墓地」在普通難度適合練級，地獄難度為 85 級頂級打寶場景。"
  },
  {
    id: "act1_q3",
    act: 1,
    questNumber: 3,
    name: "尋找凱恩",
    nameEn: "The Search for Cain",
    givenBy: "阿卡拉 (Akara)",
    location: "黑暗森林 (Dark Wood) & 崔斯特姆 (Tristram)",
    isMandatory: true,
    permanentReward: {
      type: "attribute_point",
      description: "迪卡‧凱恩永久定居營地，為你提供「終生免費一鍵鑑定所有裝備」服務！",
      value: "永久免費鑑定"
    },
    summary: "尋找艾尼弗斯之樹取得卷軸，按順序觸摸亂石曠野五根石柱開啟紅門，解救智者迪卡‧凱恩。",
    walkthrough: [
      "穿過地下通道抵達黑暗森林，觸摸艾尼弗斯之樹擊敗樹頭木拳取得艾尼弗斯卷軸。",
      "回城找阿卡拉翻譯卷軸，按照卷軸上的 1-5 數字順序觸摸亂石曠野的巨石柱群。",
      "穿過中央藍色傳送門進入崔斯特姆，擊敗格里斯瓦德，點擊中央廣場的木籠救出凱恩。"
    ],
    tacticalTips: "【暗黑2最重要老友】凱恩被救出後，往後所有章節城鎮皆會常駐，點擊一次即可免費鑑定全身與背包所有暗金/黃金裝備，節省無數鑑定卷軸！在崔斯特姆別忘了翻找左上角維特的屍體取得「維特的腿」。"
  },
  {
    id: "act1_q4",
    act: 1,
    questNumber: 4,
    name: "遺忘之塔",
    nameEn: "The Forgotten Tower",
    givenBy: "閱讀亂石曠野古書",
    location: "黑色荒地 (Black Marsh)",
    isMandatory: false,
    summary: "探索黑色荒地廢墟古塔，深入地下五層地牢，擊殺沉淪女伯爵 (The Countess)。",
    walkthrough: [
      "在黑色荒地找到傾頹的石塔入口，進入塔樓地窖。",
      "沿地牢逐層向下探索至第 5 層。",
      "擊殺火免疫的女伯爵，開啟發光的寶箱取得符文與黃金財寶。"
    ],
    tacticalTips: "【符文之語之母】女伯爵死時擁有獨立的特殊符文掉落表！普通難度可出 1-8 號符文 (做隱密甲/天底頭)；惡夢難度出 1-18 號 (做精神劍盾/靈光長柄)；地獄難度最高出 28 號羅 (Lo) 符文石！"
  },
  {
    id: "act1_q5",
    act: 1,
    questNumber: 5,
    name: "工欲善其事",
    nameEn: "Tools of the Trade",
    givenBy: "恰西 (Charsi)",
    location: "兵營 (Barracks)",
    isMandatory: false,
    permanentReward: {
      type: "imbue",
      description: "恰西為你免費注入 (Imbue) 一件白色一般裝備，點化為極品罕見黃金裝備！",
      value: "恰西灌注魔力神裝機會"
    },
    summary: "前往兵營擊敗鐵匠 (The Smith)，奪回恰西失落的魔法鍛造錘「赫拉迪姆之鎚 (Horadric Malus)」。",
    walkthrough: [
      "穿過外側迴廊進入兵營。",
      "尋找鐵匠守護的鐵砧架，引開或消滅鐵匠後點擊取得魔法錘。",
      "回營地將錘子歸還恰西，解鎖灌注魔力功能。"
    ],
    tacticalTips: "【保留到高等級使用】注入的詞綴品質由角色等級 (clvl) 決定。建議留到 80 級以上，注入無形頭飾、次元頭飾或無形狂戰士斧，有機會做出極品 2孔/2技能/20高施神級黃頭。"
  },
  {
    id: "act1_q6",
    act: 1,
    questNumber: 6,
    name: "為姐妹們復仇",
    nameEn: "Sisters to the Slaughter",
    givenBy: "迪卡‧凱恩 (Deckard Cain)",
    location: "地下墓穴第四層 (Catacombs Level 4)",
    isMandatory: true,
    summary: "深入修道院最底層墓穴，迎戰怨慟女王「安達莉爾 (Andariel)」，掃除前往東方的阻礙。",
    walkthrough: [
      "穿過監牢 1-3 層進入內側迴廊，經大教堂深入地下墓穴。",
      "在地下墓穴第 4 層清理外圍沉淪魔，進入大殿決戰安達莉爾。",
      "安達莉爾死後大地燃燒，回營地與瓦瑞夫對話，啟程前往魯高因沙漠。"
    ],
    tacticalTips: "【怕火首領】安達莉爾火抗為負數 (-50%)，火法、火德或武器鑲嵌紅寶石能打出雙倍爆發！戰前喝下 4-5 瓶解毒藥水能大幅提升毒素抗性至 85%，防止被其劇毒秒殺。"
  },

  // ── ACT 2: 魯·高因 ──
  {
    id: "act2_q1",
    act: 2,
    questNumber: 1,
    name: "羅達門特的巢穴",
    nameEn: "Radament's Lair",
    givenBy: "亞特瑪 (Atma)",
    location: "魯高因下水道第三層 (Sewers Level 3)",
    isMandatory: false,
    permanentReward: {
      type: "skill_point",
      description: "擊殺羅達門特掉落「技能之書 (Book of Skill)」，閱讀後永久獲得 +1 技能點數！",
      value: "+1 技能點數"
    },
    summary: "替酒吧老闆娘亞特瑪復仇，深入城市下水道清除殘害其家人的不死木乃伊羅達門特。",
    walkthrough: [
      "從碼頭或城鎮右上角的格柵進入魯高因下水道。",
      "下至第 3 層找到羅達門特，注意其會不斷復活周圍骷髏。",
      "擊殺羅達門特，拾取地上掉落的技能之書右鍵閱讀，並開啟旁邊的寶箱取得赫拉迪姆卷軸。"
    ],
    tacticalTips: "【三難度共送 3 點技能點】早期拓荒必解，三難度累計直接多點滿 3 點核心技能！"
  },
  {
    id: "act2_q2",
    act: 2,
    questNumber: 2,
    name: "赫拉迪姆之杖",
    nameEn: "The Horadric Staff",
    givenBy: "迪卡‧凱恩",
    location: "乾土高地、遙遠的綠洲、利爪蛇魔神殿",
    isMandatory: true,
    permanentReward: {
      type: "attribute_point",
      description: "永久獲得暗黑破壞神2核心神器「赫拉迪姆方塊 (Horadric Cube)」！",
      value: "獲得赫拉迪姆方塊"
    },
    summary: "收集赫拉迪姆方塊、國王之杖與蝮蛇護符，在方塊中合成完整的赫拉迪姆之杖以開啟塔拉夏的古墓。",
    walkthrough: [
      "死亡之殿第 3 層擊敗瘋狂血腥女巫，開啟寶箱取得「赫拉迪姆方塊」。",
      "蛆蟲巢穴第 3 層鑽入狹窄通道擊敗冰蟲鑽地者，取得「國王之杖 (Staff of Kings)」。",
      "群蛇峽谷利爪蛇魔神殿第 2 層擊碎祭壇，取得「蝮蛇護符 (Amulet of the Viper)」。",
      "將法杖與護符放進赫拉迪姆方塊中點擊轉化，合成完整的赫拉迪姆之杖。"
    ],
    tacticalTips: "【方塊是隨身萬能寶庫】赫拉迪姆方塊佔據 2x2 格子，內部提供 4x3 共 12 格空間，相當於白嫖 8 格隨身背包！更可用於升級符文、重洗特大咒符、打孔裝備與修理耐久。"
  },
  {
    id: "act2_q3",
    act: 2,
    questNumber: 3,
    name: "蔽日黑暗",
    nameEn: "Tainted Sun",
    givenBy: "卓格南 (Drognan)",
    location: "利爪蛇魔神殿 (Claw Viper Temple)",
    isMandatory: true,
    summary: "魯高因天空陷入永恆黑暗，前往利爪蛇魔神殿摧毀黑暗祭壇恢復太陽的光芒。",
    walkthrough: [
      "進入利爪蛇魔神殿，謹防蝮蛇的急速衝鋒擊退。",
      "在神廟第 2 層中央踢開太陽祭壇，光芒重現人間，同時拾取任務護符。"
    ],
    tacticalTips: "蝮蛇擁有極高物理衝鋒爆發與毒素，傭兵容易暴斃；法系可隔著祭壇台階遠程擊殺。"
  },
  {
    id: "act2_q4",
    act: 2,
    questNumber: 4,
    name: "秘法聖殿",
    nameEn: "The Arcane Sanctuary",
    givenBy: "卓格南 (Drognan)",
    location: "秘法聖殿 (Arcane Sanctuary)",
    isMandatory: true,
    summary: "穿過傑恩宮殿地下室的時空裂縫，進入法師赫拉森建造的星空虛空避難所尋找召喚師。",
    walkthrough: [
      "進入皇宮地窖第 3 層中央的傳送門踏入秘法聖殿。",
      "避難所有東南西北四個方向分支，沿其中一條尋找召喚師 (The Summoner)。",
      "擊殺召喚師，閱讀赫拉森的日記開啟通往賢者之谷的紅色傳送門。"
    ],
    tacticalTips: "【鑰匙掉落首領】地獄難度的召喚師是開啟紅門六王必備的「恐懼之鑰 (Key of Terror)」唯一產地！此外避難所四個盡頭共有多個發光寶箱，產出高階符文機率極佳。"
  },
  {
    id: "act2_q5",
    act: 2,
    questNumber: 5,
    name: "召喚師與真古墓",
    nameEn: "The Summoner & True Tomb",
    givenBy: "自動觸發",
    location: "賢者之谷 (Canyon of the Magi)",
    isMandatory: true,
    summary: "在賢者之谷比對任務日誌中缺失的古墓符號，找出真正埋葬塔拉夏的古墓。",
    walkthrough: [
      "按 Q 打開任務日誌，查看七大古墓中唯一正確的標誌。",
      "在峽谷兩側尋找入口門楣刻有對應符號的古墓進入。"
    ],
    tacticalTips: "賢者之谷門口 7 個墓穴，只有任務標記符號的才是真正的古墓；其餘 6 個假古墓在惡夢/地獄也是經驗豐厚的打寶聖地。"
  },
  {
    id: "act2_q6",
    act: 2,
    questNumber: 6,
    name: "七座古墓",
    nameEn: "The Seven Tombs",
    givenBy: "傑恩 (Jerhyn)",
    location: "真塔拉夏的古墓 (Tomb of Tal Rasha)",
    isMandatory: true,
    summary: "將赫拉迪姆之杖插入古墓孔洞破開密室封印，消滅痛苦之王「都瑞爾 (Duriel)」。",
    walkthrough: [
      "在真古墓深處找到發光的插座石台，將赫拉迪姆之杖放入觸發雷擊破牆。",
      "點擊進入隱藏密室，迎戰自帶神聖冰凍靈氣的巨蟲都瑞爾。",
      "擊敗都瑞爾，穿過後方走廊與泰瑞爾對話，乘船前往庫拉斯特港口。"
    ],
    tacticalTips: "【新人殺手大蟲子】都瑞爾進門即貼臉秒殺！拓荒打法：進門前喝下 4-5 瓶融雪藥水提升冰抗至 85%，進門立即丟傳送門備用；法師用靜電力場瞬間削掉一半血，近戰靠粉碎打擊速殺。"
  },

  // ── ACT 3: 庫拉斯特海港 ──
  {
    id: "act3_q1",
    act: 3,
    questNumber: 1,
    name: "黃金鳥",
    nameEn: "The Golden Bird",
    givenBy: "擊殺庫拉斯特叢林任意金怪掉落",
    location: "蜘蛛森林至大沼澤",
    isMandatory: false,
    permanentReward: {
      type: "life",
      description: "艾柯調配黃金鳥骨灰藥劑，飲用後永久增加角色 +20 最大生命值！",
      value: "永久 +20 最大生命值"
    },
    summary: "找回庫・謝勒的骨灰雕像黃金鳥，換取庫拉斯特長生不老的秘藥。",
    walkthrough: [
      "出城擊殺叢林碰到的第一隻獨特金怪，拾取掉落的「翠玉塑像」。",
      "交給碼頭網狀商人馬席夫，取得黃金鳥雕像。",
      "轉交給艾柯與奧瑪斯，領取生命藥水，右鍵喝下永久 +20 血量。"
    ],
    tacticalTips: "【三難度累計 +60 點永久血量】相當於白嫖 20-30 點體力屬性點！是每個拓荒角色必做的血量加成任務。"
  },
  {
    id: "act3_q2",
    act: 3,
    questNumber: 2,
    name: "古代宗教之刃",
    nameEn: "Blade of the Gidbinn",
    givenBy: "奧瑪斯 (Ormus)",
    location: "剝皮叢林 (Flayer Jungle)",
    isMandatory: false,
    summary: "點燃剝皮叢林深處的吉德賓祭壇，擊殺守衛小王奪回古代魔法匕首。",
    walkthrough: [
      "在剝皮叢林找到吉德賓小石塔點擊引發烈火。",
      "擊殺周圍刷新的狂暴剝皮魔金怪，拾取吉德賓匕首。",
      "回城找奧瑪斯，奧瑪斯贈予一枚隨機稀有黃金戒指作為謝禮。"
    ],
    tacticalTips: "完成後與艾席拉對話，會免費獲贈一名鐵狼法師傭兵。"
  },
  {
    id: "act3_q3",
    act: 3,
    questNumber: 3,
    name: "藍伊森之書",
    nameEn: "Lam Esen's Tome",
    givenBy: "艾柯 (Alkor)",
    location: "庫拉斯特市集 - 荒廢的神殿 (Ruined Temple)",
    isMandatory: false,
    permanentReward: {
      type: "attribute_point",
      description: "研讀藍伊森黑書，獲得長老秘傳，永久獎勵 +5 點自由分配屬性點！",
      value: "+5 點自由屬性點"
    },
    summary: "前往庫拉斯特市集尋找荒廢的神殿，奪回記載撒卡蘭姆古老禁忌的藍伊森之書。",
    walkthrough: [
      "抵達庫拉斯特市集，尋找「荒廢的神殿」入口進入 (注意並非殘破神殿)。",
      "警惕門口埋伏的狂戰女戰士「戰場女傑莎莉娜」，消滅怪物後在講台上取得黑書。",
      "回海港交給艾柯，領取 5 點屬性點獎勵。"
    ],
    tacticalTips: "【三難度白嫖 +15 點自由屬性點】普通、惡夢、地獄三難度各送 5 點，共計 15 點力量/敏捷/體力自由調配！注意進神廟門口極易被怪物圍毆猝死，進門需第一時間施展控場技能。"
  },
  {
    id: "act3_q4",
    act: 3,
    questNumber: 4,
    name: "克林姆的遺願",
    nameEn: "Khalim's Will",
    givenBy: "迪卡‧凱恩",
    location: "蜘蛛洞窟、剝皮地牢、庫拉斯特下水道",
    isMandatory: true,
    summary: "找回未被腐化的克林姆眼球、心臟、大腦與連枷，在方塊中合成克林姆的遺願以破除黑廟封印。",
    walkthrough: [
      "蜘蛛洞窟擊殺灼熱的斯札克，寶箱取得「克林姆的眼球」。",
      "剝皮地牢第 3 層擊殺巫醫印都古，寶箱取得「克林姆的大腦」。",
      "庫拉斯特下水道第 2 層開箱取得「克林姆的心臟」。",
      "崔凡克擊殺議會議員取得「克林姆的連枷」。",
      "在赫拉迪姆方塊中將四件遺物合成「克林姆的遺願」神聖連枷。"
    ],
    tacticalTips: "在蜘蛛森林注意是進「蜘蛛洞窟 (Spider Cavern)」，不要走錯進旁邊傳送點的「蜘蛛巢穴 (Arachnid Lair)」；組隊時只要一人持有合成連枷敲碎強制魔珠即可全隊過關。"
  },
  {
    id: "act3_q5",
    act: 3,
    questNumber: 5,
    name: "晦影神殿",
    nameEn: "The Black Temple",
    givenBy: "奧瑪斯",
    location: "崔凡克 (Travincal)",
    isMandatory: true,
    summary: "突襲撒卡蘭姆聖城崔凡克，剿滅被墨菲斯托腐化的最高評議會議員，敲碎強制魔珠。",
    walkthrough: [
      "進入崔凡克神殿廣場，引怪逐個擊殺跛足議員首領 (冰拳托克、火焰指吉列布等)。",
      "裝備「克林姆的遺願」連枷，右鍵重擊廣場中央的強制魔珠將其砸碎。",
      "強制魔珠碎裂，通往憎恨囚牢的地下樓梯轟然打開。"
    ],
    tacticalTips: "【全遊戲頂級打錢與符文聖地】崔凡克瘸子議員血量適中、掉落極其慷慨！打錢野蠻人 (GF Barb) 旋風斬翻屍體 1 分鐘一場，是全天梯產出喬 (Jah)、伯特 (Ber) 符文石最多的黃金寶地！"
  },
  {
    id: "act3_q6",
    act: 3,
    questNumber: 6,
    name: "守護者",
    nameEn: "The Guardian",
    givenBy: "奧瑪斯",
    location: "憎恨囚牢第三層 (Durance of Hate Level 3)",
    isMandatory: true,
    summary: "深入地獄般血腥的憎恨囚牢，擊敗三大魔神之一「憎恨之王·墨菲斯托 (Mephisto)」。",
    walkthrough: [
      "穿過憎恨囚牢第 1、2 層進入第 3 層。",
      "清理血池兩側的議會守護者，進入大殿決戰墨菲斯托。",
      "擊殺墨菲斯托，拾取靈魂石，走上血紅骨橋踏入地獄傳送門。"
    ],
    tacticalTips: "【全法系拓荒打寶專屬 ATM】老墨隔著血池河道無法近身，法師可以利用「卡河道打法」：站在紅門血池對岸，用暴風雪、冰封球或隕石術白嫖無傷擊殺，安全高效刷出軍帽、眼球、蛇皮與海鷗！"
  },

  // ── ACT 4: 群魔堡壘 ──
  {
    id: "act4_q1",
    act: 4,
    questNumber: 1,
    name: "墮落的天使",
    nameEn: "The Fallen Angel",
    givenBy: "泰瑞爾 (Tyrael)",
    location: "絕望平原 (Plains of Despair)",
    isMandatory: false,
    permanentReward: {
      type: "skill_point",
      description: "解放大天使伊卒爾靈魂，泰瑞爾獎勵超大紅包：永久贈予 +2 點技能點數！",
      value: "永久 +2 技能點數 (超神獎勵)"
    },
    summary: "在絕望平原尋找背叛天堂的大天使伊卒爾 (Izual)，擊碎其惡魔皮囊解放其靈魂。",
    walkthrough: [
      "出堡壘穿過外平原進入絕望平原。",
      "搜尋手持巨劍的冰冷惡魔伊卒爾，將其擊倒。",
      "等待伊卒爾靈魂懺悔對話結束，回城向泰瑞爾回報領取 2 點技能點。"
    ],
    tacticalTips: "【單一任務獎勵最高】普通、惡夢、地獄三難度各送 2 點技能點，合計直接白嫖 +6 點技能點數！任何角色絕對不能錯過的超級福利。"
  },
  {
    id: "act4_q2",
    act: 4,
    questNumber: 2,
    name: "地獄熔爐",
    nameEn: "The Hellforge",
    givenBy: "凱恩",
    location: "火焰之河 (River of Flame)",
    isMandatory: false,
    summary: "帶著墨菲斯托的靈魂石前往火焰之河，擊敗護甲鍛造師海法斯特，在地獄鐵砧上敲碎靈魂石！",
    walkthrough: [
      "穿過罪罰之城下至火焰之河，尋找地獄熔爐鐵砧位置。",
      "消滅守護者「護甲鍛造師海法斯特 (Hephasto)」，拾取其掉落的地獄熔爐之鎚。",
      "將墨菲斯托的靈魂石放在鐵砧上，手持鐵錘連敲三次砸碎靈魂石，引發符文大爆發！"
    ],
    tacticalTips: "【敲石頭天降橫財】砸碎靈魂石固定掉落 4 顆完美寶石與 1 枚高階符文！地獄難度最高可掉落 25 號古爾 (Gul) 符文石（合成 26 號伐克斯 Vex 做橡樹之心 HOTO 的關鍵），是窮人翻身第一桶金！"
  },
  {
    id: "act4_q3",
    act: 4,
    questNumber: 3,
    name: "恐懼的終結",
    nameEn: "Terror's End",
    givenBy: "泰瑞爾",
    location: "混沌魔殿 (Chaos Sanctuary / CS)",
    isMandatory: true,
    summary: "突入五角星形混沌魔殿，解開東南西五道惡魔封印，斬殺「恐懼之王·迪亞布羅 (Diablo)」。",
    walkthrough: [
      "進入混沌魔殿，清除五角星五個頂角的怪物。",
      "依次解開 5 道封印，擊殺刷新的三波金怪首領 (迪塞斯勳爵、靈魂傳播者、混沌首相)。",
      "天地震動紅光湧現，在混沌魔殿五角星中央迎戰現身的迪亞布羅！"
    ],
    tacticalTips: "【CS 是全暗黑最熱門 85 場景】大菠蘿的紅色閃電火風暴威力毀滅，近戰需貼臉（近身紅電判定盲區），法系需拉開距離防秒；迪塞斯勳爵具備詛咒與狂熱光環，需謹防猝死。"
  },

  // ── ACT 5: 哈洛加斯 ──
  {
    id: "act5_q1",
    act: 5,
    questNumber: 1,
    name: "哈洛加斯圍城戰",
    nameEn: "Siege on Harrogath",
    givenBy: "拉蘇克 (Larzuk)",
    location: "血腥丘陵 (Bloody Foothills)",
    isMandatory: false,
    permanentReward: {
      type: "socket",
      description: "拉蘇克為你指定的任意一件裝備「必定打出最大孔數 (100% 成功)」！",
      value: "拉蘇克必出滿孔機會"
    },
    summary: "登上血腥丘陵頂部，消滅指揮投石車轟炸哈洛加斯的惡魔「督軍山克 (Shenk the Overseer)」。",
    walkthrough: [
      "走出哈洛加斯大門進入血腥丘陵，沿山路一路殺到最上方階梯處。",
      "擊殺被群怪簇擁的督軍山克，周圍投石車發動自毀殉爆。",
      "回城找鐵匠拉蘇克解鎖珍貴的「打孔 (Socket)」獎勵。"
    ],
    tacticalTips: "【全遊戲最寶貴打孔門票】白色無孔裝備直接打出根據物品等級決定的「最大孔數」！(如君主盾必出 4 孔、法師鎧甲必出 3 孔、巨神之斧必出 4 孔)。暗金裝備固定打出 1 孔 (鑲嵌 24 號查姆防冰凍或暗金彩虹刻面珠寶)！三難度共 3 次機會，務必謹慎留給畢業神裝。"
  },
  {
    id: "act5_q2",
    act: 5,
    questNumber: 2,
    name: "亞瑞特山的救援行動",
    nameEn: "Rescue on Mount Arreat",
    givenBy: "夸爾凱克 (Qual-Kehk)",
    location: "冰凍高地 (Frigid Highlands)",
    isMandatory: false,
    summary: "在冰凍高地雪原尋找木製牢籠，解救被惡魔俘虜的 15 名野蠻人士兵。",
    walkthrough: [
      "在冰凍高地搜尋 3 處由木柵欄圍成的白色戰俘營地。",
      "打碎營地木門，野蠻人戰士踏入城鎮傳送門獲救 (每處 5 人，共 15 人)。",
      "回哈洛加斯找夸爾凱克領取 3 枚符文：7號 (塔爾)、8號 (拉爾)、9號 (歐特)，並解鎖雇傭 Act 5 野蠻人傭兵。"
    ],
    tacticalTips: "【送先祖誓言符文套裝】獎勵的 3 枚符文恰好可以插在 3 孔白色盾牌上，直接做成提供 +48% 超高全元素抗性的「先祖之契 (Ancient's Pledge)」盾牌，惡夢難度抗性瞬間拉滿！"
  },
  {
    id: "act5_q3",
    act: 5,
    questNumber: 3,
    name: "冰凍囚牢",
    nameEn: "Prison of Ice",
    givenBy: "瑪拉 (Malah)",
    location: "冰凍之河 (Frozen River)",
    isMandatory: false,
    permanentReward: {
      type: "resistance",
      description: "瑪拉贈予神聖的「抗性卷軸 (Scroll of Resistance)」，閱讀後永久提升 +10 全四系元素抗性！",
      value: "永久 +10 全抗性 (三難度共 +30 全抗)"
    },
    summary: "深入極度酷寒的冰凍之河迷宮，打破冰壁解救被尼拉塞克囚禁的煉金術士安亞 (Anya)。",
    walkthrough: [
      "從水晶通道進入冰凍之河地下冰窟。",
      "擊殺守護冰窟的雪怪首領「冰霜爬行者」，在冰封水池中找到被凍住的安亞對話。",
      "回城找瑪拉取得解凍藥劑，再次進入冰凍之河澆注在冰塊上救出安亞。",
      "回城領取抗性卷軸右鍵閱讀，安亞在城鎮開設紅門並開放賭博與裝備交易。"
    ],
    tacticalTips: "【全抗性保命天花板】普通、惡夢、地獄三難度各送一張 +10 全抗卷軸，三難度全解直接永久白嫖 +30% 全火/冰/電/毒抗性！地獄難度 -100 抗性懲罰直接被抵消將近三分之一！"
  },
  {
    id: "act5_q4",
    act: 5,
    questNumber: 4,
    name: "哈洛加斯的叛徒",
    nameEn: "Betrayal of Harrogath",
    givenBy: "安亞 (Anya)",
    location: "沃特之廳 (Halls of Vaught)",
    isMandatory: false,
    summary: "穿過安亞開啟的紅門深入怨慟之廳與沃特之廳，誅殺背叛野蠻人一族的墮落長老尼拉塞克。",
    walkthrough: [
      "穿過安亞身邊的紅色傳送門進入尼拉塞克神殿。",
      "下至沃特之廳第 3 層，四個方向之一找到尼拉塞克。",
      "擊殺尼拉塞克，安亞為你的武器免費銘刻角色大名。"
    ],
    tacticalTips: "【毀滅之鑰唯一掉落者】地獄難度尼拉塞克是紅門六王所需的「毀滅之鑰 (Key of Destruction)」唯一來源！尼拉塞克自帶極高傷害的「屍爆 (CE)」，打法核心是裝備「安息 (Rest in Peace)」詞綴裝備 (如自然祥和戒指)，使怪物死後不得超生無法被引爆！"
  },
  {
    id: "act5_q5",
    act: 5,
    questNumber: 5,
    name: "祭儀試煉 (野蠻人三古代人)",
    nameEn: "Rite of Passage",
    givenBy: "夸爾凱克",
    location: "亞瑞特山巔 (Arreat Summit)",
    isMandatory: true,
    permanentReward: {
      type: "attribute_point",
      description: "戰勝三古代人獲得先祖認可，一次性獎勵巨額海量經驗值 (普通直接升 1 級，惡夢/地獄數百萬經驗)！",
      value: "直接升級海量經驗"
    },
    summary: "登上亞瑞特聖山之巔，點擊先祖祭壇迎戰三位守護聖山千年的英靈：塔力克、馬道克與科力克。",
    walkthrough: [
      "穿過先祖之路登上亞瑞特山巔。",
      "點擊中央金色天界祭壇，三座石雕化為金色戰士發動攻擊。",
      "中途不得開回城傳送門 (開門戰鬥立即重置石化)！將三位古代人全部擊敗。",
      "世界之石要塞沉重石門開啟，角色獲得海量經驗升級。"
    ],
    tacticalTips: "【禁止開傳送門】一旦開門三先祖瞬間滿血重新石化！戰前可在地面丟滿整地的高級紅藍藥水；如果地獄難度三先祖隨機刷出狂暴詞綴 (如火狂暴自爆、法力燃燒、物免雙免)，可以用回城卷軸直接刷掉重新開打！"
  },
  {
    id: "act5_q6",
    act: 5,
    questNumber: 6,
    name: "毀滅的前夕",
    nameEn: "Eve of Destruction",
    givenBy: "夸爾凱克",
    location: "世界之石大殿 (Worldstone Chamber)",
    isMandatory: true,
    summary: "突入世界之石要塞最底層毀滅王座，清除巴爾召喚的五波狂暴軍團，斬殺最終魔王「毀滅之王·巴爾 (Baal)」。",
    walkthrough: [
      "穿過世界之石要塞 1-3 層進入毀滅王座。",
      "清理王座怪物，站在巴爾狂笑面前逐一迎擊五波大軍 (沉淪魔、木乃伊、議會、翼手龍恐懼魔、毀滅僕從恐龍隊)。",
      "跟隨巴爾踏入世界之石大殿，決戰巨型觸手魔神巴爾。",
      "擊殺巴爾，大天使泰瑞爾投擲神聖符文之劍炸毀被污染的世界之石，通關獲封天梯頭銜！"
    ],
    tacticalTips: "【暗黑破壞神2終局之戰】巴爾第 5 波恐龍隊 (Lister the Tormentor) 自帶擊退與極速狂熱，死靈可用骨牢，法師可將其引出王座房間直接開啟巴爾大門！巴爾分身時看血條名字字母偏移即可分辨真身。"
  }
];

export const WORLD_EVENTS_DATA: WorldEventData[] = [
  {
    id: "diablo_clone",
    name: "地表大菠蘿 (超級迪亞布羅)",
    nameEn: "Diablo Clone (DClone)",
    triggerCondition: "伺服器累積賣給商店喬丹之石 (Stone of Jordan / SOJ) 達到階段 6「迪亞布羅現身地表！」",
    location: "地獄難度大地圖上遭遇的第一隻固定暗金怪 (推薦亂石曠野拉卡尼休、鮮血荒地邪惡洞窟門口屍體發火、暴躁外皮)",
    keyRewards: ["滅絕護身符 (Annihilus / 毀符)：+1 全技能 / +10~20 全屬性 / +10~20 全抗性 / +5%~10% 額外經驗值！"],
    guide: "自帶超高血量回血與高額減傷，推薦使用裝備「防止怪物自療 (Prevent Monster Heal)」的近戰或投擲武器打一下，徹底封鎖其生命自然恢復，隨後使用聖騎士盾牌重擊 (Smite) 配合粉碎打擊 (CB) 與偷取生命 (Life Tap) 穩妥斬殺。"
  },
  {
    id: "uber_tristram",
    name: "超級崔斯特姆紅門六王",
    nameEn: "Pandemonium Event (Uber Bosses)",
    triggerCondition: "在地獄哈洛加斯使用方塊合成 3 組【恐懼之鑰 + 憎恨之鑰 + 毀滅之鑰】(共9把鑰匙) 開啟三個小紅門，擊殺女體安達莉爾、超級都瑞爾、超級伊卒爾取得三個器官，再次合成開啟終極紅門！",
    location: "超級崔斯特姆 (Uber Tristram)",
    keyRewards: [
      "地獄火炬 (Hellfire Torch / 大型咒符)：+3 隨機職業技能 / +10~20 全屬性 / +10~20 全抗性 / 25% 擊中釋放火焰風暴！",
      "英雄旗幟 (Standard of Heroes)：擊殺六王的終極榮耀象徵。"
    ],
    guide: "超級崔斯特姆同時盤踞三大魔神：20 級信念靈氣 (-125 全抗) 的超級墨菲斯托、冰凍召喚狂暴大軍的超級巴爾、以及火風暴秒人的超級迪亞布羅！戰術鐵律是貼左側廢墟下緣小心引出墨菲斯托單獨擊殺，聖騎士開聖護靈氣或疊 300 點雷抗，盾牌重擊必中配德古拉之握吸血永動。"
  },
  {
    id: "secret_cow_level",
    name: "秘密乳牛關 (乳牛關)",
    nameEn: "The Secret Cow Level (Cow Level)",
    triggerCondition: "通關該難度後，前往亂石曠野崔斯特姆左上角翻找維特的屍體取得「維特的腿」，回俠盜營地放入方塊中與「城鎮傳送之書」一同合成，開啟鮮紅傳送門！",
    location: "秘密乳牛關",
    keyRewards: [
      "全遊戲極品白色與無形符文之語底材 (幻化之刃、執政官鎧甲、統盾、無形銳利斧)",
      "海量高階符文 (Zod, Cham, Jah, Ber)",
      "極品咒符與寶石"
    ],
    guide: "母牛怪物密集度為全遊戲第一！D2R 重生版移除了「殺死牛王無法再開門」的古老限制，現在可隨心所欲將牛王 (Cow King) 斬殺！標馬閃電烈怒 (LF)、死靈屍爆 (CE)、冰火法師刷牛關爽快度破表。"
  },
  {
    id: "terror_zones",
    name: "邪惡威脅區域 (TZ)",
    nameEn: "Terror Zones",
    triggerCondition: "擊敗該難度毀滅之王巴爾後永久解鎖，每整點由伺服器自動隨機輪換一個特定場景被恐懼力量腐化！",
    location: "每小時動態變換 (如恐懼混沌魔殿、恐懼牛關、恐懼塔拉夏的古墓、恐懼古代通道)",
    keyRewards: [
      "六大破免咒符 (破冰/破電/破火/破毒/破物/破魔板，直接將怪物免疫抗性上限強制壓制為 95%)！",
      "怪物等級提升至角色等級 +2 (最高達 99 級)，所有怪物皆可掉落全遊戲任意頂級裝備 (泰瑞爾之力、獅鷲之眼、風之力)。"
    ],
    guide: "D2R 2.5 改版引入的最強農裝機制！90 級以上玩家升級至 99 級滿等的最高效率捷徑，也是刷取破免板打破地獄免疫機制的唯一聖地。"
  }
];
