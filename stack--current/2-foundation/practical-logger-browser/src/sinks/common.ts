import { LogLevel, LOG_LEVEL_TO_HUMAN } from '@offirmo/practical-logger-core'

export const LEVEL_TO_CONSOLE_METHOD: Readonly<{ [k: string]: string }> = {
	fatal:   'error',
	emerg:   'error',
	alert:   'error',
	crit:    'error',

	error:   'error',

	warning: 'warn',
	warn:    'warn',

	notice:  'info',
	info:    'info',
	verbose: 'info',

	log:     'log',

	debug:   'debug',
	trace:   'debug',
	silly:   'debug',
}


const MIN_WIDTH = 5
export function to_uniform_level(level: LogLevel): string {
	let str = LOG_LEVEL_TO_HUMAN[level] //.slice(0, MIN_WIDTH)
	//if (str.length < MIN_WIDTH)
	str = (str + '         ').slice(0, MIN_WIDTH)
	return str
}
