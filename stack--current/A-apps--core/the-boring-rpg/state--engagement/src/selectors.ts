import { Immutable } from '@offirmo-private/ts-types'
import { State, Engagement, EngagementType, PendingEngagement } from './types'


/////////////////////

function get_oldest_queued_flow(state: Immutable<State>): Immutable<PendingEngagement> | undefined {
	return state.queue
		.find(queued => queued.engagement.type === EngagementType.flow)
}

function get_oldest_queued_non_flow(state: Immutable<State>): Immutable<PendingEngagement> | undefined {
	return state.queue
		.find(queued => queued.engagement.type !== EngagementType.flow)
}


/////////////////////

export {
	get_oldest_queued_flow,
	get_oldest_queued_non_flow,
}
