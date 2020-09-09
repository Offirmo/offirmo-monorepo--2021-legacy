/*import memoize_one from 'memoize-one'*/
import assert from 'tiny-invariant'
import { Enum } from 'typescript-string-enums'
import EventEmitter from 'emittery'
import stable_stringify from 'json-stable-stringify'

import { Storage } from '@offirmo-private/ts-types'
import { State } from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'
import {
	has_versioned_schema,
	is_RootState,
	get_semantic_difference,
	SemanticDifference,
} from '@offirmo-private/state'

import { LIB as ROOT_LIB } from '../../consts'
import { OMRSoftExecutionContext } from '../../sec'
import { Store } from '../../types'
import { reduce_action } from '../../utils/reduce-action'
import {PKeyValue} from '../../../../../online-adventur.es/db/src/kvs'


const EMITTER_EVT = 'change'

const StorageKey = Enum(
	'savegame',
	'savegame-bkp',
	'savegame-bkp-m1',
	'savegame-bkp-m2',

	'cloud.pending-actions',
)
type StorageKey = Enum<typeof StorageKey> // eslint-disable-line no-redeclare


export function create(
	SEC: OMRSoftExecutionContext,
	storage: Storage
): Store {
	const LIB = `Store--local-storage`
	return SEC.xTry(`creating ${LIB}…`, ({SEC, logger}) => {
		let state: State | undefined = SEC.xTryCatch('loading existing savegame', ({logger}): State | undefined => {
			logger.verbose(`[${LIB}] savegame storage key = "${StorageKey.savegame}"`)

			// LS access can throw
			const ls_content = storage.getItem(StorageKey.savegame)
			if (!ls_content)
				return undefined

			// XXX try catch?
			const recovered_state = JSON.parse(ls_content)

			// need this check due to some serializations returning {} for empty
			const is_empty_state: boolean = !recovered_state || Object.keys(recovered_state).length === 0
			if (is_empty_state)
				return undefined

			logger.verbose(`[${LIB}] restored state`)
			logger.trace(`[${LIB}] restored state =`, { snapshot: JSON.parse(ls_content) })

			return recovered_state
		})

		function set(_state: Readonly<State>): void {
			state = _state
		}

		/*let last_minor_bkp: any =
		let last_major_bkp
		bkp__recent: null | any
		bkp__old: null | any
		bkp__older: null | any

		let bkp__recent: PKeyValue<T>['bkp__recent'] = null
		let previous_major_versions: any[] = []

		// TODO validate JSON

		// EXPECTED: values are presented from the oldest to the newest!
		function _enqueue_in_bkp_pipeline(state: any) {
			if (!state) return
			const semantic_difference = get_semantic_difference(value, state)
			if (semantic_difference === 'major') {
				_enqueue_in_major_bkp_pipeline(state)
			} else {
				bkp__recent = state
			}
		}

		// EXPECTED: values are presented from the oldest to the newest!
		function _enqueue_in_major_bkp_pipeline(old_val: any) {
			const most_recent_previous_major_version = previous_major_versions[0]
			const has_previous_major_version = !!most_recent_previous_major_version
			if (!has_previous_major_version)
				previous_major_versions.unshift(old_val)
			else {
				const semantic_difference = get_semantic_difference(old_val, most_recent_previous_major_version)
				switch (semantic_difference) {
					case 'minor':
						previous_major_versions[0] = old_val
						break
					case 'major':
						previous_major_versions.unshift(old_val)
						break
					default:
						throw new Error(`Unexpected difference when injecting into the major bkp pipeline: "${semantic_difference}"!`)
				}
			}
		}
*/
		function _optimized_store_key_value(key: string, json: any): Promise<void> {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					try {
						const value = stable_stringify(json)
						logger.log(`[${LIB}] 💾 saving ${key} <- #${json?.u_state?.revision}...`)
						storage.setItem(key, value)
						logger.trace(`[${LIB}] 💾 saved ${key} <- #${json?.u_state?.revision}.`, { snapshot: JSON.parse(value) })
						resolve()
					}
					catch (err) {
						reject(err)
					}
				}, 1)
			})
		}

		function _persist(): Promise<void> {
			return _optimized_store_key_value(StorageKey.savegame, state)

			/*
			const semantic_difference = get_semantic_difference(new_state, state)
			if (semantic_difference === SemanticDifference.none) return // no need
			*/
		}

		const emitter = new EventEmitter.Typed<{}, 'change'>()

		function get(): Readonly<State> {
			assert(state, `${LIB}.get(): never initialized`)
			return state
		}

		function on_dispatch(action: Readonly<Action>, eventual_state_hint?: Readonly<State>): void {
			logger.log(`[${LIB}] ⚡ action dispatched: ${action.type}`)
			assert(state || eventual_state_hint, `on_dispatch(): ${LIB} should be provided a hint or a previous state`)
			assert(!!eventual_state_hint, `on_dispatch(): ${LIB} (upper level architectural invariant) hint is mandatory in this store`)

			const previous_state = state
			state = eventual_state_hint || reduce_action(state!, action)
			if (state === previous_state) return

			_persist()
				.then(() => emitter.emit(EMITTER_EVT))
				.catch(err => {
					// TODO report error through an action?
					throw err
				})
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
