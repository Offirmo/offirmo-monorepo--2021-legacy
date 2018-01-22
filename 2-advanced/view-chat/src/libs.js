"use strict";

// https://github.com/sindresorhus/indent-string
const indent_string_bad = require('indent-string');
function indent_string(msg, indentation, options = {}) {
	let result = indent_string_bad(msg, indentation, options)

	if (!options || !options.indent || options.indent === ' ')
		return result

	const indent_str = Array(indentation).fill(options.indent).join('')
	const lines = result.split('\n')
	return lines
		.map(line => line.startsWith(indent_str) ? line : indent_str + line)
		.join('\n')
}

////////////

module.exports = {
	indent_string,
}
