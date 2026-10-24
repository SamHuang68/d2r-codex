/**
 * 聖休亞瑞典藏中樞 (D2R Codex) - 全域裝備搜尋與別名正規化引擎 (Query Normalizer)
 * 解決全站點擊複合名稱（例如「信心 (Faith GMB)」、「剛毅甲」、「巨骷髏/安頭」）搜尋落空問題
 */

import { RUNEWORDS_DATA } from '../data/runewords';
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA, ALL_SET_PIECES } from '../data/setItems';
import { BASE_ITEMS_DATA } from '../data/bases';

export interface NormalizedItemTarget {
  id: string;
  type: 'runeword' | 'unique' | 'set' | 'base' | 'charm';
  name: string;
  nameEn: string;
  targetTab: 'runewords' | 'items' | 'sets' | 'bases' | 'simulator';
}

/**
 * 玩家社群常見俗稱、簡稱與黑話映射字典
 */
const COMMUNITY_ALIASES: Record<string, string> = {
  // 暗金防具/武器
  '軍帽': 'harlequin_crest',
  '諧角之冠': 'harlequin_crest',
  'shako': 'harlequin_crest',
  '蛛網': 'arachnid_mesh',
  '蛛網腰帶': 'arachnid_mesh',
  '技能腰': 'arachnid_mesh',
  '馬拉': 'maras_kaleidoscope',
  '馬拉的萬花筒': 'maras_kaleidoscope',
  '喬丹': 'the_stone_of_jordan',
  '喬丹之石': 'the_stone_of_jordan',
  'soj': 'the_stone_of_jordan',
  '烏鴉': 'raven_frost',
  '烏鴉之霜': 'raven_frost',
  '戰旅': 'war_traveler',
  '戰爭旅者': 'war_traveler',
  '蝕肉': 'gore_rider',
  '蝕肉騎士': 'gore_rider',
  '水上飄': 'waterwalk',
  '雷神': 'thundergods_vigor',
  '雷神之力': 'thundergods_vigor',
  '年冠': 'crown_of_ages',
  '年紀之冠': 'crown_of_ages',
  'coa': 'crown_of_ages',
  '格利風': 'griffons_eye',
  '格力風': 'griffons_eye',
  '格利風之眼': 'griffons_eye',
  '安頭': 'andariels_visage',
  '安達利爾的面容': 'andariels_visage',
  '巨骷髏': 'giant_skull',
  '法拳': 'magefist',
  '法師之拳': 'magefist',
  '塔格奧手': 'trangouls_claws',
  '卓古拉': 'draculs_grasp',
  '卓古拉之握': 'draculs_grasp',
  '基德': 'gheeds_wager',
  '基德的運氣': 'gheeds_wager',
  '基德的財富': 'gheeds_wager',
  '基德的賭注': 'gheeds_wager',
  '眼球': 'the_oculus',
  '怪異': 'eschutas_temper',
  '次元': 'deaths_fathom',
  '死亡深度': 'deaths_fathom',
  '脾氣': 'eschutas_temper',
  '暴風之盾': 'stormshield',
  '物免盾': 'stormshield',
  // 終局底材常見俗稱
  '統盾': 'monarch',
  '統治者大盾': 'monarch',
  '君主盾': 'monarch',
  '法鎧': 'mage_plate',
  '法師鎧甲': 'mage_plate',
  '執政官': 'archon_plate',
  '執政官鎧甲': 'archon_plate',
  '巨長': 'great_poleaxe',
  '巨長柄斧': 'great_poleaxe',
  '銳利': 'thresher',
  '銳利之斧': 'thresher',
  '巨神之刃': 'colossus_blade',
  '巨刃': 'colossus_blade',
  '巨神劍': 'colossus_sword',
  '幻化': 'phase_blade',
  '幻化之刃': 'phase_blade',
  '狂斧': 'berserker_axe',
  '狂戰士斧': 'berserker_axe',
  '狂戰斧': 'berserker_axe',
  '狂戰士之斧': 'berserker_axe',
  '水晶劍': 'crystal_sword',
  '捕人叉': 'mancatcher',
  '神小': 'sacred_targe',
  '神聖小盾': 'sacred_targe',
  '神聖庫拉斯特': 'sacred_rondache',
  '神盾': 'sacred_targe',
  '大院長': 'grand_matron_bow',
  '大院長之弓': 'grand_matron_bow',
  '女長老之弓': 'grand_matron_bow',

  // 熱門套裝單件與套裝組
  '塔格奧之爪': 'trangouls_claws',
  '塔格奧': 'trangouls_avatar',
  '塔拉夏': 'tal_rashas_wrappings',
  '塔拉夏衣服': 'tal_rashas_guardianship',
  '漆黑甲': 'tal_rashas_guardianship',
  '吉永': 'guillaumes_face',
  '吉永之臉': 'guillaumes_face',
  '手掌的安置': 'laying_of_hands',
  '安置手': 'laying_of_hands',
  '不朽之王': 'immortal_king',
  '不朽王': 'immortal_king',
  '西剛': 'sigons_complete_steel',
  '娜塔亞': 'natalyas_odium',
  '馬維娜': 'mavinas_battle_hymn',
  '格里斯瓦德': 'griswolds_legacy',
  '艾爾多': 'aldurs_watchtower',

  // 符文之語
  '歇斯底里': 'hustle',
  '狂躁': 'hustle',
  '催促': 'hustle',
  'hustle': 'hustle',
  'mania': 'hustle',
  'hysteria': 'hustle',
  '剛毅武器': 'fortitude',
  '剛毅弓': 'fortitude',
  '鳳凰弓': 'phoenix',
  '飛龍甲': 'dragon',
  '飛龍盾': 'dragon',
  '夢境頭': 'dream',
  '夢境盾': 'dream',
  '信心': 'faith',
  '信心弓': 'faith',
  '剛毅': 'fortitude',
  '剛毅甲': 'fortitude',
  '謎團': 'enigma',
  '謎團甲': 'enigma',
  '無限': 'infinity',
  '無限巨長': 'infinity',
  '精神': 'spirit',
  '精神劍': 'spirit',
  '精神盾': 'spirit',
  '悔恨': 'grief',
  '眼光': 'insight',
  '橡樹': 'heart_of_the_oak',
  '橡樹之心': 'heart_of_the_oak',
  'hoto': 'heart_of_the_oak',
  '野獸': 'beast',
  '最後希望': 'last_wish',
  '驕傲': 'pride',
  '死呼': 'breath_of_the_dying',
  '死亡呼吸': 'breath_of_the_dying',
  '鳳凰': 'phoenix',
  '鳳凰盾': 'phoenix',
  '夢境': 'dream',
  '飛龍': 'dragon',
  '正義之手': 'hand_of_justice',
  '死神': 'death',
  '背叛': 'treachery',
  '煙霧': 'smoke',
  '和平': 'peace',
  '強制': 'duress',
  '獅子心': 'lionheart',
  '石塊': 'stone',
  '幽暗': 'gloom',
  '謹慎': 'prudence',
  '流亡': 'exile',
  '催眠': 'passion',
  '熱情': 'passion',
  '狂暴': 'fury',
  '白骨': 'bone',
  '遵從': 'obedience',
  '混沌': 'chaos',
  '誓約': 'oath',
  '執法者': 'lawbringer',
  '烙印': 'brand',
  '狂風': 'wind',
  '毀滅': 'annihilus',
  '火炬': 'hellfire_torch',
  '地獄火炬': 'hellfire_torch',
  '破火': 'flame_rift',
  '破冰': 'cold_rupture',
  '破電': 'crack_of_the_heavens',
  '破毒': 'rotting_fissure',
  '破物': 'bone_break',
  '破魔': 'black_cleft'
};

/**
 * 清理與正規化搜尋關鍵字，回傳依序嘗試的候選詞。
 * - 「烏鴉之霜 (Raven Frost) 無法被凍結」：括號可以在句中，後面接說明文字也沒關係，取括號前的主名、括號內的英文名與其第一個字
 * - 「烏鴉之霜 無法被凍結」：沒有括號時，依序嘗試整句、第一個詞、前兩個詞（遇到說明文字時，物品名通常在最前面）
 * - 斜線、「或」分隔的二選一，拆成各自的候選
 */
export function cleanSearchQuery(raw: string): string[] {
  if (!raw) return [];
  const trimmed = raw.replace(/[【】]/g, '').replace(/\s+/g, ' ').trim();
  if (!trimmed) return [];

  // 若含有斜線二選一（例如 "巨骷髏/安頭"），拆分成兩個候選詞
  if (trimmed.includes('/')) {
    return trimmed.split('/').map(s => s.trim()).filter(Boolean);
  }
  if (trimmed.includes(' 或 ')) {
    return trimmed.split(' 或 ').map(s => s.trim()).filter(Boolean);
  }

  // 括號註釋：主名（括號前）＋括號內的英文名；括號後的說明文字一律忽略
  const bracketMatch = trimmed.match(/^([^(（]+?)\s*[(（]([^)）]+)[)）]/);
  if (bracketMatch) {
    const mainPart = bracketMatch[1].trim();
    const subPart = bracketMatch[2].trim();
    // 檢查 subPart 內是否有英文字詞（例如 "Faith GMB" -> 拆出 "Faith"）
    const subWords = subPart.split(/\s+/);
    return [...new Set([mainPart, subPart, subWords[0]].filter(Boolean))];
  }

  // 沒有括號但帶了說明文字：整句 → 第一個詞 → 前兩個詞
  const words = trimmed.split(' ');
  if (words.length > 1) return [...new Set([trimmed, words[0], words.slice(0, 2).join(' ')])];

  return [trimmed];
}

/**
 * 根據查詢字串智能解析對應的裝備/符文之語/套裝目標
 */
export function normalizeItemQuery(rawQuery: string): NormalizedItemTarget | null {
  if (!rawQuery) return null;
  const candidates = cleanSearchQuery(rawQuery);

  for (const cand of candidates) {
    const cleanCand = cand.toLowerCase().trim();

    // 1. 檢查社群別名字典
    if (COMMUNITY_ALIASES[cleanCand]) {
      const targetId = COMMUNITY_ALIASES[cleanCand];
      // 搜尋 runewords
      const rw = RUNEWORDS_DATA.find(r => r.id === targetId);
      if (rw) {
        return {
          id: rw.id,
          type: 'runeword',
          name: rw.name,
          nameEn: rw.nameEn,
          targetTab: 'runewords'
        };
      }
      // 搜尋 uniques
      const uq = UNIQUE_ITEMS_DATA.find(u => u.id === targetId);
      if (uq) {
        return {
          id: uq.id,
          type: 'unique',
          name: uq.name,
          nameEn: uq.nameEn,
          targetTab: 'items'
        };
      }
      // 搜尋 bases
      const bs = BASE_ITEMS_DATA.find(b => b.id === targetId);
      if (bs) {
        return {
          id: bs.id,
          type: 'base',
          name: bs.name,
          nameEn: bs.nameEn,
          targetTab: 'bases'
        };
      }
      // 搜尋 set pieces
      const sp = ALL_SET_PIECES.find(p => p.id === targetId);
      if (sp) {
        return {
          id: sp.id,
          type: 'set',
          name: sp.name,
          nameEn: sp.nameEn,
          targetTab: 'items'
        };
      }
      // 搜尋 set collections
      const st = SET_ITEMS_DATA.find(s => s.id === targetId);
      if (st) {
        return {
          id: st.id,
          type: 'set',
          name: st.name,
          nameEn: st.nameEn,
          targetTab: 'items'
        };
      }
    }

    // 2. 搜尋符文之語 (Runewords)
    for (const rw of RUNEWORDS_DATA) {
      if (
        rw.id.toLowerCase() === cleanCand ||
        rw.name.toLowerCase() === cleanCand ||
        rw.nameEn.toLowerCase() === cleanCand ||
        (rw.nameClassic && rw.nameClassic.toLowerCase() === cleanCand) ||
        cleanCand.includes(rw.name.toLowerCase()) ||
        cleanCand.includes(rw.nameEn.toLowerCase())
      ) {
        return {
          id: rw.id,
          type: 'runeword',
          name: rw.name,
          nameEn: rw.nameEn,
          targetTab: 'runewords'
        };
      }
    }

    // 3. 搜尋暗金裝備 (Uniques)
    for (const uq of UNIQUE_ITEMS_DATA) {
      if (
        uq.id.toLowerCase() === cleanCand ||
        uq.name.toLowerCase() === cleanCand ||
        uq.nameEn.toLowerCase() === cleanCand ||
        (uq.nameClassic && uq.nameClassic.toLowerCase() === cleanCand)
      ) {
        return {
          id: uq.id,
          type: 'unique',
          name: uq.name,
          nameEn: uq.nameEn,
          targetTab: 'items'
        };
      }
    }

    // 4. 搜尋套裝單件 (Set Pieces)
    for (const piece of ALL_SET_PIECES) {
      if (
        piece.id.toLowerCase() === cleanCand ||
        piece.name.toLowerCase() === cleanCand ||
        piece.nameEn.toLowerCase() === cleanCand ||
        (piece.nameClassic && piece.nameClassic.toLowerCase() === cleanCand)
      ) {
        return {
          id: piece.id,
          type: 'set',
          name: piece.name,
          nameEn: piece.nameEn,
          targetTab: 'items'
        };
      }
    }

    // 5. 搜尋套裝組 (Set Collections)
    for (const set of SET_ITEMS_DATA) {
      if (
        set.id.toLowerCase() === cleanCand ||
        set.name.toLowerCase() === cleanCand ||
        set.nameEn.toLowerCase() === cleanCand
      ) {
        return {
          id: set.id,
          type: 'set',
          name: set.name,
          nameEn: set.nameEn,
          targetTab: 'items'
        };
      }
    }

    // 6. 搜尋基礎底材 (Bases)
    for (const b of BASE_ITEMS_DATA) {
      if (
        b.id.toLowerCase() === cleanCand ||
        b.name.toLowerCase() === cleanCand ||
        b.nameEn.toLowerCase() === cleanCand
      ) {
        return {
          id: b.id,
          type: 'base',
          name: b.name,
          nameEn: b.nameEn,
          targetTab: 'bases'
        };
      }
    }
  }

  return null;
}
