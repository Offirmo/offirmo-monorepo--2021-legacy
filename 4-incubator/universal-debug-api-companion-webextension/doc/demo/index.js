/* global: _debug */
import '../../src/injected-libs/universal-debug-api-control'
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

const LIB = `📄 page/head-script`


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

if (true) {
	demo_logger_levels(logger)
}

_debug.v1.addDebugCommand('pause', () => {
	console.log('paused')
})

setInterval(() => {
	const server = overrideHook('SERVER_URL', 'https://www.online-adventur.es/')
	const link = document.getElementById('server_link')
	link.href = link.innerText = server
}, 1000)
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
