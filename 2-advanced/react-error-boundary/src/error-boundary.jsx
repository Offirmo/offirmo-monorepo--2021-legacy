import React from 'react'

import { get_lib_SEC } from './sec'

const DEFAULT_CONTENT = (
	<span className={`o⋄error-report error-boundary-report--${name}`}>
		ErrorBoundary: no children nor render prop!
	</span>
)

class ErrorBoundary extends React.Component {
	state = {
		error: null,
		errorInfo: null,
	}
	mounted = true // ned to track that in case an error happen at unmounting

	constructor(props) {
		super(props)

		const {name, SEC} = props
		if (!name) throw new Error('ErrorBoundary must have a name!!!')
		this.SEC = get_lib_SEC(SEC).createChild()
			.setLogicalStack({module: `EB:${name}`})
			.setAnalyticsAndErrorDetails({
				error_boundary: name,
			})
	}

	componentDidMount() {
		const {onMount} = this.props
		if (onMount) {
			onMount(this.componentDidCatch)
		}
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
				err: error, // XXX TODO
				isMounted: this.mounted,
			})

			// optionally forward to parent
			if (this.props.onError) {
				this.props.onError({
					error,
					errorInfo,
					name,
				})
			}
		})
	}

	render() {
		if (this.state.error || this.state.errorInfo) {
			const {name} = this.props
			return (
				<div key={name} className={`o⋄error-report error-boundary-report-${name}`}>
					<h2>Boundary "{name}": Something went wrong</h2>
					<details style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo && this.state.errorInfo.componentStack}
					</details>
				</div>
			)
		}

		try {
			// inspired from render-props:
			// https://github.com/donavon/render-props/blob/develop/src/index.js
			// but enhanced.
			const { children, render, ...props } = this.props
			const ComponentOrFunctionOrAny = children || render || DEFAULT_CONTENT

			//console.log('render', { 'this.props': this.props, props, ComponentOrFunctionOrAny })

			if (ComponentOrFunctionOrAny.propTypes || ComponentOrFunctionOrAny.render || (ComponentOrFunctionOrAny.prototype && ComponentOrFunctionOrAny.prototype.render))
				return <ComponentOrFunction key={name} {...props} />

			if (typeof ComponentOrFunctionOrAny === 'function')
				return ComponentOrFunctionOrAny({
					...(ComponentOrFunctionOrAny.defaultProps || {}),
					...props,
				})

			return ComponentOrFunctionOrAny
		}
		catch (err) {
			setTimeout(() => this.componentDidCatch(err, 'crash in ErrorBoundary.render()'))
		}

		return null
	}
}

export default ErrorBoundary
