//import NanoEvents from 'nanoevents'  TODO ?

//import { promiseTry } from '@offirmo/promise-try'
//import { normalizeError } from '@offirmo/normalize-error'

import { LIB, INTERNAL_PROP } from './constants.js'
import { ROOT_PROTOTYPE } from './root-prototype.js'
import * as State from './state.js'
import { PLUGINS } from './plugins/index.js'


ROOT_PROTOTYPE.create_child = function create_child(args) {
	return create_SEC({
		...args,
		parent: this,
	})
}

PLUGINS.forEach(PLUGIN => {
	PLUGIN.augment(ROOT_PROTOTYPE)
})

function is_SEC(SEC) {
	return (SEC && SEC[INTERNAL_PROP])
}

function create_SEC(args = {}) {
	/////// PARAMS ///////

	if (args.parent && !is_SEC(args.parent))
		throw new Error(`${LIB}›create_SEC() argument error: parent must be a valid SEC!`)
	args.parent = args.parent || {}

	let unhandled_args = Object.keys(args)

	//const onError = args.onError || (args.parent && args.parent.onError) // XXX inherit, really?

	let SEC = Object.create(ROOT_PROTOTYPE)

	/////// STATE ///////
	let state = State.create(args.parent[INTERNAL_PROP])
	unhandled_args = unhandled_args.filter(arg => arg !== 'parent')

	PLUGINS.forEach(PLUGIN => {
		state = State.activate_plugin(state, PLUGIN, args)
		//unhandled_args = unhandled_args.filter(arg => !PLUGIN.handled_args.includes(arg))
	})

	SEC[INTERNAL_PROP] = state

	/////// XXX ///////
	// TODO event?
	// TODO lifecycle ?

	//if (SEC.verbose) console.log(`${LIB}: new SEC:`, args)

	if (unhandled_args.length)
		throw new Error(`${LIB}›create_SEC() argument error: unknown args: [${unhandled_args.join(',')}]!`)

	/////////////////////

	return SEC
}

export {
	LIB,
	is_SEC,
	create_SEC,
}
