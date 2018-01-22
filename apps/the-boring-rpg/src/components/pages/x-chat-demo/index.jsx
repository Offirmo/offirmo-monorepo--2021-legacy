import React from 'react'

const { get_next_step1 } = require('@offirmo/view-chat/src/demo')

import { Chat } from '../../templates/chat-interface'


class ChatDemo extends React.Component {

	constructor (props) {
		super(props)

		this.state = {}
	}

	render() {
		return (
			<div ref={elt => this.element = elt}>
				<Chat gen_next_step={get_next_step1()}>
					{this.state.bubbles}
				</Chat>
			</div>
		)
	}
}

export {
	ChatDemo,
}
