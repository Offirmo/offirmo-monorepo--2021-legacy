import { LogLevel } from '@offirmo/practical-logger-types'

export const LIB = '@offirmo/practical-logger-core'

// level to a numerical value, for ordering and filtering.
// mnemonic:  100 = 100% = you will see 100% of the logs
//              1 =   1% = you will see 1% of the logs (obviously the most important)
export const LOG_LEVEL_TO_INTEGER: Readonly<{ readonly [k: string]: number }> = {
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

export const ALL_LOG_LEVELS: ReadonlyArray<LogLevel> =
	Object.keys(LOG_LEVEL_TO_INTEGER)
		.map(s => s as LogLevel)
		.sort((a: LogLevel, b: LogLevel) => LOG_LEVEL_TO_INTEGER[a] - LOG_LEVEL_TO_INTEGER[b])

// rationalization to a clear, human understandable string
// generated to shave a few bytes
// not using fromEntries bc not available in node <12
export const LOG_LEVEL_TO_HUMAN: Readonly<{ readonly [k: string]: string }> = ALL_LOG_LEVELS.reduce((acc, ll) => {
	acc[ll] = ({ em: 'emergency', wa: 'warn'} as any)[ll.slice(0, 1)] || ll
	return acc
}, {} as any)

export * from './consts-base'
