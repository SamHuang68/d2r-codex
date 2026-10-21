/**
 * 裝備分類樹：裝備寶典、底材寶典共用。
 * 分類依據是遊戲資料本身的物品類型（src/data/game/bases.json 的 type 與 itemtypes.json 的 uiCategory），
 * 不另外維護第二份物品清單；這裡只決定「怎麼分層、中文怎麼叫」。
 */
import { gameData } from '../engine/data';
import type { BaseItem } from '../engine/types';

export interface TaxDef {
  id: string;
  label: string;
  /** 英文名，顯示在索引的小字與提示 */
  en?: string;
  children?: TaxDef[];
}

/** 防具與武器的分類（相對路徑 id，掛到各頁面的根節點之下） */
export const EQUIP_DEFS: TaxDef[] = [
  {
    id: 'armor', label: '防具', children: [
      {
        id: 'armor/head', label: '頭部', children: [
          { id: 'armor/head/helm', label: '頭盔', en: 'Helm' },
          { id: 'armor/head/circ', label: '頭環', en: 'Circlet' },
          { id: 'armor/head/phlm', label: '野蠻人頭盔', en: 'Primal Helm' },
          { id: 'armor/head/pelt', label: '德魯伊頭飾', en: 'Pelt' },
        ],
      },
      { id: 'armor/body', label: '盔甲', en: 'Armor' },
      {
        id: 'armor/shield', label: '盾牌', children: [
          { id: 'armor/shield/shie', label: '通用盾牌', en: 'Shield' },
          { id: 'armor/shield/ashd', label: '聖騎士盾牌', en: 'Auric Shield' },
          { id: 'armor/shield/head', label: '死靈法師首級', en: 'Voodoo Head' },
          { id: 'armor/shield/grim', label: '術士魔典', en: 'Grimoire' },
        ],
      },
      { id: 'armor/gloves', label: '手套', en: 'Gloves' },
      { id: 'armor/boots', label: '靴子', en: 'Boots' },
      { id: 'armor/belt', label: '腰帶', en: 'Belt' },
    ],
  },
  {
    id: 'weapon', label: '武器', children: [
      {
        id: 'weapon/melee', label: '近戰武器', children: [
          { id: 'weapon/melee/swor', label: '刀劍', en: 'Sword' },
          { id: 'weapon/melee/knif', label: '匕首', en: 'Dagger' },
          { id: 'weapon/melee/axe', label: '斧', en: 'Axe' },
          { id: 'weapon/melee/club', label: '短棒', en: 'Club' },
          { id: 'weapon/melee/mace', label: '釘鎚', en: 'Mace' },
          { id: 'weapon/melee/hamm', label: '重槌', en: 'Hammer' },
          { id: 'weapon/melee/scep', label: '權杖', en: 'Scepter' },
        ],
      },
      {
        id: 'weapon/polearm', label: '長柄與長矛', children: [
          { id: 'weapon/polearm/pole', label: '長柄武器', en: 'Polearm' },
          { id: 'weapon/polearm/spea', label: '長矛', en: 'Spear' },
        ],
      },
      {
        id: 'weapon/ranged', label: '弓與弩', children: [
          { id: 'weapon/ranged/bow', label: '弓', en: 'Bow' },
          { id: 'weapon/ranged/xbow', label: '弩', en: 'Crossbow' },
        ],
      },
      {
        id: 'weapon/throw', label: '投擲武器', children: [
          { id: 'weapon/throw/jave', label: '標槍', en: 'Javelin' },
          { id: 'weapon/throw/tkni', label: '飛刀', en: 'Throwing Knife' },
          { id: 'weapon/throw/taxe', label: '飛斧', en: 'Throwing Axe' },
        ],
      },
      {
        id: 'weapon/caster', label: '法杖・魔杖・法球', children: [
          { id: 'weapon/caster/staf', label: '法杖', en: 'Staff' },
          { id: 'weapon/caster/wand', label: '魔杖', en: 'Wand' },
          { id: 'weapon/caster/orb', label: '法球', en: 'Orb' },
        ],
      },
      {
        id: 'weapon/class', label: '職業專用武器', children: [
          { id: 'weapon/class/abow', label: '亞馬遜弓', en: 'Amazon Bow' },
          { id: 'weapon/class/aspe', label: '亞馬遜長矛', en: 'Amazon Spear' },
          { id: 'weapon/class/ajav', label: '亞馬遜標槍', en: 'Amazon Javelin' },
          { id: 'weapon/class/h2h', label: '刺客爪', en: 'Claw' },
        ],
      },
    ],
  },
];

/** 飾品（沒有底材品階，只有暗金／套裝會出現） */
export const JEWELRY_DEF: TaxDef = {
  id: 'jewelry', label: '飾品', children: [
    { id: 'jewelry/ring', label: '戒指', en: 'Ring' },
    { id: 'jewelry/amulet', label: '項鍊', en: 'Amulet' },
    { id: 'jewelry/charm', label: '護身符', en: 'Charm' },
    { id: 'jewelry/jewel', label: '珠寶', en: 'Jewel' },
  ],
};

/** 遊戲物品類型代碼 → 葉節點（相對路徑） */
export const TYPE_LEAF: Record<string, string> = {
  helm: 'armor/head/helm', circ: 'armor/head/circ', phlm: 'armor/head/phlm', pelt: 'armor/head/pelt',
  tors: 'armor/body',
  shie: 'armor/shield/shie', ashd: 'armor/shield/ashd', head: 'armor/shield/head', grim: 'armor/shield/grim',
  glov: 'armor/gloves', boot: 'armor/boots', belt: 'armor/belt',
  swor: 'weapon/melee/swor', knif: 'weapon/melee/knif', axe: 'weapon/melee/axe', club: 'weapon/melee/club',
  mace: 'weapon/melee/mace', hamm: 'weapon/melee/hamm', scep: 'weapon/melee/scep',
  pole: 'weapon/polearm/pole', spea: 'weapon/polearm/spea',
  bow: 'weapon/ranged/bow', xbow: 'weapon/ranged/xbow',
  jave: 'weapon/throw/jave', tkni: 'weapon/throw/tkni', taxe: 'weapon/throw/taxe',
  staf: 'weapon/caster/staf', wand: 'weapon/caster/wand', orb: 'weapon/caster/orb',
  abow: 'weapon/class/abow', aspe: 'weapon/class/aspe', ajav: 'weapon/class/ajav',
  h2h: 'weapon/class/h2h', h2h2: 'weapon/class/h2h',
};

const SLOT_LEAF: Record<string, string> = {
  helm: 'armor/head/helm', armor: 'armor/body', shield: 'armor/shield/shie', gloves: 'armor/gloves',
  boots: 'armor/boots', belt: 'armor/belt', weapon: 'weapon/melee/swor',
  ring: 'jewelry/ring', amulet: 'jewelry/amulet', charm: 'jewelry/charm', jewel: 'jewelry/jewel',
};

const norm = (s: string) => s.toLowerCase().replace(/[_'’\-\s]+/g, ' ').trim();
const byNorm = new Map<string, BaseItem>();
const byZh = new Map<string, BaseItem>();
for (const b of gameData.bases) {
  const k = norm(b.nameEn);
  if (!byNorm.has(k)) byNorm.set(k, b);
  if (b.name && b.kind !== 'misc' && !byZh.has(b.name)) byZh.set(b.name, b);
}

/** 以 id（底線英文名）、英文名、中文名依序比對遊戲底材資料 */
export function resolveGameBase(ref: { id?: string; nameEn?: string; name?: string }): BaseItem | undefined {
  return (ref.id ? byNorm.get(norm(ref.id)) : undefined)
    ?? (ref.nameEn ? byNorm.get(norm(ref.nameEn)) : undefined)
    ?? (ref.name ? byZh.get(ref.name) : undefined);
}

/** 遊戲底材 → 分類葉節點（相對路徑）；找不到時回傳 undefined */
export function leafOfBase(b: BaseItem | undefined): string | undefined {
  return b ? TYPE_LEAF[b.type] : undefined;
}

/** 暗金／套裝單件 → 分類葉節點（飾品依部位，其餘依底材的遊戲類型，最後才退回部位） */
export function leafOfItem(item: { slot: string; baseItemId?: string; baseItem?: string }): string {
  if (item.slot === 'ring' || item.slot === 'amulet' || item.slot === 'charm' || item.slot === 'jewel') return SLOT_LEAF[item.slot];
  const b = resolveGameBase({ id: item.baseItemId, name: item.baseItem });
  return leafOfBase(b) ?? SLOT_LEAF[item.slot] ?? 'armor/body';
}

export type TierKey = 'normal' | 'exceptional' | 'elite';
export const TIER_ORDER: TierKey[] = ['normal', 'exceptional', 'elite'];

/** 底材品階：普通 → 卓越 → 精英。實際遊玩最終都停在精英，普通與卓越只在前期拓荒用到，所以預設看精英 */
export const TIER_META: { key: TierKey; label: string; sub: string }[] = [
  { key: 'normal', label: '普通', sub: '拓荒期' },
  { key: 'exceptional', label: '卓越', sub: '過渡期' },
  { key: 'elite', label: '精英', sub: '終局' },
];
export const TIER_LABEL: Record<TierKey, string> = { normal: '普通', exceptional: '卓越', elite: '精英' };
export const DEFAULT_TIER: TierKey = 'elite';

/** 普通／卓越／精英三層，每層底下都是同一套「部位 → 類型」分類 */
export function tierDefs(prefix: string): TaxDef[] {
  return TIER_META.map((t) => ({
    id: `${prefix}/${t.key}`,
    label: t.label,
    en: t.sub,
    children: prefixDefs(EQUIP_DEFS, `${prefix}/${t.key}`),
  }));
}

/** 底材（或暗金／套裝單件的底材）的品階 */
export function tierOfBase(b: BaseItem | undefined, fallback?: string): TierKey {
  const t = b?.tier ?? fallback;
  return t === 'exceptional' || t === 'elite' ? t : 'normal';
}

/** 護身符尺寸（飾品沒有品階，改以尺寸分段） */
export function charmSize(baseItemId?: string): 'small' | 'large' | 'grand' | undefined {
  const k = (baseItemId ?? '').toLowerCase();
  if (k.startsWith('small')) return 'small';
  if (k.startsWith('large')) return 'large';
  if (k.startsWith('grand')) return 'grand';
  return undefined;
}

// ------------------------------------------------------------
// 通用的樹工具
// ------------------------------------------------------------

export interface TreeNode {
  id: string;
  label: string;
  en?: string;
  /** 此節點底下（含自己）的項目數 */
  count: number;
  children?: TreeNode[];
}

/** 為整棵定義加上路徑前綴（例如把 EQUIP_DEFS 掛在 'u' 底下） */
export function prefixDefs(defs: TaxDef[], prefix: string): TaxDef[] {
  return defs.map((d) => ({
    ...d,
    id: `${prefix}/${d.id}`,
    children: d.children ? prefixDefs(d.children, prefix) : undefined,
  }));
}

/** 葉節點 id 是否落在某節點之下（含自己） */
export const inNode = (leafId: string, nodeId: string) => nodeId === 'all' || leafId === nodeId || leafId.startsWith(`${nodeId}/`);

/**
 * 依各葉節點的項目數建樹。keepEmpty=false 時，沒有任何項目的節點整枝省略。
 */
export function buildTree(defs: TaxDef[], counts: Map<string, number>, keepEmpty = false): TreeNode[] {
  const out: TreeNode[] = [];
  for (const d of defs) {
    const kids = d.children ? buildTree(d.children, counts, keepEmpty) : undefined;
    const count = kids && kids.length ? kids.reduce((s, k) => s + k.count, 0) : counts.get(d.id) ?? 0;
    if (!keepEmpty && count === 0) continue;
    out.push({ id: d.id, label: d.label, en: d.en, count, children: kids && kids.length ? kids : undefined });
  }
  return out;
}

export function findNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    const hit = n.children ? findNode(n.children, id) : undefined;
    if (hit) return hit;
  }
  return undefined;
}

/** 由根到目標節點的路徑（不含虛擬根）；找不到回傳空陣列 */
export function pathTo(nodes: TreeNode[], id: string): TreeNode[] {
  for (const n of nodes) {
    if (n.id === id) return [n];
    const sub = n.children ? pathTo(n.children, id) : [];
    if (sub.length) return [n, ...sub];
  }
  return [];
}

/** 節點底下所有葉節點（沒有子節點者），維持樹的順序 */
export function leavesOf(n: TreeNode): TreeNode[] {
  return n.children ? n.children.flatMap(leavesOf) : [n];
}

/** 沿用同一棵樹的結構，改以另一組葉節點數量重算各層數量（搜尋時用，樹不會跟著跳動） */
export function recount(nodes: TreeNode[], counts: Map<string, number>): TreeNode[] {
  return nodes.map((n) => {
    const kids = n.children ? recount(n.children, counts) : undefined;
    const count = kids ? kids.reduce((s, k) => s + k.count, 0) : counts.get(n.id) ?? 0;
    return { ...n, count, children: kids };
  });
}

/** 葉節點相對於目前節點的路徑文字（例如在「精英」底下看到「防具 › 頭部 › 頭盔」），避免每段都重複上層名稱 */
export function relPath(tree: TreeNode[], leafId: string, nodeId: string): string {
  const chain = pathTo(tree, leafId);
  const idx = nodeId === 'all' ? 0 : chain.findIndex((n) => n.id === nodeId) + 1;
  const rest = chain.slice(Math.max(0, idx));
  return (rest.length ? rest : chain.slice(-1)).map((n) => n.label).join(' › ');
}
