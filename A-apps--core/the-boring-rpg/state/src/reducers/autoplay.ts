/////////////////////

import { Immutable} from '@offirmo-private/ts-types'
import { Random, Engine } from '@offirmo/random'
import { get_human_readable_UTC_timestamp_days } from '@offirmo-private/timestamps'
import { get_revision, complete_or_cancel_eager_mutation_propagating_possible_child_mutation } from '@offirmo-private/state-utils'

/////////////////////

import * as CharacterState from '@tbrpg/state--character'
import * as EnergyState from '@oh-my-rpg/state-energy'

import {
	CharacterClass,
} from '@tbrpg/state--character'


/////////////////////

import { State } from '../types'

import {
	get_available_energy_float,
	find_better_unequipped_armor,
	find_better_unequipped_weapon, get_available_classes,
} from '../selectors'

import {
	_lose_all_energy,
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

function _autogroom(state: Immutable<State>, options: { DEBUG?: boolean } = {}): Immutable<State> {
	const { DEBUG } = options

	if (DEBUG) console.log(`  - Autogroom… (inventory holding ${state.u_state.inventory.unslotted.length} items)`)

	// User
	// User class
	if (state.u_state.avatar.klass === CharacterClass.novice) {
		// change class
		const available_classes = get_available_classes(state.u_state)
		const new_class: CharacterClass = Random.pick(Random.engines.nativeMath, available_classes)
		if (DEBUG) console.log(`    - Changing class to ${new_class}…`)
		state = change_avatar_class(state, new_class)
	}
	// User name
	if (state.u_state.avatar.name === CharacterState.DEFAULT_AVATAR_NAME) {
		const new_name = 'A' + Math.abs(state.u_state.prng.seed)
		if (DEBUG) console.log(`    - renaming to ${new_name}…`)
		state = rename_avatar(state, new_name)
	}

	// inventory
	// equip best gear
	const better_weapon = find_better_unequipped_weapon(state.u_state)
	if (better_weapon) {
		state = equip_item(state, better_weapon.uuid)
	}
	const better_armor = find_better_unequipped_armor(state.u_state)
	if (better_armor) {
		state = equip_item(state, better_armor.uuid)
	}

	// in case inventory full
	state = _auto_make_room(state, options)

	// misc: ack the possible notifications
	state = _ack_all_engagements(state)

	return state
}

/* Autoplay, as efficiently as possible,
 * trying to restore as much achievements as possible
 */
function _autoplay(previous_state: Immutable<State>, options: Immutable<{ target_good_play_count?: number, target_bad_play_count?: number, DEBUG?: boolean }> = {}): Immutable<State> {
	let state = previous_state
	let { target_good_play_count, target_bad_play_count, DEBUG } = options

	if (DEBUG) console.log(`- Autoplay g=${target_good_play_count}, b=${target_bad_play_count}..`)

	target_good_play_count = target_good_play_count || 0
	target_bad_play_count = target_bad_play_count || 0
	if (target_good_play_count < 0)
		throw new Error('invalid target_good_play_count!')
	if (target_bad_play_count < 0)
		throw new Error('invalid target_bad_play_count!')

	let last_visited_timestamp_num = (() => {
		const days_needed = Math.ceil((target_good_play_count - state.u_state.progress.statistics.good_play_count) / 8) // TODO magic number!!!
		const from_now = Number(get_human_readable_UTC_timestamp_days()) - days_needed
		return Math.min(from_now, Number(state.u_state.progress.statistics.last_visited_timestamp_hrtday))
	})()
	if (last_visited_timestamp_num !== Number(state.u_state.progress.statistics.last_visited_timestamp_hrtday)) {
		state = {
			...state,
			u_state: {
				...state.u_state,
				progress: {
					...state.u_state.progress,
					statistics: {
						...state.u_state.progress.statistics,
						last_visited_timestamp_hrtday: String(last_visited_timestamp_num),
					},
				},
			},
		}
	}

	state = _autogroom(state, options)

	// do we have energy?
	const available_energy = get_available_energy_float(state.t_state)
	let have_energy = available_energy >= 1.

	if (target_bad_play_count > state.u_state.progress.statistics.bad_play_count) {
		if (have_energy) {
			state = _lose_all_energy(state)
		}

		// play bad
		for (let i = state.u_state.progress.statistics.bad_play_count; i < target_bad_play_count; ++i) {
			if (DEBUG) console.log('  - playing bad...')
			state = play(state)
			state = _autogroom(state, options)
		}
	}

	if (target_good_play_count > state.u_state.progress.statistics.good_play_count) {
		// play good
		for (let i = state.u_state.progress.statistics.good_play_count; i < target_good_play_count; ++i) {
			const available_energy = get_available_energy_float(state.t_state)
			have_energy = available_energy >= 1.

			if (!have_energy) {
				// replenish and pretend one day has passed
				const t_state_e = EnergyState.restore_energy([state.u_state.energy, state.t_state.energy])
				last_visited_timestamp_num++
				state = {
					...state,
					u_state: {
						...state.u_state,
						progress: {
							...state.u_state.progress,
							statistics: {
								...state.u_state.progress.statistics,
								last_visited_timestamp_hrtday: String(last_visited_timestamp_num),
							},
						},
					},
					t_state: {
						...state.t_state,
						energy: t_state_e,
					},
				}
			}

			if (DEBUG) console.log('  - playing good...')
			state = play(state)
			state = _autogroom(state, options)
		}
	}

	// make it so the remaining energy is the same as when we started, to not prevent immediate play
	state = {
		...state,
		t_state: {
			...state.t_state,
			energy: {
				...state.t_state.energy,
				available_energy: previous_state.t_state.energy.available_energy,
			}
		}
	}

	state = _refresh_achievements(state)
	state = _ack_all_engagements(state)
	if (get_revision(state) === get_revision(previous_state))
		state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous_state, state, undefined, '_autoplay')

	return state
}

/////////////////////

export {
	_autogroom,
	_autoplay,
}
