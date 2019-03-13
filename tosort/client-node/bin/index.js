#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
'use strict';

// This file is just a wrapper around the bundled JS.
// This allows us to add chmod+x and a shebang
// + some dynamic stuff

// move to the dir where webpack bundled
//console.log(`Current directory: ${process.cwd()}`)
//console.log(`Current file dir: ${__dirname}`)
//console.log(`Current file: ${__filename}`)
process.chdir(require('path').join(__dirname, '..'))

require('../dist/bundled')
