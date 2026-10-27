/**
 * 百科頁的符文資料：符文名稱、需求等級取自遊戲表（bases.json 的 rune），鑲嵌效果取自 gems.json（武器／護甲與頭盔／盾牌三種），
 * 以 engine/describe 轉成繁中文字。合成配方是手寫欄位，來自覆蓋層 codex/overlay.json。
 */
import { RuneData } from '../types';
import { gameData } from '../engine/data';
import { overlay } from './codex/common';
import { modLines } from './codex/itemLines';

const gemByCode = new Map(gameData.gems.map((g) => [g.code, g]));

const RUNE_EFFECTS_EN: Record<number, { w: string; a: string; s: string; cube?: string }> = {
  1: { w: '+50 to Attack Rating, +1 to Light Radius', a: '+15 Defense, +1 to Light Radius', s: '+15 Defense, +1 to Light Radius', cube: '3 El -> 1 Eld' },
  2: { w: '+75% Damage to Undead, +50 to Attack Rating against Undead', a: '15% Slower Stamina Drain', s: '7% Increased Chance of Blocking', cube: '3 Eld -> 1 Tir' },
  3: { w: '+2 to Mana after each Kill', a: '+2 to Mana after each Kill', s: '+2 to Mana after each Kill', cube: '3 Tir -> 1 Nef' },
  4: { w: 'Knockback', a: '+30 Defense vs. Missile', s: '+30 Defense vs. Missile', cube: '3 Nef -> 1 Eth' },
  5: { w: '-25% Target Defense', a: 'Regenerate Mana 15%', s: 'Regenerate Mana 15%', cube: '3 Eth -> 1 Ith' },
  6: { w: '+9 to Maximum Damage', a: '15% Damage Taken Goes to Mana', s: '15% Damage Taken Goes to Mana', cube: '3 Ith -> 1 Tal' },
  7: { w: '+75 Poison Damage over 5 Seconds', a: 'Poison Resist 30%', s: 'Poison Resist 35%', cube: '3 Tal -> 1 Ral' },
  8: { w: 'Adds 5-30 Fire Damage', a: 'Fire Resist 30%', s: 'Fire Resist 35%', cube: '3 Ral -> 1 Ort' },
  9: { w: 'Adds 1-50 Lightning Damage', a: 'Lightning Resist 30%', s: 'Lightning Resist 35%', cube: '3 Ort -> 1 Thul' },
  10: { w: 'Adds 3-14 Cold Damage (3 sec)', a: 'Cold Resist 30%', s: 'Cold Resist 35%', cube: '3 Thul + Chipped Topaz -> 1 Amn' },
  11: { w: '7% Life Stolen per Hit', a: 'Attacker Takes Damage of 14', s: 'Attacker Takes Damage of 14', cube: '3 Amn + Chipped Amethyst -> 1 Sol' },
  12: { w: '+9 to Minimum Damage', a: 'Damage Reduced by 7', s: 'Damage Reduced by 7', cube: '3 Sol + Chipped Sapphire -> 1 Shael' },
  13: { w: '20% Increased Attack Speed', a: '20% Faster Hit Recovery', s: '20% Faster Block Rate', cube: '3 Shael + Chipped Ruby -> 1 Dol' },
  14: { w: 'Hit Causes Monster to Flee 25%', a: 'Replenish Life +7', s: 'Replenish Life +7', cube: '3 Dol + Chipped Emerald -> 1 Hel' },
  15: { w: 'Requirements -20%', a: 'Requirements -15%', s: 'Requirements -15%', cube: '3 Hel + Chipped Diamond -> 1 Io' },
  16: { w: '+10 to Vitality', a: '+10 to Vitality', s: '+10 to Vitality', cube: '3 Io + Flawed Topaz -> 1 Lum' },
  17: { w: '+10 to Energy', a: '+10 to Energy', s: '+10 to Energy', cube: '3 Lum + Flawed Amethyst -> 1 Ko' },
  18: { w: '+10 to Dexterity', a: '+10 to Dexterity', s: '+10 to Dexterity', cube: '3 Ko + Flawed Sapphire -> 1 Fal' },
  19: { w: '+10 to Strength', a: '+10 to Strength', s: '+10 to Strength', cube: '3 Fal + Flawed Ruby -> 1 Lem' },
  20: { w: '75% Extra Gold from Monsters', a: '50% Extra Gold from Monsters', s: '50% Extra Gold from Monsters', cube: '3 Lem + Flawed Emerald -> 1 Pul' },
  21: { w: '+75% Damage to Demons, +100 Attack Rating against Demons', a: '+30% Enhanced Defense', s: '+30% Enhanced Defense', cube: '2 Pul + Flawed Diamond -> 1 Um' },
  22: { w: '25% Chance of Open Wounds', a: 'All Resistances +15', s: 'All Resistances +22', cube: '2 Um + Topaz -> 1 Mal' },
  23: { w: 'Prevent Monster Heal', a: 'Magic Damage Reduced by 7', s: 'Magic Damage Reduced by 7', cube: '2 Mal + Amethyst -> 1 Ist' },
  24: { w: '30% Better Chance of Getting Magic Items', a: '25% Better Chance of Getting Magic Items', s: '25% Better Chance of Getting Magic Items', cube: '2 Ist + Sapphire -> 1 Gul' },
  25: { w: '20% Bonus to Attack Rating', a: '+5% to Maximum Poison Resist', s: '+5% to Maximum Poison Resist', cube: '2 Gul + Ruby -> 1 Vex' },
  26: { w: '7% Mana Stolen per Hit', a: '+5% to Maximum Fire Resist', s: '+5% to Maximum Fire Resist', cube: '2 Vex + Emerald -> 1 Ohm' },
  27: { w: '+50% Enhanced Damage', a: '+5% to Maximum Cold Resist', s: '+5% to Maximum Cold Resist', cube: '2 Ohm + Diamond -> 1 Lo' },
  28: { w: '20% Deadly Strike', a: '+5% to Maximum Lightning Resist', s: '+5% to Maximum Lightning Resist', cube: '2 Lo + Flawless Topaz -> 1 Sur' },
  29: { w: 'Hit Blinds Target', a: 'Maximum Mana 5%', s: '+50 to Mana', cube: '2 Sur + Flawless Amethyst -> 1 Ber' },
  30: { w: '20% Chance of Crushing Blow', a: 'Damage Reduced by 8%', s: 'Damage Reduced by 8%', cube: '2 Ber + Flawless Sapphire -> 1 Jah' },
  31: { w: "Ignore Target's Defense", a: 'Increase Maximum Life 5%', s: '+50 to Life', cube: '2 Jah + Flawless Ruby -> 1 Cham' },
  32: { w: 'Freeze Target +3', a: 'Cannot Be Frozen', s: 'Cannot Be Frozen', cube: '2 Cham + Flawless Emerald -> 1 Zod' },
  33: { w: 'Indestructible', a: 'Indestructible', s: 'Indestructible', cube: 'Highest Rune (No upgrade formula)' },
};

export const RUNES_DATA: RuneData[] = gameData.bases
  .filter((b) => b.type === 'rune')
  .map((b) => ({ b, number: Number(b.code.replace(/\D/g, '')) }))
  .sort((x, y) => x.number - y.number)
  .map(({ b, number }) => {
    const gem = gemByCode.get(b.code);
    const text = (mods: NonNullable<typeof gem>['weapon'] | undefined) => (mods ?? []).length ? modLines(mods ?? [], undefined, { coldLength: true }).join(', ') : '';
    const enInfo = RUNE_EFFECTS_EN[number];
    return {
      number,
      name: b.name.replace(/^符文[：:]/, ''),
      nameEn: (b.nameEnUS ?? b.nameEn).replace(/ Rune$/, ''),
      weaponEffect: text(gem?.weapon),
      weaponEffectEn: enInfo?.w,
      armorHelmEffect: text(gem?.armor),
      armorHelmEffectEn: enInfo?.a,
      shieldEffect: text(gem?.shield),
      shieldEffectEn: enInfo?.s,
      requiredLevel: b.levelReq ?? 0,
      cubeRecipe: overlay.runes[number]?.cubeRecipe,
      cubeRecipeEn: enInfo?.cube,
    };
  });
