import assert from 'tiny-invariant'
import memoize_one from 'memoize-one'
import { Immutable } from '@offirmo-private/ts-types'

import EventEmitter from 'emittery'

import { State } from './types'
import {
	create,
	report_shared_state_change,
	log_anything,
} from './reducers'
import { is_browser_connected_to_a_network, is_browser_page_visible } from './selectors'

////////////////////////////////////

const EMITTER_EVT = 'change'
const MAX_SUBSCRIBERS_COUNT = 5

export const get_singleton = memoize_one(function _create_shared_state_singleton() {
	let state = create()

	const emitter = new EventEmitter<{ [EMITTER_EVT]: string }>()

	// https://devdocs.io/dom/navigatoronline/online_and_offline_events
	window.addEventListener('offline', (event) => {
		state = report_shared_state_change(state, '[⚡️offline] network connectivity changed to: ' + is_browser_connected_to_a_network())
		emitter.emit(EMITTER_EVT, `offline`)
	})
	window.addEventListener('online', (event) => {
		state = report_shared_state_change(state, '[⚡️online] network connectivity changed to: ' + is_browser_connected_to_a_network())
		emitter.emit(EMITTER_EVT, `online`)
	})

	document.addEventListener('visibilitychange', () => {
		state = report_shared_state_change(state, '[⚡️visibilitychange] visibility changed to: ' + is_browser_page_visible())
		emitter.emit(EMITTER_EVT, `visibilitychange`)
	})

	// https://web.dev/bfcache/#apis-to-observe-bfcache
	window.addEventListener('pageshow', (event) => {
		if (event.persisted) {
			state = log_anything(state, '[⚡️pageshow] un-persisted from bfcache')
		} else {
			state = log_anything(state, '[⚡️pageshow] normal')
		}
		emitter.emit(EMITTER_EVT, `pageshow`)
	})
	window.addEventListener('pagehide', (event) => {
		state = log_anything(state, `[⚡️pagehide] persisted = ${event.persisted}`)
	})

	window.addEventListener('beforeunload', (event) => {
		state = log_anything(state, `[⚡️beforeunload]`)
		// A function that returns `true` if the page has unsaved changes.
		/*if (pageHasUnsavedChanges()) {
			event.preventDefault();
			return event.returnValue = 'Are you sure you want to exit?';
		}*/
	}, {capture: true})

	window.addEventListener('unload', (event) => {
		state = log_anything(state, `[⚡️unload]`)
	})


	return {
		get(): Immutable<State> { return state },
		subscribe(callback: () => void, debug_id?: string): () => void {
			//console.log(`shared state singleton subscribed: ${debug_id}`)
			const unbind = emitter.on(EMITTER_EVT, (src: string) => {
				callback()
			})
			assert(emitter.listenerCount() <= MAX_SUBSCRIBERS_COUNT, `shared state singleton: too many subscribes, is there a leak? (${debug_id})`)
			return () => {
				//console.log(`shared state singleton UNsubscribed: ${debug_id}`)
				unbind()
			}
		}
	}
})
