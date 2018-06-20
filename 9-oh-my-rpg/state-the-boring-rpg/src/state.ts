/////////////////////

import { Random, Engine } from '@offirmo/random'
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps'
import { UUID, generate_uuid } from '@offirmo/uuid'

/////////////////////

import {
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

import { SCHEMA_VERSION } from './consts'

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

import { SoftExecutionContext, OMRContext, get_lib_SEC } from './sec'
import { receive_item } from './play_adventure'
import { play_good, play_bad } from './play_good'

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

function create(SEC?: SoftExecutionContext): Readonly<State> {
	return get_lib_SEC(SEC).xTry('create', ({enforce_immutability}: OMRContext) => {
		let state: Readonly<State> = {
			schema_version: SCHEMA_VERSION,
			revision: 0,

			uuid: generate_uuid(),
			creation_date: get_human_readable_UTC_timestamp_minutes(),

			avatar: CharacterState.create(SEC),
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

		return enforce_immutability(state)
	})
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
		? {
			...play_bad(state, explicit_adventure_archetype_hid),
			energy: EnergyState.loose_all_energy(state.energy), // punishment
		}
		: {
			...play_good(state, explicit_adventure_archetype_hid),
			energy: EnergyState.use_energy(state.energy),
		}

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
		avatar: rename(get_lib_SEC(), state.avatar, new_name),

		// TODO count it as a meaningful interaction only once
		meaningful_interaction_count: state.meaningful_interaction_count + 1,

		revision: state.revision + 1,
	}

	return state
}

function change_avatar_class(state: Readonly<State>, new_class: CharacterClass): Readonly<State> {
	state = {
		...state,
		avatar: switch_class(get_lib_SEC(), state.avatar, new_class),

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
}

/////////////////////
