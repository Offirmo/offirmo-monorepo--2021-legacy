import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from '@offirmo-private/react-error-boundary'

import Root from './components/root'
import './popup.css'

const LIB = '🧩 UWDT/popup'
console.log(`[${LIB}.${+Date.now()}] Hello!`)

////////////////////////////////////
// https://developer.chrome.com/extensions/messaging#simple

chrome.runtime.sendMessage({message: `Test message from ${LIB}`}, function(response) {
	console.log(response);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(`[${LIB}.${+Date.now()}] received a simple message from`, {
		sender,
		sender_x: sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension",
		request,
	})
})

ReactDOM.render(
	<ErrorBoundary name={LIB}>
		<Root />
	</ErrorBoundary>,
	document.getElementById('root'),
)

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

const port = chrome.runtime.connect({name: "popup"});
port.onMessage.addListener((msg) => {
	console.log(`[${LIB}.${+Date.now()}] received a port message`, msg)
});
port.postMessage({hello: "test"});
