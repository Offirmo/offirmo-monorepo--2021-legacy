'use strict'

const path = require('path')
const stylize_string = require('chalk')
const meow = require('meow')
const tsc = require('../3-tools/node-typescript-compiler')

/////////////////////

const cli = meow('build', {
	flags: {
		alsoLegacy: {
			type: 'boolean',
			default: false,
		},
		watch: {
			type: 'boolean',
			default: false,
		},
	},
})

/////////////////////

const PKG_PATH = process.cwd()
const DIST_DIR = path.join(PKG_PATH, 'dist')
const PKG_JSON = require(path.join(PKG_PATH, 'package.json'))
const PKG_NAME = PKG_JSON.name

const TSCONFIG_JSON = require(path.join(__dirname, '..', 'meta', 'tsconfig.json'))
const target = TSCONFIG_JSON.compilerOptions.target.toLowerCase()

/////////////////////

let compilerOptions = {
	// no need, automatically picked from closest tsconfig.json
	//...TSCONFIG_JSON.compilerOptions

	//listFiles: true,
	//listEmittedFiles: true,
}

if (cli.flags.watch) {
	compilerOptions = {
		...compilerOptions,

		watch: true,

		// it's dev mode, relax a bit:
		noUnusedLocals: false,
		noUnusedParameters: false,
	}
}

/////////////////////

function build_legacy() {
	const target = 'es5'
	const out_dir = `src.${target}.cjs`
	console.log(`      building ${PKG_NAME}/dist/${stylize_string.bold(out_dir)}`)
	return tsc.compile(
		{
			...compilerOptions,
			target,
			module: 'commonjs',
			outDir: path.join(DIST_DIR, out_dir),
			project: PKG_PATH,
		},
		null,
		{
			banner: `node-typescript-compiler compiling ${PKG_NAME} to ./${out_dir}...`
		},
	)
}

function build_cjs() {
	const out_dir = `src.${target}.cjs`
	console.log(`      building ${PKG_NAME}/dist/${stylize_string.bold(out_dir)}`)
	return tsc.compile(
		{
			...compilerOptions,
			module: 'commonjs',
			outDir: path.join(DIST_DIR, out_dir),
			project: PKG_PATH,
		},
		null,
		{
			banner: `node-typescript-compiler compiling ${PKG_NAME} to ./${out_dir}...`
		},
	)
}

function build_esnext() {
	const out_dir = `src.${target}`
	console.log(`      building ${PKG_NAME}/dist/${stylize_string.bold(out_dir)}`)
	return tsc.compile(
		{
			...compilerOptions,
			outDir: path.join(DIST_DIR, out_dir),
			project: PKG_PATH,
		},
		null,
		{
			banner: `node-typescript-compiler compiling ${PKG_NAME} to ./${out_dir}...`
		},
	)
}

/////////////////////

//console.log({PKG_PATH, DIST_DIR, PKG_NAME, flags: cli.flags})
console.log(`🛠  🔻 building ${stylize_string.bold(PKG_NAME)}...` + (cli.flags.watch ? ' (watch mode)' : ''))

// build sequentially to not duplicate the errors if any.
// CJS is usable in both node and bundled frontend,
// thus we build only this one in watch = dev mode.
build_cjs()
	.then(() => {
		if (cli.flags.watch) return
		if (!cli.flags.alsoLegacy) return

		return build_legacy()
	})
	.then(() => {
		if (cli.flags.watch) return

		return build_esnext()
	})
	.then(() => console.log(`🛠  🔺 building ${stylize_string.bold(PKG_NAME)} done ✔`))
	/*.catch(err => {
		process.exit(-1)
	})*/
