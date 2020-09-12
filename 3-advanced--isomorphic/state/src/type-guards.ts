import assert from 'tiny-invariant'

import {
	WithSchemaVersion,
	WithRevision,
	BaseState,
	BaseTState,
	BaseUState,
	BaseRootState,
	BundledStates,
} from './types'


export function has_versioned_schema<T extends WithSchemaVersion>(s: Readonly<T> | any): s is T {
	return Number.isInteger(s?.schema_version)
}

export function is_revisioned<T extends WithRevision>(s: Readonly<T> | any): s is T {
	return Number.isInteger(s?.revision)
}


export function is_BaseState<T extends BaseState>(s: Readonly<T> | any): s is T {
	return has_versioned_schema<T>(s)
		&& is_revisioned<T>(s)
}


export function is_UState<T extends BaseUState>(s: Readonly<T> | any): s is T {
	return is_BaseState<T>(s)
		&& !Number.isInteger((s as any)?.timestamp_ms)
}
export function is_TState<T extends BaseTState>(s: Readonly<T> | any): s is T {
	return is_BaseState<T>(s)
		&& Number.isInteger(s?.timestamp_ms)
}
export function is_RootState<T extends BaseRootState>(s: Readonly<T> | any): s is T {
	return is_UState(s?.u_state)
		&& is_TState(s?.t_state)
		&& has_versioned_schema<T>(s)
}
export function is_bundled_UT<U extends BaseUState, T extends BaseTState>(s: Readonly<BundledStates<U, T>> | any): s is BundledStates<U, T> {
	return Array.isArray(s)
		&& s.length === 2
		&& is_UState(s[0])
		&& is_TState(s[1])
}
