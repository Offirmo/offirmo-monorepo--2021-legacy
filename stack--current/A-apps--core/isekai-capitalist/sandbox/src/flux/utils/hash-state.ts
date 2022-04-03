import create from '@offirmo-private/murmurhash'
import { Immutable } from '@offirmo-private/ts-types'

export function hash_state(state: Immutable<Object>): string {
	const Murmur = create()
	return Murmur.v3.x64.hash_object_to_128(state)
}
