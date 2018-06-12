"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function create(parent_state) {
    const details = parent_state
        ? Object.create(parent_state.details)
        : Object.create(null); // NO auto-details here, let's keep it simple. See core or platform specific code.
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