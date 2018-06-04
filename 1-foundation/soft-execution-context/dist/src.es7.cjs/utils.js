"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
function flattenToOwn(object) {
    //console.log('flattenToOwn', object)
    if (!object)
        return object;
    if (Array.isArray(object))
        return object;
    if (typeof object !== 'object')
        return object;
    const res = Object.create(null);
    for (const property in object) {
        //console.log('flattenToOwn prop', property, object[property])
        res[property] = object[property];
    }
    return res;
}
exports.flattenToOwn = flattenToOwn;
// for debug
function _flattenSEC(SEC) {
    const plugins = Object.assign({}, SEC[constants_1.INTERNAL_PROP].plugins);
    plugins.dependency_injection.context = flattenToOwn(plugins.dependency_injection.context);
    plugins.error_handling.details = flattenToOwn(plugins.error_handling.details);
    plugins.logical_stack.stack = flattenToOwn(plugins.logical_stack.stack);
    return plugins;
}
exports._flattenSEC = _flattenSEC;
// needed for various tree traversal algorithms
function _getSECStatePath(SEC) {
    if (!SEC[constants_1.INTERNAL_PROP].cache.statePath) {
        const path = [];
        let state = SEC[constants_1.INTERNAL_PROP];
        while (state) {
            path.unshift(state);
            state = state.parent;
        }
        SEC[constants_1.INTERNAL_PROP].cache.statePath = path;
    }
    return SEC[constants_1.INTERNAL_PROP].cache.statePath;
}
exports._getSECStatePath = _getSECStatePath;
//# sourceMappingURL=utils.js.map