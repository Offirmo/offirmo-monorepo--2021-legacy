import { Logger } from '@offirmo/practical-logger-types'


const NOOP = () => {}

const VOID_LOGGER: Logger = {
	setLevel: NOOP,
	getLevel: () => 'silly',
	
	addCommonDetails: NOOP,

	fatal: NOOP,
	emerg: NOOP,
	alert: NOOP,
	crit: NOOP,
	error: NOOP,
	warning: NOOP,
	warn: NOOP,
	notice: NOOP,
	info: NOOP,
	verbose: NOOP,
	log: NOOP,
	debug: NOOP,
	trace: NOOP,
	silly: NOOP,
}

export function createLogger(): Logger {
	return VOID_LOGGER
}

export {
	Logger
}
