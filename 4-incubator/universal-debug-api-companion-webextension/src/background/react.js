import { browser } from "webextension-polyfill-ts"
import {
	get as get_state,
	get_port,
	icon_emitter,
	ui_emitter,
	cscript_emitter,
	get_active_origin_state,
} from './state'
import {create_msg_update_origin_state} from '../common/messages'

////////////////////////////////////

function render_webext_icon(state) {
	console.log('🔄 render_webext_icon')
	const current_tab_id = state.active_tab_id
	const origin_state = get_active_origin_state({should_assert: false})

	// Note: it sets it for ALL tabs

	if (state.is_tab_injected[current_tab_id] && origin_state && origin_state.is_eligible && origin_state.is_injection_enabled) {
		browser.browserAction.setBadgeText({ text: '✔' })
		browser.browserAction.setBadgeBackgroundColor({ color: "#00AA00"})
	}
	else {
		browser.browserAction.setBadgeText({ text: '' })
		browser.browserAction.setBadgeBackgroundColor({ color: "#aaaaaa"})
	}
}
render_webext_icon(get_state())

icon_emitter.on('change', () => {
	render_webext_icon(get_state())
})

////////////////////////////////////

function update_ui_state() {
	const port = get_port('popup')
	if (!port) return

	const origin_state = get_active_origin_state()

	console.log('📤 dispatching origin state to UI:', origin_state)
	port.postMessage(create_msg_update_origin_state(origin_state))
}

ui_emitter.on('change', () => {
	update_ui_state()
})

//    browser.storage.local.set({'address': req.address})


////////////////////////////////////

function propagate_lib_config() {
	const port = get_port('content-script')
	if (!port) {
		console.warn('couldnt find content script port')
		return
	}

	const origin_state = get_active_origin_state()

	console.log('📤 dispatching origin config to content-script:', origin_state)
	port.postMessage(create_msg_update_origin_state(origin_state))
}

cscript_emitter.on('change', () => {
	propagate_lib_config()
})

////////////////////////////////////
