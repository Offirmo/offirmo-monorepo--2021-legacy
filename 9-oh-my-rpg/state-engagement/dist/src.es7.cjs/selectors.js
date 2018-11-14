"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
/////////////////////
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