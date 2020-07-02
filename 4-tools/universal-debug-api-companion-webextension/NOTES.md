https://chrome.google.com/webstore/devconsole/

https://dev.to/shijiezhou/top-10-chrome-extensions-every-developer-likes-3ehk

		"notifications",
		"storage",
		"webRequest",
		"webRequestBlocking",
		"debugger",


manefist:
	"devtools_page": "ui/devtools/devtools.html",



Reading manifest: Error processing permissions.2: Value "debugger" must either: must either [must either [be one of ["clipboardRead", "clipboardWrite", "geolocation", "idle", "notifications"], be one of ["bookmarks"], be one of ["find"], be one of ["history"], be one of ["menus.overrideContext"], be one of ["search"], be one of ["activeTab", "tabs", "tabHide"], be one of ["topSites"], be one of ["browserSettings"], be one of ["cookies"], be one of ["downloads", "downloads.open"], be one of ["webNavigation"], or be one of ["webRequest", "webRequestBlocking"]], be one of ["alarms", "mozillaAddons", "storage", "unlimitedStorage"], be one of ["browsingData"], be one of ["captivePortal"], be one of ["devtools"], be one of ["identity"], be one of ["menus", "contextMenus"], be one of ["normandyAddonStudy"], be one of ["pkcs11"], be one of ["geckoProfiler"], be one of ["sessions"], be one of ["urlbar"], be one of ["contextualIdentities"], be one of ["dns"], be one of ["activityLog"], be one of ["management"], be one of ["networkStatus"], be one of ["privacy"], be one of ["proxy"], be one of ["nativeMessaging"], be one of ["telemetry"], be one of ["theme"], or match the pattern /^experiments(\.\w+)+$/], or must either [be one of ["<all_urls>"], must either [match the pattern /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$/, or match the pattern /^file:\/\/\/.*$/], or match the pattern /^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/]



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



/*
const port_to_bg = browser.runtime.connect({name: "content-script"});
port_to_bg.onMessage.addListener((msg) => {
	console.group(`[${LIB}.${+Date.now()}] 📥 received a port message`, msg)
	console.assert(msg[MSG_ENTRY], 'MSG_ENTRY')

	const payload = msg[MSG_ENTRY]
	const type = payload.type
	switch (type) {
		case MSG_TYPE__UPDATE_ORIGIN_STATE: {
			const origin_state = payload.state
			if (origin_state.is_injection_enabled)
				localStorage.setItem(LS_KEY_ENABLED, 'true')
			else
				localStorage.removeItem(LS_KEY_ENABLED)
			break
		}

		default:
			console.error(`Unhandled message "${type}"!`)
			break
	}
	console.groupEnd()
})
*/
