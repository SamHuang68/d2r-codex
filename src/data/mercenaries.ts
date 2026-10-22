export interface MercenaryBuild {
  name: string;
  role: string;
  weapon: string;
  helm: string;
  armor: string;
  description: string;
  strengths: string[];
}

export interface MercenaryData {
  id: string;
  act: number;
  name: string;
  nameEn: string;
  type: string;
  nativeAurasOrSkills: string[];
  equipmentTypes: string[];
  patch24Updates: string;
  description: string;
  builds: MercenaryBuild[];
}

export const MERCENARIES_DATA: MercenaryData[] = [
  {
    id: "act2_desert",
    act: 2,
    name: "第二章：沙漠傭兵 (米山)",
    nameEn: "Act II Desert Mercenary",
    type: "近戰長柄刺客 / 靈氣光環核心",
    nativeAurasOrSkills: [
      "【普通難度】：只有祈禱 (Prayer - 全隊回血)、反抗 (Defiance - 巨幅加防)、精準祝福 (Blessed Aim - 大幅加AR) 三種",
      "【惡夢與地獄難度】：上面三種之外，再加力量 (Might - 提升物理傷害)、神聖冰凍 (Holy Freeze - 控場減速全場)、荊棘 (Thorns - 傷害反彈)，共六種"
    ],
    equipmentTypes: ["長柄武器 (Polearms)", "長矛 (Spears，2.4起支援)", "頭盔 (Helms)", "胸甲 (Body Armor)"],
    patch24Updates: "2.4 起正式支援裝備長矛 (Spears)，並優化各靈氣隨等級成長數值。",
    description: "全遊戲最主流、泛用度最高的傭兵！自帶原生聖騎士靈氣，搭配靈光、無限、死神喪鐘等神裝，能為角色提供近乎無限的回魔、破免與肉盾屏障。",
    builds: [
      {
        name: "「治癒三靈氣」不死神醫流 (Patch 2.6 BIS)",
        role: "極致自愈、免疫劇毒、秒解詛咒",
        weapon: "符文之語【靈光】(Insight 冥想靈氣)",
        helm: "符文之語【治癒】(Cure 淨化靈氣)",
        armor: "符文之語【剛毅】(Fortitude) 或【背信】(Treachery)",
        description: "選用普通難度「祈禱 (Prayer)」傭兵，配合治癒頭的「淨化 (Cleansing)」與靈光的「冥想 (Meditation)」，觸發聖騎士三靈氣協同效應！祈禱回血效果直接乘以三倍，每秒回血高達 100+ 點，並使受到的劇毒與詛咒持續時間縮短 80% 以上！",
        strengths: ["三倍協同高速回血", "瞬間清除劇毒與詛咒", "造價極度親民平民首選"]
      },
      {
        name: "「無限神罰」元素降抗流 (法系終極畢業)",
        role: "破除怪物閃電/火/冰免疫，法系輸出翻倍",
        weapon: "符文之語【無限】(Infinity 12級信念靈氣)",
        helm: "暗金【安達莉爾的面貌】(鑲 15% IAS / 30% 火抗珠寶)",
        armor: "無形符文之語【剛毅】(Fortitude 統御者鎧甲/神聖戰甲)",
        description: "自帶 12 級信念靈氣 (Conviction)，直接降低周圍敵人 85% 元素抗性！讓標馬、電法、火法與陷阱刺客的傷害成倍暴增，米山配合安頭剛毅單挑傷害亦極為恐怖。",
        strengths: ["破除絕大部分電免/火免怪", "粉碎打擊 40% 快速削血", "攻防一體終極畢業"]
      },
      {
        name: "「衰老碎骨」物理破免控場流 (物理系最佳拍檔)",
        role: "破除怪物物理免疫，50% 物理增傷與大幅減速",
        weapon: "無形暗金【死神喪鐘】(The Reaper's Toll 鑲 13# 夏)",
        helm: "綠色套裝【吉永之臉】(Guillaume's Face 35% CB)",
        armor: "符文之語【背信】(Treachery 45% IAS + 15級影散)",
        description: "專門配合旋風野蠻人、弓馬與狂熱聖騎士。死神喪鐘打擊時有 33% 機率施展等級 3 衰老 (Decrepify)，破除怪物物理免疫並降低敵人 50% 速度與輸出，吉永之臉補足 35% 粉碎打擊。",
        strengths: ["100% 穩定破除物理免疫", "衰老減速極限保命", "擊殺 Boss 速度極快"]
      }
    ]
  },
  {
    id: "act5_barbarian",
    act: 5,
    name: "第五章：野蠻人戰士 (夸爾凱克)",
    nameEn: "Act V Barbarian Warrior",
    type: "雙持狂亂狂戰士 (2.4 重生) / 單手重劍戰士",
    nativeAurasOrSkills: [
      "雙持狂亂型 (2.4 全新)：狂亂連擊 (Frenzy)、嘲諷 (Taunt)、鋼鐵之膚 (Iron Skin)",
      "雙手重劍型：猛擊 (Bash)、擊昏 (Stun)、戰鬥怒吼 (Battle Cry 破敵防禦減敵傷害)"
    ],
    equipmentTypes: ["單手單持劍 / 雙手巨劍", "野蠻人專用頭盔 (Barbarian Helms)", "胸甲 (Body Armor)"],
    patch24Updates: "2.4 版本重大重構！新增可雙持兩把單手劍的「狂亂連擊 (Frenzy)」野蠻人，攻速與移速無上限狂飆，並可裝備野蠻人專用頭盔享受技能加成。",
    description: "2.4 改版後的戰神傭兵！雙持狂亂戰士一旦疊滿攻速，出刀如狂風暴雨，能裝備兩把武器符文之語（如執法者 + 悔恨），甚至能單穿沙薩比全套硬剛巴爾五小隊。",
    builds: [
      {
        name: "「雙持執法者」極致衰老驅魔流",
        role: "推開不死怪物、高頻觸發衰老、全場無物免",
        weapon: "主手【執法者】(Lawbringer 幻化) + 副手【悔恨】(Grief) 或【瘟疫】(Plague)",
        helm: "暗金【亞瑞特的面容】(Arreat's Face 野蠻人神頭)",
        armor: "符文之語【剛毅】(Fortitude) 或【背信】(Treachery)",
        description: "雙持雙倍出手判定，使衰老 (Decrepify) 幾乎每秒觸發！同時裝備執法者賦予的庇護靈氣 (Sanctuary) 會強制擊退所有不死生物並直接無視其物理抗性，在混沌魔殿與古墓如入無人之境。",
        strengths: ["極高頻率衰老覆蓋", "庇護靈氣推開危險怪", "狂亂連擊衝鋒追怪速度極快"]
      },
      {
        name: "「沙薩比不死軍團」全套硬抗流 (超高性價比)",
        role: "高達 4000+ 生命、抗性破百、極限吸血減傷",
        weapon: "綠裝【沙薩比的救贖鈷劍】(Sazabi's Redeemer 幻化)",
        helm: "綠裝【沙薩比的精神護罩】(Sazabi's Mental Sheath)",
        armor: "綠裝【沙薩比的解靈框體】(Sazabi's Ghost Liberator)",
        description: "利用沙薩比套裝在 2.4 的大幅強化，湊滿全套提供 16% 吸血、16% 物理減傷、+27% 生命上限與超高惡魔增傷，造價僅需幾顆雜碎寶石，卻是紅門與高難度邪惡威脅區域生存率最高的配置！",
        strengths: ["全套造價極為低廉", "生存硬度超越剛毅安頭", "完全不吃裝備孔數懲罰"]
      }
    ]
  },
  {
    id: "act1_rogue",
    act: 1,
    name: "第一章：俠盜斥候 (卡夏)",
    nameEn: "Act I Rogue Scout",
    type: "遠程物理與元素弓箭手",
    nativeAurasOrSkills: [
      "冰凍箭型 (Cold Arrow & Freezing Arrow)",
      "火焰箭型 (Fire Arrow & Exploding Arrow)"
    ],
    equipmentTypes: ["弓 (Bows)", "亞馬遜專用弓 (2.4起支援裝備)", "頭盔 (Helms)", "胸甲 (Body Armor)"],
    patch24Updates: "2.4 起可裝備亞馬遜專用弓 (Amazon Bows)，獲得 +3 弓系技能底材加成，並大幅強化了連射與爆裂箭的傷害倍率。",
    description: "遠程狙擊手，戰鬥時會聰明保持安全距離不輕易暴斃。裝備『信心』賦予狂熱靈氣，是弓馬、物理刺客與近戰野蠻人追求極致檔位突破的靈魂夥伴。",
    builds: [
      {
        name: "「狂熱之風」檔位極限突破流",
        role: "賦予全隊高等級狂熱靈氣，近戰遠程攻速飛躍",
        weapon: "符文之語【信心】(Faith 女傑之弓/主母之弓，12-15級狂熱靈氣)",
        helm: "暗金【安達莉爾的面貌】或【巨大顱骨】(擊退 + 壓碎)",
        armor: "符文之語【剛毅】(Fortitude)",
        description: "信心自帶 12-15 級狂熱靈氣 (Fanaticism)，大幅增加全隊攻速、攻擊準確率與傷害，讓物理弓馬或近戰狂戰士輕鬆突破原本無法企及的最高攻速幀數檔位。",
        strengths: ["突破攻速檔位天花板", "自帶復活怪物為骷髏肉盾", "遠程走位極其安全"]
      },
      {
        name: "「專注迷霧」平民物理光環流 (Patch 2.4)",
        role: "賦予高等級專注靈氣，100% 穿透箭雨",
        weapon: "符文之語【迷霧】(Mist 亞馬遜專用弓 8-12級專注靈氣)",
        helm: "暗金【吸血鬼的凝視】或【治癒】",
        armor: "符文之語【背信】或【剛毅】",
        description: "2.4 新符文之語迷霧賦予等級 8-12 專注靈氣 (Concentration) 提升全隊物理傷害，自帶 100% 穿透攻擊與全抗 +40，是造價低於信心的優質選擇。",
        strengths: ["100% 穿透群傷", "自帶 40 全抗不易暴斃", "專注靈氣穩定增傷"]
      }
    ]
  },
  {
    id: "act3_ironwolf",
    act: 3,
    name: "第三章：鐵狼衛士 (艾席拉)",
    nameEn: "Act III Iron Wolf",
    type: "元素法術砲台 / 輔助增益核心",
    nativeAurasOrSkills: [
      "火焰型 (Fire)：火焰彈、火球術、等級 15+【附魔】(Enchant - 2.4重磅新增！)",
      "冰寒型 (Cold)：冰川之槍 (Glacial Spike)、寒冰甲 (Chilling Armor)、寒冰球 (Ice Blast)",
      "閃電型 (Lightning)：電能彈、閃電箭、靜電力場 (Static Field - 2.4重磅新增！)"
    ],
    equipmentTypes: ["單手劍 (One-handed Swords)", "盾牌 (Shields)", "頭盔 (Helms)", "胸甲 (Body Armor)"],
    patch24Updates: "2.4 版本徹底重做！火系新增自動幫全隊施放【附魔 (Enchant)】增加巨量命中率與火傷；電系新增【靜電力場】削弱全屏怪物半血；冰系的技能組是冰川之槍、寒冰甲、寒冰球。",
    description: "暗黑 2 中唯一能同時裝備單手劍與盾牌的法系傭兵！能攜帶兩件精神 (Spirit 劍 + 盾) 輕鬆湊出高達 70% FCR 與海量技能抗性。",
    builds: [
      {
        name: "「烈焰附魔」召喚與打手增幅流 (火系鐵狼)",
        role: "為所有召喚生物與隊友賦予附魔，AR 增加 200%+",
        weapon: "符文之語【精神】(Spirit 劍) 或 暗金【瘟疫】",
        helm: "符文之語【閃爍火焰】(Flickering Flame 火靈氣) 或【諧角之冠】",
        armor: "暗金【蛇魔法師之皮】(Skin of the Vipermagi)",
        description: "專門配合召喚死靈、召喚德魯伊或近戰狂亂野蠻人。火鐵狼會自動施展等級 15+ 附魔 (Enchant)，骷髏軍團攻擊瞬間附加烈焰，且命中率 (AR) 翻倍暴增，再也不會揮空！",
        strengths: ["全隊附魔巨額提升攻擊準確率", "召喚軍團火傷倍增", "自帶閃爍火焰抵抗火抗"]
      },
      {
        name: "「極寒冰封」極限控場防守流 (冰系鐵狼)",
        role: "冰川之槍與寒冰球減速冰凍，替隊友擋下近身怪潮",
        weapon: "符文之語【精神】(Spirit 劍)",
        helm: "暗金【夜翼面紗】(Nightwing's Veil +15% 冰傷)",
        armor: "符文之語【背信】或【蛇魔法師之皮】",
        description: "雙精神配置提供 110% 快速打擊恢復 (FHR) 與 70% 快速施法速度 (FCR)，鐵狼在後排持續施放冰川之槍與寒冰球，前方的怪潮被減速與冰凍。",
        strengths: ["冰系技能減速冰凍控場", "雙精神配裝造價極低", "極其安全適合專家級模式 (HC)"]
      }
    ]
  }
];
