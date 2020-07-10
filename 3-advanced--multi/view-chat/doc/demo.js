'use strict'

const i_will_handle_rejection_later = require('caught')

function* get_next_step1(skip_to_index = 0) {
	const state = {
		mode: 'main',
		name: undefined,
		city: undefined,
	}

	yield* [
		{
			type: 'progress',
			duration_ms: 2000, // or provide a progress_promise
			msg_main: 'Waking up...',
			callback: success => console.log(`[callback called: ${success}]`),
			msgg_acknowledge: success => success ? 'Awoken!' : 'Slumbering forever.',
		},
		{
			type: 'progress',
			progress_promise: i_will_handle_rejection_later(new Promise((resolve, reject) => setTimeout(() => reject(new Error('Demo step 2 rejection!')), 2000))),
			msg_main: 'Warming up...',
			callback: success => console.log(`[callback called: ${success}]`),
			msgg_acknowledge: success => success ? '✔ Ready!' : '❌ Too lazy.',
		},
		{
			type: 'simple_message',
			msg_main: 'Welcome. I’ll have a few questions…',
		},
		{
			type: 'ask_for_string',
			msg_main: 'What’s your name?',
			//validator: null, // TODO
			msgg_as_user: value => `My name is "${value}".`,
			msgg_acknowledge: name => `Thanks for the answer, ${name}!`,
			callback: value => { state.name = value },
		},
		{
			type: 'ask_for_string',
			msg_main: 'What city do you live in?',
			msgg_as_user: value => `I live in "${value}".`,
			msgg_acknowledge: value => `${value}, a fine city indeed!`,
			callback: value => { state.city = value },
		},
		{
			type: 'simple_message',
			msg_main: 'Please wait for a moment...',
		},
		{
			type: 'progress',
			duration_ms: 1000,
			msg_main: 'Calling server...',
		},
		{
			msg_main: 'Please choose between 1 and 2?',
			callback: value => { state.mode = value },
			choices: [
				{
					msg_cta: 'Choice 1',
					value: 1,
				},
				{
					msg_cta: 'Choice 2',
					value: 2,
				},
			],
		},
		{
			type: 'simple_message',
			msg_main: 'Thanks, good bye.',
		},
	].slice(skip_to_index)
}

/*
async function get_next_step2() {

	const MAIN_MODE = {
		msg_main: 'What do you want to do?',
		callback: value => state.mode = value,
		choices: [
			{
				msg_cta: 'Play',
				value: 'play',
				msgg_as_user: () => 'Let’s play!',
			},
			{
				msg_cta: 'Manage Inventory',
				value: 'inventory',
				msgg_as_user: () => 'Let’s sort out my stuff.',
			},
			{
				msg_cta: 'Manage Character',
				value: 'character',
				msgg_as_user: () => 'Let’s see how I’m doing!',
			},
		]
	}

	return state.name
		? MAIN_MODE
		: GET_NAME
}
*/

module.exports = {
	get_next_step1,
	//get_next_step2,
}
