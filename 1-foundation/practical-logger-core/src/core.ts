import {
	LogLevel,
	BaseInternalLoggerState,
	Logger,
	LoggerCreationParams,
	LogDetails,
	LogPayload,
	LogPrimitive,
	LogSink,
} from '@offirmo/practical-logger-interface'

import {
	LIB,
	ALL_LOG_LEVELS,
	LEVEL_TO_INTEGER,
	DEFAULT_LOG_LEVEL,
	DEFAULT_LOGGER_KEY,
} from './consts'


export function checkLevel(level: LogLevel) {
	if (!ALL_LOG_LEVELS.includes(level))
		throw new Error(`[${LIB}] Not a valid log level: "${level}"!`)
}

export function looksLikeAnError(x: any): boolean {
	return !!(x.name && x.message && x.stack)
}

// harmonize
// also try to recover from some common errors
// TODO assess whether it's really good to be that permissive (also: hurts perfs)
export function normalizePrimitiveArguments(args: IArguments): [ string, LogDetails ] {
	//console.log('>>> NPA', args)

	let message: string = ''
	let details: LogDetails = {}
	let err: Error | undefined = undefined

	if (args.length > 2) {
		//console.warn('NPA1', args)
		// wrong invocation,
		// most likely a "console.log" style invocation from an untyped codebase.
		// "best effort" fallback:
		message = Array.prototype.join.call(args, ' ')
		details = {}
	}
	else {
		message = args[0] || ''
		details = args[1] || {}

		if (typeof message !== 'string') {
			//console.warn('NPA2', { message })
			if (looksLikeAnError(message)) {
				//console.warn('NPA2b')
				// Another bad invocation
				// "best effort" fallback:
				err = message as Error
				message = err.message
			}
			else if (typeof message === 'object' && !details) {
				//console.warn('NPA2c')
				details = message as LogDetails
				message = ''
			}
			else {
				message = String(message)
			}
		}

		if (typeof details !== 'object') {
			//console.warn('NPA3', { details })
			// Another bad invocation
			// "best effort" fallback:
			message = [ message, String(details) ].join(' ')
			details = {}
		}

		err = err || details.err
		if (!err && looksLikeAnError(details)) {
			// details is in fact an error, extract it
			err = details as Error
			details = { err }
		}

		if (err) {
			err = {
				// make sure we preserve fields, Error is a special object
				...err,
				name: err.name,
				message: err.message,
			}
		}

		details = {
			...details,
			err,
		}

		message = message || details.message || (details.err && details.err.message) || ''
	}

	return [ message, details ]
}

export function create(
	{
		name = DEFAULT_LOGGER_KEY,
		suggestedLevel = DEFAULT_LOG_LEVEL,
		commonDetails = {},
	}: LoggerCreationParams,
	outputFn: LogSink = console.log,
): Logger {

	const internalState: BaseInternalLoggerState = {
		name,
		level: suggestedLevel, // so far
		commonDetails: {...commonDetails},
		outputFn,
	}

	let levelAsInt = 100 // so far

	const logger: Logger = ALL_LOG_LEVELS.reduce(
		(logger: any, level: LogLevel) => {
			const primitive: LogPrimitive = function (rawMessage?: string, rawDdetails?: LogDetails) {
				if (!isLevelEnabled(level)) return

				const [ message, details ] = normalizePrimitiveArguments(arguments)

				internalState.outputFn(serializer(level, message, details))
			}

			logger[level] = primitive

			return logger
		},
		{
			setLevel,
			getLevel,
			addCommonDetails,
		},
	) as Logger

	function setLevel(level: LogLevel) {
		checkLevel(level)

		internalState.level = level
		levelAsInt = LEVEL_TO_INTEGER[level]
	}
	setLevel(suggestedLevel)

	function isLevelEnabled(level: LogLevel) {
		checkLevel(level)

		return LEVEL_TO_INTEGER[level] <= levelAsInt
	}

	function getLevel() {
		return internalState.level
	}

	function addCommonDetails(details: Readonly<LogDetails>): void {
		if (details.err)
			throw new Error(`[${LIB}] Can't set reserved property "err"!`)

		internalState.commonDetails = {
			...internalState.commonDetails,
			...details,
		}
	}

	function serializer(level: LogLevel, msg: string, { err, ...details }: Readonly<LogDetails>): LogPayload {
		const payload: LogPayload = {
			level,
			name,
			msg,
			time: +(new Date()), // UTC timestamp
			details: {
				...internalState.commonDetails,
				...details,
			},
		}
		if (err)
			payload.err = err

		return payload
	}

	return logger
}
