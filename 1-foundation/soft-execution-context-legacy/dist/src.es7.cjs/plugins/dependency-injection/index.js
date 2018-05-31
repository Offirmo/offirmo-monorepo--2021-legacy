"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggers_types_and_stubs_1 = require("@offirmo/loggers-types-and-stubs");
const constants_1 = require("../../constants");
function getContext(SEC) {
    return SEC[constants_1.INTERNAL_PROP].DI.context;
}
exports.getContext = getContext;
function installPluginDependencyInjection(SEC, args) {
    const { parent } = args;
    const { defaultContext: defaultChildContext = {}, context: childContext = {}, } = args;
    const SECInternal = SEC[constants_1.INTERNAL_PROP];
    // TODO check params
    // TODO report handled params
    // TODO check conflicts?
    const defaultContext = {
        env: 'development',
        logger: loggers_types_and_stubs_1.compatibleLoggerToConsole,
    };
    const parentContext = parent ? parent[constants_1.INTERNAL_PROP].DI.context : {};
    const forcedContext = {
        logicalStack: SECInternal.LS.logicalStack,
        tracePrefix: SECInternal.LS.logicalStack.short,
    };
    let context = Object.assign({}, defaultContext, defaultChildContext, parentContext, childContext, forcedContext);
    // TODO deep freeze ?
    SECInternal.DI = {
        context,
    };
    return SEC;
}
exports.installPluginDependencyInjection = installPluginDependencyInjection;
//# sourceMappingURL=index.js.map