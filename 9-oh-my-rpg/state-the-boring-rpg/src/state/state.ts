/////////////////////

import { Random, Engine } from '@offirmo/random'
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps'
import { UUID, generate_uuid } from '@offirmo/uuid'

/////////////////////

import { ItemQuality } from '@oh-my-rpg/definitions'

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
} from '@oh-my-rpg/logic-weapons'

import {
	Armor,
	create as create_armor,
} from '@oh-my-rpg/logic-armors'

/////////////////////

import { SCHEMA_VERSION } from '../consts'

import { State } from '../types'

import {
	appraise_item_value,
} from '../selectors'

import { SoftExecutionContext, OMRContext, get_lib_SEC } from '../sec'
import { receive_item } from './play_adventure'
import { play_good } from './play_good'
import { play_bad } from './play_bad'

/////////////////////

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
	const price = appraise_item_value(state, uuid)

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

export {
	create,

	reseed,
	play,
	equip_item,
	sell_item,
	rename_avatar,
	change_avatar_class,
}

/////////////////////
