
////////////////////////////////////

const NAMESPACE = 'offirmo'
const THEMES = {
	'default': 'subtle',

	'subtle': 'subtle',
	'colorful': 'colorful',
}
const DEBUG = false

////////////////////////////////////
// Social network data
// references:
// +++ https://simpleicons.org/ with links to guidelines

const SOCIAL_NETWORKS_INFO = {
	// key = normalized network
	'generic': {
		official_name: '', // empty
		official_color‿hex: '#2f4f4f',
		official_color_to_be_used_as: 'bg',
		icongram: { pack_id: 'material', icon_id: 'share-circle' },
		generator: (handle, network_id) => `https://www.google.com/search?q=${network_id}+${handle}`,
	},

	// (alphabetical sort)
	'artstation': {
		official_name: 'ArtStation', // https://www.artstation.com/about
		official_color‿hex: '#13AFF0',
		official_color_to_be_used_as: 'fg',
		icongram: { pack_id: 'simple', icon_id: 'artstation' },
		generator: (handle) => `https://www.artstation.com/${handle.toLowerCase()}`, // https://www.artstation.com/offirmo
	},
	'dev': {
		official_name: 'DEV', // https://dev.to/about
		official_color‿hex: '#0A0A0A',
		official_color_to_be_used_as: 'bg',
		icongram: { pack_id: 'simple', icon_id: 'devto' },
		generator: (handle) => `https://dev.to/${handle}`, // https://dev.to/offirmo
	},
	'facebook': {
		official_name: 'Facebook', // https://about.facebook.com/
		official_color‿hex: '#1877F2',
		official_color_to_be_used_as: 'bg',
		is_official_color_dark: undefined,
		icongram: { pack_id: 'fontawesome', icon_id: 'facebook-f' }, // only the f ^
		icongram_alt: { pack_id: 'fontawesome', icon_id: 'facebook-official' }, // including square
			/*
			also
			simple/facebook (rounded)
			fontawesome/facebook-square (rounded square)
			material/facebook (rounded)
			 */
		generator: (handle) => `https://www.facebook.com/${handle}`, // https://www.facebook.com/boringrpg
	},
	'github': {
		official_name: 'GitHub', // https://github.com/about
		official_color‿hex: '#181717',
		official_color_to_be_used_as: 'bg',
		icongram: { pack_id: 'simple', icon_id: 'github' },
		generator: (handle) => `https://github.com/${handle}`, // https://github.com/Offirmo
	},
	'instagram': {
		official_name: 'Instagram', // https://about.instagram.com/
		official_color‿hex: '#E4405F',
		official_color_to_be_used_as: 'bg',
		icongram: { pack_id: 'simple', icon_id: 'instagram' },
		generator: (handle) => `https://www.instagram.com/${handle}`, // https://www.instagram.com/offirmo/
	},
	'itch.io': {
		// https://itch.io/press-kit
		official_name: 'itch.io', // https://itch.io/docs/general/about
		official_color‿hex: '#FA5C5C',
		official_color_to_be_used_as: 'bg',
		icongram: { pack_id: 'simple', icon_id: 'itchio' },
		generator: (handle) => `https://${handle.toLowerCase()}.itch.io/`, // https://offirmo.itch.io/
	},
	'product hunt': {
		// #DA552F
		official_name: 'Product Hunt', // https://www.producthunt.com/about  https://www.producthunt.com/branding
		official_color‿hex: '#DA552F',
		official_color_to_be_used_as: 'bg',
		icongram: { pack_id: 'simple', icon_id: 'producthunt' },
		generator: (handle) => `https://www.producthunt.com/@${handle}`, // https://www.producthunt.com/@offirmo
	},
	'reddit': {
		official_name: 'Reddit', // https://www.redditinc.com/
		official_color‿hex: '#FF4500',
		official_color_to_be_used_as: 'bg',
		icongram: { pack_id: 'simple', icon_id: 'reddit' }, // circled
		generator: (handle) => `https://www.reddit.com/user/${handle}`, // https://www.reddit.com/user/Offirmo
	},
	'twitter': {
		official_name: 'Twitter', // https://about.twitter.com/
		official_color‿hex: '#1DA1F2',
		official_color_to_be_used_as: 'bg',
		icongram: { pack_id: 'simple', icon_id: 'twitter' },
		generator: (handle) => `https://twitter.com/${handle}`, // https://twitter.com/Offirmo
	},
	'patreon': {
		official_name: 'Patreon', // https://www.patreon.com/about
		official_color‿hex: '#FF424D',
		official_color_to_be_used_as: 'bg',
		// TODO icon is not great, but there is no alternative on icongram
		icongram: { pack_id: 'simple', icon_id: 'patreon' }, // circled
		generator: (handle) => `https://www.patreon.com/${handle.toLowerCase()}`, // https://www.patreon.com/offirmo
	},

	// Social network candidates:
	// https://medium.com/@Offirmo
	// https://www.buymeacoffee.com/offirmo
	// facebook-messenger
	// whatsapp
	// pinterest
	// email
	// discord
	// youtube
}

function _normalize_network_id(raw_network_id) {
	let network_id = raw_network_id || ''
	network_id = network_id.toLowerCase().trim()

	// allow some synonyms
	switch (network_id) {
		case 'dev.to':
			network_id = 'dev'
			break
		default:
			break
	}

	return network_id
}

function _get_network_info(network_id) {
	return SOCIAL_NETWORKS_INFO[network_id] ?? SOCIAL_NETWORKS_INFO['generic']
}


////////////////////////////////////
// icongram utils
// https://icongr.am/

function _get_icongram_params({ network_infos, theme, size‿px, color‿hex }) {
	let params = {
		size‿px,
		color‿hex,
		...network_infos.icongram,
	}

	// special cases
	if (theme === THEMES.colorful) {
		params = {
			...params,
			color‿hex: network_infos.official_color_to_be_used_as === 'fg'
			? _get_normalized_hex_representation(network_infos.official_color‿hex)
			: 'FFFFFF', // most social icons are white on custom color
		}
	}
	if (theme === THEMES.subtle) {
		if (network_infos.official_name === 'Facebook') {
			params = {
				...params,
				...network_infos.icongram_alt,
			}
		}
	}

	return params
}

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

////////////////////////////////////
// misc utils

function _clean_handle(raw_handle) {
	raw_handle ??= ''
	let result = raw_handle.trim()

	if (result.startsWith('@'))
		result = result.slice(1)

	return result
}

// NO # returned
// ex. "rbg(128, 255, 3)" -> "80ff03"
function _get_normalized_hex_representation(color) {
	color = color.trim().toLowerCase()

	if (color.startsWith('#'))
		switch (color.length) {
			case 7:
				return color.slice(1)
			case 4:
				throw new Error(`_get_normalized_hex_representation(): unhandled format: short hex!`)
			default:
				throw new Error(`_get_normalized_hex_representation(): unhandled hex format "${color}"!`)
		}

	if (color.startsWith('rgb('))
		return color.split('(')[1]
			.split(')')[0]
			.split(',')
			.map(s => parseInt(s, 10))
			.map(n => n.toString(16))
			.map(s => s.padStart(2, '0'))
			.join('')

	throw new Error(`_get_normalized_hex_representation(): unhandled format "${color}"!`)
}

////////////////////////////////////

customElements.define('offirmoⳆsocial-links', class SocialNav extends HTMLElement {

	static get observedAttributes() {
		return [ 'handle', 'theme' ]
	}

	get_debug_id() {
		return `${this.tagName}ⵧ${this.getAttribute('is')}`
	}

	constructor() {
		super()
		//console.log(`[${this.get_debug_id()}].constructor()]:`, { _this: this })
		this.innerHTML = `
<style>
	/* micro reset */
	.offirmoⳆsocial-links   { box-sizing: border-box; }
	.offirmoⳆsocial-links * { box-sizing: inherit; }

	.offirmoⳆsocial-links {
		/* Vars programmatically set:
		--offirmoⳆsocial-links∙handle: // from the "handle" property
		--offirmoⳆsocial-links∙theme: '${THEMES.default}'; // from the "theme" property
		--offirmoⳆsocial-links∙color--fg // from current color
		*/
	}

	.offirmoⳆsocial-links ol, .offirmoⳆsocial-links ul {
		margin: 0;
		list-style-type: none;
		padding-inline-start: 0;
		display: inline-flex;
		flex-direction: row;
		vertical-align: middle;
	}
	.offirmoⳆsocial-links li + li  {
		/* margin-left customization could go here */
	}

	.offirmoⳆsocial-link {
		display: inline-flex;
		flex-direction: row;
	}

	.offirmoⳆsocial-link∙icon-container {
		aspect-ratio: 1 / 1;
		display: grid;
		place-items: center center;
		padding: .2em;

		/* customized border-radius could go here */

		background-color: var(--offirmoⳆsocial-link∙color--bg, transparent);
	}
</style>
` + this.innerHTML
	}

	_render() {
		if (DEBUG) console.group(`[${this.get_debug_id()}]: render`, this, { elt: this })

		this.classList.add('offirmoⳆsocial-links')

		let handle = this.getAttribute('handle')
		if (handle) {
			this.style.setProperty(
				'--offirmoⳆsocial-links∙handle',
				handle,
			)
		}

		let theme = this.getAttribute('theme') || THEMES.default
		this.style.setProperty(
			'--offirmoⳆsocial-links∙theme',
			theme,
		)

		// capture the foreground color
		// (note that this doesn't work for bg)
		this.style.setProperty(
			'--offirmoⳆsocial-links∙color--fg',
			getComputedStyle(this).getPropertyValue('color')
		)

		if (DEBUG) console.groupEnd()
	}

	connectedCallback() {
		if (DEBUG) console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].connectedCallback():`, { _this: this })
	}
	disconnectedCallback() {
		if (DEBUG) console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].disconnectedCallback():`, { _this: this })
	}
	adoptedCallback() {
		if (DEBUG) console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].adoptedCallback():`, { _this: this })
	}
	attributeChangedCallback(name, old_value, new_value) {
		if (DEBUG) console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}].attributeChangedCallback():`, { name, old_value, new_value, _this: this })
		this._render()
	}

}, { extends: 'nav' });

////////////////////////////////////

customElements.define('offirmoⳆsocial-link', class SocialLink extends HTMLAnchorElement {

	static get observedAttributes() {
		return [ 'network', 'handle' ]
	}

	get_debug_id() {
		return `${this.tagName}ⵧ${this.getAttribute('is')}`
	}

	constructor() {
		super()
		//console.log(`[${this.get_debug_id()}]: constructor`, this, { elt: this })
	}

	get_theme() {
		return getComputedStyle(this).getPropertyValue('--offirmoⳆsocial-links∙theme') || THEMES.default
	}

	get_icon_color‿hex() {
		/*console.log(
			getComputedStyle(this).getPropertyValue('--offirmoⳆsocial-links∙color--fg'),
			getComputedStyle(this).getPropertyValue('--offirmoⳆsocial-links∙color--bg'),
			getComputedStyle(this).getPropertyValue('color'),
			//getComputedStyle(this).getPropertyValue('background-color'),
		)*/

		return _get_normalized_hex_representation(
			getComputedStyle(this).getPropertyValue('--offirmoⳆsocial-links∙color--fg')
			|| getComputedStyle(this).getPropertyValue('color')
		)
	}

	get_font_size‿px() {
		return parseInt(getComputedStyle(this).getPropertyValue('font-size'), 10)
	}

	get_generic_handle() {
		let handle = _clean_handle(this.getAttribute('handle'))

		if (!handle) {
			// try to inherit from parent
			handle = _clean_handle(getComputedStyle(this).getPropertyValue('--offirmoⳆsocial-links∙handle'))
		}

		if (!handle)
			throw new Error(`[${this.get_debug_id()}]: can't find handle!`)

		return handle
	}

	get_network_id() {
		let network_id = _normalize_network_id(this.getAttribute('network'))

		if (!network_id)
			network_id = _normalize_network_id(this.innerText)

		if (!network_id) {
			let href = this.getAttribute('href')
			if (href) {
				try {
					const url = new URL(href)
					//console.log('url', { href, url })
					// TODO
					throw new Error(`[${this.get_debug_id()}]: network Auto recognition TODO!`)
				}
				catch { /* don't care */ }
			}
		}

		if (!network_id) {
			console.error(`[${this.get_debug_id()}]: missing "network" property!`, this, {
				attribute: this.getAttribute('network')
			})
		}
		else if (!SOCIAL_NETWORKS_INFO[network_id]) {
			console.error(`[${this.get_debug_id()}]: unknown social network "${network_id}", defaulting to google search!`, this)
		}

		return network_id
	}

	get_href() {
		let href = this.getAttribute('href')

		if (!href) {
			const network_id = this.get_network_id()
			const handle = this.get_generic_handle()
			href = _get_network_info(network_id).generator(handle, network_id)
		}

		if (!href)
			throw new Error("can't compute href!")

		return href
	}

	_render() {
		if (DEBUG) console.group(`[${this.get_debug_id()}]: render`, this, { elt: this })

		this.classList.add('offirmoⳆsocial-link')

		this.target = this.target || '_blank'
		this.rel = this.rel || 'noopener,external'
		this.href = this.get_href()

		const network_id = this.get_network_id()
		const network_infos = _get_network_info(network_id)

		const theme = this.get_theme()

		let icongram_params = _get_icongram_params({
			size‿px: this.get_font_size‿px() * 3,
			color‿hex: this.get_icon_color‿hex(),
			network_infos,
			theme,
		})

		if (theme === THEMES.colorful) {
			this.style.setProperty(
				'--offirmoⳆsocial-link∙color--bg',
				network_infos.official_color_to_be_used_as === 'bg'
				? network_infos.official_color‿hex
				: 'black', // the only network with custom color as FG uses black as a background
			)
		}

		if (DEBUG) console.log(`[${this.get_debug_id()}]: now rendering with computed params…`, {
			network_id,
			network_infos,
			icongram_params,
			bg_color: getComputedStyle(this).getPropertyValue('--offirmoⳆsocial-link∙color--bg')
		})

		this.innerHTML = `
<div class="offirmoⳆsocial-link∙icon-container">
	<img src="${_get_icongram_url(icongram_params)}"
	     alt="Logo of ${network_infos.official_name || network_id}"
	     width="${this.get_font_size‿px()}" height="${this.get_font_size‿px()}"
	     style="vertical-align: middle; height: ${this.get_font_size‿px()}px;"
	/>
</div>
<!-- ${network_infos.official_name || network_id} -->
`

		if (DEBUG) console.groupEnd()
	}

	attributeChangedCallback(name, old_value, new_value) {
		if (DEBUG) console.log(`[${this.get_debug_id()}]: attributeChangedCallback`, this, { name, old_value, new_value, elt: this })

		this._render()
	}
}, { extends: 'a' });
