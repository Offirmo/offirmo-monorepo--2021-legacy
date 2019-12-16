'use strict'

const tiny_singleton = require('../..').default

console.log('starting…', { tiny_singleton })

function create_person(name, logger = console) {
	return {
		name,
		ask_name() {
			return name
		},
	}
}

const get_person = tiny_singleton(() => create_person('Luke', console))

console.assert(get_person().ask_name() === 'Luke')
console.assert(get_person().ask_name() === 'Luke')

// this line should not compile
//get_person().foo


const get_owner = tiny_singleton((name) => create_person(name || 'Luke'))

console.assert(get_owner('Anakin').ask_name() === 'Anakin')
console.assert(get_owner('Luke').ask_name() === 'Anakin')
console.assert(get_owner().ask_name() === 'Anakin')
