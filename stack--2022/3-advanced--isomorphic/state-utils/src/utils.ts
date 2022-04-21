import assert from 'tiny-invariant'
import icepick from 'icepick'
import { Immutable, Mutable, ImmutabilityEnforcer } from '@offirmo-private/ts-types'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import {
	BaseUState,
	BaseTState,
	BaseRootState,
	UTBundle,
	BaseAction,
} from './types'
import {
	AnyBaseState,
	AnyRootState,
} from './types--internal'
import {
	is_RootState,
	is_TState,
	is_UState, is_UTBundle, is_WithRevision,
} from './type-guards'
import {
	get_revision,
	get_revision_loose,
} from './selectors'


export const enforce_immutability: ImmutabilityEnforcer = <T>(state: T | Immutable<T>): Immutable<T> => icepick.freeze<T>(state as T) as Immutable<T>
//const enforce_immutability: ImmutabilityEnforcer = (state: T): Immutable<T> => state
//const enforce_immutability: ImmutabilityEnforcer = <T>(state: T): Immutable<T> => deep_freeze<T>(state)
export { Immutable, ImmutabilityEnforcer } from '@offirmo-private/ts-types' // for convenience

export function get_mutable_copy<I>(state: I): Mutable<I> {
	return icepick.thaw<Mutable<I>>(state as any)
}

// Use this in case of reducing a child state while unsure whether this child state has changed or not.
// - the best case is to return 'previous' = no mutation
// - if a child state's revision increased, increase ours and keep the mutation
// - it's possible that an "update to now" was invoked, it's ok to ignore that if that's the only change
// - this fn will intentionally NOT go deeper than 1st level, each state is responsible for itself!
// - this fn will intentionally NOT handle time changes, this should be done separately at the end! (separate update_to_now call)
export function complete_or_cancel_eager_mutation_propagating_possible_child_mutation<
	BU extends BaseUState,
	BT extends BaseTState,
	BR extends BaseRootState<BU, BT>,
	T = BU | BT | UTBundle<BU, BT> | BR,
>(
	previous: Immutable<T>,
	current: Immutable<T>,
	updated: Immutable<T> = previous,
	debug_id: string = 'unknown src',
): Immutable<T> {
	const PREFIX = `CoCEMPPCM(${debug_id})`
	assert(previous, `${PREFIX}: should have previous`)
	/*if (!previous)
		return current*/
	if (current === previous)
		return previous
	if (current === updated)
		return previous

	if (is_UTBundle(current)) {
		// this is a more advanced state
		assert(is_UTBundle(previous), `${PREFIX}: previous also has bundle data structure!`)
		assert(is_UTBundle(updated), `${PREFIX}: updated also has bundle data structure!`)
		const final_u_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous[0], current[0], updated?.[0])
		const final_t_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous[1], current[1], updated?.[1])
		if (final_u_state === previous[0] && final_t_state === previous[1])
			return previous
		if (final_u_state === updated[0] && final_t_state === updated[1])
			return previous

		return enforce_immutability<T>([ final_u_state, final_t_state ] as any as T)
	}
	else if (is_RootState(current)) {
		// this is a more advanced state
		assert(is_RootState(previous), `${PREFIX}: previous also has root data structure!`)
		assert(is_RootState(updated), `${PREFIX}: updated also has root data structure!`)
		const final_u_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous.u_state, current.u_state, updated.u_state, debug_id + '.u_state')
		const final_t_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous.t_state, current.t_state, updated.t_state, debug_id + '.t_state')
		if (final_u_state === previous.u_state && final_t_state === previous.t_state)
			return previous
		if (final_u_state === updated.u_state && final_t_state === updated.t_state)
			return previous

		return enforce_immutability<T>({
			...current as any,
			u_state: final_u_state,
			t_state: final_t_state,
		})
	}

	//let is_t_state = is_TState(current)
	assert(is_UState(current) || is_TState(current), `${PREFIX}: current has U/TState data structure!`) // unneeded except for helping TS type inference
	assert(
		is_UState(previous) && is_UState(updated) && is_UState(current)
		|| is_TState(previous) && is_TState(updated) && is_TState(current),
		`${PREFIX}: current+previous+updated have the same U/TState data structure!`
	)
	assert(previous.revision === updated.revision, `${PREFIX}: previous & updated should have the same revision`)
	assert(current.revision >= previous.revision, `${PREFIX}: current >= previous revision`)

	if (current.revision !== previous.revision)
		throw new Error(`${PREFIX}: revision already incremented! This call is not needed since you’re sure there was a change!`)

	const typed_previous: AnyBaseState = previous as any
	const typed_updated: AnyBaseState = updated as any
	const typed_current: AnyBaseState = current as any

	let has_child_revision_increment = false
	//let has_non_child_key_change = false
	//let has_timestamp_change: boolean | undefined = undefined

	for (const k in typed_current) {
		const previous_has_revision = is_WithRevision(typed_updated[k])
		const current_has_revision = is_WithRevision(typed_current[k])
		assert(previous_has_revision === current_has_revision, `${PREFIX}/${k}: revisioning should be coherent!`)
		if (!current_has_revision) {
			//let has_change = typed_updated[k] !== typed_current[k]
			//has_non_child_key_change ||= has_change
			assert(typed_updated[k] === typed_current[k], `${PREFIX}/${k}: manual change on Base/UState non-child key seen! This call is not needed since you’re sure there was a change!`)
		}

		const previous_revision = get_revision_loose(typed_previous[k])
		const updated_revision = get_revision_loose(typed_updated[k])
		assert(previous_revision === updated_revision, `${PREFIX}/${k}: previous & updated child should have the same revision`)

		const current_revision = get_revision_loose(typed_current[k])
		if (current_revision !== updated_revision) {
			if (current_revision !== updated_revision + 1) {
				// NO! It may be normal for a sub to have been stimulated more than once,
				// ex. gained 3 achievements
				//throw new Error(...)
			}

			has_child_revision_increment = true
			break
		}
	}

	if (!has_child_revision_increment) return previous

	return enforce_immutability<T>({
		...current as any,
		revision: get_revision(current as any) + 1,
	})
}


// check if the state is still in the revision we expect
// ex. for an action, check it's still valid, ex. object already sold?
export function are_ustate_revision_requirements_met<S extends BaseRootState>(state: Immutable<S>, requirements: { [k: string]: number } = {}): boolean {
	for(const k in requirements) {
		assert((state as AnyRootState).u_state[k], `are_ustate_revision_requirements_met(): sub state not found: "${k}"!`)
		const current_revision = ((state as AnyRootState).u_state[k]! as any).revision
		assert(Number.isInteger(current_revision), `are_ustate_revision_requirements_met(): sub state has no/invalid revision: "${k}"!`)
		if (current_revision !== requirements[k])
			return false
	}
	return true
}

export function finalize_action_if_needed<State, Action extends BaseAction>(action: Immutable<Action>, state?: Immutable<State>): Immutable<Action> {
	if (action.time <= 0) {
		action = {
			...action,
			time: get_UTC_timestamp_ms(),
		}
	}

	const has_some_blank_expected_revisions = Object.keys(action.expected_revisions).some(sub_state_key => action.expected_revisions[sub_state_key] === -1)
	if (has_some_blank_expected_revisions) {
		assert(state, `finalize_action_if_needed(): current state should be provided to finalize some expected revisions`)
		action = {
			...action,
			expected_revisions: Object.keys(action.expected_revisions).reduce((acc, val) => {
				const sub_state_key = val
				const sub_state = (state as any)[sub_state_key] || (state as any).u_state[sub_state_key]
				assert(sub_state, `finalize_action_if_needed(): state should have a sub-state "${sub_state}"`)
				const current_sub_state_revision: number = sub_state.revision
				assert(current_sub_state_revision, `sub-state "${sub_state}" should have a revision`)

				if (action.expected_revisions[sub_state_key] === -1) {
					acc[sub_state_key] = current_sub_state_revision
				}

				return acc
			}, {} as BaseAction['expected_revisions'])
		}
	}

	return action
}
