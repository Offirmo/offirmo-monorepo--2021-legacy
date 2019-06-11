import 'babel-polyfill'

const LIB = '🧩 UWDT/bg'

console.log(`[${LIB}.${+Date.now()}] Hello from background!`, {
	browser: window.browser && window.browser.runtime,
	chrome,
})

////////////////////////////////////

// set it for ALL tabs
//chrome.browserAction.setBadgeText({ text: 'OK' })
//chrome.browserAction.setBadgeBackgroundColor({ color: "#00AA00"})

////////////////////////////////////
// https://developer.chrome.com/extensions/messaging#simple

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(`[${LIB}.${+Date.now()}] received a simple message from`, {
		sender,
		sender_x: sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension",
		request,
	})
})

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
