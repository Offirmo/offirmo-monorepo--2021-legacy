"use strict";

const PromiseWithProgress = require('p-progress')

const stylize_string = require('chalk')

const prettyjson = require('prettyjson')
function prettify_json(data, options) {
	return prettyjson.render(data, options)
}

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

// https://github.com/AnAppAMonth/linewrap
const linewrap = require('linewrap')
function wrap_string(s, size) {
	return linewrap(size, {skipScheme: 'ansi-color'})(s)
}


// https://github.com/sindresorhus/boxen
const boxen = require('boxen')
const enclose_in_box = boxen



// https://github.com/nexdrew/ansi-align


////////////

module.exports = {
	PromiseWithProgress,
	stylize_string,
	prettify_json,
	indent_string,
	wrap_string,
	enclose_in_box,
}
