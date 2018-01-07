#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
'use strict';

const { create: create_chat } = require('@oh-my-rpg/view-chat')
const { create: create_tty_chat_ui } = require('../src')
const { get_next_step1 } = require('@oh-my-rpg/view-chat/src/demo')
const DEBUG = false


const no_ui = {
	setup: () => {},
	display_message: () => {},
	read_answer: () => {},
	teardown: () => {},
}


const chat = create_chat({
	DEBUG,
	gen_next_step: get_next_step1(),
	ui: process.stdout.isTTY
		? create_tty_chat_ui({DEBUG})
		: no_ui,
})

chat.start()
	.then(() => console.log('bye'))
	.catch(console.error)
