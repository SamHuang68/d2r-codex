import { CharacterBuildPlan } from '../types';

export const PRESET_META_BUILDS: Omit<CharacterBuildPlan, 'id'>[] = [
  {
    characterClass: '魔法使',
    buildName: '純冰暴風雪標配 (Blizzard Sorc - MF 刷寶之王)',
    targetLevel: 92,
    gear: {
      helm: '諧角之冠 (Harlequin Crest 軍帽) - 鑲 24# 25% MF',
      armor: '謎團 (Enigma) / 升級蛇魔法師之皮 (Vipermagi)',
      weapon1: '死亡深度 (Death\'s Fathom) +30% 冰冷技能傷害 (鑲 5/5 冰彩虹刻面)',
      shield1: '精神君主盾 (Spirit Monarch) 35% FCR',
      weapon2: '戰爭召喚 (Call to Arms CTA) +6 戰鬥命令 BO',
      shield2: '精神盾 (Spirit Monarch +2 所有技能喊狀態)',
      gloves: '法師之拳 (Magefist) 20% FCR',
      boots: '戰爭旅者 (War Traveler) 50% MF',
      belt: '蜘蛛之網 (Arachnid Mesh) 20% FCR +1技能',
      amulet: '馬拉的萬花筒 (Mara\'s Kaleidoscope) +2技能 30全抗',
      ring1: '喬丹之石 (Stone of Jordan) +1技能 25%法力',
      ring2: '烏鴉之霜 (Raven Frost) 無法被凍結'
    },
    customStats: {
      fcr: 105,
      fhr: 60,
      allResist: 75,
      magicFind: 360,
      allSkills: 14
    },
    notes: '精準踩中魔法使 105% FCR (8 幀) 施法檔位！配合背包【破冰咒符 (Cold Rupture)】與冰寒專精破除全屏冰免怪，是開荒到終局效率最高的打寶女王。'
  },
  {
    characterClass: '魔法使',
    buildName: '自持無限新星電法 (Nova / ES Sorc - 地圖推土機)',
    targetLevel: 94,
    gear: {
      helm: '獅鷲之眼 (Griffon\'s Eye) -20/+15 (鑲 5/5 電彩虹刻面)',
      armor: '升級蛇魔法師之皮 (Skin of the Vipermagi) 35全抗 30% FCR (鑲 5/5 電珠寶)',
      weapon1: '符文之語【無限】(Infinity 鑲四孔無形普通鐮刀 Scythe 自持減 55% 電抗)',
      shield1: '無 (雙手持長柄鐮刀)',
      weapon2: '戰爭召喚 (Call to Arms CTA) +6 BO',
      shield2: '精神君主盾 (Spirit Monarch +2技能)',
      gloves: '法師之拳 (Magefist) 20% FCR',
      boots: '沙暴之旅 (Sandstorm Trek) 20% FHR 15力量15體力',
      belt: '蜘蛛之網 (Arachnid Mesh) 20% FCR',
      amulet: '手工橙色施法護身符 (2 法師技能 / 15-20% FCR / 滿法力)',
      ring1: '喬丹之石 (Stone of Jordan) 增加法力上限 25%',
      ring2: '喬丹之石 (Stone of Jordan) 增加法力上限 25%'
    },
    customStats: {
      fcr: 105,
      fhr: 42,
      allResist: 75,
      magicFind: 120,
      allSkills: 16
    },
    notes: '2.5 邪惡威脅區域天花板流派！自持普通鐮刀無限享受 -(45-55)% 敵人電抗與 12 級信念靈氣雙重破防，點滿能量護盾 (ES) 與心靈傳動，生命只要 700，法力破 3500+，近乎無敵！'
  },
  {
    characterClass: '刺客',
    buildName: '嵌飾雙武學刺客 (Mosaic Martial Sin - 輸出宇宙第一)',
    targetLevel: 90,
    gear: {
      helm: '獅鷲之眼 (Griffon\'s Eye) -20/+15 鑲 5/5 電珠寶',
      armor: '符文之語【謎團】(Enigma 法師鎧甲)',
      weapon1: '符文之語【嵌飾】(Mosaic 23+25+11 鑲 +3 鳳凰擊巨鷹爪)',
      shield1: '符文之語【嵌飾】(Mosaic 23+25+11 鑲 +3 雙龍爪巨鷹爪)',
      weapon2: '戰爭召喚 (Call to Arms)',
      shield2: '精神盾 (Spirit)',
      gloves: '亮黃厚皮手套 (+2 武學技能 / 20% IAS / 吸血 / 敏捷 / 抗性)',
      boots: '暗金【影舞者】(Shadow Dancer 勇士護脛 +2 暗影修行 30% FHR)',
      belt: '蜘蛛之網 (Arachnid Mesh) 20% FCR +1技能',
      amulet: '馬拉的萬花筒 (Mara\'s Kaleidoscope) +2技能 30全抗',
      ring1: '烏鴉之霜 (Raven Frost) 無法被凍結',
      ring2: '喬丹之石 (Stone of Jordan) 或 雙吸亮黃抗性戒'
    },
    customStats: {
      fcr: 65,
      fhr: 86,
      allResist: 75,
      magicFind: 180,
      allSkills: 15
    },
    notes: '2.6 顛覆遊戲機制的弒神流派！雙持嵌飾使終結技 100%「不消耗聚氣點數」，聚滿鳳凰擊三段冰/火/雷、龍擺尾與猛虎擊後，每踢一腳全螢幕同時爆發隕石術、連鎖閃電與冰封球，8 人難度 Boss 3 秒融化！'
  },
  {
    characterClass: '聖騎士',
    buildName: '祝福之鎚聖騎士 (Hammerdin - 萬金油全能戰神)',
    targetLevel: 93,
    gear: {
      helm: '諧角之冠 (Harlequin Crest 軍帽) 鑲 24# 伊司特',
      armor: '符文之語【謎團】(Enigma 統御者鎧甲)',
      weapon1: '符文之語【橡樹之心】(Heart of the Oak HOTO) 40% FCR 40全抗',
      shield1: '符文之語【精神】(Spirit 鑲 45 全抗神聖小盾 Sacred Targe 35% FCR)',
      weapon2: '戰爭召喚 (Call to Arms CTA 6 BO)',
      shield2: '精神盾 (Spirit Sacred Targe)',
      gloves: '法師之拳 (Magefist) 20% FCR',
      boots: '戰爭旅者 (War Traveler) 50% MF',
      belt: '蜘蛛之網 (Arachnid Mesh) 20% FCR',
      amulet: '馬拉的萬花筒 (Mara\'s Kaleidoscope) 30全抗',
      ring1: '喬丹之石 (Stone of Jordan)',
      ring2: '布爾凱索的婚戒 (Bul-Kathos\' Wedding Band) 或 烏鴉之霜'
    },
    customStats: {
      fcr: 125,
      fhr: 86,
      allResist: 75,
      magicFind: 320,
      allSkills: 17
    },
    notes: '達成聖騎士最高檔位 125% FCR (9 幀)！配合神聖之盾擁有 75% 極限格擋率，祝福之鎚傷害高達 15,000+，全圖無死角碾壓。'
  },
  {
    characterClass: '聖騎士',
    buildName: '紅門六王盾擊雙熱騎 (Smiter / Uber Tristram Killer)',
    targetLevel: 88,
    gear: {
      helm: '套裝【吉永之臉】(Guillaume\'s Face) 35% 粉碎打擊 CB',
      armor: '符文之語【剛毅】(Fortitude 統御者鎧甲) 或【背信】(Treachery 影散 + 劇毒)',
      weapon1: '符文之語【悔恨】(Grief 幻化之刃 400 純增傷 40% IAS)',
      shield1: '暗金【撒卡蘭姆使者】(金紋盾 HOZ 鑲 22# 烏姆 72 全抗)',
      weapon2: '戰爭召喚 (CTA) 或 偷取生命聚氣魔杖 (Life Tap Wand)',
      shield2: '精神盾 (Spirit)',
      gloves: '暗金【德古拉之握】(Dracul\'s Grasp 擊中觸發偷取生命詛咒)',
      boots: '暗金【蝕肉騎士】(Gore Rider 15% CB 15% DS 10% OW)',
      belt: '暗金【雷神之力】(Thundergod\'s Vigor 吸收閃電抵抗墨菲斯托)',
      amulet: '暗金【大君之怒】(Highlord\'s Wrath 20% IAS 35% 致命一擊)',
      ring1: '暗金【烏鴉之霜】(Raven Frost 無法被凍結)',
      ring2: '暗金【矮人之星】(Dwarf Star 吸收火焰) 或 高抗戒指'
    },
    customStats: {
      fcr: 0,
      fhr: 48,
      allResist: 90,
      magicFind: 0,
      allSkills: 6
    },
    notes: '擊殺超級崔斯特姆三大魔神的唯一權威配置！盾牌重擊 (Smite) 100% 命中，搭配 50%+ 粉碎打擊 (CB) 秒速削血，德古拉之握觸發偷取生命 (Life Tap) 瞬間吸滿血量，雷神腰帶徹底免疫老墨閃電審判。'
  },
  {
    characterClass: '亞馬遜',
    buildName: '閃電烈怒標槍馬 (Lightning Fury Javazon - 萬怪蒸發)',
    targetLevel: 92,
    gear: {
      helm: '獅鷲之眼 (Griffon\'s Eye) 鑲 5/5 電珠寶',
      armor: '符文之語【謎團】(Enigma)',
      weapon1: '無形暗金【泰坦的復仇】(Titan\'s Revenge 升級儀禮標槍 自動回復數量)',
      shield1: '暗金【暴風之盾】(Stormshield 物免盾 35% DR) 或 JMoD 偏折盾 (鑲4電珠寶)',
      weapon2: '戰爭召喚 (Call to Arms)',
      shield2: '精神君主盾 (Spirit Monarch)',
      gloves: '亮黃厚皮手套 (+2 標槍技能 / 20% IAS / 吸血 / 抗性)',
      boots: '暗金【紗織】(Silkweave 擊殺回魔 +5 EK) 或 戰旅',
      belt: '暗金【剃刀之尾】(Razortail 鯊皮腰帶 達成 100% 穿透)',
      amulet: '暗金【大君之怒】(Highlord\'s Wrath) 或 +2 亞馬遜施法護身符',
      ring1: '暗金【烏鴉之霜】(Raven Frost)',
      ring2: '喬丹之石 (SOJ) 或 雙吸抗性戒指'
    },
    customStats: {
      fcr: 68,
      fhr: 52,
      allResist: 75,
      magicFind: 150,
      allSkills: 16
    },
    notes: '秘密乳牛關的絕對統治者！配合剃刀之尾達成 100% 穿透，一發閃電烈怒穿透牛群裂變出上百條連鎖電弧，滿屏狂暴雷霆瞬間清空整片牧場。'
  },
  {
    characterClass: '死靈法師',
    buildName: '純召喚屍爆死靈 (Fishymancer - 零成本通關大師)',
    targetLevel: 90,
    gear: {
      helm: '諧角之冠 (Harlequin Crest 軍帽) 鑲 24#',
      armor: '符文之語【謎團】(Enigma 核心集火傳送甲)',
      weapon1: '符文之語【野獸】(Beast 狂戰斧 賦予全骷髏狂熱靈氣) 或 橡樹之心 (HOTO)',
      shield1: '暗金【魔胎】(Homunculus 祭司首級 鑲完美白寶石/鑽石)',
      weapon2: '戰爭召喚 (Call to Arms 6 BO)',
      shield2: '精神盾 (Spirit)',
      gloves: '塔格奧之爪 (Trang-Oul\'s Claws 20% FCR 30% 冰抗)',
      boots: '骨髓行走 (Marrowwalk +2 骷髏專精) 或 戰旅',
      belt: '蜘蛛之網 (Arachnid Mesh) 20% FCR',
      amulet: '馬拉的萬花筒 (Mara\'s Kaleidoscope) +2技能 30全抗',
      ring1: '喬丹之石 (Stone of Jordan)',
      ring2: '喬丹之石 (Stone of Jordan) 或 烏鴉之霜'
    },
    customStats: {
      fcr: 75,
      fhr: 56,
      allResist: 75,
      magicFind: 280,
      allSkills: 18
    },
    notes: '安全係數第一的召喚流派！骷髏大軍在野獸狂熱靈氣與米山力量靈氣加持下無往不利；謎團直接將所有僕從瞬間傳送至 Boss 臉上集火重疊秒殺，小怪只要倒下一隻，等級 30+ 屍爆直接引爆連環核彈！'
  },
  {
    characterClass: '野蠻人',
    buildName: '狂亂雙持打錢打寶戰神 (Frenzy / Goldfind Horker)',
    targetLevel: 91,
    gear: {
      helm: '暗金【亞瑞特的面容】(Arreat\'s Face) 或【盜賊皇冠】(100% 打錢)',
      armor: '符文之語【剛毅】(Fortitude) 或【謎團】(Enigma)',
      weapon1: '符文之語【悔恨】(Grief 幻化之刃 400 純增傷 40% IAS)',
      shield1: '符文之語【執法者】(Lawbringer 幻化 衰老 + 庇護) 或 副持【悔恨】',
      weapon2: '暗金【阿里巴巴之刃】(Blade of Ali Baba 三孔鑲 20# 藍姆符文)',
      shield2: '暗金【阿里巴巴之刃】(Blade of Ali Baba 三孔鑲 20# 藍姆符文)',
      gloves: '暗金【運氣守護】(Chance Guards 40% MF 200% 打錢)',
      boots: '暗金【地獄闊步】(Infernostride 70% 打錢 +10% 最大抗火)',
      belt: '暗金【黃金裹腰】(Goldwrap 80% 打錢 30% MF) 或 長串之耳',
      amulet: '暗金【旭日東升】(The Rising Sun 依等級吸火，崔凡克火球秒變溫泉)',
      ring1: '暗金【矮人之星】(Dwarf Star 100% 打錢 吸收火焰 15%)',
      ring2: '暗金【矮人之星】(Dwarf Star 100% 打錢 吸收火焰 15%)'
    },
    customStats: {
      fcr: 0,
      fhr: 48,
      allResist: 75,
      magicFind: 450,
      allSkills: 8
    },
    notes: '崔凡克瘸子的終極剋星！旭日東升與雙矮人之星將多頭蛇火球完全轉化為補血溫泉。擊殺最高議會後，切副手雙持阿里巴巴（共6顆藍姆符文）狂按「尋找物品 (Find Item - Hork)」，一場噴出數百萬金幣與海量高級符文！'
  }
];
