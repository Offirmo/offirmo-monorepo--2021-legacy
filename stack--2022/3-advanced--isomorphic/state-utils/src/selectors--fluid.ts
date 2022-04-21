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

		// has actual difference, not just timestamp
		has_valuable_difference_with(stateB: Immutable<AnyOffirmoState>): boolean {
			//const schema_version__B = get_schema_version_loose(stateB)
			//assert(schema_version__A === schema_version__B, `has_valuable_difference_with() expects same schema versions`)

			const revision__A = get_revision_loose(stateA)
			const revision__B = get_revision_loose(stateB)
			return revision__A !== revision__B // no order here
		},

		has_higher_investment_than(stateB: Immutable<AnyOffirmoState>): boolean {
			// NO!
			// We don't compare schema versions straight away
			// if the user used an outdated+offline client for a while (high revision)
			// we may rather want an outdated-but-migratable format
			//assert(schema_version__A === schema_version__B, `has_higher_investment_than() expects same schema versions`)

			const revision__A = get_revision_loose(stateA)
			const revision__B = get_revision_loose(stateB)
			if (revision__A !== revision__B)
				return revision__A > revision__B

			// same revision, may be a fork...
			const activity_tms__A = get_last_user_activity_timestamp_loose(stateA)
			const activity_tms__B = get_last_user_activity_timestamp_loose(stateB)
			if (activity_tms__A !== activity_tms__B)
				return activity_tms__A > activity_tms__B

			// no change in the semantic INVESTMENT fields
			// we fallback to the other semantic fields
			const schema_version__B = get_schema_version_loose(stateB)
			if (schema_version__A !== schema_version__B)
				return schema_version__A > schema_version__B

			// no change in any of the semantic fields
			// that should mean that they are equal, so we can return true or false.
			// BUT it could also be non-semantic states (no revision, schema version, etc.)
			// meaning that we can't really tell if it's higher investment.
			// safer to assume there is an investment!
			return true
		},

		get_debug_infos_about_comparison_with(stateB: Immutable<AnyOffirmoState>, nickname__a: string = 'A', nickname__b: string = 'B') {
			return {
				[nickname__a]: get_base_loose(stateA),
				[nickname__b]: get_base_loose(stateB),
			}
		}
	}
}
