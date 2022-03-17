

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
console.log(_get_icongram_url())


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
		return [ 'network' ]
	}

	constructor() {
		super()
		console.log(`[${this.tagName}ⵧ${this.getAttribute('is')}]: constructor`, { o: this })
	}

	_render() {

	}

	attributeChangedCallback(name, old_value, new_value) {

	}

	connectedCallback() {
		const network = this.getAttribute('network')
		this.href = '.'
		this.innerHTML = `<img src="${_get_icongram_url({ icon_id: network })}" />${network}`
	}
}, { extends: 'a' });
