/////////////////////

import { Random, Engine } from '@offirmo/random'
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps'
import { generate_uuid } from '@offirmo/uuid'

/////////////////////

import { ItemQuality } from '@oh-my-rpg/definitions'

import * as CharacterState from '@oh-my-rpg/state-character'
import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as EnergyState from '@oh-my-rpg/state-energy'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as PRNGState from '@oh-my-rpg/state-prng'
import * as CodesState from '@oh-my-rpg/state-codes'
import * as ProgressState from '@oh-my-rpg/state-progress'

import { Currency } from '@oh-my-rpg/state-wallet'

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

import { SCHEMA_VERSION } from '../../consts'
import { SoftExecutionContext, OMRContext, get_lib_SEC } from '../../sec'
import { State } from '../../types'
import { EngagementKey } from '../../engagement'
import { _receive_item, equip_item } from './base'
import { _refresh_achievements } from './achievements'

/////////////////////

const STARTING_WEAPON_SPEC: Readonly<Partial<Weapon>> = {
	base_hid: 'spoon',
	qualifier1_hid: 'used',
	qualifier2_hid: 'noob',
	quality: ItemQuality.common,
	base_strength: 1,
}
const STARTING_ARMOR_SPEC: Readonly<Partial<Armor>> = {
	base_hid: 'socks',
	qualifier1_hid: 'used',
	qualifier2_hid: 'noob',
	quality: ItemQuality.common,
	base_strength: 1,
}

function create(SEC?: SoftExecutionContext): Readonly<State> {
	return get_lib_SEC(SEC).xTry('create', ({enforce_immutability}: OMRContext) => {
		let state: Readonly<State> = {
			schema_version: SCHEMA_VERSION,
			revision: 0,

			uuid: generate_uuid(),
			creation_date: get_human_readable_UTC_timestamp_minutes(),

			avatar: CharacterState.create(SEC),
			inventory: InventoryState.create(SEC),
			wallet: WalletState.create(),
			prng: PRNGState.create(),
			energy: EnergyState.create(),
			engagement: EngagementState.create(SEC),
			codes: CodesState.create(SEC),
			progress: ProgressState.create(SEC),

			last_adventure: null,
		}

		let rng = get_prng(state.prng)

		const starting_weapon = create_weapon(rng, STARTING_WEAPON_SPEC)
		state = _receive_item(state, starting_weapon)
		state = equip_item(state, starting_weapon.uuid)

		const starting_armor = create_armor(rng, STARTING_ARMOR_SPEC)
		state = _receive_item(state, starting_armor)
		state = equip_item(state, starting_armor.uuid)

		state = _refresh_achievements(state) // there are some initial achievements
		// reset engagements that may have been created by noisy initial achievements
		state = {
			...state,
			engagement: {
				...state.engagement,
				queue: [],
			}
		}

		// now insert some relevant start engagements
		state = {
			...state,
			engagement: EngagementState.enqueue(state.engagement, {
				type: EngagementState.EngagementType.flow,
				key: EngagementKey['tip--first_play']
			}),
		}

		//state.prng = PRNGState.update_use_count(state.prng, rng)

		state = {
			...state,

			// to compensate sub-functions use during build
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

/////////////////////

export {
	STARTING_WEAPON_SPEC,
	STARTING_ARMOR_SPEC,

	create,
	reseed,
}

/////////////////////
