import {
	LogLevel,
	BaseInternalLoggerState,
	Logger,
	LoggerCreationParams,
	LogDetails,
	LogPayload,
	LogPrimitive,
	LogSink,
} from '@offirmo/practical-logger-types'

import {
	LIB,
	ALL_LOG_LEVELS,
	LOG_LEVEL_TO_INTEGER,
	DEFAULT_LOG_LEVEL,
	DEFAULT_LOGGER_KEY,
} from './consts'

import { normalizeArguments } from './normalize-args'

export function checkLevel(level: any): asserts level is LogLevel {
	if (!ALL_LOG_LEVELS.includes(level))
		throw new Error(`[${LIB}] Not a valid log level: "${level}"!`)
}

export function create(
	{
		name = DEFAULT_LOGGER_KEY,
		suggestedLevel = DEFAULT_LOG_LEVEL,
		forcedLevel,
		commonDetails = {},
	}: LoggerCreationParams = {},
	outputFn: LogSink = console.log,
): Logger {

	const internalState: BaseInternalLoggerState = {
		name,
		level: forcedLevel || suggestedLevel,
		commonDetails: {...commonDetails},
		outputFn,
	}

	let levelAsInt = 100 // so far

	const logger: Logger = ALL_LOG_LEVELS.reduce(
		(logger: any, level: LogLevel) => {
			const primitive: LogPrimitive = function (rawMessage?: string, rawDetails?: LogDetails) {
				if (!isLevelEnabled(level)) return

				const [ message, details ] = normalizeArguments(arguments)

				internalState.outputFn(serializer(level, message, details))
			}

			logger[level] = primitive

			return logger
		},
		{
			setLevel,
			getLevel,
			addCommonDetails,
			group() {},
			groupCollapsed() {},
			groupEnd() {},
		},
	)

	function setLevel(level: LogLevel) {
		checkLevel(level)

		internalState.level = level
		levelAsInt = LOG_LEVEL_TO_INTEGER[level]
	}
	setLevel(getLevel()) // to check it

	function isLevelEnabled(level: LogLevel) {
		checkLevel(level)

		return LOG_LEVEL_TO_INTEGER[level] <= levelAsInt
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
