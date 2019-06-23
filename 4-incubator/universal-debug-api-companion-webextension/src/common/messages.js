
export const ENTRY = 'UWDT.v0'


export const MSG_TYPE__INJECTION_TOGGLED = 'injection_toggled'
export function create_msg_injection_toggled() {
	return {
		[ENTRY]: {
			type: MSG_TYPE__INJECTION_TOGGLED,
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

export const MSG_TYPE__OVERRIDE_TOGGLED = 'override_toggled'
export function create_msg_override_toggled(id) {
	return {
		[ENTRY]: {
			type: MSG_TYPE__OVERRIDE_TOGGLED,
			id,
		}
	}
}
