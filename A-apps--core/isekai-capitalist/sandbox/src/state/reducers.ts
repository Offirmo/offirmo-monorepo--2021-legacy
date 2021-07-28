import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { State } from './types'
import * as FlagsReducers from '../state--flags/reducers'
import * as GuildMembershipReducers from '../state--guild-membership/reducers'
import * as RelationshipReducers from '../state--relationship/reducers'

import { RelationshipLevel } from '../type--relationship-level/types'


/////////////////////

export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,

		flags: FlagsReducers.create(),

		character: {
			experience: 0,
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

export function randomize_post_create(state: Immutable<State>, params: Immutable<{}> = {}): Immutable<State> {
	return state
}

export function reduceⵧupdate_to_now(state: Immutable<State>, time: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	return state
}

/////////////////////

export function reduceⵧsnowflake(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		flags: FlagsReducers.reduceⵧsnowflake(state.flags),

		character: {
			...state.character,
			level: 100,
			guild: GuildMembershipReducers.reduceⵧsnowflake(state.character.guild),
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
	return reduceⵧsnowflake(state)
}

export interface TrainParams {}
export function reduceⵧtrain(state: Immutable<State>, params: Immutable<TrainParams>): Immutable<State> {
	return reduceⵧsnowflake(state)
}

export interface QuestParams {}
export function reduceⵧdo_quest(state: Immutable<State>, params: Immutable<QuestParams>): Immutable<State> {
	return reduceⵧsnowflake(state)
}

export interface GuildRankUpParams {}
export function reduceⵧguild_rank_up(state: Immutable<State>, params: Immutable<GuildRankUpParams>): Immutable<State> {
	return reduceⵧsnowflake(state)
}

export interface RomanceParams {}
export function reduceⵧromance(state: Immutable<State>, params: Immutable<RomanceParams>): Immutable<State> {
	return reduceⵧsnowflake(state)
}

export interface EatFoodParams {}
export function reduceⵧeat_food(state: Immutable<State>, params: Immutable<EatFoodParams>): Immutable<State> {
	return reduceⵧsnowflake(state)
}

