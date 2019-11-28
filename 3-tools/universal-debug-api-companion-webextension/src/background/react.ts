import { browser } from 'webextension-polyfill-ts'
import memoize_one from 'memoize-one'

import * as Flux from './flux'
import { control_sjson } from '../common/utils/stringified-json'
import { LS_KEY_ENABLED } from '../common/consts'
import { create_msg_update_ui_state, create_msg_update_ls_state } from '../common/messages'
import { SpecSyncStatus } from '../common/state/tab'
import { getLSKeyForOverride } from '@offirmo/universal-debug-api-browser/src/v1/keys'

////////////////////////////////////

const render_webext_icon = memoize_one(function render_webext_icon(sync_status) {
	console.log('🔄 render_webext_icon', { sync_status })

	let text = '✗'
	let color = '#ff0000'

	switch(sync_status) {
		case SpecSyncStatus['unexpected-error']:
			break

		case SpecSyncStatus.inactive:
		case SpecSyncStatus.unknown: // because happen when the ext is freshly installed or reloaded in dev = most likely inactive
			text = ''
			break

		case SpecSyncStatus['changed-needs-reload']:
			text = '↻'
			color = '#f3b200'
			break

		case SpecSyncStatus['active-and-up-to-date']:
			text = '✔'
			color = '#00AA00'
			break

		default:
			console.error('Unknown sync_status!', { sync_status })
			break
	}

	// Note: it sets it for ALL tabs
	browser.browserAction.setBadgeText({ text })
	browser.browserAction.setBadgeBackgroundColor({ color })
})

Flux.icon_emitter.on('change', () => {
	const tab_sync_status = Flux.get_active_tab_sync_status()
	console.log('🔄 icon_emitter.onChange', { tab_sync_status, tab_id: Flux.get_active_tab_id('Flux.icon_emitter') })
	render_webext_icon(tab_sync_status)
})

////////////////////////////////////

function update_ui_state() {
	const port = Flux.get_port('popup')
	if (!port) {
		// popup is closed
		console.log('🔄 update_ui_state: no UI')
		return
	}
	console.group('🔄 update_ui_state…')

	const ui_state = Flux.get_active_tab_ui_state()
	console.log('📤 dispatching state to UI:', ui_state)
	port.postMessage(
		create_msg_update_ui_state(
			ui_state,
		),
	)
	console.groupEnd()
}

Flux.ui_emitter.on('change', () => {
	update_ui_state()
})

// TODO persist settings
//    browser.storage.local.set({'address': req.address})


////////////////////////////////////

function propagate_lib_config() {
	const current_tab_id = Flux.get_active_tab_id('from propagate_lib_config()')
	const origin_state = Flux.get_active_origin_state()
	console.group('🔄 propagate_lib_config', {current_tab_id, origin_state})

	const kv: { [k: string]: string | null } = {}

	kv[LS_KEY_ENABLED] = origin_state.is_injection_enabled ? 'true' : null

	Object.values(origin_state.overrides).forEach(spec => {
		const { key, is_enabled, value_sjson } = spec
		const LSKey = getLSKeyForOverride(key)
		kv[LSKey] = is_enabled
			? value_sjson
				? control_sjson(value_sjson)
				: null
			: null
	})

	console.log(`📤 dispatching origin config to content-script of tab#${current_tab_id}`, kv)
	browser.tabs.sendMessage(
		current_tab_id,
		create_msg_update_ls_state(
			kv,
		),
	)
		.catch(err => {
			const { message } = err
			if (message.includes('Receiving end does not exist')) {
				// the content script wasn't executed
				// most likely the extension just kot installed
				// or reloaded (dev)
				// ignore.
			}
			else {
				console.error(`propagate_lib_config when dispatching to tab#${current_tab_id}`, err)
			}
		})
	console.groupEnd()
}

Flux.cscript_emitter.on('change', () => {
	propagate_lib_config()
})

////////////////////////////////////
