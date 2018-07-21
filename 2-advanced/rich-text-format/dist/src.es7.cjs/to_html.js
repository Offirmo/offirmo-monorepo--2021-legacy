"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const walk_1 = require("./walk");
const MANY_TABS = '																																							';
function indent(n) {
    return MANY_TABS.slice(0, n);
}
const NODE_TYPE_TO_HTML_ELEMENT = {
    [walk_1.NodeType.heading]: 'h3',
    [walk_1.NodeType.inline_fragment]: 'span',
    [walk_1.NodeType.block_fragment]: 'div',
};
const on_concatenate_sub_node = ({ state, sub_state }) => {
    return state + sub_state;
};
const on_type = ({ state, $node, depth, $type }) => {
    const { $classes, $sub, $hints } = $node;
    const $sub_node_count = Object.keys($sub).length;
    //$type: NodeType, str
    //}: string, $classes: string[], $sub_node_count: number, depth: number): string {
    if ($type === 'br')
        return '<br/>\n';
    if ($type === 'hr')
        return '\n<hr/>\n';
    let is_inline = false;
    switch ($type) {
        case 'strong':
        case 'em':
        case 'span':
            is_inline = true;
            break;
        default:
            break;
    }
    let result = '';
    if (!is_inline)
        result += '\n' + indent(depth);
    const element = NODE_TYPE_TO_HTML_ELEMENT[$type] || $type;
    result += `<${element}`;
    if ($classes.length)
        result += ` class="${$classes.join(' ')}"`;
    result += '>' + state + ($sub_node_count ? '\n' + indent(depth) : '') + `</${element}>`;
    if ($hints.href)
        result = `<a href="${$hints.href}">${result}</a>`;
    return result;
};
const callbacks = {
    on_node_enter: () => '',
    on_concatenate_str: ({ state, str }) => state + str,
    on_concatenate_sub_node,
    on_type,
};
exports.callbacks = callbacks;
function to_html($doc) {
    return walk_1.walk($doc, callbacks);
}
exports.to_html = to_html;
//# sourceMappingURL=to_html.js.map