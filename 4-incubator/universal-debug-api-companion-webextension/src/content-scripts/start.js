//import 'babel-polyfill'

import {create_msg_report_lib_injected, ENTRY} from '../common/messages'

//import runInPageContext from '../utils/run-in-page-context'
import lib from './lib-to-inject'
import assert from "tiny-invariant"

const LIB = '🧩 UWDT/CS--start'
const DEBUG = true
const LS_KEY_ENABLED = '_debug.enabled'


if (DEBUG) console.log(`[${LIB}.${+Date.now()}] Hello!`, {
	chrome: chrome,
	document,
	'_debug.enabled': localStorage.getItem(LS_KEY_ENABLED) === 'true'
})

////////////////////////////////////

function onMessage(event) {
	console.log(`[${LIB}.${+Date.now()}] received postMessage:`, event.data)
}
const listenerOptions = {
	capture: false, // http://devdocs.io/dom/window/postmessage
}
window.addEventListener('message', onMessage, listenerOptions)
//window.postMessage({msg: `${LIB} - test`}, '*')

/*
setTimeout(() => {
	window.postMessage({
		message: `Test message from ${LIB}`,
	}, '*')
}, 2000)
*/

////////////////////////////////////
// https://developer.chrome.com/extensions/messaging#simple

/*
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(`[${LIB}.${+Date.now()}] received a simple message from`, {
		sender,
		sender_x: sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension",
		request,
	})
})
*/
/*
const port_to_bg = chrome.runtime.connect({name: "content-script"});
port_to_bg.onMessage.addListener((msg) => {
	console.log(`[${LIB}.${+Date.now()}] received a port message`, msg)
});
port_to_bg.postMessage({hello: "test"});
*/

////////////////////////////////////

if (localStorage.getItem(LS_KEY_ENABLED) === 'true') {
	// Create a script tag and inject it into the document.
	const scriptElement2 = document.createElement('script')
	scriptElement2.innerHTML = `
// https://stackoverflow.com/a/30106551/587407
function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

eval(b64DecodeUnicode("${lib}"))
`
	document.documentElement.prepend(scriptElement2)

	//port_to_bg.postMessage(create_msg_report_lib_injected())
	chrome.runtime.sendMessage(create_msg_report_lib_injected())
}

////////////////////////////////////

const port_to_bg = chrome.runtime.connect({name: "content-script"});
port_to_bg.onMessage.addListener((msg) => {
	console.log(`received a port message`, msg)
	assert(msg[ENTRY], 'ENTRY')
});
//port.postMessage({hello: "test"});
