/** 道具說明的英文顯示覆蓋層；原始資料、物品識別碼與數值不變。 */
const translations: Record<string, Record<string, string | string[]>> = {
  key_of_terror: {
    dropSource: 'The Countess', dropRate: 'About 1 / 14 (7.1%)', location: 'Act I: Black Marsh — Forgotten Tower Level 5',
    description: 'A rusted rune key glowing with crimson terror, one of the three keys used to open the portals leading to Uber Tristram.',
    usageFormula: "Transmute one Key of Terror, Hate, and Destruction in Act V town on Hell difficulty to open one of three portals: Matron's Den, Forgotten Sands, or Furnace of Pain.",
    tacticalTips: 'The Countess is immune to fire and cold, making lightning Sorceresses and Javazons convenient key farmers. Her drops also include mid-tier runes, with regular rune drops reaching Lo (#28).',
  },
  key_of_hate: {
    dropSource: 'The Summoner', dropRate: 'About 1 / 11 (8.9%)', location: 'Act II: Lut Gholein — end of Arcane Sanctuary',
    description: "A twisted key dripping with green hatred, carrying the curse of Horazon's illusions.",
    usageFormula: 'Transmute with the Keys of Terror and Destruction. Open all three minor portals in the same game to avoid duplicate destinations.',
    tacticalTips: 'Arcane Sanctuary has four possible paths, each with a 25% chance. Lure ghosts onto platforms before killing them: ghosts killed over the void drop nothing, while those killed on solid ground are useful rune targets.',
  },
  key_of_destruction: {
    dropSource: 'Nihlathak', dropRate: 'About 1 / 12 (8.1%)', location: "Act V: Harrogath — Halls of Vaught (Anya's portal)",
    description: "A violent key radiating dark purple destruction and bearing Baal's blessing.",
    usageFormula: 'Opening all three minor portals requires nine keys in total: three of each kind.',
    tacticalTips: "Danger: Nihlathak's high-level Corpse Explosion can kill even a 3,000-life character. Nature's Peace prevents eligible corpses from being used, while Necromancers can consume corpses first with Corpse Explosion or other corpse skills.",
  },
  mephistos_brain: {
    dropSource: 'Lilith (Uber Andariel)', dropRate: 'Guaranteed (100%)', location: "Minor portal: Matron's Den",
    description: 'Demonic brain tissue pulsing with hatred, a foul smell, and electrical energy.',
    usageFormula: "Transmute Mephisto's Brain, Baal's Eye, and Diablo's Horn together in Harrogath to open the final Uber Tristram portal.",
    tacticalTips: "Matron's Den is large and filled with succubi and spear-wielding enemies. Lilith deals severe physical and poison damage. Keep Life Tap active and use Antidote Potions to raise your poison resistance cap.",
  },
  baals_eye: {
    dropSource: 'Uber Duriel', dropRate: 'Guaranteed (100%)', location: 'Minor portal: Forgotten Sands',
    description: 'A huge bloodshot eye that sees mortal fear and despair.', usageFormula: 'One of the three organs required to open Uber Tristram.',
    tacticalTips: "Uber Duriel's Holy Freeze slows you even with Cannot Be Frozen. His attacks are primarily single-target physical damage; a Smiter with Life Tap can fight him at close range.",
  },
  diablos_horn: {
    dropSource: 'Uber Izual', dropRate: 'Guaranteed (100%)', location: 'Minor portal: Furnace of Pain',
    description: "A thick, scorched horn once carried by Diablo, Lord of Terror.", usageFormula: 'One of the three organs required to open Uber Tristram.',
    tacticalTips: 'The area contains succubi that curse defense and damage, plus Abyss Knights. Izual has a large life pool but is a comparatively modest damage threat. Clear nearby enemies before fighting him alone.',
  },
  standard_of_heroes: {
    dropSource: 'The three bosses in Uber Tristram', dropRate: 'One for each player present', location: 'Uber Tristram',
    description: 'A golden trophy marking victory over the three Prime Evils, with a required level of 90.',
    usageFormula: 'A commemorative endgame trophy valued by collectors.', tacticalTips: 'Keep it in your inventory as a trophy. It drops alongside the Hellfire Torch in Uber Tristram.',
  },
  essence_suffering: { bossSource: 'Andariel / Duriel', location: "Act I: Catacombs Level 4 / Act II: Tal Rasha's Tomb", dropChance: 'About 1 / 14 (Hell)', description: 'A blue crystal condensed from suffering souls and poison, echoing with anguish.' },
  essence_hatred: { bossSource: 'Mephisto', location: 'Act III: Durance of Hate Level 3', dropChance: 'About 1 / 14 (Hell)', description: 'A golden crystal charged with lightning and hatred, drawing those who touch it toward revenge.' },
  essence_terror: { bossSource: 'Diablo', location: 'Act IV: Chaos Sanctuary', dropChance: 'About 1 / 14 (Hell)', description: 'A red crystal burning with hellfire and embodying eternal terror.' },
  essence_destruction: { bossSource: 'Baal', location: 'Act V: Worldstone Chamber', dropChance: 'About 1 / 14 (Hell)', description: 'A green crystal of Worldstone fragments and corruption, with the power to reshape fate.' },
  full_rejuv_potion: {
    effect: 'Instantly restores 100% of Life and Mana.', hiddenMechanic: 'Works instantly, without a recovery delay or life-leech penalty, for emergency healing.',
    recipe: '3 Rejuvenation Potions → 1 Full Rejuvenation Potion; or 3 Healing Potions + 3 Mana Potions + 1 standard gem (not chipped) in the Cube.',
    description: 'A valuable emergency potion, especially for surviving difficult Hardcore encounters.', proTips: 'Reserve at least one belt column on hotkeys 1–4 for Full Rejuvenation Potions to handle lightning volleys and exploding dolls.',
  },
  antidote_potion: {
    effect: 'Cures poison immediately and grants +50% Poison Resistance and +10% Maximum Poison Resistance for 30 seconds.',
    hiddenMechanic: 'Durations stack without a fixed limit: 5 potions provide 150 seconds of +50 poison resistance and an 85% resistance cap.',
    recipe: 'Buy from town vendors such as Akara, Drognan, or Ormus for 30 gold.', description: 'An inexpensive preparation for Andariel and poison-heavy enemies in Hell. Six potions extend protection for the encounter.',
    proTips: "Drink 6 before entering Andariel's room and give 6 to your mercenary to raise the poison resistance cap to 85%.",
  },
  thawing_potion: {
    effect: 'Removes chill immediately and grants +50% Cold Resistance and +10% Maximum Cold Resistance for 30 seconds.',
    hiddenMechanic: 'Durations stack: 6 potions provide 180 seconds of +50 cold resistance and an 85% resistance cap.',
    recipe: 'Buy from town potion vendors for 30 gold.', description: 'Useful preparation for the battle against Duriel in Act II.',
    proTips: "Drink 6 before entering Duriel's chamber and give 6 to your mercenary. The guide recommends this to reduce Holy Freeze damage by about 80% and sustain close combat.",
  },
  stamina_potion: {
    effect: 'Refills stamina immediately and prevents stamina consumption while running for 30 seconds.', hiddenMechanic: 'Durations stack: 10 potions provide 5 minutes of uninterrupted running.',
    recipe: 'Buy from town vendors for 20 gold.', description: 'New characters in Normal Acts I–II have little stamina; these potions help them traverse areas quickly.', proTips: 'Drink 5 before leaving camp to avoid repeatedly switching between running and walking.',
  },
  tome_of_town_portal: {
    effect: 'Holds up to 20 Scrolls of Town Portal. Right-click to open a blue portal to the current act town.',
    hiddenMechanic: "After completing the difficulty, transmute the tome with Wirt's Leg in the Act I camp to open the Secret Cow Level.",
    recipe: 'Buy an empty tome from a town vendor and fill it with 20 scrolls.', description: 'A core utility item to keep in every adventurer’s inventory.', proTips: 'Keep 20 scrolls stocked. Open a portal before exploring an unfamiliar dangerous area.',
  },
  token_of_absolution: {
    effect: 'Right-click to reset and refund all allocated skill points and attribute points.', hiddenMechanic: 'There is no use limit. With enough of the four essences, you can respec repeatedly.',
    recipe: 'Cube: Twisted Essence of Suffering + Charged Essence of Hatred + Burning Essence of Terror + Festering Essence of Destruction.',
    description: 'A common mid-to-late Ladder trading item for switching between cold, fire, and lightning Sorceresses or Smiter and Zealot builds.', proTips: 'After changing builds or obtaining Enigma or Infinity, respec precisely and allocate only enough strength to equip your gear.',
  },
  sunder_cold: { keyAttributes: ['Monster Cold Immunity is reduced to 95% resistance', 'Your Cold Resistance is reduced by 70–90%'], dropSource: 'Champion and unique monsters in Hell Terror Zones', guide: 'A key item for cold Sorceresses. Pair it with Cold Mastery to reduce the resistance of enemies whose cold immunity has been broken.' },
  sunder_lightning: { keyAttributes: ['Monster Lightning Immunity is reduced to 95% resistance', 'Your Lightning Resistance is reduced by 70–90%'], dropSource: 'Hell Terror Zones', guide: "Useful for lightning Sorceresses, Javazons, and trap Assassins. Pair with Griffon's Eye and a mercenary’s Infinity aura for lightning builds." },
  sunder_fire: { keyAttributes: ['Monster Fire Immunity is reduced to 95% resistance', 'Your Fire Resistance is reduced by 70–90%'], dropSource: 'Hell Terror Zones', guide: 'Helps fire Sorceresses, fire Druids, and fire-trap Assassins fight fire-immune enemies, including those in the Act IV Chaos Sanctuary.' },
  sunder_poison: { keyAttributes: ['Monster Poison Immunity is reduced to 95% resistance', 'Your Poison Resistance is reduced by 70–90%'], dropSource: 'Hell Terror Zones', guide: "Useful for Poison Nova Necromancers and Rabies Druids. Pair with Death's Web and three Trang-Oul set pieces for further resistance reduction." },
  sunder_physical: { keyAttributes: ['Monster Physical Immunity is reduced to 95% resistance', 'Physical Damage Received is increased by 10–20%'], dropSource: 'Hell Terror Zones', guide: 'Lets Whirlwind Barbarians, Bowazons, and Zealots damage physical-immune ghosts without first relying on Decrepify or Amplify Damage.' },
  sunder_magic: { keyAttributes: ['Monster Magic Immunity is reduced to 95% resistance', 'Your Magic Resistance is reduced by 45–65%'], dropSource: 'Hell Terror Zones', guide: "For Hammerdins and bone Necromancers, including against the magic-immune mummies in Baal's second wave." },
  rainbow_facet: {
    keyAttributes: ['+(3–5)% Elemental Skill Damage (Cold / Fire / Lightning / Poison)', '−(3–5)% Enemy Resistance to the corresponding element', '100% chance to cast on death or level-up. On death: Chain Lightning 47 / Blizzard 37 / Meteor 31 / Poison Nova 51. On level-up: Nova 41 / Frost Nova 43 / Blaze 29 / Venom 23.'],
    dropSource: 'Unique monsters and bosses in high-level Hell areas', guide: 'An endgame socketable. Death-triggered facets are generally valued above level-up variants; 5/5 lightning facets are among the most valuable jewels.',
  },
  skill_grand_charms: {
    keyAttributes: ['+1 to a specific skill tree, such as Lightning Skills, Paladin Combat Skills, or Poison and Bone Skills', 'Premium suffix: +45 Life, available on charms from level 91+ monsters, including Baal, Diablo, and Nihlathak'],
    dropSource: 'Hell monsters; reroll using 3 Perfect Gems', guide: 'Carrying 7–8 skill grand charms substantially increases skill damage. Lightning, Paladin Combat, and Poison and Bone skillers are particularly valuable.',
  },
};

export function propInEnglish<T extends { id: string }>(item: T): T {
  return { ...item, ...translations[item.id] };
}
