import deepFreeze from 'deep-freeze-strict'

import {
	CharacterClass,
	State,
} from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
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

/////////////////////

export {
	DEMO_STATE,
}
