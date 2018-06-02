import React from 'react'

const soft_execution_context = require('@offirmo/soft-execution-context-browser')

import SEC from '../services/sec'

export default class ErrorBoundary extends React.Component {
	state = {
		error: null,
		errorInfo: null,
	}

	constructor(props) {
		super(props)

		const {name} = props
		if (!name) throw new Error('ErrorBoundary must have a name!!!')
		this.SEC = soft_execution_context.browser.create({parent: props.SEC || SEC, module: name})
	}

	componentDidCatch(error, errorInfo) {
		const {name} = this.props

		this.SEC.xTryCatch(`handling error boundary "${name}"`, ({logger}) => {
			// Catch errors in any components below and re-render with error message
			this.setState({
				error,
				errorInfo,
			})
			// You can also log error messages to an error reporting service here
			logger.error(`Error caught in boundary "${name}"`, {
				error,
				errorInfo,
			})
			if (this.props.onError)
				this.props.onError({
					name,
					error,
					errorInfo,
				})
		})
	}

	render() {
		if (this.state.errorInfo) {
			// Error path
			const {name} = this.props
			return (
				<div className={`o⋄error-report error-boundary-report-${name}`}>
					<h2>Boundary "{name}": Something went wrong</h2>
					<details style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo.componentStack}
					</details>
				</div>
			)
		}

		// Normally, just render children
		return this.props.children
	}
}
