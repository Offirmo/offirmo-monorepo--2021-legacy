import deepFreeze from 'deep-freeze-strict'

import { UState, TState } from './types'

/////////////////////
// a full featured, non-trivial demo state
// useful for demos and unit tests

const DEMO_U_STATE: Readonly<UState> = deepFreeze({
	schema_version: 2,
	revision: 1,

	max_energy: 7,
	energy_refilling_rate_per_ms: {
		numerator: 7,
		denominator: 24 * 3600 * 1000,
	},
})

const DEMO_T_STATE: Readonly<TState> = deepFreeze({
	schema_version: 2,

	timestamp_ms: 1545016005762,

	available_energy: {
		numerator: 7,
		denominator: 2,
	},
})

/////////////////////

export {
	DEMO_U_STATE,
	DEMO_T_STATE,
}
