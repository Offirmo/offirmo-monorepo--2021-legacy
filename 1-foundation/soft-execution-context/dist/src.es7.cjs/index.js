"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
exports.LIB = constants_1.LIB;
exports.INTERNAL_PROP = constants_1.INTERNAL_PROP;
const catch_factory_1 = require("./catch-factory");
exports.createCatcher = catch_factory_1.createCatcher;
const core_1 = require("./core");
function create(...args) {
    const SEC = core_1.create(...args);
    // TODO offer to hook setTimeout etc.
    //core.
    return SEC;
}
const isomorphic = {
    isSEC: core_1.isSEC,
    create,
    setRoot: core_1.setRoot,
    getContext: core_1.getContext,
};
exports.isomorphic = isomorphic;
//# sourceMappingURL=index.js.map