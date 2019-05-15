/* global: _debug */
import {
	getLogger,
	exposeInternal,
	overrideHook,
	addDebugCommand,
	globalThis,
} from '@offirmo/universal-debug-api-minimal-noop'

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


//

function onMessage(event) {
	console.log(`[${LIB}.${+Date.now()}] → postMessage: received message:`, event.data)
}
const listenerOptions = {
	capture: false, // http://devdocs.io/dom/window/postmessage
}
window.addEventListener('message', onMessage, listenerOptions)
window.postMessage({msg: `${LIB} - test`}, '*')

// usage
const logger = getLogger()
logger.info('Hello from logger!')

if (true) {
	console.group('Testing log levels...')
	;[
		'fatal',
		'emerg',
		'alert',
		'crit',
		'error',
		'warning',
		'warn',
		'notice',
		'info',
		'verbose',
		'log',
		'debug',
		'trace',
		'silly',
	].forEach(level => {
		logger[level](`logger demo with level "${level}"`, {level})
	})
	console.groupEnd()
}

_debug.v1.addDebugCommand('pause', () => {
	console.log('paused')
})


