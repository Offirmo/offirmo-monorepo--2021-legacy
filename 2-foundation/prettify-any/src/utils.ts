////////////////////////////////////

// https://2ality.com/2012/03/signedzero.html (outdated)
export function is_negative_zero(x: number): boolean {
	return Object.is(x, -0)
}

// https://stackoverflow.com/a/51398944/587407
export function cmp<T>(a: T, b: T): number {
	return -(a < b) || +(a > b)
}
