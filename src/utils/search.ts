import { RUNES_DATA } from '../data/runes';
import { RUNEWORDS_DATA } from '../data/runewords';
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA, ALL_SET_PIECES } from '../data/setItems';
import { CUBE_RECIPES_DATA } from '../data/cubeRecipes';
import { AREA_LEVELS_DATA } from '../data/areaLevels';
import { MERCENARIES_DATA } from '../data/mercenaries';
import { VALUATION_ITEMS_DATA } from '../data/affixes';
import { UBER_TRISTRAM_GUIDE } from '../data/uberBosses';
import { SKILLS_DATA } from '../data/skills';
import { BASE_ITEMS_DATA } from '../data/bases';
import { QUESTS_DATA, WORLD_EVENTS_DATA } from '../data/quests';
import { CHARACTER_CLASSES_DATA } from '../data/classes';
import { 
  GEMS_DATA, 
  UBER_KEYS_ORGANS_DATA, 
  ESSENCES_DATA, 
  COMBAT_POTIONS_DATA, 
  CHARMS_JEWELS_DATA 
} from '../data/props';
import { normalizeItemQuery, cleanSearchQuery } from './itemQueryNormalizer';

export interface SearchResultItem {
  id: string;
  type: 'runeword' | 'unique' | 'set' | 'rune' | 'cube' | 'area' | 'mercenary' | 'valuation' | 'uber' | 'skill' | 'base' | 'quest' | 'prop' | 'character';
  title: string;
  titleEn: string;
  category: string;
  badge: string;
  preview: string;
  targetTab: string;
}

export const searchOmni = (query: string): SearchResultItem[] => {
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
          category: `符文之語 (${rw.sockets}孔: ${rw.runes.join(' + ')})`,
          badge: '最佳匹配',
          preview: rw.attributes.slice(0, 3).join(' | '),
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
          category: `暗金裝備 (${uq.baseItem})`,
          badge: '最佳匹配',
          preview: uq.attributes.slice(0, 3).join(' | '),
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
          category: `套裝部件 (${parentSet ? parentSet.name : '套裝'})`,
          badge: '最佳匹配',
          preview: piece.attributes.slice(0, 3).join(' | '),
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
            category: `套裝組合 (${set.pieces.length} 件套)`,
            badge: '最佳匹配',
            preview: (set.fullBonuses && set.fullBonuses.length > 0)
              ? set.fullBonuses.slice(0, 3).join(' | ')
              : set.pieces.map(p => p.name).join('、'),
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
          category: `符文底材 (${base.category} · 最多${base.maxSockets}孔)`,
          badge: '最佳匹配',
          preview: (base.recommendedRunewords && base.recommendedRunewords.length > 0)
            ? `推薦符文語: ${base.recommendedRunewords.slice(0, 3).join(', ')}`
            : `要求力量: ${base.reqStr || 0} · 敏捷: ${base.reqDex || 0} · 最大孔數: ${base.maxSockets}`,
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
        category: `符文之語 (${rw.sockets}孔: ${rw.runes.join(' + ')})`,
        badge: rw.isNewDLC ? 'RotW DLC' : (rw.ladderOnly ? '天梯專用' : '符文之語'),
        preview: rw.attributes.slice(0, 3).join(' | '),
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
        category: `暗金裝備 (${item.baseItem})`,
        badge: item.isNewDLC ? 'RotW DLC' : '獨特暗金',
        preview: item.attributes.slice(0, 3).join(' | '),
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
        category: `套裝裝備 (${set.pieces.length} 件套)`,
        badge: '成套套裝',
        preview: set.pieces.map(p => p.name).join('、'),
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
            category: `套裝散件 (${set.name})`,
            badge: '綠色套裝',
            preview: piece.attributes.slice(0, 3).join(' | '),
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
        category: `符文 (Lv ${rune.requiredLevel})`,
        badge: rune.number >= 26 ? '大號符文' : (rune.number >= 16 ? '中階符文' : '初階符文'),
        preview: `武器: ${rune.weaponEffect} | 盾甲: ${rune.shieldEffect}`,
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
        category: `方塊公式 (${recipe.category})`,
        badge: '方塊合成',
        preview: `${recipe.inputs.join(' + ')} -> ${recipe.output}`,
        targetTab: 'cube'
      });
    }
  }

  // 6. Search Areas & Terror Zones
  for (const area of AREA_LEVELS_DATA) {
    const textToMatch = [
      area.name,
      area.nameEn,
      `第${area.act}幕`,
      area.immunities.join(' '),
      area.chestsAndBosses || ''
    ].join(' ').toLowerCase();

    if (textToMatch.includes(q)) {
      results.push({
        id: `${area.act}_${area.nameEn.replace(/\s+/g, '_')}`,
        type: 'area',
        title: area.name,
        titleEn: area.nameEn,
        category: `第 ${area.act} 幕 · 區域等級 Lv ${area.areaLevel}`,
        badge: area.isAlvl85 ? 'Lv85 頂級場景' : (area.isTerrorZone ? '恐懼領域' : '常規場景'),
        preview: `免疫: ${area.immunities.join(', ')} | ${area.chestsAndBosses || ''}`,
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
        category: `傭兵指南 (第 ${merc.act} 章: ${merc.type})`,
        badge: '傭兵配置',
        preview: merc.builds.map(b => b.name).join(' | '),
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
        category: `鑑寶估價 (${item.itemType})`,
        badge: item.rarity === 'magic' ? '極品藍裝' : '極品黃裝',
        preview: `滿變: ${item.idealStats.slice(0, 2).join(' | ')} | 身價: ${item.estimatedValue}`,
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
        titleEn: st.boss,
        category: `紅門六王攻略 (第 ${st.step} 階段)`,
        badge: '地獄火炬',
        preview: `${st.rewards} | 戰術: ${st.strategy}`,
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
          (sk.synergies || []).join(' ')
        ].join(' ').toLowerCase();

        if (text.includes(q)) {
          results.push({
            id: sk.id,
            type: 'skill',
            title: sk.name,
            titleEn: sk.nameEn,
            category: `${sk.characterClass} · ${sk.tree} (Lv ${sk.requiredLevel})`,
            badge: '職業技能',
            preview: sk.description,
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
        category: `符文底材 (${base.category} · ${base.itemType || '裝備'} · 最多${base.maxSockets}孔)`,
        badge: base.qualityTier || base.grade || '底材',
        preview: (base.recommendedRunewords && base.recommendedRunewords.length > 0)
          ? `推薦符文語: ${base.recommendedRunewords.slice(0, 3).join(', ')}`
          : `要求力量: ${base.reqStr || 0} · 敏捷: ${base.reqDex || 0} · 最大孔數: ${base.maxSockets}`,
        targetTab: 'bases'
      });
    }
  }

  // 12. Search Quests & Events
  for (const quest of QUESTS_DATA) {
    const text = [
      quest.name,
      quest.nameEn,
      `第${quest.act}幕`,
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
        category: `第 ${quest.act} 幕 任務 ${quest.questNumber} (${quest.location})`,
        badge: quest.permanentReward ? '永久獎勵' : (quest.isMandatory ? '主線必解' : '支線任務'),
        preview: quest.permanentReward ? quest.permanentReward.description : quest.summary,
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
        category: `終局世界事件 (${evt.location})`,
        badge: '世界事件',
        preview: evt.guide,
        targetTab: 'quests'
      });
    }
  }

  // 13. Search Characters
  for (const cls of CHARACTER_CLASSES_DATA) {
    const text = [
      cls.name,
      cls.nameEn,
      cls.title,
      cls.description,
      cls.skillTrees.map(t => t.name).join(' '),
      cls.popularBuilds.map(b => b.name + ' ' + b.coreSkills).join(' ')
    ].join(' ').toLowerCase();

    if (text.includes(q)) {
      results.push({
        id: cls.id,
        type: 'character',
        title: `${cls.name} (${cls.nameEn})`,
        titleEn: cls.title,
        category: `英雄職業 (${cls.isDLC ? 'RotW DLC' : '經典原版'})`,
        badge: cls.isDLC ? 'RotW DLC' : '8大英雄',
        preview: cls.description,
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
        category: `完美寶石 (Lv ${gem.requiredLevel})`,
        badge: '寶石工藝',
        preview: `盾: ${gem.shieldEffect} | 甲: ${gem.armorHelmEffect}`,
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
        category: `六王聖物 (${key.dropSource})`,
        badge: key.type === 'key' ? '紅門鑰匙' : '魔王器官',
        preview: key.tacticalTips,
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
        category: `四大精華 (${ess.bossSource})`,
        badge: '洗點精華',
        preview: ess.description,
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
        category: `戰鬥藥劑 (${pot.category})`,
        badge: '生存黑科技',
        preview: pot.effect,
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
        category: `神級護身符 (${charm.slot})`,
        badge: `Tier ${charm.tradeValueTier}`,
        preview: charm.keyAttributes.join(' | '),
        targetTab: 'props'
      });
    }
  }

  return results.slice(0, 30);
};
