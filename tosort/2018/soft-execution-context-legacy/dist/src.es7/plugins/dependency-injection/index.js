"use strict";
import { compatibleLoggerToConsole } from '@offirmo/loggers-types-and-stubs';
import { INTERNAL_PROP } from '../../constants';
function getContext(SEC) {
    return SEC[INTERNAL_PROP].DI.context;
}
function installPluginDependencyInjection(SEC, args) {
    const { parent } = args;
    const { defaultContext: defaultChildContext = {}, context: childContext = {}, } = args;
    const SECInternal = SEC[INTERNAL_PROP];
    // TODO check params
    // TODO report handled params
    // TODO check conflicts?
    const defaultContext = {
        env: 'development',
        logger: compatibleLoggerToConsole,
    };
    const parentContext = parent ? parent[INTERNAL_PROP].DI.context : {};
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
export { installPluginDependencyInjection, getContext, };
//# sourceMappingURL=index.js.map