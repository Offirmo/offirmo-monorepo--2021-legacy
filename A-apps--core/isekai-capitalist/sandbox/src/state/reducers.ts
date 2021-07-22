import { Immutable } from '@offirmo-private/ts-types'

import { State } from './types'
import { create as create_flags } from '../state--flags/reducers'
import { RelationshipLevel } from '../type--relationship-level/types'


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

			}
		}
	}
}



export interface ExploreAction {
}
export function explore(state: Immutable<State>, action: Immutable<ExploreAction>): Immutable<State> {
	return state
}
