import { get_top_ish_window } from '@offirmo-private/xoff'
import Piecon from './piecon'
import Favico from './favico.js'

const DEBUG = false

let favicon = undefined
let piecon_on = false
let favicon_on = false
let last_favicon_number = NaN

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

function ensure_libs_initialized() {
	if (favicon)
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

	favicon = create_favicon()

	// experimentally needed...
	Piecon.setProgress(0.0001)
	piecon_on = true
}

function set_number_in_favicon(x) {
	if (DEBUG) console.log('set_number_in_favicon', x)
	ensure_libs_initialized()

	x = Number(x)

	if (x < 0 || Number.isNaN(x)) {
		throw new Error('bad number')
	}

	if (x >= 1) {
		x = Math.trunc(x)

		if (piecon_on) {
			Piecon.reset()
			if (DEBUG) console.log('Piecon.reset')

			// experimentally needed...
			favicon = create_favicon()
			if (DEBUG) console.log('new favicon')

			piecon_on = false
		}

		// avoid unneeded animation if we are re-setting the same number
		if (x !== last_favicon_number) {
			favicon.badge(x)
			last_favicon_number = x
		}
		favicon_on = true

		if (DEBUG) console.log('favicon.badge', x)
	} else {
		x = Math.trunc(x * 100)
		// constraint for clarity of display on limits
		x = Math.min(95, x)
		x = Math.max(3, x)

		if (favicon_on) {
			favicon.reset()
			favicon_on = false
			last_favicon_number = NaN
			if (DEBUG) console.log('favicon.reset')
		}

		Piecon.setProgress(x)
		piecon_on = true

		if (DEBUG) console.log('piecon.setProgress', x)
	}
}

export {
	set_number_in_favicon
}
