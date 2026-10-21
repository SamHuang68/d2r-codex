// S2 計算引擎型別。引擎為純函式，資料由呼叫端以 GameData 注入（見 data.ts）。

export interface Modifier {
  code: string;
  par?: number | string;
  min?: number;
  max?: number;
}

export interface PropertyPart {
  func?: number;
  stat?: string;
  set?: number;
  val?: number;
}
export interface PropertyDef { id?: number; parts: PropertyPart[]; tooltip?: string }

export interface StatDef {
  Stat: string;
  op?: number;
  op_param?: number;
  op_stat1?: string;
  [k: string]: unknown;
}

export interface CharStats {
  class: string;
  str: number; dex: number; int: number; vit: number; stamina: number; hpadd: number;
  LifePerLevel: number; LifePerVitality: number; ManaPerLevel: number; ManaPerMagic: number;
  StaminaPerLevel: number; StaminaPerVitality: number; BlockFactor: number; ToHitFactor: number;
  StatPerLevel: number; SkillsPerLevel: number;
  [k: string]: unknown;
}

export interface BaseItem {
  code: string; nameEn: string; name: string; kind: 'armor' | 'weapon' | 'misc';
  type: string; ancestors: string[]; class?: string;
  reqStr?: number; reqDex?: number; levelReq?: number;
  minAc?: number; maxAc?: number; block?: number;
  minDam?: number; maxDam?: number; twoHanded?: boolean; minDam2h?: number; maxDam2h?: number;
  strBonus?: number; dexBonus?: number; speed?: number; sockets?: number;
  spawnable?: boolean; quest?: boolean;
  durability?: number; rangeAdder?: number; minMisDam?: number; maxMisDam?: number;
  /** 遊戲內的英文顯示名（nameEn 是資料表的內部名，可能含拼寫錯誤） */
  nameEnUS?: string;
  /** 盾牌重擊傷害、靴子踢擊傷害（armor.txt 的 mindam／maxdam）、腰帶格數（belts.txt） */
  smiteMin?: number; smiteMax?: number; kickMin?: number; kickMax?: number; beltSlots?: number;
  /** 投擲武器的堆疊數量上限 */
  maxStack?: number;
  tier?: 'normal' | 'exceptional' | 'elite';
  width?: number; height?: number; oneOrTwoHanded?: boolean; invFile?: string;
}

export interface Gem { code: string; nameEn: string; name?: string; weapon: Modifier[]; armor: Modifier[]; shield: Modifier[] }

/** 套裝：件數達標才生效的加成（partial，2～5 件）與全套加成（full） */
export interface SetDef {
  id: string; nameEn: string; name?: string;
  /** 全套件數（遊戲資料中屬於此套裝且未停用的物品數） */
  size: number;
  partial: { pieces: number; mods: Modifier[] }[];
  full: Modifier[];
}

export interface GameData {
  charstats: CharStats[];
  properties: Record<string, PropertyDef>;
  stats: Record<string, StatDef>;
  bases: BaseItem[];
  gems: Gem[];
  /** 套裝加成資料；沒有提供時，套裝件只計算自身屬性 */
  sets?: SetDef[];
}

/** 單條屬性（已解析成遊戲內部 stat） */
export interface StatEntry {
  stat: string;
  value: number;
  /** 技能名稱、職業或技能樹編號（item_singleskill / item_addclassskills / item_addskill_tab 等） */
  param?: number | string;
  /** 觸發技能的等級（item_skillonhit 等，value 為機率） */
  level?: number;
}

/** 已穿戴的物品（引擎輸入）。mods 為最終屬性（暗金／套裝／符文之語已展開） */
export interface EquippedItem {
  slot: string;
  baseCode: string;
  mods: Modifier[];
  /** 鑲嵌物（寶石／符文／珠寶的 code）。符文之語的符文也計入（截圖：精神之劍含 Ort／Thul／Tal／Amn 的武器效果） */
  sockets?: string[];
  ethereal?: boolean;
  /** 該物品屬性取值：0=全取下限、1=全取上限（預設 1） */
  roll?: number;
  /** 底材防禦取值（0..1，預設 1） */
  defRoll?: number;
  /** 底材防禦範圍的覆寫（min, max）：只給與遊戲資料表不一致、改採參考網站數值的暗金，見 engine/referenceOverrides.ts */
  baseAc?: [number, number];
  /** 物品等級需求（暗金／套裝／符文之語） */
  requiredLevel?: number;
  name?: string;
  /** 套裝 id（遊戲資料 sets.json）；同套裝的件數會觸發套裝加成。件數以不同的 name 計，同一件穿兩次只算一件 */
  setId?: string;
  /** 此件自己的套裝加成：穿戴同套裝件數 ≥ pieces 時生效（資料的 aprop 第 N 組＝ N+1 件） */
  setBonus?: { pieces: number; mods: Modifier[] }[];
  /** 使用者為「隨機單一技能」選的技能（英文名稱），例如奧姆斯長袍 */
  randomSkill?: string;
}

export interface QuestBonuses {
  /** 生命藥水（第三幕「金鳥」，每難度 +20 最大生命，永久；來源：社群共識，尚待遊戲內驗證） */
  lifePotions?: number;
}

export type Difficulty = 'normal' | 'nightmare' | 'hell';

export interface CharacterInput {
  className: string;
  level: number;
  /** 玩家配點（不含起始值） */
  allocated: { str: number; dex: number; vit: number; ene: number };
  items: EquippedItem[];
  difficulty?: Difficulty;
  /** 已完成的安亞抗性卷軸數（每難度 +10，預設＝目前難度序號+1 之全數） */
  anyaScrolls?: number;
  /** 任務永久加成。未提供＝全部視為 0（不臆測）；UI 應讓使用者勾選 */
  quests?: QuestBonuses;
  /** 額外屬性來源（技能、光環、戰吼等）— 引擎之外計算後注入 */
  extraStats?: StatEntry[];
}

export interface CharacterResult {
  attributes: { str: number; dex: number; vit: number; ene: number };
  life: number; mana: number; stamina: number;
  defense: number;
  blockChance: number;
  resist: { fire: number; cold: number; lightning: number; poison: number };
  maxResist: { fire: number; cold: number; lightning: number; poison: number };
  /** 未被上限截斷前的抗性 */
  rawResist: { fire: number; cold: number; lightning: number; poison: number };
  skills: { all: number; byClass: Record<string, number>; byTab: Record<number, number>; single: Record<string, number> };
  weaponDamage?: { min: number; max: number; slot: string };
  requirementsUnmet: { slot: string; need: string }[];
  /** 其餘累加後的原始 stat（FCR、FHR、MF、吸血…），供 UI 顯示與後續引擎使用 */
  stats: Record<string, number>;
  /** 目前穿戴的套裝：件數與已生效的加成件數門檻 */
  sets: { id: string; nameEn: string; name?: string; count: number; size: number; activePieces: number[]; full: boolean }[];
  /** 未被引擎處理的 modifier（絕不可無聲丟棄） */
  unhandled: { slot: string; code: string; reason: string }[];
}
