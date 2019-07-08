import { browser } from "webextension-polyfill-ts"

import * as Flux from './flux'
import {create_msg_update_origin_state} from '../common/messages'
import {SyncStatus} from "../common/state/tab";

////////////////////////////////////

// Note: it sets it for ALL tabs
function render_webext_icon() {
	const sync_status = Flux.get_active_tab_sync_status()
	console.log('🔄 render_webext_icon', { sync_status })

	let text = '✗'
	let color = "#ff0000"

	switch(sync_status) {
		case SyncStatus["needs-reload"]:
			text = '↻'
			color = '#f3b200'
			break

		case SyncStatus.inactive:
			text = ''
			break

		case SyncStatus["active-and-up-to-date"]:
			text = '✔'
			color = "#00AA00"
			break
		default:
			console.error('Unknown sync_status!', { sync_status })
			break
	}

	// TODO memoize
	browser.browserAction.setBadgeText({ text })
	browser.browserAction.setBadgeBackgroundColor({ color })
}

Flux.icon_emitter.on('change', () => {
	render_webext_icon()
})

////////////////////////////////////

function update_ui_state() {
	console.warn('TODO update_ui_state')
	/*
	const port = get_port('popup')
	if (!port) return

	const origin_state = get_active_origin_state()

	console.log('📤 dispatching origin state to UI:', origin_state)
	port.postMessage(create_msg_update_origin_state(origin_state))
	 */
}

Flux.ui_emitter.on('change', () => {
	update_ui_state()
})

//    browser.storage.local.set({'address': req.address})


////////////////////////////////////

function propagate_lib_config() {
	console.warn('TODO propagate_lib_config')
	/*
	const port = get_port('content-script')
	if (!port) {
		console.warn('couldnt find content script port')
		return
	}

	const origin_state = get_active_origin_state()

	console.log('📤 dispatching origin config to content-script:', origin_state)
	port.postMessage(create_msg_update_origin_state(origin_state))
	*/
}

Flux.cscript_emitter.on('change', () => {
	propagate_lib_config()
})

////////////////////////////////////
