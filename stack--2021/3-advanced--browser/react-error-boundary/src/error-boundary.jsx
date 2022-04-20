import * as React from 'react'
import PropTypes from 'prop-types'
import assert from 'tiny-invariant'
import { asap_but_not_synchronous } from '@offirmo-private/async-utils'

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
			logger.error(`Error caught in react-error-boundary@"${name}"`, {
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
			const { error, errorInfo } = this.state
			return (
				<div key={name} className={`o⋄error-report error-boundary-report-${name}`} style={{padding: '.3em'}}>
					<h2 style={{margin: '0'}}>Boundary "{name}": Something went wrong</h2>
					<details open={false} style={{ whiteSpace: 'pre-wrap', margin: '.3em 0' }}>
						<summary>{(error || 'unknown error').toString()}</summary>
						{(errorInfo?.componentStack || '').trim()}
					</details>
					<a href="https://github.com/Offirmo/offirmo-monorepo/issues"
					   target="_blank"
					   referrerPolicy="no-referrer-when-downgrade"
					   rel="external"
					><strong>Report bug</strong></a>
					&nbsp;
					<button
						style={{'--o⋄color⁚fg--main': 'var(--o⋄color⁚fg--error)'}}
						onClick={() => window.location.reload()}>
						Reload page
					</button>
				</div>
			)
		}

		try {
			return render_any(this.props)
		}
		catch (err) {
			asap_but_not_synchronous(() => this.componentDidCatch(err, 'crash in ErrorBoundary.render()'))
		}

		return null
	}
}
ErrorBoundary.propTypes = {
	name: PropTypes.string.isRequired,
	onMount: PropTypes.func,
	onError: PropTypes.func,
	logger: PropTypes.any,
}
ErrorBoundary.defaultProps = {
	onMount: () => {},
	onError: () => {},
	logger: console,
}

export default ErrorBoundary
