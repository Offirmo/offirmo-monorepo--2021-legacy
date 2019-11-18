import assert from 'tiny-invariant'

import {
	BaseUState,
	BaseTState,
	BaseRootState,
} from './types'

interface AnyBaseUState extends BaseUState {
	[k: string]: any
}
interface AnyBaseTState extends BaseTState {
	[k: string]: any
}
interface AnyRootState extends BaseRootState {
	u_state: AnyBaseUState
	t_state: AnyBaseTState
}


export function propagate_child_revision_increment_upward<S extends BaseUState | BaseRootState>(
	previous: Readonly<S> | null | undefined,
	current: Readonly<S>,
): Readonly<S> {
	if (!previous)
		return current

	let has_child_revision_increment = false

	if ((current as any).u_state) {
		// this is a more advanced state
		const typed_previous: BaseRootState = previous as any
		const typed_current: BaseRootState = current as any
		assert(!Number.isInteger((typed_current as any).revision), 'revision should be on u_state (1)!')
		assert(Number.isInteger(typed_current.u_state.revision as any), 'revision should be on u_state (2)!')
		const final_u_state = propagate_child_revision_increment_upward(typed_previous.u_state, typed_current.u_state)
		if (final_u_state === typed_current.u_state)
			return current

		return {
			...current,
			u_state: final_u_state,
		}
	}

	const typed_previous: BaseUState = previous as any
	const typed_current: BaseUState = current as any

	if (!Number.isInteger(typed_current.revision as any))
		throw new Error('propagate_child_revision_increment_upward(): Invalid current state!')

	if (Number.isInteger(typed_previous.revision as any) && typed_current.revision !== typed_previous.revision)
		throw new Error('propagate_child_revision_increment_upward(): revision already incremented!')

	for (const k in current) {
		const previous_revision = (previous[k] as any || {}).revision
		const current_revision = (current[k] as any || {}).revision
		if (current_revision !== previous_revision) {
			if (!Number.isInteger(previous_revision as any))
				throw new Error(`propagate_child_revision_increment_upward(): Invalid revision for previous "${k}"!`)
			if (!Number.isInteger(current_revision as any))
				throw new Error(`propagate_child_revision_increment_upward(): Invalid revision for current "${k}"!`)
			if (current_revision !== previous_revision + 1) {
				// NO! It may be normal for a sub to have been stimulated more than once,
				// ex. gained 3 achievements
				//throw new Error(`propagate_child_revision_increment_upward(): Invalid increment for "${k}"!`)
			}

			has_child_revision_increment = true
			break
		}
	}

	if (!has_child_revision_increment) return current


	return {
		...current,
		revision: ((current as any as BaseUState).revision || 0) + 1,
	}
}


export function are_ustate_revision_requirements_met<S extends BaseRootState>(state: Readonly<S>, requirements: { [k: string]: number } = {}): boolean {
	for(const k in requirements) {
		assert((state as AnyRootState).u_state[k], `are_ustate_revision_requirements_met(): sub state not found: "${k}"!`)
		const current_revision = ((state as AnyRootState).u_state[k]! as any).revision
		assert(Number.isInteger(current_revision), `are_ustate_revision_requirements_met(): sub state has no/invalid revision: "${k}"!`)
		if (current_revision !== requirements[k])
			return false
	}
	return true
}
