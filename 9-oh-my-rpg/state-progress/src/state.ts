/////////////////////

import { Enum } from 'typescript-string-enums'
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps'

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

interface PlayedDetails {
	good: boolean
	adventure_key: string
	encountered_monster_key?: string | null
	active_class: string
}
function on_played(state: Readonly<State>, details: PlayedDetails): Readonly<State> {
	const { good, adventure_key, encountered_monster_key, active_class } = details

	state = {
		...state,

		// mutate the root of fields we'll change below
		statistics: {
			...state.statistics,
		},
	}

	if(!state.statistics.encountered_adventures[adventure_key]) {
		state.statistics.encountered_adventures = {
			...state.statistics.encountered_adventures,
			[adventure_key]: true,
		}
	}

	if (good) {
		state.statistics.good_play_count++
		state.statistics.good_play_count_by_active_class = {
			// ensure the key is present + immutable
			[active_class]: 0,
			...state.statistics.good_play_count_by_active_class,
		}
		state.statistics.good_play_count_by_active_class[active_class]++
	}
	else {
		state.statistics.bad_play_count++
		state.statistics.bad_play_count_by_active_class = {
			// ensure the key is present + immutable
			[active_class]: 0,
			...state.statistics.bad_play_count_by_active_class,
		}
		state.statistics.bad_play_count_by_active_class[active_class]++
	}

	if (encountered_monster_key && !state.statistics.encountered_monsters[encountered_monster_key]) {
		state.statistics.encountered_monsters = {
			...state.statistics.encountered_monsters,
			[encountered_monster_key]: true,
		}
	}

	return {
		...state,

		revision: state.revision + 1,
	}
}

/////////////////////

function on_achieved(state: Readonly<State>, key: string, new_status: AchievementStatus): Readonly<State> {
	return {
		...state,

		achievements: {
			...state.achievements,
			[key]: new_status,
		},

		revision: state.revision + 1,
	}
}

/////////////////////

export {
	create,
	on_played,
	on_achieved,
}

/////////////////////
