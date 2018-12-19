
function round_float(x: number, to: number = 100): number {
	return Math.floor(1. * x * to) / (1. * to)
}

function time_to_human(seconds: number): string {
	let human_time = ''

	const s = seconds % 60
	const m = ((seconds - s) / 60) % 60
	const h = (seconds - s - m*60) / 3600

	if (h) human_time += `${h}h`
	if (m) {
		human_time += `${m}`
		if (!h) human_time += 'm'
	}
	if (s && !(h && m)) {
		human_time += `${s}`
		if (!h && !m) human_time += 's'
	}

	return human_time
}

export {
	round_float,
	time_to_human,
}
