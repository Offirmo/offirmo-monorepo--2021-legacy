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

import {
	ActionType,
	ActionCategory,
	Action,
	ActionEquipItem,
	ActionSellItem,
} from './serializable_actions'

import { play_good, play_bad, receive_item } from './play'
import { get_SEC } from './sec'

/////////////////////

function appraise_item(state: Readonly<State>, uuid: UUID): number {
		const item_to_sell = InventoryState.get_item(state.inventory, uuid)
			if (!item_to_sell)
				throw new Error('Sell: No item!')

		return appraise(item_to_sell)
}

function find_element(state: Readonly<State>, uuid: UUID): Element | null {
	return InventoryState.get_item(state.inventory, uuid)
}

function get_actions_for_unslotted_item(state: Readonly<State>, uuid: UUID): Action[] {
	const actions: Action[] = []

	const equip: ActionEquipItem = {
		type: ActionType.equip_item,
		category: ActionCategory.inventory,
		expected_state_revision: state.revision,
		target_uuid: uuid,
	}
	actions.push(equip)

	const sell: ActionSellItem = {
		type: ActionType.sell_item,
		category: ActionCategory.inventory,
		expected_state_revision: state.revision,
		target_uuid: uuid,
	}
	actions.push(sell)

	return actions
}

function get_actions_for_element(state: Readonly<State>, uuid: UUID): Action[] {
	const actions: Action[] = []

	const as_unslotted_item = InventoryState.get_unslotted_item(state.inventory, uuid)
	if (as_unslotted_item)
		actions.push(...get_actions_for_unslotted_item(state, uuid))

	return actions
}

///////

function create(): Readonly<State> {
	let state: Readonly<State> = {
		schema_version: SCHEMA_VERSION,
		revision: 0,

		avatar: CharacterState.create(get_SEC()),
		inventory: InventoryState.create(),
		wallet: WalletState.create(),
		prng: PRNGState.create(),
		energy: EnergyState.create(),

		last_adventure: null,
		click_count: 0,
		good_click_count: 0,
		meaningful_interaction_count: 0,
	}

	let rng = get_prng(state.prng)

	const starting_weapon = create_weapon(rng, {
		base_hid: 'spoon',
		qualifier1_hid: 'used',
		qualifier2_hid: 'noob',
		quality: ItemQuality.common,
		base_strength: 1,
	})
	state = receive_item(state, starting_weapon)
	state = equip_item(state, starting_weapon.uuid)

	const starting_armor = create_armor(rng, {
		base_hid: 'socks',
		qualifier1_hid: 'used',
		qualifier2_hid: 'noob',
		quality: 'common',
		base_strength: 1,
	})
	state = receive_item(state, starting_armor)
	state = equip_item(state, starting_armor.uuid)

	//state.prng = PRNGState.update_use_count(state.prng, rng)

	state = {
		...state,

		// to compensate sub-functions use during build
		meaningful_interaction_count: 0,

		// idem, could have been inc by internally calling actions
		revision: 0,
	}

	return state
}

function reseed(state: Readonly<State>, seed?: number): Readonly<State> {
	seed = seed || generate_random_seed()

	state = {
		...state,
		prng: PRNGState.set_seed(state.prng, seed),
	}

	return state
}

// note: allows passing an explicit adventure archetype for testing
function play(state: Readonly<State>, explicit_adventure_archetype_hid?: string): Readonly<State> {
	const energy_snapshot = EnergyState.get_snapshot(state.energy)

	const intermediate_state = (energy_snapshot.available_energy < 1)
		? play_bad(state, explicit_adventure_archetype_hid)
		: play_good(state, explicit_adventure_archetype_hid)

	state = {
		...intermediate_state,

		revision: state.revision + 1,

		click_count: state.click_count + 1,
		meaningful_interaction_count: state.meaningful_interaction_count + 1,
	}

	return state
}

function equip_item(state: Readonly<State>, uuid: UUID): Readonly<State> {
	state = {
		...state,
		inventory: InventoryState.equip_item(state.inventory, uuid),

		// TODO count it as a meaningful interaction only if positive (or with a limit)
		meaningful_interaction_count: state.meaningful_interaction_count + 1,

		revision: state.revision + 1,
	}

	return state
}

function sell_item(state: Readonly<State>, uuid: UUID): Readonly<State> {
	const price = appraise_item(state, uuid)

	state = {
		...state,
		inventory: InventoryState.remove_item_from_unslotted(state.inventory, uuid),
		wallet: WalletState.add_amount(state.wallet, Currency.coin, price),

		// TODO count it as a meaningful interaction only if positive (or with a limit)
		meaningful_interaction_count: state.meaningful_interaction_count + 1,

		revision: state.revision + 1,
	}

	return state
}

function rename_avatar(state: Readonly<State>, new_name: string): Readonly<State> {
	state = {
		...state,
		avatar: rename(get_SEC(), state.avatar, new_name),

		// TODO count it as a meaningful interaction only once
		meaningful_interaction_count: state.meaningful_interaction_count + 1,

		revision: state.revision + 1,
	}

	return state
}

function change_avatar_class(state: Readonly<State>, new_class: CharacterClass): Readonly<State> {
	state = {
		...state,
		avatar: switch_class(get_SEC(), state.avatar, new_class),

		// TODO count it as a meaningful interaction only if positive (or with a limit)
		meaningful_interaction_count: state.meaningful_interaction_count + 1,

		revision: state.revision + 1,
	}

	return state
}

/////////////////////

function execute(state: Readonly<State>, action: Action): Readonly<State> {
	const { expected_state_revision } = (action as any)
	if (expected_state_revision) {
		if (state.revision !== expected_state_revision)
			throw new Error(`Trying to execute an outdated action!`)
	}

	switch (action.type) {
		case ActionType.play:
			return play(state)
		case ActionType.equip_item:
			return equip_item(state, action.target_uuid)
		case ActionType.sell_item:
			return sell_item(state, action.target_uuid)
		case ActionType.rename_avatar:
			return rename_avatar(state, action.new_name)
		case ActionType.change_avatar_class:
			return change_avatar_class(state, action.new_class)
		default:
			throw new Error(`Unrecognized action!`)
	}
}

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
	GainType,
	Adventure,
	State,

	create,

	reseed,
	play,
	equip_item,
	sell_item,
	rename_avatar,
	change_avatar_class,

	execute,

	appraise_item,
	find_element,
	get_actions_for_element,

	DEMO_ADVENTURE_01,
	DEMO_ADVENTURE_02,
	DEMO_ADVENTURE_03,
	DEMO_ADVENTURE_04,
	DEMO_STATE,
	OLDEST_LEGACY_STATE_FOR_TESTS,
	MIGRATION_HINTS_FOR_TESTS,
}

/////////////////////
