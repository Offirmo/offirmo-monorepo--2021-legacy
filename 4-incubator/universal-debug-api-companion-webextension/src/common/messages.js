
export const ENTRY = 'UWDT.v0'


export const MSG_TYPE__INJECTION_TOGGLED = 'injection_toggled'
export function create_msg_toggle_lib_injection(to) {
	return {
		[ENTRY]: {
			type: MSG_TYPE__INJECTION_TOGGLED,
			to,
		}
	}
}

export const MSG_TYPE__LIB_INJECTED = 'injected'
export function create_msg_report_lib_injected() {
	return {
		[ENTRY]: {
			type: MSG_TYPE__LIB_INJECTED,
		}
	}
}

export const MSG_TYPE__API_ACTIVITY = 'activity'
export function create_msg_report_api_activity() {
	return {
		[ENTRY]: {
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
export function create_msg_override_change(key, partial) {
	return {
		[ENTRY]: {
			type: MSG_TYPE__OVERRIDE_CHANGED,
			key,
			partial,
		}
	}
}

export const MSG_TYPE__UPDATE_ORIGIN_STATE = 'update-origin-state'
export function create_msg_update_origin_state(state) {
	return {
		[ENTRY]: {
			type: MSG_TYPE__UPDATE_ORIGIN_STATE,
			state,
		}
	}
}
