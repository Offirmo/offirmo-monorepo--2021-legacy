import { BaseState } from '@offirmo-private/state-utils'

import { State as FlagsState } from '../state--flags/types'
import { State as GuildState } from '../state--guild-membership/types'
import { RelationshipLevel } from '../type--relationship-level/types'

export interface State extends BaseState {

	flags: FlagsState

	character: {
		experience: number
		level: number
		equipment: undefined
		guild: GuildState
	}

	relationships: {
		heroine: {
			memories: number
			relationship_level: RelationshipLevel
			guild: GuildState
		}
		BBEG: {

		}
	}

}
