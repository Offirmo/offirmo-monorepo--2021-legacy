import memoize_one from 'memoize-one'
import { Immutable } from '@offirmo-private/ts-types'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { asap_but_out_of_current_event_loop } from '@offirmo-private/async-utils'

import {
	is_browser_connected_to_a_network,
	is_browser_page_visible,
	get_singleton as get_shared_state_singleton,
} from '../shared-state'
import { Callback, PulseOptions, State } from './types'
import {
	create,
	subscribe_to_pulse,
	unsubscribe_from_pulse,
} from './reducers'

////////////////////////////////////

const LIB = '⚡⚡⚡'
const MAX_FPS = 30 // TODO config?
const MAX_FPS_FRAME_PERIOD_MS = Math.trunc(1000. / MAX_FPS)
const MIN_PULSE_INTERVAL_S = 60 // ex. for a background tab for cloud
const MAX_ITERATIONS = 10 // debug
const DEBUG = true

////////////////////////////////////

export const get_singleton = memoize_one(function _create_shared_state_sugar() {
	let state = create()
	const shared_state_singleton = get_shared_state_singleton()

	let iteration_count: number = 0
	let tms_1st_iteration: number = 0
	let tms_last_iteration: number = 0
	let intervalId = null

	;(state.logger.debug || state.logger.info)('⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡ starting pulse generator ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡', {
		MAX_FPS,
		MAX_FPS_FRAME_PERIOD_MS,
		MIN_PULSE_INTERVAL_S,
		MAX_ITERATIONS,
	})

	function step(origin: string, _?: number) { // ignore the param in favor of a full timestamp
		// TODO if (window.oᐧextra?.flagꓽis_paused) return

		const now_tms = get_UTC_timestamp_ms()

		if (tms_1st_iteration === 0) {
			tms_1st_iteration = tms_last_iteration = now_tms
		}

		if (DEBUG) state.logger.groupEnd()
		if (DEBUG) state.logger.group(`——————— [${LIB}] pulse #${iteration_count} / ${now_tms} (+${ ((now_tms - tms_last_iteration) / 1000.).toFixed(3) }s) [${origin}] ———————`)
		iteration_count++
		if (DEBUG) asap_but_out_of_current_event_loop(state.logger.groupEnd)

		////////////

		const ids = Object.keys(state.subscriptions)
		ids.forEach(id => {
			const { options, callback, last_call_tms } = state.subscriptions[id]

			if (options.visual && !is_browser_page_visible())
				return
			if (options.cloud && !is_browser_connected_to_a_network())
				return

			const elapsed_since_last_ms = now_tms - last_call_tms
			const rem = now_tms % options.min_period_ms

			const has_too_much_time_passed = elapsed_since_last_ms > 2 * options.min_period_ms

			console.log(id, { options, last_call_tms, now_tms, elapsed_since_last_ms, rem, has_too_much_time_passed })

			if (has_too_much_time_passed) {
				callback(now_tms, id)
				;(state.subscriptions[id] as any).last_call_tms = now_tms // TODO immu
			}
		})

		////////////

		tms_last_iteration = now_tms

		if (MAX_ITERATIONS && iteration_count >= MAX_ITERATIONS) {
			const elapsed_ms = now_tms - tms_1st_iteration
			if (iteration_count === MAX_ITERATIONS) {
				// It's OBVIOUSLY debug
				state.logger.warn(`[${LIB}] stopping requestAnimationFrame for safety`, {
					tms_1st_iteration,
					now_tms,
					elapsed_ms,
				})
				state.logger.log(`[${LIB}] measured overall fps =`, 1000 * MAX_ITERATIONS / elapsed_ms)
			}
		}
		else {
			if (!is_browser_page_visible()) {
				if (DEBUG) state.logger.log(`[${LIB}] pausing requestAnimationFrame since not visible`)
			}
			else {
				window.requestAnimationFrame((_) => step('rafN', _))
			}
		}
	}

	// we use Animation Frame for a smooth, adaptable framerate…
	if (is_browser_page_visible()) {
		if (DEBUG) state.logger.debug('⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡ starting requestAnimationFrame ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡')
		window.requestAnimationFrame((_) => step('raf1', _))
	}
	// however, since Animation Frame pauses when background,
	// we need to back it up:
	shared_state_singleton.subscribe(() => step('shared state'), 'pulse singleton')
	//intervalId = setInterval(step, MIN_FPS_FRAME_PERIOD_MS)

	return {
		get(): Immutable<State> { return state },
		subscribe_to_pulse(id: string, callback: Callback, options: Immutable<PulseOptions>): () => void {
			console.log(`[${LIB}] subscribe_to_pulse(…)`, { id, options })
			state = subscribe_to_pulse(state, id, callback, options)

			return () => {
				state = unsubscribe_from_pulse(state, id)
			}
		}
	}
})
