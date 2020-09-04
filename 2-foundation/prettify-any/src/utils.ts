////////////////////////////////////

// https://2ality.com/2012/03/signedzero.html (outdated)
export function is_negative_zero(x: number): boolean {
	return Object.is(x, -0)
}

// https://stackoverflow.com/a/51398944/587407
const COMPARABLE_TYPES = [ 'number', 'string' ]
export function cmp<T>(a: T, b: T): number {
	const ta = typeof a
	const tb = typeof b
	if (ta !== tb)
		return cmp(ta, tb)

	if (!COMPARABLE_TYPES.includes(ta)) {
		// Very crude. mainly for symbols.
		return cmp(String(a), String(b))
	}

	return -(a < b) || +(a > b)
}
