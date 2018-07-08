"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constants_1 = require("./constants");
exports.LIB = constants_1.LIB;
const root_prototype_1 = require("./root-prototype");
const State = tslib_1.__importStar(require("./state"));
const index_1 = require("./plugins/index");
const common_1 = require("./common");
root_prototype_1.ROOT_PROTOTYPE.createChild = function createChild(args) {
    return createSEC(Object.assign({}, args, { parent: this }));
};
index_1.PLUGINS.forEach(PLUGIN => {
    PLUGIN.augment(root_prototype_1.ROOT_PROTOTYPE);
});
function isSEC(SEC) {
    return (SEC && SEC[constants_1.INTERNAL_PROP]);
}
exports.isSEC = isSEC;
function createSEC(args = {}) {
    /////// PARAMS ///////
    if (args.parent && !isSEC(args.parent))
        throw new Error(`${constants_1.LIB}›createSEC() argument error: parent must be a valid SEC!`);
    args.parent = args.parent || {};
    let unhandled_args = Object.keys(args);
    let SEC = Object.create(root_prototype_1.ROOT_PROTOTYPE);
    /////// STATE ///////
    let parent_state = args.parent[constants_1.INTERNAL_PROP];
    let state = State.create(parent_state);
    unhandled_args = unhandled_args.filter(arg => arg !== 'parent');
    index_1.PLUGINS.forEach(PLUGIN => {
        state = State.activate_plugin(state, PLUGIN, args);
    });
    SEC[constants_1.INTERNAL_PROP] = state;
    // auto injections
    if (!args.parent) {
        SEC.injectDependencies({
            logger: console,
        });
        common_1.decorateWithDetectedEnv(SEC);
    }
    SEC.injectDependencies({ SEC });
    // Here we could send an event on the SEC bus. No usage for now.
    // Her we could have lifecycle methods. No usage for now.
    if (unhandled_args.length)
        throw new Error(`${constants_1.LIB}›createSEC() argument error: unknown args: [${unhandled_args.join(',')}]!`);
    /////////////////////
    return SEC;
}
exports.createSEC = createSEC;
//# sourceMappingURL=core.js.map