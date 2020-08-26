import deep_freeze from 'deep-freeze-strict'

import { State } from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Readonly<State> = deep_freeze<State>({
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
