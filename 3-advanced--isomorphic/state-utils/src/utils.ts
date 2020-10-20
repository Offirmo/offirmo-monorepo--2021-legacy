import assert from 'tiny-invariant'

import {
	WithRevision,
	BaseRootState,
} from './types'
import {
	AnyBaseState,
	AnyRootState,
} from './types--internal'
import {
	is_RootState,
	is_TState,
	is_UState,
} from './type-guards'
import {
	get_revision_loose,
} from './selectors'



// if a child state's revision increased, increase ours
// TODO go deep! not just 1st level
export function propagate_child_revision_increment_upward<S extends WithRevision, R extends BaseRootState, T = S | R>(
	previous: any,
	current: Readonly<T>,
): T {
	if (!previous)
		return current

	let has_child_revision_increment = false

	if (is_RootState(current)) {
		// this is a more advanced state
		assert(is_RootState(previous), 'previous has root data structure!')
		const final_u_state = propagate_child_revision_increment_upward(previous.u_state, current.u_state)
		const final_t_state = propagate_child_revision_increment_upward(previous.t_state, current.t_state)
		if (final_u_state === current.u_state && final_t_state === current.t_state)
			return current

		return {
			...current,
			u_state: final_u_state,
			t_state: final_t_state,
		}
	}

	assert(is_UState(current) || is_TState(current), 'previous has U/TState data structure!') // uneeded except for helping TS type inference
	assert(is_UState(previous) && is_UState(current) || is_TState(previous) || is_TState(current), 'previous has U/TState data structure!')

	if (Number.isInteger(previous.revision as any) && current.revision !== previous.revision)
		throw new Error('propagate_child_revision_increment_upward(): revision already incremented!')

	const typed_previous: AnyBaseState = previous as any
	const typed_current: AnyBaseState = current as any

	for (const k in typed_current) {
		const previous_revision = get_revision_loose(typed_previous[k])
		const current_revision = get_revision_loose(typed_current[k])
		if (current_revision !== previous_revision) {
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
		revision: (current.revision || 0) + 1,
	}
}

// check if the state is still in the revision we expect
// ex. for an action, check it's still valid, ex. object already sold?
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
