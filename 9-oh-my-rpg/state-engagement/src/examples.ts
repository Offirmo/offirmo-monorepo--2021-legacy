import deepFreeze from 'deep-freeze-strict'

import {
	EngagementType,
	State,
} from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 42,

	queue: [
		{
			engagement: {
				key: 'new-game-welcome',
				type: EngagementType.flow,
			},
			queue_time_root_revision: 0,
		}
	],
})

/////////////////////

export {
	DEMO_STATE,
}
