"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const prettyjson_1 = tslib_1.__importDefault(require("prettyjson"));
const indent_string_1 = tslib_1.__importDefault(require("./indent-string"));
function prettify_json(data, options = {}) {
    if (!data)
        return String(data);
    let { outline } = options, prettyjson_options = tslib_1.__rest(options, ["outline"]);
    prettyjson_options = Object.assign({}, prettyjson_options);
    const result = prettyjson_1.default.render(data, prettyjson_options);
    if (outline) {
        return '\n{{{{{{{'
            + indent_string_1.default('\n' + result, 1, { indent: '	' })
            + '\n}}}}}}}';
    }
    return result;
}
function dump_pretty_json(name, data, options) {
}
exports.default = prettify_json;
//# sourceMappingURL=index.js.map