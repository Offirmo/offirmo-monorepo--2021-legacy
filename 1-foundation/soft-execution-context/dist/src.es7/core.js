import { LIB, INTERNAL_PROP } from './constants';
import { ROOT_PROTOTYPE } from './root-prototype';
import * as State from './state';
import { PLUGINS } from './plugins/index';
import { decorateWithDetectedEnv } from './common';
ROOT_PROTOTYPE.createChild = function createChild(args) {
    return createSEC(Object.assign({}, args, { parent: this }));
};
PLUGINS.forEach(PLUGIN => {
    PLUGIN.augment(ROOT_PROTOTYPE);
});
function isSEC(SEC) {
    return (SEC && SEC[INTERNAL_PROP]);
}
function createSEC(args = {}) {
    /////// PARAMS ///////
    if (args.parent && !isSEC(args.parent))
        throw new Error(`${LIB}›createSEC() argument error: parent must be a valid SEC!`);
    args.parent = args.parent || {};
    let unhandled_args = Object.keys(args);
    let SEC = Object.create(ROOT_PROTOTYPE);
    /////// STATE ///////
    let parent_state = args.parent[INTERNAL_PROP];
    let state = State.create(parent_state);
    unhandled_args = unhandled_args.filter(arg => arg !== 'parent');
    PLUGINS.forEach(PLUGIN => {
        state = State.activate_plugin(state, PLUGIN, args);
    });
    SEC[INTERNAL_PROP] = state;
    // auto injections
    if (!args.parent) {
        SEC.injectDependencies({
            logger: console,
        });
        decorateWithDetectedEnv(SEC);
    }
    SEC.injectDependencies({ SEC });
    // Here we could send an event on the SEC bus. No usage for now.
    // Her we could have lifecycle methods. No usage for now.
    if (unhandled_args.length)
        throw new Error(`${LIB}›createSEC() argument error: unknown args: [${unhandled_args.join(',')}]!`);
    /////////////////////
    return SEC;
}
export { LIB, isSEC, createSEC, };
//# sourceMappingURL=core.js.map