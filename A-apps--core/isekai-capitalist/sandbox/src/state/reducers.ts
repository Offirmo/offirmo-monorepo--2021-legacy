import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { State } from './types'
import {
	create as create_flags,
	reduceⵧsnowflake as reduceⵧsnowflake__flags,
} from '../state--flags/reducers'
import {
	create as create_guild_membership,
	reduceⵧsnowflake as reduceⵧsnowflake__guild,
} from '../state--guild-membership/reducers'
import { RelationshipLevel } from '../type--relationship-level/types'


/////////////////////

export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,

		flags: create_flags(),

		character: {
			experience: 0,
			level: 1,
			equipment: undefined,
			guild: create_guild_membership(),
		},

		relationships: {
			heroine: {
				memories: 0,
				relationship_level: RelationshipLevel.acquaintances,
				guild: create_guild_membership(),
			},
			BBEG: {

			},
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

export interface ExploreParams {}
export function reduceⵧexplore(state: Immutable<State>, params: Immutable<ExploreParams>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		flags: reduceⵧsnowflake__flags(state.flags),
	}
}

export interface QuestParams {}
export function reduceⵧdo_quest(state: Immutable<State>, params: Immutable<QuestParams>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		character: {
			...state.character,
			guild: reduceⵧsnowflake__guild(state.character.guild),
		},
	}
}

export interface GuildRankUpParams {}
export function reduceⵧguild_rank_up(state: Immutable<State>, params: Immutable<GuildRankUpParams>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		character: {
			...state.character,
			guild: reduceⵧsnowflake__guild(state.character.guild),
		},
	}
}

export interface RomanceParams {}
export function reduceⵧromance(state: Immutable<State>, params: Immutable<RomanceParams>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		relationships: {
			...state.relationships,
			heroine: {
				...state.relationships.heroine,
				memories: 100,
				relationship_level: RelationshipLevel.baseⵧ3,
				guild: reduceⵧsnowflake__guild(state.relationships.heroine.guild),
			},
		},
	}
}
