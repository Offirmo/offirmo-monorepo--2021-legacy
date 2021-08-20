import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import { State } from './types'
import { PersistedNotes as FileNotes } from '../file'

/////////////////////

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos

const DEMO_STATE: Immutable<State> = enforce_immutability<State>({
	"_comment": "This data is from @offirmo/photo-sorter https://github.com/Offirmo/offirmo-monorepo/tree/master/5-incubator/active/photos-sorter",
	"schema_version": 1,
	"revision": 0,
	"last_user_investment_tms": 1613965853218,
	"encountered_files": {
		// TODO
	},

	known_modifications_new_to_old: {
		// TODO
	},
})

/////////////////////

export {
	DEMO_STATE,
}
