"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const constants_2 = require("./constants");
const common_error_fields_1 = require("@offirmo/common-error-fields");
common_error_fields_1.COMMON_ERROR_FIELDS.add('logicalStack');
// TODO add non-inheritable instance
function getLogicalStack(module, operation, parentModule, parentFullLStack = '') {
    module = module || parentModule;
    if (!module)
        throw new Error(`${constants_1.LIB}/${constants_2.SUB_LIB}: you must provide 'module' to start building a logical stack!`);
    if (parentModule && !parentFullLStack)
        throw new Error(`${constants_1.LIB}/${constants_2.SUB_LIB}: you must provide the parent full LStack!`);
    if (parentFullLStack && !parentModule)
        throw new Error(`${constants_1.LIB}/${constants_2.SUB_LIB}: incoherency parentModule / parent LStack!`);
    /// SHORT ///
    let shortLStack = ''
        + constants_2.LOGICAL_STACK_BEGIN_MARKER
        + constants_2.LOGICAL_STACK_MODULE_MARKER
        + module;
    if (operation) {
        shortLStack += ''
            + constants_2.LOGICAL_STACK_SEPARATOR
            + operation
            + constants_2.LOGICAL_STACK_OPERATION_MARKER;
    }
    /// FULL ///
    let fullLStack = parentFullLStack || constants_2.LOGICAL_STACK_BEGIN_MARKER;
    if (module !== parentModule)
        fullLStack += ''
            + (parentModule ? constants_2.LOGICAL_STACK_SEPARATOR : '')
            + constants_2.LOGICAL_STACK_MODULE_MARKER
            + module;
    if (operation) {
        fullLStack += ''
            + constants_2.LOGICAL_STACK_SEPARATOR
            + operation
            + constants_2.LOGICAL_STACK_OPERATION_MARKER;
    }
    return {
        short: shortLStack,
        full: fullLStack,
    };
}
function installPluginLogicalStack(SEC, { module, operation, parent }) {
    // TODO check params
    // inherit some stuff from our parent
    if (parent) {
        module = module || parent[constants_1.INTERNAL_PROP].LS.module;
    }
    const SECInternal = SEC[constants_1.INTERNAL_PROP];
    const logicalStack = getLogicalStack(module, operation, SECInternal.hasNonRootParent
        ? parent[constants_1.INTERNAL_PROP].LS.module
        : undefined, SECInternal.hasNonRootParent
        ? parent[constants_1.INTERNAL_PROP].LS.logicalStack.full
        : undefined);
    SECInternal.errDecorators.push(function attachLogicalStackToError(err) {
        if (err.logicalStack) {
            // OK this error is already decorated.
            // Thus the message is also already decorated, don't touch it.
            // can we add more info?
            if (err.logicalStack.includes(logicalStack.full)) {
                // ok, logical stack already chained
            }
            else {
                // SEC chain was interrupted
                err.logicalStack = logicalStack.full + constants_2.LOGICAL_STACK_SEPARATOR_NON_ADJACENT + err.logicalStack;
            }
        }
        else {
            if (!err.message.startsWith(logicalStack.short))
                err.message = logicalStack.short + constants_2.LOGICAL_STACK_END_MARKER + ' ' + err.message;
            err.logicalStack = logicalStack.full;
        }
        return err;
    });
    SECInternal.LS = {
        module,
        operation,
        logicalStack,
    };
    return SEC;
}
exports.installPluginLogicalStack = installPluginLogicalStack;
//# sourceMappingURL=index.js.map