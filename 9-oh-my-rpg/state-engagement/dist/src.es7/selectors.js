import { EngagementType } from './types';
/////////////////////
function get_oldest_queued_flow(state) {
    return state.queue
        .find(queued => queued.engagement.type === EngagementType.flow);
}
function get_oldest_queued_non_flow(state) {
    return state.queue
        .find(queued => queued.engagement.type !== EngagementType.flow);
}
/////////////////////
export { get_oldest_queued_flow, get_oldest_queued_non_flow, };
//# sourceMappingURL=selectors.js.map