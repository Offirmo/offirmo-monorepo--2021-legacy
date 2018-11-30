import {
	LEVEL_TO_HUMAN,
	LogLevel,
	Logger,
	LogParams,
	Details,
	Payload,
	OutputFn,
	createLogger as createCoreLogger,
	createChildLogger,
} from '@offirmo/practical-logger-core'


const LEVEL_TO_CONSOLE_METHOD: Readonly<{ [k: string]: string }> = {
	[LogLevel.fatal]:   'error',
	[LogLevel.emerg]:   'error',
	[LogLevel.alert]:   'error',
	[LogLevel.crit]:    'error',

	[LogLevel.error]:   'error',

	[LogLevel.warning]: 'warn',
	[LogLevel.warn]:    'warn',

	[LogLevel.notice]:  'info',
	[LogLevel.info]:    'info',
	[LogLevel.verbose]: 'info',

	[LogLevel.log]:     'log',
	// note: console.debug doesn't display anything on Chrome, don't use it
	[LogLevel.debug]:   'log',
	[LogLevel.trace]:   'log',
	[LogLevel.silly]:   'log',
}

const LEVEL_TO_STYLE: Readonly<{ [k: string]: string }> = {
	[LogLevel.fatal]:   '',
	[LogLevel.emerg]:   '',
	[LogLevel.alert]:   '',
	[LogLevel.crit]:    '',

	[LogLevel.error]:   '',

	[LogLevel.warning]: '',
	[LogLevel.warn]:    '',

	[LogLevel.notice]:  'color: #659AD2',
	[LogLevel.info]:    'color: #659AD2',
	[LogLevel.verbose]: 'color: #659AD2',

	[LogLevel.log]:     '',
	[LogLevel.debug]:   '',

	[LogLevel.trace]:   'color: #9AA2AA',
	[LogLevel.silly]:   'color: #9AA2AA',
}

function createLogger(p: LogParams): Logger {

	function outputFn(payload: Payload): void {
		const { level, name, msg, time, details } = payload
		//const { err, ...detailsNoErr } = details
		let line = ''
			//+ time
			//+ ' '
			+ `%c[${level}]`
			+ '›'
			+ name
			+ ': '
			//+ (msg ? ' ' : '')
			+ msg
		if (Object.keys(details).length)
			(console as any)[LEVEL_TO_CONSOLE_METHOD[level]](line, LEVEL_TO_STYLE[level], details)
		else
			(console as any)[LEVEL_TO_CONSOLE_METHOD[level]](line, LEVEL_TO_STYLE[level])
	}

	return createCoreLogger({
		...p,
		outputFn,
	})
}

export {
	createLogger,
	createChildLogger,
}
