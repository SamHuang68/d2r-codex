import { RUNES_DATA } from '../data/runes';
import { RUNEWORDS_DATA } from '../data/runewords';
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA } from '../data/setItems';
import { CUBE_RECIPES_DATA } from '../data/cubeRecipes';
import { AREA_LEVELS_DATA } from '../data/areaLevels';
import { MERCENARIES_DATA } from '../data/mercenaries';
import { VALUATION_ITEMS_DATA } from '../data/affixes';
import { UBER_TRISTRAM_GUIDE } from '../data/uberBosses';
import { SKILLS_DATA } from '../data/skills';
import { BASE_ITEMS_DATA } from '../data/bases';
import { QUESTS_DATA, WORLD_EVENTS_DATA } from '../data/quests';

export interface SearchResultItem {
  id: string;
  type: 'runeword' | 'unique' | 'set' | 'rune' | 'cube' | 'area' | 'mercenary' | 'valuation' | 'uber' | 'skill' | 'base' | 'quest';
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

  // 1. Search Runewords
  for (const rw of RUNEWORDS_DATA) {
    const textToMatch = [
      rw.name,
      rw.nameEn,
      rw.runes.join(' '),
      rw.allowedBases.join(' '),
      rw.tags.join(' '),
      rw.attributes.join(' '),
      rw.description || ''
    ].join(' ').toLowerCase();

    if (textToMatch.includes(q)) {
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
    const textToMatch = [
      item.name,
      item.nameEn,
      item.baseItem,
      item.baseItemEn,
      item.attributes.join(' '),
      (item.tags || []).join(' ')
    ].join(' ').toLowerCase();

    if (textToMatch.includes(q)) {
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
    const setMatch = (set.name + ' ' + set.nameEn).toLowerCase().includes(q);
    if (setMatch) {
      results.push({
        id: set.id,
        type: 'set',
        title: set.name,
        titleEn: set.nameEn,
        category: `套裝裝備 (${set.pieces.length} 件套)`,
        badge: '成套套裝',
        preview: set.pieces.map(p => p.name).join('、'),
        targetTab: 'items'
      });
    } else {
      for (const piece of set.pieces) {
        if ((piece.name + ' ' + piece.nameEn + ' ' + piece.attributes.join(' ')).toLowerCase().includes(q)) {
          results.push({
            id: piece.id,
            type: 'set',
            title: piece.name,
            titleEn: piece.nameEn,
            category: `套裝散件 (${set.name})`,
            badge: '綠色套裝',
            preview: piece.attributes.slice(0, 3).join(' | '),
            targetTab: 'items'
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
    const text = [
      base.name,
      base.nameEn,
      base.category,
      base.itemType,
      base.recommendedRunewords.join(' '),
      base.tacticalNotes,
      base.dropRecommendation
    ].join(' ').toLowerCase();

    if (text.includes(q)) {
      results.push({
        id: base.id,
        type: 'base',
        title: base.name,
        titleEn: base.nameEn,
        category: `符文底材 (${base.category} · ${base.itemType} · 最多${base.maxSockets}孔)`,
        badge: base.qualityTier,
        preview: `推薦符文語: ${base.recommendedRunewords.slice(0, 3).join(', ')}`,
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

  return results.slice(0, 30);
};
