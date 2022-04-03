import { browser } from 'webextension-polyfill-ts'

const LIB = '🧩 UWDT/devtools'

console.log(`[${LIB}.${+Date.now()}]  Hello!`, {
	panels: browser.devtools.panels,
})

function get_browser() {
	if (typeof chrome !== 'undefined') {
		if (typeof browser !== 'undefined')
			return 'Firefox'

		return 'Chrome'
	}

	return 'Other'
}

// only this script has access to the devtools API
// https://developer.browser.com/extensions/devtools

browser.devtools.inspectedWindow.eval(
	`console.log('[${LIB}.${+Date.now()}] Hello injected from the devtools panel!')`,
	function(result, isException) {
		console.log({
			result,
			isException,
		})
	},
)

const PANEL_NAME = '🛠'
browser.devtools.panels.create(
	PANEL_NAME,
	'/icons/icon_32x32.png', // works only on FF
	// Chrome and FF have different paths
	'/ui/devtools/devtools-panel.html',
	/*	get_browser() === 'Firefox'
		? './devtools-panel.html'
		: 'ui/devtools-panel.html',*/
).then(panel => {
	console.log(`[${LIB}.${+Date.now()}] Hello from devtools panel "${PANEL_NAME}" creation!`, panel)

	setTimeout(() => {
		console.log('devtools panels = ', browser.devtools.panels)
	}, 5000)
	/*panel.createSidebarPane(
			"Offirmo Sidebar",
			function(sidebar) {
				 // sidebar initialization code here
				 sidebar.setObject({ some_data: "Some data to show" })
			}
	  )*/
})


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

const port = browser.runtime.connect({name: 'devtools'})
port.onMessage.addListener((msg) => {
	console.log(`[${LIB}.${+Date.now()}] received a port message`, msg)
})
port.postMessage({hello: 'test'})
