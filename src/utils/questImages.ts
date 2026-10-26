/**
 * 任務寶典圖像與守護首領解析模組 (Quest Visual Assets Resolver)
 * 提供 Act 1 - Act 5 全部 27 個任務與 4 大終局世界事件的官方原版美術立繪與關鍵道具路徑。
 */

export interface QuestVisualInfo {
  image: string;
  subjectZh: string;
  subjectEn: string;
  isBoss?: boolean;
}

const QUEST_VISUAL_MAP: Record<string, QuestVisualInfo> = {
  // ── ACT 1 ──
  act1_q1: {
    image: 'images/monsters/zombie.png',
    subjectZh: '殭屍與屍火',
    subjectEn: 'Zombies & Corpsefire',
  },
  act1_q2: {
    image: 'images/monsters/bloodraven.webp',
    subjectZh: '血鴉 (墮落俠盜)',
    subjectEn: 'Blood Raven',
    isBoss: true,
  },
  act1_q3: {
    image: 'images/monsters/griswold.webp',
    subjectZh: '格里斯瓦德 (崔斯特姆)',
    subjectEn: 'Griswold',
    isBoss: true,
  },
  act1_q4: {
    image: 'images/monsters/countess.webp',
    subjectZh: '女伯爵 (符文寶庫)',
    subjectEn: 'The Countess',
    isBoss: true,
  },
  act1_q5: {
    image: 'images/monsters/smith.gif',
    subjectZh: '鐵匠 (恰西的魔法槌)',
    subjectEn: 'The Smith',
    isBoss: true,
  },
  act1_q6: {
    image: 'images/monsters/andariel.webp',
    subjectZh: '安達莉爾 (苦痛女王)',
    subjectEn: 'Andariel',
    isBoss: true,
  },

  // ── ACT 2 ──
  act2_q1: {
    image: 'images/monsters/radament.png',
    subjectZh: '羅達門特 (木乃伊領主)',
    subjectEn: 'Radament',
    isBoss: true,
  },
  act2_q2: {
    image: 'images/items/props/horadric_cube.gif',
    subjectZh: '赫拉迪姆方塊與法杖',
    subjectEn: 'Horadric Cube & Staff',
  },
  act2_q3: {
    image: 'images/monsters/clawviper.gif',
    subjectZh: '利爪蝮蛇神殿',
    subjectEn: 'Claw Viper Temple',
  },
  act2_q4: {
    image: 'images/monsters/willowisp.gif',
    subjectZh: '秘法聖殿幽靈',
    subjectEn: 'Arcane Specters',
  },
  act2_q5: {
    image: 'images/monsters/summoner.webp',
    subjectZh: '召喚師 (赫拉森法師)',
    subjectEn: 'The Summoner',
    isBoss: true,
  },
  act2_q6: {
    image: 'images/monsters/duriel.webp',
    subjectZh: '都瑞爾 (痛苦之王)',
    subjectEn: 'Duriel',
    isBoss: true,
  },

  // ── ACT 3 ──
  act3_q1: {
    image: 'images/monsters/fetish.gif',
    subjectZh: '黃金鳥 (海法斯巫師)',
    subjectEn: 'The Golden Bird',
  },
  act3_q2: {
    image: 'images/monsters/fetish.gif',
    subjectZh: '吉得賓匕首守護者',
    subjectEn: 'The Gidbinn Guardian',
  },
  act3_q3: {
    image: 'images/monsters/succubus.webp',
    subjectZh: '藍伊森之書 (殘破神殿)',
    subjectEn: "Lam Esen's Tome",
  },
  act3_q4: {
    image: 'images/monsters/councilmember.gif',
    subjectZh: '克林姆的連枷與遺願',
    subjectEn: "Khalim's Will",
  },
  act3_q5: {
    image: 'images/monsters/councilmember.gif',
    subjectZh: '崔凡克瘸子最高議會',
    subjectEn: 'High Council of Travincal',
    isBoss: true,
  },
  act3_q6: {
    image: 'images/monsters/mephisto.webp',
    subjectZh: '墨菲斯托 (憎恨之王)',
    subjectEn: 'Mephisto',
    isBoss: true,
  },

  // ── ACT 4 ──
  act4_q1: {
    image: 'images/monsters/izual.webp',
    subjectZh: '墮落大天使 伊卒爾',
    subjectEn: 'Izual (Fallen Angel)',
    isBoss: true,
  },
  act4_q2: {
    image: 'images/monsters/hephasto.webp',
    subjectZh: '海法斯特 (地獄熔爐鐵匠)',
    subjectEn: 'Hephasto the Armorer',
    isBoss: true,
  },
  act4_q3: {
    image: 'images/monsters/diablo.webp',
    subjectZh: '迪亞布羅 (恐懼之王)',
    subjectEn: 'Diablo (Lord of Terror)',
    isBoss: true,
  },

  // ── ACT 5 ──
  act5_q1: {
    image: 'images/monsters/shenk.webp',
    subjectZh: '督軍 山克 (圍城投石車)',
    subjectEn: 'Shenk the Overseer',
    isBoss: true,
  },
  act5_q2: {
    image: 'images/monsters/overseer.webp',
    subjectZh: '亞瑞特高地野蠻人戰俘',
    subjectEn: 'Mount Arreat Captives',
  },
  act5_q3: {
    image: 'images/monsters/blunderbore.webp',
    subjectZh: '冰霜女魔與安亞 (冰凍囚牢)',
    subjectEn: 'Frozen Anya & Yeti',
  },
  act5_q4: {
    image: 'images/monsters/nihlathakboss.webp',
    subjectZh: '尼拉塞克 (沃特之廳屍爆)',
    subjectEn: 'Nihlathak',
    isBoss: true,
  },
  act5_q5: {
    image: 'images/monsters/colossal1.gif',
    subjectZh: '遠古人三大野蠻人祖靈',
    subjectEn: 'The Ancients (Talic/Madawc/Korlic)',
    isBoss: true,
  },
  act5_q6: {
    image: 'images/monsters/baal.webp',
    subjectZh: '巴爾 (毀滅之王)',
    subjectEn: 'Baal (Lord of Destruction)',
    isBoss: true,
  },
};

const WORLD_EVENT_VISUAL_MAP: Record<string, QuestVisualInfo> = {
  secret_cow_level: {
    image: 'images/monsters/bovine.webp',
    subjectZh: '地獄母牛與母牛王',
    subjectEn: 'The Secret Cow Level (Hell Bovine)',
    isBoss: true,
  },
  uber_tristram: {
    image: 'images/items/charms/torch.jpg',
    subjectZh: '紅門六王與地獄火炬',
    subjectEn: 'Pandemonium Event & Hellfire Torch',
    isBoss: true,
  },
  diablo_clone: {
    image: 'images/monsters/diabloclone.webp',
    subjectZh: '地表暗黑破壞神 (喬丹祭儀)',
    subjectEn: 'Diablo Clone (Stone of Jordan)',
    isBoss: true,
  },
  terror_zones: {
    image: 'images/monsters/doomknight.webp',
    subjectZh: '邪惡威脅區域 (Terror Zones)',
    subjectEn: 'Terror Zones (TZ Dynamic Scaling)',
  },
};

/**
 * 取得任務的視覺圖像與首領資訊
 */
export function getQuestVisual(questId: string): QuestVisualInfo {
  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = env.endsWith('/') ? env : `${env}/`;

  const info = QUEST_VISUAL_MAP[questId];
  if (!info) {
    return {
      image: `${baseUrl}images/monsters/demon.webp`,
      subjectZh: '任務目標',
      subjectEn: 'Quest Objective',
    };
  }

  return {
    ...info,
    image: `${baseUrl}${info.image}`,
  };
}

/**
 * 取得世界事件的視覺圖像
 */
export function getWorldEventVisual(eventId: string): QuestVisualInfo {
  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = env.endsWith('/') ? env : `${env}/`;

  const info = WORLD_EVENT_VISUAL_MAP[eventId];
  if (!info) {
    return {
      image: `${baseUrl}images/monsters/demon.webp`,
      subjectZh: '世界事件',
      subjectEn: 'World Event',
    };
  }

  return {
    ...info,
    image: `${baseUrl}${info.image}`,
  };
}
