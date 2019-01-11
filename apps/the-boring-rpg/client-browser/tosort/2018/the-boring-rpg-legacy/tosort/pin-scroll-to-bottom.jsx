import React from 'react'

class PinScrollToBottom extends React.Component {
	componentDidMount() {
		this.scroll()
	}

	componentDidUpdate(prevProps) {
		this.scroll()
	}

	componentWillUpdate() {
		const { clientHeight, scrollTop, scrollHeight } = document.documentElement
		this.scrolledUp = clientHeight + scrollTop < scrollHeight
	}

	scroll() {
		if (!this.scrolledUp)
			window.scrollTo(0, document.documentElement.scrollHeight)
	}

	render() {
		return this.props.children
	}
}

export {
	PinScrollToBottom,
}
