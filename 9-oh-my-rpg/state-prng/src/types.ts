/////////////////////

interface State {
	schema_version: number
	revision: number

	// reflect @offirmo/random Mersenne twister state
	seed: number
	use_count: number
}

/////////////////////

export {
	State,
}

/////////////////////
