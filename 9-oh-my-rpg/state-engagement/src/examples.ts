import deep_freeze from 'deep-freeze-strict'

import {
	EngagementType,
	State,
} from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Readonly<State> = deep_freeze<State>({
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
