import { Immutable } from '@offirmo-private/ts-types'

import { State } from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'


interface Store {
	set: (state: Immutable<State>) => void // usually at init, or a secondary store overwritten by a primary one, or a reset
	dispatch: (action: Readonly<Action>, eventual_state_hint?: Immutable<State>) => void // some stores may not want to recompute
	get: () => Immutable<State> | null
}

interface InMemoryStore extends Store {
	get: () => NonNullable<ReturnType<Store['get']>>
}

interface LocalStore extends Store {
}

interface CloudStore extends Store {
}


export {
	Store,
	InMemoryStore,
	LocalStore,
	CloudStore,
}
