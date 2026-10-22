/** 章節名：遊戲字串是「第一章」至「第五章」（levels.json act1～act5），不用阿拉伯數字加「幕」 */
export const actZh = (act: number): string => `第${'一二三四五'[act - 1] ?? act}章`;
