import { MSG_ENTRY } from '../consts/entry'
import { StringifiedJSON } from '../utils/stringified-json'

////////////////////////////////////

export interface OverrideReport {
	type: 'override'
	key: string
	default_value_sjson: StringifiedJSON
	existing_override_sjson: null | StringifiedJSON,
}
export interface LoggerReport { // TODO needed?
	type: 'logger'
}
export interface CommandReport {
	type: 'command'
}
export type Report = OverrideReport | LoggerReport | CommandReport

////////////////////////////////////

export const MSG_TYPE__REPORT_DEBUG_API_USAGE = 'report-usage'
export function create_msg_report_debug_api_usage(reports: Report[]) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__REPORT_DEBUG_API_USAGE,
			reports,
		},
	}
}
