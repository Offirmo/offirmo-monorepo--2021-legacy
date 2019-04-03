// https://cimi.io/murmurhash3js-revisited/
import MurmurHash3 from 'murmurhash3js-revisited'
import stable_stringify from 'json-stable-stringify'


function create(TextEncoder: any) {
	return {
		v3: {
			x64: {
				hash_string_to_128(str: string): string {
					const bytes = new TextEncoder().encode(str)
					return MurmurHash3.x64.hash128(bytes)
				},
				hash_object_to_128(o: Object): string {
					const str = stable_stringify(o)
					const bytes = new TextEncoder().encode(str)
					return MurmurHash3.x64.hash128(bytes)
				}
			}
		}
	}
}

export default create
export {
	create,
	MurmurHash3,
}
