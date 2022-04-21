import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import {
	WithSchemaVersion,
	WithRevision,
	WithTimestamp,
	WithLastUserInvestmentTimestamp,
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
	is_WithLastUserInvestmentTimestamp,
	has_versioned_schema,
	is_revisioned,
	is_time_stamped,
	is_RootState,
	is_UTBundle,
} from './type-guards'

// "loose" =
// can recover from some legacy states (wrong structure) and will fallback to 0 if not a state (ex. undefined or unrecognized)
// BUT we don't type them as accepting null | undefined | any to better catch errors


export function get_schema_version<
	V extends WithSchemaVersion,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<B> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {

	if (is_WithSchemaVersion(s)) {
		const { schema_version } = s
		assert(Number.isSafeInteger(schema_version), 'get_schema_version() safeInteger!')
		return schema_version
	}

	if (is_UTBundle(s)) {
		assert(get_schema_version(s[0]) === get_schema_version(s[1]), 'get_schema_version() U & T versions should match inside a bundle!')
		return get_schema_version(s[0])
	}

	if (is_RootState(s)) {
		assert(get_schema_version(s.u_state) === get_schema_version(s.t_state), 'get_schema_version() U & T versions should match inside a root!')
		return get_schema_version(s.u_state)
	}

	throw new Error('get_schema_version() should have a recognized versioned structure!')
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

	// specific fallbacks
	if (Array.isArray(s)) {
		const maybe_legacy_bundle = s
		if (has_versioned_schema(maybe_legacy_bundle[0])) {
			return get_schema_version(maybe_legacy_bundle[0])
		}
	}

	if (s && typeof s === 'object') {
		const maybe_legacy_root_state = s as any
		if (maybe_legacy_root_state.u_state) {
			return get_schema_version(maybe_legacy_root_state.u_state)
		}
	}

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

	if (is_WithRevision(s)) {
		const { revision } = s
		assert(Number.isSafeInteger(revision), 'get_revision() should be a safeInteger')
		return revision
	}

	if (is_UTBundle(s)) {
		return get_revision(s[0]) + get_revision(s[1])
	}

	if (is_RootState(s)) {
		return get_revision(s.u_state) + get_revision(s.t_state)
	}

	throw new Error('get_revision() should have a recognized revisioned structure!')
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
	if (Array.isArray(s)) {
		const maybe_legacy_bundle = s
		if (is_revisioned(maybe_legacy_bundle[0])) {
			return get_revision(maybe_legacy_bundle[0]) + get_revision_loose(maybe_legacy_bundle[1])
		}
	}

	if (s && typeof s === 'object') {
		const maybe_legacy_root_state = s as any
		if (maybe_legacy_root_state.u_state || maybe_legacy_root_state.t_state) {
			return get_revision(maybe_legacy_root_state.u_state) + get_revision_loose(maybe_legacy_root_state.t_state)
		}
	}

	// final fallback
	return 0
}


export function get_timestamp<
	T extends WithTimestamp,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<T> | Immutable<UTBundle<BU, BT>> | Immutable<BR>): number {

	if (is_WithTimestamp(s)) {
		const { timestamp_ms } = s
		assert(Number.isSafeInteger(timestamp_ms), 'get_timestamp() safeInteger')
		return timestamp_ms
	}

	if (is_UTBundle(s)) {
		return get_timestamp(s[1])
	}

	if (is_RootState(s)) {
		return get_timestamp(s.t_state)
	}

	throw new Error('get_timestamp() should have a recognized revisioned structure!')
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
	T extends WithLastUserInvestmentTimestamp,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<T> | Immutable<BR>): number {

	if(is_WithLastUserInvestmentTimestamp(s)) {
		const { last_user_investment_tms } = s
		assert(Number.isSafeInteger(last_user_investment_tms), 'get_last_user_activity_timestamp() safeInteger')
		return last_user_investment_tms
	}

	throw new Error('get_last_user_activity_timestamp() should have a recognized activity-stamped structure!')

}

export function get_last_user_activity_timestamp_loose<
	V extends WithLastUserInvestmentTimestamp,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<V> | Immutable<AnyOffirmoState>): number {
	if (is_WithLastUserInvestmentTimestamp(s))
		return get_last_user_activity_timestamp(s)

	// final fallback
	return 0
}


// TODO review name
export function get_base_loose<
	VR extends WithSchemaVersion & WithRevision & WithLastUserInvestmentTimestamp,
	B extends BaseState,
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState,
>(s: Immutable<VR> | Immutable<AnyOffirmoState>): Immutable<StateInfos> | null | undefined | string {
	if (s === null)
		return null
	if (s === undefined)
		return undefined
	if (typeof s !== 'object')
		return `[not a state! ${typeof s}]`
	return {
		schema_version: get_schema_version_loose(s as any),
		revision: get_revision_loose(s as any),
		last_user_investment_tms: get_last_user_activity_timestamp_loose(s as any),
		timestamp_ms: get_timestamp_loose(s as any),
	}
}
