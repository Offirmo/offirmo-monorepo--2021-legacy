import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'


export default class AnyJson extends Component {
	static propTypes = {
		// mimic atlaskit
		onChange: PropTypes.func.isRequired,
		isDisabled: PropTypes.bool.isRequired,
		// this control takes a direct JSON
		// so that it can do checks
		value_json: PropTypes.string.isRequired,
	}

	constructor(props) {
		super(props)
		this.input = React.createRef()
	}

	on_change = () => {
		const { onChange } = this.props
		const raw_value = this.input.current.value
		onChange(raw_value)
	}

	render() {
		const { isDisabled, value_json, ...field_props } = this.props
		const has_error = (() => {
			try {
				JSON.parse(value_json)
				return false
			}
			catch (err) {
				//console.error(err, { value })
				return true
			}
		})()

		console.log(`🔄 AnyJson`, {
			isDisabled,
			value_json,
			has_error,
		})

		return (
			<Fragment>
				{!isDisabled && <span>forced to </span>}
				<input type="text" className={`o⋄font⁚roboto-condensed ${has_error ? 'override-input--error' : ''}`}
					value={value_json}
					disabled={isDisabled}
					onChange={this.on_change}
					ref={this.input}
				/>
				<span className="o⋄font⁚roboto-condensed">(JSON)</span>
			</Fragment>
		);
	}
}
