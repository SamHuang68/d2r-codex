/**
 * 聖休亞瑞典藏中樞 (D2R Codex) - 遊戲物品立繪圖片智能解析引擎
 * 提供 100% 覆蓋率的遊戲原版 Sprite 圖片匹配、字詞邊界防衝突與語意回退機制
 */

import type { GearSlot, ItemRarity } from '../types';

export interface ResolveItemImageParams {
  name?: string;
  nameEn?: string;
  baseItem?: string;
  slot?: GearSlot | string;
  rarity?: ItemRarity | 'unique' | 'set' | 'runeword' | 'rune' | 'charm' | 'gem' | 'prop' | 'rare' | 'magic' | 'crafted';
  runeNumber?: number;
  baseUrl?: string;
}

/**
 * 符文名稱對照表 (支援繁體中文與原版英文名稱映射至 1-33# 符文)
 */
const RUNE_LOOKUP: Record<string, number> = {
  '艾爾': 1, 'el': 1,
  '艾德': 2, 'eld': 2,
  '特爾': 3, 'tir': 3,
  '奈夫': 4, 'nef': 4,
  '愛斯': 5, 'eth': 5,
  '伊蘇': 6, 'ith': 6,
  '塔爾': 7, 'tal': 7,
  '拉爾': 8, 'ral': 8,
  '歐特': 9, 'ort': 9,
  '書爾': 10, 'thul': 10,
  '安姆': 11, 'amn': 11,
  '索爾': 12, 'sol': 12,
  '夏': 13, 'shael': 13,
  '多爾': 14, 'dol': 14,
  '海爾': 15, 'hel': 15,
  '埃歐': 16, 'io': 16,
  '盧姆': 17, 'lum': 17,
  '科': 18, 'ko': 18,
  '法爾': 19, 'fal': 19,
  '藍姆': 20, 'lem': 20,
  '普爾': 21, 'pul': 21,
  '烏姆': 22, 'um': 22,
  '馬爾': 23, 'mal': 23,
  '伊斯特': 24, 'ist': 24,
  '古爾': 25, 'gul': 25,
  '伐克斯': 26, 'vex': 26,
  '歐姆': 27, 'ohm': 27,
  '羅': 28, 'lo': 28,
  '瑟': 29, 'sur': 29,
  '貝': 30, 'ber': 30,
  '喬': 31, 'jah': 31,
  '查姆': 32, 'cham': 32,
  '薩德': 33, 'zod': 33,
};

/**
 * 智能解析物品的實際真實遊戲立繪圖片路徑
 *
 * @param params 物品屬性參數（名稱、英文名、底材、槽位、稀有度、符文編號、基本路徑）
 * @returns 完整的相對或絕對立繪路徑
 */
export function resolveItemImagePath({
  name = '',
  nameEn = '',
  baseItem = '',
  slot = '',
  rarity = 'unique',
  runeNumber,
  baseUrl = './',
}: ResolveItemImageParams): string {
  const base = baseUrl ? (baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`) : '';
  const n = `${name} ${nameEn} ${baseItem}`.toLowerCase();

  // ──────────────────────────────────────────────
  // 1. 符文解析 (1-33# Runes)
  // ──────────────────────────────────────────────
  let targetRuneNum = runeNumber;
  if (targetRuneNum === undefined && (rarity === 'rune' || n.includes('符文') || n.includes('rune'))) {
    const numMatch = n.match(/(\d{1,2})\s*(?:#|號|rune)/);
    if (numMatch) {
      const parsed = parseInt(numMatch[1], 10);
      if (parsed >= 1 && parsed <= 33) {
        targetRuneNum = parsed;
      }
    }
    if (targetRuneNum === undefined) {
      for (const [key, num] of Object.entries(RUNE_LOOKUP)) {
        const regex = new RegExp(`(?:^|[^a-z0-9])${key}(?:[^a-z0-9]|$)`, 'i');
        if (regex.test(n)) {
          targetRuneNum = num;
          break;
        }
      }
    }
  }

  if (targetRuneNum !== undefined && targetRuneNum >= 1 && targetRuneNum <= 33) {
    const runeId = String(targetRuneNum).padStart(2, '0');
    return `${base}images/items/runes/r${runeId}.png`;
  }

  // ──────────────────────────────────────────────
  // 2. 消耗品與道具 (Props & Consumables)
  // ──────────────────────────────────────────────
  if (n.includes('赫拉迪克方塊') || n.includes('horadric cube') || n.includes('方塊') || n.includes('cube')) {
    return `${base}images/items/props/horadric_cube.gif`;
  }
  if (n.includes('赦免徽章') || n.includes('赦免') || n.includes('洗點') || n.includes('token of absolution')) {
    return `${base}images/items/props/token_of_absolution.jpg`;
  }
  if (n.includes('完美紫寶石') || n.includes('perfect amethyst')) {
    return `${base}images/items/props/perfect_amethyst.gif`;
  }
  if (n.includes('完美鑽石') || n.includes('perfect diamond')) {
    return `${base}images/items/props/perfect_diamond.gif`;
  }
  if (n.includes('完美綠寶石') || n.includes('perfect emerald')) {
    return `${base}images/items/props/perfect_emerald.gif`;
  }
  if (n.includes('完美紅寶石') || n.includes('perfect ruby')) {
    return `${base}images/items/props/perfect_ruby.gif`;
  }
  if (n.includes('完美藍寶石') || n.includes('perfect sapphire')) {
    return `${base}images/items/props/perfect_sapphire.gif`;
  }
  if (n.includes('完美黃寶石') || n.includes('perfect topaz')) {
    return `${base}images/items/props/perfect_topaz.gif`;
  }
  if (n.includes('完美骷髏') || n.includes('perfect skull')) {
    return `${base}images/items/props/perfect_skull.gif`;
  }
  if (n.includes('精華') || n.includes('essence')) {
    return `${base}images/items/props/essences.png`;
  }
  if (n.includes('之鑰') || n.includes('鑰匙') || n.includes('key of') || n.includes('uber key')) {
    return `${base}images/items/props/uber_key.gif`;
  }
  if (n.includes('巴爾之眼') || n.includes('baal\'s eye') || n.includes('baals eye')) {
    return `${base}images/items/props/baal_eye.gif`;
  }
  if (n.includes('墨菲斯托之腦') || n.includes('mephisto\'s brain') || n.includes('mephistos brain')) {
    return `${base}images/items/props/mephisto_brain.gif`;
  }
  if (n.includes('迪亞布羅之角') || n.includes('暗黑破壞神之角') || n.includes('diablo\'s horn') || n.includes('diablos horn')) {
    return `${base}images/items/props/diablo_horn.gif`;
  }
  if (n.includes('全面恢復藥劑') || n.includes('大紫') || n.includes('full rejuvenation')) {
    return `${base}images/items/props/full_rejuvenation.gif`;
  }
  if (n.includes('恢復藥劑') || n.includes('小紫') || n.includes('rejuvenation')) {
    return `${base}images/items/props/rejuvenation.gif`;
  }
  if (n.includes('生命藥劑') || n.includes('大紅') || n.includes('super healing') || n.includes('healing potion') || n.includes('health potion')) {
    return `${base}images/items/props/super_healing.gif`;
  }
  if (n.includes('法力藥劑') || n.includes('大藍') || n.includes('super mana') || n.includes('mana potion')) {
    return `${base}images/items/props/super_mana.gif`;
  }
  if (n.includes('解毒藥劑') || n.includes('解毒') || n.includes('antidote')) {
    return `${base}images/items/props/antidote.gif`;
  }
  if (n.includes('融雪藥劑') || n.includes('解凍') || n.includes('thawing')) {
    return `${base}images/items/props/thawing.gif`;
  }
  if (n.includes('耐力藥劑') || n.includes('體力藥劑') || n.includes('stamina')) {
    return `${base}images/items/props/stamina.gif`;
  }

  // ──────────────────────────────────────────────
  // 3. 護身符 (Charms) 與珠寶 (Jewels)
  // ──────────────────────────────────────────────
  if (n.includes('毀滅小護身符') || n.includes('暗黑小符') || n.includes('annihilus') || /\banni\b/.test(n)) {
    return `${base}images/items/charms/anni.gif`;
  }
  if (n.includes('地獄火炬') || n.includes('hellfire torch') || (n.includes('火炬') && !n.includes('艾羅') && !n.includes('iro'))) {
    return `${base}images/items/charms/torch.jpg`;
  }
  if (n.includes('基德') || n.includes('gheed')) {
    return `${base}images/items/charms/gheeds.gif`;
  }
  if (n.includes('破免') || n.includes('碎焰') || n.includes('破火') || n.includes('flame rift') ||
      n.includes('折雷') || n.includes('破電') || n.includes('crack of the heavens') ||
      n.includes('寒骨') || n.includes('破冰') || n.includes('cold rupture') ||
      n.includes('腐毒') || n.includes('破毒') || n.includes('rotting fissure') ||
      n.includes('破滅') || n.includes('破魔') || n.includes('black cleft') ||
      n.includes('黑結晶') || n.includes('破物') || n.includes('bone break')) {
    return `${base}images/items/charms/gheeds.gif`;
  }
  if (n.includes('大型護身符') || n.includes('large charm')) {
    return `${base}images/items/charms/large_charm.gif`;
  }
  if (n.includes('小護身符') || n.includes('small charm') || slot === 'charm' && (n.includes('小') || n.includes('small'))) {
    return `${base}images/items/charms/small_charm.gif`;
  }
  if (n.includes('超大護身符') || n.includes('技能板') || n.includes('grand charm') || slot === 'charm') {
    return `${base}images/items/charms/gheeds.gif`;
  }
  if (n.includes('彩虹刻面') || n.includes('rainbow facet') || n.includes('facet')) {
    if (n.includes('冰') || n.includes('cold')) return `${base}images/items/jewels/cold.gif`;
    if (n.includes('火') || n.includes('fire')) return `${base}images/items/jewels/fire.gif`;
    if (n.includes('毒') || n.includes('poison')) return `${base}images/items/jewels/poison.gif`;
    return `${base}images/items/jewels/lightning.gif`;
  }
  if (slot === 'jewel' || rarity === 'gem' || n.includes('珠寶') || /\bjewel\b/.test(n)) {
    return `${base}images/items/jewels/lightning.gif`;
  }

  // ──────────────────────────────────────────────
  // 4. 經典全套裝備 (Set Items - 32 Complete Sets)
  // ──────────────────────────────────────────────
  // 塔拉夏 (Tal Rasha's Wrappings)
  if (n.includes('塔拉夏') || n.includes('tal rasha')) {
    if (n.includes('護甲') || n.includes('守護') || n.includes('漆甲') || n.includes('guard') || slot === 'armor' || slot === 'chest') {
      return `${base}images/items/sets/talrashas_guardianship.gif`;
    }
    if (n.includes('紋章') || n.includes('面甲') || n.includes('頭盔') || n.includes('crest') || slot === 'helm') {
      return `${base}images/items/sets/talrashas_horadric_crest.gif`;
    }
    if (n.includes('腰帶') || n.includes('織帶') || n.includes('cloth') || slot === 'belt') {
      return `${base}images/items/sets/talrashas_fine_spun_cloth.gif`;
    }
    if (n.includes('法杖') || n.includes('渦流') || n.includes('水晶') || n.includes('eye') || slot === 'weapon' || slot === 'mainHand') {
      return `${base}images/items/sets/talrashas_lidless_eye.gif`;
    }
    return `${base}images/items/sets/amu2.gif`;
  }

  // 不朽之王 (Immortal King)
  if (n.includes('不朽之王') || n.includes('immortal king')) {
    if (n.includes('靈魂牢籠') || n.includes('神聖鎧甲') || n.includes('cage') || slot === 'armor' || slot === 'chest') {
      return `${base}images/items/sets/immortal_kings_soul_cage.gif`;
    }
    if (n.includes('意志') || n.includes('復仇者頭盔') || n.includes('will') || slot === 'helm') {
      return `${base}images/items/sets/immortal_kings_will.gif`;
    }
    if (n.includes('碎石者') || n.includes('食人魔') || n.includes('crusher') || slot === 'weapon' || slot === 'mainHand') {
      return `${base}images/items/sets/immortal_kings_stone_crusher.gif`;
    }
    if (n.includes('熔爐') || n.includes('融爐') || n.includes('forge') || slot === 'gloves') {
      return `${base}images/items/sets/immortal_kings_forge.gif`;
    }
    if (n.includes('步態') || n.includes('之柱') || n.includes('pillar') || slot === 'boots') {
      return `${base}images/items/sets/immortal_kings_pillar.gif`;
    }
    return `${base}images/items/sets/immortal_kings_detail.gif`;
  }

  // 門徒 (The Disciple)
  if (n.includes('安置手套') || n.includes('手掌的安置') || n.includes('laying of hands')) {
    return `${base}images/items/sets/laying_of_hands.gif`;
  }
  if (n.includes('信徒腰帶') || n.includes('信條') || n.includes('credendum')) {
    return `${base}images/items/sets/credendum.gif`;
  }
  if (n.includes('黑暗信徒') || n.includes('dark adherent')) {
    return `${base}images/items/sets/dark_adherent.gif`;
  }
  if (n.includes('儀式之靴') || n.includes('成年禮') || n.includes('rite of passage')) {
    return `${base}images/items/sets/rite_of_passage.gif`;
  }
  if (n.includes('述說之珠') || n.includes('telling of beads')) {
    return `${base}images/items/sets/amu1.gif`;
  }

  // 孤兒的呼喚 (Orphan's Call)
  if (n.includes('吉永') || n.includes('guillaume')) {
    return `${base}images/items/sets/guillaumes_face.gif`;
  }
  if (n.includes('威廉') || n.includes('wilhelm')) {
    return `${base}images/items/sets/wilhelms_pride.gif`;
  }
  if (n.includes('馬格努斯') || n.includes('magnus')) {
    return `${base}images/items/sets/magnus_skin.gif`;
  }
  if (n.includes('惠斯坦') || n.includes('whitstan')) {
    return `${base}images/items/sets/whitstans_guard.gif`;
  }

  // 娜塔亞的非難 (Natalya's Odium)
  if (n.includes('娜塔亞') || n.includes('natalya')) {
    if (n.includes('甲') || n.includes('shadow') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/natalyas_shadow.gif`;
    if (n.includes('爪') || n.includes('mark') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/natalyas_mark.gif`;
    if (n.includes('鞋') || n.includes('soul') || slot === 'boots') return `${base}images/items/sets/natalyas_soul.gif`;
    return `${base}images/items/sets/natalyas_totem.gif`;
  }

  // 艾爾多的守衛 (Aldur's Watchtower)
  if (n.includes('阿爾德') || n.includes('艾爾多') || n.includes('aldur')) {
    if (n.includes('欺弄') || n.includes('deception') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/aldurs_deception.gif`;
    if (n.includes('節奏') || n.includes('rhythm') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/aldurs_rhythm.gif`;
    if (n.includes('成長') || n.includes('步態') || n.includes('advance') || slot === 'boots') return `${base}images/items/sets/aldurs_advance.gif`;
    return `${base}images/items/sets/aldurs_stoney_gaze.gif`;
  }

  // 塔格奧的化身 (Trang-Oul's Avatar)
  if (n.includes('塔格奧') || n.includes('trang-oul') || n.includes('trangoul')) {
    if (n.includes('鱗甲') || n.includes('scales') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/trangouls_scales.gif`;
    if (n.includes('面具') || n.includes('外表') || n.includes('guise') || slot === 'helm') return `${base}images/items/sets/trangouls_guise.gif`;
    if (n.includes('翼') || n.includes('wing') || slot === 'shield' || slot === 'offHand') return `${base}images/items/sets/trangouls_wing.gif`;
    if (n.includes('爪') || n.includes('claws') || slot === 'gloves') return `${base}images/items/sets/trangouls_claws.gif`;
    return `${base}images/items/sets/trangouls_girth.gif`;
  }

  // 馬維娜的教條 (M'avina's Battle Hymn)
  if (n.includes('馬維娜') || n.includes('m\'avina') || n.includes('mavina')) {
    if (n.includes('擁抱') || n.includes('embrace') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/mavinas_embrace.gif`;
    if (n.includes('真實之視') || n.includes('true sight') || slot === 'helm') return `${base}images/items/sets/mavinas_true_sight.gif`;
    if (n.includes('施展') || n.includes('caster') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/mavinas_caster.gif`;
    if (n.includes('冰握') || n.includes('clutch') || slot === 'gloves') return `${base}images/items/sets/mavinas_icy_clutch.gif`;
    return `${base}images/items/sets/mavinas_tenet.gif`;
  }

  // 格里斯瓦德的遺產 (Griswold's Legacy)
  if ((n.includes('格里斯瓦德') || n.includes('griswold')) && !n.includes('刃') && !n.includes('edge')) {
    if (n.includes('心臟') || n.includes('heart') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/griswolds_heart.gif`;
    if (n.includes('英勇') || n.includes('valor') || slot === 'helm') return `${base}images/items/sets/griswolds_valor.gif`;
    if (n.includes('榮譽') || n.includes('honor') || slot === 'shield' || slot === 'offHand') return `${base}images/items/sets/griswolds_honor.gif`;
    if (n.includes('救贖') || n.includes('redemption') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/griswolds_redemption.gif`;
  }

  // 西剛的全套鋼甲 (Sigon's Complete Steel)
  if (n.includes('西剛') || n.includes('sigon')) {
    if (n.includes('庇護') || n.includes('shelter') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/sigons_shelter.gif`;
    if (n.includes('面甲') || n.includes('visor') || slot === 'helm') return `${base}images/items/sets/sigons_visor.gif`;
    if (n.includes('挑戰') || n.includes('gage') || slot === 'gloves') return `${base}images/items/sets/sigons_gage.gif`;
    if (n.includes('木屐') || n.includes('sabot') || slot === 'boots') return `${base}images/items/sets/sigons_sabot.gif`;
    if (n.includes('守護') || n.includes('guard') || slot === 'shield' || slot === 'offHand') return `${base}images/items/sets/sigons_guard.gif`;
    return `${base}images/items/sets/sigons_wrap.gif`;
  }

  // 天使的衣裝 (Angelic Raiment)
  if ((n.includes('天使') || n.includes('angelic')) && !n.includes('守護天使') && !n.includes('guardian angel') && !n.includes('熾天使') && !n.includes('seraph')) {
    if (n.includes('法衣') || n.includes('披風') || n.includes('mantle') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/angelic_mantle.gif`;
    if (n.includes('鐮刀') || n.includes('sickle') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/angelic_sickle.gif`;
    if (n.includes('翼') || n.includes('wings') || slot === 'amulet') return `${base}images/items/sets/amu1.gif`;
    if (n.includes('光環') || n.includes('halo') || slot === 'ring') return `${base}images/items/sets/ring1.gif`;
  }

  // 艾森赫特的軍備 (Isenhart's Armory)
  if (n.includes('艾森赫特') || n.includes('isenhart')) {
    if (n.includes('箱子') || n.includes('case') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/isenharts_case.gif`;
    if (n.includes('角') || n.includes('horns') || slot === 'helm') return `${base}images/items/sets/isenharts_horns.gif`;
    if (n.includes('光芒') || n.includes('lightbrand') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/isenharts_lightbrand.gif`;
    if (n.includes('格擋') || n.includes('parry') || slot === 'shield' || slot === 'offHand') return `${base}images/items/sets/isenharts_parry.gif`;
  }

  // 狂戰士軍械 (Berserker's Arsenal)
  if (n.includes('狂戰士的') || n.includes('berserker\'s') || n.includes('berserkers')) {
    if (n.includes('鎖子甲') || n.includes('hauberk') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/berserkers_hauberk.gif`;
    if (n.includes('頭盔') || n.includes('headgear') || slot === 'helm') return `${base}images/items/sets/berserkers_headgear.gif`;
    if (n.includes('手斧') || n.includes('hatchet') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/berserkers_hatchet.gif`;
  }

  // 布爾凱索的孩子 (Bul-Kathos' Children)
  if (n.includes('布爾凱索的神聖代價') || n.includes('sacred charge')) {
    return `${base}images/items/sets/bulkathos_sacred_charge.gif`;
  }
  if (n.includes('布爾凱索的部族守護') || n.includes('tribal guardian')) {
    return `${base}images/items/sets/bulkathos_tribal_guardian.gif`;
  }

  // 卡珊的陷阱 (Cathan's Traps)
  if (n.includes('卡珊') || n.includes('cathan')) {
    if (n.includes('網眼') || n.includes('mesh') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/cathans_mesh.gif`;
    if (n.includes('面容') || n.includes('visage') || slot === 'helm') return `${base}images/items/sets/cathans_visage.gif`;
    if (n.includes('統治') || n.includes('rule') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/cathans_rule.gif`;
    if (slot === 'ring' || n.includes('魔力') || n.includes('seal') || n.includes('戒')) return `${base}images/items/sets/ring1.gif`;
    if (slot === 'amulet' || n.includes('sigil') || n.includes('符號') || n.includes('項鍊') || n.includes('印記')) return `${base}images/items/sets/amu1.gif`;
  }

  // 希維爾的祭袍 (Civerb's Vestments)
  if (n.includes('希維爾') || n.includes('civerb')) {
    if (n.includes('短棍') || n.includes('cudgel') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/civerbs_cudgel.gif`;
    if (n.includes('守護') || n.includes('ward') || slot === 'shield' || slot === 'offHand') return `${base}images/items/sets/civerbs_ward.gif`;
    if (n.includes('圖騰') || n.includes('icon') || slot === 'amulet') return `${base}images/items/sets/amu1.gif`;
  }

  // 克雷得勞的支架 (Cleglaw's Brace)
  if (n.includes('克雷得勞') || n.includes('cleglaw')) {
    if (n.includes('牙齒') || n.includes('tooth') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/cleglaws_tooth.gif`;
    if (n.includes('鉗') || n.includes('pincers') || slot === 'gloves') return `${base}images/items/sets/cleglaws_pincers.gif`;
    if (n.includes('爪') || n.includes('claw') || slot === 'shield' || slot === 'offHand') return `${base}images/items/sets/cleglaws_claw.gif`;
  }

  // 死亡的偽裝 (Death's Disguise)
  if (n.includes('死亡之手') || n.includes('death\'s hand') || n.includes('deaths hand')) {
    return `${base}images/items/sets/deaths_hand.gif`;
  }
  if (n.includes('死亡守衛') || n.includes('death\'s guard') || n.includes('deaths guard')) {
    return `${base}images/items/sets/deaths_guard.gif`;
  }
  if (n.includes('死亡之觸') || n.includes('death\'s touch') || n.includes('deaths touch')) {
    return `${base}images/items/sets/deaths_touch.gif`;
  }

  // 哈斯拉的防禦 (Hsarus' Defense)
  if (n.includes('哈斯拉') || n.includes('hsarus')) {
    if (n.includes('鐵拳') || n.includes('iron fist') || slot === 'shield' || slot === 'offHand') return `${base}images/items/sets/hsarus_ironfist.gif`;
    if (n.includes('鐵蹄') || n.includes('iron heel') || slot === 'boots') return `${base}images/items/sets/hsarus_ironheel.gif`;
    if (n.includes('鐵帶') || n.includes('iron stay') || slot === 'belt') return `${base}images/items/sets/hsarus_ironstay.gif`;
  }

  // 依雷薩的華服 (Iratha's Finery)
  if (n.includes('依雷薩') || n.includes('iratha')) {
    if (n.includes('線圈') || n.includes('coil') || slot === 'helm') return `${base}images/items/sets/irathas_coil.gif`;
    if (n.includes('繩索') || n.includes('cord') || slot === 'belt') return `${base}images/items/sets/irathas_cord.gif`;
    if (n.includes('袖口') || n.includes('cuff') || slot === 'gloves') return `${base}images/items/sets/irathas_cuff.gif`;
    if (n.includes('領圈') || n.includes('collar') || slot === 'amulet') return `${base}images/items/sets/amu1.gif`;
  }

  // 地獄器具 (Infernal Tools)
  if (n.includes('地獄頭骨') || n.includes('infernal cranium')) {
    return `${base}images/items/sets/infernal_cranium.gif`;
  }
  if (n.includes('地獄之火') || n.includes('infernal torch')) {
    return `${base}images/items/sets/infernal_torch.gif`;
  }
  if (n.includes('地獄扣帶') || n.includes('infernal buckle')) {
    return `${base}images/items/sets/infernal_buckle.gif`;
  }

  // 北極裝備 (Arctic Gear)
  if (n.includes('北極') || n.includes('arctic')) {
    if (n.includes('毛皮') || n.includes('furs') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/arctic_furs.gif`;
    if (n.includes('角') || n.includes('horn') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/arctic_horn.gif`;
    if (n.includes('手套') || n.includes('mitts') || slot === 'gloves') return `${base}images/items/sets/arctic_mitts.gif`;
    if (n.includes('束帶') || n.includes('binding') || slot === 'belt') return `${base}images/items/sets/arctic_binding.gif`;
  }

  // 桑德的愚行 (Sander's Folly)
  if (n.includes('桑德') || n.includes('sander')) {
    if (n.includes('典範') || n.includes('paragon') || slot === 'helm') return `${base}images/items/sets/sanders_paragon.gif`;
    if (n.includes('迷信') || n.includes('superstition') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/sanders_superstition.gif`;
    if (n.includes('禁忌') || n.includes('taboo') || slot === 'gloves') return `${base}images/items/sets/sanders_taboo.gif`;
    if (n.includes('碎岩') || n.includes('riprap') || slot === 'boots') return `${base}images/items/sets/sanders_riprap.gif`;
  }

  // 譚克雷的戰裝 (Tancred's Battlegear)
  if (n.includes('譚克雷') || n.includes('tancred')) {
    if (n.includes('脊骨') || n.includes('spine') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/tancreds_spine.gif`;
    if (n.includes('骷髏') || n.includes('skull') || slot === 'helm') return `${base}images/items/sets/tancreds_skull.gif`;
    if (n.includes('烏鴉嘴') || n.includes('crowbill') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/tancreds_crowbill.gif`;
    if (n.includes('大頭釘') || n.includes('釘鞋') || n.includes('hobnails') || slot === 'boots') return `${base}images/items/sets/tancreds_hobnails.gif`;
    if (n.includes('怪異') || n.includes('weird') || slot === 'amulet') return `${base}images/items/sets/amu1.gif`;
  }

  // 維達拉的裝備 (Vidala's Rig)
  if (n.includes('維達拉') || n.includes('vidala')) {
    if (n.includes('伏擊') || n.includes('ambush') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/vidalas_ambush.gif`;
    if (n.includes('倒鉤') || n.includes('barb') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/vidalas_barb.gif`;
    if (n.includes('步態') || n.includes('fetlock') || slot === 'boots') return `${base}images/items/sets/vidalas_fetlock.gif`;
    if (n.includes('抓取') || n.includes('snare') || slot === 'amulet') return `${base}images/items/sets/amu1.gif`;
  }

  // 奧瑟娜的標誌 (Arcanna's Sign)
  if (n.includes('奧瑟娜') || n.includes('arcanna')) {
    if (n.includes('肉體') || n.includes('flesh') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/arcannas_flesh.gif`;
    if (n.includes('頭') || n.includes('head') || slot === 'helm') return `${base}images/items/sets/arcannas_head.gif`;
    if (n.includes('魔杖') || n.includes('deathwand') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/arcannas_deathwand.gif`;
    if (n.includes('徽記') || n.includes('sign') || slot === 'amulet') return `${base}images/items/sets/amu2.gif`;
  }

  // 牛魔王之皮 (Cow King's Leathers)
  if (n.includes('牛魔王') || n.includes('cow king')) {
    if (n.includes('皮') || n.includes('hide') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/cowkings_hide.gif`;
    if (n.includes('角') || n.includes('horns') || slot === 'helm') return `${base}images/items/sets/cowkings_horns.gif`;
    if (n.includes('蹄') || n.includes('hooves') || slot === 'boots') return `${base}images/items/sets/cowkings_hooves.gif`;
  }

  // 米拉伯佳的君威 (Milabrega's Regalia)
  if (n.includes('米拉伯佳') || n.includes('milabrega')) {
    if (n.includes('長袍') || n.includes('robe') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/milabregas_robe.gif`;
    if (n.includes('冠冕') || n.includes('diadem') || slot === 'helm') return `${base}images/items/sets/milabregas_diadem.gif`;
    if (n.includes('權杖') || n.includes('rod') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/milabregas_rod.gif`;
    if (n.includes('寶珠') || n.includes('orb') || slot === 'shield' || slot === 'offHand') return `${base}images/items/sets/milabregas_orb.gif`;
  }

  // 娜吉的古代遺物 (Naj's Ancient Vestige)
  if (n.includes('娜吉') || n.includes('naj')) {
    if (n.includes('輕甲') || n.includes('light plate') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/najs_light_plate.gif`;
    if (n.includes('圓環') || n.includes('circlet') || slot === 'helm') return `${base}images/items/sets/najs_circlet.gif`;
    if (n.includes('謎題') || n.includes('puzzler') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/najs_puzzler.gif`;
  }

  // 沙薩比的偉大貢獻 (Sazabi's Grand Tribute)
  if (n.includes('沙薩比') || n.includes('sazabi')) {
    if (n.includes('解放者') || n.includes('liberator') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/sazabis_ghost_liberator.gif`;
    if (n.includes('護套') || n.includes('sheath') || slot === 'helm') return `${base}images/items/sets/sazabis_mental_sheath.gif`;
    if (n.includes('救贖') || n.includes('redeemer') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/sazabis_cobalt_redeemer.gif`;
  }

  // 惠寧的威嚴 (Hwanin's Majesty)
  if (n.includes('惠寧') || n.includes('華寧') || n.includes('hwanin')) {
    if (n.includes('庇護') || n.includes('refuge') || slot === 'armor' || slot === 'chest') return `${base}images/items/sets/hwanins_refuge.gif`;
    if (n.includes('光輝') || n.includes('splendor') || slot === 'helm') return `${base}images/items/sets/hwanins_splendor.gif`;
    if (n.includes('公正') || n.includes('justice') || slot === 'weapon' || slot === 'mainHand') return `${base}images/items/sets/hwanins_justice.gif`;
    if (n.includes('祝福') || n.includes('blessing') || slot === 'belt') return `${base}images/items/sets/hwanins_blessing.gif`;
  }

  // 天堂信徒 (Heaven's Brethren)
  if (n.includes('翁達爾的全能') || n.includes('ondal\'s almighty') || n.includes('ondals almighty')) {
    return `${base}images/items/sets/ondals_almighty.gif`;
  }
  if (n.includes('海默蘇的堅毅') || n.includes('haemosu\'s adament') || n.includes('haemosus adament')) {
    return `${base}images/items/sets/haemosus_adament.gif`;
  }
  if (n.includes('太白之榮耀') || n.includes('taebaek\'s glory') || n.includes('taebaeks glory')) {
    return `${base}images/items/sets/taebaeks_glory.gif`;
  }
  if (n.includes('丹古的教誨') || n.includes('dangoon\'s teaching') || n.includes('dangoons teaching')) {
    return `${base}images/items/sets/dangoons_teaching.gif`;
  }

  // RotW DLC: 貝恩的衣裝
  if (n.includes('貝恩') || n.includes('bane\'s') || n.includes('banes')) {
    if (n.includes('風帽') || n.includes('hood') || slot === 'helm') return `${base}images/items/bases/demonhead.gif`;
    if (n.includes('法袍') || n.includes('robe') || slot === 'armor' || slot === 'chest') return `${base}images/items/bases/leather.gif`;
    return `${base}images/items/bases/demonhead.gif`;
  }

  // RotW DLC: 赫拉森的輝煌
  if (n.includes('赫拉森') || n.includes('horazon')) {
    if (n.includes('冠冕') || n.includes('diadem') || slot === 'helm') return `${base}images/items/bases/diadem.gif`;
    if (n.includes('裹屍布') || n.includes('shroud') || slot === 'armor' || slot === 'chest') return `${base}images/items/bases/leather.gif`;
    return `${base}images/items/bases/demonhead.gif`;
  }

  // ──────────────────────────────────────────────
  // 5. 知名暗金專屬圖示 (Unique Items Prominent Sprites)
  // ──────────────────────────────────────────────

  // --- 飾品：戒指 (Rings) ---
  if (n.includes('喬丹') || n.includes('stone of jordan') || /\bsoj\b/.test(n)) {
    return `${base}images/items/uniques/the_stone_of_jordan.gif`;
  }
  if (n.includes('烏鴉之霜') || n.includes('raven frost')) {
    return `${base}images/items/uniques/raven_frost.gif`;
  }
  if (n.includes('布爾凱索的結婚戒指') || n.includes('婚戒') || n.includes('wedding band')) {
    return `${base}images/items/uniques/bul_kathos_wedding_band.gif`;
  }
  if (n.includes('拿各') || n.includes('nagelring')) {
    return `${base}images/items/uniques/ring1.gif`;
  }
  if (n.includes('自然') || n.includes('和平') || n.includes('nature\'s peace') || n.includes('natures peace')) {
    return `${base}images/items/uniques/ring2.gif`;
  }
  if (n.includes('矮人之星') || n.includes('矮人') || n.includes('dwarf star')) {
    return `${base}images/items/uniques/ring4.gif`;
  }
  if (n.includes('鬼火投射者') || n.includes('鬼火') || n.includes('wisp projector')) {
    return `${base}images/items/uniques/ring5.gif`;
  }

  // --- 飾品：項鍊 (Amulets) ---
  if (n.includes('馬拉') || n.includes('mara\'s kaleidoscope') || n.includes('maras kaleidoscope') || n.includes('kaleidoscope')) {
    return `${base}images/items/uniques/maras_kaleidoscope.gif`;
  }
  if (n.includes('大君之怒') || n.includes('大君') || n.includes('highlord\'s wrath') || n.includes('highlords wrath')) {
    return `${base}images/items/uniques/highlords_wrath.gif`;
  }
  if (n.includes('貓眼') || n.includes('cat\'s eye') || n.includes('cats eye')) {
    return `${base}images/items/uniques/amu1.gif`;
  }
  if (n.includes('艾利屈') || n.includes('etlich')) {
    return `${base}images/items/uniques/amu1.gif`;
  }
  if (n.includes('旭日東昇') || n.includes('旭日') || n.includes('rising sun')) {
    return `${base}images/items/uniques/amu2.gif`;
  }
  if (n.includes('金屬網格') || n.includes('metalgrid')) {
    return `${base}images/items/uniques/amu3.gif`;
  }
  if (n.includes('薩拉森') || n.includes('saracen')) {
    return `${base}images/items/uniques/amu2.gif`;
  }
  if (n.includes('諾科藍') || n.includes('nokozan')) {
    return `${base}images/items/uniques/amu3.gif`;
  }
  if (n.includes('熾天使') || n.includes('seraph')) {
    return `${base}images/items/uniques/amu2.gif`;
  }
  if ((n.includes('亞特瑪') || n.includes('atma')) && (slot === 'amulet' || n.includes('聖甲蟲') || n.includes('scarab'))) {
    return `${base}images/items/uniques/amu1.gif`;
  }

  // --- 頭盔 (Helms) ---
  if (n.includes('軍帽') || n.includes('諧角之冠') || n.includes('harlequin crest') || /\bshako\b/.test(n)) {
    return `${base}images/items/uniques/harlequin_crest.gif`;
  }
  if (n.includes('年紀之冠') || n.includes('歲月之冠') || n.includes('crown of ages') || /\bcoa\b/.test(n)) {
    return `${base}images/items/uniques/crown_of_ages.gif`;
  }
  if (n.includes('夜翼面紗') || n.includes('夜翼') || n.includes('nightwing')) {
    return `${base}images/items/uniques/nightwings_veil.gif`;
  }
  if (n.includes('巨骷髏') || n.includes('giant skull')) {
    return `${base}images/items/uniques/giant_skull.gif`;
  }
  if (n.includes('塔恩頭盔') || n.includes('tarnhelm')) {
    return `${base}images/items/uniques/tarnhelm.gif`;
  }
  if (n.includes('榮耀頭巾') || n.includes('coif of glory')) {
    return `${base}images/items/uniques/coifofglory.gif`;
  }
  if (n.includes('暮光深處') || n.includes('duskdeep')) {
    return `${base}images/items/uniques/duskdeep.gif`;
  }
  if (n.includes('狼嚎長牙') || n.includes('howltusk')) {
    return `${base}images/items/uniques/howltusk.gif`;
  }
  if (n.includes('不死皇冠') || n.includes('undead crown')) {
    return `${base}images/items/uniques/undeadcrown.gif`;
  }
  if (n.includes('蠕蟲頭骨') || n.includes('wormskull')) {
    return `${base}images/items/uniques/wormskull.gif`;
  }
  if (n.includes('獅鷲之眼') || n.includes('格利風') || n.includes('griffon')) {
    return `${base}images/items/bases/diadem.gif`;
  }
  if (n.includes('安達利爾的面容') || n.includes('安頭') || n.includes('andariel')) {
    return `${base}images/items/bases/demonhead.gif`;
  }
  if (n.includes('奇拉的守護') || n.includes('奇拉圈') || n.includes('kira')) {
    return `${base}images/items/bases/tiara.gif`;
  }
  if (n.includes('吸血鬼的凝視') || n.includes('vampire gaze')) {
    return `${base}images/items/bases/bonehelm.gif`;
  }
  if (n.includes('盜賊皇冠') || n.includes('crown of thieves')) {
    return `${base}images/items/bases/crown.gif`;
  }
  if (n.includes('亞瑞特的面容') || n.includes('arreat')) {
    return `${base}images/items/bases/arreats_face.gif`;
  }
  if (n.includes('加爾的長髮') || n.includes('加拉爾') || n.includes('jalal') || n.includes('ialal')) {
    return `${base}images/items/bases/ialals_mane.gif`;
  }
  if (n.includes('烏鴉之王') || n.includes('ravenlore')) {
    return `${base}images/items/bases/spiritmask.gif`;
  }
  if (n.includes('黑角面具') || n.includes('blackhorn')) {
    return `${base}images/items/bases/mask.gif`;
  }

  // --- 腰帶 (Belts) ---
  if (n.includes('蛛網腰帶') || n.includes('蛛網織帶') || n.includes('arachnid mesh') || ((n.includes('蛛網') || n.includes('蜘蛛之網')) && slot !== 'boots' && !n.includes('靴'))) {
    return `${base}images/items/uniques/arachnid_mesh.gif`;
  }
  if (n.includes('雷神之力') || n.includes('雷神腰帶') || n.includes('thundergod')) {
    return `${base}images/items/uniques/thundergods_vigor.gif`;
  }
  if (n.includes('金色包袱') || n.includes('金包') || n.includes('goldwrap')) {
    return `${base}images/items/uniques/goldwrap.gif`;
  }
  if (n.includes('刀鋒扣帶') || n.includes('bladebuckle')) {
    return `${base}images/items/uniques/bladebuckle.gif`;
  }
  if (n.includes('夜煙') || n.includes('nightsmoke')) {
    return `${base}images/items/uniques/nightsmoke.gif`;
  }
  if (n.includes('蛇繩') || n.includes('snakecord')) {
    return `${base}images/items/uniques/snakecord.gif`;
  }
  if (n.includes('長串之耳') || n.includes('物免腰帶') || n.includes('string of ears')) {
    return `${base}images/items/bases/belt.gif`;
  }
  if (n.includes('穿刺腰帶') || n.includes('穿心') || n.includes('razortail')) {
    return `${base}images/items/bases/lightbelt.gif`;
  }
  if (n.includes('雪之衝突') || n.includes('snowclash')) {
    return `${base}images/items/bases/heavybelt.gif`;
  }
  if (n.includes('維爾登戈') || n.includes('心結腰帶') || n.includes('verdungo')) {
    return `${base}images/items/bases/girdle.gif`;
  }
  if (n.includes('吸血聖王之圈') || n.includes('吸血鬼之聖') || n.includes('nosferatu')) {
    return `${base}images/items/bases/heavybelt.gif`;
  }

  // --- 手套 (Gloves) ---
  if (n.includes('法師之拳') || n.includes('法拳') || n.includes('magefist')) {
    return `${base}images/items/uniques/magefist.gif`;
  }
  if (n.includes('霜燃') || n.includes('frostburn')) {
    return `${base}images/items/uniques/frostburn.gif`;
  }
  if (n.includes('運氣守護') || n.includes('運氣手套') || n.includes('chance guards')) {
    return `${base}images/items/uniques/chanceguards.gif`;
  }
  if (n.includes('血拳') || n.includes('bloodfist')) {
    return `${base}images/items/uniques/bloodfist.gif`;
  }
  if (n.includes('布洛克之手') || n.includes('the hand of broc') || n.includes('hand of broc')) {
    return `${base}images/items/uniques/thehandofbroc.gif`;
  }
  if (n.includes('鋼鐵手甲') || n.includes('steelrend')) {
    return `${base}images/items/bases/gauntlets.gif`;
  }
  if (n.includes('熔岩角羊') || n.includes('lava gout')) {
    return `${base}images/items/bases/chaingloves.gif`;
  }
  if (n.includes('卓古拉之握') || n.includes('卓古拉') || n.includes('dracul')) {
    return `${base}images/items/bases/heavygloves.gif`;
  }

  // --- 靴子 (Boots) ---
  if (n.includes('戰爭旅者') || n.includes('戰旅') || n.includes('war traveler')) {
    return `${base}images/items/uniques/war_traveler.gif`;
  }
  if (n.includes('蝕肉騎士') || n.includes('蝕肉') || n.includes('gore rider')) {
    return `${base}images/items/uniques/gore_rider.gif`;
  }
  if (n.includes('哥布林腳趾') || n.includes('小妖精腳趾') || n.includes('goblin toe')) {
    return `${base}images/items/uniques/goblintoe.gif`;
  }
  if (n.includes('熱刺') || n.includes('hotspur')) {
    return `${base}images/items/uniques/hotspur.gif`;
  }
  if (n.includes('淚之臀') || n.includes('tearhaunch')) {
    return `${base}images/items/uniques/tearhaunch.gif`;
  }
  if (n.includes('庫頓之趾') || n.includes('treads of cthon')) {
    return `${base}images/items/uniques/treadsofcthon.gif`;
  }
  if (n.includes('血腳') || n.includes('gorefoot')) {
    return `${base}images/items/uniques/gorefoot.gif`;
  }
  if (n.includes('水上飄') || n.includes('waterwalk')) {
    return `${base}images/items/bases/leatherboots.gif`;
  }
  if (n.includes('沙暴之旅') || n.includes('沙暴') || n.includes('sandstorm trek')) {
    return `${base}images/items/bases/chainboots.gif`;
  }
  if (n.includes('骨髓行走') || n.includes('骨髓') || n.includes('marrowwalk')) {
    return `${base}images/items/bases/plateboots.gif`;
  }
  if (n.includes('紗織') || n.includes('silkweave')) {
    return `${base}images/items/bases/chainboots.gif`;
  }
  if (n.includes('影舞者') || n.includes('shadow dancer')) {
    return `${base}images/items/bases/lightplateboots.gif`;
  }
  if (n.includes('地獄闊步') || n.includes('infernostride')) {
    return `${base}images/items/bases/leatherboots.gif`;
  }

  // --- 盾牌 (Shields) ---
  if (n.includes('暴風之盾') || n.includes('物免盾') || n.includes('stormshield')) {
    return `${base}images/items/uniques/stormshield.gif`;
  }
  if (n.includes('飾金盾') || n.includes('薩卡蘭姆使者') || n.includes('撒卡蘭姆使者') || n.includes('herald of zakarum')) {
    return `${base}images/items/uniques/herald_of_zakarum.gif`;
  }
  if (n.includes('侏儒') || n.includes('荷曼庫魯斯') || n.includes('homunculus')) {
    return `${base}images/items/bases/homunculus.gif`;
  }
  if (n.includes('鋼鐵碰撞') || n.includes('steelclash')) {
    return `${base}images/items/uniques/steelclash.gif`;
  }
  if (n.includes('守衛') && (slot === 'shield' || slot === 'offHand' || n.includes('the ward'))) {
    return `${base}images/items/uniques/theward.gif`;
  }
  if (n.includes('無眼之牆') || n.includes('wall of the eyeless')) {
    return `${base}images/items/uniques/walloftheeyeless.gif`;
  }
  if (n.includes('布維利特') || n.includes('bverrit keep')) {
    return `${base}images/items/uniques/bverritkeep.gif`;
  }
  if (n.includes('佩爾塔盧納塔') || n.includes('pelta lunata')) {
    return `${base}images/items/uniques/peltalunata.gif`;
  }
  if (n.includes('暴風公會') || n.includes('stormguild')) {
    return `${base}images/items/uniques/stormguild.gif`;
  }
  if (n.includes('劍背堡壘') || n.includes('swordback hold')) {
    return `${base}images/items/uniques/swordbackhold.gif`;
  }
  if (n.includes('陰影之盤') || n.includes('umbral disk')) {
    return `${base}images/items/uniques/umbraldisk.gif`;
  }
  if (n.includes('警戒之牆') || n.includes('lidless wall')) {
    return `${base}images/items/bases/boneshield.gif`;
  }
  if (n.includes('獵頭者的榮耀') || n.includes('head hunter')) {
    return `${base}images/items/bases/spikedshield.gif`;
  }
  if (n.includes('暗影精靈') || n.includes('血王之骨') || n.includes('darkforce spawn')) {
    return `${base}images/items/bases/unravellerhead.gif`;
  }

  // --- 護甲 (Armor) ---
  if (n.includes('黃金之皮') || n.includes('goldskin')) {
    return `${base}images/items/uniques/goldskin.gif`;
  }
  if (n.includes('冰雪眨眼') || n.includes('iceblink')) {
    return `${base}images/items/uniques/iceblink.gif`;
  }
  if (n.includes('震動籠牢') || n.includes('rattlecage')) {
    return `${base}images/items/uniques/rattlecage.gif`;
  }
  if (n.includes('鷹爪') && (slot === 'armor' || slot === 'chest' || n.includes('hawkmail'))) {
    return `${base}images/items/uniques/hawkmail.gif`;
  }
  if (n.includes('岩石羊毛') || n.includes('rockfleece')) {
    return `${base}images/items/uniques/rockfleece.gif`;
  }
  if (n.includes('抽動的掙扎') || n.includes('twitchthroe')) {
    return `${base}images/items/uniques/twitchthroe.gif`;
  }
  if (n.includes('閃爍蝙蝠的外貌') || n.includes('blinkbat')) {
    return `${base}images/items/uniques/blinkbatsform.gif`;
  }
  if (n.includes('白骨之肉') || n.includes('boneflesh')) {
    return `${base}images/items/uniques/boneflesh.gif`;
  }
  if (n.includes('暗黑之光') || n.includes('darkglow')) {
    return `${base}images/items/uniques/darkglow.gif`;
  }
  if (n.includes('灰色形態') || n.includes('greyform')) {
    return `${base}images/items/uniques/greyform.gif`;
  }
  if (n.includes('天堂法衣') || n.includes('heavenly garb')) {
    return `${base}images/items/uniques/heavenlygarb.gif`;
  }
  if (n.includes('閃光之甲') || n.includes('sparkling mail')) {
    return `${base}images/items/uniques/sparklingmail.gif`;
  }
  if (n.includes('百夫長') || n.includes('the centurion')) {
    return `${base}images/items/uniques/thecenturion.gif`;
  }
  if (n.includes('毒液防禦') || n.includes('venomsward')) {
    return `${base}images/items/uniques/venomsward.gif`;
  }
  if (n.includes('勝利之絲') || n.includes('victor\'s silk') || n.includes('victors silk')) {
    return `${base}images/items/uniques/victorssilk.gif`;
  }
  if (n.includes('蝮蛇法師之皮') || n.includes('蛇皮甲') || n.includes('vipermagi')) {
    return `${base}images/items/bases/leather.gif`;
  }
  if (n.includes('守護天使') || n.includes('ga甲') || n.includes('guardian angel')) {
    return `${base}images/items/bases/platemail.gif`;
  }
  if (n.includes('謝夫特斯坦布') || n.includes('物免甲') || n.includes('shaftstop')) {
    return `${base}images/items/bases/chainmail.gif`;
  }
  if (n.includes('詩寇蒂的憤怒') || n.includes('mf甲') || n.includes('skullder')) {
    return `${base}images/items/bases/chainmail.gif`;
  }
  if (n.includes('督瑞爾的殼') || n.includes('duriel\'s shell') || n.includes('duriels shell')) {
    return `${base}images/items/bases/breastplate.gif`;
  }
  if (n.includes('角鬥士的禍害') || n.includes('gladiator')) {
    return `${base}images/items/bases/gothicplate.gif`;
  }
  if (n.includes('奧瑪斯的長袍') || n.includes('ormus')) {
    return `${base}images/items/bases/leather.gif`;
  }
  if (n.includes('泰瑞爾的力量') || n.includes('tyrael')) {
    return `${base}images/items/bases/archon_plate.gif`;
  }
  if (n.includes('聖堂武士的力量') || n.includes('templar\'s might') || n.includes('templars might')) {
    return `${base}images/items/bases/ancientarmor.gif`;
  }
  if (n.includes('海王利維坦') || n.includes('leviathan')) {
    return `${base}images/items/bases/gothicplate.gif`;
  }
  if (n.includes('幽靈遮罩') || n.includes('spirit shroud')) {
    return `${base}images/items/bases/breastplate.gif`;
  }
  if (n.includes('靈魂熔爐') || n.includes('spirit forge')) {
    return `${base}images/items/bases/chainmail.gif`;
  }
  if (n.includes('幽靈守護者') || n.includes('spirit keeper')) {
    return `${base}images/items/bases/wolfhead.gif`;
  }

  // --- 武器 (Weapons) ---
  // 標槍與長槍 (Javelins & Amazon Spears) - 必須在弓之前判定，防止 matriarchal 誤判為弓
  if (n.includes('雷擊') || n.includes('thunderstroke')) {
    return `${base}images/items/bases/maidenjavelin.gif`;
  }
  if (n.includes('泰坦的復仇') || n.includes('titan\'s revenge') || n.includes('titans revenge')) {
    return `${base}images/items/bases/titans_revenge.gif`;
  }
  if (n.includes('萊坎德的側翼') || n.includes('lycander\'s flank') || n.includes('lycanders flank')) {
    return `${base}images/items/bases/lycanders_flank.gif`;
  }
  if (n.includes('萊坎德的瞄準') || n.includes('lycander\'s aim') || n.includes('lycanders aim')) {
    return `${base}images/items/bases/lycanders_aim.gif`;
  }

  // 連枷與權杖
  if (n.includes('暴風之結') || n.includes('stormlash')) {
    return `${base}images/items/bases/flail.gif`;
  }
  if (n.includes('天堂之光') || n.includes('heaven\'s light') || n.includes('heavens light') || n.includes('救贖者') || n.includes('the redeemer')) {
    return `${base}images/items/bases/warscepter.gif`;
  }
  if (n.includes('巴拉那之星') || n.includes('baranar')) {
    return `${base}images/items/bases/morningstar.gif`;
  }
  if (n.includes('謝夫之錘') || n.includes('schaefer')) {
    return `${base}images/items/bases/warhammer.gif`;
  }

  // 專屬暗金匕首與劍
  if (n.includes('海鷗') || /\bgull\b/.test(n)) {
    return `${base}images/items/uniques/gull.gif`;
  }
  if (n.includes('掘墓者') || n.includes('the diggler') || n.includes('diggler')) {
    return `${base}images/items/uniques/thediggler.gif`;
  }
  if (n.includes('翠玉短劍') || n.includes('jade tan do')) {
    return `${base}images/items/uniques/thejadetando.gif`;
  }
  if (n.includes('幽靈碎片') || n.includes('spectral shard')) {
    return `${base}images/items/uniques/spectralshard.gif`;
  }
  if (n.includes('銳克特的尖銳') || n.includes('rixot\'s keen') || n.includes('rixots keen')) {
    return `${base}images/items/uniques/rixotskeen.gif`;
  }
  if (n.includes('血月') || n.includes('blood crescent')) {
    return `${base}images/items/uniques/bloodcrescent.gif`;
  }
  if (n.includes('克林茲之串') || n.includes('skewer of krintiz')) {
    return `${base}images/items/uniques/skewerofkrintiz.gif`;
  }
  if (n.includes('亮光之鐮') || n.includes('gleamscythe')) {
    return `${base}images/items/uniques/gleamscythe.gif`;
  }
  if (n.includes('格里斯瓦德之刃') || n.includes('griswold\'s edge') || n.includes('griswolds edge')) {
    return `${base}images/items/uniques/griswoldsedge.gif`;
  }
  if (n.includes('地獄瘟疫') || n.includes('hellplague')) {
    return `${base}images/items/uniques/hellplague.gif`;
  }
  if (n.includes('庫爾文的焦點') || n.includes('culwen\'s point') || n.includes('culwens point')) {
    return `${base}images/items/uniques/culwenspoint.gif`;
  }
  if (n.includes('暗影之牙') || n.includes('shadowfang')) {
    return `${base}images/items/uniques/shadowfang.gif`;
  }
  if (n.includes('靈魂剝離') || n.includes('soulflay')) {
    return `${base}images/items/uniques/soulflay.gif`;
  }
  if (n.includes('基尼米爾之錐') || n.includes('kinemil\'s awl') || n.includes('kinemils awl')) {
    return `${base}images/items/uniques/kinemilsawl.gif`;
  }
  if (n.includes('黑舌') || n.includes('blacktongue')) {
    return `${base}images/items/uniques/blacktongue.gif`;
  }
  if (n.includes('撕裂鋸') || n.includes('ripsaw')) {
    return `${base}images/items/uniques/ripsaw.gif`;
  }
  if (n.includes('族長') || n.includes('the patriarch')) {
    return `${base}images/items/uniques/thepatriarch.gif`;
  }
  if (n.includes('碧藍怒火') || n.includes('青色憤怒') || n.includes('azurewrath')) {
    return `${base}images/items/uniques/azurewrath.gif`;
  }
  if (n.includes('光之軍刀') || n.includes('光刀') || n.includes('lightsabre')) {
    return `${base}images/items/bases/phase_blade.gif`;
  }
  if (n.includes('祖父') || n.includes('the grandfather')) {
    return `${base}images/items/bases/colossus_blade.gif`;
  }
  if (n.includes('毀滅之刃') || n.includes('doombringer')) {
    return `${base}images/items/bases/colossus_blade.gif`;
  }
  if (n.includes('死亡之刀') || n.includes('death cleaver')) {
    return `${base}images/items/bases/berserker_axe.gif`;
  }
  if (n.includes('巫師之刺') || n.includes('小怪刺') || n.includes('wizardspike')) {
    return `${base}images/items/bases/dagger.gif`;
  }
  if (n.includes('阿里巴巴之刃') || n.includes('ali baba')) {
    return `${base}images/items/bases/crystalsword.gif`;
  }
  if (n.includes('巴特克的咽喉') || n.includes('巴爪') || n.includes('bartuc')) {
    return `${base}images/items/bases/bartucs_cutthroat.gif`;
  }

  // 專屬暗金斧
  if (n.includes('磨齒者') || n.includes('the gnasher')) {
    return `${base}images/items/uniques/thegnasher.gif`;
  }
  if (n.includes('死亡鐵鏟') || n.includes('deathspade')) {
    return `${base}images/items/uniques/deathspade.gif`;
  }
  if (n.includes('刀鋒之骨') || n.includes('bladebone')) {
    return `${base}images/items/uniques/bladebone.gif`;
  }
  if (n.includes('心靈撕裂') || n.includes('mindrend')) {
    return `${base}images/items/uniques/mindrend.gif`;
  }
  if (n.includes('耙痕') || n.includes('rakescar')) {
    return `${base}images/items/uniques/rakescar.gif`;
  }
  if (n.includes('費克馬之斧') || n.includes('fechmar')) {
    return `${base}images/items/uniques/axeoffechmar.gif`;
  }
  if (n.includes('凝血鏟') || n.includes('goreshovel')) {
    return `${base}images/items/uniques/goreshovel.gif`;
  }
  if (n.includes('酋長') || n.includes('the chieftain') || n.includes('chieftain')) {
    return `${base}images/items/uniques/thechieftan.gif`;
  }
  if (n.includes('斷腦者') || n.includes('brainhew')) {
    return `${base}images/items/uniques/brainhew.gif`;
  }
  if (n.includes('龐大之斧') || n.includes('the humongous') || n.includes('humongous')) {
    return `${base}images/items/uniques/thehumongous.gif`;
  }
  if (n.includes('破骨') || n.includes('bonehew')) {
    return `${base}images/items/bases/poleaxe.gif`;
  }

  // 專屬暗金錘與棍棒
  if (n.includes('碎骨凸緣') || n.includes('crushflange')) {
    return `${base}images/items/uniques/crushflange.gif`;
  }
  if ((n.includes('碎骨') && !n.includes('凸緣')) || n.includes('bonesnap')) {
    return `${base}images/items/uniques/bonesnap.gif`;
  }
  if (n.includes('鋼鐵驅馳') || n.includes('steeldriver')) {
    return `${base}images/items/uniques/steeldriver.gif`;
  }
  if (n.includes('伐木橡木') || n.includes('felloak')) {
    return `${base}images/items/uniques/felloak.gif`;
  }
  if (n.includes('粗釘') || n.includes('stoutnail')) {
    return `${base}images/items/uniques/stoutnail.gif`;
  }
  if (n.includes('血升') || n.includes('bloodrise')) {
    return `${base}images/items/uniques/bloodrise.gif`;
  }
  if (n.includes('坦杜里加將軍') || n.includes('tan do li ga')) {
    return `${base}images/items/uniques/thegeneralstandoliga.gif`;
  }
  if (n.includes('鐵石') || n.includes('ironstone')) {
    return `${base}images/items/uniques/ironstone.gif`;
  }

  // 專屬暗金長柄與長矛
  if (n.includes('迪莫克的砍刀') || n.includes('dimoak')) {
    return `${base}images/items/uniques/dimoakshew.gif`;
  }
  if (n.includes('鋼鐵刺棒') || n.includes('steelgoad')) {
    return `${base}images/items/uniques/steelgoad.gif`;
  }
  if (n.includes('靈魂收割者') || n.includes('soul harvest')) {
    return `${base}images/items/uniques/soulharvest.gif`;
  }
  if (n.includes('戰役之枝') || n.includes('battlebranch')) {
    return `${base}images/items/uniques/battlebranch.gif`;
  }
  if (n.includes('悲慘之杖') || n.includes('woestave')) {
    return `${base}images/items/uniques/woestave.gif`;
  }
  if (n.includes('嚴酷收割者') || n.includes('the grim reaper')) {
    return `${base}images/items/uniques/thegrimreaper.gif`;
  }
  if (n.includes('死神的喪鐘') || n.includes('reaper\'s toll') || n.includes('reapers toll')) {
    return `${base}images/items/bases/thresher.gif`;
  }
  if (n.includes('盜墓者') || n.includes('tomb reaver')) {
    return `${base}images/items/bases/thresher.gif`;
  }
  if (n.includes('宏森丹') || n.includes('hone sundan')) {
    return `${base}images/items/bases/spear.gif`;
  }
  if (n.includes('水魔陷阱') || n.includes('kelpie snare')) {
    return `${base}images/items/bases/thresher.gif`;
  }

  // 專屬暗金法杖與魔杖
  if (n.includes('災難之灰') || n.includes('bane ash')) {
    return `${base}images/items/uniques/baneash.gif`;
  }
  if (n.includes('蛇王') || n.includes('serpent lord')) {
    return `${base}images/items/uniques/serpentlord.gif`;
  }
  if (n.includes('拉薩路之尖頂') || n.includes('lazarus')) {
    return `${base}images/items/uniques/spireoflazarus.gif`;
  }
  if (n.includes('沙羅曼達') || n.includes('the salamander')) {
    return `${base}images/items/uniques/thesalamander.gif`;
  }
  if (n.includes('鐵棒') || n.includes('iron jang bong')) {
    return `${base}images/items/uniques/theironiangbong.gif`;
  }
  if (n.includes('艾羅之火炬') || n.includes('torch of iro') || n.includes('iro\'s torch')) {
    return `${base}images/items/uniques/torchofiro.gif`;
  }
  if (n.includes('漩渦') || n.includes('maelstrom')) {
    return `${base}images/items/uniques/maelstrom.gif`;
  }
  if (n.includes('雕骨') || n.includes('gravenspine')) {
    return `${base}images/items/uniques/gravenspine.gif`;
  }
  if (n.includes('尤姆的悲嘆') || n.includes('ume\'s lament') || n.includes('umes lament')) {
    return `${base}images/items/uniques/umeslament.gif`;
  }
  if (n.includes('李奧瑞克王的武器') || n.includes('李奧瑞克') || n.includes('arm of king leoric')) {
    return `${base}images/items/bases/bonewand.gif`;
  }
  if (n.includes('自殺支系') || n.includes('suicide branch')) {
    return `${base}images/items/bases/bonewand.gif`;
  }
  if (n.includes('死亡之網') || n.includes('破隱') || n.includes('death\'s web')) {
    return `${base}images/items/bases/bonewand.gif`;
  }
  if (n.includes('眼球') || n.includes('渦流水晶') || n.includes('the oculus') || /\boculus\b/.test(n)) {
    return `${base}images/items/bases/the_oculus.gif`;
  }
  if (n.includes('怪異之球') || n.includes('艾斯屈塔') || n.includes('eschuta')) {
    return `${base}images/items/bases/claspedorb.gif`;
  }
  if (n.includes('次元碎片') || n.includes('death\'s fathom') || n.includes('fathom')) {
    return `${base}images/items/bases/dragonstone.gif`;
  }
  if (n.includes('肋骨粉碎者') || n.includes('敲肋棒') || n.includes('ribcracker')) {
    return `${base}images/items/bases/battlestaff.gif`;
  }

  // 專屬暗金弓與十字弓
  if (n.includes('拔眼') || n.includes('pluckeye')) {
    return `${base}images/items/uniques/pluckeye.gif`;
  }
  if (n.includes('枯萎之弦') || n.includes('witherstring')) {
    return `${base}images/items/uniques/witherstring.gif`;
  }
  if (n.includes('烏鴉之爪') || n.includes('raven\'s claw') || n.includes('ravens claw')) {
    return `${base}images/items/uniques/ravensclaw.gif`;
  }
  if (n.includes('蘿格之弓') || n.includes('rogue\'s bow') || n.includes('rogues bow')) {
    return `${base}images/items/uniques/roguesbow.gif`;
  }
  if (n.includes('暴風打擊') || n.includes('stormstrike')) {
    return `${base}images/items/uniques/stormstrike.gif`;
  }
  if (n.includes('凋零') || n.includes('wizendraw')) {
    return `${base}images/items/uniques/wizendraw.gif`;
  }
  if (n.includes('地獄拍擊') || n.includes('hellclap')) {
    return `${base}images/items/uniques/hellclap.gif`;
  }
  if (n.includes('爆裂吠叫') || n.includes('blastbark')) {
    return `${base}images/items/uniques/blastbark.gif`;
  }
  if (n.includes('鉛烏鴉') || n.includes('leadcrow')) {
    return `${base}images/items/uniques/leadcrow.gif`;
  }
  if (n.includes('膿汁之刺') || n.includes('ichorsting')) {
    return `${base}images/items/uniques/ichorsting.gif`;
  }
  if (n.includes('地獄投擲') || n.includes('hellcast')) {
    return `${base}images/items/uniques/hellcast.gif`;
  }
  if (n.includes('末日彈弓') || n.includes('doomslinger')) {
    return `${base}images/items/uniques/doomslinger.gif`;
  }
  if (n.includes('布理撒') || n.includes('大砲') || n.includes('buriza')) {
    return `${base}images/items/bases/crossbow.gif`;
  }
  if (n.includes('狂野之弦') || n.includes('witchwild string')) {
    return `${base}images/items/bases/shortbattlebow.gif`;
  }
  if (n.includes('風之力') || n.includes('windforce')) {
    return `${base}images/items/bases/hydra_bow.gif`;
  }

  // ──────────────────────────────────────────────
  // 6. 知名符文之語專屬預設底材 (Runewords Specific Fallbacks)
  // ──────────────────────────────────────────────
  if (n.includes('謎團') || /\benigma\b/.test(n) || n.includes('剛毅') || /\bfortitude\b/.test(n)) {
    return `${base}images/items/bases/archon_plate.gif`;
  }
  if (slot !== 'belt' && (n.includes('無限') || /\binfinity\b/.test(n) || n.includes('眼光') || /\binsight\b/.test(n) || n.includes('驕傲') || (/\bpride\b/.test(n) && !n.includes('wilhelm')) || n.includes('遵從') || /\bobedience\b/.test(n))) {
    return `${base}images/items/bases/thresher.gif`;
  }
  if (n.includes('悔恨') || /\bgrief\b/.test(n)) {
    return `${base}images/items/bases/phase_blade.gif`;
  }
  if (n.includes('最後希望') || n.includes('last wish')) {
    return `${base}images/items/bases/colossus_blade.gif`;
  }
  if (n.includes('信心') || /\bfaith\b/.test(n) || (n.includes('冰凍') && !n.includes('冰凍之')) || /\bruneword ice\b/.test(n)) {
    return `${base}images/items/bases/hydra_bow.gif`;
  }
  if (n.includes('連枷') || n.includes('橡樹之心') || /\bhoto\b/.test(n)) {
    return `${base}images/items/bases/flail.gif`;
  }
  if (n.includes('戰爭召喚') || /\bcta\b/.test(n) || n.includes('call to arms')) {
    return `${base}images/items/bases/crystalsword.gif`;
  }
  if (n.includes('流亡') || /\bexile\b/.test(n)) {
    return `${base}images/items/bases/sacred_targe.gif`;
  }
  if (n.includes('馬賽克') || /\bmosaic\b/.test(n) || n.includes('混沌') || /\bchaos\b/.test(n)) {
    return `${base}images/items/bases/claws.gif`;
  }
  if (n.includes('白骨') || (/\bwhite\b/.test(n) && (rarity === 'runeword' || !slot))) {
    return `${base}images/items/bases/bonewand.gif`;
  }
  if (n.includes('野獸') || n.includes('末日') || ((/\bbeast\b/.test(n) || /\bdoom\b/.test(n)) && (rarity === 'runeword' || !slot))) {
    return `${base}images/items/bases/berserker_axe.gif`;
  }
  if (n.includes('精神') || /\bspirit\b/.test(n)) {
    if (slot !== 'armor' && slot !== 'chest' && slot !== 'helm') {
      if (slot === 'shield' || slot === 'offHand' || n.includes('盾')) {
        return `${base}images/items/bases/monarch.gif`;
      }
      return `${base}images/items/bases/crystalsword.gif`;
    }
  }
  if (n.includes('榮耀之鏈') || /\bcoh\b/.test(n) || n.includes('chains of honor') || ((n.includes('煙霧') || /\bsmoke\b/.test(n) || n.includes('背叛') || /\btreachery\b/.test(n) || n.includes('幽譽') || /\bduress\b/.test(n)) && (rarity === 'runeword' || slot === 'armor' || !slot))) {
    return `${base}images/items/bases/archon_plate.gif`;
  }

  // ──────────────────────────────────────────────
  // 7. 底材語意關鍵字對應 (Semantic Base Lexicon)
  // 依照部位優先順序：手套/靴子/腰帶 -> 十字弓 -> 標槍 -> 弓 -> 德魯伊頭/盾/長柄 -> 護甲 -> 武器
  // ──────────────────────────────────────────────

  // --- 手套 (Gloves) ---
  const isGloveContext = slot === 'gloves' || n.includes('手套') || n.includes('gloves') || n.includes('gauntlets') || n.includes('bracers');
  if (isGloveContext) {
    if (n.includes('重手套') || n.includes('heavy gloves')) return `${base}images/items/bases/heavygloves.gif`;
    if (n.includes('鎖子手套') || n.includes('chain gloves')) return `${base}images/items/bases/chaingloves.gif`;
    if (n.includes('皮手套') || n.includes('leather gloves')) return `${base}images/items/bases/leathergloves.gif`;
    if (n.includes('輕型鐵手套') || n.includes('light gauntlets')) return `${base}images/items/bases/lightgauntlets.gif`;
    if (n.includes('食人魔') || n.includes('ogre gauntlets') || n.includes('鐵手套') || n.includes('gauntlet')) return `${base}images/items/bases/gauntlets.gif`;
    return `${base}images/items/bases/heavygloves.gif`;
  }

  // --- 靴子 (Boots) ---
  const isBootContext = slot === 'boots' || n.includes('靴') || n.includes('鞋') || n.includes('boots') || n.includes('greaves');
  if (isBootContext) {
    if (n.includes('輕鋼靴') || n.includes('light plated boots') || n.includes('light plate boots') || n.includes('蛛網靴')) return `${base}images/items/bases/lightplateboots.gif`;
    if (n.includes('皮靴') || n.includes('leather boots') || n.includes('鯊皮') || n.includes('惡魔皮靴')) return `${base}images/items/bases/leatherboots.gif`;
    if (n.includes('重靴') || n.includes('heavy boots')) return `${base}images/items/bases/heavyboots.gif`;
    if (n.includes('鎖子靴') || n.includes('chain boots') || n.includes('網格之靴') || n.includes('食人魔之靴') || n.includes('scarabshell')) return `${base}images/items/bases/chainboots.gif`;
    if (n.includes('板甲靴') || n.includes('plate boots') || n.includes('骸骨之靴')) return `${base}images/items/bases/plateboots.gif`;
    return `${base}images/items/bases/leatherboots.gif`;
  }

  // --- 腰帶 (Belts) ---
  const isBeltContext = slot === 'belt' || n.includes('腰帶') || n.includes('belt') || n.includes('sash') || n.includes('girdle');
  if (isBeltContext) {
    if (n.includes('重腰帶') || n.includes('heavy belt') || n.includes('戰鬥腰帶')) return `${base}images/items/bases/heavybelt.gif`;
    if (n.includes('輕扣帶') || n.includes('light belt') || n.includes('鯊皮腰帶')) return `${base}images/items/bases/lightbelt.gif`;
    if (n.includes('扣帶') || n.includes('sash') || n.includes('魔皮腰帶')) return `${base}images/items/bases/belt.gif`;
    if (n.includes('飾帶') || n.includes('girdle') || n.includes('秘儀腰帶')) return `${base}images/items/bases/girdle.gif`;
    return `${base}images/items/bases/heavybelt.gif`;
  }

  // --- 十字弓 (Crossbows) ---
  if (n.includes('十字弓') || n.includes('弩') || n.includes('crossbow') || n.includes('chu-ko-nu') || n.includes('ballista')) {
    if (n.includes('重十字弓') || n.includes('heavy crossbow') || n.includes('巨神十字弓') || n.includes('ballista')) return `${base}images/items/bases/heavycrossbow.gif`;
    if (n.includes('輕十字弓') || n.includes('light crossbow')) return `${base}images/items/bases/lightcrossbow.gif`;
    if (n.includes('連發十字弓') || n.includes('repeating crossbow')) return `${base}images/items/bases/repeatingcrossbow.gif`;
    return `${base}images/items/bases/crossbow.gif`;
  }

  // --- 標槍 (Javelins & Spears) ---
  if (n.includes('標槍') || n.includes('javelin') || n.includes('女家長標槍') || n.includes('matriarchal javelin') || n.includes('女長槍') || n.includes('maiden javelin')) {
    return `${base}images/items/bases/maidenjavelin.gif`;
  }

  // --- 弓 (Bows) ---
  if (n.includes('弓') || /\bbow\b/.test(n) || n.includes('遠程武器')) {
    if (n.includes('長弓') || n.includes('long bow') || n.includes('大院長之弓')) return `${base}images/items/bases/longbow.gif`;
    if (n.includes('短弓') || n.includes('short bow') || n.includes('短戰鬥弓')) return `${base}images/items/bases/shortbattlebow.gif`;
    if (n.includes('複合弓') || n.includes('composite bow')) return `${base}images/items/bases/compositebow.gif`;
    if (n.includes('獵弓') || n.includes('hunters bow')) return `${base}images/items/bases/huntersbow.gif`;
    return `${base}images/items/bases/hydra_bow.gif`;
  }

  // --- 德魯伊專用頭盔 (Druid Pelts) ---
  if (n.includes('狼頭') || n.includes('德魯伊') || /\bwolf\b/.test(n) || n.includes('鹿角') || n.includes('antlers') || n.includes('天球') || n.includes('sky spirit')) {
    if (n.includes('鹿角') || n.includes('antlers')) return `${base}images/items/bases/antlers.gif`;
    if (n.includes('天球') || n.includes('sky spirit')) return `${base}images/items/bases/spiritmask.gif`;
    return `${base}images/items/bases/wolfhead.gif`;
  }

  // --- 盾牌 (Shields) ---
  if (n.includes('神聖小盾') || n.includes('sacred targe') || n.includes('聖騎士') || n.includes('paladin shield') || n.includes('亞特瑪') || n.includes('庫拉斯特') || n.includes('撒卡蘭姆')) {
    return `${base}images/items/bases/sacred_targe.gif`;
  }
  if (n.includes('統治者大盾') || n.includes('monarch')) {
    return `${base}images/items/bases/monarch.gif`;
  }
  if (n.includes('骨盾') || n.includes('boneshield')) {
    return `${base}images/items/bases/boneshield.gif`;
  }
  if (n.includes('巨魔巢穴') || n.includes('troll nest')) {
    return `${base}images/items/bases/spikedshield.gif`;
  }
  if (n.includes('血王之骨') || n.includes('bloodlord skull') || n.includes('死靈盾') || n.includes('demonhead') || n.includes('preserved head')) {
    return `${base}images/items/bases/demonhead.gif`;
  }
  if (n.includes('魔典') || n.includes('tome') || n.includes('grimoire')) {
    return `${base}images/items/bases/demonhead.gif`;
  }
  if (n.includes('盾牌') || n.includes('shield') || slot === 'shield' || slot === 'offHand') {
    return `${base}images/items/bases/monarch.gif`;
  }

  // --- 衣服 / 胸甲 (Armors) ---
  if (n.includes('執政官') || n.includes('archon plate') || n.includes('神聖盔甲') || n.includes('sacred armor') || n.includes('漆甲') || n.includes('lacquered plate')) {
    return `${base}images/items/bases/archon_plate.gif`;
  }
  if (n.includes('蛇皮甲') || n.includes('serpentskin') || n.includes('灰暮') || n.includes('dusk shroud') || n.includes('皮甲') || /\bleather\b/.test(n)) {
    return `${base}images/items/bases/leather.gif`;
  }
  if (n.includes('法師鎧甲') || n.includes('mage plate') || n.includes('輕型裝甲') || (n.includes('light plate') && !n.includes('boots'))) {
    return `${base}images/items/bases/lightplate.gif`;
  }
  if (n.includes('環甲') || n.includes('ring mail') || n.includes('ringmail')) {
    return `${base}images/items/bases/ringmail.gif`;
  }
  if (n.includes('鎖子甲') || n.includes('chain mail') || n.includes('mesh armor') || n.includes('羅瑟戰甲') || n.includes('russet armor')) {
    return `${base}images/items/bases/chainmail.gif`;
  }
  if (n.includes('海妖') || n.includes('kraken shell') || n.includes('鋼絲絨') || n.includes('wire fleece') || n.includes('哥德') || n.includes('gothic plate')) {
    return `${base}images/items/bases/gothicplate.gif`;
  }
  if (n.includes('胸甲') || n.includes('breast plate') || n.includes('cuirass') || n.includes('護胸甲')) {
    return `${base}images/items/bases/breastplate.gif`;
  }
  if (n.includes('全鎧甲') || n.includes('full plate') || n.includes('古代裝甲') || n.includes('ancient armor') || n.includes('聖堂武士聖衣')) {
    return `${base}images/items/bases/ancientarmor.gif`;
  }
  if (n.includes('胸甲') || n.includes('body armor') || n.includes('盔甲') || slot === 'armor' || slot === 'chest') {
    return `${base}images/items/bases/breastplate.gif`;
  }

  // --- 武器 (Weapons) ---
  if (n.includes('長柄') || n.includes('polearm') || n.includes('銳利之斧') || n.includes('thresher') || n.includes('巨長斧') || n.includes('cryptic') || n.includes('巨神之斧') || n.includes('巨型長柄斧') || n.includes('神秘之斧') || n.includes('食人魔之斧') || n.includes('ogre axe')) {
    return `${base}images/items/bases/thresher.gif`;
  }
  if (n.includes('長矛') || n.includes('spear') || n.includes('pike') || n.includes('yari') || n.includes('幽靈長矛')) {
    return `${base}images/items/bases/spear.gif`;
  }
  if (n.includes('爪') || n.includes('claw') || n.includes('katar') || n.includes('talon')) {
    return `${base}images/items/bases/claws.gif`;
  }
  if (n.includes('魔杖') || n.includes('wand')) {
    return `${base}images/items/bases/bonewand.gif`;
  }
  if (n.includes('法杖') || n.includes('staff') || n.includes('staves') || n.includes('四門棍') || n.includes('quarterstaff')) {
    return `${base}images/items/bases/battlestaff.gif`;
  }
  if (n.includes('狂戰士之斧') || n.includes('berserker axe') || n.includes('斧') || /\baxe\b/.test(n)) {
    return `${base}images/items/bases/berserker_axe.gif`;
  }
  if (n.includes('連枷') || n.includes('flail') || n.includes('天罰之錘') || n.includes('scourge')) {
    return `${base}images/items/bases/flail.gif`;
  }
  if (n.includes('權杖') || n.includes('scepter') || n.includes('強威權杖') || n.includes('mighty scepter')) {
    return `${base}images/items/bases/warscepter.gif`;
  }
  if (n.includes('鐵鎚') || n.includes('hammer') || n.includes('maul') || n.includes('流星錘') || n.includes('morning star')) {
    return `${base}images/items/bases/warhammer.gif`;
  }
  if (n.includes('匕首') || n.includes('dagger') || n.includes('骸骨小刀') || n.includes('bone knife')) {
    return `${base}images/items/bases/dagger.gif`;
  }
  if (n.includes('幻化之刃') || n.includes('phase blade')) {
    return `${base}images/items/bases/phase_blade.gif`;
  }
  if (n.includes('巨神之刃') || n.includes('colossus blade') || n.includes('雙手劍') || n.includes('two-handed')) {
    return `${base}images/items/bases/colossus_blade.gif`;
  }
  if (n.includes('水晶劍') || n.includes('crystal sword') || n.includes('劍') || /\bsword\b/.test(n) || slot === 'weapon' || slot === 'mainHand') {
    return `${base}images/items/bases/crystalsword.gif`;
  }

  // --- 頭盔 (Helms) ---
  if (n.includes('權冠') || n.includes('diadem') || n.includes('寶冠') || n.includes('coronet') || n.includes('頭冠') || n.includes('circlet') || n.includes('三重冠') || n.includes('tiara')) {
    return `${base}images/items/bases/diadem.gif`;
  }
  if (n.includes('皇冠') || n.includes('crown') || n.includes('大皇冠')) {
    return `${base}images/items/bases/crown.gif`;
  }
  if (n.includes('角盔') || n.includes('野蠻人') || n.includes('barbarian helm') || n.includes('avenger guard') || n.includes('殺手防護面甲')) {
    return `${base}images/items/bases/avengerguard.gif`;
  }
  if (n.includes('骨盔') || n.includes('面具') || n.includes('mask') || n.includes('bone helm') || n.includes('死亡面具')) {
    return `${base}images/items/bases/bonehelm.gif`;
  }
  if (n.includes('頭盔') || n.includes('helm') || slot === 'helm') {
    return `${base}images/items/bases/crown.gif`;
  }

  // --- 飾品 (Jewelry) ---
  if (n.includes('戒指') || (/\bring\b/.test(n) && !n.includes('ring mail') && !n.includes('ringmail')) || slot === 'ring' || slot === 'ring1' || slot === 'ring2') {
    return `${base}images/items/uniques/ring1.gif`;
  }
  if (n.includes('項鍊') || n.includes('amulet') || slot === 'amulet') {
    return `${base}images/items/uniques/amu1.gif`;
  }

  // ──────────────────────────────────────────────
  // 8. 槽位保險底線回退 (Slot-based Safe Fallbacks)
  // ──────────────────────────────────────────────
  switch (slot) {
    case 'helm':
      return `${base}images/items/bases/crown.gif`;
    case 'armor':
    case 'chest':
      return `${base}images/items/bases/breastplate.gif`;
    case 'weapon':
    case 'mainHand':
      return `${base}images/items/bases/crystalsword.gif`;
    case 'shield':
    case 'offHand':
      return `${base}images/items/bases/monarch.gif`;
    case 'gloves':
      return `${base}images/items/bases/heavygloves.gif`;
    case 'boots':
      return `${base}images/items/bases/leatherboots.gif`;
    case 'belt':
      return `${base}images/items/bases/heavybelt.gif`;
    case 'ring':
    case 'ring1':
    case 'ring2':
      return `${base}images/items/uniques/ring1.gif`;
    case 'amulet':
      return `${base}images/items/uniques/amu1.gif`;
    case 'charm':
      return `${base}images/items/charms/gheeds.gif`;
    case 'jewel':
      return `${base}images/items/jewels/lightning.gif`;
    default:
      return `${base}images/items/bases/crystalsword.gif`;
  }
}
