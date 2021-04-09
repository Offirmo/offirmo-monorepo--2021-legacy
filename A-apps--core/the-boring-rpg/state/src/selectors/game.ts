import { Enum } from 'typescript-string-enums'
import { Immutable} from '@offirmo-private/ts-types'

import { CharacterClass } from '@tbrpg/state--character'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

/////////////////////

import { State, UState } from '../types'
import { get_available_energy_float } from './energy'
import { _update_to_now } from '../reducers/internal'

/////////////////////

function get_available_classes(u_state: Immutable<UState>): CharacterClass[] {
	return Enum.keys(CharacterClass)
		.filter(klass => klass !== CharacterClass.novice)
}

function will_next_play_be_good_at(state: Immutable<State>, now_ms: TimestampUTCMs): boolean {
	state = _update_to_now(state, now_ms)

	const { t_state } = state

	const available_energy = get_available_energy_float(t_state)
	const is_good_play = available_energy >= 1.

	return is_good_play
}

/////////////////////

export {
	get_available_classes,
	will_next_play_be_good_at,
}

/////////////////////
