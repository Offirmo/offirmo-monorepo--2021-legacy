import React from 'react'
import classNames from 'classnames'
const promiseFinally = require('p-finally')

const { create: create_chat } = require('@offirmo/view-chat')

import { AutoScrollDown } from '../../atoms/auto-scroll-down'
import {rich_text_to_react} from '../../../utils/rich_text_to_react'


function ChatBubble({direction = 'ltr', children}) {
	const classes = classNames(
		'chat__element',
		{ 'chat__element--ltr': direction === 'ltr'},
		{ 'chat__element--rtl': direction === 'rtl'},
		'chat__bubble'
	)
	return (
		<div className={classes}>
			{children}
		</div>
	)
}




class Chat extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			bubbles: [],
			spinning: false,
			progressing: false,
			progress_value: 0,
			reading_string: false,
			choices: [],
			input_resolve_fn: null,
		}
	}

	addBubble(element, {before_mount = false, direction = 'ltr'} = {}) {
		console.log('addBubble', element)
		if (!element) return

		const key = this.state.bubbles.length + 1
		const bubble = (
			<ChatBubble key={key} direction={direction}>
				{element}
			</ChatBubble>
		)

		if (before_mount)
			this.state.bubbles.push(bubble)
		else
			this.setState(state => ({ bubbles: state.bubbles.concat(bubble) }))
	}

	componentWillMount() {
		if (!this.props.gen_next_step)
			return

		const DEBUG = true

		const display_message = async ({msg, choices = [], side = '→'}) => {
			let direction = 'ltr'
			switch(side) {
				case '→':
					direction = 'ltr'
					break
				case '←':
					direction = 'rtl'
					break
				case '↔':
				default:
					throw new Error(`display_message(): incorrect side!`)
			}

			this.addBubble(
				msg,
				{ direction },
			)
		}

		const spin_until_resolution = anything => {
			this.setState(s => {spinning: true})
			return promiseFinally(
				Promise.resolve(anything),
				() => this.setState(s => {spinning: false}),
			)
		}

		const pretend_to_think = duration_ms => {
			return spin_until_resolution(new Promise(resolve => {
				setTimeout(resolve, duration_ms)
			}))
		}

		const display_progress = async ({progress_promise, msg = 'loading', msgg_acknowledge} = {}) => {
			this.setState(state => ({progressing: true}))

			await display_message({msg})

			if (progress_promise.onProgress) {
				progress_promise.onProgress(progress_value => {
					this.setState(state => ({progress_value}))
				})
			}

			progress_promise
				.then(() => true, () => false)
				.then(success => {
					this.setState(state => ({
						progress_value: 0,
						progressing: false,
					}))

					const final_msg = msgg_acknowledge
						? msgg_acknowledge(success)
						: 'Done.'

					return display_message({msg: final_msg})
				})
				.catch(err => {
					// display? TODO
					console.error('unexpected', err)
					return false
				})

			return progress_promise
		}

		const read_string = (step) => {
			if (DEBUG) console.log(`↘ read_string()`, step)

			return new Promise(resolve => {
					this.setState(state => ({
						reading_string: true,
						input_resolve_fn: resolve,
					}))
				})
				.then(raw_answer => {
					this.setState(state => ({
						reading_string: false,
						input_resolve_fn: null,
					}))
					const answer = String(raw_answer).trim()
					if (DEBUG) console.log(`[You entered: "${answer}"]`)

					if (step.msgg_as_user)
						return display_message({
							msg: step.msgg_as_user(answer),
							side: '←'
						})
							.then(() => answer)

					return answer
				})
		}

		const read_choice = async (step) => {
			if (DEBUG) console.log('↘ read_choice()')

			return new Promise(resolve => {
					this.setState(state => ({
						choices: step.choices.map((choice, index) => {
							return (
								<button type="button"
									key={index}
									className="chat__button"
									onClick={() => resolve(choice)}
								>{choice.msg_cta}</button>
							)
						})
					}))
				})
				.then(async (choice) => {

					this.setState(state => ({
						choices: []
					}))

					const answer = choice.value
					await display_message({
						msg: (choice.msgg_as_user || step.msgg_as_user || (() => choice.msg_cta))(answer),
						side: '←'
					})

					return answer
				})

		}

		const read_answer = async (step) => {
			if (DEBUG) console.log('↘ read_answer()')
			switch (step.type) {
				case 'ask_for_string':
					return read_string(step)
				case 'ask_for_choice':
					return read_choice(step)
				default:
					throw new Error(`Unsupported step type: "${step.type}"!`)
			}
		}

		const chat_ui_callbacks = {
			setup: () => {},
			display_message,
			read_answer,
			spin_until_resolution,
			pretend_to_think,
			display_progress,
			teardown: () => {},
		}

		const chat = create_chat({
			DEBUG,
			gen_next_step: this.props.gen_next_step,
			ui: chat_ui_callbacks,
		})

		chat.start()
			.then(() => console.log('bye'))
			.catch(console.error)
	}

	componentWillUpdate (nextProps, nextState) {
		console.info('~~ componentWillUpdate', arguments)
		return true // optimisation possible
	}

	render() {
		const spinner = this.state.spinning && <div className="chat__spinner" />
		const progress_bar = this.state.progressing && (
			<div className="chat__element chat__element--ltr">
				<progress className="chat__progress" value={this.state.progress_value}>XXX</progress>
			</div>
		)
		const user_input = this.state.reading_string && (
			<div className="chat__element chat__element--rtl">
				<input type="text"
					className="chat__input"
					ref={el => this.input = el}
				/>
				<button type="button"
					className="chat__button"
					onClick={() => this.state.input_resolve_fn(this.input.value)}
				>↩</button>
			</div>
		)

		return (
			<AutoScrollDown>
				<div className="chat">
					{this.props.children}
					{this.state.bubbles}
					{progress_bar}
					{spinner}
					<div className="chat__element chat__element--rtl chat__choices">
						{this.state.choices}
					</div>
					{user_input}
				</div>
			</AutoScrollDown>
		)
	}
}

export {
	ChatBubble,
	Chat,
}
