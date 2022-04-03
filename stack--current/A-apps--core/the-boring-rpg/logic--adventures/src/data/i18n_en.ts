import { I18nMessages } from '@offirmo-private/ts-types'

const BAD_ADVENTURES: I18nMessages = {
	// https://www.thesaurus.com/browse/tired
	bad_s1: `🚫  You clicked too early!
You collapse from exhaustion 😵 , you lose all your energy⚡ !`,

	bad_s2: `🚫  You clicked too early!
You burn out 😵 , you lose all your energy⚡ !`,

	// monsters
	bad_m1: `🚫  You clicked too early!
You fall asleep and get eaten by a dragon 🐉 !
you lose all your energy 💀 !`,

	bad_m2: `🚫  You clicked too early!
You are drowsy during a critical fight and get eaten by a monster 🦖 !
you lose all your energy ☠️ !`,

	bad_m3: `🚫  You clicked too early!
You fall asleep and get sucked dry by a vampire 🧛‍♀️ !
you lose all your energy ⚰️ !`,

	bad_m4: `🚫  You clicked too early!
You fall asleep and get eaten by wolves 🐺 🐺 🐺 !
you lose all your energy 💀 !`,

	bad_m5: `🚫  You clicked too early!
You fall asleep and get eaten by ants 🐜 🐜 🐜 !
you lose all your energy ☠️ !`,

	bad_m6: `🚫  You clicked too early!
You fall asleep and get eaten by a spider 🕷 🕸 !
you lose all your energy 💀 !`,

	// environment
	bad_e1: `🚫  You clicked too early!
You fall asleep and get eaten by a carnivorous plant 🥀 !
you lose all your energy 💀 !`,

	bad_e2: `🚫  You clicked too early!
You fall asleep in a dark dungeon and freeze to death ❄️ !
you lose all your energy 💀 !`,

}

const FIGHT_ADVENTURES: I18nMessages = {
	fight_won_coins: `
You have defeated a {{encounter}} !{{br}}
You loot {{coin}} coins from its corpse.`,

	fight_won_loot: `
You have defeated a {{encounter}} !{{br}}
You loot a {{item}} from its corpse.`,

	fight_won_any: `
You have defeated a {{encounter}}!{{br}}
You perfected your {{attr_name}} during the fight: +{{attr}} {{attr_name}}!`,

	fight_observe: `
You encounter a wild {{encounter}} from afar!{{br}}
Fascinated, you observe it instead of attacking it.{{br}}
Its behaviour makes you think of new techniques. You gain +{{attr}} {{attr_name}}!`,

	// TODO follow target to resources?

	fight_lost_any: `
You were attacked and nearly killed by a {{encounter}} but you got away just before it was too late.{{br}}
You figured out techniques to flee more efficiently: +{{attr}} {{attr_name}}!`,

	fight_lost_shortcoming: `
You were attacked by a {{encounter}} and it didn’t end well... but you got away just before it was about to kill you.{{br}}
You reflect on your lack of {{attr_name}} in the fight and train hard: +{{attr}} {{attr_name}}!`,
}

const SCAVENGED_ORIGINAL_ADVENTURES: I18nMessages = {

	// scavenged from screens of the original game
	// slightly altered/enhanced/normalized
	bored_log: `
You are so bored, you punch a log for hours!
You gain +{{strength}} strength!`,

	caravan_success: `
You were hired to protect a caravan of merchants.
Your presence repels them, the caravan arrives at its destination, you gain {{coin}} coins!`,

	dying_man: `
A dying man on the street left you everything he had.
You gain {{coin}} coins!`,

	ate_bacon: `
You eat some delicious crispy bacon.
You gain +{{level}} level!`,

	/* too bland, please!
     ate_mushroom: `
You ate a mushroom.
You gained +{{level}} level!`,*/

	ate_zombie: `
You eat a zombie!
You gain +{{mana}} mana!`, // You felt adventurous and ate a severed zombie arm.

	refreshing_nap: `
You take a nap and feel refreshed.
You gain +{{health}} health!`,

	older: `
You feel a little older.
You just gained +{{level}} level!`,

	stare_cup: `
You stare really hard at a cup, and it almost moves!
You gain +{{mana}} mana!`,

	nuclear_fusion_paper: `
You write a paper on nuclear fusion.
You gain +{{wisdom}} wisdom!`,

	found_green_mushroom: `
You find a green mushroom.
You gain +{{level}} level!`,

	// from this round of player suggestions
	// https://www.reddit.com/r/boringrpg/comments/dloxe/event_messages/

	eaten_by_a_grue: `You have been eaten by a grue. You lose {{coin}} coins.`,

	walk_in_mordor: 'You simply walk into Mordor. You gain +{{agility}} agility.',

	jig: 'You see a guy doing a jig, and join him! +{{agility}} agility!',

	good_end: 'Oh, THAT end is the one you hit them with! +{{wisdom}} wisdom!',

	waterfall: 'You sit under a pounding waterfall. +{{health}} vitality!',

	meteor: 'A meteor JUST misses you! +{{luck}} luck!',

	weird_duck: 'Some weird duck is trying to swim in coins, so you take them! +{{coin}} coins!',

	last_quest: 'That last quest gave you just enough XP! Level Up!',

	busking: 'You wail on a guitar next to the inn, and it pays off! +{{token}} token!',

	best_meal: 'You eat the best meal you’ve ever had! +{{health}} health!',

	witch_riddle: 'You successfully solve a riddle from a witch. You gain +{{wisdom}} wisdom!',

	princess_castle: 'The princess was actually in this castle! +{{luck}} luck!',

	problem: `You have a problem? -{{coin}} coins.`,

	foreign_language: 'You learn a foreign language. +{{charisma}} charisma!',

	last_night: '…what happened last night? +{{luck}} luck!',

	chasm_leap: 'You successfully leap over a chasm! +{{agility}} agility!',

	luxurious_meal: `You cook the most luxurious meal! {{coin}} coins.`,

	donate: `You donate {{coin}} coins. You gain +{{token}} token.`,

	coffee: 'You drink a cup of coffee. +{{wisdom}} wisdom!',

	socks: `You buy some socks, {{coin}} gold.`,

	gold_nugget: 'You trip on a gold nugget: +{{coin}} gold!',

	pileup: `You get into a 3 horse pileup: {{coin}} gold!`,

	tavern: `You drink too much at the tavern, lose {{coin}} gold!`,

	magic_lamp: 'You stumble upon a magic lamp! You gain +{{luck}} luck!',

	rabbit_hole: 'You find out just how deep the rabbit hole goes. You gain +{{wisdom}} wisdom.',

	cat_out_tree: 'You help a little girl get her cat out a tree. You gain +{{agility}} agility!',

	green_food: 'You somehow survive eating green eggs and ham. You gain +{{health}} health!',

	wishing_well: 'You try your luck at the wishing well. You lose the coin.',

	conscripted: 'You are conscripted into the army, you gain +{{coin}} coins.',

	brigands: 'Waylayed by brigands, {{coin}} coins.',

	duke_rescue: 'You rescued a duke, you are rewarded +{{coin}} coins!',

	bribe: 'Bribed your way out of an arrest, {{coin}} coins.',

	doctor: 'Doctor prescribes leaches for your extreme case of evil vapors, {{coin}} coins.',

	gazebo: 'You were caught by a gazebo. You lost {{coin}} coins!',

	sock_drawer: 'You buy a drawer for all of your socks: {{coin}} coins.',

	flying_rat: 'A flying rat stole your hat! You replace it and lose {{coin}} coins.'
}

// from me, inferred and extended from the originals
const OFFIRMO_MUSHROOMS_AND_MISC: I18nMessages = {
	found_red_mushroom: `
You find a red mushroom and eat it.
You gained +{{health}} health!`,

	found_blue_mushroom: `
You find a blue mushroom and eat it.
You gained +{{mana}} mana!`,

	found_white_mushroom: `
You find a white mushroom and eat it.
You gained +{{strength}} strength!`,

	found_yellow_mushroom: `
You find a yellow mushroom and eat it.
You gained +{{agility}} agility!`,

	found_orange_mushroom: `
You find an orange mushroom and eat it.
You gained +{{charisma}} charisma!`,

	found_black_mushroom: `
You find a black mushroom and eat it.
You gained +{{wisdom}} wisdom!`,

	found_rainbow_mushroom: `
You find a glowing rainbow mushroom and eat it.
You gained +{{luck}} luck!`,
}

const OFFIRMO_INSPIRED_FROM_RPG_MEMES_FROM_THE_NET: I18nMessages = {

	// https://swordscomic.com/swords/VI/
	demon_king: `
You swear to defeat the demon king!{{br}}
The local hero pledges you his sword... and leaves you with it!{{br}}
Well, it’s loot: {{item}}`,

	// https://swordscomic.com/swords/IX/
	false_lake: `
A hand holding a sword emerges from the lake:
"take this blade and become the new king!"
As you reach out, the lake monster emerges and try to devour you: it’s a trap!{{br}}
You defeat it and find good loot from previous victims: {{item}}, +{{coin}} coins.
	`,

	// https://swordscomic.com/swords/XI/
	soul_weapon_pet_zombie: `
You attach a soul to your weapon (+1 enhancement) and keep the soul owner’s body as a pet zombie.{{br}}
The pet zombie’s aura increases your regeneration: +{{health}} heath!
	`,

	// https://swordscomic.com/swords/XII/
	class_master_sharpest_weapon: `
You ask your master: "What is the best weapon?".
She answers: "The most lethal weapon is your mind!".{{br}}
You’re not convinced, so you train instead of meditating.
You gain +{{attr}} {{attr_name}}!
	`,

	// https://swordscomic.com/swords/XIII/
	// racist towards dwarves TODO secret equipment door

	// https://swordscomic.com/swords/XVII/
	// demon board games

	// electricbunnycomics.com
	good_necromancer: `
You meet a child weeping over his dead hamster… Thanks to necromancy, you reanimate it as a hamster-zombie!
Oddly, the child cries even more while running away.{{br}}
Fortunately, you gain +{{agility}} agility while avoiding the stones thrown by the villagers.`,

	// dorkly
	talk_to_all_villagers: `
You spoke to everyone in the village leaving no quest unanswered!{{br}}
Although your head aches from discussing so much,
you gain +{{charisma}} charisma having met so many people!`,

	// DK
	fate_sword: `
To thank you for saving his wife and his children, a farmer offers you "Destiny",
the heirloom sword passed down in his family for generations.{{br}}
30 minutes later, the merchant buys it off you for only {{coin}} coins… some heirloom!`,

	// cad-comic.com
	rematch: `
You got beaten by a goblin!
In shame, you roam around the country, accepting quest after quest to train yourself before facing him again.{{br}}
Alas, he also trained and beats you again!
Well, the +{{level}} level is still useful…`,

	// paintraincomic.com
	// https://paintraincomic.com/comic/cemetery/
	useless: `
Arriving at the village, the mayor announces that the neighborhood is no longer dangerous.
The sorceress fell in love and no longer curses people.
The haunted cemetery was a pet cemetery, villagers are happy to have their companions back.
The giant is helping the farmers with their harvest.{{br}}
You feel useless and reflect on your place in the world. +{{wisdom}} wisdom!`,

	// memecenter.com
	escort: `
You are escorting an important NPC.
Frustratingly, if you walk, he’s faster than you.
However, if you run, you’re faster than him!
By strafing and running in circles, you manage
to stay close to him.{{br}}
+{{health}} health thanks to your efforts!`,

	// memecenter.com
	rare_goods_seller: `
You come across an old man with eccentric apparel.
Score! It’s a rare item seller!
He gives you a good price for a {{item}}.`,

	// memecenter.com
	progress_loop: `
You would need better gear to level up.
But you’d need to level up to get better gear.
Cruel dilemma!{{br}}
Fortunately, you find a {{item}} at the bottom of a well!`,

	// memecenter.com/motohorse
	idiot_bandits: `
Your name is whispered across the land since you slayed the dragon and defeated the sorceress.
Bandits ambush you, aiming for your wealth. For their folly!
They realize their mistake one moment
before your fireball incinerates them.
Fortunately, gold doesn’t burn: +{{coin}} coins!`,

	// don't remember the source for this one
	princess: `
"You won’t take back the princess!" yells the fearsome black mage,
as you reach his throne room.
You reassure him: you are only here for loot.{{br}}
He lets you help yourself to {{coin}} coins
and even enchants your weapon too!`,

	// DM of the ring
	bad_village: `
You reach a new village. There is no weapon shop.
No potion shop either! And no quests at the inn!!
What a useless village. At your call, lightning and meteors wipe out this place.
A good opportunity to practice your magic: +{{mana}} mana.`,

	// ?
	so_many_potions: `
The fight against the final boss was hard, very hard…
Most importantly, +{{strength}} strength for managing to control a pressing urge during the encounter after drinking 25 health potions !`,

	// https://www.instagram.com/p/BjnclTCAiEK/
	high_level_zone_1: `
You accidentally wander into a high level zone.
Unexpectedly, this challenges your limits and proves to be a good training: +{{attr}} {{attr_name}}!
	`,

	high_level_zone_2: `
You accidentally wander into a high level zone.
You quickly and horribly die after fleeing monsters for half an hour.
What did you expect?{{br}}
You go back to training and gain +{{attr}} {{attr_name}}.
	`,

	// https://starecat.com/the-witcher-looking-at-side-quest-meme/
	side_quests: `
	You get distracted by side quests again!
Hopefully the loot ({{coin}} coins) and preparation (equipment enhanced) will help in the final battle!
	`,

	// https://starecat.com/gandalf-tells-them-to-run-to-get-all-the-xp-on-the-balrog-and-level-up/
	balrog: 'You tell your party members to run then kill the balrog and get all the XP. You level up!',

	// classic manga story
	castle_summon: `
You are summoned to the castle by the king.
In the throne room, in front of the court, he pressures you:{{br}}
"Hero, you must defeat the demon lord to bring back peace in the land!
Take this magical sword, only with it can you defeat the evil ones!".{{br}}
Well, a new weapon is always welcome: {{weapon}}!
	`,

	// https://starecat.com/when-a-piece-of-armor-doesnt-match-your-current-set-but-its-stats-are-too-good-to-pass-up-hello-kitty-shield-pink/
	unmatched_set: `
You loot a powerful piece of armor but unfortunately its appearance doesn’t match with your existing ones...
No way, style is important for a hero! You sell this piece of armor for coin: +{{coin}} coins!`,

}

const OFFIRMO_INSPIRED_FROM_NET_RSRCS: I18nMessages = {

	// https://springhole.net/writing_roleplaying_randomators/rpg-campaign-idea.htm
	// https://www.seventhsanctum.com/generate.php?Genname=storygen
	// https://donjon.bin.sh/fantasy/adventure/

	// My potions would kill you traveler. You can’t handle my potions.

	// https://orteil.dashnet.org/gamegen
	bards: `
Bards start writing songs about you.
This fame helps you when dealing with humans.
You gain +{{charisma}} charisma!
`,
	elementals: `
You free some elementals. They reward you with a blessing suited to your class.
You gain {{attr}} {{attr_name}}!`,

	// you have superhuman luck
	fabric_of_reality: `
You battle mages to unravel the fabric of reality.
You gain +{{mana}} mana!`,

	// you destroy a few parallel worlds with cyborgs.
	// you mine ore
	// you craft some stuff

	save_world_again: `
You saved the world. Again. You are famous: +{{charisma}} charisma!{{br}}
But honestly, you and me know you are doing it only for the loot ;)
Indeed you gain a {{item}} and {{coin}} coins!`,
	clean_wizard_tower: `
You clean a mad wizard’s tower.{{br}}
You learn some of her magic: +{{mana}} mana!`,
	explore_ruins: `
You explore some ruins of an ancient civilisation the world.{{br}}
You find a {{item}} and worth {{coin}} of coins!`,
	inspect_sewers: `
You inspect the city’s sewers and clean the vermin.{{br}}
You find worth {{coin}} of coins and polish your skills: +{{attr}} {{attr_name}}!`,
	explore_catacombs: `
You explore the city’s old catacombs and put the undeads to rest.{{br}}
You find a {{item}} and worth {{coin}} of coins!`,
	bandits_punishment: `
You are attacked by bandits: They are in need of some punishment!.{{br}}
You promptly dispense it and loot {{coin}} coins from them.`,
}

const OFFIRMO_INSPIRED_FROM_INSTAGRAM_POSTS: I18nMessages = {

	// https://www.instagram.com/travisjhanson/
	// https://www.instagram.com/p/B_kXgz3hCcL/
	xxx_flammable_village: `
They should have told you that the village was flammable
BEFORE you started to clean out the infestation!
Those ungrateful villagers refuse to give you the promised reward.
But at least it was good XP! +1 level.
	`,
	// https://www.instagram.com/p/B-M2VTCB_ss/
	xxx_tomb_of_lost_socks: `
You found it: The Tomb of Lost Socks.
	`,
	// https://www.instagram.com/p/B9PCUWwBXuT/
	xxx_happy_dragon: `
The dragon is devastating the village,
but she looks so happy that you feel bad about interrupting.
`,
	// https://www.instagram.com/p/B8OzcWdhIOp/
	xxx_drink_me: `
You find a potion written "drink me".
`,
	// https://www.instagram.com/p/B6-78D1h62g/
	xxx_you_shall_not_pass: `
`,
	// https://www.instagram.com/p/B63PD7IB4uT/
	xxx_customize_gear: `
	`,
	// https://www.instagram.com/p/B6TEffgB8r2/
	xxx_potion_of_blowing: `
An alchemist is selling a new king of potions: explosive one!
They work quite well! You solo a dungeon with them.
Too bad they blow the ennemy, the loot and a bit of yourself.
But your pain resistance increased!
	`,
	// https://www.instagram.com/p/B6BCnUNBcw0/
	xxx_dragon_admirer: `
Dragong... how can't you love such beautiful creatures?
	`,
	// https://www.instagram.com/p/B5FzGvxhMSx/
	evil_laugh: `
The villain give you some tips to improve your evil laugh.
+1 charisma
	`,
	hero_smile: `
In front of a mirror, you practice your hero smile.
+1 charisma`,
	// https://www.instagram.com/p/B4xPBEYhO_x/
	bg_music: `
You manage to create a sound spell to play heroic music when you fight.
It raises your morale and make you stronger!
	`,
	// https://www.instagram.com/p/B4Ke6_gBpSv/
	xxx_body_parts: `
Since you started to learn necromancy,
your dungeon runs are more efficient: you salvage body parts as well!
You make good progress in necromancy.`,
	// https://www.instagram.com/p/B37LIlXhaf8/
	owlbear: `
You encounters a friendly owlbear.
He teaches you wisdom.
	`,
	// https://www.instagram.com/p/B3VJ0D2hbyJ/
	book_hobbit_riddles: `
You find a book about Hobbit's riddles.
That can be useful in the future! Your wisdom increased.
`,
	xxx_book_lost_treasures: `
	`,
	xxx_book_wealth_planning: `
	`,
	// https://www.instagram.com/p/B3HlHD8hAZM/
	book_excuses_dragon: `
You find a book listing excuses for when you are caught by a dragon (stealing some treasure?)
They are mainly flattery-based. Your charisma increases!
	`,
	// https://www.instagram.com/p/B21fhJmhuZQ/
	xxx_gift_of_friendship: `
	`,
	// https://www.instagram.com/p/B2MPyBfhLgR/
	xxx_book_smart: `
	`,
	// https://www.instagram.com/p/B1_VJq3BBR-/
	xxx_in_doubt_fireball: `
	`,
	// (780)



	// TODO RPG hooks Instagram

	// https://www.instagram.com/p/BorAmImhT-f/
	xxx_save_village_no_money: `
"Please hero, save our village! We have no money but you are our only hope!"
	`,

	// https://www.instagram.com/p/BozHAjkBGVt/
	xxx_odd_boy: `
"A small child asks you to help him find his lost kitty.
As you and the child search the forest you find his pet,
beast
	`,

	// https://www.instagram.com/p/BoyqXBVhjSa/
	// archer skeleton

	// https://www.instagram.com/p/BkkgGyiH5X-/?saved-by=theboringrpg
	magical_cooking_ragnaros: `
You try magical cooking but end up summoning a tiny Ragnaros in your frying pan!{{br}}
You keep this avatar as a pet. His aura gives you +{{strength}} strength!
	`,

	// https://www.instagram.com/p/BorYMavBG3s/
	xxx_fancy_arrows: `
	You
	`,

	// https://www.instagram.com/p/Boo4jwRBe6D/
	// rule them like gods!

	// https://www.instagram.com/p/BodLbb0hTvw/
	// big festival

	// https://www.instagram.com/p/BoMOPU4h8VH/
	// need help to get down

	// https://www.instagram.com/p/Bl6cKIghQxY/
	// hit first

	// https://www.instagram.com/p/Bkg3XsChrfw/

	// https://www.instagram.com/p/Bi1yE_3hBdn/

	// https://www.instagram.com/p/BiroNNUhFkE/

	// https://www.instagram.com/p/BiUzisIBfoU/

	// https://www.instagram.com/p/BhFS4-FAquN/

	// https://www.instagram.com/p/BowGNzChB-U/?utm_source=ig_web_button_share_sheet
	xxx_guarding_dungeon: `
You are so effective at raiding his dungeon
that the dark necromancer offers you gold to guard it instead.
You would be using your experience to keep other adventurers from looting it!
	`,

	// slackwirm:

	// https://www.joshuawright.net/slack-wyrm-012.html
	// "I am the Wise Wisewood Tree and I possess uncanny wisdom
	wise_wisewood_tree: `
You meet the Wise Wisewood Tree:
"I am the Wise Wisewood Tree and I possess uncanny wisdom".
Indeed, the talking tree impart you some: +{{wisdom}} wisdom.
		`,

	// https://www.joshuawright.net/slack-wyrm-017.html
	//you the dragon having tea with the rabbits His reputation is crushed.

	// https://www.joshuawright.net/slack-wyrm-026.html
	// the giant eye of Agoroth

	// https://www.joshuawright.net/slack-wyrm-030.html
	// guilt anxiety

	// princess with woodland friends
	// having to spot the real princess
	// https://www.joshuawright.net/slack-wyrm-031.html

	// hallowed dragonspear
	// https://www.joshuawright.net/slack-wyrm-034.html

	// village of Spuddy
	// https://www.joshuawright.net/slack-wyrm-042.html

	// https://www.joshuawright.net/slack-wyrm-059.html
	// Zizok the wizard
	// they weren’t my friends,they were just using me for my spells

	// https://www.joshuawright.net/slack-wyrm-066.html
	// dragon stole the wedding cake

	// https://www.joshuawright.net/slack-wyrm-072.html
	// Linda Greenslime

	//the country of Doily
	// 99

	// https://www.joshuawright.net/slack-wyrm-158.html
	// The sulking swamp
	// butthurt bog

	// https://www.comic-rocket.com/read/bunny/28
	// Bunthulhu

	// https://www.instagram.com/p/Bi5QlAeAAlx/
	murderer: `
You are accused of murder and the guards try to arrest you! You refuse, they insist and you kill them all.
Nobody is after you anymore, that was an effective way to prove your innocence!{{br}}
You gain +{{luck}} luck!
	`,
}

const OFFIRMO_INPIRED_FROM_VIDEOGAMES: I18nMessages = {

	// LOTRO
	visual_effect: `
You pay an enchanter to add a cool visual effect on your equipment!
	`,
	weapon_damage_type: `
You get your weapon reforged into old elven alloy.
This makes it sharper against orcs... and dwarves?
	`,

	// TODO always winter

	// Marvel reference
	give_a_shield: `
The captain of the assieged castle yells: "Give this hero a shield!"{{br}}
The blacksmith obey: you receive a {{item}}!
`,

	// cookie clicker
	cookies_grandmas: `
A group of strange grandmas bake you cookies.
They are incredibly good and make you crave for more!
They have a magical effect: you gain +{{attr}} {{attr_name}}!
	`,

	// Zelda reference
	treasure_in_pots: `
You enter a pottery shop and destroy every jug, vase and item in the store.
You collect +{{coin}} in coins, precious stones and other treasures found!`,

	// Oblivion dangerous chicken
	chicken_slayer: `
You enter a village and see a chicken roaming in a garden peacefully.
You slay the chicken mercilessly.
The entire cohort of guards for the town come after you and you are forced to slay them too.
After hours of fighting you gain +{{strength}} strength!`,

	// skyrim meme
	arrow_in_the_knee: `
A guard tells you stories of when he was an adventurer,
before he took an arrow in the knee.
You feel enlightened: +{{wisdom}} wisdom!
		`,

	// inspired by morrowind's level up messages
	// https://www.reddit.com/r/Morrowind/comments/1s1emv/i_find_the_levelup_messages_very_inspirational/
	// TODO

	// WoW / 1st quest (+ a meme somewhere)
	sentients_killing: `
You introduce yourself to the captain of the guard. Your mission: kill 10 kobolds.
After a brief hesitation on the ethics of the extermination of thinking creatures, you accept: you need loot and XP too badly.
You gain {{coin}} coins and +{{attr}} {{attr_name}}.
		`,

	// Colossal Cave Adventure
	// https://rickadams.org/adventure/d_hints/index.html
	colossal_cave: `
You discover and explore a colossal cave! Undeads, goblins...
You emerge victoriously, with loot ({{item}}) and experience (+{{attr}} {{attr_name}})!
		`,
	// https://rickadams.org/adventure/d_hints/hint009.html
	colossal_cave_maze: `
You explore yet another cave.
You are in a maze of twisty little passages, all alike.
You find a {{item}} on the ground and manage to find an exit after a while.
`,
	// You are in a twisty maze of passageways, all different,

	// nethack
	gehennom: `
You enter the dark Cavities of Gehennom. You don’t find the Amulet of Yendor,
but still ends up with good loot: +{{coin}} coins, {{item}}...
		`,
	// TODO book of Tyr
	// TODO Amulet of Yendor

	// Exile / Avernum
	exile_GIFTS: `
You meet a tribe of Giant, Intelligent, Friendly, Talking Spiders.
They’re shy and all respond to the name "Spider".{{br}}
You buy poison from them and coat your weapon with it, providing a good enhancement!
	`,

	// Ultima
	// Wizardry
	// TODO prestige classes

	// Dragon quest
	DQ_good_slime: `The slime speaks to you: «I’m not a bad slime, you know?»{{br}}
What a stupid statement: obviously slimes are monsters! You slaughter it and many others.{{br}}
This training earns you +{{attr}} {{attr_name}}!`,

	// misc
	socketed_item: `
You put magic gems in one of you item's socket. It is now stronger!`,
}

const OFFIRMO_INSPIRED_FROM_MANGAS: I18nMessages = {
	guild_rank: `
The Adventurer's Guild recognize your recent level increases
and promotes you to the next ranking!`,

	runes: `
You have a piece of your equipment engraved with magic runes.
It is now stronger!
`
}

const OFFIRMO_INSPIRED_BY_POPULAR_CULTURE: I18nMessages = {

	// Atlantis is calling

	drown_in_holy_water: `
You nearly drown yourself in holy water. You gain +{{mana}} mana!
	`,

	rings_of_power: `
You forge rings and give them to you dwarven, elven and human allies.
They now like you a bit more: +{{charisma}} charisma!
	`,

	raining_elves: `
It’s raining... elves?{{br}}
You gain +{{mana}} mana!`,

	raining_dwarves: `
It’s raining... dwarves?{{br}}
You gain +{{strength}} strength!`,

	// Top Gun
	need_for_speed: `
You feel the need…{{br}}
…the need for speed!{{br}}
+{{agility}} agility!
`,

	// TODO dungeons

	// TODO Shrek

	// goblin slayer
	xxx_goblin_slayer: `
"The only good goblins are the one who never come out of their stinking holes!"
	`,

	// Conan movie https://conan.wikia.com/wiki/The_Riddle_of_Steel
	riddle_of_steel: `
You solve the riddle of steel; Obviously it’s more steel! And stronger steel!{{br}}
You have a blacksmith reforge your equipment to enhance it.`,
	// TOTO tree of woe, eat a vulture https://conan.wikia.com/wiki/Tree_of_Woe

	// classic tales
	sword_in_rock: `
You find a sword planted into a stone.
You draw it out: {{item}}.{{br}}
People nearby start worshipping you!
`,
	sword_in_a_lake: `
You find a good sword at the bottom of a lake: {{item}}.{{br}}
Who could have thrown it there?
Nevermind, it’s good loot!
`,

	// mission sydney (escape room)
	// the lost mine
	lost_mine: `
You discover a mysterious lost mine, filled with strange tools
and glowing with mana crystals. You pick some: +{{token}} token.
		`,

	// mission sydney (escape room)
	// vampire castle lost in a forest
	vampire_castle: `
Lost in the Dark Forest at night, you come across a gloomy castle.
The owner welcomes you politely, but you spot his teeth fangs. A vampire!
After an intense battle, you earned the castle and its riches!{{br}}
+{{coin}} coins and a {{item}}
		`,

	// muppets
	mana_mana: `
"Mah na mah na" "To to to do do"{{br}}
+{{mana}} mana!`,

	// Scrooge McDuck
	square_eggs: `
Deep in the jungle, you find the marvelous square eggs of the legendary fatu-liva bird!
You cook an omelette, and gain +{{luck}} luck.
		`,
}

const OFFIRMO_ORIGINAL: I18nMessages = {

	// from H.
	foodie_friend: `
You meet with your foodie friend.
He convinces you to try the latest magic treats.
You gain extra energy (+{{health}} health) and a bit of weight!
	`,
	chilies: `
At the adventuring guild party, you pickup a treat.
Turns out it’s made of magic chilies and you can’t feel your face anymore!
Once the pain is gone (one day later!) you feel better than ever, you gained +{{attr}} {{attr_name}}!
	`,

	// friend with the dark mage

	// twist on original
	caravan_failure: `
You were hired to protect a caravan of merchants.
The bandits and monsters aren’t impressed, they keep harassing the caravan until no one is left alive except you.
You nevertheless gain some loot and gold from the remains of both the caravan and the attackers: +{{coin}} coins and a {{item}}!`,

	// classic fantasy/rpg
	meet_old_wizard: `
You meet a mysterious old wizard…
Before giving you the quest, he tells you his loooong story: You gain +{{wisdom}} wisdom!`,

	always_keep_potions: `
Being a seasoned adventurer, you kept a health potion "just in case":
Well done, your health is top-notch!`,

	lost: `
With all those quests, you forgot where you had to go…{{br}}
But circling around the map is good for your health: +{{health}} health!`,

	grinding: `
For lack of a better thing to do, you grind for hours and hours…
So what? It’s an RPG, what did you expect?
But it pays off: +{{level}} level!`,

	// classic quests
	keep_watch: `
You are hired to keep the watch. Boring, but lives are depending on you!
The night pass without any trouble.
You gain {{coin}} coins as agreed. Good job!
		`,
	critters: `
You hunt critters to get XP and improve your skills.
After one hour of farming, +{{attr}} {{attr_name}}, not bad!
		`,
	class_grimoire: `
You find a tome about your class.
It’s filled with interesting stuff!
It’s worth reading: +{{attr}} {{attr_name}}!
		`,

	// farm village
	village_farmwork: `
The villagers hire you to do their errands.
You gather firewood, draw water from the well, chase pests.
You gain {{coin}} coins as agreed, +{{strength}} strength as a bonus and hopefully gain the people’s trust for better quests in the future!
		`,
	village_lost_kid: `
A villager runs after you "Please find my kid lost in the forest! I heard about goblins and fear the worst!".{{br}}
You arrive just as the goblins were about to put the kid in the cauldron.
You deal justice to these pests, drink their soup and bring back the kid.{{br}}
The parent is delighted and you looted a {{item}} in the goblin camp.
		`,
	village_lost_father: `
A child from the village runs after you "Please, find my father who isn’t back from the forest!".
You track the father to a clearing, where he took refuge in a tree, surrounded by wolves.
You sow death amongst the pack using your adventurer’s arts and bring back the father home.
You practiced your {{attr_name}} during this encounter: +{{attr}} {{attr_name}}!
And the child now wants to be an adventurer...
		`,
	village_nice_daughter: `
The daughter of one of the villager you helped wants to have a tea with her saviour.
She’s very nice. You learn from her how to have a polite conversation: + {{charisma}} charisma.
		`,
	village_gifts_blacksmith: `
You helped the village so much that the inhabitants are giving you parting gifts.
"You can’t travel without protection" say the blacksmith. He makes you an armor: {{armor}}!
`,
	village_strongman: `
You spar with the village’s strongman. His methods are crude but practical and effective.
"You gain +{{strength}} strength!
`,

	// capital
	// royal castle
	capital_castle: `
You arrive at the Royal Castle, one of the famous landmark of the capital.
It’s incredible: huge, strong yet delicate, with high towers and ornaments everywhere...
You ponder about civilizations: +{{wisdom}} wisdom.
		`,
	// royal road
	capital_royal_road: `
You visit the Royal Road, one of the famous landmark of the capital.
It’s a wide road filled with stalls with goods from the best gatherers and the best crafters.
You barter for a much needed equipment enhancement.
		`,
	// royal amusement park
	capital_royal_amusement_park: `
You visit the Royal Amusement Park, one of the famous landmark of the capital.
You try all the magical attractions and have a second round of your favorite ones.
This is a curious but effective training: +{{attr}} {{attr_name}}!
		`,

	// biomes
	// rural
	// snow
	// mountain
	// jungle
	// desert
	// swamp
	// sewers

	// famous stones
	famous_stone_ruby: `
In a lost city, you loot the famous lost striped candy-pink ruby!
Your fame increases: +{{charisma}} charisma, +{{token}} token.
		`,
	famous_stone_diamond: `
In a meteor crater, you loot an incredible rare black diamond!
Your wisdom increases: +{{wisdom}} wisdom, +{{token}} token.
		`,
	famous_stone_sapphire: `
In a secret cave below the ocean, you loot the forgotten sapphire of Atlantis!
Your mana increases: +{{mana}} mana, +{{token}} token.
		`,
	famous_stone_emerald: `
On a lost altar deep in the jungle, you loot the mysterious emerald of Shapeshifting!
Your agility increases: +{{agility}} agility, +{{token}} token.
		`,


	// class master

	// winter spirit cookies
	// https://github.com/kodeguild/winter-spirits/blob/master/src/data/cookies/en-us.js
	class_master_primary_attr_1: `
Your class master is playing wise:
"You need to work on your {{attr_name}}, it’s the basis of everything! Focus on your strengths, not your weaknesses!"
She gives you exercises. You gain +{{attr}} {{attr_name}}.
		`,
	class_master_primary_attr_2: `
Your class master is playing wise again:
"The successful warrior is the average man, with laser-like focus! Concentrate on improving your {{attr_name}}!"
She gives you exercises. You gain +{{attr}} {{attr_name}}.
		`,
	class_master_second_attr: `
As usual, your class master is grumpy:
"What’s the use of improving only your main attribute? You need to improve your {{attr_name}} too! Focus on your weaknesses, to become stronger!"
She gives you exercises. You gain +{{attr}} {{attr_name}}.
		`,
	class_master_forbidden_knowledge: `
You feel that your class master is not teaching you everything.
You sneak into her room and read her forbidden scrolls.
You gain +{{attr}} {{attr_name}}!
		`,
	class_master_dark_holocron: `
You feel that your class master is not teaching you everything.
You sneak into her room and find the holocron of a dead evil master.
He happily teaches you in exchange of some "services". You gain +{{attr}} {{attr_name}}!
		`,
	class_master_coolidge: `
Your class master implores you to meditate:
"Persistence and determination win over talent, genius and skills!"{{br}}
Persistence? Determination? She must be talking about levelling: You gain +{{level}} {{level}}!
		`,
	class_master_half_battle: `
Your class master tries to instill some common sense:
"Knowing is half the battle!"{{br}}
She must means you need more experience. You spar against other classes and gain +{{attr}} {{attr_name}}!
		`,

	church_book: `
You visit a church for healing and end up reading their magic books.
You gain +{{mana}} mana!
		`,
	church_cellar_prisoner: `
You visit a church for healing and check their cellar.
Behind a secret door, a chained prisoner offers you power in exchange of his freedom.
You gain +{{attr}} {{attr_name}}!
		`,

	huge_tower: `
You discover and explore a huge tower. It’s filled with mad wizards, cultists and golems.
You reach the top and snatch some loot ({{item}}) then exit the tower,
victorious and more experienced (+{{attr}} {{attr_name}})!
		`,

	make_friends: `
You learnt necromancy (+{{mana}} mana). With your new skills, you assemble some living corpses from remains dug in the cemetery.{{br}}
Your mom would be proud, she was always telling you to go and "make" friends!
		`,

	milk: `
You drink a lot of milk! Your bones strengthen and your health increases!
You gain +{{health}} health.
	`,

	clover: 'You find a four-leaf clover. You gain +{{luck}} luck.',

	horseshoe: 'You find a horseshoe. You gain +{{luck}} luck.',

	rabbit_foot: `
You kill a rabbit, eat it and keep one of its foot as a good luck charm.
You gain +{{luck}} luck.`,

	// future followers

	// Kloo the dryad druidess

	erika: `
Exploring the Colossal Cave, you meet Erika, a powerful sorceress
whose sensitive skin led her to live underground.
She teaches you a new spell for money: +{{mana}} mana
		`,

	rachel: `
Between two villages, you meet Rachel the washer wench.
She competes with you in arm twisting, and win!
Good exercise, +{{strength}} strength.
		`,

	// inspired by player
	ribert: `
You meet Ribert, the head of the royal guards.{{br}}
He is a seasoned warrior and agrees to spar with you.{{br}}
Good fighting exercise, you gain +{{attr}} {{attr_name}}.
		`,

	// Maluka the bardess
	// King Gallus

	// reginold the guard

	// bandits

	// secret order

	// secret sages

	/*
     princess rich, powerful
     */

	/* Ma Backer bandit woman ->
     */

	/*
      // licorne multicolore
      xunicorns:
      '',
      // memes
      // retour chez le mage noir, apprentissage de sorts
      xblack_mage_again:
      '',
      */
	// get rid of them, not slaughter them all

	// knowing is half the battle

	// warsong
	// peace song

	// dragon's graveyard

	// https://starecat.com/the-witcher-looking-at-side-quest-meme/
	meteor_metal: `
A meteorite falls near your position. You rush to the crater and gather the star metal.
You then pay a blacksmith to coat your equipment with it.
Nice enhancement!
	`,

	king_reward: `
You did well to help the kingdom.
King Gallus welcomes you again in the throne room in front of all the court assembled.
You are rewarded with weapons and honors: {{item}}, {{token}} token...
`,

	// pets
	pet_squirrel: `
Having spent so much time in the forest, you befriend and tame a squirrel.
You keep it as a pet.
Its aura gives you +{{agility}} agility!
	`,

	pet_black_cat: `
You befriend and tame a black cat.
He now follows you as a pet.
Its aura gives you +{{luck}} luck!
	`,

	pet_rainbow_lorikeet: `
In the paradise island, you befriend and tame a rainbow lorikeet.
It now stays on your shoulder, that’s quite a sight!
This makes you popular: +{{charisma}} charisma!
	`,

	pet_red_eyed_unicorn: `
You encounter a red eyed unicorn throwing fire from her mouth.
It seems evil and acknowledges you.{{br}}
You just won yourself an epic mount! And its aura gives you +{{mana}} mana!
	`,

	pet_badger_mushrooms: `
You dance and sing "badger badger mushrooms mushrooms"{{br}}
You must have eaten the wrong mushroom.{{br}}
You wake up with a pet badger. Its aura gives you +{{strength}} strength!
`,

	// misc
	best_defense_is_offense: `
The best defense is offense!
You pay for an upgrade of your weapon, it is now stronger!
`,
	defense_is_also_important: `
You discuss with another warrior: "the only real defense is active defense: A good counter-attack leading to taking the offensive!"
Following this conversation, you buy an upgrade for your armor, it is now stronger!
`
}

export const OFFIRMO_BLAND_REPARTITION_ADJUSTMENT: I18nMessages = {
	// we can change the target attribute to improve the distribution


	found_random_mushroom: `
You find a golden mushroom and eat it.
You gained +{{attr}} {{attr_name}}!`,

	// food
	dragon_kebab: `
You have the chance to taste the legendary dragon meat kebab!
Through this magical food, you gain +{{attr}} {{attr_name}}!
	`,
	elven_hydromel: `
You have the chance to taste the legendary elven hydromel!
Through this magical drink, you gain +{{attr}} {{attr_name}}!
	`,

	random_blessing: `
You helped a village. The village’s elder grants you a blessing.
She is very old and you are not very sure she knows what she’s doing…
You find that you gained +{{attr}} {{attr_name}}!
	`,
	guild_party_food: `
At an adventuring guild party, you are drunk and pick something unidentified to eat.{{br}}
Once you wake up (one day later!) you discover that you strangely gained +{{attr}} {{attr_name}}!
	`,

	/*
	fantasy metals
		* https://tvtropes.org/pmwiki/pmwiki.php/Main/FantasyMetals
* https://metallurgy.wikia.com/wiki/Fantasy_Metals
	* https://www.bodycote.com/fictional-metals
*/

	// potions
	// https://www.reddit.com/r/DnDBehindTheScreen/comments/4btnkc/random_potions_table/
	// see "appearance"
	found_vermilion_potion: `
You find a vermilion potion.
Crazy drink, gained +{{attr}} {{attr_name}}!`,
	found_silver_potion: `
You find a silver potion.
Sweet drink, gained +{{attr}} {{attr_name}}!`,
	found_swirling_potion: `
You find a swirling potion.
Strange drink, gained +{{attr}} {{attr_name}}!`,
	found_fizzing_potion: `
You find a fizzing potion.
Sparkling drink, gained +{{attr}} {{attr_name}}!`,
	found_bubbly_potion: `
You find a bubbly potion.
Soft drink, gained +{{attr}} {{attr_name}}!`,
	found_worn_out_potion: `
You find an old potion with an unreadable label.
You try your luck and drink it.
You gain +{{attr}} {{attr_name}}!`,


	// books
	found_journal: `
You find the remains of an unlucky adventurer. She or he (you can’t tell from the remains) kept a journal.
You read it and learn from their failure: +{{attr}} {{attr_name}}!`,
}

const OFFIRMO_TECHNICALS: I18nMessages = {
	found_coin: `
You find a coin on the ground!`,
}

// NOTE: we allow line returns for ease of writing
// but they'll be automatically removed, see bottom of this file.
// use {{br}} for actual line returns.
const raw_messages: I18nMessages = {
	adventures: {
		...BAD_ADVENTURES,

		...FIGHT_ADVENTURES,
		...SCAVENGED_ORIGINAL_ADVENTURES,

		...OFFIRMO_MUSHROOMS_AND_MISC,
		...OFFIRMO_INSPIRED_FROM_RPG_MEMES_FROM_THE_NET,
		...OFFIRMO_INSPIRED_FROM_NET_RSRCS,
		...OFFIRMO_INSPIRED_FROM_INSTAGRAM_POSTS,
		...OFFIRMO_INPIRED_FROM_VIDEOGAMES,
		...OFFIRMO_INSPIRED_FROM_MANGAS,
		...OFFIRMO_INSPIRED_BY_POPULAR_CULTURE,

		...OFFIRMO_ORIGINAL,
		...OFFIRMO_BLAND_REPARTITION_ADJUSTMENT,
		...OFFIRMO_TECHNICALS,
	},
}

const messages: I18nMessages = {
	adventures: {},
}

Object.keys(raw_messages.adventures)
	.filter(key => !key.startsWith('xxx'))
	.forEach((entry: string) => {
		(messages.adventures as any)[entry] = clean_multiline_string((raw_messages as any).adventures[entry])
	})

function clean_multiline_string(str: string): string {
	return str
		.split('\n')
		.map((s: string) => s.trim())
		.filter((s: string) => !!s)
		.join(' ')
}

export {
	messages,
}
