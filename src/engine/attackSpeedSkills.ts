import { auraEffects, passiveEffects, skillByName } from './skills';
import type { AttackClass } from './attackSpeed';

// 技能攻速（SIAS）單獨一個檔案：技能表（skills.json）很大，只有要算技能攻速時才載入
/** 來源：技能名（遊戲英文名）與所屬職業。其他加速（旋風、變形）不走這個公式，未收錄 */
export const SIAS_SKILLS: { cls: AttackClass; skillEn: string }[] = [
  { cls: 'pal', skillEn: 'Fanaticism' },
  { cls: 'bar', skillEn: 'Frenzy' },
  { cls: 'ass', skillEn: 'Quickness' },
];
/** 技能在指定等級提供的攻速 %；找不到技能或沒有攻速效果回傳 undefined */
export function siasOf(skillEn: string, level: number): number | undefined {
  const s = skillByName(skillEn);
  if (!s) return undefined;
  const line = [...auraEffects(s, level), ...passiveEffects(s, level)].find((l) => l.stat === 'attackrate' && l.supported && l.value !== undefined);
  return line?.value === undefined ? undefined : Math.floor(line.value);
}
