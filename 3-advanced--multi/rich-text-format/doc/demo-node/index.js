#!/bin/sh
':' //# https://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
'use strict'

console.log('Rich Text Format Demo')

const RichText = require('../..')

const {
	DOC_DEMO_BASE_TYPES,
	DOC_DEMO_ADVANCED_TYPES,
	DOC_DEMO_HINTS,
	DOC_DEMO_RPG_01,
	DOC_DEMO_RPG_02,
	DOC_DEMO_RPG_03,
	DOC_DEMO_INVENTORY,
} = require('../examples')

let to_ansi = null
try {
	to_ansi = require('../../../rich-text-format-to-ansi')
}
catch(err) {
	console.warn('error loading to_ansi:', err)
}



function demo(wrapped_doc) {
	const key = Object.keys(wrapped_doc)[0]
	const doc = wrapped_doc[key]

	console.log(`\n------- ${key} -------`)

	console.log('\n------- to text -------\n' + RichText.to_text(doc))

	if (to_ansi) console.log('\n------- to ansi -------\n' + to_ansi(doc))
}

////////////////////////////////////

demo({DOC_DEMO_BASE_TYPES})
demo({DOC_DEMO_ADVANCED_TYPES})
demo({DOC_DEMO_HINTS})
demo({DOC_DEMO_RPG_01})
demo({DOC_DEMO_RPG_02})
demo({DOC_DEMO_RPG_03})
demo({DOC_DEMO_INVENTORY})

// TODO actions
// TODO links
