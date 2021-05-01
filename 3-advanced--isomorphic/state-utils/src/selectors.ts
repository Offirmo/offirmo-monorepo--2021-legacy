import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import {
	WithSchemaVersion,
	WithRevision,
	WithTimestamp,
	WithLastUserActivityTimestamp,
	BaseState,
	BaseTState,
	BaseUState,
	UTBundle,
	BaseRootState,
	StateInfos,
	AnyOffirmoState,
} from './types'
import {
	is_WithSchemaVersion,
	is_WithRevision,
	is_WithTimestamp,
	is_WithLastUserActivityTimestamp,
	has_versioned_schema,
	is_revisioned,
	is_time_stamped,
	is_RootState,
	is_UTBundle,
} from './type-guards'

// loose = can recover from some legacy states (wrong structure) and will fallback to 0 if not a state (ex. undefined or unrecognized)


export function get_schema_version<
	V extends WithSchemaVersion,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<B> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {

	if (is_UTBundle(s)) {
		assert(get_schema_version(s[0]) === get_schema_version(s[1]), 'get_schema_version() U & T versions should match inside a bundle!')
		return get_schema_version(s[0])
	}

	if (is_RootState(s)) {
		assert(get_schema_version(s.u_state) === get_schema_version(s.t_state), 'get_schema_version() U & T versions should match inside a root!')
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
>(s: Immutable<V> | Immutable<AnyOffirmoState>): number {
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

	assert(is_WithRevision(s), 'get_revision() should have a revision')
	const { revision } = s
	assert(Number.isSafeInteger(revision), 'get_revision() should be a safeInteger')

	return revision
}

export function get_revision_loose<
	V extends WithRevision,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<AnyOffirmoState>): number {
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
>(s: Immutable<V> | Immutable<AnyOffirmoState>): number {
	if (is_time_stamped(s))
		return get_timestamp(s as any)

	// specific fallbacks:
	// loose bundles
	if (Array.isArray(s) && is_time_stamped(s[1]))
		return get_timestamp(s[1])

	// final fallback
	return 0
}


export function get_last_user_activity_timestamp<
	T extends WithLastUserActivityTimestamp,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<T> | Immutable<BR>): number {
	assert(is_WithLastUserActivityTimestamp(s), 'get_last_user_activity_timestamp() structure')
	const { last_user_activity_tms } = s
	assert(Number.isSafeInteger(last_user_activity_tms), 'get_last_user_activity_timestamp() safeInteger')

	return last_user_activity_tms
}

export function get_last_user_activity_timestamp_loose<
	V extends WithLastUserActivityTimestamp,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<AnyOffirmoState>): number {
	if (is_WithLastUserActivityTimestamp(s))
		return get_last_user_activity_timestamp(s)

	// final fallback
	return 0
}


export function get_base_loose<
	VR extends WithSchemaVersion & WithRevision & WithLastUserActivityTimestamp,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<VR> | Immutable<AnyOffirmoState>): Immutable<StateInfos> {
	return {
		schema_version: get_schema_version_loose(s as any),
		revision: get_revision_loose(s as any),
		last_user_activity_tms: get_last_user_activity_timestamp_loose(s as any)
	}
}
