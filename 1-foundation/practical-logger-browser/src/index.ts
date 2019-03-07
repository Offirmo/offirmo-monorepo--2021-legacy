import { LogLevel, Logger, LoggerCreationParams } from '@offirmo/practical-logger-interface'
import { createLogger as createLoggerCore, DEFAULT_LOGGER_KEY, DEFAULT_LOG_LEVEL, checkLevel } from '@offirmo/practical-logger-core'

import { sink } from './sink'


function getLogLevelLocalStorageKeyForLogger(name: string): string {
	return `_debug.logger.${name}.level`
}

function getLevelFromAboveForLogger(name: string): LogLevel | null {
	let logLevel: LogLevel | null = null
	try {
		const LSKey = getLogLevelLocalStorageKeyForLogger(name)
		logLevel = localStorage.getItem(LSKey) as (LogLevel | null)
		try {
			if (logLevel)
				checkLevel(logLevel)
			else
				logLevel = null
		}
		catch {
			logLevel = DEFAULT_LOG_LEVEL
			localStorage.setItem(LSKey, logLevel)
		}
		//console.log({name, LSKey, logLevel})
	}
	catch { /* ignore */ }

	return logLevel
}

function createLogger(p: Readonly<LoggerCreationParams>): Logger {
	const { name = DEFAULT_LOGGER_KEY } = p
	const logger = createLoggerCore(p, sink)

	const logLevelFromAbove = getLevelFromAboveForLogger(name)
	if (logLevelFromAbove) {
		logger.setLevel(logLevelFromAbove)
	}

	return logger
}


export {
	Logger,
	LoggerCreationParams,
	createLogger,
}
