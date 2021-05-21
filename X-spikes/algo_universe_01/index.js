#!/usr/bin/env node
'use strict';

// https://dev.to/burningion/a-universe-in-one-line-of-code-with-10-print-2d1
// https://jrgraphix.net/r/Unicode/2500-257F
function generate_universe(length = 280) {
	let values = []
	for(let i = 0; i < length; ++i)
		values.push(Math.round(Math.random()) === 0 ? '╱' : '╲')
	//return String.fromCharCode(...values)
	return values.join('')
}

console.log(generate_universe(1000))
