import { BaseState } from '@offirmo-private/state-utils'

import { State as FlagsState } from '../state--flags/types'
import { RelationshipLevel } from '../type--relationship-level/types'

export interface State /*extends BaseState*/ {

	flags: FlagsState

	character: {
		experience: number
		level: number
		equipment: undefined
	}

	relationships: {
		heroine: {
			memories: number
			relationship_level: RelationshipLevel
		}
		BBEG: {

		}
	}

}
