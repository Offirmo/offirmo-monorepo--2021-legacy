import React from 'react'
import classNames from 'classnames'

class Chat extends React.Component {

	// https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
	scrollToBottom = () => {
		this.messagesEnd.scrollIntoView({ behavior: "smooth" })
	}

	componentDidMount() {
		this.scrollToBottom()
	}

	componentDidUpdate() {
		this.scrollToBottom()
	}

	render() {
		const classes = classNames('chat')
		return (
			<div className={classes}>
				{this.props.children}
				<div style={{ float:"left", clear: "both" }}
					ref={(el) => { this.messagesEnd = el; }} />
			</div>
		)
	}
}

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

export {
	Chat,
	ChatBubble,
}


