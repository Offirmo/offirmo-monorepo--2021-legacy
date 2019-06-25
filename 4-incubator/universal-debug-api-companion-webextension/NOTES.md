		"webRequest",
		"webRequestBlocking",


background.js

if (false) {
	// example of listening to requests
	// permissions needed
	// 		"webRequest",
	// 		"webRequestBlocking",
	chrome.webRequest.onBeforeRequest.addListener(
		details => {
			console.log('webRequest.onBeforeRequest' + details.url, details)
			if (details.url.endsWith('from-companion-extension/xdebug-api.js')) {
				console.log('matching!')
				return {
					redirectUrl: chrome.extension.getURL('api/full/index.js'),
				}
			}
		},
		// filters
		{
			//types: [ "main_frame", "sub_frame" ],
			urls: ['https://*/*', 'http://*/*'],
		},
		// extraInfoSpec
		[ 'blocking' ],
	)
}

////////////////////////////////////
// experiment fetching and checking time
/*fetch(chrome.runtime.getURL('api/full/index.js'))
	.then(x => x.text())
	.then(content => {
		console.log(`[${LIB}.${+Date.now()}] got fetch result "${content.slice(0, 16)}…" (${content.length/1000.}k)`)
		return chrome.storage.local.set({
			'api/full/index.js': content,
		})
	})
	.catch(console.error)
*/



chrome.runtime.sendMessage({message: `Test message from ${LIB}`}, function(response) {
	console.log(response);
});

/*
function do_stuff(DEBUG, LIB) {
	// experiment modifying js env
	window.foo = window.foo || 'content-scripts/start v1 in context'

	if (DEBUG) console.log(`[${LIB}.${+Date.now()}] Hello from INJECTED!`, {
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

runInPageContext(do_stuff, DEBUG, LIB)
*/



/*
const port = chrome.runtime.connect({name: 'port-from-content-script'})
port.postMessage({greeting: 'hello from content script'})

port.onMessage.addListener(function (m) {
	console.log(`[🧩 UWDT/cs--start.${+Date.now()}] received message from background script: `)
	console.log(m)
})
*/


/*chrome.storage.StorageArea.get("api/full/index.js")
	.then(res => {
		console.log(`[${LIB}.${+Date.now()}] got storage result!`)
	})*/


/*
document.addEventListener('click', event => {
	try {
		const { target: clicked_element } = event
		if (!clicked_element || !clicked_element.id)
			return

		console.log('on click', clicked_element.id)
		switch(clicked_element.id) {
			case 'notify': {
				chrome.notifications.create(
					{
						'type': 'basic',
						'iconUrl': chrome.extension.getURL('icons/icon_64x64.png'),
						'title': '[Universal web debug tool] notification',
						'message': '[Universal web debug tool] notif from popup',
					}
				)
				break
			}

			default:
				console.warn(`Unknown clickable id: "${clicked_element.id}!`)
				break
		}
	} catch (err) {
		console.error('on click', err)
	}
})

function do_sth() {
	chrome.tabs.query({active: true, currentWindow: true}, ([current_tab]) => {
		console.log('current tab')
	})
}
*/
