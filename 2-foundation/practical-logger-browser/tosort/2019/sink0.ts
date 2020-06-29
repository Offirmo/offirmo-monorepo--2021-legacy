import {
	ALL_LOG_LEVELS,
	LOG_LEVEL_TO_HUMAN,
} from '@offirmo/practical-logger-core'

import {
	LogLevel,
	LogPayload,
	LogSink,
} from '@offirmo/practical-logger-types'


const LEVEL_TO_CONSOLE_METHOD: Readonly<{ [k: string]: string }> = {
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
	// note: console.debug doesn't display anything on Chrome, don't use it
	debug:   'log',
	trace:   'log',
	silly:   'log',
}
if (Object.keys(LEVEL_TO_CONSOLE_METHOD).sort().join(',') !== [...ALL_LOG_LEVELS].sort().join(',')) {
	// TODO move to unit tests
	throw new Error('practical-logger-browser: needs an update!')
}

const LEVEL_TO_STYLE: Readonly<{ [k: string]: string }> = {
	fatal:   '',
	emerg:   '',
	alert:   '',
	crit:    '',

	error:   '',

	warning: '',
	warn:    '',

	notice:  'color: #659AD2;',
	info:    'color: #659AD2;',
	verbose: 'color: #659AD2;',

	log:     '',
	debug:   '',

	trace:   'color: #9AA2AA;',
	silly:   'color: #9AA2AA;',
}
if (Object.keys(LEVEL_TO_STYLE).sort().join(',') !== [...ALL_LOG_LEVELS].sort().join(',')) {
	// TODO move to unit tests
	throw new Error('practical-logger-browser: needs an update!')
}


/*export const sink1: LogSink = (payload: LogPayload): void => {
	const { level, name, msg, time, details } = payload
	let line = ''
		//+ time
		//+ ' '
		+ `%c[${level}]`
		+ '›'
		+ name
		+ ': '
		//+ (msg ? ' ' : '')
		+ msg

	// TODO use console.groupCollapsed with an icon?
	if (Object.keys(details).length)
		(console as any)[LEVEL_TO_CONSOLE_METHOD[level]](line, LEVEL_TO_STYLE[level], details)
	else
		(console as any)[LEVEL_TO_CONSOLE_METHOD[level]](line, LEVEL_TO_STYLE[level])
}*/

//const MIN_WIDTH = 5
export function to_aligned_ascii(level: LogLevel): string {
	let str = LOG_LEVEL_TO_HUMAN[level] //.slice(0, MIN_WIDTH)
	/*if (str.length < MIN_WIDTH)
		str = (str + '         ').slice(0, MIN_WIDTH)*/
	return str
}

const FONT_FAMILY_FAST_AND_GOOD_ENOUGH = '-apple-system, BlinkMacSystemFont, "avenir next", avenir, "Segoe UI", "lucida grande", "helvetica neue", helvetica, "Fira Sans", roboto, noto, "Droid Sans", cantarell, oxygen, ubuntu, "franklin gothic medium", "century gothic", "Liberation Sans", sans-serif'
const FONT_FAMILY_MONOSPACE = '"dejavu sans mono", "Menlo", "Consolas", "Lucida Console", "Courier New", monospace'
const STYLES = [
	`font-family: ${FONT_FAMILY_FAST_AND_GOOD_ENOUGH}; `,
	`font-family: ${FONT_FAMILY_MONOSPACE}; `,
	`font-family: ${FONT_FAMILY_FAST_AND_GOOD_ENOUGH}; `,
]
export const sink: LogSink = (payload: LogPayload): void => {
	const { level, name, msg, time, details } = payload
	let line = ''
		//+ time
		//+ ' '
		+ `%c[%c${to_aligned_ascii(level)}%c]`
		+ '›'
		+ name
		+ ': '
		//+ (msg ? ' ' : '')
		+ msg

	const styles = STYLES.map(s => LEVEL_TO_STYLE[level] + s)
	if (Object.keys(details).length)
		(console as any)[LEVEL_TO_CONSOLE_METHOD[level]](line, ...styles, details)
	else
		(console as any)[LEVEL_TO_CONSOLE_METHOD[level]](line, ...styles)
}
