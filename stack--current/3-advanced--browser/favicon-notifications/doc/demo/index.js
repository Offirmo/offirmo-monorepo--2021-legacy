'use strict'

import {
	set_number_in_favicon,
} from '../..'

import './index.css'

////////////

console.log('js', {
	set_number_in_favicon,
	/*'window.name': window.name,
	'window.opener': window.opener,
	'window.parent': window.parent,
	'window.frameElement': window.frameElement,*/
})

if (!window.frameElement) {
	const elt_iframe = document.getElementsByTagName('iframe')[0]
	elt_iframe.src = window.location.href
}
////////////

window.set_number_in_favicon = set_number_in_favicon
set_number_in_favicon(3)

////////////

let step = 0.1
let intervalID
window.x = () => {
	if (intervalID) {
		clearInterval(intervalID)
		intervalID = null
		set_number_in_favicon(1)
	}
	else {
		set_number_in_favicon(0)
		intervalID = setInterval(() => {
			step = step * 1.5
			if (step > 10)
				step = 0.1
			set_number_in_favicon(step)
		}, 1000)
	}
}
