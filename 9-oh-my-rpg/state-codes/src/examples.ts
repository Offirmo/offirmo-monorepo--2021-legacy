import deep_freeze from 'deep-freeze-strict'
import { TEST_TIMESTAMP_MS, get_human_readable_UTC_timestamp_minutes } from '@offirmo-private/timestamps'

import { State } from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Readonly<State> = deep_freeze<State>({
	schema_version: 1,
	revision: 3,

	redeemed_codes: {
		BORED: {
			'redeem_count': 1,
			'last_redeem_date_minutes': get_human_readable_UTC_timestamp_minutes(new Date(TEST_TIMESTAMP_MS)),
		},
	},
})

/////////////////////

export {
	DEMO_STATE,
}
