const ansiEscapes = require('ansi-escapes')

// code taken from https://github.com/sindresorhus/clear-cli
// The MIT License (MIT)
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

module.exports = function clearCli() {
	process.stdout.write(ansiEscapes.clearScreen)
}
