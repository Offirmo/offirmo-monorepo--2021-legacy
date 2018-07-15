"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const on_concatenate_sub_node = ({ state, sub_state, $id, $parent_node }) => {
    if ($parent_node.$type === 'ul')
        return state + '\n - ' + sub_state;
    if ($parent_node.$type === 'ol')
        return state + `\n ${(' ' + $id).slice(-2)}. ` + sub_state;
    return state + sub_state;
};
const callbacks = {
    on_node_enter: () => '',
    on_concatenate_str: ({ state, str }) => state + str,
    on_concatenate_sub_node,
    on_type_br: ({ state }) => state + '\n',
    on_type_hr: ({ state }) => state + '\n------------------------------------------------------------\n',
};
exports.callbacks = callbacks;
//# sourceMappingURL=to_text.js.map