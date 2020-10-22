const prettyjson = require('prettyjson')

module.exports = function prettifyJson(data, options) {
	return prettyjson.render(data, options)
}
