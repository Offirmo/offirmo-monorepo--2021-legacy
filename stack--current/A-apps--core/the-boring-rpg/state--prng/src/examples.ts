import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import { State } from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Immutable<State> = enforce_immutability<State>({
	uuid: 'uu1~example~state~PRNG~~',
	schema_version: 3,
	revision: 108,

	seed: 1234,
	use_count: 107,

	recently_encountered_by_id: {
		'item': [ 'axe', 'sword'],
		'adventures': [ 'dragon', 'king'],
		'mistery': [],
	},
})

/////////////////////

export {
	DEMO_STATE,
}
