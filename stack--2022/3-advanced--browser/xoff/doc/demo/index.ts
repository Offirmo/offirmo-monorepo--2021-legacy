//import 'tslib'
import {
	extend_xoff,
	get_xoff,
	get_xoff_flag,
	get_top_window,
	get_top_ish_window,
	load_script_from_top,
	execute_from_top,
	is_isolated,
	get_xoff_depth,
	get_log_symbol,
}
//from '../../src'
from '../../dist/src.es2019.cjs'

interface LocalExtras {
	foo: string
}

console.group(get_log_symbol() + ' ' + window.location.href)
extend_xoff<LocalExtras>({ foo: window.location.href })
console.log('Offirmo’s extras:', get_xoff())
console.log('is isolated?', is_isolated())
console.log('flag?', { debug_render_fn: get_xoff_flag('debug_render'), debug_render_direct: window.oᐧextra?.flagꓽdebug_render)
console.log('Extra.foo', get_xoff<LocalExtras>().foo)
console.log(get_top_window() === window ? 'I’m top' : 'I’m not top')
console.log(get_top_ish_window() === window ? 'I’m top-ish' : 'I’m not top-ish')
console.log('xoff depth', get_xoff_depth())
const ↆnetlify_script = load_script_from_top('https://identity.netlify.com/v1/netlify-identity-widget.js'/*, get_xoff().top_win*/)
;ↆnetlify_script
	.then((script) => {
		console.log(`${get_log_symbol()} ✅ netlify script loaded from top`, {
			script,
			top_win: get_xoff().top_win,
			netlifyIdentity: window.netlifyIdentity,
		})
		execute_from_top((prefix) => {
			console.log(`${prefix} following netlify loaded…`, window.netlifyIdentity, window.oᐧextra)
			window.oᐧextra.netlifyIdentity = window.netlifyIdentity
		}, get_log_symbol(get_top_ish_window()) + '←' + get_log_symbol())
		setTimeout(() => {
			if (get_xoff_depth() === 2)
				window.oᐧextra?.netlifyIdentity.open()
		}, 1000)
	})
	.catch(err => console.error('netlify script failed to load:', err))
//console.log(`${get_log_symbol()} load ↆnetlify_script`, { ↆnetlify_script })

const ↆanalytics_script = load_script_from_top('https://www.googletagmanager.com/gtag/js?id=DEMO')
;ↆanalytics_script
	.then((script) => {
		console.log(`${get_log_symbol()} ✅ analytics script loaded from top`, script, window)
		execute_from_top((prefix) => {
			console.log(`${prefix} following google loaded…`, window.dataLayer, window.oᐧextra)
			window.dataLayer = window.dataLayer || []
			function gtag() { dataLayer.push(arguments) }
			gtag('js', new Date())
			gtag('config', 'DEMO')
			window.oᐧextra.gtag = gtag
		}, get_log_symbol(get_top_ish_window()) + '←' + get_log_symbol())
	})
	.catch(err => console.error('analytics script failed to load:', err))
//console.log(`${get_log_symbol()} load ↆanalytics_script`, { ↆanalytics_script })

window.test_cross_frame_callback = (cb) => {
	console.log(`${get_log_symbol()} test_cross_frame_callback() calling back…`, { cb })
	cb()
}

if (window.parent !== window) {
	console.log(`${get_log_symbol()} calling parent…`)
	window.parent.test_cross_frame_callback(() => console.log(`${get_log_symbol()} I got called back.`))
}

console.groupEnd()

