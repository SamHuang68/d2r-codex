/**
 * 站內分頁與網址路徑的對照（單一來源）：App.tsx 解析網址、vite.config.ts 建置時為每個分頁產生靜態 HTML 外殼，都讀這份。
 * 路徑就是分頁 id：/items/、/runewords/…；首頁（overview）是網站根目錄。
 * 舊的 #items 形式的網址仍可使用，載入時會自動轉成新路徑。
 */
export interface RouteMeta { id: string; title: string; description: string; titleEn: string; descriptionEn: string }

export const SITE_ORIGIN = 'https://d2r.samhuang68.org';

export const ROUTES: RouteMeta[] = [
  { id: 'overview', title: '主頁展演', description: '暗黑破壞神 II：獄火重生 (D2R) 旗艦遊戲專頁與全功能速查手冊 - 包含完整符文之語、暗金與套裝裝備、方塊合成配方、FCR/FHR 斷點計算與聖杯打寶追蹤器', titleEn: 'Home', descriptionEn: 'Diablo II: Resurrected (D2R) database and quick-reference handbook: runewords, uniques and sets, Horadric Cube recipes, FCR/FHR breakpoints and a Holy Grail tracker.' },
  { id: 'patches', title: '版本改動', description: 'D2R 3.3、3.4 版（天梯第 15、16 季）的物品改動：暗金、套裝與符文之語的數值調整，舊值對照新值。', titleEn: 'Patch Changes', descriptionEn: 'Item changes in D2R patches 3.3 and 3.4 (Ladder Seasons 15 and 16): old vs new values for uniques, sets and runewords.' },
  { id: 'characters', title: '角色寶典', description: 'D2R 八大職業屬性、技能方向與熱門流派（Meta Build）速查。', titleEn: 'Classes', descriptionEn: 'Attributes, skill focus and popular builds for all eight D2R classes.' },
  { id: 'skills', title: '技能寶典', description: 'D2R 全職業技能樹、技能等級數值與協同加成矩陣。', titleEn: 'Skill Trees', descriptionEn: 'Every D2R skill tree with per-level values and a synergy matrix.' },
  { id: 'planner', title: '配裝模擬', description: 'D2R 配裝模擬器：選職業、穿裝備、點技能，即時計算屬性、抗性與傭兵搭配。', titleEn: 'Armory Planner', descriptionEn: 'D2R build planner: pick a class, gear and skills, and see stats, resistances and mercenary setups update live.' },
  { id: 'breakpoints', title: '機制斷點', description: 'D2R 各職業 FCR、FHR、FBR、IAS 斷點表，快速算出需要多少屬性。', titleEn: 'Breakpoints', descriptionEn: 'FCR, FHR, FBR and IAS breakpoint tables for every D2R class.' },
  { id: 'experience', title: '經驗值表', description: 'D2R 1～99 級升級所需經驗值與等級差經驗懲罰計算。', titleEn: 'Experience', descriptionEn: 'D2R experience required for levels 1-99 and the level-difference experience penalty.' },
  { id: 'mercenaries', title: '傭兵寶典', description: 'D2R 四種傭兵的光環、成長與終極裝備搭配。', titleEn: 'Mercenaries', descriptionEn: 'Auras, scaling and best-in-slot gear for the four D2R mercenaries.' },
  { id: 'items', title: '裝備寶典', description: 'D2R 暗金與套裝裝備全覽：依品階、部位、類型分層整理，含屬性與掉落來源。', titleEn: 'Uniques & Sets', descriptionEn: 'All D2R unique and set items, organised by tier, slot and type, with stats and drop sources.' },
  { id: 'runewords', title: '符文之語', description: 'D2R 全部符文之語配方、所需底材與屬性速查（含天梯專屬）。', titleEn: 'Runewords', descriptionEn: 'Every D2R runeword with recipe, allowed bases and stats, including ladder-only ones.' },
  { id: 'bases', title: '底材寶典', description: 'D2R 一般、進階、菁英底材的打孔數、防禦／傷害與力量敏捷需求。', titleEn: 'Base Items', descriptionEn: 'Normal, exceptional and elite base items: sockets, defense or damage, and strength and dexterity requirements.' },
  { id: 'runes', title: '符文寶庫', description: 'D2R 1～33 號符文的鑲嵌屬性、合成方式與用途。', titleEn: 'Runes', descriptionEn: 'Runes 1-33 with socket effects, cube upgrade recipes and uses.' },
  { id: 'props', title: '道具聖物', description: 'D2R 寶石、鑰匙、精華、藥劑與各種任務道具說明。', titleEn: 'Props & Relics', descriptionEn: 'Gems, keys, essences, potions and quest items in D2R.' },
  { id: 'cube', title: '方塊工坊', description: 'D2R 赫拉迪克方塊配方：打孔、升級、重鑄與手工裝合成。', titleEn: 'Horadric Cube', descriptionEn: 'Horadric Cube recipes: socketing, upgrading, rerolling and crafting.' },
  { id: 'affixes', title: '詞綴寶典', description: 'D2R 魔法與稀有裝備的前綴後綴詞綴全表與等級需求。', titleEn: 'Magic Affixes', descriptionEn: 'Full table of magic and rare prefixes and suffixes with level requirements.' },
  { id: 'valuation', title: '鑑寶估價', description: 'D2R 極品詞綴判斷與裝備估價器。', titleEn: 'Price Check', descriptionEn: 'Judge good rolls and estimate the value of D2R gear.' },
  { id: 'grail', title: '聖杯打寶', description: 'D2R 聖杯收集追蹤器：全部暗金、套裝與符文打勾記錄進度。', titleEn: 'Holy Grail', descriptionEn: 'Holy Grail tracker: check off every unique, set item and rune to record your progress.' },
  { id: 'quests', title: '任務事件', description: 'D2R 永久獎勵任務與世界事件整理。', titleEn: 'Quests & Events', descriptionEn: 'Permanent-reward quests and world events in D2R.' },
  { id: 'areas', title: '場景恐區', description: 'D2R 85 級場景、邪惡威脅區域與恐怖區域資訊。', titleEn: 'Areas & Terror', descriptionEn: 'Level 85 areas, evil threat zones and terror zones in D2R.' },
  { id: 'monsters', title: '怪物圖鑑', description: 'D2R 怪物三種難度的抗性、免疫與出沒場景。', titleEn: 'Monsters', descriptionEn: 'D2R monster resistances, immunities and locations across all three difficulties.' },
  { id: 'shrines', title: '聖壇圖鑑', description: 'D2R 各種聖壇的效果、持續時間與出現等級。', titleEn: 'Shrines', descriptionEn: 'D2R shrine effects, durations and the levels they appear at.' },
  { id: 'uber', title: '紅門六王', description: 'D2R 火炬任務與地獄崔斯特姆（紅門）流程攻略。', titleEn: 'Uber Tristram', descriptionEn: 'Hellfire Torch quest and Uber Tristram (Pandemonium Event) walkthrough.' },
  { id: 'about', title: '資料來源與版權聲明', description: '本站資料與圖片來源、非官方聲明與原創內容說明。', titleEn: 'Sources & Copyright', descriptionEn: 'Data and image sources, unofficial-fan-site notice and original content statement.' },
];

export const KNOWN_TABS: string[] = ROUTES.map((r) => r.id);

/** 有單品網址（/<分頁>/<id>/）的分頁 */
export const ITEM_TABS: string[] = ['runewords', 'items'];

export type Lang = 'zh' | 'en';

/**
 * 把目前網址的路徑拆成網站根目錄、語言、分頁與單品 id。
 * 例：/d2r-codex/en/runewords/enigma/ → 根目錄 /d2r-codex/、語言 en、分頁 runewords、單品 enigma；/runewords/ → 語言 zh。
 * 路徑不是已知分頁時 tab 為 undefined（首頁、或開發模式的 index.html）。
 */
export const parsePath = (pathname: string): { root: string; lang: Lang; tab?: string; item?: string } => {
  const parts = pathname.replace(/index\.html$/, '').split('/');
  parts.pop(); // 結尾的空字串（路徑以斜線結尾）或檔名
  const isTab = (x: string | undefined) => !!x && x !== 'overview' && KNOWN_TABS.includes(x);
  let tab: string | undefined;
  let item: string | undefined;
  const last = parts[parts.length - 1];
  const prev = parts[parts.length - 2];
  if (parts.length > 2 && ITEM_TABS.includes(prev) && isTab(prev)) {
    item = decodeURIComponent(last);
    tab = prev;
    parts.length -= 2;
  } else if (parts.length > 1 && isTab(last)) {
    tab = last;
    parts.pop();
  }
  // 英文版網址在根目錄之下多一層 /en/
  let lang: Lang = 'zh';
  if (parts.length > 1 && parts[parts.length - 1] === 'en') { lang = 'en'; parts.pop(); }
  return { root: parts.join('/') + '/', lang, tab, item };
};

/** 網站根目錄（以斜線開頭結尾）。 */
export const siteRoot = (): string => parsePath(window.location.pathname).root;
/** 目前網址所屬的語言（網址決定語言：/en/… 是英文，其餘是繁體中文）。 */
export const langFromLocation = (): Lang => parsePath(window.location.pathname).lang;

/** 組出分頁（與單品）的路徑。 */
export const pathFor = (root: string, tab: string, item: string | undefined, lang: Lang): string =>
  `${root}${lang === 'en' ? 'en/' : ''}${tab === 'overview' ? '' : `${tab}/${item ? `${encodeURIComponent(item)}/` : ''}`}`;
/** 目前網站根目錄下的分頁路徑；語言預設沿用目前網址的語言。 */
export const pathForTab = (tab: string, item?: string, lang: Lang = langFromLocation()): string => pathFor(siteRoot(), tab, item, lang);

/** 目前網址換成另一種語言的網址（切換語言用）：同一個分頁、同一個單品。 */
export const switchLangPath = (lang: Lang): string => {
  const { root, tab, item } = parsePath(window.location.pathname);
  return pathFor(root, tab ?? 'overview', item, lang);
};
