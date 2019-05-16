import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { Field } from '@atlaskit/form'
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
	//defaultSelected: cohort === 'not-enrolled',
	//selected: cohort === 'not-enrolled',
}))


export default class Switch extends Component {
	static propTypes = {
		is_enabled: PropTypes.bool.isRequired,
		on_change: PropTypes.func.isRequired,
		override_key: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		value: PropTypes.any, // TODO refine
	}

	get_input(field_props) {
		const { is_enabled, on_change, type, value } = this.props

		switch (type) {
			case 'b':
				return (
					<Toggle
						{...field_props}
						size="large"
						isDisabled={!is_enabled}
						onChange={(event) => on_change(!value)}
						isDefaultChecked={value}
					/>
				)
			case 'co':
				return (
					<Select
						{...field_props}
						isDisabled={!is_enabled}
						className="single-select"
						classNamePrefix="react-select"
						onChange={({value}) => on_change(value)}
						options={OPTIONS}
						placeholder="Choose a cohort"
					/>
					)
			default:
				return <span>Error! Unknown type "{type}"!</span>
		}
	}

	render() {
		const { override_key, type, value } = this.props

		let default_value = value
		if (type === 'co')
			default_value = OPTIONS.find(({value: opt_value}) => value === opt_value)

		console.log(`🔄 Override "${override_key}"`, {
			props: this.props,
			default_value,
		})

		return (
			<div>
				{ /* TODO usage indicator */ }

				<div className="left-right-aligned">
					<div>{override_key}</div>
					<div className={`box-sizing-reset override-${type}`}>
						<Field name={override_key} defaultValue={default_value} isRequired>
							{({ fieldProps, error }) => error? error : this.get_input(fieldProps) }
						</Field>
					</div>
				</div>
			</div>
		)
	}
}
