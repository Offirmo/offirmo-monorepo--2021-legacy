import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { Field } from '@atlaskit/form'
import { ToggleStateless } from '@atlaskit/toggle'
import Select from '@atlaskit/select'
import LogLevelRange from './log-level-range'

import './index.css'

export const STANDARD_COHORTS = [
	'not-enrolled',
	'control',
	'variation',
	'variation-1',
	'variation-2',
	'variation-3',
	'variation-4',
]

const COHORT_SELECT_OPTIONS = STANDARD_COHORTS.map(cohort => ({
	label: cohort,
	value: cohort,
	//defaultSelected: cohort === 'not-enrolled',
	//selected: cohort === 'not-enrolled',
}))

function ActivityIndicator({has_activity}) {
	// TODO yellow on reload needed
	let classes = ['activity-indicator']
	if (has_activity) classes.push('activity-indicator--with-activity')
	return (
		<span className={classes.join(' ')}>●</span>
	)
}

export default class Switch extends Component {
	static propTypes = {
		is_injection_enabled: PropTypes.bool.isRequired,
		on_change: PropTypes.func.isRequired,
		override_key: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		value: PropTypes.any, // TODO refine
		is_enabled: PropTypes.bool.isRequired,
		has_activity: PropTypes.bool.isRequired,
	}


	get_enable_toggle(field_props) {
		const { is_injection_enabled, is_enabled, on_change } = this.props

		const is_disabled = !is_injection_enabled

		return (
			<ToggleStateless
				{...field_props}
				size="large"
				isChecked={is_enabled}
				isDisabled={is_disabled}
				onChange={(event) => on_change({is_enabled: !is_enabled})}
			/>
		)
	}

	get_input(field_props) {
		const { is_injection_enabled, on_change, type, value, is_enabled } = this.props

		// bad API
		const is_disabled = !is_injection_enabled || !is_enabled

		switch (type) {
			case 'b':
				return (
					<Fragment>
						{ is_disabled ? '' : <span className={'o⋄font⁚roboto-condensed override-input-label'}>forced to <b>{`${value}`}</b></span> }
						<ToggleStateless
							{...field_props}
							size="large"
							isDisabled={is_disabled}
							isChecked={value}
							onChange={(event) => on_change({value: !value})}
						/>
					</Fragment>
				)
			case 'co':
				return (
					<Fragment>
						{ is_disabled ? '' : <span className={'o⋄font⁚roboto-condensed override-input-label'}>forced to </span> }
						<Select
							{...field_props}
							isDisabled={is_disabled}
							className="single-select"
							classNamePrefix="react-select"
							onChange={({value}) => on_change({value})}
							options={COHORT_SELECT_OPTIONS}
							placeholder="Choose a cohort"
						/>
					</Fragment>
					)
			case 'll':
				return (
					<LogLevelRange
						{...field_props}
						isDisabled={is_disabled}
						value={value}
						onChange={(value) => on_change({value})}
					/>
				)
			default:
				return <span>Error! Unknown type "{type}"!</span>
		}
	}

	render() {
		const { override_key, type, value, is_enabled, has_activity } = this.props

		let default_value = value
		if (type === 'co')
			default_value = COHORT_SELECT_OPTIONS.find(({value: opt_value}) => value === opt_value)

		console.log(`🔄 Override "${override_key}"`, {
			props: this.props,
			default_value,
		})

		return (
			<div className={`left-right-aligned override-line`}>
				<div>
					<ActivityIndicator has_activity={has_activity} />

					<span className={`box-sizing-reset override-enable-toggle`}>
						<Field name={override_key + '_enabled'} defaultValue={is_enabled} isRequired>
							{({ fieldProps, error }) => error? error : this.get_enable_toggle(fieldProps) }
						</Field>
					</span>

					<span className={`override-label`}>
						{override_key}
					</span>
				</div>

				<div className={`box-sizing-reset override-input override-input-${type}`}>
					<Field name={override_key} defaultValue={default_value} isRequired>
						{({ fieldProps, error }) => error ? error : this.get_input(fieldProps) }
					</Field>
				</div>
			</div>
		)
	}
}
