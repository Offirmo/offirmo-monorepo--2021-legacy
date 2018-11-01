/////////////////////

import { Enum } from 'typescript-string-enums'
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps'

import { SCHEMA_VERSION } from './consts'

import {
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

			flags: null,

			achievements: null,

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

	const new_state: State = {
		...state,

		// mutate the root fields we'll change below
		statistics: {
			...state.statistics,
		},
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

	if (encountered_monster_key && !state.statistics.encountered_monsters[encountered_monster_key]) {
		new_state.statistics.encountered_monsters = {
			...new_state.statistics.encountered_monsters,
			[encountered_monster_key]: true,
		}
	}

	return {
		...new_state,

		revision: state.revision + 1,
	}
}

/////////////////////

export {
	create,
	on_played,
}

/////////////////////
