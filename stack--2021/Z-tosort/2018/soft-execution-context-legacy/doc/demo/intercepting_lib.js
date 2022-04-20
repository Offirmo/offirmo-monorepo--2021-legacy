"use strict";

const good_lib = require('./good_lib').create()

function foo_sync() {
	return good_lib.foo_sync()
}

async function foo_async() {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(good_lib.foo_async()), 100)
	})
}

module.exports = {
	foo_sync,
	foo_async,
}
