import deepFreeze from 'deep-freeze-strict'
import { State } from './types'


// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 108,

	max_energy: 9,
	base_energy_refilling_rate_per_day: 9,

	last_energy_usages: [
		{

		}
	],
})


const MIGRATION_HINTS_FOR_TESTS = {
}



export {
	DEMO_STATE,
	MIGRATION_HINTS_FOR_TESTS,
}
