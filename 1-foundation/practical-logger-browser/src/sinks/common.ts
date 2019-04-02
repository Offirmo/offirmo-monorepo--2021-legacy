import assert from 'tiny-invariant'

import { LIB } from '../consts'
import { ALL_LOG_LEVELS } from '@offirmo/practical-logger-core'


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
// TODO move to unit tests
assert(
	Object.keys(LEVEL_TO_CONSOLE_METHOD).sort().join(',') === [...ALL_LOG_LEVELS].sort().join(','),
	`${LIB}: LEVEL_TO_CONSOLE_METHOD needs an update!`
)

