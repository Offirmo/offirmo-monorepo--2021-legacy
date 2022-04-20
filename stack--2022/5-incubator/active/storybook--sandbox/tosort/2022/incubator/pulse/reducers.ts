import { Immutable } from '@offirmo-private/ts-types/src'
import assert from 'tiny-invariant'
import { asap_but_out_of_current_event_loop, } from '@offirmo-private/async-utils'

import {
	State,
	PulseOptions,
	Callback,
} from './types'
import { LIB, DEBUG, DEFAULT_MAX_FPS } from './consts'

////////////////////////////////////

function _get_updated_cache(state: Immutable<State>): State['_cache'] {
	const MIN_PERIOD_MS = Math.trunc(1000. / state.max_fps)

	return {
		min_period_ms: Math.max(
			MIN_PERIOD_MS,
			Math.min(
				Infinity,
				...Object.keys(state.subscriptions).map(id => state.subscriptions[id].options.ideal_period_ms)
			)
		),
	}
}

////////////////////////////////////

export function create(): Immutable<State> {
	return {
		logger: console,

		max_fps: DEFAULT_MAX_FPS,

		subscriptions: {},

		_cache: {
			min_period_ms: Infinity,
		},

		// for debug
		pulse_count: 0,
		tms_last_activity: 0,
		tms_last_activity_check: 0,
	}
}

export function subscribe_to_pulse(state: Immutable<State>, id: string, callback: Callback, options: Immutable<PulseOptions>): Immutable<State> {
	assert(!state.subscriptions[id], `subscribe_to_pulse(): id "${id}" should not already exist!`)

	state = {
		...state,

		subscriptions: {
			...state.subscriptions,

			[id]: {
				options,
				callback,
				last_call_tms: 0,
			}
		},
	}

	state = {
		...state,
		_cache: _get_updated_cache(state),
	}
	if (DEBUG) console.log(`[${LIB}] subscribe_to_pulse() min_period_ms is now: ${state._cache.min_period_ms}`)

	return state
}

export function unsubscribe_from_pulse(state: Immutable<State>, id: string): Immutable<State> {
	assert(state.subscriptions[id], `unsubscribe_from_pulse(): id "${id}" should already exist!`)

	const s = {
		...state.subscriptions,
	}
	delete s[id]

	state = {
		...state,

		subscriptions: {
			...s,
		},
	}

	state = {
		...state,
		_cache: _get_updated_cache(state),
	}

	if (DEBUG) console.log(`[${LIB}] unsubscribe_from_pulse() min_period_ms is now: ${state._cache.min_period_ms}`)

	return state
}

export function consider_pulse(state: Immutable<State>, browser_state: {
	is_connected_to_a_network: boolean
	is_page_visible: boolean
}, now_tms: number, debug_id: string): Immutable<State> {
	// TODO if (window.oᐧextra?.flagꓽis_paused) return

	const { tms_last_activity } = state
	const elapsed_since_last_activity_ms = now_tms - tms_last_activity
	state = {
		...state,
		tms_last_activity: now_tms,
		pulse_count: state.pulse_count + 1,
	}

	if (DEBUG) state.logger.groupEnd()
	if (DEBUG) state.logger.group(`——————— [${LIB}] candidate pulse #${state.pulse_count} / ${tms_last_activity} → ${now_tms} (+${ (elapsed_since_last_activity_ms / 1000.).toFixed(3) }s) [${debug_id}] ———————`)
	if (DEBUG) state.logger.log({ browser_state })
	if (DEBUG) asap_but_out_of_current_event_loop(state.logger.groupEnd)

	const elapsed_since_last_check_ms = now_tms - state.tms_last_activity_check
	const has_enough_time_passed = elapsed_since_last_check_ms >= state._cache.min_period_ms
	if (!has_enough_time_passed) {
		if (DEBUG) console.log(`(not enough time has passed: ${elapsed_since_last_check_ms} < ${state._cache.min_period_ms})`)
	}
	else {
		state = {
			...state,
			tms_last_activity_check: now_tms - now_tms % state._cache.min_period_ms
		}
		let has_subscription_mutations = false // so far

		const mutated_subscriptions: State['subscriptions'] = {}

		const subscription_ids = Object.keys(state.subscriptions)
		subscription_ids.forEach(id => {
			const { options, callback, last_call_tms } = state.subscriptions[id]
			mutated_subscriptions[id] = {
				...state.subscriptions[id]
			}

			if (options.visual && !browser_state.is_page_visible)
				return
			if (options.cloud && !browser_state.is_connected_to_a_network)
				return

			const elapsed_since_last_ms = now_tms - last_call_tms
			const rem = now_tms % options.ideal_period_ms

			const has_enough_time_passed = elapsed_since_last_ms >= options.ideal_period_ms

			if (DEBUG) console.log(`checking subscription "${id}"…`, { options, last_call_tms, now_tms, elapsed_since_last_ms, rem, has_enough_time_passed })

			if (has_enough_time_passed) {
				if (DEBUG) console.log(`sending pulse to "${id}"`, { options, last_call_tms, now_tms, elapsed_since_last_ms, rem, has_enough_time_passed })
				callback(now_tms, id)
				mutated_subscriptions[id].last_call_tms = now_tms - rem // back-date to closer to the boundary,better for ex. for time
				has_subscription_mutations = true
			}
		})

		if (has_subscription_mutations) {
			state = {
				...state,
				subscriptions: mutated_subscriptions,
			}
		}
	}

	return state
}
