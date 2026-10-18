import React, { useState, useMemo } from 'react';
import { 
  CatalogItem, 
  EquippedSlots, 
  CharacterAttributes, 
  CalculatedCombatStats 
} from '../../types/simulator';
import { buildCatalogItems } from '../../utils/itemParser';
import { calculateCombatStats } from '../../utils/combatEngine';
import { CHARACTER_CLASSES_DATA } from '../../data/classes';
import { PaperDoll } from './PaperDoll';
import { StatsScreen } from './StatsScreen';
import { LootFilterTree } from './LootFilterTree';
import { SkillTreeSimulator } from './SkillTreeSimulator';
import { 
  Swords, 
  RotateCcw, 
  Layers, 
  Zap, 
  Share2, 
  Activity
} from 'lucide-react';

export interface ArmorySimulatorProps {
  initialClass?: string;
  onNavigateItem?: (targetTab: string, itemId: string, itemTitle?: string) => void;
}

export const ArmorySimulator: React.FC<ArmorySimulatorProps> = ({
  initialClass = "聖騎士",
  onNavigateItem: _onNavigateItem
}) => {
  // 1. 裝備目錄快取
  const allCatalogItems = useMemo(() => buildCatalogItems(), []);

  // 2. 角色基本設定
  const [characterClass, setCharacterClass] = useState<string>(initialClass);
  const [level, setLevel] = useState<number>(90);
  const [activeTab, setActiveTab] = useState<'stats' | 'loot_tree' | 'skills'>('stats');
  const [weaponSwap, setWeaponSwap] = useState<'I' | 'II'>('I');

  // 取得當前職業基礎資訊
  const currentClassData = useMemo(() => {
    return CHARACTER_CLASSES_DATA.find(c => c.name === characterClass) || CHARACTER_CLASSES_DATA[0];
  }, [characterClass]);

  // 3. 角色四維屬性分配狀態
  const [allocatedStats, setAllocatedStats] = useState({
    str: 110,
    dex: 90,
    vit: 250,
    ene: 10
  });

  // 計算未分配屬性點 (等級 90 預設有 89 * 5 + 15 = 460 點)
  const totalAvailablePoints = useMemo(() => {
    return Math.max(0, (level - 1) * 5 + 15);
  }, [level]);

  const allocatedTotal = allocatedStats.str + allocatedStats.dex + allocatedStats.vit + allocatedStats.ene;
  const unallocatedPoints = Math.max(0, totalAvailablePoints - allocatedTotal);

  const attributes: CharacterAttributes = useMemo(() => ({
    baseStr: currentClassData.startingStats.str,
    baseDex: currentClassData.startingStats.dex,
    baseVit: currentClassData.startingStats.vit,
    baseEne: currentClassData.startingStats.ene,
    allocatedStr: allocatedStats.str,
    allocatedDex: allocatedStats.dex,
    allocatedVit: allocatedStats.vit,
    allocatedEne: allocatedStats.ene,
    level
  }), [currentClassData, allocatedStats, level]);

  // 4. 裝備槽位狀態
  const [equipped, setEquipped] = useState<EquippedSlots>(() => {
    // 預設給予聖騎士經典配裝
    const findItem = (idOrName: string) => allCatalogItems.find(i => i.id === idOrName || i.name.includes(idOrName));
    return {
      helm: findItem("rw_flickering_flame") || findItem("unique_harlequin_crest") || allCatalogItems[0],
      amulet: findItem("unique_maras_kaleidoscope"),
      weapon1: findItem("rw_heart_of_the_oak"),
      shield1: findItem("unique_herald_of_zakarum") || findItem("rw_spirit"),
      weapon2: findItem("rw_call_to_arms"),
      shield2: findItem("rw_spirit"),
      armor: findItem("rw_enigma"),
      gloves: findItem("unique_magefist"),
      belt: findItem("unique_arachnid_mesh"),
      ring1: findItem("unique_stone_of_jordan"),
      ring2: findItem("unique_raven_frost") || findItem("unique_bul_kathos_wedding_band"),
      boots: findItem("unique_war_traveler"),
      charms: [
        findItem("charm_anni"),
        findItem("charm_torch_paladin") || findItem("charm_torch_sorc"),
        findItem("charm_skiller_gc_x4")
      ].filter(Boolean) as CatalogItem[]
    };
  });

  // 5. 技能點數狀態
  const [skillPoints, setSkillPoints] = useState<Record<string, number>>(() => ({
    blessed_hammer: 20,
    vigor: 20,
    blessed_aim: 20,
    concentration: 20,
    holy_shield: 10
  }));

  const [activeSkillId, setActiveSkillId] = useState<string>('blessed_hammer');

  // 6. 核心戰鬥運算引擎
  const combatStats: CalculatedCombatStats = useMemo(() => {
    return calculateCombatStats(
      characterClass,
      level,
      attributes,
      equipped,
      skillPoints,
      activeSkillId
    );
  }, [characterClass, level, attributes, equipped, skillPoints, activeSkillId]);

  // 7. 切換職業時的預設配置載入
  const handleSelectClass = (clsName: string) => {
    setCharacterClass(clsName);
    const findItem = (idOrName: string) => allCatalogItems.find(i => i.id === idOrName || i.name.includes(idOrName));

    if (clsName === "魔法使") {
      setSkillPoints({ blizzard: 20, glacial_spike: 20, ice_blast: 20, cold_mastery: 20, teleport: 1, static_field: 1 });
      setActiveSkillId('blizzard');
      setAllocatedStats({ str: 135, dex: 25, vit: 290, ene: 10 });
      setEquipped({
        helm: findItem("unique_harlequin_crest"),
        amulet: findItem("unique_maras_kaleidoscope"),
        weapon1: findItem("rw_heart_of_the_oak") || findItem("rw_spirit"),
        shield1: findItem("rw_spirit"),
        weapon2: findItem("rw_call_to_arms"),
        shield2: findItem("rw_spirit"),
        armor: findItem("rw_chains_of_honor") || findItem("rw_enigma"),
        gloves: findItem("unique_magefist"),
        belt: findItem("unique_arachnid_mesh"),
        ring1: findItem("unique_stone_of_jordan"),
        ring2: findItem("unique_stone_of_jordan"),
        boots: findItem("unique_war_traveler"),
        charms: [
          findItem("charm_anni"),
          findItem("charm_torch_sorc"),
          findItem("charm_sunder_cold"),
          findItem("charm_skiller_gc_x4")
        ].filter(Boolean) as CatalogItem[]
      });
    } else if (clsName === "亞馬遜") {
      setSkillPoints({ lightning_fury: 20, charged_strike: 20, lightning_strike: 20, power_strike: 20, pierce: 5 });
      setActiveSkillId('lightning');
      setAllocatedStats({ str: 135, dex: 150, vit: 175, ene: 0 });
      setEquipped({
        helm: findItem("unique_griffons_eye") || findItem("unique_harlequin_crest"),
        amulet: findItem("unique_maras_kaleidoscope"),
        weapon1: findItem("unique_titans_revenge") || findItem("rw_call_to_arms"),
        shield1: findItem("rw_spirit") || findItem("unique_stormshield"),
        weapon2: findItem("rw_call_to_arms"),
        shield2: findItem("rw_spirit"),
        armor: findItem("rw_enigma"),
        gloves: findItem("unique_magefist"),
        belt: findItem("unique_razortail") || findItem("unique_arachnid_mesh"),
        ring1: findItem("unique_raven_frost"),
        ring2: findItem("unique_stone_of_jordan"),
        boots: findItem("unique_war_traveler"),
        charms: [
          findItem("charm_anni"),
          findItem("charm_torch_paladin"),
          findItem("charm_sunder_light"),
          findItem("charm_skiller_gc_x4")
        ].filter(Boolean) as CatalogItem[]
      });
    } else {
      // 聖騎士
      setSkillPoints({ blessed_hammer: 20, vigor: 20, blessed_aim: 20, concentration: 20, holy_shield: 10 });
      setActiveSkillId('blessed_hammer');
      setAllocatedStats({ str: 110, dex: 90, vit: 250, ene: 10 });
      setEquipped({
        helm: findItem("unique_harlequin_crest"),
        amulet: findItem("unique_maras_kaleidoscope"),
        weapon1: findItem("rw_heart_of_the_oak"),
        shield1: findItem("unique_herald_of_zakarum") || findItem("rw_spirit"),
        weapon2: findItem("rw_call_to_arms"),
        shield2: findItem("rw_spirit"),
        armor: findItem("rw_enigma"),
        gloves: findItem("unique_magefist"),
        belt: findItem("unique_arachnid_mesh"),
        ring1: findItem("unique_stone_of_jordan"),
        ring2: findItem("unique_raven_frost"),
        boots: findItem("unique_war_traveler"),
        charms: [
          findItem("charm_anni"),
          findItem("charm_torch_paladin"),
          findItem("charm_skiller_gc_x4")
        ].filter(Boolean) as CatalogItem[]
      });
    }
  };

  // 8. 穿脫裝備邏輯
  const handleEquipItem = (slotOrItem: keyof EquippedSlots | CatalogItem, directItem?: CatalogItem) => {
    if (typeof slotOrItem === 'string') {
      const slot = slotOrItem as keyof EquippedSlots;
      if (!directItem) return;
      if (slot === 'charms') {
        setEquipped(prev => ({
          ...prev,
          charms: [...prev.charms, directItem]
        }));
      } else {
        setEquipped(prev => ({
          ...prev,
          [slot]: directItem
        }));
      }
    } else {
      // 來自 LootFilterTree 點擊「裝備」
      const item = slotOrItem as CatalogItem;
      const targetSlot = item.slot;
      if (targetSlot === 'helm') setEquipped(p => ({ ...p, helm: item }));
      else if (targetSlot === 'amulet') setEquipped(p => ({ ...p, amulet: item }));
      else if (targetSlot === 'armor') setEquipped(p => ({ ...p, armor: item }));
      else if (targetSlot === 'gloves') setEquipped(p => ({ ...p, gloves: item }));
      else if (targetSlot === 'belt') setEquipped(p => ({ ...p, belt: item }));
      else if (targetSlot === 'boots') setEquipped(p => ({ ...p, boots: item }));
      else if (targetSlot === 'ring') {
        setEquipped(p => !p.ring1 ? ({ ...p, ring1: item }) : ({ ...p, ring2: item }));
      }
      else if (targetSlot === 'weapon') {
        if (weaponSwap === 'I') setEquipped(p => ({ ...p, weapon1: item }));
        else setEquipped(p => ({ ...p, weapon2: item }));
      }
      else if (targetSlot === 'shield') {
        if (weaponSwap === 'I') setEquipped(p => ({ ...p, shield1: item }));
        else setEquipped(p => ({ ...p, shield2: item }));
      }
      else if (targetSlot === 'charm') {
        setEquipped(p => ({ ...p, charms: [...p.charms, item] }));
      }
    }
  };

  const handleUnequipItem = (slot: keyof EquippedSlots, itemIndex?: number) => {
    if (slot === 'charms') {
      if (itemIndex !== undefined) {
        setEquipped(prev => ({
          ...prev,
          charms: prev.charms.filter((_, idx) => idx !== itemIndex)
        }));
      }
    } else {
      setEquipped(prev => ({
        ...prev,
        [slot]: undefined
      }));
    }
  };

  // 9. 屬性點分配調整
  const handleAddStatPoint = (stat: 'str' | 'dex' | 'vit' | 'ene', amount = 1) => {
    const actualAdd = Math.min(amount, unallocatedPoints);
    if (actualAdd <= 0) return;
    setAllocatedStats(prev => ({
      ...prev,
      [stat]: prev[stat] + actualAdd
    }));
  };

  const handleRemoveStatPoint = (stat: 'str' | 'dex' | 'vit' | 'ene', amount = 1) => {
    const actualSub = Math.min(amount, allocatedStats[stat]);
    if (actualSub <= 0) return;
    setAllocatedStats(prev => ({
      ...prev,
      [stat]: prev[stat] - actualSub
    }));
  };

  // 一鍵滿足裝備門檻 (自動加力量與敏捷至最高裝備要求)
  const handleAutoFillReqs = () => {
    const items = [
      equipped.helm, equipped.amulet, equipped.weapon1, equipped.shield1,
      equipped.armor, equipped.gloves, equipped.ring1, equipped.belt,
      equipped.ring2, equipped.boots
    ].filter(Boolean) as CatalogItem[];

    let maxStrReq = 0;
    let maxDexReq = 0;
    items.forEach(i => {
      if (i.requiredStr && i.requiredStr > maxStrReq) maxStrReq = i.requiredStr;
      if (i.requiredDex && i.requiredDex > maxDexReq) maxDexReq = i.requiredDex;
    });

    const currentStr = combatStats.totalStr;
    const currentDex = combatStats.totalDex;
    const strDiff = Math.max(0, maxStrReq - currentStr);
    const dexDiff = Math.max(0, maxDexReq - currentDex);

    const neededTotal = strDiff + dexDiff;
    if (neededTotal > unallocatedPoints) {
      alert(`點數不足以同時滿足需求 (需要力量 +${strDiff}, 敏捷 +${dexDiff})`);
      return;
    }

    setAllocatedStats(prev => ({
      ...prev,
      str: prev.str + strDiff,
      dex: prev.dex + dexDiff
    }));
  };

  // 剩餘全點體力 (All-in Vitality)
  const handleAllInVitality = () => {
    if (unallocatedPoints <= 0) return;
    setAllocatedStats(prev => ({
      ...prev,
      vit: prev.vit + unallocatedPoints
    }));
  };

  // 洗點 (重置點數)
  const handleResetStats = () => {
    setAllocatedStats({ str: 0, dex: 0, vit: 0, ene: 0 });
  };

  // 複製配置代碼分享
  const handleShareBuild = () => {
    const summary = `【D2R 獄火重生 - ${characterClass} Lv.${level} 配點分享】\n` +
      `🔥 總生命值: ${combatStats.totalLife} | 法力值: ${combatStats.totalMana}\n` +
      `🛡️ 總防禦: ${combatStats.totalDefense} | 格擋率: ${combatStats.chanceToBlock}%\n` +
      `⚡ 主力技能: ${combatStats.activeSkillName} 傷害: ${combatStats.activeSkillDamageMin?.toLocaleString()} - ${combatStats.activeSkillDamageMax?.toLocaleString()}\n` +
      `💫 FCR 施法: ${combatStats.fcr}% (${combatStats.fcrFrame} 幀) | FHR 打擊恢復: ${combatStats.fhr}% (${combatStats.fhrFrame} 幀)\n` +
      `🔗 體驗同款 1:1 配裝模擬器: https://samhuang68.github.io/d2r-codex/`;
    navigator.clipboard.writeText(summary);
    alert("已複製配裝總結至剪貼簿！可直接貼給戰友分享。");
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 頂部全景控制列：職業切換、等級調整、流派預設 */}
      <div className="bg-sanctuary-950/90 backdrop-blur-md rounded-3xl border border-sanctuary-800 p-4 sm:p-5 shadow-2xl flex flex-col xl:flex-row items-center justify-between gap-4">
        {/* 左側：職業選單與等級調整 */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-d2-fire to-sanctuary-900 flex items-center justify-center p-0.5 shadow-glow-gold">
              <Swords className="w-4 h-4 text-sanctuary-100" />
            </div>
            <span className="font-diablo text-lg font-bold text-sanctuary-100 tracking-wide">
              全息模擬器
            </span>
          </div>

          {/* 職業快速膠囊選擇 */}
          <div className="flex flex-wrap items-center gap-1.5 bg-sanctuary-900/90 p-1.5 rounded-2xl border border-sanctuary-800/80">
            {["聖騎士", "魔法使", "亞馬遜", "死靈法師", "刺客", "野蠻人", "德魯伊"].map((cls) => (
              <button
                key={cls}
                onClick={() => handleSelectClass(cls)}
                className={`px-3 py-1 rounded-xl text-xs font-diablo transition-all ${
                  characterClass === cls
                    ? 'bg-gradient-to-r from-d2-unique to-amber-600 text-sanctuary-950 font-bold shadow-md'
                    : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-800'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* 等級輸入 */}
          <div className="flex items-center gap-2 bg-sanctuary-900/80 px-3 py-1.5 rounded-xl border border-sanctuary-800 text-xs">
            <span className="text-sanctuary-400 font-mono">等級 Lv:</span>
            <input
              type="number"
              min={1}
              max={99}
              value={level}
              onChange={(e) => setLevel(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
              className="w-12 bg-sanctuary-950 border border-sanctuary-700 rounded text-center text-d2-gold font-bold font-mono focus:outline-none focus:border-d2-unique"
            />
          </div>
        </div>

        {/* 右側：快速分享與一鍵全空 */}
        <div className="flex items-center gap-2.5 w-full xl:w-auto justify-end">
          <button
            onClick={handleShareBuild}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sanctuary-900 hover:bg-sanctuary-800 text-d2-gold border border-d2-gold/30 hover:border-d2-gold rounded-xl text-xs font-diablo transition-all shadow-md active:scale-95"
            title="複製此套裝備與屬性數值摘要"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>分享配裝</span>
          </button>
          <button
            onClick={() => setEquipped({ charms: [] })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sanctuary-900 hover:bg-red-950/60 text-sanctuary-400 hover:text-red-400 border border-sanctuary-800 hover:border-red-800 rounded-xl text-xs font-mono transition-all"
            title="清空身上全部裝備"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>卸除全部</span>
          </button>
        </div>
      </div>

      {/* 核心雙欄佈局：左 50% 1:1 紙娃娃 | 右 50% 三分頁標籤 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左半邊 50% (lg:col-span-6): 1:1 遊戲裝備頁畫面 */}
        <div className="lg:col-span-6 space-y-4">
          {/* 紙娃娃主畫面 */}
          <PaperDoll
            equipped={equipped}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            weaponSwap={weaponSwap}
            onToggleWeaponSwap={() => setWeaponSwap(prev => prev === 'I' ? 'II' : 'I')}
          />
        </div>

        {/* 右半邊 50% (lg:col-span-6): 3 個 Tab 標籤切換 */}
        <div className="lg:col-span-6 space-y-4">
          {/* 3 大分頁切換列 */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-sanctuary-950/90 rounded-2xl border border-sanctuary-800 shadow-xl">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-diablo text-sm transition-all duration-200 ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-d2-unique to-amber-600 text-sanctuary-950 font-bold shadow-lg shadow-amber-900/30 ring-1 ring-amber-300/40'
                  : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-900/60'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Tab 1 屬性配點頁</span>
            </button>

            <button
              onClick={() => setActiveTab('loot_tree')}
              className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-diablo text-sm transition-all duration-200 ${
                activeTab === 'loot_tree'
                  ? 'bg-gradient-to-r from-d2-unique to-amber-600 text-sanctuary-950 font-bold shadow-lg shadow-amber-900/30 ring-1 ring-amber-300/40'
                  : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-900/60'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Tab 2 拾取樹狀選擇</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-diablo text-sm transition-all duration-200 ${
                activeTab === 'skills'
                  ? 'bg-gradient-to-r from-d2-unique to-amber-600 text-sanctuary-950 font-bold shadow-lg shadow-amber-900/30 ring-1 ring-amber-300/40'
                  : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-900/60'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>Tab 3 技能樹協同頁</span>
            </button>
          </div>

          {/* 分頁內容展示 */}
          <div className="transition-all duration-300">
            {activeTab === 'stats' && (
              <StatsScreen
                className={characterClass}
                level={level}
                setLevel={setLevel}
                attributes={attributes}
                combatStats={combatStats}
                onAddStatPoint={handleAddStatPoint}
                onRemoveStatPoint={handleRemoveStatPoint}
                onAutoFillReqs={handleAutoFillReqs}
                onAllInVitality={handleAllInVitality}
                onResetStats={handleResetStats}
                unallocatedPoints={unallocatedPoints}
              />
            )}

            {activeTab === 'loot_tree' && (
              <LootFilterTree
                items={allCatalogItems}
                onEquipItem={handleEquipItem}
              />
            )}

            {activeTab === 'skills' && (
              <SkillTreeSimulator
                className={characterClass}
                skillPoints={skillPoints}
                onUpdateSkillPoints={setSkillPoints}
                activeSkillId={activeSkillId}
                onSetActiveSkillId={setActiveSkillId}
                allSkillsBonus={combatStats.allSkillsBonus + combatStats.classSkillsBonus}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
