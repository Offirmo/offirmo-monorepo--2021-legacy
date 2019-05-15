import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from '@offirmo-private/react-error-boundary'

import Root from './components/root'
import './popup.css'

const LIB = '🧩 UWDT/popup'
console.log(`[${LIB}.${+Date.now()}] Hello!`)

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
