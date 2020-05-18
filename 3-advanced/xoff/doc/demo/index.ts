//import 'tslib'
import {
	extend_xoff,
	get_xoff,
	get_xoff_flag,
	get_top_window,
	load_script_from_top,
	is_sandboxed,
}
from '../../src'
//from '../../dist/src.es2018.cjs'

interface LocalExtras {
	foo: string
}

console.group(window.location.href)
extend_xoff<LocalExtras>({ foo: window.location.href })
console.log('Offirmo’s extras:', get_xoff())
console.log('is sandboxed?', is_sandboxed())
console.log('flag?', get_xoff_flag('debug_render'), window.oᐧextra?.flagꓽdebug_render)
console.log('Extra.foo', get_xoff<LocalExtras>().foo)
console.log(get_top_window() === window ? 'I’m top' : 'I’m not top')

const ↆnetlify_script = load_script_from_top('https://identity.netlify.com/v1/netlify-identity-widget.js', get_xoff().top_win)
;ↆnetlify_script
	.then((s) => {
		console.log('✅ ↆnetlify_script loaded', s, get_xoff().top_win, window.netlifyIdentity)
	})
	.catch(err => console.error('ↆnetlify_script failed to load:', err))
console.log('load ↆnetlify_script', { ↆnetlify_script })

const ↆanalytics_script = load_script_from_top('https://www.googletagmanager.com/gtag/js')
;ↆanalytics_script
	.then((s) => {
		console.log('✅ ↆanalytics_script loaded', s, window)
	})
	.catch(err => console.error('ↆanalytics_script failed to load:', err))
console.log('load ↆanalytics_script', { ↆanalytics_script })


console.groupEnd()

