"use strict";

const RichText = require('@offirmo/rich-text-format')

const callbacks = require('./rich_text_to_react_callbacks')

function rich_text_to_react(doc) {
	console.log('Rendering a rich text:', doc)
	return RichText.walk(doc, callbacks)
}

module.exports = {
	rich_text_to_react,
}
