import { State } from '@tbrpg/state'
import * as TBRPGState from '@tbrpg/state'
import * as PRNGState from '@oh-my-rpg/state-prng'

import { Action} from '../actions'


interface Store {
	dispatch: (action: Readonly<Action>) => void
	get: () => Readonly<State>
}

interface InMemoryStore extends Store {
	// rewrite from scratch. Useful for ex. when a sync from a more recent version from the server happens.
	set: (state: Readonly<State>) => void
}


export {
	Store,
	InMemoryStore,
}
