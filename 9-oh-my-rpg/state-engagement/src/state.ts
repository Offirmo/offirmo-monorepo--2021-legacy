/////////////////////

import { SCHEMA_VERSION } from './consts'

import {
	Engagement,
	PendingEngagement,
	State,
} from './types'

import { SoftExecutionContext, OMRContext, get_lib_SEC } from './sec'

import { is_in_queue } from './selectors'

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

function enqueue(state: Readonly<State>, engagement: Engagement, params: PendingEngagement['params'] = {}): Readonly<State> {

	// TODO refine this concept
	// ex. multiple level rises should be ok
	// flow maybe
	// or maybe it's a bug if this happen?
	if (is_in_queue(state, engagement.key)) {
		throw new Error(`Engagement: attempting to queue duplicate "${engagement.key}"!`)
		//return state
	}

	const pending: PendingEngagement = {
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


function acknowledge_seen(state: Readonly<State>, key: string): Readonly<State> {
	if (!is_in_queue(state, key)) {
		throw new Error(`Engagement: acknowledging a non-queued engagement "${key}"!`)
	}

	return {
		...state,

		queue: state.queue.filter(queued => queued.engagement.key !== key),

		revision: state.revision + 1,
	}
}

/////////////////////

export {
	create,
	enqueue,
	acknowledge_seen,
}

/////////////////////
