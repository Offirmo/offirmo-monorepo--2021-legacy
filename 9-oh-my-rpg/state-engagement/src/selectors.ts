import {State, Engagement, EngagementType, PendingEngagement } from './types'


/////////////////////

function is_in_queue(state: Readonly<State>, key: string): boolean {
	return state.queue.some(queued => queued.engagement.key === key)
}

function get_oldest_queued_flow(state: Readonly<State>): PendingEngagement | undefined {
	return state.queue
		.find(queued => queued.engagement.type === EngagementType.flow)
}

function get_oldest_queued_non_flow(state: Readonly<State>): PendingEngagement | undefined {
	return state.queue
		.find(queued => queued.engagement.type !== EngagementType.flow)
}


/////////////////////

export {
	is_in_queue,
	get_oldest_queued_flow,
	get_oldest_queued_non_flow,
}
