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
	try {
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
	catch (err) {
		if (err.code === 'ENOENT') return []
		throw err
	}
}

/////////////////////

const WHITELIST = [
	'@offirmo/unit-test-toolbox',
].sort()

const MONOREPO_ROOT = path.join(__dirname, '..')
const MONOREPO_PKG_JSON = require(path.join(MONOREPO_ROOT, 'package.json'))

const CURRENT_PKG_PATH = process.cwd()
const CURRENT_PKG_JSON = require(path.join(CURRENT_PKG_PATH, 'package.json'))

const MONOREPO_WORKSPACE_RELPATHS = MONOREPO_PKG_JSON.bolt.workspaces.map(p => p.slice(0, -2))
const MONOREPO_SRCPKG_ABSPATHS = MONOREPO_WORKSPACE_RELPATHS.reduce((acc, val) => {
	const module_dirs = lsDirsSync(path.join(MONOREPO_ROOT, val))
	acc.push(...module_dirs)
	return acc
}, []).sort()
const MONOREPO_SRCPKG_NAMESPACES = new Set()
let MONOREPO_SRCPKG_NAMES = new Set()
const MONOREPO_SRCPKG_ABSPATHS_BY_PKG_NAME = {}
MONOREPO_SRCPKG_ABSPATHS.forEach(monorepo_pkg_path => {
	const PKG_JSON = require(path.join(monorepo_pkg_path, 'package.json'))
	const PKG_NAME = PKG_JSON.name
	const split = PKG_NAME.split('/')
	if (split.length > 1) {
		MONOREPO_SRCPKG_NAMESPACES.add(split[0])
	}
	MONOREPO_SRCPKG_ABSPATHS_BY_PKG_NAME[PKG_NAME] = monorepo_pkg_path
	MONOREPO_SRCPKG_NAMES.add(PKG_NAME)
})

// "sort" the set
MONOREPO_SRCPKG_NAMES = new Set([...MONOREPO_SRCPKG_NAMES].sort())

/*
console.log({
	MONOREPO_ROOT,
	MONOREPO_WORKSPACE_RELPATHS,
	MONOREPO_SRCPKG_NAMESPACES,
	MONOREPO_SRCPKG_NAMES,
	//MONOREPO_SRCPKG_ABSPATHS,
	MONOREPO_SRCPKG_ABSPATHS_BY_PKG_NAME,
})*/

console.log(`🛠  🔸 found a monorepo with ${MONOREPO_SRCPKG_NAMES.size} modules across ${MONOREPO_SRCPKG_NAMESPACES.size} namespaces: ${[...MONOREPO_SRCPKG_NAMESPACES.keys()].join(', ')}`)
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

	MONOREPO_SRCPKG_NAMESPACES.forEach(ns => {
		const ns_abspath = path.join(MONOREPO_ROOT, 'node_modules', ns)
		try {
			fs.mkdirSync(ns_abspath)
			//console.log('created dir: ' + ns_abspath)
		}
		catch (err) { if (err.code !== 'EEXIST') throw err }
	})

	Array.from(MONOREPO_SRCPKG_NAMES).forEach(pkg_name => {
		const pkg_src_abspath = MONOREPO_SRCPKG_ABSPATHS_BY_PKG_NAME[pkg_name]
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

const MONOREPO_1ST_LEVEL_DEPS‿RELPATH = get_pkg_1st_level_dependencies_relpaths(MONOREPO_ROOT)
const CURRENT_PKG_1ST_LEVEL_DEPS‿RELPATH = get_pkg_1st_level_dependencies_relpaths(CURRENT_PKG_PATH)

//console.log(JSON.stringify(MONOREPO_1ST_LEVEL_DEPS‿RELPATH))
/*
const PARENT_DEPS_RELPATH = CURRENT_PKG_JSON.name === MONOREPO_PKG_JSON.name
	? MONOREPO_1ST_LEVEL_DEPS‿RELPATH
	: CURRENT_PKG_1ST_LEVEL_DEPS‿RELPATH
*/

MONOREPO_1ST_LEVEL_DEPS‿RELPATH.forEach(relpath1 => {
	//console.log('reviewing deps of ' + relpath1 + '…')

	const module1_abspath = path.join(MONOREPO_ROOT, 'node_modules', relpath1)
	const second_level_deps‿relpath = get_pkg_1st_level_dependencies_relpaths(module1_abspath)

	const redundant_dependencies‿relpaths = second_level_deps‿relpath.filter(relpath2 => {

		if (!MONOREPO_1ST_LEVEL_DEPS‿RELPATH.includes(relpath2)) return false // obviously

		// NON nodejs
		// CSS
		if (relpath2.endsWith('.css') || relpath2.endsWith('-css')) return false
		// HTML
		if (relpath2.includes('iframe--')) return false

		// Special cases, ex. test tools
		if (relpath2 === '.bin' || relpath2 === '.cache') return false
		if (WHITELIST.includes(relpath2)) return false

		// now we have a candidate...
		// is it the same version?
		const is_same_version = (() => {
			//console.log('  HERE', relpath1, relpath2, MONOREPO_SRCPKG_NAMES.has(relpath2))
			if (MONOREPO_SRCPKG_NAMES.has(relpath1)) return true // obviously

			// TODO
			if ([ 'bn.js', 'readable-stream'].includes(relpath2)) return true
			// we assume false for now
			return false
		})()

		//if (!is_same_version) console.log('  TODO compare version of ' + relpath2)

		return is_same_version
	})

	/*console.log({
		module1_abspath,
		second_level_deps‿relpath,
		redundant_dependencies‿relpaths,
	})*/

	redundant_dependencies‿relpaths.forEach(relpath => {
		const abspath = path.join(module1_abspath, 'node_modules', relpath)
		if (MONOREPO_SRCPKG_NAMES.has(relpath1)) {
			fs.unlinkSync(abspath)
			console.log('From ' + module1_abspath + ', Unlinked ' + abspath)
		} else {
			// TODO true rm
			console.log('TODO From ' + module1_abspath + ', delete ' + abspath)
		}
		stats.cleaned_redundant_deps++
	})
})

cd(MONOREPO_ROOT)
await Promise.all([
	// TODO should be automated
	$`rm -fr node_modules/browserify-rsa/node_modules/bn.js`,
	$`rm -fr node_modules/browserify-sign/node_modules/bn.js`,
	$`rm -fr node_modules/browserify-sign/node_modules/readable-stream`,
])

console.log(stats)
console.log(`🛠  🔺 tweaked node_modules to compensate for some parcel.js v1 limitations ✔`)
