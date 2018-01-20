import React from 'react'

// https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
class AutoScrollDown extends React.Component {

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


