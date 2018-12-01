import * as tslib_1 from "tslib";
import prettyjson from 'prettyjson';
import indent_string from './indent-string';
function prettify_json(data, options = {}) {
    if (!data)
        return String(data);
    let { outline } = options, prettyjson_options = tslib_1.__rest(options, ["outline"]);
    prettyjson_options = Object.assign({}, prettyjson_options);
    const result = prettyjson.render(data, prettyjson_options);
    if (outline) {
        return '\n{{{{{{{'
            + indent_string('\n' + result, 1, { indent: '	' })
            + '\n}}}}}}}';
    }
    return result;
}
function dump_pretty_json(msg, data, options) {
    console.log(msg);
    console.log(prettify_json(data, options));
}
export default prettify_json;
export { prettify_json, dump_pretty_json, };
//# sourceMappingURL=index.js.map