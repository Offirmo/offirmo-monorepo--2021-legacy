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
        addHints,
        pushText,
        pushRawNode,
        pushNode,
        pushInlineFragment,
        pushBlockFragment,
        pushStrong,
        pushWeak,
        pushEmphasized,
        pushHeading,
        pushHorizontalRule,
        pushLineBreak,
        pushKeyValue,
        done,
    };
    let sub_id = 0;
    function addClass(...classes) {
        $node.$classes.push(...classes);
        return builder;
    }
    function addHints(hints) {
        $node.$hints = Object.assign({}, $node.$hints, hints);
        return builder;
    }
    function pushText(str) {
        $node.$content += str;
        return builder;
    }
    function _buildAndPush(builder, str, options = {}) {
        options = Object.assign({ classes: [] }, options);
        const node = builder
            .pushText(str)
            .addClass(...options.classes)
            .done();
        delete options.classes;
        return pushNode(node, options);
    }
    // nothing is added in content
    // useful for
    // 1. lists
    // 2. manual stuff
    function pushRawNode(node, options = {}) {
        const id = options.id || ('000' + ++sub_id).slice(-4);
        $node.$sub[id] = node;
        if (options.classes)
            $node.$classes.push(...options.classes);
        return builder;
    }
    // node ref is auto added into content
    function pushNode(node, options = {}) {
        const id = options.id || ('000' + ++sub_id).slice(-4);
        $node.$content += `{{${id}}}`;
        return pushRawNode(node, Object.assign({}, options, { id }));
    }
    function pushInlineFragment(str, options) {
        return _buildAndPush(inline_fragment(), str, options);
    }
    function pushBlockFragment(str, options) {
        return _buildAndPush(block_fragment(), str, options);
    }
    function pushStrong(str, options) {
        return _buildAndPush(strong(), str, options);
    }
    function pushWeak(str, options) {
        return _buildAndPush(weak(), str, options);
    }
    function pushEmphasized(str, options) {
        return _buildAndPush(emphasized(), str, options);
    }
    function pushHeading(str, options) {
        return _buildAndPush(heading(), str, options);
    }
    function pushHorizontalRule() {
        $node.$content += '{{hr}}';
        return builder;
    }
    function pushLineBreak() {
        $node.$content += '{{br}}';
        return builder;
    }
    function pushKeyValue(key, value, options = {}) {
        if ($node.$type !== types_1.NodeType.ol && $node.$type !== types_1.NodeType.ul)
            throw new Error(`${consts_1.LIB}: Key/value is intended to be used in a ol/ul only!`);
        options = Object.assign({ classes: [] }, options);
        const kv_node = key_value(key, value)
            .addClass(...options.classes)
            .done();
        delete options.classes;
        return pushRawNode(kv_node, options);
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
exports.strong = strong;
function weak() {
    return create(types_1.NodeType.weak);
}
exports.weak = weak;
function emphasized() {
    return create(types_1.NodeType.em);
}
exports.emphasized = emphasized;
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
        .pushNode(key_node, { id: 'key' })
        .pushText(': ')
        .pushNode(value_node, { id: 'value' });
}
exports.key_value = key_value;
//# sourceMappingURL=builder.js.map