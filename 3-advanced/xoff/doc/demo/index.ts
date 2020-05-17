//import 'tslib'
import {
	extend_xoff,
	get_offirmo_extras,
	get_top_window,
	load_script_from_top,
}
from '../../src'
//from '../../dist/src.es2018.cjs'

interface LocalExtras {
	top_href: string
}

console.group(window.location.href)
extend_xoff<LocalExtras>({ top_href: window.location.href })
console.log('Offirmo’s extras:', get_offirmo_extras())
console.log('Extra.top_href', get_offirmo_extras<LocalExtras>().top_href)
console.log(get_top_window() === window ? 'I’m top' : 'I’m not top')

const ↆnetlify_script = load_script_from_top('https://identity.netlify.com/v1/netlify-identity-widget.js', get_offirmo_extras().top_win)
;ↆnetlify_script
	.then((s) => {
		console.log('✅ ↆnetlify_script loaded', s, get_offirmo_extras().top_win)
	})
	.catch(err => console.error('ↆnetlify_script failed to load:', err))
console.log('load ↆnetlify_script', { ↆnetlify_script })

const ↆanalytics_script = load_script_from_top('https://www.googletagmanager.com/gtag/js')
;ↆanalytics_script
	.then((s) => {
		console.log('✅ ↆanalytics_script loaded', s)
	})
	.catch(err => console.error('ↆanalytics_script failed to load:', err))
console.log('load ↆanalytics_script', { ↆanalytics_script })


console.groupEnd()

