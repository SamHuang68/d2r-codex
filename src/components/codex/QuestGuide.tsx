import React, { useState, useMemo } from 'react';
import { QUESTS_DATA, WORLD_EVENTS_DATA, QuestData, WorldEventData } from '../../data/quests';
import { QUESTS_EN, WORLD_EVENTS_EN } from '../../data/questsEn';
import { actZh } from '../../utils/actLabel';
import { useLanguage } from '../../context/LanguageContext';
import { getQuestVisual, getWorldEventVisual } from '../../utils/questImages';
import { 
  MapPin, 
  Sparkles, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  Globe, 
  Skull,
  Search,
  BookOpen,
  Flame
} from 'lucide-react';
import { GameIcon } from '../common/GameIcons';

export const QuestGuide: React.FC = () => {
  const { isEn } = useLanguage();
  const [selectedAct, setSelectedAct] = useState<number | 'events'>(1);
  const [filterPermanentOnly, setFilterPermanentOnly] = useState<boolean>(false);
  const [filterMandatoryOnly, setFilterMandatoryOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>("act1_q1");

  // 篩選當前章節任務
  const currentQuests = useMemo(() => {
    if (selectedAct === 'events') return [];
    return QUESTS_DATA.filter((q: QuestData) => {
      if (q.act !== selectedAct) return false;
      if (filterPermanentOnly && !q.permanentReward) return false;
      if (filterMandatoryOnly && !q.isMandatory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = q.name.toLowerCase().includes(query) || q.nameEn.toLowerCase().includes(query);
        const matchLoc = q.location.toLowerCase().includes(query);
        const matchTips = q.tacticalTips.toLowerCase().includes(query);
        const matchReward = q.permanentReward?.description.toLowerCase().includes(query);
        if (!matchName && !matchLoc && !matchTips && !matchReward) return false;
      }
      return true;
    });
  }, [selectedAct, filterPermanentOnly, filterMandatoryOnly, searchQuery]);

  // 永久獎勵圖示與顏色
  const getRewardBadge = (reward?: QuestData['permanentReward'], questId?: string) => {
    if (!reward) return null;
    const val = (isEn && questId && QUESTS_EN[questId]?.rewardValue) ? QUESTS_EN[questId].rewardValue : reward.value;
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-d2-gold/15 border border-d2-gold/40 text-d2-gold font-mono text-xs font-bold shadow-sm shadow-d2-gold/10">
        <Award className="w-3.5 h-3.5 text-d2-gold shrink-0" />
        <span>{isEn ? "Permanent: " : "永久獎勵: "}{val}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 標題與簡介 */}
      <div className="border-b border-sanctuary-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-d2-gold text-xs font-mono tracking-widest uppercase">
            <GameIcon name="scroll" className="w-4 h-4 text-d2-gold animate-pulse" />
            Complete Questline & World Events Almanac
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            {isEn ? "All Acts Quest Guide & Endgame World Events" : "全章節任務寶典與終局世界事件"}
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-3xl">
            {isEn ? "Covers all 27 quests across Acts 1 to 5, permanent +12 Skill Points, +15 Stat Points, +60 Life, and +30 All Resistances rewards guide, with Secret Cow Level, Uber Tristram, Diablo Clone, and Terror Zones (TZ) walkthroughs." : "收錄 Act 1 至 Act 5 全部 27 個任務詳細步驟、永久 +12 技能點、+15 屬性點、+60 生命值與 +30 全抗性全獎勵攻略，附帶乳牛關、紅門六王、地表大菠蘿與邪惡威脅區域 TZ 指南。"}
          </p>
        </div>

        {/* 永久獎勵總覽迷你看板 */}
        <div className="bg-sanctuary-900/90 border border-sanctuary-800 p-3 rounded-2xl flex items-center gap-3 shrink-0 text-xs font-mono shadow-lg">
          <div className="text-center px-2 border-r border-sanctuary-800">
            <div className="text-sanctuary-500 text-[10px]">{isEn ? "Skill Pts" : "技能點"}</div>
            <div className="text-d2-gold font-bold text-base">{isEn ? "+12 Pts" : "+12 點"}</div>
          </div>
          <div className="text-center px-2 border-r border-sanctuary-800">
            <div className="text-sanctuary-500 text-[10px]">{isEn ? "Stat Pts" : "屬性點"}</div>
            <div className="text-amber-300 font-bold text-base">{isEn ? "+15 Pts" : "+15 點"}</div>
          </div>
          <div className="text-center px-2 border-r border-sanctuary-800">
            <div className="text-sanctuary-500 text-[10px]">{isEn ? "Max Life" : "最大生命"}</div>
            <div className="text-d2-blood font-bold text-base">{isEn ? "+60 Life" : "+60 血"}</div>
          </div>
          <div className="text-center px-2">
            <div className="text-sanctuary-500 text-[10px]">{isEn ? "All Res" : "永久全抗"}</div>
            <div className="text-sky-300 font-bold text-base">{isEn ? "+30% Res" : "+30% 抗"}</div>
          </div>
        </div>
      </div>

      {/* 章節切換列 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[1, 2, 3, 4, 5].map((actNum) => (
          <button
            key={actNum}
            onClick={() => {
              setSelectedAct(actNum);
              setSearchQuery("");
            }}
            className={`px-5 py-2.5 rounded-xl font-diablo font-bold text-sm transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
              selectedAct === actNum
                ? 'bg-sanctuary-800 border-d2-gold text-d2-gold shadow-lg shadow-d2-gold/15'
                : 'bg-sanctuary-900/60 border-sanctuary-800 text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-850'
            }`}
          >
            <MapPin className="w-4 h-4" />
            {(isEn ? `Act ${actNum}` : actZh(actNum))} {actNum === 1 ? (isEn ? "(Rogue Encampment)" : "(俠盜營地)") : actNum === 2 ? (isEn ? "(Lut Gholein)" : "(魯高因)") : actNum === 3 ? (isEn ? "(Kurast Docks)" : "(庫拉斯特港口)") : actNum === 4 ? (isEn ? "(Pandemonium Fortress)" : "(混沌界要塞)") : (isEn ? "(Harrogath)" : "(哈洛加斯)")}
          </button>
        ))}

        {/* 世界事件專屬按鈕 */}
        <button
          onClick={() => setSelectedAct('events')}
          className={`px-5 py-2.5 rounded-xl font-diablo font-bold text-sm transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
            selectedAct === 'events'
              ? 'bg-d2-blood text-white border-red-500 shadow-lg shadow-d2-blood/30'
              : 'bg-sanctuary-900/60 border-sanctuary-800 text-red-400 hover:text-red-300 hover:bg-sanctuary-850'
          }`}
        >
          <Globe className="w-4 h-4" />
          {isEn ? "Endgame Events & Secret Levels" : "終局世界事件與隱藏關卡"}
        </button>
      </div>

      {/* ── 任務模式 (Act 1 - Act 5) ── */}
      {selectedAct !== 'events' ? (
        <div className="space-y-6">
          {/* 篩選控制器 */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterPermanentOnly(!filterPermanentOnly)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all border flex items-center gap-1.5 cursor-pointer ${
                  filterPermanentOnly
                    ? 'bg-d2-gold/20 border-d2-gold text-d2-gold font-bold'
                    : 'bg-sanctuary-900 border-sanctuary-800 text-sanctuary-400 hover:text-sanctuary-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                {isEn ? "Permanent Rewards Only" : "僅顯示「永久屬性/技能獎勵」任務"}
              </button>

              <button
                onClick={() => setFilterMandatoryOnly(!filterMandatoryOnly)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all border flex items-center gap-1.5 cursor-pointer ${
                  filterMandatoryOnly
                    ? 'bg-sanctuary-800 border-sanctuary-600 text-sanctuary-100 font-bold'
                    : 'bg-sanctuary-900 border-sanctuary-800 text-sanctuary-400 hover:text-sanctuary-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isEn ? "Mandatory Only" : "僅主線必解"}
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sanctuary-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search quest name, location or reward..." : "搜尋任務名稱、地點或獎勵..."}
                className="w-full bg-sanctuary-900 border border-sanctuary-800 rounded-xl pl-9 pr-4 py-2 text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-gold transition-colors"
              />
            </div>
          </div>

          {/* 任務列表 */}
          <div className="space-y-4">
            {currentQuests.map((quest) => {
              const isExpanded = expandedQuestId === quest.id;
              const visual = getQuestVisual(quest.id);

              return (
                <div
                  key={quest.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    quest.permanentReward
                      ? 'bg-sanctuary-900/80 border-d2-gold/30 hover:border-d2-gold/60'
                      : 'bg-sanctuary-900/60 border-sanctuary-800 hover:border-sanctuary-700'
                  }`}
                >
                  {/* 折疊標題列 */}
                  <div
                    onClick={() => setExpandedQuestId(isExpanded ? null : quest.id)}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Quest Number Badge */}
                      <div className="w-9 h-9 rounded-xl bg-sanctuary-800 border border-sanctuary-700 text-d2-gold font-diablo font-bold flex items-center justify-center shrink-0 shadow-inner text-base">
                        {quest.questNumber}
                      </div>

                      {/* Quest Avatar Portrait Thumbnail */}
                      <div className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border ${visual.isBoss ? 'border-d2-gold/60 shadow-[0_0_10px_rgba(200,165,100,0.25)]' : 'border-sanctuary-700/80'} bg-sanctuary-950 flex items-center justify-center`}>
                        <img
                          src={visual.image}
                          alt={isEn ? visual.subjectEn : visual.subjectZh}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        {visual.isBoss && (
                          <div className="absolute inset-0 border border-d2-gold/30 rounded-xl pointer-events-none" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-diablo font-bold text-lg text-sanctuary-100 group-hover:text-d2-gold transition-colors">
                            {isEn ? `Quest ${quest.questNumber}: ${quest.nameEn}` : `任務 ${quest.questNumber}: ${quest.name}`}
                          </h3>
                          {!isEn && (
                            <span className="text-xs font-mono text-sanctuary-400">
                              ({quest.nameEn})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-sanctuary-400 mt-0.5 flex-wrap">
                          <span>{isEn ? "Given By: " : "委託: "}{isEn ? (QUESTS_EN[quest.id]?.givenBy || quest.givenBy) : quest.givenBy}</span>
                          <span>·</span>
                          <span className="text-sanctuary-300">{isEn ? "Location: " : "地點: "}{isEn ? (QUESTS_EN[quest.id]?.location || quest.location) : quest.location}</span>
                          <span>·</span>
                          <span className={quest.isMandatory ? "text-amber-400 font-bold" : "text-sanctuary-500"}>
                            {quest.isMandatory ? (isEn ? "Mandatory" : "主線必解") : (isEn ? "Optional" : "支線可選")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {getRewardBadge(quest.permanentReward, quest.id)}
                      <ChevronRight className={`w-5 h-5 text-sanctuary-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* 展開詳情 */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-sanctuary-800/80 space-y-4 text-xs animate-fade-in bg-sanctuary-950/40">
                      {/* Quest Visual Identity Showcase Header */}
                      <div className="p-3.5 sm:p-4 rounded-xl border border-sanctuary-800/90 bg-gradient-to-r from-sanctuary-900/90 via-sanctuary-900/60 to-sanctuary-950/90 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border ${visual.isBoss ? 'border-d2-gold/60 shadow-[0_0_15px_rgba(200,165,100,0.25)]' : 'border-sanctuary-700/80'} bg-sanctuary-950 flex items-center justify-center`}>
                          <img
                            src={visual.image}
                            alt={isEn ? visual.subjectEn : visual.subjectZh}
                            className="w-full h-full object-cover object-top"
                          />
                          {visual.isBoss && (
                            <div className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-d2-gold/90 text-sanctuary-950 text-[9px] font-bold font-mono tracking-wider shadow">
                              BOSS
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base sm:text-lg font-bold text-sanctuary-100">
                              {isEn ? visual.subjectEn : visual.subjectZh}
                            </h4>
                            {!isEn && (
                              <span className="text-xs font-mono text-sanctuary-400">
                                {visual.subjectEn}
                              </span>
                            )}
                            {visual.isBoss && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-d2-gold/20 text-d2-gold border border-d2-gold/40 font-semibold flex items-center gap-1">
                                <Flame className="w-3 h-3 text-d2-fire" />
                                {isEn ? 'Key Objective / Boss' : '關鍵首領 / 目標'}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                            <span className="px-2 py-0.5 rounded bg-sanctuary-800/90 text-sanctuary-200 border border-sanctuary-700/60">
                              {isEn ? `Act ${quest.act}` : `第 ${quest.act} 章`}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-sanctuary-800/90 text-sanctuary-300 border border-sanctuary-700/60">
                              {isEn ? (QUESTS_EN[quest.id]?.location || quest.location) : quest.location}
                            </span>
                            <span className={`px-2 py-0.5 rounded border ${quest.isMandatory ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold' : 'bg-sanctuary-950 border-sanctuary-850 text-sanctuary-400'}`}>
                              {quest.isMandatory ? (isEn ? 'Mandatory Story' : '主線必解') : (isEn ? 'Optional Quest' : '支線可選')}
                            </span>
                          </div>

                          {quest.permanentReward && (
                            <div className="text-xs text-d2-gold font-mono font-medium pt-0.5">
                              ★ {isEn ? "Permanent Reward: " : "永久通關獎勵："}
                              <span className="font-bold underline">
                                {isEn ? (QUESTS_EN[quest.id]?.rewardDesc || quest.permanentReward.description) : quest.permanentReward.description}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 任務摘要 */}
                      <p className="text-sanctuary-200 leading-relaxed font-sans text-sm">
                        {isEn ? (QUESTS_EN[quest.id]?.summary || quest.summary) : quest.summary}
                      </p>

                      {/* 通關步驟 */}
                      <div className="bg-sanctuary-950/70 p-4 rounded-xl border border-sanctuary-800/80 space-y-2">
                        <div className="font-mono text-xs font-bold text-sanctuary-100 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-d2-gold" />
                          {isEn ? "Walkthrough:" : "通關指引流程:"}
                        </div>
                        <ul className="space-y-1.5 font-sans text-sanctuary-300 pl-4 list-decimal">
                          {(isEn ? (QUESTS_EN[quest.id]?.walkthrough || quest.walkthrough) : quest.walkthrough).map((step, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 戰術圖說與避坑指南 */}
                      <div className="bg-sanctuary-950/90 p-4 rounded-xl border border-sanctuary-800 space-y-1.5">
                        <div className="flex items-center gap-1 text-xs font-mono text-d2-gold font-bold">
                          <Zap className="w-3.5 h-3.5 text-d2-gold" />
                          {isEn ? "Pro Tactical Guide & Tips" : "專家戰術圖說與速通要點"}
                        </div>
                        <p className="text-sanctuary-300 leading-relaxed text-xs">
                          {isEn ? (QUESTS_EN[quest.id]?.tacticalTips || quest.tacticalTips) : quest.tacticalTips}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── 世界事件與隱藏關卡模式 ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WORLD_EVENTS_DATA.map((evt: WorldEventData) => {
            const evtVisual = getWorldEventVisual(evt.id);

            return (
              <div
                key={evt.id}
                className="bg-sanctuary-900/80 border border-sanctuary-800 hover:border-red-500/50 rounded-2xl p-6 space-y-4 shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Event Visual Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-sanctuary-800 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 border-red-500/40 bg-sanctuary-950 shadow-md">
                        <img
                          src={evtVisual.image}
                          alt={isEn ? evtVisual.subjectEn : evtVisual.subjectZh}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Skull className="w-4 h-4 text-d2-blood" />
                          <h3 className="text-xl font-diablo font-bold text-sanctuary-100">
                            {isEn ? evt.nameEn : evt.name}
                          </h3>
                        </div>
                        {!isEn && (
                          <div className="text-xs font-mono text-sanctuary-400 mt-0.5">
                            {evt.nameEn}
                          </div>
                        )}
                        <div className="text-[11px] font-mono text-d2-gold mt-0.5">
                          {isEn ? evtVisual.subjectEn : evtVisual.subjectZh}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-mono text-sanctuary-400 font-bold block mb-1">{isEn ? "Trigger Conditions:" : "觸發條件與開啟方式:"}</span>
                      <div className="bg-sanctuary-950/80 p-2.5 rounded-xl border border-sanctuary-800 text-sanctuary-200 font-sans leading-relaxed">
                        {isEn ? (WORLD_EVENTS_EN[evt.id]?.trigger || evt.triggerCondition) : evt.triggerCondition}
                      </div>
                    </div>

                    <div>
                      <span className="font-mono text-sanctuary-400 font-bold block mb-1">{isEn ? "Location:" : "發生地點:"}</span>
                      <span className="text-d2-gold font-mono">{isEn ? (WORLD_EVENTS_EN[evt.id]?.location || evt.location) : evt.location}</span>
                    </div>

                    {/* ── 專屬戰術圖解 (Visual Illustrated Schematics) ── */}
                    {evt.id === 'diablo_clone' && (
                      <div className="bg-sanctuary-950 p-3.5 rounded-xl border border-d2-fire/30 space-y-2">
                        <div className="text-[11px] font-mono text-d2-fire font-bold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          {isEn ? "Diablo Clone 6-Stage Progress & PMH Mechanics" : "地表暗黑 6 階段進度條與 PMH 封鎖機制圖說"}
                        </div>
                        <div className="grid grid-cols-6 gap-1 text-[10px] font-mono text-center">
                          <div className="p-1 rounded bg-sanctuary-900 border border-sanctuary-800 text-sanctuary-400">{isEn ? 'St. 1' : '階 1'}<br/>{isEn ? 'Terror' : '恐怖'}</div>
                          <div className="p-1 rounded bg-sanctuary-900 border border-sanctuary-800 text-sanctuary-400">{isEn ? 'St. 2' : '階 2'}<br/>{isEn ? 'Gathers' : '聚集'}</div>
                          <div className="p-1 rounded bg-sanctuary-900 border border-sanctuary-800 text-sanctuary-400">{isEn ? 'St. 3' : '階 3'}<br/>{isEn ? 'Grows' : '壯大'}</div>
                          <div className="p-1 rounded bg-sanctuary-900 border border-sanctuary-800 text-amber-500">{isEn ? 'St. 4' : '階 4'}<br/>{isEn ? 'Nears' : '逼近'}</div>
                          <div className="p-1 rounded bg-sanctuary-900 border border-amber-600/50 text-amber-400 font-bold">{isEn ? 'St. 5' : '階 5'}<br/>{isEn ? 'Imminent' : '迫近'}</div>
                          <div className="p-1 rounded bg-d2-fire/20 border border-d2-fire text-d2-fire font-bold animate-pulse">{isEn ? 'St. 6' : '階 6'}<br/>{isEn ? 'Walks!' : '降臨！'}</div>
                        </div>
                        <p className="text-[11px] text-sanctuary-300 font-sans leading-snug">
                          {isEn 
                            ? "⚠️ Mandatory PMH Rule: Diablo Clone regenerates thousands of HP per second. Your character MUST land 1 hit with Prevent Monster Heal gear (lasts 80 mins); mercenary hits do NOT apply PMH!"
                            : "⚠️ 回血封鎖鐵律：暗黑克隆體擁有極其恐怖的每秒千點回血。必須由角色本體使用附帶「防止怪物自療 (PMH)」的武器擊中 1 次（持續 80 分鐘）；傭兵攻擊無法觸發 PMH！"}
                        </p>
                      </div>
                    )}

                    {evt.id === 'uber_tristram' && (
                      <div className="bg-sanctuary-950 p-3.5 rounded-xl border border-d2-gold/30 space-y-2">
                        <div className="text-[11px] font-mono text-d2-gold font-bold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          {isEn ? "Key-to-Torch Pipeline Overview" : "六王全流程管線圖說 (Key-to-Torch Pipeline)"}
                        </div>
                        <div className="p-2 rounded-lg bg-sanctuary-900/80 border border-sanctuary-800 text-[11px] font-mono text-sanctuary-200 leading-relaxed text-center">
                          {isEn ? "9 Keys (3 of each) ➔ 3 Mini Red Portals ➔ 3 Organs ➔ Uber Tristram ➔ Hellfire Torch" : "9把鑰匙 (3恐+3憎+3毀) ➔ 開啟 3 小紅門 ➔ 擊殺莉莉絲等斬獲 3 大器官 ➔ 終極崔斯特姆 ➔ 斬獲【地獄火炬】"}
                        </div>
                        <p className="text-[11px] text-sanctuary-300 font-sans leading-snug">
                          {isEn
                            ? "🛡️ Tactical Pulling: From town entrance, hug the lower left ruins to lure Mephisto into the corner alone. Never rush middle, or Baal and Mephisto together will wipe you out instantly!"
                            : "🛡️ 走位拉怪圖解：從城鎮入口出發，務必緊貼左側斷壁殘垣下緣潛行，將「墨菲斯托」單獨引至地圖左下角秒殺；切勿徑直衝入中央廣場，否則巴爾與墨菲斯托雙王聯手會瞬間秒殺全隊！"}
                        </p>
                      </div>
                    )}

                    {evt.id === 'secret_cow_level' && (
                      <div className="bg-sanctuary-950 p-3.5 rounded-xl border border-d2-set/30 space-y-2">
                        <div className="text-[11px] font-mono text-d2-set font-bold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          {isEn ? "Secret Cow Level Cube Recipe" : "乳牛關合成與刷寶機制圖解"}
                        </div>
                        <div className="p-2 rounded-lg bg-sanctuary-900/80 border border-sanctuary-800 text-[11px] font-mono text-sanctuary-200 leading-relaxed text-center">
                          {isEn ? "Wirt's Leg (Tristram NW) + Tome of Town Portal (20 Scrolls) into Cube ➔ Red Portal" : "【維特的腿】(亂石曠野崔斯特姆左上) + 【滿20張回城書】放入方塊 ➔ 鮮紅母牛傳送門"}
                        </div>
                        <p className="text-[11px] text-sanctuary-300 font-sans leading-snug">
                          {isEn
                            ? "🐮 D2R Modern Rule: The ancient penalty for slaying the Cow King is removed! You can kill the Cow King every run without fear of losing portal access."
                            : "🐮 D2R 現代化版本規則：已徹底移除「擊殺牛王永久無法再開門」的古老詛咒！現在可以毫無顧忌全力擊殺牛王 (Cow King)，隨意反覆開門刷取白裝、無形神級底材與符文！"}
                        </p>
                      </div>
                    )}

                    {evt.id === 'terror_zones' && (
                      <div className="bg-sanctuary-950 p-3.5 rounded-xl border border-d2-fire/30 space-y-2">
                        <div className="text-[11px] font-mono text-d2-fire font-bold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          {isEn ? "Terror Zones Dynamic Scaling Model" : "邪惡威脅區域動態等級運算模型"}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                          <div className="p-1.5 rounded bg-sanctuary-900 border border-sanctuary-800">
                            <span className="text-sanctuary-400">{isEn ? "Regular" : "一般怪物"}</span><br/>
                            <strong className="text-sanctuary-100 text-xs">{isEn ? "Host Lv + 2" : "房主 Lv + 2"}</strong>
                          </div>
                          <div className="p-1.5 rounded bg-sanctuary-900 border border-sanctuary-800">
                            <span className="text-sanctuary-400">{isEn ? "Champions" : "精英怪"}</span><br/>
                            <strong className="text-d2-magic text-xs">{isEn ? "Host Lv + 4" : "房主 Lv + 4"}</strong>
                          </div>
                          <div className="p-1.5 rounded bg-sanctuary-900 border border-sanctuary-800">
                            <span className="text-sanctuary-400">{isEn ? "Uniques / Bosses" : "暗金怪/首領"}</span><br/>
                            <strong className="text-d2-gold text-xs">{isEn ? "Host Lv + 5 (Max 99)" : "房主 Lv + 5 (上限99)"}</strong>
                          </div>
                        </div>
                        <p className="text-[11px] text-sanctuary-300 font-sans leading-snug">
                          ⚡ <strong>破免板專屬產地</strong>：地獄 TZ 內所有精英怪與暗金怪均有機率掉落六大「破免咒符 (Sunder Charms)」，將怪物免疫直接壓至 95%，是法系流派終局通關聖地。
                        </p>
                      </div>
                    )}

                    <div>
                      <span className="font-mono text-sanctuary-400 font-bold block mb-1">
                        {isEn ? "Exclusive Rewards:" : "專屬神級獎勵:"}
                      </span>
                      <ul className="space-y-1">
                        {evt.keyRewards.map((r, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-d2-unique font-mono">
                            <Sparkles className="w-3.5 h-3.5 shrink-0 text-d2-unique" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-sanctuary-950/90 p-3 rounded-xl border border-sanctuary-800 space-y-1">
                      <div className="font-mono text-[11px] text-d2-fire font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-d2-fire" />
                        {isEn ? "Strategy & Guide:" : "實戰攻略指南:"}
                      </div>
                      <p className="text-sanctuary-300 leading-relaxed text-[11px]">
                        {evt.guide}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
