/////////////////////

import { Random, Engine } from '@offirmo/random'
import deepFreeze from 'deep-freeze-strict'

/////////////////////

import {
	UUID,
	Element,
	ItemQuality,
} from '@oh-my-rpg/definitions'

import * as CharacterState from '@oh-my-rpg/state-character'
import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@oh-my-rpg/state-character'

import * as WalletState from '@oh-my-rpg/state-wallet'
import { Currency } from '@oh-my-rpg/state-wallet'

import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as EnergyState from '@oh-my-rpg/state-energy'

import * as PRNGState from '@oh-my-rpg/state-prng'
import {
	get_prng,
	generate_random_seed,
} from '@oh-my-rpg/state-prng'

import {
	Weapon,
	create as create_weapon,
	DEMO_WEAPON_1,
} from '@oh-my-rpg/logic-weapons'

import {
	Armor,
	create as create_armor,
} from '@oh-my-rpg/logic-armors'

import {
	DEMO_MONSTER_01,
} from '@oh-my-rpg/logic-monsters'

import {
	appraise,
} from '@oh-my-rpg/logic-shop'

import {
	CoinsGain,
	OutcomeArchetype,
	AdventureType,
	AdventureArchetype,

	get_archetype,
	pick_random_good_archetype,
	pick_random_bad_archetype,
	generate_random_coin_gain,
} from '@oh-my-rpg/logic-adventures'

/////////////////////

import { LIB, SCHEMA_VERSION } from './consts'

import {
	State,
	GainType,
	Adventure,
} from './types'

/////////////////////

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// with dev gain
const DEMO_ADVENTURE_01: Readonly<Adventure> = deepFreeze({
	hid: 'fight_lost_any',
	uuid: 'uu1de1~EVAdXlW5_p23Ro4OH',
	good: true,
	encounter: DEMO_MONSTER_01,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 1,
		coin: 0,
		token: 0,
		armor: null,
		weapon: null,
		armor_improvement: false,
		weapon_improvement: false,
	},
})
// with coin gain
const DEMO_ADVENTURE_02: Readonly<Adventure> = deepFreeze({
	hid: 'dying_man',
	uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
	good: true,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 0,
		coin: 1234,
		token: 0,
		weapon: null,
		armor: null,
		weapon_improvement: false,
		armor_improvement: false,
	}
})
// with loot gain
const DEMO_ADVENTURE_03: Readonly<Adventure> = deepFreeze({
	hid: 'rare_goods_seller',
	uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
	good: true,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 0,
		coin: 0,
		token: 0,
		weapon: DEMO_WEAPON_1,
		armor: null,
		weapon_improvement: false,
		armor_improvement: false,
	}
})
// with weapon enhancement gain
const DEMO_ADVENTURE_04: Adventure = deepFreeze({
	hid: 'princess',
	uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
	good: true,
	gains: {
		level: 0,
		health: 0,
		mana: 0,
		strength: 0,
		agility: 0,
		charisma: 0,
		wisdom: 0,
		luck: 0,
		coin: 123,
		token: 0,
		weapon: null,
		armor: null,
		weapon_improvement: false,
		armor_improvement: true,
	}
})

const DEMO_STATE: Readonly<State> = deepFreeze({
	schema_version: 4,
	revision: 203,

	avatar: CharacterState.DEMO_STATE,
	inventory: InventoryState.DEMO_STATE,
	wallet: WalletState.DEMO_STATE,
	prng: PRNGState.DEMO_STATE,

	last_adventure: DEMO_ADVENTURE_01,

	click_count:                  86,
	good_click_count:             86,
	meaningful_interaction_count: 86,
})

// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS: any = deepFreeze({
	"schema_version": 4,
	"revision": 203,
	"avatar": {
		"schema_version": 2,
		"revision": 42,
		"name": "Perte",
		"klass": "paladin",
		"attributes": {
			"level": 13,
			"health": 12,
			"mana": 23,
			"strength": 4,
			"agility": 5,
			"charisma": 6,
			"wisdom": 7,
			"luck": 8
		}
	},
	"inventory": {
		"schema_version": 1,
		"revision": 42,
		"unslotted_capacity": 20,
		"slotted": {
			"armor": {
				"uuid": "uu1~test~demo~armor~0002",
				"element_type": "item",
				"slot": "armor",
				"base_hid": "belt",
				"qualifier1_hid": "brass",
				"qualifier2_hid": "apprentice",
				"quality": "legendary",
				"base_strength": 19,
				"enhancement_level": 8
			},
			"weapon": {
				"uuid": "uu1~test~demo~weapon~001",
				"element_type": "item",
				"slot": "weapon",
				"base_hid": "axe",
				"qualifier1_hid": "admirable",
				"qualifier2_hid": "adjudicator",
				"quality": "uncommon",
				"base_strength": 2,
				"enhancement_level": 0
			}
		},
		"unslotted": [
			{
				"uuid": "uu1~test~demo~weapon~002",
				"element_type": "item",
				"slot": "weapon",
				"base_hid": "bow",
				"qualifier1_hid": "arcanic",
				"qualifier2_hid": "ambassador",
				"quality": "legendary",
				"base_strength": 19,
				"enhancement_level": 8
			},
			{
				"uuid": "uu1~test~demo~armor~0001",
				"element_type": "item",
				"slot": "armor",
				"base_hid": "armguards",
				"qualifier1_hid": "bone",
				"qualifier2_hid": "ancients",
				"quality": "uncommon",
				"base_strength": 2,
				"enhancement_level": 0
			},
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null
		]
	},
	"wallet": {
		"schema_version": 1,
		"revision": 42,
		"coin_count": 23456,
		"token_count": 89
	},
	"prng": {
		"schema_version": 1,
		"revision": 108,
		"seed": 1234,
		"use_count": 107
	},
	"last_adventure": {
		"hid": "fight_lost_any",
		"uuid": "uu1de1~EVAdXlW5_p23Ro4OH",
		"good": true,
		"encounter": {
			"name": "chicken",
			"level": 7,
			"rank": "elite",
			"possible_emoji": "🐓"
		},
		"gains": {
			"level": 0,
			"health": 0,
			"mana": 0,
			"strength": 0,
			"agility": 0,
			"charisma": 0,
			"wisdom": 0,
			"luck": 1,
			"coin": 0,
			"token": 0,
			"armor": null,
			"weapon": null,
			"armor_improvement": false,
			"weapon_improvement": false
		}
	},
	"click_count": 86,
	"good_click_count": 86,
	"meaningful_interaction_count": 86
})

// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS: any = deepFreeze({
	to_v5: {
	},

	avatar: CharacterState.MIGRATION_HINTS_FOR_TESTS,
	inventory: InventoryState.MIGRATION_HINTS_FOR_TESTS,
	wallet: WalletState.MIGRATION_HINTS_FOR_TESTS,
	prng: PRNGState.MIGRATION_HINTS_FOR_TESTS,
})

/////////////////////

export {
	DEMO_ADVENTURE_01,
	DEMO_ADVENTURE_02,
	DEMO_ADVENTURE_03,
	DEMO_ADVENTURE_04,
	DEMO_STATE,
	OLDEST_LEGACY_STATE_FOR_TESTS,
	MIGRATION_HINTS_FOR_TESTS,
}

/////////////////////
