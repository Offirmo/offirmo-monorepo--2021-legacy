import memoizeOne from 'memoize-one'

import { precompute } from './state'

function get_derived_ui({ stable, snapshot }, {DEBUG = true} = {}) {
	if (DEBUG) console.log('derive_ui', snapshot.date_ms)

	const { autoclicks_per_s } = precompute(stable, DEBUG)

	const wasted_ideas_float = snapshot.wasted_ideas_x1000 / 1000.

	return {
		autoclicks_per_s,
		wasted_ideas_float,
		wasted_ideas: Math.floor(wasted_ideas_float),
	}
}

export { get_derived_ui }
