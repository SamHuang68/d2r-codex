import { RUNES_DATA } from '../data/runes';
import { RUNEWORDS_DATA } from '../data/runewords';
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA } from '../data/setItems';
import { CUBE_RECIPES_DATA } from '../data/cubeRecipes';
import { AREA_LEVELS_DATA } from '../data/areaLevels';

export interface SearchResultItem {
  id: string;
  type: 'runeword' | 'unique' | 'set' | 'rune' | 'cube' | 'area';
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
            category: `套裝組件 (${set.name})`,
            badge: '綠色套裝',
            preview: piece.attributes.slice(0, 2).join(' | '),
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
      `${rune.number}號`,
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
        titleEn: `${rune.nameEn} Rune`,
        category: `符文 (需求等級: ${rune.requiredLevel})`,
        badge: '符文',
        preview: `武器: ${rune.weaponEffect} | 防具: ${rune.armorHelmEffect}`,
        targetTab: 'runes'
      });
    }
  }

  // 5. Search Cube Recipes
  for (const recipe of CUBE_RECIPES_DATA) {
    const textToMatch = [
      recipe.title,
      recipe.titleEn,
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
        category: `方塊配方 (${recipe.category})`,
        badge: '赫拉迪姆方塊',
        preview: `材料: ${recipe.inputs.join(' + ')} -> ${recipe.output}`,
        targetTab: 'cube'
      });
    }
  }

  // 6. Search Area Levels
  for (const area of AREA_LEVELS_DATA) {
    const textToMatch = [
      area.name,
      area.nameEn,
      `act ${area.act}`,
      `第${area.act}章`,
      area.immunities.join(' '),
      area.chestsAndBosses || ''
    ].join(' ').toLowerCase();

    if (textToMatch.includes(q)) {
      results.push({
        id: `area_${area.nameEn}`,
        type: 'area',
        title: `${area.name} (Lv ${area.areaLevel})`,
        titleEn: area.nameEn,
        category: `第 ${area.act} 章 ${area.isAlvl85 ? '【85 級場景】' : '場景'}`,
        badge: area.isAlvl85 ? '85 級場景' : '區域',
        preview: `免疫: ${area.immunities.join(', ')} | ${area.chestsAndBosses || ''}`,
        targetTab: 'breakpoints'
      });
    }
  }

  return results.slice(0, 30);
};
