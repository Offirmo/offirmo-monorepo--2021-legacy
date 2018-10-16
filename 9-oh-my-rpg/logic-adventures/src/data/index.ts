import { I18nMessages } from '@oh-my-rpg/definitions'

import { messages as en } from './i18n_en'

import { CoinsGain, OutcomeArchetype, AdventureType } from '../types'

interface RawAdventureArchetypeEntry {
	good: boolean
	hid: string
	type: AdventureType
	outcome: Partial<OutcomeArchetype>
	isBeta?: boolean // TODO
}

const story = AdventureType.story
const fight = AdventureType.fight

const ENTRIES: RawAdventureArchetypeEntry[] = [
	{ good: false, type: story, hid: 'bad_1',                 outcome: {}},
	{ good: false, type: story, hid: 'bad_2',                 outcome: {}},
	{ good: false, type: story, hid: 'bad_3',                 outcome: {}},
	{ good: false, type: story, hid: 'bad_4',                 outcome: {}},
	{ good: false, type: story, hid: 'bad_5',                 outcome: {}},
	{ good: false, type: story, hid: 'bad_6',                 outcome: {}},

	{ good: true, type: fight, hid: 'fight_won_coins',        outcome: { coin: 'small' }},
	{ good: true, type: fight, hid: 'fight_won_loot',         outcome: { armor_or_weapon: true }},
	{ good: true, type: fight, hid: 'fight_won_any',          outcome: { random_attribute: true }},
	{ good: true, type: fight, hid: 'fight_lost_any',         outcome: { random_attribute: true }},
	{ good: true, type: fight, hid: 'fight_lost_shortcoming', outcome: { lowest_attribute: true }},

	{ good: true, type: story, hid: 'bored_log',              outcome: { strength: true }},
	{ good: true, type: story, hid: 'caravan_success',        outcome: { coin: 'small' }},
	{ good: true, type: story, hid: 'dying_man',              outcome: { coin: 'medium' }},
	{ good: true, type: story, hid: 'ate_bacon',              outcome: { level: true }},
	{ good: true, type: story, hid: 'ate_zombie',             outcome: { mana: true }},
	{ good: true, type: story, hid: 'refreshing_nap',         outcome: { health: true }},
	{ good: true, type: story, hid: 'older',                  outcome: { level: true }},
	{ good: true, type: story, hid: 'stare_cup',              outcome: { mana: true }},
	{ good: true, type: story, hid: 'nuclear_fusion_paper',   outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'found_green_mushroom',   outcome: { level: true }},

	{ good: true, type: story, hid: 'found_red_mushroom',     outcome: { health: true }},
	{ good: true, type: story, hid: 'found_blue_mushroom',    outcome: { mana: true }},
	{ good: true, type: story, hid: 'found_white_mushroom',   outcome: { strength: true }},
	{ good: true, type: story, hid: 'found_yellow_mushroom',  outcome: { agility: true }},
	{ good: true, type: story, hid: 'found_orange_mushroom',  outcome: { charisma: true }},
	{ good: true, type: story, hid: 'found_black_mushroom',   outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'found_rainbow_mushroom', outcome: { luck: true }},
	{ good: true, type: story, hid: 'found_random_mushroom',  outcome: { random_attribute: true }},

	{ good: true, type: story, hid: 'meet_old_wizard',           outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'good_necromancer',          outcome: { agility: true }},
	{ good: true, type: story, hid: 'talk_to_all_villagers',     outcome: { charisma: true }},
	{ good: true, type: story, hid: 'always_keep_potions',       outcome: { health: true }},
	{ good: true, type: story, hid: 'lost',                      outcome: { health: true }},
	{ good: true, type: story, hid: 'fate_sword',                outcome: { coin: 'small' }},
	{ good: true, type: story, hid: 'grinding',                  outcome: { level: true }},
	{ good: true, type: story, hid: 'so_many_potions',           outcome: { strength: true }},
	{ good: true, type: story, hid: 'rematch',                   outcome: { level: true }},
	{ good: true, type: story, hid: 'useless',                   outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'escort',                    outcome: { health: true }},
	{ good: true, type: story, hid: 'rare_goods_seller',         outcome: { armor_or_weapon: true }},
	{ good: true, type: story, hid: 'progress_loop',             outcome: { armor_or_weapon: true }},
	{ good: true, type: story, hid: 'idiot_bandits',             outcome: { coin: 'medium' }},
	{ good: true, type: story, hid: 'princess',                  outcome: { coin: 'medium', armor_or_weapon_improvement: true }},
	{ good: true, type: story, hid: 'bad_village',               outcome: { mana: true }},
	{ good: true, type: story, hid: 'mana_mana',                 outcome: { mana: true }},
	{ good: true, type: story, hid: 'treasure_in_pots',          outcome: { coin: 'small' }},
	{ good: true, type: story, hid: 'chicken_slayer',            outcome: { strength: true }},
	{ good: true, type: story, hid: 'sentients_killing',         outcome: { coin: 'small', class_primary_attribute: true }},
	{ good: true, type: story, hid: 'keep_watch',                outcome: { coin: 'small' }},
	{ good: true, type: story, hid: 'critters',                  outcome: { class_secondary_attribute: true }},
	{ good: true, type: story, hid: 'class_grimoire',            outcome: { class_primary_attribute: true }},

	{ good: true, type: story, hid: 'village_farmwork',          outcome: { coin: 'small', strength: true }},
	{ good: true, type: story, hid: 'village_lost_kid',          outcome: { armor_or_weapon: true }},
	{ good: true, type: story, hid: 'village_lost_father',       outcome: { class_primary_attribute: true }},
	{ good: true, type: story, hid: 'village_nice_daughter',     outcome: { charisma: true }},

	{ good: true, type: story, hid: 'capital_castle',               outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'capital_royal_road',           outcome: { armor_or_weapon_improvement: true }},
	{ good: true, type: story, hid: 'capital_royal_amusement_park', outcome: { class_primary_attribute: true }},

	{ good: true, type: story, hid: 'famous_stone_ruby',            outcome: { token: 1, charisma: true }},
	{ good: true, type: story, hid: 'famous_stone_diamond',         outcome: { token: 1, wisdom: true }},
	{ good: true, type: story, hid: 'famous_stone_sapphire',        outcome: { token: 1, mana: true }},
	{ good: true, type: story, hid: 'famous_stone_emerald',         outcome: { token: 1, agility: true }},

	{ good: true, type: story, hid: 'class_master_primary_attr_1',  outcome: { class_primary_attribute: true }},
	{ good: true, type: story, hid: 'class_master_primary_attr_2',  outcome: { class_primary_attribute: true }},
	{ good: true, type: story, hid: 'class_master_second_attr',     outcome: { class_secondary_attribute: true }},

	{ good: true, type: story, hid: 'church_book',                  outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'arrow_in_the_knee',            outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'square_eggs',                  outcome: { luck: true }},
	{ good: true, type: story, hid: 'colossal_cave',                outcome: { armor_or_weapon: true, class_primary_attribute: true }},
	{ good: true, type: story, hid: 'huge_tower',                   outcome: { armor_or_weapon: true, class_primary_attribute: true }},
	{ good: true, type: story, hid: 'make_friends',                 outcome: { mana: true }},
	{ good: true, type: story, hid: 'wise_wisewood_tree',           outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'lost_mine',                    outcome: { token: 1 }},
	{ good: true, type: story, hid: 'gehennom',                     outcome: { coin: 'medium', armor_or_weapon: true }},
	{ good: true, type: story, hid: 'vampire_castle',               outcome: { coin: 'medium', armor_or_weapon: true }},

	{ good: true, type: story, hid: 'erika',                        outcome: { mana: true }},
	{ good: true, type: story, hid: 'rachel',                       outcome: { strength: true }},

	{ good: true, type: story, hid: 'walk_in_mordor',             outcome: { agility: true}},
	{ good: true, type: story, hid: 'jig',                        outcome: { agility: true}},
	{ good: true, type: story, hid: 'good_end',                   outcome: { wisdom: true}},
	{ good: true, type: story, hid: 'waterfall',                  outcome: { health: true}},
	{ good: true, type: story, hid: 'meteor',                     outcome: { luck: true}},
	{ good: true, type: story, hid: 'weird_duck',                 outcome: { coin: 'huge'}},
	{ good: true, type: story, hid: 'last_quest',                 outcome: { level: true}},
	{ good: true, type: story, hid: 'busking',                    outcome: { token: 1}},
	{ good: true, type: story, hid: 'best_meal',                  outcome: { health: true}},
	{ good: true, type: story, hid: 'witch_riddle',               outcome: { wisdom: true}},
	{ good: true, type: story, hid: 'princess_castle',            outcome: { luck: true}},
	{ good: true, type: story, hid: 'foreign_language',           outcome: { charisma: true}},
	{ good: true, type: story, hid: 'last_night',                 outcome: { luck: true}},
	{ good: true, type: story, hid: 'chasm_leap',                 outcome: { agility: true}},
	{ good: true, type: story, hid: 'coffee',                     outcome: { wisdom: true}},
	{ good: true, type: story, hid: 'gold_nugget',                outcome: { coin: 'medium'}},
	{ good: true, type: story, hid: 'high_level_zone_1',          outcome: {class_primary_attribute:true}},
	{ good: true, type: story, hid: 'sword_in_rock',              outcome: {weapon:true}},
	{ good: true, type: story, hid: 'sword_in_a_lake',            outcome: {weapon:true}},
	{ good: true, type: story, hid: 'side_quests',                outcome: { coin: 'medium'}},
	{ good: true, type: story, hid: 'balrog',                     outcome: { level: true}},
	{ good: true, type: story, hid: 'castle_summon',              outcome: { weapon: true}},
	{ good: true, type: story, hid: 'murderer',                   outcome: { wisdom: true}},
	{ good: true, type: story, hid: 'unmatched_set',              outcome: { coin: 'big'}},
	{ good: true, type: story, hid: 'village_gifts_blacksmith',   outcome: { armor: true}},
	{ good: true, type: story, hid: 'village_strongman',          outcome: { strength: true}},
	{ good: true, type: story, hid: 'meteor_metal',               outcome: { armor_or_weapon_improvement: true}},
	{ good: true, type: story, hid: 'caravan_failure',            outcome: { coin: 'medium', armor_or_weapon: true}},
	{ good: true, type: story, hid: 'riddle_of_steel',            outcome: { armor_or_weapon_improvement: true}},

	{ good: true, type: story, hid: 'give_a_shield',                outcome: { armor: true }},
	{ good: true, type: story, hid: 'king_reward',                  outcome: { armor_or_weapon: true, token: 1 }},

	// those stories are not hinting a a specific attribute,
	// thus can be used as a distribution adjustment
	{ good: true, type: story, hid: 'dragon_kebab',               outcome: { charisma: true }},
	{ good: true, type: story, hid: 'elven_hydromel',             outcome: { luck: true }},
	{ good: true, type: story, hid: 'found_vermilion_potion',     outcome: { charisma: true }},
	{ good: true, type: story, hid: 'found_silver_potion',        outcome: { luck: true }},
	{ good: true, type: story, hid: 'found_swirling_potion',      outcome: { strength: true }},
	{ good: true, type: story, hid: 'found_journal',              outcome: { health: true }},
	{ good: true, type: story, hid: 'cookies_grandmas',           outcome: { agility: true }},
]


const i18n_messages: I18nMessages = {
	en,
}



export {
	RawAdventureArchetypeEntry,
	ENTRIES,
	i18n_messages,
}
