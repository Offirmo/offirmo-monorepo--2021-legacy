import { Immutable } from '@offirmo-private/ts-types/src'
import assert from 'tiny-invariant'

import {
	State,
	PulseOptions,
	Callback,
} from './types'

////////////////////////////////////

export function create(): Immutable<State> {
	return {
		logger: console,
		min_period_ms: Infinity,
		subscriptions: {},
	}
}

export function subscribe_to_pulse(state: Immutable<State>, id: string, callback: Callback, options: Immutable<PulseOptions>): Immutable<State> {
	assert(!state.subscriptions[id], `subscribe_to_pulse(): id "${id}" should not already exist!`)

	return {
		...state,
		min_period_ms: Math.min(options.ideal_period_ms, state.min_period_ms),

		subscriptions: {
			...state.subscriptions,

			[id]: {
				options,
				callback,
				last_call_tms: 0,
			}
		},
	}
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

	return state
}

