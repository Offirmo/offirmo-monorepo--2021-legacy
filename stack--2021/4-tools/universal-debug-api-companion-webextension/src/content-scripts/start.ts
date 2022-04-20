//import { browser } from 'webextension-polyfill-ts' // NO! Too big, we only need a minimal subset
const browser = (globalThis as any).browser || (globalThis as any).chrome


import assert from 'tiny-invariant'

import { MSG_ENTRY, LS_KEY_ENABLED } from '../common/consts/content--start'
import {
	create_msg_report_is_lib_injected,
	MSG_TYPE__UPDATE_LS_STATE,
} from '../common/messages' // possible optim here with smaller import (see below)
import { MSG_TYPE__REPORT_DEBUG_API_USAGE } from '../common/messages/report-usage'

import lib1 from './lib-to-inject-1'
import lib2 from './lib-to-inject-2'

const LIB = '🧩 UWDT/CS--start'

let DEBUG = false
try { // defensive!
	DEBUG = DEBUG || !!window.localStorage.getItem('🧩UWDTi.context.debug')
} catch { /* swallow */ }

if (DEBUG) {
	console.log(`[${LIB},${Date.now()}] Hello!`, {
		browser,
		document,
		'_debug.enabled': localStorage.getItem(LS_KEY_ENABLED) === 'true',
	})
}

////////////////////////////////////

function onMessage(event: MessageEvent) {
	if (!event.data[MSG_ENTRY]) return // not for/from us

	if (DEBUG) console.group(`[${LIB},${Date.now()}] received postMessage:`, event.data)

	const payload = event.data[MSG_ENTRY]
	const { type } = payload
	if (DEBUG) console.log('message =', { type, payload })

	switch(type) {
		case MSG_TYPE__REPORT_DEBUG_API_USAGE:
			// forward to background
			browser.runtime.sendMessage(event.data)
			break
		default:
			if (DEBUG) console.error(`[${LIB},${Date.now()}] Unhandled postMessage type "${type}"!`)
			break
	}
	if (DEBUG) console.groupEnd()
}
const listenerOptions = {
	capture: false, // https://devdocs.io/dom/window/postmessage
}
window.addEventListener('message', onMessage, listenerOptions)


////////////////////////////////////

let should_inject = false
try { // defensive!
	should_inject = should_inject || localStorage.getItem(LS_KEY_ENABLED) === 'true'
} catch { /* swallow */ }

if (should_inject) {
	// Create a script tag and inject it into the document.

	// 1. de-stringifier
	// https://stackoverflow.com/a/30106551/587407
	const scriptElement0 = document.createElement('script')
	scriptElement0.innerHTML = `
// injected by the webextension "Offirmo’s Universal Web Dev Tool"
// = Utility to decode base 64 properly
// credits: https://stackoverflow.com/a/30106551/587407
function _UWDT_b64DecodeUnicode(str) {
	// Going backwards: from bytestream, to percent-encoding, to original string.
	return decodeURIComponent(atob(str).split('').map(function(c) {
	  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''))
}`
	document.documentElement.prepend(scriptElement0)

	// TODO download up-to-date Universal Web Debug API from somewhere?
	// not for now, not even published to npm.
	const scriptElement1 = document.createElement('script')
	scriptElement1.innerHTML = `
// injected by the webextension "Offirmo’s Universal Web Dev Tool"
// = Universal Web Debug API library, browser version
eval(_UWDT_b64DecodeUnicode("${lib1}"))
`
	document.documentElement.prepend(scriptElement1)

	const scriptElement2 = document.createElement('script')
	scriptElement2.innerHTML = `
// injected by the webextension "Offirmo’s Universal Web Dev Tool"
// = control code to communicate with the webextension
eval(_UWDT_b64DecodeUnicode("${lib2}"))
`
	document.documentElement.prepend(scriptElement2)

	// TODO allow 3rd-party addons (for the debug command feature)

	if (DEBUG) console.info(`[${LIB},${Date.now()}] UDA was injected from the webextension ✅`, {
		url: document.location.href,
		origin: document.location.origin,
	})
}
else {
	if (DEBUG) console.info(`[${LIB},${Date.now()}] UDA frow webext is disabled ❎`, {
		url: document.location.href,
		origin: document.location.origin,
	})
}

browser.runtime.sendMessage(
	create_msg_report_is_lib_injected(
		document.location.href,
		should_inject,
	),
)
// TODO a response in which we could have:
// extension debug mode?
// extra libs to inject?

////////////////////////////////////

browser.runtime.onMessage.addListener((request: any, sender: any): Promise<any> | void => {
	if (DEBUG) console.group(`[${LIB},${Date.now()}] 📥 received a simple message`)
	let response: any

	try {
		if (DEBUG) console.log({ sender })

		assert(request[MSG_ENTRY], 'MSG_ENTRY')
		const payload = request[MSG_ENTRY]
		const { type } = payload

		if (DEBUG) console.log({type, payload})

		// TODO only overwrite if not changed in the meantime?
		// TODO clean all overrides if disabled?
		// TODO actively refresh infos on UI open?

		switch (type) {
			case MSG_TYPE__UPDATE_LS_STATE: {
				Object.entries(payload.kv as { [k: string]: string | null }).forEach(([k, v]) => {
					if (DEBUG) console.log('updating LS entry:', {k, v})
					if (v === null)
						localStorage.removeItem(k)
					else
						localStorage.setItem(k, v)
				})
				break
			}
			default:
				if (DEBUG) console.error(`Unhandled msg type "${type}"!`)
				// TODO error report msg?
				break
		}
	}
	catch (err) {
		if (DEBUG) console.error(err)
		response = Promise.reject(err)
	}

	if (DEBUG) console.groupEnd()

	if (response)
		return Promise.resolve(response)
})
