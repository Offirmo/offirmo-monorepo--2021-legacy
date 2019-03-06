import 'babel-polyfill'

import runInPageContext from '../utils/run-in-page-context'
//import install_debug_api from '../api/full'
import lib from './start-incontext'

const LIB = '🧩 UWDT/cs--start'

////////////////////////////////////
// experiment modifying js env
window.foo = window.foo || 'content-scripts/start v1'
try {
	// local files may not have local storage
	localStorage.setItem('foo', 'content-scripts/start v1')
}
catch {}

console.log(`[${LIB}.${+Date.now()}] Hello!`, {
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
// experiment fetching and checking time
fetch(chrome.runtime.getURL("api/full/index.js"))
	.then(x => x.text())
	.then(content => {
		console.log(`[${LIB}.${+Date.now()}] got fetch result "${content.slice(0, 16)}…"`)
	})
	.catch(console.error)

/*chrome.storage.StorageArea.get("api/full/index.js")
	.then(res => {
		console.log(`[${LIB}.${+Date.now()}] got storage result!`)
	})*/
////////////////////////////////////

let sent = false
window.addEventListener("message", (event) => {
	console.log(`[🧩 UWDT/cs--start.${+Date.now()}] received message:`, event);

	if(!sent) {
		sent = true
		window.postMessage({
           message: "Message from content-scripts/start"
       }, "*");
	}
});

const port = chrome.runtime.connect({name:"port-from-content-script"});
port.postMessage({greeting: "hello from content script"});

port.onMessage.addListener(function(m) {
	console.log(`[🧩 UWDT/cs--start.${+Date.now()}] received message from background script: `);
	console.log(m);
});

////////////////////////////////////

function do_stuff() {
	// experiment modifying js env
	window.foo = window.foo || 'content-scripts/start v1 in context'

	console.log(`[🧩 UWDT/cs--start.${+Date.now()}] Hello from INJECTED!`, {
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
runInPageContext(do_stuff)

////////////////////////////////////
/*
// Create a script tag and inject it into the document.
const scriptElement = document.createElement('script')
//scriptElement.setAttribute("type", "module");
scriptElement.src = 'from-companion-extension/xdebug-api.js'
document.documentElement.prepend(scriptElement);
//document.head.insertBefore(scriptElement, document.head.firstElementChild);
*/

// Create a script tag and inject it into the document.
const scriptElement2 = document.createElement('script')
//scriptElement.setAttribute("type", "module");
//scriptElement2.src = 'data:text/javascript;base64,' + lib
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

//scriptElement2.innerHTML = lib;
document.documentElement.prepend(scriptElement2);
//document.head.insertBefore(scriptElement, document.head.firstElementChild);



/*
runInPageContext(install_in_context)
function install_in_context() {
	// experiment modifying js env
	window.foo = window.foo || 'content-scripts/start v1 in context'


	console.log(`[🧩 UWDT/cs--start.${+Date.now()}] Hello!`, {
		foo_js: window.foo,
		foo_ls: (() => {
			try {
				// local files may not have local storage
				return localStorage.getItem('foo')
			}
			catch {}
		})(),
	})

	window.addEventListener("message", (event) => {
		console.log(`[🧩 UWDT/cs--start.${+Date.now()}] [IN CONTEXT] received message:`, event);
	});


	// experimenting communicating with the extension
	console.log(`[🧩 UWDT/cs--start.${+Date.now()}] [IN CONTEXT] sending message...`);
	window.postMessage({
		message: "Message from the page context"
	}, "*");
}
*/
