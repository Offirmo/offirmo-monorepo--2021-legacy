'use strict'

import Deferred from '@offirmo/deferred'

export function is_loaded_from_cordova() {
	return window.location.protocol === 'file:' && (new URLSearchParams(location.search)).get('container') === 'cordova'
}

export const ↆcordova = new Deferred()

export default function init() {
	if (!is_loaded_from_cordova()) {
		ↆcordova
			.reject(new Error('Not loaded from Cordova!'))
	}
	else {
		const el = document.createElement('script')
		el.type = 'text/javascript'
		el.src = 'cordova.js'
		document.body.appendChild(el)

		document.addEventListener('deviceready', () => {
			ↆcordova.resolve()
		}, false)

		ↆcordova.then(
			() => console.info('Cordova deviceready!'),
			() => {},
		)
	}
}
