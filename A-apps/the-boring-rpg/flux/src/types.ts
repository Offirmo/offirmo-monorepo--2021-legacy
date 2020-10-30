import { Immutable } from '@offirmo-private/ts-types'
import { State } from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'


export interface Dispatcher {
	// core features
	dispatch(action: Action): void,

	// utils/meta
	register_store(s: Store): void

	// (re)init. Avoid an unnecessary action and also different semantic (different assertions)
	set(state: Immutable<State>): void // usually at init, or a secondary store overwritten by a primary one, or a reset
}


export interface Store {
	// core features
	on_dispatch(action: Immutable<Action>, eventual_state_hint?: Immutable<State>): void // some stores may not want to recompute
	subscribe(debug_id: string, listener: () => void): () => void // state not passed, better call get() less duplication
	get(): Immutable<State> // no undef => should throw if can't access back or state never set so far bc. it's an error

	// (re)init. Avoid an unnecessary action and also different semantic (different assertions)
	set(state: Immutable<State>): void // usually at init, or a secondary store overwritten by a primary one, or a reset
}
