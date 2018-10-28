"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
/////////////////////
function is_in_queue(state, key) {
    return state.queue.some(queued => queued.engagement.key === key);
}
exports.is_in_queue = is_in_queue;
function get_oldest_queued_flow(state) {
    return state.queue
        .find(queued => queued.engagement.type === types_1.EngagementType.flow);
}
exports.get_oldest_queued_flow = get_oldest_queued_flow;
function get_oldest_queued_non_flow(state) {
    return state.queue
        .find(queued => queued.engagement.type !== types_1.EngagementType.flow);
}
exports.get_oldest_queued_non_flow = get_oldest_queued_non_flow;
//# sourceMappingURL=selectors.js.map