import assert from 'tiny-invariant'

import {
	WithSchemaVersion,
	WithRevision,
	BaseState,
	BaseTState,
	BaseUState,
	BundledStates,
	BaseRootState,
} from './types'

import {
	has_versioned_schema,
	is_revisioned,
	is_UState,
	is_TState,
	is_RootState,
	is_bundled_UT,
} from './type-guards'


export function get_schema_version<
	V extends WithSchemaVersion,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Readonly<V> | Readonly<B> | Readonly<BundledStates<BU, BT>> | Readonly<BR>): number {
	if (is_bundled_UT(s)) {
		assert(get_schema_version(s[0]) === get_schema_version(s[1]), 'get_schema_version() matching U & T versions!')
		return get_schema_version(s[0])
	}

	assert(has_versioned_schema(s), 'get_schema_version() structure!')
	const { schema_version } = s
	assert(Number.isSafeInteger(schema_version), 'get_schema_version() safeInteger!')

	if (is_RootState(s)) {
		assert(get_schema_version(s.u_state) === schema_version, 'get_schema_version() matching U & root versions!')
		assert(get_schema_version(s.t_state) === schema_version, 'get_schema_version() matching T & root versions!')
	}

	return schema_version
}

export function get_schema_version_loose<
	V extends WithSchemaVersion,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Readonly<V> | Readonly<B> | Readonly<BundledStates<BU, BT>> | Readonly<BR>): number {
	if (has_versioned_schema(s))
		return get_schema_version(s)

	// loose bundles
	if (Array.isArray(s) && has_versioned_schema(s[0]))
		return get_schema_version(s[0])

	return 0
}


export function get_revision<
	V extends WithRevision,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Readonly<V> | Readonly<B> | Readonly<BundledStates<BU, BT>> | Readonly<BR>): number {
	if (is_bundled_UT(s)) {
		return get_revision(s[0])
	}
	if (is_RootState(s)) {
		return get_revision(s.u_state)
	}

	assert(is_revisioned(s), 'get_revision() structure')
	const { revision } = s
	assert(Number.isSafeInteger(revision), 'get_revision() safeInteger')

	return revision
}

export function get_revision_loose<
	V extends WithRevision,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Readonly<V> | Readonly<B> | Readonly<BundledStates<BU, BT>> | Readonly<BR>): number {
	if (is_revisioned(s))
		return get_revision(s)

	// loose bundles
	if (Array.isArray(s) && is_revisioned(s[0]))
		return get_revision(s[0])

	if (is_RootState(s))
		return get_revision(s)

	return 0
}


export function get_base_loose<
	VR extends WithSchemaVersion & WithRevision,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Readonly<VR> | Readonly<B> | Readonly<BundledStates<BU, BT>> | Readonly<BR>): Readonly<BaseState> {
	return {
		schema_version: get_schema_version_loose(s as any),
		revision: get_revision_loose(s as any),
	}
}
