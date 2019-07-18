import assert from 'tiny-invariant'
import { browser } from 'webextension-polyfill-ts'
import Deferred from '@offirmo/deferred'

import * as Flux from './flux'
import './react'

import { MSG_ENTRY } from '../common/consts'
import {
	MSG_TYPE__REPORT_IS_LIB_INJECTED,
	MSG_TYPE__TOGGLE_LIB_INJECTION,
	MSG_TYPE__REQUEST_CURRENT_PAGE_RELOAD,
	MSG_TYPE__REPORT_DEBUG_API_USAGE,
} from '../common/messages'
import {query_active_tab} from "./utils";

const LIB = '🧩 UWDT/bg'

console.log(`[${LIB}.${+Date.now()}] Hello from background!`, browser)

const extension_inited = new Deferred<void>()
let is_extension_inited = false
extension_inited.then(() => {
	is_extension_inited = true
	console.log(`🙈🙉 extension inited!`)
})
setTimeout(() => extension_inited.reject(new Error('Timeout waiting for extension init!')), 15_000)
function once_extension_init_done<T>(cb: () => T): Promise<T> {
	// we want sync as much as possible
	if (is_extension_inited)
		return Promise.resolve(cb())

	return extension_inited.then(cb)
}


////////////////////////////////////
// listen to some events
// https://developer.browser.com/extensions/tabs

browser.runtime.onInstalled.addListener(function() {
	console.group('⚡  on extension installed')
	Flux.on_init()
	extension_inited.resolve(query_active_tab().then(() => {}))
	console.groupEnd()
});

browser.tabs.onCreated.addListener((tab) => {
	console.group('⚡ on tab created', { tab })
	if (!tab.id)
		console.warn('tab without id???')
	else
		Flux.ensure_tab(tab.id, tab)
	console.groupEnd()
})

browser.tabs.onUpdated.addListener((tab_id, change_info, tab) => {
	console.group('⚡ on tab updated', { tab_id, change_info, tab })
	Flux.ensure_tab(tab_id, tab)
	if (tab.url)
		Flux.update_tab_origin(tab_id, tab.url)
	if (change_info.status === 'loading')
		Flux.on_tab_loading(tab_id)
	console.groupEnd()
})

browser.tabs.onActivated.addListener(({tabId, windowId}) => {
	console.group('⚡ on tab activated', { tabId, windowId })
	Flux.on_tab_activated(tabId)
	console.groupEnd()
})

////////////////////////////////////
// listen to simple messages from other parts of this extension
// https://developer.browser.com/extensions/messaging#simple

browser.runtime.onMessage.addListener((request, sender): Promise<any> | void => {
	// FF refreshes content script before the background script starts to receive events
	return once_extension_init_done(() => {
		console.group(`📥 bg received a simple message`)
		let response: any = null

		try {
			console.log(
				sender.tab
					? 'from a content script: ' + sender.tab.url
					: 'from an extension part',
				{ sender }
			)

			assert(request[MSG_ENTRY], 'MSG_ENTRY')
			const payload = request[MSG_ENTRY]
			const { type } = payload

			console.log({type, payload})

			switch (type) {
				case MSG_TYPE__REQUEST_CURRENT_PAGE_RELOAD: {
					browser.tabs.reload(Flux.get_current_tab_id())
					break
				}

				case MSG_TYPE__TOGGLE_LIB_INJECTION: {
					Flux.toggle_lib_injection()
					break
				}

				case MSG_TYPE__REPORT_DEBUG_API_USAGE: {
					assert(sender.tab, `MSG_TYPE__REPORT_DEBUG_API_USAGE is from a tab`)
					assert(sender.tab!.id, `MSG_TYPE__REPORT_DEBUG_API_USAGE is from a tab (2)`)
					Flux.report_debug_api_usage(sender.tab!.id!, payload.reports)
					break
				}

				/*case MSG_TYPE__OVERRIDE_SPEC_CHANGED: {
                   const { key, partial } = request[MSG_ENTRY]
                   Flux.update_override(key, partial)
                   break
               }*/

				case MSG_TYPE__REPORT_IS_LIB_INJECTED: {
					assert(sender.tab, 'MSG_TYPE__REPORT_IS_LIB_INJECTED 1')
					assert(sender.tab!.id, 'MSG_TYPE__REPORT_IS_LIB_INJECTED 2')

					const tab_id = sender.tab!.id!
					const { is_injected, url } = payload
					console.log({tab_id, is_injected})
					Flux.ensure_tab(tab_id, sender.tab)
					Flux.update_tab_origin(tab_id, url)
					Flux.report_lib_injection(tab_id, is_injected)
					break
				}
				default:
					console.error(`Unhandled msg type "${type}"!`)
					break
			}
		}
		catch (err) {
			console.error(err)
		}

		console.groupEnd()

		if (response)
			return Promise.resolve(response)

		return null
	})
})

////////////////////////////////////
// listen to "port" messages from other parts of the extension

browser.runtime.onConnect.addListener(port => {
	const { name } = port
	console.log(`[${LIB}.${+Date.now()}] received connection "${name}"`, {port})

	Flux.update_port(name, port)

	switch (name) {
		case 'devtools':
		case 'popup':
			// nothing needed for now.
			//port.onMessage.addListener(on_content_script_message)
			break
		default:
			console.error(`Unrecognized port name: "${name}"!`)
			break
	}
})

////////////////////////////////////
