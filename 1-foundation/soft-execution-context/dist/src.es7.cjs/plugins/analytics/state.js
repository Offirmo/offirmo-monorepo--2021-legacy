"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function create(parent_state) {
    const details = parent_state
        ? Object.create(parent_state.details)
        : (() => {
            const details = Object.create(null);
            // TODO add auto-details? Here?
            return details;
        })();
    return {
        details,
    };
}
exports.create = create;
function addDetail(state, key, value) {
    const { details } = state;
    details[key] = value;
    return Object.assign({}, state, { details });
}
exports.addDetail = addDetail;
//# sourceMappingURL=state.js.map