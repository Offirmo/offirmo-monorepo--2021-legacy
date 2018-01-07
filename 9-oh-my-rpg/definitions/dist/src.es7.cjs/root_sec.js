"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const soft_execution_context = require("@offirmo/soft-execution-context");
const enforce_immutability = (v) => v;
//const enforce_immutability = (state: State) => deepFreeze(state)
function get_default_SEC_context() {
    return {
        enforce_immutability,
    };
}
exports.get_default_SEC_context = get_default_SEC_context;
function oh_my_rpg_get_SEC({ module, parent_SEC }) {
    if (parent_SEC && !soft_execution_context.isomorphic.isSEC(parent_SEC)) {
        // better error
        throw new Error(`@oh-my-rpg: missing sec when creating module "${module}"!`);
    }
    return soft_execution_context.isomorphic.create({
        parent: parent_SEC,
        module,
        context: Object.assign({}, get_default_SEC_context()),
    });
}
exports.oh_my_rpg_get_SEC = oh_my_rpg_get_SEC;
//# sourceMappingURL=root_sec.js.map