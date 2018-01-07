"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const types_1 = require("./types");
function normalize_node($raw_node) {
    const { $v = 1, $type = types_1.NodeType.span, $classes = [], $content = '', $sub = {}, $hints = {}, } = $raw_node;
    // TODO migration
    if ($v !== consts_1.SCHEMA_VERSION)
        throw new Error(`${consts_1.LIB_ID}: unknown schema version "${$v}"!`);
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
exports.normalize_node = normalize_node;
//# sourceMappingURL=utils.js.map