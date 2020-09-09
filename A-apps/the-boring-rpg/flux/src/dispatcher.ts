import assert from 'tiny-invariant'
import { State } from '@tbrpg/state'
import { tiny_singleton } from '@offirmo/tiny-singleton'

import { Action } from '@tbrpg/interfaces'

import { Dispatcher, Store } from './types'


export function create(): Dispatcher {
	const stores: Store[] = []
	let seen_dispatches = false

	function register_store(store: Store): void {
		assert(!seen_dispatches, 'Dispatcher: adding stores after dispatches began!')

		stores.push(store)
		// TODO find a way for stores to back pressure
	}

	function dispatch(action: Action): void {
		let eventual_state_hint: undefined | Readonly<State> = undefined
		assert(stores.length, 'Dispatcher: dispatching before registering any stores!')
		seen_dispatches = true

		stores.forEach(store => {
			store.on_dispatch(action, eventual_state_hint)
			eventual_state_hint = eventual_state_hint || store.get()
		})
	}

	function set(state: Readonly<State>): void {
		assert(stores.length, 'Dispatcher: set() before registering any stores!')

		stores.forEach(store => {
			store.set(state)
		})
	}

	return {
		dispatch,
		register_store,
		set,
	}
}

export const get: () => Dispatcher = tiny_singleton(create)
