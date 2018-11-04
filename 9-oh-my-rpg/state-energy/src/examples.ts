import deepFreeze from 'deep-freeze-strict'

import { State } from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 450,

	max_energy: 7,
	base_energy_refilling_rate_per_day: 7,
	last_date: 'ts1_20181103_08h15:14.490',
	last_available_energy_float: 3.0009140000000000814,
})

/////////////////////

export {
	DEMO_STATE,
}
