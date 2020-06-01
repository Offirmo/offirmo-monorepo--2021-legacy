//import 'tslib'
import {
	extend_xoff,
	get_xoff,
	get_xoff_flag,
	get_top_window,
	load_script_from_top,
	execute_from_top,
	is_sandboxed,
	get_xoff_depth,
	get_log_prefix,
}
//from '../../src'
from '../../dist/src.es2019.cjs'

interface LocalExtras {
	foo: string
}

console.group(get_log_prefix() + ' ' + window.location.href)
extend_xoff<LocalExtras>({ foo: window.location.href })
console.log('Offirmo’s extras:', get_xoff())
console.log('is sandboxed?', is_sandboxed())
console.log('flag?', get_xoff_flag('debug_render'), window.oᐧextra?.flagꓽdebug_render)
console.log('Extra.foo', get_xoff<LocalExtras>().foo)
console.log(get_top_window() === window ? 'I’m top' : 'I’m not top')

const ↆnetlify_script = load_script_from_top('https://identity.netlify.com/v1/netlify-identity-widget.js', get_xoff().top_win)
;ↆnetlify_script
	.then((script) => {
		console.log(`${get_log_prefix()} ✅ ↆnetlify_script loaded from top`, {
			script,
			top_win: get_xoff().top_win,
			netlifyIdentity: window.netlifyIdentity,
		})
		execute_from_top((prefix) => {
			console.log(`${prefix} following netlify loaded…`, window.netlifyIdentity, window.oᐧextra)
			window.oᐧextra.netlifyIdentity = window.netlifyIdentity
		}, get_log_prefix(get_top_window()) + '←' + get_log_prefix())
		setTimeout(() => {
			if (get_xoff_depth() === 2)
				window.oᐧextra?.netlifyIdentity.open()
		}, 1000)
	})
	.catch(err => console.error('ↆnetlify_script failed to load:', err))
//console.log(`${get_log_prefix()} load ↆnetlify_script`, { ↆnetlify_script })

const ↆanalytics_script = load_script_from_top('https://www.googletagmanager.com/gtag/js?id=DEMO')
;ↆanalytics_script
	.then((script) => {
		console.log(`${get_log_prefix()} ✅ ↆanalytics_script loaded from top`, script, window)
		execute_from_top((prefix) => {
			console.log(`${prefix} following google loaded…`, window.dataLayer, window.oᐧextra)
			window.dataLayer = window.dataLayer || []
			function gtag() { dataLayer.push(arguments) }
			gtag('js', new Date())
			gtag('config', 'DEMO')
			window.oᐧextra.gtag = gtag
		}, get_log_prefix(get_top_window()) + '←' + get_log_prefix())
	})
	.catch(err => console.error('ↆanalytics_script failed to load:', err))
//console.log(`${get_log_prefix()} load ↆanalytics_script`, { ↆanalytics_script })


console.groupEnd()

