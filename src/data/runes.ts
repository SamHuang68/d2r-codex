/**
 * 百科頁的符文資料：符文名稱、需求等級取自遊戲表（bases.json 的 rune），鑲嵌效果取自 gems.json（武器／護甲與頭盔／盾牌三種），
 * 以 engine/describe 轉成繁中文字。合成配方是手寫欄位，來自覆蓋層 codex/overlay.json。
 */
import { RuneData } from '../types';
import { gameData } from '../engine/data';
import { overlay } from './codex/common';
import { modLines } from './codex/itemLines';

const gemByCode = new Map(gameData.gems.map((g) => [g.code, g]));

export const RUNES_DATA: RuneData[] = gameData.bases
  .filter((b) => b.type === 'rune')
  .map((b) => ({ b, number: Number(b.code.replace(/\D/g, '')) }))
  .sort((x, y) => x.number - y.number)
  .map(({ b, number }) => {
    const gem = gemByCode.get(b.code);
    const text = (mods: NonNullable<typeof gem>['weapon'] | undefined) => (mods ?? []).length ? modLines(mods ?? [], undefined, { coldLength: true }).join(', ') : '';
    return {
      number,
      name: b.name.replace(/^符文[：:]/, ''),
      nameEn: (b.nameEnUS ?? b.nameEn).replace(/ Rune$/, ''),
      weaponEffect: text(gem?.weapon),
      armorHelmEffect: text(gem?.armor),
      shieldEffect: text(gem?.shield),
      requiredLevel: b.levelReq ?? 0,
      cubeRecipe: overlay.runes[number]?.cubeRecipe,
    };
  });
