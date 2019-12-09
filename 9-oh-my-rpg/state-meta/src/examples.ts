import deepFreeze from 'deep-freeze-strict'

import { State } from './types'

/////////////////////

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos

const DEMO_STATE: Readonly<State> = deepFreeze({
	schema_version: 2,
	revision: 5,

	persistence_id: undefined,

	is_web_diversity_supporter: true,
	is_logged_in: true,
	roles: [ 'tbrpg:alpha' ],
})

/////////////////////

export {
	DEMO_STATE,
}
