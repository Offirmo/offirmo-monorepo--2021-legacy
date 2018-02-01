import { UUID, Element } from '@oh-my-rpg/definitions'
import { CharacterClass } from '@oh-my-rpg/state-character'
import { Item, get_item } from '@oh-my-rpg/state-inventory'
import * as deep_merge from 'deepmerge'

import { State } from './types'
import * as state_fns from './state'
import { migrate_to_latest } from './migrations'
import { SoftExecutionContext } from './sec'
import {Action, ActionCategory} from "./serializable_actions";

interface CreateParams {
	SEC: SoftExecutionContext
	get_latest_state: () => State
	update_state: (state: State) => void
	client_state: object
}

function overwriteMerge<T>(destination: T, source: T): T {
	return source
}

function create_game_instance({SEC, get_latest_state, update_state, client_state}: CreateParams) {
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

		return {
			play() {
				let state = get_latest_state()
				state = state_fns.play(state)
				update_state(state)
			},
			equip_item(uuid: UUID) {
				let state = get_latest_state()
				state = state_fns.equip_item(state, uuid)
				update_state(state)
			},
			sell_item(uuid: UUID) {
				let state = get_latest_state()
				state = state_fns.sell_item(state, uuid)
				update_state(state)
			},
			rename_avatar(new_name: string) {
				let state = get_latest_state()
				state = state_fns.rename_avatar(state, new_name)
				update_state(state)
			},
			change_avatar_class(new_class: CharacterClass) {
				let state = get_latest_state()
				state = state_fns.change_avatar_class(state, new_class)
				update_state(state)
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
			reset_all() {
				let state = state_fns.create()
				state = state_fns.reseed(state)
				update_state(state)
				logger.verbose('Savegame reseted:', {state})
			},

			get_latest_state,

			set_client_state(fn: Function) {
				const changed = fn(client_state)
				client_state = deep_merge(client_state, changed, {
					arrayMerge: overwriteMerge,
				})
			},
			get_client_state() {
				return client_state
			}
		}
	})
}

export {
	CreateParams,
	create_game_instance,
}
