
console.log('Hello')


/*const {
	SimpleLogger,
	JSConsoleLogger,
	SyslogLogger,
	Log4jLogger,
	NpmLogger,
	AngularJSLogger,
	BunyanLogger,
	CompatibleLogger,
} = require('..')*/


const interesting = [
	'alert',
	'crit',
	'debug',
	'emerg',
	'error',
	'fatal',
	'info',
	'log',
	'notice',
	'silly',
	'trace',
	'verbose',
	'warn',
	'warning',
]


console.log('--- should display:')

import {
	simpleLoggerToConsole,
	consoleLoggerToConsole,
	syslogLoggerToConsole,
	log4jLoggerToConsole,
	serverLoggerToConsole,
	npmLoggerToConsole,
	angularJSLoggerToConsole,
	bunyanLoggerToConsole,
	compatibleLoggerToConsole,
} from '..'

	;[
	simpleLoggerToConsole,
	consoleLoggerToConsole,
	syslogLoggerToConsole,
	log4jLoggerToConsole,
	serverLoggerToConsole,
	npmLoggerToConsole,
	angularJSLoggerToConsole,
	bunyanLoggerToConsole,
	compatibleLoggerToConsole,
].forEach((logger: any) => {
	console.log('-')

	Object.keys(logger).forEach(key => {
		if (!logger.hasOwnProperty(key)) return
		if (!interesting.includes(key)) return

		console.log(`- "${key}":`)
		logger[key](`Logging "${key}" to console`)
	})
})


console.log('--- should NOT display:')

import {
	simpleLoggerToVoid,
	consoleLoggerToVoid,
	syslogLoggerToVoid,
	log4jLoggerToVoid,
	serverLoggerToVoid,
	npmLoggerToVoid,
	angularJSLoggerToVoid,
	bunyanLoggerToVoid,
	compatibleLoggerToVoid,
} from '..'

;[
	simpleLoggerToVoid,
	consoleLoggerToVoid,
	syslogLoggerToVoid,
	log4jLoggerToVoid,
	serverLoggerToVoid,
	npmLoggerToVoid,
	angularJSLoggerToVoid,
	bunyanLoggerToVoid,
	compatibleLoggerToVoid,
].forEach((logger: any) => {
	console.log('-')

	Object.keys(logger).forEach(key => {
		if (!logger.hasOwnProperty(key)) return
		if (!interesting.includes(key)) return

		logger[key](`"${key}"`)
	})
})

console.log('--- done')
