import { Immutable } from '@offirmo-private/ts-types'

import { MSG_ENTRY } from '../consts'
import * as OriginState from '../state/origin'
import * as UIState from '../state/ui'

export const MSG_TYPE__TOGGLE_LIB_INJECTION = 'toggle-lib-injection'
export function create_msg_toggle_lib_injection() {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__TOGGLE_LIB_INJECTION,
		},
	}
}

export const MSG_TYPE__REPORT_IS_LIB_INJECTED = 'report-is-lib-injected'
export function create_msg_report_is_lib_injected(url: string, is_injected: boolean) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__REPORT_IS_LIB_INJECTED,
			url, // needed because this event may follow updated=loading which resets the url
			is_injected,
		},
	}
}

export const MSG_TYPE__OVERRIDE_SPEC_CHANGED = 'change-override-spec'
export function create_msg_change_override_spec(key: string, partial: Readonly<Partial<OriginState.OverrideState>>) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__OVERRIDE_SPEC_CHANGED,
			key,
			partial,
		},
	}
}

export const MSG_TYPE__UPDATE_UI_STATE = 'update-ui-state'
export function create_msg_update_ui_state(state: Readonly<UIState.State>) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__UPDATE_UI_STATE,
			state,
		},
	}
}

export const MSG_TYPE__UPDATE_LS_STATE = 'update-ls-state'
export function create_msg_update_ls_state(kv: Readonly<{ [k: string]: string | null }>) {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__UPDATE_LS_STATE,
			kv,
		},
	}
}

export const MSG_TYPE__REQUEST_CURRENT_PAGE_RELOAD = 'request-current-page-reload'
export function create_msg_request_reload() {
	return {
		[MSG_ENTRY]: {
			type: MSG_TYPE__REQUEST_CURRENT_PAGE_RELOAD,
		},
	}
}

export * from './report-usage'
