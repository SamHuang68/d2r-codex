/**
 * 與遊戲資料表不一致、依 Sam 指示改採參考網站（d2r.world）數值的項目。每一項都要寫明差異與依據，不得悄悄擴增。
 *
 * 暗金的底材防禦（min, max）：key＝uniques.json 的 id。
 *  - herald_of_zakarum_285（撒卡蘭姆使者）：armor.txt 的金紋盾底材防禦是 144–168（算出 360–504），
 *    參考網站顯示防禦 422–507，也就是底材固定 169（169×2.5＝422、169×3＝507）。Sam 指示沿用網站數值（2026-10-21，尚未取得該盾牌，無法遊戲內核對）。
 *    只影響這一件暗金；白色金紋盾與其他暗金仍用遊戲資料表。
 */
export const UNIQUE_BASE_AC: Record<string, [number, number]> = {
  herald_of_zakarum_285: [169, 169],
};

export const uniqueBaseAc = (uniqueId: string): [number, number] | undefined => UNIQUE_BASE_AC[uniqueId];
