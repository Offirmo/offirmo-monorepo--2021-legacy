
import { create_SEC } from './core.js'

/////////////////////

let root_SEC = null

function get_root_SEC() {
	if (!root_SEC) {
		root_SEC = create_SEC()
		// TODO init plugins!!
	}

	return root_SEC
}

/////////////////////

export {
	get_root_SEC,
}
