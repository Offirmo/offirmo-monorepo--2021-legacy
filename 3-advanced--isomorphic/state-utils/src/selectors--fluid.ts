import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import { AnyOffirmoState } from './types'
import {
	get_schema_version_loose,
	get_revision_loose,
	get_last_user_activity_timestamp_loose,
	get_base_loose,
} from './selectors'


export function fluid_select(stateA: Immutable<AnyOffirmoState>) {
	const schema_version__A = get_schema_version_loose(stateA)

	return {
		// separation of concerns
		// comparing schema versions is not the same as comparing "effort/investment"
		has_same_schema_version_than(stateB: Immutable<AnyOffirmoState>): boolean {
			const schema_version__B = get_schema_version_loose(stateB)
			return schema_version__A === schema_version__B
		},
		has_higher_or_equal_schema_version_than(stateB: Immutable<AnyOffirmoState>): boolean {
			const schema_version__B = get_schema_version_loose(stateB)
			return schema_version__A >= schema_version__B
		},
		has_higher_schema_version_than(stateB: Immutable<AnyOffirmoState>): boolean {
			const schema_version__B = get_schema_version_loose(stateB)
			return schema_version__A > schema_version__B
		},

		has_valuable_difference_with(stateB: Immutable<AnyOffirmoState>): boolean {
			const schema_version__B = get_schema_version_loose(stateB)
			assert(schema_version__A === schema_version__B, `has_valuable_difference_with() expects same schema versions`)

			const revision__A = get_revision_loose(stateA)
			const revision__B = get_revision_loose(stateB)
			return revision__A !== revision__B
		},

		has_higher_investment_than(stateB: Immutable<AnyOffirmoState>): boolean {
			const schema_version__B = get_schema_version_loose(stateB)
			assert(schema_version__A === schema_version__B, `has_higher_investment_than() expects same schema versions`)

			const revision__A = get_revision_loose(stateA)
			const revision__B = get_revision_loose(stateB)
			if (revision__A !== revision__B)
				return revision__A > revision__B

			// same revision, may be a fork...
			const activity_tms__A = get_last_user_activity_timestamp_loose(stateA)
			const activity_tms__B = get_last_user_activity_timestamp_loose(stateB)
			if (activity_tms__A !== activity_tms__B)
				return activity_tms__A > activity_tms__B

			return false
		},

		get_debug_infos_about_comparison_with(stateB: Immutable<AnyOffirmoState>) {
			return {
				A: {
					exists: !!stateA,
					...get_base_loose(stateA)
				},
				B: {
					exists: !!stateB,
					...get_base_loose(stateB)
				},
			}
		}
	}
}
