import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Field } from '@atlaskit/form'
import { ToggleStateless } from '@atlaskit/toggle'
import Select from '@atlaskit/select'

import { OverrideType } from '../../../../../common/state/origin'
import SpecSyncIndicator from '../spec-sync-indicator'
import LogLevelRange from './log-level-range'
import AnyJson from './any-json'

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

function build_cohort_select_option(cohort) {
	return {
		label: cohort,
		value: `"${cohort}"`,
		//defaultSelected: cohort === 'not-enrolled',
		//selected: cohort === 'not-enrolled',
	}
}
const COHORT_SELECT_OPTIONS = STANDARD_COHORTS.map(build_cohort_select_option)


export default class Switch extends Component {
	static propTypes = {
		is_injection_enabled: PropTypes.bool.isRequired,
		on_change: PropTypes.func.isRequired,
		override: PropTypes.any.isRequired, // TODO refine
		status: PropTypes.string.isRequired,
	}

	get_enable_toggle(field_props, is_enabled) {
		const { is_injection_enabled, on_change } = this.props

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

	get_field_value() {
		const { is_injection_enabled, override } = this.props
		const { type, is_enabled, default_value_json, value_json: requested_value_json } = override.spec
		const value_json = (is_injection_enabled && is_enabled)
			? (requested_value_json === null)
				? default_value_json // if no manual override was ever requested, we start with the current default
				: requested_value_json
			: default_value_json

		console.log('get_field_value', { type, default_value_json, requested_value_json, value_json })
		switch (type) {
			case 'any':
				return value_json // direct JSON for this one
			case 'Cohort':
				return build_cohort_select_option(JSON.parse(value_json))
			case 'boolean':
				return JSON.parse(value_json)
			case 'LogLevel':
			//case 'string':
				return JSON.parse(value_json)
			default:
				console.error(`get_field_value() Error! Unknown type "${type}"!`)
				return value_json // we default to any = direct JSON
		}
	}

	get_input(field_props, is_enabled) {
		const { is_injection_enabled, on_change, override } = this.props
		const { type } = override.spec

		// bad API
		const is_disabled = !is_injection_enabled || !is_enabled
		const value = this.get_field_value()

		switch (type) {
			case OverrideType.boolean: {
				return (
					<Fragment>
						{is_disabled ? '' : <span
							className={'o⋄font⁚roboto-condensed override-input-label'}>forced to <b>{`${value}`}</b></span>}
						<ToggleStateless
							{...field_props}
							size="large"
							isDisabled={is_disabled}
							isChecked={value}
							onChange={(event) => {
								on_change({value_json: JSON.stringify(!value)})
							}}
						/>
					</Fragment>
				)
			}
			case OverrideType.Cohort: {
				// note that the select is giving back a JSON.stringified version already
				return (
					<Fragment>
						{is_disabled ? '' :
							<span className={'o⋄font⁚roboto-condensed override-input-label'}>forced to </span>}
						<Select
							{...field_props}
							isDisabled={is_disabled}
							className="single-select"
							classNamePrefix="react-select"
							onChange={({value}) => on_change({value_json})}
							options={COHORT_SELECT_OPTIONS}
							placeholder="Choose a cohort"
						/>
					</Fragment>
				)
			}
			case OverrideType.LogLevel: {
				// TODO check JSON
				return (
					<LogLevelRange
						{...field_props}
						isDisabled={is_disabled}
						value={value}
						onChange={(value) => on_change({value_json})}
					/>
				)
			}
			default:
				//console.error(`get_input() Error! Unknown type "${type}"!`)
				return (
						<AnyJson
							{...field_props}
							isDisabled={is_disabled}
							value_json={value}
							onChange={(value_json) => on_change({value_json})}
							placeholder="Any JSON..." />
					)
		}
	}

	render() {
		const { override, status } = this.props
		const { key } = override
		const { type } = override.spec

		let default_value = this.get_field_value()

		console.log(`🔄 Override "${key}"`, {
			props: this.props,
			default_value,
		})

		const is_enabled = override.spec.is_enabled

		return (
			<div className={`left-right-aligned override-line`}>
				<div>
					<SpecSyncIndicator status={status} />

					<span className={`box-sizing-reset override-enable-toggle`}>
						<Field name={key + '_enabled'} defaultValue={is_enabled} isRequired>
							{({ fieldProps, error }) => error? error : this.get_enable_toggle(fieldProps, is_enabled) }
						</Field>
					</span>

					<span className={`override-label`}>
						{key}
					</span>
				</div>

				<div className={`box-sizing-reset override-input override-input-${type}`}>
					<Field name={key} defaultValue={default_value} isRequired>
						{({ fieldProps, error }) => error ? error : this.get_input(fieldProps, is_enabled) }
					</Field>
				</div>
			</div>
		)
	}
}
