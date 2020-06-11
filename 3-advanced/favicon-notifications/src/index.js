import { get_top_ish_window } from '@offirmo-private/xoff'
import Piecon from './piecon'
import Favico from './favico.js'

const DEBUG = false


////////////////////////////////////

function create_favicon(opts) {
	return new Favico({
		//animation:'popFade',
		animation: 'none',
		position: 'up',
		win: get_top_ish_window(),
		...opts,
	})
}

let initialized = false
function ensure_libs_initialized() {
	if (initialized)
		return

	const body_styles = window.getComputedStyle(document.body)
	const pie_chart_color =
		   body_styles.getPropertyValue('--o⋄color--fg⁚error')
		|| '#ff0084'
	const empty_pie_chart_color =
		   body_styles.getPropertyValue('--fg')
		|| body_styles.getPropertyValue('--o⋄color--fg⁚main')
		|| 'lightgrey'
	const outer_ring_color =
		   body_styles.getPropertyValue('--bg')
		|| body_styles.getPropertyValue('--o⋄color--bg⁚main')
		|| 'white'
	//console.log({ pie_chart_color, empty_pie_chart_color, outer_ring_color })

	Piecon.setOptions({
		color: pie_chart_color, // Pie chart color
		background: empty_pie_chart_color, // Empty pie chart color
		shadow: outer_ring_color, // Outer ring color
		fallback: false // Toggles displaying percentage in the title bar (possible values - true, false, 'force')
	})
	// experimentally needed...
	Piecon.setProgress(0.0001)

	initialized = true
}

// NOTE due to this lib being designed to work with same-domain iframes,
// we don't do any memoization for we don't know
// if another context didn't change our expected state.
function set_number_in_favicon(x) {
	if (DEBUG) console.group('set_number_in_favicon(' + x + ')')
	ensure_libs_initialized()

	x = Number(x)

	if (x < 0 || Number.isNaN(x)) {
		throw new Error('bad number')
	}

	if (x >= 1) {
		x = Math.trunc(x)

		// reset competing lib just in case
		Piecon.reset()
		if (DEBUG) console.log('…Piecon.reset()')

		// force-reinit the lib
		let favicon = create_favicon()
		if (DEBUG) console.log('…new Favico(…)')

		favicon.badge(x)
		if (DEBUG) console.log('favicon.badge()', x)
	} else {
		x = Math.trunc(x * 100)
		// constraint for clarity of display on limits
		x = Math.min(95, x)
		x = Math.max(3, x)

		// reset competing lib just in case
		create_favicon().reset()
		if (DEBUG) console.log('favicon.reset()')

		Piecon.setProgress(x)
		if (DEBUG) console.log('piecon.setProgress()', x)
	}

	if (DEBUG) console.groupEnd()
}

export {
	set_number_in_favicon
}
