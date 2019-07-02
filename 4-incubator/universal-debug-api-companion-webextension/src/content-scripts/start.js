import { LS_ROOT } from '@offirmo-private/universal-debug-api-full-browser/src/consts'
import { MSG_ENTRY, create_msg_report_lib_injection, MSG_TYPE__UPDATE_ORIGIN_STATE } from '../common/messages'

//import runInPageContext from '../utils/run-in-page-context'
import lib1 from './lib-to-inject-1'
import lib2 from './lib-to-inject-2'

const LIB = '🧩 UWDT/CS--start'
const DEBUG = true
const LS_KEY_ENABLED = `${LS_ROOT}.enabled`
let this_tab_origin = '???'
let this_tab_id = -1

if (DEBUG) console.log(`[${LIB}.${+Date.now()}] Hello!`, {
	chrome: chrome,
	document,
	'_debug.enabled': localStorage.getItem(LS_KEY_ENABLED) === 'true'
})

////////////////////////////////////

function onMessage(event) {
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

chrome.runtime.sendMessage(create_msg_report_lib_injection(should_inject), (response) => {
	console.log(`[${LIB}.${+Date.now()}] response from initial msg:`, response)
})

////////////////////////////////////

/*
const port_to_bg = chrome.runtime.connect({name: "content-script"});
port_to_bg.onMessage.addListener((msg) => {
	console.group(`[${LIB}.${+Date.now()}] 📥 received a port message`, msg)
	console.assert(msg[MSG_ENTRY], 'MSG_ENTRY')

	const payload = msg[MSG_ENTRY]
	const type = payload.type
	switch (type) {
		case MSG_TYPE__UPDATE_ORIGIN_STATE: {
			const origin_state = payload.state
			if (origin_state.is_injection_enabled)
				localStorage.setItem(LS_KEY_ENABLED, 'true')
			else
				localStorage.removeItem(LS_KEY_ENABLED)
			break
		}

		default:
			console.error(`Unhandled message "${type}"!`)
			break
	}
	console.groupEnd()
})
*/
