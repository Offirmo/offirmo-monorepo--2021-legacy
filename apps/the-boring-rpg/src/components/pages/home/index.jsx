import React from 'react'

const tbrpg = require('@oh-my-rpg/state-the-boring-rpg')
import { render_adventure } from '@oh-my-rpg/view-rich-text'

import { Chat, ChatBubble } from '../../templates/chat-interface'
import { play } from '../../../services/actions'
import { rich_text_to_react } from '../../../utils/rich_text_to_react'


class Home extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			bubbles: []
		}
		this.addRichTextBubble(tbrpg.get_recap(this.props.workspace.state), {before_mount: true})
		this.addRichTextBubble(tbrpg.get_tip(this.props.workspace.state), {before_mount: true})
		this.addRichTextBubble('What do you want to do?', {before_mount: true})
	}

	addRichTextBubble(document, {before_mount = false, direction = 'ltr'} = {}) {
		//console.log('addRichTextBubble', document)
		if (!document) return

		const key = this.state.bubbles.length + 1
		const bubble = (
			<ChatBubble key={key} direction={direction}>
				{document.$v ? rich_text_to_react(document) : document}
			</ChatBubble>
		)

		if (before_mount)
			this.state.bubbles.push(bubble)
		else
			this.setState(state => ({ bubbles: state.bubbles.concat(bubble) }))
	}


	componentDidMount () {
		const {workspace} = this.props
		const {state} = workspace

		this.element.addEventListener('click', event => {
			//console.log('click detected on', event.target)
			const {workspace} = this.props
			this.addRichTextBubble('Let’s go adventuring!', {direction: 'rtl'})
			play(workspace)
			this.addRichTextBubble(render_adventure(workspace.state.last_adventure))
			this.addRichTextBubble(tbrpg.get_tip(workspace.state))
			this.addRichTextBubble('What do you want to do?')
		})
	}

	componentWillUnmount () {
		console.info('~~ componentWillUnmount', arguments)
	}

	render() {
		const {workspace} = this.props
		const {state} = workspace

		//console.log('render', this.state)
		return (
			<div ref={elt => this.element = elt}>
				<Chat>
					{this.state.bubbles}
				</Chat>
				<button>play</button>
			</div>
		)
	}
}

export {
	Home,
}
