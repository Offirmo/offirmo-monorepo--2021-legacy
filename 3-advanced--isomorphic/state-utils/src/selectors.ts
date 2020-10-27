import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import {
	WithSchemaVersion,
	WithRevision,
	WithTimestamp,
	BaseState,
	BaseTState,
	BaseUState,
	UTBundle,
	BaseRootState,
} from './types'
import {
	is_WithSchemaVersion,
	is_WithRevision,
	is_WithTimestamp,
	has_versioned_schema,
	is_revisioned,
	is_time_stamped,
	is_RootState,
	is_UTBundle,
} from './type-guards'


export function get_schema_version<
	V extends WithSchemaVersion,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
	>(s: Immutable<V> | Immutable<B> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {

	if (is_UTBundle(s)) {
		assert(get_schema_version(s[0]) === get_schema_version(s[1]), 'get_schema_version() matching U & T versions!')
		return get_schema_version(s[0])
	}

	if (is_RootState(s)) {
		assert(get_schema_version(s.u_state) === get_schema_version(s.t_state), 'get_schema_version() matching U & T versions!')
		return get_schema_version(s.u_state)
	}

	assert(is_WithSchemaVersion(s), 'get_schema_version() structure!')
	const { schema_version } = s
	assert(Number.isSafeInteger(schema_version), 'get_schema_version() safeInteger!')

	return schema_version
}

export function get_schema_version_loose<
	V extends WithSchemaVersion,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<B> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {
	if (has_versioned_schema(s))
		return get_schema_version(s)

	// specific fallbacks:
	// loose legacy bundles
	if (Array.isArray(s) && has_versioned_schema(s[0]))
		return get_schema_version(s[0])

	// final fallback
	return 0
}


export function get_revision<
	V extends WithRevision,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<B> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {

	if (is_UTBundle(s)) {
		return get_revision(s[0]) + get_revision(s[1])
	}

	if (is_RootState(s)) {
		return get_revision(s.u_state) + get_revision(s.t_state)
	}

	assert(is_WithRevision(s), 'get_revision() structure')
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
>(s: Immutable<V> | Immutable<B> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {
	if (is_revisioned(s))
		return get_revision(s)

	// specific fallbacks:
	// loose legacy bundles
	if (Array.isArray(s) && is_revisioned(s[0]))
		return get_revision(s[0]) + get_revision_loose(s[1])

	// final fallback
	return 0
}


export function get_timestamp<
	T extends WithTimestamp,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<T> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {

	if (is_UTBundle(s)) {
		return get_timestamp(s[1])
	}

	if (is_RootState(s)) {
		return get_timestamp(s.t_state)
	}

	assert(is_WithTimestamp(s), 'get_timestamp() structure')
	const { timestamp_ms } = s
	assert(Number.isSafeInteger(timestamp_ms), 'get_timestamp() safeInteger')

	return timestamp_ms
}

export function get_timestamp_loose<
	V extends WithTimestamp,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {
	if (is_time_stamped(s))
		return get_timestamp(s)

	// specific fallbacks:
	// loose bundles
	if (Array.isArray(s) && is_time_stamped(s[1]))
		return get_timestamp(s[1])

	// final fallback
	return 0
}


export function get_base_loose<
	VR extends WithSchemaVersion & WithRevision,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<VR> | Immutable<B> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): Immutable<BaseState> {
	return {
		schema_version: get_schema_version_loose(s as any),
		revision: get_revision_loose(s as any),
		// timestamp?
	}
}
