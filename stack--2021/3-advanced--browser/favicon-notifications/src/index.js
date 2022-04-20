import { get_top_ish_window } from '@offirmo-private/xoff'
import { schedule_when_idle_but_within_human_perception } from '@offirmo-private/async-utils'

import Piecon from './piecon'
import Favico from './favico.js'

const LIB = 'favicon-notifications'
const DEBUG = false
const target_window = get_top_ish_window()
let opted_out = false

////////////////////////////////////

function create_favicon(opts) {
	return new Favico({
		//animation:'popFade',
		animation: 'none',
		position: 'up',
		win: target_window,
		...opts,
	})
}

let initialized = false
function ensure_libs_initialized() {
	if (initialized)
		return

	if (DEBUG) console.log(`[${LIB}] initializing…`)

	if (target_window !== window.parent) {
		console.warn(`[${LIB}] can't work, cross-origin parent`)
		opted_out = true
	}

	if (target_window.document.location.origin.startsWith('file://')) {
		// not worth a fix
		console.warn(`[${LIB}] can't work for file:// origin due to CORS`)
		opted_out = true
	}

	if (!opted_out) {
		const body_styles = window.getComputedStyle(document.body)
		const pie_chart_color =
			body_styles.getPropertyValue('--o⋄color⁚fg--error')
			|| '#ff0084'
		const empty_pie_chart_color =
			body_styles.getPropertyValue('--fg')
			|| body_styles.getPropertyValue('--o⋄color⁚fg--main')
			|| 'lightgrey'
		const outer_ring_color =
			body_styles.getPropertyValue('--bg')
			|| body_styles.getPropertyValue('--o⋄color⁚bg--main')
			|| 'white'
		if (DEBUG) console.log(`[${LIB}]`, { pie_chart_color, empty_pie_chart_color, outer_ring_color })

		Piecon.setOptions({
			target_window,
			color: pie_chart_color, // Pie chart color
			background: empty_pie_chart_color, // Empty pie chart color
			shadow: outer_ring_color, // Outer ring color
			fallback: false, // Toggles displaying percentage in the title bar (possible values - true, false, 'force')
		})
		// experimentally needed...
		Piecon.setProgress(0.0001)
	}

	initialized = true
}

// NOTE due to this lib being designed to work with same-domain iframes,
// we don't do any memoization for we don't know
// if another context didn't change our expected state.
function set_number_in_favicon(x) {
	schedule_when_idle_but_within_human_perception(() => {
		if (DEBUG) console.group(`[${LIB}] set_number_in_favicon(${x})`)

		try {
			ensure_libs_initialized()
			if (opted_out) return // avoids distracting errors in the console

			x = Number(x)

			if (x < 0 || Number.isNaN(x)) {
				throw new Error('bad number')
			}

			if (x >= 1) {
				x = Math.trunc(x)

				// reset competing lib just in case
				Piecon.reset()
				if (DEBUG) console.log(`[${LIB}] …Piecon.reset()`)

				// force-reinit the lib
				let favicon = create_favicon()
				if (DEBUG) console.log(`[${LIB}] …new Favico(…)`)

				favicon.badge(x)
				if (DEBUG) console.log(`[${LIB}] favicon.badge()`, x)
			} else {
				x = Math.trunc(x * 100)
				// constraint for clarity of display on limits
				x = Math.min(95, x)
				x = Math.max(3, x)

				// reset competing lib just in case
				create_favicon().reset()
				if (DEBUG) console.log(`[${LIB}] favicon.reset()`)

				Piecon.setProgress(x)
				if (DEBUG) console.log(`[${LIB}] piecon.setProgress()`, x)
			}
		} catch (err) {
			console.error(`[${LIB}] set_number_in_favicon()`, err)
		}

		if (DEBUG) console.groupEnd()
	})
}

export {
	set_number_in_favicon
}
