/* global globalThis, self, window, global */

const lastResort: { [k:string]: any } = {}

export default function getGlobalThis(this: any): { [k:string]: any } {

	if (typeof globalThis !== 'undefined') return globalThis

	// check node first https://github.com/ljharb/globalThis/issues/2
	if (typeof global !== 'undefined') return global

	// @ts-expect-error TS2304
	if (typeof self !== 'undefined') return self

	// @ts-expect-error TS2304
	if (typeof window !== 'undefined') return window

	if (typeof this !== 'undefined') return this

	return lastResort // should never happen
}

export { getGlobalThis }
