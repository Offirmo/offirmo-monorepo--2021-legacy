const path = require('path')
const meow = require('meow')
const tsc = require('node-typescript-compiler')

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

const TSCONFIG_JSON = require(path.join(__dirname, '..', 'meta', 'tsconfig.json'))

const PKG_PATH = process.cwd()
const DIST_DIR = path.join(PKG_PATH, 'dist')
const SRC  = path.join(PKG_PATH, 'src') + '/**/*.ts'

const PKG_JSON = require(path.join(PKG_PATH, 'package.json'))
const PKG_NAME = PKG_JSON.name

/////////////////////

let compilerOptions = TSCONFIG_JSON.compilerOptions

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

if (!cli.flags.dev) {
	tsc.compile(
		{
			...compilerOptions,
			outDir: path.join(DIST_DIR, 'src.es7'),
			project: PKG_PATH,
		}
	)
}

tsc.compile(
	{
		...compilerOptions,
		module: 'commonjs',
		outDir: path.join(DIST_DIR, 'src.es7.cjs'),
		project: PKG_PATH,
	}
)
