import meta from './game/meta.json';
import type { Lang } from '../utils/routes';

export interface AboutSectionData {
  id: 'unofficial' | 'data' | 'images' | 'original';
  title: string;
  paragraphs: string[];
}

/**
 * 資料來源與版權聲明頁（SourcesPage）及建置時 <noscript> 摘要（staticSummaries）共用的單一文字來源。
 * 修改此處會同時更新互動頁面與靜態 HTML，避免兩邊內容不一致。
 */
export const getAboutSections = (lang: Lang): AboutSectionData[] => {
  const isEn = lang === 'en';
  return [
    {
      id: 'unofficial',
      title: isEn ? 'Unofficial fan site' : '非官方聲明',
      paragraphs: isEn
        ? [
            'Diablo, Diablo II: Resurrected and their characters, items, names, artwork and music are trademarks and copyrights of Blizzard Entertainment, Inc. This site is not affiliated with, authorized by or endorsed by Blizzard Entertainment.',
            'This is a non-commercial fan project: no sales and no ads. Your progress and settings stay in your own browser; the site only uses Cloudflare\'s anonymous traffic analytics, and fonts are served by Google Fonts.',
          ]
        : [
            '暗黑破壞神（Diablo）、暗黑破壞神 II：獄火重生（Diablo II: Resurrected）及其角色、物品、名稱、圖像與音樂，其商標與著作權屬於暴雪娛樂（Blizzard Entertainment, Inc.）。本站與暴雪娛樂沒有任何隸屬、授權或背書關係，不是官方網站。',
            '本站為非營利的玩家整理，不販售任何商品、不放廣告。你的進度與設定只存在自己的瀏覽器；網站只使用 Cloudflare 的匿名流量統計，字型來自 Google Fonts。',
          ],
    },
    {
      id: 'data',
      title: isEn ? 'Data sources' : '資料來源',
      paragraphs: isEn
        ? [
            `Stats, names and recipes are mainly generated from the game's data tables (game data version ${meta.gameVersion}, built ${meta.generatedAt}); Chinese wording follows the in-game Traditional Chinese strings.`,
            'The item changes on the Patch Changes page (patches 3.3 and 3.4) are compiled from the d2db.net article "Ladder Season 15 & 16 Item Changes"; values follow the original article and are not yet applied to the item pages\' base data (this site\'s data is extracted from the game files).',
            'Farming tips, builds and tactics summarize common community practice and are for reference only; the game itself is authoritative.',
          ]
        : [
            `數值、名稱與配方主要由遊戲的資料表產生（遊戲資料版本 ${meta.gameVersion}，${meta.generatedAt} 產生），中文用字對照遊戲內的繁體中文字串。`,
            '「版本改動」頁的物品改動（3.3、3.4 版）整理自 d2db.net 的文章〈Ladder Season 15 & 16 Item Changes〉，數值以原文為準；尚未套用到單品頁的基本資料（本站資料為遊戲檔案萃取）。',
            '打寶建議、流派與戰術說明是玩家社群的常見做法整理，只供參考；與遊戲實際行為不同時，以遊戲為準。',
          ],
    },
    {
      id: 'images',
      title: isEn ? 'Image sources' : '圖片來源',
      paragraphs: isEn
        ? [
            'Item images for uniques, sets and bases come from the community database d2r.world and are mirrored on this site so they still show if the original is unreachable. Copyright in these images belongs to Blizzard Entertainment and the original site; this site claims no rights to them. Some unique and set images carry the original site\'s watermark, which is cropped out of view rather than removed.',
            'This is a fan page. All rights belong to Blizzard Entertainment.',
          ]
        : [
            '暗金、套裝與底材的物品圖片取自社群資料站 d2r.world，並備份在本站，原站無法連線時仍可顯示。這些圖片的著作權屬於暴雪娛樂與原站，本站不主張任何權利。部分暗金與套裝圖片下方帶有原站的浮水印，本站以裁切方式避開，不是移除標示。',
            '本站為粉絲網站（fan page），一切權利歸暴雪娛樂所有。',
          ],
    },
    {
      id: 'original',
      title: isEn ? 'Original content' : '原創內容',
      paragraphs: isEn
        ? [
            'The site icon and ambient music are original to this site: the site icon is a hand-drawn vector and the music is synthesized in real time, not the game soundtrack. Topic icons in the navigation and page titles use in-game item, shrine and character artwork, which remains the property of its rights holder.',
          ]
        : [
            '網站圖示與背景氛圍音樂為本站原創：網站圖示是自行繪製的向量圖，音樂由程式即時合成，不是遊戲原聲帶。導覽列與各頁標題的主題圖示使用遊戲內的物品、聖壇與角色圖樣，版權屬於原權利人。',
          ],
    },
  ];
};

export const getAboutHeader = (lang: Lang) => ({
  title: lang === 'en' ? 'Sources & Copyright Notice' : '資料來源與版權聲明',
  desc: lang === 'en'
    ? 'This is an unofficial, fan-made reference. The notes below explain where content and images come from and who owns them.'
    : '本站是玩家自製的非官方速查手冊。以下說明內容與圖片的來源與權利歸屬。',
  footerNote: lang === 'en'
    ? 'Last updated with the game data version shown above.'
    : '內容隨上方的遊戲資料版本更新。',
});
