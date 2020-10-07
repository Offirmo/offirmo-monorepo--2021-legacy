#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
"use strict";

const tsc = require('..')

console.log('TEST: tsc exported =', tsc)

;(async () => {

	try {
		console.log('TEST: ************ 01 ************')
		await tsc.compile({
			'help': true
		})
		console.log('TEST: Promise resolved: OK')
	}
	catch (err) {
		console.log('TEST: PROMISE REJECTED:', err)
	}

	try {
		console.log('TEST: ************ 02 ************')
		await tsc.compile({}, [ 'wrong file path for test' ], { /*verbose: true*/ })
		console.log('TEST: Promise resolved: OK')
	}
	catch (err) {
		console.log('TEST: PROMISE REJECTED:', err)
	}
})()
