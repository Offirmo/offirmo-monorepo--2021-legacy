import React from 'react'
import classNames from 'classnames'
const promiseFinally = require('p-finally')

const { create: create_chat } = require('@offirmo/view-chat')

import { AutoScrollDown } from '../../atoms/auto-scroll-down'
import {rich_text_to_react} from '../../../utils/rich_text_to_react'


function ChatBubble({direction = 'ltr', children}) {
	const classes = classNames(
		'chat__bubble',
		{ 'chat__bubble--ltr': direction === 'ltr'},
		{ 'chat__bubble--rtl': direction === 'rtl'},
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

		const display_message = ({msg, choices = [], side = '→'}) => {
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
					break
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

		const display_progress = ({progress_promise, msg = 'loading', msgg_acknowledge} = {}) => {
			const progress_msg = msg + '...'
			this.setState(s => {progressing: true})

			if (progress_promise.onProgress) {
				progress_promise.onProgress(progress => {
					// TODO
				})
			}

			progress_promise
				.then(() => true, () => false)
				.then(success => {
					this.setState(s => {progressing: false})

					let final_msg = success ? '✔' : '❌'
					final_msg += ' '
					final_msg += msgg_acknowledge
						? msgg_acknowledge(success)
						: msg
					console.log(final_msg) // TODO display
				})
				.catch(err => {
					console.error('unexpected', err)
					return false
				})

			return progress_promise
		}

		const chat_ui_callbacks = {
			setup: () => {},
			display_message,
			read_answer: () => { throw new Error('TODO read_answer') },
			spin_until_resolution,
			pretend_to_think,
			display_progress,
			teardown: () => {},
		}

		debugger
		const chat = create_chat({
			DEBUG,
			gen_next_step: this.props.gen_next_step,
			ui: chat_ui_callbacks,
		})

		chat.start()
			.then(() => console.log('bye'))
			.catch(console.error)
	}


	render() {
		const spinner = this.state.spinning && <div className="chat__spinner" />
		const progress_bar = this.state.progressing && <div className="chat__progress">TODO progress</div>

		return (
			<AutoScrollDown>
				<div className="chat">
					{this.props.children}
					{this.state.bubbles}
					{progress_bar}
					{spinner}
				</div>
			</AutoScrollDown>
		)
	}
}

export {
	ChatBubble,
	Chat,
}
