import assert from 'tiny-invariant'

import {
	WithRevision,
	WithSchemaVersion,
} from './types'
import {
	get_revision,
	get_schema_version,
	get_schema_version_loose,
} from './selectors'
import {
	has_versioned_schema,
	is_revisioned,
} from './type-guards'


// standard comparison function
export function compare_schema_versions(a: Readonly<WithSchemaVersion>, b: Readonly<WithSchemaVersion>): number {
	return get_schema_version(a) - get_schema_version(b)
}

export function is_newer_schema_version<T extends WithSchemaVersion, OldT extends WithSchemaVersion>(current: Readonly<T>, previous: Readonly<OldT>): boolean {
	return compare_schema_versions(current, previous) > 0
}

// a more loose version which accepts the previous state to be anything
export function is_loosely_newer_schema_version<T extends WithSchemaVersion, OldT extends WithSchemaVersion>(current: Readonly<T>, previous?: Readonly<OldT> | any): boolean {
	if (current === previous) return false

	const previous_schema_version = get_schema_version_loose(previous)
	if (!previous_schema_version)
		return true

	return compare_schema_versions(current, previous) >= 0
}

export function assert_loosely_newer_schema_version<T extends WithSchemaVersion, OldT extends WithSchemaVersion>(current: Readonly<T>, previous?: Readonly<OldT> | any): void {
	assert(is_loosely_newer_schema_version(current, previous), 'assert_loosely_newer_schema_version()!')
}

// standard comparison function
export function compare_revisions(a: Readonly<WithRevision>, b: Readonly<WithRevision>): number {
	return get_revision(a) - get_revision(b)
}


/*
export function is_newer(current: any, previous?: any): boolean {
	const has_current_a_schema_version = has_versioned_schema(current)
	if (has_current_a_schema_version) {
		const is_newer_according_to_schema = is_loosely_newer_schema_version(current, previous)
		if (is_newer_according_to_schema) return true
	}

	const is_current_revisioned = is_revisioned(current)
	if (is_current_revisioned) {
		const is_newer_
	}
}
*/
