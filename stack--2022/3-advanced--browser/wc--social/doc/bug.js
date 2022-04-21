
////////////////////////////////////

// references:
// https://simpleicons.org/ with links to guidelines

const SOCIAL_NETWORKS_INFO = {
	// key = normalized network
	'generic': {
		official_name: '', // empty
		icongram: { pack_id: 'material', icon_id: 'share-circle' },
		generator: (handle, network_id) => `https://www.google.com/search?q=${network_id}+${handle}`,
	},

	// alphabetical sort
	'artstation': {
		official_name: 'ArtStation', // https://www.artstation.com/about
		official_color: '#13AFF0',
		icongram: { pack_id: 'simple', icon_id: 'artstation' },
		generator: (handle) => `https://www.artstation.com/${handle.toLowerCase()}`, // https://www.artstation.com/offirmo
	},
	'dev': {
		official_name: 'DEV', // https://dev.to/about
		official_color: '#0A0A0A',
		icongram: { pack_id: 'simple', icon_id: 'devto' },
		generator: (handle) => `https://dev.to/${handle}`, // https://dev.to/offirmo
	},
	'facebook': {
		official_name: 'Facebook', // https://about.facebook.com/
		official_color: '#1877F2',
		icongram: { pack_id: 'simple', icon_id: 'facebook' },
		generator: (handle) => `https://www.facebook.com/${handle}`, // https://www.facebook.com/boringrpg
	},
	'github': {
		official_name: 'GitHub', // https://github.com/about
		official_color: '#181717',
		icongram: { pack_id: 'simple', icon_id: 'github' },
		generator: (handle) => `https://github.com/${handle}`, // https://github.com/Offirmo
	},
	'instagram': {
		official_name: 'Instagram', // https://about.instagram.com/
		official_color: '#E4405F',
		icongram: { pack_id: 'simple', icon_id: 'instagram' },
		generator: (handle) => `https://www.instagram.com/${handle}`, // https://www.instagram.com/offirmo/
	},
	'itch.io': {
		// https://itch.io/press-kit
		official_name: 'itch.io', // https://itch.io/docs/general/about
		official_color: '#FA5C5C',
		icongram: { pack_id: 'simple', icon_id: 'itchio' },
		generator: (handle) => `https://${handle.toLowerCase()}.itch.io/`, // https://offirmo.itch.io/
	},
	'product hunt': {
		// #DA552F
		official_name: 'Product Hunt', // https://www.producthunt.com/about
		official_color: '000000',
		icongram: { pack_id: 'simple', icon_id: 'producthunt' },
		generator: (handle) => `https://www.producthunt.com/@${handle}`, // https://www.producthunt.com/@offirmo
	},
	'reddit': {
		official_name: 'Reddit', // https://www.redditinc.com/
		official_color: '#FF4500',
		icongram: { pack_id: 'simple', icon_id: 'reddit' },
		generator: (handle) => `https://www.reddit.com/user/${handle}`, // https://www.reddit.com/user/Offirmo
	},
	'twitter': {
		official_name: 'Twitter', // https://about.twitter.com/
		official_color: '#1DA1F2',
		icongram: { pack_id: 'simple', icon_id: 'twitter' },
		generator: (handle) => `https://twitter.com/${handle}`, // https://twitter.com/Offirmo
	},
	'patreon': {
		official_name: 'Patreon', // https://www.patreon.com/about
		official_color: '#FF424D',
		icongram: { pack_id: 'simple', icon_id: 'patreon' },
		generator: (handle) => `https://www.patreon.com/${handle.toLowerCase()}`, // https://www.patreon.com/offirmo
	},

	// https://medium.com/@Offirmo
	// https://www.buymeacoffee.com/offirmo
}

function _get_network_info(network_id) {
	return SOCIAL_NETWORKS_INFO[network_id] ?? SOCIAL_NETWORKS_INFO['generic']
}

////////////////////////////////////

// https://icongr.am/
function _get_icongram_url({
	pack_id = 'fontawesome', // 'fontawesome'
	icon_id = 'question-circle',
	size‿px = 128,
	color‿hex,
} = {}) {
	let result = `https://icongr.am/${pack_id}/${icon_id}.svg?size=${size‿px}`
	if (color‿hex)
		result += `&color=${color‿hex}`
	return result
}

function _normalize_network(raw_network) {
	let network_id = raw_network ?? ''
	network_id = network_id.toLowerCase().trim()

	// some synonyms
	switch (network_id) {
		case 'dev.to':
			network_id = 'dev'
			break
		default:
			break
	}

	return network_id
}

function _clean_handle(raw_handle) {
	raw_handle ??= ''
	let result = raw_handle.trim()

	if (result.startsWith('@'))
		result = result.slice(1)

	return result
}

// ex. "rbg(128, 255, 3)" -> "80ff03"
function _get_hex_representation(color‿rgb) {
	return color‿rgb.split('(')[1]
		.split(')')[0]
		.split(',')
		.map(s => parseInt(s, 10))
		.map(n => n.toString(16))
		.map(s => s.padStart(2, '0'))
		.join('')
}

////////////////////////////////////

customElements.define('offirmoⳆsocial-links', class SocialNav extends HTMLElement {

	static get observedAttributes() {
		return [ 'handle' ]
	}

	constructor() {
		super()
	}

	_render() {
		let handle = this.getAttribute('handle')
		if (handle) {
			this.style.setProperty(
				'--offirmoⳆsocial-links⋄handle',
				handle,
			)
		}
	}


	attributeChangedCallback() {
		this._render()
	}

}, { extends: 'nav' });

customElements.define('offirmoⳆsocial-link', class SocialLink extends HTMLAnchorElement {

	static get observedAttributes() {
		return [ 'network', 'handle' ]
	}

	get_debug_id() {
		return `${this.tagName}ⵧ${this.getAttribute('is')}`
	}

	constructor() {
		super()
		console.log(`[${this.get_debug_id()}]: constructor`, this, { elt: this })
	}

	get_fg_color‿hex() {
		console.log(
			this,
			`"${getComputedStyle(this).getPropertyValue('color')}"`,

		)
		return _get_hex_representation(getComputedStyle(this).getPropertyValue('color'))
	}

	get_font_size‿px() {
		return parseInt(getComputedStyle(this).getPropertyValue('font-size'), 10)
	}

	get_generic_handle() {
		let handle = _clean_handle(this.getAttribute('handle'))

		if (!handle) {
			// try to inherit from parent
			handle = _clean_handle(getComputedStyle(this).getPropertyValue('--offirmoⳆsocial-links⋄handle'))
		}

		if (!handle)
			throw new Error(`[${this.get_debug_id()}]: can't find handle!`)

		return handle
	}

	get_network_id() {
		let network_id = _normalize_network(this.getAttribute('network'))

		if (!network_id)
			network_id = _normalize_network(this.innerText)

		if (!network_id) {
			let href = this.getAttribute('href')
			if (href) {
				try {
					const url = new URL(href)
					console.log('url', { href, url })
					// TODO
					throw new Error(`[${this.get_debug_id()}]: network Auto recognition TODO!`)
				}
				catch { /* don't care */ }
			}
		}

		if (!network_id) {
			console.error(`[${this.get_debug_id()}]: missing network!`, this, {
				attribute: this.getAttribute('network')
			})
		}
		else if (!SOCIAL_NETWORKS_INFO[network_id]) {
			console.error(`[${this.get_debug_id()}]: unknown network "${network_id}", defaulting to google search!`, this)
		}

		return network_id
	}

	get_href() {
		let href = this.getAttribute('href')

		if (!href) {
			const network_id = this.get_network_id()
			const handle = this.get_generic_handle()
			href = _get_network_info(network_id).generator(handle)
		}

		if (!href)
			throw new Error("can't compute href!")

		return href
	}

	_render() {
		console.group(`[${this.get_debug_id()}]: render`, this, { elt: this })

		const network_id = this.get_network_id()
		const network_infos = _get_network_info(network_id)
		let icongram_params = {
			size‿px: this.get_font_size‿px() * 3,
			color‿hex: this.get_fg_color‿hex(),
			...network_infos.icongram
		}
		console.log('rendering…', {
			network_id,
			network_infos,
			icongram_params,
		})

		this.href = this.get_href()

		this.innerHTML = `<img
src="${_get_icongram_url(icongram_params)}"
style="vertical-align: middle; height: ${this.get_font_size‿px()}px;"
  />${network_infos.official_name || network_id}`

		console.groupEnd()
	}

	attributeChangedCallback(name, old_value, new_value) {
		this._render()
	}

	connectedCallback() {

	}
}, { extends: 'a' });
