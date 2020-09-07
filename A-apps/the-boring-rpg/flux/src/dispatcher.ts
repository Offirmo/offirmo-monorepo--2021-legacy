import { State } from '@tbrpg/state'
import { tiny_singleton } from '@offirmo/tiny-singleton'

import { Action } from '@tbrpg/interfaces'

import { Dispatcher, Store } from './types'


export function create(): Dispatcher {
	const stores: Store[] = []

	function register_store(s: Store): void {
		stores.push(s)
	}

	function dispatch(action: Action): void {
		let eventual_state_hint: undefined | Readonly<State> = undefined

		stores.forEach(store => {
			store.on_dispatch(action, eventual_state_hint)
			eventual_state_hint = eventual_state_hint || store.get()
		})
	}

	return {
		dispatch,
		register_store,
	}
}

export const get: () => Dispatcher = tiny_singleton(create)
