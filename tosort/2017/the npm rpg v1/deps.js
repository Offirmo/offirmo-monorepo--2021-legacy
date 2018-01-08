const prettyjson = require('prettyjson')
const boxify = require('boxen')
const stylizeString = require('chalk')
const wrapLines = require('linewrap')
const ansiEscapes = require('ansi-escapes')

/////////////////////////////////////////////////

// simply rename / clean the APIs

module.exports = {
	boxify,
	stylizeString,
	wrapLines,
	prettifyJson(data, options) {
		return prettyjson.render(data, options)
	},
	// code taken from https://github.com/sindresorhus/clear-cli
	// The MIT License (MIT)
	// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
	clearCli() {
		process.stdout.write(ansiEscapes.clearScreen)
	},
}
