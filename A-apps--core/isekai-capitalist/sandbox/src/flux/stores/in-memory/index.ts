import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import { Immutable } from '@offirmo-private/ts-types'
import {
	AnyOffirmoState,
	BaseAction,
	get_revision_loose,
	fluid_select,
	get_base_loose,
} from '@offirmo-private/state-utils'

import { SoftExecutionContext } from '../../sec'
import { Store } from '../../types'

/////////////////////////////////////////////////

const EMITTER_EVT = 'change'

export function create<State extends AnyOffirmoState, Action extends BaseAction>(
	SEC: SoftExecutionContext,
	reduce_action: (state: Immutable<State>, action: Immutable<Action>) => Immutable<State>,
): Store<State, Action> {
	const LIB = `🔵 store--in-mem`
	return SEC.xTry(`creating ${LIB}…`, ({ logger }) => {
		logger.trace(`[${LIB}].create()…`)

		let state: Immutable<State> | undefined = undefined

		const emitter = new EventEmitter<{ [EMITTER_EVT]: undefined }>()

		/////////////////////////////////////////////////

		function set(new_state: Immutable<State>): void {
			const has_valuable_difference = !state || fluid_select(new_state).has_valuable_difference_with(state)
			logger.trace(`[${LIB}].set()`, {
				new_state: get_base_loose(new_state),
				existing_state: get_base_loose(state as any),
				has_valuable_difference,
			})

			if (!state) {
				logger.trace(`[${LIB}].set(): init ✔`)
			}
			else if (!has_valuable_difference) {
				logger.trace(`[${LIB}].set(): no valuable change ✔`)
				return
			}

			state = new_state
			emitter.emit(EMITTER_EVT)
		}

		function get(): Immutable<State> {
			assert(state, `[${LIB}].get(): should be initialized!`)

			return state
		}

		function on_dispatch(action: Immutable<Action>, eventual_state_hint?: Immutable<State>): void {
			logger.trace(`[${LIB}] ⚡ action dispatched: ${action.type}`, {
				eventual_state_hint: get_base_loose(eventual_state_hint as any),
			})
			assert(state || eventual_state_hint, `[${LIB}].on_dispatch(): should be provided a hint or a previous state`)
			assert(!eventual_state_hint, `[${LIB}].on_dispatch(): (upper level architectural invariant) hint not expected in this store`)

			const previous_state = state
			state = eventual_state_hint || reduce_action(state!, action)
			const has_valuable_difference = state !== previous_state
			logger.trace(`[${LIB}] ⚡ action dispatched & reduced:`, {
				current_rev: get_revision_loose(previous_state as any),
				new_rev: get_revision_loose(state as any),
				has_valuable_difference,
			})
			if (!has_valuable_difference) {
				return
			}

			emitter.emit(EMITTER_EVT)
		}

		function subscribe(debug_id: string, listener: () => void): () => void {
			emitter.on(EMITTER_EVT, listener)
			return () => emitter.off(EMITTER_EVT, listener)
		}

		return {
			get,
			on_dispatch,
			subscribe,
			set,
		}
	})
}

export default create
