/**
 * 英雄職業資料之權威英文翻譯表 (English Translations for Character Classes)
 * 提供首頁英雄殿堂 (ClassShowcase) 與角色寶典 (CharacterGuide) 在英文模式下之完整雙語呈現。
 */

export interface ClassSkillTreeEn {
  name: string;
  description: string;
  keySkills: string[];
}

export interface ClassBuildEn {
  name: string;
  coreSkills: string;
  gearSummary: string;
}

export interface ClassGearInfoEn {
  title: string;
  desc: string;
  topBases: string[];
}

export interface ClassTranslationData {
  title: string;
  description: string;
  skillTrees: ClassSkillTreeEn[];
  popularBuilds: ClassBuildEn[];
  gearInfo: ClassGearInfoEn;
}

export const CLASS_TRANSLATIONS: Record<string, ClassTranslationData> = {
  warlock: {
    title: 'Forbidden Lord of the Void',
    description:
      'Brand new class in Diablo II: Resurrected - Reign of the Warlock! Masters forbidden hell powers, bends high demons into frontline minions, enchants weapons with eldritch runes, and obliterates foes from afar with void and chaos fire.',
    skillTrees: [
      {
        name: 'Demon Enslavement',
        description: 'Binds native demons of Hell into loyal vanguard minions with unique attacks and offensive auras.',
        keySkills: ['Summon Torture Fiend', 'Abyssal Command', 'Soul Tap', 'Frenzy Rite'],
      },
      {
        name: 'Eldritch Infusion',
        description: 'Channels primordial void energy into melee weapons, transforming physical strikes into pure destructive magic.',
        keySkills: ['Eldritch Blade', 'Void Resonance', 'Abyssal Ward', 'Touch of Doom'],
      },
      {
        name: 'Chaos Magic',
        description: 'Unleashes torrents of nether fire and rift tears, inflicting catastrophic area annihilation across the battlefield.',
        keySkills: ['Shadow Rift', 'Hellfire Wave', 'Chaos Disintegration', 'Doom Descent'],
      },
    ],
    popularBuilds: [
      {
        name: 'Demon Commander',
        coreSkills: 'Summon Torture Fiend + Abyssal Command + Frenzy Rite',
        gearSummary: 'Grimoire of Authority + Bane\'s Raiment + Stone of Jordan',
      },
      {
        name: 'Chaos Pyromancer',
        coreSkills: 'Shadow Rift + Hellfire Wave + Chaos Disintegration',
        gearSummary: 'Wizardspike + Enigma + Griffon\'s Eye',
      },
      {
        name: 'Eldritch Blade Melee (Eldritch Blade)',
        coreSkills: 'Eldritch Blow + Psychic Ward + Mirror Blade + Echo Strike',
        gearSummary: "Grief / Wizardspike + Stormshield + Enigma + Dracul's Grasp",
      },
    ],
    gearInfo: {
      title: 'Warlock Exclusive Grimoires & Ritual Daggers',
      desc: 'Off-hand Grimoires provide demonic minion empowerment and chaos resistance penetration, serving as the core of endgame armies.',
      topBases: ['Grimoire of Authority', 'Coven Ritual Dagger', 'Sigil of Abyssal Command'],
    },
  },
  sorceress: {
    title: 'Master of the Elements',
    description:
      'Queen of elemental magic, mastering Cold, Fire, and Lightning spells. Equipped with innate instantaneous Teleportation, she reigns supreme for league ladder starts and high-efficiency boss farming.',
    skillTrees: [
      {
        name: 'Cold Spells',
        description: 'Freezes the battlefield with absolute zero, combining crowd control slowing and massive area clear.',
        keySkills: ['Blizzard', 'Glacial Spike', 'Cold Mastery', 'Frozen Orb'],
      },
      {
        name: 'Lightning Spells',
        description: 'High-voltage piercing energy strikes with the highest single-hit damage ceiling in the game.',
        keySkills: ['Lightning', 'Chain Lightning', 'Teleport', 'Static Field'],
      },
      {
        name: 'Fire Spells',
        description: 'Incinerates hordes with scorching flame, boasting top DPS with Flame Rift sunder charms.',
        keySkills: ['Fire Ball', 'Meteor', 'Hydra', 'Warmth'],
      },
    ],
    popularBuilds: [
      {
        name: 'Pure Blizzard',
        coreSkills: 'Blizzard + Glacial Spike + Max Cold Mastery',
        gearSummary: 'Death\'s Fathom + Vipermagi / Ormus + Spirit + Harlequin Crest',
      },
      {
        name: 'Lightning Nova / Energy Shield',
        coreSkills: 'Nova + Static Field + Telekinesis + Energy Shield',
        gearSummary: 'Self-use Infinity Scythe + Griffon\'s Eye + Vipermagi + Stone of Jordan',
      },
      {
        name: 'Meteor & Fireball Sorc (Meteor & Fireball)',
        coreSkills: 'Meteor + Fire Ball + Fire Mastery + Warmth (maxed)',
        gearSummary: "Eschuta's Temper / Heart of the Oak + Phoenix / Spirit + Vipermagi + Flame Rift Charm",
      },
    ],
    gearInfo: {
      title: 'Sorceress Exclusive Orbs',
      desc: 'Dimensional, Swirling, and Eldritch Orbs can roll with +3 single skill tree and +3 Blizzard / Chain Lightning signature skills.',
      topBases: ['Death\'s Fathom', 'Eschuta\'s Temper', 'The Oculus'],
    },
  },
  paladin: {
    title: 'Holy Crusader of Zakarum',
    description:
      'Devout warrior cloaked in sacred radiance. Renowned for impenetrable Holy Shield defense, lethal Blessed Hammer volleys, and unmatched Smite boss-killing power.',
    skillTrees: [
      {
        name: 'Combat Skills',
        description: 'Direct martial prowess including Blessed Hammer, Smite, Zeal, and Holy Shield.',
        keySkills: ['Blessed Hammer', 'Holy Shield', 'Smite', 'Charge'],
      },
      {
        name: 'Offensive Auras',
        description: 'Radiant battle auras enhancing damage, attack rating, and stripping elemental resistances.',
        keySkills: ['Concentration', 'Fanaticism', 'Conviction', 'Holy Shock'],
      },
      {
        name: 'Defensive Auras',
        description: 'Sanctified protective auras boosting party resistances, life recovery, and physical toughness.',
        keySkills: ['Salvation', 'Vigor', 'Redemption', 'Meditation'],
      },
    ],
    popularBuilds: [
      {
        name: 'Hammerdin (Blessed Hammer)',
        coreSkills: 'Blessed Hammer + Concentration + Holy Shield + Vigor',
        gearSummary: 'Heart of the Oak + Enigma + Herald of Zakarum / Spirit + Shako',
      },
      {
        name: 'Smiter (Uber Boss Killer)',
        coreSkills: 'Smite + Fanaticism + Holy Shield',
        gearSummary: 'Grief Phase Blade + Exile Sacred Targe + Fortitude + Dracul\'s Grasp',
      },
      {
        name: 'Fist of the Heavens Paladin (FoHdin)',
        coreSkills: 'Fist of the Heavens + Holy Bolt + Faith (maxed)',
        gearSummary: 'Heart of the Oak + Herald of Zakarum / Spirit + Enigma + Arachnid Mesh',
      },
    ],
    gearInfo: {
      title: 'Paladin Exclusive Auric Shields',
      desc: 'Natively roll up to +45 All Resistances or +65% Enhanced Damage with +121 Attack Rating. 4-socket Sacred Targe is the BiS base for Spirit or Exile.',
      topBases: ['Sacred Targe (60% High Block)', 'Herald of Zakarum', 'Kurast Shield'],
    },
  },
  amazon: {
    title: 'Mistress of Bow & Javelin',
    description:
      'Master archer and javelin skirmisher from the Skovos Isles. Delivers screen-clearing Lightning Fury javelins and suppressive physical bow barrages.',
    skillTrees: [
      {
        name: 'Javelin and Spear',
        description: 'Devastating lightning discharges and close-quarters piercing spear techniques.',
        keySkills: ['Lightning Fury', 'Charged Strike', 'Power Strike'],
      },
      {
        name: 'Bow and Crossbow',
        description: 'Long-range physical barrages and freezing elemental archery covering entire horizons.',
        keySkills: ['Multishot', 'Strafe', 'Freezing Arrow', 'Guided Arrow'],
      },
      {
        name: 'Passive and Magic',
        description: 'Keen evasive instincts, critical strike mastery, and tactical decoy summoning.',
        keySkills: ['Valkyrie', 'Pierce', 'Critical Strike', 'Dodge / Evade'],
      },
    ],
    popularBuilds: [
      {
        name: 'Javazon (Lightning Fury)',
        coreSkills: 'Lightning Fury + Charged Strike + Pierce',
        gearSummary: 'Titan\'s Revenge + Griffon\'s Eye + Enigma + Spirit Monarch',
      },
      {
        name: 'Physical Bowazon',
        coreSkills: 'Multishot + Strafe + Valkyrie + Critical Strike',
        gearSummary: 'Faith Grand Matron Bow + Fortitude + Windforce + War Traveler',
      },
      {
        name: 'Strafe Bowazon (Strafe Bowazon)',
        coreSkills: 'Strafe + Penetrate + Pierce + Critical Strike',
        gearSummary: "Windforce / Faith + Fortitude + Atma's Scarab (damage amplify trigger) + Gore Rider",
      },
    ],
    gearInfo: {
      title: 'Amazon Exclusive Sacred Bows & Javelins',
      desc: 'Grand Matron and Matriarchal Bows can roll with +3 Bow skills; Titan\'s Revenge and Thunderstroke provide lightning barrage speed.',
      topBases: ['Titan\'s Revenge', 'Thunderstroke', 'Grand Matron Bow (+3 Skills 4S Faith Base)'],
    },
  },
  necromancer: {
    title: 'Commander of the Undead',
    description:
      'Rathma priest commanding death and balance. Raises vast skeletal legions, triggers apocalyptic Corpse Explosions, and cripples foes with insidious curses.',
    skillTrees: [
      {
        name: 'Summoning Spells',
        description: 'Raises skeleton warriors, mages, and golems into an unstoppable undead tide.',
        keySkills: ['Raise Skeleton', 'Skeleton Mastery', 'Clay Golem', 'Revive'],
      },
      {
        name: 'Poison and Bone Spells',
        description: 'Piercing magic spears, deadly bone armor, and devastating poison novas.',
        keySkills: ['Corpse Explosion', 'Bone Spear', 'Poison Nova', 'Bone Prison'],
      },
      {
        name: 'Curses',
        description: 'Manipulates fate and physiology, stripping physical immunities and reducing enemies to a crawl.',
        keySkills: ['Amplify Damage', 'Decrepify', 'Lower Resist', 'Dim Vision'],
      },
    ],
    popularBuilds: [
      {
        name: 'Summonmancer (Fishymancer)',
        coreSkills: 'Raise Skeleton + Skeleton Mastery + Corpse Explosion + Amplify Damage',
        gearSummary: 'Beast + Enigma + Homunculus / Spirit + Shako + Mara\'s',
      },
      {
        name: 'Poison Nova Necro',
        coreSkills: 'Poison Nova + Poison Dagger + Lower Resist + Corpse Explosion',
        gearSummary: 'Death\'s Web + Bramble + 3-Piece Trang-Oul + Shako',
      },
      {
        name: 'Pure Bone Spear Necro (Bone Spear Necro)',
        coreSkills: 'Bone Spear + Bone Spirit + Teeth + Bone Prison (maxed)',
        gearSummary: "White Staff / Death's Web + Homunculus / Spirit + Enigma + Shako",
      },
    ],
    gearInfo: {
      title: 'Necromancer Wands & Shrunken Heads',
      desc: 'Homunculus and Boneflame; high-tier white wands can roll +3 Poison Nova and Decrepify for White runeword.',
      topBases: ['Death\'s Web (-50% Enemy Poison Res)', 'Homunculus', 'Bone Shield (+3 Decrepify +3 Bone Spear)'],
    },
  },
  barbarian: {
    title: 'Primal Titan of Melee',
    description:
      'Rugged warlord of Mount Arreat. Master of brute-force melee, dual-wielding, and thunderous Warcries that massively boost party life and defense.',
    skillTrees: [
      {
        name: 'Combat Skills',
        description: 'Unstoppable physical attacks including Whirlwind, Frenzy, Berserk, and Leap Attack.',
        keySkills: ['Whirlwind', 'Frenzy', 'Berserk', 'Double Swing'],
      },
      {
        name: 'Combat Masteries',
        description: 'Passive weapon proficiencies, iron skin defense, natural resistances, and boosted sprint speed.',
        keySkills: ['Sword / Axe Mastery', 'Natural Resistance', 'Iron Skin', 'Increased Speed'],
      },
      {
        name: 'Warcries',
        description: 'Echoing shouts that bolster ally vitality, stun hordes, and pry extra treasure from fallen corpses.',
        keySkills: ['Battle Orders (BO)', 'Battle Command', 'Find Item (Hork)', 'War Cry'],
      },
    ],
    popularBuilds: [
      {
        name: 'Horker Barb (Gold/MF Find Item)',
        coreSkills: 'Whirlwind / Berserk + Battle Orders + Find Item + Find Potion',
        gearSummary: 'Dual Grief Phase Blades + Enigma + Arreat\'s Face + Dual Ali Baba (Swap)',
      },
      {
        name: 'Berserk Melee Barb',
        coreSkills: 'Berserk (100% Magic Damage) + Battle Orders + Howl',
        gearSummary: 'Grief Phase Blade + Stormshield + Fortitude + Gore Rider',
      },
      {
        name: 'Dual Grief Whirlwind Barbarian (Whirlwind Barb)',
        coreSkills: 'Whirlwind + Sword Mastery + Battle Command + Iron Skin (maxed)',
        gearSummary: "Dual Grief + Fortitude / Enigma + Arreat's Face + Gore Rider",
      },
    ],
    gearInfo: {
      title: 'Barbarian Exclusive Primal Helms',
      desc: 'Arreat\'s Face; primal helms can roll with +3 Battle Orders and +3 War Cry for unmatched pre-buffing and survivability.',
      topBases: ['Arreat\'s Face', 'Demonhorn\'s Edge', 'Slayer Guard (+3 Battle Orders 3S Cure Base)'],
    },
  },
  druid: {
    title: 'Lord of Nature & Beasts',
    description:
      'Shapeshifting guardian of Scosglen. Transforms into savage Werebears or Werewolves, summons woodland beasts, and calls down hurricanes and volcanoes.',
    skillTrees: [
      {
        name: 'Elemental',
        description: 'Commands wind and geological cataclysms: Tornadoes, Hurricanes, Fissures, and Armageddons.',
        keySkills: ['Tornado', 'Hurricane', 'Twister', 'Fissure'],
      },
      {
        name: 'Shape Shifting',
        description: 'Transforms into beast forms, gaining massive life pools, feral attack speed, and crushing stuns.',
        keySkills: ['Werewolf', 'Werebear', 'Fury', 'Shock Wave'],
      },
      {
        name: 'Summoning',
        description: 'Summons raven scouts, spirit wolves, grizzly bears, and oak sage life totems.',
        keySkills: ['Grizzly Bear', 'Oak Sage', 'Heart of Wolverine', 'Dire Wolves'],
      },
    ],
    popularBuilds: [
      {
        name: 'Wind Druid (Windy)',
        coreSkills: 'Tornado + Hurricane + Cyclone Armor + Oak Sage',
        gearSummary: 'Heart of the Oak + Enigma + Jalal\'s Mane / 2-20 Pelts + Spirit Monarch',
      },
      {
        name: 'Fury Werewolf',
        coreSkills: 'Werewolf + Lycanthropy + Fury + Heart of Wolverine',
        gearSummary: 'Ribcracker / Grief + Fortitude + Jalal\'s Mane + Gore Rider',
      },
      {
        name: 'Fissure Fire Druid (Fire Druid)',
        coreSkills: 'Fissure + Volcano + Armageddon + Oak Sage (maxed)',
        gearSummary: 'Heart of the Oak / Raven Frost + Spirit + Enigma + Flame Rift Charm',
      },
    ],
    gearInfo: {
      title: 'Druid Exclusive Pelts',
      desc: 'Jalal\'s Mane; pelts natively roll with +3 Tornado, +3 Fury, or +3 Armageddon for top elemental and melee builds.',
      topBases: ['Jalal\'s Mane', 'Cerebus\' Bite', 'Earth Spirit (+3 Tornado 3S Metamorphosis Base)'],
    },
  },
  assassin: {
    title: 'Shadow Trapper & Martial Artist',
    description:
      'Elite Viz-Jaq\'taar mage hunter. Deploys deadly automated elemental traps, cloaks in shadows, and executes devastating martial art finishing moves.',
    skillTrees: [
      {
        name: 'Traps',
        description: 'Deploys automated lightning and fire turrets, plus fatal Death Sentry corpse explosions.',
        keySkills: ['Lightning Sentry', 'Death Sentry', 'Wake of Fire', 'Fire Blast'],
      },
      {
        name: 'Shadow Disciplines',
        description: 'Stealth arts, burst of speed agility, weapon block dual-wielding, and shadow clones.',
        keySkills: ['Burst of Speed', 'Fade', 'Weapon Block', 'Shadow Master'],
      },
      {
        name: 'Martial Arts',
        description: 'Elemental charge-up strikes and acrobatic finishing kicks releasing explosive combos.',
        keySkills: ['Phoenix Strike', 'Claws of Thunder', 'Dragon Talon', 'Tiger Strike'],
      },
    ],
    popularBuilds: [
      {
        name: 'Mosaic Phoenix Striker',
        coreSkills: 'Phoenix Strike + Tiger Strike + Cobra Strike + Dragon Talon',
        gearSummary: 'Dual Mosaic Greater Talons + Enigma + Griffon\'s Eye',
      },
      {
        name: 'Trapsin (Lightning Trap)',
        coreSkills: 'Lightning Sentry + Death Sentry + Fire Blast + Burst of Speed',
        gearSummary: 'Dual +3 Trap Greater Talons + Enigma + Griffon\'s Eye + Arachnid Mesh',
      },
      {
        name: 'Blade Fury Assassin (Blade Fury Sin)',
        coreSkills: 'Blade Fury + Shadow Warrior + Shadow Master + Claw Mastery',
        gearSummary: "Grief / Grim Reaper + Stormshield + Fortitude + Guillaume's Face",
      },
    ],
    gearInfo: {
      title: 'Assassin Exclusive Claws & Katars',
      desc: 'Bartuc\'s Cut-Throat; native claws can roll with +3 Traps, +3 Lightning Sentry, and Weapon Block for dual-wielding.',
      topBases: ['Bartuc\'s Cut-Throat', 'Runic Talons (+3 Lightning Sentry 3S Chaos Base)', 'Suwayyah'],
    },
  },
};
