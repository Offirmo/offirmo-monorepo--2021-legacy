import { LIB, SCHEMA_VERSION } from '../consts';
import { NodeType, } from '../types';
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
    // useful for
    // 1. lists
    // 2. manual stuff
    function pushRawNode(node, id) {
        id = id || ('000' + ++sub_id).slice(-4);
        $node.$sub[id] = node;
        return builder;
    }
    // node ref is auto added into content
    function pushNode(node, id) {
        id = id || ('000' + ++sub_id).slice(-4);
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
        if ($node.$type !== NodeType.ol && $node.$type !== NodeType.ul)
            throw new Error(`${LIB}: Key/value is intended to be used in a ol/ul only!`);
        const kv_node = key_value(key, value).done();
        return pushRawNode(kv_node, id);
    }
    function done() {
        return $node;
    }
    return builder;
}
function inline_fragment() {
    return create(NodeType.inline_fragment);
}
function block_fragment() {
    return create(NodeType.block_fragment);
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
export { NodeType, create, inline_fragment, block_fragment, heading, span, ordered_list, unordered_list, key_value, };
//# sourceMappingURL=builder.js.map