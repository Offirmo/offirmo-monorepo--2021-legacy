"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// https://github.com/sindresorhus/indent-string
const indent_string_1 = tslib_1.__importDefault(require("indent-string"));
// improved version but don't remember what was improved :-}
function indent_string(msg, indentation, options = {}) {
    let result = indent_string_1.default(msg, indentation, options);
    if (!options || !options.indent || options.indent === ' ')
        return result;
    const indent_str = Array(indentation).fill(options.indent).join('');
    const lines = result.split('\n');
    return lines
        .map((line) => line.startsWith(indent_str) ? line : indent_str + line)
        .join('\n');
}
////////////
exports.default = indent_string;
//# sourceMappingURL=indent-string.js.map