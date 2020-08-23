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
} from './type-guards'


export function get_schema_version<T extends WithSchemaVersion>(s: Readonly<T>): number {
	assert(has_versioned_schema(s), 'get_schema_version() structure')

	return s.schema_version
}

export function get_schema_version_loose<U extends WithSchemaVersion, T extends WithSchemaVersion>(s: Readonly<U> | [ Readonly<U>, Readonly<T> ] | any): number {
	if (Array.isArray(s)) {
		// case where [ UState, TState ] are bundled together for migration
		return Math.max(...s.map(get_schema_version_loose))
	}

	if (has_versioned_schema(s))
		return get_schema_version(s)

	return 0
}


export function get_revision<T extends WithRevision>(s: Readonly<T>): number {
	assert(is_revisioned(s), 'get_revision() structure')

	return s.revision
}

export function get_revision_loose<T extends WithRevision>(s: Readonly<T>): number {
	if (is_revisioned(s))
		return get_revision(s)

	return 0
}
