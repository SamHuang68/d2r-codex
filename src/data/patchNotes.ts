/**
 * 版本改動（Patch 3.3／天梯第 15 季、Patch 3.4／天梯第 16 季）的物品改動清單。
 * 來源：d2db.net 的整理文章〈Ladder Season 15 & 16 Item Changes〉（資料來源頁有註明）；數值以文章為準，用本站的詞彙重新整理。
 * 本站物品資料版本是 3.3.93847（取自遊戲檔案）：3.3 的改動大多已在資料裡，3.4 的改動尚未套用，所以另開一頁列出「舊值 → 新值」，
 * 不直接改單品頁的數值；等 3.4 的遊戲資料出來，再由資料管線更新基本資料。
 * 名稱與單品網址的對應由 nameEn 在建置／執行時查現有資料（對不上會讓建置失敗，見 scripts/check_patch_notes 與 staticPatchNotes）。
 */
export type PatchVersion = '3.4' | '3.3';
export type PatchKind = 'unique' | 'runeword' | 'set' | 'setItem';
export type ChangeType = 'add' | 'remove' | 'change';
export interface PatchChange { type: ChangeType; zh: string; en: string }
export interface PatchEntry {
  version: PatchVersion;
  kind: PatchKind;
  /** 與資料表裡的 nameEn 一致（用來查中文名與單品網址） */
  nameEn: string;
  /** 文章標示僅限天梯 */
  ladderOnly?: boolean;
  /** 套裝部件所屬的套裝（nameEn） */
  parentSet?: string;
  changes: PatchChange[];
}

const add = (zh: string, en: string): PatchChange => ({ type: 'add', zh, en });
const del = (zh: string, en: string): PatchChange => ({ type: 'remove', zh, en });
const chg = (zh: string, en: string): PatchChange => ({ type: 'change', zh, en });

export const PATCH_NOTES: PatchEntry[] = [
  // ───────── 3.4（天梯第 16 季）─────────
  { version: '3.4', kind: 'unique', nameEn: 'Veil of Steel', ladderOnly: true, changes: [
    add('所有技能 +2', '+2 to All Skills'),
    add('物理傷害降低 15–25%', 'Physical Damage Reduced by 15–25%'),
    add('魔法抗性 +20–40%', 'Magic Resist +20–40%'),
  ] },
  { version: '3.4', kind: 'runeword', nameEn: 'Eternity', ladderOnly: true, changes: [
    chg('可用底材：5 孔近戰武器 → 5 孔近戰與遠程武器', 'Allowed bases: 5-socket melee weapons → 5-socket melee and missile weapons'),
    add('攻擊速度 +30%', '+30% Increased Attack Speed'),
    chg('傷害強化 +260–310% → +300–390%', 'Enhanced Damage +260–310% → +300–390%'),
    add('最大傷害 +3–297（依角色等級）', '+3–297 to Maximum Damage (based on character level)'),
    chg('等級 8 重生（88 次）→ 重生 +5', 'Level 8 Revive (88 charges) → Revive +5'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: "Dimoak's Hew", changes: [
    chg('傷害強化 +100% → +100–150%', 'Enhanced Damage +100% → +100–150%'),
    chg('敏捷 +15 → 力量 +20', 'Dexterity +15 → Strength +20'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'Serpent Lord', changes: [
    add('攻擊速度 +15%', '+15% Increased Attack Speed'),
    add('最小傷害 +5', '+5 to Minimum Damage'),
    chg('傷害強化 +30–40% → +40–80%', 'Enhanced Damage +30–40% → +40–80%'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: "Griswold's Edge", changes: [
    chg('擊退 → 攻擊時 4% 機率施放 1 級傷害加深', 'Knockback → 4% chance to cast level 1 Amplify Damage on striking'),
    chg('傷害強化 +80–120% → +100–160%', 'Enhanced Damage +80–120% → +100–160%'),
    add('目標減速 25%', 'Slows Target by 25%'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'The Salamander', changes: [
    add('施法速度 +10%', '+10% Faster Cast Rate'),
    chg('火焰技能 +2 → +3', '+2 to Fire Skills → +3 to Fire Skills'),
    chg('火球術 +2 → +4', 'Fire Ball +2 → +4'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'The Tannr Gorerod', changes: [
    chg('傷害強化 +80–100% → +200–220%', 'Enhanced Damage +80–100% → +200–220%'),
    add('擊中竊取 5–9% 生命', '5–9% Life Stolen per Hit'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'The Grim Reaper', changes: [
    chg('傷害強化 +20% → +80–120%', 'Enhanced Damage +20% → +80–120%'),
    chg('擊中竊取魔力 5% → 5–9%', 'Mana Stolen per Hit 5% → 5–9%'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'Silks of the Victor', changes: [
    add('跑步／行走速度 +20%', '+20% Faster Run/Walk'),
    add('攻擊速度 +30%', '+30% Increased Attack Speed'),
    add('傷害強化 +50–100%', '+50–100% Enhanced Damage'),
    add('尋獲魔法物品機率 +15%', '+15% Better Chance of Getting Magic Items'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'The Impaler', changes: [
    chg('傷害強化 +140–170% → +170–240%', 'Enhanced Damage +140–170% → +170–240%'),
    add('每 4 秒修復 1 點耐久', 'Repairs 1 durability in 4 seconds'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'Coldkill', changes: [
    chg('冰寒傷害 +40 → +80–100', 'Cold Damage +40 → +80–100'),
    chg('傷害強化 +150–190% → +160–200%', 'Enhanced Damage +150–190% → +160–200%'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'The Atlantean', changes: [
    chg('傷害強化 +200–250% → +250–300%', 'Enhanced Damage +200–250% → +250–300%'),
    add('狂熱 +2–5（只限聖騎士）', '+2–5 to Fanaticism (Paladin only)'),
    add('攻擊評級 +100–125', '+100–125 to Attack Rating'),
    add('需求 -20%', 'Requirements -20%'),
    chg('需求等級 42 → 35', 'Required level 42 → 35'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'Lava Gout', changes: [
    chg('攻擊時施放 10 級附魔的機率 2% → 5%', 'Chance to cast level 10 Enchant on striking 2% → 5%'),
    chg('凍結時間減半 → 無法被凍結', 'Half Freeze Duration → Cannot Be Frozen'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'Earthshaker', changes: [
    add('烈焰爪擊 +3–5（只限德魯伊）', '+3–5 to Fire Claws (Druid only)'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: "Grim's Burning Dead", changes: [
    add('15% 機率以 Burning Dead Archer 重生', '15% chance to Revive as a Burning Dead Archer'),
    add('火焰魔像 +3–5（只限死靈法師）', '+3–5 to Fire Golem (Necromancer only)'),
    chg('死靈法師技能等級 +3 → +4', '+3 to Necromancer Skill Levels → +4'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'Swordguard', changes: [
    chg('所有抗性 +10–20 → +20–30', 'All Resistances +10–20 → +20–30'),
    add('生命回復 +10–15', 'Replenish Life +10–15'),
    add('攻擊者受到傷害 15–25', 'Attacker Takes Damage of 15–25'),
    chg('傷害強化 +170–180% → +180–230%', 'Enhanced Damage +170–180% → +180–230%'),
    chg('防禦 +5–495 → +7–779（依角色等級）', 'Defense +5–495 → +7–779 (based on character level)'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: "Demonhorn's Edge", changes: [
    chg('攻擊速度 +10% → +20%', 'Increased Attack Speed +10% → +20%'),
    add('野蠻人技能 +1', '+1 to Barbarian Skill Levels'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: 'Ethereal Edge', changes: [
    chg('傷害強化 +150–180% → +220–260%', 'Enhanced Damage +150–180% → +220–260%'),
    chg('攻擊速度 +25% → +40%', 'Increased Attack Speed +25% → +40%'),
    add('最大傷害 +2–198（依角色等級）', '+2–198 to Maximum Damage (based on character level)'),
  ] },
  { version: '3.4', kind: 'unique', nameEn: "Executioner's Justice", changes: [
    chg('傷害強化 +240–290% → +260–300%', 'Enhanced Damage +240–290% → +260–300%'),
    chg('擊殺時 50% 機率施放 6 級衰老 → 25% 機率施放 13 級傷害加深', '50% chance to cast level 6 Decrepify when you kill → 25% chance to cast level 13 Amplify Damage'),
    chg('攻擊速度 +30% → +40%', 'Increased Attack Speed +30% → +40%'),
    add('每次擊殺 +15 生命、+5 魔力', '+15 Life and +5 Mana after each Kill'),
  ] },
  { version: '3.4', kind: 'set', nameEn: "Isenhart's Armory", changes: [
    chg('全套：跑步／行走速度 +20% → +30%', 'Full set: Faster Run/Walk +20% → +30%'),
    add('全套：打擊恢復速度 +25%', 'Full set: +25% Faster Hit Recovery'),
  ] },
  { version: '3.4', kind: 'setItem', nameEn: "Isenhart's Lightbrand", parentSet: "Isenhart's Armory", changes: [
    chg('攻擊速度 +20% → +40%', 'Increased Attack Speed +20% → +40%'),
    add('攻擊評級 +5–495', '+5–495 to Attack Rating'),
    del('兩件套的攻擊評級加成', '2-item set Attack Rating bonus'),
    add('三件套：最大傷害 +2–198', '3-item set: +2–198 to Maximum Damage'),
  ] },
  { version: '3.4', kind: 'setItem', nameEn: "Isenhart's Parry", parentSet: "Isenhart's Armory", changes: [
    add('兩件套：冰寒抗性 +15%、火焰抗性 +15%', '2-item set: Cold Resist +15%, Fire Resist +15%'),
  ] },
  { version: '3.4', kind: 'setItem', nameEn: "Isenhart's Case", parentSet: "Isenhart's Armory", changes: [
    add('魔法抗性 +25%', 'Magic Resist +25%'),
  ] },
  { version: '3.4', kind: 'setItem', nameEn: "Isenhart's Horns", parentSet: "Isenhart's Armory", changes: [
    add('擊中竊取 5% 生命', '5% Life Stolen per Hit'),
  ] },

  // ───────── 3.3（天梯第 15 季）─────────
  { version: '3.3', kind: 'unique', nameEn: 'Bloodletter', changes: [add('跑步／行走速度 +20%', '+20% Faster Run/Walk')] },
  { version: '3.3', kind: 'unique', nameEn: 'The Battlebranch', changes: [
    chg('底材物品等級 34 → 30', 'Item level 34 → 30'),
    chg('需求等級 25 → 17', 'Required level 25 → 17'),
  ] },
  { version: '3.3', kind: 'unique', nameEn: "Rogue's Bow", changes: [add('寒冰箭或火焰箭 +1–3（只限亞馬遜）', '+1–3 to Ice Arrow or Fire Arrow (Amazon only)')] },
  { version: '3.3', kind: 'unique', nameEn: 'Pluckeye', changes: [add('攻擊速度 +25%', '+25% Increased Attack Speed')] },
  { version: '3.3', kind: 'unique', nameEn: 'Bane Ash', changes: [
    del('攻擊速度 +20%、傷害強化 +50–60%', '+20% Increased Attack Speed and +50–60% Enhanced Damage'),
    add('施法速度 +20%', '+20% Faster Cast Rate'),
  ] },
  { version: '3.3', kind: 'unique', nameEn: 'Gravenspine', changes: [add('施法速度 +10%', '+10% Faster Cast Rate')] },
  { version: '3.3', kind: 'unique', nameEn: "Blinkbat's Form", changes: [
    chg('跑步／行走速度 +10% → +30%', 'Faster Run/Walk +10% → +30%'),
    add('每次擊殺 +1 魔力', '+1 Mana after each Kill'),
  ] },
  { version: '3.3', kind: 'unique', nameEn: 'The Ward', changes: [add('鑲孔（1）', 'Socketed (1)')] },
  { version: '3.3', kind: 'unique', nameEn: 'Manald Heal', changes: [add('施法速度 +10%', '+10% Faster Cast Rate')] },
  { version: '3.3', kind: 'set', nameEn: 'Angelic Raiment', changes: [add('全套：所有技能 +1', 'Full set: +1 to All Skills')] },
  { version: '3.3', kind: 'setItem', nameEn: 'Angelic Sickle', parentSet: 'Angelic Raiment', changes: [add('傷害 +6（三件套）', '+6 Damage (3-item set)')] },
  { version: '3.3', kind: 'setItem', nameEn: 'Angelic Mantle', parentSet: 'Angelic Raiment', changes: [add('對不死怪物的傷害 +100%（三件套）', '+100% Damage to Undead (3-item set)')] },
];

/** 3.3 起「先前僅限天梯、現在非天梯也能取得」的項目（nameEn） */
export const NON_LADDER_NOW = {
  items: ['Angelic Raiment', 'Bane Ash', "Blinkbat's Form", 'Bloodletter', 'Gravenspine', 'Manald Heal', 'Pluckeye', "Rogue's Bow", 'The Battlebranch', 'The Ward'],
  runewords: ['Mania', 'Hysteria', 'Metamorphosis', 'Ground', 'Temper', 'Hearth', 'Cure', 'Bulwark'],
};

export const PATCH_SOURCE = { name: 'd2db.net', url: 'https://d2db.net/?page=article&id=112', titleEn: 'Ladder Season 15 & 16 Item Changes' };
