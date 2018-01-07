import { LIB_ID as LIB, SCHEMA_VERSION } from './consts';
import { NodeType, } from './types';
function normalize_node($raw_node) {
    const { $v = 1, $type = NodeType.span, $classes = [], $content = '', $sub = {}, $hints = {}, } = $raw_node;
    // TODO migration
    if ($v !== SCHEMA_VERSION)
        throw new Error(`${LIB}: unknown schema version "${$v}"!`);
    // TODO validation
    const $node = {
        $v,
        $type,
        $classes,
        $content,
        $sub,
        $hints,
    };
    return $node;
}
export { normalize_node, };
//# sourceMappingURL=utils.js.map