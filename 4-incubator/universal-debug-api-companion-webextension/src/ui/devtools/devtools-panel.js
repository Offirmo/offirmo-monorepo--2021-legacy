console.log(`🧩 [T=${+Date.now()}] Hello from devtools-panel!`)

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

const port = chrome.runtime.connect({name: "devtools-panel"});
port.onMessage.addListener((msg) => {
	console.log(`[${LIB}.${+Date.now()}] received a port message`, msg)
});
port.postMessage({hello: "test"});
