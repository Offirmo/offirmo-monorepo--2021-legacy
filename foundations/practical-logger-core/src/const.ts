import { Enum } from 'typescript-string-enums'

import { LogLevel } from './types'


const ALL_LOG_LEVELS = Enum.keys(LogLevel)


// level to a numerical value, for ordering and filtering
const LEVEL_TO_INTEGER: { [k: string]: number } = {
	[LogLevel.fatal]:   60,
	[LogLevel.emerg]:   59,

	[LogLevel.alert]:   52,
	[LogLevel.crit]:    51,
	[LogLevel.error]:   50,

	[LogLevel.warning]: 40,
	[LogLevel.warn]:    40,

	[LogLevel.notice]:  35,

	[LogLevel.info]:    30,

	[LogLevel.verbose]: 22,
	[LogLevel.log]:     21,
	[LogLevel.debug]:   20,

	[LogLevel.trace]:   10,

	[LogLevel.silly]:    1,
}
if (ALL_LOG_LEVELS.length !== Object.keys(LEVEL_TO_INTEGER).length)
	throw new Error(`universal-logger-core: LEVEL_TO_INTEGER needs an update`)


// level to short, meaningful string to maybe be displayed on screen
const LEVEL_TO_HUMAN: { [k: string]: string } = {
	[LogLevel.fatal]:   'fatal',
	[LogLevel.emerg]:   'emergency',

	[LogLevel.alert]:   'alert',
	[LogLevel.crit]:    'critical',
	[LogLevel.error]:   'error',

	[LogLevel.warning]: 'warn',
	[LogLevel.warn]:    'warn',

	[LogLevel.notice]:  'note',

	[LogLevel.info]:    'info',

	[LogLevel.verbose]: 'verbose',
	[LogLevel.log]:     'log',
	[LogLevel.debug]:   'debug',

	[LogLevel.trace]:   'trace',

	[LogLevel.silly]:   'silly',
}
if (ALL_LOG_LEVELS.length !== Object.keys(LEVEL_TO_HUMAN).length)
	throw new Error(`universal-logger-core: LEVEL_TO_HUMAN needs an update`)


export {
	ALL_LOG_LEVELS,
	LEVEL_TO_INTEGER,
	LEVEL_TO_HUMAN,
}
