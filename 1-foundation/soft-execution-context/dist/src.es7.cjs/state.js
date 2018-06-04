"use strict";
// IMMUTABLE!
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////
let instance_count = 0;
function create(parent_state) {
    return {
        sid: instance_count++,
        parent: parent_state || null,
        plugins: {},
        cache: {},
    };
}
exports.create = create;
function activate_plugin(state, PLUGIN, args) {
    const plugin_parent_state = state.parent
        ? state.parent.plugins[PLUGIN.id]
        : null;
    let plugin_state = PLUGIN.state.create(plugin_parent_state);
    //plugin_state = PLUGIN.state.init_from_creation_args(plugin_state, args)
    return Object.assign({}, state, { plugins: Object.assign({}, state.plugins, { [PLUGIN.id]: Object.assign({}, plugin_state, { sid: state.sid }) }) });
}
exports.activate_plugin = activate_plugin;
function reduce_plugin(state, PLUGIN_ID, reducer) {
    const initial_plugin_state = state.plugins[PLUGIN_ID];
    const new_plugin_state = reducer(initial_plugin_state);
    if (new_plugin_state === initial_plugin_state)
        return state; // no change
    return Object.assign({}, state, { plugins: Object.assign({}, state.plugins, { [PLUGIN_ID]: new_plugin_state }) });
}
exports.reduce_plugin = reduce_plugin;
//# sourceMappingURL=state.js.map