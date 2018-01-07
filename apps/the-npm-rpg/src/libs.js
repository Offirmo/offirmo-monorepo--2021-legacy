"use strict";

// simply rename / clean the APIs

/////////////////////////////////////////////////

const enclose_in_box = require('boxen')

const stylize_string = require('chalk')

const prettyjson = require('prettyjson')
function prettify_json(data, options) {
	return prettyjson.render(data, options)
}

// https://github.com/sindresorhus/indent-string
const indent_string = require('indent-string')

// https://github.com/AnAppAMonth/linewrap
const linewrap = require('linewrap')
function wrap_lines(s, size) {
	return linewrap(size, {skipScheme: 'ansi-color'})(s)
}


// code taken from https://github.com/sindresorhus/clear-cli
// The MIT License (MIT)
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
const ansiEscapes = require('ansi-escapes')
function clear_terminal() {
	process.stdout.write(ansiEscapes.clearScreen)
}

// https://github.com/nexdrew/ansi-align

/////////////////////////////////////////////////

module.exports = {
	enclose_in_box,
	stylize_string,
	indent_string,
	wrap_lines,
	prettify_json,
	clear_terminal,
}
