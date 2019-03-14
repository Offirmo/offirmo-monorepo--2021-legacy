import { JSONAny } from '@offirmo/ts-types'

export interface BaseState {
	schema_version?: number // may not have it if sub-state
	revision?: number // may not have it if not relevant = T-state

	[k: string]: JSONAny | BaseState
}

export interface BaseRootState {
	schema_version: number
	revision: number

	u_state: BaseState
	t_state: BaseState
}

export function propagate_child_revision_increment_upward<S>(
	previous: Readonly<S> | null | undefined,
	current: Readonly<S>
): Readonly<S> {
	if (!previous)
		return current

	let has_child_revision_increment = false

	if ((current as any).u_state) {
		// this is a more advanced state
		let typed_previous: BaseRootState = previous as any
		let typed_current: BaseRootState = current as any
		const final_u_state = propagate_child_revision_increment_upward(typed_previous.u_state, typed_current.u_state)
		if (final_u_state === typed_current.u_state)
			return current

		return {
			...current,
			u_state: final_u_state,
		}
	}

	let typed_previous: BaseState = previous as any
	let typed_current: BaseState = current as any

	if (!Number.isInteger(typed_current.revision as any))
		throw new Error('propagate_child_revision_increment_upward(): Invalid current state!')

	if (Number.isInteger(typed_previous.revision as any) && typed_current.revision !== typed_previous.revision)
		throw new Error('propagate_child_revision_increment_upward(): revision already increased!')

	for (let k in current) {
		let previous_revision = (previous[k] as any || {}).revision
		let current_revision =  (current[k] as any || {}).revision
		if (current_revision !== previous_revision) {
			has_child_revision_increment = true
			break
		}
	}

	if (!has_child_revision_increment) return current


	return {
		...current,
		revision: ((current as any as BaseState).revision || 0) + 1
	}
}
