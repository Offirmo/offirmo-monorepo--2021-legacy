import deep_freeze from 'deep-freeze-strict'

import { State } from './types'

/////////////////////

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos

const DEMO_STATE: Readonly<State> = deep_freeze<State>({
	schema_version: 3,
	revision: 5,

	slot_id: 0,

	is_web_diversity_supporter: true,
	is_logged_in: true,
	roles: [ 'tbrpg:alpha' ],
})

/////////////////////

export {
	DEMO_STATE,
}
