"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function create(parent_state) {
    const context = parent_state
        ? Object.create(parent_state.context)
        : Object.create(null); // NO auto-injections here, let's keep it simple. See core.
    return {
        context,
    };
}
exports.create = create;
function injectDependencies(state, key, value) {
    const { context } = state;
    context[key] = value;
    return Object.assign({}, state, { context });
}
exports.injectDependencies = injectDependencies;
//# sourceMappingURL=state.js.map