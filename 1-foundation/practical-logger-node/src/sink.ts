import {
	ALL_LOG_LEVELS,
	LOG_LEVEL_TO_HUMAN,
} from '@offirmo/practical-logger-core'

import {
	LogPayload,
	LogSink,
} from '@offirmo/practical-logger-types'

import { displayError } from '@offirmo/print-error-to-ansi'
import prettifyJson from '@offirmo/prettify-json'
import chalk from 'chalk'


const MIN_WIDTH = 7
export function to_aligned_ascii(level: string): string {
	let lvl = level.toUpperCase()
	/*while (lvl.length <= MIN_WIDTH - 2) {
		lvl = ' ' + lvl + ' '
	}*/
	if (lvl.length < MIN_WIDTH)
		lvl = (lvl + '         ').slice(0, MIN_WIDTH)
	return lvl
}


export const LEVEL_TO_ASCII: Readonly<{ [k: string]: string }> = {
	fatal:   chalk.bgRed.white.bold(to_aligned_ascii(' ' + LOG_LEVEL_TO_HUMAN['fatal'])),
	emerg:   chalk.bgRed.white.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['emerg'])),
	alert:   chalk.bgRed.white.bold(to_aligned_ascii(' ' + LOG_LEVEL_TO_HUMAN['alert'])),
	crit:    chalk.bgRed.white.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['crit'])),

	error:   chalk.red.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['error'])),

	warning: chalk.yellow.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['warning'])),
	warn:    chalk.yellow.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['warn'])),

	notice:  chalk.blue(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['notice'])),
	info:    chalk.blue(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['info'])),

	verbose: to_aligned_ascii(LOG_LEVEL_TO_HUMAN['verbose']),
	log:     to_aligned_ascii(LOG_LEVEL_TO_HUMAN['log']),
	debug:   to_aligned_ascii(LOG_LEVEL_TO_HUMAN['debug']),

	trace:   chalk.dim(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['trace'])),
	silly:   chalk.dim(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['silly'])),
}
if (Object.keys(LEVEL_TO_ASCII).sort().join(',') !== [...ALL_LOG_LEVELS].sort().join(',')) {
	// TODO move to unit tests
	throw new Error('practical-logger-node: needs an update!')
}

export const LEVEL_TO_STYLIZE: Readonly<{ [k: string]: (s: string) => string }> = {
	fatal:   s => chalk.red.bold(s),
	emerg:   s => chalk.red.bold(s),
	alert:   s => chalk.red.bold(s),
	crit:    s => chalk.red.bold(s),

	error:   s => chalk.red.bold(s),

	warning: s => chalk.yellow(s),
	warn:    s => chalk.yellow(s),

	notice:  s => chalk.blue(s),
	info:    s => chalk.blue(s),

	verbose: s => s,
	log:     s => s,
	debug:   s => s,

	trace:   s => chalk.dim(s),
	silly:   s => chalk.dim(s),
}
if (Object.keys(LEVEL_TO_STYLIZE).sort().join(',') !== [...ALL_LOG_LEVELS].sort().join(',')) {
	// TODO move to unit tests
	throw new Error('practical-logger-node: needs an update!')
}

export const sink: LogSink = (payload: LogPayload): void => {
	const { level, name, msg, time, details, err } = payload
	let line = ''
		+ chalk.dim(String(time))
		+ ' '
		+ LEVEL_TO_ASCII[level]
		+ '› '
		+ LEVEL_TO_STYLIZE[level](''
			+ name
			+ '›'
			+ (msg ? ' ' : '')
			+ msg
			+ ' '
			+ prettifyJson(details)
		)
	console.log(line) // eslint-disable-line no-console
	if (err)
		displayError(err)
}
