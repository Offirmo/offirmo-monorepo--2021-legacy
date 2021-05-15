#!/usr/bin/env zx
// using https://github.com/google/zx
import path from 'node:path'

/////////////////////

const MONOREPO_ROOT = path.join(__dirname, '..')

const PKG_PATH = process.cwd()
const PKG_NODE_MODULES = path.join(PKG_PATH, 'node_modules')
const PKG_JSON = require(path.join(PKG_PATH, 'package.json'))
const PKG_NAME = PKG_JSON.name

console.log(`🛠  🔻 tweaking node_modules to compensate for some parcel.js v1 limitations…`)

/////////////////////

/*console.log({
	MONOREPO_ROOT,
	PKG_PATH,
	PKG_NAME,
	PKG_NODE_MODULES,
})*/

/////////////////////

cd(MONOREPO_ROOT)

await Promise.all([
	// inside own monorepo modules = symlinks
	$`rm -f 1-stdlib/uuid/node_modules/nanoid`,
	$`rm -f 3-advanced--isomorphic/state-utils/node_modules/jsondiffpatch`,
	$`rm -f A-apps--core/the-boring-rpg/state--energy/node_modules/fraction.js`,

	// inside other modules = dir
	$`rm -fr node_modules/browserify-rsa/node_modules/bn.js`,
	$`rm -fr node_modules/browserify-sign/node_modules/bn.js`,
	$`rm -fr node_modules/browserify-sign/node_modules/readable-stream`,
	$`rm -fr node_modules/hash-base/node_modules/readable-stream`,
])

/*
fraction.js
dequal
*/
