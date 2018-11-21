/////////////////////

import { Enum } from 'typescript-string-enums'
import { get_human_readable_UTC_timestamp_days } from '@offirmo/timestamps'

import { SCHEMA_VERSION } from './consts'

import {
	AchievementStatus,
	State,
} from './types'

import { } from './selectors'

import { SoftExecutionContext, OMRContext, get_lib_SEC } from './sec'

/////////////////////

function create(SEC?: SoftExecutionContext): Readonly<State> {
	return get_lib_SEC(SEC).xTry('create', ({enforce_immutability}: OMRContext) => {
		return enforce_immutability({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			wiki: null,
			flags: null,
			achievements: {},

			statistics: {
				last_visited_timestamp: get_human_readable_UTC_timestamp_days(),
				active_day_count: 1,
				good_play_count: 0,
				bad_play_count: 0,
				encountered_adventures: {},
				encountered_monsters: {},
				good_play_count_by_active_class: {},
				bad_play_count_by_active_class: {},
				has_account: false,
				is_registered_alpha_player: false,
			}
		})
	})
}

/////////////////////

function _on_activity(state: Readonly<State>, previous_revision: number): Readonly<State> {
	const new_state = {
		...state,

		statistics: {
			...state.statistics,
			last_visited_timestamp: get_human_readable_UTC_timestamp_days(),
		},

		revision: previous_revision + 1,
	}

	const is_new_day = state.statistics.last_visited_timestamp !== new_state.statistics.last_visited_timestamp
	if (!is_new_day)
		return state // FOR NOW?

	new_state.statistics.active_day_count++

	return new_state
}

function on_start_session(state: Readonly<State>): Readonly<State> {
	return _on_activity(state, state.revision)
}

interface PlayedDetails {
	good: boolean
	adventure_key: string
	encountered_monster_key?: string | null
	active_class: string
}
function on_played(state: Readonly<State>, details: PlayedDetails): Readonly<State> {
	const { good, adventure_key, encountered_monster_key, active_class } = details

	const new_state = {
		...state,

		// mutate the root of fields we'll change below
		statistics: {
			...state.statistics,
		},

		revision: state.revision + 1,
	}

	if(!new_state.statistics.encountered_adventures[adventure_key]) {
		new_state.statistics.encountered_adventures = {
			...new_state.statistics.encountered_adventures,
			[adventure_key]: true,
		}
	}

	if (good) {
		new_state.statistics.good_play_count++
		new_state.statistics.good_play_count_by_active_class = {
			// ensure the key is present + immutable
			[active_class]: 0,
			...new_state.statistics.good_play_count_by_active_class,
		}
		new_state.statistics.good_play_count_by_active_class[active_class]++
	}
	else {
		new_state.statistics.bad_play_count++
		new_state.statistics.bad_play_count_by_active_class = {
			// ensure the key is present + immutable
			[active_class]: 0,
			...new_state.statistics.bad_play_count_by_active_class,
		}
		new_state.statistics.bad_play_count_by_active_class[active_class]++
	}

	if (encountered_monster_key && !new_state.statistics.encountered_monsters[encountered_monster_key]) {
		new_state.statistics.encountered_monsters = {
			...new_state.statistics.encountered_monsters,
			[encountered_monster_key]: true,
		}
	}

	return _on_activity(new_state, state.revision)
}

/////////////////////

function on_achieved(state: Readonly<State>, key: string, new_status: AchievementStatus): Readonly<State> {
	const new_state = {
		...state,

		achievements: {
			...state.achievements,
			[key]: new_status,
		},

		revision: state.revision + 1,
	}
	return _on_activity(new_state, state.revision)
}

/////////////////////

export {
	create,
	on_start_session,
	on_played,
	on_achieved,
}

/////////////////////
