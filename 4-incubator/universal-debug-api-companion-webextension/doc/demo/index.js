import { getLogger } from '@offirmo/universal-debug-api-minimal-to-void'

console.warn(`📄 [page/head-script.${+Date.now()}] Hello, more standard!`, {
	foo_js: window.foo,
	foo_ls: (() => {
		try {
			// local files may not have local storage
			return localStorage.getItem('foo')
		}
		catch {}
	})(),
})



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

_debug.addDebugCommand('pause', () => {
	console.log('paused')
})
