const path = require('path')
const meow = require('meow')
const fs = require('@offirmo/cli-toolbox/fs/extra')

/////////////////////

const cli = meow(`build`, {
	flags: {
		watch: {
			type: 'boolean',
			default: false,
		},
		dev: {
			type: 'boolean',
			default: false,
		},
	},
})

/////////////////////

const PKG_PATH = process.cwd()
const DIST_DIR = path.join(PKG_PATH, 'dist')
const DEPS_DIR = path.join(PKG_PATH, 'node_modules')



console.log({PKG_PATH, DIST_DIR, DEPS_DIR, flags: cli.flags})
console.log('TODO CLEAN!')

//const dirs = fs.lsDirs(__dirname + '/../..')
