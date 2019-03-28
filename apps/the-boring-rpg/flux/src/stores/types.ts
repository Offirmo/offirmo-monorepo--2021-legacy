import { State } from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'


interface Store {
	set: (state: Readonly<State>) => void // usually at init, or a secondary store overwritten by a primary one, or a reset
	dispatch: (action: Readonly<Action>, eventual_state_hint?: Readonly<State>) => void // some stores may not want to recompute
	get: () => Readonly<State> | null
}

interface InMemoryStore extends Store {
}

interface PersistentStore extends Store {
}

interface CloudStore extends Store {
}


export {
	Store,
	InMemoryStore,
	PersistentStore,
	CloudStore,
}
