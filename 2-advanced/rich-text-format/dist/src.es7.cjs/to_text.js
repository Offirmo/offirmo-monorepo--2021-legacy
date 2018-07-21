"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const walk_1 = require("./walk");
const consts_1 = require("./consts");
const on_type = ({ $type, state, $node, depth }) => {
    //console.log('[on_type]', { $type, state })
    const markdown = true;
    if (markdown) {
        switch ($node.$type) {
            case 'heading':
                state.str = `### ${state.str}`;
                break;
            case 'strong':
                state.str = `**${state.str}**`;
                break;
            case 'em':
                state.str = `_${state.str}_`;
                break;
            case 'br':
                state.ends_with_block = true;
                break;
            case 'hr':
                state.str = '---';
                break;
            default:
                break;
        }
        if ($node.$hints.href)
            state.str = `[${state.str}](${$node.$hints.href})`;
    }
    else {
        switch ($node.$type) {
            case 'br':
                state.ends_with_block = true;
                break;
            case 'hr':
                state.str = '------------------------------------------------------------';
                break;
            default:
                break;
        }
    }
    if (consts_1.NODE_TYPE_TO_DISPLAY_MODE[$node.$type] === 'block') {
        state.starts_with_block = true;
        state.ends_with_block = true;
    }
    return state;
};
const on_concatenate_sub_node = ({ state, sub_state, $node, $id, $parent_node }) => {
    let sub_str = sub_state.str;
    let sub_starts_with_block = sub_state.starts_with_block;
    switch ($parent_node.$type) {
        case 'ul':
            // automake sub-state a ul > li
            sub_starts_with_block = true;
            sub_str = '- ' + sub_str;
            break;
        case 'ol':
            // automake sub-state a ol > li
            sub_starts_with_block = true;
            sub_str = `${(' ' + $id).slice(-2)}. ` + sub_str;
            break;
        default:
            break;
    }
    /*console.log('on_concatenate_sub_node()', {
        sub_node: $node,
        sub_state: {
            ...sub_state,
                str: sub_str,
                starts_with_block: sub_starts_with_block,
        },
        state: JSON.parse(JSON.stringify(state)),
    })*/
    if (state.str.length === 0) {
        // we are at start
        if (sub_state.starts_with_block) {
            // propagate start
            state.starts_with_block = true;
        }
    }
    else {
        if (state.ends_with_block || sub_starts_with_block) {
            state.str += '\n';
        }
    }
    state.str += sub_str;
    state.ends_with_block = sub_state.ends_with_block;
    return state;
};
const callbacks = {
    on_node_enter: ({ $node }) => ({
        starts_with_block: false,
        ends_with_block: false,
        str: '',
    }),
    on_concatenate_str: ({ state, str }) => {
        //console.log('on_concatenate_str()', {str, state: JSON.parse(JSON.stringify(state)),})
        if (state.ends_with_block) {
            state.str += '\n';
            state.ends_with_block = false;
        }
        state.str += str;
        return state;
    },
    on_concatenate_sub_node,
    on_type,
};
exports.callbacks = callbacks;
function to_text($doc) {
    return walk_1.walk($doc, callbacks).str;
}
exports.to_text = to_text;
//# sourceMappingURL=to_text.js.map