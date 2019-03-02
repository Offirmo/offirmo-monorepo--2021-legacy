import { createLogger } from '@offirmo/practical-logger-browser'

console.log(`[🧩 UWDT/api/full.${+Date.now()}] Hello!`)

export function install(shouldOverwrite = true) {
	if (window._debug && !shouldOverwrite) return

	console.log(`[🧩 UWDT/api/full.${+Date.now()}] injecting API...`)

	const loggerCache = new Set()

	function getLogLevel(id = 'root') {
		return [ 1, 'silly' ]
		//return [ 100, 'fatal' ]
	}

	function getLogger(id = 'root') {
		return createLogger({
			name: id,
			level: getLogLevel(id)[1],
		})
	}

	function addCommand() {
		// nothing
	}

	window._debug = {
		getLogLevel,
		getLogger,
		addCommand,
	}
}

//export default install

install()
