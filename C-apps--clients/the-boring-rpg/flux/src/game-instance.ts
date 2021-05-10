/* A helper for actual games using this model
 */
import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import deep_merge from 'deepmerge'
import { Enum } from 'typescript-string-enums'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { Immutable, Storage } from '@offirmo-private/ts-types'
import * as TBRPGState from '@tbrpg/state'
import { State } from '@tbrpg/state'
import { Action} from '@tbrpg/interfaces'
import { asap_but_out_of_current_event_loop, schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'
import { get_revision } from '@offirmo-private/state-utils'


import { LIB } from './consts'

import { OMRSoftExecutionContext } from './sec'
import { create as create_dispatcher } from './dispatcher'
import create_store__local_storage from './stores/local-storage'
import create_store__in_memory from './stores/in-memory'
import create_store__cloud_storage from './stores/cloud'
import { get_commands } from './dispatcher/sugar'
import { get_queries } from './selectors'

// tslint:disable-next-line: variable-name
const Event = Enum(
	'model_change',
	'view_change',
)
type Event = Enum<typeof Event> // eslint-disable-line no-redeclar

interface AppState {
	model: State,
}

function overwriteMerge<T>(destination: T, source: T): T {
	return source
}




// TODO improve logging (too verbose)
interface CreateParams<T extends AppState> {
	SEC: OMRSoftExecutionContext
	local_storage: Storage,
	app_state: T
}
function create_game_instance<T extends AppState>({SEC, local_storage, app_state}: CreateParams<T>) {
	return SEC.xTry('creating tbrpg instance', ({SEC, logger}) => {
		logger.trace(`${LIB}.create_game_instance()…`)

		const emitter = new EventEmitter<{
			[Event.model_change]: string,
			[Event.view_change]: string,
		}>()

		/////////////////////////////////////////////////
		logger.trace(`[${LIB}] linking the flux architecture = dispatcher and stores…`)

		const _dispatcher = create_dispatcher(SEC)

		const in_memory_store = create_store__in_memory(SEC)
		_dispatcher.register_store(in_memory_store)

		// this special store will auto un-persist a potentially existing savegame
		// but may end up empty if none existing so far
		// the savegame may also be outdated.
		const persistent_store = create_store__local_storage(
				SEC,
				local_storage,
				TBRPGState.migrate_to_latest,
				_dispatcher,
			)
		_dispatcher.register_store(persistent_store)

		const cloud_store = create_store__cloud_storage(
				SEC,
				local_storage,
				TBRPGState.migrate_to_latest,
				_dispatcher,
			)
		_dispatcher.register_store(cloud_store)

		/////////////////////////////////////////////////

		try {
			// arguably this is not 100% flux
			// but this should be good enough
			const recovered_state: any = persistent_store.get()
			assert(!!recovered_state, 'ls get defined')
			logger.trace(`[${LIB}] restoring the state from the content of persistent store… (incl. update to now)`)
			// TODO should we update to now?
			_dispatcher.set(TBRPGState.update_to_now(recovered_state))
		}
		catch (err) {
			const new_game = TBRPGState.reseed(TBRPGState.create(SEC))
			logger.verbose(`[${LIB}] Clean savegame created from scratch.`)
			_dispatcher.set(new_game)
		}
		logger.silly(`[${LIB}] state initialised:`, in_memory_store.get())

		////////////////////////////////////

		app_state = app_state || ({} as any as T)

		in_memory_store.subscribe('game-instance', () => {
			emitter.emit(Event.model_change, `[in-mem-v2]`)
		})

		emitter.on(Event.model_change, (src: string) => {
			app_state = {
				...(app_state as any),
				model: in_memory_store.get(),
			}
			emitter.emit(Event.view_change, `model.${src}`)
		})

		emitter.emit(Event.model_change, 'init')

		////////////////////////////////////

		function dispatch(action: Action) {
			if (action.type !== 'update_to_now') console.groupEnd()

			;(console.groupCollapsed as any)(`——————— ⚡ action dispatched: ${action.type} ⚡ ———————`)
			schedule_when_idle_but_not_too_far(console.groupEnd)

			//logger.trace('current state:', { action: debug })

			const { time, ...debug } = action
			logger.log('⚡ action dispatched:', { action: debug })

			// complete "action" object that may be missing some parts
			action.time = action.time || get_UTC_timestamp_ms()
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
			commands: {
				...get_commands(dispatch),
				dispatch,
			},

			queries: {
				...get_queries(in_memory_store),
			},

			model: {
				get: in_memory_store.get,

				//set,

				// currently used by the savegame editor
				reset() {
					const new_state = TBRPGState.reseed(TBRPGState.create())
					logger.info('Savegame reseted:', { new_state })

					_dispatcher.set(new_state)
				},

				subscribe(id: string, fn: () => void): () => void {
					const unbind = emitter.on(Event.model_change, (src: string) => {
						const { revision } = in_memory_store.get().u_state
						console.log(`🌀 model change #${revision} reported to subscriber "${id}" (source: ${src})`)
						fn()
					})
					return unbind
				},
			},

			view: {
				// allow managing a transient state

				get(): T {
					return app_state
				},

				// "set_state" because we mirror the similar React fn
				set_state(fn: (state: T) => Partial<T>): void {
					const changed = fn(app_state)
					logger.trace('⚡ view change requested', changed)
					assert(!changed.model, 'no model change allowed in view.set_state()')
					app_state = {
						...deep_merge(app_state, changed, { arrayMerge: overwriteMerge }),
						model: in_memory_store.get(), // safety
					}
					emitter.emit(Event.view_change, 'set_state(…)')
				},

				subscribe(id: string, fn: () => void): () => void {
					const unbind = emitter.on(Event.view_change, (src: string) => {
						logger.trace(`🌀🌀 root/view change reported to subscriber "${id}" (model: rev#${get_revision(in_memory_store.get())}, source: view/${src})`)
						fn()
					})
					return unbind
				},
			},

			_libs: {
				'@tbrpg/state': TBRPGState,
			},
		}
	})
}

export {
	CreateParams,
	create_game_instance,
}
