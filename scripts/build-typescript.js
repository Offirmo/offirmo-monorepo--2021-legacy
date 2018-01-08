'use strict'

const path = require('path')
const meow = require('meow')
const tsc = require('../8-tools/node-typescript-compiler')

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
const SRC  = path.join(PKG_PATH, 'src') + '/**/*.ts'

const PKG_JSON = require(path.join(PKG_PATH, 'package.json'))
const PKG_NAME = PKG_JSON.name

//const TSCONFIG_JSON = require(path.join(__dirname, '..', 'meta', 'tsconfig.json'))

/////////////////////

let compilerOptions = {} //TSCONFIG_JSON.compilerOptions

compilerOptions = {
	...compilerOptions,
	//listFiles: true,
	//listEmittedFiles: true,
}

if (cli.flags.watch) {
	cli.flags.dev = true

	compilerOptions = {
		...compilerOptions,
		watch: true,
	}
}

if (cli.flags.dev) {
	compilerOptions = {
		...compilerOptions,
		noUnusedLocals: false,
		noUnusedParameters: false,
	}
}

/////////////////////

//console.log({PKG_PATH, DIST_DIR, PKG_NAME, flags: cli.flags})
console.log(`🔧 building ${PKG_NAME}...`)


function build_compatible() {
	return tsc.compile(
		{
			...compilerOptions,
			module: 'commonjs',
			outDir: path.join(DIST_DIR, 'src.es7.cjs'),
			project: PKG_PATH,
		}
	)
}

function build_jsnext() {
	return tsc.compile(
		{
			...compilerOptions,
			outDir: path.join(DIST_DIR, 'src.es7'),
			project: PKG_PATH,
		}
	)
}

// build sequentially to not duplicate the errors if any.

build_compatible()
	.then(() => {
		if (cli.flags.dev)
			return build_jsnext()
	})
	.then(() => console.log(`🔧 building ${PKG_NAME} done.`))
	/*.catch(err => {
		process.exit(-1)
	})*/
