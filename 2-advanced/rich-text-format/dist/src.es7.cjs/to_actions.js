"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const walk_1 = require("./walk");
const on_type = ({ $type, state, $node, depth }) => {
    //console.log('[on_type]', { $type, state })
    if ($node.$hints.href) {
        state.actions.push({
            type: 'link',
            data: $node.$hints.href,
        });
    }
    return state;
};
const on_concatenate_sub_node = ({ state, sub_state, $node, $id, $parent_node }) => {
    state.actions = state.actions.concat(...sub_state.actions);
    return state;
};
const callbacks = {
    on_node_enter: ({ $node }) => ({
        actions: [],
    }),
    on_concatenate_str: ({ state, str }) => {
        // nothing
        return state;
    },
    on_concatenate_sub_node,
    on_type,
};
exports.callbacks = callbacks;
function to_actions($doc) {
    return walk_1.walk($doc, callbacks).actions;
}
exports.to_actions = to_actions;
//# sourceMappingURL=to_actions.js.map