"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constants_1 = require("../../constants");
const TopState = tslib_1.__importStar(require("../../state"));
const State = tslib_1.__importStar(require("./state"));
const utils_1 = require("../../utils");
const PLUGIN_ID = 'dependency_injection';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN = {
    id: PLUGIN_ID,
    state: State,
    augment: prototype => {
        prototype.injectDependencies = function injectDependencies(deps) {
            let root_state = this[constants_1.INTERNAL_PROP];
            root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, state => {
                Object.entries(deps).forEach(([key, value]) => {
                    state = State.injectDependencies(state, key, value);
                });
                return state;
            });
            this[constants_1.INTERNAL_PROP] = root_state;
            return this; // for chaining
        };
        prototype.getInjectedDependencies = function getInjectedDependencies() {
            const plugin_state = this[constants_1.INTERNAL_PROP].plugins[PLUGIN_ID];
            return utils_1.flattenToOwn(plugin_state.context);
        };
    }
};
exports.PLUGIN = PLUGIN;
//# sourceMappingURL=index.js.map