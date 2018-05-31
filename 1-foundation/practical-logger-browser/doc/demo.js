import { createLogger } from '../dist/src.es7/index.js'

const logger = createLogger({
	name: 'FOO',
	level: 'silly',
})

logger.log('hello')

;[
	'fatal',
	'emerg',
	'alert',
	'crit',
	'error',
	'warning',
	'warn',
	'notice',
	'info',
	'verbose',
	'log',
	'debug',
	'trace',
	'silly',
].forEach(level => logger[level]({level}))
