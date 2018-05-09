"use strict";

import * as RichText from '@offirmo/rich-text-format'

import * as callbacks from './rich_text_to_react_callbacks'

function rich_text_to_react(doc) {
	//console.log('Rendering a rich text:', doc)
	return RichText.walk(doc, callbacks)
}

export {
	rich_text_to_react,
}
