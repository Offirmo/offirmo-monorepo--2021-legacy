
import { createSEC } from './core'

/////////////////////

let root_SEC = null

function getRootSEC() {
	if (!root_SEC) {
		root_SEC = createSEC()
	}

	return root_SEC
}

/////////////////////

export {
	getRootSEC,
}
