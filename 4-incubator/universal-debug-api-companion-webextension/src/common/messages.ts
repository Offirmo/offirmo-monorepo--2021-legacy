
import { MSG_ENTRY } from './consts'
import { State, OverrideState } from './state/origin'

export const MSG_TYPE__INJECTION_TOGGLED = 'injection_toggled'
export function create_msg_toggle_lib_injection(to: boolean) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__INJECTION_TOGGLED,
			to,
		}
	}
}

export const MSG_TYPE__REPORT_LIB_INJECTION = 'is-injected'
export function create_msg_report_lib_injection(is_injected: boolean) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__REPORT_LIB_INJECTION,
			is_injected,
		}
	}
}

export const MSG_TYPE__API_ACTIVITY = 'activity'
export function create_msg_report_api_activity() {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__API_ACTIVITY,
			loggers: {
				// TODO
			},
			overrides: {
				// TODO
			}
		}
	}
}

export const MSG_TYPE__OVERRIDE_CHANGED = 'override-changed'
export function create_msg_override_change(key: string, partial: Readonly<Partial<OverrideState>>) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__OVERRIDE_CHANGED,
			key,
			partial,
		}
	}
}

export const MSG_TYPE__UPDATE_ORIGIN_STATE = 'update-origin-state'
export function create_msg_update_origin_state(state: Readonly<State>) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__UPDATE_ORIGIN_STATE,
			state,
		}
	}
}
