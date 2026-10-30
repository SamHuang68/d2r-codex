/**
 * 站內分頁與網址路徑的對照（單一來源）：App.tsx 解析網址、vite.config.ts 建置時為每個分頁產生靜態 HTML 外殼，都讀這份。
 * 路徑就是分頁 id：/items/、/runewords/…；首頁（overview）是網站根目錄。
 * 舊的 #items 形式的網址仍可使用，載入時會自動轉成新路徑。
 */
export interface RouteMeta { id: string; title: string; description: string }

export const SITE_ORIGIN = 'https://d2r.samhuang68.org';

export const ROUTES: RouteMeta[] = [
  { id: 'overview', title: '主頁展演', description: '暗黑破壞神 II：獄火重生 (D2R) 旗艦遊戲專頁與全功能速查手冊 - 包含完整符文之語、暗金與套裝裝備、方塊合成配方、FCR/FHR 斷點計算與聖杯打寶追蹤器' },
  { id: 'characters', title: '角色寶典', description: 'D2R 八大職業屬性、技能方向與熱門流派（Meta Build）速查。' },
  { id: 'skills', title: '技能寶典', description: 'D2R 全職業技能樹、技能等級數值與協同加成矩陣。' },
  { id: 'planner', title: '配裝模擬', description: 'D2R 配裝模擬器：選職業、穿裝備、點技能，即時計算屬性、抗性與傭兵搭配。' },
  { id: 'breakpoints', title: '機制斷點', description: 'D2R 各職業 FCR、FHR、FBR、IAS 斷點表，快速算出需要多少屬性。' },
  { id: 'experience', title: '經驗值表', description: 'D2R 1～99 級升級所需經驗值與等級差經驗懲罰計算。' },
  { id: 'mercenaries', title: '傭兵寶典', description: 'D2R 四種傭兵的光環、成長與終極裝備搭配。' },
  { id: 'items', title: '裝備寶典', description: 'D2R 暗金與套裝裝備全覽：依品階、部位、類型分層整理，含屬性與掉落來源。' },
  { id: 'runewords', title: '符文之語', description: 'D2R 全部符文之語配方、所需底材與屬性速查（含天梯專屬）。' },
  { id: 'bases', title: '底材寶典', description: 'D2R 一般、進階、菁英底材的打孔數、防禦／傷害與力量敏捷需求。' },
  { id: 'runes', title: '符文寶庫', description: 'D2R 1～33 號符文的鑲嵌屬性、合成方式與用途。' },
  { id: 'props', title: '道具聖物', description: 'D2R 寶石、鑰匙、精華、藥劑與各種任務道具說明。' },
  { id: 'cube', title: '方塊工坊', description: 'D2R 赫拉迪克方塊配方：打孔、升級、重鑄與手工裝合成。' },
  { id: 'affixes', title: '詞綴寶典', description: 'D2R 魔法與稀有裝備的前綴後綴詞綴全表與等級需求。' },
  { id: 'valuation', title: '鑑寶估價', description: 'D2R 極品詞綴判斷與裝備估價器。' },
  { id: 'grail', title: '聖杯打寶', description: 'D2R 聖杯收集追蹤器：全部暗金、套裝與符文打勾記錄進度。' },
  { id: 'quests', title: '任務事件', description: 'D2R 永久獎勵任務與世界事件整理。' },
  { id: 'areas', title: '場景恐區', description: 'D2R 85 級場景、邪惡威脅區域與恐怖區域資訊。' },
  { id: 'monsters', title: '怪物圖鑑', description: 'D2R 怪物三種難度的抗性、免疫與出沒場景。' },
  { id: 'shrines', title: '聖壇圖鑑', description: 'D2R 各種聖壇的效果、持續時間與出現等級。' },
  { id: 'uber', title: '紅門六王', description: 'D2R 火炬任務與地獄崔斯特姆（紅門）流程攻略。' },
  { id: 'about', title: '資料來源與版權聲明', description: '本站資料與圖片來源、非官方聲明與原創內容說明。' },
];

export const KNOWN_TABS: string[] = ROUTES.map((r) => r.id);

/** 把目前網址的路徑拆成網站根目錄與分頁；路徑不是已知分頁時 tab 為 undefined（例如首頁、或開發模式的 index.html）。 */
export const parsePath = (pathname: string): { root: string; tab?: string } => {
  const parts = pathname.replace(/index\.html$/, '').split('/');
  // 結尾是 '' 代表以斜線結尾
  const trailing = parts[parts.length - 1] === '' ? parts.length - 2 : parts.length - 1;
  const last = parts[trailing];
  if (trailing >= 1 && KNOWN_TABS.includes(last) && last !== 'overview') {
    return { root: parts.slice(0, trailing).join('/') + '/', tab: last };
  }
  return { root: parts.slice(0, parts[parts.length - 1] === '' ? parts.length : parts.length - 1).join('/') + '/' };
};

/** 網站根目錄（以斜線開頭結尾）。 */
export const siteRoot = (): string => parsePath(window.location.pathname).root;

export const pathForTab = (tab: string): string => (tab === 'overview' ? siteRoot() : `${siteRoot()}${tab}/`);
