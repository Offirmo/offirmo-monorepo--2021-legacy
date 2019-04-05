import 'babel-polyfill'

import runInPageContext from '../utils/run-in-page-context'
import lib from './start-incontext'

const LIB = '🧩 UWDT/cs--start'
const DEBUG = true

////////////////////////////////////
// experiment modifying js env
window.foo = window.foo || 'content-scripts/start v1'
try {
	// local files may not have local storage
	localStorage.setItem('foo', 'content-scripts/start v1')
} catch {
}

if (DEBUG) console.log(`[${LIB}.${+Date.now()}] Hello!`, {
	chrome: chrome,
	document,
	foo_js: window.foo,
	foo_ls: (() => {
		try {
			// local files may not have local storage
			return localStorage.getItem('foo')
		} catch {
		}
	})(),
})

////////////////////////////////////

/*chrome.storage.StorageArea.get("api/full/index.js")
	.then(res => {
		console.log(`[${LIB}.${+Date.now()}] got storage result!`)
	})*/

////////////////////////////////////

/*
let sent = false
window.addEventListener('message', (event) => {
	console.log(`[🧩 UWDT/cs--start.${+Date.now()}] received message:`, event)

	if (!sent) {
		sent = true
		window.postMessage({
			message: 'Message from content-scripts/start',
		}, '*')
	}
})

const port = chrome.runtime.connect({name: 'port-from-content-script'})
port.postMessage({greeting: 'hello from content script'})

port.onMessage.addListener(function (m) {
	console.log(`[🧩 UWDT/cs--start.${+Date.now()}] received message from background script: `)
	console.log(m)
})
*/

////////////////////////////////////

function do_stuff(DEBUG) {
	// experiment modifying js env
	window.foo = window.foo || 'content-scripts/start v1 in context'

	if (DEBUG) console.log(`[🧩 UWDT/cs--start.${+Date.now()}] Hello from INJECTED!`, {
		foo_js: window.foo,
		foo_ls: (() => {
			try {
				// local files may not have local storage
				return localStorage.getItem('foo')
			} catch {
			}
		})(),
	})
}

runInPageContext(do_stuff, DEBUG)

////////////////////////////////////

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

