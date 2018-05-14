
function round_float(x: number, to: number = 100): number {
	return Math.floor(1. * x * to) / (1. * to)
}

export {
	round_float,
}
