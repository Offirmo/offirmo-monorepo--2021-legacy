import './index.css'


const LIB = 'group chat SaaS (tlk.io)'
const PARENT_ID = 'group-chat-container'
const PARENT_OPEN_CLASS = 'group-chat-container--open'
const ELEMENT_ID = 'tlkio'
const ERROR_ELEMENT_ID = 'tlkio'

function report_error() {
	console.error(`${LIB}: error, timeout waiting for chat to load!`)

	const parent = document.getElementById(PARENT_ID)

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

function restart({channel_id, nickname} = {}) {
	if (!channel_id)
		throw new Error(`${LIB}: Cant set up chat without a channel id!`)

	const parent = document.getElementById(PARENT_ID)
	if (!parent)
		throw new Error(`${LIB}: Cant set up chat without a #${PARENT_ID} parent!`)

	setTimeout(() => {
		// check if there is an iframe
		// TODO
		if (false)
			report_error()
	}, 5000)

	let anchor_elem = document.getElementById(ELEMENT_ID)
	if (anchor_elem) {
		console.warn(`${LIB}: replacing an existing instance. This may not work well!`)
		anchor_elem.parentNode.removeChild(anchor_elem)
	}
	anchor_elem = document.createElement('div')
	anchor_elem.id = ELEMENT_ID
	anchor_elem.className = 'o⋄top-container'
	anchor_elem.setAttribute('data-theme', 'theme--night')
	anchor_elem.setAttribute('data-channel', channel_id)
	if (nickname)
		anchor_elem.setAttribute('data-nickname', nickname)

	parent.appendChild(anchor_elem)

	// add script
	// https://stackoverflow.com/a/26478358/587407
	const script_elem = document.createElement('script')
	script_elem.type = 'text/javascript'
	script_elem.async = true
	script_elem.src = `${document.location.protocol || 'https:'}//tlk.io/embed.js`
	const scripts = document.getElementsByTagName('script')[0].parentNode
	scripts.appendChild(script_elem)
}

function toggle() {
	console.log(`${LIB}: toggle`)

	const drawer = document.getElementById(PARENT_ID)

	if (drawer.classList.contains(PARENT_OPEN_CLASS))
		drawer.classList.remove(PARENT_OPEN_CLASS)
	else
		drawer.classList.add(PARENT_OPEN_CLASS)
}

export {
	restart,
	toggle,
}
