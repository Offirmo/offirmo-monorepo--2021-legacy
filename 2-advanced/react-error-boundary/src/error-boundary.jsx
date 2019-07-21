import React from 'react'
import PropTypes from 'prop-types'
import assert from 'tiny-invariant'

import { get_lib_SEC } from './sec'
import { render_any } from './render-any'


class ErrorBoundary extends React.Component {
	state = {
		error: null,
		errorInfo: null,
	}
	mounted = true // need to track that in case an error happen during unmounting

	constructor(props) {
		super(props)

		const {name, SEC} = props
		assert(name, 'ErrorBoundary must have a name!!!')
		this.SEC = get_lib_SEC(SEC).createChild()
			.setLogicalStack({module: `EB:${name}`})
			.setAnalyticsAndErrorDetails({
				error_boundary: name,
			})
	}

	componentDidMount() {
		this.props.onMount(this.componentDidCatch)
	}

	componentWillUnmount() {
		this.mounted = false
	}

	// as a member var to be able to pass it around
	componentDidCatch = (error, errorInfo) => {
		const {name} = this.props

		this.SEC.xTryCatch(`handling error boundary "${name}"`, ({SEC, logger}) => {

			if (this.mounted) {
				// Catch errors in any components below and re-render with error message
				this.setState({
					error,
					errorInfo,
				})
			}

			// You can also log error messages to an error reporting service here
			logger.error(`Error caught in boundary "${name}"`, {
				error,
				errorInfo,
				isMounted: this.mounted,
			})
			SEC.fireAnalyticsEvent('react.error-boundary.triggered', {
				err: error,
				isMounted: this.mounted,
			})

			// forward to parent
			this.props.onError({
				error,
				errorInfo,
				name,
			})
		})
	}

	render() {
		const {name} = this.props

		if (this.state.error || this.state.errorInfo) {
			return (
				<div key={name} className={`o⋄error-report error-boundary-report-${name}`}>
					<h2>Boundary "{name}": Something went wrong</h2>
					<details open={true} style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo && this.state.errorInfo.componentStack}
					</details>
				</div>
			)
		}

		try {
			return render_any(this.props)
		}
		catch (err) {
			setTimeout(() => this.componentDidCatch(err, 'crash in ErrorBoundary.render()'))
		}

		return null
	}
}
ErrorBoundary.propTypes = {
	name: PropTypes.string.isRequired,
	onMount: PropTypes.func,
	onError: PropTypes.func,
	logger: PropTypes.any,
};
ErrorBoundary.defaultProps = {
	onMount: () => {},
	onError: () => {},
	logger: console,
}

export default ErrorBoundary
