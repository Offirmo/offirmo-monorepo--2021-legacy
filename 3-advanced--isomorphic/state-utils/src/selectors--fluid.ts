import { Immutable } from '@offirmo-private/ts-types'

import { AnyOffirmoState } from './types'


export function fluid_select(state: Immutable<AnyOffirmoState>) {
	return {
		has_valuable_difference_with(state: Immutable<AnyOffirmoState>): boolean {
			throw new Error('NIMP!')
		},
		has_same_schema_version_than(state: Immutable<AnyOffirmoState>): boolean {
			throw new Error('NIMP!')
		},
		has_lower_schema_version_than(state: Immutable<AnyOffirmoState>): boolean {
			throw new Error('NIMP!')
		},
		has_higher_or_equal_schema_version_than(state: Immutable<AnyOffirmoState>): boolean {
			throw new Error('NIMP!')
		},
		has_higher_investment_than(state: Immutable<AnyOffirmoState>): boolean {
			throw new Error('NIMP!')
		},
	}
}
