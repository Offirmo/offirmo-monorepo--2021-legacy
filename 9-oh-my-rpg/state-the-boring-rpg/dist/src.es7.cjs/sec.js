"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const soft_execution_context_1 = require("@offirmo/soft-execution-context");
const definitions_1 = require("@oh-my-rpg/definitions");
const consts_1 = require("./consts");
function get_lib_SEC(parent) {
    return definitions_1.decorate_SEC((parent || soft_execution_context_1.getRootSEC())
        .createChild()
        .setLogicalStack({ module: consts_1.LIB })
        .setAnalyticsAndErrorDetails({
        sub_product: 'state-the-boring-rpg',
    }));
}
exports.get_lib_SEC = get_lib_SEC;
//# sourceMappingURL=sec.js.map