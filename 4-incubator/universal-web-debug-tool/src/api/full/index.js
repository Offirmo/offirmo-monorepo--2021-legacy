import { createLogger } from '@offirmo/practical-logger-browser'

console.log(`[🧩 UWDT/api/full.${+Date.now()}] Hello!`)

function create() {
	const loggerCache = {}

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
		// TODO
	}

	return {
		getLogLevel,
		getLogger,
		addCommand,
	}
}

const instance = window._debug = (() => {
	console.log(`[🧩 UWDT/api/full.${+Date.now()}] injecting _debug API...`)

	return create()
})()

const {
	getLogLevel,
	getLogger,
	addCommand,
} = instance

export {
	getLogLevel,
	getLogger,
	addCommand,
}
