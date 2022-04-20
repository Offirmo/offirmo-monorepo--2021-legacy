

// Autonomous custom elements

customElements.define('hello-world-ace', class HelloWorldACE extends HTMLElement {
	constructor() {
		// Always call super first in constructor
		super();

		// write element functionality in here
	}

	connectedCallback() {
		this.innerHTML = `
<p>Hello World! (ACE)</p>
`;
	}
});

// Customized built-in element
class HelloWorldCBE extends HTMLParagraphElement {
	constructor() {
		// Always call super first in constructor
		super();

		// Element functionality written in here
		this.attachShadow({ mode: "open" })
	}

	connectedCallback() {
		this.shadowRoot.innerHTML = `
<p>Hello World! (CBE)</p>
`;
	}
}
customElements.define('hello-world-cbe', HelloWorldCBE, { extends: 'p' });



/*
class SocialMediaButton extends HTMLButtonElement {
	constructor() {
		// Always call super first in constructor
		super()

		// Element functionality written in here

	...
	}
}
*/
