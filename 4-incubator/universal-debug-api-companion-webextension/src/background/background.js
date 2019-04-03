import 'babel-polyfill'

const LIB = '🧩 UWDT/bg'

console.log(`[${LIB}.${+Date.now()}] Hello from background!`, {
	browser: window.browser && window.browser.runtime,
	chrome,
})


////////////////////////////////////
// experiment fetching and checking time
fetch(chrome.runtime.getURL('api/full/index.js'))
	.then(x => x.text())
	.then(content => {
		console.log(`[${LIB}.${+Date.now()}] got fetch result "${content.slice(0, 16)}…" (${content.length/1000.}k)`)
		return chrome.storage.local.set({
			'api/full/index.js': content,
		})
	})
	.catch(console.error)

////////////////////////////////////

// set it for ALL tabs
//chrome.browserAction.setBadgeText({ text: 'OK' })
//chrome.browserAction.setBadgeBackgroundColor({ color: "#00AA00"})

////////////////////////////////////

chrome.runtime.onConnect.addListener(port => {
	console.log(`[${LIB}.${+Date.now()}] received connection`)

	const portFromCS = port
	portFromCS.postMessage({greeting: 'hi from background script!'})
	portFromCS.onMessage.addListener(m => {
		console.log(`[${LIB}.${+Date.now()}] received message from content script`)
		console.log(m.greeting)
	})
})

// example of listening to requests
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
