import deepFreeze from 'deep-freeze-strict'

import { State } from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 3,

	redeemed_codes: {
		BORED: {
			"redeem_count": 1,
			"last_redeem_date_minutes": "20181030_21h23"
		}
	},
})

/////////////////////

export {
	DEMO_STATE,
}
