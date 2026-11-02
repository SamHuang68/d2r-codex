import { AREAS, areaImmunity, type Area, type ElemKey } from './monsters';
import { AREA_LEVELS_DATA } from '../areaLevels';

/**
 * 打寶場景（階段 A）：依流派的主要傷害元素，挑出地獄難度高等級場景裡「免疫怪物最少」的。
 * 場景與免疫來自怪物圖鑑的 areas.json／monsters.json（遊戲資料表 levels.txt、monstats.txt）；
 * 備註（箱子、首領）沿用「場景恐區」頁的 AREA_LEVELS_DATA，不另寫一份。
 * 不含：掉落機率（沒有抽掉落表）、怪物密度、跑圖時間、秘密乳牛關等沒有怪物清單的場景，
 * 也不含精英與獨特怪的額外抗性（見 monsters.ts）。
 */

/** 各流派（simulatorPresets 的 BUILDS id）的主要傷害元素。null＝召喚物或多種元素混合、資料沒有單一答案，由使用者自選 */
export const BUILD_ELEMENT: Record<string, ElemKey | null> = {
  'ama-lightning-fury': 'lightning', 'ama-strafe': 'physical', 'ama-multishot': 'physical',
  'sor-blizzard': 'cold', 'sor-lightning': 'lightning', 'sor-fire': 'fire',
  'nec-bone-spear': 'magic', 'nec-summoner': null, 'nec-poison-nova': 'poison',
  'pal-hammerdin': 'magic', 'pal-zealot': 'physical', 'pal-foh': 'lightning',
  'bar-whirlwind': 'physical', 'bar-frenzy': 'physical', 'bar-berserk': 'magic',
  'dru-tornado': 'physical', 'dru-fire': 'fire', 'dru-fury': 'physical',
  'ass-lightning-trap': 'lightning', 'ass-mosaic': null, 'ass-blade-fury': 'physical',
  'war-demon-enslavement': null, 'war-chaos-apocalypse': null, 'war-eldritch-blade': null,
};

/** 「場景恐區」頁條目（英文名）→ areas.json 的場景編號。同名場景不只一個（例如兩個 Sewers Level 2），所以明寫編號；沒列的條目在 areas.json 沒有怪物清單 */
export const FARM_NOTE_AREA: Record<string, number> = {
  'The Mausoleum': 19, 'The Crypt': 18, 'The Pit Level 1': 12, 'The Pit Level 2': 16, 'Ancient Tunnels': 65, 'Maggot Lair Level 3': 64,
  'Arcane Sanctuary': 74, 'Sewers Level 2': 93, 'Forgotten Temple': 97, 'Ruined Fane': 98, 'Durance of Hate Level 3': 102,
  'The Chaos Sanctuary': 108, 'River of Flame': 107, 'Worldstone Keep Level 1': 128, 'Worldstone Keep Level 2': 129,
  'Worldstone Keep Level 3': 130, 'Throne of Destruction': 131, 'Halls of Vaught': 124, 'Tristram': 38, 'Travincal': 83,
  'Flayer Dungeon Level 3': 91,
};
const noteByArea = new Map(AREA_LEVELS_DATA.flatMap((x) => (FARM_NOTE_AREA[x.nameEn] !== undefined && x.chestsAndBosses ? [[FARM_NOTE_AREA[x.nameEn], x] as const] : [])));

export interface FarmRow {
  area: Area;
  /** 地獄難度的場景怪物等級 */
  mlvl: number;
  /** 地獄難度怪物種類數，與其中免疫主要元素的種類數（沒有選元素為 0） */
  total: number;
  immune: number;
  note?: { zh: string; en: string };
}

/** 地獄難度、怪物等級不低於 minLevel 的場景；選了元素就依「免疫該元素的怪物種類比例」由低到高，其餘依場景編號 */
export function farmingRows(minLevel: number, elem: ElemKey | null): FarmRow[] {
  const out: FarmRow[] = [];
  for (const area of AREAS) {
    const mlvl = area.mlvl[2];
    if (!mlvl || mlvl < minLevel || !area.mon[2].length) continue;
    const info = areaImmunity(area, 2);
    const total = info.monsters.length;
    const n = noteByArea.get(area.id);
    out.push({ area, mlvl, total, immune: elem ? info.immuneCount[elem] : 0, note: n?.chestsAndBosses ? { zh: n.chestsAndBosses, en: n.chestsAndBossesEn ?? n.chestsAndBosses } : undefined });
  }
  const share = (r: FarmRow) => (r.total ? r.immune / r.total : 0);
  return out.sort((a, b) => share(a) - share(b) || a.area.id - b.area.id);
}
