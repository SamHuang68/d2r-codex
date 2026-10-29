import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AREA_LEVELS_DATA, TERROR_ZONE_GUIDE } from '../../data/areaLevels';
import { 
  MapPin, 
  Flame, 
  Zap, 
  Award, 
  Search, 
  Sparkles,
  Compass,
  Crown,
  ChevronRight,
  Swords
} from 'lucide-react';

/**
 * 五大章節原版地理環境設定
 */
interface ActGeographyHub {
  act: number;
  titleZh: string;
  titleEn: string;
  hubNameZh: string;
  hubNameEn: string;
  environmentZh: string;
  environmentEn: string;
  taglineZh: string;
  taglineEn: string;
  themeColor: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  alvl85Count: number;
}

const translateImmunity = (im: string): string => {
  if (im === '各類混合免疫') return 'Mixed Immunities';
  if (im.includes('各波次不同')) return 'Varies by Wave (5 Minion Waves)';
  if (im.includes('無原生免疫')) return 'No Native Immunities (Non-Elites)';
  if (im.includes('艾德瑞奇')) return 'Cold Immune (Eldritch)';
  if (im.includes('山克')) return 'Various Immunities (Shenk)';
  if (im.includes('冰寒') || im.includes('寒冷')) return 'Cold';
  if (im.includes('火焰')) return 'Fire';
  if (im.includes('閃電') || im.includes('電擊')) return 'Lightning';
  if (im.includes('毒素')) return 'Poison';
  if (im.includes('物理')) return 'Physical';
  if (im.includes('魔法')) return 'Magic';
  return im;
};

const ACT_GEOGRAPHY_HUBS: ActGeographyHub[] = [
  {
    act: 1,
    titleZh: '第 1 章',
    titleEn: 'Act I',
    hubNameZh: '俠盜營地',
    hubNameEn: 'Rogue Encampment',
    environmentZh: '盲目之眼姐妹會修道院 · 潮濕荒野與幽暗密林',
    environmentEn: 'Sisterhood of the Sightless Eye Monastery · Moor & Deep Forest',
    taglineZh: '聖休亞瑞的起點，苔蘚石牆與修道院深處埋藏著無盡秘密。',
    taglineEn: 'The starting ground of Sanctuary, ancient stone walls sheltering dark secrets.',
    themeColor: 'from-emerald-950/60 via-sanctuary-900/60 to-sanctuary-950/80',
    badgeBg: 'bg-emerald-950/50',
    badgeBorder: 'border-emerald-700/50',
    textColor: 'text-emerald-400',
    alvl85Count: 3,
  },
  {
    act: 2,
    titleZh: '第 2 章',
    titleEn: 'Act II',
    hubNameZh: '魯高因',
    hubNameEn: 'Lut Gholein',
    environmentZh: '沙漠明珠 · 燥熱黃沙、赫拉迪姆古墓與秘法聖殿',
    environmentEn: 'Jewel of the Desert · Arid Dunes, Ancient Tombs & Arcane Sanctuary',
    taglineZh: '烈日炙烤下的金黃王都，地下長眠著赫拉迪姆先賢與虛空星系。',
    taglineEn: 'A golden desert port under scorching sun, hiding ancient Horadric tombs.',
    themeColor: 'from-amber-950/60 via-sanctuary-900/60 to-sanctuary-950/80',
    badgeBg: 'bg-amber-950/50',
    badgeBorder: 'border-amber-700/50',
    textColor: 'text-amber-400',
    alvl85Count: 2,
  },
  {
    act: 3,
    titleZh: '第 3 章',
    titleEn: 'Act III',
    hubNameZh: '庫拉斯特港口',
    hubNameEn: 'Kurast Docks',
    environmentZh: '雨林古都 · 泥濘沼澤、薩卡蘭姆神廟與憎恨囚牢',
    environmentEn: 'Jungle Port of Kurast · Swamps, Zakarum Temples & Durance of Hate',
    taglineZh: '墨菲斯托腐化力量吞噬的古老雨林，崔凡克長老固守著古都祭壇。',
    taglineEn: 'Prime Evil corruption creeping through rain-soaked jungles and ancient temples.',
    themeColor: 'from-teal-950/60 via-sanctuary-900/60 to-sanctuary-950/80',
    badgeBg: 'bg-teal-950/50',
    badgeBorder: 'border-teal-700/50',
    textColor: 'text-teal-400',
    alvl85Count: 4,
  },
  {
    act: 4,
    titleZh: '第 4 章',
    titleEn: 'Act IV',
    hubNameZh: '混沌界要塞',
    hubNameEn: 'The Pandemonium Fortress',
    environmentZh: '天堂前哨 · 絕望平原、地獄熔岩血河與混沌魔殿',
    environmentEn: 'Heavenly Outpost · Plains of Despair, River of Flame & Chaos Sanctuary',
    taglineZh: '高階天堂駐守地獄咽喉的最後要塞，盡頭即是恐懼之王迪亞布羅的神殿。',
    taglineEn: 'The last divine bastion at the gates of the Burning Hells, leading to Diablo.',
    themeColor: 'from-rose-950/60 via-sanctuary-900/60 to-sanctuary-950/80',
    badgeBg: 'bg-rose-950/50',
    badgeBorder: 'border-rose-700/50',
    textColor: 'text-rose-400',
    alvl85Count: 2,
  },
  {
    act: 5,
    titleZh: '第 5 章',
    titleEn: 'Act V',
    hubNameZh: '哈洛加斯',
    hubNameEn: 'Harrogath',
    environmentZh: '聖山要塞 · 亞瑞特雪峰、遠古人祭壇與世界之石要塞',
    environmentEn: 'Mount Arreat Bastion · Snowy Ridges, Arreat Summit (Ancients) & Worldstone Keep',
    taglineZh: '野蠻人家園的最後陣地，冰雪山巔直通聖休亞瑞的核心——世界之石。',
    taglineEn: 'The barbarian homeland standing against Baal, guarding the Worldstone Chamber.',
    themeColor: 'from-sky-950/60 via-sanctuary-900/60 to-sanctuary-950/80',
    badgeBg: 'bg-sky-950/50',
    badgeBorder: 'border-sky-700/50',
    textColor: 'text-sky-400',
    alvl85Count: 4,
  },
];

/**
 * TC87 五大頂級聖地資訊定義
 */
interface SuperFarmingArea {
  id: string;
  act: number;
  nameZh: string;
  nameEn: string;
  locationZh: string;
  locationEn: string;
  alvl: number;
  difficulty: number; // 1 to 5
  immunitiesZh: string[];
  immunitiesEn: string[];
  recommendedBuildsZh: { name: string; tag: string; icon: string }[];
  recommendedBuildsEn: { name: string; tag: string; icon: string }[];
  keyDropsZh: string;
  keyDropsEn: string;
  tacticalTipZh: string;
  tacticalTipEn: string;
}

const SUPER_FARMING_AREAS: SuperFarmingArea[] = [
  {
    id: 'the_pit',
    act: 1,
    nameZh: '地穴',
    nameEn: 'The Pit',
    locationZh: '第 1 章 · 泰摩高地',
    locationEn: 'Act I · Tamoe Highland',
    alvl: 85,
    difficulty: 2,
    immunitiesZh: ['火焰免疫', '冰寒免疫', '閃電免疫 (偶爾)'],
    immunitiesEn: ['Fire Immune', 'Cold Immune', 'Light Immune (rare)'],
    recommendedBuildsZh: [
      { name: '閃電標馬', tag: 'Javazon', icon: '⚡' },
      { name: '物理弓馬', tag: 'Bowazon', icon: '🏹' },
      { name: '劇毒死靈', tag: 'Poison Necro', icon: '💀' },
      { name: '雙熱聖騎', tag: 'Zealot', icon: '🗡️' },
    ],
    recommendedBuildsEn: [
      { name: 'Lightning Javazon', tag: 'Javazon', icon: '⚡' },
      { name: 'Physical Bowazon', tag: 'Bowazon', icon: '🏹' },
      { name: 'Poison Necromancer', tag: 'Poison Necro', icon: '💀' },
      { name: 'Zealot Paladin', tag: 'Zealot', icon: '🗡️' },
    ],
    keyDropsZh: 'TC87 頂級神裝（風之力、獅鷲之眼）、高階符文組頂級白裝/無形底材',
    keyDropsEn: 'TC87 Uniques (Windforce, Griffon), High Runes, Elite Eth Runeword Bases',
    tacticalTipZh: '全暗黑怪密最高、怪物血量偏低之打寶聖殿！物理與投擲極速清場，第 2 層必設輝煌金色寶箱。',
    tacticalTipEn: 'Dense, fragile monster packs perfect for fast clears. Guaranteed glittering chest on Level 2.',
  },
  {
    id: 'ancient_tunnels',
    act: 2,
    nameZh: '古代通道',
    nameEn: 'Ancient Tunnels',
    locationZh: '第 2 章 · 失落古城',
    locationEn: 'Act II · Lost City',
    alvl: 85,
    difficulty: 2,
    immunitiesZh: ['閃電免疫', '火焰免疫', '毒素免疫 (★ 0 原生冰免)'],
    immunitiesEn: ['Light Immune', 'Fire Immune', 'Poison Immune (★ 0 Cold Immune)'],
    recommendedBuildsZh: [
      { name: '純冰暴風雪法師', tag: 'Blizzard Sorc', icon: '❄️' },
      { name: '冰封球法師', tag: 'Orb Sorc', icon: '🧊' },
      { name: '純骨死靈', tag: 'Bone Necro', icon: '☠️' },
      { name: '祝福之鎚聖騎', tag: 'Hammerdin', icon: '🔨' },
    ],
    recommendedBuildsEn: [
      { name: 'Blizzard Sorceress', tag: 'Blizzard Sorc', icon: '❄️' },
      { name: 'Frozen Orb Sorceress', tag: 'Orb Sorc', icon: '🧊' },
      { name: 'Bone Necromancer', tag: 'Bone Necro', icon: '☠️' },
      { name: 'Hammerdin', tag: 'Hammerdin', icon: '🔨' },
    ],
    keyDropsZh: '泰瑞爾之力、死亡之網、次元碎片、年歲之冠等 TC87 終極暗金',
    keyDropsEn: "Tyrael's Might, Death's Web, Death's Fathom, Crown of Ages",
    tacticalTipZh: '85 級地城中少數完全沒有原生冰冷免疫怪物的區域！純冰暴風雪法師拓荒的第一朝聖首選。',
    tacticalTipEn: 'One of the few Level 85 areas with zero native Cold Immunes. Blizzard Sorceress holy grail haven.',
  },
  {
    id: 'travincal',
    act: 3,
    nameZh: '崔凡克',
    nameEn: 'Travincal',
    locationZh: '第 3 章 · 評議會神廟',
    locationEn: 'Act III · Zakarum Temple',
    alvl: 82,
    difficulty: 3,
    immunitiesZh: ['火焰免疫', '閃電免疫 (多隨機雙抗)'],
    immunitiesEn: ['Fire Immune', 'Light Immune (Random Affixes)'],
    recommendedBuildsZh: [
      { name: '打錢翻屍野蠻人', tag: 'Horker Barb', icon: '💰' },
      { name: '盾擊/雙熱聖騎', tag: 'Smiter / Zeal', icon: '🛡️' },
      { name: '祝福之鎚聖騎', tag: 'Hammerdin', icon: '🔨' },
    ],
    recommendedBuildsEn: [
      { name: 'Find Item Horker Barb', tag: 'Horker Barb', icon: '💰' },
      { name: 'Smiter / Zealot', tag: 'Smiter / Zeal', icon: '🛡️' },
      { name: 'Hammerdin', tag: 'Hammerdin', icon: '🔨' },
    ],
    keyDropsZh: '高級符文 (喬 Jah / 貝 Ber / 羅 Lo)、喬丹之石、馬拉的萬花筒、百萬金幣',
    keyDropsEn: 'High Runes (Jah/Ber/Lo), Stone of Jordan, Mara, Million Gold Stashes',
    tacticalTipZh: '瘸子議會成員固定掉落池＋翻屍雙倍判定！符文與暗金首飾產出之巔；務必堆疊 75% 火抗以防九頭蛇。',
    tacticalTipEn: 'High Council members drop exceptional runes and jewelry. Max Fire Res is vital vs Hydras.',
  },
  {
    id: 'chaos_sanctuary',
    act: 4,
    nameZh: '混沌魔殿',
    nameEn: 'The Chaos Sanctuary',
    locationZh: '第 4 章 · 熔岩地獄深處',
    locationEn: 'Act IV · River of Flame Terminal',
    alvl: 85,
    difficulty: 4,
    immunitiesZh: ['火焰免疫 (毒魔領主)', '冰寒免疫 (遺忘騎士)', '閃電免疫 (暴風施術者)'],
    immunitiesEn: ['Fire (Venom Lord)', 'Cold (Oblivion Knight)', 'Light (Storm Caster)'],
    recommendedBuildsZh: [
      { name: '祝福之鎚聖騎', tag: 'Hammerdin', icon: '🔨' },
      { name: '無限電標馬', tag: 'Infinity Javazon', icon: '⚡' },
      { name: '新星/電法', tag: 'Nova / Light Sorc', icon: '⚡' },
      { name: '雙夢熱誠聖騎', tag: 'Dual Dream', icon: '🐲' },
    ],
    recommendedBuildsEn: [
      { name: 'Blessed Hammer Paladin', tag: 'Hammerdin', icon: '🔨' },
      { name: 'Infinity Javazon', tag: 'Infinity Javazon', icon: '⚡' },
      { name: 'Nova / Light Sorc', tag: 'Nova / Light Sorc', icon: '⚡' },
      { name: 'Dual Dream Paladin', tag: 'Dual Dream', icon: '🐲' },
    ],
    keyDropsZh: '全暗黑 TC87 裝備庫、迪亞布羅燃燒精華 (重置徽章材料)、90+ 級極限經驗',
    keyDropsEn: 'Full TC87 Drop Pool, Burning Essence of Terror, 90+ Fast Leveling',
    tacticalTipZh: '解開 5 大封印並擊殺大臣召喚暗黑破壞神迪亞布羅！怪密極高，需注意遺忘騎士之衰老詛咒。',
    tacticalTipEn: 'Break 5 seals and slay grand viziers to summon Diablo. High density and extreme rewards.',
  },
  {
    id: 'worldstone_keep',
    act: 5,
    nameZh: '世界之石要塞 & 毀滅王座',
    nameEn: 'Worldstone Keep & Throne',
    locationZh: '第 5 章 · 亞瑞特聖山之巔',
    locationEn: 'Act V · Mount Arreat Summit',
    alvl: 85,
    difficulty: 5,
    immunitiesZh: ['全元素混合極限免疫', '電鬼 (閃電齊射)', '娃娃 (近戰自爆)'],
    immunitiesEn: ['Mixed Extreme Immunities', 'Black Souls (Lightning)', 'Stygian Dolls (Death Explosion)'],
    recommendedBuildsZh: [
      { name: '終極全能畢業流派', tag: 'Endgame All-Rounder', icon: '👑' },
      { name: '神裝標馬', tag: 'Geared Javazon', icon: '⚡' },
      { name: '謎團祝槌騎', tag: 'Enigma Hammerdin', icon: '🔨' },
      { name: '召喚死靈軍團', tag: 'Summon Army', icon: '💀' },
    ],
    recommendedBuildsEn: [
      { name: 'Endgame All-Rounder', tag: 'Endgame All-Rounder', icon: '👑' },
      { name: 'High-End Javazon', tag: 'Geared Javazon', icon: '⚡' },
      { name: 'Enigma Hammerdin', tag: 'Enigma Hammerdin', icon: '🔨' },
      { name: 'Summoner Necromancer', tag: 'Summon Army', icon: '💀' },
    ],
    keyDropsZh: '毀滅精華 (巴爾)、泰瑞爾之力、全 D2R 頂裝掉落終點站、99 級衝榜殿堂',
    keyDropsEn: 'Destruction Essence (Baal), Tyrael, Highest Endgame Items, Level 99 Grind',
    tacticalTipZh: '全遊戲最致命高危戰區！五波僕從狂潮與巴爾王座，需極致電抗防止黑魂秒殺並防禦娃娃自爆。',
    tacticalTipEn: 'Most dangerous zone in Sanctuary. 5 waves of Baal minions offering the pinnacle of experience.',
  },
];

export const AreaGuide: React.FC = () => {
  const { t, isEn } = useLanguage();
  const [selectedAct, setSelectedAct] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [onlyAlvl85, setOnlyAlvl85] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'areas' | 'terror_zone'>('areas');
  const [activeSuperAreaId, setActiveSuperAreaId] = useState<string | null>(null);

  // Filtered areas
  const filteredAreas = useMemo(() => {
    return AREA_LEVELS_DATA.filter((area) => {
      // Act filter
      if (selectedAct !== 'all' && area.act !== selectedAct) return false;

      // 85 filter
      if (onlyAlvl85 && !area.isAlvl85) return false;

      // Search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchName = area.name.toLowerCase().includes(term);
        const matchNameEn = area.nameEn.toLowerCase().includes(term);
        const matchImmunities = area.immunities.some((im) => im.toLowerCase().includes(term));
        const matchNotes = area.chestsAndBosses?.toLowerCase().includes(term);
        if (!matchName && !matchNameEn && !matchImmunities && !matchNotes) {
          return false;
        }
      }

      return true;
    });
  }, [selectedAct, onlyAlvl85, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sanctuary-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-d2-fire text-xs font-mono tracking-widest uppercase">
            <Flame className="w-4 h-4 text-d2-fire animate-pulse" />
            Endgame Farming & Terror Zones
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            {t('場景寶典與邪惡威脅區域', 'Area Levels & Terror Zones Guide')}
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-2xl">
            {t(
              '收錄 D2R 全 85 級頂級打寶場景 (TC87 掉落聖地)、原生怪物免疫分佈，以及 2.5 邪惡威脅區域 (Terror Zone) 縮放機制與梯隊評級。',
              'Database of Area Level 85 zones (TC87 drop tables), monster immunities, and Terror Zone scaling tiers.'
            )}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-sanctuary-900/80 p-1 rounded-xl border border-sanctuary-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('areas')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSubTab === 'areas'
                ? 'bg-d2-fire text-sanctuary-950 font-bold shadow-lg shadow-d2-fire/20'
                : 'text-sanctuary-300 hover:text-sanctuary-100 hover:bg-sanctuary-800/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            {isEn ? 'Level 85 Areas' : '85 級打寶場景'}
          </button>
          <button
            onClick={() => setActiveSubTab('terror_zone')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeSubTab === 'terror_zone'
                ? 'bg-d2-fire text-sanctuary-950 font-bold shadow-lg shadow-d2-fire/20'
                : 'text-sanctuary-300 hover:text-sanctuary-100 hover:bg-sanctuary-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isEn ? 'Terror Zones Guide' : '邪惡威脅區域攻略指南'}
          </button>
        </div>
      </div>

      {/* ── SubTab 1: 85 場景檢索 ── */}
      {activeSubTab === 'areas' && (
        <div className="space-y-8">
          {/* ── 五大章節原版地理環境徽章 (Act Geography Hub Badges) ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-sanctuary-400 font-mono">
              <span className="flex items-center gap-1.5 text-sanctuary-300">
                <Compass className="w-4 h-4 text-d2-fire" />
                <span>{isEn ? 'Sanctuary World Map & Acts' : '聖休亞瑞世界五大章節原本地理樞紐'}</span>
              </span>
              <span>{isEn ? 'Click an Act to filter' : '點擊章節即可快速切換過濾'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {ACT_GEOGRAPHY_HUBS.map((hub) => {
                const isSelected = selectedAct === hub.act;
                return (
                  <button
                    key={hub.act}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedAct(isSelected ? 'all' : hub.act)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-d2-gold ${
                      isSelected
                        ? `bg-gradient-to-b ${hub.themeColor} ${hub.badgeBorder} shadow-lg ring-1 ring-d2-gold/50`
                        : 'bg-sanctuary-950/80 border-sanctuary-800/80 hover:border-sanctuary-700 hover:bg-sanctuary-900/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${hub.badgeBg} ${hub.badgeBorder} ${hub.textColor}`}>
                          {isEn ? hub.titleEn : hub.titleZh}
                        </span>
                        <span className="text-[10px] font-mono text-d2-gold flex items-center gap-0.5">
                          <Award className="w-3 h-3" />
                          <span>alvl 85 ({hub.alvl85Count})</span>
                        </span>
                      </div>

                      <div className="font-diablo text-sm font-bold text-sanctuary-100 group-hover:text-d2-gold transition-colors">
                        {isEn ? hub.hubNameEn : hub.hubNameZh}
                      </div>
                      {!isEn && (
                        <div className="text-[10px] font-mono text-sanctuary-400 truncate">
                          {hub.hubNameEn}
                        </div>
                      )}

                      <p className="text-[11px] text-sanctuary-400 mt-2 line-clamp-2 leading-relaxed">
                        {isEn ? hub.environmentEn : hub.environmentZh}
                      </p>
                    </div>

                    <div className="pt-2.5 mt-2.5 border-t border-sanctuary-800/60 flex items-center justify-between text-[10px] font-mono text-sanctuary-500">
                      <span>{isSelected ? (isEn ? 'Filtered' : '已篩選') : (isEn ? 'Filter Act' : '點擊篩選')}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-d2-gold' : 'group-hover:translate-x-0.5'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── TC87 五大頂級聖地天梯榜 (Level 85 Super-Areas Showcase) ── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-d2-gold/15 text-d2-gold border border-d2-gold/30">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-diablo text-lg sm:text-xl font-bold text-sanctuary-100 flex items-center gap-2">
                    <span>{isEn ? 'TC87 Big Five Super-Areas' : 'TC87 五大終極頂級聖地天梯榜'}</span>
                    <span className="text-xs font-mono font-normal text-d2-gold">Level 85 Super-Areas</span>
                  </h2>
                  <p className="text-xs text-sanctuary-400">
                    {isEn 
                      ? 'The most iconic farming grounds in D2R history. Drop up to TC87 / qlvl 87 god-tier items and all high runes up to #33 Zod!' 
                      : '二十載歷久不衰的五大終極打寶殿堂！掉落全遊戲最高階 TC87 裝備與最高 32 號查姆、33 號薩德 (Zod) 終極符文。'}
                  </p>
                </div>
              </div>

              {selectedAct !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedAct('all')}
                  className="text-xs font-mono text-d2-fire hover:text-amber-300 transition-colors flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>{isEn ? 'Show All Acts' : '重設回全部章節'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {SUPER_FARMING_AREAS.map((area) => {
                const isExpanded = activeSuperAreaId === area.id;

                return (
                  <div
                    key={area.id}
                    className={`rounded-2xl border p-4.5 transition-all duration-300 flex flex-col justify-between group ${
                      isExpanded
                        ? 'bg-gradient-to-b from-sanctuary-900/90 via-sanctuary-950 to-sanctuary-900/90 border-d2-gold shadow-[0_0_20px_rgba(200,165,100,0.2)]'
                        : 'bg-sanctuary-950/70 border-sanctuary-800/80 hover:border-sanctuary-700'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sanctuary-900 text-sanctuary-300 border border-sanctuary-800">
                          {isEn ? `Act ${area.act}` : `第 ${area.act} 章`}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-d2-gold/15 text-d2-gold border border-d2-gold/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            TC87
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-diablo text-base font-bold text-sanctuary-100 group-hover:text-d2-fire transition-colors">
                        {isEn ? area.nameEn : area.nameZh}
                      </h3>
                      {!isEn && (
                        <div className="text-[11px] font-mono text-sanctuary-400 mb-2">
                          {area.nameEn}
                        </div>
                      )}
                      <div className="text-[10px] text-d2-unique font-mono mb-3">
                        {isEn ? area.locationEn : area.locationZh}
                      </div>

                      {/* Difficulty Skulls */}
                      <div className="flex items-center justify-between text-[11px] font-mono mb-3 bg-sanctuary-900/50 p-2 rounded-xl border border-sanctuary-850">
                        <span className="text-sanctuary-400">{isEn ? 'Danger Rating:' : '危險難度：'}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${i < area.difficulty ? 'text-d2-fire' : 'text-sanctuary-800'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Immunities */}
                      <div className="space-y-1 mb-3">
                        <div className="text-[10px] font-mono text-sanctuary-500">
                          {isEn ? 'Native Immunities:' : '原生怪物免疫：'}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(isEn ? area.immunitiesEn : area.immunitiesZh).map((im, i) => {
                            let color = 'bg-sanctuary-850 text-sanctuary-300 border-sanctuary-750';
                            if (im.includes('冰寒') || im.includes('Cold')) color = 'bg-d2-cold/15 text-d2-cold border-d2-cold/30';
                            if (im.includes('火焰') || im.includes('Fire')) color = 'bg-d2-fire/15 text-d2-fire border-d2-fire/30';
                            if (im.includes('閃電') || im.includes('Light')) color = 'bg-d2-lightning/15 text-d2-lightning border-d2-lightning/30';
                            if (im.includes('毒素') || im.includes('Poison')) color = 'bg-d2-poison/15 text-d2-poison border-d2-poison/30';

                            return (
                              <span
                                key={i}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${color}`}
                              >
                                {im}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recommended Builds */}
                      <div className="space-y-1.5 mb-3 pt-2 border-t border-sanctuary-850/80">
                        <div className="text-[10px] font-mono text-d2-gold flex items-center gap-1 font-bold">
                          <Swords className="w-3 h-3" />
                          <span>{isEn ? 'Recommended Builds:' : '首選推薦拓荒/刷寶流派：'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(isEn ? area.recommendedBuildsEn : area.recommendedBuildsZh).map((b, i) => (
                            <div
                              key={i}
                              className="px-2 py-1 rounded-lg bg-sanctuary-900/80 border border-sanctuary-800 text-[10px] text-sanctuary-200 flex items-center gap-1 truncate"
                              title={b.name}
                            >
                              <span>{b.icon}</span>
                              <span className="truncate">{b.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Drops */}
                      <div className="p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 text-[10px] text-sanctuary-300 leading-relaxed font-sans mb-3">
                        <span className="text-d2-unique font-medium font-mono">{isEn ? 'Key Drops: ' : '核心收穫：'}</span>
                        {isEn ? area.keyDropsEn : area.keyDropsZh}
                      </div>

                      {/* Tactical Tip (if expanded or compact) */}
                      <div className="p-2 rounded-xl bg-d2-fire/5 border border-d2-fire/20 text-[10px] text-sanctuary-300 leading-relaxed font-sans">
                        <span className="text-d2-fire font-bold font-mono">{isEn ? 'Tactics: ' : '戰術策略：'}</span>
                        {isEn ? area.tacticalTipEn : area.tacticalTipZh}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-sanctuary-850/80 flex items-center justify-between text-[10px] font-mono text-sanctuary-500">
                      <button
                        type="button"
                        onClick={() => setSelectedAct(area.act)}
                        className="text-d2-gold hover:text-amber-200 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-d2-gold rounded px-1 -mx-1"
                      >
                        <span>{isEn ? `Filter Act ${area.act}` : `篩選第 ${area.act} 章`}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSuperAreaId(isExpanded ? null : area.id)}
                        className={`transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-d2-gold ${
                          isExpanded
                            ? 'text-d2-gold bg-d2-gold/10 border-d2-gold/30'
                            : 'text-sanctuary-400 border-sanctuary-800 hover:text-sanctuary-200'
                        }`}
                      >
                        <span>{isExpanded ? (isEn ? 'Highlighting' : '高亮中') : (isEn ? 'Highlight' : '點擊高亮')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Controls Bar ── */}
          <div className="bg-sanctuary-900/60 p-4 rounded-2xl border border-sanctuary-800 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Act Filter */}
            <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
              <span className="text-xs text-sanctuary-400 font-mono mr-1">{isEn ? 'Acts: ' : '章節：'}</span>
              {(['all', 1, 2, 3, 4, 5] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => setSelectedAct(act)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedAct === act
                      ? 'bg-d2-fire text-sanctuary-950 font-bold shadow'
                      : 'bg-sanctuary-950/80 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'
                  }`}
                >
                  {act === 'all' ? (isEn ? 'All Acts' : '全部章節') : (isEn ? `Act ${act}` : `第 ${act} 章 (Act ${act})`)}
                </button>
              ))}
            </div>

            {/* Alvl 85 Toggle & Search */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setOnlyAlvl85(!onlyAlvl85)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 shrink-0 ${
                  onlyAlvl85
                    ? 'bg-d2-gold/20 text-d2-gold border-d2-gold/40'
                    : 'bg-sanctuary-950/60 text-sanctuary-400 border-sanctuary-800 hover:text-sanctuary-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                {isEn ? `Level 85 Only (${AREA_LEVELS_DATA.filter((a) => a.isAlvl85).length})` : `僅顯示 85 級場景 (${AREA_LEVELS_DATA.filter((a) => a.isAlvl85).length})`}
              </button>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('搜尋場景名稱或免疫...', 'Search area name or immunities...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-fire/50"
                />
              </div>
            </div>
          </div>

          {/* ── Area Cards Grid ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-sanctuary-400 font-mono">
              <span>
                {isEn 
                  ? `Showing ${filteredAreas.length} Areas` 
                  : `顯示 ${filteredAreas.length} 個場景資料`}
              </span>
              {onlyAlvl85 && (
                <span className="text-d2-gold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Filtered by Level 85 (TC87)' : '已啟用 85 級 TC87 專屬過濾'}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAreas.map((area, idx) => {
                const isSuperArea = ['地穴 第 1 層', '古代通道', '崔凡克 (最高議會瘸子群)', '混沌魔殿 (暗黑殿堂)', '世界之石要塞 第 2 層', '毀滅王座'].some(n => area.name.includes(n) || n.includes(area.name));

                return (
                  <div
                    key={idx}
                    className={`bg-sanctuary-900/40 rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between group ${
                      isSuperArea
                        ? 'border-d2-gold/50 hover:border-d2-gold shadow-[0_0_15px_rgba(200,165,100,0.1)]'
                        : 'border-sanctuary-800/80 hover:border-sanctuary-700'
                    }`}
                  >
                    <div>
                      {/* Top tags */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sanctuary-800 text-sanctuary-300">
                            {isEn ? `Act ${area.act}` : `第 ${area.act} 章`}
                          </span>
                          {isSuperArea && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-d2-fire/15 text-d2-fire border border-d2-fire/30">
                              {isEn ? 'Super-Area' : '終極聖地'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {area.isAlvl85 && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-d2-gold/15 text-d2-gold border border-d2-gold/30 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {isEn ? 'TC87 Lvl 85' : 'TC87 85級'}
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sanctuary-950 text-sanctuary-400 border border-sanctuary-800">
                            alvl {area.areaLevel}
                          </span>
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="text-lg font-bold text-sanctuary-100 group-hover:text-d2-fire transition-colors">
                        {isEn && area.nameEn ? area.nameEn : area.name}
                      </h3>
                      {!isEn && (
                        <div className="text-xs font-mono text-sanctuary-400 mb-3">
                          {area.nameEn}
                        </div>
                      )}

                      {/* Immunities */}
                      <div className="space-y-1 mb-3">
                        <div className="text-[11px] font-mono text-sanctuary-500">{isEn ? 'Monster Immunities:' : '原生怪物免疫：'}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {area.immunities.length === 0 ? (
                            <span className="text-xs text-sanctuary-500">{isEn ? 'No fixed immunities' : '無明顯固定免疫'}</span>
                          ) : (
                            area.immunities.map((im, i) => {
                              let colorClass = "bg-sanctuary-800 text-sanctuary-300 border-sanctuary-700";
                              if (im.includes("冰寒")) colorClass = "bg-d2-cold/15 text-d2-cold border-d2-cold/30";
                              if (im.includes("火焰")) colorClass = "bg-d2-fire/15 text-d2-fire border-d2-fire/30";
                              if (im.includes("閃電")) colorClass = "bg-d2-lightning/15 text-d2-lightning border-d2-lightning/30";
                              if (im.includes("毒素")) colorClass = "bg-d2-poison/15 text-d2-poison border-d2-poison/30";
                              if (im.includes("物理")) colorClass = "bg-sanctuary-700 text-sanctuary-200 border-sanctuary-600";

                              return (
                                <span
                                  key={i}
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${colorClass}`}
                                >
                                  {isEn ? translateImmunity(im) : im}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notes & Bosses */}
                    {(isEn ? area.chestsAndBossesEn : area.chestsAndBosses) && (
                      <div className="mt-3 pt-3 border-t border-sanctuary-800/60 text-xs text-sanctuary-400 leading-relaxed bg-sanctuary-950/40 p-2.5 rounded-xl">
                        <span className="text-d2-unique font-medium font-mono">{isEn ? "Features: " : "特色："}</span> {isEn ? area.chestsAndBossesEn : area.chestsAndBosses}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SubTab 2: 邪惡威脅區域 (Terror Zone) 攻略指南 ── */}
      {activeSubTab === 'terror_zone' && (
        <div className="space-y-8">
          {/* Mechanics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TERROR_ZONE_GUIDE.mechanics.map((item, idx) => (
              <div
                key={idx}
                className="bg-sanctuary-900/60 border border-sanctuary-800 p-5 rounded-2xl flex gap-3.5 items-start"
              >
                <div className="p-2 rounded-xl bg-d2-fire/10 text-d2-fire border border-d2-fire/20 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-sanctuary-100 mb-1">
                    {isEn ? (item.titleEn || item.title) : item.title}
                  </h4>
                  <p className="text-xs text-sanctuary-400 leading-relaxed">
                    {isEn ? (item.contentEn || item.content) : item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tier List */}
          <div className="space-y-4">
            <h3 className="text-xl font-diablo font-bold text-sanctuary-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-d2-gold" />
              {isEn ? "Terror Zones (TZ) Farming Efficiency Tier List" : "邪惡威脅區域 (TZ) 輪替刷取效率梯隊排行榜"}
            </h3>

            <div className="space-y-4">
              {TERROR_ZONE_GUIDE.tiers.map((tierData) => {
                let badgeClass = "bg-sanctuary-800 text-sanctuary-300 border-sanctuary-700";
                if (tierData.tier === 'S') badgeClass = "bg-d2-gold/20 text-d2-gold border-d2-gold/40 shadow-glow-gold";
                if (tierData.tier === 'A') badgeClass = "bg-d2-fire/20 text-d2-fire border-d2-fire/40";
                if (tierData.tier === 'B') badgeClass = "bg-d2-unique/20 text-d2-unique border-d2-unique/40";
                if (tierData.tier === 'C') badgeClass = "bg-sanctuary-800 text-sanctuary-400 border-sanctuary-700";

                return (
                  <div
                    key={tierData.tier}
                    className="bg-sanctuary-900/40 border border-sanctuary-800 rounded-2xl p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl font-diablo font-bold text-lg flex items-center justify-center border ${badgeClass}`}>
                          {tierData.tier}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-sanctuary-100">
                            {isEn ? (tierData.titleEn || tierData.title) : tierData.title}
                          </h4>
                          <p className="text-xs text-sanctuary-400">
                            {isEn ? (tierData.descriptionEn || tierData.description) : tierData.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 pt-3 border-t border-sanctuary-800/60">
                      {(isEn && tierData.areasEn ? tierData.areasEn : tierData.areas).map((areaName, i) => (
                        <div
                          key={i}
                          className="bg-sanctuary-950/60 px-3 py-2 rounded-xl border border-sanctuary-800/80 text-xs text-sanctuary-200 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-d2-fire shrink-0" />
                          <span>{areaName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
