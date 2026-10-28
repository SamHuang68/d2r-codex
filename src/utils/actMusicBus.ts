/** 使用者在場景／任務頁選了某一章時，用這個事件告訴音樂面板（面板開了「依章節自動切換」才會理會）。 */
export const ACT_EVENT = 'd2r:act';
export const announceAct = (act: number): void => {
  try { window.dispatchEvent(new CustomEvent<number>(ACT_EVENT, { detail: act })); } catch { /* 沒有 window（測試）時略過 */ }
};
