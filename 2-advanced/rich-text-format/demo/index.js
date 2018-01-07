#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
"use strict";

console.log('Rich Text Format Demo')

const RichText = require('../dist/src.es7.cjs')

const callbacks_ansi = require('../../the-npm-rpg/src/utils/rich_text_to_ansi_callbacks')

const WEAPON_01_NAME = {
	$classes: ['item__name', 'item-weapon-name'],
	$content: '{{qualifier2|Capitalize}} {{qualifier1|Capitalize}} {{base|Capitalize}}',
	$sub: {
		qualifier2: {
			$type: 'span',
			$content: 'warfield king’s',
		},
		qualifier1: {
			$type: 'span',
			$content: 'onyx',
		},
		base: {
			$type: 'span',
			$content: 'longsword',
		},
	},
}

const WEAPON_01 = {
	$type: 'span',
	$classes: ['item', 'item-weapon', 'item--quality--legendary'],
	$content: '{{weapon_name}} {{enhancement}}',
	$sub: {
		weapon_name: WEAPON_01_NAME,
		enhancement: {
			$type: 'span',
			$classes: ['item--enhancement'],
			$content: '+3',
		},
	},
}

const PLACE_01 = {
	$type: 'span',
	$classes: ['place'],
	$content: 'the country of {{name}}',
	$sub: {
		name: {
			$classes: ['place-name'],
			$content: 'Foo',
		}
	},
}

const NPC_01 = {
	$type: 'span',
	$classes: ['person', 'npc', 'monster--rank--boss'],
	$content: 'John Smith',
}

const MSG_01 = {
	$v: 1,
	$type: 'section',
	$content: 'You are in {{place}}. You meet {{npc}}.{{br}}He gives you a {{item}}.{{hr}}',
	$sub: {
		place: PLACE_01,
		npc: NPC_01,
		item: WEAPON_01,
	},
}

const MSG_02 = {
	$v: 1,
	$type: 'ol',
	$sub: {
		1: WEAPON_01,
		2: PLACE_01,
		3: NPC_01
	},
}



////////////////////////////////////
if (false) {
	console.log('\n------- 1 -------')
	const doc = MSG_01

	console.log('\n------- to debug -------\n')
	RichText.to_debug(doc)

	console.log('\n------- to text -------\n' + RichText.to_text(doc))
	console.log('\n------- to ansi -------\n' + RichText.walk(doc, callbacks_ansi))
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
	const doc = RichText.section()
		.pushText(''
			+ 'Great sages prophetized your coming,{{br}}'
			+ 'commoners are waiting for their hero{{br}}'
			+ 'and kings are trembling from fear of change...{{br}}'
			+ '…undoubtly, you’ll make a name in this world and fulfill your destiny!{{br}}'
		)
		.pushStrong('A great saga just started.')
		.pushText('{{br}}{{br}}loot:')
		.pushNode(MSG_02, 'loot')
		.done()

	//console.log('\n------- to text -------\n' + RichText.to_text(doc))
	//console.log('\n------- to ansi -------\n' + RichText.walk(doc, callbacks_ansi))
	console.log('\n------- to ansi -------\n' + RichText.walk(doc, callbacks_ansi))
	console.log('\n------- to html -------\n' + RichText.to_html(doc))
}
