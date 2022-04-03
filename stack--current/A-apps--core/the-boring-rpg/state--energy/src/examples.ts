import { enforce_immutability } from '@offirmo-private/state-utils'
import { TEST_TIMESTAMP_MS } from '@offirmo-private/timestamps'

import { UState, TState } from './types'

/////////////////////
// a full featured, non-trivial demo state
// useful for demos and unit tests

const DEMO_U_STATE: Readonly<UState> = enforce_immutability<UState>({
	schema_version: 4,
	revision: 3,

	max_energy: 7,
	total_energy_consumed_so_far: 3,
})

const DEMO_T_STATE: Readonly<TState> = enforce_immutability<TState>({
	schema_version: 4,
	revision: 3,

	timestamp_ms: TEST_TIMESTAMP_MS,

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
