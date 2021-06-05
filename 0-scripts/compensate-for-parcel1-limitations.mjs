#!/usr/bin/env zx
// using https://github.com/google/zx
import path from 'node:path'
import { lsDirsSync } from '../3-advanced--node/cli-toolbox/fs/extra.js'

/////////////////////

const MONOREPO_ROOT = path.join(__dirname, '..')
const MONOREPO_PKG_JSON = require(path.join(MONOREPO_ROOT, 'package.json'))

const CURRENT_PKG_PATH = process.cwd()
const CURRENT_PKG_JSON = require(path.join(CURRENT_PKG_PATH, 'package.json'))
//const PKG_NAME = CURRENT_PKG_JSON.name


console.log(`🛠  🔻 tweaking node_modules to compensate for some parcel.js v1 limitations…`)

/////////////////////

const WORKSPACES_PATH = MONOREPO_PKG_JSON.bolt.workspaces.map(p => p.slice(0, -2))
const MONOREPO_MODULE_PATHS = WORKSPACES_PATH.reduce((acc, val) => {
	const module_dirs = lsDirsSync(path.join(MONOREPO_ROOT, val))
	acc.push(...module_dirs)
	return acc
}, [])
const MONOREPO_NAMESPACES = new Set()
const MONOREPO_MODULES = new Set()
MONOREPO_MODULE_PATHS.forEach(monorepo_module_path => {
	const PKG_JSON = require(path.join(monorepo_module_path, 'package.json'))
	const PKG_NAME = PKG_JSON.name
	const split = PKG_NAME.split('/')
	if (split.length > 1) {
		MONOREPO_NAMESPACES.add(split[0])
	}
	MONOREPO_MODULES.add(PKG_NAME)
})
console.log(`🛠  🔸 found a monorepo with ${MONOREPO_MODULES.size} modules across ${MONOREPO_NAMESPACES.size} namespaces (${[...MONOREPO_NAMESPACES.keys()].join(', ')})`)
console.log({
	MONOREPO_ROOT,
	WORKSPACES_PATH,
	MONOREPO_MODULE_PATHS,
	MONOREPO_NAMESPACES,
	MONOREPO_MODULES,
	//PKG_NAME,
	//PKG_NODE_MODULES,
})

/////////////////////

MONOREPO_MODULE_PATHS.forEach(monorepo_module_path => {
	const NODE_MODULES_PATH = path.join(monorepo_module_path, 'node_modules')
	const node_module_basenames = lsDirsSync(NODE_MODULES_PATH, { full_path: false })
	const redundant_basenames = node_module_basenames.filter(d => {
		if (d === '.bin') return false
		if (MONOREPO_NAMESPACES.has(d)) return false
		if (MONOREPO_MODULES.has(d)) return false

		return true
	})
	console.log({
		monorepo_module_path,
		redundant_basenames,
	})
})


/*cd(MONOREPO_ROOT)
await Promise.all([
	// inside own monorepo modules = symlinks
	$`rm -f 1-stdlib/uuid/node_modules/nanoid`,
	$`rm -f 3-advanced--isomorphic/state-utils/node_modules/jsondiffpatch`,
	$`rm -f A-apps--core/the-boring-rpg/state--energy/node_modules/fraction.js`,

	// inside other modules = dir
	$`rm -fr node_modules/browserify-rsa/node_modules/bn.js`,
	$`rm -fr node_modules/browserify-sign/node_modules/bn.js`,
	$`rm -fr node_modules/browserify-sign/node_modules/readable-stream`,
	//$`rm -fr node_modules/hash-base/node_modules/readable-stream`,
])
*/
/*
fraction.js
dequal
*/
