"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LIB = '@offirmo/rich-text-format';
exports.LIB = LIB;
const SCHEMA_VERSION = 1;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
const NODE_TYPE_TO_DISPLAY_MODE = {
    // classics inline
    'span': 'inline',
    'strong': 'inline',
    'em': 'inline',
    // classics block
    'heading': 'block',
    'hr': 'block',
    'ol': 'block',
    'ul': 'block',
    // special
    'br': 'inline',
    'inline_fragment': 'inline',
    'block_fragment': 'block',
    // internally used, don't mind
    'li': 'block',
};
exports.NODE_TYPE_TO_DISPLAY_MODE = NODE_TYPE_TO_DISPLAY_MODE;
//# sourceMappingURL=consts.js.map