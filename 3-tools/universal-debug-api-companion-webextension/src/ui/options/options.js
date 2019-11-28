import { browser } from 'webextension-polyfill-ts'

console.log(`🧩 [T=${+Date.now()}] Hello from options!`)

////////////////////////////////////
// https://developer.browser.com/extensions/messaging#simple

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(`[${LIB}.${+Date.now()}] received a simple message from`, {
		sender,
		sender_x: sender.tab ?
			'from a content script:' + sender.tab.url :
			'from the extension',
		request,
	})
})

const port = browser.runtime.connect({name: 'options'})
port.onMessage.addListener((msg) => {
	console.log(`[${LIB}.${+Date.now()}] received a port message`, msg)
})
port.postMessage({hello: 'test'})
