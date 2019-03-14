/////////////////////

import assert from 'tiny-invariant'

import { SCHEMA_VERSION } from './consts'

import {
	Engagement,
	PendingEngagement,
	State,
} from './types'

import { SoftExecutionContext, OMRContext, get_lib_SEC } from './sec'

/////////////////////

function create(SEC?: SoftExecutionContext): Readonly<State> {
	return get_lib_SEC(SEC).xTry('create', ({enforce_immutability}: OMRContext) => {
		return enforce_immutability({
			schema_version: SCHEMA_VERSION,
			revision: 0,

			queue: [],
		})
	})
}

/////////////////////

function enqueue(state: Readonly<State>, engagement: Readonly<Engagement>, params: Readonly<PendingEngagement['params']> = {}): Readonly<State> {

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

function acknowledge_seen(state: Readonly<State>, uid: number): Readonly<State> {
	const is_in_queue = state.queue.some(queued => queued.uid === uid)
	assert(is_in_queue, `Engagement: acknowledging a non-queued engagement "${uid}"!`)

	return {
		...state,

		queue: state.queue.filter(queued => queued.uid !== uid),

		revision: state.revision + 1,
	}
}

function acknowledge_all_seen(state: Readonly<State>): Readonly<State> {
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
