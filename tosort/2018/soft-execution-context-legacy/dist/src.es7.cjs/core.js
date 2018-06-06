"use strict";
//import NanoEvents from 'nanoevents'  TODO ?
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const promise_try_1 = require("@offirmo/promise-try");
const normalize_error_1 = require("@offirmo/normalize-error");
const catch_factory_1 = require("./catch-factory");
const logical_stack_1 = require("./plugins/logical-stack");
const dependency_injection_1 = require("./plugins/dependency-injection");
exports.getContext = dependency_injection_1.getContext;
function isSEC(SEC) {
    return (SEC && SEC[constants_1.INTERNAL_PROP]);
}
exports.isSEC = isSEC;
let rootSEC = null;
function setRoot(SEC) {
    if (!isSEC(SEC))
        throw new Error(`${constants_1.LIB}›setRoot() argument error: must be a valid SEC!`);
    if (rootSEC)
        throw new Error(`${constants_1.LIB}›setRoot() conflict, root already set!`);
    rootSEC = SEC;
}
exports.setRoot = setRoot;
function create(args = {}) {
    if (args.parent && !isSEC(args.parent))
        throw new Error(`${constants_1.LIB}›create() argument error: parent must be a valid SEC!`);
    const hasNonRootParent = !!args.parent;
    args.parent = args.parent || rootSEC;
    const onError = args.onError || (args.parent && args.parent.onError); // XXX inherit, really?
    let SEC = {
        [constants_1.INTERNAL_PROP]: {
            hasNonRootParent,
            //parent,
            //onError,
            errDecorators: [normalize_error_1.normalizeError],
            state: {},
            DI: {
                context: {}
            },
        },
        child,
        xTry,
        xTryCatch,
        xPromiseTry,
        xPromiseCatch,
        xPromiseTryCatch,
    };
    // TODO rationalize
    // TODO event?
    // TODO lifecycle ?
    //if (SEC.verbose) console.log(`${LIB}: new SEC:`, args)
    SEC = logical_stack_1.installPluginLogicalStack(SEC, args);
    SEC = dependency_injection_1.installPluginDependencyInjection(SEC, args);
    // TODO check all params were handled!
    /////////////////////
    function child(args) {
        // optim for libs which may call themselves
        // XXX TOCheck
        /*if (isSEC(args) && args[INTERNAL_PROP].module && args[INTERNAL_PROP].module === SEC[INTERNAL_PROP].module) {
            // no need to create a child of oneself
            return SEC
        }*/
        return create(Object.assign({}, args, { parent: SEC }));
    }
    /////////////////////
    function xTry(operation, fn) {
        const sub_SEC = SEC.child({ operation });
        const params = Object.assign({}, sub_SEC[constants_1.INTERNAL_PROP].DI.context, { SEC: sub_SEC });
        try {
            return fn(params);
        }
        catch (err) {
            catch_factory_1.createCatcher({
                debugId: 'xTry',
                decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
                onError: null,
            })(err);
        }
    }
    function xTryCatch(operation, fn) {
        const sub_SEC = SEC.child({ operation });
        const params = Object.assign({}, sub_SEC[constants_1.INTERNAL_PROP].DI.context, { SEC: sub_SEC });
        try {
            return fn(params);
        }
        catch (err) {
            catch_factory_1.createCatcher({
                debugId: 'xTryCatch',
                decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
                onError,
            })(err);
        }
    }
    function xPromiseCatch(operation, promise) {
        const sub_SEC = SEC.child({ operation });
        return promise
            .catch(err => {
            catch_factory_1.createCatcher({
                debugId: 'xPromiseCatch',
                decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
                onError,
            })(err);
        });
    }
    function xPromiseTry(operation, fn) {
        const sub_SEC = SEC.child({ operation });
        const params = Object.assign({}, sub_SEC[constants_1.INTERNAL_PROP].DI.context, { SEC: sub_SEC });
        return promise_try_1.promiseTry(() => fn(params))
            .catch(err => {
            catch_factory_1.createCatcher({
                debugId: 'xPromiseTry',
                decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
                onError: null,
            })(err);
        });
    }
    function xPromiseTryCatch(operation, fn) {
        const sub_SEC = SEC.child({ operation });
        const params = Object.assign({}, sub_SEC[constants_1.INTERNAL_PROP].DI.context, { SEC: sub_SEC });
        return promise_try_1.promiseTry(() => fn(params))
            .catch(catch_factory_1.createCatcher({
            debugId: 'xPromiseTryCatch',
            decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
            onError,
        }));
    }
    return SEC;
}
exports.create = create;
//# sourceMappingURL=core.js.map