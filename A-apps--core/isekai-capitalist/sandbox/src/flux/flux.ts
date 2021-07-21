/* A helper for actual games using this model
 */
import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { Immutable, Storage } from '@offirmo-private/ts-types'
import { SoftExecutionContext } from '@offirmo-private/soft-execution-context'
import { schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'
import { OverallMigrateToLatest, BaseAction } from '@offirmo-private/state-utils'


import { LIB } from './consts'
import { ActionReducer } from './types'
import { create as create_dispatcher } from './dispatcher'
import create_store__local_storage from './stores/local-storage'
import create_store__in_memory from './stores/in-memory'
import { get_lib_SEC } from './sec'
//import create_store__cloud_storage from './stores/cloud'


const EMITTER_EVT = 'change'


// TODO improve logging (too verbose)
interface CreateParams<State, Action> {
	SEC?: SoftExecutionContext
	SCHEMA_VERSION: number | undefined
	local_storage: Storage
	storage_key_radix: string
	migrate_to_latest: OverallMigrateToLatest<State>
	create: (SEC: SoftExecutionContext) => Immutable<State>
	post_create?: (state: Immutable<State>) => Immutable<State>
	update_to_now?: (state: Immutable<State>) => Immutable<State>
	reduce_action: ActionReducer<State, Action>
}
function create_flux_instance<State, Action>({
	SEC = get_lib_SEC(),
	SCHEMA_VERSION,
	local_storage,
	storage_key_radix,
	migrate_to_latest,
	create,
	post_create = (state: Immutable<State>) => state,
	update_to_now = (state: Immutable<State>) => state,
	reduce_action,
}: CreateParams<State, Action>) {
	return SEC.xTry('creating flux instance', ({SEC, logger}) => {
		logger.trace(`${LIB}.create_flux_instance()…`)

		const emitter = new EventEmitter<{ [EMITTER_EVT]: string }>()

		/////////////////////////////////////////////////
		logger.trace(`[${LIB}] linking the flux architecture = dispatcher and stores…`)

		const _dispatcher = create_dispatcher(SEC, SCHEMA_VERSION)

		const in_memory_store = create_store__in_memory(SEC, reduce_action)
		_dispatcher.register_store(in_memory_store)

		// this special store will auto un-persist a potentially existing savegame
		// but may end up empty if none existing so far
		// the savegame may also be outdated.
		const persistent_store = create_store__local_storage(
			SEC,
			local_storage,
			storage_key_radix,
			SCHEMA_VERSION,
			migrate_to_latest,
			reduce_action,
			_dispatcher,
		)
		_dispatcher.register_store(persistent_store)

		// TODO cloud
		/*const cloud_store = create_store__cloud_storage(
				SEC,
				local_storage,
				TBRPGState.migrate_to_latest,
				_dispatcher,
			)
		_dispatcher.register_store(cloud_store)*/

		/////////////////////////////////////////////////

		try {
			// arguably this is not 100% flux
			// but this should be good enough
			const recovered_state: any = persistent_store.get()
			assert(!!recovered_state, '(for local catch, see below)')
			logger.trace(`[${LIB}] restoring the state from the content of persistent store… (incl. update to now)`)
			// TODO should we really update to now?
			_dispatcher.set(update_to_now(recovered_state))
		}
		catch (err) {
			const new_state = post_create(create(SEC))
			logger.verbose(`[${LIB}] Clean savegame created from scratch.`)
			_dispatcher.set(new_state)
		}
		logger.silly(`[${LIB}] state initialised:`, in_memory_store.get())

		////////////////////////////////////

		in_memory_store.subscribe('flux', () => {
			emitter.emit(EMITTER_EVT, `[in-mem]`)
		})

		emitter.emit(EMITTER_EVT, 'init')

		////////////////////////////////////

		function dispatch(raw_action: Action) {
			const action: BaseAction = { ...raw_action as any }
			if (action.type !== 'update_to_now') console.groupEnd()

			;(console.groupCollapsed as any)(`——————— ⚡ action dispatched: ${action.type} ⚡ ———————`)
			schedule_when_idle_but_not_too_far(console.groupEnd)

			//logger.trace('current state:', { action: other_fields_for_debug })
			const { time, ...other_fields_for_debug } = action
			logger.log('⚡ action dispatched:', { action: other_fields_for_debug })

			// complete "action" object that may be missing some parts
			action.time = action.time || get_UTC_timestamp_ms()

			// TODO clarify this part
			const state: Immutable<State> = in_memory_store.get()
			Object.keys(action.expected_revisions).forEach(sub_state_key => {
				if (action.expected_revisions[sub_state_key] === -1) {
					action.expected_revisions[sub_state_key] =
						(state.u_state as any)[sub_state_key].revision
				}
			})

			_dispatcher.dispatch(action)
		}

		return {
			get: in_memory_store.get,
			dispatch,
			subscribe(id: string, fn: () => void): () => void {
				const unbind = emitter.on(EMITTER_EVT, (src: string) => {
					const { revision } = in_memory_store.get().u_state
					console.log(`🌀 model change #${revision} reported to subscriber "${id}" (source: ${src})`)
					fn()
				})
				return unbind
			},

			/*
				// currently used by the savegame editor
				reset() {
					const new_state = TBRPGState.reseed(TBRPGState.create())
					logger.info('Savegame reseted:', { new_state })

					_dispatcher.set(new_state)
				},
*//*
			_libs: {
				'@tbrpg/state': TBRPGState,
			},*/
		}
	})
}

export {
	CreateParams,
	create_flux_instance,
}
