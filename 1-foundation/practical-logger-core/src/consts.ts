import { LogLevel } from '@offirmo/practical-logger-interface'

export const LIB = '@offirmo/practical-logger-core'

// level to a numerical value, for ordering and filtering.
// mnemonic:  100 = 100% = you will see 100% of the logs
//              1 =   1% = you will see 1% of the logs (obviously the most important)
export const LOG_LEVEL_TO_INTEGER: Readonly<{ [k: string]: number }> = {
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
export const LOG_LEVEL_TO_HUMAN: Readonly<{ [k: string]: string }> = {
	fatal:   'fatal',
	emerg:   'emergency',

	alert:   'alert',
	crit:    'critical',
	error:   'error',

	warning: 'warn', // warn is a word, shorter is better
	warn:    'warn',

	notice:  'notice',

	info:    'info',

	verbose: 'verbose',
	log:     'log',
	debug:   'debug',

	trace:   'trace',

	silly:   'silly',
}

export const ALL_LOG_LEVELS: Readonly<LogLevel[]> =
	Object.keys(LOG_LEVEL_TO_INTEGER)
		.map(s => s as LogLevel)
		.sort((a: LogLevel, b: LogLevel) => LOG_LEVEL_TO_INTEGER[a] - LOG_LEVEL_TO_INTEGER[b])

export * from './consts-base'
