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
		subscriptions: {},
	}
}

export function subscribe_to_pulse(state: Immutable<State>, id: string, callback: Callback, options: Immutable<PulseOptions>): Immutable<State> {
	assert(!state.subscriptions[id], `subscribe_to_pulse(): id "${id}" should not already exist!`)

	return {
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

