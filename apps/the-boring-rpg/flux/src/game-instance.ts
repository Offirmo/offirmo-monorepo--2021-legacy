/* A helper for actual games using this model
 */

import EventEmitter from 'emittery'
import deep_merge from 'deepmerge'
import { Enum } from 'typescript-string-enums'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { OMRContext } from '@oh-my-rpg/definitions'
import { Storage } from '@offirmo-private/ts-types'
import { overrideHook } from '@offirmo/universal-debug-api-minimal-noop'

import * as TBRPGState from '@tbrpg/state'
import { State } from '@tbrpg/state'
import { Action, TbrpgStorage } from '@tbrpg/interfaces'

import { SoftExecutionContext } from './sec'
import create_persistent_store from './stores/persistent'
import create_in_memory_store from './stores/in-memory'
import create_cloud_store from './stores/cloud-offline-first'
import { get_commands } from './commands'
import { get_queries } from './queries'
import {LIB} from './consts'

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

interface CreateParams<T extends AppState> {
	SEC: SoftExecutionContext
	local_storage: Storage,
	storage: TbrpgStorage,
	app_state: T
}
function create_game_instance<T extends AppState>({SEC, local_storage, storage, app_state}: CreateParams<T>) {
	return SEC.xTry('creating tbrpg instance', ({SEC, logger}: OMRContext) => {

		app_state = app_state || ({} as any as T)

		const emitter = new EventEmitter()

		// this special store will auto un-persist a potentially existing savegame
		// but may end up empty if none existing so far
		// the savegame may also be outdated.
		const persistent_store = create_persistent_store(SEC, storage)

		const initial_state = SEC.xTry(`auto creating/migrating`, ({SEC, logger}: OMRContext): State => {
			const recovered_state: any | null = persistent_store.get()

			if (recovered_state) {
				const state = TBRPGState.migrate_to_latest(SEC, recovered_state)
				logger.trace(`[${LIB}] automigrated state.`)
				return state
			}

			const state = TBRPGState.reseed(TBRPGState.create(SEC))
			if (!overrideHook('should_start_with_cloud_sync', false)) {
				// opt out
				// TODO alpha remove this!
				// TODO reducer
				state.u_state.meta.persistence_id = null
			}
			logger.verbose(`[${LIB}] Clean savegame created from scratch.`)
			return state
		})
		logger.silly(`[${LIB}] initial state:`, {state: initial_state})

		// update after auto-migrating/creating
		persistent_store.set(initial_state)

		const in_memory_store = create_in_memory_store(
			SEC,
			initial_state,
			(state: Readonly<State>, debugId: string) => {
				emitter.emit(Event.model_change, `${debugId}[in-mem]`)
			},
		)

		const cloud_store = create_cloud_store(
			SEC,
			local_storage,
			initial_state,
			(new_state: Readonly<State>): void => {
				in_memory_store.set(new_state)
			},
		)

		emitter.on(Event.model_change, (src: string) => {
			app_state = {
				...(app_state as any),
				model: in_memory_store.get(),
			}
			emitter.emit(Event.view_change, `model.${src}`)
		})

		emitter.emit(Event.model_change, `init`)

		function dispatch(action: Action) {
			if (action.type !== 'update_to_now') console.groupEnd()
			;(console.groupCollapsed as any)(`———————————— ⚡ action dispatched: ${action.type} ⚡ ————————————`)
			setTimeout(() => console.groupEnd(), 0)
			const { time, ...debug } = action
			logger.log('⚡ action dispatched:', { action: debug })

			// complete "action" object that may be missing some parts
			action.time = action.time || get_UTC_timestamp_ms()
			const state: State = in_memory_store.get()!
			Object.keys(action.expected_revisions).forEach(sub_state_key => {
				if (action.expected_revisions[sub_state_key] === -1) {
					action.expected_revisions[sub_state_key] =
						(state.u_state as any)[sub_state_key].revision
				}
			})

			in_memory_store.dispatch(action)
			persistent_store.dispatch(action, in_memory_store.get()!)
			cloud_store.dispatch(action, in_memory_store.get()!)
		}

		// currently used by the savegame editor
		function set(new_state: State) {
			// re-force persistence id to null in case s/o played with it in the editor
			// this also double down as a structure check
			new_state.u_state.meta.persistence_id = null
			in_memory_store.set(new_state)
			persistent_store.set(new_state)
			cloud_store.set(new_state)
		}

		const gi = {
			commands: {
				...get_commands(dispatch),
				dispatch,
			},

			queries: {
				...get_queries(in_memory_store),
			},

			model: {
				get: in_memory_store.get,

				set,

				// currently used by the savegame editor
				reset() {
					const new_state = TBRPGState.reseed(TBRPGState.create())
					logger.info('Savegame reseted:', {new_state})

					set(new_state)
				},

				subscribe(id: string, fn: () => void): () => void {
					const unbind = emitter.on(Event.model_change, (src: string) => {
						const { revision } = in_memory_store.get()!.u_state
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
					console.log('⚡ view change requested', changed)
					app_state = {
						...deep_merge(app_state, changed, { arrayMerge: overwriteMerge }),
						model: in_memory_store.get(),
					}
					emitter.emit(Event.view_change, 'set_state(…)')
				},

				subscribe(id: string, fn: () => void): () => void {
					const unbind = emitter.on(Event.view_change, (src: string) => {
						console.log(`🌀🌀 root/view change reported to subscriber "${id}" (model: #${in_memory_store.get()!.u_state.revision}, source: view/${src})`)
						fn()
					})
					return unbind
				},
			},

			_libs: {
				'@tbrpg/state': TBRPGState
			}
		}

		return gi
	})
}

export {
	CreateParams,
	create_game_instance,
}
