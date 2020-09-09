import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import { State } from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'

import { LIB as ROOT_LIB } from '../../consts'
import { OMRSoftExecutionContext } from '../../sec'
import { Store } from '../../types'
import { reduce_action } from '../../utils/reduce-action'


const EMITTER_EVT = 'change'

export function create(
	SEC: OMRSoftExecutionContext,
): Store {
	const LIB = `Store--In-mem-v2`
	return SEC.xTry(`creating ${LIB}…`, ({SEC, logger}) => {
		let state: Readonly<State> | undefined = undefined

		const emitter = new EventEmitter.Typed<{}, 'change'>()

		function set(_state: Readonly<State>): void {
			state = _state
		}

		function get(): Readonly<State> {
			assert(state, `get(): ${LIB} never initialized!`)

			return state
		}

		function on_dispatch(action: Readonly<Action>, eventual_state_hint?: Readonly<State>): void {
			logger.log(`[${LIB}] ⚡ action dispatched: ${action.type}`)
			assert(state || eventual_state_hint, `on_dispatch(): ${LIB} should be provided a hint or a previous state`)
			assert(!eventual_state_hint, `on_dispatch(): ${LIB} (upper level architectural invariant) hint not expected in this store`)

			const previous_state = state
			state = eventual_state_hint || reduce_action(state!, action)
			if (state === previous_state) return

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
