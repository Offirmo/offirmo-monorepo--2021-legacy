
import { MSG_ENTRY } from './consts'
import * as OriginState from './state/origin'
import * as UIState from './state/ui'

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
export function create_msg_override_change(key: string, partial: Readonly<Partial<OriginState.OverrideState>>) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__OVERRIDE_CHANGED,
			key,
			partial,
		}
	}
}

export const MSG_TYPE__UPDATE_UI_STATE = 'update-ui-state'
export function create_msg_update_ui_state(state: Readonly<UIState.State>) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__UPDATE_UI_STATE,
			state,
		}
	}
}

export const MSG_TYPE__UPDATE_LS_STATE = 'update-ls-state'
export function create_msg_update_ls_state(state: Readonly<{ [k: string]: string | null }>) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__UPDATE_LS_STATE,
			state,
		}
	}
}
