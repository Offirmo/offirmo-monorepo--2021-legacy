import { Logger, LoggerCreationParams } from '@offirmo/practical-logger-types'


function NOP () {}

const NOP_LOGGER: Logger = {
	setLevel: NOP,
	getLevel: () => 'silly',

	addCommonDetails: NOP,

	fatal: NOP,
	emerg: NOP,
	alert: NOP,
	crit: NOP,
	error: NOP,
	warning: NOP,
	warn: NOP,
	notice: NOP,
	info: NOP,
	verbose: NOP,
	log: NOP,
	debug: NOP,
	trace: NOP,
	silly: NOP,

	group: NOP,
	groupCollapsed: NOP,
	groupEnd: NOP,
}

function createLogger(_?: any): Logger {
	return NOP_LOGGER
}

export {
	Logger,
	LoggerCreationParams,
	createLogger,
}
