import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import assert from 'tiny-invariant'

import { State } from './types'
import * as FlagsReducers from '../state--flags/reducers'
import * as GuildMembershipReducers from '../state--guild-membership/reducers'
import * as RelationshipReducers from '../state--relationship/reducers'

import { get_required_xp_for_next_level } from './selectors'
import * as SSRRankLib from '../type--SSR-rank'
import * as GuildStateLib from '../state--guild-membership/reducers'


/////////////////////

export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,

		flags: FlagsReducers.create(),

		mc: {
			xp: 0,
			level: 1,
			equipment: undefined,
			guild: GuildMembershipReducers.create(),
		},

		npcs: {
			heroine: {
				guild: GuildMembershipReducers.create(),
				relationship: RelationshipReducers.create(),
			},
			BBEG: {},
		},
	}
}

/////////////////////

export function randomize_post_create(state: Immutable<State>, params: Immutable<{}> = {}): Immutable<State> {
	return state
}

export function reduceⵧupdate_to_now(state: Immutable<State>, time: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	return state
}

function _get_meaningful_xp_gain(state: Immutable<State>): number {
	return Math.trunc(get_required_xp_for_next_level(state.mc.level) / 20) * 10
}
interface XPGainParams {
	gain: number
}
export function _reduceⵧgain_xp(state: Immutable<State>, params: Immutable<XPGainParams> = { gain: _get_meaningful_xp_gain(state) }): Immutable<State> {
	let { xp, level } = state.mc
	let xp_gain = params.gain
	while (xp_gain) {
		const total_required_xp = get_required_xp_for_next_level(level)
		const remaining_required_xp = total_required_xp - xp
		if (xp_gain >= remaining_required_xp) {
			xp_gain -= remaining_required_xp
			xp = 0
			level++
		}
		else {
			xp += xp_gain
			xp_gain = 0
		}
	}

	return {
		...state,
		revision: state.revision + 1,

		mc: {
			...state.mc,
			level,
			xp,
		},
	}
}

/////////////////////

export function reduceⵧsnowflake(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		flags: FlagsReducers.reduceⵧsnowflake(state.flags),

		mc: {
			...state.mc,
			level: 60,
			guild: GuildMembershipReducers.reduceⵧsnowflake(state.mc.guild),
		},

		npcs: {
			...state.npcs,
			heroine: {
				...state.npcs.heroine,
				guild: GuildMembershipReducers.reduceⵧsnowflake(state.npcs.heroine.guild),
				relationship: RelationshipReducers.reduceⵧsnowflake(state.npcs.heroine.relationship),
			},
		},
	}
}

/////////////////////

export interface ExploreParams {}
export function reduceⵧexplore(state: Immutable<State>, params: Immutable<ExploreParams>): Immutable<State> {
	return _reduceⵧgain_xp(state)
}

export interface TrainParams {}
export function reduceⵧtrain(state: Immutable<State>, params: Immutable<TrainParams>): Immutable<State> {
	return _reduceⵧgain_xp(state)
}

export interface QuestParams {}
export function reduceⵧdo_quest(state: Immutable<State>, params: Immutable<QuestParams>): Immutable<State> {
	return _reduceⵧgain_xp(state)
}

export interface GuildRankUpParams {}
export function reduceⵧguild_rank_up(state: Immutable<State>, params: Immutable<GuildRankUpParams>): Immutable<State> {
	const current_rank = state.mc.guild.rank

	assert(!SSRRankLib.is_max(current_rank), `reduceⵧguild_rank_up() should not be already max`)

	const can_rank_up: boolean = (() => {
		switch (current_rank) {
			case null:
			case SSRRankLib.SSRRank.F:
				return true

			default:
				console.log('can_rank_up', { current_rank, ci: SSRRankLib.get_corresponding_index(current_rank), li: state.mc.level / 10.})
				return SSRRankLib.get_corresponding_index(current_rank) < state.mc.level / 10.
		}
	})()

	if (!can_rank_up)
		return state // TODO failure message

	return {
		...state,
		revision: state.revision + 1,

		mc: {
			...state.mc,
			guild: GuildStateLib.reduceⵧrank_up(state.mc.guild),
		},

		npcs: {
			...state.npcs,
			heroine: {
				...state.npcs.heroine,
				guild: GuildStateLib.reduceⵧrank_up(state.npcs.heroine.guild),
			},
		},
	}
}

export interface RomanceParams {}
export function reduceⵧromance(state: Immutable<State>, params: Immutable<RomanceParams>): Immutable<State> {
	return reduceⵧsnowflake(state)
}

export interface EatFoodParams {}
export function reduceⵧeat_food(state: Immutable<State>, params: Immutable<EatFoodParams>): Immutable<State> {
	return reduceⵧsnowflake(state)
}

export interface DefeatMookParams {}
export function reduceⵧdefeat_mook(state: Immutable<State>, params: Immutable<DefeatMookParams>): Immutable<State> {
	return _reduceⵧgain_xp(state)
}
