import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Field } from '@atlaskit/form'
import { ToggleStateless } from '@atlaskit/toggle'
import Select from '@atlaskit/select'
import { LogLevel, ALL_LOG_LEVELS } from '@offirmo/practical-logger-core'

import { OverrideState as OriginOverrideState, OverrideType } from '../../../../../common/state/origin'
import { SpecSyncStatus } from '../../../../../common/state/tab'
import { OverrideState as FullOverrideState } from '../../../../../common/state/ui'
import { StringifiedJSON, is_valid_stringified_json, sjson_stringify, sjson_parse } from '../../../../../common/utils/stringified-json'

import SpecSyncIndicator from '../spec-sync-indicator'
import LogLevelRange from './input-log-level'
import AnyJson from './input-any-json'

import './index.css'



function style_fn_color(base, { isDisabled }) {
	return {
		...base,
		color: isDisabled
			? 'var(--o⋄color⁚fg--secondary)'
			: 'var(--o⋄color⁚fg--main)',
	}
}
function style_fn_bgcolor(base, { isDisabled, isSelected }) {
	return {
		...base,
		backgroundColor: isDisabled
			? 'var(--o⋄color⁚bg--main)'
			: isSelected
				? 'var(--o⋄color⁚fg--activity-outline)'
				: 'var(--o⋄color⁚bg--main)',
		':hover': {
			...base[':hover'],
			backgroundColor: 'var(--o⋄color⁚fg--activity-outline)',
		},
		//cursor: isDisabled ? 'not-allowed' : 'default',
	}
}

export const STANDARD_COHORTS = [
	'not-enrolled',
	'control',
	'variation',
	'variation-1',
	'variation-2',
	'variation-3',
	'variation-4',
]
function build_cohort_select_option(cohort: string) {
	return {
		label: cohort,
		value: sjson_stringify(cohort),
		//defaultSelected: cohort === 'not-enrolled',
		//selected: cohort === 'not-enrolled',
	}
}
const COHORT_SELECT_OPTIONS = STANDARD_COHORTS.map(build_cohort_select_option)

interface Props {
	is_injection_enabled: boolean,
	on_change: (p: Partial<OriginOverrideState>) => void,
	override: Readonly<FullOverrideState>,
	status: SpecSyncStatus,
}

export default class OverrideLine extends Component<Props> {
	static propTypes = {
		is_injection_enabled: PropTypes.bool.isRequired,
		on_change: PropTypes.func.isRequired,
		override: PropTypes.any.isRequired,
		status: PropTypes.string.isRequired,
	}

	get_enable_toggle(field_props: any, is_enabled: boolean) {
		const { is_injection_enabled, on_change } = this.props

		const is_disabled = !is_injection_enabled

		return (
			<ToggleStateless
				{...field_props}
				size="large"
				isChecked={is_enabled}
				isDisabled={is_disabled}
				onChange={() => {
					const p: Partial<OriginOverrideState> = {
						is_enabled: !is_enabled,
					}
					on_change(p)
				}}
			/>
		)
	}

	get_field_value_sjson(): StringifiedJSON {
		const { is_injection_enabled, override } = this.props
		const { type, is_enabled, default_value_sjson, value_sjson: requested_value_sjson } = override.spec
		const value_sjson: StringifiedJSON = (is_injection_enabled && is_enabled)
			? (requested_value_sjson === null || requested_value_sjson === undefined)
				? default_value_sjson // if no manual override was ever requested, we start with the current default
				: requested_value_sjson
			: default_value_sjson

		//console.log('get_field_value_sjson', { type, default_value_sjson, requested_value_json: requested_value_sjson, value_sjson })

		return value_sjson
	}

	get_field_value() {
		const { override } = this.props
		const { type } = override.spec
		const value_sjson = this.get_field_value_sjson()

		try {
			switch (type) {
				case 'any':
					return value_sjson // direct JSON for this one
				case 'Cohort':
					return build_cohort_select_option(sjson_parse(value_sjson))
				case 'boolean':
					return sjson_parse(value_sjson)
				case 'LogLevel':
					//case 'string':
					return sjson_parse(value_sjson)
				default:
					throw new Error(`get_field_value() Error! Unknown type "${type}"!`)
			}
		}
		catch (err) {
			/* swallow the error,
			   will be detected elsewhere and the field type will default to any = direct SJSON
			 */
			//console.error(`get_field_value() Error!`, { err })
			return value_sjson
		}
	}

	get_input_any(field_props: any, is_disabled: boolean) {
		const { on_change } = this.props
		return (
			<AnyJson
				{...field_props}
				isDisabled={is_disabled}
				value_sjson={this.get_field_value_sjson()}
				onChange={(value_sjson: string) => {
					console.log('✨ OverrideLine on change any:', { value_sjson })
					on_change({value_sjson})
				}}
				placeholder="Any JSON or undefined..."/>
		)
	}

	get_input(field_props: any, is_enabled: boolean) {
		const { is_injection_enabled, on_change, override } = this.props
		const { type } = override.spec

		// bad API
		const is_disabled = !is_injection_enabled || !is_enabled

		const value_sjson = this.get_field_value_sjson()
		const value = this.get_field_value()

		console.log('   🔄 get_input()', {
			is_injection_enabled,
			override,
			type,
			is_disabled,
			value_sjson,
			value,
		})

		try {
			if (!is_valid_stringified_json(value_sjson))
				throw new Error('Invalid JSON!')

			if (is_disabled && value_sjson === 'undefined')
				return <span>(undefined)</span>

			switch (type) {
				case OverrideType.boolean: {
					if (typeof value !== 'boolean')
						throw new Error('Incorrect boolean value!')

					return (
						<Fragment>
							{is_disabled ? '' : <span
								className={'o⋄fontꘌroboto-condensed override-input-label'}>forced to <b>{`${value}`}</b></span>}
							<ToggleStateless
								{...field_props}
								size="large"
								isDisabled={is_disabled}
								isChecked={value}
								onChange={() => {
									const value_sjson = sjson_stringify(!value)
									console.log('✨ OverrideLine on change boolean:', {value_sjson})
									on_change({value_sjson})
								}}
							/>
						</Fragment>
					)
				}
				case OverrideType.Cohort: {
					if (value.label && (
						   typeof value.label !== 'string'
						|| typeof value.value !== 'string'
						|| !STANDARD_COHORTS.includes(value.label)
					))
						throw new Error('Incorrect cohort value!')
					// note that the select is giving back a JSON.stringified version already
					return (
						<Fragment>
							{is_disabled ? '' :
								<span className={'o⋄fontꘌroboto-condensed override-input-label'}>forced to </span>}
							<Select
								{...field_props}
								isDisabled={is_disabled}
								className="single-select"
								classNamePrefix="react-select"
								onChange={({value: value_sjson}: { value: string }) => {
									console.log('✨ OverrideLine on change cohort select:', {value_sjson})
									on_change({value_sjson})
								}}
								options={COHORT_SELECT_OPTIONS}
								placeholder="Choose a cohort"
								styles={{
									control: (base, state) => style_fn_color(style_fn_bgcolor(base, state), state),
									container: style_fn_color,
									singleValue: style_fn_color,
									dropdownIndicator: style_fn_color,
									option: (base, state) => style_fn_color(style_fn_bgcolor(base, state), state),
								}}
							/>
						</Fragment>
					)
				}
				case OverrideType.LogLevel: {
					if (typeof value !== 'string' || !ALL_LOG_LEVELS.includes(value as LogLevel))
						throw new Error('Incorrect log level value!')
					return (
						<LogLevelRange
							{...field_props}
							isDisabled={is_disabled}
							value={value}
							onChange={(value: string) => {
								const value_sjson = sjson_stringify(value)
								console.log('✨ OverrideLine on change log level:', { value_sjson })
								on_change({ value_sjson })
							}}
						/>
					)
				}
				case OverrideType.any:
					return this.get_input_any(field_props, is_disabled)
				default:
					throw new Error(`get_input() Error! Unknown type "${type}"!`)
			}
		} catch (err) {
			console.error('OverrideLine: get_input() Error! Defaulting to raw Json editor.', { value_sjson, value, err })
			return this.get_input_any(field_props, is_disabled)
		}
	}

	render() {
		const { override, status } = this.props
		const { key } = override
		const { type } = override.spec

		const default_value = this.get_field_value()

		console.log(`🔄 OverrideLine "${key}"`, {
			props: this.props,
			default_value,
		})

		const is_enabled = override.spec.is_enabled

		return (
			<div className={'left-right-aligned override-line'}>
				<div>
					<SpecSyncIndicator status={status} />

					<span className={'box-sizing-reset override-enable-toggle'}>
						<Field name={key + '_enabled'} defaultValue={is_enabled} isRequired>
							{({ fieldProps, error }: any) => error ? error : this.get_enable_toggle(fieldProps, is_enabled) }
						</Field>
					</span>

					<span className={'override-label'}>
						{key}
					</span>
				</div>

				<div className={`box-sizing-reset override-input override-input-${type}`}>
					<Field name={key} defaultValue={default_value} isRequired>
						{({ fieldProps, error }: any) => error ? error : this.get_input(fieldProps, is_enabled) }
					</Field>
				</div>
			</div>
		)
	}
}
