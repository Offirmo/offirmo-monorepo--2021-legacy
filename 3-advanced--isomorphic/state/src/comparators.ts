import assert from 'tiny-invariant'
import { Enum } from 'typescript-string-enums'

import {
	get_revision_loose,
	get_schema_version_loose,
} from './selectors'
import {
	is_RootState,
} from './type-guards'


// tslint:disable-next-line: variable-name
export const SemanticDifference = Enum(
	'major',
	'minor',
	'none',
)
export type SemanticDifference = Enum<typeof SemanticDifference> // eslint-disable-line no-redeclare

export function max(a: SemanticDifference, b: SemanticDifference): SemanticDifference {
	if (a === SemanticDifference.major || b === SemanticDifference.major)
		return SemanticDifference.major

	if (a === SemanticDifference.minor || b === SemanticDifference.minor)
		return SemanticDifference.minor

	return SemanticDifference.none
}

// newer and older so that we get order check as a side-effect
export function get_semantic_difference(newer: any, older?: any): SemanticDifference {
	const newer_schema_version = get_schema_version_loose(newer)
	const older_schema_version = get_schema_version_loose(older)
	assert(newer_schema_version >= older_schema_version, `get_semantic_difference() schema version order: ${newer_schema_version} >= ${older_schema_version}`)

	if (newer_schema_version !== older_schema_version)
		return SemanticDifference.major

	if (is_RootState(newer)) {
		const u_diff = get_semantic_difference(newer.u_state, older?.u_state)
		const t_diff = get_semantic_difference(newer.t_state, older?.t_state)
		const sub_diff = max( u_diff, t_diff )
		//console.log({ u_diff, t_diff, sub_diff })
		if (sub_diff === SemanticDifference.major)
			throw new Error('get_semantic_difference() A major sub state change wasn’t propagated to the root!')

		return sub_diff
	}

	const newer_revision = get_revision_loose(newer)
	const older_revision = get_revision_loose(older)
	assert(newer_revision >= older_revision, 'get_semantic_difference() revision order')

	if (newer_revision !== older_revision)
		return SemanticDifference.minor

	if (newer_revision === 0 && newer !== older)
		return SemanticDifference.minor

	return SemanticDifference.none
}
