export interface UberStep {
  step: number;
  title: string;
  requirements: string[];
  boss: string;
  rewards: string;
  strategy: string;
}

export const UBER_TRISTRAM_GUIDE = {
  overview: "【超級崔斯特姆 (Uber Tristram)】是《暗黑破壞神 II：獄火重生》中最具挑戰性的終極 PVE 事件，是獲取終極護身符【地獄火炬 (Hellfire Torch)】的唯一途徑。",
  steps: [
    {
      step: 1,
      title: "第一階段：收集九把鑰匙 (Key Farming)",
      requirements: [
        "3x 恐懼之鑰 (Key of Terror) - 第一幕女伯爵 (The Countess) 掉落",
        "3x 憎恨之鑰 (Key of Hate) - 第二幕神秘避難所召喚者 (The Summoner) 掉落",
        "3x 毀滅之鑰 (Key of Destruction) - 第五幕瓦特之廳尼拉塞克 (Nihlathak) 掉落"
      ],
      boss: "女伯爵、召喚者、尼拉塞克 (平均掉率約 1/14)",
      rewards: "總計湊齊 3 套 3 色鑰匙 (共 9 把)",
      strategy: "打尼拉塞克時務必佩戴【自然的和平 (Nature's Peace)】戒指提供「殺怪後安息」，防止其施展極度致命的連環屍體爆炸。"
    },
    {
      step: 2,
      title: "第二階段：開啟三色小紅門 (Three Mini-Ubers)",
      requirements: [
        "在地獄難度第 5 章城鎮 (哈洛加斯) 站不同位置，每次放入 1 組 (恐懼+憎恨+毀滅) 鑰匙於方塊中轉化",
        "務必在「同一個遊戲房間」中分開開啟全部 3 道紅門，避免開啟重複門！"
      ],
      boss: "莉莉絲 (Lilith)、超級督瑞爾 (Uber Duriel)、超級衣卒爾 (Uber Izual)",
      rewards: "迪亞布羅的角、巴爾的眼睛、墨菲斯托的大腦 (三大器官)",
      strategy: "【莉莉絲】毒素傷害極為恐怖，建議喝解毒藥水將毒抗上限撐至 85%+；【衣卒爾】周圍充斥遺忘騎士與厄運騎士，切記先清小怪避免被衰老圍毆。"
    },
    {
      step: 3,
      title: "第三階段：決戰超級崔斯特姆 (Uber Tristram)",
      requirements: [
        "將【迪亞布羅的角 + 巴爾的眼睛 + 墨菲斯托的大腦】三器官放入方塊轉化",
        "開啟通往深紅色的【超級崔斯特姆】傳送門"
      ],
      boss: "超級墨菲斯托 (Mephisto)、超級巴爾 (Baal)、超級暗黑破壞神 (Diablo)",
      rewards: "【地獄火炬】大型護身符 (+3 隨機職業技能 / +10-20 全屬性 / +10-20 全抗性) + 英雄旗幟 (Standard of Heroes)",
      strategy: "【最重要法則】：絕對不要一次性驚動三大魔神！進門後貼著地圖下緣緩步繞圈，將【超級墨菲斯托】單獨引誘出來先行單挑擊殺，再處理巴爾與大菠蘿。"
    }
  ],
  smiterRules: [
    {
      name: "100% 絕對命中的盾擊 (Smite)",
      desc: "盾擊無視防禦力與怪物命中率判定，必中目標，是攻克高防禦 Boss 的基石。"
    },
    {
      name: "壓碎打擊 (Crushing Blow 50%+)",
      desc: "吉永之臉 (35%) + 蝕肉騎士 (15%) + 悔恨，每下一擊直接削去 Boss 當前 1/8 生命百分比。"
    },
    {
      name: "撕裂傷口 (Open Wounds 10%+)",
      desc: "三大魔神回血速度每秒數千點，撕裂傷口能阻止其自然回血 8 秒，不可或缺。"
    },
    {
      name: "偷取生命詛咒 (Life Tap 核心保命)",
      desc: "普通吸血 (LL) 在超級魔神身上無效！必須仰賴【卓古拉之握】手套或副手【聚氣偷取生命魔杖】，命中即觸發 50% 物理傷害轉化為生命，刀刀瞬間吸滿血。"
    },
    {
      name: "超級墨菲斯托 20 級審判靈氣抵抗",
      desc: "老墨審判直接扣除全隊 125% 全抗！角色地獄抗性必須達到「300% 總抗性」或者開啟高等級【救贖靈氣 (Conviction)】將老墨的審判覆蓋中和。"
    }
  ],
  dcloneGuide: {
    title: "超級暗黑破壞神 (Diablo Clone - 毀滅小護身符 Annihilus)",
    mechanics: "在天梯或單機模式中，當全伺服器/本機累積售出一定數量【喬丹之石 (Stone of Jordan)】給商人時，螢幕將震動並跳出「暗黑破壞神逼近庇護之地 (Diablo Walks the Earth)」。",
    spawnRule: "大菠蘿會立即替換玩家在該房間內遇到的第一隻固定暗金怪 (Superunique)，最常見是在石塊曠野的【拉卡尼休】、鮮血荒地的【屍體發火】或安亞紅門的【暴躁外皮】。",
    dropReward: "擊殺超級暗黑破壞神 100% 掉落未鑑定的【毀滅小護身符 (Annihilus / 毀符)】：+1 所有技能、+10-20 所有屬性、+10-20 所有抗性、+5-10% 額外經驗值。"
  }
};
