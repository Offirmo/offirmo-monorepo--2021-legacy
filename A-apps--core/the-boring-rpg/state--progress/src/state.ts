/////////////////////

import assert from 'tiny-invariant'
import {
	get_human_readable_UTC_timestamp_days,
	get_human_readable_UTC_timestamp_minutes,
} from '@offirmo-private/timestamps'
import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	AchievementStatus,
	State,
} from './types'

import { get_last_known_achievement_status } from './selectors'

import { OMRSoftExecutionContext, get_lib_SEC } from './sec'

/////////////////////

function create(SEC?: OMRSoftExecutionContext): Immutable<State> {
	return get_lib_SEC(SEC).xTry('create', () => {
		const now_hrtday = get_human_readable_UTC_timestamp_days()
		return enforce_immutability<State>({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			wiki: null,
			flags: null,
			achievements: {},

			statistics: {
				creation_date_hrtday: now_hrtday,
				last_visited_timestamp_hrtday: now_hrtday,
				active_day_count: 1,
				good_play_count: 0,
				bad_play_count: 0,
				encountered_adventures: {},
				encountered_monsters: {},
				good_play_count_by_active_class: {},
				bad_play_count_by_active_class: {},
				fight_won_count: 0,
				fight_lost_count: 0,
				coins_gained: 0,
				tokens_gained: 0,
				items_gained: 0,
				has_account: false,
				is_registered_alpha_player: false,
			},
		})
	})
}

/////////////////////

function _on_activity(state: Immutable<State>, previous_revision: number): Immutable<State> {
	const now_hrtday = get_human_readable_UTC_timestamp_days()
	const is_new_day = state.statistics.last_visited_timestamp_hrtday !== now_hrtday
	if (is_new_day) {
		state = {
			...state,

			statistics: {
				...state.statistics,
				last_visited_timestamp_hrtday: now_hrtday,
				active_day_count: (state.statistics.active_day_count || 0) + 1,
			},

			revision: previous_revision + 1, // to avoid double increment
		}
	}

	return state
}

interface PlayedDetails {
	good: boolean
	adventure_key: string
	encountered_monster_key?: string | null
	active_class: string
	coins_gained: number
	tokens_gained: number
	items_gained: number
}
function on_played(previous_state: Immutable<State>, details: PlayedDetails): Immutable<State> {
	let state = previous_state
	const {
		good,
		adventure_key,
		encountered_monster_key,
		active_class,
		coins_gained,
		tokens_gained,
		items_gained,
	} = details

	// shortcut + drop immutability
	const stats: State['statistics'] = {...state.statistics}

	if(!stats.encountered_adventures[adventure_key]) {
		stats.encountered_adventures = {
			...stats.encountered_adventures,
			[adventure_key]: true,
		}
	}

	if (good) {
		stats.good_play_count++
		stats.good_play_count_by_active_class = {
			// ensure the key is present + immutable
			[active_class]: 0,
			...stats.good_play_count_by_active_class,
		}
		stats.good_play_count_by_active_class[active_class]++
		if (adventure_key.startsWith('fight_won_')) {
			stats.fight_won_count++
		}
		else if (adventure_key.startsWith('fight_lost_')) {
			stats.fight_lost_count++
		}
	}
	else {
		stats.bad_play_count++
		stats.bad_play_count_by_active_class = {
			// ensure the key is present + immutable
			[active_class]: 0,
			...stats.bad_play_count_by_active_class,
		}
		stats.bad_play_count_by_active_class[active_class]++
	}

	if (encountered_monster_key && !stats.encountered_monsters[encountered_monster_key]) {
		stats.encountered_monsters = {
			...stats.encountered_monsters,
			[encountered_monster_key]: true,
		}
	}

	stats.coins_gained += coins_gained
	stats.tokens_gained += tokens_gained
	stats.items_gained += items_gained


	state = {
		...state,

		statistics: stats,

		revision: state.revision + 1,
	}

	return _on_activity(state, previous_state.revision)
}

/////////////////////

function on_achieved(previous_state: Immutable<State>, key: string, new_status: AchievementStatus): Immutable<State> {
	const last_known_status = get_last_known_achievement_status(previous_state, key)

	if (last_known_status === new_status) return previous_state

	if (last_known_status === AchievementStatus.unlocked) {
		// Never remove an achievement, they are sticky.
		// Even if it was a bug, it should be revoked in a migration
		assert(last_known_status !== AchievementStatus.unlocked, `${LIB}: achievements are sticky, they can’t be removed!`)
	}

	const state = {
		...previous_state,

		achievements: {
			...previous_state.achievements,
			[key]: new_status,
		},

		revision: previous_state.revision + 1,
	}
	return _on_activity(state, previous_state.revision)
}

/////////////////////

export {
	create,
	on_played,
	on_achieved,
}

/////////////////////
