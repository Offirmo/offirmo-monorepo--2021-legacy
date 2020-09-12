import assert from 'tiny-invariant'
import { tiny_singleton } from '@offirmo/tiny-singleton'
import { get_schema_version_loose, is_RootState } from '@offirmo-private/state'

import { Action } from '@tbrpg/interfaces'
import { State, SCHEMA_VERSION } from '@tbrpg/state'


import { Dispatcher, Store } from './types'


export function create(): Dispatcher {
	const stores: Store[] = []
	let seen_dispatches = false
	let seen_set = false

	function register_store(store: Store): void {
		assert(!seen_set, 'Dispatcher: adding stores after initialisation!')
		assert(!seen_dispatches, 'Dispatcher: adding stores after dispatches began!')

		stores.push(store)
		// TODO find a way for stores to back pressure
	}

	function dispatch(action: Action, eventual_state_hint?: Readonly<State>): void {
		assert(stores.length, 'Dispatcher: dispatching before registering any stores!')
		assert(seen_set, 'Dispatcher: dispatching before initialising!')
		seen_dispatches = true

		stores.forEach(store => {
			store.on_dispatch(action, eventual_state_hint)
			eventual_state_hint = eventual_state_hint || store.get()
		})
	}

	function set(state: Readonly<State>): void {
		assert(stores.length, 'Dispatcher: set() before registering any stores!')

		assert(is_RootState(state), `Dispatcher: set() is_RootState()!`)
		assert(get_schema_version_loose(state) === SCHEMA_VERSION, `Dispatcher: set() schema version === ${SCHEMA_VERSION} (current)!`)

		stores.forEach(store => {
			store.set(state)
		})

		seen_set = true
	}

	return {
		dispatch,
		register_store,
		set,
	}
}

export const get: () => Dispatcher = tiny_singleton(create)
