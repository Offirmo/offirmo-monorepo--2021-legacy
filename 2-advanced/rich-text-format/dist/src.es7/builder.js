import { SCHEMA_VERSION } from './consts';
import { NodeType, } from './types';
function create($type) {
    const $node = {
        $v: SCHEMA_VERSION,
        $type,
        $classes: [],
        $content: '',
        $sub: {},
        $hints: {},
    };
    const builder = {
        addClass,
        pushText,
        pushStrong,
        pushEmphasized,
        pushRawNode,
        pushNode,
        pushLineBreak,
        pushHorizontalRule,
        done,
    };
    let sub_id = 0;
    function addClass(...classes) {
        $node.$classes.push(...classes);
        return builder;
    }
    function pushText(str) {
        $node.$content += str;
        return builder;
    }
    function pushRawNode(node, id) {
        $node.$sub[id] = node;
        return builder;
    }
    function pushNode(node, id) {
        id = id || ('s' + ++sub_id);
        $node.$content += `{{${id}}}`;
        return pushRawNode(node, id);
    }
    function pushStrong(str, id) {
        const node = strong()
            .pushText(str)
            .done();
        return pushNode(node, id);
    }
    function pushEmphasized(str, id) {
        const node = emphasized()
            .pushText(str)
            .done();
        return pushNode(node, id);
    }
    function pushLineBreak() {
        $node.$content += '{{br}}';
        return builder;
    }
    function pushHorizontalRule() {
        $node.$content += '{{hr}}';
        return builder;
    }
    function done() {
        return $node;
    }
    return builder;
}
function section() {
    return create(NodeType.section);
}
function heading() {
    return create(NodeType.heading);
}
function strong() {
    return create(NodeType.strong);
}
function emphasized() {
    return create(NodeType.em);
}
function span() {
    return create(NodeType.span);
}
function ordered_list() {
    return create(NodeType.ol);
}
function unordered_list() {
    return create(NodeType.ul);
}
export { NodeType, create, section, heading, span, ordered_list, unordered_list, };
//# sourceMappingURL=builder.js.map