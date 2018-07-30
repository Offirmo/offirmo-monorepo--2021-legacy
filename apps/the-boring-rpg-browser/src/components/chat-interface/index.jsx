import React from 'react'
import classNames from 'classnames'
const promiseFinally = require('p-finally')

import { create as create_chat } from '@offirmo/view-chat'

import { AutoScrollDown } from '../auto-scroll-down'
import { is_likely_to_be_mobile } from '../../services/mobile-detection'
import './index.css'


class ChatBubble extends React.Component {
	state = {
		error: null,
		errorInfo: null,
	}

	componentDidCatch(error, errorInfo) {
		// Catch errors in any components below and re-render with error message
		this.setState({
			error,
			errorInfo,
		})
	}

	render() {
		const {direction = 'ltr', children} = this.props
		const classes = classNames(
			'chat__element',
			{ 'chat__element--ltr': direction === 'ltr'},
			{ 'chat__element--rtl': direction === 'rtl'},
			'chat__bubble'
		)
		return (
			<div className={classes}>
				{this.state.errorInfo
					? <div className="o⋄error-report">
							<h2>internal error</h2>
							<details style={{ whiteSpace: 'pre-wrap' }}>
								{this.state.error && this.state.error.toString()}
								<br />
								{this.state.errorInfo.componentStack}
							</details>
						</div>
					: children
				}
			</div>
		)
	}
}

class Chat extends React.Component {

	constructor (props) {
		super(props)

		// rekey backupped bubbles to avoid key conflicts
		let initial_bubbles = React.Children.map(this.props.initial_bubbles, (child, index) => {
			return (typeof child === 'string')
				? child
				: React.cloneElement(child, {key: `restored-${index}`})
		})

		this.state = {
			bubble_key: this.props.initial_bubbles.length + 1,
			bubbles: initial_bubbles,
			spinning: false,
			progressing: false,
			progress_value: 0,
			reading_string: false,
			mobile_keyboard_likely_present_notified: false,
			choices: [],
			input_resolve_fn: null,
		}
	}

	addBubble(element, {before_mount = false, direction = 'ltr'} = {}) {
		if (!element) return

		const key = this.state.bubble_key + 1
		const bubble = (
			<ChatBubble key={key} direction={direction}>
				{element}
			</ChatBubble>
		)

		if (before_mount) {
			this.state.bubbles.push(bubble)
			this.state.bubble_key++
		}
		else
			this.setState(state => ({
				bubbles: state.bubbles.concat(bubble).slice(-this.props.max_displayed_bubbles),
				bubble_key: state.bubble_key + 1,
			}))
	}

	componentWillMount() {
		if (!this.props.gen_next_step)
			return

		const DEBUG = false

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

					this.setState(state => ({bubbles: state.bubbles.slice(0, -1)}))

					return display_message({msg: (
						<span>
							{msg} {final_msg}
						</span>
					)})
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
					this.props.on_input_begin()
				})
				.then(raw_answer => {
					this.setState(state => ({
						reading_string: false,
						input_resolve_fn: null,
					}))
					this.props.on_input_end()
					const answer = raw_answer
						? String(raw_answer).trim()
						: undefined // to not stringify to "null" or "undefined"!
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

	componentWillUnmount () {
		//console.info('chat-ui: componentWillUnmount', arguments)

		let bubles_to_backup = [].concat(this.state.bubbles)
		if (this.state.choices)
			bubles_to_backup.pop() // remove the choice prompt, unneeded
		if (bubles_to_backup.length < 4)
			bubles_to_backup = [] // just the welcome prompts, no need to back it up
		this.props.on_unmount(bubles_to_backup)
	}

	render() {
		//console.log('rendering chat', this.state)

		const spinner = this.state.spinning && <div className="chat__spinner" />
		const progress_bar = this.state.progressing && (
			<div className="chat__element chat__element--ltr">
				<progress className="chat__progress" value={this.state.progress_value}>XXX</progress>
			</div>
		)
		const user_input = this.state.reading_string && (
			<div className="chat__element chat__element--rtl">
				<input type="text" autofocus
					className="chat__input"
					ref={el => this.input = el}
				/>
				<button type="button"
					className="chat__button clickable-area"
					onClick={() => {
						this.state.input_resolve_fn(this.input.value)
					}}
				>↩</button>
				<button type="button"
					className="chat__button clickable-area"
					onClick={() => {
						this.state.input_resolve_fn(undefined)
					}}
				>cancel</button>
			</div>
		)

		if (this.state.reading_string) {
			setTimeout(() => {
				if (this.input) this.input.focus()
			}, 100)
		}

		const penultimate_bubble = this.state.bubbles.slice(0, -1)
		const ultimate_bubble = this.state.bubbles.slice(-1)

		const is_mobile_keyboard_likely_to_be_displayed =
			this.state.reading_string && is_likely_to_be_mobile()

		return (
			<AutoScrollDown classname='flex-column'>
				<div className="chat">
					{this.props.children}
					{!is_mobile_keyboard_likely_to_be_displayed && penultimate_bubble}
					{ultimate_bubble}
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

Chat.defaultProps = {
	max_displayed_bubbles: 20,
	on_input_begin: () => {},
	on_input_end: () => {},
	on_unmount: () => {},
	initial_bubbles: [],
}

export {
	ChatBubble,
	Chat,
}
