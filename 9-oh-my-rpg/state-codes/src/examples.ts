import deepFreeze from 'deep-freeze-strict'

import {
	CodeRedemption,
	State,
} from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 42,

	redeemed_codes: [
		// TODO
	],
})

/////////////////////

export {
	DEMO_STATE,
}
