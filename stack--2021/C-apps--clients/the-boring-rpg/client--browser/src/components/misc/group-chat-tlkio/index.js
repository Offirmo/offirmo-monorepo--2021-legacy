import logger from '../../../services/logger'

import './index.css'

const LIB = 'group chat SaaS (tlk.io)'
const CSS_CLASS__OPEN = 'group-chat-container--open'
const ELEMENT_ID = 'group-chat-container'

//const ELEMENT_ID = 'tlkio'
//const ERROR_ELEMENT_ID = 'tlkio'

/*
function report_error() {
	console.error(`${LIB}: error, timeout waiting for chat to load!`)

	const parent = document.getElementById(ELEMENT_ID)

	const error_elem = document.getElementById(ERROR_ELEMENT_ID) || document.createElement('div')
	error_elem.id = ERROR_ELEMENT_ID
	error_elem.innerHTML = `
			<div id="tlkio-error-msg">
		<p>
			Group chat failed to load.
		</p>
		<p>
			You may have to allow 3rd-party cookies for tlk.io by clicking the puzzle icon 🧩 in the address bar above ⇧.
		</p>
	</div>
		`

	parent.appendChild(error_elem)
}
*/

export function restart({channel_id, nickname}) {
	//console.log(`${LIB}: restart()`, {channel_id, nickname})

	if (!channel_id)
		throw new Error(`${LIB}: can’t set up chat without a channel id!`)


	const iframe_elem = document.getElementById(ELEMENT_ID)
	if (!iframe_elem)
		throw new Error(`${LIB}: can’t set up chat without a #${ELEMENT_ID} parent!`)

	/*
	setTimeout(() => {
		// check if there is an iframe
		// TODO
		if (false)
			report_error()
	}, 5000)
*/

	// the chat has a lower priority and the browser should not try to load it asap
	let optimization_delay_ms = iframe_elem.classList.contains(CSS_CLASS__OPEN)
		? 0
		: 1000

	const current_src = new URL(iframe_elem.src)
	const new_src = current_src.origin
		+ current_src.pathname
		+ '?'
		+ new URLSearchParams({
			id: channel_id,
			theme: 'night',
			//bg_color: 'yellow',
			nickname,
			//css_overrides_url,
		})
	/*console.log(LIB, {
		current_src,
		new_src,
	})*/

	setTimeout(() => {
		//console.log(LIB + ' switching iframe src…')
		iframe_elem.src = new_src
	}, optimization_delay_ms)

		/*
		iframe_elem = document.createElement('iframe')
		iframe_elem.id = ELEMENT_ID
		iframe_elem.className = 'o⋄top-container'
		iframe_elem.setAttribute('data-theme', 'theme--night')
		iframe_elem.setAttribute('data-channel', channel_id)
		if (nickname)
			iframe_elem.setAttribute('data-nickname', nickname)

		iframe_elem.appendChild(iframe_elem)

		// add script
		// https://stackoverflow.com/a/26478358/587407
		const script_elem = document.createElement('script')
		script_elem.type = 'text/javascript'
		script_elem.async = true
		script_elem.importance = 'low'
		//script_elem.src = `${document.location.protocol || 'https:'}//tlk.io/embed.js`
		script_elem.src = 'https://tlk.io/embed.js'
		const scripts = document.getElementsByTagName('script')[0].parentNode
		scripts.appendChild(script_elem)*/
	//}, optimization_delay_ms)
}

export function toggle_visibility() {
	//console.log(`${LIB}: toggle_visibility()`)

	const drawer = document.getElementById(ELEMENT_ID)

	if (drawer.classList.contains(CSS_CLASS__OPEN))
		drawer.classList.remove(CSS_CLASS__OPEN)
	else
		drawer.classList.add(CSS_CLASS__OPEN)
}
