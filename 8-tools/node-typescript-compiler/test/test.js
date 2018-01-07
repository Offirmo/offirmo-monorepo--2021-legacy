#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
"use strict";

const tsc = require('..')

console.log(tsc)

tsc.compile({
	'help': true
})
.then(() => console.log('OK'))
.catch(err => {
	console.log('FAILED', err.message, err)
	process.exit(1)
})
