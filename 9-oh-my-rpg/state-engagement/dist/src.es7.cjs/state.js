"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const sec_1 = require("./sec");
const selectors_1 = require("./selectors");
/////////////////////
function create(SEC) {
    return sec_1.get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            queue: [],
        });
    });
}
exports.create = create;
/////////////////////
function enqueue(state, engagement, params = {}) {
    // TODO refine this concept
    // ex. multiple level rises should be ok
    // flow maybe
    // or maybe it's a bug if this happen?
    if (selectors_1.is_in_queue(state, engagement.key)) {
        throw new Error(`Engagement: attempting to queue duplicate "${engagement.key}"!`);
        //return state
    }
    const pending = {
        engagement,
        params,
    };
    return Object.assign({}, state, { queue: [
            ...state.queue,
            pending,
        ], revision: state.revision + 1 });
}
exports.enqueue = enqueue;
function acknowledge_seen(state, key) {
    if (!selectors_1.is_in_queue(state, key)) {
        throw new Error(`Engagement: acknowledging a non-queued engagement "${key}"!`);
    }
    return Object.assign({}, state, { queue: state.queue.filter(queued => queued.engagement.key !== key), revision: state.revision + 1 });
}
exports.acknowledge_seen = acknowledge_seen;
/////////////////////
//# sourceMappingURL=state.js.map