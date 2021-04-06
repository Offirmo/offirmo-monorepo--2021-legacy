/////////////////////

import assert from 'tiny-invariant'
import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import { SCHEMA_VERSION } from './consts'

import {
	Engagement,
	PendingEngagement,
	State,
} from './types'

import { OMRSoftExecutionContext, get_lib_SEC } from './sec'

/////////////////////

function create(SEC?: OMRSoftExecutionContext): Immutable<State> {
	return get_lib_SEC(SEC).xTry('create', () => {
		return enforce_immutability<State>({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			queue: [],
		})
	})
}

/////////////////////

function enqueue(state: Immutable<State>, engagement: Immutable<Engagement>, params: Immutable<PendingEngagement['params']> = {}): Immutable<State> {

	// Avoid duplication? Possible bug? No, hard to detect, may have different params.
	// ex. multiple level rises should be ok.
	// ex. multiple new achievements

	const pending: PendingEngagement = {
		uid: state.revision + 1,
		engagement,
		params,
	}

	return {
		...state,

		queue: [
			...state.queue,
			pending,
		],

		revision: state.revision + 1,
	}
}

function acknowledge_seen(state: Immutable<State>, uid: number): Immutable<State> {
	const is_in_queue = state.queue.some(queued => queued.uid === uid)
	assert(is_in_queue, `Engagement: acknowledging a non-queued engagement "${uid}"!`)

	return {
		...state,

		queue: state.queue.filter(queued => queued.uid !== uid),

		revision: state.revision + 1,
	}
}

function acknowledge_all_seen(state: Immutable<State>): Immutable<State> {
	if (!state.queue.length) return state

	return {
		...state,

		queue: [],

		revision: state.revision + 1,
	}
}

/////////////////////

export {
	create,
	enqueue,
	acknowledge_seen,
	acknowledge_all_seen,
}

/////////////////////
