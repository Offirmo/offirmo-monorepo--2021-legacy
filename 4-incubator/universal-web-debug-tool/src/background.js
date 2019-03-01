import 'babel-polyfill'

console.log(`🧩 [T=${+Date.now()}] Hello from hello-world-browser-extension (background)`, {
	browser: window.browser && window.browser.runtime,
	chrome,
})

chrome.contextMenus.create({
	id: "hello-world-browser-extension-1",
	title: "option 1",
	contexts: ["all"]
})

chrome.contextMenus.create({
	id: "hello-world-browser-extension-2",
	title: "option 2",
	contexts: ["all"]
})

/*
chrome.notifications.create(
	{
		"type": "basic",
		"iconUrl": chrome.extension.getURL("icons/icon_48x48.png"),
		"title": "hello-world-browser-extension notification",
		"message": "hello-world-browser-extension notif from background"
	}
)
*/

// set it for ALL tabs
chrome.browserAction.setBadgeText({ text: 'OK' })
chrome.browserAction.setBadgeBackgroundColor({ color: "#00AA00"})

// example of listening to requests
chrome.webRequest.onCompleted.addListener(
	details => {
		console.log('webRequest.onCompleted', details)
	},
	// filters
	{
		types: [ "main_frame", "sub_frame" ],
		urls: ['https://*/*', 'http://*/*']
	},
	// extraInfoSpec
	[],
);

chrome.runtime.onConnect.addListener(port => {
	portFromCS = port;
	portFromCS.postMessage({greeting: "hi from background script!"});
	portFromCS.onMessage.addListener(m => {
		console.log("In background script, received message from content script")
		console.log(m.greeting);
	});
});
