export interface QuestEnData {
  givenBy: string;
  location: string;
  rewardValue?: string;
  rewardDesc?: string;
  summary: string;
  walkthrough: string[];
  tacticalTips: string;
}

export const QUESTS_EN: Record<string, QuestEnData> = {
  act1_q1: {
    givenBy: "Akara",
    location: "Blood Moor",
    rewardValue: "+1 Skill Point & Respec",
    rewardDesc: "+1 Skill Point and 1 Free Stat/Skill Respec from Akara!",
    summary: "Clear all 66 demons lurking within the Den of Evil in the Blood Moor to cleanse the wilderness.",
    walkthrough: [
      "Head out of Rogue Encampment into the Blood Moor and locate the Den of Evil cave entrance.",
      "Slay every monster inside. When 5 or fewer remain, the quest log displays the remaining counter.",
      "Defeat the last monster; the cave fills with divine light. Return to Akara to claim your reward."
    ],
    tacticalTips: "Watch out for Fallen Shamans resurrecting Fallen continuously. Prioritize killing the Shamans first to prevent endless respawns."
  },
  act1_q2: {
    givenBy: "Kashya",
    location: "Burial Grounds",
    rewardValue: "Rogue Archer Mercenary",
    rewardDesc: "Free Act I Rogue Archer Mercenary and ability to hire replacements from Kashya.",
    summary: "Defeat Blood Raven, a fallen Rogue captain who is raising undead beneath the Burial Grounds.",
    walkthrough: [
      "Follow the path from Cold Plains to the Burial Grounds graveyard.",
      "Engage Blood Raven amidst swarming zombies and skeletons.",
      "Eliminate Blood Raven, then return to Kashya in town."
    ],
    tacticalTips: "Blood Raven is extremely fast and fires fire arrows. Use ranged skills or trap her against obstacles to avoid her zombie summons."
  },
  act1_q3: {
    givenBy: "Akara",
    location: "Dark Wood & Tristram",
    rewardValue: "Deckard Cain Free Identify",
    rewardDesc: "Free item identification by Deckard Cain in town across all acts!",
    summary: "Retrieve the Inifuss Scroll from Dark Wood, touch the Cairn Stones in Stony Field, and rescue Deckard Cain from burning Tristram.",
    walkthrough: [
      "Pass through the Underground Passage into Dark Wood and find the Tree of Inifuss.",
      "Take the Bark to Akara in town to receive the stone portal decipher sequence.",
      "Touch the 5 Cairn Stones in Stony Field in sequence to open the red portal to Tristram.",
      "Free Cain from his hanging gibbet cage in Tristram town square."
    ],
    tacticalTips: "Retrieve Wirt's Leg from the northwest corner of Tristram for creating the Secret Cow Level later. Beware Griswold's cursed attacks."
  },
  act1_q4: {
    givenBy: "Tome in Stony Field",
    location: "Black Marsh",
    rewardValue: "Runes & Countess Drop",
    rewardDesc: "Countess dedicated rune drops (up to Lo #28 / Key of Terror).",
    summary: "Descend into the Forgotten Tower in the Black Marsh and slay The Countess in Level 5.",
    walkthrough: [
      "Locate the ruined Forgotten Tower in the Black Marsh.",
      "Fight through 5 dungeon levels down to the Countess's chamber.",
      "Defeat The Countess and claim the treasure chest overflowing with runes and gold."
    ],
    tacticalTips: "The Countess is the cornerstone of early-game rune farming (Stealth, Leaf, Lore) and endgame Key of Terror runs."
  },
  act1_q5: {
    givenBy: "Charsi",
    location: "Barracks",
    rewardValue: "Charsi Imbue (Normal to Rare)",
    rewardDesc: "Imbue one normal white item into a high-tier rare item with randomized affixes.",
    summary: "Infiltrate the Monastery Barracks, retrieve the Horadric Malus hammer, and return it to blacksmith Charsi.",
    walkthrough: [
      "Proceed into the Monastery Cloister and enter the Barracks.",
      "Defeat The Smith guarding the anvil and retrieve the Horadric Malus.",
      "Return the Malus to Charsi in Rogue Encampment."
    ],
    tacticalTips: "Save your Imbue reward for character Level 83+ to craft top-tier diadems or class circlets with +2 skills and faster cast rate."
  },
  act1_q6: {
    givenBy: "Deckard Cain",
    location: "Catacombs Level 4",
    rewardValue: "Access to Act II",
    rewardDesc: "Defeat Andariel and travel east with Warriv's caravan to Lut Gholein.",
    summary: "Descend into the deepest depths of the Monastery Catacombs to slay Andariel, Maiden of Anguish.",
    walkthrough: [
      "Explore Catacombs Levels 1 through 4 beneath the Monastery.",
      "Clear the front chamber of Catacombs 4 before opening the double doors to Andariel.",
      "Slay Andariel, speak with townspeople, and talk to Warriv to journey East."
    ],
    tacticalTips: "Andariel has -50% Fire Resistance but deals massive Poison damage. Drink Antidote Potions beforehand to raise Poison Resistance to 85%."
  },
  act2_q1: {
    givenBy: "Atma",
    location: "Sewers Level 3",
    rewardValue: "+1 Skill Point & Merchant Discount",
    rewardDesc: "Book of Skill (+1 Skill Point) and permanent vendor price discount in Lut Gholein.",
    summary: "Hunt down Radament beneath the city sewers to avenge Atma's slain family.",
    walkthrough: [
      "Enter the Sewers via the Lut Gholein trapdoor near Greiz or the docks.",
      "Navigate to Sewers Level 3 and confront Radament the Greater Mummy.",
      "Pick up the Book of Skill and the Horadric Scroll from his chest."
    ],
    tacticalTips: "Right-click the Book of Skill to immediately claim +1 Skill Point. Radament revives skeletons; focus burst damage on him."
  },
  act2_q2: {
    givenBy: "Deckard Cain",
    location: "Dry Hills, Far Oasis, Claw Viper Temple",
    rewardValue: "Horadric Cube",
    rewardDesc: "Horadric Cube 2x2 portable transmuting engine and 12-slot extra storage.",
    summary: "Assemble the Horadric Staff by retrieving the Cube, Staff of Kings, and Viper Amulet.",
    walkthrough: [
      "Retrieve the Horadric Cube from Halls of the Dead Level 3 in the Dry Hills.",
      "Retrieve the Staff of Kings from Sand Maggot Lair Level 3 in Far Oasis.",
      "Retrieve the Claw Viper Amulet from Claw Viper Temple Level 2 in Lost City.",
      "Transmute Staff + Amulet inside the Horadric Cube to forge the Horadric Staff."
    ],
    tacticalTips: "Maggot Lair has single-file tunnels; use Traps, Bone Spear, or Teleport charges. In Claw Viper Temple, watch for charging bone snakes."
  },
  act2_q3: {
    givenBy: "Drognan",
    location: "Claw Viper Temple",
    rewardValue: "Taint Sun Lifted",
    rewardDesc: "Lifts the unnatural eclipse darkness across the desert and grants Palace access.",
    summary: "Investigate the magical darkness plaguing the desert and shatter the Tainted Sun altar.",
    walkthrough: [
      "Travel from Lost City to the Valley of Snakes and enter Claw Viper Temple.",
      "Fight through Level 2 to the serpent altar in the center.",
      "Smash the Tainted Sun Altar to restore daylight and obtain the Viper Amulet."
    ],
    tacticalTips: "Fangskin guards the altar with lightning enchantment and fast knockback charges. Stay back and use crowd control."
  },
  act2_q4: {
    givenBy: "Drognan",
    location: "Arcane Sanctuary",
    rewardValue: "Tomb of Tal Rasha Glyph",
    rewardDesc: "Reveals the true symbol of Tal Rasha's Tomb among the 7 ancient tombs.",
    summary: "Explore the Palace Cellars and step through the portal into the mystical Arcane Sanctuary.",
    walkthrough: [
      "Talk to Jerhyn to enter the Palace Cellars beneath Lut Gholein.",
      "Reach Palace Cellar Level 3 and step into the blue portal into Arcane Sanctuary.",
      "Search the 4 branches to locate The Summoner and Horazon's Journal."
    ],
    tacticalTips: "The Arcane Sanctuary has 4 dead-end directions. Slaying The Summoner reveals the missing true tomb symbol."
  },
  act2_q5: {
    givenBy: "Automatic Trigger",
    location: "Canyon of the Magi",
    rewardValue: "Canyon Portal Access",
    rewardDesc: "Unlocks the red portal to the Canyon of the Magi and the 7 Tombs of Tal Rasha.",
    summary: "Slay The Summoner who has usurped Horazon's sanctum and read his cosmic journal.",
    walkthrough: [
      "Confront The Summoner atop his platform in Arcane Sanctuary.",
      "Slay him and click Horazon's Journal to open the portal to the Canyon of the Magi."
    ],
    tacticalTips: "The Summoner casts Fire Wall and Glacial Spike but has fragile HP. Rush him down quickly before he finishes his spells."
  },
  act2_q6: {
    givenBy: "Jerhyn",
    location: "Tomb of Tal Rasha",
    rewardValue: "Access to Act III",
    rewardDesc: "Defeat Duriel, free Tyrael, and sail across the Twin Seas to Kurast.",
    summary: "Enter the True Tomb of Tal Rasha, place the Horadric Staff into the orifice, and vanquish Duriel, Lord of Pain.",
    walkthrough: [
      "Check your Quest Log for the correct True Tomb glyph in Canyon of the Magi.",
      "Locate the orifice inside the True Tomb and insert the completed Horadric Staff.",
      "Enter the Burial Chamber, slay Duriel, and converse with Archangel Tyrael."
    ],
    tacticalTips: "Duriel has Holy Freeze aura and devastating charge attacks. Drink Thawing Potions beforehand to raise Cold Resistance to 85%."
  },
  act3_q1: {
    givenBy: "Unique monster in Flayer Jungle",
    location: "Spider Forest to Great Marsh",
    rewardValue: "+20 Permanent Life",
    rewardDesc: "Potion of Life from Alkor granting +20 Permanent Maximum Life!",
    summary: "Recover the Golden Bird statuette of Ku Y'leh and present it to alchemist Alkor.",
    walkthrough: [
      "Defeat the first unique champion pack encountered in Spider Forest or Great Marsh.",
      "Pick up A Jade Figurine and show it to Meshif at the docks.",
      "Take the Golden Bird to Alkor in Kurast Docks and consume the Potion of Life."
    ],
    tacticalTips: "Right-click the Potion of Life in your inventory to instantly and permanently boost your health pool by +20."
  },
  act3_q2: {
    givenBy: "Ormus",
    location: "Flayer Jungle",
    rewardValue: "Rare Ring & Gidbinn Fire Ward",
    rewardDesc: "Rare Ring from Ormus and protective ward erected over Kurast Docks.",
    summary: "Find the sacred ceremonial dagger The Gidbinn in the Flayer Jungle to protect the docks.",
    walkthrough: [
      "Locate the Gidbinn altar in a Flayer village within Flayer Jungle.",
      "Activate the altar and defeat the unique pack that ambushes you.",
      "Pick up The Gidbinn dagger and return it to Ormus at the docks."
    ],
    tacticalTips: "Ormus awards a rare ring. The item level of the ring scales with your character level."
  },
  act3_q3: {
    givenBy: "Alkor",
    location: "Ruined Temple in Kurast Bazaar",
    rewardValue: "+5 Stat Points",
    rewardDesc: "Lam Esen's Tome granting +5 Permanent Free Attribute Points!",
    summary: "Retrieve the Black Book of Lam Esen from the Ruined Temple beneath Kurast Bazaar.",
    walkthrough: [
      "Enter the Kurast Bazaar and locate the Ruined Temple staircase.",
      "Descend and defeat Battlemaid Sarina and her Flesh Hunters.",
      "Pick up Lam Esen's Tome from the podium and return it to Alkor."
    ],
    tacticalTips: "The Ruined Temple entrance is notoriously cramped with high-speed monsters right at the stairs. Have town portals ready."
  },
  act3_q4: {
    givenBy: "Deckard Cain",
    location: "Spider Cavern, Flayer Dungeon, Sewers",
    rewardValue: "Khalim's Will Flail",
    rewardDesc: "Forge Khalim's Will flail to smash the Compelling Orb in Travincal.",
    summary: "Gather Khalim's Eye, Brain, and Heart across Kurast, and forge Khalim's Will with his flail.",
    walkthrough: [
      "Eye: Spider Cavern in Spider Forest.",
      "Brain: Flayer Dungeon Level 3 in Flayer Jungle.",
      "Heart: Kurast Sewers Level 2 beneath Bazaar/Upper Kurast.",
      "Transmute the three organs with Khalim's Flail in the Horadric Cube."
    ],
    tacticalTips: "Make sure you enter Spider Cavern (not Arachnid Lair). Arachnid Lair is an alvl 85 farming zone without the quest chest."
  },
  act3_q5: {
    givenBy: "Ormus",
    location: "Travincal",
    rewardValue: "Compelling Orb Smashed",
    rewardDesc: "Shatters the Compelling Orb and opens the stairs to Durance of Hate.",
    summary: "Confront and destroy the corrupted High Council of Zakarum in the sacred city of Travincal.",
    walkthrough: [
      "Cross into Travincal and approach the temple pavilion.",
      "Eliminate Ismail Vilehand, Geleb Flamefinger, and Toorc Icefist.",
      "Equip Khalim's Will, strike the Compelling Orb, and descend into Durance of Hate."
    ],
    tacticalTips: "The High Council casts multiple Hydras and has strong elemental enchantments. Lure them out of the temple one at a time."
  },
  act3_q6: {
    givenBy: "Ormus",
    location: "Durance of Hate Level 3",
    rewardValue: "Access to Act IV",
    rewardDesc: "Mephisto's Soulstone and red portal leading directly to the Pandemonium Fortress.",
    summary: "Descend into the heart of the Durance of Hate and slay Mephisto, Lord of Hatred.",
    walkthrough: [
      "Navigate Durance of Hate Levels 1 through 3.",
      "Cross the central blood river in Level 3 and engage Mephisto.",
      "Slay Mephisto, loot his Soulstone, and cross the bone bridge through the Red Portal."
    ],
    tacticalTips: "Sorceresses can moat-trick Mephisto across the blood canal with Blizzard or Meteor without taking any return damage."
  },
  act4_q1: {
    givenBy: "Tyrael",
    location: "Plains of Despair",
    rewardValue: "+2 Skill Points",
    rewardDesc: "Free Izual's tortured soul for +2 Permanent Skill Points from Tyrael!",
    summary: "Find the fallen angel Izual in the Plains of Despair and release his tortured spirit.",
    walkthrough: [
      "Leave Pandemonium Fortress through the Outer Steppes into Plains of Despair.",
      "Locate Izual wielding his demonic greatsword.",
      "Defeat Izual, listen to his grim confession, and return to Tyrael in town."
    ],
    tacticalTips: "Izual has massive HP and Frost Nova but low damage. An essential quest providing +2 permanent skill points."
  },
  act4_q2: {
    givenBy: "Deckard Cain",
    location: "River of Flame",
    rewardValue: "Hellforge Runes & Gems",
    rewardDesc: "Hellforge Rune drop (up to Gul #25 in Hell) and perfect gems.",
    summary: "Take Mephisto's Soulstone to the Hellforge on the River of Flame and smash it with the Hellforge Hammer.",
    walkthrough: [
      "Reach the River of Flame and locate the Hellforge platform.",
      "Defeat Hephasto the Armorer and pick up the Hellforge Hammer.",
      "Equip the hammer, place the Soulstone on the anvil, and strike it 3 times."
    ],
    tacticalTips: "Hellforge in Hell difficulty drops runes from Hel (#15) up to Gul (#25), serving as a crucial early wealth spike."
  },
  act4_q3: {
    givenBy: "Tyrael",
    location: "Chaos Sanctuary",
    rewardValue: "Diablo Defeated & Act V Access",
    rewardDesc: "Defeat Diablo, open the path to Mount Arreat, and earn your difficulty title.",
    summary: "Infiltrate the Chaos Sanctuary, unlock all 5 seals, and defeat Diablo, Lord of Terror.",
    walkthrough: [
      "Clear the Chaos Sanctuary and activate the 5 seals (Grand Vizier, Infector, Lord De Seis).",
      "Confront Diablo when he emerges in the center star pentagram.",
      "Slay Diablo and talk to Tyrael to open the portal to Harrogath."
    ],
    tacticalTips: "Dodge Diablo's Red Lightning Hose by running in circles around him. High fire and lightning resistances are mandatory."
  },
  act5_q1: {
    givenBy: "Larzuk",
    location: "Bloody Foothills",
    rewardValue: "Larzuk Socketing (Max Sockets)",
    rewardDesc: "Larzuk guarantees maximum possible sockets on normal items or 1-2 on magic/rare/uniques.",
    summary: "Ascend the Bloody Foothills and execute Shenk the Overseer to break the demonic siege of Harrogath.",
    walkthrough: [
      "Step out of Harrogath into the Bloody Foothills.",
      "Fight your way to the top of the ramparts to locate Shenk the Overseer.",
      "Slay Shenk; catapults explode and rain fire. Return to Larzuk for your socket reward."
    ],
    tacticalTips: "Larzuk socketing is irreplaceable! Use it for Monarch (4 sockets for Spirit) or elite ethereal polearms."
  },
  act5_q2: {
    givenBy: "Qual-Kehk",
    location: "Frigid Highlands",
    rewardValue: "Barbarian Mercenary & Runes",
    rewardDesc: "Tal + Ral + Ort runes (Ancient's Pledge shield) and ability to hire Act V Barbarians.",
    summary: "Rescue 15 captured Barbarian soldiers trapped in wooden stockades throughout the Frigid Highlands.",
    walkthrough: [
      "Explore the Frigid Highlands and locate 3 wooden prison stockades (5 barbarians each).",
      "Destroy the wooden doors to release the captive soldiers.",
      "Return to Qual-Kehk in Harrogath to claim your reward runes."
    ],
    tacticalTips: "Combine Ral + Ort + Tal into a 3-socket shield for Ancient's Pledge (+48% Fire/Light/Psn, +43% Cold Res) for instant survivability."
  },
  act5_q3: {
    givenBy: "Malah",
    location: "Frozen River",
    rewardValue: "+10 Permanent All Resistances",
    rewardDesc: "Scroll of Resistance from Malah granting +10 Permanent All Resistances!",
    summary: "Venture into the Frozen River beneath the Crystalline Passage and rescue Anya from Nihlathak's ice curse.",
    walkthrough: [
      "Descend into Crystalline Passage and enter the Frozen River.",
      "Locate Anya encased in ice, guarded by Frozenstein.",
      "Return to Malah in town for the Thawing Potion, apply it to Anya, and read Malah's Scroll."
    ],
    tacticalTips: "Right-click the Scroll of Resistance in your inventory to permanently increase all elemental resistances by +10."
  },
  act5_q4: {
    givenBy: "Anya",
    location: "Halls of Vaught",
    rewardValue: "Item Personalization & Anya Shop",
    rewardDesc: "Personalize an item with your character's name and open Anya's red portal.",
    summary: "Pursue traitor Nihlathak into the Halls of Vaught and stop him before he surrenders the Relic to Baal.",
    walkthrough: [
      "Step into Anya's red portal into Halls of Anguish, Pain, and Vaught.",
      "Search the 4 branches of Halls of Vaught to find Nihlathak.",
      "Eliminate Nihlathak and return to Anya in Harrogath."
    ],
    tacticalTips: "Nihlathak casts lethal Corpse Explosion. Wear Nature's Peace ('Slain Monsters Rest in Peace') to neutralize corpse detonation."
  },
  act5_q5: {
    givenBy: "Qual-Kehk",
    location: "Arreat Summit",
    rewardValue: "Massive Experience & Level Up",
    rewardDesc: "One-time massive experience burst from the Ancients and passage into Worldstone Keep.",
    summary: "Ascend to the Arreat Summit and prove your worth to the three Barbarian Ancients: Talic, Madawc, and Korlic.",
    walkthrough: [
      "Pass through the Ancients' Way to reach Arreat Summit.",
      "Click the Heavenly Altar to awaken the three golden statues.",
      "Defeat all three Ancients without opening a Town Portal (opening a portal resets the trial).",
      "The massive gates to Worldstone Keep unlock."
    ],
    tacticalTips: "Never open a Town Portal during battle or the Ancients will fully heal and turn back to stone! Drop potions on the ground beforehand."
  },
  act5_q6: {
    givenBy: "Qual-Kehk",
    location: "Worldstone Chamber",
    rewardValue: "Game Completion & Title",
    rewardDesc: "Defeat Baal, destroy the corrupted Worldstone, and earn your glorious Ladder title!",
    summary: "Storm the Throne of Destruction, clear Baal's five minion waves, and slay Baal, Lord of Destruction.",
    walkthrough: [
      "Fight through Worldstone Keep Levels 1 to 3 into the Throne of Destruction.",
      "Clear the chamber and defeat all 5 minion waves summoned by Baal.",
      "Follow Baal through the portal into the Worldstone Chamber and destroy him.",
      "Speak with Archangel Tyrael to witness the Worldstone's destruction and finish the game."
    ],
    tacticalTips: "Baal's fifth wave (Lister the Tormentor) is fast and hits hard. Lure them outside the throne room to bypass them if undergeared."
  }
};

export const WORLD_EVENTS_EN: Record<string, { trigger: string; location: string; rewards: string[]; guide: string }> = {
  diablo_clone: {
    trigger: "Server or single-player sold sufficient Stones of Jordan (SOJ) reaching 'Diablo Walks the Earth!'",
    location: "Replaces the first Superunique monster encountered in Hell difficulty (e.g. Rakanishu in Stony Field, Corpsefire, Pindleskin)",
    rewards: [
      "Annihilus Unique Small Charm: +1 All Skills / +10-20 All Attributes / +10-20 All Resistances / +5-10% Bonus Experience!"
    ],
    guide: "Diablo Clone has massive health and rapid regeneration. Hit him once with Prevent Monster Heal gear to halt his regen, then use a Smiter Paladin with Crushing Blow and Life Tap to take him down cleanly."
  },
  uber_tristram: {
    trigger: "Transmute 3 sets of Keys (Terror + Hate + Destruction) in Hell Harrogath to open 3 mini-portals, gather 3 organs, and transmute them into the final red portal!",
    location: "Uber Tristram",
    rewards: [
      "Hellfire Torch Large Charm: +3 Random Class Skills / +10-20 All Attributes / +10-20 All Resistances / 25% Chance to cast Firestorm on attack!",
      "Standard of Heroes: Symbolic trophy of conquering the Pandemonium Event."
    ],
    guide: "Uber Tristram is guarded by three Prime Evils: Lv20 Conviction (-125 All Res) Uber Mephisto, minion-summoning Uber Baal, and Armageddon Uber Diablo! Hug the lower ruins to pull Mephisto out solo first."
  },
  secret_cow_level: {
    trigger: "After defeating Baal in the current difficulty, retrieve Wirt's Leg from Tristram, transmute with Tome of Town Portal in Rogue Encampment.",
    location: "The Secret Cow Level",
    rewards: [
      "Premier white and ethereal runeword bases (Phase Blades, Archon Plates, Monarchs, Eth Threshers)",
      "High Runes (Zod, Cham, Jah, Ber)",
      "Charms and Jewels"
    ],
    guide: "Sanctuary's highest monster density! D2R removed the ancient penalty for killing the Cow King—feel free to slay the Cow King every run. Legendary for Javazons and CE Necros."
  },
  terror_zones: {
    trigger: "Unlocks permanently across all difficulty modes after defeating Baal. Rotates every hour.",
    location: "Rotates hourly across Sanctuary (e.g. Terrorized Chaos Sanctuary, Cow Level, Tal Rasha's Tombs, The Pit)",
    rewards: [
      "Sundering Charms (Sunder Charms breaking elemental/magic immunities down to 95%)",
      "Monster level scales up to Character Level + 2 (Champions +4, Bosses +5, capped at Level 99)",
      "TC87 top-tier loot dropped by any standard monster in high-level zones!"
    ],
    guide: "2.5's revolution for the Level 99 grind! No longer restricted to Chaos Sanctuary or Baal runs. Equip Sunder Charms to bypass monster immunities and level up anywhere."
  }
};
