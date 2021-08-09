import memoize_one from 'memoize-one'
import { Immutable } from '@offirmo-private/ts-types'

import EventEmitter from 'emittery'

import { State } from './types'
import {
	create,
	log_anything,
	on_visibility_change,
	on_network_connectivity_change,
} from './reducers'

////////////////////////////////////

const EMITTER_EVT = 'change'

export const get_sugar = memoize_one(function _create_shared_state_sugar() {
	let state = create()

	const emitter = new EventEmitter<{ [EMITTER_EVT]: string }>()

	// https://devdocs.io/dom/navigatoronline/online_and_offline_events
	window.addEventListener('offline', (event) => {
		console.log('network connection lost')
		state = on_network_connectivity_change(state)
		emitter.emit(EMITTER_EVT, `offline`)
	})
	window.addEventListener('online', (event) => {
		console.log('network connection acquired')
		state = on_network_connectivity_change(state)
		emitter.emit(EMITTER_EVT, `online`)
	})

	document.addEventListener('visibilitychange', () => {
		state = on_visibility_change(state)
		emitter.emit(EMITTER_EVT, `visibilitychange`)
	})

	// https://web.dev/bfcache/#apis-to-observe-bfcache
	window.addEventListener('pageshow', (event) => {
		if (event.persisted) {
			state = log_anything(state, '[pageshow] un-persisted from bfcache')
		} else {
			state = log_anything(state, '[pageshow] normal')
		}
		emitter.emit(EMITTER_EVT, `pageshow`)
	})


	return {
		get(): Immutable<State> { return state },
		subscribe(callback: () => void, debug_id?: string): () => void {
			console.log(`shared state sugar subscribed: ${debug_id}`)
			const unbind = emitter.on(EMITTER_EVT, (src: string) => {
				callback()
			})
			return () => {
				console.log(`shared state sugar UNsubscribed: ${debug_id}`)
				unbind()
			}
		}
	}
})
