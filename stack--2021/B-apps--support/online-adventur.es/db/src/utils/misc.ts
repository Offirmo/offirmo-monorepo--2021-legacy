import stable_stringify from 'json-stable-stringify'

import { Immutable } from '@offirmo-private/ts-types'


export function deep_equals_stable<T>(a: Immutable<T>, b: Immutable<T>): boolean {
	return stable_stringify(a) === stable_stringify(b)
}
