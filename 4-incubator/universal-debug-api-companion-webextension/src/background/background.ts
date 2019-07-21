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
	MSG_TYPE__OVERRIDE_SPEC_CHANGED,
} from '../common/messages'
import {query_active_tab} from "./utils";

const LIB = '🧩 UWDT/bg'
// TODO clean logs!

console.log(`[${LIB}.${+Date.now()}] Hello from background!`, browser)

const extension_inited = new Deferred<void>()
let is_extension_inited = false
extension_inited.then(() => {
	is_extension_inited = true
	console.log(`🙈🙉 extension inited!`)
})
// TODO this doesn't seems right
// especially on browser restart
setTimeout(() =>
	extension_inited.reject(new Error('🙊 Timeout waiting for extension init!')),
	30 * 60 * 1000
)
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
	console.group('⚡️ on extension installed')
	Flux.on_init()
	extension_inited.resolve(query_active_tab().then(() => {}))
	console.groupEnd()
});

browser.tabs.onCreated.addListener((tab) => {
	console.group('⚡️ on tab created', { tab })
	if (!tab.id)
		console.warn('tab without id???')
	else
		Flux.ensure_tab('onCreated event', tab.id, tab)
	console.groupEnd()
})

// note that we can totally receive this event
// without having received any create() or activated()
// for ex. the extension just got installed
// and then anon-active tab updates its favicon = we receive this event
browser.tabs.onUpdated.addListener((tab_id, change_info, tab) => {
	console.group('⚡️ on tab updated', { tab_id, change_info, tab })
	Flux.ensure_tab('onUpdated event', tab_id, tab)
	if (tab.url)
		Flux.update_tab_origin(tab_id, tab.url)
	if (change_info.status === 'loading')
		Flux.on_tab_loading(tab_id)
	console.groupEnd()
})

browser.tabs.onActivated.addListener(({tabId, windowId}) => {
	console.group('⚡️ on tab activated', { tabId, windowId })
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
				/////// from content script ///////
				case MSG_TYPE__REPORT_IS_LIB_INJECTED: {
					assert(sender.tab, `${type}: is from a tab`)
					assert(sender.tab!.id, `${type}: is from a tab (2)`)
					const tab_id = sender.tab!.id!
					const { is_injected, url } = payload
					Flux.ensure_tab(`${type}`, tab_id, sender.tab)
					Flux.update_tab_origin(tab_id, url)
					Flux.report_lib_injection(tab_id, is_injected)
					break
				}

				case MSG_TYPE__REPORT_DEBUG_API_USAGE: {
					assert(sender.tab, `${type}: is from a tab`)
					assert(sender.tab!.id, `${type}: is from a tab (2)`)
					const tab_id = sender.tab!.id!
					Flux.ensure_tab(`${type}`, tab_id, sender.tab)
					Flux.report_debug_api_usage(tab_id, payload.reports)
					break
				}

				/////// from UI = popup ///////
				// no tab infos available from popup
				case MSG_TYPE__REQUEST_CURRENT_PAGE_RELOAD: {
					const tab_id = Flux.get_active_tab_id(`from ${type}`)
					browser.tabs.reload(tab_id)
					break
				}

				case MSG_TYPE__TOGGLE_LIB_INJECTION: {
					const tab_id = Flux.get_active_tab_id(`from ${type}`)
					Flux.toggle_lib_injection(tab_id)
					break
				}

				case MSG_TYPE__OVERRIDE_SPEC_CHANGED: {
					const tab_id = Flux.get_active_tab_id(`from ${type}`)
					const { key, partial } = payload
					 Flux.change_override_spec(tab_id, key, partial)
					 break
				}

				/////////////////////
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
	console.log(`⚡️ received connection "${name}"`, {port})

	Flux.update_port(name, port)

	switch (name) {
		case 'devtools':
		case 'popup':
			break
		default:
			console.error(`Unrecognized port name: "${name}"!`)
			break
	}
})

////////////////////////////////////
