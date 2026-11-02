import type { Diff, ElemKey } from '../../data/codex/monsters';

/** 怪物圖鑑與練等場景共用的元素、難度英文標籤與免疫標籤色 */
export const ELEM_EN: Record<ElemKey, string> = {
  physical: 'Phys',
  magic: 'Mag',
  fire: 'Fire',
  lightning: 'Light',
  cold: 'Cold',
  poison: 'Pois',
};

export const ELEM_TONE: Record<ElemKey, string> = {
  physical: 'text-sanctuary-200 border-sanctuary-600 bg-sanctuary-700/40',
  magic: 'text-d2-magic border-d2-magic/40 bg-d2-magic/10',
  fire: 'text-d2-fire border-d2-fire/40 bg-d2-fire/10',
  lightning: 'text-d2-lightning border-d2-lightning/40 bg-d2-lightning/10',
  cold: 'text-d2-cold border-d2-cold/40 bg-d2-cold/10',
  poison: 'text-d2-poison border-d2-poison/40 bg-d2-poison/10',
};

export const DIFF_EN: Record<Diff, string> = ['Normal', 'Nightmare', 'Hell'];
