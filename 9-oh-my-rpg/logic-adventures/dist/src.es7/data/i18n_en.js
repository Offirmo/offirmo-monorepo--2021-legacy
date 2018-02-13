// NOTE: we allow line returns for ease of writing
// but they'll be automatically removed, see bottom of this file.
// use {{br}} for actual line returns.
const raw_messages = {
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
You gained +{{level}} level!`,
        /* too bland, please!
        ate_mushroom: `
You ate a mushroom.
You gained +{{level}} level!`,*/
        ate_zombie: `
You ate a zombie.
You gained +{{mana}} mana!`,
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
        found_vermilion_potion: `
You found a vermilion potion.
Crazy drink, gained +{{attr}} {{attr_name}}!`,
        found_silver_potion: `
You found a silver potion.
Sweet drink, gained +{{attr}} {{attr_name}}!`,
        found_swirling_potion: `
You found a swirling potion.
Strange drink, gained +{{attr}} {{attr_name}}!`,
        // TODO steal morrowind's level up message
        // https://www.reddit.com/r/Morrowind/comments/1s1emv/i_find_the_levelup_messages_very_inspirational/
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
By strafing and running in circles, you manage
to stay close to him.{{br}}
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
        // WoW / ?
        sentients_killing: `
You introduce yourself to the captain of the guard. Your mission: kill 10 kobolds.
After a brief hesitation on the ethics of the extermination of thinking creatures, you accept: you need loot and XP too badly.
You gain {{coin}} and +{{attr}} {{attr_name}}.
		`,
        // classic quests
        keep_watch: `
You are hired to keep the watch. Boring, but lives are depending on you!
The night pass without any trouble.
You gain {{coin}} as agreed. Good job!
		`,
        critters: `
You hunt critters to get XP and improve your skills.
After one hour of farming, +{{attr}} {{attr_name}}, not bad!
		`,
        class_grimoire: `
You find a tome about your class.
It's filled with interesting stuff!
It's worth reading: +{{attr}} {{attr_name}}!
		`,
        // farm village
        village_farmwork: `
The villagers hire you to do their errands.
You gather firewood, draw water from the well, chase pests.
You gain {{coin}} as agreed, +{{strength}} strength as a bonus and hopefully gain the people's trust for better quests in the future!
		`,
        village_lost_kid: `
A villager run after you "Please find my kid lost in the forest! I heard about goblins and fear the worst!".
You arrive just as the goblins were about to put the kid in the cauldron.
You deal justice to these pests, drink their soup and bring back the kid.
The parent is delighted and you looted a {{item}} in the goblin camp.
		`,
        village_lost_father: `
A child from the village run after you "Please find my father lost in the forest! It's late and he isn't back!".
You track the father to a clearing, where he took refuge in a tree, surrounded by wolves.
You sow death amongst the pack using your adventurer's arts and bring back the father home.
You practiced your {{attr_name}} during the fight: +{{attr}} {{attr_name}}!
And the child now wants to be an adventurer...
		`,
        village_nice_daughter: `
The daughter of one of the villager you helped want to have a tea with her saviour.
She's very nice. You learn from her how to have a polite conversation: + {{charisma}} charisma.
		`,
        // town
        // Alwayswinter
        // capital
        // royal castle
        capital_castle: `
You arrive at the Royal Castel, one of the famous landmark of the capital.
It's incredible: huge, strong yet delicate, high towers, ornaments...
You ponder about civilizations: +{{wisdom}} wisdom.
		`,
        // royal road
        capital_royal_road: `
You visit the Royal Road, one of the famous landmark of the capital.
It's a wide road filled with stalls with goods from the best gatherers and the best crafters.
You barter for a new {{item_slot}}: {{item}}.
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
In a lost city, you looted the famous striped candy-pink ruby!
Your fame increases: +{{charisma}} charisma, +{{token}} tokens.
		`,
        famous_stone_diamond: `
In a meteor crater, you looted an incredible black diamond!
Your wisdom increases: +{{wisdom}} wisdom, +{{token}} tokens.
		`,
        famous_stone_sapphire: `
In a secret cave below the ocean, you looted the sapphire of Atlantis!
Your mana increases: +{{mana}} mana, +{{token}} tokens.
		`,
        famous_stone_emerald: `
On a lost altar deep in the jungle, you looted the emerald of shapeshifting!
Your agility increases: +{{agility}} agility, +{{token}} tokens.
		`,
        // winter spirit cookies
        // https://github.com/kodeguild/winter-spirits/blob/master/src/data/cookies/en-us.js
        class_master_primary_attr_1: `
Your class master is playing wise:
"You need to work on your {{attr_name}}, it's the basis of everything! Focus on your strengths, not your weaknesses!"
She gives you exercises. You gain +{{attr}} {{attr_name}}.
		`,
        class_master_primary_attr_2: `
Your class master is playing wise again:
"The successful warrior is the average man, with laser-like focus! Concentrate on improving your {{attr_name}}!"
She gives you exercises. You gain +{{attr}} {{attr_name}}.
		`,
        class_master_second_attr: `
As usual, your class master is grumpy:
"What's the use of improving only your main attribute? You need to improve your {{attr_name}} too! Focus on your your weaknesses, to become stronger!"
She gives you exercises. You gain +{{attr}} {{attr_name}}.
		`,
        wisdom_of_books: `
You visit a church for healing, and end up reading their books.
You gain +{{attr}} wisdom!
		`,
        // morrowind meme
        arrow_in_the_knee: `
A guard tells you stories of when he was an adventurer,
before he took an arrow in the knee.
You feel enlightened: +{{attr}} wisdom!
		`,
        square_eggs: `
Deep in the jungle, you found the marvelous square eggs of the legendary fatu-liva bird!
You cook an omelette, and gain +{{luck}} luck.
		`,
        colossal_cave: `
You discover and explore a colossal cave! Undeads, goblins, balrogs...
You emerge victoriously, with loot ({{item}}) and experience (+{{attr}} {{attr_name}})!
		`,
        huge_tower: `
You discover and explore a huge tower. It's filled with mad wizards, cultists and golems.
You reach the top and snatch some loot({{item}})
then exit the tower, victorious and more experienced (+{{attr}} {{attr_name}})!
		`,
        // future followers
        erika: `
Exploring the Colossal Cave, you meet Erika, a powerful sorceress whose sensitive skin
led her to live underground.
She teaches you a new spell for money: +{{mana}} mana
		`,
        rachel: `
Between to villages, you meet Rachel the 
		`,
    }
};
const messages = {
    adventures: {}
};
Object.keys(raw_messages.adventures).forEach((entry) => {
    messages.adventures[entry] = clean_multiline_string(raw_messages.adventures[entry]);
});
function clean_multiline_string(str) {
    return str
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => !!s)
        .join(' ');
}
export { messages };
//# sourceMappingURL=i18n_en.js.map