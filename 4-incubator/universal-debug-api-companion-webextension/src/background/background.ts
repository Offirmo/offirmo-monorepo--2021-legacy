import assert from 'tiny-invariant'
import { browser } from "webextension-polyfill-ts"

import * as Flux from './flux'
import './react'

import { MSG_ENTRY } from '../common/consts'
import {
	MSG_TYPE__REPORT_LIB_INJECTION,
	MSG_TYPE__INJECTION_TOGGLED,
	MSG_TYPE__OVERRIDE_CHANGED,
} from '../common/messages'

const LIB = '🧩 UWDT/bg'

console.log(`[${LIB}.${+Date.now()}] Hello from background!`, {
	browser,
})

////////////////////////////////////
// listen to some events
// https://developer.browser.com/extensions/tabs

browser.runtime.onInstalled.addListener(function() {
	console.log('⚡  on extension installed')
	Flux.on_init()
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log('⚡ on tab updated', { tabId, changeInfo, tab })
	if (tab.url)
		Flux.update_tab_origin(tabId, tab.url)
	if (changeInfo.status === 'loading')
		Flux.on_tab_loading(tabId)
})

browser.tabs.onActivated.addListener(({tabId, windowId}) => {
	console.log('⚡ on tabs activated', { tabId, windowId })
	Flux.on_tab_activated(tabId)
})

////////////////////////////////////
// listen to simple messages from other parts of this extension
// https://developer.browser.com/extensions/messaging#simple

browser.runtime.onMessage.addListener((request, sender): Promise<any> | void => {
	console.group(`📥 received a simple message`)
	let response: any

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
			case MSG_TYPE__INJECTION_TOGGLED: {
				Flux.toggle_lib_injection()
				break
			}

			/*case MSG_TYPE__OVERRIDE_CHANGED: {
				const { key, partial } = request[MSG_ENTRY]
				Flux.update_override(key, partial)
				break
			}*/

			case MSG_TYPE__REPORT_LIB_INJECTION: {
				assert(sender.tab, 'MSG_TYPE__REPORT_LIB_INJECTION 1')
				assert(sender.tab!.id, 'MSG_TYPE__REPORT_LIB_INJECTION 2')

				const tab_id = sender.tab!.id!
				const { is_injected } = payload
				console.log({MSG_TYPE__LIB_INJECTED: MSG_TYPE__REPORT_LIB_INJECTION, tab_id})
				Flux.report_lib_injection(tab_id, is_injected)
				response = {
					tab_id,
					tab_origin: Flux.get_tab_origin(tab_id),
				}
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
/*
function on_content_script_message(msg) {
	console.group(`📥 internal message received from content-script`)
	console.log(msg)

	assert(msg[MSG_ENTRY], 'MSG_ENTRY')
	console.error('unexpected!')
	console.groupEnd()
}
*/
