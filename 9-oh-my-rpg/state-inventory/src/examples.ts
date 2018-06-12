import deepFreeze from 'deep-freeze-strict'

import { DEMO_WEAPON_1, DEMO_WEAPON_2 } from '@oh-my-rpg/logic-weapons'
import { DEMO_ARMOR_1, DEMO_ARMOR_2 } from '@oh-my-rpg/logic-armors'
import {State} from './types'



// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE: State = deepFreeze({
	schema_version: 1,
	revision: 42,

	unslotted_capacity: 20,
	slotted: {
		armor: DEMO_ARMOR_2,
		weapon: DEMO_WEAPON_1,
	},
	unslotted: [
		DEMO_WEAPON_2,
		DEMO_ARMOR_1,
	],
})

// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS: any = DEMO_STATE // TODO ALPHA freeze this

// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS: any = deepFreeze({
})

/////////////////////

export {
	DEMO_STATE,
	OLDEST_LEGACY_STATE_FOR_TESTS,
	MIGRATION_HINTS_FOR_TESTS,
}

/////////////////////
