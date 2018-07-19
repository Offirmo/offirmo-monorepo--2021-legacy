"use strict";

const { walk } = require('../../../dist/src.es7.cjs')

import * as callbacks from './rich_text_to_react_callbacks'

export default function rich_text_to_react(doc) {
	//console.log('Rendering a rich text:', doc)
	return walk(doc, callbacks)
}
