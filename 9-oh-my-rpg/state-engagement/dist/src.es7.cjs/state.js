"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const sec_1 = require("./sec");
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
    // Avoid duplication? Possible bug? No, hard to detect, may have different params.
    // ex. multiple level rises should be ok.
    // ex. multiple new achievements
    const pending = {
        uid: state.revision + 1,
        engagement,
        params,
    };
    return Object.assign({}, state, { queue: [
            ...state.queue,
            pending,
        ], revision: state.revision + 1 });
}
exports.enqueue = enqueue;
function acknowledge_seen(state, uid) {
    const is_in_queue = state.queue.some(queued => queued.uid === uid);
    if (!is_in_queue) {
        throw new Error(`Engagement: acknowledging a non-queued engagement "${uid}"!`);
    }
    return Object.assign({}, state, { queue: state.queue.filter(queued => queued.uid !== uid), revision: state.revision + 1 });
}
exports.acknowledge_seen = acknowledge_seen;
/////////////////////
//# sourceMappingURL=state.js.map