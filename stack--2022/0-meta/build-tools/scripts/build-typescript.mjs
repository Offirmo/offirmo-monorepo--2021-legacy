#!/bin/sh
':' //# https://sambal.org/?p=1014 ; exec /usr/bin/env node --experimental-import-meta-resolve "$0" "$@"
'use strict';

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { promises as fs } from 'node:fs'

import meow from 'meow'
import stylize_string from 'chalk'
import assert from 'tiny-invariant'

import tsc from 'node-typescript-compiler'

/////////////////////

const cli = meow('build', {
	importMeta: import.meta,
	flags: {
		onlyNode: {
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

// [Last updated TODO](update marker)
const LATEST_CONVENIENT_ES = 'ES2021' // convenient = works with most tools, such as webpack
const LATEST_ES_OLDEST_ACTIVE_NODE_LTS = 'ES2021' // should be <= LATEST_CONVENIENT_ES
const LATEST_ES_MODULES = 'ES2020'

/////////////////////

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PKG_PATH = process.cwd()
const DIST_DIR = path.join(PKG_PATH, 'dist')
const PKG_JSON = JSON.parse(await fs.readFile(path.join(PKG_PATH, 'package.json')))
const PKG_NAME = PKG_JSON.name
console.log(`🛠  🔻 building ${stylize_string.bold(PKG_NAME)}…` + (cli.flags.watch ? ' (watch mode)' : ''))

const LOCAL_TSCONFIG_JSON = JSON.parse(await fs.readFile(path.join(PKG_PATH, 'tsconfig.json')))
LOCAL_TSCONFIG_JSON.compilerOptions = LOCAL_TSCONFIG_JSON.compilerOptions || {}
assert(!LOCAL_TSCONFIG_JSON.compilerOptions.target, 'local tsconfig should not override "target"')
assert(!LOCAL_TSCONFIG_JSON.compilerOptions.module, 'local tsconfig should not override "module"')

const ROOT_TSCONFIG_JSON = JSON.parse(await fs.readFile(path.join(__dirname, '..', '..', 'tsconfig.json')))
assert(ROOT_TSCONFIG_JSON.compilerOptions.target === LATEST_CONVENIENT_ES, 'root tsconfig and this script should be in sync: target')
assert(ROOT_TSCONFIG_JSON.compilerOptions.lib.includes(LATEST_CONVENIENT_ES), 'root tsconfig and this script should be in sync: lib')
assert(ROOT_TSCONFIG_JSON.compilerOptions.module === LATEST_ES_MODULES, 'root tsconfig and this script should be in sync: module')

/////////////////////

let compilerOptions = {
	// no need, automatically picked from closest tsconfig.json
	//...ROOT_TSCONFIG_JSON.compilerOptions

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
		allowUnreachableCode: true,
		"jsx": "react-jsxdev",
	}
}

/////////////////////

function build_convenience_prebuilt() {
	const target = LATEST_ES_OLDEST_ACTIVE_NODE_LTS.toLowerCase()
	const out_dir = `src.${target}.cjs`
	console.log(`      building ${PKG_NAME}/dist/${stylize_string.bold(out_dir)}`/*, ROOT_TSCONFIG_JSON, LOCAL_TSCONFIG_JSON*/)
	return tsc.compile(
		{
			...compilerOptions,
			target,
			lib: [
				LATEST_ES_OLDEST_ACTIVE_NODE_LTS,
				...[
					...ROOT_TSCONFIG_JSON.compilerOptions.lib,
					...(LOCAL_TSCONFIG_JSON.compilerOptions.lib || []),
				].filter(s => s !== LATEST_CONVENIENT_ES),
			],
			module: 'commonjs',
			outDir: path.join(DIST_DIR, out_dir),
			project: PKG_PATH,
		},
		null,
		{
			banner: `(from build-typescript.js) node-typescript-compiler compiling ${PKG_NAME} to dist/${out_dir}...`
		},
	)
}

function build_latest_es() {
	const target = ROOT_TSCONFIG_JSON.compilerOptions.target.toLowerCase()
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
			banner: `(from build-typescript.js) node-typescript-compiler compiling ${PKG_NAME} to dist/${out_dir}...`
		},
	)
}

/////////////////////

//console.log({PKG_PATH, DIST_DIR, PKG_NAME, flags: cli.flags})

// build sequentially to not duplicate the errors if any.
// CJS is usable in both node and bundled frontend,
// thus we build only this one in watch = dev mode.
Promise.resolve()
	.then(() => {
		return build_convenience_prebuilt()
	})
	.then(() => {
		if (cli.flags.watch) return
		if (cli.flags.onlyNode) return

		return build_latest_es()
	})
	.then(() => console.log(`🛠  🔺 building ${stylize_string.bold(PKG_NAME)} done ✔`))
	/*.catch(err => {
		process.exit(-1)
	})*/
