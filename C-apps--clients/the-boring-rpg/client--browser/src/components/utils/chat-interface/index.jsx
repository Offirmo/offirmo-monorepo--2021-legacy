import * as React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { elapsed_time_ms } from '@offirmo-private/async-utils'
import schedule_on_next_repaint from 'raf-schd'

import ErrorBoundary from '@offirmo-private/react-error-boundary'
import { create as create_chat } from '@offirmo-private/view-chat'

import { AutoScrollDown } from '../auto-scroll-down'
import logger from '../../../services/logger'
import { is_likely_to_be_mobile } from '../../../services/mobile-detection'
import './index.css'


class ChatBubble extends React.Component {
	static propTypes = {
		direction: PropTypes.string,
		children: PropTypes.node.isRequired,
	}
	render() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 ChatBubble')
		const {direction = 'ltr', children} = this.props
		const classes = classNames(
			'chat__element',
			{ 'chat__element--ltr': direction === 'ltr'},
			{ 'chat__element--rtl': direction === 'rtl'},
			'chat__bubble',
		)
		return (
			<div className={classes}>
				<ErrorBoundary name="chat-bubble">
					{children}
				</ErrorBoundary>
			</div>
		)
	}
}

class Chat extends React.Component {
	static propTypes = {
		initial_bubbles: PropTypes.arrayOf(PropTypes.element),
		max_displayed_bubbles: PropTypes.number,
		gen_next_step: PropTypes.object,
		on_input_begin: PropTypes.func,
		on_input_end: PropTypes.func,
		on_unmount: PropTypes.func,
		children: PropTypes.node,
	}

	constructor (props) {
		super(props)

		// rekey backupped bubbles to avoid key conflicts
		const initial_bubbles = React.Children.map(this.props.initial_bubbles, (child, index) => {
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
		this.mounted = false // need to track to avoid errors before mount and during/after unmounting
	}

	set_state = (param) => {
		if (!this.mounted) return

		return this.setState(param)
	}

	addBubble(element, {direction = 'ltr'} = {}) {
		if (!element) return

		const key = this.state.bubble_key + 1
		const bubble = (
			<ChatBubble key={key} direction={direction}>
				{element}
			</ChatBubble>
		)

		if (!this.mounted) {
			this.state.bubbles.push(bubble)
			this.state.bubble_key++
		}
		else {
			this.set_state(state => {
				let bubbles = state.bubbles.concat(bubble).slice(-this.props.max_displayed_bubbles)

				// special unclean behavior, I will rewrite everything anyway
				if (element === 'Let’s go adventuring!') {
					bubbles = []
				}

				return {
					bubbles,
					bubble_key: state.bubble_key + 1,
				}
			})
		}
	}

	componentDidMount() {
		this.mounted = true

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
					throw new Error('display_message(): incorrect side!')
			}

			this.addBubble(
				msg,
				{ direction },
			)
		}

		const spin_until_resolution = anything => {
			this.set_state(s => {spinning: true})
			return Promise.resolve(anything)
				.finally(() => { this.set_state(s => {spinning: false}) })
		}

		const pretend_to_think = duration_ms => {
			return spin_until_resolution(elapsed_time_ms(duration_ms))
		}

		const display_progress = async ({progress_promise, msg = 'loading', msgg_acknowledge} = {}) => {
			this.set_state(state => ({
				progress_value: 0,
				progressing: true,
			}))

			await display_message({msg})

			if (progress_promise.onProgress) {
				progress_promise.onProgress(progress_value => {
					this.set_state(state => ({progress_value}))
				})
			}

			progress_promise
				.then(() => true, () => false)
				.then(success => {
					this.set_state(state => ({
						progress_value: 0,
						progressing: false,
					}))

					const final_msg = msgg_acknowledge
						? msgg_acknowledge(success)
						: 'Done.'

					this.set_state(state => ({bubbles: state.bubbles.slice(0, -1)}))

					return display_message({msg: (
						<span>
							{msg} {final_msg}
						</span>
					)})
				})
				.catch(err => {
					// display? TODO
					logger.error('display_progress: unexpected rejection', {err})
					return false
				})

			return progress_promise
		}

		const read_string = (step) => {
			if (DEBUG) console.log('↘ read_string()', step)

			return new Promise(resolve => {
				this.set_state(state => ({
					reading_string: true,
					input_resolve_fn: resolve,
				}))
				this.props.on_input_begin()
			})
				.then(raw_answer => {
					this.set_state(state => ({
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
							side: '←',
						})
							.then(() => answer)

					return answer
				})
		}

		const read_choice = async (step) => {
			if (DEBUG) console.log('↘ read_choice()')

			return new Promise(resolve => {
				this.set_state(state => ({
					choices: step.choices.map((choice, index) => {
						return (
							<button type="button"
								key={index}
								className="chat__button"
								onClick={() => resolve(choice)}
							>{choice.msg_cta}</button>
						)
					}),
				}))
			})
				.then(async (choice) => {

					this.set_state(state => ({
						choices: [],
					}))

					const answer = choice.value
					await display_message({
						msg: (choice.msgg_as_user || step.msgg_as_user || (() => choice.msg_cta))(answer),
						side: '←',
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

		return chat.start()
			.then(() => console.log('bye'))
			.catch(err => {
				if (this.componentDidCatch) {
					this.componentDidCatch(err)
					return
				}

				// don't know how to handle, rethrow
				throw err
			})
	}

	componentWillUnmount () {
		//console.info('chat-ui: componentWillUnmount', arguments)
		this.mounted = false

		let bubles_to_backup = [].concat(this.state.bubbles)
		if (this.state.choices)
			bubles_to_backup.pop() // remove the choice prompt, unneeded
		if (bubles_to_backup.length < 4)
			bubles_to_backup = [] // just the welcome prompts, no need to back it up
		this.props.on_unmount(bubles_to_backup)
	}

	onErrorBoundaryMount = (componentDidCatch) => {
		//console.log('chat-interface onErrorBoundaryMount')
		this.componentDidCatch = componentDidCatch
	}

	render() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 Chat')

		const spinner = this.state.spinning && <div className="chat__spinner" />
		const progress_bar = this.state.progressing && (
			<div className="chat__element chat__element--ltr chat__bubble">
				<progress className="chat__progress" value={this.state.progress_value} />
			</div>
		)
		const user_input = this.state.reading_string && (
			<div className="chat__element chat__element--rtl chat__bubble">
				<form onSubmit={e => e.preventDefault()}>
					<input type="text" autoFocus
						className="chat__input"
						ref={el => this.input = el}
					/>
					<button type="submit"
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
				</form>
			</div>
		)

		if (this.state.reading_string) {
			schedule_on_next_repaint(() => {
				if (this.input) this.input.focus()
			})
		}

		const penultimate_bubble = this.state.bubbles.slice(0, -1)
		const ultimate_bubble = this.state.bubbles.slice(-1)

		const is_mobile_keyboard_likely_to_be_displayed =
			this.state.reading_string && is_likely_to_be_mobile()

		return (
			<ErrorBoundary name={'chat-interface'} onMount={this.onErrorBoundaryMount}>
				<AutoScrollDown classname="flex-column">
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
			</ErrorBoundary>
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
