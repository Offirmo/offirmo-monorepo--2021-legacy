/* A helper for actual games using this model
 */

import EventEmitter from 'emittery'
import deep_merge from 'deepmerge'
import { Enum } from 'typescript-string-enums'

import { UUID } from '@offirmo/uuid'
import { Document } from '@offirmo/rich-text-format'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo/timestamps'

import { Element } from '@oh-my-rpg/definitions'
import { CharacterClass } from '@oh-my-rpg/state-character'
import { Item } from '@oh-my-rpg/state-inventory'
import { PendingEngagement } from "@oh-my-rpg/state-engagement"
import * as PRNGState from '@oh-my-rpg/state-prng'
import { AchievementSnapshot } from '@oh-my-rpg/state-progress'
import {
	Adventure,
	State,
	UState,
	migrate_to_latest,
} from '@tbrpg/state'
import * as state_fns from '@tbrpg/state'
import * as selectors from '@tbrpg/state'

import { SoftExecutionContext } from './sec'
import { Action } from './actions'
import { create as create_in_memory_store } from './stores/in-memory'
import { get_commands } from './commands'
import { get_queries } from './queries'

// tslint:disable-next-line: variable-name
const Event = Enum(
	'model_change',
	'view_change',
)
type Event = Enum<typeof Event> // eslint-disable-line no-redeclar

interface AppState {
	model: State,
}

interface CreateParams<T extends AppState> {
	SEC: SoftExecutionContext
	app_state: T
}

function overwriteMerge<T>(destination: T, source: T): T {
	return source
}

function create_game_instance<T extends AppState>({SEC, app_state}: CreateParams<T>) {
	return SEC.xTry('creating tbrpg instance', ({SEC, logger}: any) => {

		app_state = app_state || ({} as any as T)

		const emitter = new EventEmitter()

		const in_memory_store = create_in_memory_store(
			SEC,
			app_state.model,
			(state: Readonly<State>, debugId: string) => {
				emitter.emit(Event.model_change, `${debugId}[in-mem]`)
			},
		)

		emitter.on(Event.model_change, (src: string) => {
			app_state = {
				...(app_state as any),
				model: in_memory_store.get(),
			}
			emitter.emit(Event.view_change, `model.${src}`)
		})

		function dispatch(action: Action) {
			in_memory_store.dispatch(action)
		}

		const gi = {
			commands: {
				...get_commands(dispatch),
				dispatch(action: Action) {
					action = {
						...action,
						time: action.time || get_UTC_timestamp_ms(),
					}
					dispatch(action)
				}
			},

			queries: {
				...get_queries(in_memory_store),
			},

			model: {
				get: in_memory_store.get,

				// currently used by the savegame editor
				// TODO handle server case
				set: in_memory_store.set,

				// currently used by the savegame editor
				// TODO handle server case
				reset() {
					const new_state = state_fns.reseed(state_fns.create())
					logger.verbose('Savegame reseted:', {new_state})
					in_memory_store.set(new_state)
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
					console.log('⚡ view change requested', changed)
					app_state = {
						...deep_merge(app_state, changed, { arrayMerge: overwriteMerge }),
						model: in_memory_store.get(),
					}
					emitter.emit(Event.view_change, 'set_state(…)')
				},

				subscribe(id: string, fn: () => void): () => void {
					const unbind = emitter.on(Event.view_change, (src: string) => {
						console.log(`🌀🌀 root/view state change reported to subscriber "${id}" (model: #${in_memory_store.get().u_state.revision}, source: view/${src})`)
						fn()
					})
					return unbind
				},
			},

			_libs: {
				'@tbrpg/state': state_fns
			}
		}

		return gi
	})
}

export {
	CreateParams,
	create_game_instance,
}
