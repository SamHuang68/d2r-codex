import React from 'react';
import {
  Flame, Sparkles, BookOpen, Layers, Compass, Trophy, Sword, MapPin, Users,
  Gem, Skull, ShieldAlert, FlaskConical, Wrench, Activity, Crown, Ghost,
} from 'lucide-react';

export interface NavModule {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

export interface NavGroup {
  category: string;
  items: NavModule[];
}

const ic = 'w-4 h-4';

/** 全站 18 個分頁的單一來源（桌面側邊欄、手機抽屜共用，分頁 id 與 App.tsx 一致） */
export const NAV_GROUPS: NavGroup[] = [
  {
    category: '總覽',
    items: [
      { id: 'overview', label: '主頁展演', desc: '大圖分類入口與職業展示', icon: <Flame className={`${ic} text-d2-fire`} /> },
    ],
  },
  {
    category: '英雄與加點',
    items: [
      { id: 'characters', label: '角色寶典', desc: '8 大職業屬性與 Meta 流派', icon: <Users className={`${ic} text-d2-fire`} /> },
      { id: 'skills', label: '技能寶典', desc: '全技能樹畫布與協同矩陣', icon: <Sparkles className={`${ic} text-d2-gold`} /> },
      { id: 'planner', label: '配裝模擬', desc: '1:1 配裝模擬器與流派筆記', icon: <Wrench className={`${ic} text-d2-unique`} /> },
      { id: 'breakpoints', label: '機制斷點', desc: 'FCR / FHR / FBR / IAS 斷點', icon: <Activity className={`${ic} text-d2-fire`} /> },
      { id: 'mercenaries', label: '傭兵寶典', desc: '四大傭兵光環與終極神裝', icon: <Crown className={`${ic} text-d2-gold`} /> },
    ],
  },
  {
    category: '裝備圖鑑',
    items: [
      { id: 'items', label: '裝備寶典', desc: '暗金與套裝全覽', icon: <Sword className={`${ic} text-d2-unique`} /> },
      { id: 'runewords', label: '符文之語', desc: '全天梯符文之語速查', icon: <Sparkles className={`${ic} text-d2-rune`} /> },
      { id: 'bases', label: '底材寶典', desc: '打孔、超強與屬性需求', icon: <ShieldAlert className={`${ic} text-d2-socket`} /> },
      { id: 'runes', label: '符文寶庫', desc: '1~33 號符文屬性與合成', icon: <Layers className={`${ic} text-d2-rune`} /> },
      { id: 'props', label: '道具聖物', desc: '寶石、鑰匙、精華與藥劑', icon: <FlaskConical className={`${ic} text-d2-magic`} /> },
    ],
  },
  {
    category: '合成與估價',
    items: [
      { id: 'cube', label: '方塊工坊', desc: '打孔、升級、手工裝配方', icon: <BookOpen className={`${ic} text-d2-magic`} /> },
      { id: 'valuation', label: '鑑寶估價', desc: '極品詞綴與估價器', icon: <Gem className={`${ic} text-d2-magic`} /> },
      { id: 'grail', label: '聖杯打寶', desc: '全裝備收集打勾追蹤', icon: <Trophy className={`${ic} text-d2-gold`} /> },
    ],
  },
  {
    category: '戰役與終局',
    items: [
      { id: 'quests', label: '任務事件', desc: '永久獎勵任務與世界事件', icon: <Compass className={`${ic} text-d2-gold`} /> },
      { id: 'areas', label: '場景恐區', desc: '85 級場景與恐怖領域', icon: <MapPin className={`${ic} text-d2-fire`} /> },
      { id: 'monsters', label: '怪物圖鑑', desc: '三難度抗性、免疫與場景', icon: <Ghost className={`${ic} text-d2-fire`} /> },
      { id: 'uber', label: '紅門六王', desc: '火炬、地獄崔斯特姆流程', icon: <Skull className={`${ic} text-d2-fire`} /> },
    ],
  },
];

export const ALL_NAV_MODULES: NavModule[] = NAV_GROUPS.flatMap((g) => g.items);

/**
 * 導覽項目是真正的連結（href="#分頁"）：一般左鍵點擊由程式在站內換頁（並新增一筆瀏覽器歷史紀錄）；
 * Ctrl／⌘／Shift／中鍵點擊交給瀏覽器，會在新分頁或新視窗開啟對應的分頁網址。
 */
export const isPlainLeftClick = (e: React.MouseEvent): boolean => !(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
export const tabHref = (id: string): string => `#${id}`;
