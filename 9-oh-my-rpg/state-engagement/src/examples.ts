import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import {
	EngagementType,
	State,
} from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Immutable<State> = enforce_immutability<State>({
	schema_version: 1,
	revision: 42,

	queue: [
		{
			uid: 42,
			engagement: {
				key: 'hello_world--flow',
				type: EngagementType.flow,
			},
			params: {},
		},
	],
})

/////////////////////

export {
	DEMO_STATE,
}
