"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MANY_SPACES = '                                                                                                ';
function indent(n) {
    return MANY_SPACES.slice(0, n * 2);
}
////////////////////////////////////
function debug_node_short($node) {
    const { $type, $content } = $node;
    return `${$type}."${$content}"`;
}
////////////////////////////////////
const on_root_enter = () => {
    console.log('⟩ [on_root_enter]');
};
const on_root_exit = ({ state }) => {
    console.log('⟨ [on_root_exit]');
    console.log(`  [state="${state}"]`);
    return state;
};
const on_node_enter = ({ $node, $id, depth }) => {
    console.log(indent(depth) + `⟩ [on_node_enter] #${$id} ` + debug_node_short($node));
    const state = '';
    console.log(indent(depth) + `  [state="${state}"] (init)`);
    return state;
};
const on_node_exit = ({ $node, $id, state, depth }) => {
    console.log(indent(depth) + `⟨ [on_node_exit] #${$id}`);
    console.log(indent(depth) + `  [state="${state}"]`);
    return state;
};
// when walking inside the content
const on_concatenate_str = ({ str, state, $node, depth, }) => {
    console.log(indent(depth) + `+ [on_concatenate_str] "${str}"`);
    state = state + str;
    console.log(indent(depth) + `  [state="${state}"]`);
    return state;
};
const on_concatenate_sub_node = ({ state, sub_state, depth, $id, $parent_node }) => {
    console.log(indent(depth) + `+ [on_concatenate_sub_node] "${sub_state}"`);
    state = state + sub_state;
    console.log(indent(depth) + `  [state="${state}"]`);
    return state;
};
const on_filter = ({ $filter, $filters, state, $node, depth }) => {
    console.log(indent(depth) + `  [on_filter] "${$filter}`);
    return state;
};
const on_class_before = ({ $class, state, $node, depth }) => {
    console.log(indent(depth) + `  [⟩on_class_before] .${$class}`);
    return state;
};
const on_class_after = ({ $class, state, $node, depth }) => {
    console.log(indent(depth) + `  [⟨on_class_after] .${$class}`);
    return state;
};
const on_type = ({ $type, state, $node, depth }) => {
    console.log(indent(depth) + `  [on_type] "${$type}" ${$node.$classes}`);
    return state;
};
////////////////////////////////////
const callbacks = {
    on_root_enter,
    on_root_exit,
    on_node_enter,
    on_node_exit,
    on_concatenate_str,
    on_concatenate_sub_node,
    /*
    on_sub_node_id: ({$id, state, $node, depth}) => {
        console.log(indent(depth) + `  [sub-node] #${$id}`)
        console.log(indent(depth) + `  [state="${state}"]`)
        return state
    },
    */
    on_filter,
    on_class_before,
    on_class_after,
    on_type,
    on_type_br: ({ state }) => {
        if (typeof state === 'string')
            return state + '{{br}}';
        return state;
    },
    on_type_hr: ({ state }) => {
        if (typeof state === 'string')
            return state + '{{hr}}';
        return state;
    },
};
exports.callbacks = callbacks;
//# sourceMappingURL=to_debug.js.map