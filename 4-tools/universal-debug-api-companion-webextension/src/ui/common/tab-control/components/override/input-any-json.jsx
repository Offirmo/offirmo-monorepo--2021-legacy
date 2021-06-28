import * as React from 'react'
import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { is_valid_stringified_json } from '../../../../../common/utils/stringified-json'

export default class AnyJsonInput extends Component {
	static propTypes = {
		// mimic atlaskit
		onChange: PropTypes.func.isRequired,
		isDisabled: PropTypes.bool.isRequired,
		// this control takes a direct SJSON
		// so that it can do checks
		value_sjson: PropTypes.any.isRequired,
	}

	constructor(props) {
		super(props)
		this.input = React.createRef()
	}

	on_change = () => {
		const { onChange } = this.props
		const raw_value = this.input.current.value
		console.log('👆 AnyJsonInput on change', { raw_value })
		onChange(raw_value)
	}

	render() {
		const { isDisabled, value_sjson, ...field_props } = this.props
		const has_error = !is_valid_stringified_json(value_sjson)

		console.log('🔄 AnyJsonInput', {
			isDisabled,
			value_sjson,
			has_error,
		})

		return (
			<Fragment>
				{!isDisabled && <span>forced to </span>}
				<input type="text" className={`o⋄fontꘌroboto-condensed ${has_error ? 'override-input--error' : ''}`}
					value={value_sjson}
					disabled={isDisabled}
					onChange={this.on_change}
					ref={this.input}
				/>
				<span className="o⋄fontꘌroboto-condensed">(JSON)</span>
			</Fragment>
		)
	}
}
