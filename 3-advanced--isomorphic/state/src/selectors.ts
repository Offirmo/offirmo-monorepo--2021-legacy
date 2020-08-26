import assert from 'tiny-invariant'

import {
	WithSchemaVersion,
	BaseTState,
	BaseUState,
	BaseRootState, WithRevision,
} from './types'

import {
	has_versioned_schema,
	is_revisioned,
	is_UState,
	is_TState,
	is_RootState,
	is_bundled_UT,
} from './type-guards'


export function get_schema_version<U extends WithSchemaVersion, T extends WithSchemaVersion>(s: Readonly<U> | [ Readonly<U>, Readonly<T> ]): number {
	if (is_bundled_UT(s)) {
		assert(get_schema_version(s[0]) === get_schema_version(s[1]), 'get_schema_version() matching U & T versions!')
		return get_schema_version(s[0])
	}

	assert(has_versioned_schema(s), 'get_schema_version() structure!')
	assert(Number.isSafeInteger(s.schema_version), 'get_schema_version() safeInteger!')

	if (is_RootState(s)) {
		assert(get_schema_version(s.u_state) === s.schema_version, 'get_schema_version() matching U & root versions!')
		assert(get_schema_version(s.t_state) === s.schema_version, 'get_schema_version() matching T & root versions!')
	}

	return s.schema_version
}

export function get_schema_version_loose<U extends WithSchemaVersion, T extends WithSchemaVersion>(s: Readonly<U> | [ Readonly<U>, Readonly<T> ] | any): number {
	if (has_versioned_schema(s) || is_bundled_UT(s))
		return get_schema_version(s)

	return 0
}


export function get_revision<T extends WithRevision>(s: Readonly<T>): number {
	assert(is_revisioned(s), 'get_revision() structure')
	assert(Number.isSafeInteger(s.revision), 'get_revision() safeInteger')

	return s.revision
}

export function get_revision_loose<T extends WithRevision>(s: Readonly<T>): number {
	if (is_revisioned(s))
		return get_revision(s)

	return 0
}
