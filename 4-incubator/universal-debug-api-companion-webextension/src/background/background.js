import 'babel-polyfill'
import assert from 'tiny-invariant'

import * as State from './state'
import './react'

import {
	ENTRY,
	MSG_TYPE__LIB_INJECTED,
	MSG_TYPE__INJECTION_TOGGLED,
	MSG_TYPE__OVERRIDE_CHANGED,
} from '../common/messages'

const LIB = '🧩 UWDT/bg'

console.log(`[${LIB}.${+Date.now()}] Hello from background!`, {
	browser: window.browser && window.browser.runtime,
	chrome,
})

////////////////////////////////////
// listen to some events
// https://developer.chrome.com/extensions/tabs

chrome.runtime.onInstalled.addListener(function() {
	console.log('onInstalled')
	State.on_init()
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log('⚡ tabs.onUpdated ', { tabId, changeInfo, tab })
	if (tab.url) {
		State.update_tab_origin(tabId, tab.url)
	}
	if (changeInfo.status === 'loading')
		State.question_lib_injection(tabId)
})

chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
	console.log('⚡ tabs.onActivated', { tabId, windowId })
	State.on_tab_activated(tabId)
})

////////////////////////////////////
// listen to simple messages from other parts of this extension
// https://developer.chrome.com/extensions/messaging#simple

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.group(`📥 received a simple message`)

	try {
		console.log(
			sender.tab
				? 'from a content script: ' + sender.tab.url
				: 'from an extension part',
			{ sender }
		)

		assert(request[ENTRY], 'ENTRY')
		const { type } = request[ENTRY]

		console.log(request[ENTRY])

		switch (type) {
			case MSG_TYPE__INJECTION_TOGGLED: {
				State.toggle_lib_injection()
				break
			}

			case MSG_TYPE__OVERRIDE_CHANGED: {
				const { key, partial } = request[ENTRY]
				State.update_override(key, partial)
				break
			}

			case MSG_TYPE__LIB_INJECTED: {
				assert(sender.tab, 'MSG_TYPE__LIB_INJECTED')
				const tab_id = sender.tab.id
				console.log({MSG_TYPE__LIB_INJECTED, tab_id})
				State.on_lib_injected(tab_id)
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
})

////////////////////////////////////
// listen to "port" messages from other parts of the extension

chrome.runtime.onConnect.addListener(port => {
	const { name } = port
	console.log(`[${LIB}.${+Date.now()}] received connection "${name}"`, {port})

	State.update_port(name, port)

	switch (name) {
		case 'devtools':
		case 'content-script':
		case 'popup':
			// nothing needed for now.
			//port.onMessage.addListener(on_content_script_message)
			break
		default:
			console.error(`Unrecognized port name: "${name}"!`)
			break
	}
})

function on_content_script_message(msg) {
	console.group(`📥 internal message received from content-script`)
	console.log(msg)

	assert(msg[ENTRY], 'ENTRY')
	console.error('unexpected!')
	console.groupEnd()
}
