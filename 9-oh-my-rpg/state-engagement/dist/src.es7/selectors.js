import { EngagementType } from './types';
/////////////////////
function is_in_queue(state, key) {
    return state.queue.some(queued => queued.engagement.key === key);
}
function get_oldest_queued_flow(state) {
    return state.queue
        .find(queued => queued.engagement.type === EngagementType.flow);
}
function get_oldest_queued_non_flow(state) {
    return state.queue
        .find(queued => queued.engagement.type !== EngagementType.flow);
}
/////////////////////
export { is_in_queue, get_oldest_queued_flow, get_oldest_queued_non_flow, };
//# sourceMappingURL=selectors.js.map