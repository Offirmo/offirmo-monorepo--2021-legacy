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
    stack.operation = undefined; // should never inherit this one
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
//# sourceMappingURL=state.js.map