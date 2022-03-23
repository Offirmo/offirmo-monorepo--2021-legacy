#!/bin/sh
':' //# https://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
'use strict';

import path from 'node:path'

import meow from 'meow'
import stylize_string from 'chalk'
import fs from 'fs-extra'

/*
const stylize_string = require('../3-advanced--node/cli-toolbox/string/stylize')
const fs = require('../3-advanced--node/cli-toolbox/fs/extra')
*/

/////////////////////

const cli = meow('clean', {
})

/////////////////////

const PKG_PATH = process.cwd()

const PKG_JSON = JSON.parse(await fs.readFile(path.join(PKG_PATH, 'package.json')))
const PKG_NAME = PKG_JSON.name

/////////////////////

//console.log({PKG_PATH, DIST_DIR, DEPS_DIR})
console.log('')
console.log(`🔧  🔻 Cleaning ${stylize_string.bold(PKG_NAME)} [${cli.input}]...`)


Promise.all(cli.input
	.map(dir => {
		switch(dir) {

			case '…dist':
				return fs.remove(path.join(PKG_PATH, 'dist'))

			case '…cache':
				return Promise.all([
					fs.remove(path.join(PKG_PATH, '.cache')),
					fs.remove(path.join(PKG_PATH, 'node_modules/.cache')),
					fs.remove(path.join(PKG_PATH, '.parcel')),
				])

			default:
				return fs.remove(path.join(PKG_PATH, dir))
		}
	})
)
	.then(() => console.log(`🔧  🔺 Cleaning ${stylize_string.bold(PKG_NAME)} [${cli.input}] done ✔`))
