'use strict'

const path = require('path')
const meow = require('meow')
const fs = require('@offirmo/cli-toolbox/fs/extra')

/////////////////////

const cli = meow(`clean`, {
})

/////////////////////

const PKG_PATH = process.cwd()
const DIST_DIR = path.join(PKG_PATH, 'dist')
const DEPS_DIR = path.join(PKG_PATH, 'node_modules')

const PKG_JSON = require(path.join(PKG_PATH, 'package.json'))
const PKG_NAME = PKG_JSON.name

/////////////////////

//console.log({PKG_PATH, DIST_DIR, DEPS_DIR})
console.log(`🔧 Cleaning ${PKG_NAME}...`)


Promise.all([
	cli.input.includes('dist')
		? fs.remove(DIST_DIR)
		: Promise.resolve(true),

	cli.input.includes('deps')
		? fs.remove(DEPS_DIR)
		: Promise.resolve(true),
])
	.then(() => console.log(`🔧 Cleaning ${PKG_NAME} done.`))
