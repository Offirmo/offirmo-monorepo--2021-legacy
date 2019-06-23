import 'babel-polyfill'
import assert from 'tiny-invariant'

import * as State from './state'
import './render'

import { ENTRY, MSG_TYPE__LIB_INJECTED } from '../common/messages'

const LIB = '🧩 UWDT/bg'

console.log(`[${LIB}.${+Date.now()}] Hello from background!`, {
	browser: window.browser && window.browser.runtime,
	chrome,
})

////////////////////////////////////

// https://developer.chrome.com/extensions/tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log('⚡ tabs.onUpdated ', { tabId, changeInfo, tab })
	if (changeInfo.status === 'loading')
		State.question_lib_injection(tabId)
})
chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
	console.log('⚡ tabs.onActivated', { tabId, windowId })
	State.on_tab_activated(tabId)
})

////////////////////////////////////
// https://developer.chrome.com/extensions/messaging#simple

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.group(`📩 received a simple message`)
	console.log(sender.tab ?
		"from a content script: " + sender.tab.url :
		"from the extension"
	)
	console.log({
		sender,
		request,
	})

	assert(request[ENTRY], 'ENTRY')

	const { type } = request[ENTRY]
	switch (type) {
		case MSG_TYPE__LIB_INJECTED: {
			assert(sender.tab, 'MSG_TYPE__LIB_INJECTED')
			const tab_id = sender.tab.id
			console.log({MSG_TYPE__LIB_INJECTED, tab_id})
			State.on_lib_injected(tab_id)
			//sendResponse()
			break
		}
		default:
			console.error(`Unhandled msg type "${type}"!`)
			break
	}

	console.groupEnd()
})

////////////////////////////////////


const ports = {
	popup: null,
	options: null,
	devtools: null,
}

chrome.runtime.onConnect.addListener(port => {
	const { name } = port
	console.log(`[${LIB}.${+Date.now()}] received connection "${name}"`, {port})

	if (ports[name])
		console.error(`duplicated connection "${name}"??`)

	ports[name] = port

	switch (name) {
		case 'devtools':
			// TODO
			break
		case 'content-script':
			//port.onMessage.addListener(on_content_script_message)
			break
		default:
			console.error(`Unrecognized port name: "${name}"!`)
			break
	}
})

function on_content_script_message(msg) {
	console.group(`📩 internal message received from content-script`)
	console.log(msg)

	assert(msg[ENTRY], 'ENTRY')
	console.error('unexpected!')
	console.groupEnd()
}


//    chrome.storage.local.set({'address': req.address})
