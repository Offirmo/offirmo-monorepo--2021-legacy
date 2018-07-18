"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LIB = '@offirmo/rich-text-format';
exports.LIB = LIB;
const SCHEMA_VERSION = 1;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
const NODE_TYPE_TO_DISPLAY_MODE = {
    'span': 'inline',
    'strong': 'inline',
    'em': 'inline',
    // display "block"
    'heading': 'block',
    'hr': 'block',
    'ol': 'block',
    'ul': 'block',
    // internally used, don't mind
    'li': 'block',
    // special
    'br': 'inline',
    'fragment': 'inline',
};
exports.NODE_TYPE_TO_DISPLAY_MODE = NODE_TYPE_TO_DISPLAY_MODE;
//# sourceMappingURL=consts.js.map