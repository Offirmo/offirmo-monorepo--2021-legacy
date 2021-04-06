
function time_to_human(seconds: number): string {
	//console.log(`time_to_human(${seconds})`)
	const human_time_parts = []

	const s = seconds % 60
	seconds -= s
	const m = (seconds / 60) % 60
	seconds -= m * 60
	const h = seconds / 3600

	if (h) {
		human_time_parts.push(`${h}h`)
	}
	if (m) {
		human_time_parts.push(`${m}m`)
	}
	if (s /*&& !(h && m)*/) {
		human_time_parts.push(`${s}s`)
	}

	return human_time_parts.join(' ')
}

export {
	time_to_human,
}
