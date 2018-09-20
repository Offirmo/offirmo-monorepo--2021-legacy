#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
'use strict'


const { create: create_chat } = require('@offirmo/view-chat')
const { prettify_json, create: create_tty_chat_ui } = require('../src')
const { get_next_step1 } = require('@offirmo/view-chat/src/demo')
const DEBUG = false


const no_ui = {
	setup: async () => {},
	display_message: async () => { throw new Error('TODO display_message') },
	read_answer: async () => { throw new Error('TODO read_answer') },
	spin_until_resolution: async () => { throw new Error('TODO spin_until_resolution') },
	pretend_to_think: async () => { throw new Error('TODO pretend_to_think') },
	display_progress: async () => { throw new Error('TODO display_progress') },
	teardown: async () => {},
}


const chat = create_chat({
	DEBUG,
	gen_next_step: get_next_step1(),
	ui: process.stdout.isTTY
		? create_tty_chat_ui({DEBUG})
		: no_ui,
	prettify_json,
})

chat.start()
	.then(() => console.log('bye'))
	.catch(console.error)
