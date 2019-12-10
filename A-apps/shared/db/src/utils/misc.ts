import stable_stringify from 'json-stable-stringify'

export function deep_equals<T>(a: Readonly<T>, b: Readonly<T>): boolean {
	return stable_stringify(a) === stable_stringify(b)
}
