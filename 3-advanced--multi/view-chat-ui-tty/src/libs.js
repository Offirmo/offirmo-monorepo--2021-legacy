'use strict'

//const PromiseWithProgress = require('p-progress')

const to_prettified_str = require('@offirmo-private/prettify-any')

const stylize_string = require('chalk')


// https://github.com/AnAppAMonth/linewrap
const linewrap = require('linewrap')
function wrap_string(s, size) {
	return linewrap(size, {skipScheme: 'ansi-color'})(s)
}


// https://github.com/sindresorhus/boxen
//const boxen = require('boxen')
//const enclose_in_box = boxen


// https://github.com/nexdrew/ansi-align


////////////

module.exports = {
	//PromiseWithProgress,
	to_prettified_str,
	stylize_string,
	//indent_string,
	wrap_string,
	//enclose_in_box,
}
