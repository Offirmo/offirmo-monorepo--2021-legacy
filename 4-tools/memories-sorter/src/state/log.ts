import { Immutable } from '@offirmo-private/ts-types'
import {
	LogLevel,
	LogDetails,
	Logger,
	LogPayload,
	ALL_LOG_LEVELS,
	normalizeArguments,
} from '@offirmo/practical-logger-core'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

interface WithLogs {
	logs: {
		[level: string]: {
			[msg: string]: LogPayload
		}
	}
}

interface StatefulLogger<State extends WithLogs> extends Logger {
	get_state: () => State
}

//////////// Selectors ////////////

/*
export function get_logger<State extends WithLogs>(state: Immutable<State>, existing_logger: Immutable<Logger>): StatefulLogger<State> {

	function get_state() {
		return state
	}

	return {
		...logger,
		get_state,
	}
}
*/

//////////// reducers ////////////

export function create(): WithLogs {
	return {
		logs: ALL_LOG_LEVELS.reduce((acc: WithLogs['logs'], level: LogLevel) => {
			acc[level] = {}
			return acc
		}, {} as WithLogs['logs'])
	}
}

function _log(state: Immutable<WithLogs>, level: LogLevel, rawMessage?: string, rawDetails?: LogDetails, logger?: Logger): Immutable<WithLogs> {
	const [ msg, { err, ...details } ]: [ string, LogDetails ] = normalizeArguments([rawMessage, rawDetails])
	return {
		...state,
		logs: {
			...state.logs,
			[level]: {
				...state.logs[level],
				[msg]: state.logs[level][msg] || {
					name: '',
					time: get_UTC_timestamp_ms(),
					level,
					msg,
					err,
					details,
				} as LogPayload
			}
		}
	}
}

export function log_fatal(state: Immutable<WithLogs>, rawMessage?: string, rawDetails?: LogDetails, logger?: Logger): Immutable<WithLogs> {
	return _log(state, 'fatal', rawMessage, rawDetails, logger)
}
/*export function log_fatal(state: Immutable<WithLogs>, rawMessage?: string, rawDetails?: LogDetails, logger?: Logger): Immutable<WithLogs> {
	return _log(state, 'fatal', rawMessage, rawDetails, logger)
}
export function log_fatal(state: Immutable<WithLogs>, rawMessage?: string, rawDetails?: LogDetails, logger?: Logger): Immutable<WithLogs> {
	return _log(state, 'fatal', rawMessage, rawDetails, logger)
}
export function log_fatal(state: Immutable<WithLogs>, rawMessage?: string, rawDetails?: LogDetails, logger?: Logger): Immutable<WithLogs> {
	return _log(state, 'fatal', rawMessage, rawDetails, logger)
}*/
/*
| 'emerg'
| 'alert'
| 'crit'
| 'error'
| 'warning'
| 'warn'
| 'notice'
| 'info'
| 'verbose'
| 'log'
| 'debug'
| 'trace'
| 'silly'
*/
