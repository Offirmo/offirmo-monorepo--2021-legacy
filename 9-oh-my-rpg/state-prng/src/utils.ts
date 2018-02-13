/////////////////////

import { Random, MT19937 } from '@offirmo/random'

import { MTEngineWithSeed, State } from './types'
import { LIB } from './consts'

/////////////////////

// useful for re-seeding
function generate_random_seed(): number {
	const rng: MTEngineWithSeed = Random.engines.mt19937().autoSeed()
	return Random.integer(-2147483646, 2147483647)(rng) // doc is unclear about allowed bounds...
}

interface RegenerateParams {
	id: string
	generate: () => number | string
	state: State
	max_tries?: number
}
function regenerate_until_not_recently_encountered({
	id,
	generate,
	state,
	max_tries = 10,
}: RegenerateParams) {
	const recently_encountered = state.recently_encountered_by_id[id] || []

	let generated = generate()
	let try_count = 1
	while (recently_encountered.includes(generated) && try_count < max_tries) {
		generated = generate()
		try_count++
	}

	if (try_count >= max_tries)
		throw new Error(`${LIB}: regenerate_until_not_recently_encountered(): failed after maximum tries!`)

	return generated
}

/////////////////////

export {
	generate_random_seed,
	RegenerateParams,
	regenerate_until_not_recently_encountered,
}

/////////////////////
