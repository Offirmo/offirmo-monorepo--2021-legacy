const LIB = '@offirmo/rich-text-format';
const SCHEMA_VERSION = 1;
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
    'inline_fragment': 'inline',
    'block_fragment': 'block',
};
export { LIB, SCHEMA_VERSION, NODE_TYPE_TO_DISPLAY_MODE, };
//# sourceMappingURL=consts.js.map