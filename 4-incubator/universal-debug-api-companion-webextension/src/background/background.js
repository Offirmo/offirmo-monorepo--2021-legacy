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

chrome.runtime.onConnect.addListener(port => {
	console.log(`[${LIB}.${+Date.now()}] received connection`)

	const portFromCS = port
	portFromCS.postMessage({greeting: 'hi from background script!'})
	portFromCS.onMessage.addListener(m => {
		console.log(`[${LIB}.${+Date.now()}] received message from content script`)
		console.log(m.greeting)
	})
})


