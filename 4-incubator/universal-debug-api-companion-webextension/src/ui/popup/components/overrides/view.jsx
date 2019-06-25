import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Toggle from '@atlaskit/toggle'
import Select from '@atlaskit/select'

export const STANDARD_COHORTS = [
	'not-enrolled',
	'control',
	'variation',
	'variation-1',
	'variation-2',
	'variation-3',
	'variation-4',
]

const OPTIONS = STANDARD_COHORTS.map(cohort => ({
	label: cohort,
	value: cohort,
	defaultSelected: cohort === 'not-enrolled',
	selected: cohort === 'not-enrolled',
}))


export default class Switch extends Component {
	static propTypes = {
		is_injection_enabled: PropTypes.bool.isRequired,
		on_change: PropTypes.func.isRequired,
		label: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		value: PropTypes.any, // TODO refine
	}

	get_input() {
		const { is_injection_enabled, on_change, type, value } = this.props

		switch (type) {
			case 'b':
				return (
					<Toggle
						size="large"
						isDisabled={!is_injection_enabled}
						isDefaultChecked={value}
						onChange={on_change}
					/>
				)
			case 'co':
				return (
					<Select
						isDisabled={!is_injection_enabled}
						className="single-select"
						classNamePrefix="react-select"
						value={value}
						defaultValue={value}
						options={OPTIONS}
						placeholder="Choose a cohort"
					/>
					)
			default:
				return <span>Error! Unknown type "{type}"!</span>
		}
	}

	render() {
		console.log(`🔄 Switch`, this.props)
		const { label, type } = this.props
		return (
			<div>
				<div className="left-right-aligned">
					<div>{label}</div>
					<div className={`box-sizing-reset override-${type}`}>
						{this.get_input()}
					</div>
				</div>
			</div>
		)
	}
}
