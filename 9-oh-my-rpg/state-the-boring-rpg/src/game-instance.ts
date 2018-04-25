/* A helper for actual games using this model
 */

const NanoEvents = require('nanoevents')
const deep_merge = require('deepmerge').default

import { UUID, Element } from '@oh-my-rpg/definitions'
import { CharacterClass } from '@oh-my-rpg/state-character'
import { Item, get_item } from '@oh-my-rpg/state-inventory'

import { State } from './types'
import * as state_fns from './state'
import { migrate_to_latest } from './migrations'
import { SoftExecutionContext } from './sec'
import {Action, ActionCategory} from './serializable_actions'

interface CreateParams<T> {
	SEC: SoftExecutionContext
	get_latest_state: () => State
	update_state: (state: State) => void
	client_state: T
}

function overwriteMerge<T>(destination: T, source: T): T {
	return source
}

function create_game_instance<T>({SEC, get_latest_state, update_state, client_state}: CreateParams<T>) {
	return SEC.xTry('creating tbrpg instance', ({SEC, logger}: any) => {

		(function migrate() {
			SEC.xTry('auto migrating', ({logger}: any) => {
				let state = get_latest_state()

				const was_empty_state = !state || Object.keys(state).length === 0

				state = migrate_to_latest(SEC, state)

				if (was_empty_state) {
					logger.verbose('Clean savegame created from scratch:', {state})
				}
				else {
					logger.trace('migrated state:', {state})
				}

				update_state(state)
			})
		})()

		client_state = client_state || {
			mode: ActionCategory.base,
		}

		const emitter = new NanoEvents()

		// todo .model .view ?
		return {
			play() {
				let state = get_latest_state()
				state = state_fns.play(state)
				update_state(state)
				emitter.emit('state_change', state)
			},
			equip_item(uuid: UUID) {
				let state = get_latest_state()
				state = state_fns.equip_item(state, uuid)
				update_state(state)
				emitter.emit('state_change', state)
			},
			sell_item(uuid: UUID) {
				let state = get_latest_state()
				state = state_fns.sell_item(state, uuid)
				update_state(state)
				emitter.emit('state_change', state)
			},
			rename_avatar(new_name: string) {
				let state = get_latest_state()
				state = state_fns.rename_avatar(state, new_name)
				update_state(state)
				emitter.emit('state_change', state)
			},
			change_avatar_class(new_class: CharacterClass) {
				let state = get_latest_state()
				state = state_fns.change_avatar_class(state, new_class)
				update_state(state)
				emitter.emit('state_change', state)
			},
			reset_all() {
				let state = state_fns.create()
				state = state_fns.reseed(state)
				update_state(state)
				logger.verbose('Savegame reseted:', {state})
				emitter.emit('state_change', state)
			},

			execute_serialized_action(action: Action) {
				let state = get_latest_state()
				state = state_fns.execute(state, action)
				update_state(state)
				emitter.emit('state_change', state)
			},

			get_item(uuid: UUID): Item | null {
				let state = get_latest_state()
				return get_item(state.inventory, uuid)
			},
			appraise_item(uuid: UUID): number {
				let state = get_latest_state()
				return state_fns.appraise_item(state, uuid)
			},
			find_element(uuid: UUID): Element | null {
				let state = get_latest_state()
				return state_fns.find_element(state, uuid)
			},
			get_actions_for_element(uuid: UUID): Action[] {
				let state = get_latest_state()
				return state_fns.get_actions_for_element(state, uuid)
			},

			get_latest_state,
			subscribe(fn: (state: State) => void): () => void {
				const unbind = emitter.on('state_change', fn)
				return unbind
			},

			// allow managing a transient state
			set_client_state(fn: (state: T) => Partial<T>): void {
				const changed = fn(client_state)
				client_state = deep_merge(client_state, changed, {
					arrayMerge: overwriteMerge,
				})
			},
			get_client_state(): T {
				return client_state
			}
		}
	})
}

export {
	CreateParams,
	create_game_instance,
}
