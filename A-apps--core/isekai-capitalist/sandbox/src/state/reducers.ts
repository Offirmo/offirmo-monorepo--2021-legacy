import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { State } from './types'
import { create as create_flags, reduce__todo } from '../state--flags/reducers'
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
		},

		relationships: {
			heroine: {
				memories: 0,
				relationship_level: RelationshipLevel.acquaintances,
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

export interface ExploreParams {
}
export function reduceⵧexplore(state: Immutable<State>, params: Immutable<ExploreParams>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		flags: reduce__todo(state.flags),

		character: {
			...state.character,
			level: 100,
		},

		relationships: {
			...state.relationships,
			heroine: {
				...state.relationships.heroine,
				memories: 100,
				relationship_level: RelationshipLevel.baseⵧ3,
			},
		},
	}
}

