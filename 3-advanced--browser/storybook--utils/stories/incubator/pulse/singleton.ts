import memoize_one from 'memoize-one'
import { Immutable } from '@offirmo-private/ts-types'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { asap_but_not_synchronous, asap_but_out_of_current_event_loop, } from '@offirmo-private/async-utils'

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
import { elapsed_time_ms } from '@offirmo-private/async-utils/src'

////////////////////////////////////

const LIB = '⚡⚡⚡'
const MAX_FPS = 30 // TODO config?
const MAX_FPS_FRAME_PERIOD_MS = Math.trunc(1000. / MAX_FPS)
const MIN_PULSE_INTERVAL_S = 60 // ex. for a background tab for cloud
const MAX_ITERATIONS = 0 //1000 // debug
const DEBUG = false

////////////////////////////////////

export const get_singleton = memoize_one(function _create_shared_state_sugar() {
	let state = create()
	const shared_state_singleton = get_shared_state_singleton()

	let intervalId = null

	;(state.logger.debug || state.logger.info)('⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡ starting pulse generator ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡', {
		MAX_FPS,
		MAX_FPS_FRAME_PERIOD_MS,
		MIN_PULSE_INTERVAL_S,
		MAX_ITERATIONS,
	})

	let frames_count: number = 0
	let step_count: number = 0
	let tms_1st_step: number = 0
	let tms_last_step: number = 0
	let time_last_step: number = 0
	let tms_last_activation = 0
	function _rafn_step(time: number) {
		step('rafN', time)
	}
	function step(origin: string, _time?: number) { // ignore the param in favor of a full timestamp
		step_count++
		//console.log('in RAF ' + _time + ' ' + origin)
		// TODO if (window.oᐧextra?.flagꓽis_paused) return

		const now_tms = get_UTC_timestamp_ms()

		if (tms_1st_step === 0) {
			tms_1st_step = tms_last_step = now_tms
		}

		if (!!_time) {
			if (_time === time_last_step) {
				// https://stackoverflow.com/questions/44793149/why-is-requestanimation-frame-called-multiple-times-for-some-frames-and-not-at
				console.error('deduping RAF', { _time, time_last_step, now_tms, tms_last_step}) // should never happen
				return
			}
			time_last_step = _time
		}

		if (DEBUG) state.logger.groupEnd()
		if (origin.startsWith('raf')) frames_count++
		if (DEBUG) state.logger.group(`——————— [${LIB}] pulse #${frames_count} / ${tms_last_step} → ${now_tms} (+${ ((now_tms - tms_last_step) / 1000.).toFixed(3) }s) [${origin}] ———————`)
		tms_last_step = now_tms
		if (DEBUG) asap_but_out_of_current_event_loop(state.logger.groupEnd)

		const elapsed_since_last_activation_ms = now_tms - tms_last_activation
		const has_enough_time_passed = elapsed_since_last_activation_ms >= state.min_period_ms
		if (has_enough_time_passed) {
			console.log('framerate = ', frames_count / (elapsed_since_last_activation_ms / 1000.))
			frames_count = 0
			tms_last_activation = now_tms - (now_tms % state.min_period_ms)

			const ids = Object.keys(state.subscriptions)
			ids.forEach(id => {
				const { options, callback, last_call_tms } = state.subscriptions[id]

				if (options.visual && !is_browser_page_visible())
					return
				if (options.cloud && !is_browser_connected_to_a_network())
					return

				const elapsed_since_last_ms = now_tms - last_call_tms
				const rem = now_tms % options.ideal_period_ms

				const has_enough_time_passed = elapsed_since_last_ms >= options.ideal_period_ms

				//console.log(id, { options, last_call_tms, now_tms, elapsed_since_last_ms, rem, has_enough_time_passed })

				if (has_enough_time_passed) {
					console.log(LIB + ' ' + id, { options, last_call_tms, now_tms, elapsed_since_last_ms, rem, has_too_much_time_passed: has_enough_time_passed })
					callback(now_tms, id)
					;(state.subscriptions[id] as any /* TODO immu */).last_call_tms =
						now_tms - rem // back-date to closer to the boundary,better for ex. for time
				}
			})
		}

		////////////

		if (MAX_ITERATIONS && frames_count >= MAX_ITERATIONS) {
			const elapsed_ms = now_tms - tms_1st_step
			if (frames_count === MAX_ITERATIONS) {
				// It's OBVIOUSLY debug
				state.logger.warn(`[${LIB}] stopping requestAnimationFrame for safety`, {
					tms_1st_iteration: tms_1st_step,
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
			else if (state.min_period_ms === Infinity) {
				// no requested pulse
			}
			else if (!origin.startsWith('raf')) {
				// this step was not called by RAF, no need to reschedule
			}
			else {
				//console.log('calling RAF')
				const id = window.requestAnimationFrame(_rafn_step)
				//console.log('RAFN', id)
			}
		}
	}

	asap_but_not_synchronous(() => {
		// we use Animation Frame for a smooth, adaptable framerate…
		if (DEBUG) state.logger.debug('⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡ starting requestAnimationFrame ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡')
		const id = window.requestAnimationFrame((_) => step('raf1', _))
		//console.log('RAF1', id)
		// however, since Animation Frame pauses when background,
		// we need to back it up:
		shared_state_singleton.subscribe(() => step('shared state'), 'pulse singleton')
		//intervalId = setInterval(step, MIN_FPS_FRAME_PERIOD_MS)
	})

	return {
		get(): Immutable<State> { return state },
		subscribe_to_pulse(id: string, callback: Callback, options: Immutable<PulseOptions>): () => void {
			console.log(`[${LIB}] subscribe_to_pulse(…)`, { id, options })
			state = subscribe_to_pulse(state, id, callback, options)
			asap_but_not_synchronous(() => step('subscription'))

			return () => {
				console.log(`[${LIB}] UN subscribe_to_pulse(…)`, { id })
				state = unsubscribe_from_pulse(state, id)
			}
		}
	}
})
