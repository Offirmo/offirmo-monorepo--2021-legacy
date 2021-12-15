

// https://icongr.am/
function _get_icongram_url({
	pack_id = 'fontawesome', // 'fontawesome'
	icon_id = 'question-circle',
	size = 128,
	color‿hex,
} = {}) {
	let result = `https://icongr.am/${pack_id}/${icon_id}.svg?size=${size}`
	if (color‿hex)
		result += `&color={color‿hex}`
	return result
}
//console.log(_get_icongram_url())

function _normalize_network(s) {
	s ??= ''
	return s.toLowerCase().trim()
}

const SUPPORTED_SOCIAL_NETWORKS = [
	// Exact self-advertised wording

	'Product Hunt', // https://www.producthunt.com/about
	'Twitter', // https://about.twitter.com/
	'Facebook', // https://about.facebook.com/
	'DEV', // https://dev.to/about
	'itch.io', // https://itch.io/docs/general/about
	'GitHub', // https://github.com/about
	'Instagram', // https://about.instagram.com/
	'Patreon', // https://www.patreon.com/about
	'ArtStation', // https://www.artstation.com/about

	// any unrecognized network will fall into this category
	'generic'
]

const SOCIAL_NETWORKS_INFO = {
	// key = normalized network
	'generic': {
		generator: (handle, network_id) => `https://www.google.com/search?q=${network_id}+${handle}`,
	},

	// alphabetical sort
	'artstation': {
		official_name: 'ArtStation', // https://www.artstation.com/about
		generator: (handle) => `XXXTODO/${handle}`,
	},
	'dev': {
		official_name: 'DEV', // https://dev.to/about
		generator: (handle) => `XXXTODO/${handle}`,
	},
	'facebook': {
		official_name: 'Facebook', // https://about.facebook.com/
		generator: (handle) => `XXXTODO/${handle}`,
	},
	'github': {
		official_name: 'GitHub', // https://github.com/about
		generator: (handle) => `XXXTODO/${handle}`,
	},
	'instagram': {
		official_name: 'Instagram', // https://about.instagram.com/
		generator: (handle) => `XXXTODO/${handle}`,
	},
	'itch.io': {
		official_name: 'itch.io', // https://itch.io/docs/general/about
		generator: (handle) => `XXXTODO/${handle}`,
	},
	'product hunt': {
		official_name: 'Product Hunt', // https://www.producthunt.com/about
		generator: (handle) => `XXXTODO/${handle}`,
	},
	'reddit': {
		official_name: 'Reddit', // https://www.redditinc.com/
		generator: (handle) => `https://www.reddit.com/user/${handle}`,
	},
	'twitter': {
		official_name: 'Twitter', // https://about.twitter.com/
		generator: (handle) => `XXXTODO/${handle}`,
	},
	'patreon': {
		official_name: 'Patreon', // https://www.patreon.com/about
		generator: (handle) => `XXXTODO/${handle}`,
	},
}


customElements.define('social-presence-links', class SocialNav extends HTMLElement {

	static get observedAttributes() {
		return []
	}

	constructor() {
		super()
		console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].constructor()]:`, { _this: this })

		const state = {
			color: 'black', // TODO look into variables
			icon_size: 24, // TODO use default font size
		}
	}

	connectedCallback() {
		console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].connectedCallback():`, { _this: this })
	}
	disconnectedCallback() {
		console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].disconnectedCallback():`, { _this: this })
	}
	adoptedCallback() {
		console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].adoptedCallback():`, { _this: this })
	}
	attributeChangedCallback() {
		console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].attributeChangedCallback():`, { _this: this })
	}

}, { extends: 'nav' });


customElements.define('social-link', class SocialLink extends HTMLAnchorElement {

	static get observedAttributes() {
		return [ 'network', 'handle' ]
	}

	constructor() {
		super()
		console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}]: constructor`, { o: this })

	}

	get_network() {
		let network = _normalize_network(this.getAttribute('network'))

		if (!network)
			network = _normalize_network(this.innerText)

		if (!network) {
			let href = this.getAttribute('href')
			try {
				const url = new URL(href)
				console.log('url', { href, url })
			}
			catch { /* don't care */ }
		}


		if (network)
			return network

		throw new Error("can't find network!")
	}

	get_href() {
		let href = this.getAttribute('href')

		if (!href)
			throw new Error("can't compute href!")

		return href
	}


	_render() {

	}

	attributeChangedCallback(name, old_value, new_value) {

	}

	connectedCallback() {
		const network = this.get_network()
		this.href = this.get_href()
		this.innerHTML = `<img src="${_get_icongram_url({ icon_id: network })}" />${network}`
	}
}, { extends: 'a' });
