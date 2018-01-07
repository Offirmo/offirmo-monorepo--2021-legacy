"use strict";

const {
	prettify_json,
	indent_string,
} = require('./libs')


function prettify_params_for_debug() {
	return indent_string(
		prettify_json.apply(null, arguments),
		1,
		{indent: '	'}
	)
}

// http://stackoverflow.com/a/1917041/587407
function get_shared_start(strs) {
	if (strs.length <= 1) return ''

	const A = strs.concat().sort()
	const a1 = A[0]
	const a2 = A[A.length - 1]
	const L = a1.length

	let i = 0
	while (i < L && a1.charAt(i) === a2.charAt(i)) { i++ }

	return a1.substring(0, i)
}


module.exports = {
	prettify_params_for_debug,
	get_shared_start,
}
