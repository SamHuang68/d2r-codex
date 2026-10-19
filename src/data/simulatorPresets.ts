import type { DollSlot } from '../components/simulator/v2/types';

/**
 * 配裝範本（以遊戲資料中的英文名稱對應目錄，載入時逐項解析，找不到會明確回報）。
 * 範本僅為社群常見的物品組合示意：屬性由遊戲資料計算，未逐項與遊戲內比對。
 * 配點採規則（滿足裝備需求 → 格擋目標 → 其餘投入指定屬性），不臆測固定配點。
 */
export interface PresetItem {
  nameEn: string;
  /** 符文之語更換底材（英文名稱） */
  baseNameEn?: string;
  /** 鑲嵌物英文名稱（寶石／符文），依序填入 */
  sockets?: string[];
  ethereal?: boolean;
  /** 白裝底材的孔數 */
  socketCount?: number;
}

export interface SimPreset {
  id: string;
  name: string;
  classCode: 'ama' | 'sor' | 'nec' | 'pal' | 'bar' | 'dru' | 'ass' | 'war';
  level: number;
  items: Partial<Record<DollSlot, PresetItem>>;
  charms: PresetItem[];
  blockTarget?: number;
  rest?: 'str' | 'dex' | 'vit' | 'ene';
  notes: string;
}

const common = (extra: Partial<Record<DollSlot, PresetItem>>): Partial<Record<DollSlot, PresetItem>> => ({
  neck: { nameEn: "Mara's Kaleidoscope" },
  gloves: { nameEn: 'Magefist' },
  belt: { nameEn: 'Arachnid Mesh' },
  boots: { nameEn: 'Wartraveler' },
  ring1: { nameEn: 'The Stone of Jordan' },
  weaponII: { nameEn: 'Call to Arms' },
  shieldII: { nameEn: 'Spirit', baseNameEn: 'Monarch' },
  ...extra,
});
const CHARMS: PresetItem[] = [{ nameEn: 'Annihilus' }, { nameEn: 'Hellfire Torch' }];

export const SIM_PRESETS: SimPreset[] = [
  {
    id: 'blizzard-sorc', name: '冰暴魔法使（MF／施法）', classCode: 'sor', level: 92,
    items: common({
      head: { nameEn: 'Harlequin Crest' }, body: { nameEn: 'Enigma', baseNameEn: 'Dusk Shroud' },
      weaponI: { nameEn: 'Fathom' }, shieldI: { nameEn: 'Spirit', baseNameEn: 'Monarch' }, ring2: { nameEn: 'Raven Frost' },
    }),
    charms: CHARMS, rest: 'vit', notes: '常見的冰暴風雪配置：軍帽＋謎團＋精神盾。副手欄為戰爭召喚（CTA）＋精神盾。',
  },
  {
    id: 'infinity-sorc', name: '無限電法（自持）', classCode: 'sor', level: 94,
    items: common({
      head: { nameEn: "Griffon's Eye" }, body: { nameEn: 'Skin of the Vipermagi' },
      weaponI: { nameEn: 'Infinity', baseNameEn: 'Thresher' }, boots: { nameEn: 'Sandstorm Trek' }, ring2: { nameEn: 'The Stone of Jordan' },
    }),
    charms: CHARMS, rest: 'vit', notes: '雙手長柄武器自持無限，不使用盾牌。',
  },
  {
    id: 'hammerdin', name: '祝福之槌聖騎士', classCode: 'pal', level: 92,
    items: common({
      head: { nameEn: 'Harlequin Crest' }, body: { nameEn: 'Enigma', baseNameEn: 'Dusk Shroud' },
      weaponI: { nameEn: 'Heart of the Oak', baseNameEn: 'Scourge' }, shieldI: { nameEn: 'Herald of Zakarum' }, ring2: { nameEn: 'Raven Frost' },
    }),
    charms: CHARMS, blockTarget: 75, rest: 'vit', notes: '格擋目標 75%：先滿足需求，再加敏捷到滿格擋，其餘全灌體能。',
  },
  {
    id: 'mosaic-sin', name: '馬賽克武學刺客', classCode: 'ass', level: 92,
    items: common({
      head: { nameEn: 'Harlequin Crest' }, body: { nameEn: 'Enigma', baseNameEn: 'Dusk Shroud' },
      weaponI: { nameEn: 'Mosaic' }, ring2: { nameEn: 'Raven Frost' }, weaponII: { nameEn: 'Call to Arms' }, shieldII: { nameEn: 'Spirit', baseNameEn: 'Monarch' },
    }),
    charms: CHARMS, rest: 'vit', notes: '副手 I 欄未放置（雙持第二把爪需自行選擇）。',
  },
  {
    id: 'grief-barb', name: '悲痛野蠻人', classCode: 'bar', level: 90,
    items: common({
      head: { nameEn: 'Harlequin Crest' }, body: { nameEn: 'Enigma', baseNameEn: 'Dusk Shroud' }, gloves: { nameEn: "Dracul's Grasp" }, belt: { nameEn: "Nosferatu's Coil" },
      weaponI: { nameEn: 'Grief' }, shieldI: { nameEn: 'Spirit', baseNameEn: 'Monarch' }, ring2: { nameEn: 'Raven Frost' },
    }),
    charms: CHARMS, rest: 'vit', notes: '示意配置，數值僅反映裝備屬性與等級。',
  },
];
