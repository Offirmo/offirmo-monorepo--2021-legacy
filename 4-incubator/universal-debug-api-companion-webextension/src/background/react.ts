import { browser } from "webextension-polyfill-ts"

import * as Flux from './flux'
import { LS_KEY_ENABLED } from '../common/consts'
import { create_msg_update_ui_state, create_msg_update_ls_state } from '../common/messages'
import { SpecSyncStatus } from "../common/state/tab";
import {OverrideType} from "../common/state/origin";
import { getLSKeyForOverride } from '@offirmo-private/universal-debug-api-full-browser/src/v1/keys'

////////////////////////////////////

function render_webext_icon() {
	const sync_status = Flux.get_active_tab_sync_status()
	console.log('🔄 render_webext_icon', { sync_status })

	let text = '✗'
	let color = "#ff0000"

	switch(sync_status) {
		case SpecSyncStatus["changed-needs-reload"]:
			text = '↻'
			color = '#f3b200'
			break

		case SpecSyncStatus.inactive:
			text = ''
			break

		case SpecSyncStatus["active-and-up-to-date"]:
			text = '✔'
			color = "#00AA00"
			break
		default:
			console.error('Unknown sync_status!', { sync_status })
			break
	}

	// Note: it sets it for ALL tabs
	// TODO memoize?
	browser.browserAction.setBadgeText({ text })
	browser.browserAction.setBadgeBackgroundColor({ color })
}

Flux.icon_emitter.on('change', () => {
	render_webext_icon()
})

////////////////////////////////////

function update_ui_state() {
	console.log('🔄 update_ui_state')

	const port = Flux.get_port('popup')
	if (!port) return // UI must be down

	const ui_state = Flux.get_current_tab_ui_state()
	console.log('📤 dispatching state to UI:', ui_state)
	port.postMessage(
			create_msg_update_ui_state(
				ui_state,
			)
		)/*
		.catch(err => {
			console.erro('While dispatching state to UI:', err)
		})*/
}

Flux.ui_emitter.on('change', () => {
	update_ui_state()
})

//    browser.storage.local.set({'address': req.address})


////////////////////////////////////

function propagate_lib_config() {
	const current_tab_id = Flux.get_current_tab_id()
	const origin_state = Flux.get_active_origin_state()
	console.log('🔄 propagate_lib_config', {current_tab_id, origin_state})

	const kv: { [k: string]: string | null } = {}

	kv[LS_KEY_ENABLED] = origin_state.is_injection_enabled ? 'true' : null

	Object.values(origin_state.overrides).forEach(spec => {
		const { key, is_enabled, value_json } = spec
		const LSKey = getLSKeyForOverride(key)
		kv[LSKey] = is_enabled
			? value_json
			: null
	})

	console.log('📤 dispatching origin config to content-script of tab#' + current_tab_id, kv)
	browser.tabs.sendMessage(
			Flux.get_current_tab_id(),
			create_msg_update_ls_state(
				kv
			)
		)
		.catch(err => {
			const { message } = err
			//if (message.contxx)
			// the UI may not be open, no big deal
			console.error('TODO propagate_lib_config', err.message)
		})
}

Flux.cscript_emitter.on('change', () => {
	propagate_lib_config()
})

////////////////////////////////////
