import { State } from '@tbrpg/state'

import { Action} from '../actions'


interface Store {
	set: (state: Readonly<State>) => void // usually at init, or a secondary store overwritten by a primary one, or a reset
	dispatch: (action: Readonly<Action>) => void
	get: () => Readonly<State> | null
}

interface InMemoryStore extends Store {
}

interface LocalStorageStore extends Store {
}

interface CloudStore extends Store {
}


export {
	Store,
	InMemoryStore,
	LocalStorageStore,
	CloudStore,
}
