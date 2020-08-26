import deep_freeze from 'deep-freeze-strict'

import { UState, TState } from './types'

/////////////////////
// a full featured, non-trivial demo state
// useful for demos and unit tests

const DEMO_U_STATE: Readonly<UState> = deep_freeze<UState>({
	schema_version: 4,
	revision: 3,

	max_energy: 7,
	total_energy_consumed_so_far: 3,
})

const DEMO_T_STATE: Readonly<TState> = deep_freeze<TState>({
	schema_version: 4,
	revision: 3,

	timestamp_ms: 1545016005762,

	available_energy: {
		n: 7,
		d: 2,
	},
})

/////////////////////

export {
	DEMO_U_STATE,
	DEMO_T_STATE,
}
