// base to be directly importable from other modules
// without a full lib penalty.
// This a very very specific use case, don't mind.

import { LogLevel } from '@offirmo/practical-logger-types'

export const DEFAULT_LOG_LEVEL: LogLevel = 'error'
export const DEFAULT_LOGGER_KEY = '' // yes, can be used as a key
