'use strict'

const tiny_singleton = require('../..').default

console.log('starting...', { tiny_singleton })

function create(name) {
	console.log('Creating instance…', { name })
	return 42
}

const get = tiny_singleton(create, 'hello')

console.log(get())
console.log(get())
