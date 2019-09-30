/* global: _debug */
//import '../../src/injected-libs/universal-debug-api-control'
import {
	getLogger,
	exposeInternal,
	overrideHook,
	addDebugCommand,
	globalThis,
} from '@offirmo/universal-debug-api-minimal-noop'

import {
	demo_standard_console,
	demo_logger_basic_usage,
	demo_logger_levels,
	demo_error,
	demo_group,
	demo_incorrect_logger_invocations,
	demo_logger_api,
	demo_devtools_fonts,
} from '../../../../1-foundation/practical-logger-core/doc/shared-demo'

const LIB = `📄 demo/head-script`


console.warn(`[${LIB}.${+Date.now()}] Hello, more standard!`, {
	foo_js: window.foo,
	foo_ls: (() => {
		try {
			// local files may not have local storage
			return localStorage.getItem('foo')
		}
		catch { /* ignore */ }
	})(),
	_debug,
})

//////////// usage
const logger = getLogger()
logger.info('Hello from root logger!')

if (false) {
	demo_logger_levels(logger)
}

_debug.v1.addDebugCommand('pause', () => {
	console.log('paused')
})

function render() {
	const is_feature_x_on = overrideHook('is_feature_X_on', false)
	const span_f = document.getElementById('feature-x')
	span_f.innerText = is_feature_x_on ? '✅' : '❌'

	const server = overrideHook('SERVER_URL', 'https://www.online-adventur.es/')
	const link = document.getElementById('server-url')
	link.href = link.innerText = server

	const variation = overrideHook('experiment_Y_cohort', 'not-enrolled')
	const span_x = document.getElementById('experiment')
	span_x.innerText = variation

	const custom = overrideHook('custom', undefined)
	const span_c = document.getElementById('custom')
	span_c.innerText = String(custom)
}
setInterval(render, 1000)
setTimeout(render, 1) // just for it not to be sync

//////////// communication ////////////

/*
function onMessage(event) {
	console.log(`[${LIB}.${+Date.now()}] seen postMessage:`, event.data)
}
const listenerOptions = {
	capture: false, // http://devdocs.io/dom/window/postmessage
}
window.addEventListener('message', onMessage, listenerOptions)
*/
/*
console.log(`[${LIB}.${+Date.now()}] sending a test postMessage...`)
window.postMessage({msg: `Test message from ${LIB}`}, '*')
*/
