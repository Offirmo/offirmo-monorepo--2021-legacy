import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import { State } from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Immutable<State> = enforce_immutability<State>({
	schema_version: 1,
	revision: 42,

	coin_count: 23456,
	token_count: 89,
})

/////////////////////

export {
	DEMO_STATE,
}
