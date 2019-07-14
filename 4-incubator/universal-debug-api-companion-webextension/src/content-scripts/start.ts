import { browser } from "webextension-polyfill-ts"
import assert from 'tiny-invariant'
import { LS_ROOT } from '@offirmo-private/universal-debug-api-full-browser/src/consts'

import { MSG_ENTRY } from '../common/consts'
import {
	create_msg_report_lib_injection,
	MSG_TYPE__INJECTION_TOGGLED,
	MSG_TYPE__REPORT_LIB_INJECTION
} from '../common/messages'

import lib1 from './lib-to-inject-1'
import lib2 from './lib-to-inject-2'

const LIB = '🧩 UWDT/CS--start'
const DEBUG = true
const LS_KEY_ENABLED = `${LS_ROOT}.enabled`
//let this_tab_origin = '???'
//let this_tab_id = browser.tabs.TAB_ID_NONE

if (DEBUG) console.log(`[${LIB}.${+Date.now()}] Hello!`, {
	browser,
	document,
	'_debug.enabled': localStorage.getItem(LS_KEY_ENABLED) === 'true'
})

////////////////////////////////////

function onMessage(event: MessageEvent) {
	console.log(`[${LIB}.${+Date.now()}] received postMessage:`, event.data)
	// TODO
}
const listenerOptions = {
	capture: false, // http://devdocs.io/dom/window/postmessage
}
window.addEventListener('message', onMessage, listenerOptions)
/*
setTimeout(() => {
	window.postMessage({
		message: `Test message from ${LIB}`,
	}, '*')
}, 2000)
*/

////////////////////////////////////

const should_inject = localStorage.getItem(LS_KEY_ENABLED) === 'true'
if (should_inject) {
	// Create a script tag and inject it into the document.

	const scriptElement0 = document.createElement('script')
	scriptElement0.innerHTML = `
// https://stackoverflow.com/a/30106551/587407
function _UWDT_b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}`
	document.documentElement.prepend(scriptElement0)

	const scriptElement1 = document.createElement('script')
	scriptElement1.innerHTML = `eval(_UWDT_b64DecodeUnicode("${lib1}"))`
	document.documentElement.prepend(scriptElement1)

	const scriptElement2 = document.createElement('script')
	scriptElement2.innerHTML = `eval(_UWDT_b64DecodeUnicode("${lib2}"))`
	document.documentElement.prepend(scriptElement2)

	console.info(`[${LIB}.${+Date.now()}] UWDT was injected from the webextension ✅`)
}
else {
	console.info(`[${LIB}.${+Date.now()}] UWDT frow webext is disabled ❎`)
}

browser.runtime.sendMessage(create_msg_report_lib_injection(should_inject))
	.then(response => {
		console.log(`[${LIB}.${+Date.now()}] response from initial msg:`, response)
	})

////////////////////////////////////

browser.runtime.onMessage.addListener((request, sender): Promise<any> | void => {
	console.group(`[${LIB}.${+Date.now()}] 📥 received a simple message`)
	let response: any

	try {
		console.log({ sender })

		assert(request[MSG_ENTRY], 'MSG_ENTRY')
		const payload = request[MSG_ENTRY]
		const { type } = payload

		console.log({type, payload})

		switch (type) {
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
