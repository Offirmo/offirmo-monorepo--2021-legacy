"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../consts");
const types_1 = require("../types");
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
        pushKeyValue,
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
    // nothing is added in content
    function pushRawNode(node, id) {
        // XX restrict?
        $node.$sub[id] = node;
        return builder;
    }
    // node ref is auto added into content
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
    function pushKeyValue(key, value, id) {
        if ($node.$type !== types_1.NodeType.ol && $node.$type !== types_1.NodeType.ul)
            throw new Error(`${consts_1.LIB}: Key/value is intended to be used in a ol/ul only!`);
        const kv_node = key_value(key, value).done();
        //id = id || `${Object.keys($node.$sub).length}`
        id = id || ('s' + ++sub_id);
        return pushRawNode(kv_node, id);
    }
    function done() {
        return $node;
    }
    return builder;
}
exports.create = create;
function inline_fragment() {
    return create(types_1.NodeType.inline_fragment);
}
exports.inline_fragment = inline_fragment;
function block_fragment() {
    return create(types_1.NodeType.block_fragment);
}
exports.block_fragment = block_fragment;
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
function key_value(key, value) {
    const key_node = typeof key === 'string'
        ? span().pushText(key).done()
        : key;
    const value_node = typeof value === 'string'
        ? span().pushText(value).done()
        : value;
    return inline_fragment()
        .pushNode(key_node, 'key')
        .pushText(': ')
        .pushNode(value_node, 'value');
}
exports.key_value = key_value;
//# sourceMappingURL=builder.js.map