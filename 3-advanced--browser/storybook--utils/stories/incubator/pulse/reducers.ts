import { Immutable } from '@offirmo-private/ts-types/src'
import assert from 'tiny-invariant'

import { State, PulseOptions } from './types'

////////////////////////////////////

export function create(): Immutable<State> {
	return {
		logger: console,
		subscriptions: {},
	}
}

export function subscribe_to_pulse(state: Immutable<State>, id: string, callback: (tms: number, id?: string) => void, options: Immutable<PulseOptions>): Immutable<State> {
	assert(!state.subscriptions[id], `subscribe_to_pulse(): id "${id}" should not already exist!`)

	return {
		...state,

		subscriptions: {
			...state.subscriptions,

			[id]: {
				options,
				last_call_tms: 0,
			}
		},
	}
}

