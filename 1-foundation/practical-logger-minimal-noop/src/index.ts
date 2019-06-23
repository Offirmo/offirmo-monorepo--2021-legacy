import { Logger, LoggerCreationParams } from '@offirmo/practical-logger-interface'


const NO_OP = () => {}

const NO_OP_LOGGER: Logger = {
	setLevel: NO_OP,
	getLevel: () => 'silly',

	addCommonDetails: NO_OP,

	fatal: NO_OP,
	emerg: NO_OP,
	alert: NO_OP,
	crit: NO_OP,
	error: NO_OP,
	warning: NO_OP,
	warn: NO_OP,
	notice: NO_OP,
	info: NO_OP,
	verbose: NO_OP,
	log: NO_OP,
	debug: NO_OP,
	trace: NO_OP,
	silly: NO_OP,

	group: NO_OP,
	groupCollapsed: NO_OP,
	groupEnd: NO_OP,
}

function createLogger(): Logger {
	return NO_OP_LOGGER
}

export {
	Logger,
	LoggerCreationParams,
	createLogger,
}
