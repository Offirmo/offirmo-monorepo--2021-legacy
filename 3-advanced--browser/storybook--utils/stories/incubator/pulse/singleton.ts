import assert from 'tiny-invariant'
import memoize_one from 'memoize-one'
import { Immutable } from '@offirmo-private/ts-types'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'

import {
	is_browser_connected_to_a_network,
	is_browser_page_visible,
	get_singleton as get_shared_state_singleton,
} from '../shared-state'

import { Callback, PulseOptions, State } from './types'
import { LIB, DEBUG, MAX_FPS } from './consts'
import {
	consider_pulse,
	create,
	subscribe_to_pulse,
	unsubscribe_from_pulse,
} from './reducers'

////////////////////////////////////

const MAX_FPS_FRAME_PERIOD_MS = Math.trunc(1000. / MAX_FPS)
//const MIN_PULSE_INTERVAL_S = 60 // ex. for a background tab for cloud
const MAX_RAF_ITERATIONS = 0 //1000 // debug

////////////////////////////////////

function _get_browser_state() {
	return {
		is_connected_to_a_network: is_browser_connected_to_a_network(),
		is_page_visible: is_browser_page_visible(),
	}
}

export const get_singleton = memoize_one(function _create_shared_state_sugar() {
	let state = create()
	const shared_state_singleton = get_shared_state_singleton()

	;(state.logger.debug || state.logger.info)('⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡ instantiating pulse generator singleton ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡', {
		MAX_FPS,
		MAX_FPS_FRAME_PERIOD_MS,
		//MIN_PULSE_INTERVAL_S,
		MAX_RAF_ITERATIONS,
	})

	////////////

	let animation_frames_count = 0
	let first_elapsed_from_origin_ms = 0
	let last_elapsed_from_origin_ms = 0
	const DEBUG_AF = false
	function _on_animation_frame(elapsed_from_origin_ms: number) {
		animation_frames_count++

		if (elapsed_from_origin_ms === last_elapsed_from_origin_ms) {
			// https://stackoverflow.com/questions/44793149/why-is-requestanimation-frame-called-multiple-times-for-some-frames-and-not-at
			console.error(`[${LIB}] duplicate RAF???`, { elapsed_from_origin_ms }) // should never happen
			return
		}
		last_elapsed_from_origin_ms = elapsed_from_origin_ms
		if (first_elapsed_from_origin_ms === 0) {
			first_elapsed_from_origin_ms = elapsed_from_origin_ms
		}

		const now_tms = get_UTC_timestamp_ms()
		if (DEBUG_AF) console.log(`[${LIB}] in animationFrame callback #${animation_frames_count} T=${elapsed_from_origin_ms} / ${now_tms}`)

		state = consider_pulse(state, _get_browser_state(), now_tms, 'AF')

		/*console.log('framerate = ', frames_count / (elapsed_since_last_activation_ms / 1000.))
		frames_count = 0
		tms_last_activation = now_tms - (now_tms % state.min_period_ms)*/

		if (MAX_RAF_ITERATIONS && animation_frames_count >= MAX_RAF_ITERATIONS) {
			const total_elapsed_ms = elapsed_from_origin_ms - first_elapsed_from_origin_ms
			if (animation_frames_count === MAX_RAF_ITERATIONS) {
				// It's OBVIOUSLY debug
				state.logger.warn(`[${LIB}] stopping requestAnimationFrame for safety`, {
					first_elapsed_from_origin_ms,
					elapsed_from_origin_ms,
					total_elapsed_ms,
					now_tms,
				})
				state.logger.log(`[${LIB}] overall RAF fps =`, 1000 * animation_frames_count / total_elapsed_ms)
			}
		}
		else {
			//if (DEBUG_AF) console.log(`[${LIB}] refreshing RAF…`)
			const id = window.requestAnimationFrame(_on_animation_frame)
			//if (DEBUG_AF) console.log(`[${LIB}] RAF refreshed`, id)
		}
	}


	/*
	let frames_count: number = 0
	let step_count: number = 0
	let tms_1st_step: number = 0
	let tms_last_step: number = 0
	let time_last_step: number = 0
	let tms_last_activation = 0

	function step(origin: string, _time?: number) { // ignore the param in favor of a full timestamp
		step_count++


		////////////

		if (MAX_RAF_ITERATIONS && frames_count >= MAX_RAF_ITERATIONS) {
			const elapsed_ms = now_tms - tms_1st_step
			if (frames_count === MAX_RAF_ITERATIONS) {
				// It's OBVIOUSLY debug
				state.logger.warn(`[${LIB}] stopping requestAnimationFrame for safety`, {
					tms_1st_iteration: tms_1st_step,
					now_tms,
					elapsed_ms,
				})
				state.logger.log(`[${LIB}] measured overall fps =`, 1000 * MAX_RAF_ITERATIONS / elapsed_ms)
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
	}*/

	schedule_when_idle_but_not_too_far(() => {
		// we use Animation Frame for a smooth, adaptable framerate…
		if (DEBUG) state.logger.debug('⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡ starting requestAnimationFrame loop ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡')
		const id = window.requestAnimationFrame(_on_animation_frame)
		//console.log('RAF init', id)
		// …however, since Animation Frame pauses when background,
		// we need to back it up:
		shared_state_singleton.subscribe(() => {
			const now_tms = get_UTC_timestamp_ms()
			state = consider_pulse(state, _get_browser_state(), now_tms, 'shared state')
		}, 'pulse singleton')

		//intervalId = setInterval(step, MIN_FPS_FRAME_PERIOD_MS)
	})

	return {
		get(): Immutable<State> { return state },
		subscribe_to_pulse(id: string, callback: Callback, options: Immutable<PulseOptions>): () => void {
			assert(options.ideal_period_ms > 0, `[${LIB}] subscribe_to_pulse(…) "${id}" ideal period should be > 0`)
			if (DEBUG) console.log(`[${LIB}] subscribe_to_pulse(…)`, { id, options })

			state = subscribe_to_pulse(state, id, callback, options)
			//asap_but_not_synchronous(() => step('subscription'))

			return () => {
				if (DEBUG) console.log(`[${LIB}] UN subscribe_to_pulse(…)`, { id })
				state = unsubscribe_from_pulse(state, id)
			}
		}
	}
})
