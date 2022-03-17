
import {
	LIB,
	INTERNAL_PROP,
} from './constants'

import {
	createCatcher,
} from './catch-factory'

import {
	isSEC,
	create as create_core,
	setRoot,
	getContext,
} from './core'

function create(...args) {
	const SEC = create_core(...args)

	// TODO offer to hook setTimeout etc.
	//core.

	return SEC
}

const isomorphic = {
	create,
}

export {
	LIB,
	INTERNAL_PROP,
	createCatcher,
	isSEC,
	setRoot,
	getContext,

	isomorphic,
}
