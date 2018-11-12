import {State, Engagement, EngagementType, PendingEngagement } from './types'


/////////////////////

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
	get_oldest_queued_flow,
	get_oldest_queued_non_flow,
}
