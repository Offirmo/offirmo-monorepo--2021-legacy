"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function is_list($node) {
    return ($node.$type === 'ul' || $node.$type === 'ol');
}
exports.is_list = is_list;
function is_link($node) {
    return !!$node.$hints.href;
}
exports.is_link = is_link;
function is_KVP_list($node) {
    if (!is_list($node))
        return false;
    return Object.values($node.$sub)
        .every($node => $node.$content === '{{key}}: {{value}}');
}
exports.is_KVP_list = is_KVP_list;
//# sourceMappingURL=common.js.map