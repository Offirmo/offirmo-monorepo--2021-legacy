"use strict";

const RichText = require('@oh-my-rpg/rich-text-format')

const callbacks = require('./rich_text_to_ansi_callbacks')

function rich_text_to_ansi(doc) {
	return RichText.walk(doc, callbacks)
}

module.exports = {
	rich_text_to_ansi,
}
