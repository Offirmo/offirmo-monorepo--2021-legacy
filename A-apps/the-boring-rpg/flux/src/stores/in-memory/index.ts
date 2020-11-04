import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import { State } from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'
import { Immutable, get_revision_loose, get_semantic_difference, SemanticDifference, get_base_loose } from '@offirmo-private/state-utils'

import { OMRSoftExecutionContext } from '../../sec'
import { Store } from '../../types'
import { reduce_action } from '../../utils/reduce-action'

/////////////////////////////////////////////////

const EMITTER_EVT = 'change'

export function create(
	SEC: OMRSoftExecutionContext,
): Store {
	const LIB = `Store--in-mem`
	return SEC.xTry(`creating ${LIB}…`, ({ logger }) => {
		logger.trace(`${LIB}.create()…`)

		let state: Immutable<State> | undefined = undefined

		const emitter = new EventEmitter.Typed<{}, 'change'>()

		/////////////////////////////////////////////////

		function set(new_state: Immutable<State>): void {
			const semantic_difference = get_semantic_difference(new_state, state, { assert_newer: false })
			logger.trace(`${LIB}.set()`, { ...get_base_loose(new_state), semantic_difference })

			if (!state) {
				logger.trace(`${LIB}.set(): init ✔`)
			}
			else if (semantic_difference === SemanticDifference.none) {
				logger.trace(`${LIB}.set(): no semantic change ✔`)
				return
			}

			state = new_state
			emitter.emit(EMITTER_EVT)
		}

		function get(): Immutable<State> {
			assert(state, `get(): ${LIB} never initialized!`)

			return state
		}

		function on_dispatch(action: Immutable<Action>, eventual_state_hint?: Immutable<State>): void {
			logger.trace(`[${LIB}] ⚡ action dispatched: ${action.type}`, {
				...(eventual_state_hint && get_base_loose(eventual_state_hint)),
			})
			assert(state || eventual_state_hint, `on_dispatch(): ${LIB} should be provided a hint or a previous state`)
			assert(!eventual_state_hint, `on_dispatch(): ${LIB} (upper level architectural invariant) hint not expected in this store`)

			const previous_state = state
			state = eventual_state_hint || reduce_action(state!, action)
			const semantic_difference = get_semantic_difference(state, previous_state, { assert_newer: false })
			logger.trace(`[${LIB}] ⚡ action dispatched & reduced:`, {
				current_rev: get_revision_loose(previous_state as any),
				new_rev: get_revision_loose(state as any),
				semantic_difference,
			})
			if (state === previous_state) {
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
