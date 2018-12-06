'use strict'

const path = require('path')
const stylize_string = require('chalk')
const meow = require('meow')
const fs = require('@offirmo/cli-toolbox/fs/extra')

/////////////////////

const cli = meow(`clean`, {
})

/////////////////////

const PKG_PATH = process.cwd()

const PKG_JSON = require(path.join(PKG_PATH, 'package.json'))
const PKG_NAME = PKG_JSON.name

/////////////////////

//console.log({PKG_PATH, DIST_DIR, DEPS_DIR})
console.log(`🔧  Cleaning ${stylize_string.bold(PKG_NAME)} [${cli.input}]...`)


Promise.all([
	cli.input.includes('dist')
		? fs.remove(path.join(PKG_PATH, 'dist'))
		: Promise.resolve(true),

	cli.input.includes('deps')
		? fs.remove(path.join(PKG_PATH, 'node_modules'))
		: Promise.resolve(true),

	cli.input.includes('cache')
		? Promise.all([
			fs.remove(path.join(PKG_PATH, '.cache')),
			fs.remove(path.join(PKG_PATH, '.parcel')),
		])
		: Promise.resolve(true),
])
	.then(() => console.log(`🔧 Cleaning ${PKG_NAME} [${cli.input}] done.`))
