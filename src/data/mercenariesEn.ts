import type { MercenaryData } from './mercenaries';

export const MERCENARIES_EN: Record<string, Omit<MercenaryData, 'id' | 'act' | 'name' | 'nameEn'>> = {
  act2_desert: {
    type: 'Melee polearm fighter / aura support', equipmentTypes: ['Polearms', 'Spears (since 2.4)', 'Helms', 'Body Armor'],
    nativeAurasOrSkills: ['Normal: Prayer (party healing), Defiance (defense), or Blessed Aim (attack rating).', 'Nightmare and Hell: the above plus Might (physical damage), Holy Freeze (area slowing), and Thorns (damage reflection), for six choices.'],
    patch24Updates: 'Patch 2.4 added spear support and adjusted aura scaling with level.',
    description: "A widely used, versatile mercenary with a native Paladin aura. Insight, Infinity, or The Reaper's Toll can provide mana regeneration, resistance reduction, and a frontline tank.",
    builds: [
      { name: 'Cure Triple-Aura Healer (Patch 2.6 BIS)', role: 'Rapid healing and shorter poison and curse durations', weapon: '【Insight】 (Meditation aura)', helm: '【Cure】 (Cleansing aura)', armor: '【Fortitude】 or 【Treachery】', description: 'Use a Normal Prayer mercenary with Cure and Insight. Prayer synergizes with Cleansing and Meditation for triple healing. The guide describes healing above 100 life per second and reductions of over 80% to poison and curse duration.', strengths: ['Triple-synergy healing', 'Rapid poison and curse recovery', 'Budget-friendly setup'] },
      { name: 'Infinity Elemental Support', role: 'Break elemental immunities and amplify caster damage', weapon: '【Infinity】 (Level 12 Conviction)', helm: "【Andariel's Visage】 (15% IAS / 30% Fire Resist jewel)", armor: 'Ethereal 【Fortitude】 (Archon Plate / Sacred Armor)', description: "Level 12 Conviction reduces nearby enemy elemental resistances by 85%. It supports Javazons, lightning and fire Sorceresses, and trap Assassins, while Andariel's Visage and Fortitude improve the mercenary's own damage.", strengths: ['Breaks many lightning and fire immunities', '40% Crushing Blow against large life pools', 'Endgame offense and defense'] },
      { name: 'Decrepify Physical Support', role: 'Break physical immunities, reduce physical resistance by 50%, and slow enemies', weapon: "Ethereal 【The Reaper's Toll】 (Shael #13)", helm: "【Guillaume's Face】 (35% Crushing Blow)", armor: '【Treachery】 (45% IAS and Level 15 Fade)', description: "For Whirlwind Barbarians, Bowazons, and Zealots. The Reaper's Toll has a 33% chance to cast Level 1 Decrepify on striking, reducing enemy speed and damage by 50% and breaking physical immunities. Guillaume's Face adds 35% Crushing Blow.", strengths: ['Consistent physical-immunity breaking', 'Decrepify slowing for survival', 'Fast boss kills'] },
    ],
  },
  act5_barbarian: {
    type: 'Dual-wield Frenzy fighter / two-handed sword fighter', equipmentTypes: ['One-handed swords / two-handed swords', 'Barbarian Helms', 'Body Armor'],
    nativeAurasOrSkills: ['Dual-wield variant added in 2.4: Frenzy, Taunt, and Iron Skin.', 'Two-handed variant: Bash, Stun, and Battle Cry, which reduces enemy defense and damage.'],
    patch24Updates: 'Patch 2.4 added the dual-wield Frenzy mercenary, using two one-handed swords. Frenzy rapidly increases attack and movement speed. Barbarian helms provide skill bonuses.',
    description: "Once Frenzy builds up, this mercenary attacks rapidly. Two weapon runewords, such as Lawbringer and Grief, provide flexible support; even the full Sazabi set can handle Baal's waves.",
    builds: [
      { name: 'Lawbringer Dual-Wield Decrepify', role: 'Repel undead and repeatedly apply Decrepify', weapon: '【Lawbringer】 Phase Blade + 【Grief】 or 【Plague】', helm: "【Arreat's Face】", armor: '【Fortitude】 or 【Treachery】', description: 'Frequent dual-wield attacks keep Decrepify active. Lawbringer grants Sanctuary, which repels undead and ignores their physical resistance, making this setup useful in the Chaos Sanctuary and tombs.', strengths: ['Frequent Decrepify procs', 'Sanctuary pushes dangerous undead away', 'Frenzy rapidly closes the distance'] },
      { name: 'Full Sazabi Tank (Budget)', role: 'Over 4,000 life, high resistances, life leech, and damage reduction', weapon: "【Sazabi's Cobalt Redeemer】", helm: "【Sazabi's Mental Sheath】", armor: "【Sazabi's Ghost Liberator】", description: 'The set buffs in 2.4 grant 15% life leech, 16% physical damage reduction, +27% maximum life, and strong damage against demons. The guide presents this inexpensive set as a durable option for portals and difficult Terror Zones.', strengths: ['Very low set cost', 'Strong survival compared with Fortitude and Andariel setups', 'Does not depend on socket investment'] },
    ],
  },
  act1_rogue: {
    type: 'Ranged physical and elemental archer', equipmentTypes: ['Bows', 'Amazon Bows (since 2.4)', 'Helms', 'Body Armor'],
    nativeAurasOrSkills: ['Cold variant: Cold Arrow and Freezing Arrow.', 'Fire variant: Fire Arrow and Exploding Arrow.'],
    patch24Updates: 'Patch 2.4 added Amazon bow support, including +3 Bow Skills bases, and increased ranged skill damage.',
    description: 'A ranged fighter that keeps her distance. Faith grants Fanaticism, helping Bowazons, physical Assassins, and melee Barbarians reach attack-speed breakpoints.',
    builds: [
      { name: 'Faith Fanaticism Breakpoint Support', role: 'High-level Fanaticism for faster party attacks', weapon: '【Faith】 (Matriarchal / Grand Matron Bow, Level 12–15 Fanaticism)', helm: "【Andariel's Visage】 or 【Giant Skull】 (Knockback and Crushing Blow)", armor: '【Fortitude】', description: 'Level 12–15 Fanaticism increases party attack speed, attack rating, and damage. It helps physical Bowazons and melee fighters reach higher attack-speed breakpoints.', strengths: ['Reach higher attack-speed breakpoints', 'Reanimated skeletons provide extra bodies', 'Safer ranged positioning'] },
      { name: 'Mist Concentration Support (Patch 2.4)', role: 'Concentration aura and 100% piercing attacks', weapon: '【Mist】 (Amazon bow, Level 8–12 Concentration)', helm: '【Vampire Gaze】 or 【Cure】', armor: '【Treachery】 or 【Fortitude】', description: 'Mist grants Level 8–12 Concentration for party physical damage, 100% piercing attacks, and +40 all resistances. It offers an alternative below the cost of Faith.', strengths: ['100% piercing for groups', '+40 all resistances', 'Consistent Concentration damage bonus'] },
    ],
  },
  act3_ironwolf: {
    type: 'Elemental caster / party support', equipmentTypes: ['One-handed Swords', 'Shields', 'Helms', 'Body Armor'],
    nativeAurasOrSkills: ['Fire: Fire Bolt, Fire Ball, and Level 15+ Enchant (added in 2.4).', 'Cold: Glacial Spike, Chilling Armor, and Ice Blast.', 'Lightning: Charged Bolt, Lightning, and Static Field (added in 2.4).'],
    patch24Updates: 'Patch 2.4 added party Enchant to the fire variant for attack rating and fire damage, and Static Field to the lightning variant. The cold variant uses Glacial Spike, Chilling Armor, and Ice Blast.',
    description: 'A caster mercenary that can equip both a one-handed sword and a shield. Dual Spirit can provide up to 70% FCR, skills, and resistances.',
    builds: [
      { name: 'Fire Enchant Summon Support', role: 'Enchant allies and summons for over 200% attack rating', weapon: '【Spirit】 sword or 【Plague】', helm: '【Flickering Flame】 or 【Harlequin Crest】', armor: '【Skin of the Vipermagi】', description: 'For summoning Necromancers, summoning Druids, or Frenzy Barbarians. The fire Iron Wolf casts Level 15+ Enchant, adding fire damage and substantially increasing attack rating for the army.', strengths: ['Party-wide attack rating from Enchant', 'Fire damage for summons', 'Resist Fire aura from Flickering Flame'] },
      { name: 'Cold Crowd-Control Support', role: 'Glacial Spike and Ice Blast slow or freeze approaching enemies', weapon: '【Spirit】 sword', helm: "【Nightwing's Veil】 (+15% Cold Skill Damage)", armor: '【Treachery】 or 【Skin of the Vipermagi】', description: 'Dual Spirit provides 110% FHR and up to 70% FCR. The Iron Wolf casts Glacial Spike and Ice Blast from the rear to slow and freeze approaching enemies.', strengths: ['Cold crowd control', 'Low-cost dual Spirit setup', 'Defensive option for Hardcore'] },
    ],
  },
};
