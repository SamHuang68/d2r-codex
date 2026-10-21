import { CLASS_ZH, findEntry, getSocketables, withBase, type CatalogEntry } from '../engine/catalog';
import { skillById, skillByName } from '../engine/skills';
import { customEntry, validateCustomDef, type CustomItemDef } from '../engine/customItem';
import { DEFAULT_MERC, MERC_SLOTS, type Alloc, type Difficulty, type DollSlot, type Equipped, type EquippedMap, type MercState, type Quests } from '../components/simulator/v2/types';

/** 模擬器的完整狀態（畫面上的物件）；流派範本與自訂 Profile 都先轉成這個再套用 */
export interface SimSnapshot {
  classCode: string;
  level: number;
  difficulty: Difficulty;
  quests: Quests;
  alloc: Alloc;
  equipped: EquippedMap;
  charms: CatalogEntry[];
  swap: 'I' | 'II';
  skillPoints: Record<string, number>;
  activeSkillId: string;
  buffsOn: Record<string, boolean>;
  targetRes: number;
  rollMax: boolean;
  /** 傭兵；舊存檔與流派範本沒有這個欄位，套用時保留目前的傭兵 */
  merc?: MercState;
}

/** 套用範圍：只換裝備、只換技能，或連等級與配點一起換 */
export interface ApplyParts { gear: boolean; skills: boolean; character: boolean }
export const ALL_PARTS: ApplyParts = { gear: true, skills: true, character: true };

interface SavedItem { id: string; baseCode?: string; ethereal?: boolean; sockets?: string[]; socketCount?: number; randomSkill?: string; /** 自訂飾品：整份定義存進去（目錄裡找不到它） */ custom?: CustomItemDef }
type SavedMerc = { on: boolean; id: number; level: number; equipped: Partial<Record<DollSlot, SavedItem>> };
type SavedData = Omit<SimSnapshot, 'equipped' | 'charms' | 'merc'> & { equipped: Partial<Record<DollSlot, SavedItem>>; charms: SavedItem[]; merc?: SavedMerc };

export interface SavedProfile { v: 1; id: string; name: string; savedAt: number; data: SavedData }

const KEY = 'd2sim.profiles.v1';

const saveItem = (eq: Equipped): SavedItem => ({ id: eq.entry.id, baseCode: eq.entry.baseCode, ethereal: eq.ethereal || undefined, sockets: eq.sockets?.length ? eq.sockets : undefined, socketCount: eq.socketCount, randomSkill: eq.randomSkill, custom: eq.entry.custom });

/** 畫面狀態 → 存檔：只存物品 id 與玩家的選擇，不存整份資料 */
export function toSavedData(s: SimSnapshot): SavedData {
  const equipped: SavedData['equipped'] = {};
  (Object.keys(s.equipped) as DollSlot[]).forEach((k) => { const e = s.equipped[k]; if (e) equipped[k] = saveItem(e); });
  const { merc, ...rest } = s;
  const out: SavedData = { ...rest, equipped, charms: s.charms.map((c) => ({ id: c.id, baseCode: c.baseCode, custom: c.custom })) };
  if (merc) {
    const me: SavedMerc['equipped'] = {};
    (Object.keys(merc.equipped) as DollSlot[]).forEach((k) => { const e = merc.equipped[k]; if (e) me[k] = saveItem(e); });
    out.merc = { on: merc.on, id: merc.id, level: merc.level, equipped: me };
  }
  return out;
}

function restoreItem(it: SavedItem, errors: string[]): Equipped | undefined {
  if (it.custom) {
    const e = customEntry(it.custom);
    if (!e) { errors.push(`無法還原自訂物品「${it.custom.name}」`); return undefined; }
    return { entry: e, ethereal: it.ethereal, sockets: undefined, socketCount: undefined };
  }
  let entry = findEntry(it.id);
  if (!entry) { errors.push(`找不到物品「${it.id}」（遊戲資料版本可能不同）`); return undefined; }
  if (it.baseCode && it.baseCode !== entry.baseCode) entry = withBase(entry, it.baseCode);
  const known = getSocketables();
  const sockets = it.sockets?.filter((id) => { const ok = known.some((s) => s.id === id); if (!ok) errors.push(`找不到鑲嵌物「${id}」`); return ok; });
  return { entry, ethereal: it.ethereal, sockets: sockets?.length ? sockets : undefined, socketCount: it.socketCount, randomSkill: it.randomSkill && skillByName(it.randomSkill) ? it.randomSkill : undefined };
}

/** 存檔 → 畫面狀態；任何找不到的項目都會列入 errors，不會悄悄丟掉 */
export function fromSavedData(d: SavedData): { snap: SimSnapshot; errors: string[] } {
  const errors: string[] = []; const equipped: EquippedMap = {};
  (Object.keys(d.equipped ?? {}) as DollSlot[]).forEach((k) => { const r = restoreItem(d.equipped[k]!, errors); if (r) equipped[k] = r; });
  const charms: CatalogEntry[] = [];
  (d.charms ?? []).forEach((c) => { const r = restoreItem(c, errors); if (r) charms.push(r.entry); });
  let merc: MercState | undefined;
  if (d.merc) {
    const me: EquippedMap = {};
    (Object.keys(d.merc.equipped ?? {}) as DollSlot[]).forEach((k) => { const r = restoreItem(d.merc!.equipped[k]!, errors); if (r) me[k] = r; });
    merc = { on: d.merc.on, id: d.merc.id, level: d.merc.level, equipped: me };
  }
  const { merc: _savedMerc, ...rest } = d; void _savedMerc;
  return { snap: { ...rest, equipped, charms, ...(merc ? { merc } : {}) }, errors };
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
/** 數字欄位：不是數字就用預設值，是數字就四捨五入並夾進範圍（等級、屬性點這類單一數值不值得為此整份拒絕） */
const int = (v: unknown, lo: number, hi: number, d: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(lo, Math.min(hi, Math.round(v))) : d);

const DOLL_SLOTS: DollSlot[] = ['head', 'neck', 'body', 'gloves', 'belt', 'ring1', 'ring2', 'boots', 'weaponI', 'shieldI', 'weaponII', 'shieldII'];
const MAX_CHARMS = 40;

/** 單件物品的結構檢查：結構不對（不是物品、鑲嵌欄位不是文字陣列）就回傳原因，不猜、不補 */
function cleanItem(v: unknown, where: string): SavedItem | string {
  if (!isObj(v) || typeof v.id !== 'string' || !v.id) return `${where}不是物品`;
  if (v.baseCode !== undefined && typeof v.baseCode !== 'string') return `${where}的底材代碼不是文字`;
  if (v.sockets !== undefined && !(Array.isArray(v.sockets) && v.sockets.length <= 6 && v.sockets.every((x) => typeof x === 'string'))) return `${where}的鑲嵌欄位不合法`;
  let custom: CustomItemDef | undefined;
  if (v.custom !== undefined) { const c = validateCustomDef(v.custom); if (typeof c === 'string') return `${where}：${c}`; custom = c; }
  if (v.randomSkill !== undefined && typeof v.randomSkill !== 'string') return `${where}的隨機技能不是文字`;
  return { custom, randomSkill: v.randomSkill as string | undefined, id: v.id, baseCode: v.baseCode as string | undefined, ethereal: v.ethereal === true || undefined, sockets: v.sockets as string[] | undefined, socketCount: v.socketCount === undefined ? undefined : int(v.socketCount, 0, 6, 0) };
}

/** 檢查存檔／匯入內容的結構，不信任外部文字。結構不合就回傳原因（不會丟例外，也不會讓壞資料流進畫面） */
function validate(raw: unknown): SavedProfile | string {
  if (!isObj(raw) || raw.v !== 1 || typeof raw.name !== 'string' || !isObj(raw.data)) return '格式不符：不是本模擬器匯出的 Profile';
  const d = raw.data;
  if (typeof d.classCode !== 'string' || !(d.classCode in CLASS_ZH)) return `格式不符：不認得的職業「${String(d.classCode)}」`;
  if (!isObj(d.equipped)) return '格式不符：缺少裝備欄位';

  const equipped: SavedData['equipped'] = {};
  for (const [slot, v] of Object.entries(d.equipped)) {
    if (!DOLL_SLOTS.includes(slot as DollSlot)) return `格式不符：不認得的裝備欄位「${slot}」`;
    const it = cleanItem(v, `裝備欄位「${slot}」`); if (typeof it === 'string') return `格式不符：${it}`;
    equipped[slot as DollSlot] = it;
  }
  const charms: SavedItem[] = [];
  if (d.charms !== undefined) {
    if (!Array.isArray(d.charms) || d.charms.length > MAX_CHARMS) return '格式不符：護身符清單不合法';
    for (const [i, v] of d.charms.entries()) { const it = cleanItem(v, `第 ${i + 1} 個護身符`); if (typeof it === 'string') return `格式不符：${it}`; charms.push(it); }
  }
  const skillPoints: Record<string, number> = {};
  if (d.skillPoints !== undefined) {
    if (!isObj(d.skillPoints)) return '格式不符：技能點不是物件';
    for (const [id, v] of Object.entries(d.skillPoints)) {
      if (typeof v !== 'number' || !Number.isFinite(v)) return `格式不符：技能「${id}」的點數不是數字`;
      const pts = int(v, 0, skillById(id)?.maxLvl ?? 20, 0); if (pts > 0) skillPoints[id] = pts;
    }
  }
  const buffsOn: Record<string, boolean> = {};
  if (d.buffsOn !== undefined) {
    if (!isObj(d.buffsOn)) return '格式不符：增益勾選不是物件';
    for (const [id, v] of Object.entries(d.buffsOn)) { if (typeof v !== 'boolean') return `格式不符：增益「${id}」不是勾選值`; if (v) buffsOn[id] = true; }
  }
  let merc: SavedMerc | undefined;
  if (d.merc !== undefined) {
    if (!isObj(d.merc)) return '格式不符：傭兵欄位不是物件';
    const me: SavedMerc['equipped'] = {};
    if (d.merc.equipped !== undefined) {
      if (!isObj(d.merc.equipped)) return '格式不符：傭兵裝備不是物件';
      for (const [slot, v] of Object.entries(d.merc.equipped)) {
        if (!(MERC_SLOTS as readonly string[]).includes(slot)) return `格式不符：傭兵不能穿戴「${slot}」`;
        const it = cleanItem(v, `傭兵的「${slot}」`); if (typeof it === 'string') return `格式不符：${it}`;
        me[slot as DollSlot] = it;
      }
    }
    merc = { on: d.merc.on === true, id: int(d.merc.id, 0, 99, DEFAULT_MERC.id), level: int(d.merc.level, 1, 99, DEFAULT_MERC.level), equipped: me };
  }
  const q = isObj(d.quests) ? d.quests : {}; const a = isObj(d.alloc) ? d.alloc : {};
  const name = raw.name.trim().slice(0, 40) || '匯入的 Profile';
  const clean: SavedData = {
    classCode: d.classCode, level: int(d.level, 1, 99, 90),
    difficulty: d.difficulty === 'normal' || d.difficulty === 'nightmare' ? d.difficulty : 'hell',
    quests: { lifePotions: int(q.lifePotions, 0, 3, 3), anya: int(q.anya, 0, 3, 3), lamEsen: int(q.lamEsen, 0, 3, 3), skillPts: int(q.skillPts, 0, 3, 3) },
    alloc: { str: int(a.str, 0, 999, 0), dex: int(a.dex, 0, 999, 0), vit: int(a.vit, 0, 999, 0), ene: int(a.ene, 0, 999, 0) },
    equipped, charms, swap: d.swap === 'II' ? 'II' : 'I', skillPoints, activeSkillId: typeof d.activeSkillId === 'string' ? d.activeSkillId : '',
    buffsOn, targetRes: int(d.targetRes, -100, 100, 0), rollMax: d.rollMax !== false,
    ...(merc ? { merc } : {}),
  };
  return { v: 1, id: typeof raw.id === 'string' ? raw.id : '', name, savedAt: int(raw.savedAt, 0, Number.MAX_SAFE_INTEGER, Date.now()), data: clean };
}

/** 讀出瀏覽器裡的 Profile。格式損壞的存檔不會顯示也不會被套用，但會回報數量，讓使用者知道有東西被略過 */
export function loadProfiles(): { list: SavedProfile[]; rejected: number } {
  try {
    const arr = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(arr)) return { list: [], rejected: 1 };
    const results = arr.map(validate);
    const list = results.filter((x): x is SavedProfile => typeof x !== 'string').sort((x, y) => y.savedAt - x.savedAt);
    return { list, rejected: results.length - list.length };
  } catch { return { list: [], rejected: 1 }; }
}

/** 寫入；失敗（無痕模式、容量滿）回傳 false，由呼叫端提示，不假裝已儲存 */
export function storeProfiles(list: SavedProfile[]): boolean {
  try { window.localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch { return false; }
}

export const newProfile = (name: string, snap: SimSnapshot): SavedProfile => ({
  v: 1, id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name: name.trim().slice(0, 40), savedAt: Date.now(), data: toSavedData(snap),
});

const DRAFT_KEY = 'd2sim.draft.v1';

/** 自動暫存：離開配裝頁（例如跳去百科）再回來時還原目前的配裝。只存一份，下一次變更就覆蓋 */
export function saveDraft(snap: SimSnapshot): void {
  try { window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ v: 1, name: '暫存', savedAt: Date.now(), data: toSavedData(snap) })); } catch { /* 無痕或容量滿時略過，不影響使用 */ }
}

/** 讀出暫存；結構不對（損壞或舊版）就當作沒有 */
export function loadDraft(): SavedData | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY); if (!raw) return null;
    const r = validate(JSON.parse(raw)); return typeof r === 'string' ? null : r.data;
  } catch { return null; }
}

export const exportProfile = (p: SavedProfile): string => JSON.stringify({ ...p, id: '' });

export function parseProfile(text: string): SavedProfile | string {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return '不是有效的 JSON'; }
  return validate(raw);
}
