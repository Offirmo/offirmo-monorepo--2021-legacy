import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Range from '@atlaskit/range'
import { ALL_LOG_LEVELS } from '@offirmo/practical-logger-core'

const MIN_LEVEL = 0
const MAX_LEVEL = ALL_LOG_LEVELS.length - 1
const DEFAULT_LEVEL = 4

export default class LogLevelRange extends Component {
	static propTypes = {
		// mimic atlaskit
		onChange: PropTypes.func.isRequired,
		value: PropTypes.string.isRequired,
		isDisabled: PropTypes.bool.isRequired,
	}

	on_change = (value_int) => {
		const { onChange } = this.props
		const value = ALL_LOG_LEVELS[value_int]
		console.log('👆 LogLevelRange on change', { value_int, value })
		onChange(value)
	}

	render() {
		const { isDisabled, value, onChange, ...field_props } = this.props

		const index = ALL_LOG_LEVELS.findIndex(v => v === value)
		if (value && index === -1)
			console.error(`LogLevelRange: unrecognised log level "${value}"!`)
		const value_int = index === -1
			? DEFAULT_LEVEL
			: index

		console.log('🔄 LogLevelRange', {
			isDisabled,
			value,
			index,
			MIN_LEVEL,
			value_int,
			MAX_LEVEL,
			final_value: ALL_LOG_LEVELS[value_int],
		})

		return (
			<Fragment>
				<Range
					{...field_props}
					isDisabled={isDisabled}
					min={MIN_LEVEL} max={MAX_LEVEL} step={1}
					value={value_int}
					onChange={this.on_change}
				/>
				<span className={'override-input-label override-input-LogLevel-label o⋄fontꘌroboto-condensed'}>
					<Fragment>Level <b>{ALL_LOG_LEVELS[value_int]}</b> and above will be logged</Fragment>
				</span>
			</Fragment>
		)
	}
}
