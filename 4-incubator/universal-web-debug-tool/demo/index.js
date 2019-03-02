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
].forEach(level => logger[level]({level}))

_debug.addCommand('pause', () => {
	console.log('paused')
})
