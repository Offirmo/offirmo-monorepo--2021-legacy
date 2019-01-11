/////////////////////

import { Enum } from 'typescript-string-enums'
import { Random, Engine } from '@offirmo/random'
import { get_human_readable_UTC_timestamp_days } from '@offirmo/timestamps'

/////////////////////

import { appraise_power_normalized } from '@oh-my-rpg/logic-shop'

import * as CharacterState from '@oh-my-rpg/state-character'
import * as EnergyState from '@oh-my-rpg/state-energy'

import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@oh-my-rpg/state-character'

import { Currency } from '@oh-my-rpg/state-wallet'

import {
	get_prng,
	generate_random_seed,
} from '@oh-my-rpg/state-prng'

import { Weapon } from '@oh-my-rpg/logic-weapons'
import { Armor } from '@oh-my-rpg/logic-armors'

/////////////////////

import { State } from '../../types'

import {
	get_available_energy_float,
	find_better_unequipped_armor,
	find_better_unequipped_weapon,
} from '../../selectors'

import {
	_loose_all_energy,
	_auto_make_room,
	_ack_all_engagements,
} from './internal'

import {
	rename_avatar,
	change_avatar_class,
	equip_item,
} from './base'

import {
	play,
} from './play'

import { _refresh_achievements } from './achievements'

/////////////////////

function _autogroom(state: Readonly<State>, options: { DEBUG?: boolean } = {}): Readonly<State> {
	const { DEBUG } = options

	if (DEBUG) console.log(`  - Autogroom… (inventory holding ${state.inventory.unslotted.length} items)`)

	// User
	// User class
	if (state.avatar.klass === CharacterClass.novice) {
		// change class
		let new_class: CharacterClass = Random.pick(Random.engines.nativeMath, Enum.values(CharacterClass))
		if (DEBUG) console.log(`    - Changing class to ${new_class}…`)
		state = change_avatar_class(state, new_class)
	}
	// User name
	if (state.avatar.name === CharacterState.DEFAULT_AVATAR_NAME) {
		let new_name = 'A' + state.uuid.slice(3)
		if (DEBUG) console.log(`    - renaming to ${new_name}…`)
		state = rename_avatar(state, new_name)
	}

	// inventory
	// equip best gear
	const better_weapon = find_better_unequipped_weapon(state)
	if (better_weapon) {
		state = equip_item(state, better_weapon.uuid)
	}
	const better_armor = find_better_unequipped_armor(state)
	if (better_armor) {
		state = equip_item(state, better_armor.uuid)
	}

	// inventory full
	state = _auto_make_room(state, options)

	// misc: ack the possible notifications
	state = _ack_all_engagements(state)

	return state
}

/* Autoplay,
 * as efficiently as possible,
 * trying to restore as much achievements as possible
 */
function autoplay(state: Readonly<State>, options: Readonly<{ target_good_play_count?: number, target_bad_play_count?: number, DEBUG?: boolean }> = {}): Readonly<State> {
	let { target_good_play_count, target_bad_play_count, DEBUG } = options

	if (DEBUG) console.log(`- Autoplay...`)

	target_good_play_count = target_good_play_count || 0
	target_bad_play_count = target_bad_play_count || 0
	if (target_good_play_count < 0)
		throw new Error('invalid target_good_play_count!')
	if (target_bad_play_count < 0)
		throw new Error('invalid target_bad_play_count!')
	if (target_good_play_count === 0 && target_bad_play_count === 0)
		target_good_play_count = state.progress.statistics.good_play_count + 1

	let last_visited_timestamp_num = (() => {
		const days_needed = Math.ceil((target_good_play_count - state.progress.statistics.good_play_count) / 8)
		const from_now = Number(get_human_readable_UTC_timestamp_days()) - days_needed
		return Math.min(from_now, Number(state.progress.statistics.last_visited_timestamp))
	})()
	if (last_visited_timestamp_num !== Number(state.progress.statistics.last_visited_timestamp)) {
		state = {
			...state,
			progress: {
				...state.progress,
				statistics: {
					...state.progress.statistics,
					last_visited_timestamp: String(last_visited_timestamp_num)
				}
			}
		}
	}
	state = _autogroom(state, options)

	// do we have energy?
	let available_energy = get_available_energy_float(state)
	let have_energy = available_energy >= 1.

	if (target_bad_play_count > state.progress.statistics.bad_play_count) {
		if (have_energy) {
			state = _loose_all_energy(state)
		}

		// play bad
		for (let i = state.progress.statistics.bad_play_count; i < target_bad_play_count; ++i) {
			if (DEBUG) console.log('  - playing bad...')
			state = play(state)
			state = _autogroom(state, options)
		}
	}

	if (target_good_play_count > state.progress.statistics.good_play_count) {
		// play good
		for (let i = state.progress.statistics.good_play_count; i < target_good_play_count; ++i) {
			let available_energy = get_available_energy_float(state)
			have_energy = available_energy >= 1.

			if (!have_energy) {
				// replenish and pretend one day has passed
				let [ u_state, t_state ] = state.energy
				t_state = EnergyState.restore_energy(state.energy)
				last_visited_timestamp_num++
				state = {
					...state,
					energy: [ u_state, t_state ],
					progress: {
						...state.progress,
						statistics: {
							...state.progress.statistics,
							last_visited_timestamp: String(last_visited_timestamp_num)
						}
					}
				}
			}

			if (DEBUG) console.log('  - playing good...')
			state = play(state)
			state = _autogroom(state, options)
		}
	}

	// misc: refresh achievements one last time
	// and ack the possible notifications
	state = _refresh_achievements(state)
	state = _ack_all_engagements(state)

	return state
}

/////////////////////

export {
	_autogroom,
	autoplay,
}
