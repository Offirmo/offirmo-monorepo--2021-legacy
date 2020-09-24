#!/usr/bin/env node
'use strict';

console.log('The boring RPG')

const readline = require('readline')

if (!process.stdout.isTTY)
	throw new Error('current term is not a tty !')

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

const keymaps = {
	'*': [
		{ key: 'q', description: 'quit', cb() { process.exit() }}
	],
	main: [
		{ key: 'p', description: 'play', cb() { console.log('play') }},
		{ key: 'i', description: 'inventory', cb() { console.log('inventory'); switch_screen('inventory') }},
	],
	inventory: [
		{ key: 'a', description: 'item 1', cb() { console.log('select item 1') }},
		{ key: 'x', description: 'exit', cb() { switch_screen('main') }},
	],
}

let current_screen_id = 'main'
function switch_screen(id) {
	current_screen_id = id
	keymaps[current_screen_id].forEach(({key, description}) => {
		console.log(`${key} - ${description}`)
	})
	keymaps['*'].forEach(({key, description}) => {
		console.log(`${key} - ${description}`)
	})
}
switch_screen('main')

process.stdin.on('keypress', (str, key_pressed) => {
	if (!key_pressed)
		throw new Error('keypress: Y U no key?!')

	if (key_pressed.ctrl) // ctrl C, ctrl D, whatever
		process.kill(process.pid, 'SIGINT')

	if (!current_screen_id)
		throw new Error('keypress: unknown current screen!')

	if (!keymaps[current_screen_id])
		throw new Error('keypress: no keymap for current screen!')

	const keymap = keymaps['*'].find(({key}) => key === key_pressed.name)
		|| keymaps[current_screen_id].find(({key}) => key === key_pressed.name)
	console.log(key_pressed, keymap)
	if (keymap)
		keymap.cb()
})
