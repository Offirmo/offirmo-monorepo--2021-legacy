import 'babel-polyfill'

console.log(`🧩 [T=${+Date.now()}] Hello from hello-world-browser-extension (background)`, {
	browser: window.browser && window.browser.runtime,
	chrome,
})

// set it for ALL tabs
//chrome.browserAction.setBadgeText({ text: 'OK' })
//chrome.browserAction.setBadgeBackgroundColor({ color: "#00AA00"})

chrome.runtime.onConnect.addListener(port => {
	console.log("In background script, received connection")

	const portFromCS = port;
	portFromCS.postMessage({greeting: "hi from background script!"});
	portFromCS.onMessage.addListener(m => {
		console.log("In background script, received message from content script")
		console.log(m.greeting);
	});
});
