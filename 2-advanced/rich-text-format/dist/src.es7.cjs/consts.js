"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LIB = '@offirmo/rich-text-format';
exports.LIB = LIB;
const SCHEMA_VERSION = 1;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
const NODE_TYPE_TO_DISPLAY_MODE = {
    // classics inline
    'inline_fragment': 'inline',
    'strong': 'inline',
    'weak': 'inline',
    'em': 'inline',
    // classics block
    'block_fragment': 'block',
    'heading': 'block',
    'hr': 'block',
    'ol': 'block',
    'ul': 'block',
    // special
    'br': 'inline',
    // internally used, don't mind
    'li': 'block',
};
exports.NODE_TYPE_TO_DISPLAY_MODE = NODE_TYPE_TO_DISPLAY_MODE;
//# sourceMappingURL=consts.js.map