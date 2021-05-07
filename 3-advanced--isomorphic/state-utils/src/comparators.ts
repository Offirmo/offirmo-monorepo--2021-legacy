import assert from 'tiny-invariant'
import { Enum } from 'typescript-string-enums'
import { dequal as is_deep_equal } from 'dequal'
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


const _advanced_json_differ = jsondiffpatch.create({
	// method used to match objects when diffing arrays
	// by default === operator is used
	objectHash: (obj: any) => JSON.stringify(obj),
})
export const get_json_difference: (a: any, b: any) => JSONObject =
	_advanced_json_differ.diff.bind(_advanced_json_differ)

// newer and older so that we get order check as a side-effect
// TODO improve unclear params
/*
export function get_semantic_difference(newer: any, older?: any, { assert_newer = true }: { assert_newer?: boolean } = {}): SemanticDifference {
	//console.log({ newer, older })
	assert(newer, `get_semantic_difference() should have a newer at least!`)

	// trivial
	if (newer === older) return SemanticDifference.none
	if (!older) return SemanticDifference.minor // init, by convention

	// check major = schema version
	const newer_schema_version = get_schema_version_loose(newer)
	const older_schema_version = get_schema_version_loose(older)
	//console.log({ newer_schema_version, older_schema_version })
	if (assert_newer) {
		assert(newer_schema_version >= older_schema_version, `get_semantic_difference() schema version order should: ${newer_schema_version} >= ${older_schema_version}`)
	}
	if (newer_schema_version !== older_schema_version)
		return SemanticDifference.major

	// check minor = revision
	if (is_RootState(newer)) {
		//console.log('root state')
		const u_diff = get_semantic_difference(newer.u_state, older?.u_state, {assert_newer})
		const t_diff = get_semantic_difference(newer.t_state, older?.t_state, {assert_newer})
		const activity_diff =
		const sub_diff = s_max(u_diff, t_diff)
		//console.log({ u_diff, t_diff, sub_diff })
		if (sub_diff === SemanticDifference.major)
			throw new Error('get_semantic_difference() A major sub state change wasn’t propagated to the root!')

		//console.log({ sub_diff })
		return sub_diff
	}
	// do they even have revisions?
	const newer_has_revision = is_revisioned(newer)
	const older_has_revision = is_revisioned(older)
	const no_revisions = !newer_has_revision && !older_has_revision
	if (no_revisions)
		return SemanticDifference.minor // they are different. what else can we infer?
	if (assert_newer) {
		assert(newer_has_revision, `get_semantic_difference() schema version order: rev=${newer_has_revision} >= rev=${older_has_revision}`)
	}
	if (newer_has_revision !== older_has_revision)
		return SemanticDifference.major
	// compare revisions
	const newer_revision = get_revision_loose(newer)
	const older_revision = get_revision_loose(older)
	//console.log({ newer_revision, older_revision })
	if (assert_newer)
		assert(newer_revision >= older_revision, 'get_semantic_difference() revision order')
	if (newer_revision !== older_revision) {
		//console.log({ newer_revision, older_revision })
		return SemanticDifference.minor
	}

	// major & minor equal, only diff left is time
	const newer_has_timestamp = is_time_stamped(newer)
	const older_has_timestamp = is_time_stamped(older)
	if (newer_has_timestamp && older_has_timestamp) {
		const newer_timestamp = get_timestamp(newer)
		const older_timestamp = get_timestamp(older)
		if (assert_newer) {
			assert(newer_timestamp >= older_timestamp, `get_semantic_difference() timestamp order: t=${newer_timestamp} >= t=${older_timestamp}`)
		}
		if (newer_timestamp !== older_timestamp)
			return SemanticDifference.time
	}

	// we couldn't find any semantic difference.
	// however, the objects are different so bad immutability could have kicked in...
	const is_truely_equal = is_deep_equal(newer, older)
	if (!is_truely_equal) {
		const diff = get_json_difference(newer, older)
		console.error('ERROR get_semantic_difference() deep eq of semantically equal objects!', diff)
		debugger
	}
	assert(is_truely_equal, 'get_semantic_difference() deep eq of semantically equal objects')

	return SemanticDifference.none
}
*/

// compare by structure
// mainly used to sort out backups
export function compare(a: any, b: any): number {
	//console.log('compare()', { a, b })

	const schema_version__a = get_schema_version_loose(a)
	const schema_version__b = get_schema_version_loose(b)
	if (schema_version__a !== schema_version__b)
		return schema_version__a - schema_version__b

	const revision__a = get_revision_loose(a)
	const revision__b = get_revision_loose(b)
	if (revision__a !== revision__b)
		return revision__a - revision__b

	const is_root__a = is_RootState(a)
	const is_root__b = is_RootState(b)
	if (is_root__a !== is_root__b)
		return (is_root__a ? 1 : 0) - (is_root__b ? 1 : 0)
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

	const activity_tms__a = get_last_user_activity_timestamp_loose(a)
	const activity_tms__b = get_last_user_activity_timestamp_loose(b)
	if (activity_tms__a !== activity_tms__b)
		return activity_tms__a - activity_tms__b

	// last resort if state is/has a T_state
	const t_tms__a = get_timestamp_loose(a)
	const t_tms__b = get_timestamp_loose(b)
	if (t_tms__a !== t_tms__b)
		return t_tms__a - t_tms__b

	return 0
}
