'use strict'

const { stylize_string } = require('./utils/libs')

/////////////////////////////////////////////////

function divide() {
	console.log('--------------------------------------------------------------------------------')
}

function render_header(SEC) {
	return SEC.xTryCatch('render_header', ({VERSION}) => {
		divide()

		console.log(stylize_string.dim(
			stylize_string.bold('The npm RPG')
			+ ` - v${VERSION} - `
			+ stylize_string.underline('http://www.online-adventur.es/the-npm-rpg')
			+ '\n'
		))
	})
}

/////////////////////////////////////////////////

module.exports = {
	render_header,
}
