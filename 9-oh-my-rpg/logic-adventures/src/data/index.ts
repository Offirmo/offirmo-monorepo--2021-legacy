import { I18nMessages } from '@oh-my-rpg/definitions'

import { messages as en } from './i18n_en'

import { CoinsGain, OutcomeArchetype, AdventureType } from '../types'

interface RawAdventureArchetypeEntry {
	good: boolean
	hid: string
	type: AdventureType
	outcome: Partial<OutcomeArchetype>
	isPublished?: boolean
}

const story = AdventureType.story
const fight = AdventureType.fight

const ENTRIES: RawAdventureArchetypeEntry[] = [
	{ good: false, type: story, hid: 'bad_default',           outcome: {}},

	{ good: true, type: fight, hid: 'fight_won_coins',        outcome: { coin: 'small' }},
	{ good: true, type: fight, hid: 'fight_won_loot',         outcome: { armor_or_weapon: true }},
	{ good: true, type: fight, hid: 'fight_won_any',          outcome: { random_charac: true }},
	{ good: true, type: fight, hid: 'fight_lost_any',         outcome: { random_charac: true }},
	{ good: true, type: fight, hid: 'fight_lost_shortcoming', outcome: { lowest_charac: true }},

	{ good: true, type: story, hid: 'bored_log',              outcome: { strength: true }},
	{ good: true, type: story, hid: 'caravan',                outcome: { coin: 'small' }},
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
	{ good: true, type: story, hid: 'found_random_mushroom',  outcome: { random_charac: true }},

	{ good: true, type: story, hid: 'meet_old_wizard',        outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'good_necromancer',       outcome: { agility: true }},
	{ good: true, type: story, hid: 'talk_to_all_villagers',  outcome: { charisma: true }},
	{ good: true, type: story, hid: 'always_keep_potions',    outcome: { health: true }},
	{ good: true, type: story, hid: 'lost',                   outcome: { health: true }},
	{ good: true, type: story, hid: 'fate_sword',             outcome: { coin: 'small' }},
	{ good: true, type: story, hid: 'grinding',               outcome: { level: true }},
	{ good: true, type: story, hid: 'so_many_potions',        outcome: { strength: true }},
	{ good: true, type: story, hid: 'rematch',                outcome: { level: true }},
	{ good: true, type: story, hid: 'useless',                outcome: { wisdom: true }},
	{ good: true, type: story, hid: 'escort',                 outcome: { health: true }},
	{ good: true, type: story, hid: 'rare_goods_seller',      outcome: { armor_or_weapon: true }},
	{ good: true, type: story, hid: 'progress_loop',          outcome: { armor_or_weapon: true }},
	{ good: true, type: story, hid: 'idiot_bandits',          outcome: { coin: 'medium' }},
	{ good: true, type: story, hid: 'princess',               outcome: { coin: 'medium', armor_or_weapon_improvement: true }},
	{ good: true, type: story, hid: 'bad_village',            outcome: { mana: true }},
	{ good: true, type: story, hid: 'mana_mana',              outcome: { mana: true }},

	{ good: true, type: story, hid: 'treasure_in_pots',       outcome: { coin: 'small' }},
	{ good: true, type: story, hid: 'chicken_slayer',         outcome: { strength: true }},
]


const i18n_messages: I18nMessages = {
	en,
}



export {
	RawAdventureArchetypeEntry,
	ENTRIES,
	i18n_messages,
}
