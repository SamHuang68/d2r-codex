import skillTabsZh from '../data/game/skillTabs.json';
import skillTabsEn from '../data/game/skillTabsEn.json';
import { propInEnglish } from '../data/propsEn';
import { MERCENARIES_EN } from '../data/mercenariesEn';
import { QUESTS_EN, WORLD_EVENTS_EN } from '../data/questsEn';
import skillDescEn from '../data/skills/skillDescEn.json';
import { CLASS_ZH_TO_EN } from '../engine/slots';
import { RUNES_DATA } from '../data/runes';
import { actZh } from './actLabel';
import { RUNEWORDS_DATA } from '../data/runewords';
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA, ALL_SET_PIECES } from '../data/setItems';
import { CUBE_RECIPES_DATA } from '../data/cubeRecipes';
import { getAllCraftedRecipes } from '../data/codex/craftedItems';
import { AREA_LEVELS_DATA } from '../data/areaLevels';
import { MERCENARIES_DATA } from '../data/mercenaries';
import { VALUATION_ITEMS_DATA } from '../data/affixes';
import { UBER_TRISTRAM_GUIDE } from '../data/uberBosses';
import { SKILLS_DATA } from '../data/skills';
import { BASE_ITEMS_DATA } from '../data/bases';
import { QUESTS_DATA, WORLD_EVENTS_DATA } from '../data/quests';
import { CHARACTER_CLASSES_DATA } from '../data/classes';
import { CLASS_TRANSLATIONS } from '../data/classTranslations';
import { 
  GEMS_DATA, 
  UBER_KEYS_ORGANS_DATA, 
  ESSENCES_DATA, 
  COMBAT_POTIONS_DATA, 
  CHARMS_JEWELS_DATA 
} from '../data/props';
import { normalizeItemQuery, cleanSearchQuery } from './itemQueryNormalizer';

const treeNamesEn = new Map(Object.entries(skillTabsZh).flatMap(([code, names]) => names.map((name, i) => [name, (skillTabsEn as Record<string, string[]>)[code][i]] as const)));
const englishTree = (name: string) => treeNamesEn.get(name) ?? name;
const englishItemName = (name: string) => {
  const item = [...RUNEWORDS_DATA, ...UNIQUE_ITEMS_DATA, ...BASE_ITEMS_DATA].find(x => x.name === name || x.nameEn === name || name.startsWith(`${x.name} (`));
  return item ? item.nameEn + (name.includes('需無形') ? ' (Ethereal required)' : '') : name;
};
const baseTypesEn: Record<string, string> = {"武器鑲材": "Weapon Base", "鎧甲防具": "Armor", "亞馬遜專用弓": "Amazon Bow", "單手劍": "One-Handed Sword", "單手斧": "One-Handed Axe", "聖騎士專用盾": "Paladin Shield", "輕型盾牌": "Light Shield", "輕型鎧甲": "Light Armor", "重型鎧甲": "Heavy Armor", "長柄武器": "Polearm", "長矛 (2.4可做符文語)": "Spear (runewords supported since 2.4)", "雙手劍 (野蠻人可單手)": "Two-Handed Sword (Barbarians can use one-handed)"};
const immunityEn: Record<string, string> = {"冰寒免疫": "Cold Immune", "冰寒免疫 (指環鬼)": "Cold Immune (Oblivion Knights)", "各波次不同 (五波僕從)": "Varies by wave (five minion waves)", "各類免疫 (山克)": "Various immunities (Shenk)", "各類混合免疫": "Mixed immunities", "寒冷免疫 (艾德瑞奇)": "Cold Immune (Eldritch)", "毒素免疫": "Poison Immune", "火焰免疫": "Fire Immune", "火焰免疫 (偶爾)": "Fire Immune (occasional)", "火焰免疫 (毒魔領主)": "Fire Immune (Venom Lords)", "火焰免疫 (瘸子長老)": "Fire Immune (Council Members)", "無原生免疫 (非金怪)": "No native immunities (non-unique monsters)", "物理免疫 (偶爾)": "Physical Immune (occasional)", "物理免疫 (幽靈)": "Physical Immune (Ghosts)", "閃電免疫": "Lightning Immune", "閃電免疫 (Lightning)": "Lightning Immune", "閃電免疫 (偶爾)": "Lightning Immune (occasional)", "閃電免疫 (暴風施術者)": "Lightning Immune (Storm Casters)"};
const englishElement = (name: string) => immunityEn[name] ?? name;

export interface SearchResultItem {
  id: string;
  type: 'runeword' | 'unique' | 'set' | 'rune' | 'cube' | 'area' | 'mercenary' | 'valuation' | 'uber' | 'skill' | 'base' | 'quest' | 'prop' | 'character' | 'monster' | 'affix' | 'shrine' | 'exp';
  title: string;
  titleEn: string;
  category: string;
  badge: string;
  preview: string;
  targetTab: string;
}

export const searchOmni = (query: string, isEn = false): SearchResultItem[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];
  const seenIds = new Set<string>();

  // 0. Priority exact match via Query Normalizer (Aliases & Community jargon)
  const queryCandidates = cleanSearchQuery(query);
  for (const cand of queryCandidates) {
    const normalized = normalizeItemQuery(cand);
    if (!normalized || seenIds.has(normalized.id)) continue;

    if (normalized.type === 'runeword') {
      const rw = RUNEWORDS_DATA.find(r => r.id === normalized.id);
      if (rw) {
        seenIds.add(rw.id);
        results.push({
          id: rw.id,
          type: 'runeword',
          title: rw.name,
          titleEn: rw.nameEn,
          category: isEn ? `Runeword (${rw.sockets} sockets: ${rw.runes.join(' + ')})` : `符文之語 (${rw.sockets}孔: ${rw.runes.join(' + ')})`,
          badge: (isEn ? 'Best Match' : '最佳匹配'),
          preview: (isEn ? rw.attributesEn ?? rw.attributes : rw.attributes).slice(0, 3).join(' | '),
          targetTab: 'runewords'
        });
      }
    } else if (normalized.type === 'unique') {
      const uq = UNIQUE_ITEMS_DATA.find(u => u.id === normalized.id);
      if (uq) {
        seenIds.add(uq.id);
        results.push({
          id: uq.id,
          type: 'unique',
          title: uq.name,
          titleEn: uq.nameEn,
          category: isEn ? `Unique (${uq.baseItemEn ?? uq.baseItem})` : `暗金裝備 (${uq.baseItem})`,
          badge: (isEn ? 'Best Match' : '最佳匹配'),
          preview: (isEn ? uq.attributesEn ?? uq.attributes : uq.attributes).slice(0, 3).join(' | '),
          targetTab: 'items'
        });
      }
    } else if (normalized.type === 'set') {
      const piece = ALL_SET_PIECES.find(p => p.id === normalized.id);
      if (piece) {
        seenIds.add(piece.id);
        const parentSet = SET_ITEMS_DATA.find(s => s.pieces.some(p => p.id === piece.id));
        results.push({
          id: piece.id,
          type: 'set',
          title: piece.name,
          titleEn: piece.nameEn,
          category: isEn ? `Set Piece (${parentSet?.nameEn ?? 'Set'})` : `套裝部件 (${parentSet ? parentSet.name : '套裝'})`,
          badge: (isEn ? 'Best Match' : '最佳匹配'),
          preview: (isEn ? piece.attributesEn ?? piece.attributes : piece.attributes).slice(0, 3).join(' | '),
          targetTab: 'items'
        });
      } else {
        const set = SET_ITEMS_DATA.find(s => s.id === normalized.id);
        if (set) {
          seenIds.add(set.id);
          results.push({
            id: set.id,
            type: 'set',
            title: set.name,
            titleEn: set.nameEn,
            category: isEn ? `Set (${set.pieces.length} pieces)` : `套裝組合 (${set.pieces.length} 件套)`,
            badge: (isEn ? 'Best Match' : '最佳匹配'),
            preview: (set.fullBonuses && set.fullBonuses.length > 0)
              ? (isEn ? set.fullBonusesEn ?? set.fullBonuses : set.fullBonuses).slice(0, 3).join(' | ')
              : set.pieces.map(p => isEn ? p.nameEn : p.name).join('、'),
            targetTab: 'items'
          });
        }
      }
    } else if (normalized.type === 'base') {
      const base = BASE_ITEMS_DATA.find(b => b.id === normalized.id);
      if (base) {
        seenIds.add(base.id);
        results.push({
          id: base.id,
          type: 'base',
          title: base.name,
          titleEn: base.nameEn,
          category: isEn ? `Base Item (${base.category} · up to ${base.maxSockets} sockets)` : `符文底材 (${base.category} · 最多${base.maxSockets}孔)`,
          badge: (isEn ? 'Best Match' : '最佳匹配'),
          preview: (base.recommendedRunewords && base.recommendedRunewords.length > 0)
            ? (isEn ? `Recommended Runewords: ${base.recommendedRunewords.slice(0, 3).map(englishItemName).join(', ')}` : `推薦符文語: ${base.recommendedRunewords.slice(0, 3).join(', ')}`)
            : (isEn ? `Required Strength: ${base.reqStr || 0} · Dexterity: ${base.reqDex || 0} · Max Sockets: ${base.maxSockets}` : `要求力量: ${base.reqStr || 0} · 敏捷: ${base.reqDex || 0} · 最大孔數: ${base.maxSockets}`),
          targetTab: 'bases'
        });
      }
    }
  }

  const queryTerms = cleanSearchQuery(query).map(t => t.toLowerCase().trim()).filter(Boolean);

  // 1. Search Runewords
  for (const rw of RUNEWORDS_DATA) {
    if (seenIds.has(rw.id)) continue;
    const textToMatch = [
      rw.name,
      rw.nameEn,
      rw.nameClassic || '',
      rw.runes.join(' '),
      rw.allowedBases.join(' '),
      rw.tags.join(' '),
      rw.attributes.join(' '),
      rw.description || ''
    ].join(' ').toLowerCase();

    if (queryTerms.some(term => textToMatch.includes(term))) {
      seenIds.add(rw.id);
      results.push({
        id: rw.id,
        type: 'runeword',
        title: rw.name,
        titleEn: rw.nameEn,
        category: isEn ? `Runeword (${rw.sockets} sockets: ${rw.runes.join(' + ')})` : `符文之語 (${rw.sockets}孔: ${rw.runes.join(' + ')})`,
        badge: rw.isNewDLC ? 'RotW DLC' : (rw.ladderOnly ? (isEn ? 'Ladder Only' : '天梯專用') : (isEn ? 'Runeword' : '符文之語')),
        preview: (isEn ? rw.attributesEn ?? rw.attributes : rw.attributes).slice(0, 3).join(' | '),
        targetTab: 'runewords'
      });
    }
  }

  // 2. Search Unique Items
  for (const item of UNIQUE_ITEMS_DATA) {
    if (seenIds.has(item.id)) continue;
    const textToMatch = [
      item.name,
      item.nameEn,
      item.nameClassic || '',
      item.baseItem,
      item.baseItemEn || '',
      item.attributes.join(' '),
      (item.tags || []).join(' ')
    ].join(' ').toLowerCase();

    if (queryTerms.some(term => textToMatch.includes(term))) {
      seenIds.add(item.id);
      results.push({
        id: item.id,
        type: 'unique',
        title: item.name,
        titleEn: item.nameEn,
        category: isEn ? `Unique (${item.baseItemEn ?? item.baseItem})` : `暗金裝備 (${item.baseItem})`,
        badge: item.isNewDLC ? 'RotW DLC' : (isEn ? 'Unique' : '獨特暗金'),
        preview: (isEn ? item.attributesEn ?? item.attributes : item.attributes).slice(0, 3).join(' | '),
        targetTab: 'items'
      });
    }
  }

  // 3. Search Set Items
  for (const set of SET_ITEMS_DATA) {
    if (seenIds.has(set.id)) continue;
    const setMatch = (set.name + ' ' + set.nameEn).toLowerCase().includes(q);
    if (setMatch) {
      seenIds.add(set.id);
      results.push({
        id: set.id,
        type: 'set',
        title: set.name,
        titleEn: set.nameEn,
        category: isEn ? `Set (${set.pieces.length} pieces)` : `套裝裝備 (${set.pieces.length} 件套)`,
        badge: (isEn ? 'Full Set' : '成套套裝'),
        preview: set.pieces.map(p => isEn ? p.nameEn : p.name).join('、'),
        targetTab: 'sets'
      });
    } else {
      for (const piece of set.pieces) {
        if (seenIds.has(piece.id)) continue;
        if ((piece.name + ' ' + piece.nameEn + ' ' + piece.attributes.join(' ')).toLowerCase().includes(q)) {
          seenIds.add(piece.id);
          results.push({
            id: piece.id,
            type: 'set',
            title: piece.name,
            titleEn: piece.nameEn,
            category: isEn ? `Set Piece (${set.nameEn})` : `套裝散件 (${set.name})`,
            badge: (isEn ? 'Set Item' : '綠色套裝'),
            preview: (isEn ? piece.attributesEn ?? piece.attributes : piece.attributes).slice(0, 3).join(' | '),
            targetTab: 'sets'
          });
        }
      }
    }
  }

  // 4. Search Runes
  for (const rune of RUNES_DATA) {
    const textToMatch = [
      rune.name,
      rune.nameEn,
      `#${rune.number}`,
      rune.weaponEffect,
      rune.armorHelmEffect,
      rune.shieldEffect
    ].join(' ').toLowerCase();

    if (textToMatch.includes(q)) {
      results.push({
        id: `rune_${rune.number}`,
        type: 'rune',
        title: `${rune.number}號 ${rune.name}`,
        titleEn: rune.nameEn,
        category: isEn ? `Rune (Lv ${rune.requiredLevel})` : `符文 (Lv ${rune.requiredLevel})`,
        badge: rune.number >= 26 ? (isEn ? 'High Rune' : '大號符文') : (rune.number >= 16 ? (isEn ? 'Mid Rune' : '中階符文') : (isEn ? 'Low Rune' : '初階符文')),
        preview: isEn ? `Weapon: ${rune.weaponEffectEn} | Shield: ${rune.shieldEffectEn}` : `武器: ${rune.weaponEffect} | 盾甲: ${rune.shieldEffect}`,
        targetTab: 'runes'
      });
    }
  }

  // 5. Search Cube Recipes
  for (const recipe of CUBE_RECIPES_DATA) {
    const textToMatch = [
      recipe.title,
      recipe.titleEn,
      recipe.category,
      recipe.inputs.join(' '),
      recipe.output,
      recipe.notes || ''
    ].join(' ').toLowerCase();

    if (textToMatch.includes(q)) {
      results.push({
        id: recipe.id,
        type: 'cube',
        title: recipe.title,
        titleEn: recipe.titleEn,
        category: isEn ? `Cube Recipe (${recipe.category})` : `方塊公式 (${recipe.category})`,
        badge: (isEn ? 'Cube Transmutation' : '方塊合成'),
        preview: isEn ? `${(recipe.inputsEn ?? recipe.inputs).join(' + ')} -> ${recipe.outputEn ?? recipe.output}` : `${recipe.inputs.join(' + ')} -> ${recipe.output}`,
        targetTab: 'cube'
      });
    }
  }

  // 5b. Search All 36 Crafted Items (Blood / Caster / Hit Power / Safety)
  for (const cr of getAllCraftedRecipes()) {
    const textToMatch = [
      cr.name,
      cr.nameEn,
      '手工合成 手工裝 橙裝 crafted',
      cr.bases.join(' '),
      cr.basesEn.join(' '),
      cr.runeName,
      cr.runeNameEn,
      cr.gemName,
      cr.gemNameEn,
      cr.fixedMods.join(' '),
      cr.fixedModsEn.join(' '),
    ].join(' ').toLowerCase();

    if (textToMatch.includes(q)) {
      results.push({
        id: `crafted_${cr.id}`,
        type: 'cube',
        title: cr.name,
        titleEn: cr.nameEn,
        category: isEn ? `Crafted Item (${cr.gemNameEn})` : `手工合成物品（${cr.gemName}）`,
        badge: cr.highlight ? (isEn ? cr.highlight.tagEn : cr.highlight.tag) : (isEn ? 'Crafted' : '橙色手工'),
        preview: isEn
          ? `${cr.basesEn.join('/')} + ${cr.runeNameEn} + ${cr.gemNameEn} | ${cr.fixedModsEn.join(', ')}`
          : `${cr.bases.join('／')} + ${cr.runeName} + ${cr.gemName} | ${cr.fixedMods.join('、')}`,
        targetTab: 'cube',
      });
    }
  }

  // 5c. Quick Guide Entries (Patch 3.4 / S16, Unique Upgrades, Leveling, Farming)
  const guideShortcuts: { id: string; keys: string; type: SearchResultItem['type']; title: string; titleEn: string; category: string; categoryEn: string; badge: string; badgeEn: string; preview: string; previewEn: string; targetTab: string }[] = [
    {
      id: 'guide_patches_s16',
      keys: 's16 s15 patch 3.4 3.3 版本改動 天梯第16季 天梯第15季 物品調整 更新',
      type: 'quest',
      title: '版本改動（Patch 3.3 / 3.4・天梯第 15、16 季）',
      titleEn: 'Patch Changes (Patch 3.3 / 3.4 · Ladder S15 & S16)',
      category: '版本改動',
      categoryEn: 'Patch Changes',
      badge: 'Patch 3.4 / S16',
      badgeEn: 'Patch 3.4 / S16',
      preview: '暗金、套裝與符文之語數值調整完整對照（含天梯第 16 季預覽）',
      previewEn: 'Complete balance changes to Uniques, Sets, and Runewords in Patches 3.3 & 3.4',
      targetTab: 'patches',
    },
    {
      id: 'guide_unique_upgrades',
      keys: '暗金升級 升級底材 無形升級 unique upgrades upping',
      type: 'unique',
      title: '暗金升級指南（一般→進階→菁英）',
      titleEn: 'Unique Upgrades Guide (Normal → Exceptional → Elite)',
      category: '裝備圖鑑',
      categoryEn: 'Equipment',
      badge: '升級分析',
      badgeEn: 'Upgrade Guide',
      preview: '哪些暗金值得方塊升級底材、防禦／傷害變化與無形建議',
      previewEn: 'Which uniques are worth upgrading in the Cube, defense/damage gains, and ethereal tips',
      targetTab: 'upgrades',
    },
    {
      id: 'guide_leveling_scenes',
      keys: '練等場景 練等 經驗懲罰 快速升級 leveling areas',
      type: 'area',
      title: '練等場景（依角色等級推薦不扣經驗區域）',
      titleEn: 'Leveling Areas (Full XP Zones by Character Level)',
      category: '英雄與加點',
      categoryEn: 'Heroes & Builds',
      badge: '練等指南',
      badgeEn: 'Leveling',
      preview: '輸入目前等級，直接找出三難度不被扣經驗的最佳練等場景',
      previewEn: 'Find areas with full XP efficiency for your current character level',
      targetTab: 'leveling',
    },
    {
      id: 'guide_farming_scenes',
      keys: '打寶場景 農裝 避開免疫 刷寶 farming areas mf',
      type: 'area',
      title: '打寶場景（依流派傷害避開免疫怪物）',
      titleEn: 'Farming Areas (Hell Zones Matched to Your Damage Type)',
      category: '戰役與終局',
      categoryEn: 'Campaign & Endgame',
      badge: '打寶推薦',
      badgeEn: 'Farming',
      preview: '依職業流派或主要元素，篩選地獄高階場景裡免疫最少的地方',
      previewEn: 'Filter high-level Hell areas with the fewest immunities for your build',
      targetTab: 'farming',
    },
  ];
  for (const g of guideShortcuts) {
    if (g.keys.includes(q) || g.title.toLowerCase().includes(q) || g.titleEn.toLowerCase().includes(q)) {
      results.push({
        id: g.id,
        type: g.type,
        title: g.title,
        titleEn: g.titleEn,
        category: isEn ? g.categoryEn : g.category,
        badge: isEn ? g.badgeEn : g.badge,
        preview: isEn ? g.previewEn : g.preview,
        targetTab: g.targetTab,
      });
    }
  }

  // 6. Search Areas & Terror Zones
  for (const area of AREA_LEVELS_DATA) {
    const textToMatch = [
      area.name,
      area.nameEn,
      `第${area.act}幕 ${actZh(area.act)}`,
      area.immunities.join(' '),
      area.chestsAndBosses || ''
    ].join(' ').toLowerCase();

    if (textToMatch.includes(q)) {
      results.push({
        id: `${area.act}_${area.nameEn.replace(/\s+/g, '_')}`,
        type: 'area',
        title: area.name,
        titleEn: area.nameEn,
        category: isEn ? `Act ${area.act} · Area Level ${area.areaLevel}` : `${actZh(area.act)} · 區域等級 Lv ${area.areaLevel}`,
        badge: area.isAlvl85 ? (isEn ? 'Level 85 Area' : 'Lv85 頂級場景') : (area.isTerrorZone ? (isEn ? 'Terror Zone' : '邪惡威脅區域') : (isEn ? 'Regular Area' : '常規場景')),
        preview: isEn ? `Immunities: ${area.immunities.map(englishElement).join(', ')} | ${area.chestsAndBossesEn ?? area.chestsAndBosses ?? ''}` : `免疫: ${area.immunities.join(', ')} | ${area.chestsAndBosses || ''}`,
        targetTab: 'areas'
      });
    }
  }

  // 7. Search Mercenaries & Builds
  for (const merc of MERCENARIES_DATA) {
    const mercText = [
      merc.name,
      merc.nameEn,
      merc.type,
      merc.nativeAurasOrSkills.join(' '),
      merc.description,
      merc.builds.map(b => `${b.name} ${b.role} ${b.weapon} ${b.helm} ${b.armor}`).join(' ')
    ].join(' ').toLowerCase();

    if (mercText.includes(q)) {
      results.push({
        id: merc.id,
        type: 'mercenary',
        title: merc.name,
        titleEn: merc.nameEn,
        category: isEn ? `Mercenary Guide (Act ${merc.act}: ${MERCENARIES_EN[merc.id]?.type ?? merc.type})` : `傭兵指南 (第 ${merc.act} 章: ${merc.type})`,
        badge: (isEn ? 'Mercenary Build' : '傭兵配置'),
        preview: (isEn ? MERCENARIES_EN[merc.id]?.builds ?? merc.builds : merc.builds).map(b => b.name).join(' | '),
        targetTab: 'mercenaries'
      });
    }
  }

  // 8. Search Valuation Trophy Items
  for (const item of VALUATION_ITEMS_DATA) {
    const valText = [
      item.name,
      item.nameEn,
      item.itemType,
      item.idealStats.join(' '),
      item.description,
      item.estimatedValue
    ].join(' ').toLowerCase();

    if (valText.includes(q)) {
      results.push({
        id: item.id,
        type: 'valuation',
        title: item.name,
        titleEn: item.nameEn,
        category: isEn ? `Valuation (${item.itemTypeEn ?? item.itemType})` : `鑑寶估價 (${item.itemType})`,
        badge: item.rarity === 'magic' ? (isEn ? 'Magic Trophy' : '極品藍裝') : (isEn ? 'Rare Trophy' : '極品黃裝'),
        preview: isEn ? `Perfect rolls: ${(item.idealStatsEn ?? item.idealStats).slice(0, 2).join(' | ')} | Value: ${item.estimatedValueEn ?? item.estimatedValue}` : `滿變: ${item.idealStats.slice(0, 2).join(' | ')} | 身價: ${item.estimatedValue}`,
        targetTab: 'valuation'
      });
    }
  }

  // 9. Search Uber Bosses & Tristram
  for (const st of UBER_TRISTRAM_GUIDE.steps) {
    const text = [st.title, st.boss, st.rewards, st.strategy, st.requirements.join(' ')].join(' ').toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: `uber_step_${st.step}`,
        type: 'uber',
        title: st.title,
        titleEn: st.titleEn ?? st.bossEn ?? st.boss,
        category: isEn ? `Uber Tristram (Step ${st.step})` : `紅門六王攻略 (第 ${st.step} 階段)`,
        badge: (isEn ? 'Hellfire Torch' : '地獄火炬'),
        preview: isEn ? `${st.rewardsEn} | Strategy: ${st.strategyEn}` : `${st.rewards} | 戰術: ${st.strategy}`,
        targetTab: 'uber'
      });
    }
  }

  // 10. Search Skills
  for (const group of SKILLS_DATA) {
    for (const tree of group.trees) {
      for (const sk of tree.skills) {
        const text = [
          sk.name,
          sk.nameEn,
          sk.characterClass,
          sk.tree,
          sk.description,
          sk.details,
          (sk.synergies || []).join(' '),
          (sk.aliases || []).join(' ')
        ].join(' ').toLowerCase();

        if (text.includes(q)) {
          results.push({
            id: sk.id,
            type: 'skill',
            title: sk.name,
            titleEn: sk.nameEn,
            category: isEn ? `${CLASS_ZH_TO_EN[sk.characterClass] ?? sk.characterClass} · ${englishTree(sk.tree)} (Lv ${sk.requiredLevel})` : `${sk.characterClass} · ${sk.tree} (Lv ${sk.requiredLevel})`,
            badge: (isEn ? 'Class Skill' : '職業技能'),
            preview: isEn ? (skillDescEn as Record<string, string>)[sk.id] ?? sk.description : sk.description,
            targetTab: 'skills'
          });
        }
      }
    }
  }

  // 11. Search Base Items
  for (const base of BASE_ITEMS_DATA) {
    if (seenIds.has(base.id)) continue;
    const text = [
      base.name,
      base.nameEn,
      base.nameClassic || '',
      base.category,
      base.itemType || '',
      (base.recommendedRunewords || []).join(' '),
      base.tacticalNotes || '',
      base.dropRecommendation || ''
    ].join(' ').toLowerCase();

    if (text.includes(q)) {
      results.push({
        id: base.id,
        type: 'base',
        title: base.name,
        titleEn: base.nameEn,
        category: isEn ? `Base Item (${base.category} · ${baseTypesEn[base.itemType ?? ''] ?? base.itemType ?? 'Equipment'} · up to ${base.maxSockets} sockets)` : `符文底材 (${base.category} · ${base.itemType || '裝備'} · 最多${base.maxSockets}孔)`,
        badge: isEn ? base.grade ?? 'Base' : base.qualityTier || base.grade || '底材',
        preview: (base.recommendedRunewords && base.recommendedRunewords.length > 0)
          ? (isEn ? `Recommended Runewords: ${base.recommendedRunewords.slice(0, 3).map(englishItemName).join(', ')}` : `推薦符文語: ${base.recommendedRunewords.slice(0, 3).join(', ')}`)
          : (isEn ? `Required Strength: ${base.reqStr || 0} · Dexterity: ${base.reqDex || 0} · Max Sockets: ${base.maxSockets}` : `要求力量: ${base.reqStr || 0} · 敏捷: ${base.reqDex || 0} · 最大孔數: ${base.maxSockets}`),
        targetTab: 'bases'
      });
    }
  }

  // 12. Search Quests & Events
  for (const quest of QUESTS_DATA) {
    const text = [
      quest.name,
      quest.nameEn,
      `第${quest.act}幕 ${actZh(quest.act)}`,
      quest.location,
      quest.summary,
      quest.tacticalTips,
      quest.permanentReward?.description || ''
    ].join(' ').toLowerCase();

    if (text.includes(q)) {
      results.push({
        id: quest.id,
        type: 'quest',
        title: quest.name,
        titleEn: quest.nameEn,
        category: isEn ? `Act ${quest.act} Quest ${quest.questNumber} (${QUESTS_EN[quest.id]?.location ?? quest.location})` : `${actZh(quest.act)} 任務 ${quest.questNumber} (${quest.location})`,
        badge: quest.permanentReward ? (isEn ? 'Permanent Reward' : '永久獎勵') : (quest.isMandatory ? (isEn ? 'Required Quest' : '主線必解') : (isEn ? 'Optional Quest' : '支線任務')),
        preview: isEn ? (quest.permanentReward ? QUESTS_EN[quest.id]?.rewardDesc : QUESTS_EN[quest.id]?.summary) ?? QUESTS_EN[quest.id]?.summary ?? quest.summary : quest.permanentReward ? quest.permanentReward.description : quest.summary,
        targetTab: 'quests'
      });
    }
  }

  for (const evt of WORLD_EVENTS_DATA) {
    const text = [evt.name, evt.nameEn, evt.location, evt.triggerCondition, evt.guide].join(' ').toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: evt.id,
        type: 'quest',
        title: evt.name,
        titleEn: evt.nameEn,
        category: isEn ? `World Event (${WORLD_EVENTS_EN[evt.id]?.location ?? evt.location})` : `終局世界事件 (${evt.location})`,
        badge: (isEn ? 'World Event' : '世界事件'),
        preview: isEn ? WORLD_EVENTS_EN[evt.id]?.guide ?? evt.guide : evt.guide,
        targetTab: 'quests'
      });
    }
  }

  // 13. Search Characters
  for (const cls of CHARACTER_CLASSES_DATA) {
    const classTr = CLASS_TRANSLATIONS[cls.id];
    const text = [
      cls.name,
      cls.nameEn,
      cls.title,
      classTr?.title || '',
      cls.description,
      classTr?.description || '',
      cls.skillTrees.map(t => t.name).join(' '),
      classTr?.skillTrees.map(t => t.name).join(' ') || '',
      cls.popularBuilds.map(b => b.name + ' ' + b.coreSkills).join(' '),
      classTr?.popularBuilds.map(b => b.name + ' ' + b.coreSkills).join(' ') || '',
    ].join(' ').toLowerCase();

    if (text.includes(q)) {
      results.push({
        id: cls.id,
        type: 'character',
        title: `${cls.name} (${cls.nameEn})`,
        titleEn: classTr?.title || cls.title,
        category: isEn ? `Class (${cls.isDLC ? 'RotW DLC' : 'Classic'})` : `英雄職業 (${cls.isDLC ? 'RotW DLC' : '經典原版'})`,
        badge: cls.isDLC ? 'RotW DLC' : (isEn ? '8 Classes' : '8大英雄'),
        preview: isEn ? classTr?.description ?? cls.description : cls.description,
        targetTab: 'characters'
      });
    }
  }

  // 14. Search Gems, Keys, Essences, Potions, Charms
  for (const gem of GEMS_DATA) {
    const text = [gem.name, gem.nameEn, gem.weaponEffect, gem.armorHelmEffect, gem.shieldEffect, gem.craftingUses.join(' ')].join(' ').toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: gem.id,
        type: 'prop',
        title: gem.name,
        titleEn: gem.nameEn,
        category: isEn ? `Perfect Gem (Lv ${gem.requiredLevel})` : `完美寶石 (Lv ${gem.requiredLevel})`,
        badge: (isEn ? 'Gem Crafting' : '寶石工藝'),
        preview: isEn ? `Shield: ${gem.shieldEffectEn} | Armor: ${gem.armorHelmEffectEn}` : `盾: ${gem.shieldEffect} | 甲: ${gem.armorHelmEffect}`,
        targetTab: 'props'
      });
    }
  }

  for (const key of UBER_KEYS_ORGANS_DATA) {
    const text = [key.name, key.nameEn, key.dropSource, key.location, key.description, key.tacticalTips].join(' ').toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: key.id,
        type: 'prop',
        title: key.name,
        titleEn: key.nameEn,
        category: isEn ? `Uber Relic (${propInEnglish(key).dropSource})` : `六王聖物 (${key.dropSource})`,
        badge: key.type === 'key' ? (isEn ? 'Portal Key' : '紅門鑰匙') : (isEn ? 'Organ / Trophy' : '魔王器官'),
        preview: isEn ? propInEnglish(key).tacticalTips : key.tacticalTips,
        targetTab: 'props'
      });
    }
  }

  for (const ess of ESSENCES_DATA) {
    const text = [ess.name, ess.nameEn, ess.bossSource, ess.location, ess.description].join(' ').toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: ess.id,
        type: 'prop',
        title: ess.name,
        titleEn: ess.nameEn,
        category: isEn ? `Essence (${propInEnglish(ess).bossSource})` : `四大精華 (${ess.bossSource})`,
        badge: (isEn ? 'Respec Essence' : '洗點精華'),
        preview: isEn ? propInEnglish(ess).description : ess.description,
        targetTab: 'props'
      });
    }
  }

  for (const pot of COMBAT_POTIONS_DATA) {
    const text = [pot.name, pot.nameEn, pot.effect, pot.hiddenMechanic || '', pot.proTips].join(' ').toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: pot.id,
        type: 'prop',
        title: pot.name,
        titleEn: pot.nameEn,
        category: isEn ? `Combat Utility (${pot.category})` : `戰鬥藥劑 (${pot.category})`,
        badge: (isEn ? 'Survival Utility' : '生存黑科技'),
        preview: isEn ? propInEnglish(pot).effect : pot.effect,
        targetTab: 'props'
      });
    }
  }

  for (const charm of CHARMS_JEWELS_DATA) {
    const text = [charm.name, charm.nameEn, charm.keyAttributes.join(' '), charm.guide].join(' ').toLowerCase();
    if (text.includes(q)) {
      results.push({
        id: charm.id,
        type: 'prop',
        title: charm.name,
        titleEn: charm.nameEn,
        category: isEn ? `Charm / Jewel (${charm.slot})` : `神級護身符 (${charm.slot})`,
        badge: `Tier ${charm.tradeValueTier}`,
        preview: (isEn ? propInEnglish(charm).keyAttributes : charm.keyAttributes).join(' | '),
        targetTab: 'props'
      });
    }
  }

  return results.slice(0, 30);
};
