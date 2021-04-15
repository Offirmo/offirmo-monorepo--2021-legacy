import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import {
	CharacterClass,
	State,
} from './types'

/////////////////////

// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE: Immutable<State> = enforce_immutability<State>({
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
