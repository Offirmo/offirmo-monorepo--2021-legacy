/////////////////////

import { Immutable} from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { complete_or_cancel_eager_mutation_propagating_possible_child_mutation } from '@offirmo-private/state-utils'

/////////////////////

import * as EnergyState from '@oh-my-rpg/state-energy'
import * as ProgressState from '@tbrpg/state--progress'

/////////////////////

import { State } from '../../types'

import { will_next_play_be_good_at } from '../../selectors'
import { _update_to_now } from '../internal'
import { _play_good } from './play_good'
import { _play_bad } from './play_bad'
import { _refresh_achievements } from '../achievements'

/////////////////////

// note: allows passing an explicit adventure archetype for testing
function play(previous_state: Immutable<State>, now_ms: TimestampUTCMs = get_UTC_timestamp_ms(), explicit_adventure_archetype_hid?: string): Immutable<State> {
	let updated_state = _update_to_now(previous_state, now_ms)
	let state = updated_state

	const is_good_play = will_next_play_be_good_at(state, now_ms)

	// consume energy
	if (!is_good_play) {
		state = {
			...state,
			t_state: {
				...state.t_state,
				// punishment
				energy: EnergyState.lose_all_energy([state.u_state.energy, state.t_state.energy]),
				revision: state.t_state.revision + 1,
			},
		}
	}
	else {
		const [ u, t ] = EnergyState.use_energy([state.u_state.energy, state.t_state.energy])
		state = {
			...state,
			u_state: {
				...state.u_state,
				energy: u,
				// revision will be incremented below
			},
			t_state: {
				...state.t_state,
				energy: t,
				revision: state.t_state.revision + 1,
			},
		}

		// onboarding
		if (!explicit_adventure_archetype_hid) {
			const { good_play_count } = state.u_state.progress.statistics
			explicit_adventure_archetype_hid = [
				'talk_to_all_villagers',
				'rematch',
				'fight_won_coins',
				'high_level_zone_2',
				'found_random_mushroom',
				'class_grimoire',
				'progress_loop',
				'fight_won_any',
				'found_swirling_potion',
				'castle_summon',
				'arrow_in_the_knee',
				'inspect_sewers',
				'side_quests',
				'fight_won_coins',
			][good_play_count]
		}
	}

	// actual play
	state = is_good_play
		? _play_good(state, explicit_adventure_archetype_hid)
		: _play_bad(state, explicit_adventure_archetype_hid)

	// final updates
	const u_state = state.u_state
	state = {
		...state,
		last_user_investment_tms: now_ms,

		u_state: {
			...u_state,
			revision: state.u_state.revision + 1,
			progress: ProgressState.on_played(u_state.progress, {
				good: is_good_play,
				adventure_key: u_state.last_adventure!.hid,
				encountered_monster_key: u_state.last_adventure!.encounter
					? u_state.last_adventure!.encounter!.name
					: null,
				active_class: u_state.avatar.klass,
				coins_gained: u_state.last_adventure!.gains.coin,
				tokens_gained: u_state.last_adventure!.gains.token,
				items_gained: (u_state.last_adventure!.gains.armor ? 1 : 0) + (u_state.last_adventure!.gains.weapon ? 1 : 0),
			}),
		},
	}

	return _refresh_achievements(state)
}

/////////////////////

export {
	play,
}

/////////////////////
