/////////////////////

import { Random, Engine } from '@offirmo/random'

/////////////////////

import * as EnergyState from '@oh-my-rpg/state-energy'
import * as ProgressState from '@oh-my-rpg/state-progress'

/////////////////////

import { State } from '../../../types'

import { get_available_energy_float } from '../../../selectors'
import { _update_to_now } from '../internal'
import { play_good } from './play_good'
import { play_bad } from './play_bad'
import { _refresh_achievements } from '../achievements'

/////////////////////

// note: allows passing an explicit adventure archetype for testing
function play(state: Readonly<State>, explicit_adventure_archetype_hid?: string): Readonly<State> {
	state = _update_to_now(state)

	const available_energy = get_available_energy_float(state)
	const is_good_play = available_energy >= 1.

	// consume energy
	let [ u_state, t_state ] = state.energy
	t_state = is_good_play
		? EnergyState.use_energy(state.energy)
		: EnergyState.loose_all_energy(state.energy) // punishment
	state = {
			...state,
			energy: [ u_state, t_state ],
		}

		// actual play
	state = is_good_play
		? play_good(state, explicit_adventure_archetype_hid)
		: play_bad(state, explicit_adventure_archetype_hid)

	// final updates
	state = {
		...state,

		progress: ProgressState.on_played(state.progress, {
			good: is_good_play,
			adventure_key: state.last_adventure!.hid,
			encountered_monster_key: state.last_adventure!.encounter
				? state.last_adventure!.encounter!.name
				: null,
			active_class: state.avatar.klass,
			coins_gained: state.last_adventure!.gains.coin,
			tokens_gained: state.last_adventure!.gains.token,
			items_gained: (state.last_adventure!.gains.armor ? 1 : 0) + (state.last_adventure!.gains.weapon ? 1 : 0),
		}),

		revision: state.revision + 1,
	}

	return _refresh_achievements(state)
}

/////////////////////

export {
	play,
}

/////////////////////
