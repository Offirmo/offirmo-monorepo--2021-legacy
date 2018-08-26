function is_list($node) {
    return ($node.$type === 'ul' || $node.$type === 'ol');
}
function is_link($node) {
    return !!$node.$hints.href;
}
function is_KVP_list($node) {
    if (!is_list($node))
        return false;
    return Object.values($node.$sub)
        .every($node => $node.$content === '{{key}}: {{value}}');
}
function is_uuid_list($node) {
    if (!is_list($node))
        return false;
    return Object.values($node.$sub)
        .every($node => !!($node.$hints || {}).uuid);
}
export { is_list, is_link, is_KVP_list, is_uuid_list, };
//# sourceMappingURL=common.js.map