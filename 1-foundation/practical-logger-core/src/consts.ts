import { LogLevel } from '@offirmo/practical-logger-interface'

const LIB = '@offirmo/practical-logger-core'

// level to a numerical value, for ordering and filtering.
// mnemonic:  100 = 100% = you will see 100% of the logs
//              1 =   1% = you will see 1% of the logs (obviously the most important)
const LEVEL_TO_INTEGER: Readonly<{ [k: string]: number }> = {
	fatal:    1,
	emerg:    2,

	alert:   10,
	crit:    20,
	error:   30,

	warning: 40,
	warn:    40,

	notice:  45,

	info:    50,

	verbose: 70,
	log:     80,
	debug:   81,

	trace:   90,

	silly:  100,
}

// rationalization to a clear, human understandable string
const LEVEL_TO_HUMAN: Readonly<{ [k: string]: string }> = {
	fatal:   'fatal',
	emerg:   'emergency',

	alert:   'alert',
	crit:    'critical',
	error:   'error',

	warning: 'warn',
	warn:    'warn',

	notice:  'notice',

	info:    'info',

	verbose: 'verbose',
	log:     'log',
	debug:   'debug',

	trace:   'trace',

	silly:   'silly',
}
if (Object.keys(LEVEL_TO_HUMAN).sort().join(',') !== Object.keys(LEVEL_TO_INTEGER).sort().join(',')) {
	// TODO move to unit tests
	throw new Error('practical-logger-core: needs an update!')
}

const ALL_LOG_LEVELS: Readonly<LogLevel[]> =
	Object.keys(LEVEL_TO_INTEGER)
	.map(s => s as LogLevel)
	.sort((a: LogLevel, b: LogLevel) => LEVEL_TO_INTEGER[a] - LEVEL_TO_INTEGER[b])

const DEFAULT_LOG_LEVEL: LogLevel = 'error'
const DEFAULT_LOGGER_KEY: string = ''

export {
	LIB,
	LEVEL_TO_INTEGER,
	LEVEL_TO_HUMAN,
	ALL_LOG_LEVELS,
	DEFAULT_LOG_LEVEL,
	DEFAULT_LOGGER_KEY,
}
