console.warn(`📄 [page/head-script.${+Date.now()}] Hello!`, {
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
const logger = _debug.getLogger()
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

_debug.addCommand('pause', () => {
	console.log('paused')
})
