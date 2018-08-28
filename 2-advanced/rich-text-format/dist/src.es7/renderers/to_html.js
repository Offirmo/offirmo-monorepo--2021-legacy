import { NodeType, walk } from '../walk';
import { is_list, is_link, is_KVP_list, is_uuid_list } from './common';
const LIB = 'rich_text_to_html';
const MANY_TABS = '																																							';
export const DEFAULT_OPTIONS = {};
function indent(n) {
    return MANY_TABS.slice(0, n);
}
const NODE_TYPE_TO_HTML_ELEMENT = {
    [NodeType.heading]: 'h3',
    [NodeType.inline_fragment]: 'div',
    [NodeType.block_fragment]: 'div',
};
const on_concatenate_sub_node = ({ $node, state, sub_state }) => {
    state.sub_nodes.push($node);
    state.str = state.str + sub_state.str;
    return state;
};
const on_node_exit = ({ state, $node, depth }) => {
    const { $type, $classes, $sub, $hints } = $node;
    const $sub_node_count = Object.keys($sub).length;
    //$type: NodeType, str
    //}: string, $classes: string[], $sub_node_count: number, depth: number): string {
    if ($type === 'br') {
        state.str = '<br/>\n';
        return state;
    }
    if ($type === 'hr') {
        state.str = '\n<hr/>\n';
        return state;
    }
    let result = '';
    let is_inline = false;
    const classes = [...$classes];
    switch ($type) {
        case 'strong':
        case 'em':
        case 'span':
            is_inline = true;
            break;
        case 'inline_fragment':
            classes.push('o⋄rich-text⋄inline');
            break;
        default:
            break;
    }
    if (!is_inline)
        result += '\n' + indent(depth);
    const element = NODE_TYPE_TO_HTML_ELEMENT[$type] || $type;
    if (is_list($node)) {
        classes.push('o⋄rich-text⋄list');
        switch ($hints.bullets_style) {
            case 'none':
                classes.push('o⋄rich-text⋄list--no-bullet');
                break;
            default:
                break;
        }
        if (is_uuid_list($node)) {
            console.log(`${LIB} seen uuid list`);
            classes.push('o⋄rich-text⋄list--interactive');
        }
        if (is_KVP_list($node)) {
            classes.push('o⋄rich-text⋄list--no-bullet');
            // TODO rewrite completely
            console.log(`${LIB} TODO KVP`);
        }
    }
    result += `<${element}`;
    if (classes.length)
        result += ` class="${classes.join(' ')}"`;
    result += '>' + state.str + ($sub_node_count ? '\n' + indent(depth) : '') + `</${element}>`;
    if (is_link($node))
        result = `<a href="${$hints.href}" target="_blank">${result}</a>`;
    // for demo only
    if ($hints.uuid)
        result = `<button class="o⋄button--inline o⋄rich-text⋄interactive" title="TODO interactive ${$hints.uuid}">${result}</button>`;
    state.str = result;
    return state;
};
const callbacks = {
    on_node_enter: () => ({
        sub_nodes: [],
        str: '',
    }),
    on_concatenate_str: ({ state, str }) => {
        state.str += str;
        return state;
    },
    on_concatenate_sub_node,
    on_node_exit,
};
function to_html($doc, options = DEFAULT_OPTIONS) {
    return '<div class="o⋄rich-text">\n	' + walk($doc, callbacks, options).str + '\n</div>\n';
}
export { callbacks, to_html };
//# sourceMappingURL=to_html.js.map