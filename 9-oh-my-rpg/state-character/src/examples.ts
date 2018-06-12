/////////////////////

import deepFreeze from 'deep-freeze-strict'

/////////////////////

import { LIB, SCHEMA_VERSION } from './consts'

import {
	CharacterClass,
	State,
} from './types'

/////////////////////
// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE: State = deepFreeze({
	schema_version: 2,
	revision: 42,

	name: 'Perte',
	klass: CharacterClass.paladin,
	attributes: {
		level: 13,

		health: 12,
		mana: 23,

		strength: 4,
		agility: 5,
		charisma: 6,
		wisdom: 7,
		luck: 8,
	},
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
