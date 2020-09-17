import assert from 'tiny-invariant'
import { Enum } from 'typescript-string-enums'

import {
	get_revision_loose,
	get_schema_version_loose,
	get_base_loose, get_revision,
} from './selectors'
import {
	is_revisioned,
	is_RootState,
} from './type-guards'


// tslint:disable-next-line: variable-name
export const SemanticDifference = Enum(
	'major',
	'minor',
	'none',
)
export type SemanticDifference = Enum<typeof SemanticDifference> // eslint-disable-line no-redeclare

export function s_max(a: SemanticDifference, b: SemanticDifference): SemanticDifference {
	if (a === SemanticDifference.major || b === SemanticDifference.major)
		return SemanticDifference.major

	if (a === SemanticDifference.minor || b === SemanticDifference.minor)
		return SemanticDifference.minor

	return SemanticDifference.none
}

// newer and older so that we get order check as a side-effect
export function get_semantic_difference(newer: any, older?: any, { assert_newer = true }: { assert_newer?: boolean } = {}): SemanticDifference {
	//console.log({ newer, older })

	// trivial
	if (newer === older) return SemanticDifference.none
	if (!older) return SemanticDifference.minor // init

	// check major
	assert(newer, `get_semantic_difference() should have a newer at least!`)
	const newer_schema_version = get_schema_version_loose(newer)
	const older_schema_version = get_schema_version_loose(older)
	//console.log({ newer_schema_version, older_schema_version })
	if (assert_newer) {
		assert(newer_schema_version >= older_schema_version, `get_semantic_difference() schema version order: ${newer_schema_version} >= ${older_schema_version}`)
	}
	if (newer_schema_version !== older_schema_version)
		return SemanticDifference.major

	if (is_RootState(newer)) {
		//console.log('root state')
		const u_diff = get_semantic_difference(newer.u_state, older?.u_state, { assert_newer })
		const t_diff = get_semantic_difference(newer.t_state, older?.t_state, { assert_newer })
		const sub_diff = s_max( u_diff, t_diff )
		//console.log({ u_diff, t_diff, sub_diff })
		if (sub_diff === SemanticDifference.major)
			throw new Error('get_semantic_difference() A major sub state change wasn’t propagated to the root!')

		//console.log({ sub_diff })
		return sub_diff
	}

	// check minor
	const newer_has_revision = is_revisioned(newer)
	const older_has_revision = is_revisioned(older)
	const no_revisions = !newer_has_revision && !older_has_revision
	if (assert_newer) {
		assert(no_revisions || newer_has_revision, `get_semantic_difference() schema version order: rev=${newer_has_revision} >= rev=${older_has_revision}`)
	}
	if (newer_has_revision !== older_has_revision)
		return SemanticDifference.major
	if (no_revisions)
		return SemanticDifference.minor // what else can we infer?

	const newer_revision = get_revision_loose(newer)
	const older_revision = get_revision_loose(older)
	//console.log({ newer_revision, older_revision })
	if (assert_newer)
		assert(newer_revision >= older_revision, 'get_semantic_difference() revision order')

	if (newer_revision !== older_revision) {
		//console.log({ newer_revision, older_revision })
		return SemanticDifference.minor
	}

	return SemanticDifference.none
}

export function compare(a: any, b: any): number {
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

	const u_state_rev__a = get_revision(a.u_state)
	const u_state_rev__b = get_revision(b.u_state)
	if (u_state_rev__a !== u_state_rev__b)
		return u_state_rev__a - u_state_rev__b

	const t_state_rev__a = get_revision(a.t_state)
	const t_state_rev__b = get_revision(b.t_state)
	if (t_state_rev__a !== t_state_rev__b)
		return t_state_rev__a - t_state_rev__b

	// we intentionally don't compare t_state timestamps
	// as they don't imply a difference

	return 0
}
