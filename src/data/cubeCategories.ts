import type { CubeRecipeData } from '../types';

/** 方塊配方分類。方塊工坊（CubeLab）與全站搜尋共用同一份標籤，不要另立對照表。 */
export type CubeCategory = CubeRecipeData['category'];

/** [繁中, English] */
export const CUBE_CATEGORY_LABEL: Record<CubeCategory, [string, string]> = {
  socket: ['裝備打孔', 'Socketing'],
  upgrade: ['裝備階級升級', 'Item Upgrades'],
  craft: ['手工神裝工藝', 'Crafted Items'],
  repair: ['免錢修理充能', 'Repairs & Recharging'],
  misc: ['洗裝與洗點', 'Rerolling & Respec'],
};

/** 舊的配方 id（已合併）→ 現行 id；舊網址 #recipe-<舊 id> 仍會打開現行那一條 */
export const CUBE_RECIPE_ALIASES: Record<string, string> = {
  cow_level_portal: 'secret_cow_level',
  reroll_grand_charm: 'reroll_magic_charm',
};

/**
 * App 以 history.pushState 改了方塊工坊的網址（例如從分類 hash 回到無 hash 的總目錄）之後送出的事件。
 * pushState 不會觸發 hashchange / popstate，CubeLab 聽這個事件重新「讀取」window.location.hash（不可在處理器裡呼叫 history API）。
 */
export const CUBE_NAV_EVENT = 'd2codex:cube-nav';
