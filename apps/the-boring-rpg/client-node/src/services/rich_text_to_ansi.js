'use strict'

const to_ansi = require('@offirmo/rich-text-format-to-ansi')

function rich_text_to_ansi(doc) {
	// TODO extend
	return to_ansi(doc)
}

module.exports = {
	rich_text_to_ansi,
}
