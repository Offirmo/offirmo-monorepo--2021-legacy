import { BaseState } from '@offirmo-private/state-utils'

import { State as FlagsState } from '../state--flags/types'
import { State as GuildState } from '../state--guild-membership/types'
import { State as RelationshipState } from '../state--relationship/types'



export interface State extends BaseState {

	flags: FlagsState

	mc: {
		xp: number
		level: number
		equipment: undefined
		guild: GuildState
	}

	npcs: {
		heroine: {
			guild: GuildState,
			relationship: RelationshipState,
		},
		BBEG: {},
	}

}
