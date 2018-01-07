import { I18nMessages } from '@oh-my-rpg/definitions'

// NOTE: we allow line returns for ease of writing
// but they'll be automatically removed, see bottom of this file.
// use {{br}} for actual line returns.
const raw_messages: I18nMessages = {
	adventures: {
		bad_default: `You clicked too early!
+{{penalty_s}}s !`,

		fight_won_coins: `
You have defeated a {{encounter}}!{{br}}
You looted {{coin}} from its corpse.`,

		fight_won_loot: `
You have defeated a {{encounter}}!{{br}}
You looted a {{item}} from its corpse.`,

		fight_won_any: `
You have defeated a {{encounter}}!{{br}}
You perfected your {{attr_name}} during the fight: +{{attr}} {{attr_name}}!`,

		fight_lost_any: `
You were attacked and nearly killed by a {{encounter}} but you got away just before it was too late.{{br}}
You figured out techniques to flee more efficiently: +{{attr}} {{attr_name}}!`,

		fight_lost_shortcoming: `
You were attacked by a {{encounter}} and it didn't end well... but you got away just before it was about to kill you.{{br}}
You reflect on your lack of {{attr_name}} in the fight and train hard: +{{attr}} {{attr_name}}!`,

		// scavenged from screens of the original game
		bored_log: `
You were so bored, you punched a log for hours!
You gained +{{strength}} strength!`,

		caravan: `
You were hired to protect a caravan of merchants.
You gained {{coin}}!`,

		dying_man: `
A dying man on the street left you everything he had.
You gained {{coin}}!`,

		ate_bacon: `
You ate some bacon.
You gained +{{level}} level!`, // delicious crispy

		/* too bland, please!
		ate_mushroom: `
You ate a mushroom.
You gained +{{level}} level!`,*/

		ate_zombie: `
You ate a zombie.
You gained +{{mana}} mana!`, // You felt adventurous and ate a severed zombie arm.

		refreshing_nap: `
You took a nap and feel refreshed.
You gained +{{health}} health!`,

		older: `
You feel a little older.
You gained +{{level}} level!`,

		stare_cup: `
You stare really hard at a cup, and it almost moves!
You gained +{{mana}} mana!`,

		nuclear_fusion_paper: `
You wrote a paper on nuclear fusion.
You gained +{{wisdom}} wisdom!`,

		found_green_mushroom: `
You found a green mushroom.
You gained +{{level}} level!`,

		// from me, inferred and extended
		found_red_mushroom: `
You found a red mushroom.
You gained +{{health}} health!`,

		found_blue_mushroom: `
You found a blue mushroom.
You gained +{{mana}} mana!`,

		found_white_mushroom: `
You found a white mushroom.
You gained +{{strength}} strength!`,

		found_yellow_mushroom: `
You found a yellow mushroom.
You gained +{{agility}} agility!`,

		found_orange_mushroom: `
You found an orange mushroom.
You gained +{{charisma}} charisma!`,

		found_black_mushroom: `
You found a black mushroom.
You gained +{{wisdom}} wisdom!`,

		found_rainbow_mushroom: `
You found a glowing rainbow mushroom.
You gained +{{luck}} luck!`,

		found_random_mushroom: `
You found a golden mushroom.
You gained +{{attr}} {{attr_name}}!`,

		// TODO potions
		// vermillon
		// argentée

		// TODO steal morrowind's level up message

		// from me
		meet_old_wizard: `
You meet a mysterious old wizard…
Before giving you the quest, he tells you his loooong story: You gain +{{wisdom}} wisdom!`,

		// electricbunnycomics.com
		good_necromancer: `
You meet a child weeping over his dead hamster… Thanks to necromancy, you reanimate it as a hamster-zombie!
Oddly, the child cries even more while running away.{{br}}
Fortunately, you gain +{{agility}} agility while avoiding the stones thrown by the villagers.`,

		// dorkly
		talk_to_all_villagers: `
You spoke to everyone in the village leaving no quest unanswered!{{br}}
Although your head aches from discussing so much.
+{{charisma}} charisma having met so many people!`,

		always_keep_potions: `
Being a seasoned adventurer, you kept a health potion "just in case":
Well done, your health is top-notch!`,

		lost: `
With all those quests, you forgot where you had to go…{{br}}
But circling around the map is good for your health: +{{health}} health!`,

		grinding: `
For lack of a better thing to do, you grind for hours and hours…
So what? It's an RPG, what did you expect?
But it pays off: +{{level}} level!`,

		// DK
		fate_sword: `
To thank you for saving his wife and his children, a farmer offers you "Destiny",
the heirloom sword passed down in his family for generations.{{br}}
30 minutes later, the merchant buys it off you for only {{coin}}… some heirloom!`,

		// ?
		so_many_potions: `
The fight against the final boss was hard, very hard…
Most importantly, +{{strength}} strength for managing to control a pressing urge during the encounter after drinking 25 health potions !`,

		// cad-comic.com
		rematch: `
You got beaten by a goblin!
In shame, you roam around the country, accepting quest after quest to train yourself before facing him again.{{br}}
Alas, he also trained and beat you again!
Well, the +{{level}} level is still useful…`,

		// paintraincomic.com
		// http://paintraincomic.com/comic/cemetery/
		useless: `
Arriving at the village, the mayor announces that the neighborhood is no longer dangerous.
The sorceress fell in love and no longer curses people.
The haunted cemetery was a pet cemetery, villagers are happy to have their companions back.
The giant is helping the farmers with their harvest.{{br}}
You feel useless and reflect on your place in the world. +{{wisdom}} wisdom!`,

		// memecenter.com
		escort: `
You are escorting an important NPC.
Frustratingly, if you walk, he's faster than you.
However, if you run, you're faster than him!
By strafing and running in circles, you manage.
+{{health}} health thanks to your efforts!`,

		// memecenter.com
		rare_goods_seller: `
You come across an old man with eccentric apparel.
Score! It's a rare item seller!
He gives you a good price for a {{item}}.`,

		// memecenter.com
		progress_loop: `
You would need better gear to level up.
But you'd need to level up to get better gear.
Cruel dilemma!{{br}}
Fortunately, you find a {{item}} at the bottom of a well!`,

		// memecenter.com/motohorse
		idiot_bandits: `
Your name is whispered across the land since you slayed the dragon and defeated the sorceress.
Bandits ambush you, aiming for your wealth. For their folly!
They realize their mistake one moment
before your fireball incinerates them.
Fortunately, gold doesn't burn: +{{coin}}!`,

		// don't remember the source for this one
		princess: `
"You won't take back the princess!" yells the fearsome black mage,
as you reach his throne room.
You reassure him: you are only here for loot.{{br}}
He lets you help yourself to {{coin}}
and even enchants your weapon too!`,

		// DM of the ring
		bad_village: `
You reach a new village. There is no weapon shop.
No potion shop either! And no quests at the inn!!
What a useless village. At your call, lightning and meteors wipe out this place.
A good opportunity to practice your magic: +{{mana}} mana.`,

		// muppets
		mana_mana: `
"Mah na mah na" "To to to do do"{{br}}
+{{mana}} mana!`,


		// Zelda reference
		treasure_in_pots: `
You enter a pottery shop and destroy every jug, vase and item in the store.
You collect +{{coin}} in coin, precious stones and other treasures found!`,

		// Oblivion dangerous chicken
		chicken_slayer: `
You enter a village and see a chicken roaming in a garden peacefully. 
You slay the chicken mercilessly.
The entire cohort of guards for the town come after you and you are forced to slay them too.
After hours of fighting you gain +{{strength}} strength!`,

		// ?
		/*
		Vous vous présentez au capitaine de la garde. Votre mission : tuer 10 kobolds.
Après une brève hésitation sur l’éthique de l’extermination de créatures pensantes, vous acceptez ; vous avez trop besoin de loot et d’XP.
		 */

		/* master's quotes
		https://github.com/kodeguild/winter-spirits/blob/master/src/data/cookies/en-us.js#L25
		 */

		/*
		princess rich turn out very nice very nice
		Rich, powerful
		*/

		/* Ma Backer bandit woman
		*/

		/*
		 // "make friends" necromancy
		 xmake_friends:
		 '',
		 // licorne multicolore
		 xunicorns:
		 '',
		 // memes
		 xarrown_in_the_knee:
		 '', // arrow in the knee
		 // retour chez le mage noir, apprentissage de sorts
		 xblack_mage_again:
		 '',
		 */
		// get rid of them, not slaughter them all
		// meteorite
	}
}

const messages: I18nMessages = {
	adventures: {}
}

Object.keys(raw_messages.adventures).forEach((entry: string) => {
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
	messages
}
