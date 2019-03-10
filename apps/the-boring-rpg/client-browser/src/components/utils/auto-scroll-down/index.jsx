import React from 'react'
import PropTypes from 'prop-types'

import './index.css'

const DELAY_MS = 150

// https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
class AutoScrollDown extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
	}

	scrollToBottom = () => {
		if (this.messagesEnd)
			this.messagesEnd.scrollIntoView({ behavior: 'instant' }) // could be smooth
	}

	componentDidMount() {
		setTimeout(() => this.scrollToBottom(), DELAY_MS)
	}

	componentDidUpdate() {
		setTimeout(() => this.scrollToBottom(), DELAY_MS)
	}

	render() {
		if (window.XOFF.flags.debug_render) console.log('🔄 AutoScrollDown')
		return (
			<div className={'auto-scroll-down'}>

				{this.props.children}

				<div style={{ float:"left", clear: "both" }} ref={el => this.messagesEnd = el} />
			</div>
		)
	}
}

export {
	AutoScrollDown,
}


