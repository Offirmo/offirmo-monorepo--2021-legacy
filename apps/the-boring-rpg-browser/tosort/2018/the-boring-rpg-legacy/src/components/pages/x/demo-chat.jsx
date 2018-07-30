import React from 'react'

const { get_next_step1 } = require('@offirmo/view-chat/src/demo')

import { Chat } from '../../templates/chat-interface'


function ChatDemo() {
	return (
		<Chat gen_next_step={get_next_step1()} />
	)
}

export {
	ChatDemo,
}
