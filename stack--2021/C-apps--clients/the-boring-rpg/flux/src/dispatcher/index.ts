import assert from 'tiny-invariant'
import { Immutable, get_schema_version_loose, is_RootState, get_base_loose } from '@offirmo-private/state-utils'
import { dequal as is_deep_equal } from 'dequal'

import { Action } from '@tbrpg/interfaces'
import { State, SCHEMA_VERSION } from '@tbrpg/state'


import { Dispatcher, Store } from '../types'
import { OMRSoftExecutionContext } from '../sec'


export function create(
	SEC: OMRSoftExecutionContext
): Dispatcher {
	const LIB = `Dispatcher`
	return SEC.xTry(`creating ${LIB}…`, ({ logger }) => {
		logger.trace(`${LIB}.create()`)

		const stores: Store[] = []
		let seen_dispatches = false
		let seen_set = false

		function register_store(store: Store): void {
			logger.trace(`${LIB}.register_store()…`)

			assert(!seen_set, 'Dispatcher: adding stores after initialisation!')
			assert(!seen_dispatches, 'Dispatcher: adding stores after dispatches began!')

			stores.push(store)
		}

		function dispatch(action: Action, eventual_state_hint?: Immutable<State>): void {
			logger.trace(`${LIB}.dispatch()…`)

			assert(stores.length, 'Dispatcher: dispatching before registering any stores!')
			assert(seen_set, 'Dispatcher: dispatching before initialising!')
			seen_dispatches = true

			stores.forEach(store => {
				store.on_dispatch(action, eventual_state_hint)
				const store_state = store.get()
				if (eventual_state_hint) {
					assert(is_deep_equal(eventual_state_hint, store_state), 'dispatcher: state hint = store state')
				}
				eventual_state_hint = eventual_state_hint || store_state
			})
		}

		function set(state: Immutable<State>): void {
			logger.trace(`${LIB}.set()`, { state: get_base_loose(state) })

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
	})
}
