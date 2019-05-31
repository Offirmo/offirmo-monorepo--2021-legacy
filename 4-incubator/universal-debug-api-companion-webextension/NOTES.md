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
