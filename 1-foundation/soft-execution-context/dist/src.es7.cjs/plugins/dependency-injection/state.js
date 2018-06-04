"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function create(parent_state) {
    const context = parent_state
        ? Object.create(parent_state.context)
        : (() => {
            const context = Object.create(null);
            context.logger = console;
            context.ENV = typeof NODE_ENV === 'string'
                ? NODE_ENV
                : 'development';
            context.DEBUG = false; // TOREVIEW
            return context;
        })();
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