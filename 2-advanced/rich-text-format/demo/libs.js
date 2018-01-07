

const prettyjson = require('prettyjson')
function prettify_json(data, options) {
	return prettyjson.render(data, options)
}

const stylize_string = require('chalk')

// https://github.com/sindresorhus/indent-string
const indent_string = require('indent-string');


// https://github.com/AnAppAMonth/linewrap
const linewrap = require('linewrap')
function wrap_string(s, size) {
	return linewrap(size, {skipScheme: 'ansi-color'})(s)
}


// https://github.com/sindresorhus/boxen
const boxen = require('boxen')
const enclose_in_box = boxen



// https://github.com/nexdrew/ansi-align


////////////

module.exports = {
	prettify_json,
	stylize_string,
	indent_string,
	wrap_string,
	enclose_in_box,
}
