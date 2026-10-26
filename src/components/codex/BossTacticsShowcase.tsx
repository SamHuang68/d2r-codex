import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Crosshair, 
  Trophy, 
  Zap, 
  AlertTriangle,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getMonsterImage } from '../../utils/monsterImages';

export interface BossTacticsShowcaseProps {
  onSelectBoss?: (bossId: string) => void;
}

interface BossProfile {
  id: string;
  name: string;
  nameEn: string;
  act: number;
  actTitleZh: string;
  actTitleEn: string;
  titleZh: string;
  titleEn: string;
  locationZh: string;
  locationEn: string;
  levels: [number, number, number];
  weaknessHighlight: string;
  weaknessHighlightEn: string;
  weaknessColor: string;
  resistsHell: {
    phys: number;
    fire: number;
    light: number;
    cold: number;
    pois: number;
    magic: number;
  };
  deadlyAttacks: {
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    counterplay: string;
    counterplayEn: string;
  }[];
  farmingValue: string[];
  farmingValueEn: string[];
  tacticalTip: string;
  tacticalTipEn: string;
}

const BOSS_PROFILES: BossProfile[] = [
  {
    id: 'andariel',
    name: '安達莉爾',
    nameEn: 'Andariel',
    act: 1,
    actTitleZh: '第一章 核心首領',
    actTitleEn: 'Act I Final Boss',
    titleZh: '苦痛女王',
    titleEn: 'Maiden of Anguish',
    locationZh: '地下墓穴第四層',
    locationEn: 'Catacombs Level 4',
    levels: [12, 49, 75],
    weaknessHighlight: '三難度火抗均為 -50%！極度畏懼火焰傷害',
    weaknessHighlightEn: '-50% Fire Resistance in all difficulties! Highly vulnerable to Fire damage.',
    weaknessColor: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
    resistsHell: { phys: 66, fire: -50, light: 66, cold: 66, pois: 66, magic: 0 },
    deadlyAttacks: [
      {
        name: '劇毒新星 (Poison Nova)',
        nameEn: 'Poison Nova',
        description: '高密度發射全方位劇毒環，持續時間極長且中毒掉血極快。',
        descriptionEn: 'Fires high-density radial poison waves with prolonged duration and lethal damage over time.',
        counterplay: '戰鬥前喝下 4~6 瓶解毒藥水，可疊加 30 秒至 3 分鐘以上的 +50 毒抗與 +10 最大毒抗上限 (直接頂到 85 毒抗)！',
        counterplayEn: 'Chug 4-6 Antidote Potions before combat to stack 3+ minutes of +50 Poison Res and +10 Max Poison Res (up to 85% cap)!',
      },
      {
        name: '近身毒爪肉搏',
        nameEn: 'Poison Melee Claws',
        description: '附帶毒素的物理猛擊，開荒期脆皮法師挨兩下即殘血。',
        descriptionEn: 'Vicious physical melee strikes with heavy toxic coatings that easily shred fragile casters.',
        counterplay: '利用第四層中間的血池或大門障礙物進行風箏拉扯，切勿貼臉站樁。',
        counterplayEn: 'Kite around the central blood pool or door obstacles; avoid facetanking in melee range.',
      },
    ],
    farmingValue: [
      '【喬丹之石 (SoJ) 最佳提款機】惡夢難度安達莉爾的 SoJ 掉落率為全遊戲魔王之冠 (約 1/3800)！',
      '地獄難度常態掉落軍帽 (Harlequin Crest)、拿各的戒指、法師之拳、暗金飾品。',
      'D2R 重製版已固定常態啟用「首殺優質掉落率 (Quest Bug Drop)」，無需特殊卡 bug。',
    ],
    farmingValueEn: [
      '[Prime SoJ Source] Nightmare Andariel has the highest Stone of Jordan drop rate in D2R (~1/3800)!',
      'Hell difficulty frequently yields Harlequin Crest (Shako), Nagelring, Magefist, and unique jewelry.',
      'D2R permanently enables Quest Bug Drop for Andariel by default with zero glitched setup needed.',
    ],
    tacticalTip: '火法 (隕石/火球)、火靈德、刺客火爆陷阱是安達莉爾的絕對剋星！-50% 火抗意味著所有火焰技能天然享有 1.5 倍傷害乘算加成，開荒期刷圖極其神速。',
    tacticalTipEn: 'Fire Sorceress (Meteor/Fireball), Fire Druid, and Fire Traps are absolute hard counters! The -50% Fire Res grants an innate 1.5x damage multiplier, making starter clears blisteringly fast.',
  },
  {
    id: 'duriel',
    name: '都瑞爾',
    nameEn: 'Duriel',
    act: 2,
    actTitleZh: '第二章 核心首領',
    actTitleEn: 'Act II Final Boss',
    titleZh: '痛苦之王',
    titleEn: 'Lord of Pain',
    locationZh: '真正的塔拉夏的古墓',
    locationEn: 'Tal Rasha\'s Chamber',
    levels: [22, 55, 88],
    weaknessHighlight: '狹小密室易被靜態力場與壓碎打擊 (CB) 快速削血',
    weaknessHighlightEn: 'Confined chamber makes Duriel vulnerable to Static Field and rapid Crushing Blow (CB) shaving.',
    weaknessColor: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
    resistsHell: { phys: 50, fire: 75, light: 75, cold: 95, pois: 75, magic: 33 },
    deadlyAttacks: [
      {
        name: '神聖冰凍光環 (Holy Freeze)',
        nameEn: 'Holy Freeze Aura',
        description: '原生自帶神聖冰凍光環，無視「無法凍結」屬性，強制降低玩者攻速與走位移動速度。',
        descriptionEn: 'Innate Holy Freeze aura ignores Cannot Be Frozen, drastically reducing attack and movement speeds.',
        counterplay: '進密室插杖前，本體與僱傭兵各自灌下 4~6 瓶融冰藥水，獲得 85 冰抗與長效冰冷減免。',
        counterplayEn: 'Gulp 4-6 Thawing Potions on both hero and mercenary before entering the chamber for 85% Cold Res and cold reduction.',
      },
      {
        name: '連環突進猛刺 (Jab & Smite)',
        nameEn: 'Jab, Smite & Charge',
        description: '極速位移追擊衝撞，剛讀取進門的玩家極易被連續重擊秒殺。',
        descriptionEn: 'Rapid charging slam and stun attacks that frequently wipe players right upon loading through the orifice.',
        counterplay: '雇用第二章防禦傭兵或召喚黏土石魔扛住第一波仇恨，法師貼身連續施放靜態力場 (Static Field) 瞬間削掉 50% 血量。',
        counterplayEn: 'Let your Act II mercenary or Clay Golem take initial aggro, cast TP immediately, and spam Static Field to halve HP instantly.',
      },
    ],
    farmingValue: [
      '地獄都瑞爾掉落等級高達 Lv88，可掉落絕大多數高級暗金武器與防具。',
      '第二章通關的指標門檻；雖然有時掉落滿地城鎮傳送卷軸，但暗金首飾與護甲產率不俗。',
    ],
    farmingValueEn: [
      'Hell Duriel boasts monster level 88, capable of dropping almost all elite unique armors and weapons.',
      'A notorious benchmark boss; despite the town portal scroll memes, unique jewelry and facet drops are respectable.',
    ],
    tacticalTip: '近戰狂熱盾擊聖騎是都瑞爾的死敵，盾擊 Smite 必中特性配合 50% 壓碎打擊 (CB) 能在數秒內將其融化；法師請善用靜態力場後換傳送拉開距離輸出。',
    tacticalTipEn: 'Smite Paladin with Crushing Blow melts Duriel in seconds due to Smite 100% hit rate; Sorceresses should chain Static Field and kite with Teleport.',
  },
  {
    id: 'mephisto',
    name: '墨菲斯托',
    nameEn: 'Mephisto',
    act: 3,
    actTitleZh: '第三章 核心首領',
    actTitleEn: 'Act III Final Boss',
    titleZh: '憎恨之王',
    titleEn: 'Lord of Hatred',
    locationZh: '憎恨囚牢第三層',
    locationEn: 'Durance of Hate Level 3',
    levels: [26, 59, 87],
    weaknessHighlight: '物理抗性僅 20%！且可被經典「隔河卡怪法 (Moat Trick)」無傷轟殺',
    weaknessHighlightEn: 'Only 20% Physical Res! Perfectly cheesed with the iconic zero-damage "Moat Trick".',
    weaknessColor: 'text-sky-400 border-sky-500/40 bg-sky-950/20',
    resistsHell: { phys: 20, fire: 75, light: 75, cold: 75, pois: 75, magic: 50 },
    deadlyAttacks: [
      {
        name: '骷髏充能彈 (Charged Bolt Orb)',
        nameEn: 'Charged Bolt Orb & Lightning',
        description: '蓄力釋放高額閃電與物理複合球體，被擊中瞬間容易蒸發大半血量。',
        descriptionEn: 'Charges up massive hybrid lightning/physical spheres that vaporize unmaxed players instantly.',
        counterplay: '將閃電抗性堆滿 75%，切勿在正面直線硬吃蓄力彈；走位保持角度。',
        counterplayEn: 'Keep Lightning Res strictly capped at 75%+, avoid standing directly downrange of charged projectiles.',
      },
      {
        name: '冰寒暴風雪與冰封球',
        nameEn: 'Blizzard & Frost Nova',
        description: '遠程施放暴風雪，造成持續冰冷傷害與動作遲滯。',
        descriptionEn: 'Casts long-range Blizzard waves causing sustained cold damage and heavy chilling slowing.',
        counterplay: '穿著具備「無法凍結」的裝備 (如烏鴉之霜) 並拉開安全射程。',
        counterplayEn: 'Equip Cannot Be Frozen (e.g. Raven Frost) and engage from safe perimeter distances.',
      },
    ],
    farmingValue: [
      '【開荒起家第一神仙提款機】地獄墨菲斯托產出日用剛需暗金的最強魔王！',
      '高產出目標：軍帽、蛇魔法師之皮、撒卡蘭姆使者、眼球、巫師之刺、馬拉的萬花筒、蜘蛛之網腰帶。',
      '路徑直通崔凡克血池，刷圖節奏極快。',
    ],
    farmingValueEn: [
      '[Starter Cash Cow #1] Hell Mephisto is the king of mid-to-high tier essential uniques!',
      'Top targets: Harlequin Crest (Shako), Vipermagi, Herald of Zakarum (HoZ), The Oculus, Mara\'s Kaleidoscope, Arachnid Mesh.',
      'Fast waypoint route straight from Durance Level 2 makes run times extremely efficient.',
    ],
    tacticalTip: '【經典逃課 Moat Trick】法師將墨菲斯托引誘至紅門血池中央對岸，退到其視野極限外，墨菲斯托會呆立在對岸無法攻擊，此時暴風雪或火球可安全無傷白嫖擊殺！',
    tacticalTipEn: '[Iconic Moat Trick] Lure Mephisto to the blood river opposite the red portal. Step back to edge of screen; Mephisto freezes in place unable to retaliate while Blizzard or Fireball clears him without a scratch!',
  },
  {
    id: 'diablo',
    name: '迪亞布羅',
    nameEn: 'Diablo',
    act: 4,
    actTitleZh: '第四章 終極魔王',
    actTitleEn: 'Act IV Final Boss',
    titleZh: '恐懼之王',
    titleEn: 'Lord of Terror',
    locationZh: '混沌魔殿五大封印中央',
    locationEn: 'Chaos Sanctuary (CS)',
    levels: [40, 62, 94],
    weaknessHighlight: '魔法抗性 0%！祝槌聖騎、骨死靈與全法系壓碎殺神',
    weaknessHighlightEn: '0% Magic Resistance! Melts against Blessed Hammer, Bone Spear, and Smite Crushing Blow.',
    weaknessColor: 'text-d2-fire border-d2-fire/40 bg-amber-950/20',
    resistsHell: { phys: 45, fire: 50, light: 50, cold: 50, pois: 50, magic: 0 },
    deadlyAttacks: [
      {
        name: '紅色閃電軟管 (Red Lightning Hose)',
        nameEn: 'Red Lightning Hose',
        description: '暗黑破壞神最具毀滅性的招牌招式，高頻噴射物理與閃電複合烈焰，正面硬吃必定秒殺！',
        descriptionEn: 'Diablo\'s signature devastating ability, channeling continuous physical/lightning streams that shred targets.',
        counterplay: '【軟管起點盲區機制】軟管的起點是在其頭部前方一段距離，貼身近戰或繞背走位反而不會受到任何傷害判定！法系請繞圓跑動。',
        counterplayEn: '[Hose Blind Spot] The beam origin begins slightly ahead of his mouth. Hugging Diablo in melee or circling behind completely evades the hitbox!',
      },
      {
        name: '末日審判 (Firestorm) 與骨牢 (Bone Prison)',
        nameEn: 'Firestorm & Bone Prison',
        description: '在地面形成扇形火雨裂隙，並常用骨牢將遠程角色死死困在原地。',
        descriptionEn: 'Erupts ground fissures into fan-shaped firestorms and cages ranged casters inside Bone Prisons.',
        counterplay: '隨時保持移動，身陷骨牢時立即傳送 (Teleport) 或使用位移技能脫困。',
        counterplayEn: 'Keep moving constantly; instantly Teleport or leap away if trapped inside Bone Prison.',
      },
    ],
    farmingValue: [
      '地獄難度等級高達 Lv94，混沌魔殿本身為頂級 85 場景 (TC87 全暗金全符文皆可掉落)！',
      '迪亞布羅本人固定掉落「恐懼精華 (Essence of Terror - 洗點水素材)」以及頂級暗金。',
    ],
    farmingValueEn: [
      'Hell monster level 94 situated inside the premier Level 85 Chaos Sanctuary (all TC87 uniques and high runes can drop)!',
      'Guaranteed drops of Burning Essence of Terror (key component for Token of Absolution) and elite tier gear.',
    ],
    tacticalTip: '祝槌聖騎 (Hammerdin) 的神聖之槌屬於純魔法傷害，而大菠蘿魔抗為 0%，配合盾擊壓碎打擊幾秒內即可消滅；近戰職業貼臉輸出反而比遠距離更安全！',
    tacticalTipEn: 'Blessed Hammer deals pure Magic damage against Diablo\'s 0% Magic Res. Smite with Crushing Blow brings him down in seconds; melee range is surprisingly safer than standing mid-range!',
  },
  {
    id: 'baalcrab',
    name: '巴爾',
    nameEn: 'Baal',
    act: 5,
    actTitleZh: '第五章 終極之惡',
    actTitleEn: 'Act V Worldstone Chamber',
    titleZh: '毀滅之王',
    titleEn: 'Lord of Destruction',
    locationZh: '世界之石大殿',
    locationEn: 'Worldstone Chamber',
    levels: [60, 75, 99],
    weaknessHighlight: '等級高達 Lv99！生命 49.3 萬，極度畏懼「石魔+衰老」極限緩速',
    weaknessHighlightEn: 'Monster Level 99 with 493k HP; completely paralyzed by "Decrepify + Clay Golem" slow stacking.',
    weaknessColor: 'text-purple-400 border-purple-500/40 bg-purple-950/20',
    resistsHell: { phys: 50, fire: 50, light: 50, cold: 50, pois: 50, magic: 0 },
    deadlyAttacks: [
      {
        name: '法力燃燒光環 (Mana Burn)',
        nameEn: 'Mana Burn & Incineration Wave',
        description: '發射幽靈觸手或燃燒波，瞬間將全法系角色的法力條抽乾至 0。',
        descriptionEn: 'Launches spectral tendrils or burning waves that instantly drain the caster\'s entire mana pool to zero.',
        counterplay: '法師與法系職業需常備大紫藥水 (Full Rejuvenation Potion)，並讓傭兵吸引仇恨。',
        counterplayEn: 'Keep Full Rejuvenation Potions slotted on hotkeys and maintain mercenary/minion meatshields.',
      },
      {
        name: '冰寒擊退之波 (Hoar Frost)',
        nameEn: 'Hoar Frost V-Wave',
        description: '巨大 V 字型冰霜推力波，將角色遠遠擊退並造成高額冰凍減速。',
        descriptionEn: 'Huge V-shaped frosty thrust wave that knocks characters far back with extreme cold chill.',
        counterplay: '必須裝備無法凍結；近戰職業頂牆站位防止被推至千里之外。',
        counterplayEn: 'Cannot Be Frozen is mandatory; position against a wall to negate the huge knockback distance.',
      },
      {
        name: '毀滅分身術 (Baal Clone)',
        nameEn: 'Baal Clone Illusion',
        description: '召喚具備本體同等攻擊力的巴爾幻影分身，造成雙倍技能壓力。',
        descriptionEn: 'Summons an exact mirror image illusion that doubles the offensive skill barrage.',
        counterplay: '【識破真假身秘訣】真身血條下方的「BAAL」字樣完全居中，分身的「B」字會稍微向左偏移！此外死靈詛咒只會留在真身頭上。',
        counterplayEn: '[Telling Clone from Real] The real Baal has the name "BAAL" perfectly centered above his HP bar; the clone\'s "B" is offset slightly to the left! Also Necromancer curses only persist on real Baal.',
      },
    ],
    farmingValue: [
      '【全遊戲唯一的 Lv99 超級魔王】巴爾掉落的超大型護身符 (Grand Charm) 等級為 99，能洗出全暗黑唯一的 +45 生命技能大板！',
      '掉落「毀滅精華 (Twisted Essence of Destruction)」是製作赦免徽章 (洗點水) 的必備核心。',
      '毀滅王座前五波怪物是 90~99 級衝頂等級的經驗之聖地。',
    ],
    farmingValueEn: [
      '[Only Level 99 Boss] Baal drops ilvl 99 Grand Charms, the only charms in D2R capable of rolling +45 Life Skiller plates!',
      'Drops Twisted Essence of Destruction, the crucial capstone for Token of Absolution respec tokens.',
      'Throne of Destruction 5 minion waves provide the apex XP farming route for reaching Level 99.',
    ],
    tacticalTip: '【三合一極限制殘連鎖】死靈法師的「衰老詛咒 (-50% 攻速移速)」+ 黏土石魔的「黏土緩速 (-50% 攻速)」+「冰冷傷害緩速」，會將巴爾的動作幀數降至接近靜止 (0 幀攻擊)！巴爾將徹底淪為木樁任人宰割。',
    tacticalTipEn: '[Tri-Slow Lockdown] Decrepify (-50% speed) + Clay Golem slow (-50% speed) + Cold Chill reduces Baal\'s attack frames down to near zero! Baal becomes a completely frozen wooden target unable to cast.',
  },
];

export const BossTacticsShowcase: React.FC<BossTacticsShowcaseProps> = ({
  onSelectBoss,
}) => {
  const { isEn } = useLanguage();
  const [selectedBossId, setSelectedBossId] = useState<string>('andariel');

  const currentBoss = BOSS_PROFILES.find((b) => b.id === selectedBossId) || BOSS_PROFILES[0];
  const bossImg = getMonsterImage({ id: currentBoss.id, boss: true, kind: 'demon' });

  return (
    <div className="rounded-3xl bg-gradient-to-b from-sanctuary-900/90 via-sanctuary-950 to-sanctuary-950 border border-sanctuary-750 p-6 md:p-8 shadow-2xl space-y-6">
      {/* 頭部標題 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-sanctuary-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-d2-fire uppercase tracking-wider">
            <Flame className="w-4 h-4 text-d2-fire animate-pulse" />
            <span>{isEn ? 'Act Boss Tactical Dossier & Hitlist' : '五大章節核心首領弱點與逃課打寶聖典'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-diablo font-bold text-sanctuary-100 flex items-center gap-3">
            <span>{isEn ? 'Prime Evils Weakness & Farming Guide' : '魔王弱點抗性拆解、招式應對與打寶提款聖地'}</span>
          </h2>
          <p className="text-xs text-sanctuary-400">
            {isEn
              ? 'Complete tactical profile for Andariel, Duriel, Mephisto, Diablo, and Baal with lethal skill counters and farming drops.'
              : '深入剖析安達莉爾、都瑞爾、墨菲斯托、迪亞布羅、巴爾的致命抗性盲區、危險大招化解方針與最佳打寶產出。'}
          </p>
        </div>

        {/* 魔王快速切換標籤 */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-sanctuary-900 border border-sanctuary-800 self-start lg:self-auto shrink-0">
          {BOSS_PROFILES.map((boss) => {
            const isSelected = boss.id === selectedBossId;
            return (
              <button
                key={boss.id}
                type="button"
                onClick={() => setSelectedBossId(boss.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-d2-fire text-sanctuary-950 font-bold shadow-md shadow-d2-fire/20'
                    : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-850'
                }`}
              >
                <span>{isEn ? boss.nameEn : boss.name}</span>
                <span className="text-[10px] opacity-75 font-mono">Act {boss.act}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 當前選定首領的深度面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左側：魔王視覺卡與基礎情報 (佔 4 欄) */}
        <div className="lg:col-span-4 rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800 p-5 space-y-4 shadow-xl">
          <div className="relative aspect-square max-w-[240px] mx-auto rounded-2xl overflow-hidden border-2 border-d2-unique/60 bg-sanctuary-950 shadow-[0_0_24px_rgba(200,165,100,0.25)] flex items-center justify-center group">
            <img
              src={bossImg}
              alt={isEn ? currentBoss.nameEn : currentBoss.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-sanctuary-950/90 text-d2-unique text-[10px] font-mono font-bold border border-d2-unique/40 shadow">
              {isEn ? currentBoss.actTitleEn : currentBoss.actTitleZh}
            </div>
            <div className="absolute bottom-2 inset-x-2 p-2 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800 text-center">
              <div className="text-base font-diablo font-bold text-d2-unique">
                {isEn ? currentBoss.nameEn : currentBoss.name}
              </div>
              <div className="text-[11px] font-mono text-sanctuary-400">
                {isEn ? currentBoss.titleEn : currentBoss.titleZh}
              </div>
            </div>
          </div>

          {/* 地點與等級 */}
          <div className="space-y-2 text-xs font-mono bg-sanctuary-900/60 p-3 rounded-xl border border-sanctuary-850">
            <div className="flex items-center justify-between">
              <span className="text-sanctuary-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-d2-fire" />
                {isEn ? 'Location:' : '常駐出沒巢穴:'}
              </span>
              <span className="text-sanctuary-200 font-bold">
                {isEn ? currentBoss.locationEn : currentBoss.locationZh}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-sanctuary-800/60">
              <span className="text-sanctuary-500">{isEn ? 'Monster Level:' : '各難度等級:'}</span>
              <span className="text-amber-200">
                {isEn
                  ? `Norm ${currentBoss.levels[0]} / NM ${currentBoss.levels[1]} / Hell ${currentBoss.levels[2]}`
                  : `普 ${currentBoss.levels[0]} / 惡 ${currentBoss.levels[1]} / 地 ${currentBoss.levels[2]}`}
              </span>
            </div>
          </div>

          {/* 致命弱點高亮標籤 */}
          <div className={`p-3 rounded-xl border text-xs font-mono leading-relaxed space-y-1 ${currentBoss.weaknessColor}`}>
            <div className="flex items-center gap-1.5 font-bold">
              <Crosshair className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Core Vulnerability' : '核心戰術弱點'}</span>
            </div>
            <p className="text-[11px] text-sanctuary-200">
              {isEn ? currentBoss.weaknessHighlightEn : currentBoss.weaknessHighlight}
            </p>
          </div>

          {/* 地獄難度六系抗性速覽條 */}
          <div className="p-3 rounded-xl bg-sanctuary-900/40 border border-sanctuary-850 space-y-2">
            <div className="text-[10px] font-mono text-sanctuary-400 font-bold">
              {isEn ? 'Hell Difficulty Resistances:' : '地獄難度六系抗性面板：'}
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono">
              <div className="p-1 rounded bg-sanctuary-950 border border-sanctuary-800">
                <div className="text-[9px] text-sanctuary-500">{isEn ? 'Phys' : '物理'}</div>
                <div className="text-sanctuary-200 font-bold">{currentBoss.resistsHell.phys}%</div>
              </div>
              <div className="p-1 rounded bg-sanctuary-950 border border-sanctuary-800">
                <div className="text-[9px] text-d2-fire">{isEn ? 'Fire' : '火焰'}</div>
                <div className={`font-bold ${currentBoss.resistsHell.fire < 0 ? 'text-rose-400 font-black animate-pulse' : 'text-sanctuary-200'}`}>
                  {currentBoss.resistsHell.fire}%
                </div>
              </div>
              <div className="p-1 rounded bg-sanctuary-950 border border-sanctuary-800">
                <div className="text-[9px] text-d2-lightning">{isEn ? 'Light' : '閃電'}</div>
                <div className="text-sanctuary-200 font-bold">{currentBoss.resistsHell.light}%</div>
              </div>
              <div className="p-1 rounded bg-sanctuary-950 border border-sanctuary-800">
                <div className="text-[9px] text-d2-cold">{isEn ? 'Cold' : '冰寒'}</div>
                <div className="text-sanctuary-200 font-bold">{currentBoss.resistsHell.cold}%</div>
              </div>
              <div className="p-1 rounded bg-sanctuary-950 border border-sanctuary-800">
                <div className="text-[9px] text-d2-poison">{isEn ? 'Poison' : '毒素'}</div>
                <div className="text-sanctuary-200 font-bold">{currentBoss.resistsHell.pois}%</div>
              </div>
              <div className="p-1 rounded bg-sanctuary-950 border border-sanctuary-800">
                <div className="text-[9px] text-d2-magic">{isEn ? 'Magic' : '魔法'}</div>
                <div className={`font-bold ${currentBoss.resistsHell.magic === 0 ? 'text-emerald-300 font-black' : 'text-sanctuary-200'}`}>
                  {currentBoss.resistsHell.magic}%
                </div>
              </div>
            </div>
          </div>

          {/* 跳轉按鈕 */}
          <button
            type="button"
            onClick={() => onSelectBoss?.(currentBoss.id)}
            className="w-full py-2 px-3 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-800 border border-sanctuary-750 hover:border-d2-unique text-xs text-d2-unique font-medium flex items-center justify-center gap-1.5 transition-all shadow group/btn"
          >
            <span>{isEn ? 'Inspect Full Database Row' : '在下方怪物清單展開此魔王完整檔案'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 右側：招式化解、打寶價值與戰術評析 (佔 8 欄) */}
        <div className="lg:col-span-8 space-y-5">
          {/* 致命大招化解指南 */}
          <div className="rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-bold font-diablo text-sanctuary-100">
              <ShieldAlert className="w-4 h-4 text-d2-fire" />
              <span>{isEn ? 'Lethal Boss Abilities & Tactical Counters' : '魔王致命招式拆解與應對化解策略'}</span>
            </div>

            <div className="space-y-3">
              {currentBoss.deadlyAttacks.map((atk, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-d2-fire shrink-0" />
                    <span>{isEn ? atk.nameEn : atk.name}</span>
                  </div>
                  <p className="text-[11px] text-sanctuary-400 leading-relaxed">
                    {isEn ? atk.descriptionEn : atk.description}
                  </p>
                  <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-200 leading-relaxed">
                    🛡 <strong>{isEn ? 'Counterplay: ' : '破解對策：'}</strong>
                    {isEn ? atk.counterplayEn : atk.counterplay}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 核心打寶價值與掉落亮點 */}
          <div className="rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-bold font-diablo text-d2-gold">
              <Trophy className="w-4 h-4 text-d2-gold" />
              <span>{isEn ? 'High-Value Loot & Farming Holy Grounds' : '打寶提款聖地與核心畢業產出'}</span>
            </div>

            <ul className="space-y-2 text-xs text-sanctuary-300">
              {(isEn ? currentBoss.farmingValueEn : currentBoss.farmingValue).map((val, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                  <Sparkles className="w-3.5 h-3.5 text-d2-gold shrink-0 mt-0.5" />
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 實戰權威總結 */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sanctuary-900/80 to-sanctuary-950 border border-sanctuary-800 text-xs text-sanctuary-300 leading-relaxed font-mono space-y-1">
            <div className="text-d2-fire font-bold text-xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-d2-fire" />
              <span>{isEn ? 'Master Tactician Summary:' : '資深老將實戰戰術評析：'}</span>
            </div>
            <p className="text-[11px] text-sanctuary-200 leading-relaxed">
              {isEn ? currentBoss.tacticalTipEn : currentBoss.tacticalTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
