import assert from 'tiny-invariant'
import { Enum } from 'typescript-string-enums'
import memoize_one from 'memoize-one'
const jsondiffpatch = require('jsondiffpatch')

import {
	is_time_stamped,
	is_revisioned,
	is_RootState,
} from './type-guards'
import {
	get_schema_version_loose,
	get_revision_loose,
	get_last_user_activity_timestamp_loose,
	get_timestamp_loose,
} from './selectors'
import { JSONObject } from '@offirmo-private/ts-types'

////////////////////////////////////

export { dequal as is_deep_equal } from 'dequal'

// tslint:disable-next-line: variable-name
export const SemanticDifference = Enum(
	'none',
	'time', // time of last meaningful activity, not T-State. Important to discriminate forks.
	'minor',
	'major',
)
export type SemanticDifference = Enum<typeof SemanticDifference> // eslint-disable-line no-redeclare


export function s_max(a: SemanticDifference, b: SemanticDifference): SemanticDifference {
	if (a === SemanticDifference.major || b === SemanticDifference.major)
		return SemanticDifference.major

	if (a === SemanticDifference.minor || b === SemanticDifference.minor)
		return SemanticDifference.minor

	if (a === SemanticDifference.time || b === SemanticDifference.time)
		return SemanticDifference.time

	return SemanticDifference.none
}

// used only in tests AFAIK
const _get_advanced_json_differ = memoize_one(() => {
	const advanced_json_differ = jsondiffpatch.create({
		// method used to match objects when diffing arrays
		// by default === operator is used
		objectHash: (obj: any) => JSON.stringify(obj),
	})

	return advanced_json_differ
})

export function get_json_difference(a: any, b: any): JSONObject {
	return _get_advanced_json_differ().diff(a, b)
}


// TODO improve unclear semantics
export function UNCLEAR_get_difference__full(a: any, b?: any): { type: SemanticDifference, direction: number } {
	//console.log('compare()', { a, b })

	// quick
	if (a === b)
		return {
			type: SemanticDifference.none,
			direction: 0,
		}

	const exists__a = !!a
	const exists__b = !!b
	if (exists__a !== exists__b)
		return {
			type: SemanticDifference.minor, // by convention
			direction: (exists__a ? 1 : 0) - (exists__b ? 1 : 0)
		}

	const schema_version__a = get_schema_version_loose(a)
	const schema_version__b = get_schema_version_loose(b)
	if (schema_version__a !== schema_version__b)
		return {
			type: SemanticDifference.major,
			direction: schema_version__a - schema_version__b
		}

	const is_root__a = is_RootState(a)
	const is_root__b = is_RootState(b)
	if (is_root__a !== is_root__b)
		return {
			type: SemanticDifference.major,
			direction: (is_root__a ? 1 : 0) - (is_root__b ? 1 : 0)
		}
	/* TODO is it needed? revision should work on a state
	if (is_root__a) {
		const u_state_rev__a = get_revision_loose(a.u_state)
		const u_state_rev__b = get_revision_loose(b.u_state)
		if (u_state_rev__a !== u_state_rev__b)
			return u_state_rev__a - u_state_rev__b

		const t_state_rev__a = get_revision_loose(a.t_state)
		const t_state_rev__b = get_revision_loose(b.t_state)
		if (t_state_rev__a !== t_state_rev__b)
			return t_state_rev__a - t_state_rev__b
	}*/
	if (is_root__a && a.ⵙapp_id && b.ⵙapp_id) {
		assert(a.ⵙapp_id === b.ⵙapp_id, `UNCLEAR_get_difference() states should be in the same universe!`)
	}

	const revision__a = get_revision_loose(a)
	const revision__b = get_revision_loose(b)
	if (revision__a !== revision__b)
		return {
			type: SemanticDifference.minor,
			direction: revision__a - revision__b,
		}

	const activity_tms__a = get_last_user_activity_timestamp_loose(a)
	const activity_tms__b = get_last_user_activity_timestamp_loose(b)
	if (activity_tms__a !== activity_tms__b)
		return {
			type: SemanticDifference.minor, // fork
			direction: activity_tms__a - activity_tms__b,
		}

	// last resort if state is/has a T_state
	const t_tms__a = get_timestamp_loose(a)
	const t_tms__b = get_timestamp_loose(b)
	if (t_tms__a !== t_tms__b)
		return {
			type: SemanticDifference.time,
			direction: t_tms__a - t_tms__b,
		}

	if ([
		schema_version__a,
		revision__a,
		activity_tms__a,
		t_tms__a
	].join(',') === '0,0,0,0') {
		// compared stuff are not semantic states
		return {
			type: SemanticDifference.minor, // by convention = minor change on an implied "schema version = 0"
			direction: t_tms__a - t_tms__b,
		}
	}

	return {
		type: SemanticDifference.none,
		direction: 0,
	}
}

export function UNCLEAR_get_difference(a: any, b?: any): SemanticDifference {
	return UNCLEAR_get_difference__full(a, b).type
}
export function UNCLEAR_compare(a: any, b: any): number {
	return UNCLEAR_get_difference__full(a, b).direction
}
