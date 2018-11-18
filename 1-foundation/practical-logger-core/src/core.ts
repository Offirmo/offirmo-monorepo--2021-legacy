import { Enum } from 'typescript-string-enums'

import { get_human_readable_UTC_timestamp_ms_v1 } from '@offirmo/timestamps'

import {
	LogLevel,
	InternalLoggerState,
	Logger,
	LogParams,
	Details,
	Payload,
	OutputFn,
} from './types'

import {
	LIB,
	ALL_LOG_LEVELS,
	LEVEL_TO_INTEGER,
} from './const'

declare const console: any

function checkLevel(level: LogLevel) {
	if (!Enum.isType(LogLevel, level))
		throw new Error(`${LIB}: checkLevel(): Not a valid log level: "${level}"!`)
}

interface CreateParams extends LogParams {
	outputFn?: OutputFn,
}

function createLogger({
	name,
	level = LogLevel.info,
	details = {},
	outputFn = console.log,
}: CreateParams): Logger {

	if (!name)
		throw new Error(`${LIB}.${createLogger.name}(): you must provide a name!`)

	const internalState: InternalLoggerState = {
		name,
		level,
		details: {...details},
		outputFn: outputFn,
	}
	let level_int = 0

	const logger: Logger = ALL_LOG_LEVELS.reduce((logger: any, level: LogLevel) => {
		logger[level] = (message?: string, details?: Details) => {
			if (!isLevelEnabled(level)) return

			if (!details && typeof message === 'object') {
				details = (message as Details)
				message = details.err
					? details.err.message
					: ''
			}
			message = message || ''
			outputFn(serializer(level, message as string, details as Details))
		}
		return logger
	}, {
		_: internalState,
		isLevelEnabled,
		setLevel,
		getLevel,
		addDetails,
		//child,
	}) as Logger

	function setLevel(level: LogLevel) {
		checkLevel(level)

		internalState.level = level
		level_int = LEVEL_TO_INTEGER[level]
	}
	setLevel(level)

	function isLevelEnabled(level: LogLevel) {
		checkLevel(level)

		return LEVEL_TO_INTEGER[level] >= level_int
	}

	function getLevel() {
		return internalState.level
	}

	function addDetails(details: Details): void {
		internalState.details = {
			...internalState.details,
			...details,
		}
	}

	// TODO child
	/*
	function child({name, level, details}: Partial<LogParams>): Logger {
		return createChildLogger({
			parent: logger,
			name,
			level,
			details,
		})
	}
	*/

	function serializer(level: LogLevel, msg: string, details: Details): Payload {
		const payload: Payload = {
			details: {
				...internalState.details,
				...details,
			},
			level,
			name,
			time: get_human_readable_UTC_timestamp_ms_v1(),
			//time: (new Date()).toISOString(),
			msg,
		}

		return payload
	}

	return logger
}



export {
	CreateParams,
	createLogger,
}
