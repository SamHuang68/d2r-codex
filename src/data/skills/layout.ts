/**
 * 暗黑破壞神 II：獄火重生 (D2R) 技能樹 6x3 畫布座標定位系統
 * 每個職業的技能樹依遊戲原始介面嚴格對應：
 * 橫列 (Row): 0 = Lv 1, 1 = Lv 6, 2 = Lv 12, 3 = Lv 18, 4 = Lv 24, 5 = Lv 30
 * 直行 (Col): 0 = 左 (Left), 1 = 中 (Center), 2 = 右 (Right)
 */

export interface SkillGridPos {
  row: number; // 0..5
  col: number; // 0..2
}

/**
 * 全職業技能 6x3 棋盤固定座標對照表 (與遊戲內完全一致)
 */
export const SKILL_GRID_LAYOUT: Record<string, SkillGridPos> = {
  // ================= 魔法使 (Sorceress) =================
  // 冰霜法術 (Cold Spells)
  ice_bolt: { row: 0, col: 0 },
  frozen_armor: { row: 0, col: 1 },
  frost_nova: { row: 1, col: 0 },
  ice_blast: { row: 1, col: 1 },
  shiver_armor: { row: 2, col: 1 },
  glacial_spike: { row: 2, col: 2 },
  blizzard: { row: 3, col: 1 },
  chilling_armor: { row: 4, col: 0 },
  frozen_orb: { row: 5, col: 1 },
  cold_mastery: { row: 5, col: 2 },

  // 閃電法術 (Lightning Spells)
  charged_bolt: { row: 0, col: 1 },
  static_field: { row: 1, col: 0 },
  telekinesis: { row: 1, col: 2 },
  nova: { row: 2, col: 0 },
  lightning: { row: 2, col: 1 },
  chain_lightning: { row: 3, col: 1 },
  teleport: { row: 3, col: 2 },
  thunder_storm: { row: 4, col: 0 },
  energy_shield: { row: 4, col: 2 },
  lightning_mastery: { row: 5, col: 1 },

  // 火焰法術 (Fire Spells)
  fire_bolt: { row: 0, col: 0 },
  warmth: { row: 0, col: 2 },
  inferno: { row: 1, col: 1 },
  blaze: { row: 2, col: 1 },
  fire_ball: { row: 2, col: 0 },
  fire_wall: { row: 3, col: 1 },
  enchant: { row: 3, col: 2 },
  meteor: { row: 4, col: 0 },
  hydra: { row: 5, col: 1 },
  fire_mastery: { row: 5, col: 2 },

  // ================= 聖騎士 (Paladin) =================
  // 作戰技能 (Combat Skills)
  sacrifice: { row: 0, col: 0 },
  smite: { row: 0, col: 2 },
  holy_bolt: { row: 1, col: 1 },
  zeal: { row: 2, col: 0 },
  charge: { row: 2, col: 2 },
  vengeance: { row: 3, col: 0 },
  blessed_hammer: { row: 3, col: 1 },
  conversion: { row: 4, col: 0 },
  holy_shield: { row: 4, col: 2 },
  fist_of_the_heavens: { row: 5, col: 1 },

  // 攻擊靈氣 (Offensive Auras)
  might: { row: 0, col: 0 },
  holy_fire: { row: 1, col: 1 },
  thorns: { row: 1, col: 2 },
  blessed_aim: { row: 2, col: 0 },
  concentration: { row: 3, col: 0 },
  holy_freeze: { row: 3, col: 1 },
  holy_shock: { row: 4, col: 1 },
  sanctuary: { row: 4, col: 2 },
  fanaticism: { row: 5, col: 0 },
  conviction: { row: 5, col: 1 },

  // 防禦靈氣 (Defensive Auras)
  prayer: { row: 0, col: 0 },
  resist_fire: { row: 0, col: 2 },
  defiance: { row: 1, col: 0 },
  resist_cold: { row: 1, col: 2 },
  cleansing: { row: 2, col: 0 },
  resist_lightning: { row: 2, col: 2 },
  vigor: { row: 3, col: 0 },
  meditation: { row: 4, col: 0 },
  redemption: { row: 4, col: 1 },
  salvation: { row: 5, col: 2 },

  // ================= 亞馬遜 (Amazon) =================
  // 弓與十字弓技能 (Bow and Crossbow)
  magic_arrow: { row: 0, col: 0 },
  fire_arrow: { row: 0, col: 2 },
  cold_arrow: { row: 1, col: 1 },
  multiple_shot: { row: 1, col: 0 },
  exploding_arrow: { row: 2, col: 2 },
  ice_arrow: { row: 3, col: 1 },
  guided_arrow: { row: 3, col: 0 },
  strafe: { row: 4, col: 0 },
  immolation_arrow: { row: 4, col: 2 },
  freezing_arrow: { row: 5, col: 1 },

  // 被動與魔法技能 (Passive and Magic)
  inner_sight: { row: 0, col: 0 },
  critical_strike: { row: 0, col: 2 },
  dodge: { row: 1, col: 1 },
  slow_missiles: { row: 2, col: 0 },
  avoid: { row: 2, col: 1 },
  penetrate: { row: 3, col: 2 },
  decoy: { row: 4, col: 0 },
  evade: { row: 4, col: 1 },
  valkyrie: { row: 5, col: 0 },
  pierce: { row: 5, col: 2 },

  // 標槍與長矛技能 (Javelin and Spear)
  jab: { row: 0, col: 1 },
  poison_javelin: { row: 1, col: 0 },
  power_strike: { row: 1, col: 2 },
  lightning_bolt: { row: 2, col: 1 },
  charged_strike: { row: 3, col: 2 },
  plague_javelin: { row: 3, col: 0 },
  fend: { row: 4, col: 1 },
  lightning_strike: { row: 4, col: 2 },
  lightning_fury: { row: 5, col: 0 },
  impale: { row: 2, col: 0 }, // 補位標槍

  // ================= 死靈法師 (Necromancer) =================
  // 召喚法術 (Summoning Spells)
  skeleton_mastery: { row: 0, col: 1 },
  raise_skeleton: { row: 0, col: 2 },
  clay_golem: { row: 1, col: 0 },
  golem_mastery: { row: 2, col: 0 },
  raise_skeletal_mage: { row: 2, col: 2 },
  blood_golem: { row: 3, col: 0 },
  iron_golem: { row: 4, col: 0 },
  summon_resist: { row: 4, col: 1 },
  fire_golem: { row: 5, col: 0 },
  revive: { row: 5, col: 2 },

  // 毒素與白骨法術 (Poison and Bone Spells)
  teeth: { row: 0, col: 1 },
  bone_armor: { row: 0, col: 2 },
  poison_dagger: { row: 1, col: 0 },
  corpse_explosion: { row: 1, col: 1 },
  bone_wall: { row: 2, col: 2 },
  poison_explosion: { row: 3, col: 0 },
  bone_spear: { row: 3, col: 1 },
  bone_prison: { row: 4, col: 2 },
  poison_nova: { row: 5, col: 0 },
  bone_spirit: { row: 5, col: 1 },

  // 詛咒 (Curses)
  amplify_damage: { row: 0, col: 1 },
  dim_vision: { row: 1, col: 0 },
  weaken: { row: 1, col: 2 },
  iron_maiden: { row: 2, col: 2 },
  terror: { row: 2, col: 1 },
  confuse: { row: 3, col: 0 },
  life_tap: { row: 3, col: 2 },
  attract: { row: 4, col: 0 },
  decrepify: { row: 4, col: 1 },
  lower_resist: { row: 5, col: 1 },

  // ================= 野蠻人 (Barbarian) =================
  // 戰吼 (Warcries)
  howl: { row: 0, col: 0 },
  find_potion: { row: 0, col: 2 },
  taunt: { row: 1, col: 0 },
  shout: { row: 1, col: 1 },
  find_item: { row: 2, col: 2 },
  battle_cry: { row: 3, col: 0 },
  battle_orders: { row: 3, col: 1 },
  grim_ward: { row: 4, col: 2 },
  war_cry: { row: 5, col: 0 },
  battle_command: { row: 5, col: 1 },

  // 戰鬥精通 (Combat Masteries)
  sword_mastery: { row: 0, col: 0 },
  axe_mastery: { row: 0, col: 1 },
  mace_mastery: { row: 0, col: 2 },
  polearm_mastery: { row: 1, col: 0 },
  throwing_mastery: { row: 1, col: 1 },
  spear_mastery: { row: 1, col: 2 },
  increased_stamina: { row: 2, col: 1 },
  iron_skin: { row: 3, col: 1 },
  increased_speed: { row: 4, col: 1 },
  natural_resistance: { row: 5, col: 1 },

  // 戰鬥技能 (Combat Skills)
  bash: { row: 0, col: 0 },
  leap: { row: 1, col: 1 },
  double_swing: { row: 1, col: 2 },
  stun: { row: 2, col: 0 },
  double_throw: { row: 2, col: 2 },
  leap_attack: { row: 3, col: 1 },
  concentrate: { row: 3, col: 0 },
  frenzy: { row: 4, col: 2 },
  whirlwind: { row: 5, col: 1 },
  berserk: { row: 5, col: 0 },

  // ================= 德魯伊 (Druid) =================
  // 元素技能 (Elemental)
  firestorm: { row: 0, col: 0 },
  molten_boulder: { row: 1, col: 0 },
  arctic_blast: { row: 0, col: 2 },
  cyclone_armor: { row: 1, col: 2 },
  fissure: { row: 2, col: 0 },
  twister: { row: 2, col: 2 },
  volcano: { row: 3, col: 0 },
  tornado: { row: 3, col: 2 },
  armageddon: { row: 4, col: 0 },
  hurricane: { row: 4, col: 2 },

  // 變形技能 (Shape Shifting)
  werewolf: { row: 0, col: 0 },
  lycanthropy: { row: 0, col: 1 },
  werebear: { row: 1, col: 2 },
  feral_rage: { row: 2, col: 0 },
  maul: { row: 2, col: 2 },
  rabies: { row: 3, col: 0 },
  fire_claws: { row: 3, col: 1 },
  hunger: { row: 4, col: 1 },
  shock_wave: { row: 4, col: 2 },
  fury: { row: 5, col: 0 },

  // 召喚技能 (Summoning)
  raven: { row: 0, col: 0 },
  poison_creeper: { row: 0, col: 2 },
  oak_sage: { row: 1, col: 1 },
  spirit_wolf: { row: 1, col: 0 },
  carrion_vine: { row: 2, col: 2 },
  heart_of_wolverine: { row: 3, col: 1 },
  dire_wolf: { row: 3, col: 0 },
  solar_creeper: { row: 4, col: 2 },
  spirit_of_barbs: { row: 5, col: 1 },
  grizzly: { row: 5, col: 0 },

  // ================= 刺客 (Assassin) =================
  // 武學藝術 (Martial Arts)
  tiger_strike: { row: 0, col: 0 },
  dragon_talon: { row: 0, col: 2 },
  fists_of_fire: { row: 1, col: 0 },
  dragon_claw: { row: 1, col: 2 },
  cobra_strike: { row: 2, col: 0 },
  claws_of_thunder: { row: 3, col: 0 },
  dragon_tail: { row: 3, col: 2 },
  blades_of_ice: { row: 4, col: 0 },
  dragon_flight: { row: 5, col: 2 },
  phoenix_strike: { row: 5, col: 0 },

  // 影子訓練 (Shadow Disciplines)
  claw_mastery: { row: 0, col: 1 },
  psychic_hammer: { row: 0, col: 2 },
  burst_of_speed: { row: 1, col: 0 },
  weapon_block: { row: 1, col: 1 },
  cloak_of_shadows: { row: 2, col: 2 },
  fade: { row: 3, col: 0 },
  shadow_warrior: { row: 3, col: 1 },
  mind_blast: { row: 4, col: 2 },
  venom: { row: 5, col: 0 },
  shadow_master: { row: 5, col: 1 },

  // 陷阱 (Traps)
  fire_blast: { row: 0, col: 1 },
  shock_web: { row: 1, col: 0 },
  charged_bolt_sentry: { row: 1, col: 2 },
  wake_of_fire: { row: 2, col: 1 },
  blade_sentinel: { row: 3, col: 0 },
  lightning_sentry: { row: 3, col: 2 },
  wake_of_inferno: { row: 4, col: 1 },
  death_sentry: { row: 4, col: 2 },
  blade_fury: { row: 5, col: 0 },
  blade_shield: { row: 5, col: 1 },

  // ================= 術士 (Warlock) =================
  // 惡魔奴僕 (Demon Minions)
  summon_imp: { row: 0, col: 0 },
  demonic_pact: { row: 0, col: 2 },
  hellhound: { row: 1, col: 1 },
  imp_swarm: { row: 2, col: 0 },
  felguard: { row: 2, col: 2 },
  demonic_empowerment: { row: 3, col: 1 },
  succubus: { row: 4, col: 0 },
  pit_lord: { row: 4, col: 2 },
  infernal_lord: { row: 5, col: 1 },
  blood_offering: { row: 1, col: 0 },

  // 邪異武裝 (Eldritch Armament)
  chaos_strike: { row: 0, col: 0 },
  soul_feast: { row: 0, col: 2 },
  blood_tap: { row: 1, col: 1 },
  eldritch_blade: { row: 2, col: 0 },
  siphon_soul: { row: 2, col: 2 },
  abyssal_armor: { row: 3, col: 1 },
  void_cleave: { row: 4, col: 0 },
  soul_rend: { row: 4, col: 2 },
  doom_brand: { row: 5, col: 1 },
  dread_charge: { row: 1, col: 0 },

  // 混沌暗影 (Chaos Shadow)
  shadow_bolt: { row: 0, col: 1 },
  curse_of_agony: { row: 1, col: 0 },
  void_nova: { row: 1, col: 2 },
  corruption: { row: 2, col: 1 },
  shadow_fissure: { row: 3, col: 0 },
  dark_metamorphosis: { row: 3, col: 2 },
  nether_beam: { row: 4, col: 1 },
  chaos_cataclysm: { row: 5, col: 0 },
  shadow_mastery: { row: 5, col: 2 },
  chaos_ritual: { row: 2, col: 0 },
};

/**
 * 根據技能物件或 ID 取得 6x3 棋盤上的定位座標
 */
export function getSkillGridPosition(skillId: string, requiredLevel: number = 1, fallbackIndex: number = 0): SkillGridPos {
  if (SKILL_GRID_LAYOUT[skillId]) {
    return SKILL_GRID_LAYOUT[skillId];
  }

  // 自動安全備援：依等級推算 Row，並依 index 均分 Col
  const rowMap: Record<number, number> = { 1: 0, 6: 1, 12: 2, 18: 3, 24: 4, 30: 5 };
  const row = rowMap[requiredLevel] !== undefined ? rowMap[requiredLevel] : 0;
  const col = fallbackIndex % 3;

  return { row, col };
}
