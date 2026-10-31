import React from 'react';
import { GameIcon } from '../common/GameIcons';
import { pathForTab } from '../../utils/routes';

export interface NavModule {
  id: string;
  label: string;
  labelEn: string;
  desc: string;
  descEn: string;
  icon: React.ReactNode;
}

export interface NavGroup {
  category: string;
  categoryEn: string;
  items: NavModule[];
}

const ic = 'w-4 h-4';

/** 全站 21 個分頁的單一來源（桌面側邊欄、手機抽屜共用，分頁 id 與 App.tsx 一致） */
export const NAV_GROUPS: NavGroup[] = [
  {
    category: '總覽',
    categoryEn: 'Overview',
    items: [
      {
        id: 'overview',
        label: '主頁展演',
        labelEn: 'Home Portal',
        desc: '大圖分類入口與職業展示',
        descEn: 'Portal categories & class showcases',
        icon: <GameIcon name="gate" className={`${ic} text-d2-fire`} />,
      },
      {
        id: 'patches',
        label: '版本改動',
        labelEn: 'Patch Changes',
        desc: '3.3／3.4 版物品改動對照',
        descEn: 'Patches 3.3 & 3.4 item changes',
        icon: <GameIcon name="scroll" className={`${ic} text-d2-unique`} />,
      },
    ],
  },
  {
    category: '英雄與加點',
    categoryEn: 'Heroes & Builds',
    items: [
      {
        id: 'characters',
        label: '角色寶典',
        labelEn: 'Classes',
        desc: '8 大職業屬性與 Meta 流派',
        descEn: '8 classes attributes & meta builds',
        icon: <GameIcon name="helm" className={`${ic} text-d2-fire`} />,
      },
      {
        id: 'skills',
        label: '技能寶典',
        labelEn: 'Skill Trees',
        desc: '全技能樹畫布與協同矩陣',
        descEn: 'Interactive skill trees & synergies',
        icon: <GameIcon name="tree" className={`${ic} text-d2-gold`} />,
      },
      {
        id: 'planner',
        label: '配裝模擬',
        labelEn: 'Armory Planner',
        desc: '1:1 配裝模擬器與流派筆記',
        descEn: '1:1 gear simulator & build notes',
        icon: <GameIcon name="anvil" className={`${ic} text-d2-unique`} />,
      },
      {
        id: 'breakpoints',
        label: '機制斷點',
        labelEn: 'Breakpoints',
        desc: 'FCR / FHR / FBR / IAS 斷點',
        descEn: 'FCR / FHR / FBR / IAS breakpoint tables',
        icon: <GameIcon name="steps" className={`${ic} text-d2-fire`} />,
      },
      {
        id: 'experience',
        label: '經驗值表',
        labelEn: 'Experience',
        desc: '1~99 級經驗與升級計算',
        descEn: 'Level 1-99 XP progression & calculator',
        icon: <GameIcon name="levelup" className={`${ic} text-d2-gold`} />,
      },
      {
        id: 'mercenaries',
        label: '傭兵寶典',
        labelEn: 'Mercenaries',
        desc: '四大傭兵光環與終極神裝',
        descEn: 'Hireling auras & endgame gear matrix',
        icon: <GameIcon name="swords" className={`${ic} text-d2-gold`} />,
      },
    ],
  },
  {
    category: '裝備圖鑑',
    categoryEn: 'Equipment',
    items: [
      {
        id: 'items',
        label: '裝備寶典',
        labelEn: 'Uniques & Sets',
        desc: '暗金與套裝全覽',
        descEn: 'Complete unique & set items compendium',
        icon: <GameIcon name="sword" className={`${ic} text-d2-unique`} />,
      },
      {
        id: 'runewords',
        label: '符文之語',
        labelEn: 'Runewords',
        desc: '全天梯符文之語速查',
        descEn: 'Ladder & non-ladder runewords database',
        icon: <GameIcon name="rune" className={`${ic} text-d2-rune`} />,
      },
      {
        id: 'bases',
        label: '底材寶典',
        labelEn: 'Base Items',
        desc: '打孔、特等的底材與屬性需求',
        descEn: 'Socketing, superior bases & requirements',
        icon: <GameIcon name="shield" className={`${ic} text-d2-socket`} />,
      },
      {
        id: 'runes',
        label: '符文寶庫',
        labelEn: 'Runes',
        desc: '1~33 號符文屬性與合成',
        descEn: 'Runes #1-#33 attributes & recipes',
        icon: <GameIcon name="stone" className={`${ic} text-d2-rune`} />,
      },
      {
        id: 'props',
        label: '道具聖物',
        labelEn: 'Props & Relics',
        desc: '寶石、鑰匙、精華與藥劑',
        descEn: 'Gems, Uber keys, essences & charms',
        icon: <GameIcon name="flask" className={`${ic} text-d2-magic`} />,
      },
    ],
  },
  {
    category: '合成與估價',
    categoryEn: 'Crafting & Appraisal',
    items: [
      {
        id: 'cube',
        label: '方塊工坊',
        labelEn: 'Horadric Cube',
        desc: '打孔、升級、手工裝配方',
        descEn: 'Cube recipes, upgrades & craft gear',
        icon: <GameIcon name="cube" className={`${ic} text-d2-magic`} />,
      },
      {
        id: 'affixes',
        label: '詞綴寶典',
        labelEn: 'Magic Affixes',
        desc: '魔法與稀有詞綴全表',
        descEn: 'Magic & rare prefix & suffix database',
        icon: <GameIcon name="tag" className={`${ic} text-d2-magic`} />,
      },
      {
        id: 'valuation',
        label: '鑑寶估價',
        labelEn: 'Price Check',
        desc: '極品詞綴與估價器',
        descEn: 'Valuation & price appraisal tool',
        icon: <GameIcon name="gem" className={`${ic} text-d2-magic`} />,
      },
      {
        id: 'grail',
        label: '聖杯打寶',
        labelEn: 'Holy Grail',
        desc: '全裝備收集打勾追蹤',
        descEn: 'Holy grail checklist & drop tracker',
        icon: <GameIcon name="grail" className={`${ic} text-d2-gold`} />,
      },
    ],
  },
  {
    category: '戰役與終局',
    categoryEn: 'Campaign & Endgame',
    items: [
      {
        id: 'quests',
        label: '任務事件',
        labelEn: 'Quests & Events',
        desc: '永久獎勵任務與世界事件',
        descEn: 'Permanent reward quests & D-Clone',
        icon: <GameIcon name="scroll" className={`${ic} text-d2-gold`} />,
      },
      {
        id: 'areas',
        label: '場景恐區',
        labelEn: 'Areas & Terror',
        desc: '85 級場景與邪惡威脅區域',
        descEn: 'Level 85 areas & Terror Zones',
        icon: <GameIcon name="map" className={`${ic} text-d2-fire`} />,
      },
      {
        id: 'monsters',
        label: '怪物圖鑑',
        labelEn: 'Monsters',
        desc: '三難度抗性、免疫與場景',
        descEn: 'Resistances, immunities & zones',
        icon: <GameIcon name="demon" className={`${ic} text-d2-fire`} />,
      },
      {
        id: 'shrines',
        label: '聖壇圖鑑',
        labelEn: 'Shrines',
        desc: '聖壇效果、持續時間與等級',
        descEn: 'Shrine buffs, durations & effects',
        icon: <GameIcon name="altar" className={`${ic} text-d2-gold`} />,
      },
      {
        id: 'uber',
        label: '紅門六王',
        labelEn: 'Uber Tristram',
        desc: '火炬、地獄崔斯特姆流程',
        descEn: 'Hellfire Torch & Pandemonium Event',
        icon: <GameIcon name="skull" className={`${ic} text-d2-fire`} />,
      },
    ],
  },
];

export const ALL_NAV_MODULES: NavModule[] = NAV_GROUPS.flatMap((g) => g.items);

/**
 * 導覽項目是真正的連結（href="/分頁/"）：一般左鍵點擊由程式在站內換頁（並新增一筆瀏覽器歷史紀錄）；
 * Ctrl／⌘／Shift／中鍵點擊交給瀏覽器，會在新分頁或新視窗開啟對應的分頁網址。
 */
export const isPlainLeftClick = (e: React.MouseEvent): boolean => !(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
export const tabHref = (id: string): string => pathForTab(id);
