import { Immutable } from '@offirmo-private/ts-types'

import { State, LogEntry } from './types'
import {
	is_browser_connected_to_a_network,
	is_browser_page_visible,
} from './selectors'

////////////////////////////////////

const MAX_LOG_LINES = 10

function _log(state: Immutable<State>, log_line: string): Immutable<State> {
	const now_tms = +(new Date())

	const new_log: LogEntry = {
		date: now_tms,
		text: log_line
	}

	let recent_logs = [...state.log]
	const first_log = recent_logs.slice(0, 1)
	recent_logs.shift()
	recent_logs = recent_logs.slice(-1 * MAX_LOG_LINES + 1)

	if (state.log.length >= MAX_LOG_LINES) {
		recent_logs[0] = {
			date: first_log[0].date,
			text: '(…)',
		}
	}

	return {
		...state,
		log: [
			...first_log,
			...recent_logs,
			new_log,
		],
	}
}

////////////////////////////////////

export function create(): Immutable<State> {
	return _log({
		revision: 0,

		cloud_sync_state: {},
		log: [],
	}, 'init (page loaded)')
}

export function log_anything(state: Immutable<State>, log_line: string): Immutable<State> {
	state = {
		...state,
		revision: state.revision + 1,
	}
	return _log(state, log_line)
}
/*
export function on_visibility_change(state: Immutable<State>): Immutable<State> {
	state = {
		...state,
		revision: state.revision + 1,
	}
	return _log(state, '⚡️visibility changed to: ' + is_browser_page_visible())
}
/*
export function on_network_connectivity_change(state: Immutable<State>): Immutable<State> {
	state = {
		...state,
		revision: state.revision + 1,
	}
	return _log(state, '⚡️network connectivity changed to: ' + is_browser_connected_to_a_network())
}*/

// alias for clarity
export function report_shared_state_change(state: Immutable<State>, log_line: string): Immutable<State> {
	return log_anything(state, log_line)
}

export function report_data_not_synced_with_the_cloud(state: Immutable<State>, id: string): Immutable<State> {
	return {
		...state,

		cloud_sync_state: {
			...state.cloud_sync_state,

			[id]: false,
		},

		revision: state.revision + 1,
	}
}

export function report_data_synced_with_the_cloud(state: Immutable<State>, id: string): Immutable<State> {
	return {
		...state,

		cloud_sync_state: {
			...state.cloud_sync_state,

			[id]: true,
		},

		revision: state.revision + 1,
	}
}

