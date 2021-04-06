import create from '@offirmo-private/murmurhash'

import {
	State,
} from '@tbrpg/state'


function hash_state(state: State): string {
	const Murmur = create()
	return Murmur.v3.x64.hash_object_to_128(state)
}

export {
	hash_state,
}
