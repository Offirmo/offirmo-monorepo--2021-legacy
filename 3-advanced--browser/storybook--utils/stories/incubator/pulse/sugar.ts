import memoize_one from 'memoize-one'
import { Immutable } from '@offirmo-private/ts-types'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { asap_but_out_of_current_event_loop } from '@offirmo-private/async-utils'

import { PulseOptions, State } from './types'
import {
	create,
	subscribe_to_pulse,
} from './reducers'

////////////////////////////////////

const MAX_FPS = 1. // TODO config?
const MIN_FPS = .1 // ex. for a background tab
const MIN_FPS_FRAME_PERIOD_MS = Math.trunc(1000. / MIN_FPS)
const MAX_FPS_FRAME_PERIOD_MS = Math.trunc(1000. / MAX_FPS)
const MAX_ITERATIONS = 100 //10 // debug

////////////////////////////////////

export const get_sugar = memoize_one(function _create_shared_state_sugar() {
	let state = create()

	let iteration_count: number = 0
	let raf_time_start: number = 0
	let time_1st_iteration: number = 0
	let time_last_iteration: number = 0
	let intervalId = null


	function step(_: number) { // ignore the param in favor of a full timestamp
		// TODO if (window.oᐧextra?.flagꓽis_paused) return

		const now_ms = get_UTC_timestamp_ms()

		if (time_1st_iteration === 0) {
			// debug
			time_1st_iteration = time_last_iteration = now_ms
			;(state.logger.debug || state.logger.info)('++++++++++++ starting animation frame ++++++++++++', {
				now_ms,
				time: _,
			})
		}

		state.logger.groupEnd()
		state.logger.groupCollapsed(`———————pulse #${iteration_count} / ${now_ms} (+${ ((now_ms - time_last_iteration) / 1000.).toFixed(3) }s) ———————`)
		iteration_count++
		asap_but_out_of_current_event_loop(state.logger.groupEnd)

		////////////

		// TODO pulse
		const ids = Object.keys(state.subscriptions)
		ids.forEach(id => {

		})

		////////////

		time_last_iteration = now_ms

		if (MAX_ITERATIONS) {
			if (iteration_count > MAX_ITERATIONS) {
				const elapsed = now_ms - time_1st_iteration
				state.logger.warn('stopping animation frame for safety', {
					raf_time_start: raf_time_start,
					time_1st_iteration: time_1st_iteration,
					now_ms,
					elapsed,
				})
				state.logger.log('measured fps =', 1000 * MAX_ITERATIONS / elapsed)
				return
			}
		}

		window.requestAnimationFrame(step)
	}

	window.requestAnimationFrame(step)

	// we use Animation Frame for a smooth, adaptable framerate
	// however, since Animation Frame pauses when background,
	// we need to back it up with a slow interval.
	intervalId = setInterval(step, MIN_FPS_FRAME_PERIOD_MS)

	return {
		get(): Immutable<State> { return state },
		subscribe_to_pulse(id: string, callback: (tms: number, id?: string) => void, options: Immutable<PulseOptions>): () => void {
			console.log('subscribe_to_pulse(…)', { id, options })
			state = subscribe_to_pulse(state, id, callback, options)

			return () => {
				throw new Error('Unsubscribe not implemented!')
				//state = subscribe_from_pulse(state, id)
			}
		}
	}
})
