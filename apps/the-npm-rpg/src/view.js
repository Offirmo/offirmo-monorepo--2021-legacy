"use strict";

const { stylize_string } = require('./libs')

/////////////////////////////////////////////////

function divide() {
	console.log('--------------------------------------------------------------------------------')
}

function render_header({may_clear_screen, version}) {
	divide()

	console.log(stylize_string.dim(
		stylize_string.bold('The npm RPG')
		+ ` - v${version} - `
		+ stylize_string.underline('http://www.online-adventur.es/the-npm-rpg')
		+ '\n'
	))
}

/////////////////////////////////////////////////

module.exports = {
	render_header,
}
