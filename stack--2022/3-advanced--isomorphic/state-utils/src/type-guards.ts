import { Immutable } from '@offirmo-private/ts-types'

import {
	WithSchemaVersion,
	WithRevision,
	WithTimestamp,
	BaseState,
	BaseTState,
	BaseUState,
	BaseRootState,
	UTBundle, WithLastUserInvestmentTimestamp,
} from './types'

/////////////////////////////////////////////////

export function is_WithSchemaVersion(s: Immutable<any>): s is WithSchemaVersion {
	return Number.isInteger((s as WithSchemaVersion)?.schema_version)
}
export function is_WithRevision(s: Immutable<any>): s is WithRevision {
	return Number.isInteger((s as WithRevision)?.revision)
}
export function is_WithTimestamp(s: Immutable<any>): s is WithTimestamp {
	return Number.isInteger((s as WithTimestamp)?.timestamp_ms)
}
export function is_WithLastUserInvestmentTimestamp(s: Immutable<any>): s is WithLastUserInvestmentTimestamp {
	return Number.isInteger((s as WithLastUserInvestmentTimestamp)?.last_user_investment_tms)
}

/////////////////////////////////////////////////

export function has_versioned_schema(s: Immutable<any>): boolean {
	return is_WithSchemaVersion(s)
		|| is_UTBundle(s)
		|| is_RootState(s)
}

export function is_revisioned(s: Immutable<any>): boolean {
	return is_WithRevision(s)
		|| is_UTBundle(s)
		|| is_RootState(s)
}

export function is_time_stamped(s: Immutable<any>): boolean {
	return is_WithTimestamp(s)
		|| is_UTBundle(s)
		|| is_RootState(s)
}

/////////////////////////////////////////////////

export function is_BaseState(s: Immutable<any>): s is BaseState  {
	return is_WithSchemaVersion(s)
		&& is_WithRevision(s)
}

export function is_UState(s: Immutable<any>): s is BaseUState {
	return is_BaseState(s)
		&& !is_WithTimestamp(s)
}
export function is_TState(s: Immutable<any>): s is BaseTState {
	return is_BaseState(s)
		&& is_WithTimestamp(s)
}

export function is_UTBundle(s: Immutable<any>): s is UTBundle<BaseUState, BaseTState> {
	return Array.isArray(s)
		&& s.length === 2
		&& is_UState(s[0])
		&& is_TState(s[1])
}
export function is_RootState(s: Immutable<any>): s is BaseRootState {
	return is_UState(s?.u_state)
		&& is_TState(s?.t_state)
		&& is_WithLastUserInvestmentTimestamp(s)
}
