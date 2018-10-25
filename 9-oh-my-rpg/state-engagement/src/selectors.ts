import {State, Engagement, EngagementType } from './types'


/////////////////////

function is_in_queue(state: Readonly<State>, key: string): boolean {
	return state.queue.some(queued => queued.engagement.key === key)
}

function get_oldest_queued_flow(state: Readonly<State>): Engagement | undefined {
	return state.queue
		.map(queued => queued.engagement)
		.find(queued => queued.type === EngagementType.flow)
}


/////////////////////

export {
	is_in_queue,
	get_oldest_queued_flow,
}
