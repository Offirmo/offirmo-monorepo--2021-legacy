#!/usr/bin/env zx
// using https://github.com/google/zx
import path from 'node:path'
import fs from 'node:fs'
import { lsDirsSync } from '../3-advanced--node/cli-toolbox/fs/extra.js'

/////////////////////

console.log(`🛠  🔻 tweaking node_modules to compensate for some parcel.js v1 limitations…`)

/////////////////////

function get_pkg_1st_level_dependencies_relpaths(pkg_abs_path) {
	const NODE_MODULES_PATH = path.join(pkg_abs_path, 'node_modules')
	const node_module_children_basenames = lsDirsSync(NODE_MODULES_PATH, { full_path: false })
	return node_module_children_basenames.reduce((acc, basename) => {
		if (basename === '.bin' || basename === '.cache') return acc

		return acc.concat(
			basename.startsWith('@')
			? lsDirsSync(path.join(NODE_MODULES_PATH, basename), { full_path: false }).map(b => path.join(basename, b))
			: [basename]
		)
	}, [])
}

/////////////////////

const WHITELIST = [
	'@offirmo/unit-test-toolbox',
]

const MONOREPO_ROOT = path.join(__dirname, '..')
const MONOREPO_PKG_JSON = require(path.join(MONOREPO_ROOT, 'package.json'))

const CURRENT_PKG_PATH = process.cwd()
const CURRENT_PKG_JSON = require(path.join(CURRENT_PKG_PATH, 'package.json'))

const MONOREPO_WORKSPACE_RELPATHS = MONOREPO_PKG_JSON.bolt.workspaces.map(p => p.slice(0, -2))
const MONOREPO_PKG_SRC_ABSPATHS = MONOREPO_WORKSPACE_RELPATHS.reduce((acc, val) => {
	const module_dirs = lsDirsSync(path.join(MONOREPO_ROOT, val))
	acc.push(...module_dirs)
	return acc
}, [])
const MONOREPO_PKG_NAMESPACES = new Set()
const MONOREPO_PKG_NAMES = new Set()
const MONOREPO_PKG_SRC_ABSPATHS_BY_PKG_NAME = {}
MONOREPO_PKG_SRC_ABSPATHS.forEach(monorepo_module_path => {
	const PKG_JSON = require(path.join(monorepo_module_path, 'package.json'))
	const PKG_NAME = PKG_JSON.name
	const split = PKG_NAME.split('/')
	if (split.length > 1) {
		MONOREPO_PKG_NAMESPACES.add(split[0])
	}
	MONOREPO_PKG_SRC_ABSPATHS_BY_PKG_NAME[PKG_NAME] = monorepo_module_path
	MONOREPO_PKG_NAMES.add(PKG_NAME)
})

/*console.log({
	MONOREPO_ROOT,
	MONOREPO_WORKSPACE_RELPATHS,
	MONOREPO_PKG_NAMESPACES,
	//MONOREPO_PKG_NAMES,
	//MONOREPO_PKG_SRC_ABSPATHS,
	MONOREPO_PKG_SRC_ABSPATHS_BY_PKG_NAME,
//	MONOREPO_1ST_LEVEL_DEPS_RELPATH,
})*/

console.log(`🛠  🔸 found a monorepo with ${MONOREPO_PKG_NAMES.size} modules across ${MONOREPO_PKG_NAMESPACES.size} namespaces: ${[...MONOREPO_PKG_NAMESPACES.keys()].join(', ')}`)
if (CURRENT_PKG_JSON.name === MONOREPO_PKG_JSON.name) {
	console.log(`🛠  🔸 called from: the monorepo root. Optimizing monorepo node_modules…`)
}
else {
	console.log(`🛠  🔸 called from module "${CURRENT_PKG_JSON.name}". Optimizing its node_modules specifically…`)
	throw new Error('NIMP')
}

/////////////////////

const stats = {
	cleaned_redundant_deps: 0,
	symlinked_deps: 0,
}

/////////////////////
// hoist all monorepo modules at the root

if (CURRENT_PKG_JSON.name === MONOREPO_PKG_JSON.name) {

	MONOREPO_PKG_NAMESPACES.forEach(ns => {
		const ns_abspath = path.join(MONOREPO_ROOT, 'node_modules', ns)
		try {
			fs.mkdirSync(ns_abspath)
			//console.log('created dir: ' + ns_abspath)
		}
		catch (err) { if (err.code !== 'EEXIST') throw err }
	})

	Array.from(MONOREPO_PKG_NAMES).forEach(pkg_name => {
		const pkg_src_abspath = MONOREPO_PKG_SRC_ABSPATHS_BY_PKG_NAME[pkg_name]
		const link_path = path.join(MONOREPO_ROOT, 'node_modules', pkg_name)
		try {
			fs.symlinkSync(pkg_src_abspath, link_path)
			//console.log('linked: ' + link_path + ' ← ' + pkg_src_abspath)
			stats.symlinked_deps++
		}
		catch (err) { if (err.code !== 'EEXIST') throw err }
	})
}

/////////////////////

const MONOREPO_1ST_LEVEL_DEPS_RELPATH = get_pkg_1st_level_dependencies_relpaths(MONOREPO_ROOT)
const CURRENT_PKG_1ST_LEVEL_DEPS_RELPATH = get_pkg_1st_level_dependencies_relpaths(CURRENT_PKG_PATH)

const PARENT_DEPS_RELPATH = CURRENT_PKG_JSON.name === MONOREPO_PKG_JSON.name
	? MONOREPO_1ST_LEVEL_DEPS_RELPATH
	: CURRENT_PKG_1ST_LEVEL_DEPS_RELPATH

// XXX TODO ALL modules, not just monorepo ones
MONOREPO_PKG_SRC_ABSPATHS.forEach(monorepo_module_path => {
	const first_level_dependencies_relpath = get_pkg_1st_level_dependencies_relpaths(monorepo_module_path)

	const redundant_dependencies_relpaths = first_level_dependencies_relpath.filter(relpath => {

		// NON nodejs
		// CSS
		if (relpath.endsWith('.css') || relpath.endsWith('-css')) return false
		// HTML
		if (relpath.includes('iframe--')) return false

		// Special cases, ex. test tools
		if (relpath === '.bin' || relpath === '.cache') return false
		if (WHITELIST.includes(relpath)) return false

		return PARENT_DEPS_RELPATH.includes(relpath)
		//if (MONOREPO_PKG_NAMES.has(relpath)) return false
		//return true
	})

	/*console.log({
		monorepo_module_path,
		first_level_dependencies_relpath,
		redundant_dependencies_relpaths,
	})*/

	redundant_dependencies_relpaths.forEach(relpath => {
		const abspath = path.join(monorepo_module_path, 'node_modules', relpath)
		fs.unlinkSync(abspath)
		stats.cleaned_redundant_deps++
		//console.log('From ' + monorepo_module_path + ', Unlinked ' + abspath)
	})
})

/*
cd(MONOREPO_ROOT)
await Promise.all([
	// inside own monorepo modules = symlinks
	$`rm -f 1-stdlib/uuid/node_modules/nanoid`,
	//$`rm -f 3-advanced--isomorphic/state-utils/node_modules/jsondiffpatch`,
	//$`rm -f A-apps--core/the-boring-rpg/state--energy/node_modules/fraction.js`,

	// inside other modules = dir
	$`rm -fr node_modules/browserify-rsa/node_modules/bn.js`,
	$`rm -fr node_modules/browserify-sign/node_modules/bn.js`,
	$`rm -fr node_modules/browserify-sign/node_modules/readable-stream`,
	//$`rm -fr node_modules/hash-base/node_modules/readable-stream`,
])*/
/*
fraction.js
dequal
*/

console.log(stats)
console.log(`🛠  🔺 tweaked node_modules to compensate for some parcel.js v1 limitations ✔`)
