import { findEntry, getSocketables, withBase, type CatalogEntry } from '../engine/catalog';
import type { Alloc, Difficulty, DollSlot, Equipped, EquippedMap, Quests } from '../components/simulator/v2/types';

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
}

/** 套用範圍：只換裝備、只換技能，或連等級與配點一起換 */
export interface ApplyParts { gear: boolean; skills: boolean; character: boolean }
export const ALL_PARTS: ApplyParts = { gear: true, skills: true, character: true };

interface SavedItem { id: string; baseCode?: string; ethereal?: boolean; sockets?: string[]; socketCount?: number }
type SavedData = Omit<SimSnapshot, 'equipped' | 'charms'> & { equipped: Partial<Record<DollSlot, SavedItem>>; charms: SavedItem[] };

export interface SavedProfile { v: 1; id: string; name: string; savedAt: number; data: SavedData }

const KEY = 'd2sim.profiles.v1';

const saveItem = (eq: Equipped): SavedItem => ({ id: eq.entry.id, baseCode: eq.entry.baseCode, ethereal: eq.ethereal || undefined, sockets: eq.sockets?.length ? eq.sockets : undefined, socketCount: eq.socketCount });

/** 畫面狀態 → 存檔：只存物品 id 與玩家的選擇，不存整份資料 */
export function toSavedData(s: SimSnapshot): SavedData {
  const equipped: SavedData['equipped'] = {};
  (Object.keys(s.equipped) as DollSlot[]).forEach((k) => { const e = s.equipped[k]; if (e) equipped[k] = saveItem(e); });
  return { ...s, equipped, charms: s.charms.map((c) => ({ id: c.id, baseCode: c.baseCode })) };
}

function restoreItem(it: SavedItem, errors: string[]): Equipped | undefined {
  let entry = findEntry(it.id);
  if (!entry) { errors.push(`找不到物品「${it.id}」（遊戲資料版本可能不同）`); return undefined; }
  if (it.baseCode && it.baseCode !== entry.baseCode) entry = withBase(entry, it.baseCode);
  const known = getSocketables();
  const sockets = it.sockets?.filter((id) => { const ok = known.some((s) => s.id === id); if (!ok) errors.push(`找不到鑲嵌物「${id}」`); return ok; });
  return { entry, ethereal: it.ethereal, sockets: sockets?.length ? sockets : undefined, socketCount: it.socketCount };
}

/** 存檔 → 畫面狀態；任何找不到的項目都會列入 errors，不會悄悄丟掉 */
export function fromSavedData(d: SavedData): { snap: SimSnapshot; errors: string[] } {
  const errors: string[] = []; const equipped: EquippedMap = {};
  (Object.keys(d.equipped ?? {}) as DollSlot[]).forEach((k) => { const r = restoreItem(d.equipped[k]!, errors); if (r) equipped[k] = r; });
  const charms: CatalogEntry[] = [];
  (d.charms ?? []).forEach((c) => { const r = restoreItem(c, errors); if (r) charms.push(r.entry); });
  return { snap: { ...d, equipped, charms }, errors };
}

const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** 檢查存檔／匯入內容的結構，不信任外部文字 */
function validate(raw: unknown): SavedProfile | string {
  if (!isObj(raw) || raw.v !== 1 || typeof raw.name !== 'string' || !isObj(raw.data)) return '格式不符：不是本模擬器匯出的 Profile';
  const d = raw.data;
  if (typeof d.classCode !== 'string' || !isObj(d.equipped)) return '格式不符：缺少職業或裝備欄位';
  const q = isObj(d.quests) ? d.quests : {}; const a = isObj(d.alloc) ? d.alloc : {};
  const clean: SavedData = {
    classCode: d.classCode, level: Math.max(1, Math.min(99, num(d.level, 90))),
    difficulty: d.difficulty === 'normal' || d.difficulty === 'nightmare' ? d.difficulty : 'hell',
    quests: { lifePotions: num(q.lifePotions, 3), anya: num(q.anya, 3), lamEsen: num(q.lamEsen, 3), skillPts: num(q.skillPts, 3) },
    alloc: { str: Math.max(0, num(a.str, 0)), dex: Math.max(0, num(a.dex, 0)), vit: Math.max(0, num(a.vit, 0)), ene: Math.max(0, num(a.ene, 0)) },
    equipped: d.equipped as SavedData['equipped'], charms: Array.isArray(d.charms) ? (d.charms as SavedItem[]) : [], swap: d.swap === 'II' ? 'II' : 'I',
    skillPoints: isObj(d.skillPoints) ? (d.skillPoints as Record<string, number>) : {}, activeSkillId: typeof d.activeSkillId === 'string' ? d.activeSkillId : '',
    buffsOn: isObj(d.buffsOn) ? (d.buffsOn as Record<string, boolean>) : {}, targetRes: num(d.targetRes, 0), rollMax: d.rollMax !== false,
  };
  return { v: 1, id: typeof raw.id === 'string' ? raw.id : '', name: raw.name.slice(0, 40), savedAt: num(raw.savedAt, Date.now()), data: clean };
}

export function loadProfiles(): SavedProfile[] {
  try {
    const arr = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(arr)) return [];
    return arr.map(validate).filter((x): x is SavedProfile => typeof x !== 'string').sort((a, b) => b.savedAt - a.savedAt);
  } catch { return []; }
}

/** 寫入；失敗（無痕模式、容量滿）回傳 false，由呼叫端提示，不假裝已儲存 */
export function storeProfiles(list: SavedProfile[]): boolean {
  try { window.localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch { return false; }
}

export const newProfile = (name: string, snap: SimSnapshot): SavedProfile => ({
  v: 1, id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name: name.trim().slice(0, 40), savedAt: Date.now(), data: toSavedData(snap),
});

export const exportProfile = (p: SavedProfile): string => JSON.stringify({ ...p, id: '' });

export function parseProfile(text: string): SavedProfile | string {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return '不是有效的 JSON'; }
  return validate(raw);
}
