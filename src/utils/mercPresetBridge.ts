import { getCatalog, eligibleBases, withBase } from '../engine/catalog';
import type { Equipped, EquippedMap } from '../components/simulator/v2/types';
import { loadDraft, saveDraft, fromSavedData, type SimSnapshot } from '../data/profileStore';
import type { MercTierBuild, MercGearItemRef } from '../data/mercenaryMatrix';

const cleanStr = (s: string) => (s || '').toLowerCase().replace(/[\s_\-']/g, '');

/**
 * 將單一傭兵裝備參考解析為模擬器所需的 Equipped 實體
 */
export function resolveMercItem(ref: MercGearItemRef, targetSlot: 'weapon' | 'head' | 'body', errors: string[]): Equipped | undefined {
  const cat = getCatalog();
  // 1. 優先匹配部位與名稱（官方繁中或英文名）
  let entry = cat.find((c) => (c.name === ref.name || cleanStr(c.nameEn) === cleanStr(ref.nameEn)) && c.slot === targetSlot);
  // 2. 若無精確部位匹配（例如雙部位符文組未標註），退回非底材名稱匹配
  if (!entry) {
    entry = cat.find((c) => (c.name === ref.name || cleanStr(c.nameEn) === cleanStr(ref.nameEn)) && c.kind !== 'base');
  }
  if (!entry) {
    errors.push(`找不到裝備「${ref.name}」(${ref.nameEn})`);
    return undefined;
  }

  // 3. 若為符文之語且指定了推薦底材，套用底材代碼
  if (entry.kind === 'runeword' && ref.baseNameEn) {
    const bases = eligibleBases(entry);
    const b = bases.find((x) => cleanStr(x.nameEn) === cleanStr(ref.baseNameEn!) || (ref.baseName && x.name === ref.baseName));
    if (b) {
      entry = withBase(entry, b.code);
    }
  }

  return {
    entry,
    ethereal: ref.ethereal,
  };
}

/**
 * 將 MercTierBuild 轉為模擬器紙娃娃可辨識的 EquippedMap
 */
export function resolveMercenaryEquipment(tier: MercTierBuild): { equipped: EquippedMap; errors: string[] } {
  const errors: string[] = [];
  const equipped: EquippedMap = {};

  const weapon = resolveMercItem(tier.weapon, 'weapon', errors);
  if (weapon) equipped.weaponI = weapon;

  const helm = resolveMercItem(tier.helm, 'head', errors);
  if (helm) equipped.head = helm;

  const armor = resolveMercItem(tier.armor, 'body', errors);
  if (armor) equipped.body = armor;

  return { equipped, errors };
}

/**
 * 一鍵將特定梯次的傭兵神裝帶入配裝模擬器 (d2sim.draft.v1)
 */
export function applyMercenaryPresetToSimulator(tier: MercTierBuild, classCode?: string): { success: boolean; message: string } {
  const { equipped, errors } = resolveMercenaryEquipment(tier);
  if (errors.length > 0) {
    console.warn('傭兵預設配裝解析警告:', errors);
  }

  // 讀取既有模擬器暫存（若不存在則建立預設地獄 90 級快照）
  const draftData = loadDraft();
  let snap: SimSnapshot;

  if (draftData) {
    const restored = fromSavedData(draftData);
    snap = restored.snap;
    if (classCode) {
      snap.classCode = classCode;
    }
  } else {
    snap = {
      classCode: classCode || 'sor',
      level: 90,
      difficulty: 'hell',
      quests: { lifePotions: 3, anya: 3, lamEsen: 3, skillPts: 3 },
      alloc: { str: 0, dex: 0, vit: 0, ene: 0 },
      equipped: {},
      charms: [],
      swap: 'I',
      skillPoints: {},
      activeSkillId: '',
      buffsOn: {},
      targetRes: 0,
      rollMax: true,
    };
  }

  // 注入傭兵狀態（設為啟用、等級 90、帶入專屬裝備）
  snap.merc = {
    on: true,
    id: tier.hirelingId,
    level: 90,
    equipped,
  };

  saveDraft(snap);
  return {
    success: true,
    message: `已成功將【${tier.label} · ${tier.mercTypeZh}】裝備帶入配裝模擬器！`,
  };
}
