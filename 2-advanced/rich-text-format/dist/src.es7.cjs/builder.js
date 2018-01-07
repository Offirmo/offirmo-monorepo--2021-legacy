"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const types_1 = require("./types");
exports.NodeType = types_1.NodeType;
function create($type) {
    const $node = {
        $v: consts_1.SCHEMA_VERSION,
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
exports.create = create;
function section() {
    return create(types_1.NodeType.section);
}
exports.section = section;
function heading() {
    return create(types_1.NodeType.heading);
}
exports.heading = heading;
function strong() {
    return create(types_1.NodeType.strong);
}
function emphasized() {
    return create(types_1.NodeType.em);
}
function span() {
    return create(types_1.NodeType.span);
}
exports.span = span;
function ordered_list() {
    return create(types_1.NodeType.ol);
}
exports.ordered_list = ordered_list;
function unordered_list() {
    return create(types_1.NodeType.ul);
}
exports.unordered_list = unordered_list;
//# sourceMappingURL=builder.js.map