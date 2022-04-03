import create from '@offirmo-private/murmurhash'

export function hash_state<State>(state: State): string {
	const Murmur = create()
	return Murmur.v3.x64.hash_object_to_128(state)
}
