// https://github.com/sindresorhus/indent-string
import indent_string_bad from 'indent-string';
// improved version but don't remember what was improved :-}
function indent_string(msg, indentation, options = {}) {
    let result = indent_string_bad(msg, indentation, options);
    if (!options || !options.indent || options.indent === ' ')
        return result;
    const indent_str = Array(indentation).fill(options.indent).join('');
    const lines = result.split('\n');
    return lines
        .map((line) => line.startsWith(indent_str) ? line : indent_str + line)
        .join('\n');
}
////////////
export default indent_string;
//# sourceMappingURL=indent-string.js.map