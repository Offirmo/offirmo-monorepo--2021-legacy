#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
"use strict";

console.log('Rich Text Format Demo')

const RichText = require('../..')

import { MSG_01, MSG_02, MSG_03 } from '../examples'

let callbacks_ansi = null
try {
	callbacks_ansi = require('../../../../apps/the-npm-rpg/src/utils/rich_text_to_ansi_callbacks')
}
catch(e) {}




////////////////////////////////////
if (false) {
	console.log('\n------- 1 -------')
	const doc = MSG_01

	console.log('\n------- to debug -------\n')
	RichText.to_debug(doc)

	console.log('\n------- to text -------\n' + RichText.to_text(doc))
	if (callbacks_ansi) console.log('\n------- to ansi -------\n' + RichText.walk(doc, callbacks_ansi))
	console.log('\n------- to html -------\n' + RichText.to_html(doc))
	//console.log('\n------- to debug -------\n' + RichText.walk(doc, callbacks_debug))
}


// TODO actions
// TODO links
// TODO micro-format clickables?

// TODO uuid

// TODO strong / emphasis


////////////////////////////////////
if (true) {
	console.log('\n------- 2 -------')
	const doc = MSG_03

	//console.log('\n------- to text -------\n' + RichText.to_text(doc))
	//console.log('\n------- to ansi -------\n' + RichText.walk(doc, callbacks_ansi))
	if (callbacks_ansi) console.log('\n------- to ansi -------\n' + RichText.walk(doc, callbacks_ansi))
	console.log('\n------- to html -------\n' + RichText.to_html(doc))
}
