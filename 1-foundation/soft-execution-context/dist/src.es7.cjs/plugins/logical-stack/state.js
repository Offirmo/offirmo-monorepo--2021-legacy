"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
function create(parent_state) {
    const stack = parent_state
        ? Object.create(parent_state.stack)
        : (() => {
            const stack = Object.create(null);
            stack.module = undefined;
            return stack;
        })();
    stack.operation = undefined; // shouldn't inherit this one
    return {
        stack,
    };
}
exports.create = create;
function set_module(state, module) {
    const { stack } = state;
    if (stack.module === module)
        return state;
    stack.module = module;
    return Object.assign({}, state, { stack });
}
exports.set_module = set_module;
function set_operation(state, operation) {
    const { stack } = state;
    if (stack.operation === operation)
        return state;
    stack.operation = operation;
    return Object.assign({}, state, { stack });
}
exports.set_operation = set_operation;
function init_from_creation_args(state, { module, operation }) {
    if (module)
        state = set_module(state, module);
    if (operation)
        state = set_operation(state, operation);
    return state;
}
exports.init_from_creation_args = init_from_creation_args;
//# sourceMappingURL=state.js.map